import React, { useState, useEffect } from 'react';
import { Chart } from 'react-google-charts';
import * as XLSX from 'xlsx';
import { FormControl, InputLabel, Select, MenuItem, Grid, Typography } from '@mui/material';
import ReportTableDef from './ReportTableDef';
import ReportPizzaDef from './ReportPizzaDef';

function GraficoDeficienciasMaisComuns({ highContrast }) {
  const [dadosDeficiencias, setDadosDeficiencias] = useState([]);
  const [cursosDisponiveis, setCursosDisponiveis] = useState([]);
  const [campusDisponiveis, setCampusDisponiveis] = useState([]);
  const [cursoSelecionado, setCursoSelecionado] = useState('Todos');
  const [campusSelecionado, setCampusSelecionado] = useState('Todos');

  useEffect(() => {
    const processarPlanilha = async () => {
      try {
        const response = await fetch('/portadoresDeficiencia_semdadospessoais.xlsx');
        const arrayBuffer = await response.arrayBuffer();
        const workbook = XLSX.read(new Uint8Array(arrayBuffer), { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const dados = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        const alunosDeficientes = dados.slice(2).filter((row) => row[2] !== undefined && row[2] !== '');

        // Extrair cursos únicos e ordená-los alfabeticamente
        const cursos = Array.from(new Set(alunosDeficientes.map((aluno) => aluno[5]))).filter(Boolean).sort();
        setCursosDisponiveis(['Todos', ...cursos]);

        // Extrair campi únicos e ordená-los alfabeticamente
        const campus = Array.from(new Set(alunosDeficientes.map((aluno) => aluno[3]))).filter(Boolean).sort();
        setCampusDisponiveis(['Todos', ...campus]);

        const alunosFiltrados = alunosDeficientes.filter((aluno) => {
          if (cursoSelecionado !== 'Todos' && campusSelecionado !== 'Todos') {
            return aluno[3] === campusSelecionado && aluno[5] === cursoSelecionado;
          } else if (cursoSelecionado !== 'Todos') {
            return aluno[5] === cursoSelecionado;
          } else if (campusSelecionado !== 'Todos') {
            return aluno[3] === campusSelecionado;
          }
          return true;
        });

        const contagemPorDeficiencia = {};
        alunosFiltrados.forEach((aluno) => {
          const deficiencia = aluno[2];
          contagemPorDeficiencia[deficiencia] = (contagemPorDeficiencia[deficiencia] || 0) + 1;
        });

        const dadosDeficiencias = Object.keys(contagemPorDeficiencia).map((deficiencia) => ({
          deficiencia,
          quantidade: contagemPorDeficiencia[deficiencia],
          campus: alunosFiltrados.find((aluno) => aluno[2] === deficiencia)[3], // Adicionando o campus ao dado da deficiência
          curso: alunosFiltrados.find((aluno) => aluno[2] === deficiencia)[5], // Adicionando o curso ao dado da deficiência
        }));

        dadosDeficiencias.sort((a, b) => b.quantidade - a.quantidade);

        setDadosDeficiencias(dadosDeficiencias);
      } catch (error) {
        console.error('Erro ao processar a planilha:', error);
      }
    };
    processarPlanilha();
  }, [cursoSelecionado, campusSelecionado]);

  const handleChangeCurso = (event) => {
    const cursoSelecionado = event.target.value;
    setCursoSelecionado(cursoSelecionado);
  };

  const handleChangeCampus = (event) => {
    const campusSelecionado = event.target.value;
    setCampusSelecionado(campusSelecionado);
  };

  return (
    <div>
      <h2 style={{color: highContrast ? "#ffff" : 'inherit', fontWeight: highContrast ? "bold": "normal" }}>Mapeamento das Deficiências Mais Prevalentes na UFCG</h2>
      <Typography variant="body1" paragraph style={{ marginBottom: '1rem', color: highContrast ? "#FFFFFF" : 'inherit', fontWeight: highContrast ? "bold": "normal" }}>
      Este gráfico apresenta um mapeamento das deficiências mais prevalentes entre os estudantes da Universidade Federal de Campina Grande (UFCG). Ele oferece uma visão detalhada das principais deficiências encontradas na comunidade acadêmica, permitindo uma análise aprofundada da diversidade de necessidades especiais presentes na instituição. Além disso, você pode filtrar os resultados por curso e campus para obter uma compreensão ainda mais precisa da distribuição dessas deficiências em diferentes áreas da universidade.      </Typography >
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <FormControl sx={{ minWidth: 200, marginRight: '1rem', background: highContrast ? "#FFFFFF" : 'inherit' }}>
            <InputLabel sx={{backgroundColor: highContrast ? "#FFFFFF":'inherit', fontWeight: highContrast ? "bold": "normal", color: highContrast? '#050834' : ""}} id="curso-label">Filtrar por Curso:</InputLabel>
            <Select
              labelId="curso-label"
              id="curso"
              value={cursoSelecionado}
              label="Filtrar por Curso"
              onChange={handleChangeCurso}
            >
              {cursosDisponiveis.map((curso, index) => (
                <MenuItem key={index} value={curso}>{curso}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl sx={{ minWidth: 200, background: highContrast ? "#FFFFFF" : 'inherit' }}>
            <InputLabel sx={{backgroundColor: highContrast ? "#FFFFFF":'inherit', fontWeight: highContrast ? "bold": "normal", color: highContrast? '#050834': ''}} id="campus-label">Filtrar por Campus:</InputLabel>
            <Select
              labelId="campus-label"
              id="campus"
              value={campusSelecionado}
              label="Filtrar por Campus"
              onChange={handleChangeCampus}
            >
              {campusDisponiveis.map((campus, index) => (
                <MenuItem key={index} value={campus}>{campus}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <Chart
            width={'100%'}
            height={'400px'}
            chartType="BarChart"
            loader={<div>Loading Chart</div>}
            data={[
              ['Deficiência', 'Quantidade'],
              ...dadosDeficiencias.map((item) => [item.deficiencia, item.quantidade]),
            ]}
            options={{
              title: 'Deficiências Mais Comuns',
              legend: { position: 'bottom' },
              chartArea: { width: '70%', height: '70%', left: '20%' },
            }}
          />
        </Grid>
        <Grid sx={{marginTop:'6rem'}} item xs={6}>
          <ReportTableDef highContrast={highContrast}/>
        </Grid>
        <Grid sx={{marginTop:'6rem'}} item xs={6}>
          <ReportPizzaDef  highContrast={highContrast}/>
        </Grid>
      </Grid>
    </div>
  );
}


export default GraficoDeficienciasMaisComuns;
