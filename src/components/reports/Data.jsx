import { useRef, useState, useEffect } from 'react';
import { Typography, Paper, ThemeProvider, CssBaseline, createTheme, Divider, Button, CircularProgress, Grid } from '@mui/material';
import html2canvas from 'html2canvas';
import html2pdf from 'html2pdf.js';
import ReportDef from './ReportDef';
import ReportEvolution from './ReportEvolution';
import ReportTrend from './ReportTrend';
import ReportSum from './ReportSum';
import Header from '../Header';
import Footer from '../Footer';
import ReportsEvolutionPerCampus from './ReportsEvolutionPerCampus';
import ReportsEvolutionPerCurso from "./ReportsEvolutionPerCurso";
import ReportMultDef from './ReportMultDef';

const theme = createTheme({
  typography: {
    fontFamily: [
      'Marko One',
      'sans-serif',
    ].join(','),
  },
});

function ComponentePrincipal() {
  const contentRef = useRef();
  const [highContrast, setHighContrast] = useState();
  const [isRendered, setIsRendered] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  useEffect(() => {
    setIsRendered(true);
  }, []);

  const tirarPrint = () => {
    const element = contentRef.current;

    html2canvas(element).then(canvas => {
      const screenshot = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = screenshot;
      link.download = 'relatorio-pcd-ufcg.png';
      link.click();
    });
  };

  const gerarPDF = () => {
    setIsGeneratingPDF(true);

    setTimeout(() => {
      const element = contentRef.current;
      const opt = {
        filename: 'relatorio.pdf',
        image: { type: 'jpeg', quality: 1 },
        html2canvas: { scale: 4 },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'landscape' }
      };
      html2pdf().from(element).set(opt).save();

      setIsGeneratingPDF(false);
    }, 1000);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Header highContrast={highContrast} setHighContrast={setHighContrast} />
      <div style={{ backgroundColor: highContrast ? '#050834' : '' }}>
        <div style={{ padding: '2rem', marginBottom: '2rem', marginLeft: '4rem', marginRight: '4rem', backgroundColor: highContrast ? '#050834' : '' }} ref={contentRef}>
          <Paper elevation={3} style={{ padding: '2rem', borderRadius: '10px', backgroundColor: highContrast ? '#050834' : '' }}>
            <div>
              <Button onClick={tirarPrint} variant="contained" style={{backgroundColor: highContrast ? "white" : '',  color: highContrast ? "#050834" : "white", marginRight: '1rem' }}>Baixar em JPEG</Button>
              <Button onClick={gerarPDF} variant="contained" style={{backgroundColor: highContrast ? "white" : '',  color: highContrast ? "#050834" : "white"}} disabled={isGeneratingPDF}>
                {isGeneratingPDF ? <CircularProgress size={24} color="inherit" /> : 'Gerar PDF'}
              </Button>
              <div>
                {isRendered && (
                  <>
                    <ReportEvolution highContrast={highContrast} />
                    <Divider variant="middle" style={{ margin: '1rem 0',   marginTop: '2rem', backgroundColor: highContrast ? "#fff": "inherit" }} />
                    <Typography variant="h5" paragraph style={{ marginBottom: '1rem',color: highContrast ? "#FFFFFF" : 'inherit', fontWeight: highContrast ? "bold" : "normal" }}>
                      Evolução da Matrícula de Estudantes com PCD por Período e por Campus e Curso
                    </Typography >
                    <Typography variant="body1" paragraph style={{ marginBottom: '1rem',color: highContrast ? "#FFFFFF" : 'inherit', fontWeight: highContrast ? "bold" : "normal" }}>
                    Explore a Evolução da Matrícula de Estudantes com PCD (Pessoas com Deficiência) na UFCG (Universidade Federal de Campina Grande), detalhada por semestre, Campus e Curso. Este conjunto de dados abrange registros a partir de 2015, fornecendo insights valiosos sobre a inclusão e distribuição dos alunos com PCD ao longo do tempo e em diferentes áreas de estudo dentro da universidade.                    </Typography >
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <ReportsEvolutionPerCampus highContrast={highContrast} />
                      </Grid>
                      <Grid item xs={6}>
                        <ReportsEvolutionPerCurso highContrast={highContrast} />
                      </Grid>
                    </Grid>
                    <Divider variant="middle" style={{ margin: '1rem 0',   marginTop: '2rem', backgroundColor: highContrast ? '#050834': "inherit" }} />
                    <ReportDef highContrast={highContrast} />
                    <ReportSum highContrast={highContrast} />
                    <ReportMultDef highContrast={highContrast} />
                  </>
                )}
              </div>
            </div>
          </Paper>
        </div>
      </div>
      <Footer highContrast={highContrast} />
    </ThemeProvider>
  );
}

export default ComponentePrincipal;
