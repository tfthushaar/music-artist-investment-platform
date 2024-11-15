import { auth, db } from '../config/firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  updateProfile
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';

export const authService = {
  async login(email, password) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));
      return { user: userCredential.user, profile: userDoc.data() };
    } catch (error) {
      throw this.handleError(error);
    }
  },

  async registerArtist(email, password, artistData) {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Create artist profile
      await setDoc(doc(db, 'users', user.uid), {
        ...artistData,
        role: 'artist',
        createdAt: new Date().toISOString(),
        email
      });

      // Update display name
      await updateProfile(user, {
        displayName: artistData.artistName
      });

      return user;
    } catch (error) {
      throw this.handleError(error);
    }
  },

  async registerInvestor(email, password, investorData) {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Create investor profile
      await setDoc(doc(db, 'users', user.uid), {
        ...investorData,
        role: 'investor',
        createdAt: new Date().toISOString(),
        email
      });

      await updateProfile(user, {
        displayName: investorData.fullName
      });

      return user;
    } catch (error) {
      throw this.handleError(error);
    }
  },

  async resetPassword(email) {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      throw this.handleError(error);
    }
  },

  async updateUserProfile(uid, data) {
    try {
      const userRef = doc(db, 'users', uid);
      await updateDoc(userRef, {
        ...data,
        updatedAt: new Date().toISOString()
      });
    } catch (error) {
      throw this.handleError(error);
    }
  },

  handleError(error) {
    let message = 'An error occurred. Please try again.';
    
    switch (error.code) {
      case 'auth/user-not-found':
        message = 'No user found with this email address.';
        break;
      case 'auth/wrong-password':
        message = 'Invalid password.';
        break;
      case 'auth/email-already-in-use':
        message = 'This email is already registered.';
        break;
      case 'auth/weak-password':
        message = 'Password should be at least 6 characters.';
        break;
      default:
        message = error.message;
    }

    return new Error(message);
  }
};