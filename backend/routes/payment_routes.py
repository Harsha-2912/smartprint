from flask import Blueprint, request, jsonify
from services.payment_gateway import payment_gateway

payment_bp = Blueprint('payments', __name__)

@payment_bp.route('/create-order', methods=['POST'])
def create_order():
    """
    Creates a new payment order and constructs dynamic UPI payload.
    """
    data = request.get_json() or {}
    amount = data.get('totalAmount') or data.get('amount') or 2.00
    doc_name = data.get('documentName', 'Document')
    pages = data.get('pages', 1)
    copies = data.get('copies', 1)

    order = payment_gateway.create_order(
        amount=amount,
        doc_name=doc_name,
        pages=pages,
        copies=copies
    )

    return jsonify({
        'success': True,
        'orderId': order['orderId'],
        'upiString': order['upiString'],
        'amount': order['amount'],
        'currency': order['currency'],
        'status': order['status'],
        'expiresInSeconds': order['expiresInSeconds']
    })

@payment_bp.route('/<order_id>/status', methods=['GET'])
def get_status(order_id):
    """
    Kiosk polls this endpoint or receives webhook payment confirmation.
    """
    order = payment_gateway.get_order_status(order_id)
    if not order:
        return jsonify({'success': False, 'error': 'Order not found'}), 404

    return jsonify({
        'success': True,
        'orderId': order['orderId'],
        'status': order['status'],
        'transactionRef': order.get('transactionRef'),
        'paidAt': order.get('paidAt'),
        'errorMessage': order.get('errorMessage')
    })

@payment_bp.route('/<order_id>/simulate', methods=['POST'])
def simulate_payment(order_id):
    """
    Simulates instantaneous bank payment confirmation or failure for testing.
    """
    data = request.get_json() or {}
    outcome = data.get('outcome', 'SUCCESS').upper()

    if outcome == 'SUCCESS':
        updated = payment_gateway.mark_success(order_id)
        if not updated:
            return jsonify({'success': False, 'error': 'Order not found'}), 404
        return jsonify({
            'success': True,
            'orderId': updated['orderId'],
            'transactionRef': updated['transactionRef'],
            'amount': updated['amount'],
            'status': updated['status'],
            'paidAt': updated['paidAt'],
            'paymentMethod': updated['paymentMethod'],
            'demoMode': True
        })
    else:
        reason = data.get('errorMessage', 'Bank server timeout or transaction cancelled')
        updated = payment_gateway.mark_failed(order_id, reason)
        if not updated:
            return jsonify({'success': False, 'error': 'Order not found'}), 404
        return jsonify({
            'success': False,
            'orderId': updated['orderId'],
            'status': updated['status'],
            'errorCode': 'BANK_TIMEOUT_OR_USER_DECLINED',
            'errorMessage': updated['errorMessage'],
            'demoMode': True
        })

@payment_bp.route('/webhook', methods=['POST'])
def payment_webhook():
    """
    Standard webhook handler for UPI Payment Gateway (Razorpay, Cashfree, BharatPe).
    """
    data = request.get_json() or {}
    order_id = data.get('orderId') or data.get('order_id')
    status = (data.get('status') or data.get('event', '')).upper()

    if not order_id:
        return jsonify({'success': False, 'error': 'Missing orderId'}), 400

    if 'SUCCESS' in status or 'CAPTURED' in status or 'PAID' in status:
        method = data.get('paymentMethod', 'UPI Webhook (Verified Bank Transfer)')
        updated = payment_gateway.mark_success(order_id, method=method)
        if not updated:
            return jsonify({'success': False, 'error': 'Order not found'}), 404
        return jsonify({'success': True, 'order': updated})
    else:
        reason = data.get('reason', 'Payment failed via webhook')
        updated = payment_gateway.mark_failed(order_id, reason=reason)
        return jsonify({'success': False, 'order': updated})

