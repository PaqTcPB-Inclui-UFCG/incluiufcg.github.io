import React, { useState, useEffect } from 'react';
import { Paper, Typography, Grid } from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import * as XLSX from 'xlsx';
import { ptBR } from '@mui/x-data-grid/locales';
import ReportCampus from './ReportCampus';


function TotalAlunosDeficientes({ highContrast }) {
  const [totalAlunosDeficientes, setTotalAlunosDeficientes] = useState(0);
  const [dados, setDados] = useState([]);
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [itensPorPagina, setItensPorPagina] = useState(5);

  useEffect(() => {
    const calcularTotalAlunosDeficientes = async () => {
      try {
        const response = await fetch('/portadoresDeficiencia_semdadospessoais.xlsx');
        const arrayBuffer = await response.arrayBuffer();
        const workbook = XLSX.read(new Uint8Array(arrayBuffer), { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const dados = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
    
        console.log('Dados da planilha:', dados);

        setDados(dados);
    
        const matriculasUnicas = new Set();
        dados.slice(2).forEach((row) => {
          if (row[2] !== undefined && row[2] !== '') {
            matriculasUnicas.add(row[0]); 
          }
        });
    
        console.log('Matrículas únicas:', Array.from(matriculasUnicas));
    
        const total = matriculasUnicas.size;
        console.log('Total de alunos deficientes:', total);
        setTotalAlunosDeficientes(total);
      } catch (error) {
        console.error('Erro ao processar a planilha:', error);
      }
    };
    
    calcularTotalAlunosDeficientes();
  }, []);

  const handleChangePagina = (event, value) => {
    setPaginaAtual(value);
  };
  
  const handleChangeItensPorPagina = (event) => {
    setItensPorPagina(event.target.value);
    setPaginaAtual(1);
  };

  const cursosDeficientes = dados.slice(2).reduce((accumulator, item) => {
    const curso = item[5];
    if (accumulator[curso]) {
      accumulator[curso]++;
    } else {
      accumulator[curso] = 1;
    }
    return accumulator;
  }, {});

  const totalGeral = Object.values(cursosDeficientes).reduce((total, count) => total + count, 0);
  const rows = Object.keys(cursosDeficientes).map((curso, index) => ({
    id: index,
    curso,
    totalDeficientes: cursosDeficientes[curso],
    percentual: ((cursosDeficientes[curso] / totalGeral) * 100).toFixed(2),
  }));

  const columns = [
    { field: 'curso', headerName: 'Curso', width: 200 },
    { field: 'totalDeficientes', headerName: 'Total de Deficientes', width: 200 },
    { field: 'percentual', headerName: 'Porcentagem', width: 200 },
  ];

  return (
    <div>
      <Paper elevation={3} style={{ padding: '20px', marginBottom: '20px' }}>
        <Typography variant="h5" component="div" gutterBottom>
          Total Geral de Alunos Deficientes
        </Typography>
        <Typography variant="h3" component="div">
          {totalAlunosDeficientes}
        </Typography>
      </Paper>
      <Grid container spacing={3}>
      <Grid item xs={6}>
        <ReportCampus  highContrast={highContrast}/>
        </Grid>
        <Grid item xs={6}>
        <h2 style={{color: highContrast ? "#ffff" : 'inherit', fontWeight: highContrast ? "bold": "normal" }}>Quantidade de Alunos Deficientes por Curso</h2>
          <DataGrid
            style={{color: highContrast ? "#ffff" : 'inherit', fontWeight: highContrast ? "bold": "normal" }}
            rows={rows}
            columns={columns}
            localeText={ptBR.components.MuiDataGrid.defaultProps.localeText}
            slots={{ toolbar: GridToolbar }}
            onPageChange={handleChangePagina}
            pageSizeOptions={[5, 10,15, 25]}
            initialState={{
                pagination: { paginationModel: { pageSize: 5 } },
              }}
            onPageSizeChange={handleChangeItensPorPagina}
          />
        </Grid>
      </Grid>
    </div>
  );
}

export default TotalAlunosDeficientes;
