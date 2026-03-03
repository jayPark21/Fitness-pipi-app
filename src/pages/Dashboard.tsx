import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../store/useStore';
import { PlayCircle, Crown, History as HistoryIcon, Calendar, X, ShoppingBag, RotateCcw } from 'lucide-react';
import { useEffect, useState, useRef, useCallback } from 'react';
import ChallengeMap from '../components/ChallengeMap';
import { SHOP_ITEMS } from '../data/shopItems';
import NotificationBanner from '../components/NotificationBanner';
import InventoryTray from '../components/InventoryTray';
import OunwanCard from '../components/OunwanCard';

import eggImg from '../assets/pipi/egg.png';
import crackedImg from '../assets/pipi/cracked.png';
import babyImg from '../assets/pipi/baby.png';
import teenImg from '../assets/pipi/teen.png';
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
    const [showOunwanCard, setShowOunwanCard] = useState(false);
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

        // 사운드 재생
        import('../services/audioService').then(({ audioService }) => audioService.playLevelUp());

        const COLORS = ['#FF6B6B', '#FFD93D', '#6BCB77', '#4D96FF', '#FF6FC8', '#C77DFF', '#FF9A3C', '#00F5D4'];
        const SHAPES = ['circle', 'square', 'star'];
        const cx = window.innerWidth / 2;
        const cy = window.innerHeight / 2;

        // 80개 더 풍성한 파티클 생성
        const particles = Array.from({ length: 80 }, (_, i) => ({
            id: Date.now() + i,
            x: cx,
            y: cy,
            color: COLORS[Math.floor(Math.random() * COLORS.length)],
            angle: (360 / 80) * i + Math.random() * 20,
            size: 8 + Math.random() * 12,
            type: SHAPES[Math.floor(Math.random() * SHAPES.length)],
            rotation: Math.random() * 360,
        }));

        setConfetti(particles);
        setLevelUpNum(penguin.friendshipLevel);
        setShowLevelUp(true);

        // 3.5초 후 정리 (조금 더 길게!)
        const timer = setTimeout(() => {
            setConfetti([]);
            setShowLevelUp(false);
            clearLevelUp();
        }, 3500);

        return () => clearTimeout(timer);
    }, [penguin.justLeveledUp, penguin.friendshipLevel, clearLevelUp]);

    useEffect(() => {
        const level = penguin.friendshipLevel;
        const isEgg = level <= 2;
        const isBaby = level >= 3 && level <= 5;
        const isTeen = level >= 6 && level <= 9;
        const hour = new Date().getHours();

        const messages = {
            egg: [
                "...🥚 (숨참고 갓생 다이브?)",
                "(꿈틀꿈틀.. 폼 미쳤다 👀)",
                "뭔가 핫한 기운이 느껴지는데..? ✨",
                "으음... 부화하면 바로 오운완 각 💤",
                "성장 중임! 방해하면 너 T야? 🌱",
            ],
            baby: [
                "아기 피피 🐥.. 아직은 좀 작나?",
                "빨리 커서 힙한 모자 쓰고 싶다 🧢",
                "삐약! 운동 도와줄게! 🐥",
                "아직 아기라고 무시 ㄴㄴ.. 폼 미쳤음 🐥",
            ],
            teen: [
                "청소년 피피 🐧.. 이제 좀 폼 나지?",
                "슬슬 근성장이 느껴지는 중 💪",
                "갓생러의 기운이 느껴진다 🔥",
                "질풍노도의 운동 타임! 가보자고 🐧",
            ],
            happy: {
                morning: [
                    "오운완 가보자고! 아침부터 기분 째짐 ☀️",
                    "아침부터 피피 보러 왔어? 역시 내 최애 🥹",
                    "오늘 루틴 부숴야지? 갓생 가즈아-! 💥",
                    "기상 완료~ 우리 오늘도 레전드 찍자 🔥",
                ],
                day: [
                    "지금 딱 운동각인데? 너 몸이 근질근질하지? 💪",
                    "피피 쓰다듬어주는 너.. 좀 폼 미쳤다 🫠",
                    "오늘 운동 도파민 터트려볼까? 🏃",
                    "같이하면 존버 성공! 믿지? 🤝",
                    "피피가 응원하고 있었잖아~ 완전 럭키비키잔앙 👀",
                    "요즘 눈에 띄게 달라졌는데? 이거 실화임? ✨",
                ],
                evening: [
                    "오늘 하루도 레전드 찍었네! 수고했어 🫶",
                    "퇴근하고 루틴까지? 너 진짜 갓생러 인정 👀",
                    "저녁엔 피피랑 마무리 스트레칭으로 폼 잡자 🌙",
                    "내일도 같이 갓생 살자~ 약속함 🤙",
                    "오늘 고생한 너.. 오늘 밤은 꿀잠각 😴",
                ],
            },
            sad: [
                "나만 빼고 갓생 사는 거야? 서운해 진짜... 😔",
                "보고 싶어서 눈물 났잖아... 실화냐고... 💧",
                "혼자 있으면 멘탈 바스스... 🫥",
                "삐삐삐- 피피 삐짐 주의보 발령 🚨",
            ],
            hungry: [
                "나 지금 운동 도파민 부족함... 🫤",
                "지금 당장 운동각 아님? 몸이 먼저 기억하잖아 💀",
                "에너지 바닥났어~ 갓생 충전 시급🔋",
                "배고프니까 현기증 나.. 운동 연료 넣어줘 🍔",
            ],
            sleeping: [
                "Zzz... 내일 같이 달리는 꿈 꾸는 중... 💤",
                "쉿- 피피 갓생 성장 타임 중이야 🌙",
                "(벌크업 중... 방해하면 너 T야? 🛑)",
                "Zzz.. 내일은 더 핫한 폼으로 만나 💤",
            ]
        };

        if (isEgg) {
            setSpeechText(messages.egg[Math.floor(Math.random() * messages.egg.length)]);
            return;
        }

        if (isBaby) {
            setSpeechText(messages.baby[Math.floor(Math.random() * messages.baby.length)]);
            return;
        }

        if (isTeen) {
            setSpeechText(messages.teen[Math.floor(Math.random() * messages.teen.length)]);
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
            ? ["(두근두근... 🥚💓)", "(이 집 터치 맛집이네? 👀)", "✨ (핫하다 핫해)", "(꿈틀꿈틀~ 갓생의 기운)", "으음... 🌱"]
            : [
                "야 쓰다듬지 마 부끄럽잖아 (너 T야? 🫣)",
                "헤헤 간지러버~ 피피 심쿵함 🐧💓",
                "터치 한 번에 행복 게이지 풀충 🔋✨",
                "이거 실화임? 너무 힐링되잖아 🫠",
                "야 나 심장 터지겠다.. 폼 미쳤네 💓",
                "쓰다듬어줄 때 피피 찐행복 모드 뿜뿜 😊",
                "또 와줬어? 역시 내 최애 집사 인정~ 🥹",
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
    const bgTheme = (equippedBg && isAdult) ? BG_THEMES[equippedBg] : null;

    // 🎉 오운완 카드 자동 트리거 (최근 1분 이내 완료 시)
    useEffect(() => {
        const lastSession = userState.history[userState.history.length - 1];
        if (lastSession) {
            const completedAt = new Date(lastSession.completedAt).getTime();
            const now = Date.now();
            if (now - completedAt < 60000) { // 1분 이내
                setShowOunwanCard(true);
            }
        }
    }, [userState.history]);

    return (
        <div className="flex flex-col min-h-screen bg-slate-900 border-x border-slate-800">
            {/* Ounwan (Workout Complete) Card */}
            <AnimatePresence>
                {showOunwanCard && userState.history.length > 0 && (
                    <OunwanCard
                        day={userState.history[userState.history.length - 1].day}
                        duration={userState.history[userState.history.length - 1].duration}
                        calories={userState.history[userState.history.length - 1].calories}
                        pipiLevel={penguin.friendshipLevel}
                        onClose={() => setShowOunwanCard(false)}
                    />
                )}
            </AnimatePresence>

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
                {confetti.map((p: any) => {
                    const rad = (p.angle * Math.PI) / 180;
                    const dist = 300 + Math.random() * 300;
                    return (
                        <motion.div
                            key={p.id}
                            initial={{ x: p.x, y: p.y, opacity: 1, scale: 1, rotate: p.rotation }}
                            animate={{
                                x: p.x + Math.cos(rad) * dist,
                                y: p.y + Math.sin(rad) * dist,
                                opacity: 0,
                                scale: 0.2,
                                rotate: p.rotation + (Math.random() * 720 - 360),
                            }}
                            transition={{ duration: 1.8 + Math.random() * 1.2, ease: [0.23, 1, 0.32, 1] }}
                            className="fixed pointer-events-none z-[300]"
                            style={{
                                width: p.size,
                                height: p.type === 'square' ? p.size : p.type === 'circle' ? p.size : p.size * 1.5,
                                backgroundColor: p.color,
                                borderRadius: p.type === 'circle' ? '50%' : p.type === 'star' ? '2px' : '0px',
                                top: 0,
                                left: 0,
                                clipPath: p.type === 'star' ? 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)' : 'none',
                                transformOrigin: 'center',
                            }}
                        />
                    );
                })}
            </AnimatePresence>

            {/* 💥 충격파 효과 (Shockwave) */}
            <AnimatePresence>
                {showLevelUp && (
                    <motion.div
                        initial={{ opacity: 0.8, scale: 0, border: '20px solid rgba(255,255,255,0.4)' }}
                        animate={{ opacity: 0, scale: 4, border: '0px solid rgba(255,255,255,0)' }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 rounded-full z-[295] pointer-events-none"
                    />
                )}
            </AnimatePresence>

            {/* 🎉 레벨업 오버레이 */}
            <AnimatePresence>
                {showLevelUp && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.5, y: 40 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: -20 }}
                        transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                        className="fixed inset-0 z-[290] flex items-center justify-center pointer-events-none"
                    >
                        <div className="flex flex-col items-center gap-2">
                            <motion.p
                                animate={{ rotate: [-10, 10, -10, 10, 0], scale: [1, 1.2, 1] }}
                                transition={{ duration: 0.5, repeat: 2 }}
                                className="text-7xl drop-shadow-[0_0_15px_rgba(255,217,61,0.6)]"
                            >🎉</motion.p>
                            <div className="bg-gradient-to-br from-yellow-400 via-orange-400 to-pink-500 p-[2px] rounded-3xl shadow-[0_20px_50px_rgba(245,158,11,0.4)]">
                                <div className="bg-slate-900/90 backdrop-blur-md px-8 py-5 rounded-[22px] text-center border border-white/10">
                                    <p className="text-yellow-400 text-xs font-black uppercase tracking-[0.2em] mb-1">Pipi Success!</p>
                                    <h3 className="text-white font-black text-7xl leading-none tracking-tighter italic">
                                        LV.{levelUpNum}
                                    </h3>
                                    <div className="h-0.5 w-12 bg-gradient-to-r from-transparent via-yellow-400 to-transparent mx-auto my-3" />
                                    <p className="text-white/70 text-[10px] font-bold uppercase tracking-widest">Level Reached</p>
                                </div>
                            </div>
                            <motion.p
                                animate={{ rotate: [10, -10, 10, -10, 0], scale: [1, 1.2, 1] }}
                                transition={{ duration: 0.5, repeat: 2, delay: 0.1 }}
                                className="text-7xl drop-shadow-[0_0_15px_rgba(255,111,200,0.6)]"
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
                                        animate={showLevelUp ? {
                                            y: [0, -40, 0, -20, 0],
                                            scale: [1, 1.15, 0.95, 1.1, 1],
                                            rotate: [0, 5, -5, 5, 0]
                                        } : {
                                            y: penguin.mood === 'happy' ? [0, -15, 0] : [0, 5, 0],
                                            scale: penguin.mood === 'happy' ? [1, 1.02, 1] : [1, 0.98, 1]
                                        }}
                                        transition={showLevelUp ? { duration: 1, ease: "easeOut" } : { repeat: Infinity, duration: 2, ease: "easeInOut" }}
                                    >
                                        {/* Character Evolutionary Stage & Item Integration */}
                                        <image
                                            href={
                                                penguin.friendshipLevel >= 10
                                                    ? (penguin.equippedItems?.hat === 'crown-gold' ? adultCrownImg :
                                                        penguin.equippedItems?.hat === 'cap-red' ? adultCapImg :
                                                            penguin.equippedItems?.glasses === 'sunglasses-cool' ? adultShadesImg :
                                                                adultImg)
                                                    : (penguin.friendshipLevel >= 6 ? teenImg :
                                                        penguin.friendshipLevel >= 3 ? babyImg :
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
                                        {penguin.friendshipLevel >= 6 && penguin.equippedItems?.hat && (() => {
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
                                        {penguin.friendshipLevel >= 6 && penguin.equippedItems?.glasses && (() => {
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
                                        {penguin.friendshipLevel >= 6 && penguin.equippedItems?.accessory && (
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
