import React, { useRef, useState, useEffect  } from 'react';
import { Typography, Paper, ThemeProvider, CssBaseline, createTheme } from '@mui/material';
import Header from '../Header';
import Footer from '../Footer';
import { useHotkeys } from 'react-hotkeys-hook';
import VLibras from '@moreiraste/react-vlibras'

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
  // const toggleHighContrast = () => {
  //   setHighContrast(prevHighContrast => !prevHighContrast); 
  // };

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
      <VLibras forceOnload={true}/>
      <div ref={bodyRef} style={{  backgroundColor: highContrast ? "#000000" : '', minHeight: '100vh' }}>
        <Paper elevation={3} style={{ padding: '2rem', borderRadius: '10px',  backgroundColor: highContrast ? "#000000" : '' }}>
          <img
            src="/about-image.jpg"
            alt="Sobre a Iniciativa"
            title="Pessoa lendo um livro"
            style={{
              width: '100%', 
              height: '24vw', 
              objectFit: 'cover', 
              marginBottom: '1rem',
              borderRadius: '10px'
            }}
          />
          <Typography variant="h3" gutterBottom sx={{ color: highContrast ? "#FFFF00" : 'inherit'}}>
            Sobre a Iniciativa
          </Typography>
          <Typography variant="h5" paragraph style={{ marginBottom: '1rem', color: highContrast ? "#FFFF00" : 'inherit' }}>
            O QUE É ENSINO INCLUSIVO?
          </Typography>
          <Typography variant="body1" paragraph style={{ marginBottom: '1rem', color: highContrast ? "#FFFFFF" : 'inherit', fontWeight: highContrast ? "bold": "normal" }}>
            A Educação Inclusiva é uma abordagem contemporânea que busca garantir o direito de todos à educação, promovendo a igualdade de oportunidades e valorizando as diversidades humanas. Seus princípios fundamentais são:
            </Typography >
          <ul style={{color: highContrast ? "#FFFFFF" : 'inherit', fontWeight: highContrast ? "bold": "normal" }}>
            <li >
              <Typography variant="body1" paragraph>
              <strong>Reito de Acesso à Educação:</strong> Todos têm o direito de acesso à educação de qualidade na escola regular, com atendimento especializado conforme suas especificidades, alinhado com princípios internacionais de direitos humanos.
              </Typography>
            </li>
            <li>
              <Typography variant="body1" paragraph>
              <strong>Potencial de Aprendizagem de Todos:</strong> Considera que todas as pessoas, independentemente de suas características intelectuais, sensoriais e físicas, têm potencial para aprender e ensinar, destacando a importância de estratégias pedagógicas que promovam vínculos afetivos e aquisição de conhecimento.
              </Typography>
            </li>
            <li>
              <Typography variant="body1" paragraph>
              <strong>Processo de Aprendizagem Singular:</strong> Reconhece que o processo de aprendizagem é único para cada indivíduo, enfatizando a necessidade de práticas educacionais flexíveis que atendam às necessidades específicas de cada estudante.
              </Typography>
            </li>
            <li>
              <Typography variant="body1" paragraph>
              <strong>Benefícios do Convívio no Ambiente Escolar: </strong> Destaca que a interação entre pessoas diversas é crucial para o desenvolvimento pleno, ampliando a percepção sobre pluralidade, estimulando a empatia e favorecendo competências intelectuais.
              </Typography>
            </li>
            <li>
              <Typography variant="body1" paragraph>
              <strong>Inclusão de Todos na Diversidade: </strong> Enfatiza que a educação inclusiva não se limita apenas às pessoas tradicionalmente excluídas, como aquelas com deficiência, mas abrange todos os estudantes, educadores, famílias e demais membros da comunidade escolar.
              </Typography>
            </li>
          </ul>
          <Typography variant="h5" style={{ marginBottom: '1rem', color: highContrast ? "#FFFFFF" : 'inherit', fontWeight: highContrast ? "bold": "normal"  }} gutterBottom>
             INCLUSÃO NA UFCG
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
        </Paper>
      </div>
      <Footer highContrast={highContrast}/>
    </ThemeProvider>
  );
};

export default About;
