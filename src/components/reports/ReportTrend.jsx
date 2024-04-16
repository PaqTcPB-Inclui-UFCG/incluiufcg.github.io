import React, { useState, useEffect } from 'react';
import { Chart } from 'react-google-charts';
import * as XLSX from 'xlsx';

function TendenciasTemporaisIngressos({ highContrast }) {
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

        const contagemPorAnoTrimestre = {};
        alunosDeficientes.forEach((aluno) => {
          const ano = parseInt(aluno[1]);
          const trimestre = aluno[1].split('.')[1];
          const chave = `${ano}-${trimestre}`;
          contagemPorAnoTrimestre[chave] = (contagemPorAnoTrimestre[chave] || 0) + 1;
        });

        const dadosEvolucao = Object.keys(contagemPorAnoTrimestre).map((chave) => ({
          chave,
          quantidade: contagemPorAnoTrimestre[chave],
        }));

        dadosEvolucao.sort((a, b) => {
          const [anoA, trimestreA] = a.chave.split('-');
          const [anoB, trimestreB] = b.chave.split('-');
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
      <h2 style={{color: highContrast ? "#ffff00" : 'inherit', fontWeight: highContrast ? "bold": "normal" }}
>Tendências Temporais de Ingresso de Alunos com Deficiência</h2>
      <Chart
        width={'100%'}
        height={'400px'}
        chartType="LineChart"
        loader={<div>Loading Chart</div>}
        data={[
          ['Período', 'Alunos Deficientes'],
          ...dadosEvolucao.map((item) => [item.chave, item.quantidade]),
        ]}
        options={{
          title: 'Variações Sazonais na Quantidade de Ingressos de Alunos com Deficiência',
          curveType: 'function',
          legend: { position: 'bottom' },
          hAxis: {
            title: 'Período',
            slantedText: true,
          },
          vAxis: {
            title: 'Alunos Deficientes',
          },
        }}
        rootProps={{ 'data-testid': '1' }}
      />
    </div>
  );
}

export default TendenciasTemporaisIngressos;
