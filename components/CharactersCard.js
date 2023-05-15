import React from 'react';
import { useRouter } from 'next/router';
import styles from './CharacterCard.module.css';

const CharacterCard = ({ name, bloodType, image, system = 'GLASS', characterCode }) => {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/characters/${characterCode}`);
  }

  return (
    <div className={styles.card}>
      <img src={image} alt={`${name} character`} className={styles.image} />
      <div className={styles.content}>
        <h2 className={styles.name}>{name}</h2>
        <p className={styles.bloodType}>Blood type: {bloodType}</p>
        <p className={styles.system}>System: {system}</p>
        <button className={styles.button} onClick={handleClick}>Access Character</button>
      </div>
    </div>
  );
}

export default CharacterCard;
