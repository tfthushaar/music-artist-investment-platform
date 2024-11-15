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
  addDoc,
  deleteDoc,
  serverTimestamp,
  runTransaction 
} from 'firebase/firestore';

class TradingService {
  constructor() {
    this.ordersCollection = collection(db, 'orders');
    this.tradesCollection = collection(db, 'trades');
    this.portfoliosCollection = collection(db, 'portfolios');
    this.artistsCollection = collection(db, 'artists');
  }

  // Get order book for an artist
  async getOrderBook(artistId) {
    try {
      // Get buy orders (bids)
      const bidsQuery = query(
        this.ordersCollection,
        where('artistId', '==', artistId),
        where('type', '==', 'buy'),
        where('status', '==', 'open'),
        orderBy('price', 'desc'),
        limit(50)
      );

      // Get sell orders (asks)
      const asksQuery = query(
        this.ordersCollection,
        where('artistId', '==', artistId),
        where('type', '==', 'sell'),
        where('status', '==', 'open'),
        orderBy('price', 'asc'),
        limit(50)
      );

      const [bidsSnapshot, asksSnapshot] = await Promise.all([
        getDocs(bidsQuery),
        getDocs(asksQuery)
      ]);

      const bids = bidsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      const asks = asksSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      // Calculate spread
      const lowestAsk = asks[0]?.price;
      const highestBid = bids[0]?.price;
      const spread = lowestAsk && highestBid ? lowestAsk - highestBid : 0;
      const spreadPercentage = lowestAsk ? (spread / lowestAsk) * 100 : 0;

      return {
        bids,
        asks,
        spread,
        spreadPercentage
      };
    } catch (error) {
      console.error('Error getting order book:', error);
      throw error;
    }
  }

  // Place a new order
  async placeOrder(orderData) {
    try {
      const {
        investorId,
        artistId,
        type,
        shares,
        price
      } = orderData;

      // Validate order
      await this.validateOrder(orderData);

      // Create the order
      const order = await addDoc(this.ordersCollection, {
        investorId,
        artistId,
        type,
        shares,
        price,
        status: 'open',
        filledShares: 0,
        timestamp: serverTimestamp()
      });

      // Try to match the order immediately
      await this.matchOrder(order.id);

      return order.id;
    } catch (error) {
      console.error('Error placing order:', error);
      throw error;
    }
  }

  // Cancel an order
  async cancelOrder(orderId) {
    try {
      await runTransaction(db, async (transaction) => {
        const orderRef = doc(this.ordersCollection, orderId);
        const orderDoc = await transaction.get(orderRef);

        if (!orderDoc.exists()) {
          throw new Error('Order not found');
        }

        if (orderDoc.data().status !== 'open') {
          throw new Error('Can only cancel open orders');
        }

        transaction.update(orderRef, {
          status: 'cancelled',
          updatedAt: serverTimestamp()
        });
      });

      return true;
    } catch (error) {
      console.error('Error cancelling order:', error);
      throw error;
    }
  }

  // Get trade history for an artist
  async getTradeHistory(artistId, limit = 50) {
    try {
      const tradesQuery = query(
        this.tradesCollection,
        where('artistId', '==', artistId),
        orderBy('timestamp', 'desc'),
        limit(limit)
      );

      const querySnapshot = await getDocs(tradesQuery);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error getting trade history:', error);
      throw error;
    }
  }

  // Private helper methods
  async validateOrder(orderData) {
    const { investorId, artistId, type, shares, price } = orderData;

    if (shares <= 0) {
      throw new Error('Share quantity must be positive');
    }

    if (price <= 0) {
      throw new Error('Price must be positive');
    }

    // If selling, verify the investor has enough shares
    if (type === 'sell') {
      const portfolioQuery = query(
        this.portfoliosCollection,
        where('investorId', '==', investorId),
        where('artistId', '==', artistId)
      );

      const portfolioSnapshot = await getDocs(portfolioQuery);
      const holding = portfolioSnapshot.docs[0]?.data();

      if (!holding || holding.shares < shares) {
        throw new Error('Insufficient shares for sell order');
      }
    }
  }

  async matchOrder(orderId) {
    await runTransaction(db, async (transaction) => {
      const orderRef = doc(this.ordersCollection, orderId);
      const orderDoc = await transaction.get(orderRef);
      
      if (!orderDoc.exists()) {
        throw new Error('Order not found');
      }

      const order = orderDoc.data();
      
      // Find matching orders
      const matchingOrdersQuery = query(
        this.ordersCollection,
        where('artistId', '==', order.artistId),
        where('type', '==', order.type === 'buy' ? 'sell' : 'buy'),
        where('status', '==', 'open'),
        orderBy('price', order.type === 'buy' ? 'asc' : 'desc')
      );

      const matchingOrdersSnapshot = await getDocs(matchingOrdersQuery);
      
      for (const matchingOrderDoc of matchingOrdersSnapshot.docs) {
        const matchingOrder = matchingOrderDoc.data();
        
        // Check if prices match
        if ((order.type === 'buy' && matchingOrder.price <= order.price) ||
            (order.type === 'sell' && matchingOrder.price >= order.price)) {
          
          // Execute trade
          await this.executeTrade(transaction, order, matchingOrder);
        }
      }
    });
  }

  async executeTrade(transaction, order1, order2) {
    // Create trade record
    const tradeRef = await addDoc(this.tradesCollection, {
      artistId: order1.artistId,
      buyOrderId: order1.type === 'buy' ? order1.id : order2.id,
      sellOrderId: order1.type === 'sell' ? order1.id : order2.id,
      price: order2.price,
      shares: Math.min(order1.shares - order1.filledShares, 
                      order2.shares - order2.filledShares),
      timestamp: serverTimestamp()
    });

  }
}

export const tradingService = new TradingService();