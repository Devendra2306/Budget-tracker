import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, ArrowRight, Shield, PieChart, TrendingUp, Zap } from 'lucide-react';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const { login, signup, loginWithProvider } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);
    try {
      if (isSignUp) {
        await signup(email, password);
      } else {
        await login(email, password);
      }
      navigate('/dashboard');
    } catch (error) {
      setErrorMsg(error.message || 'Authentication failed');
      console.error('Authentication failed', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = async (provider) => {
    try {
      setIsLoading(true);
      await loginWithProvider(provider);
      navigate('/dashboard');
    } catch (error) {
      console.error(`Failed to login with ${provider}`, error);
      // In a real app we would use a toast here
    } finally {
      setIsLoading(false);
    }
  };

  // ── Animation Variants ──────────────────────────────────
  const containerVariants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.08, delayChildren: 0.15 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 18 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring', stiffness: 300, damping: 24 },
    },
  };

  const panelVariants = {
    hidden: { opacity: 0, x: 60 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { type: 'spring', stiffness: 200, damping: 30, delay: 0.3 },
    },
  };

  const testimonialVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.96 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { type: 'spring', stiffness: 200, damping: 25, delay: 0.6 },
    },
  };

  const pillContainerVariants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.07, delayChildren: 0.9 },
    },
  };

  const pillVariants = {
    hidden: { opacity: 0, scale: 0.8, y: 10 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { type: 'spring', stiffness: 400, damping: 20 },
    },
  };

  return (
    <div className="login-page">
      {/* ════════════ LEFT PANEL — FORM ════════════ */}
      <motion.div
        className="login-left"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 28 }}
      >
        <motion.div
          className="login-form-wrapper"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Logo */}
          <motion.div className="login-logo" variants={itemVariants}>
            <span className="login-logo-icon" role="img" aria-label="owl">🦉</span>
            <span className="login-logo-text">Daily Expense Tracker</span>
          </motion.div>

          {/* Heading */}
          <motion.h1 className="login-heading" variants={itemVariants}>
            {isSignUp ? 'Create an account' : 'Welcome back'}
          </motion.h1>
          <motion.p className="login-subtitle" variants={itemVariants}>
            {isSignUp ? 'Join thousands of smart spenders' : 'Sign in to your account'}
          </motion.p>

          {errorMsg && (
            <motion.div variants={itemVariants} style={{ color: 'var(--accent-red)', marginBottom: '1rem', fontSize: '0.875rem', background: 'rgba(239, 68, 68, 0.1)', padding: '0.75rem', borderRadius: '8px' }}>
              {errorMsg}
            </motion.div>
          )}

          {/* Social Login */}
          <motion.div className="login-social-buttons" variants={itemVariants}>
            <motion.button
              type="button"
              className="login-social-btn"
              onClick={() => handleSocialLogin('google')}
              whileHover={{ scale: 1.015, y: -1 }}
              whileTap={{ scale: 0.985 }}
              transition={{ type: 'spring', stiffness: 400, damping: 17 }}
            >
              <svg viewBox="0 0 24 24" width="18" height="18" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Sign in with Google
            </motion.button>

            <motion.button
              type="button"
              className="login-social-btn"
              onClick={() => handleSocialLogin('github')}
              whileHover={{ scale: 1.015, y: -1 }}
              whileTap={{ scale: 0.985 }}
              transition={{ type: 'spring', stiffness: 400, damping: 17 }}
            >
              <svg viewBox="0 0 24 24" width="18" height="18" xmlns="http://www.w3.org/2000/svg">
                <path
                  className="github-icon-path"
                  fill="currentColor"
                  d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"
                />
              </svg>
              Sign in with GitHub
            </motion.button>
          </motion.div>

          {/* Divider */}
          <motion.div className="login-divider" variants={itemVariants}>
            <span>or continue with email</span>
          </motion.div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="login-form">
            <motion.div className="login-input-group" variants={itemVariants}>
              <input
                id="login-email"
                type="email"
                placeholder=" "
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
              <label htmlFor="login-email">Email address</label>
            </motion.div>

            <motion.div variants={itemVariants}>
              <div className="login-password-row">
                <a href="#" className="login-forgot-link">Forgot password?</a>
              </div>
              <div className="login-input-group" style={{ marginTop: '0.5rem' }}>
                <input
                  id="login-password"
                  type="password"
                  placeholder=" "
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                />
                <label htmlFor="login-password">Password</label>
              </div>
            </motion.div>

            <motion.div variants={itemVariants}>
              <motion.button
                type="submit"
                className="login-submit-btn"
                disabled={isLoading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.975 }}
                transition={{ type: 'spring', stiffness: 400, damping: 15 }}
              >
                {isLoading ? 'Processing...' : (isSignUp ? 'Sign Up' : 'Sign In')}
                {!isLoading && <ArrowRight size={16} strokeWidth={2.5} />}
              </motion.button>
            </motion.div>
          </form>

          {/* Sign Up Toggle */}
          <motion.p className="login-signup-prompt" variants={itemVariants}>
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
            <button
              type="button"
              className="login-signup-link"
              onClick={() => {
                setIsSignUp(!isSignUp);
                setErrorMsg('');
              }}
            >
              {isSignUp ? 'Sign in instead' : 'Sign up for free'}
            </button>
          </motion.p>
        </motion.div>
      </motion.div>

      {/* ════════════ RIGHT PANEL — DECORATIVE ════════════ */}
      <motion.div
        className="login-right"
        variants={panelVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Aurora Background */}
        <div className="login-aurora" />

        {/* Floating Geometric Shapes */}
        <div className="login-shape login-shape--1" />
        <div className="login-shape login-shape--2" />
        <div className="login-shape login-shape--3" />
        <div className="login-shape login-shape--4" />

        {/* Content */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.25rem' }}>
          {/* Testimonial Card */}
          <motion.div
            className="login-testimonial-card"
            variants={testimonialVariants}
            initial="hidden"
            animate="visible"
          >
            <div className="login-testimonial-stars">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={15} fill="#e5a44c" strokeWidth={0} />
              ))}
            </div>
            <p className="login-testimonial-quote">
              "This app completely transformed how I manage my finances. I went from chaotic spending to saving 30% of my income in just two months."
            </p>
            <div className="login-testimonial-author">
              <div className="login-testimonial-avatar">JR</div>
              <div>
                <div className="login-testimonial-name">Jordan Rivera</div>
                <div className="login-testimonial-role">Product Designer at Figma</div>
              </div>
            </div>
          </motion.div>

          {/* Feature Pills */}
          <motion.div
            className="login-feature-pills"
            variants={pillContainerVariants}
            initial="hidden"
            animate="visible"
          >
            {[
              { icon: <Shield size={13} />, label: 'Bank-grade Security' },
              { icon: <PieChart size={13} />, label: 'Smart Analytics' },
              { icon: <TrendingUp size={13} />, label: 'Budget Goals' },
              { icon: <Zap size={13} />, label: 'Instant Sync' },
            ].map((feat, i) => (
              <motion.span key={i} className="login-feature-pill" variants={pillVariants}>
                {feat.icon}
                {feat.label}
              </motion.span>
            ))}
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
