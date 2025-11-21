export interface AddNewGoalFrontendStructure {
    name: string;
    description: string;
    priority: 'Низкий' | 'Средний' | 'Высокий';
}

export type GoalPriority = 'Низкий' | 'Средний' | 'Высокий' ;

export interface CreateGoalFrontendStructure {
    user_id: number;
    name: string;
    description: string;
    priority: GoalPriority;
}

export interface GoalListFrontendResponse {
    id: number;
    name: string;
    description: string | null;
    priority: GoalPriority;
}