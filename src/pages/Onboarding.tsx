import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { signInAnonymously } from 'firebase/auth';
import { auth } from '../firebase';
import { useStore } from '../store/useStore';
import { useState } from 'react';
import { Loader2 } from 'lucide-react';

export default function Onboarding() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const user = useStore(state => state.user);

    const handleStart = async () => {
        setLoading(true);
        try {
            if (!user) {
                await signInAnonymously(auth);
            }
            navigate('/dashboard');
        } catch (error) {
            console.error('Error signing in:', error);
            alert('Failed to connect. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-between min-h-screen p-6 bg-gradient-to-b from-teal-900 to-slate-900 overflow-hidden relative">
            <div className="absolute top-10 w-[200vw] h-[200vw] bg-primary-500/20 rounded-full blur-3xl -ml-[100vw] pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-12 text-center z-10"
            >
                <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-teal-300 to-primary-500 mb-2">
                    Penguin Fit
                </h1>
                <p className="text-slate-300 text-lg">Your 21-Day Habit Journey</p>
            </motion.div>

            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, type: 'spring' }}
                className="flex-1 flex flex-col justify-center items-center z-10 w-full"
            >
                <div className="relative w-64 h-64 mb-8">
                    <div className="absolute inset-0 bg-primary-500 rounded-full blur-2xl opacity-20 animate-pulse"></div>
                    {/* SVG Penguin Character */}
                    <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-2xl">
                        <motion.g
                            animate={{ y: [0, -15, 0] }}
                            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                        >
                            <ellipse cx="100" cy="120" rx="60" ry="70" fill="#1e293b" />
                            <ellipse cx="100" cy="130" rx="45" ry="55" fill="#f8fafc" />
                            {/* Eyes */}
                            <circle cx="85" cy="90" r="5" fill="#f8fafc" />
                            <circle cx="115" cy="90" r="5" fill="#f8fafc" />
                            {/* Beak */}
                            <path d="M95 100 Q100 110 105 100 Q100 95 95 100" fill="#fbbf24" />
                            {/* Headband */}
                            <path d="M45 80 Q100 95 155 80" stroke="#ef4444" strokeWidth="8" fill="none" />
                            {/* Flippers */}
                            <ellipse cx="30" cy="130" rx="15" ry="35" fill="#1e293b" transform="rotate(30 30 130)" />
                            <ellipse cx="170" cy="130" rx="15" ry="35" fill="#1e293b" transform="rotate(-30 170 130)" />
                            {/* Feet */}
                            <ellipse cx="75" cy="180" rx="15" ry="10" fill="#fbbf24" />
                            <ellipse cx="125" cy="180" rx="15" ry="10" fill="#fbbf24" />
                        </motion.g>
                    </svg>
                </div>

                <h2 className="text-2xl font-bold mb-2">Meet Your Partner!</h2>
                <p className="text-slate-400 text-center max-w-xs mb-8">
                    Train at home, level up your penguin, and build a lasting habit in 21 days.
                </p>

                <div className="bg-slate-800/80 backdrop-blur-md rounded-2xl p-4 w-full border border-primary-500/30">
                    <p className="text-sm text-primary-500 font-semibold mb-1">Smart Goal</p>
                    <div className="flex items-center justify-between">
                        <span className="text-lg font-medium">15 Minutes Daily</span>
                        <span className="bg-teal-500/20 text-teal-300 text-xs px-2 py-1 rounded">Recommended</span>
                    </div>
                </div>
            </motion.div>

            <motion.button
                onClick={handleStart}
                disabled={loading}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full py-4 mt-8 rounded-2xl font-bold text-lg shadow-lg flex items-center justify-center space-x-2
          bg-gradient-to-r from-primary-500 to-teal-400 text-slate-900 border border-teal-300/50 hover:shadow-primary-500/50 transition-shadow z-10"
            >
                {loading ? <Loader2 className="animate-spin" /> : <span>Get Started 💪</span>}
            </motion.button>
        </div>
    );
}
