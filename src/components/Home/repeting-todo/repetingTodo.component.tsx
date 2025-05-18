import './repetingtodo.component.scss';

const RepetingTodo: React.FC = ({ }) => {
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
                    return <div className="todo-contant">{todo}</div>
                })}
            </div>
        </>
    )
}

export default RepetingTodo;