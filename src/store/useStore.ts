import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { db } from '../firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { getWorkoutForDay } from '../data/workouts';

interface PenguinState {
    mood: 'happy' | 'sad' | 'hungry' | 'sleeping';
    friendshipLevel: number;
    xp: number;
    nextLevelXp: number;
    name: string;
    lastInteractionTime: string;
    ownedItems: string[];
    equippedItems: {
        hat?: string;
        glasses?: string;
        accessory?: string;
        background?: string;
    };
    dailyTouchXp: number;
    lastTouchDate: string;
    workoutsCompletedToday: number;
    justLeveledUp: boolean; // 🎉 레벨업 폭죽 트리거
}

interface WorkoutSession {
    day: number;
    completedAt: string;
    workoutId: string;
    calories: number;
    duration: number;
}

interface UserState {
    streak: number;
    currentDay: number;
    hasPremium: boolean;
    history: WorkoutSession[];
    badges: string[];
    weight_kg: number;
}

interface AppStore {
    user: any;
    userState: UserState;
    penguin: PenguinState;
    setUser: (user: any) => void;
    setUserState: (state: Partial<UserState>) => void;
    setPenguin: (state: Partial<PenguinState>) => void;
    feedPenguin: () => void;
    interactWithPipi: () => void;
    completeWorkout: () => void;
    syncWithFirestore: () => Promise<void>;
    fetchFromFirestore: () => Promise<void>;
    renameToPipi: () => void;
    buyItem: (itemId: string, price: number) => boolean;
    equipItem: (category: string, itemId: string | undefined) => void;
    resetStore: () => void;
    checkAndUpdateMood: () => void;
    clearLevelUp: () => void;
}

