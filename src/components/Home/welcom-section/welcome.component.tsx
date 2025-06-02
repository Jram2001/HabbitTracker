import { useDialog } from '../../../providers/common-dialog-interface';
import { patch, post } from '../../../services/api-mothod-service';
import './welcome.component.scss';
const WelcomeUser: React.FC<{ userName: string; updateUI: Function }> = ({ userName, updateUI }) => {
    const { openDialog, closeDialog } = useDialog(); // Dialog management hooks

    // Opens dialog to update habit details
    const handleAddHabit = () => {
        openDialog({
            type: 'input',
            title: 'Update habit',
            message: 'Please enter the habit detail below:',
            inputConfig: [
                {
                    name: 'title',
                    label: 'Habit name',
                    type: 'text',
                    placeholder: 'Enter habit name',
                    defaultValue: '',
                    validator: {
                        required: 'Habit name is required',
                        minLength: 'Name must be at least 2 characters',
                    },
                },
            ],
            onConfirm: (data) => {
                if (data) updateHabit(data);
                closeDialog();
            },
            onCancel: closeDialog,
        });
    };

    // Updates habit details via API
    const updateHabit = (data: any) => {
        post('/habbits/addNewHabit', { ...data, userId: "68318d48493cd55bd1a13ef4" })
            .then(() => {
                updateUI();
            })
            .catch((err) => console.error("Error updating habit", err));
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div className="welcome-user-container">
                Hi <span><img style={{ width: "18px" }} src="/src/assets/fire-emojie.png" alt="Fire" /></span>
                <span style={{ display: "block", fontSize: "36px", fontWeight: "600", fontFamily: "cookie" }}>{userName}</span>
            </div>
            <button onClick={handleAddHabit} className='primary-button welcome-button'> Add task </button>
            <button className='secondary-button welcome-button'> Repeting todo </button>
        </div>
    )
}

export default WelcomeUser;