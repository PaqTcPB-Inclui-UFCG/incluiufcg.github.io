import React, { useState, useEffect, useRef } from 'react';
import { createTheme, ThemeProvider, CssBaseline, Paper, Typography, Divider, IconButton, Grid, Snackbar, Button } from '@mui/material';
import { Save as SaveIcon, Share as ShareIcon, FavoriteBorder as FavoriteBorderIcon, Favorite as FavoriteIcon, Event as EventIcon, Edit as EditIcon } from '@mui/icons-material'; // Importe o ícone de calendário
import Header from '../Header';
import Footer from '../Footer';
import axios from 'axios';
import { format } from 'date-fns';
import { useParams } from 'react-router-dom';

import { useHotkeys } from 'react-hotkeys-hook';
import ENDPOINTS from '../../endPoints';

const Article = () => {
  const theme = createTheme({
    typography: {
      fontFamily: [
        'Marko One',
        'sans-serif',
      ].join(','),
    },
  });

  const [liked, setLiked] = useState(false);
  const [countLike, setCountLike] = useState(0);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [articleData, setArticleData] = useState(null);
  const [attachments, setAttachments] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const query = useParams();

  const bodyRef = useRef(null);


  useHotkeys('alt+1', () => {
    if (bodyRef.current) {
      const bodyTop = bodyRef.current.offsetTop;
      if (bodyTop !== undefined && bodyTop !== null) {
        window.scrollTo({ top: bodyTop, behavior: 'smooth' });
      }
    }
  });


  const articleId = query.articleID.split('=')[1];


  useEffect(() => {
    const fetchArticle = () => {
      axios.get(ENDPOINTS.articles.getArticleById(articleId))
        .then(response => {
          setArticleData(response.data);
          setCountLike(response.data.Favorite);
          fetchAttachments();
          checkFavorite();

        })
        .catch(error => {
          console.error('Erro ao buscar o artigo:', error);
        });
    };

    fetchArticle();
    const userRole = sessionStorage.getItem('role');
    if (userRole === 'ADMIN') {
      setIsAdmin(true);
    }

  }, []);

  useEffect(() => {
    const fetchTotalLikes = async () => {
      try {
        const response = await axios.get(ENDPOINTS.articles.totalLikes(articleId));
        setCountLike(response.data); 
      
      } catch (error) {
        console.error('Erro:', error);
      }
    };

    const intervalId = setInterval(fetchTotalLikes, 5000);

    fetchTotalLikes();

    return () => clearInterval(intervalId);
  }, [articleId]);

  const checkFavorite = async () => {
    const token = sessionStorage.getItem('token');
    const userId = sessionStorage.getItem('userId');
  
    if (!token) return;
  
    const response = await axios.get(ENDPOINTS.users.favorites(userId), {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    })

    const artigos = response.data;
    const isLiked = artigos.includes(articleId)

    if(isLiked){
      setLiked(true);
      console.log(countLike)
      console.log('curtido')
    }
  };

  const fetchAttachments = () => {
    axios.get(ENDPOINTS.articles.getArticleAttachments(articleId), {
    })
      .then(response => {
        setAttachments(response.data);
        
      })
      .catch(error => {
        console.error('Erro ao buscar os anexos do artigo:', error);
      });
  };

  const handleCopyLink = () => {
    const articleLink = window.location.href;
    navigator.clipboard.writeText(articleLink)
      .then(() => {
        console.log('Link copiado para a área de transferência:', articleLink);
        setSnackbarOpen(true);
      })
      .catch((error) => {
        console.error('Erro ao copiar link:', error);
      });
  };

  const [highContrast, setHighContrast] = useState();

  const toggleHighContrast = () => {
    setHighContrast(prevHighContrast => !prevHighContrast);
  };

  // curte o artigo
  const handleLike = async () => {
    const token = sessionStorage.getItem('token');
    const userId = sessionStorage.getItem('userId');
    console.log(userId);
   

    if (!token) {
      alert('Faça login para curtir um artigo!');
      return;
    }

    const liked = await checkFavoriteTrue();

    if(liked){
      return
    }

    axios.put(ENDPOINTS.users.likeArticle(articleId, userId), {}, {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    })
    .then(response => {
      setLiked(true);
      console.log(countLike)
      console.log('Artigo curtido com sucesso.');
    })
    .catch(error => {
      console.error('Erro:', error);
    });
    
  };

  const checkFavoriteTrue = async () => {
    const token = sessionStorage.getItem('token');
    const userId = sessionStorage.getItem('userId');
  
    if (!token) return false;
  
    try {
      const response = await axios.get(ENDPOINTS.users.favorites(userId), {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });

      const artigos = response.data; 
      const isLiked = artigos.includes(articleId);

      if (isLiked) {
        axios.put(ENDPOINTS.users.dislikeArticle(articleId, userId), {}, {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        })
        console.log(countLike)
        console.log('descurtido')
        setLiked(false);
        return true;

      } else {
        return false;
      }
    } catch (error) {
      console.error('Erro:', error);

    }
  };
  
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleSave = () => {
    console.log('Artigo salvo!');
  };

  const handleEditArticle = () => {
    window.location.href = `/editar-artigo/artigo=${articleId}`;
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
      <Header highContrast={highContrast} setHighContrast={setHighContrast} />
      <div style={{ backgroundColor: highContrast ? '#050834' : '', marginTop: 0 }}>
        <div ref={bodyRef} style={{ padding: '2rem', marginBottom: '2rem', marginLeft: '10vw', marginRight: '10vw', background: highContrast ? "#161839" : '' }}>
          {articleData && (
            <Paper elevation={3} style={{ padding: '2rem', borderRadius: '10px', backgroundColor: highContrast ? '#03051E' : '' }}>
              {isAdmin && (
                <Grid item>
                  <Button startIcon={<EditIcon />} onClick={handleEditArticle} variant="contained" color="primary" style={{ textAlign: 'left', marginBottom: '1.3rem' }}>
                    Editar Artigo
                  </Button>
                </Grid>
              )}
              <Typography variant="h4" gutterBottom sx={{ fontWeight: highContrast ? 'bold' : 'normal', color: highContrast ? "#fff" : "inherit" }}>
                {articleData.titulo}
              </Typography>
              <Grid container spacing={1} alignItems="center">
                <Grid item>
                  <EventIcon sx={{ width: "87%", color: highContrast ? "#fff" : "inherit" }} />
                </Grid>
                <Grid item>
                  <Typography variant="body2" align="center" gutterBottom sx={{ fontWeight: highContrast ? 'bold' : 'normal', color: highContrast ? "#fff" : "inherit" }}>
                    Publicado em: {format(new Date(articleData.createdAt), 'dd/MM/yyyy')}
                  </Typography>
                </Grid>
              </Grid>
              <Divider variant="middle" style={{ margin: '1rem 0', backgroundColor: highContrast ? "#fff" : "inherit" }} />
              <div style={{ position: 'relative', width: '100%', height: '550px', marginBottom: '1rem', borderRadius: '8px', overflow: 'hidden' }}>
                <img
                  src={articleData.file ? `data:image/jpeg;base64,${articleData.file}` : undefined}
                  alt="Capa do Artigo"
                  style={{ position: 'absolute', top: '0', left: '0', width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
              <Typography variant="body1" paragraph sx={{ color: highContrast ? "#fff" : "inherit" }}>
                <strong>Para todos verem :</strong><em>{articleData.descricaoImage}</em>
              </Typography>
              <Divider variant="middle" style={{ margin: '1rem 0', backgroundColor: highContrast ? "#fff" : "inherit" }} />
              <Typography variant="body1" sx={{ color: highContrast ? "#fff" : "inherit" }} paragraph dangerouslySetInnerHTML={{ __html: articleData.conteudoHtml.replace(/<a /g, '<a style="color: ' + (highContrast ? '#FFFF00' : '') + ';" ') }} />
              <Divider variant="middle" style={{ margin: '1rem 0', backgroundColor: highContrast ? "#fff" : "inherit" }} />
              <Typography variant="subtitle1" sx={{ color: highContrast ? "#fff" : "inherit", fontWeight: 'bold' }} gutterBottom>
                Anexos:
              </Typography>
              <ul>
                {attachments.map(attachment => (
                  <li key={attachment.sysId} style={{ color: highContrast ? "white" : "inherit" }}>
                    <a style={{ color: highContrast ? "white" : "inherit" }} href={`data:${attachment.contentType};base64,${attachment.file}`} download={attachment.name}>
                      {attachment.name}
                    </a>
                  </li>
                ))}
              </ul>
              <Divider variant="middle" style={{ margin: '1rem 0', backgroundColor: highContrast ? "#fff" : "inherit" }} />
              <Typography variant="subtitle2" sx={{ color: highContrast ? "#fff" : "inherit" }} gutterBottom>
                <strong>Tags: </strong> {articleData.tags.join(', ')}
              </Typography>
              <Divider variant="middle" style={{ margin: '1rem 0', backgroundColor: highContrast ? "#fff" : "inherit" }} />
              <Grid container spacing={2} justifyContent="center" style={{ margin: '1rem 0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Grid item>
                  <Grid style={{ margin: '1rem 0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <IconButton onClick={handleLike} sx={{ color: highContrast ? "#ffffff" : "inherit" }}>
                      {liked ? <FavoriteIcon color="error" /> : <FavoriteBorderIcon />}
                    </IconButton>
                    <Typography variant="body1" paragraph sx={{ color: highContrast ? "#fff" : "inherit" }} style={{ margin: '1rem 0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <strong>{countLike}</strong>
                    </Typography>
                  </Grid>
                </Grid>
                <Grid item>
                  <IconButton onClick={handleSave} sx={{ color: highContrast ? "#ffffff" : "inherit" }}>
                    <SaveIcon />
                  </IconButton>
                </Grid>
                <Grid item>
                  <IconButton onClick={handleCopyLink} sx={{ color: highContrast ? "#ffffff" : "inherit" }}>
                    <ShareIcon />
                  </IconButton>
                  <Snackbar
                    open={snackbarOpen}
                    autoHideDuration={3000}
                    onClose={handleSnackbarClose}
                    message="Link copiado para a área de transferência"
                  />
                </Grid>
              </Grid>

            </Paper>
          )}
        </div>
      </div>
      <Footer highContrast={highContrast} />
    </ThemeProvider>
  );
};

export default Article;
