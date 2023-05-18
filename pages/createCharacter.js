import React, { useState } from "react";
import { collection, addDoc, setDoc, doc, getDoc, getCollection, query, where, onSnapshot, refEqual } from "firebase/firestore";
import {app, db, firebaseConfig} from '../lib/firebase'
import styles from "./createCharacter.module.css";
import { useSession } from "next-auth/react";

const CreateCharacter = () => {
  const [name, setName] = useState("");
  const [system, setSystem] = useState("GLASS");
  const [bloodType, setBloodType] = useState("red");
  const [imageUrl, setImageUrl] = useState("");
  const [characterCode, setCharacterCode] = useState("");

  const { data: session } = useSession();

  if (!session) {
    return <div>Carregando...</div>;
  }
  
  const handleCreateCharacter = async (user) => {
    try {
      function generateCode() { //Create random code
           const randomNumber = Math.floor(Math.random() * 1000000);
           const code = randomNumber.toString().padStart(6, "0");
           return code;
      }
      setCharacterCode(generateCode())
      const ref = doc(db, 'users', session.user.email, 'characters', characterCode);
      const docSnap = await getDoc(ref); //Get Document
      if (!docSnap.exists()) {
        //If code doesn't exist, then create it
        await setDoc(ref, {
            name: name,
            system: system,
            bloodType: bloodType,
            imageUrl: imageUrl,
            owner: session.user.email,
            characterCode: characterCode,
        });
      } else {
        // Repeat if code already exists
        handleCreateCharacter()
      }
    } catch (error) {
      console.error("Error creating character:", error);
    }
    
  };

  return (
    <>
    <h1 className='big-title'>Criar Personagem</h1>
    <div className={styles.creatorContainer}>
      <form className={styles.creatorForm}>
      <div className={styles.inputContainer}>
        <label className={styles.label}>
          Nome:
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={styles.input}
          />
        </label>
      </div>
      <div className={styles.inputContainer}>
          <label className={styles.label}>
            Sistema:
            <select
              value={system}
              onChange={(e) => setSystem(e.target.value)}
              className={styles.select}
            >
              <option value="GLASS">GLASS</option>
            </select>
          </label>
      </div>
      <div className={styles.inputContainer}>
          <label className={styles.label}>
            Tipo Sanguíneo:
            <select
              value={bloodType}
              onChange={(e) => setBloodType(e.target.value)}
              className={styles.select}
            >
              <option value="red">Vermelho</option>
              <option value="silver">Prateado</option>
              <option value="newblood">Sangue-Novo</option>
    
            </select>
          </label>
      </div>
      <div className={styles.inputContainer}>
        <label className={styles.label}>
          Imagem URL:
          <input
            type="text"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            className={styles.input}
          />
        </label>
      </div>
        <button
          type="button"
          onClick={() => handleCreateCharacter(session.user)}
          className={styles.button}
        >
          Criar Personagem
        </button>
        {characterCode && (
        <p className={styles.characterCode}>
          Código de Personagem: <span>{characterCode}</span>
        </p>
      )}
      </form>
      
    </div>
    </>
  );
};

export default CreateCharacter;
