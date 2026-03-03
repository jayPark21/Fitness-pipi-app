import { motion } from 'framer-motion';
import { Share2, CheckCircle2 } from 'lucide-react';

interface OunwanCardProps {
    day: number;
    duration: number;
    calories: number;
    pipiLevel: number;
    onClose: () => void;
}

export default function OunwanCard({ day, duration, calories, pipiLevel, onClose }: OunwanCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm"
        >
            <div className="relative w-full max-w-sm bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl overflow-hidden border border-white/20 shadow-2xl">
                {/* 카드 상단: Pipi & 뱃지 */}
                <div className="h-48 bg-gradient-to-b from-indigo-500/20 to-transparent flex flex-col items-center justify-center pt-8">
                    <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center relative backdrop-blur-md">
                        <span className="text-5xl">🐧</span>
                        <motion.div
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ repeat: Infinity, duration: 2 }}
                            className="absolute -top-2 -right-2 bg-yellow-400 text-slate-900 text-xs font-bold px-2 py-1 rounded-full shadow-lg"
                        >
                            Lv.{pipiLevel}
                        </motion.div>
                    </div>
                    <h2 className="text-white font-black text-2xl mt-4 tracking-tighter">오운완 가보자고! 🔥</h2>
                </div>

                {/* 카드 본문: 통계 */}
                <div className="p-8 space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                            <p className="text-slate-400 text-xs mb-1 uppercase tracking-widest">운동 시간</p>
                            <p className="text-white text-xl font-bold font-mono">{Math.floor(duration / 60)}m {duration % 60}s</p>
                        </div>
                        <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                            <p className="text-slate-400 text-xs mb-1 uppercase tracking-widest">소모 칼로리</p>
                            <p className="text-white text-xl font-bold font-mono">{calories} kcal</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 bg-emerald-500/10 p-4 rounded-2xl border border-emerald-500/20">
                        <CheckCircle2 className="text-emerald-400 w-6 h-6" />
                        <p className="text-emerald-100 text-sm font-medium">
                            {day}회차 루틴 레전드 찍음! 갓생 인정 🤙
                        </p>
                    </div>
                </div>

                {/* 사용자 체감 소통 문구 */}
                <div className="px-8 pb-8 flex flex-col items-center">
                    <p className="text-slate-500 text-[10px] mb-6 italic">"피피와 함께라면 당신도 이미 갓생러"</p>

                    <div className="flex gap-4 w-full">
                        <button
                            onClick={onClose}
                            className="flex-1 bg-white text-slate-900 font-bold py-4 rounded-2xl hover:bg-slate-200 transition-colors flex items-center justify-center gap-2"
                        >
                            닫기
                        </button>
                        <button className="w-14 bg-white/10 text-white rounded-2xl flex items-center justify-center hover:bg-white/20 transition-colors">
                            <Share2 size={20} />
                        </button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
