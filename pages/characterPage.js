import React, { useState, useEffect, useReducer } from "react";
import { setDoc, doc, getDoc } from "firebase/firestore";
import { db } from '../lib/firebase'
import styles from "./characterPage.module.css";
import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/router";

const initialState = {
  autoLoginDone: false,
  character: null,
  editMode: false,
  name: "",
  bloodType: "",
  system: "",
  imageUrl: "",
  owner: "",
  permission: false,
};

const reducer = (state, action) => {
  switch (action.type) {
    case "SET_AUTO_LOGIN_DONE":
      return { ...state, autoLoginDone: true };
    case "SET_CHARACTER":
      return { ...state, character: action.payload };
    case "SET_EDIT_MODE":
      return { ...state, editMode: action.payload };
    case "SET_NAME":
      return { ...state, name: action.payload };
    case "SET_BLOOD_TYPE":
      return { ...state, bloodType: action.payload };
    case "SET_SYSTEM":
      return { ...state, system: action.payload };
    case "SET_IMAGE_URL":
      return { ...state, imageUrl: action.payload };
    case "SET_OWNER":
      return { ...state, owner: action.payload };
    case "SET_PERMISSION":
      return { ...state, permission: action.payload };
    default:
      return state;
  }
};


const CreateCharacter = () => {
  const [session, setSession] = useState(null);
  const [state, dispatch] = useReducer(reducer, initialState);
  const { autoLoginDone, character, editMode, name, bloodType, system, imageUrl, owner, permission } = state;


  useEffect(() => {
    const fetchSession = async () => {
      const response = await fetch("/api/auth");
      const { session } = await response.json();
      setSession(session);

      if (!session) {
        // router.replace("/login");
        console.log('Not Logged In')
      }
    };

    fetchSession();
  }, []);

  const router = useRouter()
  const characterCode = router.query.id
  
  useEffect(() => {
    const fetchCharacter = async () => {
      if (session && session.user) {
        const characterRef = doc(db, "users", session.user.email, "characters", characterCode);
        const characterDoc = await getDoc(characterRef);
        if (characterDoc.exists()) {
          const characterData = characterDoc.data();
          dispatch({ type: "SET_CHARACTER", payload: characterData });
          dispatch({ type: "SET_NAME", payload: characterData.name });
          dispatch({ type: "SET_SYSTEM", payload: characterData.system });
          dispatch({ type: "SET_IMAGE_URL", payload: characterData.imageUrl });
          dispatch({ type: "SET_OWNER", payload: characterData.owner });
          dispatch({ type: "SET_PERMISSION", payload: session.user.email === characterData.owner });
        }
      }
    };
  
    fetchCharacter();
  }, [session, characterCode, editMode]);
  

  const handleEditClick = () => {
    dispatch({ type: "SET_EDIT_MODE", payload: true });
  };
  
  const handleApplyChanges = async () => {
    const characterRef = doc(db, "users", session.user.email, "characters", characterCode);
    await setDoc(characterRef, {
      name,
      bloodType,
      system,
      imageUrl,
    });
    dispatch({ type: "SET_EDIT_MODE", payload: false });
  };
  

  if (!character) {
    return <div>Carregando...</div>;
  }

  return (
    <div>
      {editMode ? (
        <div className={styles.title}>
          <h1>Alterar</h1>
          <input type="text" value={name} onChange={(e) => dispatch({ type: "SET_NAME", payload: e.target.value })} />
          <input type="text" value={bloodType} onChange={(e) => dispatch({ type: "SET_BLOOD_TYPE", payload: e.target.value })} />
          <input type="text" value={system} onChange={(e) => dispatch({ type: "SET_SYSTEM", payload: e.target.value })} />
          <input type="text" value={imageUrl} onChange={(e) => dispatch({ type: "SET_IMAGE_URL", payload: e.target.value })} />
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
      {permission ? (<button onClick={handleEditClick}>Editar</button>) : null}
    </div>
  );
};

export default CreateCharacter;
