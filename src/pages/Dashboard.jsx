import { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import {
  DollarSign, TrendingUp, TrendingDown, Target, Activity,
  ArrowUpRight, ArrowDownRight, Plus, Search, ChevronDown,
  Trash2, Edit2, Calendar as CalendarIcon
} from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import TransactionModal from '../components/TransactionModal';
import './Dashboard.css';

/* ── Animated counter hook ── */
const useAnimatedValue = (target, duration = 800) => {
  const [value, setValue] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    const start = performance.now();
    const from = 0;
    const step = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      setValue(from + (target - from) * eased);
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration, inView]);

  return [ref, value];
};

/* ── Framer Motion variants ── */
const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 24, scale: 0.97 },
  visible: {
    opacity: 1, y: 0, scale: 1,
    transition: { type: 'spring', stiffness: 260, damping: 22 },
  },
};

const rowVariants = {
  hidden: { opacity: 0, x: -16 },
  visible: (i) => ({
    opacity: 1, x: 0,
    transition: { delay: i * 0.04, type: 'spring', stiffness: 300, damping: 26 },
  }),
};

/* ── Custom Tooltip ── */
const ChartTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="chart-tooltip">
      <p className="chart-tooltip-label">{label}</p>
      {payload.map((entry, i) => (
        <div key={i} className="chart-tooltip-row">
          <span className="chart-tooltip-dot" style={{ background: entry.color }} />
          <span className="chart-tooltip-name">{entry.name}</span>
          <span className="chart-tooltip-value">₹{entry.value.toLocaleString('en-IN')}</span>
        </div>
      ))}
    </div>
  );
};

/* ── MetricCard ── */
const MetricCard = ({ title, value, prefix = '', suffix = '', icon: Icon, color, trend, trendLabel }) => {
  const [ref, animatedVal] = useAnimatedValue(value);

  const displayVal = suffix === '%'
    ? animatedVal.toFixed(1)
    : animatedVal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <motion.div className="glass-card metric-card" variants={cardVariants} whileHover={{ y: -4, boxShadow: '0 12px 40px rgba(0,0,0,0.08)' }} ref={ref}>
      <div className="metric-header">
        <span className="metric-title">{title}</span>
        <div className={`metric-icon-box ${color}`}>
          <Icon size={20} />
        </div>
      </div>
      <div className="metric-value">
        {prefix}{displayVal}{suffix}
      </div>
      <div className="metric-footer">
        {trend !== undefined && (
          <div className={`trend-pill ${trend >= 0 ? 'positive' : 'negative'}`}>
            {trend >= 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
            {Math.abs(trend)}%
          </div>
        )}
        <span className="metric-footer-label">{trendLabel}</span>
      </div>
    </motion.div>
  );
};

/* ================================================================
   DASHBOARD COMPONENT
   ================================================================ */
