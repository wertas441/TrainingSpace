import { create, type StateCreator } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

interface GlobalStatisticsData {
    addedDays: number;
    addedTrainings: number;
    goalCompleted: number;
    addedActivity: number;
}

interface StatisticStore {
    globalStatistics: GlobalStatisticsData;
    initGlobalStatistics: () => void;
    getGlobalStatistics: () => GlobalStatisticsData;
    addNewDay: () => void;
    addNewTraining: () => void;
    completeGoal: () => void;
    addNewActivity: () => void;
}

const initialState = {
    globalStatistics: {
        addedDays: 0,
        addedTrainings: 0,
        goalCompleted: 0,
        addedActivity: 0,
    },
}

const statisticStore: StateCreator<StatisticStore> = (set, get) => ({
    ...initialState,
    initGlobalStatistics: () => get().globalStatistics,
    getGlobalStatistics: () => get().globalStatistics,
    addNewDay: () =>
        set((s) => ({
            globalStatistics: {
                ...s.globalStatistics,
                addedDays: s.globalStatistics.addedDays + 1,
            },
        })),
    addNewTraining: () =>
        set((s) => ({
            globalStatistics: {
                ...s.globalStatistics,
                addedTrainings: s.globalStatistics.addedTrainings + 1,
            },
        })),
    completeGoal: () =>
        set((s) => ({
            globalStatistics: {
                ...s.globalStatistics,
                goalCompleted: s.globalStatistics.goalCompleted + 1,
            },
        })),
    addNewActivity: () =>
        set((s) => ({
            globalStatistics: {
                ...s.globalStatistics,
                addedActivity: s.globalStatistics.addedActivity + 1,
            },
        })),
})

export const useStatisticStore = create<StatisticStore>()(
    persist(statisticStore, {
        name: 'statisticStore',
        storage: createJSONStorage(() => localStorage),
    }),
)

// селекторы
export const globalStatisticInfo = (state: StatisticStore) => state.globalStatistics

