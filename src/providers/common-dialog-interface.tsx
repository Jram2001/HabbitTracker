import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import CustomInput from '../components/custom/custom-input/custom-input';
import './common-dialog.scss'
import { FormProvider, useForm } from 'react-hook-form';

// Type definitions
type DialogType = 'confirmation' | 'input';

interface InputField {
    name: string;
    label: string;
    type?: string;
    defaultValue?: string | number;
    placeholder?: string;
    validator?: {
        [key: string]: string | RegExp | ((value: any) => string | boolean);
    }
}

interface DialogState {
    isOpen: boolean;
    type: DialogType;
    title: string;
    message: string;
    inputConfig?: InputField[];
    onConfirm: (data?: Record<string, string | number>) => void;
    onCancel: () => void;
}

interface DialogContextType {
    openDialog: (config: Omit<DialogState, 'isOpen'>) => void;
    closeDialog: () => void;
}

const DialogContext = createContext<DialogContextType | undefined>(undefined);

// Dialog Provider Component
export const DialogProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [dialogState, setDialogState] = useState<DialogState>({
        isOpen: false,
        type: 'confirmation',
        title: '',
        message: '',
        inputConfig: [],
        onConfirm: () => { },
        onCancel: () => { },
    });

    const openDialog = useCallback((config: Omit<DialogState, 'isOpen'>) => {
        setDialogState({ ...config, isOpen: true });
    }, []);

    const closeDialog = useCallback(() => {
        setDialogState((prev) => ({ ...prev, isOpen: false }));
    }, []);

    return (
        <DialogContext.Provider value={{ openDialog, closeDialog }}>
            {children}
            <CommonDialog {...dialogState} />
        </DialogContext.Provider>
    );
};

// Custom hook to access dialog context
export const useDialog = () => {
    const context = useContext(DialogContext);
    if (!context) {
        throw new Error('useDialog must be used within a DialogProvider');
    }
    return context;
};

// Common Dialog Component
const CommonDialog: React.FC<DialogState> = ({
    isOpen,
    type,
    title,
    message,
    inputConfig = [],
    onConfirm,
    onCancel,
}) => {
    const [isAnimating, setIsAnimating] = useState(false);
    const dialogRef = useRef<HTMLDivElement>(null);

    type FormValues = {
        [key: string]: string | number;
    };

    // Create default values from input config
    const defaultValues: FormValues = inputConfig.reduce((acc, field) => {
        acc[field.name] = field.defaultValue?.toString() ?? "";
        return acc;
    }, {} as FormValues);

    // Initialize form methods
    const methods = useForm<FormValues>({
        mode: "onTouched",
        defaultValues
    });

    const { handleSubmit, reset, formState: { errors } } = methods;

    // Reset form when dialog opens with new config
    useEffect(() => {
        if (isOpen && type === 'input') {
            const newDefaultValues = inputConfig.reduce((acc, field) => {
                acc[field.name] = field.defaultValue?.toString() ?? "";
                return acc;
            }, {} as FormValues);
            reset(newDefaultValues);
        }
    }, [isOpen, type, inputConfig, reset]);

    // Prevent body scroll when dialog is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            setIsAnimating(true);
        } else {
            document.body.style.overflow = '';
            setIsAnimating(false);
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    // Handle form submission
    const onSubmit = useCallback((data: FormValues) => {
        const convertedData: Record<string, string | number> = {};
        Object.keys(data).forEach(key => {
            const field = inputConfig.find(f => f.name === key);
            if (field?.type === 'number') {
                convertedData[key] = Number(data[key]) || 0;
            } else {
                convertedData[key] = data[key];
            }
        });
        onConfirm(convertedData);
    }, [onConfirm, inputConfig]);
    
    // Handle keyboard events (Esc to cancel)
    const handleKeyDown = useCallback(
        (e: React.KeyboardEvent) => {
            if (e.key === 'Escape') {
                onCancel();
            }
        },
        [onCancel]
    );

    // Focus dialog on open for accessibility
    useEffect(() => {
        if (isOpen && dialogRef.current) {
            dialogRef.current.focus();
        }
    }, [isOpen]);

    // Handle confirm action for non-input dialogs
    const handleConfirm = useCallback(() => {
        if (type === 'input') {
            handleSubmit(onSubmit)();
        } else {
            onConfirm();
        }
    }, [type, handleSubmit, onSubmit, onConfirm]);

    // Handle overlay click to close dialog
    const handleOverlayClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            onCancel();
        }
    };

    if (!isOpen) return null;

    return (
        <div
            className={`dialog-overlay ${isAnimating ? 'fadeIn' : 'fadeOut'}`}
            role="dialog"
            aria-labelledby="dialog-title"
            aria-modal="true"
            onKeyDown={handleKeyDown}
            onClick={handleOverlayClick}
            ref={dialogRef}
            tabIndex={-1}
        >
            <div className={`dialog-container ${isAnimating ? 'slideIn' : 'slideOut'}`}>
                <h2 id="dialog-title" className="dialog-title">
                    {title}
                </h2>
                <p className="dialog-message">{message}</p>

                {type === 'input' && inputConfig.length > 0 && (
                    <FormProvider {...methods}>
                        <form onSubmit={handleSubmit(onSubmit)} className="dialog-form">
                            <div className="dialog-input-container">
                                {inputConfig.map((field, index) => (
                                    <div key={field.name || index} className="dialog-input-wrapper">
                                        <CustomInput
                                            name={field.name}
                                            validationOptions={field.validator}
                                            placeHolder={field.placeholder}
                                            type={field.type}
                                        />
                                    </div>
                                ))}
                            </div>
                        </form>
                    </FormProvider>
                )}

                <div className="dialog-buttons">
                    <button
                        onClick={onCancel}
                        className="dialog-button dialog-button--cancel"
                        type="button"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleConfirm}
                        className="dialog-button dialog-button--confirm"
                        type="button"
                    >
                        {type === 'input' ? 'Submit' : 'OK'}
                    </button>
                </div>
            </div>
        </div>
    );
};