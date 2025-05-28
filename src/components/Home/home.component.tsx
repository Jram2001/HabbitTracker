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
        get('/habbits/getActivityByUser', { "userId": "68318d48493cd55bd1a13ef4", "limit": "7" }).then((response: AlternativeActivityApiResponse) => {
            setAllUserActivity(response?.data?.data);
        }).catch((error) => {
            console.error('Error in fetching activity data', error)
        });
    }, []);

    const [hovredIndex, setHovredIndex] = useState<number | null>(null);
    console.log(allUserActivity, 'allUserActivity')
    return (
        <>
            <div className="home-container">
                <div className="grid-layout-1">
                    <WelcomeUser userName="Jayaram" />
                    <RepetingTodo />
                </div>
                <div className="grid-layout-2">
                    {allUserActivity?.map((activity, index) => {
                        return <HabbitCard
                            title={activity.title}
                            weeklyActivity={fillDatesWithFlags(activity.activity, 7)}
                            yearlyActivity={fillDatesWithFlags(activity.activity, 200)}
                            activityId={index}
                            isActive={index == hovredIndex}
                        />
                    })}
                </div>
            </div>
        </>
    )
}

export default Home;