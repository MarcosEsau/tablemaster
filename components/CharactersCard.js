import React, { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { doc, deleteDoc } from 'firebase/firestore'
import { useRouter } from 'next/router';
import styles from './CharactersCard.module.css';
import Button from '@mui/material/Button'
import DeleteIcon from '@mui/icons-material/Delete';
import ButtonGroup from '@mui/material/ButtonGroup';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';


const CharactersCard = ({ character, user }) => {
  const router = useRouter();
  const [imageError, setImageError] = useState(false)
  const [open, setOpen] = useState(false);


  const handleOpenDialog = () => {
    setOpen(true);
  };
  const handleCloseDialog = () => {
    setOpen(false);
  };
  const handleDeleteCharacter = async () => {
    try {
      const characterRef = doc(db, "users", user, "characters", character.characterCode);
      await deleteDoc(characterRef);
      
      console.log('Personagem excluído:', character.characterCode);
    } catch (error) {
      console.error("Erro ao excluir personagem:", error);
    }
  };

  const handleImageError = () => {
    setImageError(true)
  }

  const handleJoinSession = () => {
    console.log("Join Session")
  }
  const handleAccessCharacter = () => {
    router.push({
      pathname: 'character',
      query: {
        id: character.characterCode,
      }
    })
  }


  return (
    <div className={styles.card}>
      {imageError ? (
        <img src="/default.jpg" alt="Default" className={styles.image}/>
      ) : (
        <img src={character.imageUrl} alt={`${character.name} character`} className={styles.image} onError={handleImageError} />
      )}
      <div className={styles.content}>
        <h2 className={styles.name}>{character.name}</h2>
        <p className={styles.bloodType}>Tipo Sanguíneo: {character.bloodType}</p>
        <p className={styles.system}>Sistema: {character.system}</p>
        <ButtonGroup color="primary">
          <Button variant="contained" color="primary" onClick={() => {handleJoinSession(character.characterCode)}}>
            Entrar em Sessão
          </Button>
          <Button variant="outlined" color="warning" onClick={() => {handleAccessCharacter(character.characterCode)}}>
            Acessar Personagem
          </Button>
          <Button variant="contained" color="error" endIcon={< DeleteIcon/>} onClick={() => {handleOpenDialog()}}>
            Deletar Personagem
          </Button>
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
        </ButtonGroup>
      </div>
    </div>
  );
}


export default CharactersCard;
