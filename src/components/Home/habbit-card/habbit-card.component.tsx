import type React from "react";
import "./habbit-card.component.css"
import { HabbitIcon } from "../../icons.constants";
import ActionsDropdown from "./actions-dropdown/actions.component";

const HabbitCard: React.FC = () => {
    return (
        <>
            <div className="habbit-card-container">
                <tr>
                    <td className="card-icon">
                        <HabbitIcon customClassName="habbit-icon" color="var(--text-color)" />
                    </td>
                    <td>
                        <ActionsDropdown />
                    </td>
                </tr>
            </div>
        </>
    )
}

export default HabbitCard