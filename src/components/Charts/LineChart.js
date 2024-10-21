import React, { useEffect, useState } from "react";
import { Typography } from "antd";
import ReactApexChart from "react-apexcharts";
import { useStaticalUser } from "../../hooks/Statistical/StaticalUser";
import { Iconify } from "../../utils/Iconify";
import dayjs from "dayjs";

const { Title, Paragraph } = Typography;

export default function LineChart() {
  const [chartData, setChartData] = useState({
    series: [],
    categories: [],
    totals: {
      admin: 0,
      manager: 0,
      noGroup: 0,
      total: 0,
    },
  });

  const endDate = dayjs().endOf("month").format("YYYY-MM-DD");
  const startDate = dayjs()
    .subtract(11, "months")
    .startOf("month")
    .format("YYYY-MM-DD");

  const {
    data: staticalUser,
    isLoading,
    error,
  } = useStaticalUser(startDate, endDate);

  useEffect(() => {
    if (!isLoading && !error && staticalUser && staticalUser.user_counts) {
      const monthlyCategories = [];
      const adminCounts = Array(12).fill(0);
      const managerCounts = Array(12).fill(0);
      const noGroupCounts = Array(12).fill(0);
      const totalCounts = Array(12).fill(0);

      let totalAdmin = 0;
      let totalManager = 0;
      let totalNoGroup = 0;

      for (let i = 0; i < 12; i++) {
        const month = dayjs()
          .subtract(11 - i, "months")
          .format("MMM");
        monthlyCategories.push(month);
      }

      staticalUser.user_counts.forEach((entry) => {
        const monthIndex = dayjs(entry.date).month();

        adminCounts[monthIndex] = entry.admin_count || 0;
        managerCounts[monthIndex] = entry.manager_count || 0;
        noGroupCounts[monthIndex] = entry.no_group_count || 0;

        totalAdmin += adminCounts[monthIndex];
        totalManager += managerCounts[monthIndex];
        totalNoGroup += noGroupCounts[monthIndex];

        totalCounts[monthIndex] =
          adminCounts[monthIndex] +
          managerCounts[monthIndex] +
          noGroupCounts[monthIndex];
      });

      const grandTotal = totalAdmin + totalManager + totalNoGroup;

      setChartData({
        series: [
          {
            name: "Admin",
            data: adminCounts,
          },
          {
            name: "Manager",
            data: managerCounts,
          },
          {
            name: "No Group",
            data: noGroupCounts,
          },
          {
            name: "Total",
            data: totalCounts,
          },
        ],
        categories: monthlyCategories,
        totals: {
          admin: totalAdmin,
          manager: totalManager,
          noGroup: totalNoGroup,
          total: grandTotal,
        },
      });
    }
  }, [staticalUser, isLoading, error]);

  const lineChartConfig = {
    series: chartData.series,
    options: {
      chart: {
        type: "area",
        height: 350,
        toolbar: {
          show: false,
        },
      },
      xaxis: {
        categories: chartData.categories,
        labels: {
          style: {
            fontSize: "14px",
            fontWeight: 600,
            colors: Array(12).fill("#8c8c8c"),
          },
        },
      },
      yaxis: {
        labels: {
          style: {
            fontSize: "14px",
            fontWeight: 600,
            colors: ["#8c8c8c"],
          },
        },
      },
      dataLabels: {
        enabled: true,
        style: {
          fontSize: "12px",
          fontWeight: 700,
          colors: ["#304758"],
        },
      },
      stroke: {
        curve: "smooth",
      },
      tooltip: {
        y: {
          formatter: (val) => val,
        },
      },
      legend: {
        show: true,
      },
    },
  };

  return (
    <div>
      {isLoading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className="error-message">Lỗi: {error.message}</div>
      ) : (
        <>
          <div className="linechart">
            <div>
              <Title level={5}>Active Users</Title>
              <Paragraph className="lastweek">
                than the last week <span className="bnb2">+30%</span>
              </Paragraph>
            </div>
            <div className="sales">
              <ul>
                <li>
                  {<Iconify icon="akar-icons:minus" />} Admin:{" "}
                  {chartData.totals.admin}
                </li>
                <li>
                  {
                    <Iconify
                      icon="akar-icons:minus"
                      style={{ color: "green" }}
                    />
                  }{" "}
                  Manager: {chartData.totals.manager}
                </li>
                <li>
                  {
                    <Iconify
                      icon="akar-icons:minus"
                      style={{ color: "orange" }}
                    />
                  }{" "}
                  No Group: {chartData.totals.noGroup}
                </li>
                <li>
                  {
                    <Iconify
                      icon="akar-icons:minus"
                      style={{ color: "blue" }}
                    />
                  }{" "}
                  Total: {chartData.totals.total}
                </li>
              </ul>
            </div>
          </div>
          <ReactApexChart
            series={lineChartConfig.series}
            options={lineChartConfig.options}
            className="full-width"
            type="area"
            height={350}
            width={"100%"}
          />
        </>
      )}
    </div>
  );
}
