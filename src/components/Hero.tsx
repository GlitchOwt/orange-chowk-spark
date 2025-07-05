import { motion } from 'framer-motion';
import { ArrowRight, Users, Sparkles, Heart } from 'lucide-react';
import Aurora from './Aurora';
import { Particles } from '@/components/ui/particles';

interface HeroProps {
  onStartApplication: () => void;
}

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8
    }
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 50, scale: 0.9 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.6
    }
  },
  hover: {
    y: -8,
    scale: 1.02,
    transition: {
      duration: 0.3
    }
  }
};

const buttonVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5
    }
  },
  hover: {
    scale: 1.05,
    transition: {
      duration: 0.2
    }
  },
  tap: {
    scale: 0.95,
    transition: {
      duration: 0.1
    }
  }
};

const badgeVariants = {
  hidden: { opacity: 0, scale: 0.8, y: -20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.6
    }
  },
  hover: {
    scale: 1.05,
    transition: {
      duration: 0.2
    }
  }
};

const titleVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 1
    }
  }
};

const floatingAnimation = {
  y: [-10, 10, -10],
  transition: {
    duration: 6,
    repeat: Infinity
  }
};

export const Hero = ({ onStartApplication }: HeroProps) => {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-orange-50 via-amber-50 to-rose-50 overflow-hidden">
      {/* Aurora Background Effect */}
      <motion.div 
        className="absolute inset-0 overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2 }}
      >
        <Aurora
          colorStops={["#FF6B35", "#F7931E", "#FFD23F"]}
          blend={0.3}
          amplitude={1.2}
          speed={0.3}
        />
      </motion.div>
      
      {/* Particles Background */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5, delay: 0.5 }}
      >
        <Particles
          className="absolute inset-0"
          quantity={80}
          ease={70}
          color="#FF6B35"
          staticity={30}
          size={0.8}
        />
      </motion.div>
      
      {/* Background Pattern */}
      <motion.div 
        className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNGRjQ1MDAiIGZpbGwtb3BhY2l0eT0iMC4wMiI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iNCIvPjwvZz48L2c+PC9zdmc=')] opacity-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.2 }}
        transition={{ duration: 1 }}
      />
      
      <motion.div 
        className="max-w-4xl mx-auto text-center relative z-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants}>
          <motion.div 
            className="inline-flex items-center gap-2 bg-white/60 backdrop-blur-sm border border-orange-200/50 rounded-full px-4 py-2 mb-6 shadow-sm"
            variants={badgeVariants}
            whileHover="hover"
          >
            <motion.div
              animate={floatingAnimation}
            >
              <Sparkles className="w-4 h-4 text-orange-600" />
            </motion.div>
            <span className="text-orange-800 text-sm font-medium">Curated Creative Community</span>
          </motion.div>
          
          <motion.h1 
            className="text-5xl md:text-7xl font-bold text-slate-800 mb-6" 
            style={{ fontFamily: 'Youth Medium, sans-serif' }}
            variants={titleVariants}
          >
            <motion.span
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              orange
            </motion.span>
            <motion.span 
              className="text-orange-500"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
            > chowk</motion.span>
          </motion.h1>
          
          <motion.p 
            className="text-xl md:text-2xl text-slate-700 mb-8 max-w-2xl mx-auto leading-relaxed"
            variants={itemVariants}
          >
            An emotionally intelligent community for Indian creatives who are building, sharing, and growing together.
          </motion.p>
        </motion.div>

        <motion.div
          className="grid md:grid-cols-3 gap-6 mb-12"
          variants={containerVariants}
        >
          <motion.div 
            className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-orange-100/50 shadow-sm"
            variants={cardVariants}
            whileHover="hover"
          >
            <motion.div
              animate={floatingAnimation}
              transition={{ ...floatingAnimation.transition, delay: 0.5 }}
            >
              <Users className="w-8 h-8 text-orange-600 mb-4" />
            </motion.div>
            <h3 className="text-lg font-semibold text-slate-800 mb-2">Curated Network</h3>
            <p className="text-slate-700">Connect with like-minded Indian creatives across disciplines</p>
          </motion.div>
          
          <motion.div 
            className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-orange-100/50 shadow-sm"
            variants={cardVariants}
            whileHover="hover"
          >
            <motion.div
              animate={floatingAnimation}
              transition={{ ...floatingAnimation.transition, delay: 1 }}
            >
              <Heart className="w-8 h-8 text-orange-600 mb-4" />
            </motion.div>
            <h3 className="text-lg font-semibold text-slate-800 mb-2">Emotionally Intelligent</h3>
            <p className="text-slate-700">Built on authentic connections and meaningful collaborations</p>
          </motion.div>
          
          <motion.div 
            className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-orange-100/50 shadow-sm"
            variants={cardVariants}
            whileHover="hover"
          >
            <motion.div
              animate={floatingAnimation}
              transition={{ ...floatingAnimation.transition, delay: 1.5 }}
            >
              <Sparkles className="w-8 h-8 text-orange-600 mb-4" />
            </motion.div>
            <h3 className="text-lg font-semibold text-slate-800 mb-2">Quality Focused</h3>
            <p className="text-slate-700">AI-powered curation ensures aligned community members</p>
          </motion.div>
        </motion.div>

        <motion.div variants={itemVariants}>
          <motion.button
            onClick={onStartApplication}
            className="group inline-flex items-center gap-3 bg-orange-500 text-white hover:bg-orange-600 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 border border-orange-400 shadow-lg"
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
          >
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
            >
              MEMBERSHIP WAITLIST
            </motion.span>
            <motion.div
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <ArrowRight className="w-5 h-5" />
            </motion.div>
          </motion.button>
          
          <motion.p 
            className="text-slate-600 mt-4 text-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
          >
            Instant evaluation • Immediate access upon approval
          </motion.p>
        </motion.div>
      </motion.div>
    </div>
  );
};