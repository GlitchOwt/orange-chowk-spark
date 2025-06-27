
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
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-rose-50">
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
            className="max-w-md mx-auto text-center bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-orange-200/50 shadow-sm"
          >
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-orange-600 text-2xl">✦</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-4">
              Thank you for your interest
            </h2>
            <p className="text-slate-700 mb-6">
              While your application doesn't align with our current community focus, 
              we encourage you to reapply as you continue your creative journey.
            </p>
            <button
              onClick={() => setUserStatus('landing')}
              className="px-6 py-3 bg-orange-500 text-white hover:bg-orange-600 rounded-lg font-medium transition-colors"
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
