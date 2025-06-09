import React, { useEffect, useRef, useState } from "react";
import { del, patch, post } from "../../../services/api-mothod-service";
import { useDialog } from "../../../providers/common-dialog-interface";
import { EditIcon, TrashIconSolid } from "../../icons.constants";
import ActionsDropdown from "./actions-dropdown/actions.component";
import ActivityBox from "./activity-box/activity.component";
import CircleGraph from "./simpleCircleGraph/circle-graph";
import "./habbit-card.component.scss";

type CardInputProps = {
    weeklyActivity: number[];
    yearlyActivity: number[];
    habitId: string;
    isActive: boolean;
    title: string;
    updateUI: Function;
};

/**
 * Renders a habit tracking card with activity visualization and interaction
 */
const HabbitCard: React.FC<CardInputProps> = ({ weeklyActivity, habitId, isActive, yearlyActivity, title, updateUI }) => {
    // State and refs
    const cardReference = useRef<HTMLDivElement>(null); // Card element for DOM manipulation
    const [isHovred, setIsHovred] = useState<boolean>(false); // Tracks hover state
    const [expandClass, setExpandClass] = useState<string>(""); // Controls card expansion direction
    const { openDialog, closeDialog } = useDialog(); // Dialog management hooks
    const [graphData, setGrapgData] = useState(yearlyActivity.slice(0, 6));

    // Adjusts card height based on inner content and screen width
    useEffect(() => {
        if (cardReference.current) {
            const innerElement = cardReference.current.querySelector('.habbit-card-container');
            if (innerElement) {
                const height = innerElement.getBoundingClientRect().height * (1440 / window.screen.width);
                // cardReference.current.style.height = `${height}px`;
            }
        }
    }, []);

    // Calculates completion percentage from activity array
    const findGraphData = (valuesArray: number[]): number => {
        return (valuesArray.reduce((sum, value) => sum + value, 0) / valuesArray.length) * 100;
    };

    // Marks habit as completed via API
    const markAsCompleted = () => {
        post('/habbits/setActivityStatus', { habitId })
            .then((response) => { updateUI(), console.log("Activity status updated", response) })
            .catch((error) => console.error("Error updating activity status", error));
    };

    // Updates habit details via API
    const updateHabit = (data: any) => {
        patch('/habbits/updateActivityData', { habitId, ...data })
            .then(() => {
                updateUI();
            })
            .catch((err) => console.error("Error updating habit", err));
    };

    // Deletes habit via API
    const deleteHabit = (data: any) => {
        del('/habbits/deleteHabitData', { habitId })
            .then(() => {
                updateUI();
            })
            .catch((err) => console.error("Error deleting habit", err));
    };

    // Opens dialog to update habit details
    const handleUpdateHabit = (e: React.MouseEvent) => {
        e.stopPropagation();
        openDialog({
            type: 'input',
            title: 'Update habit',
            message: 'Please enter the habit detail below:',
            inputConfig: [
                {
                    name: 'title',
                    label: 'Habit name',
                    type: 'text',
                    placeholder: 'Enter habit name',
                    defaultValue: title,
                    validator: {
                        required: 'Habit name is required',
                        minLength: 'Name must be at least 2 characters',
                    },
                },
            ],
            onConfirm: (data) => {
                if (data) updateHabit(data);
                closeDialog();
            },
            onCancel: closeDialog,
        });
    };

    // Opens dialog to confirm habit deletion
    const handleDeleteHabit = (e: React.MouseEvent) => {
        e.stopPropagation();
        openDialog({
            type: 'input',
            title: 'Deletewarden',
            message: 'Are you sure of deleting this habit',
            onConfirm: (data) => {
                if (data) deleteHabit(data);
                closeDialog();
            },
            onCancel: closeDialog,
        });
    };

    // Determines card expansion direction on hover
    const handleMouseEnter = () => {
        setGrapgData(yearlyActivity);
        if (!cardReference.current) return;
        const cardEl = cardReference.current.getElementsByClassName('habbit-card-container')[0] as HTMLElement;
        const containerEl = document.getElementsByClassName('grid-layout-2')[0] as HTMLElement;
        if (!cardEl || !containerEl) return;
        const screenWidth = window.innerWidth;
        if (screenWidth <= 1023) {
            setIsHovred(true);
            return;
        }
        const cardRect = cardEl.getBoundingClientRect();
        const containerRect = containerEl.getBoundingClientRect();
        const spaceRight = containerRect.right - cardRect.right;
        const spaceLeft = cardRect.left - containerRect.left;
        const spaceBottom = containerRect.bottom - cardRect.bottom;
        const spaceTop = cardRect.top - containerRect.top;

        if (spaceBottom < 250 && spaceTop > spaceBottom && spaceRight > 650 && spaceLeft < spaceRight) {
            setExpandClass("card-expand-top");
        } else if (spaceRight < 650 && spaceLeft > spaceRight) {
            setExpandClass("card-expand-left");
        } else {
            setExpandClass("card-expand-bottom");
        }
        setIsHovred(true);
    };

    // Trigger onHabbitLoad when component mounts
    useEffect(() => {
        onHabbitLoad();
        return () => {
        };
    }, [cardReference]);

    const onHabbitLoad = () => {
        const screenWidth = window.innerWidth;
        if (screenWidth <= 1023) {
            setExpandClass("mobile-view-card");
            setIsHovred(true);
            return;
        }
    }

    // Resets card expansion on mouse leave
    const handleMouseLeave = () => {
        const screenWidth = window.innerWidth;
        if (screenWidth <= 1023) {
            setIsHovred(true);
            return;
        }
        setGrapgData(yearlyActivity.slice(0, 6));
        setExpandClass("");
        setIsHovred(false);
    };

    return (
        <div
            title="Click to mark as completed"
            className="habbit-card-container-mock"
            ref={cardReference}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onLoad={() => onHabbitLoad}
        >
            <div onClick={markAsCompleted} className={`habbit-card-container ${expandClass}`}>
                <table style={{ width: "100%" }}>
                    <tbody>
                        <tr>
                            <td onClick={handleUpdateHabit} className="habbit-name">
                                {title} <EditIcon iconSize={12} color="var(--text-color)" customClassName="actions-icon" />
                            </td>
                            <td onClick={handleDeleteHabit} style={{ display: "flex", justifyContent: "end" }}>
                                <TrashIconSolid customClassName="actions-icon" strokeSize={2.5} />
                            </td>
                        </tr>
                    </tbody>
                </table>
                <div className="activity-content-container">
                    <div className="activity-status-container">
                        <ActivityBox userActivity={isHovred ? yearlyActivity : weeklyActivity} />
                    </div>
                    <div className="circle-graph-container">
                        <CircleGraph width={findGraphData(graphData)} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HabbitCard;