import AttachFileIcon from '@mui/icons-material/AttachFile';
import { Autocomplete, Button, Card, CardContent, CardMedia, CssBaseline, Grid, Paper, TextField, ThemeProvider, Typography, createTheme } from '@mui/material';
import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import Footer from '../Footer';
import Header from '../Header';
import ENDPOINTS from '../../endPoints';


const theme = createTheme({
  typography: {
    fontFamily: ['Marko One', 'sans-serif'].join(',')
  }
});

const ArticleForm = () => {
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
    const token = sessionStorage.getItem('token');
    const role = sessionStorage.getItem('role');
    if (!token) {
      window.location.href = '/entrar';
    } else if (role !== 'ADMIN') {
      window.location.href = '/nao-autorizado';
    }
    fetchTags();
  }, []);

  const [articleData, setArticleData] = useState({
    title: '',
    description: '',
    content: '',
    attachments: [],
    coverImage: null,
    coverImageDescription: '',
    tags: []
  });

  const [articlePublished, setArticlePublished] = useState(false);
  const [tagsOptions, setTagsOptions] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setArticleData({ ...articleData, [name]: value });
  };

  const handleTagsChange = (_event, newValue) => {
    setSelectedTags(newValue);
  };

  const handleAttachmentChange = (e) => {
    const files = e.target.files;
    setArticleData({ ...articleData, attachments: [...articleData.attachments, ...files] });
  };

  const handleRemoveAttachment = (index) => {
    const newAttachments = [...articleData.attachments];
    newAttachments.splice(index, 1);
    setArticleData({ ...articleData, attachments: newAttachments });
  };

  const handleCoverImageChange = (e) => {
    const file = e.target.files[0];
    setArticleData({ ...articleData, coverImage: file });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const articleResponse = await publishArticle();
  
      if (articleData.attachments.length > 0) {
        await Promise.all(
          articleData.attachments.map(async (attachment) => {
            const attachmentData = new FormData();
            attachmentData.append('file', attachment);
  
            await axios.post(
              ENDPOINTS.attachments.uploadAttachment(articleResponse.data.id),
              attachmentData,
              {
                headers: {
                  'Content-Type': 'multipart/form-data',
                  Authorization: `Bearer ${sessionStorage.getItem('token')}`
                }
              }
            );
          })
        );
      }
  
      setArticlePublished(true);
      window.location.href = `/artigos/artigo=${articleResponse.data.id}`;
    } catch (error) {
      alert('Erro ao publicar o artigo ou os anexos: ' + error + '/nCaso o Erro persista, entre em contato com administrador');
      console.error('Erro ao publicar o artigo ou os anexos:', error);
      setArticlePublished(false);
    }
  };
  
  const publishArticle = async () => {
    const base64String = await convertToBase64(articleData.coverImage);
  
    const postData = {
      titulo: articleData.title,
      conteudoHtml: articleData.content,
      tags: selectedTags,
      autorId: sessionStorage.getItem('userId'),
      descricaoImage: articleData.coverImageDescription,
      file: base64String
    };
  
    console.log('Publicando artigo:', postData);
  
    const token = sessionStorage.getItem('token');
    const response = await axios.post(ENDPOINTS.articles.postArticle, postData, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    });
  
    console.log('Artigo publicado com sucesso:', response.data.id);
    return response;
  };

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result.split(',')[1]);
      reader.onerror = (error) => reject(error);
    });
  };

  const fetchTags = async () => {
    try {
      const response = await axios.get(ENDPOINTS.articles.getAllTags);
      setTagsOptions(response.data);
    } catch (error) {
      console.error('Erro ao obter as tags:', error);
    }
  };

  const filterOptions = (options, { inputValue }) => {
    if (!inputValue) {
      return options;
    }
    return options.filter((option) => option.toLowerCase().includes(inputValue.toLowerCase()));
  };
  const toggleHighContrast = () => {
    setHighContrast(prevHighContrast => !prevHighContrast);
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
      <div ref={bodyRef} style={{ minHeight: '100vh', backgroundColor: highContrast ? "#000000" : '', padding: '2rem', marginBottom: !highContrast ? '2rem' : "", marginLeft: !highContrast ? '10vw' : "", marginRight: !highContrast ? '10vw' : "" }}>
        <Paper elevation={3} style={{ padding: '2rem' }}>
          <form onSubmit={handleSubmit}>
            {articlePublished && (
              <Typography variant="body1" gutterBottom style={{ color: 'green' }}>
                Artigo publicado com sucesso!
              </Typography>
            )}
            {!articlePublished && articlePublished !== null && (
              <Typography variant="body1" gutterBottom style={{ color: 'red' }}>
                Erro ao publicar o artigo. Por favor, tente novamente.
              </Typography>
            )}
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
                <TextField
                  name="description"
                  label="Descrição"
                  value={articleData.description}
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
                      borderWidth: highContrast ? '0.2rem' : ""
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
                    renderInput={(params) => <TextField {...params} variant="outlined" label="Tags" />}
                    InputLabelProps={{
                      sx: { color: highContrast ? "#0000000" : 'inherit', background: highContrast ? "#FFFF00" : 'inherit', fontWeight: highContrast ? "bold" : "normal" }
                    }}
                    sx={{
                      '& fieldset': {
                        borderColor: highContrast ? "#000000" : '',
                        borderWidth: highContrast ? '0.2rem' : ""
                      }
                    }}
                  />
                </Grid>
              </Grid>
              <Grid item xs={12}>
                {articleData.coverImage && (
                  <Card sx={{ maxWidth: 345 }}>
                    <CardMedia
                      component="img"
                      height="140"
                      image={URL.createObjectURL(articleData.coverImage)}
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
                {articleData.attachments.map((attachment, index) => (
                  <div key={index}>
                    <Typography variant="body2" gutterBottom>
                      {attachment.name} - {attachment.size} bytes
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
                    sx={{
                      backgroundColor: highContrast ? '#FFFF00' : '#1976d2',
                      color: highContrast ? '#000000' : '#fff',
                      fontWeight: 'bold',
                      '&:hover': {
                        backgroundColor: highContrast ? '#FFFF00' : '#0d56a6',
                      }
                    }}
                    variant="contained"
                    color="primary"
                    component="span"
                    startIcon={<AttachFileIcon />}
                  >
                    Adicionar Anexos
                  </Button>
                </label>
                <Typography variant="body2" gutterBottom>
                  {articleData.attachments.length} anexo(s) selecionado(s)
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Button type="submit" variant="contained" color="primary" sx={{
                  backgroundColor: highContrast ? '#FFFF00' : '#1976d2',
                  color: highContrast ? '#000000' : '#fff',
                  fontWeight: 'bold',
                  '&:hover': {
                    backgroundColor: highContrast ? '#FFFF00' : '#0d56a6',
                  }
                }}>
                  Publicar Artigo
                </Button>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </div>
      <Footer highContrast={highContrast} />
    </ThemeProvider>
  );
};

export default ArticleForm;
