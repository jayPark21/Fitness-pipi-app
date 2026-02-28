import { motion } from 'framer-motion';
import { Check, Lock, Star, Trophy } from 'lucide-react';

interface ChallengeMapProps {
    currentDay: number;
}

export default function ChallengeMap({ currentDay }: ChallengeMapProps) {
    const days = Array.from({ length: 21 }, (_, i) => i + 1);

    const getStatus = (day: number) => {
        if (day < currentDay) return 'completed';
        if (day === currentDay) return 'current';
        return 'locked';
    };

    return (
        <div className="w-full bg-slate-800/40 rounded-[2.5rem] p-8 border border-slate-700/50 backdrop-blur-md">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h3 className="text-2xl font-black text-white tracking-tight flex items-center gap-3">
                        <Star className="w-6 h-6 text-yellow-400 fill-yellow-400" />
                        Path of Glory
                    </h3>
                    <p className="text-slate-500 text-sm font-bold uppercase tracking-widest mt-1">21-Day Habit Transformation</p>
                </div>
                <div className="bg-slate-900/50 px-4 py-2 rounded-2xl border border-slate-700">
                    <span className="text-teal-400 font-black text-xl">{currentDay}</span>
                    <span className="text-slate-600 font-bold ml-1">/ 21</span>
                </div>
            </div>

            <div className="grid grid-cols-7 gap-3 sm:gap-4">
                {days.map((day) => {
                    const status = getStatus(day);
                    const isMilestone = day % 7 === 0;

                    return (
                        <motion.div
                            key={day}
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: day * 0.05 }}
                            className="relative group"
                        >
                            <div
                                className={`
                                    aspect-square rounded-2xl flex flex-col items-center justify-center transition-all duration-300 border-2
                                    ${status === 'completed'
                                        ? 'bg-teal-500/20 border-teal-500 text-teal-400 shadow-[0_0_20px_rgba(20,184,166,0.3)]'
                                        : status === 'current'
                                            ? 'bg-amber-500/20 border-amber-500 text-amber-400 animate-pulse'
                                            : 'bg-slate-900/40 border-slate-700/50 text-slate-600 opacity-60'}
                                    ${isMilestone && status !== 'completed' ? 'border-dashed' : ''}
                                `}
                            >
                                {status === 'completed' ? (
                                    <Check className="w-5 h-5 sm:w-6 sm:h-6 stroke-[3px]" />
                                ) : status === 'current' ? (
                                    <span className="text-lg sm:text-xl font-black">{day}</span>
                                ) : isMilestone ? (
                                    <Trophy className="w-4 h-4 sm:w-5 sm:h-5" />
                                ) : (
                                    <Lock className="w-4 h-4 sm:w-5 sm:h-5 opacity-40" />
                                )}

                                {isMilestone && (
                                    <div className={`absolute -top-1 -right-1 w-3 h-3 rounded-full ${status === 'completed' ? 'bg-teal-400' : 'bg-slate-700'}`} />
                                )}
                            </div>

                            {/* Hover tooltip for day number on locked/completed */}
                            <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] font-black px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap border border-slate-700">
                                DAY {day}
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            {/* Progress line indicator (Subtle) */}
            <div className="mt-8 flex items-center gap-2">
                <div className="flex-1 h-2 bg-slate-900 rounded-full overflow-hidden p-[2px]">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min((currentDay / 21) * 100, 100)}%` }}
                        className="h-full bg-gradient-to-r from-teal-500 to-emerald-400 rounded-full shadow-[0_0_10px_rgba(20,184,166,0.5)]"
                    />
                </div>
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-tighter">
                    {Math.round((currentDay / 21) * 100)}% JOURNEY COMPLETE
                </span>
            </div>
        </div>
    );
}
