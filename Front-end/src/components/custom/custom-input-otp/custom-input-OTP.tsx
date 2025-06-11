import type React from "react"
import { useFormContext, type RegisterOptions } from "react-hook-form"
import { useRef, useState, useEffect } from "react"
import './custom-input-otp.scss'
import { ErrorIcon } from "../../icons.constants"

type CustomOTPInputProps = {
    name: string,
    label?: string,
    validationOptions?: RegisterOptions,
    length?: number
}

const CustomOTPInput: React.FC<CustomOTPInputProps> = ({
    name,
    label,
    validationOptions,
    length = 6
}) => {
    const { register, formState: { errors }, setValue } = useFormContext();
    const fieldError = errors[name]?.message as string | undefined;
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
    const [otpValues, setOtpValues] = useState<string[]>(new Array(length).fill(''));

    const handleInputChange = (index: number, value: string) => {
        if (value.length > 1) return; // Only allow single character

        const newOtpValues = [...otpValues];
        newOtpValues[index] = value;
        setOtpValues(newOtpValues);

        // Update form value
        const otpString = newOtpValues.join('');
        setValue(name, otpString);

        // Move to next input if value is entered
        if (value && index < length - 1) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
        if (e.key === 'Backspace' && !otpValues[index] && index > 0) {
            // Move to previous input on backspace if current is empty
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handlePaste = (e: React.ClipboardEvent) => {
        e.preventDefault();
        const pasteData = e.clipboardData.getData('text').slice(0, length);
        const newOtpValues = [...otpValues];

        for (let i = 0; i < pasteData.length && i < length; i++) {
            newOtpValues[i] = pasteData[i];
        }

        setOtpValues(newOtpValues);
        setValue(name, newOtpValues.join(''));

        // Focus the next empty input or the last input
        const nextIndex = Math.min(pasteData.length, length - 1);
        inputRefs.current[nextIndex]?.focus();
    };

    useEffect(() => {
        console.log(fieldError, 'fieldError')
    }, []);

    return (
        <div className="custom-otp-input">
            {label && (
                <label className="custom-otp-input__label">
                    {label}
                </label>
            )}
            <div className="custom-otp-input__field-container">
                <div className="error-icon-wrapper">
                    <ErrorIcon />
                    <svg style={{ cursor: "pointer", display: fieldError ? "block" : "none" }} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="var(--error-color)" className="size-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
                    </svg>
                    <div className="tooltip"><p className="custom-otp-input__error">{fieldError}</p></div>
                </div>
                <div className="otp-wrapper">
                    <div className="otp-inputs">
                        {Array.from({ length }, (_, index) => (
                            <input
                                key={index}
                                {...register(name, validationOptions)}
                                ref={(el) => { inputRefs.current[index] = el; }}
                                type="text"
                                inputMode="numeric"
                                pattern="[0-9]*"
                                maxLength={1}
                                value={otpValues[index]}
                                onChange={(e) => handleInputChange(index, e.target.value)}
                                onKeyDown={(e) => handleKeyDown(index, e)}
                                onPaste={handlePaste}
                                style={{ borderColor: fieldError ? "var(--error-color) !important" : "var(--border-color) !important" }}
                                className={`custom-otp-input__field otp-field ${fieldError ? "custom-otp-input__field--error" : ""}`}
                            />
                        ))}
                    </div>

                </div>
            </div>
        </div>
    );
}

export default CustomOTPInput;