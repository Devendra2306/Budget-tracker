import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, Trash2, Target, TrendingUp, AlertTriangle,
  CheckCircle, Utensils, Car, ShoppingCart, Zap, Heart,
  Smartphone, Plane, BookOpen, Coffee, Home, Gift, DollarSign, Briefcase
} from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import './Budgets.css';

const CATEGORY_ICONS = {
  Food: Utensils, Transport: Car, Shopping: ShoppingCart, Bills: Zap,
  Health: Heart, Entertainment: Smartphone, Travel: Plane, Education: BookOpen,
  Coffee: Coffee, Housing: Home, Gift: Gift, Other: DollarSign,
};

const CATEGORY_COLORS = {
  Food: '#f59e0b', Transport: '#3b82f6', Shopping: '#8b5cf6',
  Bills: '#ef4444', Health: '#10b981', Entertainment: '#ec4899',
  Travel: '#06b6d4', Education: '#f97316', Coffee: '#92400e',
  Housing: '#78716c', Gift: '#f43f5e', Other: '#6b7280',
};

const CATEGORIES = Object.keys(CATEGORY_ICONS);

const cardVariants = {
  hidden: { opacity: 0, y: 24, scale: 0.97 },
  visible: (i) => ({
    opacity: 1, y: 0, scale: 1,
    transition: { delay: i * 0.07, type: 'spring', stiffness: 260, damping: 22 },
  }),
  exit: { opacity: 0, scale: 0.95, transition: { duration: 0.18 } },
};

const BudgetCard = ({ budget, spent, onDelete, index }) => {
  const pct = Math.min((spent / budget.limit) * 100, 100);
  const isOver = spent > budget.limit;
  const isCritical = pct >= 80 && !isOver;
  const CategoryIcon = CATEGORY_ICONS[budget.category] || DollarSign;
  const color = CATEGORY_COLORS[budget.category] || '#6b7280';

  const barColor = isOver
    ? '#ef4444'
    : isCritical
    ? '#f59e0b'
    : color;

  const statusLabel = isOver
    ? 'Over Budget!'
    : isCritical
    ? 'Almost There'
    : 'On Track';

  const StatusIcon = isOver ? AlertTriangle : isCritical ? TrendingUp : CheckCircle;

  return (
    <motion.div
      className={`budget-card ${isOver ? 'budget-card--over' : ''}`}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      custom={index}
      whileHover={{ y: -4, boxShadow: '0 12px 36px rgba(0,0,0,0.1)' }}
    >
      {/* Card Header */}
      <div className="budget-card-header">
        <div className="budget-card-icon" style={{ background: `${color}18`, color }}>
          <CategoryIcon size={22} />
        </div>
        <div className="budget-card-info">
          <span className="budget-card-category">{budget.category}</span>
          <span className={`budget-status-badge ${isOver ? 'over' : isCritical ? 'warning' : 'ok'}`}>
            <StatusIcon size={12} />
            {statusLabel}
          </span>
        </div>
        <motion.button
          className="budget-delete-btn"
          onClick={() => onDelete(budget.id)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Trash2 size={15} />
        </motion.button>
      </div>

      {/* Amounts */}
      <div className="budget-amounts">
        <div>
          <div className="budget-spent" style={{ color: isOver ? '#ef4444' : 'var(--text-dark)' }}>
            ₹{spent.toLocaleString('en-IN')}
          </div>
          <div className="budget-label">spent</div>
        </div>
        <div className="budget-divider" />
        <div>
          <div className="budget-limit">₹{budget.limit.toLocaleString('en-IN')}</div>
          <div className="budget-label">budget</div>
        </div>
        <div className="budget-divider" />
        <div>
          <div className={`budget-remaining ${isOver ? 'over' : ''}`}>
            {isOver ? '-' : '+'}₹{Math.abs(budget.limit - spent).toLocaleString('en-IN')}
          </div>
          <div className="budget-label">{isOver ? 'over' : 'left'}</div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="budget-progress-wrap">
        <div className="budget-progress-track">
          <motion.div
            className="budget-progress-fill"
            style={{ background: barColor }}
            initial={{ width: '0%' }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 1, ease: 'easeOut', delay: index * 0.07 + 0.3 }}
          />
        </div>
        <span className="budget-pct" style={{ color: barColor }}>{Math.round(pct)}%</span>
      </div>
    </motion.div>
  );
};

