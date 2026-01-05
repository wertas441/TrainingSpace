
export type GoalPriority = 'Низкий' | 'Средний' | 'Высокий' ;

export interface AddNewGoalFrontendStructure {
    name: string;
    description: string;
    priority: GoalPriority;
}


export interface CreateGoalFrontendStructure extends AddNewGoalFrontendStructure {
    userId: number;
}

export interface GoalListFrontendResponse extends AddNewGoalFrontendStructure {
    id: number;
    publicId: string;
}

export interface CompleteGoalListFrontendResponse extends GoalListFrontendResponse {
    achieve_at: string;
}

export interface GoalShortyFrontendResponse {
    id: number;
    publicId: string;
    name: string;
}

export interface GoalUpdateFrontendResponse extends AddNewGoalFrontendStructure {
    userId: number;
    goalId: string;
}

export interface GoalUpdateFrontendStructure extends AddNewGoalFrontendStructure {
    goalId: string;
}