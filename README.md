# Guia de Uso IncluiUFCG: Docker para Front-end da Aplicação Adptare

Este guia fornecerá instruções passo a passo para configurar e executar o contêiner Docker para o front-end da aplicação Adptare usando Docker.

## Pré-requisitos

Certifique-se de ter o Docker instalado em sua máquina. Você pode instalá-lo seguindo as instruções oficiais em [Docker](https://docs.docker.com/get-docker/).

## Passos

1. **Clone este repositório:**
   
   ```bash
   git clone [https://github.com/Adptare/Front-End-Adptare.git](https://github.com/IncluiUFCG/Front-End-IncluiUFCG.git)
   ```

2. **Navegue até o diretório do projeto de front-end:**
   
   ```bash
   cd Front-End-Adptare
   ```

3. **Modifique o endpoint da API:**

   Abra o arquivo `src/endPoints.jsx` e atualize a variável `BASE_URL` com o endpoint correto da sua API.

4. **Construa a imagem Docker para o front-end:**
   
   ```bash
   docker build -t adptare-frontend-main .
   ```

   Isso criará a imagem Docker para o front-end da aplicação Adptare.

5. **Execute o contêiner Docker do front-end:**
   
   ```bash
   docker run -d -p 5173:5173 --name adptare-frontend adptare-frontend-main
   ```

   Isso iniciará o contêiner Docker para o front-end da aplicação Adptare. O contêiner será executado em segundo plano.

6. **Acesse a aplicação:**

   Abra um navegador da web e vá para `http://localhost:5173` para acessar a aplicação Adptare.

7. **Para parar o contêiner Docker:**
   
   ```bash
   docker stop adptare-frontend
   ```

   Isso irá parar o contêiner Docker do front-end da aplicação Adptare.

## Observações

- Certifique-se de que o endpoint da API definido em `src/endPoints.jsx` esteja correto para se comunicar com o back-end da aplicação.
- Certifique-se de que o contêiner do front-end esteja na mesma rede Docker que o contêiner do back-end para permitir a comunicação adequada entre eles.
- Certifique-se de revisar e ajustar as configurações de segurança e acesso conforme necessário para o seu ambiente específico.
- Esta aplicação é desenvolvida em React e usa Docker para facilitar a implantação e execução em diferentes ambientes.
