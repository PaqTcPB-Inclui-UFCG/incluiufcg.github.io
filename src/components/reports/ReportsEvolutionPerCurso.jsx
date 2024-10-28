import React, { useState, useEffect } from 'react';
import { Chart } from 'react-google-charts';
import * as XLSX from 'xlsx';
import { Select, MenuItem, InputLabel, FormControl, Typography } from '@mui/material';

function GraficoEvolucaoAlunosDeficientesPorCurso({ highContrast }) {
  const [dadosPorCurso, setDadosPorCurso] = useState({});
  const [cursoSelecionado, setCursoSelecionado] = useState('');

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

        const evolucaoPorCurso = {};
        alunosDeficientes.forEach((aluno) => {
          const curso = aluno[5];
          const ano = parseInt(aluno[1]);
          const trimestre = aluno[1].split('.')[1]; 
          const chave = `${ano}.${trimestre}`;

          if (!evolucaoPorCurso[curso]) {
            evolucaoPorCurso[curso] = {};
          }

          if (!evolucaoPorCurso[curso][chave]) {
            evolucaoPorCurso[curso][chave] = new Set();
          }

          evolucaoPorCurso[curso][chave].add(aluno[0]); // Adiciona a matrícula ao conjunto
        });

        Object.keys(evolucaoPorCurso).forEach((curso) => {
          const dadosCurso = evolucaoPorCurso[curso];
          evolucaoPorCurso[curso] = Object.keys(dadosCurso).sort((a, b) => {
            const [anoA, trimestreA] = a.split('.');
            const [anoB, trimestreB] = b.split('.');
            if (anoA !== anoB) {
              return anoA - anoB;
            }
            return trimestreA - trimestreB;
          }).reduce((acc, key) => {
            acc[key] = dadosCurso[key];
            return acc;
          }, {});
        });

        setDadosPorCurso(evolucaoPorCurso);
      } catch (error) {
        console.error('Erro ao processar a planilha:', error);
      }
    };
    processarPlanilha();
  }, []);

  const handleChangeCurso = (event) => {
    setCursoSelecionado(event.target.value);
  };

  return (
    <div>
<h2 style={{ color: highContrast ? "#ffff" : 'inherit', fontWeight: highContrast ? "bold" : "normal" }}>Evolução de Ingresso de Alunos Deficientes na UFCG por Curso</h2>
      <Typography variant="body1" paragraph style={{ marginBottom: '1rem',color: highContrast ? "#FFFFFF" : 'inherit', fontWeight: highContrast ? "bold" : "normal" }}>
        Explore a Evolução da Matrícula de Estudantes com PCD (Pessoas com Deficiência) na UFCG (Universidade Federal de Campina Grande), detalhada por Curso. </Typography >      <FormControl sx={{ minWidth: 200, background: highContrast ? "#FFFFFF" : 'inherit' }}>
        <InputLabel sx={{ backgroundColor: highContrast ? "#FFFFFF" : 'inherit', fontWeight: highContrast ? "bold" : "normal", color: highContrast? '#050834' : '' }} id="curso-label">Filtrar por Curso:</InputLabel>
        <Select
          value={cursoSelecionado}
          onChange={handleChangeCurso}
          labelId="curso"
          id="curso"
        >
          <MenuItem value="">Selecione um curso</MenuItem>
          {Object.keys(dadosPorCurso).map((curso) => (
            <MenuItem key={curso} value={curso}>{curso}</MenuItem>
          ))}
        </Select>
      </FormControl>
      {cursoSelecionado && dadosPorCurso[cursoSelecionado] && (
        <Chart
          width={'100%'}
          height={'400px'}
          chartType="LineChart"
          loader={<div>Loading Chart</div>}
          data={[
            ['Trimestre', 'Alunos Deficientes'],
            ...Object.entries(dadosPorCurso[cursoSelecionado]).map(([chave, matriculas]) => [chave, matriculas.size]), // Usamos matriculas.size para obter o tamanho do conjunto (número de matrículas únicas)
          ]}
          options={{
            title: `Evolução de Alunos Deficientes por Trimestre - ${cursoSelecionado}`,
            curveType: 'none',
            legend: { position: 'bottom' },
            hAxis: {
              slantedText: true,
            },
          }}
          rootProps={{ 'data-testid': '1' }}
        />
      )}
    </div>
  );
}

export default GraficoEvolucaoAlunosDeficientesPorCurso;
