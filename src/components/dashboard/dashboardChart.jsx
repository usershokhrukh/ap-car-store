"use client";

import React from "react";
import {PieChart, Pie, Cell, ResponsiveContainer} from "recharts";

const data = [
  {name: "Krossover va SUV", value: 16, color: "var(--app-purple)"},
  {name: "Lyuks va premium", value: 16, color: "var(--app-pink)"},
  {name: "Sedan  sport", value: 14, color: "var(--app-text)"},
  {name: "Seda", value: 13, color: "var(--app-light-blue)"},
  {name: "Sport avtomobil", value: 13, color: "var(--app-orange)"},
  {name: "Pikap va yuk", value: 8, color: "var(--app-hot-pink)"},
  {name: "Xetchbek", value: 8, color: "var(--app-yellow)"},
  {name: "Minivan", value: 4, color: "var(--app-neon-cyan)"},
];

export default function BookingDistribution() {
  return (
    <div className="dashboard__chart">
      <div className="dashboard__chart-top">
        <h2 className="dashboard__chart-title">Distribution Total</h2>
      </div>

      <div className="dashboard__chart-bottom">
        <div className="dashboard__chart-left">
          <ResponsiveContainer width="100%" aspect={1}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius="60%" // Using percentages instead of fixed integers allows the ring thickness to scale
                outerRadius="95%" // Scales dynamically based on the responsive bounding container
                paddingAngle={0}
                dataKey="value"
                startAngle={90}
                endAngle={-270}
              >
                {data.map((entry, index) => (
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
            Vehicle Categories
          </span>
          <div className="dashboard__chart-right-list">
            {data.map((item, index) => (
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
                  {item.value}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
