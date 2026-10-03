import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, DollarSign, Plus, Minus } from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import './TransactionModal.css';

const FundGoalModal = ({ isOpen, onClose, goal = null }) => {
  const { updateGoal, showToast } = useFinance();
  const [amount, setAmount] = useState('');
  const [isAdding, setIsAdding] = useState(true);

  if (!goal) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!amount) return;
    
    const parsedAmount = parseFloat(amount);
    let newCurrentAmount = isAdding 
      ? goal.currentAmount + parsedAmount 
      : goal.currentAmount - parsedAmount;
      
    // Prevent negative balances
    if (newCurrentAmount < 0) newCurrentAmount = 0;
    
    updateGoal(goal.id, { currentAmount: newCurrentAmount });
    onClose();
    setAmount('');
    setIsAdding(true);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="modal-backdrop">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="modal-overlay"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="modal-content glass-card"
            style={{ maxWidth: '400px' }}
          >
            <div className="modal-header">
              <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '1.5rem' }}>{goal.icon}</span> 
                {isAdding ? 'Add Funds' : 'Withdraw Funds'}
              </h2>
              <button className="close-btn" onClick={onClose}>
                <X size={24} />
              </button>
            </div>
            
            <p className="text-muted" style={{ marginBottom: '1.5rem' }}>
              Current saved: <strong>₹{goal.currentAmount.toLocaleString()}</strong> of ₹{goal.targetAmount.toLocaleString()}
            </p>

            <form onSubmit={handleSubmit} className="transaction-form">
              <div className="type-toggle">
                <button
                  type="button"
                  className={`toggle-btn ${isAdding ? 'active income' : ''}`}
                  onClick={() => setIsAdding(true)}
                  style={{ background: isAdding ? 'rgba(16, 185, 129, 0.15)' : 'transparent', color: isAdding ? '#10b981' : 'var(--text-muted)' }}
                >
                  <Plus size={16} style={{ marginRight: '0.5rem' }} /> Add
                </button>
                <button
                  type="button"
                  className={`toggle-btn ${!isAdding ? 'active expense' : ''}`}
                  onClick={() => setIsAdding(false)}
                  style={{ background: !isAdding ? 'rgba(239, 68, 68, 0.15)' : 'transparent', color: !isAdding ? '#ef4444' : 'var(--text-muted)' }}
                >
                  <Minus size={16} style={{ marginRight: '0.5rem' }} /> Withdraw
                </button>
              </div>

              <div className="form-group">
                <label>Amount</label>
                <div className="input-with-icon">
                  <DollarSign size={18} className="input-icon" />
                  <input
                    type="number"
                    step="0.01"
                    min="1"
                    placeholder="Enter amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                    autoFocus
                  />
                </div>
              </div>

              <button 
                type="submit" 
                className="submit-btn btn-primary" 
                style={{ background: goal.color }}
              >
                Confirm {isAdding ? 'Deposit' : 'Withdrawal'}
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default FundGoalModal;
