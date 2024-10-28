import React, { useRef, useState, useEffect  } from 'react';
import { Typography, Paper, ThemeProvider, CssBaseline, createTheme, useMediaQuery } from '@mui/material';
import Header from '../Header';
import Footer from '../Footer';
import { useHotkeys } from 'react-hotkeys-hook';
import { ClassNames } from '@emotion/react';

const theme = createTheme({
  typography: {
    fontFamily: [
      'Marko One',
      'sans-serif',
    ].join(','),
  },
});

const About = () => {
  const bodyRef = useRef(null);


  useHotkeys('alt+1', () => {
    if (bodyRef.current) {
      const bodyTop = bodyRef.current.offsetTop;
      if (bodyTop !== undefined && bodyTop !== null) {
        window.scrollTo({ top: bodyTop, behavior: 'smooth' });
      }
    }
  });

  const [highContrast, setHighContrast] = useState();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

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
      <div style={{position:'relative', width:'100%'}}>
        
          <img
                src="/about-image.jpg"
                alt="Sobre a Iniciativa"
                title="Pessoa lendo um livro"
                style={{
                  width: '100%', 
                  height: '18vw', 
                  objectFit: 'cover', 
                  '@media (max-width: 600px)': { height: '60vw' },
                }}
            />

        <div 
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              backgroundColor: highContrast? 'FFFFF': 'rgba(92, 105, 114, 0.35)',  
             
            }}
          />

          <Typography variant="h3" gutterBottom sx={{ color: highContrast ? "#FFFF" : 'inherit', position:'absolute', top:'50%', left:'50%', transform:'translate(-50%, -50%)', color:'white', fontSize:{ xs: '1.5rem', sm: '2rem', md: '3rem', lg: '3.5rem'}}}>
              Sobre a Iniciativa
          </Typography>
      </div>
      
      <div className = 'body' ref={bodyRef} style={{color: highContrast? "FFFF":'',  backgroundColor: highContrast ? '#050834' : '', minHeight: '100vh', padding: '3rem' }}>
          <Typography variant="h5" paragraph style={{ marginBottom: '1rem' }}>
            <strong style={{color: highContrast? "white" : 'rgba(92, 105, 114, 0.9)'}}>O QUE É ENSINO INCLUSIVO?</strong>
          </Typography>
          <Typography variant="body1" paragraph style={{ marginBottom: '1rem', color: highContrast ? "#FFFFFF" : 'inherit', fontWeight: highContrast ? "bold": "normal" }}>
            A Educação Inclusiva é uma abordagem contemporânea que busca garantir o direito de todos à educação, promovendo a igualdade de oportunidades e valorizando as diversidades humanas. Seus princípios fundamentais são:
            </Typography >
          <ul style={{color: highContrast ? "#FFFFFF" : 'inherit', fontWeight: highContrast ? "bold": "normal", display: 'grid',gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)' , gridTemplateRows: 'auto', gap: '10px', alignItems:'center', justifyContent:'center', marginRight: '3.5rem'}}>
      
            <li style={{background: 'rgba(92, 105, 114, 0.05)',  gap:'15px', listStyleType: 'none', padding:'15px', borderRadius: '10px', width: isMobile ? '16rem' : '25rem', height: '18rem', marginBottom:'10px'}}>
            <div style={{display:'flex', flexDirection: 'column', alignItems:'center', justifyContent:'center',}}>
              
              <svg width="101" height="92" viewBox="0 0 101 92" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M81.5996 41.17L46.2917 73.3317V84.3334H25.25C20.5788 84.3334 16.8334 80.9217 16.8334 76.6667V15.3334C16.8334 13.3 17.7201 11.35 19.2986 9.9122C20.877 8.47442 23.0178 7.66669 25.25 7.66669H29.4584V34.5L39.9792 28.75L50.5 34.5V7.66669H75.75C77.9823 7.66669 80.1231 8.47442 81.7015 9.9122C83.28 11.35 84.1667 13.3 84.1667 15.3334V39.4834C83.2409 39.9434 82.3571 40.48 81.5996 41.17ZM54.7084 76.5134V84.3334H63.2934L89.0905 60.8734L80.5055 53.015L54.7084 76.5134ZM96.1605 51.635L90.6055 46.575C89.7638 45.8084 88.375 45.8084 87.5755 46.575L83.4513 50.3317L92.0363 58.1517L96.1605 54.395C97.0021 53.6667 97.0021 52.4017 96.1605 51.635Z" fill={highContrast? "white" : "#3463A8"}/>
              </svg>
              <Typography variant="body1" paragraph style={{ margin: 0 }} ><strong style={{ color: highContrast? "#FFFF" : '#4183ba' }}>Reito de Acesso à Educação</strong></Typography>
              </div>
              <div style={{display:'flex', alignItems:'center', justifyContent:'center', textAlign: 'center' }}>
                <Typography variant="body1" paragraph style={{ margin: 0, textAlign: 'justify' }} >
                  Todos têm o direito de acesso à educação de qualidade na escola regular, com atendimento especializado conforme suas especificidades, alinhado com princípios internacionais de direitos humanos.
                </Typography>
              </div>
            </li>

            <li style={{background: 'rgba(92, 105, 114, 0.05)',  gap:'15px', listStyleType: 'none', padding:'15px', borderRadius: '10px', width: isMobile ? '16rem' : '25rem', height:  isMobile ? '22rem' : '18rem', marginBottom:'10px'}}>
            <div style={{display:'flex', flexDirection: 'column', alignItems:'center', justifyContent:'center',}}>
            <svg width="92" height="92" viewBox="0 0 92 92" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M76.6667 65.1667C78.7 65.1667 80.65 64.3589 82.0878 62.9212C83.5256 61.4834 84.3333 59.5333 84.3333 57.5V15.3334C84.3333 13.3 83.5256 11.35 82.0878 9.9122C80.65 8.47442 78.7 7.66669 76.6667 7.66669H36.2633C37.605 10.005 38.3333 12.65 38.3333 15.3334H76.6667V57.5H42.1667V65.1667M57.5 26.8334V34.5H34.5V84.3334H26.8333V61.3334H19.1667V84.3334H11.5V53.6667H5.75V34.5C5.75 32.4667 6.55774 30.5166 7.99551 29.0789C9.43329 27.6411 11.3833 26.8334 13.4167 26.8334H57.5ZM30.6667 15.3334C30.6667 17.3667 29.8589 19.3167 28.4212 20.7545C26.9834 22.1923 25.0333 23 23 23C20.9667 23 19.0166 22.1923 17.5788 20.7545C16.1411 19.3167 15.3333 17.3667 15.3333 15.3334C15.3333 13.3 16.1411 11.35 17.5788 9.9122C19.0166 8.47442 20.9667 7.66669 23 7.66669C25.0333 7.66669 26.9834 8.47442 28.4212 9.9122C29.8589 11.35 30.6667 13.3 30.6667 15.3334Z" fill={highContrast? "white" : "#3463A8"}/>
            </svg>
              <Typography variant="body1" paragraph style={{ margin: 0 }} ><strong style={{ color: highContrast? "#FFFF" : '#4183ba'  }}>Potencial de Aprendizagem de Todos</strong></Typography>
              </div>
              <div style={{display:'flex', alignItems:'center', justifyContent:'center', textAlign: 'center' }}>
                <Typography variant="body1" paragraph style={{ margin: 0, textAlign: 'justify' }} >
                Considera que todas as pessoas, independentemente de suas características intelectuais, sensoriais e físicas, têm potencial para aprender e ensinar, destacando a importância de estratégias pedagógicas que promovam vínculos afetivos e aquisição de conhecimento.
                </Typography>
              </div>
            </li>

            <li style={{background: 'rgba(92, 105, 114, 0.05)',  gap:'15px', listStyleType: 'none', padding:'15px', borderRadius: '10px', width: isMobile ? '16rem' : '25rem', height: '18rem', marginBottom:'10px'}}>
            <div style={{display:'flex', flexDirection: 'column', alignItems:'center', justifyContent:'center',}}>
            <svg width="92" height="92" viewBox="0 0 92 92" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15.3333 11.5C11.0783 11.5 7.66663 14.9117 7.66663 19.1667V57.5C7.66663 59.5333 8.47436 61.4834 9.91214 62.9212C11.3499 64.3589 13.3 65.1667 15.3333 65.1667H46V84.3333L57.5 72.8333L69 84.3333V65.1667H76.6666C78.7 65.1667 80.65 64.3589 82.0878 62.9212C83.5256 61.4834 84.3333 59.5333 84.3333 57.5V19.1667C84.3333 17.1333 83.5256 15.1833 82.0878 13.7455C80.65 12.3077 78.7 11.5 76.6666 11.5H15.3333ZM46 19.1667L57.5 26.8333L69 19.1667V32.5833L80.5 38.3333L69 44.0833V57.5L57.5 49.8333L46 57.5V44.0833L34.5 38.3333L46 32.5833V19.1667ZM15.3333 19.1667H34.5V26.8333H15.3333V19.1667ZM15.3333 34.5H26.8333V42.1667H15.3333V34.5ZM15.3333 49.8333H34.5V57.5H15.3333V49.8333Z" fill={highContrast? "white" : "#3463A8"}/>
            </svg>
              <Typography variant="body1" paragraph style={{ margin: 0 }} ><strong style={{ color: highContrast? "#FFFF" : '#4183ba'  }}>Processo de Aprendizagem Singular</strong></Typography>
              </div>
              <div style={{display:'flex', alignItems:'center', justifyContent:'center', textAlign: 'center' }}>
                <Typography variant="body1" paragraph style={{ margin: 0, textAlign: 'justify' }} >
                Reconhece que o processo de aprendizagem é único para cada indivíduo, enfatizando a necessidade de práticas educacionais flexíveis que atendam às necessidades específicas de cada estudante.
                </Typography>
              </div>
            </li>

            <li style={{background: 'rgba(92, 105, 114, 0.05)',  gap:'15px', listStyleType: 'none', padding:'15px', borderRadius: '10px', width: isMobile ? '16rem' : '25rem', height: '18rem'}}>
            <div style={{display:'flex', flexDirection: 'column', alignItems:'center', justifyContent:'center',}}>
            <svg width="92" height="80" viewBox="0 0 88 61" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M44 0.125L0 20.375L44 40.625L80 24.0538V47.375H88V20.375M16 34.4825V47.9825L44 60.875L72 47.9825V34.4825L44 47.375L16 34.4825Z" fill={highContrast? "white" : "#3463A8"}/>
            </svg>

              <Typography variant="body1" paragraph style={{ margin: 0 }} ><strong style={{ color: highContrast? "#FFFF" : '#4183ba'  }}>Benefícios do Convívio no Ambiente Escolar</strong></Typography>
              </div>
              <div style={{display:'flex', alignItems:'center', justifyContent:'center', textAlign: 'center' }}>
                <Typography variant="body1" paragraph style={{ margin: 0, textAlign: 'justify' }} >
                Destaca que a interação entre pessoas diversas é crucial para o desenvolvimento pleno, ampliando a percepção sobre pluralidade, estimulando a empatia e favorecendo competências intelectuais.
                </Typography>
              </div>
            </li>
            
            <li style={{background: 'rgba(92, 105, 114, 0.05)',  gap:'15px', listStyleType: 'none', padding:'15px', borderRadius: '10px', width: isMobile ? '16rem' : '25rem', height: '18rem'}}>
            <div style={{display:'flex', flexDirection: 'column', alignItems:'center', justifyContent:'center',}}>
            <svg width="92" height="80" viewBox="0 0 92 92" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M46 0C58.2 0 69.9002 4.84642 78.5269 13.4731C87.1536 22.0998 92 33.8 92 46C92 58.2 87.1536 69.9002 78.5269 78.5269C69.9002 87.1536 58.2 92 46 92C33.8 92 22.0998 87.1536 13.4731 78.5269C4.84642 69.9002 0 58.2 0 46C0 33.8 4.84642 22.0998 13.4731 13.4731C22.0998 4.84642 33.8 0 46 0ZM21.5625 34.5C20.4188 34.5 19.3219 34.9544 18.5131 35.7631C17.7044 36.5719 17.25 37.6688 17.25 38.8125C17.25 39.9562 17.7044 41.0531 18.5131 41.8619C19.3219 42.6706 20.4188 43.125 21.5625 43.125H35.4142C35.3553 43.4125 35.3073 43.7021 35.2705 43.9933L33.5053 58.4143L31.648 75.7275C31.526 76.8651 31.8609 78.0047 32.5791 78.8954C33.2973 79.7861 34.3399 80.355 35.4775 80.477C36.6151 80.599 37.7547 80.2641 38.6454 79.5459C39.5361 78.8277 40.105 77.7851 40.227 76.6475L41.6645 63.25H50.3413L51.7788 76.6475C51.8244 77.4257 52.0806 78.1768 52.5201 78.8206C52.9595 79.4644 53.5657 79.9767 54.2737 80.3027C54.9818 80.6286 55.7651 80.7561 56.54 80.6713C57.3149 80.5866 58.0521 80.2928 58.673 79.8215C59.2955 79.3537 59.7798 78.7261 60.0744 78.0053C60.369 77.2845 60.4629 76.4974 60.3462 75.7275L58.5063 58.4775L56.7295 43.9933C56.6927 43.7021 56.6447 43.4125 56.5857 43.125H70.4375C71.5812 43.125 72.6781 42.6706 73.4869 41.8619C74.2956 41.0531 74.75 39.9562 74.75 38.8125C74.75 37.6688 74.2956 36.5719 73.4869 35.7631C72.6781 34.9544 71.5812 34.5 70.4375 34.5H21.5625ZM46 34.5C47.5314 34.5346 49.0544 34.263 50.4794 33.7009C51.9044 33.1389 53.2028 32.2978 54.2982 31.2271C55.3937 30.1564 56.2643 28.8776 56.8587 27.4658C57.4532 26.054 57.7596 24.5377 57.76 23.0058C57.7604 21.474 57.4547 19.9575 56.861 18.5454C56.2672 17.1333 55.3973 15.8541 54.3024 14.7828C53.2074 13.7115 51.9095 12.8698 50.4847 12.3071C49.06 11.7443 47.5372 11.4719 46.0058 11.5057C43.001 11.5722 40.1417 12.8123 38.0399 14.9606C35.938 17.1089 34.7607 19.9946 34.76 23.0001C34.7592 26.0055 35.9351 28.8919 38.0359 31.0412C40.1366 33.1905 42.9953 34.4321 46 34.5Z" fill={highContrast? "white" : "#3463A8"}/>
            </svg>

              <Typography variant="body1" paragraph style={{ margin: 0 }} ><strong style={{ color: highContrast? "#FFFF" : '#4183ba'  }}>Inclusão de Todos na Diversidade</strong></Typography>
              </div>
              <div style={{display:'flex', alignItems:'center', justifyContent:'center', textAlign: 'center' }}>
                <Typography variant="body1" paragraph style={{ margin: 0, textAlign: 'justify' }} >
                Enfatiza que a educação inclusiva não se limita apenas às pessoas tradicionalmente excluídas, como aquelas com deficiência, mas abrange todos os estudantes, educadores, famílias e demais membros da comunidade escolar.
                </Typography>
              </div>
            </li>

          </ul>
          <Typography variant="h5" style={{ marginBottom: '1rem', color: highContrast ? "#FFFFFF" : 'inherit', fontWeight: highContrast ? "bold": "normal"  }} gutterBottom>
            <strong style={{color: highContrast? "white" :'rgba(92, 105, 114, 0.9)'}}>INCLUSÃO NA UFCG</strong>
          </Typography>
          <Typography variant="body1" paragraph sx={{color: highContrast ? "#FFFFFF" : 'inherit', fontWeight: highContrast ? "bold": "normal" }}> 
          A Universidade Federal de Campina Grande (UFCG) destaca-se por ter um dos maiores percentuais de inclusão de pessoas com deficiência (PcD) nos cursos de engenharia no Brasil, conforme revelado por um ranking da plataforma Responde Aí. O levantamento, baseado no Censo da Educação Superior entre 2016 e 2019, posiciona a UFCG em 15º lugar nacional e 5º no Nordeste, com um percentual de inclusão três vezes maior que a média nacional. Dos 3.835 estudantes de engenharia na UFCG, 57 são PcD, representando 1,5%.
          </Typography>
          <Typography variant="body1" paragraph sx={{color: highContrast ? "#FFFFFF" : 'inherit', fontWeight: highContrast ? "bold": "normal" }}> 
            Para promover a inclusão, a UFCG conta com o Núcleo de Acessibilidade e Inclusão (NAI), vinculado à Reitoria, que atende prioritariamente estudantes, podendo estender-se a servidores docentes e técnico-administrativos. A presença de PcD em cursos de engenharia aumentou em 36% no Brasil entre 2016 e 2019, enquanto o total de matriculados diminuiu mais de 13%. A taxa de inclusão na UFCG é superior à média nacional, evidenciando o comprometimento da instituição com a diversidade e a igualdade de oportunidades.
          </Typography>
          <Typography variant="body1" paragraph sx={{color: highContrast ? "#FFFFFF" : 'inherit', fontWeight: highContrast ? "bold": "normal" }}> 
            A Resolução nº 11/2016 cria o Núcleo de Acessibilidade e Inclusão (NAI) na Universidade Federal de Campina Grande (UFCG), vinculado à Reitoria, com o propósito de atender pessoas com deficiência física, sensorial, mental ou intelectual, transtornos globais do desenvolvimento e altas habilidades. O NAI está localizado na sede da UFCG em Campina Grande, mas também possui Setores de Apoio Local nos demais Campi. A finalidade principal é oferecer atendimento prioritário a estudantes, podendo ser estendido a servidores docentes e técnico-administrativos. A equipe técnica inclui profissionais de diversas áreas, como psicologia, assistência social, e libras, para garantir suporte abrangente.
          </Typography>
        
      </div>
      <Footer highContrast={highContrast}/>
    </ThemeProvider>
  );
};

export default About;
