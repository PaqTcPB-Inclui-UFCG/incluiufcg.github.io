import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Paper, IconButton , Typography, Avatar, Box, CircularProgress, createTheme, ThemeProvider, Button, TextField, Container,  Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import Header from '../Header';
import Footer from '../Footer';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { useHotkeys } from 'react-hotkeys-hook';
import ENDPOINTS from '../../endPoints';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2', 
    },
    secondary: {
      main: '#f50057', 
    },
  },
});

const isValidEmail = (email) => {
  const emailRegex = /^[a-zA-Z0-9_+&*-]+(?:\.[a-zA-Z0-9_+&*-]+)*@(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,7}$/;
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


const UserProfile = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editedUserData, setEditedUserData] = useState(null);
  const [newProfilePic, setNewProfilePic] = useState(null);
  const fullName = sessionStorage.getItem('FullName') || '';
  const [openChangePasswordDialog, setOpenChangePasswordDialog] = useState(false);
  const [showPassword, setShowPassword] = useState(false); 
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [passwordsMatch, setPasswordsMatch] = useState(false);
  const [errorSnackbarOpen, setErrorSnackbarOpen] = useState(false);
  const [errorMessages, setErrorMessages] = useState([]);
  const [currentPassword, setCurrentPassword] = useState(''); 
  const [passwordChanged, setPasswordChanged] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

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


  const handleSaveChanges = async () => {
    const isValid = isValidEmail(editedUserData.login);
    if (editedUserData.login && !isValid) {
      alert('Email inválido');
      return;
    }
  
    try {
      const user_id = sessionStorage.getItem('userId');
      const token = sessionStorage.getItem('token');
  
      if (!user_id || !token) {
        handleOpenErrorSnackbar(['Usuário ou token não encontrados']);
        return;
      }
  
      const response = await axios.patch(ENDPOINTS.users.updateUser(user_id), {
        firstName: editedUserData.firstName,
        lastName: editedUserData.lastName,
        login: editedUserData.login
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
  
      if (response && response.status === 200) {
        alert('Alterações salvas com sucesso!');
        const newFullName = editedUserData.firstName + " " + editedUserData.lastName;
        sessionStorage.setItem('FullName', newFullName); 
      } else {
        handleOpenErrorSnackbar(['Ocorreu um erro ao salvar as alterações']);
      }
    } catch (error) {
      console.error('Erro ao salvar as alterações:', error);
      if (error.response && error.response.data && error.response.data.message) {
        handleOpenErrorSnackbar(['Ocorreu um erro ao salvar as alterações: ' + error.response.data.message]);
      } else {
        handleOpenErrorSnackbar(['Ocorreu um erro ao salvar as alterações']);
      }
    }
  };

  useEffect(() => {
    const storedHighContrast = localStorage.getItem('highContrast');
    if (storedHighContrast !== null) {
      setHighContrast(storedHighContrast === 'true');
    }
  }, [setHighContrast]);
  

  useEffect(() => {
    const storedImage = localStorage.getItem('profilePic');
    if (storedImage) {
      setNewProfilePic();
    }

    const token = sessionStorage.getItem('token');
    if (!token) {
      window.location.href ='/entrar';
    }

    const getUser = async () => {
      try {
        const user_id = sessionStorage.getItem('userId');
        if (!token) {
          console.error('Token não encontrado na sessionStorage.');
          return;
        }
        const response = await axios.get(ENDPOINTS.users.getUser(user_id), {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setUserData(response.data);
        sessionStorage.setItem('role', response.data.role);
        sessionStorage.setItem('user_id', response.data.id);
        sessionStorage.setItem('profilePic', response.data.photo);
      } catch (error) {
        handleOpenErrorSnackbar(['Erro ao obter dados do usuário']);
      } finally {
        setLoading(false);
      }
    };

    getUser();
  }, []);

  useEffect(() => {
    if (newPassword === confirmNewPassword) {
      setPasswordsMatch(true);
    } else {
      setPasswordsMatch(false);
    }
  }, [newPassword, confirmNewPassword]);

  useEffect(() => {
    handleEditPhoto();
    
  }, [selectedFile]); 

  const handleEditPhoto = async () => {
    if (selectedFile) {
      const updatedUserData = { ...userData, photoURL: newProfilePic };
        setUserData(updatedUserData);

      try {
        const user_id = sessionStorage.getItem('userId');
        const token = sessionStorage.getItem('token');
        console.log(user_id, token, selectedFile);
        console.log(newProfilePic);
    
        if (!user_id || !token || !selectedFile) {
          console.error('Usuário, token ou foto não encontrados.');
          return;
        }

        const base64Image = await convertToBase64(selectedFile);
    
        const formData = new FormData();
        formData.append('photo', selectedFile);
    
        const response = await axios.post(ENDPOINTS.users.uploadPhoto(user_id), {
          photo: base64Image
        }, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
        if(response.status === 200){
          localStorage.setItem('profilePic',`data:image/jpeg;base64,${response.data.photo}`)
          console.log('Resposta da requisição:', response.data);
          alert("Foto atualizada com sucesso!");
          window.location.reload();

        }
      } catch (error) {
        console.error('Erro ao enviar a foto:', error);
      }
    }
  };
  
  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result.split(',')[1]);
      reader.onerror = error => reject(error);
    });
  };

  const handleEditPassword = () => {
    setOpenChangePasswordDialog(true);
  };

  const handlePasswordChange = async () => {
    try {

      const errors = validatePassword(newPassword);
      if (errors.length > 0) {
        handleOpenErrorSnackbar(errors);
        return;
      }
  
      const user_id = sessionStorage.getItem('userId');
      const token = sessionStorage.getItem('token');
  
      if (!user_id || !token) {
        handleOpenErrorSnackbar(['Usuário ou token não encontrados']);
        return;
      }
  
      const response = await axios.patch(ENDPOINTS.users.changePassword(user_id), {
        newPassword: newPassword,
        currentPassword: currentPassword
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
  
      if (response && response.status === 200) {
        setOpenChangePasswordDialog(false);
        setPasswordChanged(true);
      } else {
        handleOpenErrorSnackbar(['Ocorreu um erro ao alterar a senha']);
      }
    } catch (error) {
      console.error('Erro ao alterar a senha:', error);
      if (error.response && error.response.data && error.response.data.message) {
        handleOpenErrorSnackbar(['Ocorreu um erro ao alterar a senha: ' + error.response.data.message]);
      } else {
        handleOpenErrorSnackbar(['Ocorreu um erro ao alterar a senha']);
      }
    }
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);

  };
  
  
  const handleOpenErrorSnackbar = (errorMessages) => {
    setErrorMessages(errorMessages);
    setErrorSnackbarOpen(true);
  };
  

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleCloseChangePasswordDialog = () => {
    setOpenChangePasswordDialog(false);
  };


  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedUserData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };
  const handleCloseErrorSnackbar = () => {
    setErrorSnackbarOpen(false);
  };


  if (loading) {
    return <CircularProgress />;
  }

  return (
    <ThemeProvider theme={theme}>
        <Header highContrast={highContrast} setHighContrast={setHighContrast}/>
      <div ref={bodyRef} style={{backgroundColor: highContrast ? "#000000" : '', minHeight: '100vh'}}>
      <Container maxWidth="md" style={{ padding: '2rem', marginBottom: '2rem' }}>
        <Paper elevation={3} style={{ padding: '2rem', borderRadius: '10px', backgroundColor: highContrast ? "#000000" : '' }}>
          <Typography variant="h5" gutterBottom style={{ marginBottom: '1rem', textAlign: 'center' }}>
            Dados do Usuário
          </Typography>
          <Avatar
            alt={userData ? fullName : 'Usuário'}
            src={userData && userData.photo ? `data:image/jpeg;base64,${userData.photo}` : ''}
            sx={{ width: 250, height: 250, margin: 'auto', marginBottom: '1rem', backgroundColor: '#f50057', boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)', borderRadius: '50%' }}
          >
            <AccountCircleIcon sx={{ width: 250, height: 250 }} />
          </Avatar>
          <input
            id="profile-pic-input"
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={handleFileChange}
          />
          <label htmlFor="profile-pic-input">
            <Button
              color="primary"
              aria-label="edit photo"
              component="span"
              sx={{
                display: 'flex',
                justifyContent: 'center',
                marginTop: '1rem',
                marginBottom: '2rem',
                color: highContrast ?'#FFFF00': "#0000FF", borderColor: highContrast ? '#FFFF00' : 'inherit'}}
            >
              Alterar foto
            </Button>
          </label>
          <TextField
            name="firstName"
            label="Nome"
            defaultValue={userData ? userData.firstName : ''}
            onChange={handleChange}
            fullWidth
            style={{ marginBottom: '1rem',  background: highContrast ? "#fff" : ''  }}
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
            name="lastName"
            label="Sobrenome"
            defaultValue={userData ? userData.lastName : ''}
            onChange={handleChange}
            fullWidth
            style={{ marginBottom: '1rem',  background: highContrast ? "#fff" : ''  }}
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
            name="login"
            label="E-mail"
            defaultValue={userData ? userData.login : ''}
            onChange={handleChange}
            fullWidth
            style={{ marginBottom: '1rem', background: highContrast ? "#fff" : '' }}
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
          <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '1rem' }}>
            <Button variant="contained" onClick={handleSaveChanges} style={{ marginRight: '1rem' }} sx={{
            backgroundColor: highContrast ? '#FFFF00' : '#1976d2', 
            color: highContrast ? '#000000' : '#fff', 
            fontWeight: 'bold' , 
            '&:hover': {
              backgroundColor: highContrast ? '#FFFF00' : '#0d56a6', 
            }
          }}>Salvar Modificações</Button>
            <Button variant="contained" onClick={handleEditPassword} sx={{
            backgroundColor: highContrast ? '#FFFF00' : '#1976d2', 
            color: highContrast ? '#000000' : '#fff', 
            fontWeight: 'bold' , 
            '&:hover': {
              backgroundColor: highContrast ? '#FFFF00' : '#0d56a6', 
            }
          }}>Alterar Senha</Button>
          </Box>
          <Dialog open={openChangePasswordDialog} onClose={handleCloseChangePasswordDialog}>
            <DialogTitle>Alterar Senha</DialogTitle>
            <DialogContent>
            <TextField
                autoFocus
                margin="dense"
                label="Senha Atual"
                type={showPassword ? 'text' : 'password'} 
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                fullWidth
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
              />
              <TextField
                margin="dense"
                label="Nova Senha"
                type={showPassword ? 'text' : 'password'} 
                fullWidth
                value={newPassword} 
                onChange={(e) => setNewPassword(e.target.value)}
                error={!passwordsMatch && confirmNewPassword.length > 0}

              />
              <TextField
                margin="dense"
                label="Confirmar Nova Senha"
                type={showPassword ? 'text' : 'password'} 
                fullWidth
                value = {confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                error={!passwordsMatch && confirmNewPassword.length > 0}
                helperText={!passwordsMatch && confirmNewPassword.length > 0 && "As senhas estão diferentes"}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseChangePasswordDialog}>Cancelar</Button>
              <Button onClick={handlePasswordChange} variant="contained" color="primary" disabled={!passwordsMatch}>Salvar</Button>
            </DialogActions>
            <Snackbar open={errorSnackbarOpen} autoHideDuration={6000} onClose={handleCloseErrorSnackbar}>
            <MuiAlert onClose={handleCloseErrorSnackbar} severity="error" elevation={6} variant="filled">
              <ul>
                {errorMessages.map((errorMessage, index) => (
                  <li key={index}>{errorMessage}</li>
                ))}
              </ul>
            </MuiAlert>
          </Snackbar>
          </Dialog>
          {passwordChanged  && (
             <MessageSnackbar
              open={snackbarOpen}
              onClose={handleCloseSnackbar}
              message="Senha alterada com sucesso!"
              severity="success"
           />
            )}
        </Paper>
      </Container>
      </div>
      <Footer highContrast={highContrast} />
    </ThemeProvider>
  );
};

export default UserProfile;
