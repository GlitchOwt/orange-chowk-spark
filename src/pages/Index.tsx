import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ApplicationForm } from '@/components/ApplicationForm';
import { Dashboard } from '@/components/Dashboard';
import { Hero } from '@/components/Hero';
import { Auth } from '@/components/Auth';
import { useAuth } from '@/contexts/AuthContext';
import { Footer } from '@/components/ui/footer-section';

// Animation variants
const pageVariants = {
  initial: { opacity: 0, scale: 0.95 },
  in: { opacity: 1, scale: 1 },
  out: { opacity: 0, scale: 1.05 }
};

const pageTransition = {
  type: "tween",
  ease: "anticipate",
  duration: 0.5
};

const successVariants = {
  hidden: { opacity: 0, y: 50, scale: 0.8 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  }
};

const rejectionVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  }
};

const iconVariants = {
  hidden: { scale: 0, rotate: -180 },
  visible: {
    scale: 1,
    rotate: 0,
    transition: {
      type: "spring",
      stiffness: 200,
      damping: 15,
      delay: 0.2
    }
  }
};

const buttonVariants = {
  hover: {
    scale: 1.05,
    transition: {
      duration: 0.2
    }
  },
  tap: {
    scale: 0.95
  }
};

const Index = () => {
  const { user, loading } = useAuth();
  const [userStatus, setUserStatus] = useState<'landing' | 'applying' | 'approved' | 'rejected' | 'creating-account'>('landing');
  const [applicationData, setApplicationData] = useState(null);

  const handleStartApplication = () => {
    setUserStatus('applying');
  };

  const handleApplicationResult = (approved: boolean, data: any) => {
    if (approved) {
      setUserStatus('creating-account');
      setApplicationData(data);
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
      <motion.div 
        className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-rose-50 flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <motion.div 
          className="text-orange-600 text-lg"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          Loading...
        </motion.div>
      </motion.div>
    );
  }

  // If user is already authenticated, show dashboard with application data
  if (user && userStatus !== 'creating-account') {
    const dashboardUserData = {
      name: user.user_metadata?.name || user.email?.split('@')[0] || 'User',
      email: user.email,
      profession: applicationData?.profession || 'Creative Professional',
      city: applicationData?.city || 'Community Member',
      pastEvents: applicationData?.pastEvents || []
    };
    
    return (
      <motion.div
        initial="initial"
        animate="in"
        exit="out"
        variants={pageVariants}
        transition={pageTransition}
      >
        <Dashboard userData={dashboardUserData} />
      </motion.div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-rose-50">
      <AnimatePresence mode="wait">
        {userStatus === 'landing' && (
          <motion.div
            key="landing"
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
          >
            <Hero onStartApplication={handleStartApplication} />
            <Footer />
          </motion.div>
        )}
        
        {userStatus === 'applying' && (
          <motion.div
            key="applying"
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
          >
            <ApplicationForm onResult={handleApplicationResult} />
          </motion.div>
        )}
        
        {userStatus === 'creating-account' && (
          <motion.div
            key="creating-account"
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
            className="min-h-screen flex items-center justify-center p-6"
          >
            <motion.div
              className="max-w-md mx-auto bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-orange-200/50 shadow-sm"
              variants={successVariants}
              initial="hidden"
              animate="visible"
            >
              <div className="text-center mb-8">
                <motion.div 
                  className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
                  variants={iconVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <motion.span 
                    className="text-green-600 text-2xl"
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                  >
                    🎉
                  </motion.span>
                </motion.div>
                <motion.h2 
                  className="text-2xl font-bold text-slate-800 mb-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  Welcome to Orange Chowk!
                </motion.h2>
                <motion.p 
                  className="text-slate-700 mb-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  Your application has been approved! Please create your account to access the community dashboard.
                </motion.p>
              </div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <Auth onAccountCreated={handleAccountCreated} />
              </motion.div>
            </motion.div>
          </motion.div>
        )}
        
        {userStatus === 'approved' && applicationData && user && (
          <motion.div
            key="approved"
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
          >
            <Dashboard userData={{
              name: user.user_metadata?.name || applicationData.name || user.email?.split('@')[0] || 'User',
              email: user.email || applicationData.email,
              profession: applicationData.profession || 'Creative Professional',
              city: applicationData.city || 'Community Member',
              pastEvents: applicationData.pastEvents || []
            }} />
          </motion.div>
        )}
        
        {userStatus === 'rejected' && (
          <motion.div
            key="rejected"
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
            className="min-h-screen flex flex-col"
          >
            <div className="flex-1 flex items-center justify-center p-6">
              <motion.div
                className="max-w-md mx-auto text-center bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-orange-200/50 shadow-sm"
                variants={rejectionVariants}
                initial="hidden"
                animate="visible"
              >
                <motion.div 
                  className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6"
                  variants={iconVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <motion.span 
                    className="text-orange-600 text-2xl"
                    animate={{ rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                  >
                    ✦
                  </motion.span>
                </motion.div>
                <motion.h2 
                  className="text-2xl font-bold text-slate-800 mb-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  Thank you for your interest
                </motion.h2>
                <motion.p 
                  className="text-slate-700 mb-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  While your application doesn't align with our current community focus, 
                  we encourage you to reapply as you continue your creative journey.
                </motion.p>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                >
                  <button
                    onClick={() => setUserStatus('landing')}
                    className="px-6 py-3 bg-orange-500 text-white hover:bg-orange-600 rounded-lg font-medium transition-colors"
                  >
                    Back to Home
                  </button>
                </motion.div>
              </motion.div>
            </div>
            <Footer />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Index;