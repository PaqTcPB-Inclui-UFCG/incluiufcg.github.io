import React, { useEffect } from 'react';
import { PowerBIEmbed } from 'powerbi-client-react';
import { models } from 'powerbi-client';

const PowerBIDashboard = () => {
  useEffect(() => {
    // Código de inicialização do Power BI
    const embedContainer = document.getElementById('embedContainer');
    const config = {
      type: 'dashboard',
      id: '<ID do Dashboard>',
      embedUrl: '<URL de Incorporação>',
      accessToken: '<Token de Acesso>',
      tokenType: models.TokenType.Embed,
    };

    const dashboard = new window['powerbi'].Dashboard(embedContainer, config);

    // Adiciona manipuladores de eventos, se necessário
    dashboard.on('loaded', () => {
      console.log('Dashboard carregado');
    });

    dashboard.on('error', (event) => {
      console.error('Erro no dashboard:', event.detail);
    });

    // Limpa o dashboard quando o componente for desmontado
    return () => {
      dashboard.off('loaded');
      dashboard.off('error');
      dashboard.destroy();
    };
  }, []);

  return <div id="embedContainer" style={{ height: '600px', width: '100%' }}></div>;
};

export default PowerBIDashboard;
