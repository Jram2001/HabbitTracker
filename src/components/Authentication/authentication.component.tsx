import React from "react";
import './authentication.css'
const AuthenticationComponent = () => {
    return (
        <>
            <div className="input-wrapper">
                <div className="input-icon-container">
                    <input
                        id="small-input"
                        type="text"
                        placeholder="Enter your name"
                        className="small-input with-icon"
                    />
                    <span className="input-icon">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="icon-svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                d="M5.121 17.804A13.937 13.937 0 0112 15c2.21 0 4.284.534 6.121 1.477M15 10a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                        </svg>
                    </span>
                </div>

            </div>
        </>
    )
}

export default AuthenticationComponent;