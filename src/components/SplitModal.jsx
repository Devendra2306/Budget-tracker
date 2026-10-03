import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import '../components/TransactionModal.css';

const SplitModal = ({ isOpen, onClose }) => {
  const { friends, addSplit } = useFinance();
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [paidBy, setPaidBy] = useState('you');
  
  // Track who is involved in this split
  const [participants, setParticipants] = useState({});

  const handleToggleParticipant = (id) => {
    setParticipants(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!amount || !description) return;
    
    const numParticipants = Object.values(participants).filter(Boolean).length + 1; // +1 for "you" assuming you're always involved, or we can just count selected + paidBy logic.
    // For simplicity, let's assume everyone checked + "you" split equally.
    
    // Actually, let's allow "you" to be toggled too, but to keep it simple:
    const activeParticipants = Object.keys(participants).filter(k => participants[k]);
    
    // If no friends selected, it's not a split.
    if (activeParticipants.length === 0) {
      alert("Select at least one friend to split with.");
      return;
    }

    // "you" is a participant by default if not explicit. Let's just include "you" and active friends.
    const allInvolved = ['you', ...activeParticipants];
    
    const totalAmount = parseFloat(amount);
    const splitAmount = totalAmount / allInvolved.length;
    
    const participantData = allInvolved.map(id => ({
      friendId: id,
      amountOwed: splitAmount
    }));

    addSplit({
      description,
      totalAmount,
      paidBy,
      participants: participantData
    });
    
    setDescription('');
    setAmount('');
    setPaidBy('you');
    setParticipants({});
    onClose();
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
          >
            <div className="modal-header">
              <h2>Add Shared Bill</h2>
              <button className="close-btn" onClick={onClose}>
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="transaction-form">
              <div className="form-group">
                <label>Description</label>
                <input
                  type="text"
                  placeholder="e.g. Dinner at Mario's"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Total Amount</label>
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
                <label>Paid By</label>
                <select value={paidBy} onChange={(e) => setPaidBy(e.target.value)}>
                  <option value="you">You</option>
                  {friends.map(f => (
                    <option key={f.id} value={f.id}>{f.name}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Split with</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '150px', overflowY: 'auto' }}>
                  {friends.length === 0 ? (
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Add friends first to split bills.</p>
                  ) : (
                    friends.map(f => (
                      <label key={f.id} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                        <input
                          type="checkbox"
                          checked={participants[f.id] || false}
                          onChange={() => handleToggleParticipant(f.id)}
                          style={{ width: 'auto' }}
                        />
                        {f.name}
                      </label>
                    ))
                  )}
                </div>
              </div>

              <button type="submit" className="submit-btn btn-primary">
                Save Bill
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default SplitModal;
