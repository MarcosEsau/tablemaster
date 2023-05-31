import React, { useState, useEffect, useCallback } from "react";
import { collection, addDoc, setDoc, doc, getDoc, getCollection, query, where, onSnapshot, refEqual } from "firebase/firestore";
import {app, db, firebaseConfig} from '../../lib/firebase'
import styles from "../character/createCharacter.module.css";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

const SessionPage = () => {
  const [session, setSession] = useState(null);
  const [tableSession, setTableSession] = useState(null);
  const [permission, setPermission] = useState(false);

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

  const router = useRouter();
  const sessionId = router.query.id;
  console.log(sessionId)

  useEffect(() => {
    const fetchSession = async () => {
      if (sessionId) {
        const sessionRef = doc(db, "sessions", sessionId);
        const sessionDoc = await getDoc(sessionRef);
        if (sessionDoc.exists()) {
          const sessionData = sessionDoc.data();
          setTableSession(sessionData);
        }
      }
    };
    fetchSession();
  }, [sessionId]);

  useEffect(() => {
    if (tableSession) {
      const isOwner = tableSession.owner === session?.user?.email;
      setPermission(isOwner);
    }
  }, [tableSession, session?.user?.email]);
  


  return (
    <div>
      {sessionId}
      {tableSession && tableSession.name}
      {permission ? 
      <div>
        permissão
      </div> : null}
    </div>
  )
}

export default SessionPage