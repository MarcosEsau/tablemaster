import React, { useState } from 'react';
import { useRouter } from 'next/router';
import styles from './CharactersCard.module.css';
import Button from '@mui/material/Button'
import DeleteIcon from '@mui/icons-material/Delete';

const CharactersCard = ({ character }) => {
  const router = useRouter();
  const [imageError, setImageError] = useState(false)

  const handleImageError = () => {
    setImageError(true)
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
        <p className={styles.bloodType}>Blood type: {character.bloodType}</p>
        <p className={styles.system}>System: {character.system}</p>
        <Button variant="contained">Entrar em Sessão</Button>
          <Button variant="contained" color='success'>Acessar Personagem</Button>
          <Button variant="outlined" color="secondary" startIcon={<DeleteIcon />}>
            Deletar
          </Button>
      </div>
    </div>
  );
}

export default CharactersCard;
