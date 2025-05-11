import type React from "react";
import HabbitCard from "./habbit-card/habbit-card.component";
import "./home.component.css"
const Home: React.FC = ({ }) => {
    return (
        <>
            <div className="home-container">
                <HabbitCard />
            </div>
        </>
    )
}

export default Home;