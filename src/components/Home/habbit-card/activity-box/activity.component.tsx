import type React from "react";
import './activity.component.scss';

const ActivityBox: React.FC<{ userActivity: number[] }> = ({ userActivity }) => {
    return (
        <>
            <div className="activity-container">
                {userActivity.map((activity: number) => {
                    return <div className={activity == 1 ? 'active' : 'in-active'}></div>
                })}
            </div>
        </>
    )
}

export default ActivityBox;