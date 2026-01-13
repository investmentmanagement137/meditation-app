import { useState, useEffect, useRef, useCallback } from 'react';

// Bell sound URLs (Base64 or external - using placeholders for now or import assets later)
// For this migration, we assume audio elements will be handled by the parent or passed in.
// Or we can construct Audio objects here. But browsers block auto-play.
// We'll manage the state of the timer here.

export function useTimer(initialDurationMinutes = 10, onComplete, onInterval) {
    const [durationMinutes, setDurationMinutes] = useState(initialDurationMinutes);
    const [remainingSeconds, setRemainingSeconds] = useState(initialDurationMinutes * 60);
    const [isActive, setIsActive] = useState(false);
    const [isPaused, setIsPaused] = useState(false);

    const intervalRef = useRef(null);
    const onCompleteRef = useRef(onComplete);
    const onIntervalRef = useRef(onInterval);

    // Update refs to avoid effect re-runs
    useEffect(() => {
        onCompleteRef.current = onComplete;
        onIntervalRef.current = onInterval;
    }, [onComplete, onInterval]);

    // Update remaining if duration changes AND not active
    useEffect(() => {
        if (!isActive) {
            setRemainingSeconds(durationMinutes * 60);
        }
    }, [durationMinutes, isActive]);

    const startTimer = useCallback(() => {
        setIsActive(true);
        setIsPaused(false);
    }, []);

    const pauseTimer = useCallback(() => {
        setIsPaused(true);
    }, []);

    const resumeTimer = useCallback(() => {
        setIsPaused(false);
    }, []);

    const stopTimer = useCallback(() => {
        setIsActive(false);
        setIsPaused(false);
        setRemainingSeconds(durationMinutes * 60);
        if (intervalRef.current) clearInterval(intervalRef.current);
    }, [durationMinutes]);

    const tick = useCallback(() => {
        setRemainingSeconds(prev => {
            if (prev <= 0) {
                if (intervalRef.current) clearInterval(intervalRef.current);
                setIsActive(false);
                if (onCompleteRef.current) onCompleteRef.current();
                return 0;
            }

            const nextVal = prev - 1;

            // Interval Check logic (simplified)
            // Real implementation requires knowing the original total Duration or passing in Interval settings
            // We'll handle interval checks in the component using the `remainingSeconds` value usually, 
            // OR we can move that logic here if we pass `selectedInterval` to the hook.
            if (onIntervalRef.current) onIntervalRef.current(nextVal, durationMinutes * 60);

            return nextVal;
        });
    }, [durationMinutes]);

    useEffect(() => {
        if (isActive && !isPaused) {
            intervalRef.current = setInterval(tick, 1000);
        } else {
            if (intervalRef.current) clearInterval(intervalRef.current);
        }
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [isActive, isPaused, tick]);

    return {
        durationMinutes,
        setDurationMinutes,
        remainingSeconds,
        isActive,
        isPaused,
        startTimer,
        pauseTimer,
        resumeTimer,
        stopTimer,
        toggleTimer: isPaused ? resumeTimer : pauseTimer
    };
}
