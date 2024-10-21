import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  ResponsiveContainer,
} from "recharts";
import dayjs from "dayjs";
import { useStaticalUser } from "../../hooks/Statistical/StaticalUser";

const UserChart = () => {
  const [chartData, setChartData] = useState([]);

  // Calculate start and end dates for the last 12 months
  const endDate = dayjs().endOf("month").format("YYYY-MM-DD");
  const startDate = dayjs()
    .subtract(11, "months")
    .startOf("month")
    .format("YYYY-MM-DD");

  // Use the hook to fetch user statistics data
  const {
    data: staticalUser,
    isLoading,
    error,
  } = useStaticalUser(startDate, endDate);

  useEffect(() => {
    if (!isLoading && !error && staticalUser && staticalUser.user_counts) {
      const monthlyData = [];

      // Create an array of months for the last 12 months
      for (let i = 0; i < 12; i++) {
        const month = dayjs()
          .subtract(11 - i, "months")
          .format("MMM YYYY");

        monthlyData.push({
          date: month,
          adminCount: 0,
          managerCount: 0,
          noGroupCount: 0,
        });
      }

      // Iterate through the user statistics and assign values to the correct month
      staticalUser.user_counts.forEach((entry) => {
        const monthYear = dayjs(entry.date).format("MMM YYYY");
        const data = monthlyData.find((d) => d.date === monthYear);

        if (data) {
          data.adminCount = entry.admin_count || 0;
          data.managerCount = entry.manager_count || 0;
          data.noGroupCount = entry.no_group_count || 0;
        }
      });

      // Set the chart data state
      setChartData(monthlyData);
    }
  }, [staticalUser, isLoading, error]);

  return (
    <div>
      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        <div style={{ height: "400px", width: "100%" }}>
          <h3>Biểu đồ đường</h3>
          <ResponsiveContainer>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="adminCount" stroke="#8884d8" />
              <Line type="monotone" dataKey="managerCount" stroke="#82ca9d" />
              <Line type="monotone" dataKey="noGroupCount" stroke="#ff7300" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div style={{ height: "400px", width: "100%" }}>
          <h3>Biểu đồ cột</h3>
          <ResponsiveContainer>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="adminCount" fill="#8884d8" />
              <Bar dataKey="managerCount" fill="#82ca9d" />
              <Bar dataKey="noGroupCount" fill="#ff7300" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Error handling */}
      {error && <div className="error-message">Lỗi: {error.message}</div>}
      {isLoading && <div>Loading...</div>}
    </div>
  );
};

export default UserChart;
