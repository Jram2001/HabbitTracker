import type React from "react";
import HabbitCard from "./habbit-card/habbit-card.component";
import RepetingTodo from "./repeting-todo/repetingTodo.component";
import "./home.component.scss"
import WelcomeUser from "./welcom-section/welcome.component";
import { useEffect, useState } from "react";
import { get } from "../../services/api-mothod-service";
import { fillDatesWithFlags } from "../../utils/util";
import type { ActivityData, AlternativeActivityApiResponse } from "../../model/models";

const Home: React.FC = ({ }) => {
    const [allUserActivity, setAllUserActivity] = useState<ActivityData[]>();

    useEffect(() => {
        fetchUserActivity();
    }, []);

    const [hovredIndex, setHovredIndex] = useState<number | null>(null);

    const updateUI = (data: any) => {
        fetchUserActivity();
    }

    const fetchUserActivity = () => {
        return get('/habbits/getActivityByUser', {
            userId: '68318d48493cd55bd1a13ef4',
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
                    <WelcomeUser userName="Jayaram" updateUI={updateUI} />
                    <RepetingTodo updateUI={updateUI} />
                </div>
                <div className="grid-layout-2">
                    {allUserActivity?.map((activity, index) => {
                        return <HabbitCard
                            title={activity.title}
                            weeklyActivity={fillDatesWithFlags(activity.activity, 7)}
                            yearlyActivity={fillDatesWithFlags(activity.activity, 200)}
                            habitId={activity.habitId}
                            isActive={index == hovredIndex}
                            updateUI={updateUI}
                        />
                    })}
                </div>
            </div>
        </>
    )
}

export default Home;