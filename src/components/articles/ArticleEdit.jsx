import React, { useState, useEffect, useRef } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import CircularProgress from '@mui/material/CircularProgress';
import { createTheme, TextField, Button, Grid, Autocomplete, Typography, ThemeProvider, CssBaseline, Paper, Card, CardContent, CardMedia, DialogContentText, FormControlLabel, DialogContent, Checkbox, DialogTitle, Dialog, DialogActions } from '@mui/material';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import Header from '../Header';
import Footer from '../Footer';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useHotkeys } from 'react-hotkeys-hook';
import ENDPOINTS from '../../endPoints';


const ArticleForm = () => {
  const theme = createTheme({
    typography: {
      fontFamily: ['Marko One', 'sans-serif'].join(',')
    }
  });

  const [articleData, setArticleData] = useState({
    title: '',
    content: '',
    coverImageDescription: '',
    coverImage: '',
    tags: [],
    attachments: [],
  });

  const [loading, setLoading] = useState(true);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [tagsOptions, setTagsOptions] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [attachments, setAttachments] = useState([]);
  const [newAttachments, setNewAttachments] = useState([]);
  const [removedAttachments, setRemovedAttachments] = useState([]);
  const { articleID } = useParams();
  const [highContrast, setHighContrast] = useState();
  const articleId = articleID.split('=')[1];
  const [postData, setPostData] = useState({
    titulo: '',
    conteudoHtml: '',
    descricaoImage: '',
    tags: [],
    file: ''
  });
  const bodyRef = useRef(null);

  useHotkeys('alt+1', () => {
    if (bodyRef.current) {
      const bodyTop = bodyRef.current.offsetTop;
      if (bodyTop !== undefined && bodyTop !== null) {
        window.scrollTo({ top: bodyTop, behavior: 'smooth' });
      }
    }
  });


  useEffect(() => {
    fetchArticle();
    fetchTags();
    fetchAttachments();
  }, []);

  useEffect(() => {
    setPostData({
      titulo: articleData.title,
      conteudoHtml: articleData.content,
      descricaoImage: articleData.coverImageDescription,
      tags: selectedTags,
      file: articleData.coverImage
    });
  }, [articleData.coverImage, articleData.title, articleData.content, articleData.coverImageDescription, selectedTags]);

  const fetchArticle = async () => {
    try {
      setLoading(true);
      const response = await axios.get(ENDPOINTS.articles.getArticleById(articleId));
      const { titulo: title, conteudoHtml: content, descricaoImage: coverImageDescription, tags, file: coverImage } = response.data;
      setArticleData({ title, content, coverImageDescription, tags, coverImage });
      setSelectedTags(tags);
      setLoading(false);

    } catch (error) {
      console.error('Erro ao obter o artigo:', error);
    }
  };
  useEffect(() => {
  }, [articleData.title]);

  const fetchAttachments = () => {
    axios.get(ENDPOINTS.articles.getArticleAttachments(articleId))
      .then(response => {
        setAttachments(response.data);
        console.log('attachments:', attachments);
      })
      .catch(error => {
        console.error('Erro ao buscar os anexos do artigo:', error);
      });
  };

  const fetchTags = async () => {
    try {
      const response = await axios.get(ENDPOINTS.articles.getAllTags);
      setTagsOptions(response.data);
    } catch (error) {
      console.error('Erro ao buscar as tags:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setArticleData({ ...articleData, [name]: value });
  };

  const handleCheckboxChange = (e) => {
    const { checked } = e.target;
    setArticleData({ ...articleData, active: checked });
  };

  const handleTagsChange = (event, newValue) => {
    setSelectedTags(newValue);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {

      console.log('Atualizando artigo:', postData);

      await postNewAttachments(newAttachments);

      const token = sessionStorage.getItem('token');
      await axios.put(ENDPOINTS.articles.updateArticle(articleId), postData, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      });
      console.log('Artigo atualizado com sucesso');
      window.location.href = `/artigos/artigo=${articleId}`;
    } catch (error) {
      console.error('Erro ao atualizar o artigo:', error);
    }
  };

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result.split(',')[1]);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleRemoveAttachment = (index) => {
    const removedAttachment = attachments[index];

    if (removedAttachment.sysId) {
      setRemovedAttachments([...removedAttachments, removedAttachment]);
      const token = sessionStorage.getItem('token');
      axios.delete(ENDPOINTS.attachments.deleteAttachment(removedAttachment.sysId), {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
        .then(response => {
          console.log('Attachment deleted successfully:', response.data);

        })
        .catch(error => {
          console.error('Error deleting attachment:', error);
        });
    };

    const newAttachments = [...attachments];
    newAttachments.splice(index, 1);
    setAttachments(newAttachments);
  };

  const postNewAttachments = async (files) => {
    try {
      const token = sessionStorage.getItem('token');
      for (const file of files) {
        const formData = new FormData();
        formData.append('file', file);

        await axios.post(ENDPOINTS.attachments.uploadAttachment(articleId), formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        });
      }
      console.log('Novos anexos postados com sucesso');
    } catch (error) {
      console.error('Erro ao postar novos anexos:', error);
    }
  };

  const toggleHighContrast = () => {
    setHighContrast(prevHighContrast => !prevHighContrast);
  };


  const handleAttachmentChange = (e) => {
    const files = e.target.files;

    if (files && files.length > 0) {
      setNewAttachments(prevNewAttachments => [...prevNewAttachments, ...files]);
      setAttachments(prevAttachments => [...prevAttachments, ...files]);
    }
  };

  const handleCoverImageChange = async (e) => {
    const file = e.target.files[0];
    const base64String = await convertToBase64(file);
    setArticleData({ ...articleData, coverImage: base64String });
  };

  const filterOptions = (options, { inputValue }) => {
    if (!inputValue) {
      return options;
    }
    return options.filter((option) => option.toLowerCase().includes(inputValue.toLowerCase()));
  };

  const handleDelete = async () => {
    try {
      const token = sessionStorage.getItem('token');
      await axios.delete(ENDPOINTS.articles.deleteArticle(articleId), {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log('Artigo excluído com sucesso');
      window.location.href = '/base-de-conhecimento';
    } catch (error) {
      console.error('Erro ao excluir o artigo:', error);
    }
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
      {loading ? (
        <CircularProgress />
      ) : (
        <div ref={bodyRef} style={{ minHeight: '100vh', backgroundColor: highContrast ? "#000000" : '', padding: '2rem', marginBottom: !highContrast ? '2rem' : "", marginLeft: !highContrast ? '10vw' : "", marginRight: !highContrast ? '10vw' : "" }}>
          <Paper elevation={3} style={{ padding: '2rem',  }}>
            <form onSubmit={handleSubmit}>
            </form>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    name="title"
                    label="Título"
                    value={articleData.title}
                    onChange={handleInputChange}
                    fullWidth
                    required
                    style={{ marginBottom: '1rem', background: highContrast ? "#fff" : '' }}
                    InputLabelProps={{
                      sx: { color: highContrast ? "#0000000" : 'inherit', background: highContrast ? "#FFFF00" : 'inherit', fontWeight: highContrast ? "bold" : "normal" }
                    }}
                    sx={{
                      '& fieldset': {
                        borderColor: highContrast ? "#000000" : '',
                        borderWidth: highContrast ? '0.2rem' : ''

                      }
                    }}

                  />
                </Grid>
                <Grid item xs={12}>
                  <ReactQuill
                    theme="snow"
                    value={articleData.content}
                    onChange={(value) => setArticleData({ ...articleData, content: value })}
                    modules={{
                      toolbar: [
                        [{ header: [1, 2, false] }],
                        ['bold', 'italic'],
                        [{ list: 'ordered' }, { list: 'bullet' }],
                        ['link'],
                        [{ align: [] }]
                      ]
                    }}
                    formats={['header', 'bold', 'italic', 'list', 'bullet', 'link', 'align']}
                  />
                  <Grid item xs={12} sx={{ marginTop: "1rem" }}>
                    <Autocomplete
                      multiple
                      id="tags-outlined"
                      options={tagsOptions}
                      getOptionLabel={(option) => option}
                      onChange={handleTagsChange}
                      value={selectedTags}
                      filterOptions={filterOptions}
                      freeSolo
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          variant="outlined"
                          label="Tags"
                          InputLabelProps={{
                            sx: { color: highContrast ? "#0000000" : 'inherit', background: highContrast ? "#FFFF00" : 'inherit', fontWeight: highContrast ? "bold" : "normal" }
                          }}
                          sx={{
                            '& fieldset': {
                              borderColor: highContrast ? "#000000" : '',
                              borderWidth: highContrast ? '0.2rem' : ''
                            },
                            '& input': {
                              color: highContrast ? '#FFFF00' : '', // Define a cor do texto da tag como amarelo no modo de alto contraste
                              fontWeight: highContrast ? 'bold' : 'normal', // Define o peso da fonte como negrito no modo de alto contraste
                            }
                          }}
                        />
                      )}
                    />
                  </Grid>
                </Grid>
                <Grid item xs={12}>
                  <Typography>Estado da publicação</Typography>
                  <FormControlLabel
                    control={<Checkbox checked={articleData.active} onChange={handleCheckboxChange} />}
                    label="Ativo"
                  />
                </Grid>
                <Grid item xs={12}>
                  {articleData.coverImage && (
                    <Card sx={{ maxWidth: 345 }}>
                      <CardMedia
                        component="img"
                        height="140"
                        image={`data:image/jpeg;base64,${articleData.coverImage}`}
                        alt="Cover Image"
                      />
                      <CardContent>
                        <TextField
                          name="coverImageDescription"
                          label="Para todos verem, descreva a imagem:"
                          value={articleData.coverImageDescription}
                          onChange={handleInputChange}
                          fullWidth
                          required
                          style={{ marginBottom: '1rem', background: highContrast ? "#fff" : '' }}
                          InputLabelProps={{
                            sx: { color: highContrast ? "#0000000" : 'inherit', background: highContrast ? "#FFFF00" : 'inherit', fontWeight: highContrast ? "bold" : "normal" }
                          }}
                          sx={{
                            '& fieldset': {
                              borderColor: highContrast ? "#000000" : '',
                              borderWidth: highContrast ? '0.2rem' : ''

                            }
                          }}

                        />
                      </CardContent>
                    </Card>
                  )}
                </Grid>
                <Grid item xs={12}>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleCoverImageChange}
                    name="coverImage"
                    style={{ display: 'none' }}
                    id="contained-button-cover"
                  />
                  <label htmlFor="contained-button-cover">
                    <Button variant="contained" color="primary" component="span" sx={{
                      backgroundColor: highContrast ? '#FFFF00' : '#1976d2',
                      color: highContrast ? '#000000' : '#fff',
                      fontWeight: 'bold',
                      '&:hover': {
                        backgroundColor: highContrast ? '#FFFF00' : '#0d56a6',
                      }
                    }}>
                      Adicionar Capa
                    </Button>
                  </label>
                  {articleData.coverImage && (
                    <Typography variant="body2" gutterBottom>
                      Capa selecionada
                    </Typography>
                  )}
                </Grid>
                <Grid item xs={12}>
                  {attachments && attachments.map((attachment, index) => (
                    <div key={index}>
                      <Typography variant="body2" gutterBottom>
                        {attachment.name}
                      </Typography>
                      <Button
                        variant="contained"
                        color="secondary"
                        onClick={() => handleRemoveAttachment(index)}
                      >
                        Remover
                      </Button>
                    </div>
                  ))}
                </Grid>
                <Grid item xs={12}>
                  <input
                    type="file"
                    onChange={handleAttachmentChange}
                    multiple
                    style={{ display: 'none' }}
                    id="contained-button-file"
                  />
                  <label htmlFor="contained-button-file">
                    <Button
                      variant="contained"
                      color="primary"
                      component="span"
                      startIcon={<AttachFileIcon />}
                      sx={{
                        backgroundColor: highContrast ? '#FFFF00' : '#1976d2',
                        color: highContrast ? '#000000' : '#fff',
                        fontWeight: 'bold',
                        '&:hover': {
                          backgroundColor: highContrast ? '#FFFF00' : '#0d56a6',
                        }
                      }}
                    >
                      Adicionar Anexos
                    </Button>
                  </label>
                  <Typography variant="body2" gutterBottom>
                    {attachments.length} anexo(s) selecionado(s)
                  </Typography>
                </Grid>
                <Grid container spacing={2} alignItems="center" justifyContent="center">
                  <Grid item xs={6} align="center">
                    <Button type="submit" variant="contained" color="primary" sx={{
                      backgroundColor: highContrast ? '#FFFF00' : '#1976d2',
                      color: highContrast ? '#000000' : '#fff',
                      fontWeight: 'bold',
                      '&:hover': {
                        backgroundColor: highContrast ? '#FFFF00' : '#0d56a6',
                      }
                    }}>
                      Atualizar artigo
                    </Button>
                  </Grid>
                  <Grid item xs={6} align="center">
                    <Button variant="contained" color="error" onClick={() => setOpenDeleteDialog(true)}>
                      Excluir Artigo
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
            </form>
            <Dialog
              open={openDeleteDialog}
              onClose={() => setOpenDeleteDialog(false)}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
            >
              <DialogTitle id="alert-dialog-title">{"Excluir Artigo"}</DialogTitle>
              <DialogContent>
                <DialogContentText id="alert-dialog-description">
                  Tem certeza que deseja excluir este artigo?
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setOpenDeleteDialog(false)} color="primary">
                  Cancelar
                </Button>
                <Button onClick={handleDelete} color="primary" autoFocus>
                  Confirmar
                </Button>
              </DialogActions>
            </Dialog>
          </Paper>
        </div>
      )}
      <Footer />
    </ThemeProvider>
  );
};

export default ArticleForm;
