import React, { useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

interface SpeedGraphProps {
  data: { timestamp: number; value: number }[];
}

const formatTimestamp = (timestamp: number) => {
  const date = new Date(timestamp);
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const seconds = date.getSeconds().toString().padStart(2, "0");
  return `${hours}:${minutes}:${seconds}`;
};

const SpeedGraph: React.FC<SpeedGraphProps> = ({ data }) => {
  const formattedData = data.map((item) => ({
    ...item,
    formattedTimestamp: formatTimestamp(item.timestamp),
  }));

  return (
    <div className="w-full h-1/5">
      <LineChart
        width={600}
        height={200}
        data={formattedData}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <XAxis dataKey="formattedTimestamp" />
        {/* Use the formatted timestamp for XAxis */}
        <YAxis dataKey="value" />
        <CartesianGrid stroke="#eee" strokeDasharray="5 5" /> <Tooltip />
        <Line
          type="monotone"
          dataKey="value"
          stroke="#8884d8"
          strokeWidth={3}
        />
      </LineChart>
    </div>
  );
};

export default SpeedGraph;
