import { createContext, useContext, useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, onSnapshot, query, where, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { useAuth } from './AuthContext';

const FinanceContext = createContext();

export const useFinance = () => useContext(FinanceContext);

export const FinanceProvider = ({ children }) => {
  const { currentUser } = useAuth();
  
  const [transactions, setTransactions] = useState([]);
  const [friends, setFriends] = useState([]);
  const [splits, setSplits] = useState([]);
  const [goals, setGoals] = useState([]);
  const [loadingData, setLoadingData] = useState(true);

  // Sync with Firestore
  useEffect(() => {
    if (!currentUser) {
      setTransactions([]);
      setFriends([]);
      setSplits([]);
      setGoals([]);
      setLoadingData(false);
      return;
    }

    setLoadingData(true);
    let unsubscribes = [];

    // 1. Transactions Listener
    const qTransactions = query(collection(db, 'transactions'), where('userId', '==', currentUser.uid));
    const unsubTransactions = onSnapshot(qTransactions, (snapshot) => {
      const data = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      data.sort((a, b) => new Date(b.date) - new Date(a.date));
      setTransactions(data);
    }, (error) => console.error("Error fetching transactions:", error));
    unsubscribes.push(unsubTransactions);

    // 2. Friends Listener
    const qFriends = query(collection(db, 'friends'), where('userId', '==', currentUser.uid));
    const unsubFriends = onSnapshot(qFriends, (snapshot) => {
      const data = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      setFriends(data);
    }, (error) => console.error("Error fetching friends:", error));
    unsubscribes.push(unsubFriends);

    // 3. Splits Listener
    const qSplits = query(collection(db, 'splits'), where('userId', '==', currentUser.uid));
    const unsubSplits = onSnapshot(qSplits, (snapshot) => {
      const data = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      data.sort((a, b) => new Date(b.date) - new Date(a.date));
      setSplits(data);
    }, (error) => console.error("Error fetching splits:", error));
    unsubscribes.push(unsubSplits);

    // 4. Goals Listener
    const qGoals = query(collection(db, 'goals'), where('userId', '==', currentUser.uid));
    const unsubGoals = onSnapshot(qGoals, (snapshot) => {
      const data = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setGoals(data);
      setLoadingData(false); // Assume done when last collection loads
    }, (error) => console.error("Error fetching goals:", error));
    unsubscribes.push(unsubGoals);

    return () => {
      unsubscribes.forEach(unsub => unsub());
    };
  }, [currentUser]);

  // Actions: Budget Tracker
  const addTransaction = async (transaction) => {
    if (!currentUser) return;
    try {
      await addDoc(collection(db, 'transactions'), {
        ...transaction,
        userId: currentUser.uid,
        date: new Date().toISOString()
      });
    } catch (e) {
      console.error("Error adding transaction: ", e);
      showToast("Failed to add transaction", "error");
    }
  };

  const deleteTransaction = async (id) => {
    if (!currentUser) return;
    try {
      await deleteDoc(doc(db, 'transactions', id));
    } catch (e) {
      console.error("Error deleting transaction: ", e);
      showToast("Failed to delete transaction", "error");
    }
  };

  const updateTransaction = async (id, updatedData) => {
    if (!currentUser) return;
    try {
      await updateDoc(doc(db, 'transactions', id), updatedData);
    } catch (e) {
      console.error("Error updating transaction: ", e);
      showToast("Failed to update transaction", "error");
    }
  };

  // Actions: Expense Splitter
  const addFriend = async (name) => {
    if (!currentUser) return;
    try {
      await addDoc(collection(db, 'friends'), {
        name,
        userId: currentUser.uid
      });
    } catch (e) {
      console.error("Error adding friend: ", e);
      showToast("Failed to add friend", "error");
    }
  };

  const addSplit = async (splitData) => {
    if (!currentUser) return;
    try {
      await addDoc(collection(db, 'splits'), {
        ...splitData,
        userId: currentUser.uid,
        date: new Date().toISOString()
      });
    } catch (e) {
      console.error("Error adding split: ", e);
      showToast("Failed to add split", "error");
    }
  };

  const deleteSplit = async (id) => {
    if (!currentUser) return;
    try {
      await deleteDoc(doc(db, 'splits', id));
    } catch (e) {
      console.error("Error deleting split: ", e);
      showToast("Failed to delete split", "error");
    }
  };

  // Actions: Goals
  const addGoal = async (goalData) => {
    if (!currentUser) return;
    try {
      await addDoc(collection(db, 'goals'), {
        ...goalData,
        userId: currentUser.uid,
        createdAt: new Date().toISOString()
      });
      showToast("Goal created successfully!");
    } catch (e) {
      console.error("Error adding goal: ", e);
      showToast("Failed to add goal", "error");
    }
  };

  const updateGoal = async (id, updatedData) => {
    if (!currentUser) return;
    try {
      await updateDoc(doc(db, 'goals', id), updatedData);
      showToast("Goal updated successfully!");
    } catch (e) {
      console.error("Error updating goal: ", e);
      showToast("Failed to update goal", "error");
    }
  };

  const deleteGoal = async (id) => {
    if (!currentUser) return;
    try {
      await deleteDoc(doc(db, 'goals', id));
      showToast("Goal deleted successfully!");
    } catch (e) {
      console.error("Error deleting goal: ", e);
      showToast("Failed to delete goal", "error");
    }
  };

  // Calculations
  const totalBalance = transactions.reduce((acc, curr) => {
    return curr.type === 'income' ? acc + curr.amount : acc - curr.amount;
  }, 0);

  const totalIncome = transactions.filter(t => t.type === 'income').reduce((acc, curr) => acc + curr.amount, 0);
  const totalExpense = transactions.filter(t => t.type === 'expense').reduce((acc, curr) => acc + curr.amount, 0);

  // Advanced Calculations
  const netCashFlow = totalIncome - totalExpense;
  const savingsRate = totalIncome > 0 ? ((netCashFlow / totalIncome) * 100) : 0;
  
  // Mock trend data
  const trends = {
    income: 8.5,
    expense: -2.3,
    savings: 12.4,
  };

  // Global Toast State
  const [toast, setToast] = useState(null);
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <FinanceContext.Provider value={{
      transactions, addTransaction, deleteTransaction, updateTransaction,
      friends, addFriend,
      splits, addSplit, deleteSplit,
      goals, addGoal, updateGoal, deleteGoal,
      totalBalance, totalIncome, totalExpense,
      netCashFlow, savingsRate, trends,
      toast, showToast, loadingData
    }}>
      {children}
    </FinanceContext.Provider>
  );
};
