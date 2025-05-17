import type React from "react";
import HabbitCard from "./habbit-card/habbit-card.component";
import RepetingTodo from "./repeting-todo/repetingTodo.component";
import "./home.component.css"
import WelcomeUser from "./welcom-section/welcome.component";
import { useState } from "react";
const Home: React.FC = ({ }) => {
    const [allUserActivity, setAllUserActivity] = useState([[1, 1, 1, 1, 0, 0, 0], [1, 1, 0, 0, 1, 1, 1], [0, 1, 1, 0, 1, 1, 1], [0, 0, 1, 1, 0, 1, 1], [1, 1, 1, 1, 0, 0, 0], [1, 1, 0, 0, 1, 1, 1], [1, 1, 1, 1, 0, 0, 0], [1, 1, 0, 0, 1, 1, 1], [0, 1, 1, 0, 1, 1, 1], [0, 0, 1, 1, 0, 1, 1], [1, 1, 1, 1, 0, 0, 0], [1, 1, 0, 0, 1, 1, 1]])

    return (
        <>
            <div className="home-container">
                <div className="grid-layout-1">
                    <WelcomeUser userName="Jayaram" />
                    <RepetingTodo />
                </div>
                <div className="grid-layout-2">
                    {allUserActivity.map((activity) => {
                        return <HabbitCard weeklyActivity={activity} activityId={1} />
                    })}
                </div>
                <div className="grid-layout-3">
                </div>
            </div>
        </>
    )
}

export default Home;