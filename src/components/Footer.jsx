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
    <Box component="footer" sx={{ bgcolor: highContrast ? '#000000' : '#FAFAFB', py: 3, textAlign: 'center' }}>
      <Typography variant="body1" color="textSecondary" style={{ color: highContrast ? '#FFFF00' : '#bdbdbd' }}>
        &copy; 2024 - Adaptare - UFCG. Todos os direitos reservados.
      </Typography>
      <VLibras forceOnload={true}/>
    </Box>
  );
}

export default Footer;
