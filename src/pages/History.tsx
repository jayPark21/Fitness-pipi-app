import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useStore } from '../store/useStore';
import { ChevronLeft, Trophy, Calendar, Zap, History as HistoryIcon, Clock, Scale } from 'lucide-react';

export default function History() {
    const navigate = useNavigate();
    const { userState, penguin } = useStore();

    // Sort history by date (newest first)
    const sortedHistory = [...(userState?.history || [])].sort((a, b) =>
        new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()
    );

    const stats = [
        { label: 'Total Missions', value: sortedHistory.length, icon: HistoryIcon, color: 'text-blue-400' },
        { label: 'Current Streak', value: `${userState.streak} Days`, icon: Zap, color: 'text-amber-400' },
        { label: 'Total Calories', value: `${(userState?.history || []).reduce((acc: number, curr: any) => acc + (curr.calories || 0), 0)} kcal`, icon: Clock, color: 'text-orange-400' },
        { label: 'Current Weight', value: `${userState.weight_kg} kg`, icon: Scale, color: 'text-pink-400' },
        { label: 'Pipi Level', value: `LVL ${penguin.friendshipLevel}`, icon: Trophy, color: 'text-teal-400' }
    ];

    return (
        <div className="flex flex-col min-h-screen bg-slate-900">
            <div className="responsive-container py-8">
                {/* Header */}
                <header className="flex items-center gap-4 mb-10">
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="p-2 bg-slate-800 rounded-xl border border-slate-700 text-slate-400 hover:text-white transition-colors"
                    >
                        <ChevronLeft className="w-6 h-6" />
                    </button>
                    <div>
                        <h1 className="text-3xl font-black text-white tracking-tight">Workout Journal</h1>
                        <p className="text-slate-500 font-medium">Your legendary fitness journey with Pipi</p>
                    </div>
                    <div className="ml-auto bg-slate-800/50 p-1 px-3 rounded-2xl border border-slate-700/50 flex items-center gap-3">
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Weight</span>
                        <input
                            type="number"
                            value={userState.weight_kg}
                            onChange={(e) => useStore.getState().setUserState({ weight_kg: Number(e.target.value) })}
                            onBlur={() => useStore.getState().syncWithFirestore()}
                            className="w-16 bg-transparent text-white font-black text-lg focus:outline-none border-b-2 border-teal-500/30 focus:border-teal-500 transition-colors"
                        />
                        <span className="text-slate-500 font-black text-sm uppercase">kg</span>
                    </div>
                </header>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
                    {stats.map((stat, idx) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="bg-slate-800/50 border border-slate-700/50 p-6 rounded-3xl flex items-center gap-5 backdrop-blur-sm"
                        >
                            <div className={`p-4 rounded-2xl bg-slate-900/50 ${stat.color}`}>
                                <stat.icon className="w-8 h-8" />
                            </div>
                            <div>
                                <p className="text-slate-500 text-xs font-black uppercase tracking-widest mb-1">{stat.label}</p>
                                <p className="text-2xl font-black text-white">{stat.value}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Badges Section */}
                {userState.badges && userState.badges.length > 0 && (
                    <div className="mb-10 flex flex-wrap gap-2">
                        {userState.badges.map((badge: string) => {
                            const badgeInfo: Record<string, { label: string, icon: string, color: string }> = {
                                'streak-3': { label: 'Novice Striker', icon: '🔥', color: 'bg-orange-500/20 text-orange-400' },
                                'streak-7': { label: 'Legendary Finisher', icon: '🏆', color: 'bg-amber-500/20 text-amber-400' },
                                'pipi-friend': { label: 'True Soulmate', icon: '❤️', color: 'bg-rose-500/20 text-rose-400' }
                            };
                            const info = badgeInfo[badge] || { label: badge, icon: '🎖️', color: 'bg-slate-700/50 text-slate-300' };
                            return (
                                <motion.div
                                    key={badge}
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    className={`px-4 py-2 rounded-full border border-white/5 flex items-center gap-2 font-black text-xs uppercase tracking-tight ${info.color}`}
                                >
                                    <span>{info.icon}</span>
                                    {info.label}
                                </motion.div>
                            );
                        })}
                    </div>
                )}

                {/* Main Content */}
                <div className="bg-slate-800/30 border border-slate-800/50 rounded-[2.5rem] p-8 min-h-[500px]">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-xl font-bold text-white flex items-center gap-2">
                            <Calendar className="w-6 h-6 text-teal-400" />
                            Mission Logs
                        </h2>
                        <span className="text-sm text-slate-500 font-bold">{sortedHistory.length} Total Logs</span>
                    </div>

                    <div className="space-y-4">
                        {sortedHistory.length > 0 ? (
                            sortedHistory.map((session, idx) => (
                                <motion.div
                                    key={session.completedAt}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.05 }}
                                    className="group relative bg-slate-800/60 border border-slate-700/50 rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between hover:bg-slate-700/50 transition-all duration-300"
                                >
                                    <div className="flex items-center gap-6">
                                        <div className="relative w-16 h-16 flex items-center justify-center bg-teal-500/10 rounded-2xl text-teal-400 border border-teal-500/20 group-hover:scale-110 transition-transform">
                                            <span className="text-2xl font-black"># {session.day}</span>
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-white group-hover:text-teal-300 transition-colors">Daily Training Clear</h3>
                                            <p className="text-slate-500 text-sm flex items-center gap-2 font-medium">
                                                <Clock className="w-4 h-4" />
                                                {new Date(session.completedAt).toLocaleDateString('en-US', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="mt-4 md:mt-0 flex items-center gap-3">
                                        <div className="bg-teal-500/10 px-4 py-2 rounded-xl border border-teal-500/20">
                                            <span className="text-teal-400 text-xs font-black tracking-tighter uppercase">+{session.calories || 0} KCAL BURNED</span>
                                        </div>
                                        <div className="bg-amber-500/10 px-4 py-2 rounded-xl border border-amber-500/20 text-amber-400">
                                            <Zap className="w-4 h-4 fill-current" />
                                        </div>
                                    </div>

                                    {/* Hover Highlight line */}
                                    <div className="absolute left-0 top-1/4 bottom-1/4 w-1 bg-teal-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                                </motion.div>
                            ))
                        ) : (
                            <div className="flex flex-col items-center justify-center py-24 text-center">
                                <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mb-6 text-slate-600 border border-slate-700 border-dashed">
                                    <HistoryIcon className="w-10 h-10" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-300 mb-2">No Records Yet</h3>
                                <p className="text-slate-500 max-w-xs font-medium">Start your first mission to see your progress here! Pipi is waiting for you.</p>
                                <button
                                    onClick={() => navigate('/workout')}
                                    className="mt-8 px-8 py-3 bg-teal-500 text-slate-900 font-bold rounded-xl hover:scale-105 transition"
                                >
                                    Start First Mission
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer Message */}
                <p className="mt-12 text-center text-slate-600 text-sm font-medium">
                    Every small step makes Pipi stronger. Keep going, Boss! 🐧🔥
                </p>
            </div>
        </div>
    );
}
