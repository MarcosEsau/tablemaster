import React, { useState, useEffect, useReducer } from "react";
import { setDoc, doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from '../../lib/firebase'
import styles from "./createCharacter.module.css";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Box from '@mui/material/Box';




const initialState = {
  name: '',
  bloodType: 'Vermelho',
  system: 'GLASS',
  imageUrl: '',
  characterCode: '',
}
const reducer = (state, action) => {
  switch (action.type) {
    case "SET_NAME":
      return { ...state, name: action.payload };
    case "SET_BLOOD_TYPE":
      return { ...state, bloodType: action.payload };
    case "SET_SYSTEM":
      return { ...state, system: action.payload };
    case "SET_IMAGE_URL":
      return { ...state, imageUrl: action.payload };
    case "SET_CODE":
      return { ...state, characterCode: action.payload };
    default:
      return state;
  }
};

const CreateCharacter = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { name, bloodType, system, imageUrl, characterCode } = state;

  const [session, setSession] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchSession = async () => {
      const response = await fetch("../api/auth");
      const { session } = await response.json();
      setSession(session);
      if (!session) {
        // router.replace("/login");
        console.log('Not Logged In')
      }
    };

    fetchSession();
  }, []);

  function generateCode() { //Create random code
    const randomNumber = Math.floor(Math.random() * 1000000);
    const code = randomNumber.toString().padStart(6, "0");
    dispatch({ type: "SET_CODE", payload: code });
  }
  useEffect(() => {
    generateCode();
    console.log(characterCode)
  }, [""]);

  

  if (!session) {
    return <div>Carregando...</div>;
  }
  
  const handleCreateCharacter = async () => {
    try { 
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
        router.push({
          pathname: '/',
          query: {
            id: characterCode,
          }
        })
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
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <div>
        <h1 className='big-title'>Criar Personagem</h1>
        <form
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1.5rem",
            width: "50vw",
          }}
        >
            <TextField
              label="Nome"
              value={name}
              onChange={(e) => dispatch({ type: "SET_NAME", payload: e.target.value })}
              sx={{ width: "100%", backgroundColor: "white" }}
            />
          
            <Select
              label="Sistema"
              value={system}
              onChange={(e) => dispatch({ type: "SET_SYSTEM", payload: e.target.value })}
              sx={{ width: "100%", backgroundColor: "white" }}
            >
              <MenuItem value="GLASS">GLASS</MenuItem>
            </Select>
          
          
            <Select
              inputProps={{
                name: 'age',
              }}          
              value={bloodType}
              onChange={(e) => dispatch({ type: "SET_BLOOD_TYPE", payload: e.target.value })}
              sx={{ width: "100%", backgroundColor: "white" }}
            >
              <MenuItem value="Vermelho">Vermelho</MenuItem>
              <MenuItem value="Prateado">Prateado</MenuItem>
              <MenuItem value="Sangue-Novo">Sangue-Novo</MenuItem>
            </Select>
       
         
            <TextField
              label="Imagem URL"
              value={imageUrl}
              onChange={(e) => dispatch({ type: "SET_IMAGE_URL", payload: e.target.value })}
              sx={{ width: "100%", backgroundColor: "white" }}
            />
         
          <Button variant="contained" onClick={handleCreateCharacter}>
            Criar Personagem
          </Button>
        </form>
      </div>
    </div>
      
    {/* <h1 className='big-title'>Criar Personagem</h1>
    <div className={styles.creatorContainer}>
      <form className={styles.creatorForm}>
      <div className={styles.inputContainer}>
        <label className={styles.label}>
          Nome:
          <input
            type="text"
            value={name}
            onChange={(e) => dispatch({ type: "SET_NAME", payload: e.target.value })}
            className={styles.input}
          />
        </label>
      </div>
      <div className={styles.inputContainer}>
          <label className={styles.label}>
            Sistema:
            <select
              value={system}
              onChange={(e) => dispatch({ type: "SET_SYSTEM", payload: e.target.value })}
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
              onChange={(e) => dispatch({ type: "SET_BLOOD_TYPE", payload: e.target.value })}
              className={styles.select}
            >
              <option value="Vermelho">Vermelho</option>
              <option value="Prateado">Prateado</option>
              <option value="Sangue-Novo">Sangue-Novo</option>
    
            </select>
          </label>
      </div>
      <div className={styles.inputContainer}>
        <label className={styles.label}>
          Imagem URL:
          <input
            type="text"
            value={imageUrl}
            onChange={(e) => dispatch({ type: "SET_IMAGE_URL", payload: e.target.value })}
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
      </form>
      
    </div> */}
    </>
  );
};

export default CreateCharacter;
