"use client";

import React, {useEffect, useState} from "react";
import {PieChart, Pie, Cell, ResponsiveContainer} from "recharts";

const dataColor = [
  "var(--app-purple)",
  "var(--app-pink)",
  "var(--app-text)",
  "var(--app-light-blue)",
  "var(--app-orange)",
  "var(--app-hot-pink)",
  "var(--app-yellow)",
  "var(--app-neon-cyan)",
];

export default function BookingDistribution({data,title, subtitle, classWr, classCircle}) {
  const [dataResult, setDataResult] = useState(null);
  useEffect(() => {
    if (data?.length) {
      const result = data?.map((item, index) => {
        if (dataColor[index]) {
          return {
            name: item?.name,
            value: item?.totalStock,
            color: dataColor[index],
          };
        } else {
          const randomHue = (index * 137.5) % 360;
          const backgroundColor = `hsl(${randomHue}, 70%, 50%)`;
          return {
            name: item?.name,
            value: item?.totalStock,
            color: backgroundColor,
          };
        }
      });
      setDataResult(result);
    }
  }, [data]);

  return (
    <div className="dashboard__chart">
      <div className="dashboard__chart-top">
        <h2 className="dashboard__chart-title">{title || 'Distribution Total'}</h2>
      </div>

      <div className={`dashboard__chart-bottom ${classWr ? classWr : ""}`}>
        <div className={`dashboard__chart-left ${classCircle ? classCircle : ""}`}>
          <ResponsiveContainer width="100%" aspect={1}>
            <PieChart>
              <Pie
                data={dataResult}
                cx="50%"
                cy="50%"
                innerRadius="60%" // Using percentages instead of fixed integers allows the ring thickness to scale
                outerRadius="95%" // Scales dynamically based on the responsive bounding container
                paddingAngle={0}
                dataKey="value"
                startAngle={90}
                endAngle={-270}
              >
                {dataResult?.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.color}
                    stroke="none"
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="dashboard__chart-right">
          <span className="dashboard__chart-right-title">
            {subtitle||'Vehicle Categories'}
          </span>
          <div className="dashboard__chart-right-list">
            {dataResult?.map((item, index) => (
              <div key={index} className="dashboard__chart-card">
                <div className="dashboard__chart-item-left">
                  <span
                    className="dashboard__chart-dot"
                    style={{backgroundColor: item.color}}
                  />
                  <span className="dashboard__chart-right-name">
                    {item.name}
                  </span>
                </div>
                <span className="dashboard__chart-right-value">
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
