import React, { useState, useEffect } from 'react';
import { ThemeProvider, CssBaseline, createTheme, Table, TableHead, TableBody, TableRow, TableCell, FormControl, InputLabel, Select, MenuItem, Button } from '@mui/material';
import Header from './Header';
import Footer from './Footer';
import { VictoryBar, VictoryChart, VictoryAxis, VictoryTheme } from 'victory';
import html2pdf from 'html2pdf.js';

const generateFakeData = () => {
  const courses = ['Engenharia', 'Medicina', 'Direito', 'Administração', 'Ciência da Computação'];
  const data = courses.map(course => {
    const percentage = Math.floor(Math.random() * 21);
    return { course, percentage };
  });
  return data;
};
const Reports = () => {
  const [data, setData] = useState(generateFakeData());
  const [selectedCourse, setSelectedCourse] = useState('Todos');
  const [highContrast, setHighContrast] = useState();


  const theme = createTheme({
    typography: {
      fontFamily: [
        'Marko One',
        'sans-serif',
      ].join(','),
    },
  });

  const chartStyle = {
    parent: {
      background: highContrast ? '#fff' : 'transparent',
      color: highContrast ? '#000' : '#fff',
    },
  };


  const handleCourseChange = (event) => {
    setSelectedCourse(event.target.value);
  };

  const filteredData = selectedCourse === 'Todos' ? data : data.filter(item => item.course === selectedCourse);

  const handleDownloadPDF = () => {
    const element = document.getElementById('report-content');
    const options = {
      margin: 1,
      filename: 'relatorio_estudantes_deficientes.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' },
    };
    html2pdf().from(element).set(options).save();
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
      <div id="report-content" style={{ display: 'flex', justifyContent: 'space-between', margin: '2rem auto', padding: '1rem', backgroundColor: highContrast ? "#000000" : '', minHeight: "100vh" }}>
        <div style={{ marginLeft: '10vh', marginRight: '10vh' }}>
          <h2 style={{ color: highContrast ? "#fff" : 'inherit', fontWeight: highContrast ? "bold" : "normal" }}>Relatório de Estudantes Deficientes por Curso</h2>
          <FormControl fullWidth>
            <InputLabel id="select-course-label" style={{ background: highContrast ? "#FFFF00" : 'inherit', fontWeight: highContrast ? "bold" : "normal" }}>Selecione o Curso</InputLabel>
            <Select
              labelId="select-course-label"
              id="select-course"
              value={selectedCourse}
              onChange={handleCourseChange}
              inputProps={{ 'aria-label': 'Without label' }}
              style={{ marginBottom: '1rem', background: highContrast ? "#fff" : '', fontWeight: highContrast ? "bold" : "normal" }}
              InputLabelProps={{
                style: { background: highContrast ? "#FFFF00" : 'inherit', fontWeight: highContrast ? "bold" : "normal" }
              }}
              sx={{
                '& fieldset': {
                  borderColor: highContrast ? "#FFFF00" : '',
                  borderWidth: '0.2rem'
                }
              }}
            >
              <MenuItem value="Todos">Todos</MenuItem>
              {data.map(item => (
                <MenuItem key={item.course} value={item.course}>{item.course}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <div style={{ width: '50%', marginRight: '1rem' }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell style={{ fontWeight: highContrast ? 'bold' : 'normal', color: highContrast ? '#FFFFFF' : '' }}>Curso</TableCell>
                  <TableCell style={{ fontWeight: highContrast ? 'bold' : 'normal', color: highContrast ? '#FFFFFF' : '' }}>Porcentagem de Estudantes Deficientes</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredData.map(item => (
                  <TableRow key={item.course} style={{ fontWeight: highContrast ? 'bold' : 'normal', color: highContrast ? '#FFFFFF' : '' }}>
                    <TableCell style={{ fontWeight: highContrast ? 'bold' : 'normal', color: highContrast ? '#FFFFFF' : '' }}>{item.course}</TableCell>
                    <TableCell style={{ fontWeight: highContrast ? 'bold' : 'normal', color: highContrast ? '#FFFFFF' : '' }}>{`${item.percentage}%`}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
        <div>
          <div style={{ width: '100%', marginLeft: "-2rem" }}>
            <VictoryChart theme={VictoryTheme.material} style={chartStyle}>
              <VictoryBar
                data={filteredData}
                x="course"
                y="percentage"
                labels={({ datum }) => `${datum.course}: ${datum.percentage}%`}
              />
              <VictoryAxis />
              <VictoryAxis dependentAxis />
            </VictoryChart>
          </div>
        </div>
      </div>
      <div style={{ textAlign: 'center', marginBottom: '2rem', marginTop: "-13rem" }}>
        <Button variant="contained" color="primary" onClick={handleDownloadPDF} sx={{
          backgroundColor: highContrast ? '#FFFF00' : '#1976d2',
          color: highContrast ? '#000000' : '#fff',
          fontWeight: 'bold',
          '&:hover': {
            backgroundColor: highContrast ? '#FFFF00' : '#0d56a6',
          }
        }}>
          Baixar Relatório em PDF
        </Button>
      </div>
      <Footer highContrast={highContrast} />
    </ThemeProvider>
  );
}



export default Reports;
