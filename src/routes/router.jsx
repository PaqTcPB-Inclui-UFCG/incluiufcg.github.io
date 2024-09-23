import { createBrowserRouter } from "react-router-dom"
import Home from "../components/home/Home";
import BaseDeConhecimento from "../components/knowledge/BaseDeConhecimento";
import About from "../components/staticpages/About";
import Login from "../components/login/Login";
import Signup from "../components/Signup";
import Article from "../components/articles/Article";
import ArticleForm from "../components/articles/ArticleForm";
import SearchTerms from "../components/knowledge/SearchTerms";
import UserProfile from "../components/user/User";
import UserTable from "../components/user/UserTable";
import NotFoundPage from "../components/staticpages/NotFoundPage";
import UnauthorizedPage from "../components/staticpages/UnauthorizedPage"
import ArticleEdit from "../components/articles/ArticleEdit"
import Acess from "../components/staticpages/Acess"
import Data from "../components/reports/Data"
import Mapa from "../components/Mapa"
const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/sobre",
    element: <About />,
  },
  {
   path: "/base-de-conhecimento",
   element: <BaseDeConhecimento/> 
  },
  {
    path: "/entrar",
    element: <Login/>
  },
  {
    path: "/cadastrar",
    element: <Signup/>
  },
  {
    path: "/contato",
    element: <ArticleForm/>
  },
  {
    path: "/analise-de-dados",
    element: <Data/>
  },
  {
    path: "/criar-artigo",
    element: <ArticleForm/>
  },
  {
    path: "/busca/:searchTerm",
    element: <SearchTerms/>
  },
  {
    path: "/artigos/:articleID",
    element: <Article/>
  },
  {
    path: "/meu-perfil",
    element: <UserProfile/>
  },
  {
    path: "/gerenciar-perfis",
    element: <UserTable/>
  },
  {
    path: "*",
    element: <NotFoundPage/>
  },
  {
    path: "/nao-autorizado",
    element: <UnauthorizedPage/>
  },
  {
    path: "/editar-artigo/:articleID",
    element: <ArticleEdit/>
  },
  {
    path: "/acessibilidade",
    element: <Acess/>
  },
  {
    path: "/mapa-da-ufcg",
    element: <Mapa/>
  },

])

export default router;