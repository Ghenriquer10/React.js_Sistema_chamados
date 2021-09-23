
import { Switch } from 'react-router-dom';
import Route from './Route';

import SignIn from '../pages/SignIn';
import SignUp from '../pages/SignUp';

import Dashboard from '../pages/Dashboard';
import Profile from '../pages/Profile';
import Customers from '../pages/Customers';
import New from '../pages/New';

// Criando todas as rotas necessárias, exceto a Route pois a mesma foi criada manulmente para a criação de usuários que tem permissões
// de estarem ou não logados
export default function Routes(){
  return(
    <Switch>
      <Route exact path="/" component={SignIn} />
      <Route exact path="/register" component={SignUp} />

      // Com o componente isPrivate delimitamos o acesso apenas ao usuário logado

      <Route exact path="/dashboard" component={Dashboard} isPrivate />
      <Route exact path="/profile" component={Profile} isPrivate />
      <Route exact path="/customers" component={Customers} isPrivate />
      <Route exact path="/new" component={New} isPrivate />

      // Recebendo ID do chamado para ser alterado, onde este será recebido pelo useParams da página de chamados
      
      <Route exact path="/new/:id" component={New} isPrivate />
      
    </Switch>
  )
}