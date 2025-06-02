import { useEffect, useState } from 'react';
import './repetingtodo.component.scss';
import { get } from '../../../services/api-mothod-service';
import type { GetTodosResponse } from '../../../model/models';

const RepetingTodo: React.FC = ({ }) => {

    useEffect(() => {
        fetchUserTodo();
    }, []);

    const [todoData, setTodoData] = useState();

    const fetchUserTodo = async () => {
        try {
            const response = await get('/todo/getTodoData', {
                userId: '68318d48493cd55bd1a13ef4'
            }).then((todoData: any) => {
                console.log(todoData)
            }).catch((err) => { console.error("Error fetching todo data", err) });
        } catch (error) {
            console.error('Error in fetching activity data', error);
        }
    };

    const repetingTodo = [
        "read book",
        "saatu",
        "movie"
    ]
    return (
        <>
            <div className="repeting-todo-container">
                <div className="Todo-header">
                    <img src="/src/assets/todos.png" alt="" />
                </div>
                {repetingTodo.map((todo) => {
                    return <div title="Click to mark as completed"
                        className="todo-contant">{todo}</div>
                })}
            </div>
        </>
    )
}

export default RepetingTodo;