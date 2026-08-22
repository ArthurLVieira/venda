import { useEffect, useState } from "react";

export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((val: T) => T)) => void] {
    const [ storedValue, setStoredValue ] = useState<T>(() => {
        try {
            const item = window.localStorage.getItem(key);
            return item ? JSON.parse(item) : initialValue;
        } catch(e) {
            console.log(`Erro ao ler localStorage key "${key}": `, e);
            return initialValue;
        }
    });

    const setValue = (value: T | ((val: T) => T)) => {
        try {
            const valueToStorage = value instanceof Function ? value(storedValue) : value;
            setStoredValue(valueToStorage);
            window.localStorage.setItem(key, JSON.stringify(valueToStorage));
        } catch(e) {
            console.log(`Erro ao salvar localStorage key "${key}": `, e);
        }
    }

    useEffect(() => {
        const handleStorageChange = (e: StorageEvent) => {
            if(e.key === key && e.newValue) {
                setStoredValue(JSON.parse(e.newValue));
            };
        };
        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }), [ key ];

    return [ storedValue, setValue ];
}