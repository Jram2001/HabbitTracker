import './welcome.component.scss';
const WelcomeUser: React.FC<{ userName: string }> = ({ userName }) => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div className="welcome-user-container">
                Hi <span><img style={{ width: "18px" }} src="/src/assets/fire-emojie.png" alt="Fire" /></span>
                <span style={{ display: "block", fontSize: "36px", fontWeight: "600", fontFamily: "cookie" }}>{userName}</span>
            </div>
            <button className='primary-button welcome-button'> Add task </button>
            <button className='secondary-button welcome-button'> Repeting todo </button>
        </div>
    )
}

export default WelcomeUser;