import React, { useState, useEffect } from "react";
import { collection, addDoc, setDoc, doc, getDoc, getCollection, query, where, onSnapshot, refEqual } from "firebase/firestore";
import {app, db, firebaseConfig} from '../lib/firebase'
import styles from "./characterPage.module.css";
import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/router";

const CreateCharacter = () => {
  const { data: session, status } = useSession();
  const [character, setCharacter] = useState(null);
  const [autoLoginDone, setAutoLoginDone] = useState(false);

  useEffect(() => {
    if (status === "loading") {
      return;
    }

    if (!session && !autoLoginDone) {
      signIn('google');
      console.log('Not Logged In');
      setAutoLoginDone(true);
    } else {
      console.log('LoggedIn');
    }
  }, [session, autoLoginDone, status]);

  const router = useRouter()
  const characterCode = router.query.id
  
  useEffect(() => {
    const fetchCharacter = async () => {
      try {
        const characterRef = doc(db, "users", session.user.email, "characters", characterCode);
        const characterSnapshot = await getDoc(characterRef);

        if (characterSnapshot.exists()) {
          const characterData = characterSnapshot.data();
          setCharacter(characterData);
        } else {
          console.log("Documento não encontrado");
          return <div>Personagem não encontrado!</div>;
        }
      } catch (error) {
        console.error("Erro ao buscar os dados do Firestore:", error);
      }
    };

    fetchCharacter();
  }, [session, characterCode]);

  if (!character) {
    return <div>Carregando...</div>;
  }

  return (
    <div>
      <h1>Personagem</h1>
      <div className={styles.name}>
        <h2>Nome:</h2>
        <h1>{character.name}</h1>
      </div>
    </div>
  );
};

export default CreateCharacter;
