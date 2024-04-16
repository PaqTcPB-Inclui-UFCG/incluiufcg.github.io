import React, { useState, useRef, useEffect } from 'react';
import { createTheme, IconButton, TextField, Container, ThemeProvider, CssBaseline, Paper, Typography, Button, CircularProgress } from '@mui/material';
import { makeStyles } from '@mui/styles';
import GoogleLogin from '@leecheuk/react-google-login';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import Header from './Header';
import Footer from './Footer';
import { useHotkeys } from 'react-hotkeys-hook';
import axios from 'axios';


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

const theme = createTheme({
  typography: {
    fontFamily: [
      'Marko One',
      'sans-serif',
    ].join(','),
  },
});

const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePassword = (password) => {
  const errors = [];

  const regexUpperCase = /.*[A-Z].*/;
  const regexLowerCase = /.*[a-z].*/;
  const regexNumber = /[^\d]*\d+[^\d]*/;
  const regexSpecialCharacter = /.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?].*/;
  const regexSimpleSequences = /.*(123|234|345|456|567|678|789).*/;

  if (password.length < 8) {
    errors.push("A senha deve ter no mínimo 8 caracteres");
  }
  if (!regexUpperCase.test(password) || !regexLowerCase.test(password)) {
    errors.push("A senha deve incluir pelo menos uma letra maiúscula e uma minúscula");
  }
  if (!regexNumber.test(password)) {
    errors.push("A senha deve incluir pelo menos um número");
  }
  if (!regexSpecialCharacter.test(password)) {
    errors.push("A senha deve incluir pelo menos um caractere especial");
  }
  if (regexSimpleSequences.test(password)) {
    errors.push("A senha não pode incluir sequências simples de caracteres");
  }

  return errors;
};

