
export {useCompletedGoals, useGoals} from './model/data'

export {
    useCompleteGoalMutation,
    useCreateGoalMutation,
    useUpdateGoalMutation,
    useDeleteGoalMutation
} from './model/mutation'

export {
    getCompleteGoalList,
    getGoalList,
    getGoalInformation,
    getGoalShortyList,
    createGoal,
    deleteGoal,
    updateGoal,
    completeGoal,
} from './model/controller'

export {
    validateGoalDescription,
    validateGoalName,
    validateGoalPriority
} from './model/validation'

export type {
    GoalPriority,
    GoalShortyStructure,
    GoalsStructure,
    GoalForm,
    CompleteGoalsStructure
} from './model/type'

export {
    CompleteGoalRow,
    GoalRow,
    GoalsHeader,
} from './ui'