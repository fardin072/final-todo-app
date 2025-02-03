import React, { useState, useEffect } from "react";

const Countdown = ({ deadline }) => {
    const calculateRemainingTime = () => {
        const deadlineTime = new Date(deadline).getTime();
        return Math.max(deadlineTime - Date.now(), 0); // Ensure non-negative value
    };

    const [time, setTime] = useState(calculateRemainingTime());

    useEffect(() => {
        if (time > 0) {
            const timer = setInterval(() => {
                setTime((prevTime) => Math.max(prevTime - 1000, 0)); // Decrease by 1 second
            }, 1000);
            return () => clearInterval(timer);
        }
    }, [time]);

    const days = Math.floor(time / (24 * 60 * 60 * 1000));
    const hours = Math.floor((time % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
    const minutes = Math.floor((time % (60 * 60 * 1000)) / (60 * 1000));
    const seconds = Math.floor((time % (60 * 1000)) / 1000);

    return (
        <div className="flex flex-col items-center space-y-2 p-3">
            <h2 className="text-lg font-semibold">Time Left</h2>
            <div className="grid grid-flow-col gap-4 text-center auto-cols-max bg-gray-100 p-3 rounded-lg text-black">
                <div className="flex flex-col items-center">
                    <span className="font-mono text-xl">{days}</span>
                    <span className="text-sm">Days</span>
                </div>
                <div className="flex flex-col items-center">
                    <span className="font-mono text-xl">{hours}</span>
                    <span className="text-sm">Hours</span>
                </div>
                <div className="flex flex-col items-center">
                    <span className="font-mono text-xl">{minutes}</span>
                    <span className="text-sm">Minutes</span>
                </div>
                <div className="flex flex-col items-center">
                    <span className="font-mono text-xl">{seconds}</span>
                    <span className="text-sm">Seconds</span>
                </div>
            </div>
        </div>
    );
};

export default Countdown;
