// ── 자세 안내 이미지 임포트 ──────────────────────────────
import squatImg from "../assets/poses/squat.png";
import pushupImg from "../assets/poses/pushup.png";
import plankImg from "../assets/poses/plank.png";
import lungeImg from "../assets/poses/lunge.png";
import mountainImg from "../assets/poses/mountain_climber.png";
import burpeeImg from "../assets/poses/burpee.png";
import bridgeImg from "../assets/poses/bridge.png";
import jumpingImg from "../assets/poses/jumping_jacks.png";

export interface WorkoutExercise {
    id: string;
    name: string;
    duration: number; // 초 단위
    videoUrl: string;
    videoQuery?: string; // Pexels API 검색어
    isRest?: boolean;
    met?: number; // Metabolic Equivalent of Task (칼로리 계산용)
    poseGuideUrl?: string; // 자세 안내 이미지 (추후 확장용)
}

export interface WorkoutProgram {
    id: string;
    title: string;
    description: string;
    exercises: WorkoutExercise[];
}

// ── 공통 휴식 스텝 팩토리 ──────────────────────────────
const rest = (n: number): WorkoutExercise => ({
    id: `rest-${n}`,
    name: "휴식 및 준비",
    duration: 10,
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4",
    videoQuery: "calm nature forest breathing",
    isRest: true,
});

const restLong = (n: number): WorkoutExercise => ({
    id: `rest-long-${n}`,
    name: "심호흡 및 회복",
    duration: 15,
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4",
    videoQuery: "calm breathing recovery outdoor",
    isRest: true,
});

// ════════════════════════════════════════════════════
// ██ 1주차: 기초 다지기 — 코어 안정성 및 활성화
// ════════════════════════════════════════════════════

