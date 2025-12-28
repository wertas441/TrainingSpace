import { create, type StateCreator } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware/persist'

interface GlobalStatisticsData {
    addedDays: number;
    addedTrainings: number;
    goalCompleted: number;
    addedActivity: number;
}

interface GlobalStatistics {
    data: GlobalStatisticsData;
}

interface StatisticStore {
    globalStatistics: GlobalStatistics;
    getGlobalStatistics: () => GlobalStatisticsData;
}

const initialState = {
    globalStatistics: {
        data: {
            addedDays: 0,
            addedTrainings: 0,
            goalCompleted: 0,
            addedActivity: 0,
        },
    },
}

const statisticStore: StateCreator<StatisticStore> = (_set, get) => ({
    ...initialState,
    getGlobalStatistics: () => get().globalStatistics.data,

})

export const useStatisticStore = create<StatisticStore>()(
    persist(statisticStore, {
        name: 'statisticStore',
        storage: createJSONStorage(() => localStorage),
    }),
)

// Мне нужен селектор для получения данных и все
export const globalStatisticInfo = (state: StatisticStore) => state.globalStatistics.data

