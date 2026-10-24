import random
import time
import datetime

class PaymentGateway:
    """
    Manages kiosk digital payments, UPI dynamic QR generation,
    order settlement tracking, and transaction logging.
    """

    def __init__(self):
        self.orders = {}
        self.vpa = 'smartprint.kiosk@icici'
        self.payee_name = 'SmartPrintAI'

    def create_order(self, amount, doc_name="Document", pages=1, copies=1):
        """
        Creates a new payment order and constructs a standard UPI payment URI.
        """
        order_id = f"ORD-SP-{random.randint(100000, 999999)}"
        created_at = datetime.datetime.now().isoformat()
        
        # Standard UPI intent URI for BharatQR / Google Pay / PhonePe / Paytm / BHIM
        safe_amount = f"{float(amount):.2f}"
        upi_string = f"upi://pay?pa={self.vpa}&pn={self.payee_name}&am={safe_amount}&cu=INR&tn=KioskPrint_{order_id}"

        order_data = {
            'orderId': order_id,
            'amount': safe_amount,
            'currency': 'INR',
            'status': 'AWAITING_PAYMENT',
            'upiString': upi_string,
            'docName': doc_name,
            'pages': pages,
            'copies': copies,
            'createdAt': created_at,
            'expiresInSeconds': 300,
            'transactionRef': None,
            'paidAt': None,
            'paymentMethod': None,
            'errorMessage': None
        }

        self.orders[order_id] = order_data
        return order_data

    def get_order_status(self, order_id):
        """Returns the current status of the order."""
        return self.orders.get(order_id)

    def mark_success(self, order_id, method='UPI (Google Pay / PhonePe / Paytm / BHIM)'):
        """Marks the payment order as completed and verified."""
        order = self.orders.get(order_id)
        if not order:
            return None

        txn_ref = f"UPI-TXN-{random.randint(100000000000, 999999000000)}"
        order['status'] = 'SUCCESS'
        order['transactionRef'] = txn_ref
        order['paidAt'] = datetime.datetime.now().isoformat()
        order['paymentMethod'] = method
        order['errorMessage'] = None
        return order

    def mark_failed(self, order_id, reason="Bank server timeout or transaction cancelled"):
        """Marks the payment order as failed."""
        order = self.orders.get(order_id)
        if not order:
            return None

        order['status'] = 'FAILED'
        order['errorMessage'] = reason
        return order

# Singleton instance for kiosk lifecycle
payment_gateway = PaymentGateway()
