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
import CustomInput from "../../custom/custom-input/custom-input";
import '../authentication.css';
type FormValues = {
    email: string;
    password: string;
};

const SignupComponent = () => {
    const methods = useForm<FormValues>({
        mode: "onTouched",
        defaultValues: {
            email: "",
            password: ""
        }
    });

    const onSubmit: SubmitHandler<FormValues> = (data) => {
        console.log(data);
    };

    return (
        <div className="authentication-container">
            <div className="header">Sign up</div>
            <FormProvider {...methods}>
                <form
                    onSubmit={methods.handleSubmit(onSubmit)}
                    className="max-w-md mx-auto authentication-form"
                >
                    <CustomInput
                        name="userName"
                        validationOptions={{ required: "user name is required" }}
                        placeHolder="User name"
                    />
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
                    <CustomInput
                        name="conformPassword"
                        type="password"
                        validationOptions={{ required: "Password is required", minLength: { value: 6, message: "Min 6 characters" } }}
                        placeHolder="Conform password"
                    />
                    <div className="authentication-button">
                        <button style={{ width: '100%' }} type="submit" className="signin">
                            Submit
                        </button>
                    </div>
                </form>
            </FormProvider>
        </div>
    );
};

export default SignupComponent;
