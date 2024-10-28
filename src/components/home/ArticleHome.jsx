import React from 'react';
import { makeStyles } from '@mui/styles';
import { Link } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
  article: {
    width: '100%', 
    height: '20vw', 
    position: 'relative', 
    marginBottom: '3vw',
    cursor: 'pointer', 
  },
  articleImageContainer: {
    width: '100%',
    height: '100%',
    backgroundColor: getRandomColor(), 
    borderRadius: '1vw',
    overflow: 'hidden',
  },
  articleImage: {
    width: '100%', 
    height: '100%', 
    objectFit: 'cover', 
  },
  articleTitleContainer: {
    position: 'absolute', 
    bottom: '0', 
    width: '100%', 
    padding: '2vw',
    boxSizing: 'border-box',
    borderBottomLeftRadius: '0.8vw', 
    borderBottomRightRadius: '0.8vw', 
  },
  articleTitle: {
    fontSize: '1.2rem',
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#fff', 
  },
}));

function getRandomColor() {
  const colors = ['#808080', '#FF0000', '#008000', '#0000FF', '#FFFF00', '#FFA500', '#FFC0CB', '#800080', '#A52A2A', '#40E0D0'];
  return colors[Math.floor(Math.random() * colors.length)];
}

const ArticleHome = ({ highContrast,title, imageUrl, sysId }) => {
  const classes = useStyles();

  return (
    <Link to={`/artigos/artigo=${sysId}`} style={{ textDecoration: 'none' }}>
      <div className={classes.article}>
        <div className={classes.articleImageContainer}>
          {imageUrl ? (
            <img src={`data:image/jpeg;base64,${imageUrl}`} alt={title} className={classes.articleImage}/>
          ) : null}
        </div>
        <div className={classes.articleTitleContainer}  style ={{backgroundColor: highContrast ? 'rgba(0, 0, 0, 0.7)' : 'rgba(68,97,126,0.8)'}}>
          <div className={classes.articleTitle} style ={{backgroundColor: highContrast ? 'rgba(0, 0, 0, 0.9)' : 'rgba(0, 0, 0, 0.0)', color:  highContrast ? 'white':'#fff'}}>{title}</div>
        </div>
      </div>
    </Link>
  );
};

export default ArticleHome;
