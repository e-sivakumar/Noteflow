import { motion } from 'framer-motion';

export default function Particles() {
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