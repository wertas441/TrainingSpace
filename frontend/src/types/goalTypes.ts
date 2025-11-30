
export type GoalPriority = 'Низкий' | 'Средний' | 'Высокий' ;

export interface GoalsStructure {
    id: number;
    name: string;
    description: string;
    priority: GoalPriority;
}

export interface CompleteGoalsStructure {
    id: number;
    name: string;
    description: string;
    achieve_at: string;
}


export interface GoalShortyStructure {
    id: number;
    name: string;
}