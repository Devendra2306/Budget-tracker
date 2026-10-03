import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useRef, useState, useEffect } from 'react';
import {
  motion,
  AnimatePresence,
  useInView,
  useMotionValue,
  useTransform,
  animate,
} from 'framer-motion';
import {
  BarChart3,
  Wallet,
  Users,
  ShieldCheck,
  Sparkles,
  LayoutDashboard,
  ArrowRight,
  ChevronDown,
  Check,
  Star,
  UserPlus,
  PlusCircle,
  TrendingUp,
  Globe,
  MessageSquare,
  Mail,
  Camera,
  Zap,
} from 'lucide-react';
import './Landing.css';

/* ========================================
   ANIMATION VARIANTS
   ======================================== */
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { type: 'spring', stiffness: 100, damping: 15 },
  },
};

/* ========================================
   ANIMATED COUNTER COMPONENT
   ======================================== */
function AnimatedCounter({ target, suffix = '', prefix = '' }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const count = useMotionValue(0);
  const rounded = useTransform(count, (v) => Math.round(v));
  const [display, setDisplay] = useState('0');

  useEffect(() => {
    if (isInView) {
      const controls = animate(count, target, {
        duration: 2,
        ease: [0.25, 0.46, 0.45, 0.94],
      });
      return controls.stop;
    }
  }, [isInView, target, count]);

  useEffect(() => {
    const unsubscribe = rounded.on('change', (v) => setDisplay(String(v)));
    return unsubscribe;
  }, [rounded]);

  return (
    <span ref={ref}>
      {prefix}
      {display}
      {suffix}
    </span>
  );
}

/* ========================================
   FAQ ITEM COMPONENT
   ======================================== */
