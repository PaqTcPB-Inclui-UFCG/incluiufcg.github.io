import React, { useState, useEffect } from 'react';
import { Chart } from 'react-google-charts';
import * as XLSX from 'xlsx';
import { Typography } from '@mui/material';


function GraficoEvolucaoAlunosDeficientes({ highContrast }) {
  const [dadosEvolucao, setDadosEvolucao] = useState([]);

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

        const contagemPorAno = {};
        alunosDeficientes.forEach((aluno) => {
          const ano = parseInt(aluno[1]);
          const trimestre = aluno[1].split('.')[1]; 
          const chave = `${ano}.${trimestre}`;
          contagemPorAno[chave] = (contagemPorAno[chave] || 0) + 1;
        });

        const dadosEvolucao = Object.keys(contagemPorAno).map((chave) => ({
          chave,
          quantidade: contagemPorAno[chave],
        }));

        dadosEvolucao.sort((a, b) => {
          const [anoA, trimestreA] = a.chave.split('.');
          const [anoB, trimestreB] = b.chave.split('.');
          if (anoA !== anoB) {
            return anoA - anoB;
          }
          return trimestreA - trimestreB;
        });

        setDadosEvolucao(dadosEvolucao);
      } catch (error) {
        console.error('Erro ao processar a planilha:', error);
      }
    };
    processarPlanilha();
  }, []);

  return (
    <div>
      <h2 style={{color: highContrast ? "#ffff" : 'inherit', fontWeight: highContrast ? "bold": "normal" }}>Evolução da Ingresso de Estudantes com PCD por Período na UFCG</h2>
      <Typography variant="body1" paragraph style={{ marginBottom: '1rem', color: highContrast ? "#FFFFFF" : 'inherit', fontWeight: highContrast ? "bold": "normal" }}>
      Aqui está a evolução dos alunos com PCD matriculados ao longo do tempo, divididos por semestre. Esses gráficos fornecem uma visão abrangente da presença e distribuição desses alunos em diferentes períodos letivos, permitindo uma análise detalhada das tendências ao longo do tempo.</Typography >
      <Chart
        width={'100%'}
        height={'400px'}
        chartType="LineChart"
        loader={<div>Loading Chart</div>}
        data={[
          ['Trimestre', 'Alunos Deficientes'],
          ...dadosEvolucao.map((item) => [item.chave, item.quantidade]),
        ]}
        options={{
          title: 'Evolução de Ingressos de Alunos Deficientes por Período',
          curveType: 'none',
          legend: { position: 'bottom' },
          hAxis: {
            slantedText: true, 
          },
        }}
        rootProps={{ 'data-testid': '1' }}
      />
    </div>
  );
}

export default GraficoEvolucaoAlunosDeficientes;
