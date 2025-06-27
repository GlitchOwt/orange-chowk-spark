
import { motion } from 'framer-motion';
import { ArrowRight, Users, Sparkles, Heart } from 'lucide-react';

interface HeroProps {
  onStartApplication: () => void;
}

export const Hero = ({ onStartApplication }: HeroProps) => {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-orange-600 via-red-500 to-orange-800">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNGRkZGRkYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iNCIvPjwvZz48L2c+PC9zdmc+')] opacity-20"></div>
      
      <div className="max-w-4xl mx-auto text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-6">
            <Sparkles className="w-4 h-4 text-white/90" />
            <span className="text-white/90 text-sm font-medium">Curated Creative Community</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
            orange
            <span className="text-orange-200"> chowk</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-2xl mx-auto leading-relaxed">
            An emotionally intelligent community for Indian creatives who are building, sharing, and growing together.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid md:grid-cols-3 gap-6 mb-12"
        >
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <Users className="w-8 h-8 text-white mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">Curated Network</h3>
            <p className="text-white/80">Connect with like-minded Indian creatives across disciplines</p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <Heart className="w-8 h-8 text-white mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">Emotionally Intelligent</h3>
            <p className="text-white/80">Built on authentic connections and meaningful collaborations</p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <Sparkles className="w-8 h-8 text-white mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">Quality Focused</h3>
            <p className="text-white/80">AI-powered curation ensures aligned community members</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <button
            onClick={onStartApplication}
            className="group inline-flex items-center gap-3 bg-white text-orange-600 hover:bg-orange-50 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-black/25 border border-white/20"
          >
            MEMBERSHIP WAITLIST
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
          
          <p className="text-white/80 mt-4 text-sm">
            Instant evaluation • Immediate access upon approval
          </p>
        </motion.div>
      </div>
    </div>
  );
};
