import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useStore } from '../store/useStore';
import { PlayCircle, Crown, History, Calendar, X } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function Dashboard() {
    const navigate = useNavigate();
    const { userState, penguin, feedPenguin } = useStore();
    const [percent, setPercent] = useState(0);

    useEffect(() => {
        // Animate percentage
        setTimeout(() => {
            setPercent(Math.round((userState.currentDay / 21) * 100));
        }, 500);
    }, [userState]);

    return (
        <div className="flex flex-col min-h-screen bg-slate-900 border-x border-slate-800">
            <div className="responsive-container py-6">
                <header className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-primary-500">
                            Day {userState.currentDay}
                        </h1>
                        <p className="text-slate-400 text-sm">21-Day Habit Challenge</p>
                    </div>
                    <button
                        onClick={() => navigate('/subscription')}
                        className="p-2 bg-gradient-to-tr from-amber-500/20 to-yellow-400/20 rounded-xl border border-yellow-500/30 text-amber-300 hover:scale-105 transition"
                    >
                        <Crown className="w-5 h-5" />
                    </button>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                    {/* Left Column: Progress & Penguin */}
                    <div className="md:col-span-7 flex flex-col">
                        {/* Progress */}
                        <div className="bg-slate-800 rounded-2xl p-6 shadow-lg mb-8 border border-slate-700/50">
                            <div className="flex justify-between mb-2">
                                <span className="text-sm text-slate-400 font-medium">Streak: <span className="text-white font-bold">{userState.streak}🔥</span></span>
                                <span className="text-sm text-teal-400 font-semibold">{percent}% Completed</span>
                            </div>
                            <div className="w-full bg-slate-700 rounded-full h-3">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${percent}%` }}
                                    transition={{ duration: 1 }}
                                    className="bg-gradient-to-r from-teal-400 to-primary-500 h-3 rounded-full shadow-[0_0_10px_rgba(45,212,191,0.3)]"
                                />
                            </div>
                        </div>

                        {/* Penguin Pet Area */}
                        <div className="flex-1 flex flex-col items-center justify-center p-8 bg-slate-800/20 rounded-3xl border border-slate-800/50 relative overflow-hidden min-h-[400px]">
                            <div className="absolute inset-0 bg-primary-500 blur-[120px] rounded-full opacity-5 animate-pulse"></div>
                            <motion.div
                                onClick={feedPenguin}
                                className="w-64 h-64 relative cursor-pointer group z-10"
                                whileTap={{ scale: 0.9 }}
                            >
                                <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-[0_20px_40px_rgba(0,0,0,0.6)]">
                                    <motion.g
                                        animate={{
                                            y: penguin.mood === 'happy' ? [0, -20, 0] : [0, 5, 0],
                                            scale: penguin.mood === 'happy' ? [1, 1.05, 1] : [1, 0.98, 1]
                                        }}
                                        transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                                    >
                                        <ellipse cx="100" cy="120" rx="60" ry="70" fill={userState.hasPremium ? "#1e1b4b" : "#1e293b"} />
                                        <ellipse cx="100" cy="130" rx="45" ry="55" fill="#f8fafc" />
                                        {/* Ninja Suit / Body Details */}
                                        {userState.hasPremium && (
                                            <g>
                                                <path d="M60 140 Q100 150 140 140" stroke="#ffd700" strokeWidth="2" fill="none" opacity="0.5" />
                                                <circle cx="100" cy="125" r="3" fill="#ffd700" />
                                            </g>
                                        )}
                                        {/* Eyes */}
                                        {penguin.mood === 'happy' ? (
                                            <>
                                                <path d="M80 90 Q85 85 90 90" stroke={userState.hasPremium ? "#ffd700" : "#f8fafc"} fill="none" strokeWidth="4" />
                                                <path d="M110 90 Q115 85 120 90" stroke={userState.hasPremium ? "#ffd700" : "#f8fafc"} fill="none" strokeWidth="4" />
                                            </>
                                        ) : (
                                            <>
                                                <circle cx="85" cy="90" r="5" fill={userState.hasPremium ? "#ffd700" : "#f8fafc"} />
                                                <circle cx="115" cy="90" r="5" fill={userState.hasPremium ? "#ffd700" : "#f8fafc"} />
                                            </>
                                        )}
                                        {/* Beak */}
                                        <path d="M95 100 Q100 110 105 100 Q100 95 95 100" fill="#fbbf24" />
                                        {/* Headband / Ninja Mask */}
                                        {userState.hasPremium && (
                                            <g>
                                                <rect x="40" y="75" width="120" height="30" rx="5" fill="#1e1b4b" stroke="#312e81" strokeWidth="1" />
                                                <motion.path
                                                    animate={{ rotate: [0, 15, 0], x: [0, 5, 0] }}
                                                    transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                                                    d="M160 85 L180 75 L175 95 Z" fill="#312e81"
                                                />
                                                <motion.path
                                                    animate={{ opacity: [0.5, 1, 0.5] }}
                                                    transition={{ repeat: Infinity, duration: 2 }}
                                                    d="M45 85 Q100 90 155 85" stroke="#fbbf24" strokeWidth="4" fill="none"
                                                />
                                            </g>
                                        )}
                                    </motion.g>
                                </svg>
                            </motion.div>

                            <div className="mt-8 text-center z-10">
                                <h2 className="text-2xl font-bold font-sans flex items-center justify-center gap-3 text-white">
                                    {penguin.name} <span className="bg-slate-700 px-3 py-1 rounded-full text-xs font-mono tracking-wider">LVL {penguin.friendshipLevel}</span>
                                </h2>
                                <p className="text-slate-400 text-base mt-2 max-w-xs mx-auto">
                                    {penguin.mood === 'happy' ? 'Pipi is pumped up and ready to rumble with you!' : 'He looks a bit tired. Complete a workout to boost his energy!'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Actions & History */}
                    <div className="md:col-span-5 flex flex-col space-y-8">
                        <motion.button
                            onClick={() => navigate('/workout')}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="w-full py-6 rounded-2xl bg-gradient-to-br from-teal-400 to-primary-600 shadow-[0_10px_30px_rgba(13,185,242,0.3)] flex justify-between items-center px-8 border border-teal-300/20 group"
                        >
                            <div className="flex flex-col text-left">
                                <span className="text-slate-900 font-black text-xl italic uppercase tracking-tight">Level Up Now</span>
                                <span className="text-slate-800 text-sm font-bold opacity-80">15 Min Hiit Circuit</span>
                            </div>
                            <PlayCircle className="w-10 h-10 text-slate-950 group-hover:scale-110 transition-transform" />
                        </motion.button>

                        {/* Recent Activity */}
                        <div className="bg-slate-800/30 rounded-3xl p-6 border border-slate-800/50 flex-1">
                            <div className="flex items-center gap-2 mb-6">
                                <div className="p-2 bg-slate-700/50 rounded-lg">
                                    <History className="w-5 h-5 text-teal-400" />
                                </div>
                                <h3 className="text-xl font-bold text-white tracking-tight">Mission History</h3>
                            </div>

                            <div className="space-y-4">
                                {userState?.history && userState.history.length > 0 ? (
                                    [...userState.history].reverse().slice(0, 5).map((session, idx) => (
                                        <motion.div
                                            initial={{ x: -20, opacity: 0 }}
                                            animate={{ x: 0, opacity: 1 }}
                                            transition={{ delay: idx * 0.1 }}
                                            key={session.completedAt}
                                            className="bg-slate-800/80 border border-slate-700/50 rounded-2xl p-4 flex items-center justify-between hover:bg-slate-700/50 transition-colors"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="bg-primary-500/10 p-3 rounded-xl text-primary-400">
                                                    <Calendar className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-slate-100 text-base">Day {session.day} Clear</p>
                                                    <p className="text-xs text-slate-500 font-medium">{new Date(session.completedAt).toLocaleDateString()}</p>
                                                </div>
                                            </div>
                                            <div className="flex flex-col items-end">
                                                <span className="text-[10px] font-black uppercase tracking-widest text-teal-400 bg-teal-400/10 px-2 py-1 rounded-md mb-1">
                                                    VETERAN
                                                </span>
                                            </div>
                                        </motion.div>
                                    ))
                                ) : (
                                    <div className="text-center py-12 px-4 bg-slate-800/20 rounded-2xl border border-dashed border-slate-700 flex flex-col items-center">
                                        <div className="w-12 h-12 bg-slate-700/30 rounded-full flex items-center justify-center mb-4 text-slate-500">
                                            <X className="w-6 h-6" />
                                        </div>
                                        <p className="text-slate-500 text-sm font-medium">No missions accomplished yet.<br />Time to start your journey! 🐧</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