const Signup = () => {
  const classes = useStyles();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState([]);
  const [highContrast, setHighContrast] = useState();
  const [showPassword, setShowPassword] = useState(false); 
  const [passwordsMatch, setPasswordsMatch] = useState(false);
  const [confirmNewPassword, setConfirmNewPassword] = useState('');


  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleHighContrast = () => {
    setHighContrast(prevHighContrast => !prevHighContrast); 
  };

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  
    if (name === 'confirmPassword') {
      setPasswordsMatch(value === formData.password);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
  
    const emailErrors = isValidEmail(formData.email) ? [] : ['O email inserido é inválido'];
    const passwordErrors = validatePassword(formData.password);
    const confirmPasswordError = formData.password !== formData.confirmPassword ? ['As senhas não correspondem'] : [];
  
    if (emailErrors.length > 0 || passwordErrors.length > 0 || confirmPasswordError.length > 0) {
      setErrors([...emailErrors, ...passwordErrors, ...confirmPasswordError]);
      setLoading(false);
      return;
    }
  
    const userData = {
      login: formData.email,
      password: formData.password,
      firstName: formData.firstName,
      lastName: formData.lastName,
      role: "USER"
    };
  
    try {
      const response = await fetch('http://localhost:8081/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
  
      if (!response.ok) {
        throw new Error('Erro ao cadastrar usuário');
      }
  
      console.log('Usuário cadastrado com sucesso');
    } catch (error) {
      console.error('Erro ao cadastrar usuário:', error.message);
    } finally {
      setLoading(false);
      await handleLogin(formData.email, formData.password);

    }
  };

  const handleLogin = async (email, password) => {
    localStorage.clear();
    try {
      const response = await axios.post('http://localhost:8081/auth/login', {
        login: email,
        password: password
      });

      const token = response.data.token;

      sessionStorage.setItem('token', token);
      const userResponse = await axios.get(`http://localhost:8081/users/userByEmail=${email}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      sessionStorage.setItem('userId', userResponse.data.id);
      sessionStorage.setItem('fullName', userResponse.data.fullName);
      window.location.href = '/meu-perfil';
    } catch (error) {
      console.error('Erro ao fazer login:', error);
    }
  };
  

  const bodyRef = useRef(null);
  useHotkeys('alt+1', () => {
    if (bodyRef.current) {
      const bodyTop = bodyRef.current.offsetTop;
      if (bodyTop !== undefined && bodyTop !== null) {
        window.scrollTo({ top: bodyTop, behavior: 'smooth' });
      }
    }
  });

  const handleGoogleSignupSuccess = (response) => {
    console.log('Google Signup Success:', response);
    setLoading(false);
  };

  const handleGoogleSignupFailure = (error) => {
    console.error('Google Signup Failure:', error);
    setLoading(false);
  };

  const handleGoogleSignupClick = (renderProps) => {
    setLoading(true);
    renderProps.onClick();
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
      <Container maxWidth="md" style={{ padding: '2rem', marginBottom: '2rem' }}>
        <Paper elevation={3} style={{ padding: '2rem', borderRadius: '10px', backgroundColor: highContrast ? "#000000" : '' }}>
          <Typography variant="h4" align="center" gutterBottom>
            Cadastro</Typography>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width:"100%" }}>
            <TextField
              label="Nome"
              type="text"
              name="firstName"
              variant="outlined"
              value={formData.firstName}
              onChange={handleChange}
              required
              style={{ marginBottom: '1rem',  background: highContrast ? "#fff" : ''  }}
            InputLabelProps={{
              sx: { color: highContrast ? "#0000000" : 'inherit', background:highContrast ? "#FFFF00" : 'inherit', fontWeight: highContrast ? "bold": "normal" }
            }}
            sx={{
              '& fieldset': {
                borderColor: highContrast ? "#FFFF00" : '',
                borderWidth: '0.2rem' 
  
              },
              width: '60%',
              marginTop: "1rem"
            }}
            /> 
            <TextField
              label="Sobrenome"
              type="text"
              name="lastName"
              variant="outlined"
              value={formData.lastName}
              onChange={handleChange}
              required
              style={{ marginBottom: '1rem',  background: highContrast ? "#fff" : ''  }}
            InputLabelProps={{
              sx: { color: highContrast ? "#0000000" : 'inherit', background:highContrast ? "#FFFF00" : 'inherit', fontWeight: highContrast ? "bold": "normal" }
            }}
            sx={{
              '& fieldset': {
                borderColor: highContrast ? "#FFFF00" : '',
                borderWidth: '0.2rem' 
  
              },
              width: '60%',
            }}
            />
            <TextField
              label="Email"
              type="email"
              name="email"
              variant="outlined"
              value={formData.email}
              onChange={handleChange}
              required
              style={{ marginBottom: '1rem',  background: highContrast ? "#fff" : ''  }}
              InputLabelProps={{
                sx: { color: highContrast ? "#0000000" : 'inherit', background:highContrast ? "#FFFF00" : 'inherit', fontWeight: highContrast ? "bold": "normal" }
              }}
              sx={{
                '& fieldset': {
                  borderColor: highContrast ? "#FFFF00" : '',
                  borderWidth: '0.2rem' 
    
                },
                width: '60%',
              }}
            />
            <TextField
              label="Senha"
              type={showPassword ? 'text' : 'password'} 
              name="password"
              variant="outlined"
              value={formData.password}
              onChange={handleChange}
              required
              InputProps={{
                endAdornment: (
                  <IconButton
                    onClick={togglePasswordVisibility}
                    edge="end"
                  >
                    {showPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                ),
              }}
              style={{ marginBottom: '1rem',  background: highContrast ? "#fff" : ''  }}
            InputLabelProps={{
              sx: { color: highContrast ? "#0000000" : 'inherit', background:highContrast ? "#FFFF00" : 'inherit', fontWeight: highContrast ? "bold": "normal" }
            }}
            sx={{
              '& fieldset': {
                borderColor: highContrast ? "#FFFF00" : '',
                borderWidth: '0.2rem' 
  
              },
              width: '60%',
            }}
            />
            <TextField
              label="Confirme a Senha"
              type={showPassword ? 'text' : 'password'} 
              name="confirmPassword"
              variant="outlined"
              onChange={handleChange}
              error={!passwordsMatch && confirmNewPassword.length > 0}
              helperText={!passwordsMatch && confirmNewPassword.length > 0 && "As senhas estão diferentes"}
              value={formData.confirmPassword}
              required
              style={{ marginBottom: '1rem',  background: highContrast ? "#fff" : ''  }}
            InputLabelProps={{
              sx: { color: highContrast ? "#0000000" : 'inherit', background:highContrast ? "#FFFF00" : 'inherit', fontWeight: highContrast ? "bold": "normal" }
            }}
            sx={{
              '& fieldset': {
                borderColor: highContrast ? "#FFFF00" : '',
                borderWidth: '0.2rem' 
  
              },
              width: '60%',
            }}
            />
            {errors.length > 0 && (
              <div style={{ marginBottom: '1rem', color: 'red' }}>
                {errors.map((error, index) => (
                  <p key={index}>{error}</p>
                ))}
              </div>
            )}
            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="large"
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
              {loading && <CircularProgress size={24} style={{ marginRight: '8px' }} />}
              Cadastrar
            </Button>
          </form>
          {/* </Typography>
        <Typography variant="body1" paragraph>
          Cadastre-se usando sua conta do Google.
        </Typography>
        <GoogleLogin
          clientId="seu-client-id-do-google"
          onSuccess={handleGoogleSignupSuccess}
          onFailure={handleGoogleSignupFailure}
          render={(renderProps) => (
            <Button
              variant="contained"
              color="secondary"
              size="large"
              fullWidth
              className={classes.googleButton}
              onClick={() => handleGoogleSignupClick(renderProps)}
              disabled={renderProps.disabled || loading} 
            >
              {loading ? <CircularProgress size={24} className={classes.loadingIcon} /> : 'Cadastrar com Google'}
            </Button>
          )} */}
          {/* /> */}
        </Paper>
      </Container>
      </div>
      <Footer highContrast={highContrast} />
    </ThemeProvider>
  );
};

export default Signup;
