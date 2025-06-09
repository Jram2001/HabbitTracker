import { useForm, FormProvider, type SubmitHandler } from "react-hook-form";
import '../authentication.css';
import { useState } from "react";
import { post } from "../../../services/api-mothod-service";
import CustomInput from "../../custom/custom-input/custom-input";
import CustomOTPInput from "../../custom/custom-input-otp/custom-input-OTP";

type FormValuesEmail = {
    email: string;
};

type FormValuesOTP = {
    otp: string;
};

type FormValuesSignup = {
    name: string;
    email: string;
    password: string;
    conformPassword: string;
};

type SignupStep = "askEmail" | "verifyOTP" | "completeSignup";

const SignupComponent = () => {
    const methodsVerifyEmail = useForm<FormValuesEmail>({
        mode: "onTouched",
        defaultValues: {
            email: ""
        }
    });

    const [isLoading, setIsLoading] = useState(false);

    const methodsVerifyOtp = useForm<FormValuesOTP>({
        mode: "onTouched",
        defaultValues: {
            otp: ""
        }
    });

    const methodsCompleteSignup = useForm<FormValuesSignup>({
        mode: "onTouched",
        defaultValues: {
            name: "",
            email: methodsVerifyEmail.getValues('email') ? methodsVerifyEmail.getValues('email') : "",
            password: "",
            conformPassword: ""
        }
    });

    let [currentStep, setCurrentStep] = useState<SignupStep>("askEmail");
    let [userEmail, setUserEmail] = useState<string>("");

    const onVerifyEmail: SubmitHandler<FormValuesEmail> = (data) => {
        setIsLoading(true);
        post('/user/send-otp', { email: data.email })
            .then(response => {
                console.log(response.data.message, response, 'response');
                if (response.data.message) {
                    console.log('error in methos', methodsVerifyEmail)
                    methodsVerifyEmail.clearErrors("email");
                    setIsLoading(false);
                    setUserEmail(data.email);
                    setCurrentStep("verifyOTP");
                } else {
                    console.log('error in api')
                    setIsLoading(false);
                    methodsVerifyEmail.setError("email", {
                        type: "server",
                        message: "Failed to send OTP. Try again."
                    });
                }
            })
            .catch((error: any) => {
                const serverMessage = error?.response?.data?.error || "Something went wrong";
                setIsLoading(false);
                methodsVerifyEmail.setError("email", {
                    type: "server",
                    message: serverMessage,
                });
            });
    };

    const onVerifyOTP: SubmitHandler<FormValuesOTP> = (data) => {
        setIsLoading(true);
        post('/user/verify-otp', { email: userEmail, otp: data.otp })
            .then(response => {
                if (response.data.message) {
                    setIsLoading(false);
                    setCurrentStep("completeSignup");
                } else {
                    setIsLoading(false);
                    methodsVerifyOtp.setError("otp", {
                        type: "server",
                        message: "Invalid OTP"
                    });
                }
            })
            .catch((error: any) => {
                setIsLoading(false);
                const serverMessage = error?.response?.data?.error || "Invalid OTP. Please try again.";
                methodsVerifyOtp.setError("otp", {
                    type: "server",
                    message: serverMessage,
                });
            });
    };

    const onCompleteSignup: SubmitHandler<FormValuesSignup> = (data) => {
        if (data.password !== data.conformPassword) {
            methodsCompleteSignup.setError("conformPassword", {
                type: "manual",
                message: "Passwords do not match"
            });
            return;
        }

        post('/user/signup', { name: data.name, email: userEmail, password: data.password })
            .then(response => {
                const errValue = response.data.error.value;
                if (response.data.success) {
                    console.log("Signup successful");
                } else {
                    const errValue = response.data.error.value;
                    methodsCompleteSignup.setError(errValue, {
                        type: "server",
                        message: response.data.error.message
                    });
                }
            })
            .catch((error: any) => {
                console.log(error?.response?.data?.error, 'errValue');
                const serverMessage = error?.response?.data?.error?.message || "Something went wrong";
                methodsCompleteSignup.setError(error?.response?.data?.error?.value, {
                    type: "server",
                    message: serverMessage,
                });
            });
    };


    return (
        <div className="authentication-container">
            {currentStep === "askEmail" && (
                <>
                    <div className="header">Verification</div>
                    <FormProvider {...methodsVerifyEmail}>
                        <form onSubmit={methodsVerifyEmail.handleSubmit(onVerifyEmail)}>
                            <CustomInput
                                name="email"
                                label="Email Address"
                                type="email"
                                validationOptions={{
                                    required: "Email is required",
                                    pattern: {
                                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                        message: "Invalid email address"
                                    }
                                }}
                                placeHolder="you@example.com"
                            />
                            <div className="authentication-button">
                                <button style={{ width: '100%' }} type="submit" className="signin">
                                    {isLoading ? (
                                        <div className="loading-spinner"></div>
                                    ) : (
                                        "Sign up"
                                    )}
                                </button>
                            </div>
                        </form>
                    </FormProvider>
                </>
            )
            }

            {
                currentStep === "verifyOTP" && (
                    <>
                        <div className="header">Verify OTP</div>
                        <FormProvider {...methodsVerifyOtp}>
                            <form onSubmit={methodsVerifyOtp.handleSubmit(onVerifyOTP)}>
                                <CustomOTPInput
                                    name="otp"
                                    label="Verification Code"
                                    validationOptions={{
                                        required: "OTP is required",
                                        minLength: {
                                            value: 6,
                                            message: "OTP must be 6 digits"
                                        },
                                        pattern: {
                                            value: /^\d{6}$/,
                                            message: "OTP must contain only numbers"
                                        }
                                    }}
                                />
                                <div className="authentication-button">
                                    <button style={{ width: '100%' }} type="submit" className="signin">
                                        Verify OTP
                                    </button>
                                </div>
                            </form>
                        </FormProvider>
                    </>
                )
            }

            {
                currentStep === "completeSignup" && (
                    <>
                        <div className="header">Complete Signup</div>
                        <FormProvider {...methodsCompleteSignup}>
                            <form onSubmit={methodsCompleteSignup.handleSubmit(onCompleteSignup)}>
                                <div className="form-container">
                                    <CustomInput
                                        name="name"
                                        label="User name"
                                        validationOptions={{
                                            required: "Username is required",
                                            minLength: {
                                                value: 3,
                                                message: "Username must be at least 3 characters"
                                            }
                                        }}
                                        placeHolder="User name"
                                    />
                                    <CustomInput
                                        name="password"
                                        label="Password"
                                        type="password"
                                        validationOptions={{
                                            required: "Password is required",
                                            minLength: {
                                                value: 6,
                                                message: "Password must be at least 6 characters"
                                            }
                                        }}
                                        placeHolder="Enter password"
                                    />
                                    <CustomInput
                                        name="conformPassword"
                                        label="Confirm Password"
                                        type="password"
                                        validationOptions={{
                                            required: "Please confirm your password",
                                            minLength: {
                                                value: 6,
                                                message: "Password must be at least 6 characters"
                                            }
                                        }}
                                        placeHolder="Confirm password"
                                    />
                                </div>
                                <div className="authentication-button">
                                    <button style={{ width: '100%' }} type="submit" className="signin">
                                        Complete Signup
                                    </button>
                                </div>
                            </form>
                        </FormProvider>
                    </>
                )
            }
        </div >
    );
};

export default SignupComponent;