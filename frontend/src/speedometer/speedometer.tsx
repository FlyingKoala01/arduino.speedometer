import React, { useEffect, useState } from "react";
import { useWebSocket } from "../context/WebSocketContext";
import Clock from "./components/clock";
import SpeedGraph from "./components/GraphSpeed"; // Import the SpeedGraph component

const Speedometer = () => {
  const socket = useWebSocket();
  const [leftSpeed, setLeftSpeed] = useState<number>(0);
  const [rightSpeed, setRightSpeed] = useState<number>(0);
  const [leftSpeeds, setLeftSpeeds] = useState<
    { timestamp: number; value: number }[]
  >([]); // Store timestamped values
  const [rightSpeeds, setRightSpeeds] = useState<
    { timestamp: number; value: number }[]
  >([]); // Store timestamped values

  useEffect(() => {
    if (socket) {
      socket.on("serial-data", (data) => {
        // Parsing the incoming data
        const match = data.match(/L: (-?\d+), R: (-?\d+)/);
        if (match) {
          const timestamp = Date.now(); // Get the current timestamp
          const newLeftSpeed = parseInt(match[1], 10);
          const newRightSpeed = parseInt(match[2], 10);

          // Update the arrays of speeds with timestamps
          setLeftSpeeds((prev) => {
            const updated =
              prev.length >= 25
                ? [...prev.slice(1), { timestamp, value: newLeftSpeed }]
                : [...prev, { timestamp, value: newLeftSpeed }];
            return updated;
          });
          setRightSpeeds((prev) => {
            const updated =
              prev.length >= 25
                ? [...prev.slice(1), { timestamp, value: newRightSpeed }]
                : [...prev, { timestamp, value: newRightSpeed }];
            return updated;
          });

          setLeftSpeed(newLeftSpeed);
          setRightSpeed(newRightSpeed);
        }
      });
    }

    return () => {
      if (socket) {
        socket.off("serial-data");
      }
    };
  }, [socket]);

  // Function to calculate average
  const calculateAverage = (arr: { timestamp: number; value: number }[]) =>
    arr.reduce((a, b) => a + b.value, 0) / arr.length;

  return (
    <div className="relative flex flex-col items-center bg-[#141526] justify-center h-screen">
      <h1 className="text-2xl font-bold mb-4 text-white">Robot Speedometers</h1>
      <div className="flex mt-4 w-full m-10 justify-between h-1/5 flex-row ">
        <div id="left-speed">
          <p className="text-white">
            Average Left Speed: {calculateAverage(leftSpeeds).toFixed(2)}
          </p>
          <SpeedGraph data={leftSpeeds} />
        </div>
        <div id="right-speed">
          <p className="text-white">
            Average Right Speed: {calculateAverage(rightSpeeds).toFixed(2)}
          </p>
          <SpeedGraph data={rightSpeeds} />
        </div>
      </div>
      <div className="flex w-full justify-between mt-20 px-10 h-2/5">
        <div className="flex w-1/3 flex-col items-center">
          <div className="text-xl font-semibold text-white">
            Left Speedometer
          </div>
          {/* Placeholder for left speedometer */}
          <div className=" w-full flex items-center justify-center m-2">
            <Clock id="left-clock" value={leftSpeed}></Clock>
          </div>
        </div>
        <div className="flex w-1/3 flex-col items-center">
          <div className="text-xl font-semibold text-white">
            Right Speedometer
          </div>
          <div className="w-full flex items-center justify-center m-2">
            <Clock id="right-clock" value={rightSpeed}></Clock>
          </div>
        </div>
      </div>
      {/* Render the SpeedGraph component */}
    </div>
  );
};

export default Speedometer;
