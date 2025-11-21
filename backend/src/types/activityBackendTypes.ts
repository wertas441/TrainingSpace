

export interface AddActivityFrontendRequest {
    activity_name: string;
    description: string;
    activity_type: ActivityTypeStructure;
    activity_difficult: ActivityDifficultyStructure;
    training_id: number;
    performed_at: string;
}

export type ActivityTypeStructure = 'Силовая' | 'Кардио' | 'Комбинированный';

export type ActivityDifficultyStructure = 'Лёгкая' | 'Средняя' | 'Тяжелая';