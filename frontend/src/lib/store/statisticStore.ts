import { create, type StateCreator } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware/persist'

interface GlobalStatistics {
    addedDays: number;
    addedTrainings: number;
    goalCompleted: number;
    addedActivity: number;
}

interface StatisticStore {
    globalStatistics: GlobalStatistics;
    getGlobalStatistics: () => GlobalStatistics;
}

const initialState = {
    globalStatistics: {
        addedDays: 0,
        addedTrainings: 0,
        goalCompleted: 0,
        addedActivity: 0,
    },
}

const statisticStore: StateCreator<StatisticStore> = (_set, get) => ({
    ...initialState,
    getGlobalStatistics: () => get().globalStatistics,

})

export const useStatisticStore = create<StatisticStore>()(
    persist(statisticStore, {
        name: 'statisticStore',
        storage: createJSONStorage(() => localStorage),
    }),
)

// Селектор для быстрого доступа к globalStatistics
export const globalStatisticInfo = (state: StatisticStore) => state.globalStatistics

