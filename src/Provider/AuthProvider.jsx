import React, { useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from "firebase/auth";
import { auth } from "../Firebase/firebase.config";
import { AuthContext } from "./AuthContext";
import axios from "axios";


const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState(null);
  const googleProvider = new GoogleAuthProvider();

  const createUser = (email, password) => {
    setLoading(true);
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const signIn = (email, password) => {
    setLoading(true);
    return signInWithEmailAndPassword(auth, email, password).then((result) => {
      auth.currentUser.reload().then(() => {
        setUser(auth.currentUser);
      });
      return result;
    });
  };

  const logout = () => {
    setLoading(true);
    return signOut(auth);
  };

const updateUserProfile = async (user, profileData) => {
  await updateProfile(user, {
    displayName: profileData.displayName,
    photoURL: profileData.photoURL,
  });
  await auth.currentUser.reload();
  setUser(auth.currentUser);

  return auth.currentUser;
};


  const signInWithGoogle = () => {
    setLoading(true);
    return signInWithPopup(auth, googleProvider);
  };
  const resetPassword = (email) => sendPasswordResetEmail(auth, email);



  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

 useEffect(() => {
   if (!user?.email) return;

   const fetchUserRole = async () => {
     const res = await axios.get(
       `http://localhost:5000/user/role/${user?.email}`
     );
     setRole(res.data.role);
   };

   fetchUserRole();
 }, [user?.email]);

  const value = {
    user,
    role,
    loading,
    createUser,
    signIn,
    logout,
    signInWithGoogle,
    updateUserProfile,
    resetPassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
