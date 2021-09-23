
import { useState, useContext } from 'react';
import './profile.css';
import Header from '../../components/Header';
import Title from '../../components/Title';
import avatar from '../../assets/avatar.png';

import firebase from '../../services/firebaseConnection';
import { AuthContext } from '../../contexts/auth';

import { FiSettings, FiUpload } from 'react-icons/fi';

export default function Profile(){
  // Trazendo os contextos do Auth
  const { user, signOut, setUser, storageUser } = useContext(AuthContext);

  // As states podem já inicializar com os seus dados nos inputs caso o user importado pelo Context esteja logado

  const [nome, setNome] = useState(user && user.nome);
  const [email, setEmail] = useState(user && user.email);

  const [avatarUrl, setAvatarUrl] = useState(user && user.avatarUrl);

  const [imageAvatar, setImageAvatar] = useState(null);


  function handleFile(e){
    // É verificado se há alguma imagem enviada pelo usuário na posição 0, que é a ultima imagem enviada pelo mesmo
    if(e.target.files[0]){

      //Caso exista a mesma é guardada em uma constante e verificada se é do tipo jpeg ou png
      const image = e.target.files[0];
      
      if(image.type === 'image/jpeg' || image.type === 'image/png'){

        // Imagem guardada na state que está como null e criado uma url da imagem e inserida na state padrão da foto de perfil do usuário
        setImageAvatar(image);
        setAvatarUrl(URL.createObjectURL(e.target.files[0]))

      }else{
        alert('Envie uma imagem do tipo PNG ou JPEG');
        setImageAvatar(null);
        return null;
      }

    }

  }

  // Alterando nome e foto do usuário

  async function handleSave(e){

    // Fazendo com que a página não seja recarregada ao enviar formulário
    e.preventDefault();

    // Caso o usuário não tenha enviado uma foto e alterando apenas o campo nome, é alterando o mesmo no firebase
    if(imageAvatar === null && nome !== ''){
      await firebase.firestore().collection('users')
      // Pegando o uid do usuário através do Context
      .doc(user.uid)
      // Atualizando apenas o nome
      .update({
        nome: nome
      })
      // Criando um objeto com o spread de todos os dados do usuário já contidos na state mas a atualização do atributo nome
      .then(()=>{
        let data = {
          ...user,
          nome: nome
        };

        // Salvando os dados do usuário na state e na função localStorage importado pelo Context api
        setUser(data);
        storageUser(data);

      })

    }
    // Caso o usuário tenha mandado uma imagem e mudado o nome é chamada a função handleUpload
    else if(nome !== '' && imageAvatar !== null){
      handleUpload();
    }

  }


  async function handleUpload(){
    
    const currentUid = user.uid;
    // Após pegar o id do usuário é feito upload da sua imagem no storage do firebase, criando uma referência personalizada com seu Id e nome da foto
    const uploadTask = await firebase.storage()
    .ref(`images/${currentUid}/${imageAvatar.name}`)
    .put(imageAvatar)
    .then( async () => {
      console.log('FOTO ENVIADA COM SUCESSO!');
      
      // Após criar uma pasta para a imagem, é possível fazer o download do link da mesma e ser ataulizado no banco de dados do usuário
      await firebase.storage().ref(`images/${currentUid}`)
      .child(imageAvatar.name).getDownloadURL()
      .then( async (url)=>{
        let urlFoto = url;
        
        await firebase.firestore().collection('users')
        .doc(user.uid)
        .update({
          avatarUrl: urlFoto,
          nome: nome
        })
        
        // Então criamos um objeto com todos os dados do usuário já contidos anteriormente com a atualização do nome e link da foto criada
        .then(()=>{
          let data = {
            ...user,
            avatarUrl: urlFoto,
            nome: nome
          }; 
          setUser(data);
          storageUser(data);

        })

      })

    })

  }



  return(
    <div>
      <Header/>

      <div className="content">
        <Title name="Meu perfil">
          <FiSettings size={25} />
        </Title>


        <div className="container">
          <form className="form-profile" onSubmit={handleSave}>
            <label className="label-avatar">
              <span>
                <FiUpload color="#FFF" size={25} />
              </span>

              <input type="file" accept="image/*" onChange={handleFile}  /><br/>
              { avatarUrl === null ? 
                <img src={avatar} width="250" height="250" alt="Foto de perfil do usuario" />
                :
                <img src={avatarUrl} width="250" height="250" alt="Foto de perfil do usuario" />
              }
            </label>

            <label>Nome</label>
            <input type="text" value={nome} onChange={ (e) => setNome(e.target.value) } />

            <label>Email</label>
            <input type="text" value={email} disabled={true} />     

            <button type="submit" className="submit">Salvar</button>       

          </form>
        </div>

        <div className="container">
            <button className="logout-btn" onClick={ () => signOut() } >
               Sair
            </button>
        </div>

      </div>
    </div>
  )
}