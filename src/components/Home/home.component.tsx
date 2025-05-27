import type React from "react";
import HabbitCard from "./habbit-card/habbit-card.component";
import RepetingTodo from "./repeting-todo/repetingTodo.component";
import "./home.component.scss"
import WelcomeUser from "./welcom-section/welcome.component";
import { useEffect, useState } from "react";
import { get } from "../../services/api-mothod-service";
import { fillDatesWithFlags } from "../../utils/util";
import type { AlternativeActivityApiResponse } from "../../model/models";

const Home: React.FC = ({ }) => {
    const [allUserActivity, setAllUserActivity] = useState([[1, 1, 1, 1, 0, 0, 0], [1, 1, 0, 0, 1, 1, 1], [0, 1, 1, 0, 1, 1, 1], [0, 0, 1, 1, 0, 1, 1], [1, 1, 1, 1, 0, 0, 0], [1, 1, 0, 0, 1, 1, 1], [1, 1, 1, 1, 0, 0, 0], [1, 1, 0, 0, 1, 1, 1], [0, 1, 1, 0, 1, 1, 1], [0, 0, 1, 1, 0, 1, 1], [1, 1, 1, 1, 0, 0, 0], [1, 1, 0, 0, 1, 1, 1]]);

    useEffect(() => {
        const activityData = get('/habbits/getActivityByUser', { "userId": "68318d48493cd55bd1a13ef4", "limit": "7" }).then((response: AlternativeActivityApiResponse) => {
            setAllUserActivity({
                title: response?.data?.data?.title,
                activityData: response?.data?.data?.map((activityData: any) => {
                    return fillDatesWithFlags(activityData?.activity, 7)
                })
            });
        }).catch((error) => {
            console.error('Error in fetching activity data', error)
        });
    }, []);

    const [hovredIndex, setHovredIndex] = useState<number | null>(null);

    return (
        <>
            <div className="home-container">
                <div className="grid-layout-1">
                    <WelcomeUser userName="Jayaram" />
                    <RepetingTodo />
                </div>
                <div className="grid-layout-2">
                    {allUserActivity.map((activity, index) => {
                        return <HabbitCard
                            weeklyActivity={activity}
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