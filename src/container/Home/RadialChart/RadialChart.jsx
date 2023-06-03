import React from "react";
import ReactApexChart from "react-apexcharts";

const RadialChart = ({ profitAmounts, subsidedAmounts }) => {
  const options = {
    series: [
      Math.round((profitAmounts / subsidedAmounts) * -1 * 100),
      Math.round(((subsidedAmounts * -1) / profitAmounts) * 100),
    ],
    options: {
      radialBar: {
        dataLabels: {
          name: {
            fontSize: "22px",
          },
          value: {
            fontSize: "16px",
          },
          total: {
            show: true,
            label: "Total",
          },
        },
      },

      colors: ["#38c1a7", "#f57676"],
      labels: ["Profit", "Subsided"],

      responsive: [
        {
          breakpoint: 480,
          options: {
            legend: {
              show: false,
            },
          },
        },
      ],
    },
  };

  return (
    <section>
      <ReactApexChart
        type="radialBar"
        series={options.series}
        options={options.options}
        width={300}
        height={300}
      />
    </section>
  );
};

export default RadialChart;
