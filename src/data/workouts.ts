export interface WorkoutExercise {
    id: string;
    name: string;
    duration: number; // in seconds
    videoUrl: string;
    videoQuery?: string; // Pexels API 검색어 (운동과 정확히 매칭!)
    isRest?: boolean;
    met?: number; // Metabolic Equivalent of Task
}

export interface WorkoutProgram {
    id: string;
    title: string;
    description: string;
    exercises: WorkoutExercise[];
}

// ── 공통 REST 스텝 팩토리 ──────────────────────────────
const rest = (n: number): WorkoutExercise => ({
    id: `rest-${n}`,
    name: "Rest & Prepare",
    duration: 10,
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4",
    videoQuery: "calm nature forest breathing",
    isRest: true,
});

const restLong = (n: number): WorkoutExercise => ({
    id: `rest-long-${n}`,
    name: "Rest & Recover",
    duration: 15,
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4",
    videoQuery: "calm breathing recovery outdoor",
    isRest: true,
});

// ════════════════════════════════════════════════════
// ██ WEEK 1: FOUNDATION — Core Stability & Activation
// ════════════════════════════════════════════════════

export const DAY_1_WORKOUT: WorkoutProgram = {
    id: "day-1-core",
    title: "Day 1 · Core Basics",
    description: "Start your journey with foundational core activation.",
    exercises: [
        { id: "d1-1", name: "Crunches", duration: 30, videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4", videoQuery: "crunches exercise gym", met: 4.0 },
        rest(1),
        { id: "d1-2", name: "Bicycle Crunches", duration: 30, videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4", videoQuery: "bicycle crunches ab exercise", met: 5.0 },
        rest(2),
        { id: "d1-3", name: "Plank Hold", duration: 30, videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4", videoQuery: "plank exercise core hold", met: 3.5 },
        rest(3),
        { id: "d1-4", name: "Mountain Climbers", duration: 30, videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4", videoQuery: "mountain climbers exercise fitness", met: 8.0 },
    ]
};

const DAY_2_WORKOUT: WorkoutProgram = {
    id: "day-2-lower",
    title: "Day 2 · Lower Body",
    description: "Activate glutes, quads, and hamstrings with controlled movements.",
    exercises: [
        { id: "d2-1", name: "Bodyweight Squats", duration: 30, videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4", videoQuery: "bodyweight squat exercise beginner", met: 5.0 },
        rest(1),
        { id: "d2-2", name: "Glute Bridges", duration: 30, videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4", videoQuery: "glute bridge exercise floor", met: 4.5 },
        rest(2),
        { id: "d2-3", name: "Reverse Lunges", duration: 30, videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4", videoQuery: "reverse lunge exercise legs", met: 5.5 },
        rest(3),
        { id: "d2-4", name: "Wall Sit", duration: 30, videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4", videoQuery: "wall sit exercise legs isometric", met: 4.0 },
    ]
};

const DAY_3_WORKOUT: WorkoutProgram = {
    id: "day-3-upper-push",
    title: "Day 3 · Upper Body Push",
    description: "Strengthen chest, shoulders, and triceps with push patterns.",
    exercises: [
        { id: "d3-1", name: "Incline Push-Ups", duration: 30, videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4", videoQuery: "incline push up exercise beginner", met: 4.5 },
        rest(1),
        { id: "d3-2", name: "Standard Push-Ups", duration: 30, videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4", videoQuery: "push up exercise chest", met: 6.5 },
        rest(2),
        { id: "d3-3", name: "Tricep Dips (Chair)", duration: 30, videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4", videoQuery: "tricep dips chair exercise", met: 5.0 },
        rest(3),
        { id: "d3-4", name: "Pike Push-Ups", duration: 30, videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4", videoQuery: "pike push up shoulder exercise", met: 5.5 },
    ]
};

const DAY_4_WORKOUT: WorkoutProgram = {
    id: "day-4-cardio",
    title: "Day 4 · Full Body Cardio",
    description: "Get your heart pumping with full-body cardio movements.",
    exercises: [
        { id: "d4-1", name: "Jumping Jacks", duration: 30, videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4", videoQuery: "jumping jacks cardio exercise", met: 8.0 },
        rest(1),
        { id: "d4-2", name: "High Knees", duration: 30, videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4", videoQuery: "high knees running in place exercise", met: 9.0 },
        rest(2),
        { id: "d4-3", name: "Butt Kicks", duration: 30, videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4", videoQuery: "butt kicks cardio exercise", met: 8.0 },
        rest(3),
        { id: "d4-4", name: "Speed Skaters", duration: 30, videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4", videoQuery: "speed skater exercise lateral jump", met: 8.5 },
    ]
};

const DAY_5_WORKOUT: WorkoutProgram = {
    id: "day-5-core-hinge",
    title: "Day 5 · Core + Hip Hinge",
    description: "Build core strength and hip mobility with hinge patterns.",
    exercises: [
        { id: "d5-1", name: "Dead Bug", duration: 30, videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4", videoQuery: "dead bug exercise core stability", met: 3.0 },
        rest(1),
        { id: "d5-2", name: "Bird Dog", duration: 30, videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4", videoQuery: "bird dog exercise core balance", met: 3.0 },
        rest(2),
        { id: "d5-3", name: "Donkey Kicks", duration: 30, videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4", videoQuery: "donkey kick exercise glute activation", met: 4.0 },
        rest(3),
        { id: "d5-4", name: "Good Mornings", duration: 30, videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4", videoQuery: "good morning exercise bodyweight hamstring", met: 4.0 },
    ]
};

const DAY_6_WORKOUT: WorkoutProgram = {
    id: "day-6-upper-pull",
    title: "Day 6 · Upper Body Pull + Core",
    description: "Strengthen the posterior chain and upper back.",
    exercises: [
        { id: "d6-1", name: "Superman Hold", duration: 30, videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4", videoQuery: "superman hold exercise back", met: 3.5 },
        rest(1),
        { id: "d6-2", name: "Prone Y-T-W Raises", duration: 30, videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4", videoQuery: "prone Y T W raise shoulder exercise", met: 3.0 },
        rest(2),
        { id: "d6-3", name: "Side Plank (L)", duration: 20, videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4", videoQuery: "side plank exercise core oblique", met: 3.0 },
        rest(3),
        { id: "d6-4", name: "Side Plank (R)", duration: 20, videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4", videoQuery: "side plank exercise core oblique", met: 3.0 },
    ]
};

const DAY_7_WORKOUT: WorkoutProgram = {
    id: "day-7-recovery",
    title: "Day 7 · Active Recovery",
    description: "Rest and restore with gentle mobility and deep stretching.",
    exercises: [
        { id: "d7-1", name: "Cat-Cow Stretch", duration: 40, videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4", videoQuery: "cat cow stretch yoga spine", met: 2.0 },
        rest(1),
        { id: "d7-2", name: "Child's Pose", duration: 40, videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4", videoQuery: "child pose yoga stretch relaxation", met: 2.0 },
        rest(2),
        { id: "d7-3", name: "Hip Flexor Stretch", duration: 30, videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4", videoQuery: "hip flexor stretch yoga lunge", met: 2.0 },
        rest(3),
        { id: "d7-4", name: "Downward Dog", duration: 30, videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4", videoQuery: "downward dog yoga pose stretch", met: 2.5 },
    ]
};

// ════════════════════════════════════════════════════
// ██ WEEK 2: BUILD — Strength & Endurance
// ════════════════════════════════════════════════════

const DAY_8_WORKOUT: WorkoutProgram = {
    id: "day-8-lower-power",
    title: "Day 8 · Lower Body Power",
    description: "Build quad and glute power with progressive loading.",
    exercises: [
        { id: "d8-1", name: "Sumo Squats", duration: 35, videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4", videoQuery: "sumo squat exercise wide stance", met: 5.0 },
        rest(1),
        { id: "d8-2", name: "Curtsy Lunges", duration: 35, videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4", videoQuery: "curtsy lunge exercise glute", met: 5.5 },
        rest(2),
        { id: "d8-3", name: "Single-Leg Glute Bridge", duration: 30, videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4", videoQuery: "single leg glute bridge exercise", met: 5.0 },
        rest(3),
        { id: "d8-4", name: "Step-Ups (Imaginary Box)", duration: 35, videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4", videoQuery: "step up exercise legs cardio", met: 6.0 },
    ]
};

const DAY_9_WORKOUT: WorkoutProgram = {
    id: "day-9-upper-push-hard",
    title: "Day 9 · Push (Harder!)",
    description: "Level up your push strength with more demanding variations.",
    exercises: [
        { id: "d9-1", name: "Wide Push-Ups", duration: 35, videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4", videoQuery: "wide push up chest exercise", met: 6.5 },
        rest(1),
        { id: "d9-2", name: "Diamond Push-Ups", duration: 30, videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4", videoQuery: "diamond push up tricep exercise", met: 6.0 },
        rest(2),
        { id: "d9-3", name: "Decline Push-Ups", duration: 30, videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4", videoQuery: "decline push up upper chest exercise", met: 7.0 },
        rest(3),
        { id: "d9-4", name: "Shoulder Taps Plank", duration: 35, videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4", videoQuery: "plank shoulder tap exercise core", met: 4.5 },
    ]
};

const DAY_10_WORKOUT: WorkoutProgram = {
    id: "day-10-hiit-cardio",
    title: "Day 10 · HIIT Cardio",
    description: "Torch calories with high-intensity intervals.",
    exercises: [
        { id: "d10-1", name: "High Knees (Fast)", duration: 30, videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4", videoQuery: "high knees fast cardio HIIT exercise", met: 9.0 },
        rest(1),
        { id: "d10-2", name: "Jumping Jacks (Fast)", duration: 30, videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4", videoQuery: "jumping jacks fast cardio workout", met: 8.5 },
        rest(2),
        { id: "d10-3", name: "Mountain Climbers (Fast)", duration: 30, videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4", videoQuery: "mountain climber fast HIIT cardio", met: 9.0 },
        rest(3),
        { id: "d10-4", name: "Lateral Shuffles", duration: 30, videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4", videoQuery: "lateral shuffle exercise agility cardio", met: 8.5 },
    ]
};

const DAY_11_WORKOUT: WorkoutProgram = {
    id: "day-11-fullbody-strength",
    title: "Day 11 · Full Body Strength",
    description: "Hit every muscle group with compound bodyweight movements.",
    exercises: [
        { id: "d11-1", name: "Squats", duration: 35, videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4", videoQuery: "bodyweight squat exercise legs", met: 5.0 },
        rest(1),
        { id: "d11-2", name: "Push-Ups", duration: 35, videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4", videoQuery: "push up exercise chest strength", met: 6.5 },
        rest(2),
        { id: "d11-3", name: "Superman Hold", duration: 30, videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4", videoQuery: "superman back extension exercise", met: 3.5 },
        rest(3),
        { id: "d11-4", name: "Plank Hold", duration: 40, videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4", videoQuery: "plank core exercise stability", met: 3.5 },
    ]
};

const DAY_12_WORKOUT: WorkoutProgram = {
    id: "day-12-core-upper",
    title: "Day 12 · Core + Upper",
    description: "Combine core stability with upper body endurance.",
    exercises: [
        { id: "d12-1", name: "Russian Twists", duration: 35, videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4", videoQuery: "russian twist exercise core oblique", met: 4.5 },
        rest(1),
        { id: "d12-2", name: "Leg Raises", duration: 30, videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4", videoQuery: "leg raise exercise lower abs", met: 4.0 },
        rest(2),
        { id: "d12-3", name: "Push-Up to Side Plank", duration: 35, videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4", videoQuery: "push up to side plank exercise", met: 6.0 },
        rest(3),
        { id: "d12-4", name: "Flutter Kicks", duration: 30, videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4", videoQuery: "flutter kick exercise lower ab core", met: 4.0 },
    ]
};

const DAY_13_WORKOUT: WorkoutProgram = {
    id: "day-13-lower-core",
    title: "Day 13 · Lower Body + Core",
    description: "Power through lower body with core stabilization.",
    exercises: [
        { id: "d13-1", name: "Jump Squats", duration: 30, videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4", videoQuery: "jump squat exercise plyometric legs", met: 8.0 },
        rest(1),
        { id: "d13-2", name: "Walking Lunges", duration: 35, videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4", videoQuery: "walking lunge exercise legs fitness", met: 5.5 },
        rest(2),
        { id: "d13-3", name: "Hollow Body Hold", duration: 30, videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4", videoQuery: "hollow body hold exercise core gymnastics", met: 3.5 },
        rest(3),
        { id: "d13-4", name: "Glute Bridge Pulse", duration: 35, videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4", videoQuery: "glute bridge pulse exercise booty", met: 4.5 },
    ]
};

const DAY_14_WORKOUT: WorkoutProgram = {
    id: "day-14-recovery",
    title: "Day 14 · Active Recovery",
    description: "Deep stretch and mobility work. You've earned this!",
    exercises: [
        { id: "d14-1", name: "World's Greatest Stretch (L)", duration: 30, videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4", videoQuery: "worlds greatest stretch exercise mobility", met: 2.5 },
        rest(1),
        { id: "d14-2", name: "World's Greatest Stretch (R)", duration: 30, videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4", videoQuery: "worlds greatest stretch lunge rotation", met: 2.5 },
        rest(2),
        { id: "d14-3", name: "Pigeon Pose (L)", duration: 35, videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4", videoQuery: "pigeon pose yoga hip flexor stretch", met: 2.0 },
        rest(3),
        { id: "d14-4", name: "Pigeon Pose (R)", duration: 35, videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4", videoQuery: "pigeon pose yoga hip stretch", met: 2.0 },
    ]
};

// ════════════════════════════════════════════════════
// ██ WEEK 3: CHALLENGE — HIIT & Power
// ════════════════════════════════════════════════════

const DAY_15_WORKOUT: WorkoutProgram = {
    id: "day-15-hiit-fullbody",
    title: "Day 15 · HIIT Full Body",
    description: "Max effort — burn fat and build power simultaneously.",
    exercises: [
        { id: "d15-1", name: "Burpees", duration: 30, videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4", videoQuery: "burpees exercise HIIT full body", met: 10.0 },
        restLong(1),
        { id: "d15-2", name: "Squat Jumps", duration: 30, videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4", videoQuery: "squat jump plyometric exercise power", met: 9.5 },
        restLong(2),
        { id: "d15-3", name: "Mountain Climbers", duration: 30, videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4", videoQuery: "mountain climbers fast HIIT exercise", met: 9.0 },
        restLong(3),
        { id: "d15-4", name: "High Knees Sprint", duration: 30, videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4", videoQuery: "high knees sprint fast cardio HIIT", met: 10.0 },
    ]
};

const DAY_16_WORKOUT: WorkoutProgram = {
    id: "day-16-upper-power",
    title: "Day 16 · Upper Body Power",
    description: "Explosive upper body training — max output.",
    exercises: [
        { id: "d16-1", name: "Explosive Push-Ups", duration: 30, videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4", videoQuery: "explosive push up plyometric clap chest", met: 7.5 },
        restLong(1),
        { id: "d16-2", name: "Wide Push-Ups", duration: 35, videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4", videoQuery: "wide push up chest exercise", met: 6.5 },
        restLong(2),
        { id: "d16-3", name: "Pike Push-Ups", duration: 30, videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4", videoQuery: "pike push up shoulder press exercise", met: 5.5 },
        restLong(3),
        { id: "d16-4", name: "Tricep Dips", duration: 35, videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4", videoQuery: "tricep dips bench chair exercise arms", met: 5.0 },
    ]
};

const DAY_17_WORKOUT: WorkoutProgram = {
    id: "day-17-lower-hiit",
    title: "Day 17 · Lower Body HIIT",
    description: "Blast the legs with plyometric power moves.",
    exercises: [
        { id: "d17-1", name: "Jump Squats", duration: 30, videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4", videoQuery: "jump squat plyometric legs power", met: 9.5 },
        restLong(1),
        { id: "d17-2", name: "Speed Skaters", duration: 30, videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4", videoQuery: "speed skater lateral jump exercise", met: 8.5 },
        restLong(2),
        { id: "d17-3", name: "Jumping Lunges", duration: 30, videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4", videoQuery: "jumping lunge plyometric leg exercise", met: 9.0 },
        restLong(3),
        { id: "d17-4", name: "Butt Kicks (Sprint)", duration: 30, videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4", videoQuery: "butt kicks sprint fast cardio exercise", met: 8.5 },
    ]
};

const DAY_18_WORKOUT: WorkoutProgram = {
    id: "day-18-fullbody-circuit",
    title: "Day 18 · Full Body Circuit",
    description: "Non-stop circuit hitting every muscle group.",
    exercises: [
        { id: "d18-1", name: "Burpees", duration: 30, videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4", videoQuery: "burpees full body HIIT exercise", met: 10.0 },
        restLong(1),
        { id: "d18-2", name: "Push-Ups", duration: 30, videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4", videoQuery: "push up exercise chest strength", met: 6.5 },
        restLong(2),
        { id: "d18-3", name: "Squat Jumps", duration: 30, videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4", videoQuery: "squat jump plyometric explosive legs", met: 9.5 },
        restLong(3),
        { id: "d18-4", name: "Plank Hold", duration: 40, videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4", videoQuery: "plank hold core stability exercise", met: 3.5 },
    ]
};

const DAY_19_WORKOUT: WorkoutProgram = {
    id: "day-19-core-hiit",
    title: "Day 19 · Core + HIIT",
    description: "Shred your core while your heart rate stays elevated.",
    exercises: [
        { id: "d19-1", name: "Mountain Climbers", duration: 30, videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4", videoQuery: "mountain climbers core HIIT cardio", met: 9.0 },
        restLong(1),
        { id: "d19-2", name: "Bicycle Crunches", duration: 35, videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4", videoQuery: "bicycle crunches abs core exercise", met: 5.0 },
        restLong(2),
        { id: "d19-3", name: "Hollow Body Hold", duration: 35, videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4", videoQuery: "hollow body hold core exercise", met: 3.5 },
        restLong(3),
        { id: "d19-4", name: "High Knees", duration: 30, videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4", videoQuery: "high knees fast cardio HIIT", met: 9.0 },
    ]
};

const DAY_20_WORKOUT: WorkoutProgram = {
    id: "day-20-fullbody-power",
    title: "Day 20 · Full Body Power",
    description: "Push your limits — one day before the finish line!",
    exercises: [
        { id: "d20-1", name: "Burpees", duration: 35, videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4", videoQuery: "burpees jump full body power exercise", met: 10.0 },
        restLong(1),
        { id: "d20-2", name: "Explosive Push-Ups", duration: 30, videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4", videoQuery: "explosive clap push up plyometric chest", met: 7.5 },
        restLong(2),
        { id: "d20-3", name: "Jump Squats", duration: 35, videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4", videoQuery: "jump squat explosive legs power", met: 9.5 },
        restLong(3),
        { id: "d20-4", name: "Mountain Climbers", duration: 35, videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4", videoQuery: "mountain climbers fast HIIT core", met: 9.0 },
    ]
};

const DAY_21_WORKOUT: WorkoutProgram = {
    id: "day-21-celebration",
    title: "Day 21 · FINAL BOSS 🎉",
    description: "You made it! Celebrate with a mix of your greatest hits!",
    exercises: [
        { id: "d21-1", name: "Squat Jumps", duration: 30, videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4", videoQuery: "squat jump plyometric power legs", met: 9.5 },
        rest(1),
        { id: "d21-2", name: "Push-Ups", duration: 30, videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4", videoQuery: "push up exercise chest strength", met: 6.5 },
        rest(2),
        { id: "d21-3", name: "Burpees", duration: 30, videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4", videoQuery: "burpees full body HIIT exercise", met: 10.0 },
        rest(3),
        { id: "d21-4", name: "Plank Hold", duration: 45, videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4", videoQuery: "plank core hold stability exercise", met: 3.5 },
    ]
};

// ── 전체 21일 프로그램 맵 ──────────────────────────────
export const WORKOUT_PROGRAMS: Record<number, WorkoutProgram> = {
    1: DAY_1_WORKOUT,
    2: DAY_2_WORKOUT,
    3: DAY_3_WORKOUT,
    4: DAY_4_WORKOUT,
    5: DAY_5_WORKOUT,
    6: DAY_6_WORKOUT,
    7: DAY_7_WORKOUT,
    8: DAY_8_WORKOUT,
    9: DAY_9_WORKOUT,
    10: DAY_10_WORKOUT,
    11: DAY_11_WORKOUT,
    12: DAY_12_WORKOUT,
    13: DAY_13_WORKOUT,
    14: DAY_14_WORKOUT,
    15: DAY_15_WORKOUT,
    16: DAY_16_WORKOUT,
    17: DAY_17_WORKOUT,
    18: DAY_18_WORKOUT,
    19: DAY_19_WORKOUT,
    20: DAY_20_WORKOUT,
    21: DAY_21_WORKOUT,
};

/** currentDay에 맞는 루틴 반환 (범위 초과 시 Day 1 반환) */
export const getWorkoutForDay = (day: number): WorkoutProgram =>
    WORKOUT_PROGRAMS[day] ?? DAY_1_WORKOUT;
