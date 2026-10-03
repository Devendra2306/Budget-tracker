import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Receipt, PieChart, Target, TrendingUp,
  Wallet, Settings, LogOut, Plus, Sun, Moon, Bell,
  Search, Menu, X, ChevronLeft
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useState } from 'react';
import TransactionModal from './TransactionModal';
import ProfileModal from './ProfileModal';
import './Layout.css';

const sidebarVariants = {
  expanded: { width: 260 },
  collapsed: { width: 78 },
};

const navItemVariants = {
  hidden: { opacity: 0, x: -12 },
  visible: (i) => ({
    opacity: 1,
    x: 0,
    transition: { delay: i * 0.04, type: 'spring', stiffness: 300, damping: 24 },
  }),
};

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

const mobileDrawerVariants = {
  hidden: { x: '-100%' },
  visible: { x: 0, transition: { type: 'spring', stiffness: 300, damping: 30 } },
  exit: { x: '-100%', transition: { type: 'spring', stiffness: 300, damping: 30 } },
};

const Layout = ({ children }) => {
  const location = useLocation();
  const { currentUser, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  
  const [collapsed, setCollapsed] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const mainNav = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/transactions', label: 'Transactions', icon: Receipt },
    { path: '/analytics', label: 'Analytics', icon: PieChart },
    { path: '/budgets', label: 'Budgets', icon: Target },
    { path: '/goals', label: 'Goals', icon: TrendingUp },
  ];

  const manageNav = [
    { path: '/wallets', label: 'Wallets', icon: Wallet },
    { path: '/settings', label: 'Settings', icon: Settings },
  ];

  const NavContent = ({ isMobile = false }) => (
    <>
      {/* Logo */}
      <div className="sidebar-header">
        <div className="logo-section">
          <motion.div
            className="logo-icon"
            whileHover={{ rotate: [0, -10, 10, -5, 0] }}
            transition={{ duration: 0.5 }}
          >
            🦉
          </motion.div>
          <AnimatePresence>
            {(!collapsed || isMobile) && (
              <motion.span
                className="logo-text"
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.2 }}
              >
                Fintrack
              </motion.span>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Add Transaction Button */}
      <div className="sidebar-cta">
        <motion.button
          className="btn-add-tx"
          onClick={() => { setIsModalOpen(true); if (isMobile) setMobileOpen(false); }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
        >
          <Plus size={18} strokeWidth={2.5} />
          <AnimatePresence>
            {(!collapsed || isMobile) && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.2 }}
              >
                Add Transaction
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        <div className="nav-group">
          <AnimatePresence>
            {(!collapsed || isMobile) && (
              <motion.span
                className="nav-group-label"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                MAIN
              </motion.span>
            )}
          </AnimatePresence>
          <ul className="nav-list">
            {mainNav.map((item, idx) => {
              const isActive = location.pathname === item.path;
              return (
                <motion.li
                  key={item.label}
                  custom={idx}
                  variants={navItemVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <Link
                    to={item.path}
                    className={`nav-link ${isActive ? 'active' : ''}`}
                    onClick={() => isMobile && setMobileOpen(false)}
                    title={collapsed && !isMobile ? item.label : undefined}
                  >
                    {isActive && (
                      <motion.div
                        className="nav-active-indicator"
                        layoutId="activeNav"
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      />
                    )}
                    <span className="nav-link-icon">
                      <item.icon size={20} strokeWidth={isActive ? 2.2 : 1.8} />
                    </span>
                    <AnimatePresence>
                      {(!collapsed || isMobile) && (
                        <motion.span
                          className="nav-link-label"
                          initial={{ opacity: 0, width: 0 }}
                          animate={{ opacity: 1, width: 'auto' }}
                          exit={{ opacity: 0, width: 0 }}
                          transition={{ duration: 0.15 }}
                        >
                          {item.label}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </Link>
                </motion.li>
              );
            })}
          </ul>
        </div>

        <div className="nav-group">
          <AnimatePresence>
            {(!collapsed || isMobile) && (
              <motion.span
                className="nav-group-label"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                MANAGE
              </motion.span>
            )}
          </AnimatePresence>
          <ul className="nav-list">
            {manageNav.map((item, idx) => {
              const isActive = location.pathname === item.path;
              return (
                <motion.li
                  key={item.label}
                  custom={idx + mainNav.length}
                  variants={navItemVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <Link
                    to={item.path}
                    className={`nav-link ${isActive ? 'active' : ''}`}
                    onClick={() => isMobile && setMobileOpen(false)}
                    title={collapsed && !isMobile ? item.label : undefined}
                  >
                    {isActive && (
                      <motion.div
                        className="nav-active-indicator"
                        layoutId="activeNav"
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      />
                    )}
                    <span className="nav-link-icon">
                      <item.icon size={20} strokeWidth={isActive ? 2.2 : 1.8} />
                    </span>
                    <AnimatePresence>
                      {(!collapsed || isMobile) && (
                        <motion.span
                          className="nav-link-label"
                          initial={{ opacity: 0, width: 0 }}
                          animate={{ opacity: 1, width: 'auto' }}
                          exit={{ opacity: 0, width: 0 }}
                          transition={{ duration: 0.15 }}
                        >
                          {item.label}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </Link>
                </motion.li>
              );
            })}
          </ul>
        </div>
      </nav>

      {/* Logout */}
      <div className="sidebar-footer">
        <motion.button
          className="nav-link logout-btn"
          onClick={logout}
          whileHover={{ x: 4 }}
          whileTap={{ scale: 0.97 }}
        >
          <span className="nav-link-icon logout-icon">
            <LogOut size={20} strokeWidth={1.8} />
          </span>
          <AnimatePresence>
            {(!collapsed || isMobile) && (
              <motion.span
                className="nav-link-label"
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.15 }}
              >
                Logout
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      </div>
    </>
  );

  return (
    <div className="layout-container">
      {/* Desktop Sidebar */}
      <motion.aside
        className="sidebar desktop-sidebar"
        variants={sidebarVariants}
        animate={collapsed ? 'collapsed' : 'expanded'}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        <NavContent />
      </motion.aside>

      {/* Mobile Overlay + Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              className="mobile-overlay"
              variants={overlayVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              className="sidebar mobile-sidebar"
              variants={mobileDrawerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <button className="mobile-close-btn" onClick={() => setMobileOpen(false)}>
                <X size={20} />
              </button>
              <NavContent isMobile />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main content area */}
      <div className="main-wrapper">
        {/* Topbar */}
        <header className="topbar">
          <div className="topbar-left">
            <button className="topbar-icon-btn mobile-menu-btn" onClick={() => setMobileOpen(true)}>
              <Menu size={20} />
            </button>
            <div className="topbar-search">
              <Search size={16} className="search-icon" />
              <input type="text" placeholder="Search transactions, budgets..." />
            </div>
          </div>

          <div className="topbar-right">
            <motion.button
              className="topbar-icon-btn"
              onClick={toggleTheme}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92, rotate: 180 }}
              aria-label="Toggle Theme"
              style={{ position: 'relative' }}
            >
              <AnimatePresence>
                {theme === 'dark' ? (
                  <motion.div 
                    key="sun" 
                    initial={{ rotate: -90, opacity: 0 }} 
                    animate={{ rotate: 0, opacity: 1 }} 
                    exit={{ rotate: 90, opacity: 0 }} 
                    transition={{ duration: 0.2 }}
                    style={{ position: 'absolute', display: 'flex' }}
                  >
                    <Sun size={18} />
                  </motion.div>
                ) : (
                  <motion.div 
                    key="moon" 
                    initial={{ rotate: 90, opacity: 0 }} 
                    animate={{ rotate: 0, opacity: 1 }} 
                    exit={{ rotate: -90, opacity: 0 }} 
                    transition={{ duration: 0.2 }}
                    style={{ position: 'absolute', display: 'flex' }}
                  >
                    <Moon size={18} />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>

            <motion.button
              className="topbar-icon-btn notification-btn"
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
            >
              <Bell size={18} />
              <span className="notification-dot" />
            </motion.button>

            <div className="topbar-avatar" style={{ position: 'relative' }}>
              <motion.img 
                src={currentUser?.photoURL || `https://api.dicebear.com/7.x/notionists/svg?seed=${currentUser?.email || 'user'}`} 
                alt="User" 
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{ cursor: 'pointer' }}
              />
              
              <AnimatePresence>
                {showProfileMenu && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    style={{
                      position: 'absolute',
                      top: '120%',
                      right: 0,
                      background: 'var(--bg-card)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '12px',
                      padding: '0.5rem',
                      boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
                      zIndex: 50,
                      minWidth: '150px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.25rem'
                    }}
                  >
                    <button 
                      onClick={() => { setIsProfileModalOpen(true); setShowProfileMenu(false); }}
                      style={{ padding: '0.75rem 1rem', background: 'transparent', border: 'none', color: 'var(--text-main)', textAlign: 'left', borderRadius: '8px', cursor: 'pointer' }}
                      onMouseEnter={(e) => e.target.style.background = 'var(--bg-hover)'}
                      onMouseLeave={(e) => e.target.style.background = 'transparent'}
                    >
                      Edit Profile
                    </button>
                    <div style={{ height: '1px', background: 'var(--border-color)', margin: '0.25rem 0' }} />
                    <button 
                      onClick={logout}
                      style={{ padding: '0.75rem 1rem', background: 'transparent', border: 'none', color: 'var(--accent-red)', textAlign: 'left', borderRadius: '8px', cursor: 'pointer' }}
                      onMouseEnter={(e) => e.target.style.background = 'var(--bg-hover)'}
                      onMouseLeave={(e) => e.target.style.background = 'transparent'}
                    >
                      Sign Out
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <motion.button
              className="topbar-icon-btn collapse-btn"
              onClick={() => setCollapsed(c => !c)}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              aria-label="Toggle sidebar"
            >
              <motion.div
                animate={{ rotate: collapsed ? 180 : 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              >
                <ChevronLeft size={18} />
              </motion.div>
            </motion.button>
          </div>
        </header>

        {/* Page Content */}
        <main className="page-content">
          {children}
        </main>
      </div>

      <TransactionModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <ProfileModal isOpen={isProfileModalOpen} onClose={() => setIsProfileModalOpen(false)} />
    </div>
  );
};

export default Layout;
