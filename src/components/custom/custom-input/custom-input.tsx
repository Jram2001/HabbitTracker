import type React from "react"
import { useFormContext, type RegisterOptions } from "react-hook-form"
import './custom-input.css'
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
                <input
                    id={name}
                    type={type}
                    {...register(name, validationOptions)}
                    placeholder={placeHolder}
                    className={`custom-input__field ${fieldError ? "custom-input__field--error" : ""}`}
                />
            </div>
            {fieldError && <p className="custom-input__error">{fieldError}</p>}
        </div>
    );
}

export default CustomInput;