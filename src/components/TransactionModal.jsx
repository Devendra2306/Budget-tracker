import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import './TransactionModal.css';

const TransactionModal = ({ isOpen, onClose, initialData = null }) => {
  const { addTransaction, updateTransaction, showToast } = useFinance();
  const [type, setType] = useState('expense');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');

  // Populate data when modal opens if editing
  useEffect(() => {
    if (isOpen && initialData) {
      setType(initialData.type || 'expense');
      setAmount(initialData.amount ? String(Math.abs(initialData.amount)) : '');
      setCategory(initialData.category || '');
      setDescription(initialData.description || '');
    } else if (isOpen && !initialData) {
      setType('expense');
      setAmount('');
      setCategory('');
      setDescription('');
    }
  }, [isOpen, initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!amount || !category) return;
    
    const txData = {
      type,
      amount: parseFloat(amount),
      category,
      description
    };
    
    if (initialData && initialData.id) {
      updateTransaction(initialData.id, txData);
      showToast('Transaction updated successfully!');
    } else {
      addTransaction(txData);
      showToast('Transaction added successfully!');
    }
    // Reset and close
    onClose();
  };

  const categories = type === 'expense' 
    ? ['Food', 'Transport', 'Entertainment', 'Bills', 'Shopping', 'Other']
    : ['Salary', 'Freelance', 'Gift', 'Investment', 'Other'];

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
          >
            <div className="modal-header">
              <h2>{initialData ? 'Edit Transaction' : 'Add Transaction'}</h2>
              <button className="close-btn" onClick={onClose}>
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="transaction-form">
              <div className="type-toggle">
                <button
                  type="button"
                  className={`toggle-btn ${type === 'expense' ? 'active expense' : ''}`}
                  onClick={() => setType('expense')}
                >
                  Expense
                </button>
                <button
                  type="button"
                  className={`toggle-btn ${type === 'income' ? 'active income' : ''}`}
                  onClick={() => setType('income')}
                >
                  Income
                </button>
              </div>

              <div className="form-group">
                <label>Amount</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Category</label>
                <select 
                  value={category} 
                  onChange={(e) => setCategory(e.target.value)}
                  required
                >
                  <option value="" disabled>Select a category</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Description (Optional)</label>
                <input
                  type="text"
                  placeholder="What was this for?"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <button type="submit" className="submit-btn btn-primary">
                Save Transaction
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default TransactionModal;
