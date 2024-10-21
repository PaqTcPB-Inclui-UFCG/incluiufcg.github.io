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
    width: '100%',
    
  },
  background: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(162, 194, 222, 0.2)',
  },
  headerText: {
    position: 'absolute',
    zIndex:100,
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
    zIndex:100,
    top: 'calc(30% + 3vw)',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    textAlign: 'center',
    color: '#fff',
    fontSize: '2vw',
    fontWeight: 'normal',
    width: '70vw'
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
    background: '#FFFFFF',   
    zIndez:1 
  },
  '@media (max-width: 600px)': {
    searchContainer: {
      display: 'none', 
    },

    description: {
      fontSize: '3.5vw',
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
      <div className={classes.ContainerImage}
        style={{width:'100%', height:'40rem', overflow:'hidden'}}
      >
        <img 
          src="./background.jpg" 
          className={classes.image} 
          style={{
            width: '100%', height: '100%', objectFit: 'cover', filter: `blur(2px) ${highContrast ? 'brightness(10%)' : 'brightness(50%)'}`
          }}
        />
      </div>
      <div className={classes.background} style={{
          filter: `blur(2px)`
        }}></div>
      <div className={classes.description}>
        Explore nosso acervo digital, repleto de documentos e análises de dados voltados para promover uma educação inclusiva.
      </div>
      <div className={classes.searchContainer}>
        <TextField 
          type="search" 
          id="fullWidth"
          label="Pesquisar..." 
          variant="filled" 
          InputProps={{
            disableUnderline: true,
            endAdornment: (
              <IconButton 
                aria-label="search" 
                style={{ color: '#808080' }} 
                component={Link} 
                to={`/busca/searchTerm=${searchTerm}`}
                disableRipple
              >
                <SearchIcon />
              </IconButton>
            ),
          }}
          className={classes.searchInput}
          onChange={handleSearchChange}
        />
      </div>
    </div>
  );
};

export default ImageContainer;
