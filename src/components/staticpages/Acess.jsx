import React, { useRef, useState, useEffect } from 'react';
import { Typography, Paper, ThemeProvider, CssBaseline, createTheme } from '@mui/material';
import Header from '../Header';
import Footer from '../Footer';
import { useHotkeys } from 'react-hotkeys-hook';
import VLibras from '@moreiraste/react-vlibras'

const theme = createTheme({
    typography: {
        fontFamily: [
            'Marko One',
            'sans-serif',
        ].join(','),
    },
});

const About = () => {
    const bodyRef = useRef(null);


    useHotkeys('alt+1', () => {
        if (bodyRef.current) {
            const bodyTop = bodyRef.current.offsetTop;
            if (bodyTop !== undefined && bodyTop !== null) {
                window.scrollTo({ top: bodyTop, behavior: 'smooth' });
            }
        }
    });

    const [highContrast, setHighContrast] = useState();
   

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Header highContrast={highContrast} setHighContrast={setHighContrast}/>
            <div style={{position:'relative', width:'100%'}}>
                        
                <img
                    src="/about-image.jpg"
                    alt="Sobre a Iniciativa"
                    title="Pessoa lendo um livro"
                    style={{
                        width: '100%', 
                        height: '18vw', 
                        objectFit: 'cover', 
                        '@media (max-width: 600px)': { height: '60vw' },
                    }}
                />

                <div 
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        backgroundColor: 'rgba(92, 105, 114, 0.35)',  
                            
                        }}
                />

                <Typography variant="h3" gutterBottom sx={{ color: highContrast ? "#FFFF00" : 'inherit', position:'absolute', top:'50%', left:'50%', transform:'translate(-50%, -50%)', color:'white', fontSize:{ xs: '1.5rem', sm: '2rem', md: '3rem', lg: '3.5rem'}}}>
                     Acessibilidade
                </Typography>
            </div>

            <div className = 'body' ref={bodyRef} style={{  backgroundColor: highContrast ?  '#050834' : '', minHeight: '100vh', padding: '3rem' }}>
                    <Typography variant="body1" paragraph style={{ marginBottom: '1rem', color: highContrast ? "#FFFF" : 'inherit' , fontWeight: highContrast ? "superbold" : "normal"}}>
                        O termo acessibilidade significa incluir a pessoa com deficiência na participação de atividades como o uso de produtos, serviços e informações. Alguns exemplos são os prédios com rampas de acesso para cadeira de rodas e banheiros adaptados para deficientes.          </Typography>
                    <Typography variant="body1" paragraph style={{ marginBottom: '1rem', color: highContrast ? "#FFFFFF" : 'inherit', fontWeight: highContrast ? "bold" : "normal" }}>
                        Na internet, acessibilidade refere-se principalmente às recomendações do WCAG (World Content Accessibility Guide) do W3C e no caso do Governo Brasileiro ao e-MAG (Modelo de Acessibilidade em Governo Eletrônico). O e-MAG está alinhado as recomendações internacionais, mas estabelece padrões de comportamento acessível para sites governamentais.</Typography >
                    <Typography variant="body1" paragraph style={{ marginBottom: '1rem', color: highContrast ? "#FFFFFF" : 'inherit', fontWeight: highContrast ? "bold" : "normal" }}>
                        Na parte superior do portal existe uma barra de acessibilidade onde se encontra atalhos de navegação padronizados e a opção para alterar o contraste. Essas ferramentas estão disponíveis em todas as páginas do portal.
                    </Typography >
                    <Typography variant="body1" paragraph style={{ marginBottom: '1rem', color: highContrast ? "#FFFFFF" : 'inherit', fontWeight: highContrast ? "bold" : "normal" }}>
                        Os atalhos padrões do governo federal são:
                    </Typography >
                    <ul style={{ color: highContrast ? "#FFFFFF" : 'inherit', fontWeight: highContrast ? "bold" : "normal" }}>
                        <li >
                            <Typography variant="body1" paragraph>
                                Teclando-se Alt + 1 em qualquer página do portal, chega-se diretamente ao começo do conteúdo principal da página.              </Typography>
                        </li>
                        <li>
                            <Typography variant="body1" paragraph>
                                Teclando-se Alt + 2 em qualquer página do portal, chega-se diretamente ao início do menu principal.
                            </Typography>
                        </li>
                        <li>
                            <Typography variant="body1" paragraph>
                                Teclando-se Alt + 3 em qualquer página do portal, chega-se diretamente em sua busca interna.
                            </Typography>
                        </li>
                        <li>
                            <Typography variant="body1" paragraph>
                                Teclando-se Alt + 4 em qualquer página do portal, chega-se diretamente ao rodapé do site.
                            </Typography>
                        </li>
                    </ul>
                    <Typography variant="h5" paragraph style={{ marginBottom: '1rem', color: highContrast ? "#FFFF" : 'inherit' }}>
                        <strong style={{color: highContrast? "rgba(255,255,255, 0.9)" : 'rgba(92, 105, 114, 0.9)'}}>Esses atalhos valem para o navegador Chrome, mas existem algumas variações para outros navegadores.</strong>
                    </Typography>
                
                    <Typography variant="body1" paragraph sx={{ color: highContrast ? "#FFFFFF" : 'inherit', fontWeight: highContrast ? "bold" : "normal" }}>
                        Quem prefere utilizar o Internet Explorer é preciso apertar o botão Enter do seu teclado após uma das combinações acima. Portanto, para chegar ao campo de busca de interna é preciso pressionar Alt+3 e depois Enter.                    </Typography>
                    <Typography variant="body1" paragraph sx={{ color: highContrast ? "#FFFFFF" : 'inherit', fontWeight: highContrast ? "bold" : "normal" }}>
                        No caso do Firefox, em vez de Alt + número, tecle simultaneamente Alt + Shift + número.</Typography>
                    <Typography variant="body1" paragraph sx={{ color: highContrast ? "#FFFFFF" : 'inherit', fontWeight: highContrast ? "bold" : "normal" }}>
                        Sendo Firefox no Mac OS, em vez de Alt + Shift + número, tecle simultaneamente Ctrl + Alt + número.</Typography>
                    <Typography variant="body1" paragraph sx={{ color: highContrast ? "#FFFFFF" : 'inherit', fontWeight: highContrast ? "bold" : "normal" }}>
                        No Opera, as teclas são Shift + Escape + número. Ao teclar apenas Shift + Escape, o usuário encontrará uma janela com todas as alternativas de ACCESSKEY da página.
                        .</Typography>
                    <Typography variant="body1" paragraph sx={{ color: highContrast ? "#FFFFFF" : 'inherit', fontWeight: highContrast ? "bold" : "normal" }}>
                        Ao final desse texto, você poderá baixar alguns arquivos que explicam melhor o termo acessibilidade e como deve ser implementado nos sites da Internet.
                    </Typography>
                    
                    <Typography variant="h5" paragraph style={{ marginBottom: '1rem', color: highContrast ? "#FFFF" : 'inherit' }}>
                        <strong style={{color: highContrast? "rgba(255,255,255, 0.9)" : 'rgba(92, 105, 114, 0.9)'}}>Leis e decretos sobre acessibilidade:</strong>
                    </Typography>
                   
                    <ul style={{ color: highContrast ? "#FFFFFF" : 'inherit', fontWeight: highContrast ? "bold" : "normal" }}>
                        <li>
                            <Typography variant="body1" paragraph>
                                <a href="https://www.planalto.gov.br/ccivil_03/_ato2004-2006/2004/decreto/d5296.htm" target="_blank" rel="noopener noreferrer" style={{ color: highContrast ? "#FFFFFF" : 'inherit' }}>Decreto nº 5.296 de 02 de dezembro de 2004</a>
                            </Typography>
                        </li>
                        <li>
                            <Typography variant="body1" paragraph>
                                <a href="http://www.planalto.gov.br/ccivil_03/_ato2007-2010/2009/decreto/d6949.htm" target="_blank" rel="noopener noreferrer" style={{color: highContrast ? "#FFFFFF" : 'inherit'}}>Decreto nº 6.949, de 25 de agosto de 2009</a> - Promulga a Convenção Internacional sobre os Direitos das Pessoas com Deficiência e seu Protocolo Facultativo, assinados em Nova York, em 30 de março de 2007
                            </Typography>
                        </li>
                        <li>
                            <Typography variant="body1" paragraph>
                                <a href="http://www.planalto.gov.br/ccivil_03/_ato2011-2014/2012/decreto/d7724.htm" target="_blank" rel="noopener noreferrer" style={{color: highContrast ? "#FFFFFF" : 'inherit'}}>Decreto nº 7.724, de 16 de Maio de 2012</a> - Regulamenta a Lei No 12.527, que dispõe sobre o acesso a informações.
                            </Typography>
                        </li>
                        <li>
                            <Typography variant="body1" paragraph>
                                <a href="http://www.governoeletronico.gov.br/acoes-e-projetos/e-MAG/documentos" target="_blank" rel="noopener noreferrer" style={{color: highContrast ? "#FFFFFF" : 'inherit'}}>Modelo de Acessibilidade de Governo Eletrônico</a>
                            </Typography>
                        </li>
                        <li>
                            <Typography variant="body1" paragraph>
                                <a href="http://www.governoeletronico.gov.br/acoes-e-projetos/e-MAG/portaria-no-3-de-07-de-maio-de-2007" target="_blank" rel="noopener noreferrer" style={{color: highContrast ? "#FFFFFF" : 'inherit'}}>Portaria nº 03, de 07 de Maio de 2007</a> - Institucionaliza o Modelo de Acessibilidade em Governo Eletrônico – e-MAG
                            </Typography>
                        </li>
                    </ul>
                </div>
            <Footer highContrast={highContrast} />
        </ThemeProvider>
    );
};

export default About;
