import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { FinanceProvider } from './context/FinanceContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Splitter from './pages/Splitter';
import Login from './pages/Login';
import Landing from './pages/Landing';
import Transactions from './pages/Transactions';
import Analytics from './pages/Analytics';
import Budgets from './pages/Budgets';
import Goals from './pages/Goals';
import Wallets from './pages/Wallets';
import Settings from './pages/Settings';
import Toast from './components/Toast';
import CommandPalette from './components/CommandPalette';

const PageWrapper = ({ children }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      style={{ width: '100%', minHeight: '100vh' }}
    >
      {children}
    </motion.div>
  );
};

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  return children;
};

const AppContent = () => {
  const location = useLocation();
  
  return (
    <>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<PageWrapper><Landing /></PageWrapper>} />
          <Route path="/login" element={<PageWrapper><Login /></PageWrapper>} />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Layout>
                <PageWrapper><Dashboard /></PageWrapper>
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/splitter" element={
            <ProtectedRoute>
              <Layout>
                <PageWrapper><Splitter /></PageWrapper>
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/transactions" element={<ProtectedRoute><Layout><PageWrapper><Transactions /></PageWrapper></Layout></ProtectedRoute>} />
          <Route path="/analytics" element={<ProtectedRoute><Layout><PageWrapper><Analytics /></PageWrapper></Layout></ProtectedRoute>} />
          <Route path="/budgets" element={<ProtectedRoute><Layout><PageWrapper><Budgets /></PageWrapper></Layout></ProtectedRoute>} />
          <Route path="/goals" element={<ProtectedRoute><Layout><PageWrapper><Goals /></PageWrapper></Layout></ProtectedRoute>} />
          <Route path="/wallets" element={<ProtectedRoute><Layout><PageWrapper><Wallets /></PageWrapper></Layout></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><Layout><PageWrapper><Settings /></PageWrapper></Layout></ProtectedRoute>} />
        </Routes>
      </AnimatePresence>
    <Toast />
    <CommandPalette />
  </>
  );
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <FinanceProvider>
          <Router>
            <AppContent />
          </Router>
        </FinanceProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
