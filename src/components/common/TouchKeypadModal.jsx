import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import BackspaceIcon from '@mui/icons-material/Backspace';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import KeyboardIcon from '@mui/icons-material/Keyboard';

export default function TouchKeypadModal({ 
  open, 
  onClose, 
  title = "Touch Keypad", 
  initialValue = "", 
  onConfirm,
  placeholder = "e.g. 1-3, 5",
  maxPages = 20
}) {
  const [value, setValue] = useState(initialValue || "");

  const handleKeyClick = (key) => {
    setValue(prev => prev + key);
  };

  const handleBackspace = () => {
    setValue(prev => prev.slice(0, -1));
  };

  const handleClear = () => {
    setValue("");
  };

  const handleApply = () => {
    onConfirm(value.trim());
    onClose();
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="xs" 
      fullWidth
      PaperProps={{
        style: {
          borderRadius: '24px',
          padding: '16px',
          boxShadow: '0 20px 50px rgba(0,0,0,0.25)'
        }
      }}
    >
      <DialogTitle className="d-flex align-items-center justify-content-between p-2 pb-0">
        <div className="d-flex align-items-center gap-2">
          <div className="p-2 rounded-circle bg-primary-subtle text-primary">
            <KeyboardIcon style={{ fontSize: 22 }} />
          </div>
          <div>
            <h6 className="fw-bold mb-0 text-dark">{title}</h6>
            <small className="text-muted">Touch input for kiosk display</small>
          </div>
        </div>
        <Button onClick={onClose} style={{ minWidth: 36, color: '#64748B' }}>
          <CloseIcon />
        </Button>
      </DialogTitle>

      <DialogContent className="p-2 mt-2">
        {/* Input Display Box */}
        <div 
          className="p-3 rounded-3 bg-light border text-center mb-3"
          style={{ minHeight: '64px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <span className="fw-extrabold text-dark" style={{ fontSize: '1.4rem', letterSpacing: '0.08em' }}>
            {value || <span className="text-muted opacity-50" style={{ fontSize: '1.1rem' }}>{placeholder}</span>}
          </span>
        </div>

        {/* Quick Range Shortcuts */}
        <div className="d-flex gap-2 justify-content-center mb-3">
          <button 
            type="button" 
            className="btn btn-outline-secondary btn-sm px-2 py-1 rounded-pill small"
            onClick={() => setValue("1")}
          >
            Page 1 Only
          </button>
          <button 
            type="button" 
            className="btn btn-outline-secondary btn-sm px-2 py-1 rounded-pill small"
            onClick={() => setValue(`1-${Math.min(3, maxPages)}`)}
          >
            Pages 1-3
          </button>
          <button 
            type="button" 
            className="btn btn-outline-secondary btn-sm px-2 py-1 rounded-pill small"
            onClick={() => setValue(`1-${maxPages}`)}
          >
            All ({maxPages})
          </button>
        </div>

        {/* Grid of Big Touch Keys */}
        <div className="d-grid gap-2" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map(digit => (
            <button
              key={digit}
              type="button"
              className="btn btn-light border py-3 fw-bold"
              style={{ fontSize: '1.4rem', borderRadius: '14px', background: '#FFFFFF', boxShadow: '0 2px 4px rgba(0,0,0,0.04)' }}
              onClick={() => handleKeyClick(digit)}
            >
              {digit}
            </button>
          ))}
          <button
            type="button"
            className="btn btn-light border py-3 fw-bold text-primary"
            style={{ fontSize: '1.3rem', borderRadius: '14px' }}
            onClick={() => handleKeyClick('-')}
            title="Range dash (-)"
          >
            –
          </button>
          <button
            type="button"
            className="btn btn-light border py-3 fw-bold"
            style={{ fontSize: '1.4rem', borderRadius: '14px' }}
            onClick={() => handleKeyClick('0')}
          >
            0
          </button>
          <button
            type="button"
            className="btn btn-light border py-3 fw-bold text-primary"
            style={{ fontSize: '1.3rem', borderRadius: '14px' }}
            onClick={() => handleKeyClick(',')}
            title="Separator comma (,)"
          >
            ,
          </button>
        </div>

        {/* Action Row: Clear, Backspace */}
        <div className="d-flex gap-2 mt-2">
          <button
            type="button"
            className="btn btn-outline-danger flex-grow-1 py-2 fw-semibold"
            style={{ borderRadius: '12px' }}
            onClick={handleClear}
          >
            Clear
          </button>
          <button
            type="button"
            className="btn btn-outline-secondary flex-grow-1 py-2 fw-semibold d-flex align-items-center justify-content-center gap-1"
            style={{ borderRadius: '12px' }}
            onClick={handleBackspace}
          >
            <BackspaceIcon style={{ fontSize: 18 }} />
            <span>Delete</span>
          </button>
        </div>
      </DialogContent>

      <DialogActions className="p-2 pt-0 d-flex justify-content-between">
        <Button onClick={onClose} color="inherit" className="fw-bold">
          Cancel
        </Button>
        <button
          type="button"
          className="btn btn-kiosk-primary px-4 py-2"
          onClick={handleApply}
          style={{ height: '48px', fontSize: '1rem', minWidth: '150px' }}
        >
          <CheckIcon style={{ marginRight: 6 }} />
          <span>Apply</span>
        </button>
      </DialogActions>
    </Dialog>
  );
}
