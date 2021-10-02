import React, { useEffect, useState } from 'react';
import MaterialTable from 'material-table';
import { Box, makeStyles, Chip } from "@material-ui/core";
import { io } from "socket.io-client";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import DoneIcon from '@material-ui/icons/Done';
import CurrencyFormat from 'react-currency-format';

const socket = io("http://localhost:4000");

const useStyles = makeStyles((theme) => ({
    chip: {
        background:"transparent",
border:"1px solid #1948F0",
borderRadius:"10px",
        display:"flex",
        flexDirection:"column",
        marginBottom:"10px",
        width:"200px", 
        margin: 2,
        fontSize: "1.2rem"
    },
    noLabel: {
        marginTop: theme.spacing(3)
    },
}));




export default function Orders() {
    const notify = (message) => toast.info(message, {
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
    }, [])
    const classes = useStyles();
    return (
        <div style={{ width: "98%", boxShadow: "1px 1px 20px 5px #707070", margin: "5vh auto 0" }}>
            <ToastContainer autoClose={5000} toastStyle={{ color: "black", fontSize: "1.1rem", padding: "20px" }} style={{ width: "250px" }} />
            <MaterialTable
                title="Zakazlar🍔"
                columns={[
                    {
                        title: "Nomi", field: "foods", editable: "never",
                        render: rowData => {
                            return (
                                <Box className="box" id="style-7">
                                    {rowData.foods.map((exprt) => <Chip
                                        key={exprt._id}
                                        label={exprt.name}
                                        className={classes.chip}
                                    />)}
                                </Box>
                            );
                        }
                    },
                    {
                        title: "Soni", field: "foods", editable: "never",
                        render: rowData => {
                            return (
                                <div  id="style-7">
                                    {rowData.foods.map((exprt) => <Chip
                                        key={exprt._id}
                                        label={ exprt.quantity}
                                        className={classes.chip}
                                    />)}
                                </div>
                            );
                        }
                    },
                    {
                        title: 'Summa', field: 'money', align: "center",
                        cellStyle: {
                            fontSize: "1.2rem",
                            width: "20%"
                        },
                        render: rowData => {
                            return (
                                <div  id="style-7">
                                              <CurrencyFormat value={rowData.money} 
                                              displayType={'text'} suffix=" sum" 
                                              thousandSeparator={true} renderText={value =>                                     
                                                 <p className="secondName">{value}  </p>
} />
    
                                </div>
                            );
                        }


                    },
                    {
                        title: "Stol", field: "table", align: "center",
                        cellStyle: {
                            fontSize: "1.2rem",
                            width: "20%"
                        }
                    },

                ]}
                data={data}
                options={{
                    actionsColumnIndex: -1,
                    search: false,
                    pageSize: 10
                }}
                actions={[
                    {
                        icon: 'print',
                        tooltip: 'Chek Chiqarish',
                        onClick: (event, rowData) => {
                            let allOrders = {};
                            let allOrdersFromSingleTable = data.filter((obj) => obj.table === rowData.table).reduce((acc, obj) => {
                                acc.table = obj.table;
                                acc.foods = [];
                                if (!acc.money) {
                                    acc.money = obj.money
                                } else {
                                    acc.money = acc.money + obj.money
                                }

                                obj.foods.forEach((foodObj) => {
                                    if (!allOrders[foodObj.name]) {
                                        allOrders[foodObj.name] = foodObj.quantity
                                    } else {
                                        allOrders[foodObj.name] = allOrders[foodObj.name] + foodObj.quantity
                                    }
                                });
                                return acc;
                            }, {});
                            allOrders = Object.entries(allOrders).map(([key, value]) => {
                                return { name: key, quantity: value }
                            });
                            allOrdersFromSingleTable.foods = allOrders;

                            // TODO. Continue your f***ing printing code here ↓
                            // allOrdersFromSingleTable is what u should print

                            alert("check chiqarish kere");
                        }
                    },
                    {
                        icon: () => <DoneIcon />,
                        tooltip: 'Done',
                        onClick: (event, rowData) => {
                            socket.emit("done-order", rowData._id);
                        }
                    }
                ]}
            />
        </div>
    );
}
