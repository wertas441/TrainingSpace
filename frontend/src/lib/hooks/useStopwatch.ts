import {useEffect, useState} from "react";

export function useStopwatch() {

    const [seconds, setSeconds] = useState(0);
    const [isRunning, setIsRunning] = useState(false);

    function formatTime(totalSeconds: number): string {
        const hours = Math.floor(totalSeconds / 3600);

        const minutes = Math.floor((totalSeconds % 3600) / 60);

        const seconds = totalSeconds % 60;
        return [
            hours.toString().padStart(2, "0"),
            minutes.toString().padStart(2, "0"),
            seconds.toString().padStart(2, "0"),
        ].join(":");
    }

    useEffect(() => {
        if (!isRunning) return;
        const interval = setInterval(() => {
            setSeconds((prev) => prev + 1);
        }, 1000);
        return () => clearInterval(interval);
    }, [isRunning]);

    const toggle = () => setIsRunning((prev) => !prev);
    const reset = () => {
        setSeconds(0);
        setIsRunning(false);
    };

    return {
        seconds,
        isRunning,
        toggle,
        reset,
        formatTime
    };
}