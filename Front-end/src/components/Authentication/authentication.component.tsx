// import React from "react";
// import './authentication.css'
// const AuthenticationComponent = () => {
//     return (
//         <>

//         </>
//     )
// }

// export default AuthenticationComponent;

// MyForm.tsx
import { useForm, FormProvider, type SubmitHandler } from "react-hook-form";
import CustomInput from "../custom/custom-input/custom-input";
import './authentication.css';
import { post } from "../../services/api-mothod-service";
import { useNavigate } from "react-router-dom";
type FormValues = {
    email: string;
    password: string;
};

const AuthenticationComponent = () => {
    const methods = useForm<FormValues>({
        mode: "onTouched",
        defaultValues: {
            email: "",
            password: ""
        }
    });


    const navigate = useNavigate();

    const onSubmit: SubmitHandler<FormValues> = (data) => {
        post('/authenticate', data)
            .then(response => {
                localStorage.setItem("authToken", response?.data?.token);
                localStorage.setItem("userId", response?.data?.userId);
                navigate('/home');
            })
            .catch(error => {
                console.error('❌ Error:', error?.response?.data || error.message);
            });
    };


    return (
        <div className="authentication-container">
            <div className="header">Sign in</div>
            <FormProvider {...methods}>
                <form
                    onSubmit={methods.handleSubmit(onSubmit)}
                    className="max-w-md mx-auto authentication-form"
                >
                    <CustomInput
                        name="email"
                        validationOptions={{ required: "Email is required" }}
                        placeHolder="you@example.com"
                    />
                    <CustomInput
                        name="password"
                        type="password"
                        validationOptions={{ required: "Password is required", minLength: { value: 6, message: "Min 6 characters" } }}
                        placeHolder="Enter password"
                    />
                    <div className="authentication-button">
                        <button type="submit" className="signin">
                            Submit
                        </button>
                        <button onClick={() => navigate('/signup')} type="submit" className="signup">
                            Sign up
                        </button>
                    </div>
                </form>
            </FormProvider>
        </div>
    );
};

export default AuthenticationComponent;
