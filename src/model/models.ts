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

export interface TodoData {
    title: string;
    date: string; // ISO string format (e.g., "2025-06-01T00:00:00.000Z")
}

export interface TodoItem {
    _id: string;      // MongoDB ObjectId as a string
    userId: string;   // ObjectId as string
    todoData: TodoData;
}

export interface GetTodosResponse {
    success: boolean;
    data: TodoItem[];
    count: number;
}