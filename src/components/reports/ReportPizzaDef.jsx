import React, { useState, useEffect } from 'react';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import * as XLSX from 'xlsx';
import { ptBR } from '@mui/x-data-grid/locales';
import { Chart } from 'react-google-charts';

function GraficoPizzaDeficiencias({ highContrast }) {
  const [deficiencias, setDeficiencias] = useState([]);

  useEffect(() => {
    const carregarDados = async () => {
      try {
        const response = await fetch('/portadoresDeficiencia_semdadospessoais.xlsx');
        const arrayBuffer = await response.arrayBuffer();
        const workbook = XLSX.read(new Uint8Array(arrayBuffer), { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const dados = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        const deficienciasFrequencia = dados.slice(2).reduce((accumulator, row) => {
          const deficiencia = row[2];
          if (deficiencia) {
            accumulator[deficiencia] = (accumulator[deficiencia] || 0) + 1;
          }
          return accumulator;
        }, {});

        const deficienciasData = Object.entries(deficienciasFrequencia).map(([deficiencia, frequencia]) => [deficiencia, frequencia]);

        setDeficiencias(deficienciasData);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      }
    };

    carregarDados();
  }, []);

  return (
    <div style={{ height: 400, width: '100%' }}>
      <Chart
        width={'100%'}
        height={'300px'}
        chartType="PieChart"
        loader={<div>Carregando...</div>}
        data={[['Deficiência', 'Quantidade']].concat(deficiencias)}
        options={{
          title: 'Distribuição de Alunos por Tipo de Deficiência',
          is3D: true,
        }}
      />
    </div>
  );
}

export default GraficoPizzaDeficiencias;
