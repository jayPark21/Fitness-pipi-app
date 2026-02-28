export interface WorkoutExercise {
    id: string;
    name: string;
    duration: number; // in seconds
    videoUrl: string;
    videoQuery?: string; // Pexels API 검색어
    isRest?: boolean;
}


export interface WorkoutProgram {
    id: string;
    title: string;
    description: string;
    exercises: WorkoutExercise[];
}

// Ensure these are direct mp4 links from Pexels or a reliable CDN
export const DAY_1_WORKOUT: WorkoutProgram = {
    id: "day-1-core",
    title: "10 Min Beginner Core",
    description: "Start your journey right with an easy, low-impact core routine.",
    exercises: [
        {
            id: "ex-1",
            name: "Crunches",
            duration: 30,
            videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
            videoQuery: "crunches exercise"
        },
        {
            id: "rest-1",
            name: "Rest & Prepare",
            duration: 10,
            videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4",
            videoQuery: "relaxing nature",
            isRest: true
        },
        {
            id: "ex-2",
            name: "Bicycle Crunches",
            duration: 30,
            videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
            videoQuery: "bicycle crunches"
        },
        {
            id: "rest-2",
            name: "Rest & Prepare",
            duration: 10,
            videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4",
            videoQuery: "relaxing nature",
            isRest: true
        },
        {
            id: "ex-3",
            name: "Plank",
            duration: 30,
            videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
            videoQuery: "plank exercise"
        },
        {
            id: "rest-3",
            name: "Rest & Prepare",
            duration: 10,
            videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4",
            videoQuery: "relaxing nature",
            isRest: true
        },
        {
            id: "ex-4",
            name: "Mountain Climbers",
            duration: 30,
            videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
            videoQuery: "mountain climbers exercise"

        }
    ]
};
