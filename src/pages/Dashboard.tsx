import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../store/useStore';
import { PlayCircle, Crown, History as HistoryIcon, Calendar, X, ShoppingBag } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';
import ChallengeMap from '../components/ChallengeMap';
import { SHOP_ITEMS } from '../data/shopItems';
import NotificationBanner from '../components/NotificationBanner';
import InventoryTray from '../components/InventoryTray';

import eggImg from '../assets/pipi/egg.png';
import crackedImg from '../assets/pipi/cracked.png';
import babyImg from '../assets/pipi/baby.png';
import adultImg from '../assets/pipi/adult.png';
import adultCrownImg from '../assets/pipi/adult_crown.png';
import adultCapImg from '../assets/pipi/adult_cap.png';
import adultShadesImg from '../assets/pipi/adult_shades.png';
import bgGymImg from '../assets/pipi/bg_gym.png';
import bgBeachImg from '../assets/pipi/bg_beach.png';


export default function Dashboard() {
    const navigate = useNavigate();
    const { userState, penguin, interactWithPipi } = useStore();
    const [hearts, setHearts] = useState<{ id: number; x: number; y: number }[]>([]);
    const [speechText, setSpeechText] = useState("");
    const pipiZoneRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const messages = {
            happy: [
                "Great work, Boss! Let's hit it! 🔥",
                "I'm feeling strong today! 🐧",
                "Your streak is looking spicy! Hot! 🌶️",
                "Best partners ever! High five! ✋",
                "Ready for our next mission? 🚀"
            ],
            sad: [
                "I'm a bit low on energy... 🔋",
                "A quick workout would cheer me up! 💧",
                "Missing our routine, Boss... 😔",
                "Let's get moving! I believe in you! ✨"
            ],
            hungry: ["Is it workout time? I'm starving for gains! 🍎"],
            sleeping: ["Zzz... Dreaming of pushups... 💤"]
        };

        const currentMessages = messages[penguin.mood as keyof typeof messages] || messages.happy;
        const randomMsg = currentMessages[Math.floor(Math.random() * currentMessages.length)];
        setSpeechText(randomMsg);
    }, [penguin.mood, userState.streak]);

    const handlePet = (e: React.MouseEvent) => {
        interactWithPipi();
        const newHeart = { id: Date.now(), x: e.clientX, y: e.clientY };
        setHearts(prev => [...prev, newHeart]);
        setTimeout(() => {
            setHearts(prev => prev.filter(h => h.id !== newHeart.id));
        }, 1000);
    };

    // 배경 테마 맵핑
    const BG_THEMES: Record<string, { gradient: string; emoji: string; image?: string }> = {
        'bg-gym': { gradient: 'from-teal-100/30 via-white/10 to-emerald-200/20', emoji: '🏢', image: bgGymImg },
        'bg-beach': { gradient: 'from-sky-200/30 via-white/10 to-amber-200/20', emoji: '🏖️', image: bgBeachImg },
    };
    const equippedBg = penguin.equippedItems?.background;
    const bgTheme = equippedBg ? BG_THEMES[equippedBg] : null;

    return (
        <div className="flex flex-col min-h-screen bg-slate-900 border-x border-slate-800">
            {/* Heart Particles */}
            <AnimatePresence>
                {hearts.map(heart => (
                    <motion.div
                        key={heart.id}
                        initial={{ opacity: 1, scale: 0.5, y: heart.y }}
                        animate={{ opacity: 0, scale: 1.5, y: heart.y - 100, x: heart.x + (Math.random() * 40 - 20) }}
                        exit={{ opacity: 0 }}
                        className="fixed pointer-events-none z-[100] text-2xl"
                        style={{ left: heart.x - 12, top: heart.y - 12 }}
                    >
                        ❤️
                    </motion.div>
                ))}
            </AnimatePresence>

            {/* 알림 권한 요청 배너 */}
            <NotificationBanner />

            <div className="responsive-container py-6">


                <header className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-primary-500">
                            Day {userState.currentDay}
                        </h1>
                        <p className="text-slate-400 text-sm">21-Day Habit Challenge</p>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => navigate('/shop')}
                            className="p-2 bg-slate-800 rounded-xl border border-slate-700 text-slate-400 hover:text-white transition relative"
                        >
                            <ShoppingBag className="w-5 h-5" />
                            {penguin.xp >= 200 && (penguin.ownedItems ?? []).length === 0 && (
                                <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.6)]" />
                            )}
                        </button>
                        <button
                            onClick={() => navigate('/history')}
                            className="p-2 bg-slate-800 rounded-xl border border-slate-700 text-slate-400 hover:text-white transition"
                        >
                            <HistoryIcon className="w-5 h-5" />
                        </button>
                        <button
                            onClick={() => navigate('/subscription')}
                            className="p-2 bg-gradient-to-tr from-amber-500/20 to-yellow-400/20 rounded-xl border border-yellow-500/30 text-amber-300 hover:scale-105 transition"
                        >
                            <Crown className="w-5 h-5" />
                        </button>
                    </div>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                    {/* Left Column: Progress & Penguin */}
                    <div className="md:col-span-7 flex flex-col">
                        {/* Progress */}
                        <div className="mb-8">
                            <ChallengeMap currentDay={userState.currentDay} />
                        </div>

                        {/* 🐧 말풍선: 피피 박스 위에 독립 배치 */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8, y: 6 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            key={speechText}
                            className="flex items-start gap-2 mb-3"
                        >
                            <div className="bg-white text-slate-900 px-5 py-2.5 rounded-2xl rounded-bl-none font-bold text-sm shadow-lg border border-slate-200 relative">
                                {speechText}
                                <div className="absolute -bottom-2 left-3 w-4 h-4 bg-white rotate-45 border-b border-r border-slate-200"></div>
                            </div>
                        </motion.div>

                        {/* Penguin Pet Area */}
                        <div className={`flex-1 flex flex-col items-center justify-center p-8 rounded-3xl border relative overflow-hidden min-h-[450px] transition-all duration-700 ${bgTheme
                            ? `bg-gradient-to-br ${bgTheme.gradient} border-teal-500/30`
                            : 'bg-slate-800/20 border-slate-800/50'
                            }`}>
                            <div className="absolute inset-0 bg-primary-500 blur-[120px] rounded-full opacity-5 animate-pulse"></div>

                            {/* 프리미엄 2D 배경 이미지 */}
                            {bgTheme?.image && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    key={bgTheme.image}
                                    className="absolute inset-0 z-0 bg-cover bg-center transition-opacity duration-1000"
                                    style={{ backgroundImage: `url(${bgTheme.image})` }}
                                />
                            )}
                            {/* 배경 위 오버레이 (캐릭터가 잘 보이게 하고 무드 강조) */}
                            {bgTheme && (
                                <div className={`absolute inset-0 z-[1] opacity-30 bg-gradient-to-br ${bgTheme.gradient}`}></div>
                            )}

                            {/* 변신 효과용 섬광 오버레이 */}
                            <AnimatePresence>
                                <motion.div
                                    key={penguin.equippedItems?.hat || penguin.equippedItems?.glasses}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: [0, 0.8, 0] }}
                                    transition={{ duration: 0.5 }}
                                    className="absolute inset-0 bg-white z-30 pointer-events-none mix-blend-overlay"
                                />
                            </AnimatePresence>

                            {/* 장착된 배경 표시 (우측 하단 뱃지) */}
                            {bgTheme && (
                                <div className="absolute bottom-4 right-4 z-20 bg-black/40 backdrop-blur-sm px-3 py-1.5 rounded-xl border border-white/10 flex items-center gap-1.5">
                                    <span className="text-lg">{bgTheme.emoji}</span>
                                    <span className="text-[10px] font-black text-white/70 uppercase tracking-widest">
                                        {SHOP_ITEMS.find(i => i.id === equippedBg)?.name}
                                    </span>
                                </div>
                            )}



                            <motion.div
                                ref={pipiZoneRef}
                                onClick={handlePet}
                                className="w-64 h-64 relative cursor-pointer group z-10"
                                whileTap={{ scale: 0.9 }}
                            >
                                <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-[0_20px_40px_rgba(0,0,0,0.6)]">
                                    <motion.g
                                        animate={{
                                            y: penguin.mood === 'happy' ? [0, -15, 0] : [0, 5, 0],
                                            scale: penguin.mood === 'happy' ? [1, 1.02, 1] : [1, 0.98, 1]
                                        }}
                                        transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                                    >
                                        {/* Character Evolutionary Stage & Item Integration */}
                                        <image
                                            href={
                                                penguin.friendshipLevel >= 10
                                                    ? (penguin.equippedItems?.hat === 'crown-gold' ? adultCrownImg :
                                                        penguin.equippedItems?.hat === 'cap-red' ? adultCapImg :
                                                            penguin.equippedItems?.glasses === 'sunglasses-cool' ? adultShadesImg :
                                                                adultImg)
                                                    : (penguin.friendshipLevel >= 3 ? babyImg :
                                                        penguin.friendshipLevel === 2 ? crackedImg :
                                                            eggImg)
                                            }
                                            x="0" y="0" width="200" height="200"
                                            className="drop-shadow-xl"
                                        />

                                        {/* Mood Indicators (Zzz for sleeping) */}
                                        {penguin.mood === 'sleeping' && (
                                            <motion.g
                                                animate={{ opacity: [0, 1, 0], y: [-5, -25], x: [10, 20] }}
                                                transition={{ repeat: Infinity, duration: 2 }}
                                            >
                                                <text x="140" y="60" fontSize="24" fill="#64748b" fontWeight="black" fontStyle="italic">Zzz</text>
                                            </motion.g>
                                        )}

                                        {/* Headband / Ninja Mask (Premium Only, for Baby/Adult stages) */}
                                        {userState.hasPremium && penguin.friendshipLevel >= 3 && !penguin.equippedItems?.hat && (
                                            <g>
                                                <rect x="40" y="70" width="120" height="25" rx="4" fill="#1e1b4b" stroke="#312e81" strokeWidth="1" />
                                                <motion.path
                                                    animate={{ rotate: [0, 15, 0], x: [0, 5, 0] }}
                                                    transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                                                    d="M160 80 L180 70 L175 90 Z" fill="#312e81"
                                                />
                                                <motion.path
                                                    animate={{ opacity: [0.5, 1, 0.5] }}
                                                    transition={{ repeat: Infinity, duration: 2 }}
                                                    d="M45 80 Q100 85 155 80" stroke="#fbbf24" strokeWidth="4" fill="none"
                                                />
                                            </g>
                                        )}

                                        {/* 🥷 닌자 밴드 (SVG 직접 구현) */}
                                        {penguin.equippedItems?.hat === 'ninja-band' && (
                                            <g>
                                                <rect x="35" y="70" width="130" height="28" rx="4" fill="#111" />
                                                <rect x="80" y="72" width="40" height="24" rx="2" fill="#94a3b8" />
                                                <circle cx="95" cy="80" r="1.5" fill="#111" />
                                                <circle cx="105" cy="80" r="1.5" fill="#111" />
                                                <motion.path
                                                    animate={{ rotate: [0, 10, 0], x: [0, 2, 0] }}
                                                    transition={{ repeat: Infinity, duration: 2 }}
                                                    d="M165 80 L185 75 L180 95 Z" fill="#111"
                                                />
                                            </g>
                                        )}

                                        {/* 🧐 모노클 (SVG 직접 구현) */}
                                        {penguin.equippedItems?.glasses === 'monocle-fancy' && (
                                            <g>
                                                <circle cx="85" cy="95" r="22" fill="none" stroke="#fbbf24" strokeWidth="3" />
                                                <line x1="63" y1="95" x2="40" y2="150" stroke="#fbbf24" strokeWidth="2" strokeDasharray="4 2" />
                                                <circle cx="85" cy="95" r="18" fill="rgba(251, 191, 36, 0.1)" stroke="white" strokeWidth="0.5" />
                                            </g>
                                        )}

                                        {/* 🧢 모자 / 🕶️ 선글라스: 이미지에 포함되지 않은 경우만 이모지 표시 (SVG 구현이 없는 경우) */}
                                        {penguin.equippedItems?.hat && !['crown-gold', 'cap-red', 'ninja-band'].includes(penguin.equippedItems.hat) && (
                                            <text x="100" y="55" fontSize="52" textAnchor="middle">
                                                {SHOP_ITEMS.find(i => i.id === penguin.equippedItems?.hat)?.icon}
                                            </text>
                                        )}
                                        {/* 🕶️ 안경: 이미지에 포함되지 않은 경우만 이모지 표시 */}
                                        {penguin.equippedItems?.glasses && penguin.equippedItems.glasses !== 'sunglasses-cool' && (
                                            <text x="100" y="98" fontSize="36" textAnchor="middle">
                                                {SHOP_ITEMS.find(i => i.id === penguin.equippedItems?.glasses)?.icon}
                                            </text>
                                        )}
                                        {/* 🎒 악세서리: 피피 우측 하단 */}
                                        {penguin.equippedItems?.accessory && (
                                            <text x="165" y="165" fontSize="34" textAnchor="middle">
                                                {SHOP_ITEMS.find(i => i.id === penguin.equippedItems?.accessory)?.icon}
                                            </text>
                                        )}
                                    </motion.g>
                                </svg>
                            </motion.div>

                            <div className="mt-8 text-center z-10 w-full max-w-xs">
                                <h2 className="text-2xl font-bold font-sans flex items-center justify-center gap-3 text-white">
                                    {penguin.name} <span className="bg-teal-500 text-slate-900 px-3 py-0.5 rounded-full text-xs font-black tracking-wider uppercase">LVL {penguin.friendshipLevel}</span>
                                </h2>

                                {/* XP Bar */}
                                <div className="mt-4 px-8">
                                    <div className="flex justify-between items-end mb-1">
                                        <span className="text-[10px] font-black tracking-widest text-slate-500 uppercase">Bonding Level</span>
                                        <span className="text-[10px] font-black text-teal-400">{penguin.xp} / {penguin.nextLevelXp} XP</span>
                                    </div>
                                    <div className="w-full bg-slate-700/50 rounded-full h-2 border border-slate-700 overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${(penguin.xp / penguin.nextLevelXp) * 100}%` }}
                                            className="h-full bg-teal-400 shadow-[0_0_8px_rgba(45,212,191,0.5)]"
                                        />
                                    </div>
                                </div>

                                <p className="text-slate-400 text-sm mt-4 font-medium italic">
                                    {penguin.mood === 'happy' ? 'Pipi is pumped up and ready to rumble!' : 'He looks a bit tired. Let\'s move together!'}
                                </p>
                            </div>

                            {/* 인벤토리 트레이: 드래그해서 피피에 장착 */}
                            <InventoryTray pipiZoneRef={pipiZoneRef} />
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
                            <div className="flex justify-between items-center mb-6">
                                <div className="flex items-center gap-2">
                                    <div className="p-2 bg-slate-700/50 rounded-lg">
                                        <HistoryIcon className="w-5 h-5 text-teal-400" />
                                    </div>
                                    <h3 className="text-xl font-bold text-white tracking-tight">Mission History</h3>
                                </div>
                                <button
                                    onClick={() => navigate('/history')}
                                    className="text-xs font-black text-teal-400 uppercase tracking-widest hover:underline"
                                >
                                    View All
                                </button>
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
