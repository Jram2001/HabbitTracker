import type React from "react";
import HabbitCard from "./habbit-card/habbit-card.component";
import RepetingTodo from "./repeting-todo/repetingTodo.component";
import "./home.component.scss"
import { useEffect, useState } from "react";
import { get, post } from "../../services/api-mothod-service";
import { fillDatesWithFlags } from "../../utils/util";
import type { ActivityData, AlternativeActivityApiResponse } from "../../model/models";
import { AddIcon } from "../icons.constants";
import { useDialog } from "../../providers/common-dialog-interface";

const Home: React.FC = ({ }) => {
    const [allUserActivity, setAllUserActivity] = useState<ActivityData[]>();
    const { openDialog, closeDialog } = useDialog(); // Dialog management hooks

    useEffect(() => {
        fetchUserActivity();
    }, []);

    const updateUI = () => {
        fetchUserActivity();
    }

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
        post('/habbits/addNewHabit', { ...data, userId: localStorage?.getItem?.('userId') })
            .then(() => {
                updateUI();
            })
            .catch((err) => console.error("Error updating habit", err));
    };

    const fetchUserActivity = () => {
        return get('/habbits/getActivityByUser', {
            userId: localStorage?.getItem?.('userId'),
            limit: '200'
        })
            .then((response: AlternativeActivityApiResponse) => {
                const freshData = JSON.parse(JSON.stringify(response?.data?.data));
                setAllUserActivity(freshData);
                return freshData;
            })
            .catch((error) => {
                console.error('Error in fetching activity data', error);
            });
    };

    return (
        <>
            <div className="home-container">
                <div className="grid-layout-1">
                    <RepetingTodo updateUI={updateUI} />
                </div>
                <div className="grid-layout-2">
                    <div onClick={handleAddHabit} className="add-habbit-card">
                        <div>Add habbit</div>
                        <AddIcon color="var(--text-color)" customClassName="actions-icon" strokeSize={4} />
                    </div>
                    {allUserActivity?.map((activity) => {
                        return <HabbitCard
                            title={activity.title}
                            weeklyActivity={fillDatesWithFlags(activity.activity, 7)}
                            yearlyActivity={fillDatesWithFlags(activity.activity, 200)}
                            habitId={activity.habitId}
                            updateUI={updateUI}
                        />
                    })}
                </div>
            </div>
        </>
    )
}

export default Home;