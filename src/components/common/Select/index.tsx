import type { SelectHTMLAttributes } from 'react';
import Styles from './styles.module.css'
import type React from 'react';

export interface Option {
    value: string;
    label: string;
}

interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'onChange'> {
    options: Option[];
    label?: string;
    error?: string;
    onChange: (value: string) => void;
}

const Select: React.FC<SelectProps> = ({
    options,
    label,
    error,
    onChange,
    value,
    id,
    className,
    ...rest
}) => {
    const selectId = id || label?.replace(/\s/g, '-').toLowerCase();

    return(
        <div className={Styles.wrapper}>
            {label && (
                <label htmlFor={selectId} className={Styles.label}>
                    {label}
                </label>
            )}

            <select
                id={selectId}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className={`${Styles.select} ${error ? Styles.error : ''} ${className || ''}`}
            >
                <option value="">Selecione...</option>
                {options.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                        {opt.label}
                    </option>
                ))}
            </select>

            {error && <span className={Styles.errorMessage}>{error}</span>}
        </div>
    );
}

export default Select;