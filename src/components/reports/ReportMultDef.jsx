import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { ptBR } from '@mui/x-data-grid/locales';
import { Chart } from 'react-google-charts';
import { Grid, Paper, Typography, Divider } from '@mui/material';

function AlunosMultiDeficiencia({ highContrast }) {
    const [ocorrencias, setOcorrencias] = useState([]);
    const [totalAlunos, setTotalAlunos] = useState(0);
    const [distribuicaoCurso, setDistribuicaoCurso] = useState([]);
    const [distribuicaoCampus, setDistribuicaoCampus] = useState([]);

    useEffect(() => {
        const processarPlanilha = async () => {
            try {
                const response = await fetch('/portadoresDeficiencia_semdadospessoais.xlsx');
                const arrayBuffer = await response.arrayBuffer();
                const workbook = XLSX.read(new Uint8Array(arrayBuffer), { type: 'array' });
                const firstSheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[firstSheetName];
                const dados = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

                const alunosDeficiencias = {};

                const distribuicaoPorCurso = {};
                const distribuicaoPorCampus = {};

                dados.slice(2).forEach((row) => {
                    const matricula = row[0];
                    const deficiencia = row[2];
                    const curso = row[5];
                    const campus = row[3];

                    if (!alunosDeficiencias[matricula]) {
                        alunosDeficiencias[matricula] = [];
                    }

                    if (!alunosDeficiencias[matricula].includes(deficiencia)) {
                        alunosDeficiencias[matricula].push(deficiencia);
                    }

                    if (alunosDeficiencias[matricula].length > 1) {
                        if (!distribuicaoPorCurso[curso]) {
                            distribuicaoPorCurso[curso] = 0;
                        }
                        distribuicaoPorCurso[curso]++;
                    }

                    if (alunosDeficiencias[matricula].length > 1) {
                        if (!distribuicaoPorCampus[campus]) {
                            distribuicaoPorCampus[campus] = 0;
                        }
                        distribuicaoPorCampus[campus]++;
                    }
                });

                const alunosMultiDeficiencia = Object.entries(alunosDeficiencias)
                    .filter(([_, deficiencias]) => deficiencias.length > 1)
                    .map(([_, deficiencias]) => deficiencias.sort()); // Apenas as deficiências compostas, ordenadas alfabeticamente

                const ocorrenciasUnicas = [...new Set(alunosMultiDeficiencia.map((deficiencias) => deficiencias.join(', ')))];
                const ocorrencias = ocorrenciasUnicas.map((deficiencias, index) => {
                    const deficienciasArray = deficiencias.split(', ');
                    const row = { id: index };
                    deficienciasArray.forEach((def, idx) => {
                        row[`deficiencia_${idx}`] = def;
                    });
                    row.quantidade = alunosMultiDeficiencia.filter((def) => def.join(', ') === deficiencias).length;
                    return row;
                });
                setOcorrencias(ocorrencias);

                const total = ocorrencias.reduce((acc, cur) => acc + cur.quantidade, 0);
                setTotalAlunos(total);

                const distribuicaoCursoFormatada = Object.entries(distribuicaoPorCurso).map(([curso, quantidade]) => [curso, quantidade]);
                setDistribuicaoCurso([['Curso', 'Quantidade de Alunos']].concat(distribuicaoCursoFormatada));

                const distribuicaoCampusFormatada = Object.entries(distribuicaoPorCampus).map(([campus, quantidade]) => [campus, quantidade]);
                setDistribuicaoCampus([['Campus', 'Quantidade de Alunos']].concat(distribuicaoCampusFormatada));
            } catch (error) {
                console.error('Erro ao processar a planilha:', error);
            }
        };

        processarPlanilha();
    }, []);

    const columns = [
        { field: 'deficiencia_0', headerName: 'Deficiência 1', flex: 1 },
        { field: 'deficiencia_1', headerName: 'Deficiência 2', flex: 1 },
        { field: 'quantidade', headerName: 'Quantidade de Alunos com Mesmas Deficiências', flex: 1 },
    ];

    return (
        <Grid container spacing={3}>
            <Grid item xs={12}>
                <Divider style={{ margin: '20px 0', marginTop: '3rem' }} />
                <Typography variant="h4" component="div" gutterBottom sx={{color: highContrast ? "#ffff" : 'inherit', fontWeight: highContrast ? "bold": "normal" }}>
                    Multiplas deficiência
                </Typography>
                <Typography variant="h6" gutterBottom sx={{color: highContrast ? "#ffff" : 'inherit', fontWeight: highContrast ? "bold": "normal", marginBottom: '2rem' }}>
                    Esta análise de dados examina o cenário dos alunos da UFCG que possuem múltiplas deficiências. Ela oferece insights sobre a distribuição desses alunos por curso e campus, fornecendo uma visão abrangente da situação dos alunos com múltiplas deficiências dentro da instituição.
                </Typography>

                <Paper elevation={3} style={{ padding: '20px', marginBottom: '20px' }}>
                    <Typography variant="h5" component="div" gutterBottom >
                        Alunos com Múltiplas Deficiências:
                    </Typography>
                    <Typography variant="h3" component="div">
                        {totalAlunos}
                    </Typography>
                </Paper>
            </Grid>
            <Grid item xs={6}>
                <Paper elevation={3} style={{ padding: '20px' }}>
                    <h2>Presença de Múltiplas Deficiência</h2>
                    <DataGrid
                        rows={ocorrencias}
                        columns={columns}
                        pageSize={5}
                        localeText={ptBR.components.MuiDataGrid.defaultProps.localeText}
                        checkboxSelection={false}
                        slots={{ toolbar: GridToolbar }}
                        pageSizeOptions={[5, 10, 15, 25]}
                        initialState={{
                            pagination: { paginationModel: { pageSize: 5 } },
                        }}
                    />
                </Paper>
            </Grid>
            <Grid item xs={6}>
                <Paper elevation={3} style={{ padding: '20px' }}>
                    <h2 >Distribuição de Alunos com Múltiplas Deficiências</h2>
                    <Chart
                        width={'100%'}
                        height={'300px'}
                        chartType="PieChart"
                        loader={<div>Carregando...</div>}
                        data={[['Curso / Campus', 'Quantidade']].concat(
                            ocorrencias.map(({ deficiencia_0, deficiencia_1, quantidade }) => [`${deficiencia_0}, ${deficiencia_1}`, quantidade])
                        )}
                        options={{
                            title: 'Distribuição de Alunos com Múltiplas Deficiências por Curso e Campus',
                            is3D: true,
                        }}
                    />
                </Paper>
            </Grid>
            <Grid item xs={6}>
                <Paper elevation={3} style={{ padding: '20px' }}>
                    <h2>Distribuição de Alunos com Múltiplas Deficiências por Curso</h2>
                    <Chart
                        width={'100%'}
                        height={'300px'}
                        chartType="BarChart"
                        loader={<div>Carregando...</div>}
                        data={distribuicaoCurso}
                        options={{
                            title: 'Distribuição de Alunos com Múltiplas Deficiências por Curso',
                            chartArea: { width: '50%' },
                            hAxis: {
                                title: 'Quantidade de Alunos',
                                minValue: 0,
                            },
                            vAxis: {
                                title: 'Curso',
                            },
                        }}
                    />
                </Paper>
            </Grid>
            <Grid item xs={6}>
                <Paper elevation={3} style={{ padding: '20px' }}>
                    <h2>Distribuição de Alunos com Múltiplas Deficiências por Campus</h2>
                    <Chart
                        width={'100%'}
                        height={'300px'}
                        chartType="BarChart"
                        loader={<div>Carregando...</div>}
                        data={distribuicaoCampus}
                        options={{
                            title: 'Distribuição de Alunos com Múltiplas Deficiências por Campus',
                            chartArea: { width: '50%' },
                            hAxis: {
                                title: 'Quantidade de Alunos',
                                minValue: 0,
                            },
                            vAxis: {
                                title: 'Campus',
                            },
                        }}
                    />
                </Paper>
            </Grid>
        </Grid>
    );
}

export default AlunosMultiDeficiencia;
