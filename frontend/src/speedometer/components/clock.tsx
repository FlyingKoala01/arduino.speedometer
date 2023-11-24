import { useEffect, useState } from "react";
import GaugeChart from "react-gauge-chart";
import GaugeComponent from "./GaugeComponent";

interface ClockProps {
  id: string;
  value: number;
}

const Clock = ({ id, value }: ClockProps) => {
  const [clockId, setClockId] = useState<string>(id);
  const [clockPercent, setClockPercent] = useState<number>((value + 100) / 2); // Convert value to a percentage between 0 and 100

  useEffect(() => {
    if (!id || value === undefined) return;

    setClockId(id);
    setClockPercent((value + 100) / 2); // Convert value to a percentage between 0 and 100
  }, [id, value]);

  return (
    <GaugeComponent
      className="bg-[#44498f] rounded-xl"
      arc={{
        subArcs: [
          {
            limit: 20,
            color: "#EA4228",
            showTick: true,
          },
          {
            limit: 40,
            color: "#F58B19",
            showTick: true,
          },
          {
            limit: 60,
            color: "#F5CD19",
            showTick: true,
          },
          {
            limit: 100,
            color: "#5BE12C",
            showTick: true,
          },
        ],
      }}
      value={clockPercent}
      id={clockId}
    />
  );
};

export default Clock;
