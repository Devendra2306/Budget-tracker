import { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, UserPlus, FileText, ArrowRight } from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import SplitModal from '../components/SplitModal';
import FriendModal from '../components/FriendModal';
import './Splitter.css';

const Splitter = () => {
  const { friends, splits } = useFinance();
  const [isSplitModalOpen, setIsSplitModalOpen] = useState(false);
  const [isFriendModalOpen, setIsFriendModalOpen] = useState(false);

  // Calculate debts algorithm
  const calculateBalances = () => {
    const balances = {};
    friends.forEach(f => {
      balances[f.id] = 0;
    });

    splits.forEach(split => {
      const payerId = split.paidBy;
      if (!balances[payerId] && balances[payerId] !== 0) balances[payerId] = 0;
      balances[payerId] += split.totalAmount;

      split.participants.forEach(p => {
        if (!balances[p.friendId] && balances[p.friendId] !== 0) balances[p.friendId] = 0;
        balances[p.friendId] -= p.amountOwed;
      });
    });

    // Simplify debts (Greedy algorithm)
    const debtors = [];
    const creditors = [];

    Object.keys(balances).forEach(id => {
      if (balances[id] < -0.01) debtors.push({ id, amount: -balances[id] });
      else if (balances[id] > 0.01) creditors.push({ id, amount: balances[id] });
    });

    debtors.sort((a, b) => b.amount - a.amount);
    creditors.sort((a, b) => b.amount - a.amount);

    const settlements = [];
    let i = 0;
    let j = 0;

    while (i < debtors.length && j < creditors.length) {
      const debtor = debtors[i];
      const creditor = creditors[j];
      const amount = Math.min(debtor.amount, creditor.amount);

      settlements.push({
        from: debtor.id,
        to: creditor.id,
        amount: amount
      });

      debtor.amount -= amount;
      creditor.amount -= amount;

      if (debtor.amount < 0.01) i++;
      if (creditor.amount < 0.01) j++;
    }

    return settlements;
  };

  const getFriendName = (id) => {
    const friend = friends.find(f => f.id === id);
    return friend ? friend.name : 'You (or Unknown)';
  };

  const settlements = calculateBalances();

  return (
    <div className="splitter-container">
      <header className="dashboard-header">
        <div>
          <h1 className="page-title">Expense Splitter</h1>
          <p className="page-subtitle">Settle up with friends easily.</p>
        </div>
        <div className="header-actions">
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="btn-secondary"
            onClick={() => setIsFriendModalOpen(true)}
          >
            <UserPlus size={20} />
            Add Friend
          </motion.button>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="btn-primary"
            onClick={() => setIsSplitModalOpen(true)}
          >
            <FileText size={20} />
            Add Bill
          </motion.button>
        </div>
      </header>

      <div className="splitter-grid">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="settlements-panel glass-card"
        >
          <h3>How to Settle Up</h3>
          {settlements.length === 0 ? (
            <div className="no-data">
              <Users size={48} style={{ opacity: 0.2, marginBottom: '1rem' }} />
              <p>You are all settled up!</p>
            </div>
          ) : (
            <ul className="settlements-list">
              {settlements.map((s, idx) => (
                <li key={idx} className="settlement-item">
                  <span className="person from">{getFriendName(s.from)}</span>
                  <div className="owes-info">
                    <span className="owes-label">owes</span>
                    <span className="owes-amount">${s.amount.toFixed(2)}</span>
                    <ArrowRight size={16} className="arrow-icon" />
                  </div>
                  <span className="person to">{getFriendName(s.to)}</span>
                </li>
              ))}
            </ul>
          )}
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="friends-panel glass-card"
        >
          <h3>Friends</h3>
          {friends.length === 0 ? (
            <div className="no-data">No friends added yet.</div>
          ) : (
            <ul className="friends-list">
              {friends.map(f => (
                <li key={f.id} className="friend-item">
                  <div className="avatar">{f.name.charAt(0).toUpperCase()}</div>
                  <span className="friend-name">{f.name}</span>
                </li>
              ))}
            </ul>
          )}
        </motion.div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="recent-splits glass-card"
      >
        <h3>Recent Bills</h3>
        {splits.length === 0 ? (
          <p className="no-data">No shared bills yet.</p>
        ) : (
          <ul className="splits-list">
            {splits.map(s => (
              <li key={s.id} className="split-item">
                <div className="split-details">
                  <div className="split-icon">
                    <FileText size={20} />
                  </div>
                  <div>
                    <h4>{s.description}</h4>
                    <span className="paid-by">Paid by {getFriendName(s.paidBy)}</span>
                  </div>
                </div>
                <div className="split-amount">
                  ${s.totalAmount.toFixed(2)}
                </div>
              </li>
            ))}
          </ul>
        )}
      </motion.div>

      <SplitModal isOpen={isSplitModalOpen} onClose={() => setIsSplitModalOpen(false)} />
      <FriendModal isOpen={isFriendModalOpen} onClose={() => setIsFriendModalOpen(false)} />
    </div>
  );
};

export default Splitter;
