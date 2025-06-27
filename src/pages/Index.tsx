
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
    <div className="min-h-screen bg-gradient-to-br from-orange-600 via-red-500 to-orange-800">
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
            className="max-w-md mx-auto text-center bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20"
          >
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-white text-2xl">✦</span>
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">
              Thank you for your interest
            </h2>
            <p className="text-white/80 mb-6">
              While your application doesn't align with our current community focus, 
              we encourage you to reapply as you continue your creative journey.
            </p>
            <button
              onClick={() => setUserStatus('landing')}
              className="px-6 py-3 bg-white text-orange-600 hover:bg-orange-50 rounded-lg font-medium transition-colors"
            >
              Back to Home
            </button>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Index;
