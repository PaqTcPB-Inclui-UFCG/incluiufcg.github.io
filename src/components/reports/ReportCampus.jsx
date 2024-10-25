import React, { useState, useEffect } from 'react';
import { Chart } from 'react-google-charts';
import * as XLSX from 'xlsx';

function GraficoPizzaPorCampus({ highContrast }) {
  const [dadosCampus, setDadosCampus] = useState([]);

  useEffect(() => {
    const carregarDados = async () => {
      try {
        const response = await fetch('/portadoresDeficiencia_semdadospessoais.xlsx');
        const arrayBuffer = await response.arrayBuffer();
        const workbook = XLSX.read(new Uint8Array(arrayBuffer), { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const dados = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
    
        const alunosDeficientesPorCampus = {};
        const matriculasUnicas = new Set();
    
        dados.slice(2).forEach((row) => {
          const campus = row[3];
          const matricula = row[0];
          if (campus && matricula && row[2] !== undefined && row[2] !== '') {
            if (!matriculasUnicas.has(matricula)) {
              matriculasUnicas.add(matricula);
              alunosDeficientesPorCampus[campus] = (alunosDeficientesPorCampus[campus] || 0) + 1;
            }
          }
        });
    
        const dadosCampus = Object.entries(alunosDeficientesPorCampus)
          .map(([campus, quantidade]) => ({ campus, quantidade }))
          .sort((a, b) => b.quantidade - a.quantidade);
    
        setDadosCampus(dadosCampus);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      }
    };

    carregarDados();
  }, []);

  return (
    <div>
      <h2 style={{color: highContrast ? "#ffff" : 'inherit', fontWeight: highContrast ? "bold": "normal" }}>Quantidade de Alunos Deficientes por Campus</h2>
      <Chart
        width={'100%'}
        height={'400px'}
        chartType="PieChart"
        loader={<div>Carregando gráfico</div>}
        data={[
          ['Campus', 'Quantidade', { role: 'annotation' }],
          ...dadosCampus.map(({ campus, quantidade }) => [campus, quantidade, quantidade.toString()]),
        ]}
        options={{
          title: 'Alunos Deficientes por Campus',
          is3D: true,
        }}
      />
    </div>
  );
}

export default GraficoPizzaPorCampus;
