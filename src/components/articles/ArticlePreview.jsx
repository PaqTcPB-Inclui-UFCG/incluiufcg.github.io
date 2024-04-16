import React from 'react';
import { Card, CardContent, CardMedia, Typography, Chip } from '@mui/material';
import { useMediaQuery } from "@mui/material";
import { Link } from 'react-router-dom';

function getRandomColor() {
  const colors = ['#808080', '#FF0000', '#008000', '#0000FF', '#FFFF00', '#FFA500', '#FFC0CB', '#800080', '#A52A2A', '#40E0D0'];
  return colors[Math.floor(Math.random() * colors.length)];
}

const removeHTMLTags = (html) => {
  const regex = /<[^>]*>?/gm;
  return html.replace(regex, '');
};


const ArticlePreview = ({ article, highContrast }) => {
  const { titulo, conteudoHtml, file, tags, descricaoImage, id } = article;
  const isMobile = useMediaQuery('(max-width:600px)');
  const displayedTags = tags.slice(0, 5);

  const colorPalette = ['#FF5722', '#03A9F4', '#4CAF50', '#FFC107', '#9C27B0'];

  return (
    <Link to={`/artigos/artigo=${article.id}`} style={{ textDecoration: 'none' }}>
      <Card sx={{ 
        display: 'flex', 
        flexDirection: isMobile ? 'column' : 'row', 
        justifyContent: 'flex-start', 
        alignItems: 'stretch', 
        width: "100%" 
      }}>
        <CardMedia
          component="img"
          sx={{ 
            width: '30%', 
            minWidth: '30%', 
            flexShrink: 1,
            backgroundColor: file ? 'transparent' : getRandomColor() 
          }}
          image={file ? `data:image/jpeg;base64,${file}` : undefined} 
          alt={descricaoImage}
        />
        <CardContent sx={{ 
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between' 
        }}>
          <div>
            <Typography gutterBottom variant="h5" component="div" style={{ color: highContrast ? '#FFFF00' : 'inherit', background: highContrast ? '#000000' : 'inherit' }}>
              {titulo}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: highContrast ? 'bold': "normal",  color: highContrast ? '#000000' : 'inherit'  }}>
            {conteudoHtml ? removeHTMLTags(conteudoHtml).substring(0, isMobile ? 50 : 900) + "...": ''}
            </Typography>
          </div>
          <div style={{ marginTop: 'auto' }}>
            {displayedTags.map((tag, index) => (
              <Chip 
                key={index} 
                label={tag} 
                sx={{ 
                  marginRight: isMobile ? '0.25rem' : '0.5rem', 
                  marginBottom: isMobile ? '0.25rem' : '0.5rem', 
                  marginTop: isMobile ? '0.25rem' : '0.5rem', 
                  backgroundColor: highContrast ? "#191919" : colorPalette[index % colorPalette.length],
                  color:  highContrast ? '#FFFF00' :'#FFF'
                }} 
              />
            ))}
          </div>
        </CardContent>
      </Card>
      </Link>
    );
};

export default ArticlePreview;
