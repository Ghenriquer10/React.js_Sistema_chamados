
import { useContext } from 'react';
import './header.css';
import { AuthContext } from '../../contexts/auth';
import avatar from '../../assets/avatar.png';

import { Link } from 'react-router-dom';
import { FiHome, FiUser, FiSettings } from "react-icons/fi";

// Configurando o Header presente em toda a aplicação
export default function Header(){
  const { user, signOut } = useContext(AuthContext);

  return(
    <div className="sidebar">
      <div>
        <img src={user.avatarUrl === null ? avatar : user.avatarUrl } alt="Foto avatar" />
      </div>

      <Link to="/dashboard">
        <FiHome color="#FFF" size={24} />
        Chamados
      </Link>
      <Link to="/customers">
        <FiUser color="#FFF" size={24} />
        Clientes
      </Link>    
      <Link to="/profile">
        <FiSettings color="#FFF" size={24} />
        Configurações
      </Link>
      <button className="logout-btn-header" onClick={() => signOut()}>
          Sair
      </button>         
    </div>
  )
}