import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Download, Plus, Trash2, ArrowUpRight, ArrowDownRight,
  Filter, X, ShoppingCart, Coffee, Car, Home, Zap, Briefcase,
  Gift, Heart, Utensils, Plane, BookOpen, Smartphone, TrendingUp, DollarSign
} from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import TransactionModal from '../components/TransactionModal';
import './Transactions.css';

const CATEGORY_ICONS = {
  Food: Utensils,
  Transport: Car,
  Shopping: ShoppingCart,
  Bills: Zap,
  Health: Heart,
  Entertainment: Smartphone,
  Travel: Plane,
  Education: BookOpen,
  Salary: Briefcase,
  Freelance: TrendingUp,
  Investment: DollarSign,
  Gift: Gift,
  Coffee: Coffee,
  Housing: Home,
  Other: Zap,
};

const CATEGORY_COLORS = {
  Food: '#f59e0b',
  Transport: '#3b82f6',
  Shopping: '#8b5cf6',
  Bills: '#ef4444',
  Health: '#10b981',
  Entertainment: '#ec4899',
  Travel: '#06b6d4',
  Education: '#f97316',
  Salary: '#10b981',
  Freelance: '#6366f1',
  Investment: '#14b8a6',
  Gift: '#f43f5e',
  Coffee: '#92400e',
  Housing: '#78716c',
  Other: '#6b7280',
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.04, type: 'spring', stiffness: 280, damping: 24 },
  }),
  exit: { opacity: 0, x: -20, transition: { duration: 0.2 } },
};

const Transactions = () => {
  const { transactions, deleteTransaction, showToast } = useFinance();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all'); // all | income | expense
  const [modalOpen, setModalOpen] = useState(false);

  const filtered = useMemo(() => {
    return transactions.filter((t) => {
      const matchesSearch =
        t.description?.toLowerCase().includes(search.toLowerCase()) ||
        t.category?.toLowerCase().includes(search.toLowerCase());
      const matchesFilter =
        filter === 'all' || t.type === filter;
      return matchesSearch && matchesFilter;
    });
  }, [transactions, search, filter]);

  const handleDelete = async (id) => {
    await deleteTransaction(id);
    showToast('Transaction deleted', 'error');
  };

  const exportCSV = () => {
    const headers = ['Date', 'Description', 'Category', 'Type', 'Amount (₹)'];
    const rows = filtered.map((t) => [
      new Date(t.date).toLocaleDateString('en-IN'),
      t.description,
      t.category,
      t.type,
      t.amount,
    ]);
    const csvContent = [headers, ...rows]
      .map((r) => r.map((v) => `"${v}"`).join(','))
      .join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'transactions.csv';
    a.click();
    URL.revokeObjectURL(url);
    showToast('Exported to CSV!', 'success');
  };

  const totalIncome = filtered
    .filter((t) => t.type === 'income')
    .reduce((s, t) => s + t.amount, 0);
  const totalExpense = filtered
    .filter((t) => t.type === 'expense')
    .reduce((s, t) => s + t.amount, 0);

  return (
    <div className="txn-wrapper">
      {/* ── Header ── */}
      <div className="txn-header">
        <div>
          <h1 className="txn-title">Transactions</h1>
          <p className="txn-subtitle">{filtered.length} record{filtered.length !== 1 ? 's' : ''} found</p>
        </div>
        <div className="txn-header-actions">
          <motion.button
            className="txn-btn txn-btn--outline"
            onClick={exportCSV}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <Download size={16} />
            Export CSV
          </motion.button>
          <motion.button
            className="txn-btn txn-btn--primary"
            onClick={() => setModalOpen(true)}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <Plus size={16} />
            Add Transaction
          </motion.button>
        </div>
      </div>

      {/* ── Summary Pills ── */}
      <div className="txn-summary">
        <div className="txn-summary-pill txn-summary-pill--green">
          <ArrowUpRight size={16} />
          <span>Income</span>
          <strong>₹{totalIncome.toLocaleString('en-IN')}</strong>
        </div>
        <div className="txn-summary-pill txn-summary-pill--red">
          <ArrowDownRight size={16} />
          <span>Expenses</span>
          <strong>₹{totalExpense.toLocaleString('en-IN')}</strong>
        </div>
        <div className={`txn-summary-pill ${totalIncome - totalExpense >= 0 ? 'txn-summary-pill--blue' : 'txn-summary-pill--red'}`}>
          <TrendingUp size={16} />
          <span>Net</span>
          <strong>₹{(totalIncome - totalExpense).toLocaleString('en-IN')}</strong>
        </div>
      </div>

      {/* ── Toolbar ── */}
      <div className="txn-toolbar">
        <div className="txn-search-wrap">
          <Search size={16} className="txn-search-icon" />
          <input
            className="txn-search"
            placeholder="Search by description or category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button className="txn-clear-btn" onClick={() => setSearch('')}>
              <X size={14} />
            </button>
          )}
        </div>
        <div className="txn-filter-tabs">
          {['all', 'income', 'expense'].map((f) => (
            <button
              key={f}
              className={`txn-filter-tab ${filter === f ? 'active' : ''}`}
              onClick={() => setFilter(f)}
            >
              <Filter size={13} />
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* ── List ── */}
      {filtered.length === 0 ? (
        <motion.div
          className="txn-empty"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="txn-empty-icon">💸</div>
          <h3>No transactions found</h3>
          <p>{search ? 'Try adjusting your search or filter.' : 'Add your first transaction to get started!'}</p>
          <motion.button
            className="txn-btn txn-btn--primary"
            onClick={() => setModalOpen(true)}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <Plus size={16} /> Add Transaction
          </motion.button>
        </motion.div>
      ) : (
        <div className="txn-list">
          <AnimatePresence>
            {filtered.map((t, i) => {
              const CategoryIcon = CATEGORY_ICONS[t.category] || Zap;
              const color = CATEGORY_COLORS[t.category] || '#6b7280';
              return (
                <motion.div
                  key={t.id}
                  className="txn-item"
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  custom={i}
                  layout
                >
                  <div className="txn-item-icon" style={{ background: `${color}18`, color }}>
                    <CategoryIcon size={20} />
                  </div>
                  <div className="txn-item-info">
                    <span className="txn-item-desc">{t.description}</span>
                    <span className="txn-item-meta">
                      <span className="txn-item-category" style={{ background: `${color}15`, color }}>
                        {t.category}
                      </span>
                      <span className="txn-item-date">
                        {new Date(t.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </span>
                    </span>
                  </div>
                  <div className={`txn-item-amount ${t.type === 'income' ? 'income' : 'expense'}`}>
                    {t.type === 'income' ? '+' : '-'}₹{t.amount.toLocaleString('en-IN')}
                  </div>
                  <motion.button
                    className="txn-delete-btn"
                    onClick={() => handleDelete(t.id)}
                    whileHover={{ scale: 1.1, background: 'rgba(239,68,68,0.12)' }}
                    whileTap={{ scale: 0.9 }}
                    title="Delete transaction"
                  >
                    <Trash2 size={15} />
                  </motion.button>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      <TransactionModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
};

export default Transactions;
