import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const features = [
    {
      title: 'Organized Folders & Notes',
      desc: 'Create folders and group your notes like a file system.',
      icon: '📁',
    },
    {
      title: 'Archive System',
      desc: 'Temporarily hide notes without deleting them.',
      icon: '🗂️',
    },
    {
      title: 'Responsive Design',
      desc: 'Mobile-friendly UI that works across all screen sizes.',
      icon: '📱',
    },
    {
      title: 'Dark/Light Theme',
      desc: 'Switch between light and dark mode easily.',
      icon: '🌓',
    },
    {
      title: 'Popup Forms & Search',
      desc: 'Quick modals for creating/editing notes and searching.',
      icon: '🔍',
    },
    {
      title: 'Error Handling & Toasters',
      desc: 'Real-time form validation and feedback notifications.',
      icon: '🚨',
    },
  ];
  

const FloatingNote = ({ delay, duration, children, className = "" }: {delay: number, duration: number, children: React.ReactNode, className?: string}) => (
  <motion.div
    className={`absolute bg-white/10 backdrop-blur-sm rounded-lg p-3 text-xs text-white/80 border border-white/20 ${className}`}
    initial={{ opacity: 0, y: 100, rotate: -10 }}
    animate={{ 
      opacity: [0, 1, 1, 0],
      y: [100, -20, -40, -100],
      rotate: [-10, 5, -5, 10],
      x: [0, 30, -20, 50]
    }}
    transition={{
      duration: duration,
      delay: delay,
      repeat: Infinity,
      repeatDelay: 2,
      ease: "easeInOut"
    }}
  >
    {children}
  </motion.div>
);

// Typing animation component
const TypingText = () => {
  const texts = ['Meeting Notes...', 'Project Ideas...', 'Daily Tasks...', 'Quick Thoughts...'];
  const [currentText, setCurrentText] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    const text = texts[currentText];
    let timeout: number;

    if (isTyping) {
      if (displayText.length < text.length) {
        timeout = setTimeout(() => {
          setDisplayText(text.slice(0, displayText.length + 1));
        }, 100);
      } else {
        timeout = setTimeout(() => setIsTyping(false), 1000);
      }
    } else {
      if (displayText.length > 0) {
        timeout = setTimeout(() => {
          setDisplayText(displayText.slice(0, -1));
        }, 50);
      } else {
        setCurrentText((prev) => (prev + 1) % texts.length);
        setIsTyping(true);
      }
    }

    return () => clearTimeout(timeout);
  }, [displayText, isTyping, currentText, texts]);

  return (
    <span className="text-blue-400">
      {displayText}
      <motion.span
        animate={{ opacity: [1, 0] }}
        transition={{ duration: 0.8, repeat: Infinity }}
        className="ml-1"
      >
        |
      </motion.span>
    </span>
  );
};

// Particle background
const Particles = () => {
  const particles = Array.from({ length: 50 }, (_, i) => i);
  
  return (
    <div className="absolute inset-0 overflow-hidden">
      {particles.map((i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-blue-400/30 rounded-full"
          initial={{
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
          }}
          animate={{
            y: [null, -100, window.innerHeight + 100],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: Math.random() * 3 + 2,
            repeat: Infinity,
            delay: Math.random() * 2,
          }}
        />
      ))}
    </div>
  );
};

