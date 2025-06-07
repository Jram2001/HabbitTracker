import { useEffect, useState } from 'react';
import './repetingtodo.component.scss';
import { del, get, patch, post } from '../../../services/api-mothod-service';
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
    const handleAddTodo = (e: React.MouseEvent) => {
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
                    defaultValue: '',
                    validator: {
                        required: 'todo name is required',
                        minLength: 'Name must be at least 2 characters',
                    },
                },
            ],
            onConfirm: (data) => {
                if (todoData) {
                    let updatedValue = todoData;
                    updatedValue.todoData.push({ title: String(data?.title), date: '' });
                    console.log('updatedValue');
                    setTodoData(updatedValue);
                }
                closeDialog();
                updateTodo();
            },
            onCancel: closeDialog,
        });
    };

    // Opens dialog to update habit details
    const handleUpdateTodo = (value: string, e: React.MouseEvent, index: number) => {
        if (value) {
            setDefaultValue(String(value));
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
                    if (defaultValue && todoData) {
                        let updatedValue = todoData;
                        updatedValue.todoData[index].title = String(data?.title);
                        setTodoData(updatedValue);
                    }
                    closeDialog();
                    updateTodo();
                },
                onCancel: closeDialog,
            });
        }
    };


    // // Updates habit details via API
    // const updateHabit = (data: any) => {
    //     patch('/todo/updateTodo', { habitId, ...data })
    //         .then(() => {
    //             updateUI();
    //         })
    //         .catch((err) => console.error("Error updating habit", err));
    // };

    const handleTodoStatus = (index: number, date: string) => {
        let updatedValue = todoData;
        if (updatedValue)
            updatedValue.todoData[index].date = String(date);
        setTodoData(updatedValue);
        updateTodo();
    }

    // Opens dialog to confirm habit deletion
    const handleDeleteTodo = (e: React.MouseEvent, index: number) => {
        e.stopPropagation();
        let updatedValue = todoData;
        if (updatedValue)
            updatedValue.todoData = updatedValue?.todoData.splice(index, index) || [];
        console.log(updatedValue, 'updatedValue', index);
        setTodoData(updatedValue);
        openDialog({
            type: 'input',
            title: 'Deletewarden',
            message: 'Are you sure of deleting this todo',
            onConfirm: (data) => {
                if (data) deleteHabit(data);
                closeDialog();
                setTodoData(updatedValue);
                updateTodo();
            },
            onCancel: closeDialog,
        });
    };

    // Deletes habit via API
    const deleteHabit = (data: any) => {
        del('/todo/deleteTodo')
            .catch((err) => console.error("Error deleting habit", err));
    };

    // Deletes habit via API
    const updateTodo = () => {
        post('/todo/updateTodo', todoData).then(updateUI())
            .catch((err) => console.error("Error deleting habit", err));
    };

    const isDateEqual = (date: string) => {
        return new Date(date).getFullYear() === new Date().getFullYear() &&
            new Date(date).getMonth() === new Date().getMonth() &&
            new Date(date).getDate() === new Date().getDate()
    }

    return (
        <>
            <div className="repeting-todo-container">
                <div className="Todo-header">
                    <img src="/src/assets/todos.png" alt="" />
                </div>
                {todoData?.todoData.map((data: TodoEntry, index: number) => {
                    return <div
                        style={{
                            textDecoration: isDateEqual(data.date) ? 'line-through' : ''
                        }}
                        onClick={() => handleTodoStatus(index, isDateEqual(data.date) ? '' : String(new Date()))}
                        title="Click to mark as completed"
                        className="todo-contant">{data.title}
                        <div className='add-icon-container'>
                            <span onClick={(e) => handleUpdateTodo(data.title, e, index)} ><EditIcon iconSize={12} color="var(--text-color)" customClassName="actions-icon" />&nbsp;</span>
                            <span onClick={(e) => handleDeleteTodo(e, index)} ><TrashIcon iconSize={12} color="var(--text-color)" customClassName="actions-icon" /></span>
                        </div>
                    </div>
                })}
                {todoData && todoData.todoData.length < 5 ?
                    <div onClick={(e) => handleAddTodo(e)} className="todo-contant add-todo-contant">Add todo <div className='add-icon-container'><AddIcon iconSize={12} color="var(--text-color)" customClassName="actions-icon" /></div></div> : ''
                }
            </div>
        </>
    )
}

export default RepetingTodo;