import React, { useState } from 'react';
import { ThemeProvider, CssBaseline, createTheme, Button, Typography } from '@mui/material';
import Header from './Header';
import Footer from './Footer';
import { VictoryChart, VictoryLine, VictoryTheme } from 'victory';
import html2pdf from 'html2pdf.js';

const generateFakeData = () => {
  const years = ['2010', '2011', '2012', '2013', '2014', '2015', '2016', '2017', '2018', '2019', '2020', '2021', '2022'];
  const data = years.map((year, index) => {
    const students = Math.floor(Math.random() * 1000) + 500; // Gera um número aleatório de estudantes
    return { year, students };
  });
  return data;
};

const EnrollmentReport = () => {
  const [data, setData] = useState(generateFakeData());

  const theme = createTheme({
    typography: {
      fontFamily: [
        'Marko One',
        'sans-serif',
      ].join(','),
    },
  });

  const handleDownloadPDF = () => {
    const element = document.getElementById('report-content');
    const options = {
      margin: 1,
      filename: 'relatorio_adesao_estudantes.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' },
    };
    html2pdf().from(element).set(options).save();
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Header />
      <div id="report-content" style={{ margin: '2rem auto', padding: '1rem', maxWidth: '800px'}}>
        <Typography variant="h2" gutterBottom>
          Relatório de Evolução da Adesão de Estudantes na UFCG
        </Typography>
        <VictoryChart theme={VictoryTheme.material} sx={{ minHeight: '500px' }}>
          <VictoryLine
            data={data}
            x="year"
            y="students"
            style={{ data: { stroke: '#3f51b5' } ,
                tickLabels: { padding: 60, margin: 32 }, // Adiciona padding aos rótulos dos ticks
              }}
          />
        </VictoryChart>
        <Button variant="contained" color="primary" onClick={handleDownloadPDF}>
          Baixar Relatório em PDF
        </Button>
      </div>
      <Footer />
    </ThemeProvider>
  );
};

export default EnrollmentReport;
