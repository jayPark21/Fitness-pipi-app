import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { db } from '../firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { DAY_1_WORKOUT } from '../data/workouts';

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
            },
            setUser: (user) => set({ user }),
            setUserState: (state) => set((prev) => ({ userState: { ...prev.userState, ...state } })),
            setPenguin: (state) => set((prev) => ({ penguin: { ...prev.penguin, ...state } })),
            feedPenguin: () => set((prev) => ({ penguin: { ...prev.penguin, mood: 'happy' } })),
            interactWithPipi: () => set((prev) => {
                const newXp = prev.penguin.xp + 5;
                let level = prev.penguin.friendshipLevel;
                let nextXp = prev.penguin.nextLevelXp;

                if (newXp >= nextXp) {
                    level += 1;
                    nextXp = Math.floor(nextXp * 1.5);
                }

                return {
                    penguin: {
                        ...prev.penguin,
                        mood: 'happy',
                        xp: newXp,
                        friendshipLevel: level,
                        nextLevelXp: nextXp,
                        lastInteractionTime: new Date().toISOString()
                    }
                };
            }),
            completeWorkout: () => set((prev) => {
                const program = DAY_1_WORKOUT; // Should ideally be passed, but for now...
                let totalCalories = 0;
                let totalDuration = 0;

                program.exercises.forEach((ex: any) => {
                    if (!ex.isRest && ex.met) {
                        // Formula: Calorie = (MET * 3.5 * weight / 200) * minutes
                        const minutes = ex.duration / 60;
                        totalCalories += (ex.met * 3.5 * prev.userState.weight_kg / 200) * minutes;
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

                const newXpValue = prev.penguin.xp + 100;
                let level = prev.penguin.friendshipLevel;
                let nextXp = prev.penguin.nextLevelXp;

                if (newXpValue >= nextXp) {
                    level += 1;
                    nextXp = Math.floor(nextXp * 1.5);
                }

                // Achievement logic
                const newBadges = [...prev.userState.badges];
                const newStreak = prev.userState.streak + 1;

                if (newStreak === 3 && !newBadges.includes('streak-3')) newBadges.push('streak-3');
                if (newStreak === 7 && !newBadges.includes('streak-7')) newBadges.push('streak-7');
                if (level === 5 && !newBadges.includes('pipi-friend')) newBadges.push('pipi-friend');

                return {
                    userState: {
                        ...prev.userState,
                        streak: newStreak,
                        currentDay: prev.userState.currentDay + 1,
                        history: [...prev.userState.history, newSession],
                        badges: newBadges
                    },
                    penguin: {
                        ...prev.penguin,
                        mood: 'happy',
                        friendshipLevel: level,
                        xp: newXpValue,
                        nextLevelXp: nextXp
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
                const { user } = useStore.getState();
                if (!user?.uid) return;

                try {
                    const docSnap = await getDoc(doc(db, 'users', user.uid));
                    if (docSnap.exists()) {
                        const data = docSnap.data();
                        set({
                            userState: data.userState,
                            penguin: data.penguin
                        });
                        console.log("Firestore data fetched!");
                        // Ensure name is migrated after fetch
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
