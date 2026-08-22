import { useState, type ChangeEvent, type FormEvent } from "react";

type ValidationErrors<T> = Partial<Record<keyof T, string>>;

export function useForm<T extends Record<string, any>>(
  initialValues: T,
  validate?: (values: T) => ValidationErrors<T>
) {
    const [ values, setValues ] = useState<T>(initialValues);
    const [ errors, setErrors ] = useState<ValidationErrors<T>>({});
    const [ touched, setTouched ] = useState<Partial<Record<keyof T, boolean>>>({});

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const parsedValue = type === 'number' ? parseFloat(value) || 0: value;

        if(errors[name as keyof T]) {
            setErrors((prev) => ({...prev, [name]: undefined}));
        }
    };

const handleBlur = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    if (validate) {
      const newErrors = validate(values);
      setErrors(newErrors);
    }
  };

  const handleSubmit = (callback: (values: T) => void) => (e: FormEvent) => {
    e.preventDefault();
    if (validate) {
      const newErrors = validate(values);
      setErrors(newErrors);
      if (Object.keys(newErrors).length === 0) {
        callback(values);
      }
    } else {
      callback(values);
    }
  };

  const reset = () => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  };

  return {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    reset,
    setValues,
    setErrors,
  };
}