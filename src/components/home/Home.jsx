import React, { useState, useEffect, useRef  } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Header from '../Header';
import Footer from '../Footer';
import ArticleHome from './ArticleHome';
import ImageContainer from './ImageContainer';
import { Grid, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { Link } from "react-router-dom";
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

const sortOptions = [
  { value: 'recentes', label: 'Mais Recentes' },
  { value: 'alfabetica', label: 'Ordem Alfabética' },
  { value: 'populares', label: 'Mais Populares' },
];

const sortFunctions = {
  recentes: (a, b) => new Date(b.createdAt.valueOf()) - new Date(a.createdAt.valueOf()),
  alfabetica: (a, b) => a.titulo.localeCompare(b.titulo),
  populares: (a, b) => b.views - a.views,
};


const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: '100vw',
    overflowX: 'hidden',
  },
  articleContainer: {
    maxWidth: '100%',
    overflow: 'hidden',
    marginLeft: '5vw', 
    marginRight:'5vw',
  },
  filterStyle:{
    marginBottom: '2vw',
    fontSize: '1vw',
  },
  filterContainer:{
    marginLeft: '5vw', 
    marginTop:'2vw'
  },
  select: {
    '& .MuiSelect-select': {
      padding: '0.8vw 1.6vw',
      fontSize: '1vw',
      borderRadius: '4vw',
      fontSize: '1vw',
      border: '1px solid #ccc',
      backgroundColor: '#fff',
      outline: 'none',
      transition: 'border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out',
      '&:hover': {
        borderColor: '#007bff',
      },
      '&:focus': {
        borderColor: '#007bff',
        boxShadow: '0 0 0 0.2vw rgba(0, 123, 255, 0.25)',
      },
    },
  },
  highContrastRoot: {
    backgroundColor: '#050834', 
  },
  divStyle: {
    display: 'flex',
    justifyContent: 'center',
    alignItems:'center',
    width: '100%'
  },

  linkStyle: {
    color: 'black',
    fontSize: '1.3rem',
    display: 'flex',
    justifyContent: 'center',
    alignItems:'center',
    textDecoration: 'none', 
    marginBottom: '2rem',
    borderRadius:'1rem',
    width: '15rem',
    border: '1px solid #ccc',
    textAlign:'center',
    '&:hover': {
      color: '#757575', 
    },

  },

}));
  
const Home = () => {
  const classes = useStyles();
  const [sortOption, setSortOption] = useState('recentes');
  const [articles, setArticles] = useState([]);
  const imageContainerRef = useRef(null);

  useEffect(() => {
    axios.get(ENDPOINTS.articles.allArticles, {
    })
    .then(response => setArticles(response.data))
    .catch(error => console.error('Error fetching articles:', error));
  }, []);


  const [highContrast, setHighContrast] = useState(null);

  useEffect(() => {
    const storedHighContrast = localStorage.getItem('highContrast');
    if (storedHighContrast !== null) {
      setHighContrast(storedHighContrast === 'true');
    }
  }, []);


  const handleSortChange = (event) => {
    setSortOption(event.target.value);
  };
  useHotkeys('alt+1', () => {
    if (imageContainerRef.current) {
      const imageContainerTop = imageContainerRef.current.offsetTop;
      if (imageContainerTop !== undefined && imageContainerTop !== null) {
        window.scrollTo({ top: imageContainerTop, behavior: 'smooth' });
      }
    }
  });
  useHotkeys('alt+2', () => {
    if (menuRef.current) {
      menuRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  });

  const renderArticles = (articleList) => {
    return articleList.slice(0, 8).map((article, index) => (
      <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
        <ArticleHome 
        highContrast={highContrast}
          title={article.titulo} 
          imageUrl={article.file} 
          content={article.content} 
          sysId={article.id}
        />
      </Grid>
    ));
  };

  const sortedArticles = [...articles].sort(sortFunctions[sortOption]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className={`${classes.root} ${highContrast ? classes.highContrastRoot : ''}`}>
        <Header highContrast={highContrast} setHighContrast={setHighContrast}/>
        <div ref={imageContainerRef}>
          <ImageContainer highContrast={highContrast} ref={imageContainerRef}/>
        </div>
        <div className={classes.filterContainer}>
          <div>
            <Select
              labelId="sort-select-label"
              id="sort-select"
              value={sortOption}
              onChange={handleSortChange}
              className={classes.filterStyle}
              style={{ borderRadius: '4vw', fontSize: '0.83rem'}}
              sx = {{backgroundColor: '#ffffff'}}
              MenuProps={{
                PaperProps: {
                  style: {
                    borderRadius: '2vw', 
                  },
                },
              }}
            >
              {sortOptions.map((option) => (
                <MenuItem key={option.value} value={option.value} sx={{fontSize: '0.83rem'}}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </div>
        </div>
        <div className={classes.articleContainer}>
          <Grid container spacing={4}>
            {renderArticles(sortedArticles)}
          </Grid>
        </div>
        <div className={classes.divStyle}>
        <Link  to="/base-de-conhecimento" className={classes.linkStyle} style={{ color: highContrast ?'#FFFF' : '#bdbdbd'}}><div>Carregar mais</div></Link>
        </div>
        <Footer highContrast={highContrast}/>
      </div>
    </ThemeProvider>
  );
};

export default Home;
