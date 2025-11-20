export interface AddNewGoalFrontendStructure {
    name: string;
    description: string;
    priority: 'Низкий' | 'Средний' | 'Высокий';
}

export type GoalPriority = 'Низкий' | 'Средний' | 'Высокий' ;