function FAQItem({ question, answer }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="faq-item">
      <button className="faq-question" onClick={() => setOpen(!open)}>
        <span>{question}</span>
        <motion.span
          className="faq-chevron"
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
        >
          <ChevronDown size={20} />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            className="faq-answer"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <p>{answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ========================================
   SECTION WRAPPER WITH SCROLL ANIMATION
   ======================================== */
function AnimatedSection({ children, className = '', ...props }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <motion.section
      ref={ref}
      className={className}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={staggerContainer}
      {...props}
    >
      {children}
    </motion.section>
  );
}

/* ========================================
   DATA
   ======================================== */
const features = [
  {
    icon: LayoutDashboard,
    title: 'Dashboard Analytics',
    desc: "Get a bird's-eye view of your finances with beautiful real-time charts, summaries, and spending breakdowns.",
  },
  {
    icon: BarChart3,
    title: 'Smart Budgets',
    desc: 'Set intelligent budgets that adapt to your spending patterns and send alerts before you overspend.',
  },
  {
    icon: Users,
    title: 'Expense Splitting',
    desc: 'Split bills with friends & family effortlessly. Our algorithm minimizes transactions to settle up.',
  },
  {
    icon: Wallet,
    title: 'Multiple Wallets',
    desc: 'Track cash, bank accounts, and credit cards separately to know exactly where your money sits.',
  },
  {
    icon: Sparkles,
    title: 'Smart Insights',
    desc: 'Get personalized financial insights that help you save more and spend smarter.',
  },
  {
    icon: ShieldCheck,
    title: 'Bank-Level Security',
    desc: '256-bit encryption, 2FA authentication, and SOC2 compliance. Your data is safe with us.',
  },
];

const stats = [
  { value: 10000, suffix: '+', label: 'Active Users', prefix: '' },
  { value: 50, suffix: 'Cr+', label: 'Expenses Tracked', prefix: '₹' },
  { value: 99.9, suffix: '%', label: 'Uptime', prefix: '' },
  { value: 4.9, suffix: '★', label: 'App Rating', prefix: '' },
];

const steps = [
  {
    icon: UserPlus,
    number: 'Step 1',
    title: 'Create Your Account',
    desc: 'Sign up in under 30 seconds. No credit card required, no hidden fees, just smarter finances.',
  },
  {
    icon: PlusCircle,
    number: 'Step 2',
    title: 'Add Your Transactions',
    desc: 'Log expenses on-the-go or connect your bank for automatic imports. Categorize and tag effortlessly.',
  },
  {
    icon: TrendingUp,
    number: 'Step 3',
    title: 'Your Money, Visualized.',
    desc: 'Watch your financial picture come alive with analytics, trends, and smart savings recommendations.',
  },
];

const testimonials = [
  {
    name: 'Priya Sharma',
    role: 'Freelance Designer',
    quote:
      'This app completely changed how I manage my freelance income. The dashboard is gorgeous and the insights are incredibly useful. I saved 30% more this year!',
    avatar: 'https://i.pravatar.cc/150?img=32',
  },
  {
    name: 'Arjun Mehta',
    role: 'Startup Founder',
    quote:
      "We use Daily Expense Tracker for our team's expense management. The splitting feature alone has saved us hours every month. Absolutely love the clean UI.",
    avatar: 'https://i.pravatar.cc/150?img=11',
  },
  {
    name: 'Sneha Kapoor',
    role: 'Marketing Manager',
    quote:
      "The insights feature is a game-changer. It spotted spending patterns I never noticed and helped me build a budget that actually works. Can't imagine life without it.",
    avatar: 'https://i.pravatar.cc/150?img=26',
  },
];


const faqs = [
  {
    q: 'Is Daily Expense Tracker really free?',
    a: 'Yes! Our Free plan gives you unlimited transactions, one wallet, and basic analytics forever. No credit card required, no hidden costs. You can upgrade to Pro anytime for advanced features.',
  },
  {
    q: 'How secure is my financial data?',
    a: 'Extremely secure. We use 256-bit AES encryption, enforce two-factor authentication, and are SOC2 Type II compliant. Your data is encrypted at rest and in transit. We never sell your information.',
  },
  {
    q: 'Can I connect my bank account?',
    a: 'Yes! Pro and Enterprise plans support automatic bank imports via our secure banking partners. We support all major Indian and international banks.',
  },
  {
    q: 'Does the app work on mobile?',
    a: 'Absolutely. Our web app is fully responsive and works beautifully on any device. Native iOS and Android apps are coming soon with push notification support.',
  },
  {
    q: 'How does the expense splitting work?',
    a: 'Add a group, log shared expenses, and our algorithm calculates the optimal way to settle up with the fewest transactions. Everyone gets notified automatically.',
  },
];


/* ========================================
   MAIN COMPONENT
   ======================================== */
const Landing = () => {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" />;
  }

  const subtitleWords = 'Track every rupee, manage multiple wallets, split expenses with friends, and get smart insights - all in one stunning app.'.split(' ');

  return (
    <div className="landing-page">
      {/* =========== NAVBAR =========== */}
      <nav className="landing-nav">
        <div className="nav-container">
          <div className="landing-logo">
            <span role="img" aria-label="owl" className="logo-icon">🦉</span>
            <span className="logo-text">Daily Expense Tracker</span>
          </div>
          <div className="nav-actions">
            <Link to="/login" className="nav-link">Log in</Link>
            <Link to="/login" className="btn-primary">
              Get Started <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </nav>

      {/* =========== HERO =========== */}
      <header className="hero-section">
        {/* Aurora Background */}
        <div className="hero-aurora" />

        {/* Floating Blobs */}
        <div className="hero-blob hero-blob--1" />
        <div className="hero-blob hero-blob--2" />
        <div className="hero-blob hero-blob--3" />

        <div className="hero-content">
          <motion.div
            className="hero-badge"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Zap size={14} /> The #1 Free Expense Tracker
          </motion.div>

          <motion.h1
            className="hero-title"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
          >
            Take Control of Your{' '}
            <br />
            <span className="gradient-text">Financial Future.</span>
          </motion.h1>

          <motion.p
            className="hero-subtitle"
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            {subtitleWords.map((word, i) => (
              <motion.span
                key={i}
                className="word"
                variants={{
                  hidden: { opacity: 0, y: 10 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: { duration: 0.3, delay: 0.4 + i * 0.03 },
                  },
                }}
              >
                {word}
              </motion.span>
            ))}
          </motion.p>

          <motion.div
            className="hero-actions"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <Link to="/login" className="btn-primary btn-large">
              Start Tracking for Free <ArrowRight size={18} />
            </Link>
            <Link to="/login" className="btn-secondary btn-large">
              See How It Works
            </Link>
          </motion.div>
        </div>
      </header>


      {/* =========== FEATURES =========== */}
      <AnimatedSection className="landing-section features-section">
        <div className="section-container">
          <div className="section-header">
            <motion.span className="section-label" variants={fadeUp}>
              <Sparkles size={14} /> Features
            </motion.span>
            <motion.h2 className="section-title" variants={fadeUp}>
              Everything you need to
              <br />manage money beautifully
            </motion.h2>
            <motion.p className="section-subtitle" variants={fadeUp}>
              Powerful tools wrapped in a delightful experience. Built for people who care about where their money goes.
            </motion.p>
          </div>

          <motion.div className="features-grid" variants={staggerContainer}>
            {features.map((feat, i) => (
              <motion.div
                className="feature-card"
                key={feat.title}
                variants={fadeUp}
                custom={i}
                whileHover={{ y: -6 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              >
                <div className="feature-icon-wrapper">
                  <feat.icon size={22} />
                </div>
                <h3>{feat.title}</h3>
                <p>{feat.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </AnimatedSection>

      {/* =========== STATS =========== */}
      <AnimatedSection className="landing-section stats-section">
        <div className="section-container">
          <div className="stats-grid">
            {stats.map((stat, i) => (
              <motion.div className="stat-item" key={stat.label} variants={fadeUp} custom={i}>
                <div className="stat-number">
                  <AnimatedCounter
                    target={stat.value}
                    suffix={stat.suffix}
                    prefix={stat.prefix}
                  />
                </div>
                <div className="stat-label">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* =========== HOW IT WORKS =========== */}
      <AnimatedSection className="landing-section timeline-section">
        <div className="section-container">
          <div className="section-header">
            <motion.span className="section-label" variants={fadeUp}>
              How It Works
            </motion.span>
            <motion.h2 className="section-title" variants={fadeUp}>
              From sign-up to savings
              <br />in three simple steps
            </motion.h2>
            <motion.p className="section-subtitle" variants={fadeUp}>
              Getting started takes less than a minute. No complex setup, no bank connections required.
            </motion.p>
          </div>

          <div className="timeline-container">
            <div className="timeline-line" />
            <motion.div
              className="timeline-line-fill"
              initial={{ height: 0 }}
              whileInView={{ height: '100%' }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 1.5, ease: 'easeInOut', delay: 0.3 }}
            />

            {steps.map((step, i) => (
              <motion.div
                className="timeline-step"
                key={step.title}
                variants={fadeUp}
                custom={i}
              >
                <motion.div
                  className="timeline-dot"
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ type: 'spring', stiffness: 200, damping: 12, delay: 0.2 + i * 0.2 }}
                >
                  <step.icon size={22} />
                </motion.div>
                <div className="timeline-content">
                  <div className="timeline-step-number">{step.number}</div>
                  <h3>{step.title}</h3>
                  <p>{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* =========== TESTIMONIALS =========== */}
      <AnimatedSection className="landing-section testimonials-section">
        <div className="section-container">
          <div className="section-header">
            <motion.span className="section-label" variants={fadeUp}>
              Testimonials
            </motion.span>
            <motion.h2 className="section-title" variants={fadeUp}>
              Loved by thousands
              <br />of smart spenders
            </motion.h2>
          </div>

          <motion.div className="testimonials-grid" variants={staggerContainer}>
            {testimonials.map((t, i) => (
              <motion.div
                className="testimonial-card"
                key={t.name}
                variants={scaleIn}
                whileHover={{ y: -4 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              >
                <div className="testimonial-stars">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} size={16} fill="#f59e0b" strokeWidth={0} />
                  ))}
                </div>
                <p className="testimonial-quote">"{t.quote}"</p>
                <div className="testimonial-author">
                  <img
                    src={t.avatar}
                    alt={t.name}
                    className="testimonial-avatar"
                    loading="lazy"
                  />
                  <div>
                    <div className="testimonial-name">{t.name}</div>
                    <div className="testimonial-role">{t.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </AnimatedSection>

      {/* =========== FAQ =========== */}
      <AnimatedSection className="landing-section faq-section">
        <div className="section-container">
          <div className="section-header">
            <motion.span className="section-label" variants={fadeUp}>
              FAQ
            </motion.span>
            <motion.h2 className="section-title" variants={fadeUp}>
              Frequently asked questions
            </motion.h2>
            <motion.p className="section-subtitle" variants={fadeUp}>
              Can't find what you're looking for? Reach out to our support team.
            </motion.p>
          </div>

          <motion.div className="faq-container" variants={fadeUp}>
            {faqs.map((faq) => (
              <FAQItem key={faq.q} question={faq.q} answer={faq.a} />
            ))}
          </motion.div>
        </div>
      </AnimatedSection>

      {/* =========== FINAL CTA =========== */}
      <motion.section
        className="final-cta-section"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <div className="final-cta-bg" />
        <div className="final-cta-content">
          <motion.h2
            className="section-title"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Ready to take control of
            <br />your financial future?
          </motion.h2>
          <motion.p
            className="section-subtitle"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.25 }}
          >
            Join 10,000+ users who are already tracking smarter, spending wiser, and saving more every single day.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Link to="/login" className="final-cta-btn">
              Get Started — It's Free <ArrowRight size={18} />
            </Link>
          </motion.div>
        </div>
      </motion.section>

      {/* =========== FOOTER =========== */}
      <footer className="landing-footer">
        <div className="footer-grid">
          <div className="footer-brand">
            <div className="landing-logo">
              <span role="img" aria-label="owl" className="logo-icon">🦉</span>
              <span className="logo-text">Daily Expense Tracker</span>
            </div>
            <p>
              The modern way to track expenses, manage budgets, and build better financial habits. Built with ❤️ in India.
            </p>
          </div>

          <div className="footer-column">
            <h4>Product</h4>
            <Link to="/login">Features</Link>
            <Link to="/login">Integrations</Link>
            <Link to="/login">Changelog</Link>
          </div>

          <div className="footer-column">
            <h4>Company</h4>
            <Link to="/login">About</Link>
            <Link to="/login">Blog</Link>
            <Link to="/login">Careers</Link>
            <Link to="/login">Press Kit</Link>
          </div>

          <div className="footer-column">
            <h4>Support</h4>
            <Link to="/login">Help Center</Link>
            <Link to="/login">Contact Us</Link>
            <Link to="/login">Privacy Policy</Link>
            <Link to="/login">Terms of Service</Link>
          </div>
        </div>

        <div className="footer-bottom">
          <span className="footer-copyright">
            © {new Date().getFullYear()} Daily Expense Tracker. All rights reserved.
          </span>
          <div className="footer-socials">
            <a href="#" className="footer-social-link" aria-label="Twitter">
              <MessageSquare size={16} />
            </a>
            <a href="#" className="footer-social-link" aria-label="GitHub">
              <Globe size={16} />
            </a>
            <a href="#" className="footer-social-link" aria-label="LinkedIn">
              <Mail size={16} />
            </a>
            <a href="#" className="footer-social-link" aria-label="Instagram">
              <Camera size={16} />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
