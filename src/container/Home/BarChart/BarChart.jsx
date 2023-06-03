import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import { db } from "../../../firebase/firebase-config";
import { collection, getDocs } from "firebase/firestore";

const BarChart = () => {
  const [users, setUsers] = useState([]);
  const [user, setUser] = useState({});
  const [accounting, setAccounting] = useState([]);

  /*
    Get first 35 elements from array Them map it and reverse them
  */
  const options = accounting && {
    series: [
      {
        name: "Total Amount:",
        data: [
          accounting.slice(0, 35).map(({ amount }) => amount),
        ][0].reverse(),
      },
    ],
    options: {
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: "55%",
          endingShape: "rounded",
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        show: true,
        width: 2,
        colors: ["transparent"],
      },
      xaxis: {
        categories: [
          accounting.map(({ day, month }) => `${day} ${month}`),
        ][0].reverse(),
      },

      colors: ["#1361fd"],

      tooltip: {
        enabled: true,
        enabledOnSeries: undefined,
        shared: true,
        followCursor: false,
        intersect: false,
        inverseOrder: false,
        custom: undefined,
        fillSeriesColor: false,
        theme: false,
        style: {
          fontSize: "12px",
          fontFamily: undefined,
        },
        onDatasetHover: {
          highlightDataSeries: false,
        },
        x: {
          show: true,
          format: "dd MMM",
          formatter: undefined,
        },
        y: {
          formatter: undefined,
          title: {
            formatter: (seriesName) => seriesName,
          },
        },
        z: {
          formatter: undefined,
          title: "Size: ",
        },
        marker: {
          show: true,
        },
        items: {
          display: "flex",
        },
        fixed: {
          enabled: false,
          position: "topRight",
          offsetX: 0,
          offsetY: 0,
        },
      },
    },
  };

  useEffect(() => {
    Object.keys(user).length !== 0 &&
      setAccounting(JSON.parse(user.accounting));
  }, [user]);

  const usersCollectionRef = collection(db, "users");

  useEffect(() => {
    const getUser = async () => {
      const data = await getDocs(usersCollectionRef);
      setUsers(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };

    getUser();
  }, []);

  useEffect(() => {
    Object.keys(users).length !== 0 &&
      setUser(
        users.find((data) => data.email === localStorage.getItem("userEmail"))
      );
  }, [users]);

  return (
    <section className="barchart">
      <ReactApexChart
        options={options.options}
        series={options.series}
        type="bar"
        width={
          window.screen.width > 1012
            ? 850
            : window.screen.width > 426
            ? 400
            : window.screen.width > 348
            ? 350
            : 300
        }
        height={
          window.screen.width > 1012
            ? 370
            : window.screen.width > 426
            ? 250
            : window.screen.width > 348
            ? 200
            : 170
        }
      />
    </section>
  );
};

export default BarChart;
