import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../store/useStore';
import { PlayCircle, PauseCircle, X, CheckCircle2 } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';
import { DAY_1_WORKOUT } from '../data/workouts';
import { videoService } from '../services/videoService';

export default function Workout() {
    const navigate = useNavigate();
    const { completeWorkout } = useStore();

    const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
    const [timeLeftInStep, setTimeLeftInStep] = useState(DAY_1_WORKOUT.exercises[0].duration);
    const [isPlaying, setIsPlaying] = useState(false);
    const [hasStarted, setHasStarted] = useState(false);
    const [isFinished, setIsFinished] = useState(false);
    const [isLoadingVideo, setIsLoadingVideo] = useState(true);
    const [currentVideoUrl, setCurrentVideoUrl] = useState(DAY_1_WORKOUT.exercises[0].videoUrl);

    const videoRef = useRef<HTMLVideoElement>(null);
    const program = DAY_1_WORKOUT;
    const currentStep = program.exercises[currentExerciseIndex];

    // Fetch video from Pexels when step changes
    useEffect(() => {
        const fetchVideo = async () => {
            if (currentStep.videoQuery) {
                setIsLoadingVideo(true);
                const url = await videoService.getVideoUrl(currentStep.videoQuery);
                if (url) {
                    setCurrentVideoUrl(url);
                } else {
                    // Fallback to static URL if API fails
                    setCurrentVideoUrl(currentStep.videoUrl);
                }
                setIsLoadingVideo(false);
            } else {
                setCurrentVideoUrl(currentStep.videoUrl);
                setIsLoadingVideo(false);
            }
        };

        fetchVideo();
    }, [currentExerciseIndex, currentStep]);

    // Handle timer for the current exercise/rest step
    useEffect(() => {
        let timer: any;
        if (isPlaying && !isFinished && !isLoadingVideo) {
            timer = setInterval(() => {
                setTimeLeftInStep(prev => prev - 1);
            }, 1000);
        }

        if (timeLeftInStep <= 0 && isPlaying) {
            clearInterval(timer);
            // Move to next step or finish
            if (currentExerciseIndex < program.exercises.length - 1) {
                const nextIndex = currentExerciseIndex + 1;
                setCurrentExerciseIndex(nextIndex);
                setTimeLeftInStep(program.exercises[nextIndex].duration);
            } else {
                setIsPlaying(false);
                setIsFinished(true);
                completeWorkout();
                // Sync to cloud immediately
                useStore.getState().syncWithFirestore();
            }
        }

        return () => clearInterval(timer);
    }, [isPlaying, timeLeftInStep, currentExerciseIndex, isFinished, program.exercises, completeWorkout, isLoadingVideo]);



    const handleStart = () => {
        setHasStarted(true);
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
        <div className="flex flex-col min-h-screen bg-slate-900 border-x border-slate-800 overflow-x-hidden">
            {/* Hidden preloader for the next video */}
            {nextStep && (
                <link rel="preload" as="video" href={nextStep.videoUrl} />
            )}

            <header className="flex justify-between items-center p-6 relative z-10 bg-slate-900/80 backdrop-blur-md border-b border-slate-800">
                <button
                    onClick={() => navigate('/dashboard')}
                    className="p-2 border border-slate-700/50 rounded-full hover:bg-slate-800 transition group"
                >
                    <X className="w-6 h-6 text-slate-400 group-hover:text-white" />
                </button>
                <div className="flex flex-col items-center">
                    <h2 className="text-lg font-black tracking-tighter text-white uppercase italic">
                        {program.title}
                    </h2>
                    <div className="flex items-center gap-2 mt-1">
                        <div className="flex gap-1">
                            {Array.from({ length: Math.ceil(program.exercises.length / 2) }).map((_, i) => (
                                <div
                                    key={i}
                                    className={`h-1 w-4 rounded-full transition-all ${i === Math.floor(currentExerciseIndex / 2) ? 'bg-primary-500 w-8' : 'bg-slate-700'}`}
                                />
                            ))}
                        </div>
                    </div>
                </div>
                <button
                    onClick={isPlaying ? handlePause : handleStart}
                    className={`p-2 border rounded-full transition shadow-lg ${isPlaying ? 'border-primary-500/50 text-primary-400 bg-primary-500/5 hover:bg-primary-500/10' : 'border-slate-700/50 text-slate-400 hover:bg-slate-800 hover:text-white cursor-pointer'}`}
                    disabled={isFinished || isLoadingVideo}
                >
                    {isPlaying ? <PauseCircle className="w-6 h-6" /> : <PlayCircle className="w-6 h-6" />}
                </button>
            </header>

            <div className="flex-1 flex flex-col md:flex-row gap-8 p-6 lg:p-12 overflow-y-auto no-scrollbar">
                {/* Video Column */}
                <div className="flex-1 lg:flex-[1.5] flex flex-col">
                    <motion.div
                        className="w-full aspect-video bg-black rounded-[2rem] overflow-hidden relative shadow-2xl shadow-black/80 border border-slate-700/50 group cursor-pointer"
                        onClick={isPlaying ? handlePause : handleStart}
                        layout
                    >
                        {isLoadingVideo ? (
                            <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900">
                                <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mb-6 shadow-[0_0_20px_rgba(13,185,242,0.3)]"></div>
                                <p className="text-slate-300 font-bold tracking-tight text-lg animate-pulse">Syncing Pipi's Workout...</p>
                                <p className="text-slate-500 text-sm mt-2">Connecting to HQ...</p>
                            </div>
                        ) : (
                            <video
                                ref={videoRef}
                                key={currentVideoUrl}
                                src={currentVideoUrl}
                                className={`w-full h-full object-cover ${((!isPlaying && !isFinished)) ? 'opacity-40 blur-[2px]' : 'opacity-100'} transition-all duration-700`}
                                loop
                                muted
                                playsInline
                                autoPlay={isPlaying}
                            />
                        )}

                        {/* Start Play Overlay */}
                        {!isPlaying && !isFinished && !isLoadingVideo && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-[4px] z-10 transition-all group-hover:bg-black/40">
                                <div className="flex flex-col items-center">
                                    {hasStarted && <span className="text-white font-black tracking-[0.2em] uppercase mb-6 drop-shadow-2xl text-2xl italic">MISSION PAUSED</span>}
                                    <button
                                        onClick={(e) => { e.stopPropagation(); handleStart(); }}
                                        className="bg-primary-500 text-slate-950 p-6 rounded-full shadow-[0_0_50px_rgba(13,185,242,0.6)] hover:scale-110 transition-transform cursor-pointer flex items-center justify-center"
                                    >
                                        <PlayCircle className="w-16 h-16 fill-current" />
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Rest Overlay */}
                        {isPlaying && currentStep.isRest && (
                            <div className="absolute inset-0 bg-primary-950/40 backdrop-blur-sm flex flex-col items-center justify-center z-10 pointer-events-none border-4 border-yellow-500/20 rounded-[2rem]">
                                <motion.span
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    className="text-white font-black text-6xl tracking-widest uppercase mb-6 drop-shadow-[0_5px_15px_rgba(0,0,0,0.5)] italic"
                                >
                                    RECOVERY
                                </motion.span>
                                <div className="flex items-center gap-3 bg-slate-900/80 px-6 py-3 rounded-2xl border border-slate-700 shadow-xl">
                                    <div className="w-2 h-2 rounded-full bg-teal-400 animate-ping" />
                                    <span className="text-teal-400 text-lg font-black uppercase italic tracking-tighter">
                                        NEXT: {program.exercises[currentExerciseIndex + 1]?.name || "FINISH"}
                                    </span>
                                </div>
                            </div>
                        )}

                        {/* Badge */}
                        <div className="absolute top-6 left-6 z-10">
                            <span className="bg-black/50 backdrop-blur-md text-white text-[10px] font-black py-2 px-4 rounded-full border border-white/10 uppercase tracking-[0.2em]">
                                LIVE RECORDING
                            </span>
                        </div>
                    </motion.div>
                </div>

                {/* Content Column */}
                <div className="flex-1 flex flex-col justify-between">
                    <div>
                        <motion.div
                            key={currentStep.name}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="mb-8"
                        >
                            <span className="text-primary-500 font-black text-sm uppercase tracking-[0.3em] mb-2 block">Current Objective</span>
                            <h2 className="text-4xl md:text-5xl font-black text-white italic tracking-tighter uppercase leading-none">
                                {isFinished ? "TASK COMPLETE" : currentStep.name}
                            </h2>
                            <p className="text-slate-400 mt-4 text-lg font-medium leading-relaxed max-w-md">
                                {isFinished ? "Elite status achieved. Pipi is evolving!" : (currentStep.isRest ? "Oxygenate your muscles. Stay sharp for the next move." : "Master the form. Control the movement. Build the legacy.")}
                            </p>
                        </motion.div>
                    </div>

                    <div className="flex flex-col items-center md:items-start my-8 md:my-0">
                        {!isFinished ? (
                            <div className="flex flex-col items-center md:items-start">
                                <div className="relative">
                                    <motion.span
                                        key={timeLeftInStep}
                                        initial={{ opacity: 0, scale: 0.5, filter: 'blur(10px)' }}
                                        animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                                        className={`text-[10rem] md:text-[14rem] leading-[0.8] font-black text-transparent bg-clip-text font-mono tracking-tighter italic ${currentStep.isRest ? 'bg-gradient-to-b from-yellow-300 to-orange-500' : 'bg-gradient-to-b from-primary-400 to-primary-700'}`}
                                    >
                                        {timeLeftInStep.toString().padStart(2, '0')}
                                    </motion.span>
                                    <div className="absolute -right-4 top-0 -rotate-12 bg-red-500 text-white text-[10px] font-black px-2 py-1 rounded shadow-lg animate-bounce">
                                        SECONDS
                                    </div>
                                </div>
                                <div className="mt-4 flex items-center gap-4 text-slate-500 font-black uppercase tracking-widest text-sm italic">
                                    <span>Stay Focused</span>
                                    <div className="w-8 h-[2px] bg-slate-800" />
                                    <span>Keep Moving</span>
                                </div>
                            </div>
                        ) : (
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="flex flex-col items-center md:items-start"
                            >
                                <span className="text-7xl font-black text-teal-400 italic tracking-tighter uppercase">MISSION<br />SUCCESS</span>
                                <div className="mt-8 flex gap-2">
                                    {[1, 2, 3, 4, 5].map(i => (
                                        <div key={i} className="w-10 h-10 bg-teal-400 rounded-lg flex items-center justify-center text-slate-950 font-black">
                                            ★
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </div>
                </div>

                <AnimatePresence>
                    {isFinished && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 100 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            className="fixed inset-x-0 bottom-0 md:bottom-12 z-50 px-6"
                        >
                            <div className="max-w-xl mx-auto bg-slate-800/90 backdrop-blur-2xl p-8 rounded-[2.5rem] border border-slate-700 shadow-[0_20px_60px_rgba(0,0,0,0.8)]">
                                <div className="flex items-center gap-6 mb-8">
                                    <div className="bg-teal-500 shadow-[0_0_20px_rgba(20,184,166,0.4)] p-4 rounded-full text-slate-950 flex-shrink-0">
                                        <CheckCircle2 className="w-10 h-10" />
                                    </div>
                                    <div>
                                        <h3 className="text-white font-black text-2xl italic uppercase tracking-tighter">Elite Performance</h3>
                                        <p className="text-slate-400 text-base mt-1 font-medium italic">Pipi's friendship level surged. Legacy preserved.</p>
                                    </div>
                                </div>
                                <button
                                    onClick={handleFinish}
                                    className="w-full bg-primary-500 text-slate-950 font-black text-xl py-5 rounded-2xl shadow-lg hover:bg-white transition-all transform hover:scale-[1.02] active:scale-[0.98] cursor-pointer uppercase italic tracking-tight"
                                >
                                    Return to HQ
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
