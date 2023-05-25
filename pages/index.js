import { db } from '../lib/firebase'
import { collection, doc, setDoc, getDoc, getDocs, query } from 'firebase/firestore'
import { useSession, signIn, signOut } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import CharactersCard from '@/components/CharactersCard';

export default function Home() {
  const { data: session } = useSession();
  const [characters, setCharacters] = useState([]);
  const router = useRouter();
  
  const handleCreateCharacter = () => {
    router.push('/createCharacter')
  }
  const handleCreateSession = () => {
    router.push('/session/createSession')
  }
  
  // Save user data in Firestore db
  const saveUserData = async (user) => {
    try {
      await setDoc(doc(db, 'users', user.email), {
        name: user.name,
        email: user.email,
      });
      console.log('Dados do usuário salvos com sucesso no Firestore');
    } catch (error) {
      console.error('Erro ao salvar dados do usuário no Firestore:', error);
    }
  };

  useEffect(() => {
    const fetchCharacter = async () => {
      if (session && session.user) {
        const q = query(collection(db, "users", session.user.email, "characters"))
        const querySnapshot = await getDocs(q);
        const characterList = [];
        querySnapshot.docs.forEach((doc) => {
          characterList.push(doc.data());
        });
        setCharacters(characterList);
      }
    };
  
    fetchCharacter();
  }, [session]);

  
  if (session) {
    saveUserData(session.user);
  };

  // Render component
  if (!session) {
    return (
      <div className="login-container">
          <h1>
            TABLEMASTER
          </h1>
          <button
            onClick={() => signIn('google')}
            className="main-btn"
          >
            Login Com o Google
          </button>
      </div>
    );
  };

  return (
    <>
      <header>
        <h1>TABLEMASTER</h1>
        <button className='sign-out' onClick={() => signOut('google')}>Sign out</button>
      </header>
      <div className='containerIndex'>
        <div className='header'>
          <h1>Olá, {session.user.name}</h1><button className='session' onClick={handleCreateSession}>Criar uma Sessão</button>
        </div>
       
        <div className='create'><h2>Seus Personagens: </h2><button onClick={handleCreateCharacter}>Crie Um Novo</button></div>
        <div className='charactersWrapper'>
          {characters.map((character) => (
            <CharactersCard key={character.id} character={character} />
          ))}
        </div>
      </div>
    </>
  );
}
