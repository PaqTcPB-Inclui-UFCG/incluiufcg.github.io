import React, { useState, useEffect } from 'react';
import { Chart } from 'react-google-charts';
import * as XLSX from 'xlsx';
import { Select, MenuItem, InputLabel, FormControl, Typography } from '@mui/material';


function GraficoEvolucaoAlunosDeficientes({ highContrast }) {
  const [dadosPorCampus, setDadosPorCampus] = useState({});
  const [campusSelecionado, setCampusSelecionado] = useState('');

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

        const evolucaoPorCampus = {};
        alunosDeficientes.forEach((aluno) => {
          const campus = aluno[3];
          const ano = parseInt(aluno[1]);
          const trimestre = aluno[1].split('.')[1]; 
          const chave = `${ano}.${trimestre}`;

          if (!evolucaoPorCampus[campus]) {
            evolucaoPorCampus[campus] = {};
          }

          if (!evolucaoPorCampus[campus][chave]) {
            evolucaoPorCampus[campus][chave] = new Set();
          }

          evolucaoPorCampus[campus][chave].add(aluno[0]); 
        });

        Object.keys(evolucaoPorCampus).forEach((campus) => {
          const dadosCampus = evolucaoPorCampus[campus];
          evolucaoPorCampus[campus] = Object.keys(dadosCampus).sort((a, b) => {
            const [anoA, trimestreA] = a.split('.');
            const [anoB, trimestreB] = b.split('.');
            if (anoA !== anoB) {
              return anoA - anoB;
            }
            return trimestreA - trimestreB;
          }).reduce((acc, key) => {
            acc[key] = dadosCampus[key];
            return acc;
          }, {});
        });

        setDadosPorCampus(evolucaoPorCampus);
      } catch (error) {
        console.error('Erro ao processar a planilha:', error);
      }
    };
    processarPlanilha();
  }, []);

  const handleChangeCampus = (event) => {
    setCampusSelecionado(event.target.value);
  };

  return (
    <div>
      <h2 style={{ color: highContrast ? "#ffff" : 'inherit', fontWeight: highContrast ? "bold" : "normal" }}>Evolução de Ingresso de Alunos Deficientes na UFCG por Campus</h2>
      <Typography variant="body1" paragraph style={{ marginBottom: '1rem',color: highContrast ? "#FFFFFF" : 'inherit', fontWeight: highContrast ? "bold" : "normal" }}>
        Explore a Evolução da Matrícula de Estudantes com PCD (Pessoas com Deficiência) na UFCG (Universidade Federal de Campina Grande), detalhada por Campus. </Typography >
      <FormControl sx={{ minWidth: 200, background: highContrast ? "#FFFFFF" : 'inherit' }}>
        <InputLabel sx={{ backgroundColor: highContrast ? "#FFFFFF" : 'inherit', fontWeight: highContrast ? "bold" : "normal", color: highContrast? '#050834' : '' }} id="campus-label">Filtrar por Campus:</InputLabel>
        <Select
          value={campusSelecionado}
          onChange={handleChangeCampus}
          labelId="campus"
          id="campus"
        >
          <MenuItem value="">Selecione um campus</MenuItem>
          {Object.keys(dadosPorCampus).map((campus) => (
            <MenuItem key={campus} value={campus}>{campus}</MenuItem>
          ))}
        </Select>
      </FormControl>
      {campusSelecionado && dadosPorCampus[campusSelecionado] && (
        <Chart
          width={'100%'}
          height={'400px'}
          chartType="LineChart"
          loader={<div>Loading Chart</div>}
          data={[
            ['Trimestre', 'Alunos Deficientes'],
            ...Object.entries(dadosPorCampus[campusSelecionado]).map(([chave, matriculas]) => [chave, matriculas.size]), // Usamos matriculas.size para obter o tamanho do conjunto (número de matrículas únicas)
          ]}
          options={{
            title: `Evolução de Alunos Deficientes por Trimestre - ${campusSelecionado}`,
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

export default GraficoEvolucaoAlunosDeficientes;
