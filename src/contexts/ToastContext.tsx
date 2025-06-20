import React, { createContext, useContext, useState, useCallback } from 'react';
import { Alert, Snackbar } from '@mui/material';

type ToastType = 'success' | 'error' | 'info' | 'warning';

type Toast = {
  message: string;
  type: ToastType;
  duration?: number;
};

type ToastContextType = {
  showToast: (toast: Toast) => void;
  hideToast: () => void;
};

const ToastContext = createContext<ToastContextType | undefined>(undefined);

type ToastProviderProps = {
  children: React.ReactNode;
};

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  const [open, setOpen] = useState(false);
  const [currentToast, setCurrentToast] = useState<Toast | null>(null);

  const showToast = useCallback((toast: Toast) => {
    setCurrentToast(toast);
    setOpen(true);
  }, []);

  const hideToast = useCallback(() => {
    setOpen(false);
  }, []);

  const handleClose = useCallback((_event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast, hideToast }}>
      {children}
      {currentToast && (
        <Snackbar
          open={open}
          autoHideDuration={currentToast.duration || 5000}
          onClose={handleClose}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert
            onClose={handleClose}
            severity={currentToast.type}
            variant="filled"
            sx={{ width: '100%' }}
          >
            {currentToast.message}
          </Alert>
        </Snackbar>
      )}
    </ToastContext.Provider>
  );
};

export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
