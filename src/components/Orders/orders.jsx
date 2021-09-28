import React, { useEffect, useState } from 'react';
import MaterialTable from 'material-table';
import { Box, makeStyles, Chip } from "@material-ui/core";
import { io } from "socket.io-client";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import DoneIcon from '@material-ui/icons/Done';

const socket = io("http://localhost:4000");

const useStyles = makeStyles((theme) => ({
    chip: {
        margin: 2,
        fontSize: "1.5rem"
    },
    noLabel: {
        marginTop: theme.spacing(3)
    },
}));




export default function Orders() {
    const notify = (message) => toast(message, {
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
                notify(`New Order at ${new Date().toLocaleTimeString()}`);
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
            <ToastContainer autoClose={15000} toastStyle={{ backgroundColor: "#345B63", color: "white", fontSize: "1.8rem", padding: "20px" }} style={{ width: "400px" }} />
            <MaterialTable
                title="Meals Pending 🍔"
                columns={[
                    {
                        title: "Table", field: "table", align: "center",
                        cellStyle: {
                            fontSize: "1.2rem",
                            width: "20%"
                        }
                    },
                    {
                        title: 'Money', field: 'money', align: "center",
                        cellStyle: {
                            fontSize: "1.2rem",
                            width: "20%"
                        }
                    },
                    {
                        title: "food", field: "foods", editable: "never",
                        render: rowData => {
                            return (
                                <Box className="box" id="style-7">
                                    {rowData.foods.map((exprt) => <Chip
                                        key={exprt._id}
                                        label={exprt.name + ": " + exprt.quantity + "ta"}
                                        className={classes.chip}
                                    />)}
                                </Box>
                            );
                        }
                    }
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
                            // rowData console.log qilib korin nimaligini bilvolas
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
