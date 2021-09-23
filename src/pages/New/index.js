
import { useState, useEffect, useContext } from 'react';

import firebase from '../../services/firebaseConnection';
// Usando o useParams com a finalidade de editar um cliente usando o seu Id passado 
import { useHistory, useParams } from 'react-router-dom';

import Header from '../../components/Header';
import Title from '../../components/Title';
import { AuthContext } from '../../contexts/auth';
import { toast } from 'react-toastify';

import './new.css';
import { FiPlusCircle } from 'react-icons/fi'

export default function New(){
  const { id } = useParams();
  const history = useHistory();

  // State de carregamendo de dados
  const [loadCustomers, setLoadCustomers] = useState(true);
  // State com a lista de todos os usuários carregados do banco de dados
  const [customers, setCustomers] = useState([]);
  // State que vai guardar o cliente selecionado pelo seu ID
  const [customerSelected, setCustomerSelected] = useState(0);

  const [assunto, setAssunto] = useState('Suporte');

  const [status, setStatus] = useState('Aberto');

  const [complemento, setComplemento] = useState('');
  //Caso tenha um cliente passado no id, será chamado a opção de update de chamado, ao invés de registrar um novo chamado
  const [idCustomer, setIdCustomer] = useState(false);

  const { user } = useContext(AuthContext);


  useEffect(()=> {
    // Assim que a página é renderizada trazemos os clientes do banco de dados
    async function loadCustomers(){
      await firebase.firestore().collection('customers')
      .get()
      .then((snapshot)=>{
        let lista = [];
        console.log(customers)

        // Para cada id e nome do cliente no banco de dados damos um push para o array lista

        snapshot.forEach((doc) => {
          lista.push({
            id: doc.id,
            nomeFantasia: doc.data().nomeFantasia
          })
        })

        // Se não tiver ninguém na lista é passado um cliente ficticio

        if(lista.length === 0){
          console.log('NENHUMA EMPRESA ENCONTRADA');
          setCustomers([ { id: '1', nomeFantasia: 'FREELA' } ]);
          setLoadCustomers(false);
          return;
        }
        // Caso haja clientes no banco de dados, salvamos no state de clientes e tirandos a renderização de carregamento

        setCustomers(lista);
        setLoadCustomers(false);

        // Ao mesmo tempo do useEffect procurar clientes salvos no banco de dados, também é verificado se foi passado um id
        // para que o usuário possa solicitar a edição de algum chamado, caso tenha um id, é chamado a função loadId e passado a lista de clientes salvos no banco
        if(id){
          loadId(lista);
        }

      })
      .catch((error)=>{
        console.log('DEU ALGUM ERRO!', error);
        setLoadCustomers(false);
        setCustomers([ { id: '1', nomeFantasia: '' } ]);
      })

    }

    loadCustomers();

  }, [id]);


  async function loadId(lista){
    await firebase.firestore().collection('chamados').doc(id)
    .get()
    //Caso haja um id, é renderizado ao usuário o assunto, status e complemento do chamado vinculado ao id do cliente passado para edita-lo
    .then((snapshot) => {
      setAssunto(snapshot.data().assunto);
      setStatus(snapshot.data().status);
      setComplemento(snapshot.data().complemento)

      // com o findIndex do javaScript podemos comparar os index's de determinados arrays, assim apenas pegamos o id do cliente salvo na state igual o id
      // passado no useParams
      let index = lista.findIndex(item => item.id === snapshot.data().clienteId );


      setCustomerSelected(index);
      setIdCustomer(true);

    })
    .catch((err)=>{
      console.log('ERRO NO ID PASSADO: ', err);
      setIdCustomer(false);
    })
  }

  async function handleRegister(e){
    e.preventDefault();

    if(idCustomer){
      await firebase.firestore().collection('chamados')
      .doc(id)
      .update({
        // Atualizando nome e id do cliente
        cliente: customers[customerSelected].nomeFantasia,
        clienteId: customers[customerSelected].id,
        assunto: assunto,
        status: status,
        complemento: complemento,
        userId: user.uid
      })
      .then(()=>{
        toast.success('Chamado Editado com sucesso!');
        console.log(customers[customerSelected].nomeFantasia)
        setCustomerSelected(0);
        setComplemento('');
        history.push('/dashboard');

      })
      .catch((err)=>{
        toast.error('Ops erro ao registrar, tente mais tarde.')
        console.log(err);
      })

      return;
    }
    // Caso não tenha nenhum id passado pelo usuário e reconhecido como id válido, é apenas chamado o cadastro de um novo chamado
    await firebase.firestore().collection('chamados')
    .add({
      created: new Date(),
      cliente: customers[customerSelected].nomeFantasia,
      clienteId: customers[customerSelected].id,
      assunto: assunto,
      status: status,
      complemento: complemento,
      userId: user.uid
    })
    .then(()=> {
      toast.success('Chamado criado com sucesso!');
      setComplemento('');
      setCustomerSelected(0);
    })
    .catch((err)=> {
      toast.error('Ops erro ao registrar, tente mais tarde.')
      console.log(err);
    })


  }


  //Chamado quando troca o assunto
  function handleChangeSelect(e){
    setAssunto(e.target.value);
  }


  //Chamado quando troca o status
  function handleOptionChange(e){
    setStatus(e.target.value);
  }

  //Chamado quando troca de cliente
  function handleChangeCustomers(e){
    console.log('INDEX DO CLIENTE SELECIONADO: ', e.target.value);
    console.log('Cliente selecionado ', customers[e.target.value])
    setCustomerSelected(e.target.value);
  }

  // Para cada cliente encontrado é criado um novo select
  return(
    <div>
      <Header/>

      <div className="content">
        <Title name="Novo chamado">
          <FiPlusCircle size={25} />
        </Title>

        <div className="container">

          <form className="form-profile"  onSubmit={handleRegister} >
            
            <label className="cliente">Cliente:</label>
            {loadCustomers ? (
              <input type="text" disabled={true} value="Carregando clientes..." />
            ) : (
                <select value={customerSelected} onChange={handleChangeCustomers} >
                {customers.map((item, index) => {
                  return(
                    <option key={item.id} value={index} >
                      {item.nomeFantasia}
                    </option>
                  )
                })}
              </select>
            )}

            <label>Assunto:</label>
            <select value={assunto} onChange={handleChangeSelect}>
              <option value="Suporte">Suporte</option>
              <option value="Visita Tecnica">Visita Tecnica</option>
              <option value="Financeiro">Financeiro</option>
            </select>

            <label>Status:</label>
            <div className="status">
              <span>
              <input type="radio" name="radio" value="Aberto" onChange={handleOptionChange} checked={ status === 'Aberto' }/>
                Aberto
              </span>

              <span>
              <input type="radio" name="radio" value="Progresso" onChange={handleOptionChange} checked={ status === 'Progresso'}/>
                Progresso
              </span>

              <span>
              <input type="radio" name="radio" value="Atendido" onChange={handleOptionChange} checked={ status === 'Atendido' }/>
                Atendido
              </span>
            </div>

            <label>Complemento:</label>
            <textarea type="text" placeholder="Descreva seu problema (opcional)." value={complemento} onChange={ (e) => setComplemento(e.target.value)}/>
            
            <button className="button-register" type="submit">Registrar</button>

          </form>

        </div>

      </div>
    </div>
  )
}