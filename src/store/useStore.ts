import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { db } from '../firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';

interface PenguinState {
    mood: 'happy' | 'sad' | 'hungry' | 'sleeping';
    friendshipLevel: number;
    name: string;
}

interface WorkoutSession {
    day: number;
    completedAt: string;
    workoutId: string;
}

interface UserState {
    streak: number;
    currentDay: number;
    hasPremium: boolean;
    history: WorkoutSession[];
}

interface AppStore {
    user: any;
    userState: UserState;
    penguin: PenguinState;
    setUser: (user: any) => void;
    setUserState: (state: Partial<UserState>) => void;
    setPenguin: (state: Partial<PenguinState>) => void;
    feedPenguin: () => void;
    completeWorkout: () => void;
    syncWithFirestore: () => Promise<void>;
    fetchFromFirestore: () => Promise<void>;
    renameToPipi: () => void;
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
            },
            penguin: {
                mood: 'sad',
                friendshipLevel: 1,
                name: 'pipi',
            },
            setUser: (user) => set({ user }),
            setUserState: (state) => set((prev) => ({ userState: { ...prev.userState, ...state } })),
            setPenguin: (state) => set((prev) => ({ penguin: { ...prev.penguin, ...state } })),
            feedPenguin: () => set((prev) => ({ penguin: { ...prev.penguin, mood: 'happy' } })),
            completeWorkout: () => set((prev) => {
                const newSession: WorkoutSession = {
                    day: prev.userState.currentDay,
                    completedAt: new Date().toISOString(),
                    workoutId: 'day-' + prev.userState.currentDay
                };
                return {
                    userState: {
                        ...prev.userState,
                        streak: prev.userState.streak + 1,
                        currentDay: prev.userState.currentDay + 1,
                        history: [...prev.userState.history, newSession]
                    },
                    penguin: { ...prev.penguin, mood: 'happy', friendshipLevel: prev.penguin.friendshipLevel + 1 }
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
            })
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
