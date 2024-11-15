import { db } from '../config/firebase';
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
  addDoc,
  deleteDoc,
  serverTimestamp,
  runTransaction
} from 'firebase/firestore';

class InvestorService {
  constructor() {
    this.investorsCollection = collection(db, 'investors');
    this.portfoliosCollection = collection(db, 'portfolios');
    this.watchlistCollection = collection(db, 'watchlists');
    this.transactionsCollection = collection(db, 'transactions');
  }

  // Get investor profile
  async getInvestorProfile(userId) {
    try {
      const docRef = doc(this.investorsCollection, userId);
      const docSnap = await getDoc(docRef);
      
      if (!docSnap.exists()) {
        throw new Error('Investor profile not found');
      }

      return {
        id: docSnap.id,
        ...docSnap.data()
      };
    } catch (error) {
      console.error('Error getting investor profile:', error);
      throw error;
    }
  }

  // Get investor portfolio
  async getPortfolio(userId) {
    try {
      const portfolioQuery = query(
        this.portfoliosCollection,
        where('investorId', '==', userId),
        orderBy('updatedAt', 'desc')
      );

      const querySnapshot = await getDocs(portfolioQuery);
      const portfolio = [];

      for (const doc of querySnapshot.docs) {
        const holding = doc.data();
        // Fetch current artist data for each holding
        const artistDoc = await getDoc(doc(db, 'artists', holding.artistId));
        
        portfolio.push({
          id: doc.id,
          ...holding,
          artist: {
            id: artistDoc.id,
            ...artistDoc.data()
          }
        });
      }

      return portfolio;
    } catch (error) {
      console.error('Error getting portfolio:', error);
      throw error;
    }
  }

  // Get portfolio statistics
  async getPortfolioStats(userId) {
    try {
      const portfolio = await this.getPortfolio(userId);
      
      const stats = portfolio.reduce((acc, holding) => {
        const currentValue = holding.shares * holding.artist.currentSharePrice;
        const investedValue = holding.shares * holding.purchasePrice;
        const profit = currentValue - investedValue;

        return {
          totalValue: acc.totalValue + currentValue,
          totalInvested: acc.totalInvested + investedValue,
          totalProfit: acc.totalProfit + profit,
          numberOfArtists: acc.numberOfArtists + 1
        };
      }, {
        totalValue: 0,
        totalInvested: 0,
        totalProfit: 0,
        numberOfArtists: 0
      });

      stats.returnPercentage = stats.totalInvested > 0 
        ? (stats.totalProfit / stats.totalInvested) * 100 
        : 0;

      return stats;
    } catch (error) {
      console.error('Error getting portfolio stats:', error);
      throw error;
    }
  }

  // Manage watchlist
  async getWatchlist(userId) {
    try {
      const watchlistQuery = query(
        this.watchlistCollection,
        where('investorId', '==', userId)
      );

      const querySnapshot = await getDocs(watchlistQuery);
      const watchlist = [];

      for (const doc of querySnapshot.docs) {
        const item = doc.data();
        const artistDoc = await getDoc(doc(db, 'artists', item.artistId));
        
        watchlist.push({
          id: doc.id,
          ...item,
          artist: {
            id: artistDoc.id,
            ...artistDoc.data()
          }
        });
      }

      return watchlist;
    } catch (error) {
      console.error('Error getting watchlist:', error);
      throw error;
    }
  }

  async addToWatchlist(userId, artistId) {
    try {
      await addDoc(this.watchlistCollection, {
        investorId: userId,
        artistId: artistId,
        createdAt: serverTimestamp()
      });

      return true;
    } catch (error) {
      console.error('Error adding to watchlist:', error);
      throw error;
    }
  }

  async removeFromWatchlist(watchlistId) {
    try {
      await deleteDoc(doc(this.watchlistCollection, watchlistId));
      return true;
    } catch (error) {
      console.error('Error removing from watchlist:', error);
      throw error;
    }
  }

  // Get transaction history
  async getTransactionHistory(userId, { limit: queryLimit = 20, offset = 0 } = {}) {
    try {
      const transactionQuery = query(
        this.transactionsCollection,
        where('investorId', '==', userId),
        orderBy('timestamp', 'desc'),
        limit(queryLimit)
      );

      const querySnapshot = await getDocs(transactionQuery);
      const transactions = [];

      for (const doc of querySnapshot.docs) {
        const transaction = doc.data();
        const artistDoc = await getDoc(doc(db, 'artists', transaction.artistId));
        
        transactions.push({
          id: doc.id,
          ...transaction,
          artist: {
            id: artistDoc.id,
            ...artistDoc.data()
          }
        });
      }

      return transactions;
    } catch (error) {
      console.error('Error getting transaction history:', error);
      throw error;
    }
  }

  // Update investor profile
  async updateProfile(userId, updateData) {
    try {
      const docRef = doc(this.investorsCollection, userId);
      
      await updateDoc(docRef, {
        ...updateData,
        updatedAt: serverTimestamp()
      });

      return true;
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  }
}

export const investorService = new InvestorService();