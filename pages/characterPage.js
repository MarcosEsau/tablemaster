import React, { useState, useEffect, use } from "react";
import { collection, addDoc, setDoc, doc, getDoc, getCollection, query, where, onSnapshot, refEqual } from "firebase/firestore";
import {app, db, firebaseConfig} from '../lib/firebase'
import styles from "./characterPage.module.css";
import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/router";
import Image from "next/image";
import { faStepForward } from "@fortawesome/free-solid-svg-icons";

const CreateCharacter = () => {
  const { data: session, status } = useSession();
  const [autoLoginDone, setAutoLoginDone] = useState(false);
  const [character, setCharacter] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [name, setName] = useState("");
  const [bloodType, setBloodType] = useState("");
  const [system, setSystem] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [owner, setOwner] = useState('')
  const [permission, setPermission] = useState(false)

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
      const characterRef = doc(db, "users", session.user.email, "characters", characterCode);
      const characterDoc = await getDoc(characterRef);
      if (characterDoc.exists()) {
        const characterData = characterDoc.data();
        setCharacter(characterData);
        setName(characterData.name);
        setSystem(characterData.system);
        setImageUrl(characterData.imageUrl);
        setOwner(characterData.owner);
      }
    };

    fetchCharacter();
  }, [session, characterCode, editMode]);

  useEffect(() => {
    if (session.user.email == owner) {
      setPermission(true)
    } else {
      setPermission(false)
    }
  })

  const handleEditClick = () => {
    setEditMode(true);
  };
  const handleApplyChanges = async () => {
    const characterRef = doc(db, "users", session.user.email, "characters", characterCode);
    await setDoc(characterRef, {
      name,
      bloodType,
      system,
      imageUrl,
    });
    setEditMode(false);
  };

  

  

  if (!character) {
    return <div>Carregando...</div>;
  }

  return (
    <div>
      {editMode ? (
        <div className={styles.title}>
          <h1>Alterar</h1>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
          <input type="text" value={bloodType} onChange={(e) => setBloodType(e.target.value)} />
          <input type="text" value={system} onChange={(e) => setSystem(e.target.value)} />
          <input type="text" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} />
          <button onClick={handleApplyChanges}>Aplicar Alterações</button>
        </div>
      ) : (
        <div>
          <h1 className={styles.title}>Personagem</h1>

          <div className={styles.container}>

            <img className={styles.img} src={character.imageUrl}></img>

            <div className={styles.containerinfo}>

              <div className={styles.name}>
                <p>Nome:</p>
                <h1>{character.name}</h1>
              </div>

              <div className={styles.name}>
                <p>Sangue:</p>
                <h1>{character.bloodType}</h1>
              </div>

              <div className={styles.name}>
                <p>Sistema:</p>
                <h1>{character.system}</h1>
              </div>

            </div>

          </div>

          <p>Sangue: {character.bloodType}</p>
          <p>Sistema: {character.system}</p>
        </div>
      )}
      {permission ? (<button onClick={handleEditClick}>Editar</button>) : (<div></div>)}
    </div>
  );
};

export default CreateCharacter;
