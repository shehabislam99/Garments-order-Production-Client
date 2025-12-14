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
    return signInWithEmailAndPassword(auth, email, password);
  };

  const logout = () => {
    setLoading(true);
    setRole(null);
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

  // Function to fetch user role from your backend
  const fetchUserRole = async (email) => {
    try {
      console.log("Fetching role for email:", email);

      // Try to get role from your backend
      const response = await axios.get(
        `http://localhost:5000/user/role/${email}`
      );

      if (response.data && response.data.role) {
        setRole(response.data.role);
        console.log("Role from API:", response.data.role);
      } else {
        console.error("No role found in response");
        setRole("buyer"); // Default role
      }
    } catch (error) {
      console.error("Error fetching user role:", error.message);

      // For development: Try alternative endpoints or mock data
      try {
        // Try to get user data (including role) from your user endpoint
        const userResponse = await axios.get(
          `http://localhost:5000/users/${email}`
        );
        if (userResponse.data && userResponse.data.role) {
          setRole(userResponse.data.role);
          console.log("Role from user data:", userResponse.data.role);
        } else {
          setRole("buyer"); // Default role
        }
      } catch (secondError) {
        console.error("Second attempt failed:", secondError.message);

        // Mock data for development - REMOVE IN PRODUCTION
        const mockRoles = {
          "admin@example.com": "admin",
          "manager@example.com": "manager",
          "buyer@example.com": "buyer",
          "shihabkhanahab@gmail.com": "buyer", // Your test email
        };

        if (mockRoles[email]) {
          setRole(mockRoles[email]);
          console.log("Using mock role:", mockRoles[email]);
        } else {
          setRole("buyer"); // Default role for all users
          console.log("Defaulting to buyer role");
        }
      }
    }
  };

  // Function to update role (can be called after registration)
  const updateUserRole = async (email, newRole) => {
    try {
      const response = await axios.put(`http://localhost:5000/user/role`, {
        email,
        role: newRole,
      });
      if (response.data.success) {
        setRole(newRole);
        console.log("Role updated successfully:", newRole);
        return true;
      }
    } catch (error) {
      console.error("Error updating role:", error);
    }
    return false;
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      if (currentUser?.email) {
        // Fetch user role whenever user changes
        await fetchUserRole(currentUser.email);
      } else {
        setRole(null);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

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
    updateUserRole, // Export if needed
    fetchUserRole, // Export if needed
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
