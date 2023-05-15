import {app, db, firebaseConfig} from '../lib/firebase'
import { collection, addDoc, doc, setDoc, updateDoc, getDoc, getDocs, query, where } from 'firebase/firestore'
import { useSession, signIn, signOut } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function Home() {
  const { data: session } = useSession();
  const [username, setUsername] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const router = useRouter();
  
  const handleCreateCharacter = () => {
    router.push('/createCharacter')
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

  const handleTestSubmit = async (user) => {
    const q = query(collection(db, 'users'), where('email', '==', user.email));

    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      console.log(doc.id, " => ", doc.data());
    });
  }

  const retrieveData = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'users'));
      const data = querySnapshot.docs.map(doc => doc.data());
      console.log('Data retrieved successfully:', data);
    } catch (error) {
      console.error('Error retrieving data:', error);
    }
  };
  retrieveData()
  return (
    <>
      <header>
        <h1>TABLEMASTER</h1>
        <button className='sign-out' onClick={() => signOut('google')}>Sign out</button>
      </header>
      <div className='containerIndex'>
        <h1>Olá, {session.user.name}</h1>
        <div className='create'><h2>Seus Personagens: </h2><button onClick={handleCreateCharacter}>Crie Um Novo</button></div>
      </div>
    </>
  );
}
