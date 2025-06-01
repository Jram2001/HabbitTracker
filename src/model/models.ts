export interface AlternativeActivityApiResponse {
    data: {
        data: ActivityData[];
        title: string;
    };
}

export interface ActivityData {
    title: string;
    activity: string[];
    habitId: string
}