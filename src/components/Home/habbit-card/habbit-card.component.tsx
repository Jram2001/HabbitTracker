import type React from "react";
import "./habbit-card.component.scss"
import ActionsDropdown from "./actions-dropdown/actions.component";
import ActivityBox from "./activity-box/activity.component";
import { useEffect, useRef, useState } from "react";
import CircleGraph from "./simpleCircleGraph/circle-graph";

type cardInputProps = {
    weeklyActivity: number[];
    activityId: number;
    isActive: boolean;
}


const HabbitCard: React.FC<cardInputProps> = ({ weeklyActivity, activityId, isActive }) => {
    /** 
     * Ref to the card element used for layout measurements and DOM manipulation
     */
    const cardReference = useRef<HTMLDivElement>(null);

    const [isHovred, setIsHovred] = useState<boolean>(false);
    const [yearlyActivity, setYearlyActivity] = useState([0, 0, 1, 0, 1, 1, 1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 0, 1, 0, 0, 0, 0, 1, 0, 1, 1, 0, 0, 0, 1, 0, 1, 1, 0, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 1, 0, 0, 0, 1, 1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 1, 0, 0, 1, 0, 0, 1, 0, 1, 1, 0, 0, 1, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 1, 0, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 1, 0, 1, 1, 0, 1, 1, 1, 0, 1, 1, 0, 0, 1, 1, 1, 0, 0, 1, 1, 1, 0, 0, 1, 0, 1, 0, 1, 0, 0, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1, 1])
    /** 
     * Class name that controls the card's expansion direction (e.g., top, left, bottom)
     */
    const [expandClass, setExpandClass] = useState<string>("");

    /**
     * Sets the height of the card element based on the scaled height
     * of its inner content ('.habbit-card-container'), adjusted relative
     * to a 1440px screen width for consistent layout across screen sizes.
     */
    useEffect(() => {
        if (cardReference.current) {
            const innerElement = cardReference.current.querySelector('.habbit-card-container');
            if (innerElement) {
                const height = innerElement.getBoundingClientRect().height * (1440 / window.screen.width);
                cardReference.current.style.height = height + 'px';
            }
        }
    }, []);

    /**
     * Determines the best direction to expand the card on hover
     * based on available space around it within the container.
     * Assigns approprate class name to active card expansion direction. 
     */
    const handleMouseEnter = (): void => {
        if (!cardReference.current) return;

        const cardEl = cardReference.current.getElementsByClassName('habbit-card-container')[0] as HTMLElement | undefined;
        const containerEl = document.getElementsByClassName('grid-layout-2')[0] as HTMLElement | undefined;

        if (!cardEl || !containerEl) return;

        const cardRect: DOMRect = cardEl.getBoundingClientRect();
        const containerRect: DOMRect = containerEl.getBoundingClientRect();

        const spaceRight: number = containerRect.right - cardRect.right;
        const spaceLeft: number = cardRect.left - containerRect.left;
        const spaceBottom: number = containerRect.bottom - cardRect.bottom;
        const spaceTop: number = cardRect.top - containerRect.top;

        if (spaceBottom < 250 && spaceTop > spaceBottom && spaceRight > 650 && spaceLeft < spaceRight) {
            setExpandClass("card-expand-top");
        } else if (spaceRight < 650 && spaceLeft > spaceRight) {
            setExpandClass("card-expand-left");
        } else {
            setExpandClass("card-expand-bottom");
        }
        setIsHovred(true);

    };

    /**
     * Resets card expansion status.
     */
    const handleMouseLeave = () => {
        setExpandClass("");
        setIsHovred(false);
    };

    const findGraphData = (valuesArray: number[]): number => {
        return ((valuesArray.reduce((accumulator: number, value: number) => {
            return accumulator + value;
        }) / valuesArray.length) * 100)
    }

    return (
        <>
            <div
                title="Click to mark as completed"
                className={`habbit-card-container-mock`}
                ref={cardReference}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            >
                <div className={`habbit-card-container ${expandClass}`}>
                    <table style={{ width: "100%" }}>
                        <tbody>
                            <tr>
                                <td className="habbit-name">
                                    Read {activityId}
                                </td>
                                <td style={{ display: "flex", justifyContent: "end" }}>
                                    <ActionsDropdown />
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <div className="activity-content-container">
                        <div className="activity-status-container">
                            <ActivityBox userActivity={isHovred ? yearlyActivity : weeklyActivity} />
                        </div>
                        <div className="circle-graph-container">
                            <CircleGraph width={findGraphData(yearlyActivity)} />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}


export default HabbitCard;