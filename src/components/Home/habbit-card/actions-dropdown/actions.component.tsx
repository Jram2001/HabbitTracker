import { ActionsIcon, EyeIcon, TrashIconSolid, UploadIcon } from "../../../icons.constants"
import './actions.component.scss'
const ActionsDropdown = () => {
    return (
        <>
            <div className="actions-container">
                <div className="icon-container">
                    <EyeIcon customClassName="actions-icon" strokeSize={2.5} />
                </div>
                <div className="icon-container">
                    <TrashIconSolid customClassName="actions-icon" strokeSize={2.5} />
                </div>
                <div className="icon-container">
                    <UploadIcon customClassName="actions-icon" strokeSize={2.5} />
                </div>
                <div className="icon-container">
                    <ActionsIcon customClassName="actions-icon more-actions" color="var(--text-color)" strokeSize={2.5} />
                </div>
            </div>
        </>
    )
}

export default ActionsDropdown