const Dashboard = () => {
  const {
    transactions, deleteTransaction,
    totalBalance, totalIncome, totalExpense,
    netCashFlow, savingsRate, trends, showToast
  } = useFinance();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTx, setEditingTx] = useState(null);
  
  // Filtering states
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all'); // 'all', 'income', 'expense'
  const [timeFilter, setTimeFilter] = useState('all'); // 'all', 'month'

  const openAddModal = () => {
    setEditingTx(null);
    setIsModalOpen(true);
  };

  const openEditModal = (tx) => {
    setEditingTx(tx);
    setIsModalOpen(true);
  };

  // Chart data
  const chartData = [...Array(7)].map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const dateStr = d.toISOString().split('T')[0];
    const dayTxs = transactions.filter(t => t.date && t.date.startsWith(dateStr));
    const income = dayTxs.filter(t => t.type === 'income').reduce((acc, curr) => acc + curr.amount, 0);
    const expense = dayTxs.filter(t => t.type === 'expense').reduce((acc, curr) => acc + curr.amount, 0);
    return {
      date: d.toLocaleDateString('en-US', { day: 'numeric', month: 'short' }).toUpperCase(),
      income,
      expense
    };
  });

  const getCategoryIcon = (category) => {
    const icons = {
      'Food': '🍔', 'Transport': '🚗', 'Entertainment': '🎬', 'Bills': '🧾',
      'Shopping': '🛍️', 'Salary': '💰', 'Freelance': '💻', 'Gift': '🎁', 'Investment': '📈'
    };
    return icons[category] || '📦';
  };

  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-60px' });

  // Filter logic
  const filteredTransactions = transactions.filter(tx => {
    // Search
    const matchesSearch = 
      tx.category.toLowerCase().includes(searchQuery.toLowerCase()) || 
      (tx.description && tx.description.toLowerCase().includes(searchQuery.toLowerCase()));
    
    // Type
    const matchesType = typeFilter === 'all' || tx.type === typeFilter;
    
    // Time
    let matchesTime = true;
    if (timeFilter === 'month' && tx.date) {
      const txDate = new Date(tx.date);
      const now = new Date();
      matchesTime = txDate.getMonth() === now.getMonth() && txDate.getFullYear() === now.getFullYear();
    }

    return matchesSearch && matchesType && matchesTime;
  });

  return (
    <div className="dashboard-wrapper">

      {/* ── KPI Metrics ── */}
      <motion.div
        className="metrics-grid"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <MetricCard
          title="Total Balance"
          value={totalBalance}
          prefix="₹"
          icon={DollarSign}
          color="blue"
          trend={trends.income}
          trendLabel="vs last month"
        />
        <MetricCard
          title="Net Cash Flow"
          value={netCashFlow}
          prefix={netCashFlow >= 0 ? '+₹' : '-₹'}
          icon={Activity}
          color="green"
          trend={netCashFlow >= 0 ? trends.income : trends.expense}
          trendLabel="this month"
        />
        <MetricCard
          title="Savings Rate"
          value={savingsRate}
          suffix="%"
          icon={TrendingUp}
          color="purple"
          trend={trends.savings}
          trendLabel="vs last month"
        />
        <MetricCard
          title="Budget Used"
          value={42}
          suffix="%"
          icon={Target}
          color="orange"
          trendLabel="₹12,500 remaining"
        />
      </motion.div>

      {/* ── Area Chart ── */}
      <motion.div
        className="glass-card chart-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35, type: 'spring', stiffness: 200, damping: 22 }}
      >
        <div className="chart-header">
          <div>
            <h3 className="chart-title">Cash Flow Overview</h3>
            <p className="chart-subtitle">Income vs Expenses — Last 7 days</p>
          </div>
          <div className="chart-legend">
            <span className="legend-item"><span className="legend-dot income" /> Income</span>
            <span className="legend-item"><span className="legend-dot expense" /> Expense</span>
          </div>
        </div>
        <div className="chart-body">
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={chartData} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
              <defs>
                <linearGradient id="gradientIncome" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#2ecc71" stopOpacity={0.25} />
                  <stop offset="100%" stopColor="#2ecc71" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gradientExpense" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#e74c3c" stopOpacity={0.2} />
                  <stop offset="100%" stopColor="#e74c3c" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
              <XAxis
                dataKey="date"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: 'var(--text-muted)' }}
                dy={8}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: 'var(--text-muted)' }}
                tickFormatter={(v) => v === 0 ? '0' : `₹${v >= 1000 ? (v / 1000).toFixed(0) + 'k' : v}`}
              />
              <Tooltip content={<ChartTooltip />} />
              <Area
                type="monotone"
                dataKey="income"
                name="Income"
                stroke="#2ecc71"
                strokeWidth={2.5}
                fill="url(#gradientIncome)"
                dot={false}
                activeDot={{ r: 5, strokeWidth: 2, fill: '#fff', stroke: '#2ecc71' }}
              />
              <Area
                type="monotone"
                dataKey="expense"
                name="Expense"
                stroke="#e74c3c"
                strokeWidth={2.5}
                fill="url(#gradientExpense)"
                dot={false}
                activeDot={{ r: 5, strokeWidth: 2, fill: '#fff', stroke: '#e74c3c' }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* ── Transactions Table ── */}
      <motion.div
        className="glass-card transactions-card"
        ref={sectionRef}
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.15, type: 'spring', stiffness: 200, damping: 22 }}
      >
        {/* Toolbar */}
        <div className="tx-toolbar">
          <h3 className="tx-toolbar-title">Recent Transactions</h3>
          <div className="tx-toolbar-actions">
            <div className="tx-search-box">
              <Search size={15} className="tx-search-icon" />
              <input 
                type="text" 
                placeholder="Search..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <motion.button
              className="btn-add"
              onClick={openAddModal}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
            >
              <Plus size={16} /> Add
            </motion.button>
            <select 
              className="filter-dropdown" 
              value={typeFilter} 
              onChange={(e) => setTypeFilter(e.target.value)}
              style={{ paddingRight: '2rem', appearance: 'none', background: `var(--bg-card) url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E") no-repeat right 0.5rem center / 14px` }}
            >
              <option value="all">All Types</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
            <select 
              className="filter-dropdown" 
              value={timeFilter} 
              onChange={(e) => setTimeFilter(e.target.value)}
              style={{ paddingRight: '2rem', appearance: 'none', background: `var(--bg-card) url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E") no-repeat right 0.5rem center / 14px` }}
            >
              <option value="all">All Time</option>
              <option value="month">This Month</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="tx-table-container">
          <table className="tx-table">
            <thead>
              <tr>
                <th>Category</th>
                <th>Note</th>
                <th>Wallet</th>
                <th>Amount</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan="6" className="tx-empty-state">
                    <div className="empty-illustration">
                      <div className="empty-icon">📭</div>
                      <h4>No transactions found</h4>
                      <p>Try adjusting your filters or add a new transaction.</p>
                      <motion.button
                        className="btn-add"
                        onClick={openAddModal}
                        whileHover={{ scale: 1.04 }}
                        whileTap={{ scale: 0.96 }}
                      >
                        <Plus size={16} /> Add Transaction
                      </motion.button>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((tx, idx) => (
                  <motion.tr
                    key={tx.id}
                    custom={idx}
                    variants={rowVariants}
                    initial="hidden"
                    animate="visible"
                    className="tx-row"
                  >
                    <td>
                      <div className="tx-category-cell">
                        <span className="category-icon">{getCategoryIcon(tx.category)}</span>
                        <span className="category-name">{tx.category}</span>
                      </div>
                    </td>
                    <td className="tx-note">{tx.description || '—'}</td>
                    <td><span className="wallet-badge">DEFAULT</span></td>
                    <td>
                      <span className={`tx-amount ${tx.type === 'expense' ? 'expense' : 'income'}`}>
                        {tx.type === 'income' ? '+' : '-'}₹{Math.abs(tx.amount).toFixed(2)}
                      </span>
                    </td>
                    <td className="tx-date">
                      {new Date(tx.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>
                    <td>
                      <div className="tx-actions">
                        <motion.button 
                          className="action-btn" 
                          whileHover={{ scale: 1.15 }} 
                          whileTap={{ scale: 0.9 }} 
                          aria-label="Edit"
                          onClick={() => openEditModal(tx)}
                        >
                          <Edit2 size={15} />
                        </motion.button>
                        <motion.button
                          className="action-btn delete"
                          whileHover={{ scale: 1.15 }}
                          whileTap={{ scale: 0.9 }}
                          aria-label="Delete"
                          onClick={() => {
                            deleteTransaction(tx.id);
                            showToast('Transaction deleted', 'error');
                          }}
                        >
                          <Trash2 size={15} />
                        </motion.button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="table-footer">
          Showing {filteredTransactions.length} transaction{filteredTransactions.length !== 1 ? 's' : ''}
        </div>
      </motion.div>

      {/* ── Transaction Modal ── */}
      <TransactionModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        initialData={editingTx}
      />
    </div>
  );
};

export default Dashboard;
