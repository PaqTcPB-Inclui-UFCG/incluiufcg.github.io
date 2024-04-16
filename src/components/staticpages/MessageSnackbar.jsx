import React from 'react';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

const MessageSnackbar = ({ open, onClose, message, severity }) => {
  return (
    <Snackbar open={open} autoHideDuration={6000} onClose={onClose}>
      <MuiAlert onClose={onClose} severity={severity} elevation={6} variant="filled">
        {message}
      </MuiAlert>
    </Snackbar>
  );
};

export default MessageSnackbar;