export default function Landing() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

    const [isDark, setIsDark] = useState(() => {
      return localStorage.getItem('theme') === 'dark';
    });

    useEffect(() => {
        const root = window.document.documentElement;
        if (isDark) {
          root.classList.add('dark');
          localStorage.setItem('theme', 'dark');
        } else {
          root.classList.remove('dark');
          localStorage.setItem('theme', 'light');
        }
      }, [isDark]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white overflow-hidden relative">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <Particles />
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(56,189,248,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(56,189,248,0.03)_1px,transparent_1px)] bg-[size:100px_100px]" />
        
        {/* Gradient Orbs */}
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{ duration: 4, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.6, 0.3, 0.6],
          }}
          transition={{ duration: 4, repeat: Infinity, delay: 2 }}
        />
      </div>

      {/* Mouse Follow Effect */}
      <motion.div
        className="absolute pointer-events-none w-6 h-6 bg-blue-400/30 rounded-full blur-sm"
        animate={{
          x: mousePosition.x - 12,
          y: mousePosition.y - 12,
        }}
        transition={{ type: "spring", damping: 30, stiffness: 200 }}
      />

      {/* Floating Notes */}
      <FloatingNote delay={0} duration={8} className="top-20 left-10">
        📝 "Remember to buy groceries"
      </FloatingNote>
      <FloatingNote delay={2} duration={7} className="top-32 right-20">
        💡 "App idea: Voice notes"
      </FloatingNote>
      <FloatingNote delay={4} duration={9} className="top-48 left-1/4">
        📋 "Team meeting at 3pm"
      </FloatingNote>
      <FloatingNote delay={6} duration={6} className="top-40 right-1/3">
        🎯 "Launch product by Q2"
      </FloatingNote>

      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 p-6 flex justify-between items-center"
      >
        <motion.div
          className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"
          whileHover={{ scale: 1.05 }}
        >
          NoteFlow
        </motion.div>
        <motion.nav
          className="hidden md:flex space-x-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <a href="#features" className="hover:text-blue-400 transition-colors">Features</a>
          <a href="#pricing" className="hover:text-blue-400 transition-colors">Pricing</a>
          <a href="#about" className="hover:text-blue-400 transition-colors">About</a>
          <button
            onClick={() => setIsDark(!isDark)}
            className="ml-4 px-3 py-1 rounded border border-white/20 text-sm hover:bg-white/10 transition"
            >
            {isDark ? '☀️ Light Mode' : '🌙 Dark Mode'}
            </button>
        </motion.nav>
      </motion.header>

      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative z-10 flex flex-col items-center justify-center px-6 py-20 text-center"
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-8"
        >
          <h1 className="text-6xl md:text-8xl font-black mb-6 leading-tight">
            <motion.span
              className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent"
              animate={{
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              Think
            </motion.span>
            <br />
            <motion.span
              className="text-white"
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              Organize
            </motion.span>
            <br />
            <motion.span
              className="bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent"
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              Create
            </motion.span>
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="mb-12 max-w-4xl"
        >
          <p className="text-xl md:text-2xl text-gray-300 mb-4">
            The most intuitive note-taking app that grows with your ideas
          </p>
          <div className="text-lg text-gray-400 font-mono">
            What you can write: <TypingText />
          </div>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1 }}
          className="flex flex-col sm:flex-row gap-4 mb-16"
        >
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(59, 130, 246, 0.3)" }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl shadow-2xl hover:shadow-blue-500/25 transition-all duration-300"
          >
            Start Writing Now
          </motion.button>
          {/* <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 border-2 border-white/20 text-white font-semibold rounded-xl backdrop-blur-sm hover:bg-white/10 transition-all duration-300"
          >
            Watch Demo
          </motion.button> */}
        </motion.div>

        {/* App Preview Mockup */}
        <motion.div
          initial={{ opacity: 0, y: 50, rotateX: 20 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{ delay: 1.3, duration: 1 }}
          className="relative max-w-4xl mx-auto perspective-1000"
        >
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-4 border border-gray-700/50 shadow-2xl transform hover:rotateY-2 transition-transform duration-500">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            </div>
            <div className="bg-gray-900/80 rounded-lg p-6 min-h-64">
              <div className="flex space-x-4 mb-4">
                <div className="flex-1">
                  <div className="h-2 bg-gray-600 rounded mb-2 w-1/3"></div>
                  <div className="h-2 bg-gray-700 rounded mb-4 w-full"></div>
                  <div className="space-y-2">
                    <motion.div
                      className="h-2 bg-blue-500/50 rounded w-3/4"
                      animate={{ width: ['0%', '75%'] }}
                      transition={{ delay: 2, duration: 1 }}
                    ></motion.div>
                    <motion.div
                      className="h-2 bg-purple-500/50 rounded w-1/2"
                      animate={{ width: ['0%', '50%'] }}
                      transition={{ delay: 2.5, duration: 1 }}
                    ></motion.div>
                  </div>
                </div>
                <div className="w-32">
                  <div className="h-20 bg-gray-700/50 rounded mb-2"></div>
                  <div className="h-8 bg-gray-600/50 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.section>

      {/* Features Section */}
      <section id="features" className="relative z-10 py-20 px-6">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="max-w-6xl mx-auto"
        >
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold text-center mb-16 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent"
          >
            Powerful Features
          </motion.h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ 
                  scale: 1.05,
                  rotateY: 5,
                  boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)"
                }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, duration: 0.6 }}
                className="group bg-white/5 backdrop-blur-sm p-8 rounded-2xl border border-white/10 hover:border-white/20 transition-all duration-300 cursor-pointer"
              >
                <motion.div
                  className="text-4xl mb-4"
                  whileHover={{ scale: 1.2, rotate: 10 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  {feature.icon}
                </motion.div>
                <h3 className="text-xl font-semibold mb-3 text-white group-hover:text-blue-400 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-400 group-hover:text-gray-300 transition-colors">
                  {feature.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="relative z-10 py-20 px-6 bg-black/20"
      >
        <div className="max-w-4xl mx-auto text-center">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { number: "1M+", label: "Notes Created" },
              { number: "50K+", label: "Active Users" },
              { number: "99.9%", label: "Uptime" },
              { number: "24/7", label: "Support" },
            ].map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="text-center"
              >
                <motion.div
                  className="text-3xl md:text-4xl font-bold text-blue-400 mb-2"
                  whileHover={{ scale: 1.1 }}
                >
                  {stat.number}
                </motion.div>
                <div className="text-gray-400">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="relative z-10 py-12 px-6 text-center border-t border-white/10"
      >
        <div className="max-w-4xl mx-auto">
          <motion.div
            className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-4"
            whileHover={{ scale: 1.05 }}
          >
            NoteFlow
          </motion.div>
          <p className="text-gray-400 mb-6">
            Transform your thoughts into organized, actionable insights
          </p>
          <div className="flex justify-center space-x-6 text-sm text-gray-500">
            <a href="#" className="hover:text-blue-400 transition-colors">Privacy</a>
            <a href="#" className="hover:text-blue-400 transition-colors">Terms</a>
            <a href="#" className="hover:text-blue-400 transition-colors">Contact</a>
          </div>
          <p className="text-gray-600 text-sm mt-6">
            © {new Date().getFullYear()} NoteFlow. All rights reserved.
          </p>
        </div>
      </motion.footer>
    </div>
  );
}