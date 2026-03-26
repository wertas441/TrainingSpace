
export type GoalPriority = 'Низкий' | 'Средний' | 'Высокий' ;

export interface GoalForm {
    name: string;
    description: string;
    priority: GoalPriority;
}

export interface GoalShortyStructure {
    id: number;
    publicId: string;
    name: string;
}

export interface GoalsStructure extends GoalShortyStructure {
    description: string;
    priority: GoalPriority;
}

export interface CompleteGoalsStructure extends GoalShortyStructure {
    description: string;
    achieve_at: string;
}

