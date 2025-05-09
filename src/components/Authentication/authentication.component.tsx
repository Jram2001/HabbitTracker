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
        console.log(data);
    };

    return (
        <FormProvider {...methods}>
            <form
                onSubmit={methods.handleSubmit(onSubmit)}
                className="max-w-md mx-auto"
            >
                <CustomInput
                    name="email"
                    label="Email"
                    validationOptions={{ required: "Email is required" }}
                    placeHolder="you@example.com"
                />
                <CustomInput
                    name="password"
                    label="Password"
                    type="password"
                    validationOptions={{ required: "Password is required", minLength: { value: 6, message: "Min 6 characters" } }}
                    placeHolder="Enter password"
                />
                <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 mt-4 rounded"
                >
                    Submit
                </button>
            </form>
        </FormProvider>
    );
};

export default AuthenticationComponent;
