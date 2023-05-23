import React, { useState, useEffect } from "react";
import { collection, addDoc, setDoc, doc, getDoc, getCollection, query, where, onSnapshot, refEqual } from "firebase/firestore";
import {app, db, firebaseConfig} from '../../lib/firebase'
import styles from "../createCharacter.module.css";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

const CreateSession = () => {
  const [id, setId] = useState('');
  const [passkey, setPasskey] = useState('');
  

  const { data: session } = useSession();

  const router = useRouter();

  const handleCreateSession = async (user) => {
    if (id == '' || passkey == '') {
        alert('Preencha os Campos')
    } else {
    try { 
      const ref = doc(db, 'sessions', id);
      const docSnap = await getDoc(ref); //Get Document
      if (!docSnap.exists()) {
        //If code doesn't exist, then create it
        await setDoc(ref, {
            name: id,
            passkey: passkey,
            owner: user.email,
        });
        router.push({
          pathname: '/session/session',
          query: {
            id: id,
          }
        });
      } else {
        alert('Existe uma sala ativa com esse nome.')
      }
    } catch (error) {
      console.error("Error creating session:", error);
    }
}
  };
  
  return (
    <>
    <h1 className='big-title'>Criar Sessão</h1>
    <div className={styles.creatorContainer}>
      <form className={styles.creatorForm}>
      <div className={styles.inputContainer}>
        <label className={styles.label}>
          Nome da Sessão:
          <input
            type="text"
            value={id}
            onChange={(e) => setId(e.target.value)}
            className={styles.input}
          />
        </label>
      </div>
      <div className={styles.inputContainer}>
        <label className={styles.label}>
          Senha:
          <input
            type="text"
            value={passkey}
            onChange={(e) => setPasskey(e.target.value)}
            className={styles.input}
          />
        </label>
      </div>
        <button
          type="button"
          onClick={() => handleCreateSession(session.user)}
          className={styles.button}
        >
          Criar Sessão
        </button> 
      </form>
      
    </div>
    </>
  );
};

export default CreateSession;
