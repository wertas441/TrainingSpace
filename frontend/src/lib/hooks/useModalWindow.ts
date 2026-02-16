import {useCallback, useEffect, useRef, useState} from "react";

export function useModalWindow(){

    const [isProcess, setIsProcess] = useState<boolean>(false);
    const [isModalWindowOpen, setIsModalWindowOpen] = useState<boolean>(false);

    const windowModalRef = useRef<HTMLDivElement>(null);

    const [isRendered, setIsRendered] = useState<boolean>(false);
    const [isExiting, setIsExiting] = useState<boolean>(false);
    const exitTimerRef = useRef<number | null>(null);

    const toggleModalWindow = useCallback(() => {
        setIsModalWindowOpen(!isModalWindowOpen);
    }, [isModalWindowOpen]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (windowModalRef.current && !windowModalRef.current.contains(event.target as Node)) {
                if (!isProcess) toggleModalWindow();
            }
        };
        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                if (isModalWindowOpen && !isProcess) toggleModalWindow();
            }
        };

        if (isModalWindowOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            document.addEventListener('keydown', handleEscape);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleEscape);
        };
    }, [isModalWindowOpen, isProcess, toggleModalWindow]);


    useEffect(() => {
        // Управление монтированием для анимаций входа/выхода
        if (isModalWindowOpen) {
            if (exitTimerRef.current) {
                window.clearTimeout(exitTimerRef.current);
                exitTimerRef.current = null;
            }

            setIsRendered(true);
            setIsExiting(false);
        } else if (isRendered) {
            // Запускаем анимацию выхода и размонтируем по завершению
            setIsExiting(true);
            exitTimerRef.current = window.setTimeout(() => {
                setIsRendered(false);
                setIsExiting(false);
                exitTimerRef.current = null;
            }, 220); // должно соответствовать длительности plx-scale-out/plx-fade-out
        }
        return () => {
            if (exitTimerRef.current) {
                window.clearTimeout(exitTimerRef.current);
                exitTimerRef.current = null;
            }
        };
    }, [isModalWindowOpen, isRendered]);


    return {
        isModalWindowOpen,
        setIsModalWindowOpen,
        isRendered,
        isProcess,
        setIsRendered,
        isExiting,
        setIsExiting,
        exitTimerRef,
        setIsProcess,
        toggleModalWindow,
        windowModalRef,
    }
}