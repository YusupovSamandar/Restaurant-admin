import React, { useEffect, useState } from "react";
import MaterialTable from "material-table";
import { Box, makeStyles, Chip } from "@material-ui/core";
import { io } from "socket.io-client";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import DoneIcon from "@material-ui/icons/Done";

const socket = io("http://localhost:4000");

const useStyles = makeStyles((theme) => ({
  chip: {
    display: "flex",
    marginBottom: "10px",
    width: "200px",
    background: "transparent",
    border: "2px solid #1948F0",
    borderRadius: "10px",

    margin: 2,
    fontSize: "1.5rem",
  },
  noLabel: {
    marginTop: theme.spacing(3),
  },
}));

export default function Orders() {
  const notify = (message) =>
    toast.info(message, {
      position: "bottom-right",
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  const [data, setData] = useState([]);
  useEffect(() => {
    socket.on("recieve-order", (message) => {
      if (message === "order sent") {
        notify(`Yangi zakaz ${new Date().toLocaleTimeString()}`);
      }
      (async function () {
        const { data } = await axios.get("http://localhost:4000/orders");
        setData(data);
      })();
    });
    (async function () {
      const { data } = await axios.get("http://localhost:4000/orders");
      setData(data);
    })();
  }, []);
  const classes = useStyles();
  return (
    <div
      style={{
        width: "98%",
        boxShadow: "1px 1px 20px 5px #707070",
        margin: "5vh auto 0",
      }}
    >
      <ToastContainer
        autoClose={5000}
        toastStyle={{ color: "black", fontSize: "1.1rem", padding: "20px" }}
        style={{ width: "250px" }}
      />
      <MaterialTable
        title="Zakazlar🍔"
        columns={[
          {
            title: "Nomi",
            field: "foods",
            editable: "never",
            cellStyle: {
              fontSize: "1.9rem",
              width: "10%",
            },
            render: (rowData) => {
              return (
                <Box className="box" id="style-7">
                  {rowData.foods.map((exprt) => (
                    <Chip
                      key={exprt._id}
                      label={exprt.name}
                      className={classes.chip}
                    />
                  ))}
                </Box>
              );
            },
          },
          {
            title: "Soni",
            field: "foods",
            align: "left  ",
            cellStyle: {
              fontSize: "1.9rem",
              width: "10%",
            },
            render: (rowData) => {
              return (
                <Box className="box" id="style-7">
                  {rowData.foods.map((exprt) => (
                    <Chip
                      key={exprt._id}
                      label={exprt.quantity}
                      className={classes.chip}
                    />
                  ))}
                </Box>
              );
            },
          },
          {
            title: "Stol",
            field: "table",
            align: "left",
            cellStyle: {
              fontSize: "1.2rem",
              width: "20%",
            },
            render: (rowData) => {
              return (
                <Chip
                  label={rowData.table}
                  className={classes.chip}
                />
              );
            },
          },
        ]}
        data={data}
        options={{
          actionsColumnIndex: -1,
          search: false,
          pageSize: 10,
        }}

      />
    </div>
  );
}
