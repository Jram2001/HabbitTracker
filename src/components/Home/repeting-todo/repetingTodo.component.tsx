import { useEffect, useState } from 'react';
import './repetingtodo.component.scss';
import { del, get, patch } from '../../../services/api-mothod-service';
import type { getTodoResponse, GetTodosResponse, TodoEntry, TodoItem } from '../../../model/models';
import { AddIcon, EditIcon, TrashIcon } from '../../icons.constants';
import { useDialog } from '../../../providers/common-dialog-interface';

const RepetingTodo: React.FC<{ updateUI: Function }> = ({ updateUI }) => {

    const { openDialog, closeDialog } = useDialog(); // Dialog management hooks

    useEffect(() => {
        fetchUserTodo();
    }, []);

    const [todoData, setTodoData] = useState<TodoItem>();

    const [defaultValue, setDefaultValue] = useState<string>();

    const fetchUserTodo = async () => {
        try {
            const response = await get('/todo/getTodoData', {
                userId: '68318d48493cd55bd1a13ef4'
            }).then((res) => {
                setTodoData(res.data.data[0]);
            }).catch((err) => {
                console.log("Error occured fetching todo data", err);
            });

        } catch (error) {
            console.error('Error in fetching todo data', error);
        }
    };

    // Opens dialog to update habit details
    const handleUpdateTodo = (value: string, e: React.MouseEvent, index: number) => {
        setDefaultValue(value)
        e.stopPropagation();
        openDialog({
            type: 'input',
            title: 'Update habit',
            message: 'Please enter the habit detail below:',
            inputConfig: [
                {
                    name: 'title',
                    label: 'Todo name',
                    type: 'text',
                    placeholder: 'Enter todo name',
                    defaultValue: defaultValue,
                    validator: {
                        required: 'todo name is required',
                        minLength: 'Name must be at least 2 characters',
                    },
                },
            ],
            onConfirm: (data) => {
                closeDialog();
            },
            onCancel: closeDialog,
        });
    };


    // Updates habit details via API
    const updateHabit = (data: any) => {
        patch('/todo/updateTodo', { habitId, ...data })
            .then(() => {
                updateUI();
            })
            .catch((err) => console.error("Error updating habit", err));
    };


    // Opens dialog to confirm habit deletion
    const handleDeleteTodo = (e: React.MouseEvent) => {
        e.stopPropagation();
        openDialog({
            type: 'input',
            title: 'Deletewarden',
            message: 'Are you sure of deleting this todo',
            onConfirm: (data) => {
                if (data) deleteHabit(data);
                closeDialog();
            },
            onCancel: closeDialog,
        });
    };

    // Deletes habit via API
    const deleteHabit = (data: any) => {
        del('/habbits/deleteHabitData')
            .catch((err) => console.error("Error deleting habit", err));
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
                {todoData?.todoData.map((data: TodoEntry, index: number) => {
                    return <div title="Click to mark as completed"
                        className="todo-contant">{data.title}
                        <div className='add-icon-container'>
                            <span onClick={(e) => handleUpdateTodo(data.title, e, index)} ><EditIcon iconSize={12} color="var(--text-color)" customClassName="actions-icon" />&nbsp;</span>
                            <span onClick={(e) => handleDeleteTodo(e)} ><TrashIcon iconSize={12} color="var(--text-color)" customClassName="actions-icon" /></span>
                        </div>
                    </div>
                })}
                {todoData && todoData.todoData.length < 5 ?
                    <div className="todo-contant add-todo-contant">Add todo <div className='add-icon-container'><AddIcon iconSize={12} color="var(--text-color)" customClassName="actions-icon" /></div></div> : ''
                }
            </div>
        </>
    )
}

export default RepetingTodo;