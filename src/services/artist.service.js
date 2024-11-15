import { db, storage } from '../config/firebase';
import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  limit,
  updateDoc,
  serverTimestamp 
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

class ArtistService {
  constructor() {
    this.collection = collection(db, 'artists');
  }

  // Get artist by ID
  async getArtistById(artistId) {
    try {
      const docRef = doc(this.collection, artistId);
      const docSnap = await getDoc(docRef);
      
      if (!docSnap.exists()) {
        throw new Error('Artist not found');
      }

      return {
        id: docSnap.id,
        ...docSnap.data()
      };
    } catch (error) {
      console.error('Error getting artist:', error);
      throw error;
    }
  }

  // Get all artists with optional filters
  async getArtists({ genre, sortBy = 'popularity', sortOrder = 'desc', limit: queryLimit = 20 } = {}) {
    try {
      let artistQuery = query(this.collection);

      if (genre && genre !== 'all') {
        artistQuery = query(artistQuery, where('genre', '==', genre));
      }

      artistQuery = query(
        artistQuery, 
        orderBy(sortBy, sortOrder), 
        limit(queryLimit)
      );

      const querySnapshot = await getDocs(artistQuery);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error getting artists:', error);
      throw error;
    }
  }

  // Get recommended artists based on user preferences
  async getRecommendedArtists(userId, limit = 5) {
    try {
      // This is a simplified recommendation algorithm
      const artistQuery = query(
        this.collection,
        orderBy('popularity', 'desc'),
        limit(limit)
      );

      const querySnapshot = await getDocs(artistQuery);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error getting recommended artists:', error);
      throw error;
    }
  }

  // Update artist profile
  async updateArtistProfile(artistId, updateData) {
    try {
      const docRef = doc(this.collection, artistId);
      
      await updateDoc(docRef, {
        ...updateData,
        updatedAt: serverTimestamp()
      });

      return true;
    } catch (error) {
      console.error('Error updating artist profile:', error);
      throw error;
    }
  }

  // Upload artist profile image
  async uploadProfileImage(artistId, file) {
    try {
      const storageRef = ref(storage, `artists/${artistId}/profile-image`);
      await uploadBytes(storageRef, file);
      
      const downloadURL = await getDownloadURL(storageRef);
      
      // Update artist document with new image URL
      await this.updateArtistProfile(artistId, {
        photoURL: downloadURL
      });

      return downloadURL;
    } catch (error) {
      console.error('Error uploading profile image:', error);
      throw error;
    }
  }

  // Get artist statistics
  async getArtistStats(artistId) {
    try {
      const docRef = doc(this.collection, artistId);
      const docSnap = await getDoc(docRef);
      
      if (!docSnap.exists()) {
        throw new Error('Artist not found');
      }

      const data = docSnap.data();
      
      return {
        totalShares: data.totalShares || 0,
        currentPrice: data.currentSharePrice || 0,
        marketCap: (data.totalShares || 0) * (data.currentSharePrice || 0),
        priceChange24h: data.priceChange24h || 0,
        volume24h: data.volume24h || 0,
        holders: data.holders || 0
      };
    } catch (error) {
      console.error('Error getting artist stats:', error);
      throw error;
    }
  }

  // Search artists
  async searchArtists(query, limit = 10) {
    try {
      // Note: This is a simple implementation
      const artistQuery = query(
        this.collection,
        where('searchTerms', 'array-contains', query.toLowerCase()),
        limit(limit)
      );

      const querySnapshot = await getDocs(artistQuery);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error searching artists:', error);
      throw error;
    }
  }
}

export const artistService = new ArtistService();