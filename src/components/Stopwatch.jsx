import React, { useState, useEffect } from "react";
import { PlayArrow, Pause, Replay, RotateLeft } from "@mui/icons-material"; // MUI Icons

const Stopwatch = () => {
    const [startTime, setStartTime] = useState(null); // Track when the stopwatch started
    const [elapsedTime, setElapsedTime] = useState(0); // Store elapsed time in ms
    const [isRunning, setIsRunning] = useState(false);
    const [hasStarted, setHasStarted] = useState(false);

    useEffect(() => {
        let timer;
        if (isRunning) {
            timer = setInterval(() => {
                setElapsedTime(Date.now() - startTime);
            }, 10);
        } else {
            clearInterval(timer);
        }
        return () => clearInterval(timer);
    }, [isRunning, startTime]);

    // Convert time to hours, minutes, seconds, milliseconds
    const totalTime = startTime ? elapsedTime : 0;
    const hours = Math.floor(totalTime / (60 * 60 * 1000));
    const minutes = Math.floor((totalTime % (60 * 60 * 1000)) / (60 * 1000));
    const seconds = Math.floor((totalTime % (60 * 1000)) / 1000);
    const milliseconds = Math.floor((totalTime % 1000) / 10); 

    const handleStart = () => {
        setIsRunning(true);
        setHasStarted(true);
        setStartTime(Date.now() - elapsedTime);
    };

    const handleStop = () => {
        setIsRunning(false);
    };

    const handleReset = () => {
        setIsRunning(false);
        setElapsedTime(0);
        setStartTime(null);
        setHasStarted(false);
    };

    return (
        <div className="flex flex-col items-center space-y-6 p-6 my-5 bg-white text-white rounded-xl shadow-lg">
            
            {/* Stopwatch Display */}
            <div className="grid grid-flow-col gap-5 text-center auto-cols-max text-black bg-gray-100 p-4 rounded-lg">
                <div className="flex flex-col items-center">
                    <span className="font-mono text-5xl">{hours.toString().padStart(2, '0')}</span>
                    <span className="text-lg">Hours</span>
                </div>
                <div className="flex flex-col items-center">
                    <span className="font-mono text-5xl">{minutes.toString().padStart(2, '0')}</span>
                    <span className="text-lg">Minutes</span>
                </div>
                <div className="flex flex-col items-center">
                    <span className="font-mono text-5xl">{seconds.toString().padStart(2, '0')}</span>
                    <span className="text-lg">Seconds</span>
                </div>
                <div className="flex flex-col items-center">
                    <span className="font-mono text-5xl">{milliseconds.toString().padStart(2, '0')}</span>
                    <span className="text-lg">Milliseconds</span>
                </div>
            </div>

            {/* Dynamic Buttons with MUI Icons */}
            <div className="flex space-x-4">
                {!hasStarted && (
                    <button 
                        className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg shadow-md flex items-center"
                        onClick={handleStart}
                    >
                        <PlayArrow className="mr-2" /> Start
                    </button>
                )}
                {hasStarted && isRunning && (
                    <button 
                        className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg shadow-md flex items-center"
                        onClick={handleStop}
                    >
                        <Pause className="mr-2" /> Stop
                    </button>
                )}
                {hasStarted && !isRunning && (
                    <>
                        <button 
                            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg shadow-md flex items-center"
                            onClick={handleStart}
                        >
                            <Replay className="mr-2" /> Restart
                        </button>
                        <button 
                            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg shadow-md flex items-center"
                            onClick={handleReset}
                        >
                            <RotateLeft className="mr-2" /> Reset
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export default Stopwatch;
