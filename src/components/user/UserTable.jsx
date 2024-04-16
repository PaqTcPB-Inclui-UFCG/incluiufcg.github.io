import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Table, Typography, ThemeProvider, createTheme, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, MenuItem, Select, TextField } from '@mui/material';
import Header from '../Header';
import Footer from '../Footer';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { useHotkeys } from 'react-hotkeys-hook';


const theme = createTheme({
  typography: {
    fontFamily: [
      'Marko One',
      'sans-serif',
    ].join(','),
  },
});

const UserTable = () => {
  const [users, setUsers] = useState([]);
  const [selectedRole, setSelectedRole] = useState('');
  const [nameFilter, setNameFilter] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const bodyRef = useRef(null);
  const [highContrast, setHighContrast] = useState();

  useHotkeys('alt+1', () => {
    if (bodyRef.current) {
      const bodyTop = bodyRef.current.offsetTop;
      if (bodyTop !== undefined && bodyTop !== null) {
        window.scrollTo({ top: bodyTop, behavior: 'smooth' });
      }
    }
  });

  useEffect(() => {
    const role = sessionStorage.getItem('role');
    const token = sessionStorage.getItem('token');
    if (!token) {
      window.location.href = '/entrar';
    } else if (role != 'ADMIN') {
      window.location.href = '/nao-autorizado';
    }
    const fetchData = async () => {
      try {
        const token = sessionStorage.getItem('token');
        const response = await axios.get('http://localhost:8081/users', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setUsers(response.data);
      } catch (error) {
        console.error('Erro ao buscar usuários:', error);
      }
    };

    fetchData();
  }, []);

  const handleRoleChange = (userId, newRole) => {
    console.log(`Alterando o cargo do usuário ${userId} para ${newRole}`);
  };

  const filteredUsers = users.filter(user => {
    if (nameFilter && !user.fullName.toLowerCase().includes(nameFilter.toLowerCase())) {
      return false;
    }
    if (roleFilter && user.role !== roleFilter) {
      return false;
    }
    return true;
  });

  useEffect(() => {
    const storedHighContrast = localStorage.getItem('highContrast');
    if (storedHighContrast !== null) {
      setHighContrast(storedHighContrast === 'true');
    }
  }, [setHighContrast]);


  return (
    <ThemeProvider theme={theme}>
        <Header highContrast={highContrast} setHighContrast={setHighContrast}/>
      <div ref={bodyRef} style={{ padding: '2rem', marginBottom: '2rem', backgroundColor: highContrast ? "#000000" : '', minHeight: '100vh' }}>
        <Paper elevation={3} style={{ padding: '2rem', marginLeft: '10vw', marginRight: '10vw', backgroundColor: highContrast ? "#000000" : '' }}>
          <Typography variant='h5' style={{ color: highContrast ? "#FFFF00" : '', fontWeight: highContrast ? "bold" : "inherit" }}>Usuários cadastrados</Typography>
          <div style={{ marginTop: "2rem", marginBottom: '1rem', display: 'flex', gap: '1rem' }}>
            <TextField
              label="Filtrar por nome"
              variant="outlined"
              value={nameFilter}
              onChange={(e) => setNameFilter(e.target.value)}
              style={{ marginBottom: '1rem', background: highContrast ? "#fff" : '' }}
              InputLabelProps={{
                sx: { color: highContrast ? "#0000000" : 'inherit', background: highContrast ? "#FFFF00" : 'inherit', fontWeight: highContrast ? "bold" : "normal" }
              }}
              sx={{
                '& fieldset': {
                  borderColor: highContrast ? "#FFFF00" : '',
                  borderWidth: '0.2rem'

                }
              }}
            />
            <Select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              variant="outlined"
              displayEmpty
              inputProps={{ 'aria-label': 'Without label' }}
              style={{ marginBottom: '1rem', background: highContrast ? "#fff" : '', fontWeight: highContrast ? "bold" : "normal" }}
              InputLabelProps={{
                sx: { color: highContrast ? "#0000000" : 'inherit', background: highContrast ? "#FFFF00" : 'inherit', fontWeight: highContrast ? "bold" : "normal" }
              }}
              sx={{
                '& fieldset': {
                  borderColor: highContrast ? "#FFFF00" : '',
                  borderWidth: '0.2rem'

                }
              }}
            >
              <MenuItem value="">Filtrar por cargo</MenuItem>
              <MenuItem value="ADMIN">Admin</MenuItem>
              <MenuItem value="USER">User</MenuItem>
            </Select>
          </div>
          <TableContainer component={Paper}>
            <Table style={{ backgroundColor: highContrast ? '#000000' : '', color: highContrast ? '#FFFFFF' : '' }}>
              <TableHead>
                <TableRow style={{ background: highContrast ? '#000000' : 'bold' }}>
                  <TableCell style={{ fontWeight: highContrast ? 'bold' : 'normal', color: highContrast ? '#FFFFFF' : '' }}>Nome</TableCell>
                  <TableCell style={{ fontWeight: highContrast ? 'bold' : 'normal', color: highContrast ? '#FFFFFF' : '' }}>E-mail</TableCell>
                  <TableCell style={{ fontWeight: highContrast ? 'bold' : 'normal', color: highContrast ? '#FFFFFF' : '' }}>Cargo</TableCell>
                  <TableCell style={{ fontWeight: highContrast ? 'bold' : 'normal', color: highContrast ? '#FFFFFF' : '' }}>Alterar Cargo</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id} style={{ background: highContrast ? '#000000' : '' }}>
                    <TableCell style={{ fontWeight: highContrast ? 'bold' : 'normal', color: highContrast ? '#FFFFFF' : '' }}>{user.fullName}</TableCell>
                    <TableCell style={{ fontWeight: highContrast ? 'bold' : 'normal', color: highContrast ? '#FFFFFF' : '' }}>{user.login}</TableCell>
                    <TableCell style={{ fontWeight: highContrast ? 'bold' : 'normal', color: highContrast ? '#FFFFFF' : '' }}>{user.role}</TableCell>
                    <TableCell>
                      <Select
                        value={selectedRole}
                        onChange={(e) => setSelectedRole(e.target.value)}
                        style={{ fontWeight: highContrast ? 'bold' : 'normal', color: highContrast ? '#000000' : '', background: highContrast ? '#FFFFFF' : '' }}
                      >
                        <MenuItem value="ADMIN">Admin</MenuItem>
                        <MenuItem value="USER">User</MenuItem>
                      </Select>
                      <CheckCircleOutlineIcon
                        style={{ cursor: 'pointer', color: highContrast ? '#FFFF00' : 'green' }} onClick={() => handleRoleChange(user.id, selectedRole)}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

        </Paper>
      </div>
      <Footer highContrast={highContrast} />
    </ThemeProvider>
  );
};

export default UserTable;
