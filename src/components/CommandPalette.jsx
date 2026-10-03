import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ArrowRight, Plus, PieChart, LayoutDashboard } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './CommandPalette.css';

const CommandPalette = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (!isOpen) return null;

  const commands = [
    { id: 1, name: 'Go to Dashboard', icon: <LayoutDashboard size={16} />, action: () => navigate('/dashboard') },
    { id: 2, name: 'Go to Splitter', icon: <PieChart size={16} />, action: () => navigate('/splitter') },
    { id: 3, name: 'Add New Transaction', icon: <Plus size={16} />, action: () => { /* we would trigger modal here */ setIsOpen(false); } },
  ];

  const filteredCommands = commands.filter(c => c.name.toLowerCase().includes(query.toLowerCase()));

  const handleSelect = (action) => {
    action();
    setIsOpen(false);
    setQuery('');
  };

  return (
    <AnimatePresence>
      <div className="cmd-backdrop" onClick={() => setIsOpen(false)}>
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -20 }}
          transition={{ duration: 0.15 }}
          className="cmd-palette"
          onClick={e => e.stopPropagation()}
        >
          <div className="cmd-header">
            <Search size={18} className="text-muted" />
            <input 
              autoFocus
              type="text" 
              placeholder="Type a command or search..." 
              value={query}
              onChange={e => setQuery(e.target.value)}
            />
            <div className="cmd-badge">ESC</div>
          </div>
          
          <div className="cmd-body">
            <div className="cmd-section">Suggestions</div>
            {filteredCommands.length > 0 ? (
              filteredCommands.map(cmd => (
                <button key={cmd.id} className="cmd-item" onClick={() => handleSelect(cmd.action)}>
                  <div className="cmd-item-left">
                    {cmd.icon}
                    <span>{cmd.name}</span>
                  </div>
                  <ArrowRight size={14} className="cmd-item-arrow" />
                </button>
              ))
            ) : (
              <div className="cmd-empty">No results found for "{query}"</div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default CommandPalette;
