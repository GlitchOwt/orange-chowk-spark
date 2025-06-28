
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ApplicationForm } from '@/components/ApplicationForm';
import { Dashboard } from '@/components/Dashboard';
import { Hero } from '@/components/Hero';
import { Auth } from '@/components/Auth';
import { useAuth } from '@/contexts/AuthContext';

const Index = () => {
  const { user, loading } = useAuth();
  const [userStatus, setUserStatus] = useState<'landing' | 'applying' | 'approved' | 'rejected' | 'creating-account'>('landing');
  const [userData, setUserData] = useState(null);

  const handleStartApplication = () => {
    setUserStatus('applying');
  };

  const handleApplicationResult = (approved: boolean, data: any) => {
    if (approved) {
      setUserStatus('creating-account');
      setUserData(data);
    } else {
      setUserStatus('rejected');
    }
  };

  const handleAccountCreated = () => {
    setUserStatus('approved');
  };

  // Show loading state while checking auth (only when user is authenticated)
  if (loading && user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-rose-50 flex items-center justify-center">
        <div className="text-orange-600 text-lg">Loading...</div>
      </div>
    );
  }

  // If user is already authenticated, show dashboard
  if (user && userStatus !== 'creating-account') {
    return (
      <Dashboard userData={{
        name: user.user_metadata?.name || user.email?.split('@')[0] || 'User',
        email: user.email,
        profession: 'Creative Professional',
        city: 'Community Member'
      }} />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-rose-50">
      {userStatus === 'landing' && (
        <Hero onStartApplication={handleStartApplication} />
      )}
      
      {userStatus === 'applying' && (
        <ApplicationForm onResult={handleApplicationResult} />
      )}
      
      {userStatus === 'creating-account' && (
        <div className="min-h-screen flex items-center justify-center p-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-md mx-auto bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-orange-200/50 shadow-sm"
          >
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-green-600 text-2xl">🎉</span>
              </div>
              <h2 className="text-2xl font-bold text-slate-800 mb-4">
                Welcome to Orange Chowk!
              </h2>
              <p className="text-slate-700 mb-6">
                Your application has been approved! Please create your account to access the community dashboard.
              </p>
            </div>
            <Auth onAccountCreated={handleAccountCreated} />
          </motion.div>
        </div>
      )}
      
      {userStatus === 'approved' && userData && user && (
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
