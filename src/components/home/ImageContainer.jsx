import React, { useState } from 'react';
import { makeStyles } from '@mui/styles';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import { Link  } from 'react-router-dom';


const useStyles = makeStyles((theme) => ({
  root: {
    position: 'relative',
  },
  image: {
    width: '100%'
  },
  headerText: {
    position: 'absolute',
    top: '30%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    textAlign: 'center',
    color: '#fff',
    fontSize: '5vw', 
    fontWeight: 'bold',
    textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
  },
  description: {
    position: 'absolute',
    top: 'calc(30% + 5vw)',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    textAlign: 'center',
    color: '#fff',
    fontSize: '1.3vw',
    fontWeight: 'normal',
  },
  searchContainer: {
    position: 'absolute',
    top: '55%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    textAlign: 'center',
    width: '60vw',
    height: '20vw',
    maxWidth: '100%',
    maxHeight: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '2.5vw',
  },
  searchInput: {
    width: '80%',
    borderRadius: '2.5vw',
    background: 'white',    
  },
  '@media (max-width: 600px)': {
    searchContainer: {
      display: 'none', 
    },
  },
}));

const ImageContainer = ({ highContrast }) => {
  const classes = useStyles();
  const [searchTerm, setSearchTerm] = useState('');


  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };


  return (
    <div className={classes.root}>
      <img 
        src="./adptare.png" 
        className={classes.image} 
        style={{ filter: highContrast ? 'brightness(10%)' : 'brightness(50%)' }} 
        alt="Background"
      />
      <div className={classes.headerText}>
      IncluiUFCG
      </div>
      <div className={classes.description}>
        Explore nosso acervo digital, repleto de documentos e análises de dados voltados para promover uma educação inclusiva.
      </div>
      <div className={classes.searchContainer}>
        <TextField 
          type="search" 
          id="fullWidth"
          label="Pesquisar..." 
          variant="filled" 
          InputProps={{ disableUnderline: true }}
          className={classes.searchInput}
          onChange={handleSearchChange}
        />
        <IconButton type="submit" aria-label="search" style={{ color: '#ffffff' }} component={Link} to={`/busca/searchTerm=${searchTerm}`}>
          <SearchIcon />
        </IconButton>
      </div>
    </div>
  );
};

export default ImageContainer;
