
import { motion } from 'framer-motion';
import { ArrowRight, Users, Sparkles, Heart } from 'lucide-react';

interface HeroProps {
  onStartApplication: () => void;
}

export const Hero = ({ onStartApplication }: HeroProps) => {
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          <div className="inline-flex items-center gap-2 bg-orange-500/10 border border-orange-500/20 rounded-full px-4 py-2 mb-6">
            <Sparkles className="w-4 h-4 text-orange-400" />
            <span className="text-orange-300 text-sm font-medium">Curated Creative Community</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
            Orange
            <span className="text-orange-500"> Chowk</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-slate-300 mb-8 max-w-2xl mx-auto leading-relaxed">
            An emotionally intelligent community for Indian creatives who are building, sharing, and growing together.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid md:grid-cols-3 gap-6 mb-12"
        >
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
            <Users className="w-8 h-8 text-orange-400 mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">Curated Network</h3>
            <p className="text-slate-400">Connect with like-minded Indian creatives across disciplines</p>
          </div>
          
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
            <Heart className="w-8 h-8 text-orange-400 mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">Emotionally Intelligent</h3>
            <p className="text-slate-400">Built on authentic connections and meaningful collaborations</p>
          </div>
          
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
            <Sparkles className="w-8 h-8 text-orange-400 mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">Quality Focused</h3>
            <p className="text-slate-400">AI-powered curation ensures aligned community members</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <button
            onClick={onStartApplication}
            className="group inline-flex items-center gap-3 bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-orange-500/25"
          >
            Join Our Community
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
          
          <p className="text-slate-400 mt-4 text-sm">
            Instant evaluation • Immediate access upon approval
          </p>
        </motion.div>
      </div>
    </div>
  );
};
