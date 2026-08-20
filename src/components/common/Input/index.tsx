import React, { type InputHTMLAttributes } from 'react';
import Styles from './styles.module.css';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input: React.FC<InputProps> = ({
  label,
  error,
  className,
  id,
  ...rest
}) => {
  const inputId = id || label?.replace(/\s/g, '-').toLocaleUpperCase();

  return (
    <>
      <div className={Styles.wrapper}>
        {label && (
          <label htmlFor={inputId} className={Styles.label}>
            {label}
          </label>
        )}
        <input
          id={inputId}
          className={`${Styles.input} ${error ? Styles.error : ''} ${className || ''}`}
          {...rest}
        />
      </div>
    </>
  );
};

export default Input;
