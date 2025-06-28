import { motion } from 'framer-motion';
import { ArrowRight, Users, Sparkles, Heart } from 'lucide-react';

interface HeroProps {
  onStartApplication: () => void;
}

export const Hero = ({ onStartApplication }: HeroProps) => {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-orange-50 via-amber-50 to-rose-50">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNGRjQ1MDAiIGZpbGwtb3BhY2l0eT0iMC4wMiI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iNCIvPjwvZz48L2c+PC9zdmc+')] opacity-30"></div>
      
      <div className="max-w-4xl mx-auto text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          <div className="inline-flex items-center gap-2 bg-white/60 backdrop-blur-sm border border-orange-200/50 rounded-full px-4 py-2 mb-6 shadow-sm">
            <Sparkles className="w-4 h-4 text-orange-600" />
            <span className="text-orange-800 text-sm font-medium">Curated Creative Community</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-slate-800 mb-6">
            <span className="framer-text bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">
              orange chowk
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-slate-700 mb-8 max-w-2xl mx-auto leading-relaxed">
            An emotionally intelligent community for Indian creatives who are building, sharing, and growing together.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid md:grid-cols-3 gap-6 mb-12"
        >
          <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-orange-100/50 shadow-sm">
            <Users className="w-8 h-8 text-orange-600 mb-4" />
            <h3 className="text-lg font-semibold text-slate-800 mb-2">Curated Network</h3>
            <p className="text-slate-700">Connect with like-minded Indian creatives across disciplines</p>
          </div>
          
          <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-orange-100/50 shadow-sm">
            <Heart className="w-8 h-8 text-orange-600 mb-4" />
            <h3 className="text-lg font-semibold text-slate-800 mb-2">Emotionally Intelligent</h3>
            <p className="text-slate-700">Built on authentic connections and meaningful collaborations</p>
          </div>
          
          <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-orange-100/50 shadow-sm">
            <Sparkles className="w-8 h-8 text-orange-600 mb-4" />
            <h3 className="text-lg font-semibold text-slate-800 mb-2">Quality Focused</h3>
            <p className="text-slate-700">AI-powered curation ensures aligned community members</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <button
            onClick={onStartApplication}
            className="group inline-flex items-center gap-3 bg-orange-500 text-white hover:bg-orange-600 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-orange-500/25 border border-orange-400"
          >
            MEMBERSHIP WAITLIST
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
          
          <p className="text-slate-600 mt-4 text-sm">
            Instant evaluation • Immediate access upon approval
          </p>
        </motion.div>
      </div>
    </div>
  );
};