import type React from "react"
import { useFormContext, type RegisterOptions } from "react-hook-form"
import './custom-input.css'
import { ErrorIcon } from "../../icons.constants"
type CustomInputProps = {
    name: string,
    label?: string,
    type?: string,
    validationOptions?: RegisterOptions,
    placeHolder?: string
}

const CustomInput: React.FC<CustomInputProps> = ({
    name,
    label,
    type = "text",
    validationOptions,
    placeHolder
}) => {
    const { register, formState: { errors } } = useFormContext();
    const fieldError = errors[name]?.message as string | undefined;

    return (
        <div className="custom-input">
            {label && (
                <label htmlFor={name} className="custom-input__label">
                    {label}
                </label>
            )}
            <div className="custom-input__field-container">
                <div className="input-wrapper">
                    <input
                        type={type}
                        id={name}
                        {...register(name, validationOptions)}
                        placeholder={placeHolder}
                        style={{ borderColor: fieldError ? "var(--error-color) !important" : "var(--border-color) !important" }}
                        className={`custom-input__field input-field ${fieldError ? "custom-input__field--error" : ""}`}
                    />
                    <div className="error-icon-wrapper">
                        <ErrorIcon />
                        <svg style={{ cursor: "pointer", display: fieldError ? "block" : "none" }} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="var(--error-color)" className="size-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
                        </svg>
                        <div className="tooltip"><p className="custom-input__error">{fieldError}</p></div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CustomInput;


