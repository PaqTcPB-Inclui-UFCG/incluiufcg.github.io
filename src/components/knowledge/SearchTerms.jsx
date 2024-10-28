import React, { useState, useEffect , useRef} from 'react';
import { Typography, FormControlLabel, Switch,Grid, ThemeProvider, CssBaseline, createTheme, TextField, IconButton, MenuItem, Select, InputLabel, FormControl, Button, InputBase, Paper } from '@mui/material';
import { makeStyles } from '@mui/styles';
import ArticlePreview from '../articles/ArticlePreview';
import Pagination from '@mui/material/Pagination';
import Header from '../Header';
import Footer from '../Footer';
import { Box } from '@mui/material';
import axios from 'axios';
import SearchIcon from '@mui/icons-material/Search';
import { useParams , Link  } from 'react-router-dom';
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

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: '100vw',
    overflowX: 'hidden',
  },
  paginationContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: '1rem',
  },
  searchContainer: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '1rem',  
  },
  searchInput: {
    marginRight: '1rem',
    backgroundColor: '#ffffff',
    padding: '1rem',
    borderRadius: '5vw', 
    marginBottom: '2vw',
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
  },
  body: {
    marginLeft: '10vw',
    marginRight: '10vw',
  },
  sortContainer: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '1rem',
  },
  highContrastRoot: {
    backgroundColor: '#191919', 
  },


}));

const sortOptions = [
  { value: 'recentes', label: 'Mais Recentes' },
  { value: 'titleAZ', label: 'Ordem Alfabética (A-Z)' },
  { value: 'titleZA', label: 'Ordem Alfabética (Z-A)' },
  { value: 'populares', label: 'Mais Populares' },
];

const sortFunctions = {
  recentes: (a, b) => new Date(b.createdAt.valueOf()) - new Date(a.createdAt.valueOf()),
  titleAZ: (a, b) => a.titulo.trim().localeCompare(b.titulo),
  titleZA: (a, b) => b.titulo.trim().localeCompare(a.titulo),
  populares: (a, b) => b.views - a.views,
};


