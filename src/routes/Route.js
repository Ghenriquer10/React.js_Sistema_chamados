

import { useContext } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { AuthContext } from '../contexts/auth';

export default function RouteWrapper({

  // Aqui passamos o Componente requirido pelo usuário com a propriedade isPrivate e o spread operator com todas as suas propriedades

  component: Component,
  isPrivate,
  ...rest
}){

  // Fazendo uso do signed para testarmos as combinações de usuários logados e páginas privadas, 
  // retornando-os para as páginas com seus respectivos acessos permitidos
  const { signed, loading } = useContext(AuthContext);



  if(loading){
    return(
      <div></div>
    )
  }
  // Se o usuário NÂO estiver logado e tentando acessar uma página privada, o mesmo é redirecionado a página de login
  if(!signed && isPrivate){
    return <Redirect to="/" />
  }
  // Caso o contrário, estiver logado e tentando acessar uma página publica, é redirecionado a página interna da aplicação.
  if(signed && !isPrivate){
    return <Redirect to="/dashboard" />
  }

  // Renderizando o componente com suas devidas propriedades passadas
  return(
    <Route
      {...rest}
      render={ props => (
        <Component {...props} />
      )}
    />
  )
}