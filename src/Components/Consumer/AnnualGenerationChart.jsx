import React from 'react';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const AnnualGenerationChart = ({ chartData }) => {
  if (!chartData || chartData.length === 0) {
    return <div style={{ marginTop: 30, textAlign: "center" }}>
      <h3>Annual Generation Summary</h3>
      <p>No data available for the chart</p>
    </div>;
  }

  return (
    <div style={{ marginTop: 30, textAlign: "center" }}>
      <h3>Annual Generation Summary</h3>
      <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="hour"
              label={{
                value: "Hour of Day",
                position: "insideBottom",
                offset: -5,
              }}
            />
            <YAxis
              label={{
                value: "Generation (kWh)",
                angle: -90,
                position: "insideLeft",
              }}
            />
            <Tooltip 
              formatter={(value) => [`${value} kWh`, 'Generation']}
              labelFormatter={(hour) => `Hour: ${hour}`}
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="generation" 
              stroke="#8884d8" 
              name="Generation (kWh)"
              dot={false} // Remove dots for cleaner look with many data points
              activeDot={{ r: 6 }} // Make active dot larger when hovered
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AnnualGenerationChart;