import React, { useState, useRef, useEffect } from 'react';
import {createTheme , Container, ThemeProvider, CssBaseline, Grid, Paper, Typography, TextField, Button, Box, CircularProgress } from '@mui/material';
import { makeStyles } from '@mui/styles';
import GoogleLogin from '@leecheuk/react-google-login';
import Header from '../Header';
import Footer  from '../Footer';
import axios from 'axios';
import { useHotkeys } from 'react-hotkeys-hook';
import ENDPOINTS from '../../endPoints';

const theme = createTheme({
  typography: {
    fontFamily: [
      'Marko One',
      'sans-serif',
    ].join(','),
  },
});

const useStyles = makeStyles(() => ({
  paper: {
    padding: '2rem',
    maxWidth: 400,
    margin: 'auto',
    marginTop: '2rem',
    borderRadius: '8px',
    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  submitButton: {
    marginTop: '1rem',
  },
  loadingIcon: {
    marginRight: '0.5rem',
  },
  googleButton: {
    marginTop: '0.5rem',
  },
}));

const Login = () => {
  const classes = useStyles();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [redirectToProfile, setRedirectToProfile] = useState(false);
  const bodyRef = useRef(null);

  useHotkeys('alt+1', () => {
    if (bodyRef.current) {
      const bodyTop = bodyRef.current.offsetTop;
      if (bodyTop !== undefined && bodyTop !== null) {
        window.scrollTo({ top: bodyTop, behavior: 'smooth' });
      }
    }
  });

  const handleLoginSuccess = async (token) => {
    sessionStorage.setItem('token', token);
    setLoading(true);
    
    try {
      await handleLoginSuccess(token);
      const userResponse = await axios.get(ENDPOINTS.users.getUserByEmail(email), {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      sessionStorage.setItem('userId', userResponse.data.id);
      sessionStorage.setItem('fullName', userResponse.data.fullName);
      window.location.href = '/meu-perfil';

    } catch (error) {
      console.error('Erro ao fazer login:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(ENDPOINTS.auth.login, {
        login: email,
        password: password
      });
      const token = response.data.token;
      await handleLoginSuccess(token);
    } catch (error) {
      console.error('Erro ao fazer login:', error);
    } finally {
      setLoading(false);
    }

  };
  const handleGoogleLoginSuccess = (response) => {
    console.log('Google Login Success:', response);
  };

  const handleGoogleLoginFailure = (error) => {
    console.error('Google Login Failure:', error);
  };

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
      <div ref={bodyRef} style={{backgroundColor: highContrast ? "#000000" : '', minHeight: '100vh'}}>
      <Container sx={{minHeight: 'calc(100vh - 128px)', backgroundColor: highContrast ? "#000000" : ''}}>
    <Paper className={classes.paper} elevation={3} sx={{backgroundColor: highContrast ? "#000000" : ''}}>
      <Typography variant="h4" align="center" gutterBottom sx={{ color: highContrast ? "#FFFF00" : 'inherit'}}>
        Login
      </Typography>
      <form className={classes.form} onSubmit={handleSubmit}>
        <TextField
          label="Email"
          type="email"
          variant="outlined"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          InputLabelProps={{
            sx: { color: highContrast ? "#0000000" : 'inherit', background:highContrast ? "#FFFF00" : 'inherit', fontWeight: highContrast ? "bold": "normal" }
          }}
          sx={{
            '& fieldset': {
              borderColor: highContrast ? "#FFFF00" : '',
              borderWidth: '0.2rem' 

            }
          }}
        />
        <TextField
          label="Senha"
          type="password"
          variant="outlined"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          InputLabelProps={{
            sx: { color: highContrast ? "#0000000" : 'inherit', background:highContrast ? "#FFFF00" : 'inherit', fontWeight: highContrast ? "bold": "normal" }
          }}
          sx={{
            '& fieldset': {
              borderColor: highContrast ? "#FFFF00" : '',
              borderWidth: '0.2rem' 
            }
          }}
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          size="large"
          className={classes.submitButton}
          disabled={loading}
          sx={{
            backgroundColor: highContrast ? '#FFFF00' : '#1976d2', 
            color: highContrast ? '#000000' : '#fff', 
            fontWeight: 'bold' , 
            '&:hover': {
              backgroundColor: highContrast ? '#FFFF00' : '#0d56a6', 
            }
          }}
        >
          {loading && <CircularProgress size={24} className={classes.loadingIcon} />}
          Entrar
        </Button>
      </form>
      {/* <Box mt="1rem">
        <GoogleLogin
          clientId="1033116270710-vrfnlivmigjjg72s15lhou349kanitsc.apps.googleusercontent.com"
          onSuccess={handleGoogleLoginSuccess}
          onFailure={handleGoogleLoginFailure}
          render={(renderProps) => (
            <Button
              variant="contained"
              color="secondary"
              size="large"
              fullWidth
              className={classes.googleButton}
              onClick={renderProps.onClick}
              disabled={renderProps.disabled}
            >
              Entrar com Google
            </Button>
          )}
        />
      </Box> */}
    </Paper>    
    </Container>    
    </div>
    <Footer highContrast={highContrast}/>
    </ThemeProvider>
  );
};

export default Login;
