import React from 'react';
import Styles from './styles.module.css';

export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'danger'
  | 'success'
  | 'warning';
export type ButtonSize = 'small' | 'midium' | 'large';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: React.ReactNode;
  fullWidt?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'midium',
  children,
  fullWidt = false,
  className,
  ...rest
}) => {
  const classes = [
    Styles.button,
    Styles[variant],
    Styles[size],
    fullWidt ? Styles.fullWidth : '',
    className || '',
  ]
    .join(' ')
    .trim();

  return (
    <>
      <button className={classes} {...rest}>
        {children}
      </button>
    </>
  );
};

export default Button;
