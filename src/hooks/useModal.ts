import { useState } from "react";

export function useModal(initialValue = false) {
    const [ isOpen, setIsOpen ] = useState(initialValue);

    const open = () => setIsOpen(true);
    const close = () => setIsOpen(false);
    const toggle = () => setIsOpen((prev) => !prev);

    return{ isOpen, open, close, toggle };
}