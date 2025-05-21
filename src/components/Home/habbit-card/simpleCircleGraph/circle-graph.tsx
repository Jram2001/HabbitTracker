import type React from "react";
import './circle-graph.scss'
const CircleGraph: React.FC<{ width: number }> = ({ width }) => {
    return (
        <div className="circle-container animate-graph">
            <div className="outer-circle animate-graph"></div>
            <div style={{ maxWidth: `${width}%`, maxHeight: `${width}%` }} className="inner-circle animate-graph"></div>
        </div>
    )
}

export default CircleGraph;