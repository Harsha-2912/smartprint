import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

export default function ConfirmationDialog({
  open,
  title = 'Are you sure?',
  message = 'Your current session data will be cleared.',
  confirmLabel = 'Yes, Proceed',
  cancelLabel = 'Go Back',
  onConfirm,
  onCancel,
  severity = 'warning'
}) {
  const isDestructive = severity === 'danger' || severity === 'warning';

  return (
    <Dialog 
      open={open} 
      onClose={onCancel}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        style: { borderRadius: '20px', padding: '0.75rem' }
      }}
    >
      <DialogTitle className="d-flex align-items-center gap-2 pb-1">
        <div 
          style={{
            width: 40,
            height: 40,
            borderRadius: '50%',
            background: isDestructive ? '#FFF1F2' : '#EFF6FF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: isDestructive ? '#F43F5E' : '#2563EB'
          }}
        >
          <WarningAmberIcon />
        </div>
        <span style={{ fontWeight: 700, fontSize: '1.2rem', color: '#172033' }}>
          {title}
        </span>
      </DialogTitle>

      <DialogContent>
        <p className="text-secondary mb-0" style={{ fontSize: '0.95rem', lineHeight: 1.5 }}>
          {message}
        </p>
      </DialogContent>

      <DialogActions className="px-3 pb-2 pt-1 gap-2">
        <Button 
          onClick={onCancel}
          variant="outlined"
          sx={{ 
            height: 48, 
            borderRadius: '12px', 
            fontWeight: 600, 
            color: '#64748B', 
            borderColor: '#CBD5E1' 
          }}
        >
          {cancelLabel}
        </Button>
        <Button 
          onClick={onConfirm}
          variant="contained"
          sx={{ 
            height: 48, 
            borderRadius: '12px', 
            fontWeight: 700,
            bgcolor: isDestructive ? '#F43F5E' : 'var(--sp-primary)',
            '&:hover': {
              bgcolor: isDestructive ? '#E11D48' : '#1D4ED8'
            }
          }}
        >
          {confirmLabel}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
