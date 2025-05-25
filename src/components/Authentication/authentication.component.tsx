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
import { get, post } from "../../services/api-mothod-service";
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

    const onSubmit: SubmitHandler<FormValues> = (data) => {
        // get('/test');
        post('/user/authenticate', data);
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
                        <button type="submit" className="signup">
                            Sign up
                        </button>
                    </div>
                </form>
            </FormProvider>
        </div>
    );
};

export default AuthenticationComponent;