export const DAY_1_WORKOUT: WorkoutProgram = {
    id: "day-1-core",
    title: "1일차 · 코어 기초",
    description: "기초 코어 활성화로 여정을 시작하세요.",
    exercises: [
        { id: "d1-1", name: "크런치", duration: 30, videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4", videoQuery: "crunches exercise gym", met: 4.0 },
        rest(1),
        { id: "d1-2", name: "바이시클 크런치", duration: 30, videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4", videoQuery: "bicycle crunches ab exercise", met: 5.0 },
        rest(2),
        { id: "d1-3", name: "플랭크 홀드", duration: 30, videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4", videoQuery: "plank exercise core hold", met: 3.5, poseGuideUrl: plankImg },
        rest(3),
        { id: "d1-4", name: "마운틴 클라이머", duration: 30, videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4", videoQuery: "mountain climber floor exercise ab", met: 8.0, poseGuideUrl: mountainImg },
    ]
};

const DAY_2_WORKOUT: WorkoutProgram = {
    id: "day-2-lower",
    title: "2일차 · 하체 활성화",
    description: "차분한 동작으로 둔근과 허벅지 근육을 깨웁니다.",
    exercises: [
        { id: "d2-1", name: "맨몸 스쿼트", duration: 30, videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4", videoQuery: "bodyweight squat exercise beginner", met: 5.0, poseGuideUrl: squatImg },
        rest(1),
        { id: "d2-2", name: "글루트 브릿지", duration: 30, videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4", videoQuery: "glute bridge exercise floor", met: 4.5, poseGuideUrl: bridgeImg },
        rest(2),
        { id: "d2-3", name: "리버스 런지", duration: 30, videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4", videoQuery: "reverse lunge exercise legs", met: 5.5, poseGuideUrl: lungeImg },
        rest(3),
        { id: "d2-4", name: "월 싯 (버티기)", duration: 30, videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4", videoQuery: "wall sit exercise legs isometric", met: 4.0 },
    ]
};

const DAY_3_WORKOUT: WorkoutProgram = {
    id: "day-3-upper-push",
    title: "3일차 · 상체 푸시",
    description: "가슴, 어깨, 삼두근을 강화하는 밀기 패턴입니다.",
    exercises: [
        { id: "d3-1", name: "인클라인 푸쉬업", duration: 30, videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4", videoQuery: "incline push up exercise beginner", met: 4.5 },
        rest(1),
        { id: "d3-2", name: "스탠다드 푸쉬업", duration: 30, videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4", videoQuery: "push up exercise chest", met: 6.5, poseGuideUrl: pushupImg },
        rest(2),
        { id: "d3-3", name: "의자 트라이셉 딥스", duration: 30, videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4", videoQuery: "tricep dips chair exercise", met: 5.0 },
        rest(3),
        { id: "d3-4", name: "파이크 푸쉬업", duration: 30, videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4", videoQuery: "pike push up shoulder exercise", met: 5.5 },
    ]
};

const DAY_4_WORKOUT: WorkoutProgram = {
    id: "day-4-cardio",
    title: "4일차 · 전신 유산소",
    description: "전신을 움직여 심박수를 높이고 에너지를 태웁니다.",
    exercises: [
        { id: "d4-1", name: "점핑 잭", duration: 30, videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4", videoQuery: "jumping jacks cardio exercise", met: 8.0, poseGuideUrl: jumpingImg },
        rest(1),
        { id: "d4-2", name: "하이 니 (무릎 높이기)", duration: 30, videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4", videoQuery: "high knees running in place exercise", met: 9.0 },
        rest(2),
        { id: "d4-3", name: "버트 킥", duration: 30, videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4", videoQuery: "butt kicks cardio exercise", met: 8.0 },
        rest(3),
        { id: "d4-4", name: "스피드 스케이터", duration: 30, videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4", videoQuery: "speed skater exercise lateral jump", met: 8.5 },
    ]
};

const DAY_5_WORKOUT: WorkoutProgram = {
    id: "day-5-core-hinge",
    title: "5일차 · 코어 및 힙 힌지",
    description: "코어 안정성과 고관절 가동성을 함께 강화합니다.",
    exercises: [
        { id: "d5-1", name: "데드 버그", duration: 30, videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4", videoQuery: "dead bug exercise core stability", met: 3.0 },
        rest(1),
        { id: "d5-2", name: "버드 독", duration: 30, videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4", videoQuery: "bird dog exercise core balance", met: 3.0 },
        rest(2),
        { id: "d5-3", name: "덩키 킥", duration: 30, videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4", videoQuery: "donkey kick exercise glute activation", met: 4.0 },
        rest(3),
        { id: "d5-4", name: "굿 모닝 (맨몸)", duration: 30, videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4", videoQuery: "good morning exercise bodyweight hamstring", met: 4.0 },
    ]
};

const DAY_6_WORKOUT: WorkoutProgram = {
    id: "day-6-upper-pull",
    title: "6일차 · 상체 풀 및 코어",
    description: "후면 사슬과 등 근육을 강화하여 바른 자세를 만듭니다.",
    exercises: [
        { id: "d6-1", name: "슈퍼맨 홀드", duration: 30, videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4", videoQuery: "superman hold exercise back", met: 3.5 },
        rest(1),
        { id: "d6-2", name: "Y-T-W 레이즈", duration: 30, videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4", videoQuery: "prone Y T W raise shoulder exercise", met: 3.0 },
        rest(2),
        { id: "d6-3", name: "사이드 플랭크 (왼쪽)", duration: 20, videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4", videoQuery: "side plank exercise core oblique", met: 3.0 },
        rest(3),
        { id: "d6-4", name: "사이드 플랭크 (오른쪽)", duration: 20, videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4", videoQuery: "side plank exercise core oblique", met: 3.0 },
    ]
};

const DAY_7_WORKOUT: WorkoutProgram = {
    id: "day-7-recovery",
    title: "7일차 · 액티브 리커버리",
    description: "부드러운 가동성 운동과 스트레칭으로 몸을 회복합니다.",
    exercises: [
        { id: "d7-1", name: "캣-카우 스트레칭", duration: 40, videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4", videoQuery: "cat cow stretch yoga spine", met: 2.0 },
        rest(1),
        { id: "d7-2", name: "차일드 포즈 (아기 자세)", duration: 40, videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4", videoQuery: "child pose yoga stretch relaxation", met: 2.0 },
        rest(2),
        { id: "d7-3", name: "장요근 스트레칭", duration: 30, videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4", videoQuery: "hip flexor stretch yoga lunge", met: 2.0 },
        rest(3),
        { id: "d7-4", name: "다운독 (견상 자세)", duration: 30, videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4", videoQuery: "downward dog yoga pose stretch", met: 2.5 },
    ]
};

// ════════════════════════════════════════════════════
// ██ 2주차: 근력 강화 — 근력 및 지구력 증진
// ════════════════════════════════════════════════════

const DAY_8_WORKOUT: WorkoutProgram = {
    id: "day-8-lower-power",
    title: "8일차 · 하체 파워",
    description: "점진적인 부하로 대퇴사두근과 둔근의 힘을 키웁니다.",
    exercises: [
        { id: "d8-1", name: "와이드 스쿼트", duration: 35, videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4", videoQuery: "sumo squat exercise wide stance", met: 5.0 },
        rest(1),
        { id: "d8-2", name: "커트시 런지", duration: 35, videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4", videoQuery: "curtsy lunge exercise glute", met: 5.5 },
        rest(2),
        { id: "d8-3", name: "원레그 글루트 브릿지", duration: 30, videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4", videoQuery: "single leg glute bridge exercise", met: 5.0 },
        rest(3),
        { id: "d8-4", name: "스텝업 (가상 박스)", duration: 35, videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4", videoQuery: "step up exercise legs cardio", met: 6.0 },
    ]
};

const DAY_9_WORKOUT: WorkoutProgram = {
    id: "day-9-upper-push-hard",
    title: "9일차 · 푸시 (집중)",
    description: "더 높은 난이도의 변형 동작으로 상체 근력을 강화합니다.",
    exercises: [
        { id: "d9-1", name: "와이드 푸쉬업", duration: 35, videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4", videoQuery: "wide push up chest exercise", met: 6.5 },
        rest(1),
        { id: "d9-2", name: "다이아몬드 푸쉬업", duration: 30, videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4", videoQuery: "diamond push up tricep exercise", met: 6.0 },
        rest(2),
        { id: "d9-3", name: "디클라인 푸쉬업", duration: 30, videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4", videoQuery: "decline push up upper chest exercise", met: 7.0 },
        rest(3),
        { id: "d9-4", name: "플랭크 숄더 탭", duration: 35, videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4", videoQuery: "plank shoulder tap exercise core", met: 4.5 },
    ]
};

const DAY_10_WORKOUT: WorkoutProgram = {
    id: "day-10-hiit-cardio",
    title: "10일차 · 고강도 유산소(HIIT)",
    description: "고강도 인터벌로 체지방을 태우고 심폐 능력을 극대화합니다.",
    exercises: [
        { id: "d10-1", name: "하이 니 (초고속)", duration: 30, videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4", videoQuery: "high knees fast cardio HIIT exercise", met: 9.0 },
        rest(1),
        { id: "d10-2", name: "점핑 잭 (초고속)", duration: 30, videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4", videoQuery: "jumping jacks fast cardio workout", met: 8.5 },
        rest(2),
        { id: "d10-3", name: "마운틴 클라이머 (초고속)", duration: 30, videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4", videoQuery: "mountain climber floor exercise fast ab", met: 9.0 },
        rest(3),
        { id: "d10-4", name: "래터럴 셔플", duration: 30, videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4", videoQuery: "lateral shuffle exercise agility cardio", met: 8.5 },
    ]
};

const DAY_11_WORKOUT: WorkoutProgram = {
    id: "day-11-fullbody-strength",
    title: "11일차 · 전신 근력 강화",
    description: "전신 모든 근육을 동원하는 복합 웨이트 동작입니다.",
    exercises: [
        { id: "d11-1", name: "스쿼트", duration: 35, videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4", videoQuery: "bodyweight squat exercise legs", met: 5.0, poseGuideUrl: squatImg },
        rest(1),
        { id: "d11-2", name: "푸쉬업", duration: 35, videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4", videoQuery: "push up exercise chest strength", met: 6.5, poseGuideUrl: pushupImg },
        rest(2),
        { id: "d11-3", name: "슈퍼맨 홀드", duration: 30, videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4", videoQuery: "superman back extension exercise", met: 3.5 },
        rest(3),
        { id: "d11-4", name: "플랭크 버티기", duration: 40, videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4", videoQuery: "plank core exercise stability", met: 3.5, poseGuideUrl: plankImg },
    ]
};

const DAY_12_WORKOUT: WorkoutProgram = {
    id: "day-12-core-upper",
    title: "12일차 · 코어 및 상체",
    description: "코어 안정성과 상체 지구력을 결합한 트레이닝입니다.",
    exercises: [
        { id: "d12-1", name: "러시안 트위스트", duration: 35, videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4", videoQuery: "russian twist exercise core oblique", met: 4.5 },
        rest(1),
        { id: "d12-2", name: "레그 레이즈", duration: 30, videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4", videoQuery: "leg raise exercise lower abs", met: 4.0 },
        rest(2),
        { id: "d12-3", name: "푸쉬업 투 사이드 플랭크", duration: 35, videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4", videoQuery: "push up to side plank exercise", met: 6.0 },
        rest(3),
        { id: "d12-4", name: "플러터 킥", duration: 30, videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4", videoQuery: "flutter kick exercise lower ab core", met: 4.0 },
    ]
};

const DAY_13_WORKOUT: WorkoutProgram = {
    id: "day-13-lower-core",
    title: "13일차 · 하체 및 코어",
    description: "코어 안정화를 유지하며 하체 파워를 쏟아냅니다.",
    exercises: [
        { id: "d13-1", name: "점프 스쿼트", duration: 30, videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4", videoQuery: "jump squat exercise plyometric legs", met: 8.0 },
        rest(1),
        { id: "d13-2", name: "워킹 런지", duration: 35, videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4", videoQuery: "walking lunge exercise legs fitness", met: 5.5 },
        rest(2),
        { id: "d13-3", name: "할로우 바디 홀드", duration: 30, videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4", videoQuery: "hollow body hold exercise core gymnastics", met: 3.5 },
        rest(3),
        { id: "d13-4", name: "글루트 브릿지 펄스", duration: 35, videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4", videoQuery: "glute bridge pulse exercise booty", met: 4.5 },
    ]
};

const DAY_14_WORKOUT: WorkoutProgram = {
    id: "day-14-recovery",
    title: "14일차 · 액티브 리커버리",
    description: "깊은 스트레칭과 가동성 운동으로 몸의 긴장을 풉니다.",
    exercises: [
        { id: "d14-1", name: "월드 그레이티스트 스트레칭 (L)", duration: 30, videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4", videoQuery: "worlds greatest stretch exercise mobility", met: 2.5 },
        rest(1),
        { id: "d14-2", name: "월드 그레이티스트 스트레칭 (R)", duration: 30, videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4", videoQuery: "worlds greatest stretch lunge rotation", met: 2.5 },
        rest(2),
        { id: "d14-3", name: "피죤 포즈 (왼쪽)", duration: 35, videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4", videoQuery: "pigeon pose yoga hip flexor stretch", met: 2.0 },
        rest(3),
        { id: "d14-4", name: "피죤 포즈 (오른쪽)", duration: 35, videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4", videoQuery: "pigeon pose yoga hip stretch", met: 2.0 },
    ]
};

// ════════════════════════════════════════════════════
// ██ 3주차: 도전 단계 — 고강도 HIIT 및 파워
// ════════════════════════════════════════════════════

const DAY_15_WORKOUT: WorkoutProgram = {
    id: "day-15-hiit-fullbody",
    title: "15일차 · 전신 HIIT",
    description: "최대 강도로 지방을 태우고 폭발적인 파워를 생성합니다.",
    exercises: [
        { id: "d15-1", name: "버피 테스트", duration: 30, videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4", videoQuery: "burpees exercise HIIT full body", met: 10.0, poseGuideUrl: burpeeImg },
        restLong(1),
        { id: "d15-2", name: "점프 스쿼트", duration: 30, videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4", videoQuery: "squat jump plyometric exercise power", met: 9.5, poseGuideUrl: squatImg },
        restLong(2),
        { id: "d15-3", name: "마운틴 클라이머", duration: 30, videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4", videoQuery: "mountain climber floor exercise ab", met: 9.0, poseGuideUrl: mountainImg },
        restLong(3),
        { id: "d15-4", name: "하이 니 스프린트", duration: 30, videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4", videoQuery: "high knees sprint fast cardio HIIT", met: 10.0 },
    ]
};

const DAY_16_WORKOUT: WorkoutProgram = {
    id: "day-16-upper-power",
    title: "16일차 · 상체 파워",
    description: "최대 출력을 위한 폭발적인 상체 트레이닝입니다.",
    exercises: [
        { id: "d16-1", name: "익스플로시브 푸쉬업", duration: 30, videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4", videoQuery: "explosive push up plyometric clap chest", met: 7.5, poseGuideUrl: pushupImg },
        restLong(1),
        { id: "d16-2", name: "와이드 푸쉬업", duration: 35, videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4", videoQuery: "wide push up chest exercise", met: 6.5, poseGuideUrl: pushupImg },
        restLong(2),
        { id: "d16-3", name: "파이크 푸쉬업", duration: 30, videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4", videoQuery: "pike push up shoulder press exercise", met: 5.5, poseGuideUrl: pushupImg },
        restLong(3),
        { id: "d16-4", name: "삼두 딥스", duration: 35, videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4", videoQuery: "tricep dips bench chair exercise arms", met: 5.0 },
    ]
};

const DAY_17_WORKOUT: WorkoutProgram = {
    id: "day-17-lower-hiit",
    title: "17일차 · 하체 HIIT",
    description: "폭발적인 하체 동작으로 극한의 지구력을 테스트합니다.",
    exercises: [
        { id: "d17-1", name: "점프 스쿼트", duration: 30, videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4", videoQuery: "jump squat plyometric legs power", met: 9.5 },
        restLong(1),
        { id: "d17-2", name: "스피드 스케이터", duration: 30, videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4", videoQuery: "speed skater lateral jump exercise", met: 8.5 },
        restLong(2),
        { id: "d17-3", name: "점핑 런지", duration: 30, videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4", videoQuery: "jumping lunge plyometric leg exercise", met: 9.0 },
        restLong(3),
        { id: "d17-4", name: "버트 킥 스프린트", duration: 30, videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4", videoQuery: "butt kicks sprint fast cardio exercise", met: 8.5 },
    ]
};

const DAY_18_WORKOUT: WorkoutProgram = {
    id: "day-18-fullbody-circuit",
    title: "18일차 · 전신 서킷",
    description: "쉬지 않고 전신 모든 근육을 자타격하는 극한 서킷입니다.",
    exercises: [
        { id: "d18-1", name: "버피 테스트", duration: 30, videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4", videoQuery: "burpees full body HIIT exercise", met: 10.0 },
        restLong(1),
        { id: "d18-2", name: "푸쉬업", duration: 30, videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4", videoQuery: "push up exercise chest strength", met: 6.5 },
        restLong(2),
        { id: "d18-3", name: "점프 스쿼트", duration: 30, videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4", videoQuery: "squat jump plyometric explosive legs", met: 9.5 },
        restLong(3),
        { id: "d18-4", name: "플랭크 홀드", duration: 40, videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4", videoQuery: "plank hold core stability exercise", met: 3.5 },
    ]
};

const DAY_19_WORKOUT: WorkoutProgram = {
    id: "day-19-core-hiit",
    title: "19일차 · 코어 및 HIIT",
    description: "심박수를 높게 유지하며 복부 근육을 정밀 타격합니다.",
    exercises: [
        { id: "d19-1", name: "마운틴 클라이머", duration: 30, videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4", videoQuery: "mountain climber floor exercise ab", met: 9.0 },
        restLong(1),
        { id: "d19-2", name: "바이시클 크런치", duration: 35, videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4", videoQuery: "bicycle crunches abs core exercise", met: 5.0 },
        restLong(2),
        { id: "d19-3", name: "할로우 바디 홀드", duration: 35, videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4", videoQuery: "hollow body hold core exercise", met: 3.5 },
        restLong(3),
        { id: "d19-4", name: "하이 니", duration: 30, videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4", videoQuery: "high knees fast cardio HIIT", met: 9.0 },
    ]
};

const DAY_20_WORKOUT: WorkoutProgram = {
    id: "day-20-fullbody-power",
    title: "20일차 · 전신 파워",
    description: "모든 에너지를 쏟아붓는 최종 마무리 파워 세션입니다.",
    exercises: [
        { id: "d20-1", name: "버피 테스트", duration: 35, videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4", videoQuery: "burpees jump full body power exercise", met: 10.0 },
        restLong(1),
        { id: "d20-2", name: "익스플로시브 푸쉬업", duration: 30, videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4", videoQuery: "explosive clap push up plyometric chest", met: 7.5 },
        restLong(2),
        { id: "d20-3", name: "점프 스쿼트", duration: 35, videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4", videoQuery: "jump squat explosive legs power", met: 9.5 },
        restLong(3),
        { id: "d20-4", name: "마운틴 클라이머", duration: 35, videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4", videoQuery: "mountain climber floor exercise ab", met: 9.0 },
    ]
};

const DAY_21_WORKOUT: WorkoutProgram = {
    id: "day-21-celebration",
    title: "21일차 · 파이널 보스 🎉",
    description: "여정의 마침표! 당신의 놀라운 변화를 자축하세요!",
    exercises: [
        { id: "d21-1", name: "점프 스쿼트", duration: 30, videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4", videoQuery: "squat jump plyometric power legs", met: 9.5 },
        rest(1),
        { id: "d21-2", name: "푸쉬업", duration: 30, videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4", videoQuery: "push up exercise chest strength", met: 6.5 },
        rest(2),
        { id: "d21-3", name: "버피 테스트", duration: 30, videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4", videoQuery: "burpees full body HIIT exercise", met: 10.0 },
        rest(3),
        { id: "d21-4", name: "플랭크 홀드", duration: 45, videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4", videoQuery: "plank core hold stability exercise", met: 3.5 },
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
