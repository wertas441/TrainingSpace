
export type GoalPriority = 'Низкий' | 'Средний' | 'Высокий' ;

export interface GoalsStructure {
    id: number;
    publicId: string;
    name: string;
    description: string;
    priority: GoalPriority;
}

export interface GoalFormValues {
    goalName: string;
    goalDescription: string;
    goalPriority: GoalPriority;
}

export interface CompleteGoalsStructure {
    id: number;
    publicId: string;
    name: string;
    description: string;
    achieve_at: string;
}


export interface GoalShortyStructure {
    id: number;
    publicId: string;
    name: string;
}