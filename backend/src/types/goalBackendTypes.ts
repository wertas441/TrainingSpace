
export type GoalPriority = 'Низкий' | 'Средний' | 'Высокий' ;

export interface AddNewGoalFrontendStructure {
    name: string;
    description: string;
    priority: GoalPriority;
}


export interface CreateGoalFrontendStructure extends AddNewGoalFrontendStructure {
    user_id: number;
}

export interface GoalListFrontendResponse extends AddNewGoalFrontendStructure {
    id: number;
}

export interface CompleteGoalListFrontendResponse extends GoalListFrontendResponse {
    achieve_at: string;
}

export interface GoalShortyFrontendResponse {
    id: number;
    name: string;
}

export interface GoalUpdateFrontendResponse extends AddNewGoalFrontendStructure {
    userId: number;
    goalId: number;
}

export interface GoalUpdateFrontendStructure extends AddNewGoalFrontendStructure {
    goalId: number;
}