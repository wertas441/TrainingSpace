import {useEffect, useRef} from "react";

export function useModalWindowRef(isFilterWindowOpen: boolean, toggleFilterWindow: () => void) {

    const modalWindowRef = useRef<HTMLDivElement | null>(null);
    const toggleBtnRef = useRef<HTMLButtonElement | null>(null);

    useEffect(() => {
        if (!isFilterWindowOpen) return;
        const handleOutside = (e: MouseEvent) => {
            const target = e.target as Node;
            if (modalWindowRef.current && modalWindowRef.current.contains(target)) return;
            if (toggleBtnRef.current && toggleBtnRef.current.contains(target)) return;
            toggleFilterWindow();
        };
        document.addEventListener('mousedown', handleOutside);
        return () => document.removeEventListener('mousedown', handleOutside);
    }, [isFilterWindowOpen, toggleFilterWindow]);

    return {
        modalWindowRef,
        toggleBtnRef,
    }
}