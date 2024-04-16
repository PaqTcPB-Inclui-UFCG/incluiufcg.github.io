import React, { useRef, useState, useEffect  }  from 'react';
import { Typography,createTheme, Button, Container, ThemeProvider, CssBaseline } from '@mui/material';
import { Link } from 'react-router-dom';
import Header from '../Header'; 
import Footer from '../Footer'; 
import { useHotkeys } from 'react-hotkeys-hook';

 const theme = createTheme({
    typography: {
      fontFamily: [
        'Marko One',
        'sans-serif',
      ].join(','),
    },
  });

const UnauthorizedPage = () => {
  const bodyRef = useRef(null);


  useHotkeys('alt+1', () => {
    if (bodyRef.current) {
      const bodyTop = bodyRef.current.offsetTop;
      if (bodyTop !== undefined && bodyTop !== null) {
        window.scrollTo({ top: bodyTop, behavior: 'smooth' });
      }
    }
  });

  const [highContrast, setHighContrast] = useState();

  const toggleHighContrast = () => {
    setHighContrast(prevHighContrast => !prevHighContrast); 
  };

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
      <div style={{ backgroundColor: highContrast ? "#000000" : '', paddingTop: '4rem', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <Container maxWidth="100%" style={{ textAlign: 'center', marginTop:"-14rem" }}>
    <Typography variant="h4" gutterBottom sx={{ fontWeight: highContrast ?'bold':'normal', color: highContrast ? "#fff": "inherit" }}> 
      Acesso Não Autorizado
    </Typography>
    <Typography variant="body1" paragraph sx={{ fontWeight: highContrast ?'bold':'normal', color: highContrast ? "#fff": "inherit" }}>
      Você não tem permissão para acessar esta página. Por favor, faça login para continuar.
    </Typography>
    <Button variant="contained" color="primary" style={{ background: highContrast ?'#FFFF00' : '#1976d2', fontWeight:'bold', color: highContrast ?'#000000' : '#ffff'}} component={Link} to="/entrar">
      Ir para a página de login
    </Button>
  </Container>
</div>
    <Footer highContrast={highContrast}/>
    </ThemeProvider>
  );
};

export default UnauthorizedPage;