const AddBudgetModal = ({ isOpen, onClose, onAdd }) => {
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [limit, setLimit] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!limit || isNaN(limit) || Number(limit) <= 0) return;
    onAdd({ category, limit: Number(limit) });
    setLimit('');
    setCategory(CATEGORIES[0]);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="budget-modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="budget-modal"
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 26 }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="budget-modal-title">Set a Budget</h2>
            <p className="budget-modal-sub">Set a monthly spending limit for a category.</p>
            <form onSubmit={handleSubmit} className="budget-modal-form">
              <div className="budget-field">
                <label>Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="budget-select"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div className="budget-field">
                <label>Monthly Limit (₹)</label>
                <input
                  type="number"
                  placeholder="e.g. 5000"
                  value={limit}
                  onChange={(e) => setLimit(e.target.value)}
                  className="budget-input"
                  min="1"
                  required
                />
              </div>
              <div className="budget-modal-actions">
                <button type="button" className="budget-btn budget-btn--outline" onClick={onClose}>
                  Cancel
                </button>
                <button type="submit" className="budget-btn budget-btn--primary">
                  <Target size={15} /> Set Budget
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const Budgets = () => {
  const { transactions, showToast } = useFinance();
  const [budgets, setBudgets] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('budgets') || '[]');
    } catch {
      return [];
    }
  });
  const [modalOpen, setModalOpen] = useState(false);

  const saveBudgets = (newBudgets) => {
    setBudgets(newBudgets);
    localStorage.setItem('budgets', JSON.stringify(newBudgets));
  };

  const addBudget = (b) => {
    const exists = budgets.find((x) => x.category === b.category);
    if (exists) {
      saveBudgets(budgets.map((x) => x.category === b.category ? { ...x, limit: b.limit } : x));
      showToast(`Updated budget for ${b.category}`, 'success');
    } else {
      const newBudget = { ...b, id: Date.now().toString() };
      saveBudgets([...budgets, newBudget]);
      showToast(`Budget set for ${b.category}`, 'success');
    }
  };

  const deleteBudget = (id) => {
    saveBudgets(budgets.filter((b) => b.id !== id));
    showToast('Budget removed', 'error');
  };

  // Calculate spent per category from current month's expenses
  const spentByCategory = useMemo(() => {
    const now = new Date();
    return transactions
      .filter((t) => {
        const d = new Date(t.date);
        return t.type === 'expense' && d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
      })
      .reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + t.amount;
        return acc;
      }, {});
  }, [transactions]);

  const totalBudgeted = budgets.reduce((s, b) => s + b.limit, 0);
  const totalSpent = budgets.reduce((s, b) => s + (spentByCategory[b.category] || 0), 0);
  const overBudgetCount = budgets.filter((b) => (spentByCategory[b.category] || 0) > b.limit).length;

  return (
    <div className="budgets-wrapper">
      {/* Header */}
      <div className="budgets-header">
        <div>
          <h1 className="budgets-title">Monthly Budgets</h1>
          <p className="budgets-subtitle">
            {new Date().toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}
          </p>
        </div>
        <motion.button
          className="budget-btn budget-btn--primary"
          onClick={() => setModalOpen(true)}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          <Plus size={16} /> Add Budget
        </motion.button>
      </div>

      {/* Summary Row */}
      {budgets.length > 0 && (
        <div className="budgets-summary">
          <div className="budgets-summary-item">
            <span className="budgets-summary-label">Total Budgeted</span>
            <span className="budgets-summary-value">₹{totalBudgeted.toLocaleString('en-IN')}</span>
          </div>
          <div className="budgets-summary-item">
            <span className="budgets-summary-label">Total Spent</span>
            <span className="budgets-summary-value" style={{ color: totalSpent > totalBudgeted ? '#ef4444' : '#10b981' }}>
              ₹{totalSpent.toLocaleString('en-IN')}
            </span>
          </div>
          <div className="budgets-summary-item">
            <span className="budgets-summary-label">Remaining</span>
            <span className="budgets-summary-value">₹{Math.max(totalBudgeted - totalSpent, 0).toLocaleString('en-IN')}</span>
          </div>
          {overBudgetCount > 0 && (
            <div className="budgets-summary-item budgets-summary-alert">
              <AlertTriangle size={14} />
              <span>{overBudgetCount} categor{overBudgetCount > 1 ? 'ies' : 'y'} over budget!</span>
            </div>
          )}
        </div>
      )}

      {/* Grid */}
      {budgets.length === 0 ? (
        <motion.div
          className="budgets-empty"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="budgets-empty-icon">🎯</div>
          <h3>No budgets set yet</h3>
          <p>Set monthly spending limits by category to take control of your finances.</p>
          <motion.button
            className="budget-btn budget-btn--primary"
            onClick={() => setModalOpen(true)}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <Plus size={16} /> Set Your First Budget
          </motion.button>
        </motion.div>
      ) : (
        <div className="budgets-grid">
          <AnimatePresence>
            {budgets.map((b, i) => (
              <BudgetCard
                key={b.id}
                budget={b}
                spent={spentByCategory[b.category] || 0}
                onDelete={deleteBudget}
                index={i}
              />
            ))}
          </AnimatePresence>
        </div>
      )}

      <AddBudgetModal isOpen={modalOpen} onClose={() => setModalOpen(false)} onAdd={addBudget} />
    </div>
  );
};

export default Budgets;
