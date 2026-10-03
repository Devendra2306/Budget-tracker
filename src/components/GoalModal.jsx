import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Target, Calendar, DollarSign, Image } from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import './TransactionModal.css'; // Reusing modal styles

const GOAL_ICONS = ['🏠', '🚗', '✈️', '🎓', '💻', '💍', '👶', '🎉', '🏥', '📈'];
const GOAL_COLORS = ['#3b82f6', '#10b981', '#8b5cf6', '#f59e0b', '#ef4444', '#ec4899', '#06b6d4'];

const GoalModal = ({ isOpen, onClose, initialData = null }) => {
  const { addGoal, updateGoal, showToast } = useFinance();
  
  const [name, setName] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [currentAmount, setCurrentAmount] = useState('');
  const [deadline, setDeadline] = useState('');
  const [icon, setIcon] = useState(GOAL_ICONS[0]);
  const [color, setColor] = useState(GOAL_COLORS[0]);

  useEffect(() => {
    if (isOpen && initialData) {
      setName(initialData.name || '');
      setTargetAmount(initialData.targetAmount ? String(initialData.targetAmount) : '');
      setCurrentAmount(initialData.currentAmount ? String(initialData.currentAmount) : '0');
      setDeadline(initialData.deadline || '');
      setIcon(initialData.icon || GOAL_ICONS[0]);
      setColor(initialData.color || GOAL_COLORS[0]);
    } else if (isOpen && !initialData) {
      setName('');
      setTargetAmount('');
      setCurrentAmount('0');
      setDeadline('');
      setIcon(GOAL_ICONS[0]);
      setColor(GOAL_COLORS[0]);
    }
  }, [isOpen, initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !targetAmount) return;
    
    const goalData = {
      name,
      targetAmount: parseFloat(targetAmount),
      currentAmount: parseFloat(currentAmount || 0),
      deadline: deadline || null,
      icon,
      color,
      status: 'active' // can be active, completed
    };
    
    if (initialData && initialData.id) {
      updateGoal(initialData.id, goalData);
    } else {
      addGoal(goalData);
    }
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
            style={{ maxWidth: '450px' }}
          >
            <div className="modal-header">
              <h2>{initialData ? 'Edit Goal' : 'Create New Goal'}</h2>
              <button className="close-btn" onClick={onClose}>
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="transaction-form">
              <div className="form-group">
                <label>Goal Name</label>
                <div className="input-with-icon">
                  <Target size={18} className="input-icon" />
                  <input
                    type="text"
                    placeholder="e.g., Dream Home Downpayment"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label>Target Amount</label>
                  <div className="input-with-icon">
                    <DollarSign size={18} className="input-icon" />
                    <input
                      type="number"
                      step="0.01"
                      min="1"
                      placeholder="50000"
                      value={targetAmount}
                      onChange={(e) => setTargetAmount(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Already Saved</label>
                  <div className="input-with-icon">
                    <DollarSign size={18} className="input-icon" />
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="0.00"
                      value={currentAmount}
                      onChange={(e) => setCurrentAmount(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label>Target Date (Optional)</label>
                <div className="input-with-icon">
                  <Calendar size={18} className="input-icon" />
                  <input
                    type="date"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Icon</label>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {GOAL_ICONS.map(i => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setIcon(i)}
                      style={{
                        background: icon === i ? 'var(--bg-hover)' : 'transparent',
                        border: icon === i ? `2px solid ${color}` : '2px solid transparent',
                        borderRadius: '12px',
                        fontSize: '1.5rem',
                        padding: '0.25rem 0.5rem',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                    >
                      {i}
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label>Theme Color</label>
                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                  {GOAL_COLORS.map(c => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setColor(c)}
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        background: c,
                        border: color === c ? '3px solid #fff' : '2px solid transparent',
                        boxShadow: color === c ? `0 0 0 2px ${c}` : 'none',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                    />
                  ))}
                </div>
              </div>

              <button type="submit" className="submit-btn btn-primary" style={{ marginTop: '1rem', background: color }}>
                {initialData ? 'Save Changes' : 'Create Goal'}
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default GoalModal;
