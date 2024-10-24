import React from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { useHotkeys } from 'react-hotkeys-hook';
import VLibras from '@moreiraste/react-vlibras'

function Footer({ highContrast }) {
  useHotkeys('alt+4', () => {
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
  });
  return (
    <Box component="footer" sx={{ bgcolor: highContrast ? '#050834' : '#FAFAFB', py: 3, textAlign: 'center' }}>
      <Typography variant="body1" color="textSecondary" style={{ color: highContrast? "rgba(255,255,255, 0.9)" : 'rgba(92, 105, 114, 0.9)', fontWeight: highContrast ? "bold": "normal" }}>
        &copy; 2024 - IncluiUFCG - UFCG. Todos os direitos reservados.
      </Typography>
    </Box>
  );
}

export default Footer;
