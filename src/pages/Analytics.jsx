import { motion } from 'framer-motion';

const PlaceholderPage = ({ title, icon }) => (
  <div style={{ padding: '2rem' }}>
    <motion.div 
      className="glass-card" 
      style={{ padding: '3rem', textAlign: 'center', minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>{icon}</div>
      <h1 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: 'var(--text-dark)' }}>{title}</h1>
      <p className="text-muted">This feature is currently under construction. Check back soon for updates!</p>
    </motion.div>
  </div>
);

const Analytics = () => <PlaceholderPage title="Analytics" icon="??" />;
export default Analytics;
