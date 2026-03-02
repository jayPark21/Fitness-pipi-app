import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../store/useStore';
import { PlayCircle, Crown, History as HistoryIcon, Calendar, X, ShoppingBag, RotateCcw } from 'lucide-react';
import { useEffect, useState, useRef, useCallback } from 'react';
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
    const { userState, penguin, interactWithPipi, resetStore, checkAndUpdateMood, clearLevelUp } = useStore();
    const [hearts, setHearts] = useState<{ id: number; x: number; y: number; isSparkle?: boolean }[]>([]);
    const [speechText, setSpeechText] = useState("");
    const [showResetConfirm, setShowResetConfirm] = useState(false);
    // 🎉 레벨업 충하 시스템
    const [confetti, setConfetti] = useState<{ id: number; x: number; y: number; color: string; angle: number; size: number }[]>([]);
    const [showLevelUp, setShowLevelUp] = useState(false);
    const [levelUpNum, setLevelUpNum] = useState(1);
    // 💬 말풍선 fixed 위치 계산용
    const [bubblePos, setBubblePos] = useState<{ top: number; left: number; width: number } | null>(null);
    const pipiZoneRef = useRef<HTMLDivElement>(null);

    // 피피 박스 위치 추적 → 말풍선 fixed 배치 (left 기준 — 잘림 없음!)
    const updateBubblePos = useCallback(() => {
        const rect = pipiZoneRef.current?.getBoundingClientRect();
        if (rect) {
            // 박스 너비의 60~65% 사용, 최소 180px, 최대 240px
            const bubbleWidth = Math.min(240, Math.max(180, rect.width * 0.62));
            // 버블을 박스 오른쪽 끝에 붙이되, 화면 왼쪽 8px 이상 보장
            const leftPos = Math.max(8, rect.right - bubbleWidth - 8);
            setBubblePos({
                top: rect.top + 16,
                left: leftPos,
                width: bubbleWidth,
            });
        }
    }, []);

    useEffect(() => {
        // DOM 마운트 후 즉시 + 레이아웃 변화 시 계속 추적
        const timer = setTimeout(updateBubblePos, 100); // 렌더링 완료 대기
        window.addEventListener('resize', updateBubblePos);
        window.addEventListener('scroll', updateBubblePos, true);
        return () => {
            clearTimeout(timer);
            window.removeEventListener('resize', updateBubblePos);
            window.removeEventListener('scroll', updateBubblePos, true);
        };
    }, [updateBubblePos]);

    // 피피 기분 자동 변화 트리거!
    // 마운트 시 즉시 + 5분마다 주기적으로 모드 체크
    useEffect(() => {
        // 앙 열면 즉시 체크 (lastInteractionTime 정확히 반영)
        checkAndUpdateMood();

        // 5분마다 업데이트 (앙이 열려 있는 동안 실시간 변화)
        const interval = setInterval(checkAndUpdateMood, 5 * 60 * 1000);
        return () => clearInterval(interval);
    }, [checkAndUpdateMood]);

    // 🎉 레벨업 감지 → 폭죽 + 오버레이 트리거!
    useEffect(() => {
        if (!penguin.justLeveledUp) return;

        const COLORS = ['#FF6B6B', '#FFD93D', '#6BCB77', '#4D96FF', '#FF6FC8', '#C77DFF', '#FF9A3C', '#00F5D4'];
        const cx = window.innerWidth / 2;
        const cy = window.innerHeight / 2;

        // 60개 콘페튰 파티클 생성
        const particles = Array.from({ length: 60 }, (_, i) => ({
            id: Date.now() + i,
            x: cx,
            y: cy,
            color: COLORS[Math.floor(Math.random() * COLORS.length)],
            angle: (360 / 60) * i + Math.random() * 10,
            size: 6 + Math.random() * 8,
        }));
        setConfetti(particles);
        setLevelUpNum(penguin.friendshipLevel);
        setShowLevelUp(true);

        // 3초 후 정리
        const timer = setTimeout(() => {
            setConfetti([]);
            setShowLevelUp(false);
            clearLevelUp();
        }, 3000);

        return () => clearTimeout(timer);
    }, [penguin.justLeveledUp, penguin.friendshipLevel, clearLevelUp]);

    useEffect(() => {
        const isEgg = penguin.friendshipLevel < 3;
        const hour = new Date().getHours();

        const messages = {
            egg: [
                "...🥚",
                "(꿈틀꿈틀..? 👀)",
                "뭔가 느껴지는데..? ✨",
                "으음... 조금만 더... 💤",
                "나 지금 자라는 중임 🌱",
            ],
            happy: {
                morning: [
                    "굿모닝~ 오늘도 갓생 각이죠? ☀️",
                    "아침부터 피피 보러 왔어? 완전 최애잖아 🥹",
                    "오늘 루틴 같이 부숴볼까요? 💥",
                    "기상 완료~ 우리 오늘도 레전드 찍자 🔥",
                ],
                day: [
                    "지금 딱 운동각인데..? 💪",
                    "피피 쓰다듬어줘서 기분이 찐이야 🫠",
                    "오늘 운동 했어? 안 했음 당장 가야지~ 🏃",
                    "같이하면 존버 가능해! 믿지? 🤝",
                    "피피가 응원하고 있었잖아~ 몰랐지? 👀",
                    "요즘 눈에 띄게 달라졌는데..? 실화임? ✨",
                ],
                evening: [
                    "오늘 하루도 수고했어~ 진심으로 🫶",
                    "퇴근각? 오늘 루틴은 했지? 👀",
                    "저녁엔 피피랑 마무리 스트레칭 어때 🌙",
                    "내일도 같이 갓생 살자~ 약속함 🤙",
                ],
            },
            sad: [
                "나 요즘 좀 외로웠는데... 😔",
                "보고 싶었잖아... 진짜로... 💧",
                "혼자 있으면 뭔가 텅 빈 느낌... 🫥",
                "나 삐짐 주의보 발령 중 🚨",
            ],
            hungry: [
                "나 운동 연료 부족한 것 같아... 🫤",
                "지금 당장 운동각 아님? 몸이 기억하잖아 💀",
                "에너지 바닥났어~ 충전 필요함 🔋",
            ],
            sleeping: [
                "Zzz... 내일 같이 달리는 꿈 꾸는 중... 💤",
                "쉿~ 피피 성장 타임 중이야 🌙",
                "(벌크업 중... 방해 금지 🛑)",
            ]
        };

        if (isEgg) {
            setSpeechText(messages.egg[Math.floor(Math.random() * messages.egg.length)]);
            return;
        }

        let timeKey: 'morning' | 'day' | 'evening' = 'day';
        if (hour >= 5 && hour < 12) timeKey = 'morning';
        else if (hour >= 18 || hour < 5) timeKey = 'evening';

        const getMoodMsg = () => {
            if (penguin.mood === 'happy') {
                const list = messages.happy[timeKey];
                return list[Math.floor(Math.random() * list.length)];
            }
            const list = messages[penguin.mood as keyof typeof messages] as string[];
            return list?.[Math.floor(Math.random() * (list?.length || 1))] || "오늘도 갓생 고고~ 🔥";
        }

        setSpeechText(getMoodMsg());
    }, [penguin.mood, userState.streak, penguin.friendshipLevel]);

    const handlePet = (e: React.MouseEvent | React.TouchEvent) => {
        const today = new Date().toDateString();
        const workoutsToday = (penguin.lastTouchDate === today) ? (penguin.workoutsCompletedToday ?? 0) : 0;
        const maxTouchXp = 25 + (workoutsToday * 50);
        const isLimitReached = (penguin.dailyTouchXp ?? 0) >= maxTouchXp && penguin.lastTouchDate === today;
        const isEgg = penguin.friendshipLevel < 3;

        interactWithPipi();

        const petMessages = isEgg
            ? ["(두근두근... 🥚💓)", "(뭔가 따뜻한 게..? 👀)", "✨", "(꿈틀꿈틀~)", "으음... 🌱"]
            : [
                "야 쓰다듬지 마 부끄럽잖아 (부끄) 🫣",
                "헤헤 간지럽잖아~ 🐧",
                "터치 한 번에 행복 충전됨 🔋✨",
                "이거 실화임? 너무 좋은 거 아니야? 🫠",
                "야 나 심장 터지겠다 진짜 💓",
                "쓰다듬어줄 때 피피 찐행복 상태임 😊",
                "또 와줬어? 최애 인정~ 🥹",
            ];

        if (isLimitReached) {
            setSpeechText("운동하고 쓰다듬어줘~ 그게 찐이잖아 🏃💨");
        } else {
            const randomPetMsg = petMessages[Math.floor(Math.random() * petMessages.length)];
            setSpeechText(randomPetMsg);
        }

        // 하트/반짝이 효과 로직
        const clientX = 'clientX' in e ? e.clientX : e.touches[0].clientX;
        const clientY = 'clientY' in e ? e.clientY : e.touches[0].clientY;

        if (isLimitReached) {
            const newSparkle = { id: Date.now(), x: clientX, y: clientY };
            setHearts(prev => [...prev, { ...newSparkle, isSparkle: true }]);
            setTimeout(() => setHearts(prev => prev.filter(h => h.id !== newSparkle.id)), 1000);
        } else {
            const newHeart = { id: Date.now(), x: clientX, y: clientY };
            setHearts(prev => [...prev, newHeart]);
            setTimeout(() => setHearts(prev => prev.filter(h => h.id !== newHeart.id)), 1000);
        }
    };

    // 배경 테마 맵핑
    const BG_THEMES: Record<string, { gradient: string; emoji: string; image?: string }> = {
        'bg-gym': { gradient: 'from-teal-100/30 via-white/10 to-emerald-200/20', emoji: '🏢', image: bgGymImg },
        'bg-beach': { gradient: 'from-sky-200/30 via-white/10 to-amber-200/20', emoji: '🏖️', image: bgBeachImg },
    };
    const equippedBg = penguin.equippedItems?.background;
    const isAdult = penguin.friendshipLevel >= 10;
    const isEgg = penguin.friendshipLevel < 3;
    const bgTheme = (equippedBg && isAdult) ? BG_THEMES[equippedBg] : null;

    return (
        <div className="flex flex-col min-h-screen bg-slate-900 border-x border-slate-800">
            {/* Heart Particles / Sparkles */}
            <AnimatePresence>
                {hearts.map(heart => (
                    <motion.div
                        key={heart.id}
                        initial={{ opacity: 1, scale: 0.5, y: heart.y }}
                        animate={{ opacity: 0, scale: 1.5, y: heart.y - 120, x: heart.x + (Math.random() * 60 - 30) }}
                        exit={{ opacity: 0 }}
                        className="fixed pointer-events-none z-[100] text-2xl"
                        style={{ left: heart.x - 12, top: heart.y - 12 }}
                    >
                        {heart.isSparkle ? '✨' : '❤️'}
                    </motion.div>
                ))}
            </AnimatePresence>

            {/* 🎉 콘페튰 파티클 - 레벨업 폭죽! */}
            <AnimatePresence>
                {confetti.map(p => {
                    const rad = (p.angle * Math.PI) / 180;
                    const dist = 200 + Math.random() * 200;
                    return (
                        <motion.div
                            key={p.id}
                            initial={{ x: p.x, y: p.y, opacity: 1, scale: 1, rotate: 0 }}
                            animate={{
                                x: p.x + Math.cos(rad) * dist,
                                y: p.y + Math.sin(rad) * dist,
                                opacity: 0,
                                scale: 0.3,
                                rotate: Math.random() * 720 - 360,
                            }}
                            transition={{ duration: 1.5 + Math.random() * 0.8, ease: 'easeOut' }}
                            className="fixed pointer-events-none z-[300] rounded-sm"
                            style={{
                                width: p.size,
                                height: p.size * 0.5,
                                backgroundColor: p.color,
                                top: 0,
                                left: 0,
                                transformOrigin: 'center',
                            }}
                        />
                    );
                })}
            </AnimatePresence>

            {/* 🎉 레벨업 오버레이 */}
            <AnimatePresence>
                {showLevelUp && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.5, y: 40 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: -20 }}
                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                        className="fixed inset-0 z-[290] flex items-center justify-center pointer-events-none"
                    >
                        <div className="flex flex-col items-center gap-2">
                            <motion.p
                                animate={{ rotate: [-3, 3, -3, 3, 0] }}
                                transition={{ duration: 0.5, repeat: 2 }}
                                className="text-6xl"
                            >🎉</motion.p>
                            <div className="bg-gradient-to-br from-yellow-400 via-orange-400 to-pink-500 px-8 py-4 rounded-3xl shadow-2xl text-center">
                                <p className="text-white/80 text-sm font-bold uppercase tracking-widest mb-1">LEVEL UP!</p>
                                <p className="text-white font-black text-6xl leading-none">{levelUpNum}</p>
                                <p className="text-white/80 text-xs mt-1 font-bold">피피가 성장했어! 🐧✨</p>
                            </div>
                            <motion.p
                                animate={{ rotate: [3, -3, 3, -3, 0] }}
                                transition={{ duration: 0.5, repeat: 2, delay: 0.1 }}
                                className="text-6xl"
                            >🎊</motion.p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence mode="wait">
                {speechText && (
                    <motion.div
                        key={speechText}
                        initial={{ opacity: 0, scale: 0.85, y: -8 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.85, y: -8 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 28 }}
                        className="fixed z-[200] pointer-events-none"
                        style={
                            bubblePos
                                ? {
                                    top: bubblePos.top,
                                    left: bubblePos.left,
                                    width: bubblePos.width,
                                }
                                : {
                                    // fallback: 하단 중앙 플로팅 배너
                                    bottom: 100,
                                    left: '50%',
                                    transform: 'translateX(-50%)',
                                    width: '260px',
                                }
                        }
                    >
                        <div className="relative bg-white/95 backdrop-blur-sm text-slate-900 px-4 py-2.5 rounded-2xl rounded-bl-none font-bold text-xs shadow-xl border border-white/80 leading-snug break-keep">
                            {speechText}
                            {/* 말풍선 꼬리 — 좌하단 (피피 방향!) */}
                            {bubblePos && (
                                <div className="absolute -bottom-2 left-2 w-4 h-4 bg-white rotate-45 border-b border-l border-white/80" />
                            )}
                        </div>
                    </motion.div>
                )}
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
                        {/* 🔴 데이터 초기화 버튼 */}
                        <button
                            onClick={() => setShowResetConfirm(true)}
                            className="p-2 bg-red-500/10 rounded-xl border border-red-500/20 text-red-400 hover:bg-red-500/20 transition"
                            title="데이터 초기화 (테스트용)"
                        >
                            <RotateCcw className="w-5 h-5" />
                        </button>
                        <button
                            onClick={() => navigate('/subscription')}
                            className="p-2 bg-gradient-to-tr from-amber-500/20 to-yellow-400/20 rounded-xl border border-yellow-500/30 text-amber-300 hover:scale-105 transition"
                        >
                            <Crown className="w-5 h-5" />
                        </button>
                    </div>
                </header>

                {/* 🔴 초기화 확인 다이얼로그 */}
                <AnimatePresence>
                    {showResetConfirm && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: -10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: -10 }}
                            className="mb-4 bg-red-900/30 border border-red-500/30 rounded-2xl p-4 flex items-center justify-between gap-4"
                        >
                            <div>
                                <p className="text-red-300 font-bold text-sm">⚠️ 모든 데이터를 초기화할까요?</p>
                                <p className="text-red-400/60 text-xs mt-0.5">피피, XP, 히스토리, 아이템 전부 리셋!</p>
                            </div>
                            <div className="flex gap-2 flex-shrink-0">
                                <button
                                    onClick={() => {
                                        resetStore();
                                        setShowResetConfirm(false);
                                    }}
                                    className="px-3 py-1.5 bg-red-500 text-white text-xs font-black rounded-lg hover:bg-red-600 transition"
                                >
                                    초기화
                                </button>
                                <button
                                    onClick={() => setShowResetConfirm(false)}
                                    className="px-3 py-1.5 bg-slate-700 text-slate-300 text-xs font-bold rounded-lg hover:bg-slate-600 transition"
                                >
                                    취소
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                    {/* Left Column: Pipi First (시각적 후킹), then Progress Map */}
                    <div className="md:col-span-7 flex flex-col">

                        {/* Penguin Pet Area — 제일 위로 이동 (시각적 후킹 강조!) */}
                        <div className={`flex-1 flex flex-col items-center justify-center p-8 rounded-3xl border relative overflow-hidden min-h-[450px] transition-all duration-700 mb-8 ${bgTheme
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

                            {/* 💬 말풍선: fixed 레이어 (모바일에서도 잘림 없이!) */}
                            {/* 실제 말풍선은 아래 fixed div로 렌더링됨 */}
                            <motion.div
                                ref={pipiZoneRef}
                                onPointerDown={handlePet}
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
                                        {userState.hasPremium && penguin.friendshipLevel >= 10 && !penguin.equippedItems?.hat && (
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

                                        {/* 🥷 닌자 밴드 (SVG 직접 구현) - Adult Only */}
                                        {isAdult && penguin.equippedItems?.hat === 'ninja-band' && (
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

                                        {/* 🧐 모노클 (SVG 직접 구현) - Adult Only (Lv.10+) */}
                                        {isAdult && penguin.equippedItems?.glasses === 'monocle-fancy' && (
                                            <g>
                                                <circle cx="85" cy="95" r="22" fill="none" stroke="#fbbf24" strokeWidth="3" />
                                                <line x1="63" y1="95" x2="40" y2="150" stroke="#fbbf24" strokeWidth="2" strokeDasharray="4 2" />
                                                <circle cx="85" cy="95" r="18" fill="rgba(251, 191, 36, 0.1)" stroke="white" strokeWidth="0.5" />
                                            </g>
                                        )}

                                        {/* 🧢 모자 / 🕶️ 선글라스: 이미지에 포함되지 않은 경우만 이모지 표시 (SVG 구현이 없는 경우) */}
                                        {!isEgg && penguin.equippedItems?.hat && (() => {
                                            const item = SHOP_ITEMS.find(i => i.id === penguin.equippedItems?.hat);
                                            const isPremium = (item?.requiredLevel ?? 0) >= 10;
                                            if (!isPremium) {
                                                return (
                                                    <text x="100" y="55" fontSize="52" textAnchor="middle">
                                                        {item?.icon}
                                                    </text>
                                                );
                                            }
                                            return null;
                                        })()}

                                        {/* 🕶️ 안경: 이미지에 포함되지 않은 경우만 이모지 표시 */}
                                        {!isEgg && penguin.equippedItems?.glasses && (() => {
                                            const item = SHOP_ITEMS.find(i => i.id === penguin.equippedItems?.glasses);
                                            const isPremium = (item?.requiredLevel ?? 0) >= 10;
                                            if (!isPremium) {
                                                return (
                                                    <text x="100" y="98" fontSize="36" textAnchor="middle">
                                                        {item?.icon}
                                                    </text>
                                                );
                                            }
                                            return null;
                                        })()}

                                        {/* 🎒 악세서리: 피피 우측 하단 */}
                                        {!isEgg && penguin.equippedItems?.accessory && (
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

                                    {/* Daily Touch XP Limit Bar (Dynamic) */}
                                    <div className="mt-3 bg-slate-800/40 p-2.5 rounded-xl border border-white/5">
                                        <div className="flex justify-between items-center mb-1.5 px-0.5">
                                            <div className="flex items-center gap-1.5">
                                                <span className="text-[8px] font-black tracking-widest text-slate-500 uppercase">Pet Benefit</span>
                                                {penguin.workoutsCompletedToday > 0 && (
                                                    <span className="text-[7px] bg-amber-500/20 text-amber-400 px-1 rounded-sm font-bold border border-amber-500/10">BONUS +{(penguin.workoutsCompletedToday * 10)} pets</span>
                                                )}
                                            </div>
                                            <span className="text-[9px] font-black text-amber-400">{(penguin.dailyTouchXp ?? 0)} / {25 + (penguin.workoutsCompletedToday * 50)} XP</span>
                                        </div>
                                        <div className="w-full bg-slate-700/30 rounded-full h-1 overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${Math.min((penguin.dailyTouchXp ?? 0) / (25 + (penguin.workoutsCompletedToday * 50)) * 100, 100)}%` }}
                                                className="h-full bg-amber-400 shadow-[0_0_5px_rgba(251,191,36,0.3)]"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <p className="text-slate-400 text-sm mt-4 font-medium italic">
                                    {penguin.mood === 'happy' ? 'Pipi is pumped up and ready to rumble!' : 'He looks a bit tired. Let\'s move together!'}
                                </p>
                            </div>

                            {/* 인벤토리 트레이: 드래그해서 피피에 장착 */}
                            <InventoryTray pipiZoneRef={pipiZoneRef} />
                        </div>

                        {/* Progress Map — 피피 아래 배치 */}
                        <div className="mt-0">
                            <ChallengeMap currentDay={userState.currentDay} />
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