export const useStore = create<AppStore>()(
    persist(
        (set) => ({
            user: null,
            userState: {
                streak: 0,
                currentDay: 1,
                hasPremium: false,
                history: [],
                badges: [],
                weight_kg: 70,
            },
            penguin: {
                mood: 'happy',
                friendshipLevel: 1,
                xp: 0,
                nextLevelXp: 100,
                name: 'pipi',
                lastInteractionTime: new Date().toISOString(),
                ownedItems: [],
                equippedItems: {},
                dailyTouchXp: 0,
                lastTouchDate: new Date().toDateString(),
                workoutsCompletedToday: 0,
                justLeveledUp: false,
            },
            setUser: (user) => set({ user }),
            setUserState: (state) => set((prev) => ({ userState: { ...prev.userState, ...state } })),
            setPenguin: (state) => set((prev) => ({ penguin: { ...prev.penguin, ...state } })),
            feedPenguin: () => set((prev) => ({ penguin: { ...prev.penguin, mood: 'happy' } })),
            resetStore: () => set({
                userState: {
                    streak: 0,
                    currentDay: 1,
                    hasPremium: false,
                    history: [],
                    badges: [],
                    weight_kg: 70,
                },
                penguin: {
                    mood: 'happy',
                    friendshipLevel: 1,
                    xp: 0,
                    nextLevelXp: 100,
                    name: 'pipi',
                    lastInteractionTime: new Date().toISOString(),
                    ownedItems: [],
                    equippedItems: {},
                    dailyTouchXp: 0,
                    lastTouchDate: new Date().toDateString(),
                    workoutsCompletedToday: 0,
                    justLeveledUp: false,
                }
            }),
            clearLevelUp: () => {
                const prev = useStore.getState();
                set({ penguin: { ...prev.penguin, justLeveledUp: false } });
            },
            // 피피 기분 자동 변화 시스템 편제하다!
            // lastInteractionTime 기준 경과 시간으로 Mood 자동 업데이트
            checkAndUpdateMood: () => {
                const prev = useStore.getState();
                const lastTime = new Date(prev.penguin.lastInteractionTime).getTime();
                const now = Date.now();
                const hoursElapsed = (now - lastTime) / (1000 * 60 * 60);

                let newMood: PenguinState['mood'];

                if (hoursElapsed < 3) {
                    newMood = 'happy';      // 3시간 이내: 행복한 피피
                } else if (hoursElapsed < 8) {
                    newMood = 'sad';        // 3-8시간: 조금 외로워...
                } else if (hoursElapsed < 24) {
                    newMood = 'hungry';     // 8-24시간: 많이 방치됨
                } else {
                    newMood = 'sleeping';   // 24시간+: 완전 방치
                }

                // 모드가 실제로 바뀌는 경우에만 업데이트 (업데이트 폭풍 방지)
                if (newMood !== prev.penguin.mood) {
                    set({ penguin: { ...prev.penguin, mood: newMood } });
                    // Firestore에도 반영 (주요 변화만 sync)
                    setTimeout(() => useStore.getState().syncWithFirestore(), 500);
                }
            },
            interactWithPipi: () => {
                const today = new Date().toDateString();
                const prev = useStore.getState();
                const isNewDay = prev.penguin.lastTouchDate !== today;

                // 새로운 날이면 일일 터치 XP 및 운동 횟수 초기화
                const currentDailyXp = isNewDay ? 0 : (prev.penguin.dailyTouchXp ?? 0);
                const currentWorkoutsToday = isNewDay ? 0 : (prev.penguin.workoutsCompletedToday ?? 0);

                // 상한치: 기본 5번(25 XP) + (오늘 완료한 루틴 수 * 10번(50 XP))
                const maxTouchXp = 25 + (currentWorkoutsToday * 50);

                if (currentDailyXp >= maxTouchXp) {
                    // 상한치 도달 - XP는 안 오르고 기분만 좋아짐
                    set({
                        penguin: {
                            ...prev.penguin,
                            mood: 'happy',
                            dailyTouchXp: currentDailyXp,
                            workoutsCompletedToday: currentWorkoutsToday,
                            lastTouchDate: today,
                            lastInteractionTime: new Date().toISOString()
                        }
                    });
                    return; // XP 증가 없이 바로 종료
                }

                const xpGain = 5;
                const newXp = prev.penguin.xp + xpGain;
                let level = prev.penguin.friendshipLevel;
                let nextXp = prev.penguin.nextLevelXp;
                let didLevelUp = false;

                if (newXp >= nextXp) {
                    level += 1;
                    nextXp = Math.floor(nextXp * 1.5);
                    didLevelUp = true; // 🎉 레벨업!
                }

                set({
                    penguin: {
                        ...prev.penguin,
                        mood: 'happy',
                        xp: newXp,
                        friendshipLevel: level,
                        nextLevelXp: nextXp,
                        dailyTouchXp: currentDailyXp + xpGain,
                        workoutsCompletedToday: currentWorkoutsToday,
                        lastTouchDate: today,
                        lastInteractionTime: new Date().toISOString(),
                        justLeveledUp: didLevelUp, // 📡 Dashboard에 신호 전달
                    }
                });

                // ✅ 핵심 수정: Firestore에도 즉시 sync해서 새로고침 시에도 상한치 유지
                useStore.getState().syncWithFirestore();
            },
            completeWorkout: () => set((prev) => {
                // 현재 Day에 맞는 루틴으로 칼로리 계산!
                const program = getWorkoutForDay(prev.userState.currentDay);
                let totalCalories = 0;
                let totalDuration = 0;

                // weight_kg가 없을 경우 기본값 70kg 적용
                const weight = prev.userState.weight_kg ?? 70;

                program.exercises.forEach((ex: any) => {
                    if (!ex.isRest && ex.met) {
                        // Formula: Calorie = (MET * 3.5 * weight / 200) * minutes
                        const minutes = ex.duration / 60;
                        totalCalories += (ex.met * 3.5 * weight / 200) * minutes;
                    }
                    totalDuration += ex.duration;
                });

                const newSession: WorkoutSession = {
                    day: prev.userState.currentDay,
                    completedAt: new Date().toISOString(),
                    workoutId: program.id,
                    calories: Math.round(totalCalories),
                    duration: totalDuration
                };

                const newXpTotal = prev.penguin.xp + 100;
                let level = prev.penguin.friendshipLevel;
                let nextLevelXp = prev.penguin.nextLevelXp;

                if (newXpTotal >= nextLevelXp) {
                    level += 1;
                    nextLevelXp = Math.floor(nextLevelXp * 1.5);
                }

                // 새로운 날 체크 (터치 상한치 로직과 동일)
                const today = new Date().toDateString();
                const isNewDay = prev.penguin.lastTouchDate !== today;
                const dailyWorkouts = isNewDay ? 1 : (prev.penguin.workoutsCompletedToday ?? 0) + 1;

                // Achievement logic
                const newBadges = [...(prev.userState.badges ?? [])];
                const newStreakValue = (prev.userState.streak ?? 0) + 1;

                if (newStreakValue === 3 && !newBadges.includes('streak-3')) newBadges.push('streak-3');
                if (newStreakValue === 7 && !newBadges.includes('streak-7')) newBadges.push('streak-7');
                if (level === 5 && !newBadges.includes('pipi-friend')) newBadges.push('pipi-friend');

                return {
                    userState: {
                        ...prev.userState,
                        streak: newStreakValue,
                        currentDay: (prev.userState.currentDay ?? 1) + 1,
                        history: [...(prev.userState.history ?? []), newSession],
                        badges: newBadges
                    },
                    penguin: {
                        ...prev.penguin,
                        mood: 'happy',
                        friendshipLevel: level,
                        xp: newXpTotal,
                        nextLevelXp: nextLevelXp,
                        workoutsCompletedToday: dailyWorkouts,
                        lastTouchDate: today
                    }
                };
            }),

            syncWithFirestore: async () => {
                const { user, userState, penguin } = useStore.getState();
                if (!user?.uid) return;

                try {
                    await setDoc(doc(db, 'users', user.uid), {
                        userState,
                        penguin,
                        updatedAt: new Date().toISOString()
                    }, { merge: true });
                    console.log("Firestore sync successful!");
                } catch (error) {
                    console.error("Firestore sync failed:", error);
                }
            },
            fetchFromFirestore: async () => {
                const { user, penguin: localPenguin } = useStore.getState();
                if (!user?.uid) return;

                try {
                    const docSnap = await getDoc(doc(db, 'users', user.uid));
                    if (docSnap.exists()) {
                        const data = docSnap.data();
                        const remotePenguin = data.penguin;

                        // ✅ 핵심 수정: 로컬의 dailyTouchXp가 더 크면 (오늘 세션) 그걸 유지
                        // Firestore sync 지연으로 낡은 데이터가 덮어쓰는 걸 방지
                        const today = new Date().toDateString();
                        const localIsToday = localPenguin.lastTouchDate === today;
                        const remoteIsToday = remotePenguin?.lastTouchDate === today;

                        const mergedDailyTouchXp = (
                            localIsToday && remoteIsToday
                                ? Math.max(localPenguin.dailyTouchXp ?? 0, remotePenguin?.dailyTouchXp ?? 0)
                                : (remoteIsToday ? remotePenguin?.dailyTouchXp ?? 0 : (localIsToday ? localPenguin.dailyTouchXp ?? 0 : 0))
                        );
                        const mergedWorkoutsToday = (
                            localIsToday && remoteIsToday
                                ? Math.max(localPenguin.workoutsCompletedToday ?? 0, remotePenguin?.workoutsCompletedToday ?? 0)
                                : (remoteIsToday ? remotePenguin?.workoutsCompletedToday ?? 0 : (localIsToday ? localPenguin.workoutsCompletedToday ?? 0 : 0))
                        );

                        set({
                            userState: data.userState,
                            penguin: {
                                ...remotePenguin,
                                dailyTouchXp: mergedDailyTouchXp,
                                workoutsCompletedToday: mergedWorkoutsToday,
                                lastTouchDate: (localIsToday || remoteIsToday) ? today : (remotePenguin?.lastTouchDate ?? today)
                            }
                        });
                        console.log("Firestore data fetched! (dailyTouchXp preserved)");
                        useStore.getState().renameToPipi();
                    }
                } catch (error) {
                    console.error("Firestore fetch failed:", error);
                }
            },
            renameToPipi: () => set((state) => {
                if (state.penguin.name.toLowerCase() === 'pengo') {
                    return { penguin: { ...state.penguin, name: 'pipi' } };
                }
                return state;
            }),
            buyItem: (itemId, price) => {
                const state = useStore.getState();
                if (state.penguin.xp >= price && !(state.penguin.ownedItems ?? []).includes(itemId)) {
                    set((prev) => ({
                        penguin: {
                            ...prev.penguin,
                            xp: prev.penguin.xp - price,
                            ownedItems: [...(prev.penguin.ownedItems ?? []), itemId]
                        }
                    }));
                    state.syncWithFirestore();
                    return true;
                }
                return false;
            },
            equipItem: (category, itemId) => {
                set((prev) => ({
                    penguin: {
                        ...prev.penguin,
                        equippedItems: {
                            ...prev.penguin.equippedItems,
                            [category]: itemId
                        }
                    }
                }));
                useStore.getState().syncWithFirestore();
            }
        }),
        {
            name: 'penguin-fit-storage',
            partialize: (state) => ({
                userState: state.userState,
                penguin: state.penguin
            }), // Don't persist the 'user' object (Firebase handles that)
            onRehydrateStorage: () => (state) => {
                if (state) {
                    state.renameToPipi();
                }
            }
        }
    )
);
