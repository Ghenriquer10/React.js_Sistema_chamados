
import './title.css';

// Configurando os titulos do componente

export default function Title({children, name}){
  return(
    <div className="title">
      {children}
      <span>{name}</span>
    </div>
  )
}