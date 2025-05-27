export interface AlternativeActivityApiResponse {
    data: {
        data: ActivityData[];
        title: string;
    };
}

export interface ActivityData {
    title: string;
    activities: string[]; // Array of activity items
    // If the structure is different and title is separate from activities:
    // Or if it's just an array: ActivityItem[]
}