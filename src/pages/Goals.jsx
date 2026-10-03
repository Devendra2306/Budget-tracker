import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Target, Clock, Edit2, Trash2 } from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import GoalModal from '../components/GoalModal';
import FundGoalModal from '../components/FundGoalModal';
import './Goals.css';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const Goals = () => {
  const { goals, deleteGoal } = useFinance();
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
  const [isFundModalOpen, setIsFundModalOpen] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState(null);

  const openEditModal = (goal) => {
    setSelectedGoal(goal);
    setIsGoalModalOpen(true);
  };

  const openFundModal = (goal) => {
    setSelectedGoal(goal);
    setIsFundModalOpen(true);
  };

  const handleCloseGoalModal = () => {
    setIsGoalModalOpen(false);
    setTimeout(() => setSelectedGoal(null), 300);
  };

  const handleCloseFundModal = () => {
    setIsFundModalOpen(false);
    setTimeout(() => setSelectedGoal(null), 300);
  };

  const getDaysRemaining = (deadline) => {
    if (!deadline) return null;
    const today = new Date();
    const targetDate = new Date(deadline);
    const diffTime = targetDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? `${diffDays} days left` : 'Past due';
  };

  return (
    <div className="goals-page">
      <div className="goals-header">
        <div>
          <h1>Financial Goals</h1>
          <p>Set targets and watch your savings grow</p>
        </div>
        <button 
          className="btn-primary" 
          onClick={() => { setSelectedGoal(null); setIsGoalModalOpen(true); }}
        >
          <Plus size={18} /> New Goal
        </button>
      </div>

      {goals.length === 0 ? (
        <div className="empty-goals glass-card">
          <div className="empty-icon">
            <Target size={40} />
          </div>
          <h2>No active goals yet</h2>
          <p className="text-muted" style={{ marginBottom: '1.5rem', marginTop: '0.5rem' }}>
            Start building your dream fund today. A new car, house, or vacation awaits!
          </p>
          <button 
            className="btn-primary" 
            onClick={() => { setSelectedGoal(null); setIsGoalModalOpen(true); }}
          >
            Create Your First Goal
          </button>
        </div>
      ) : (
        <div className="goals-grid">
          {goals.map((goal, index) => {
            const percentage = Math.min((goal.currentAmount / goal.targetAmount) * 100, 100).toFixed(1);
            const isCompleted = goal.currentAmount >= goal.targetAmount;

            return (
              <motion.div
                key={goal.id}
                className="goal-card glass-card"
                initial="hidden"
                animate="visible"
                variants={fadeUp}
                transition={{ delay: index * 0.1 }}
              >
                <div 
                  className="goal-card-bg-decoration" 
                  style={{ background: goal.color }}
                />

                <div className="goal-card-header">
                  <div className="goal-icon-wrap" style={{ color: goal.color }}>
                    {goal.icon}
                  </div>
                  <div className="goal-actions">
                    <button className="icon-btn" onClick={() => openEditModal(goal)}>
                      <Edit2 size={16} />
                    </button>
                    <button className="icon-btn delete" onClick={() => deleteGoal(goal.id)}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                <div className="goal-info">
                  <h3>{goal.name}</h3>
                  {goal.deadline && (
                    <span className="goal-deadline">
                      <Clock size={14} /> {getDaysRemaining(goal.deadline)}
                    </span>
                  )}
                </div>

                <div className="goal-progress-section">
                  <div className="progress-labels">
                    <span className="text-muted">Saved</span>
                    <span>
                      <strong>₹{goal.currentAmount.toLocaleString()}</strong> 
                      <span className="text-muted"> / ₹{goal.targetAmount.toLocaleString()}</span>
                    </span>
                  </div>
                  
                  <div className="progress-bar-bg">
                    <motion.div 
                      className="progress-bar-fill"
                      style={{ background: goal.color }}
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ duration: 1, delay: 0.2 + (index * 0.1) }}
                    />
                    <div className="progress-percentage" style={{ color: goal.color }}>
                      {percentage}%
                    </div>
                  </div>
                </div>

                <div className="goal-footer">
                  <span className={`status-badge ${isCompleted ? 'completed' : 'active'}`}>
                    {isCompleted ? 'Completed 🎉' : 'In Progress'}
                  </span>
                  {!isCompleted && (
                    <button 
                      className="add-funds-btn" 
                      onClick={() => openFundModal(goal)}
                    >
                      <Plus size={16} /> Add Funds
                    </button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Modals */}
      <GoalModal 
        isOpen={isGoalModalOpen} 
        onClose={handleCloseGoalModal} 
        initialData={selectedGoal} 
      />
      
      <FundGoalModal 
        isOpen={isFundModalOpen} 
        onClose={handleCloseFundModal} 
        goal={selectedGoal} 
      />
    </div>
  );
};

export default Goals;
