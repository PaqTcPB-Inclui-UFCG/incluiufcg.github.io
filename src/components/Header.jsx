import React, { useState, useEffect, useRef } from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Tooltip from '@mui/material/Tooltip';
import ListItemText from "@mui/material/ListItemText";
import TextField from "@mui/material/TextField";
import SearchIcon from "@mui/icons-material/Search";
import { useMediaQuery } from "@mui/material";
import { Link } from "react-router-dom";
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useHotkeys } from 'react-hotkeys-hook';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import Collapse from '@mui/material/Collapse';
import "@fontsource/inter";



const settings = ['Criar nova publicação', 'Gerenciar usuários'];
const usersOptions = ['Meu perfil', 'Sair'];



export default function Header({ highContrast, setHighContrast }) {
    const [openDrawer, setOpenDrawer] = useState(false);
    const [showSearchField, setShowSearchField] = useState(false);
    const isMobile = useMediaQuery((theme) => theme.breakpoints.down("sm"));

    const [searchTerm, setSearchTerm] = useState('');
    const [anchorElUser, setAnchorElUser] = React.useState(null);
    const [anchorElAdmin, setAnchorElAdmin] = React.useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const [userAvatar, setUserAvatar] = useState('/broken-image.jpg');
    const [userFullName, setUserFullName] = useState('Nome do Usuário');
    const profilePic = sessionStorage.getItem('profilePic');
    const searchRef = useRef(null);

    const [adminOpen, setAdminOpen] = useState(false);

    const handleAdminClick = () => {
        setAdminOpen(!adminOpen);
    };

    const toggleHighContrast = () => {
        const newHighContrast = !highContrast;
        setHighContrast(newHighContrast);
        localStorage.setItem('highContrast', newHighContrast); 
      };

    // const toggleHighContrast = () => {
    //     setHighContrast(prevHighContrast => !prevHighContrast);
    // };

    useHotkeys('alt+0', toggleHighContrast);

    setHighContrast(prevHighContrast => !prevHighContrast);

    useEffect(() => {
        const token = sessionStorage.getItem('token');
        if (token) {
            setIsLoggedIn(true);
            const savedAvatar = localStorage.getItem('avatar');
            const savedFullName = localStorage.getItem('fullName');
            if (savedAvatar && savedFullName) {
                setUserAvatar(savedAvatar);
                setUserFullName(savedFullName);
            }
        } else {
            setIsLoggedIn(false);
        }
        const handleKeyDown = (event) => {
            if (event.altKey && event.key === "2") {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
            window.addEventListener("keydown", handleKeyDown);
            return () => {
                window.removeEventListener("keydown", handleKeyDown);
            };

        };
    }, []);

    useHotkeys('alt+2', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    useHotkeys('alt+3', () => {
        setShowSearchField(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
        if (searchRef.current) {
            searchRef.current.focus();
        }
    });

    const handleOpenAdminMenu = (event) => {
        setAnchorElAdmin(event.currentTarget);
    };

    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseAdminMenu = () => {
        setAnchorElAdmin(null);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };
    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };


    const toggleDrawer = () => {
        setOpenDrawer(!openDrawer);
    };

    const toggleSearchField = () => {
        setShowSearchField(!showSearchField);
    };

    const handleSettingClick = (setting) => {
        switch (setting) {
            case 'Criar nova publicação':
                window.location.href = '/criar-artigo';
                break;
            case 'Gerenciar usuários':
                window.location.href = '/gerenciar-perfis';
                break;
            default:
                break;
        }
    };

    const handleUsersClick = (usersOptions) => {
        switch (usersOptions) {
            case 'Meu perfil':
                window.location.href = '/meu-perfil';
                break;
            case 'Sair':
                sessionStorage.removeItem('token');
                localStorage.removeItem('avatar');
                localStorage.removeItem('fullName');
                localStorage.removeItem('role');
                localStorage.clear();
                window.location.href = '/entrar';
                break;
            default:
                break;
        }
    };

    const handleSearch = () => {
        if (searchTerm.trim() === '') {
            toggleSearchField();
        } else {
            window.location.href = `/busca/searchTerm=${searchTerm.trim()}`;
        }
    };

    const appBarStyle = {
        background: '#FFFFFF',
        boxShadow: '0px 2px 6px rgba(0, 0, 0, 0.3)'
    };


    const titleStyle = {
        fontFamily: 'Marko One',
        fontStyle: 'normal',
        fontWeight: 'bold',
        fontSize: '2.7vw',
        display: 'flex',
        alignItems: 'center',
        color: '#000000',
        mixBlendMode: 'normal',
        flex: 'none',
        order: 0,
        flexGrow: 0,
        textDecoration: 'none'
    };

    const buttonStyle = {
        fontFamily: 'Inter',
        fontWeight: highContrast? 'bold' :'medium',
        fontSize: '1.2vw',
        color: '#6E6D7A',
        textTransform: 'none',
        marginLeft: '2.5vw'
    };

    const signupButtonStyle = {
        ...buttonStyle,
        borderRadius: '0.67vw',
        marginLeft: '0.83vw',
        color: 'white',
        '&:hover': {
            backgroundColor: '#2C3DB1'
        }
    };

    useEffect(() => {
        const storedHighContrast = localStorage.getItem('highContrast');
        if (storedHighContrast !== null) {
          setHighContrast(storedHighContrast === 'true');
        }
      }, [setHighContrast]);
    const isAdmin = sessionStorage.getItem('role') === 'ADMIN';
    
    return (
        <React.Fragment>
            <AppBar position="static" style={appBarStyle}>
                <Toolbar>
                    <Typography variant="h6" sx={{ ...titleStyle, ...(isMobile && { fontSize: '4vw' }) }}
                        component={Link} to="/">
                        <img src='./title.png' 
                        alt="incluiUFCG" 
                        style={{ width: isMobile ? '20vh' : '30vh', height: 'auto' }}   />
                    </Typography>
                    {isMobile ? (
                        <IconButton
                            edge="end"
                            color="#6E6D7A"
                            aria-label="menu"
                            style={{ marginLeft: 'auto' }}
                            onClick={toggleDrawer}
                        >
                            <MenuIcon />
                        </IconButton>
                    ) : (
                        <React.Fragment>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
                                <Button sx={buttonStyle} component={Link} to="/sobre">Sobre</Button>
                                <Button sx={buttonStyle} component={Link} to="/analise-de-dados">Perspectivas PCD: Análise de Dados</Button>
                                <Box sx={{ flexGrow: 0 }}>
                                    <Tooltip title="">
                                        {isAdmin && !isMobile && (
                                            <Button sx={buttonStyle} onClick={handleOpenAdminMenu}>Administração</Button>
                                        )}            </Tooltip>
                                    <Menu
                                        sx={{ mt: '45px' }}
                                        id="menu-appbar"
                                        anchorEl={anchorElAdmin}
                                        anchorOrigin={{
                                            vertical: 'top',
                                            horizontal: 'right',
                                        }}
                                        keepMounted
                                        transformOrigin={{
                                            vertical: 'top',
                                            horizontal: 'right',
                                        }}
                                        open={Boolean(anchorElAdmin)}
                                        onClose={handleCloseAdminMenu}
                                    >
                                        {settings.map((setting) => (
                                            <MenuItem key={setting} onClick={() => handleSettingClick(setting)}>
                                                <Typography textAlign="center">{setting}</Typography>
                                            </MenuItem>
                                        ))}
                                    </Menu>
                                </Box>
                                <Button sx={buttonStyle} component={Link} to="/mapa-da-ufcg">Mapa da UFCG</Button>
                               
                            </Box>
                            
                            <div style={{ marginLeft: 'auto' }}>
                                {!isLoggedIn && (
                                    <React.Fragment>
                                        <Box style={{ margin: '1rem 0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <Button sx={buttonStyle} component={Link} to="/entrar">Login</Button>
                                            <Button style={{background: highContrast? '#050834' : '#4183ba'}} variant="contained" sx={signupButtonStyle} component={Link} to="/cadastrar">Cadastrar</Button>
                                        </Box>
                                        
                                    </React.Fragment>
                                )}
                            </div>
                        </React.Fragment>
                    )}
                    <Tooltip title="">
                        {isLoggedIn && !isMobile && (
                            <Avatar src={profilePic ? `data:image/jpeg;base64,${profilePic}` : userAvatar} sx={{ width: 56, height: 56 }} alt={userFullName} onClick={handleOpenUserMenu} />
                        )}
                    </Tooltip>
                    <Menu
                        sx={{ mt: '45px' }}
                        id="menu-appbar"
                        anchorEl={anchorElUser}
                        anchorOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        keepMounted
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        open={Boolean(anchorElUser)}
                        onClose={handleCloseUserMenu}
                    >
                        {usersOptions.map((usersOptions) => (
                            <MenuItem key={usersOptions} onClick={() => handleUsersClick(usersOptions)}>
                                <Typography textAlign="center">{usersOptions}</Typography>
                            </MenuItem>))}
                    </Menu>
                </Toolbar>
                {isMobile && (
                    <Drawer anchor="right" open={openDrawer} onClose={toggleDrawer}>
                        <List>
                            <ListItem onClick={toggleDrawer} component={Link} to="/sobre">
                                <ListItemText primary="Sobre" />
                            </ListItem>
                            <ListItem onClick={toggleDrawer} component={Link} to="/analise-de-dados">
                                <ListItemText primary="Perspectivas PCD: Análise de Dados" />
                            </ListItem>
                            <ListItem button onClick={handleAdminClick}>
                                {isAdmin && (
                                    <React.Fragment>
                                        <ListItemText primary="Administração" />
                                        {adminOpen ? <ExpandLess /> : <ExpandMore />}
                                    </React.Fragment>
                                )}
                            </ListItem>
                            <Collapse in={adminOpen} timeout="auto" unmountOnExit>
                                <List component="div" disablePadding>
                                    <ListItem onClick={toggleDrawer} button component={Link} to="/criar-artigo">
                                        <ListItemText primary="Criar Publicação" />
                                    </ListItem>
                                    <ListItem onClick={toggleDrawer} button component={Link} to="/gerenciar-perfis">
                                        <ListItemText primary="Gerenciar Usuários" />
                                    </ListItem>
                                </List>
                            </Collapse>
                            {!isLoggedIn && (
                                <React.Fragment>
                                    <ListItem onClick={toggleDrawer} component={Link} to="/entrar">
                                        <ListItemText primary="Entrar" />
                                    </ListItem>
                                    <ListItem onClick={toggleDrawer} component={Link} to="/cadastrar">
                                        <ListItemText primary="Cadastrar" />
                                    </ListItem>
                                </React.Fragment>
                            )}
                            {isLoggedIn && (
                                <ListItem onClick={handleOpenUserMenu}>
                                    <Avatar src={profilePic ? `data:image/jpeg;base64,${profilePic}` : userAvatar} sx={{ width: 56, height: 56 }} alt={userFullName} />
                                </ListItem>
                            )}

                        </List>
                    </Drawer>
                )}
                <Box borderTop={1} borderColor="divider" sx={{ borderColor: highContrast ? 'rgba(0, 0, 0, 0.5)' : 'rgba(0, 0, 0, 0.2)' }}></Box>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width:'100%', padding: '0 4rem' }}>
                    <Box borderTop={1} borderColor="divider" sx={{ borderColor: highContrast ? 'rgba(0, 0, 0, 0.5)' : 'rgba(0, 0, 0, 0.2)' }}></Box>
                    <Box sx={{ p: 1, textAlign: 'center', display: 'flex', alignItems: 'center' }}>
                        <Typography variant="body1" sx={{ ...buttonStyle, fontSize: {sm:'1rem'}}} onClick={toggleHighContrast} style={{ cursor: 'pointer', marginRight: '10px' }}>
                            Alto Contraste
                        </Typography>
                        <Typography variant="body1" component={Link} to="/acessibilidade" sx={{ ...buttonStyle,fontSize: {sm:'1rem'}}} style={{ cursor: 'pointer' }}>
                            Acessibilidade
                        </Typography>
                    </Box>
                </Box>
            </AppBar>
        </React.Fragment>
    );
}