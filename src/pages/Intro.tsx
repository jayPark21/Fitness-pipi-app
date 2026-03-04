import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import introBgm from '../assets/audio/intro_bgm.mp3';

const Intro: React.FC = () => {
    const navigate = useNavigate();
    const [isInteracted, setIsInteracted] = useState(false);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [showText, setShowText] = useState(true);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    // 폰트 동적 삽입
    useEffect(() => {
        const link = document.createElement('link');
        link.href = 'https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap';
        link.rel = 'stylesheet';
        document.head.appendChild(link);
        return () => { document.head.removeChild(link); };
    }, []);

    // 텍스트 깜빡임 (부팅 전용)
    useEffect(() => {
        const interval = setInterval(() => {
            setShowText(prev => !prev);
        }, 500);
        return () => clearInterval(interval);
    }, []);

    const handleInitialClick = () => {
        if (isInteracted) return;
        setIsInteracted(true);

        // 클릭 순간 음악 바로 재생!
        if (audioRef.current) {
            audioRef.current.play().catch(err => console.log("Audio play failed:", err));
        }

        // 일정 시간 후 다음 화면으로 자동 이동 로직 (음악 감상을 위해 5초 정도)
        setTimeout(() => {
            setIsTransitioning(true);
            setTimeout(() => navigate('/dashboard'), 1000);
        }, 6000);
    };

    return (
        <div className="relative w-full h-screen bg-black overflow-hidden flex flex-col items-center justify-center font-['Press_Start_2P'] select-none">
            <audio ref={audioRef} src={introBgm} loop />

            {/* CRT 스캔라인 효과 (항상 노출) */}
            <div className="absolute inset-0 pointer-events-none z-[100] opacity-30"
                style={{
                    background: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06))',
                    backgroundSize: '100% 4px, 3px 100%'
                }}
            />

            <AnimatePresence mode="wait">
                {!isInteracted ? (
                    /* 1단계: 부팅 대기 화면 */
                    <motion.div
                        key="boot"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0, scale: 1.5 }}
                        className="flex flex-col items-center gap-12 z-20 cursor-pointer"
                        onClick={handleInitialClick}
                    >
                        <div className="w-24 h-24 border-4 border-teal-500 flex items-center justify-center relative">
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                                className="absolute inset-0 border-t-4 border-fuchsia-500"
                            />
                            <span className="text-teal-500 text-xs font-bold animate-pulse">SYSTEM</span>
                        </div>
                        <div className={`text-white text-sm md:text-lg tracking-widest transition-opacity ${showText ? 'opacity-100' : 'opacity-0'}`}>
                            - PUSH TO BOOT -
                        </div>
                    </motion.div>
                ) : (
                    /* 2단계: 대표님 음악과 함께 터지는 메인 인트로 연출 */
                    <motion.div
                        key="main"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: isTransitioning ? 0 : 1, scale: isTransitioning ? 1.2 : 1 }}
                        transition={{ duration: 0.8 }}
                        className="flex flex-col items-center justify-center z-10 space-y-12"
                    >
                        {/* 타이틀 폭발 연출 */}
                        <motion.div
                            initial={{ y: -100, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ type: "spring", delay: 0.2 }}
                            className="relative"
                        >
                            <h1 className="text-4xl md:text-7xl font-black text-teal-400 drop-shadow-[5px_5px_0px_rgba(255,0,255,1)]">
                                PIPI
                            </h1>
                            <motion.div
                                initial={{ x: 100, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.5 }}
                                className="text-white text-xl md:text-2xl mt-2 tracking-[0.3em] bg-fuchsia-600 px-6 py-2 skew-x-[-15deg] border-2 border-white"
                            >
                                FITNESS
                            </motion.div>
                        </motion.div>

                        {/* 피피 등장! */}
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 1, type: "spring" }}
                        >
                            <motion.div
                                animate={{
                                    y: [0, -25, 0],
                                    rotate: [-2, 2, -2]
                                }}
                                transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                                className="w-40 h-40 bg-slate-800 border-4 border-teal-500 rounded-3xl flex items-center justify-center shadow-[10px_10px_0px_#0e7490] relative"
                            >
                                <span className="text-7xl">🐧</span>
                                <div className="absolute -top-4 -right-4 bg-yellow-400 text-black text-[10px] font-bold px-2 py-1 rotate-12 border-2 border-black">
                                    NEW GEN
                                </div>
                            </motion.div>
                        </motion.div>

                        {/* 로딩 멘트 */}
                        <div className="space-y-4 flex flex-col items-center">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: "200px" }}
                                transition={{ duration: 4, ease: "linear" }}
                                className="h-2 bg-teal-400 shadow-[0_0_10px_#2dd4bf]"
                            />
                            <div className="text-fuchsia-400 text-xs italic animate-pulse tracking-tighter">
                                INITIALIZING WORKOUT ENGINE...
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* 하단 풋터 */}
            <div className="absolute bottom-6 text-[8px] md:text-[10px] text-slate-600 tracking-tight font-sans">
                PIPI SYSTEM v0.1.0 // EST. 2026 // PROD. BY TTANGCHIRI
            </div>

            {/* 배경 픽셀 데코 (음악과 함께 파티 타임!) */}
            <AnimatePresence>
                {isInteracted && (
                    <>
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.2 }} className="absolute top-20 left-20 w-8 h-8 bg-teal-500 rounded-full blur-xl animate-pulse" />
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.2 }} className="absolute bottom-40 right-10 w-12 h-12 bg-fuchsia-500 rounded-full blur-2xl animate-ping" />
                        <div className="absolute top-1/4 right-1/4 w-2 h-2 bg-white animate-bounce" />
                        <div className="absolute bottom-1/3 left-1/3 w-2 h-2 bg-teal-300 animate-bounce delay-150" />
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Intro;
