import type React from "react";
import "./habbit-card.component.css"
import ActionsDropdown from "./actions-dropdown/actions.component";
import ActivityBox from "./activity-box/activity.component";
import { useState } from "react";

type cardInputProps = {
    weeklyActivity: number[];
    activityId: number
}

const HabbitCard: React.FC<cardInputProps> = ({ weeklyActivity, activityId }) => {
    return (
        <>
            <div className="habbit-card-container">
                <table style={{ width: "100%" }}>
                    <tr>
                        <td className="habbit-name">
                            Read
                        </td>
                        <td style={{ display: "flex", justifyContent: "end" }}>
                            <ActionsDropdown />
                        </td>
                    </tr>
                </table>

                <div className="activity-status-container">
                    <ActivityBox userActivity={weeklyActivity} />
                </div>
            </div>
        </>
    )
}

export default HabbitCard