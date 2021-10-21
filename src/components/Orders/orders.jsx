import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core";
import { io } from "socket.io-client";
import { ToastContainer, toast } from "react-toastify";
import PersonIcon from '@material-ui/icons/Person';
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
        width: "90%",
        overflow: "auto",
        borderRadius: "50px",
        margin: "5vh auto 5vh",
        boxSizing: "border-box",
        padding: "10px 20px",
        height: "90vh",
        background: "rgba(255, 255, 255, 0.80)",
        boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        border: "1px solid rgba(255, 255, 255, 0.3)"
      }}
    >
      <h1 style={{ marginBottom: "40px" }}>Order List</h1>
      <Grid container spacing={3}>
        {data.map((order, index) => (
          <Grid item xs={3}>
            <Card className={classes.root} style={{ padding: "20px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <h4 style={{ margin: "0 0 5px", padding: 0 }}> Order #{order.table} </h4>
                  <small style={{ color: "rgb(165 158 158)", float: "left", fontSize: "1rem" }}>22:30</small>
                </div>
                <PersonIcon style={{ fontSize: "2rem", color: "violet" }} />
              </div>
              <hr />
              {/* Food Orders */}
              <div style={{ height: "200px", overflow: "auto" }}>
                {order.foods.map((perfood) => (
                  <div style={{ display: "flex", gap: "20px", margin: "30px 10px" }}>
                    <img style={{ width: "70px", borderRadius: "20px" }} src="https://upload.wikimedia.org/wikipedia/commons/f/fd/Dimlama_%2816425713838%29.jpg" alt="" />
                    <div>
                      <h3 style={{ margin: "0", padding: "0" }}>{perfood.name}</h3>
                      <h4 style={{ margin: "5px 0", padding: "0", textAlign: "left" }}>Soni: {perfood.quantity}</h4>
                      <Divider />
                    </div>
                  </div>
                ))}
              </div>
              <Divider style={{ marginBottom: "10px" }} />
              <small style={{ color: "rgb(165, 158, 158)", fontSize: "1rem" }}> Jami: {order.foods.length} </small>
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