const BaseDeConhecimento = () => {
  const classes = useStyles();
  const  query  = useParams(); 
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState(query.searchTerm.split('=')[1]); 
  const [advancedSearch, setAdvancedSearch] = useState(false);
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [allYears, setAllYears] = useState([]);
  const [articles, setArticles] = useState([]);
  const [sortOption, setSortOption] = useState('recentes');
  const [highContrast, setHighContrast] = useState();


  const bodyRef = useRef(null);


  useHotkeys('alt+1', () => {
    if (bodyRef.current) {
      const bodyTop = bodyRef.current.offsetTop;
      if (bodyTop !== undefined && bodyTop !== null) {
        window.scrollTo({ top: bodyTop, behavior: 'smooth' });
      }
    }
  });
  const articlesPerPage = 6;

  useEffect(() => {
    handleSearch();
  }, []); 

  const handleSearch = () => {
    axios.get(ENDPOINTS.articles.searchArticles(searchTerm, 'all')) 
      .then(response => setArticles(response.data)) 
      .catch(error => console.error('Error fetching articles:', error));
  };

  const toggleHighContrast = () => {
    setHighContrast(prevHighContrast => !prevHighContrast); 
  };

  useEffect(() => {
    const years = [...new Set(articles.map(article => new Date(article.createdAt).getFullYear()))];
    setAllYears(['Todas', ...years.map(year => year.toString())]);
  }, [articles]);

  const filterArticles = (article) => {
    const tagFilter = selectedTag === '' || selectedTag === 'Todas' || article.tags.map(tag => tag.trim().toLowerCase()).includes(selectedTag.toLowerCase().trim());
    const yearFilter = selectedYear === '' || selectedYear === 'Todas' || new Date(article.createdAt).getFullYear().toString() === selectedYear;
  
    return tagFilter && yearFilter;
  };
  
  
  const allTags = articles
  .flatMap(article => article.tags) 
  .map(tag => tag.trim()) 
  .filter((tag, index, self) => self.indexOf(tag) === index); 
  

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleAdvancedSearchToggle = () => {
    setAdvancedSearch(!advancedSearch);
  };

  const handleYearChange = (event) => {
    setSelectedYear(event.target.value);
  };

  const handleTagChange = (event) => {
    setSelectedTag(event.target.value);
  };

  const handleClearFilters = () => {
    setSelectedYear('');
    setSelectedTag('');
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      navegar(`/busca?searchTerm=${searchTerm.trim()}`);
    }
      
  };
  
  const handleSortChange = (event) => {
    setSortOption(event.target.value);
  };

  const sortedArticles = [...articles].sort(sortFunctions[sortOption]);

  const startIndex = (page - 1) * articlesPerPage;
  const paginatedArticles = sortedArticles.filter(filterArticles).slice(startIndex, startIndex + articlesPerPage);

  useEffect(() => {
    const storedHighContrast = localStorage.getItem('highContrast');
    if (storedHighContrast !== null) {
      setHighContrast(storedHighContrast === 'true');
    }
  }, [setHighContrast]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className={`${classes.root} ${highContrast ? classes.highContrastRoot : ''}`}>
      <Header highContrast={highContrast} setHighContrast={setHighContrast}/>
        <div className={classes.body} ref={bodyRef}>
        <Box className={classes.searchContainer} sx={{ backgroundColor: '#f0f0f0', padding: '1rem', borderRadius: '5px', marginBottom: '0.5rem', marginTop: '0.2rem' }}>
            <div ref={bodyRef} style={{  display: 'inline', flexDirection: 'row', marginBottom: '0.5rem', width: "100%", backgroundColor: highContrast ? "#111111": '#808080', borderRadius: '4px' }}>
            <Paper
               component="form"
               sx={{ ml: 1, display: 'flex', alignItems: 'center', width: "98%", marginLeft: 'auto', marginRight: 'auto',  marginTop: '1rem' }}
            >
            <InputBase
              sx={{ ml: 1, flex: 1 }}
              placeholder="Pesquisar..."
              inputProps={{ 'aria-label': 'search google maps' }}
              onChange={handleSearchChange}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  {handleKeyPress}
                }
              }}
            
              />
              <IconButton color="primary" aria-label="search" component={Link} to={`/busca/searchTerm=${searchTerm}`} onClick={handleSearch}>
                <SearchIcon />
              </IconButton>
              </Paper>
              <div style = {{marginTop: '1.2vw', marginLeft: '1vw', marginRight: 'auto'}}>
              <Typography variant="subtitle2" gutterBottom sx={{marginBottom: 'none', color: highContrast ?'white' : '#FFFFF'}}><strong>Pesquisa Avançada</strong></Typography>
            <FormControlLabel
              control={
                <Switch
                  checked={advancedSearch}
                  onChange={(event) => handleAdvancedSearchToggle(event.target.checked)}
                  name="advanced-search"
                  color= {highContrast? "warning":"primary"}
                  sx = {{marginTop: "-1.4vw;"}}
                />
              }
              label=""
            />
          </div>
            </div>
          </Box>
            {advancedSearch && (
              <Box className={classes.searchContainer} sx={{ backgroundColor: '#f0f0f0', padding: '1rem',  marginTop: '-1rem'}}>
              <div style={{ display: 'flex',padding: '1rem', marginTop:"-3rem", flexDirection: 'row', marginBottom: '0.5rem', width: "100%", backgroundColor: highContrast ? "#111111":'#808080', borderRadius: '4px' }}>
                <div style={{ width: '100%', marginRight: '0.5rem', background: 'white', borderRadius: '4px' }}>
                  <FormControl style={{ width: '100%' }}>
                    <InputLabel>Ano</InputLabel>
                    <Select
                      value={selectedYear}
                      onChange={handleYearChange}
                    >
                      {allYears.map(year => (
                        <MenuItem key={year} value={year}>{year}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </div>
                <div style={{ width: '100%', marginLeft: '0.5rem', background: 'white', borderRadius: '4px' }}>
                <FormControl style={{ width: '100%' }}>
                  <InputLabel>Tag</InputLabel>
                  <Select
                    value={selectedTag}
                    onChange={handleTagChange}
                  >
                    <MenuItem value="Todas">Todas</MenuItem>
                    {allTags.map(tag => (
                      <MenuItem key={tag} value={tag}>{tag}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>
              </div>
            </Box>
          )}
  
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.5rem' }}>
            <Button variant="outlined" onClick={handleClearFilters} sx={{color: highContrast ?'#FFFF00': "#0000FF", borderColor: highContrast ? '#FFFF00' : 'inherit'}}>Limpar Filtros</Button>
          </div>
  
          <div className={classes.sortContainer}>
            <Select
              value={sortOption}
              onChange={handleSortChange}
              sx = {{backgroundColor: '#ffffff'}}

            >
            {sortOptions.map((option) => (
                <MenuItem key={option.value} value={option.value} sx={{fontSize: '0.83rem'}}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </div>
          <Grid container spacing={3}>
            {paginatedArticles.map((article, index) => (
              <Grid item xs={12} key={index}>
                <ArticlePreview highContrast={highContrast} article={article} />
              </Grid>
            ))}
          </Grid>
          <div className={classes.paginationContainer}>
            <Pagination
              count={Math.ceil(sortedArticles.filter(filterArticles).length / articlesPerPage)}
              page={page}
              onChange={handlePageChange}
              color={!highContrast ? "primary" : "secondary"}
              sx={{ background: '#ffffff', color: highContrast ? '#ffffff' : '#ffffff' }}
            />
          </div>
        </div>
        <Footer highContrast={highContrast}/>
      </div>
    </ThemeProvider>
  );
  
            }

export default BaseDeConhecimento;
