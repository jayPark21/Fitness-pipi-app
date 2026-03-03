import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../store/useStore';
import { PlayCircle, PauseCircle, X, CheckCircle2, Info } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';
import { getWorkoutForDay } from '../data/workouts';
import { videoService } from '../services/videoService';
import { audioService } from '../services/audioService';
import { useMemo } from 'react';

export default function Workout() {
    const navigate = useNavigate();
    const { completeWorkout, userState } = useStore();

    // currentDay에 맞는 루틴 자동 선택! (메모이제이션 적용)
    const program = useMemo(() => getWorkoutForDay(userState.currentDay), [userState.currentDay]);

    const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
    const [timeLeftInStep, setTimeLeftInStep] = useState(program.exercises[0].duration);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isFinished, setIsFinished] = useState(false);
    const [isLoadingVideo, setIsLoadingVideo] = useState(true);
    const [currentVideoUrl, setCurrentVideoUrl] = useState(program.exercises[0].videoUrl);
    const [currentImageUrl, setCurrentImageUrl] = useState<string | null>(null);

    // 준비 시간 관련 상태
    const [isPrepPhase, setIsPrepPhase] = useState(false);
    const [prepTimeLeft, setPrepTimeLeft] = useState(5);

    const videoRef = useRef<HTMLVideoElement>(null);
    const asmrAudioRef = useRef<HTMLAudioElement | null>(null);

    const currentStep = program.exercises[currentExerciseIndex];

    // Audio initialization (Legacy replaced by audioService)
    useEffect(() => {
        // ASMR loop focus
        const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2432/2432-preview.mp3');
        audio.loop = true;
        asmrAudioRef.current = audio;

        return () => {
            if (asmrAudioRef.current) {
                asmrAudioRef.current.pause();
                asmrAudioRef.current = null;
            }
        };
    }, []);

    // Local playTick logic moved to audioService

    const playASMR = () => {
        if (asmrAudioRef.current && asmrAudioRef.current.paused) {
            asmrAudioRef.current.play().catch(e => console.error("ASMR play error:", e));
        }
    };

    const stopASMR = () => {
        if (asmrAudioRef.current && !asmrAudioRef.current.paused) {
            asmrAudioRef.current.pause();
        }
    };

    // Fetch media (video & image) when step changes
    useEffect(() => {
        const fetchMedia = async () => {
            if (currentStep.videoQuery) {
                setIsLoadingVideo(true);

                // Fetch Image for Prep Phase (Parallel)
                const [videoUrl, imageUrl] = await Promise.all([
                    videoService.getVideoUrl(currentStep.videoQuery),
                    videoService.getImageUrl(currentStep.videoQuery)
                ]);

                if (videoUrl) setCurrentVideoUrl(videoUrl);
                else setCurrentVideoUrl(currentStep.videoUrl);

                setCurrentImageUrl(imageUrl);
                setIsLoadingVideo(false);
            } else {
                setCurrentVideoUrl(currentStep.videoUrl);
                setCurrentImageUrl(null);
                setIsLoadingVideo(false);
            }
        };

        fetchMedia();

        // 운동 시작 시(휴식 아님) 5초 준비 시간 부여
        if (!currentStep.isRest) {
            setIsPrepPhase(true);
            setPrepTimeLeft(5);
        } else {
            setIsPrepPhase(false);
        }
    }, [currentExerciseIndex, currentStep]);

    // Timer logic for both Prep and Exercise
    useEffect(() => {
        let timer: any;
        if (isPlaying && !isFinished && !isLoadingVideo) {
            timer = setInterval(() => {
                if (isPrepPhase) {
                    // 준비 시간 카운트다운
                    setPrepTimeLeft(prev => {
                        if (prev > 1) {
                            audioService.playTick(false);
                            return prev - 1;
                        } else {
                            audioService.playStart();
                            setIsPrepPhase(false);
                            return 0;
                        }
                    });
                } else {
                    // 실제 운동 타이머
                    setTimeLeftInStep(prev => {
                        if (prev > 0) {
                            if (!currentStep.isRest) {
                                audioService.playTick(true);
                            }
                            return prev - 1;
                        }
                        return 0;
                    });
                }
            }, 1000);
        }

        if (timeLeftInStep <= 0 && isPlaying && !isPrepPhase) {
            clearInterval(timer);
            if (currentExerciseIndex < program.exercises.length - 1) {
                const nextIndex = currentExerciseIndex + 1;
                setCurrentExerciseIndex(nextIndex);
                setTimeLeftInStep(program.exercises[nextIndex].duration);
            } else {
                setIsPlaying(false);
                setIsFinished(true);
                audioService.playMissionClear(); // 보상 사운드
                completeWorkout();
                useStore.getState().syncWithFirestore();
            }
        }

        return () => clearInterval(timer);
    }, [isPlaying, timeLeftInStep, isPrepPhase, currentExerciseIndex, isFinished, isLoadingVideo, currentStep, program.exercises, completeWorkout]);

    // Handle ASMR for rest periods
    useEffect(() => {
        if (isPlaying && currentStep.isRest && !isFinished) {
            playASMR();
        } else {
            stopASMR();
        }
    }, [isPlaying, currentStep.isRest, isFinished]);

    const handleStart = () => {
        setIsPlaying(true);
        if (videoRef.current) {
            videoRef.current.play().catch(e => console.error("Video play error start:", e));
        }
    };

    const handlePause = () => {
        setIsPlaying(false);
        if (videoRef.current) {
            videoRef.current.pause();
        }
    };

    const handleFinish = () => {
        navigate('/dashboard');
    }

    const nextStep = program.exercises[currentExerciseIndex + 1];

    return (
        <div className="flex flex-col min-h-screen bg-slate-950 border-x border-slate-900 overflow-x-hidden">
            {nextStep && <link rel="preload" as="video" href={nextStep.videoUrl} />}

            <header className="flex justify-between items-center p-6 relative z-10 bg-slate-950/80 backdrop-blur-md border-b border-slate-900">
                <button
                    onClick={() => navigate('/dashboard')}
                    className="p-2 border border-slate-800 rounded-full hover:bg-slate-900 transition group"
                >
                    <X className="w-6 h-6 text-slate-500 group-hover:text-white" />
                </button>
                <div className="flex flex-col items-center">
                    <h2 className="text-lg font-black tracking-tighter text-white uppercase italic">
                        {program.title}
                    </h2>
                    <div className="flex gap-1 mt-1">
                        {Array.from({ length: Math.ceil(program.exercises.length / 2) }).map((_, i) => (
                            <div
                                key={i}
                                className={`h-1.5 w-6 rounded-full transition-all duration-300 ${i <= Math.floor(currentExerciseIndex / 2) ? 'bg-primary-500 shadow-[0_0_10px_rgba(13,185,242,0.4)]' : 'bg-slate-800'}`}
                            />
                        ))}
                    </div>
                </div>
                <button
                    onClick={isPlaying ? handlePause : handleStart}
                    className={`p-2 border rounded-full transition shadow-lg ${isPlaying ? 'border-primary-500/50 text-primary-400 bg-primary-500/10' : 'border-slate-800 text-slate-500 hover:bg-slate-900'}`}
                    disabled={isFinished || isLoadingVideo}
                >
                    {isPlaying ? <PauseCircle className="w-6 h-6" /> : <PlayCircle className="w-6 h-6" />}
                </button>
            </header>

            <div className="flex-1 flex flex-col p-4 lg:p-8 xl:p-12 gap-8 overflow-y-auto no-scrollbar">
                {/* Optimized Media Container */}
                <div className="w-full max-w-6xl mx-auto flex flex-col gap-6">
                    <motion.div
                        className="w-full relative aspect-video bg-neutral-900 rounded-[2.5rem] overflow-hidden shadow-[0_30px_70px_rgba(0,0,0,0.9)] border border-slate-800/50 group"
                        onClick={isPlaying ? handlePause : handleStart}
                        layout
                    >
                        {isLoadingVideo ? (
                            <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950">
                                <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mb-6"></div>
                                <p className="text-slate-300 font-bold tracking-tight text-xl animate-pulse italic">ESTABLISHING DATA LINK...</p>
                            </div>
                        ) : (
                            <>
                                {/* Video Player */}
                                <video
                                    ref={videoRef}
                                    key={currentVideoUrl}
                                    src={currentVideoUrl}
                                    className={`w-full h-full object-contain bg-black ${((!isPlaying && !isFinished) || isPrepPhase) ? 'opacity-20 blur-[8px]' : 'opacity-100'} transition-all duration-700`}
                                    loop
                                    muted
                                    playsInline
                                    autoPlay={isPlaying && !isPrepPhase}
                                />

                                {/* Prep Phase Overlay with Pose Image */}
                                {isPrepPhase && isPlaying && (
                                    <div className="absolute inset-0 z-20 flex flex-col md:flex-row items-center justify-center bg-black/40 backdrop-blur-xl p-8 gap-12">
                                        {/* Pose Image on the left/top */}
                                        <motion.div
                                            initial={{ x: -50, opacity: 0 }}
                                            animate={{ x: 0, opacity: 1 }}
                                            className="w-full md:w-1/2 h-full max-h-[300px] md:max-h-none relative rounded-3xl overflow-hidden shadow-2xl border border-white/10"
                                        >
                                            <div className="absolute inset-0 z-10 bg-gradient-to-b from-transparent via-transparent to-primary-500/10 pointer-events-none" />

                                            {/* Scanning Line Animation */}
                                            <motion.div
                                                className="absolute top-0 left-0 w-full h-[2px] bg-primary-500 shadow-[0_0_15px_rgba(13,185,242,0.8)] z-20"
                                                animate={{ top: ['0%', '100%', '0%'] }}
                                                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                                            />

                                            {currentImageUrl ? (
                                                <img
                                                    src={currentImageUrl}
                                                    alt="Prepare Pose"
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full bg-slate-900 flex items-center justify-center">
                                                    <Info className="w-12 h-12 text-slate-700" />
                                                </div>
                                            )}
                                            <div className="absolute top-6 left-6 bg-primary-500 text-slate-950 text-[10px] font-black px-4 py-2 rounded-full uppercase tracking-widest z-30 shadow-lg">
                                                BIO-SCANNING POSE
                                            </div>
                                        </motion.div>

                                        {/* Countdown on the right/bottom */}
                                        <motion.div
                                            initial={{ x: 50, opacity: 0 }}
                                            animate={{ x: 0, opacity: 1 }}
                                            className="flex flex-col items-center md:items-start text-center md:text-left"
                                        >
                                            <span className="text-primary-500 font-black text-2xl tracking-[0.4em] uppercase mb-4 italic">PREPARE FOR MISSION</span>
                                            <motion.span
                                                key={prepTimeLeft}
                                                initial={{ scale: 1.5, opacity: 0 }}
                                                animate={{ scale: 1, opacity: 1 }}
                                                className="text-[10rem] md:text-[14rem] font-black text-white leading-none drop-shadow-[0_0_40px_rgba(13,185,242,0.6)] italic"
                                            >
                                                {prepTimeLeft}
                                            </motion.span>
                                            <span className="text-white font-black text-3xl md:text-5xl tracking-tight uppercase mt-4 italic bg-primary-500/30 px-10 py-3 rounded-full border border-primary-500/40">
                                                {currentStep.name}
                                            </span>
                                        </motion.div>
                                    </div>
                                )}
                            </>
                        )}

                        {!isPlaying && !isFinished && !isLoadingVideo && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-[2px] z-10">
                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={(e) => { e.stopPropagation(); handleStart(); }}
                                    className="bg-primary-500 text-slate-950 p-8 rounded-full shadow-[0_0_40px_rgba(13,185,242,0.5)]"
                                >
                                    <PlayCircle className="w-16 h-16 fill-current" />
                                </motion.button>
                            </div>
                        )}

                        {isPlaying && currentStep.isRest && (
                            <div className="absolute inset-0 bg-blue-950/40 backdrop-blur-md flex flex-col items-center justify-center z-10 pointer-events-none">
                                <motion.span
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    className="text-white font-black text-8xl tracking-tighter uppercase italic drop-shadow-2xl text-center"
                                >
                                    RECOVERY PHASE
                                </motion.span>
                                <div className="mt-8 flex items-center gap-4 bg-slate-900/95 px-10 py-5 rounded-full border border-slate-700 shadow-2xl">
                                    <div className="w-4 h-4 rounded-full bg-primary-400 animate-ping" />
                                    <span className="text-primary-400 text-2xl font-black uppercase italic tracking-tight">
                                        UP NEXT: {program.exercises[currentExerciseIndex + 1]?.name || "MISSION FINISH"}
                                    </span>
                                </div>
                            </div>
                        )}
                    </motion.div>

                    {/* Progress & Timer Section */}
                    <div className="flex flex-col md:flex-row items-center justify-between gap-10 px-6">
                        <div className="flex flex-col text-center md:text-left">
                            <span className="text-primary-500 font-black text-sm uppercase tracking-[0.5em] mb-2">TARGET OBJECTIVE</span>
                            <h2 className="text-5xl md:text-7xl font-black text-white italic tracking-tighter uppercase leading-none">
                                {isFinished ? "TASK COMPLETE" : currentStep.name}
                            </h2>
                        </div>

                        {!isFinished ? (
                            <div className="flex flex-col items-center md:items-end">
                                <div className="relative">
                                    <motion.span
                                        key={isPrepPhase ? prepTimeLeft : timeLeftInStep}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className={`text-9xl md:text-[12rem] leading-none font-black font-mono tracking-tighter italic ${currentStep.isRest || isPrepPhase ? 'text-orange-500 bg-gradient-to-b from-yellow-400 to-orange-600' : 'text-primary-500 bg-gradient-to-b from-primary-400 to-primary-700'} bg-clip-text text-transparent`}
                                    >
                                        {(isPrepPhase ? prepTimeLeft : timeLeftInStep).toString().padStart(2, '0')}
                                    </motion.span>
                                    <div className="absolute -right-8 top-4 rotate-12 bg-white text-slate-950 text-[12px] font-black px-3 py-1 rounded shadow-xl uppercase">
                                        SEC
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center md:items-end text-right">
                                <span className="text-6xl font-black text-primary-500 italic tracking-tighter uppercase drop-shadow-[0_0_20px_rgba(13,185,242,0.5)]">MISSION<br />SUCCESS</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer Metrics */}
                <div className="mt-auto max-w-6xl mx-auto w-full border-t border-slate-900 pt-10 flex flex-wrap justify-between items-center text-slate-500 font-bold uppercase text-[12px] tracking-widest italic gap-6">
                    <div className="flex gap-8">
                        <div className="flex flex-col">
                            <span className="text-slate-600 mb-1">INTENSITY</span>
                            <span className="text-white text-lg">{currentStep.isRest ? 'LOW' : 'HIGH'}</span>
                        </div>
                        <div className="w-[1px] h-10 bg-slate-800" />
                        <div className="flex flex-col">
                            <span className="text-slate-600 mb-1">TARGET</span>
                            <span className="text-white text-lg">FULL BODY</span>
                        </div>
                        <div className="w-[1px] h-10 bg-slate-800" />
                        <div className="flex flex-col">
                            <span className="text-slate-600 mb-1">MET LEVEL</span>
                            <span className="text-white text-lg">{currentStep.met || '-'}</span>
                        </div>
                    </div>
                    <div className="flex gap-4 items-center bg-slate-900/50 px-6 py-3 rounded-2xl border border-slate-800">
                        <div className="w-3 h-3 rounded-full bg-primary-500 animate-pulse" />
                        <span className="text-slate-300">BIO-SYNC COACH ACTIVE</span>
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {isFinished && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-xl"
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 50 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            className="w-full max-w-xl bg-slate-900 border border-slate-800 p-12 rounded-[3.5rem] shadow-[0_50px_120px_rgba(0,0,0,1)] text-center relative overflow-hidden"
                        >
                            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary-600 via-primary-400 to-primary-600" />
                            <div className="w-28 h-28 bg-primary-500 rounded-full flex items-center justify-center mx-auto mb-10 shadow-[0_0_60px_rgba(13,185,242,0.5)]">
                                <CheckCircle2 className="w-14 h-14 text-slate-950" />
                            </div>
                            <h3 className="text-white font-black text-5xl italic uppercase tracking-tighter mb-6">MISSION COMPLETE</h3>
                            <p className="text-slate-400 text-xl font-medium italic mb-12">Pipi's legacy is secured. Your performance was exemplary.</p>

                            <button
                                onClick={handleFinish}
                                className="w-full bg-primary-500 text-slate-950 font-black text-2xl py-7 rounded-3xl hover:bg-white transition-all transform hover:scale-[1.03] active:scale-[0.97] uppercase italic tracking-tighter"
                            >
                                RETURN TO HQ
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
