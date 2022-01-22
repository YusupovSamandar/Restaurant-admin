import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core";
import { io } from "socket.io-client";
import { ToastContainer, toast } from "react-toastify";
import Card from '@material-ui/core/Card';
import "./orders.css";
import "react-toastify/dist/ReactToastify.css";
import Button from '@material-ui/core/Button';
import axios from "axios";
import DoneAllIcon from '@material-ui/icons/DoneAll';
import defaultFood from './img/default.png';
import { red } from '@material-ui/core/colors';

const socket = io("http://192.168.43.206:4000");

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 345,
  },
  media: {
    height: 0,
    paddingTop: '56.25%', // 16:9
  },
  expand: {
    transform: 'rotate(0deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
  avatar: {
    backgroundColor: red[500],
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
      if (message !== "order deleted") {
        notify(`Yangi zakaz ${new Date().toLocaleTimeString()}`);
      }
      (async function () {
        let { data } = await axios.get("http://192.168.43.206:4000/orders");
        data.reverse()
        data = data.filter((ordr) => ordr.status === "pending")
        setData(data);
      })();
    });
    (async function () {
      let { data } = await axios.get("http://192.168.43.206:4000/orders");
      data.reverse()
      data = data.filter((ordr) => ordr.status === "pending")
      setData(data);
    })();
  }, []);
  const classes = useStyles();
  return (
    <div
      className="mainContainer"
      style={{
        width: "90%",
        overflow: "auto",
        borderRadius: "50px",
        margin: "5vh auto 5vh",
        boxSizing: "border-box",
        padding: "10px 20px",
        height: "90vh",
        background: "rgba(255, 255, 255, 0.80)",
        boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
        backdropFilter: "blur(9px)",
        WebkitBackdropFilter: "blur(9px)",
        border: "1px solid rgba(255, 255, 255, 0.3)"
      }}
    >
      <h1 style={{ marginBottom: "40px", color: "#fff" }}>Orders List</h1>
      {data.map((order, index) => (
        <Card key={index} className={classes.root} style={{ padding: "20px", maxWidth: "100%", margin: "0 0 30px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
              <h4 style={{ margin: "0 0 5px", padding: 0 }}> Order #{Math.floor(Math.random() * 1000)} </h4>
              <small style={{ color: "rgb(116 109 109)", fontSize: "1rem" }}> Sto'l raqami: {order.table} </small>
              <small style={{ color: "rgb(165 158 158)", float: "left", fontSize: "1.1rem" }}>{(Number(order.time.split(":")[0]) - new Date().getHours()) === 0 ? (new Date().getMinutes() - Number(order.time.split(":")[1])) + " min oldin" : (new Date().getHours() - Number(order.time.split(":")[0])) + " soat oldin"}</small>
            </div>
          </div>
          <hr />
          <div style={{ height: "200px", overflow: "auto", display: "flex", flexWrap: "wrap" }}>
            {order.foods.map((perfood, idx) => (
              // <div>
              <div key={idx} style={{ display: "flex", gap: "20px", margin: "21.6px 10px", height: "60px" }}>
                <img style={{ width: "70px", borderRadius: "20px" }} src={
                  perfood.productImage === "null" || !perfood.productImage
                    ? defaultFood
                    : "http://192.168.43.206:4000/" + perfood.productImage
                } alt="" />
                <div>
                  <h3 style={{ margin: "0", padding: "0" }}>{perfood.name.slice(-1) === "1" ? perfood.name.slice(0, -2) : perfood.name}</h3>
                  <h4 style={{ margin: "5px 0", padding: "0", textAlign: "left", color: "#5a5af5", fontSize: "1.2rem", fontWeight: "500" }}>Soni: {perfood.quantity}</h4>

                </div>
                <div style={{ fontSize: "2rem", margin: "0 2rem" }}>
                  |
                </div>
              </div>
              // </div>
            ))}
          </div>
          <hr />
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <small style={{ color: "rgb(116 109 109)", fontSize: "1rem" }}>Jami: {order.foods.length}ta </small>
            <Button onClick={() => {
              socket.emit("order-completed", { idOfOrder: order._id, tableNumber: order.table })
            }} variant="contained" color="primary">
              <span style={{ padding: "0 15px 0 0" }}>Tayyor</span> <DoneAllIcon />
            </Button>
          </div>
        </Card>
      ))
      }

      <ToastContainer
        autoClose={5000}
        toastStyle={{ color: "black", fontSize: "1.1rem", padding: "20px" }}
        style={{ width: "250px" }}
      />
    </div >
  );
}

