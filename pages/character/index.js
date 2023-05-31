import React, { useState, useEffect, useReducer } from "react";
import { setDoc, doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from '../../lib/firebase'
import styles from "./characterPage.module.css";
import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/router";
import Button from '@mui/material/Button'
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

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


const CharacterPage = () => {
  const [session, setSession] = useState(null);
  const [state, dispatch] = useReducer(reducer, initialState);
  const [imageError, setImageError] = useState(false);
  const [open, setOpen] = useState(false);
  const { character, editMode, name, bloodType, system, imageUrl, owner, permission } = state;


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
          dispatch({ type: "SET_BLOOD_TYPE", payload: characterData.bloodType });
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
  
  const handleImageError = () => {
    setImageError(true)
  }

  const handleEditClick = () => {
    dispatch({ type: "SET_EDIT_MODE", payload: true });
  };

  const handleCloseEditMode = () => {
    dispatch({ type: "SET_EDIT_MODE", payload: false });
  };
  
  const handleApplyChanges = async () => {
    const characterRef = doc(db, "users", session.user.email, "characters", characterCode);
    await updateDoc(characterRef, {
      name,
      bloodType,
      system,
      imageUrl,
    });
    dispatch({ type: "SET_EDIT_MODE", payload: false });
  };

  const handleOpenDialog = () => {
    setOpen(true);
  };
  const handleCloseDialog = () => {
    setOpen(false);
  };
  const handleDeleteCharacter = async () => {
    try {
      const characterRef = doc(db, "users", session.user.email, "characters", characterCode);
      await deleteDoc(characterRef);
      
      console.log('Personagem excluído:', characterCode);
    } catch (error) {
      console.error("Erro ao excluir personagem:", error);
    }
  };
  

  if (!character) {
    return <div>Carregando...</div>;
  }

  return (
    <div>
      {editMode ? (
        <div className={styles.edit}>
          
          <div className={styles.creatorForm}>
          <h1>Alterar</h1>
            <input type="text" value={name} onChange={(e) => dispatch({ type: "SET_NAME", payload: e.target.value })} />
            <select value={system} onChange={(e) => dispatch({ type: "SET_SYSTEM", payload: e.target.value })}>
              <option value="GLASS">GLASS</option>
            </select>
            <select value={bloodType} onChange={(e) => dispatch({ type: "SET_BLOOD_TYPE", payload: e.target.value })}>
              <option value="Vermelho">Vermelho</option>
              <option value="Prateado">Prateado</option>
              <option value="Sangue-Novo">Sangue-Novo</option>
            </select>
            <input type="text" value={imageUrl} onChange={(e) => dispatch({ type: "SET_IMAGE_URL", payload: e.target.value })} />
            <button onClick={handleApplyChanges}>Aplicar Alterações</button><br />
            <button onClick={handleCloseEditMode}>Cancelar</button>
          </div>
        </div>
      ) : (
        <div className={styles.upperInfo}>
          <h1 className={styles.title}>Personagem</h1>

          <div className={styles.container}>
          {imageError ? (
              <img src="/default.jpg" alt="Default" className={styles.img}/>
            ) : (
              <img className={styles.img} src={character.imageUrl} onError={handleImageError} />
            )}

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

              <h1>Detalhes:</h1>
            <div className={styles.about}>
              
            </div>
          </div>
        </div>
      )}
      {permission ? (
        <div className={styles.ownerPanel}>
          <Button onClick={handleEditClick} variant="contained" color="primary" startIcon={< EditIcon/>}>Editar</Button>
          <Button variant="contained" color="secondary" onClick={() => {handleJoinSession(character.characterCode)}}>
            Entrar em Sessão
          </Button>
          <Button variant="contained" color="error" endIcon={< DeleteIcon/>} onClick={() => {handleOpenDialog()}}></Button>

          <Dialog open={open} onClose={() => {handleCloseDialog()}}>
              <DialogTitle>Confirmação de Exclusão</DialogTitle>
              <DialogContent>
                <DialogContentText>
                  Tem certeza de que deseja excluir este personagem?
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={() => {handleCloseDialog()}}>Cancelar</Button>
                <Button onClick={() => {handleDeleteCharacter()}} autoFocus>
                  Confirmar
                </Button>
              </DialogActions>
            </Dialog>
        </div>
      ) : null}
    </div>
  );
};

export default CharacterPage;
