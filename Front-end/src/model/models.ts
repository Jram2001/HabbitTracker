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

export interface GetTodosResponse {
    success: boolean;
    data: TodoItem[];
    count: number;
}
export interface TodoEntry {
    title: string;
    date: string;
}
export interface TodoItem {
    _id: string;
    userId: string;
    todoData: TodoEntry[]
}

export interface getTodoResponse {
    success: boolean;
    data: TodoItem[];
    count: number;
}
