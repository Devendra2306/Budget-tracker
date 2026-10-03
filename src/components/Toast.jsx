import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import './Toast.css';

const Toast = () => {
  const { toast, showToast } = useFinance();

  if (!toast) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.9 }}
        className={`toast-container ${toast.type}`}
      >
        <div className="toast-icon">
          {toast.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
        </div>
        <div className="toast-message">{toast.message}</div>
        <button className="toast-close" onClick={() => showToast(null)}>
          <X size={16} />
        </button>
      </motion.div>
    </AnimatePresence>
  );
};

export default Toast;
