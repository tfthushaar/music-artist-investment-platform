import React, { forwardRef } from 'react';
import './Input.css';

const Input = forwardRef(({
  label,
  error,
  type = 'text',
  fullWidth = false,
  helperText,
  className = '',
  ...props
}, ref) => {
  const inputClasses = [
    'input__field',
    error ? 'input__field--error' : '',
    fullWidth ? 'input__field--full-width' : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <div className="input__container">
      {label && (
        <label className="input__label">
          {label}
        </label>
      )}
      <input
        ref={ref}
        type={type}
        className={inputClasses}
        {...props}
      />
      {(error || helperText) && (
        <span className={`input__helper-text ${error ? 'input__helper-text--error' : ''}`}>
          {error || helperText}
        </span>
      )}
    </div>
  );
});

export default Input;