import type React from "react";
import HabbitCard from "./habbit-card/habbit-card.component";
import RepetingTodo from "./repeting-todo/repetingTodo.component";
import "./home.component.scss"
import WelcomeUser from "./welcom-section/welcome.component";
import { useState } from "react";
const Home: React.FC = ({ }) => {
    const [allUserActivity, setAllUserActivity] = useState([[1, 1, 1, 1, 0, 0, 0], [1, 1, 0, 0, 1, 1, 1], [0, 1, 1, 0, 1, 1, 1], [0, 0, 1, 1, 0, 1, 1], [1, 1, 1, 1, 0, 0, 0], [1, 1, 0, 0, 1, 1, 1], [1, 1, 1, 1, 0, 0, 0], [1, 1, 0, 0, 1, 1, 1], [0, 1, 1, 0, 1, 1, 1], [0, 0, 1, 1, 0, 1, 1], [1, 1, 1, 1, 0, 0, 0], [1, 1, 0, 0, 1, 1, 1]]);
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