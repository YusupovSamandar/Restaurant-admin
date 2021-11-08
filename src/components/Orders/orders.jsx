import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core";
import { io } from "socket.io-client";
import { ToastContainer, toast } from "react-toastify";
// import PersonIcon from '@material-ui/icons/Person';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import "./orders.css";
import { red } from '@material-ui/core/colors';
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

const socket = io("http://localhost:4000");

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
      if (message === "order sent") {
        notify(`Yangi zakaz ${new Date().toLocaleTimeString()}`);
      }
      (async function () {
        const { data } = await axios.get("http://localhost:4000/orders");
        data.reverse()
        setData(data);
      })();
    });
    (async function () {
      const { data } = await axios.get("http://localhost:4000/orders");
      data.reverse()
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
      <Grid container spacing={3}>
        {data.map((order, index) => (
          <Grid item xs={12} lg={4} md={6}>
            <Card className={classes.root} style={{ padding: "20px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
                  <h4 style={{ margin: "0 0 5px", padding: 0 }}> Order #{Math.floor(Math.random() * 1000)} </h4>
                  <small style={{ color: "rgb(165 158 158)", float: "left", fontSize: "1.1rem" }}>{(Number(order.time.split(":")[0]) - new Date().getHours()) === 0 ? (new Date().getMinutes() - Number(order.time.split(":")[1])) + " min oldin" : (new Date().getHours() - Number(order.time.split(":")[0])) + " soat oldin"}</small>
                </div>
              </div>
              <hr />
              {/* Food Orders */}
              <div style={{ height: "200px", overflow: "auto" }}>
                {order.foods.map((perfood) => (
                  <div>
                    <div style={{ display: "flex", gap: "20px", margin: "21.6px 10px" }}>
                      <img style={{ width: "70px", borderRadius: "20px" }} src={
                        perfood.productImage === "null" || !perfood.productImage
                          ? "https://icons-for-free.com/iconfiles/png/512/food+icon-1320184414775447246.png"
                          : "http://localhost:4000/" + perfood.productImage
                      } alt="" />
                      <div>
                        <h3 style={{ margin: "0", padding: "0" }}>{perfood.name}</h3>
                        <h4 style={{ margin: "5px 0", padding: "0", textAlign: "left", color: "#5a5af5", fontWeight: "500" }}>Soni: {perfood.quantity}</h4>

                      </div>
                    </div>
                    <Divider />
                  </div>
                ))}
              </div>
              <Divider style={{ marginBottom: "10px" }} />
              <small style={{ color: "rgb(116 109 109)", fontSize: "1rem" }}> Sto'l raqami: {order.table} </small>
            </Card>
          </Grid>
        ))}
      </Grid>

      <ToastContainer
        autoClose={5000}
        toastStyle={{ color: "black", fontSize: "1.1rem", padding: "20px" }}
        style={{ width: "250px" }}
      />
    </div>
  );
}

