import React, { useState, useEffect } from "react";
import { collection, addDoc, setDoc, doc, getDoc, getCollection, query, where, onSnapshot, refEqual } from "firebase/firestore";
import {app, db, firebaseConfig} from '../../lib/firebase'
import styles from "../createCharacter.module.css";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

const sessionPage = () => {
  const { data: session, status } = useSession();
  const [autoLoginDone, setAutoLoginDone] = useState(false);
  const [tableSession, setTableSession] = useState(null);

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

  const router = useRouter();
  const sessionName = router.query.id;

  useEffect(() => {
    const fetchSession = async () => {
      const sessionRef = doc(db, "sessions", sessionName);
      const sessionDoc = await getDoc(sessionRef);
      if (sessionDoc.exists()) {
        const sessionData = sessionDoc.data();
        setTableSession(sessionData);
      }
    };
    fetchSession();
  }, [session, sessionName]);

  console.log(tableSession)


  return (
    <div>sessionPage</div>
  )
}

export default sessionPage