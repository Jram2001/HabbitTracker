import type React from "react";
import "./habbit-card.component.css"
import ActionsDropdown from "./actions-dropdown/actions.component";

const HabbitCard: React.FC = () => {
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
            </div>
        </>
    )
}

export default HabbitCard