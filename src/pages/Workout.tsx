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
        <div className="flex flex-col min-h-screen bg-slate-900 border-x border-slate-800">
            {/* Hidden preloader for the next video */}
            {nextStep && (
                <link rel="preload" as="video" href={nextStep.videoUrl} />
            )}

            <header className="flex justify-between items-center p-6 pb-2 relative z-10">
                <button
                    onClick={() => navigate('/dashboard')}
                    className="p-2 border border-slate-700/50 rounded-full hover:bg-slate-800 transition"
                >
                    <X className="w-6 h-6 text-slate-400" />
                </button>
                <div className="flex flex-col items-center">
                    <span className="text-sm font-semibold text-primary-500">{program.title}</span>
                    <span className="text-xs text-slate-500">
                        {Math.floor(currentExerciseIndex / 2) + 1} / {Math.ceil(program.exercises.length / 2)}
                    </span>
                </div>
                <button
                    onClick={isPlaying ? handlePause : handleStart}
                    className={`p-2 border rounded-full transition ${isPlaying ? 'border-primary-500/50 text-primary-400 hover:bg-primary-500/10' : 'border-slate-700/50 text-slate-400 hover:bg-slate-800 cursor-pointer'}`}
                    disabled={isFinished || isLoadingVideo}
                >
                    {isPlaying ? <PauseCircle className="w-6 h-6" /> : <PlayCircle className="w-6 h-6" />}
                </button>
            </header>

            <div className="flex-1 flex flex-col px-6">
                <motion.div
                    className="w-full aspect-square md:aspect-video bg-slate-800 rounded-3xl overflow-hidden relative shadow-lg shadow-black/50 border border-slate-700 mt-4 mb-6 cursor-pointer"
                    onClick={isPlaying ? handlePause : handleStart}
                >
                    {isLoadingVideo ? (
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-800">
                            <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                            <p className="text-slate-400 text-sm animate-pulse">Pipi is fetching your workout video...</p>
                        </div>
                    ) : (
                        <video
                            ref={videoRef}
                            key={currentVideoUrl}
                            src={currentVideoUrl}
                            className={`w-full h-full object-cover ${((!isPlaying && !isFinished)) ? 'opacity-50 blur-sm' : 'opacity-100'} transition-all duration-500`}
                            loop
                            muted
                            playsInline
                            autoPlay={isPlaying}
                        />
                    )}

                    {/* Start Play Overlay */}
                    {!isPlaying && !isFinished && !isLoadingVideo && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-10 transition-all">
                            <div className="flex flex-col items-center">
                                {hasStarted && <span className="text-white font-bold tracking-widest uppercase mb-4 drop-shadow-md text-xl">Paused</span>}
                                <button
                                    onClick={(e) => { e.stopPropagation(); handleStart(); }}
                                    className="bg-primary-500 text-slate-900 p-4 rounded-full shadow-lg hover:scale-110 transition cursor-pointer flex items-center justify-center"
                                >
                                    <PlayCircle className="w-10 h-10 fill-current" />
                                </button>
                            </div>
                        </div>
                    )}


                    {/* Rest Overlay (Dims video slightly to show it's rest time) */}
                    {isPlaying && currentStep.isRest && (
                        <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center z-10 pointer-events-none">
                            <span className="text-white font-bold text-3xl tracking-widest uppercase mb-4 drop-shadow-md">Rest</span>
                            <span className="text-primary-400 text-lg font-semibold bg-slate-900/50 px-4 py-2 rounded-xl">
                                Up Next: {program.exercises[currentExerciseIndex + 1]?.name || "Finish"}
                            </span>
                        </div>
                    )}
                </motion.div>

                <motion.h2
                    key={currentStep.name}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-2xl font-bold mb-2 h-8 text-white"
                >
                    {isFinished ? "Workout Complete!" : currentStep.name}
                </motion.h2>
                <p className="text-slate-400 mb-6 h-6">
                    {isFinished ? "Pipi is proud of you!" : (currentStep.isRest ? "Catch your breath and prepare." : "Follow the video and keep pushing!")}
                </p>

                <div className="flex-1 flex flex-col justify-center items-center">
                    {!isFinished ? (
                        <>
                            <motion.span
                                key={timeLeftInStep}
                                initial={{ opacity: 0.5, y: -5 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={`text-[6rem] leading-none font-bold text-transparent bg-clip-text font-mono tracking-tighter drop-shadow-lg ${currentStep.isRest ? 'bg-gradient-to-b from-yellow-300 to-orange-500' : 'bg-gradient-to-b from-teal-300 to-primary-500'}`}
                            >
                                {timeLeftInStep.toString().padStart(2, '0')}
                            </motion.span>
                            <span className="text-lg text-slate-500 mt-2">
                                Seconds left for {currentStep.name}
                            </span>
                        </>
                    ) : (
                        <span className="text-4xl font-bold text-teal-400 animate-pulse mt-10">
                            Done! 🎉
                        </span>
                    )}
                </div>

                <AnimatePresence>
                    {isFinished && (
                        <motion.div
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="absolute inset-x-0 bottom-0 bg-slate-800 p-6 rounded-t-3xl border-t border-slate-700 max-w-md mx-auto z-20 shadow-[0_-10px_40px_rgba(0,0,0,0.5)]"
                        >
                            <div className="flex items-center gap-4 mb-6">
                                <div className="bg-teal-500/20 p-3 rounded-full text-teal-400 flex-shrink-0">
                                    <CheckCircle2 className="w-8 h-8" />
                                </div>
                                <div>
                                    <h3 className="text-white font-bold text-xl">Workout Complete!</h3>
                                    <p className="text-slate-400 text-sm mt-1">Pipi is extremely happy now. You kept your streak!</p>
                                </div>
                            </div>
                            <button
                                onClick={handleFinish}
                                className="w-full bg-primary-500 text-slate-900 font-bold text-lg py-4 rounded-xl shadow-lg hover:bg-teal-400 transition cursor-pointer"
                            >
                                Return to Dashboard
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
