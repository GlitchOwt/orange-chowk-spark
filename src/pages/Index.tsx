
import { useState } from 'react';
import { motion } from 'framer-motion';
import { ApplicationForm } from '@/components/ApplicationForm';
import { Dashboard } from '@/components/Dashboard';
import { Hero } from '@/components/Hero';

const Index = () => {
  const [userStatus, setUserStatus] = useState<'landing' | 'applying' | 'approved' | 'rejected'>('landing');
  const [userData, setUserData] = useState(null);

  const handleStartApplication = () => {
    setUserStatus('applying');
  };

  const handleApplicationResult = (approved: boolean, data: any) => {
    if (approved) {
      setUserStatus('approved');
      setUserData(data);
    } else {
      setUserStatus('rejected');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-orange-900/20 to-slate-900">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNGRjQ1MDAiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iNCIvPjwvZz48L2c+PC9zdmc+')] opacity-30"></div>
      
      <div className="relative z-10">
        {userStatus === 'landing' && (
          <Hero onStartApplication={handleStartApplication} />
        )}
        
        {userStatus === 'applying' && (
          <ApplicationForm onResult={handleApplicationResult} />
        )}
        
        {userStatus === 'approved' && userData && (
          <Dashboard userData={userData} />
        )}
        
        {userStatus === 'rejected' && (
          <div className="min-h-screen flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-md mx-auto text-center bg-slate-800/80 backdrop-blur-sm rounded-2xl p-8 border border-orange-500/20"
            >
              <div className="w-16 h-16 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-orange-400 text-2xl">✦</span>
              </div>
              <h2 className="text-2xl font-bold text-white mb-4">
                Thank you for your interest
              </h2>
              <p className="text-slate-300 mb-6">
                While your application doesn't align with our current community focus, 
                we encourage you to reapply as you continue your creative journey.
              </p>
              <button
                onClick={() => setUserStatus('landing')}
                className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium transition-colors"
              >
                Back to Home
              </button>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
