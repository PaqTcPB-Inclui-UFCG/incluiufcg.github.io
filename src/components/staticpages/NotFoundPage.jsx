import React, { useRef, useState , useEffect } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Footer from '../Footer';
import Header from '../Header';
import { useHotkeys } from 'react-hotkeys-hook';


const theme = createTheme({
  palette: {
    primary: {
      main: '#3f51b5',
    },
    secondary: {
      main: '#f50057',
    },
  },
});

const NotFoundPage = () => {
  const bodyRef = useRef(null);

  const [highContrast, setHighContrast] = useState();
  const toggleHighContrast = () => {
    setHighContrast(prevHighContrast => !prevHighContrast); 
  };


  useHotkeys('alt+1', () => {
    if (bodyRef.current) {
      const bodyTop = bodyRef.current.offsetTop;
      if (bodyTop !== undefined && bodyTop !== null) {
        window.scrollTo({ top: bodyTop, behavior: 'smooth' });
      }
    }
  });

  useEffect(() => {
    const storedHighContrast = localStorage.getItem('highContrast');
    if (storedHighContrast !== null) {
      setHighContrast(storedHighContrast === 'true');
    }
  }, [setHighContrast]);
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Header highContrast={highContrast} setHighContrast={setHighContrast}/>
      <div style={{  backgroundColor: highContrast ? "#000000" : '', minHeight: '100vh' }}>

      <Container>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: 'calc(100vh - 128px)',
            padding: '20px',
          }}
        >
          <Typography variant="h4" gutterBottom sx={{ color: highContrast ? "#FFFF00" : 'inherit'}}>
            Página não encontrada
          </Typography>
          <Typography variant="body1" sx={{ color: highContrast ? "#FFFF00" : 'inherit'}}>
            A página que você está procurando não foi encontrada.
          </Typography>
        </Box>
      </Container>
      </div>
      <Footer highContrast={highContrast}/>
    </ThemeProvider>
  );
};

export default NotFoundPage;
