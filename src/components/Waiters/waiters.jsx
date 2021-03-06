import React from 'react';
import MaterialTable from 'material-table';
import { useSelector, useDispatch } from "react-redux";
import axios from 'axios';
import { updateWaiters } from "./../../actions";
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

export default function Waiters() {
    const { waiters: data } = useSelector(state => state);
    const { useState } = React;
    const [columns] = useState([
        { title: 'Name', field: 'name', validate: rowData => rowData.name === '' ? { isValid: false, helperText: 'Name cannot be empty' } : true, },
        { title: 'Surname', field: 'surname', validate: rowData => rowData.surname === '' ? { isValid: false, helperText: 'Surname cannot be empty' } : true, },
        { title: 'Login', field: 'loginName', validate: rowData => rowData.loginName === '' ? { isValid: false, helperText: 'Login Name cannot be empty' } : true, },
        { title: 'Password', field: 'loginPassword', validate: rowData => rowData.loginPassword === '' ? { isValid: false, helperText: 'Login Password missing' } : true, },
        { title: "Phone-Number", field: 'phoneNumber' }
    ]);
    const dispatch = useDispatch();

    const updateGlobalWaiters = () => {
        axios.get("http://localhost:4000/data/waiters").then(({ data: allWaiters }) => {
            dispatch(updateWaiters(allWaiters));
        });
    }
    const [open, setOpen] = React.useState(false);
    const [service, setService] = React.useState(0);

    React.useEffect(() => {
        (async function () {
            let { data: serv } = await axios.get("http://localhost:4000/service");
            setService(serv)
        })()
    }, []);
    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <div style={{ marginTop: "4vh" }}>

            <MaterialTable
                title="Waiters"
                columns={columns}
                data={data} options={
                    { pageSize: 10 }
                }
                editable={{
                    onRowAdd: newData =>
                        new Promise((resolve, reject) => {
                            setTimeout(() => {
                                axios({
                                    method: 'post',
                                    url: 'http://localhost:4000/data/waiters',
                                    data: newData
                                }).then(() => {
                                    updateGlobalWaiters();
                                });
                                resolve();
                            }, 1000)
                        }),
                    onRowUpdate: (newData, oldData) =>
                        new Promise((resolve, reject) => {
                            setTimeout(() => {
                                axios.put(`http://localhost:4000/data/waiters/${oldData.name}`, { name: newData.name, surname: newData.surname, phoneNumber: newData.phoneNumber, loginName: newData.loginName, loginPassword: newData.loginPassword }).then(() => {
                                    updateGlobalWaiters();
                                });
                                resolve();
                            }, 1000)
                        }),
                    onRowDelete: oldData =>
                        new Promise((resolve, reject) => {
                            setTimeout(() => {
                                axios.delete(`http://localhost:4000/data/waiters/${oldData.name}`, { name: oldData.name }).then(() => {
                                    updateGlobalWaiters();
                                });
                                resolve()
                            }, 1000)
                        }),
                }
                }
            />
            <div style={{ marginTop: "20px", textAlign: "left", display: "flex", alignItems: "center", gap: "20px" }}>
                <TextField value={service} id="outlined-basic" onChange={(e) => { setService(e.target.value); }} label="Service %" variant="outlined" />
                <Button variant="contained" style={{ backgroundColor: "#FCDE60", marginLeft: "20px", borderRadius: "50px", fontSize: "0.8rem", width: "100px", fontWeight: "bold", textTransform: "capitalize", color: "#000" }} disabled={service > 0 ? false : true} onClick={handleClickOpen} color="primary">Confirm</Button>
                <Dialog
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle style={{ width: "500px" }} id="alert-dialog-title">{"Are you sure?"}</DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            This will add extra {service}% money for per order!
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose} color="secondary">
                            Cancel
                        </Button>
                        <Button onClick={() => {
                            axios.post("http://localhost:4000/service", { service }).then(() => {
                                handleClose();
                            });
                        }} color="primary" autoFocus>
                            OK
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        </div>
    )
}

