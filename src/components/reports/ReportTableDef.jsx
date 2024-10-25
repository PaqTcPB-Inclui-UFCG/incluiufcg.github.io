import React, { useState, useEffect } from 'react';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import * as XLSX from 'xlsx';
import { ptBR } from '@mui/x-data-grid/locales';


function TabelaDeficiencias({ highContrast }) {
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

        const totalGeral = Object.values(deficienciasFrequencia).reduce((total, count) => total + count, 0);

        const deficienciasData = Object.entries(deficienciasFrequencia).map(([deficiencia, frequencia], index) => ({
          id: index,
          deficiencia,
          quantidade: frequencia,
          porcentagem: ((frequencia / totalGeral) * 100).toFixed(2),
        }));

        setDeficiencias(deficienciasData);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      }
    };

    carregarDados();
  }, []);

  const columns = [
    { field: 'deficiencia', headerName: 'Deficiência', width: 200 },
    { field: 'quantidade', headerName: 'Quantidade', width: 150 },
    { field: 'porcentagem', headerName: 'Porcentagem (%)', width: 200 },
  ];
  const handleChangePagina = (event, value) => {
    setPaginaAtual(value);
  };
  
  const handleChangeItensPorPagina = (event) => {
    setItensPorPagina(event.target.value);
    setPaginaAtual(1);
  };

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={deficiencias}
        columns={columns}
        localeText={ptBR.components.MuiDataGrid.defaultProps.localeText}
        checkboxSelection={false}
        slots={{ toolbar: GridToolbar }}
        disableSelectionOnClick
        getRowId={(row) => row.id}
        style={{color: highContrast ? "#ffff" : 'inherit', fontWeight: highContrast ? "bold": "normal" }}
        onPageChange={handleChangePagina}
            pageSizeOptions={[5, 10,15, 25]}
            initialState={{
                pagination: { paginationModel: { pageSize: 5 } },
              }}
            onPageSizeChange={handleChangeItensPorPagina}
      />
    </div>
  );
}

export default TabelaDeficiencias;
