import React from 'react';
import MaterialTable from 'material-table';
import { useSelector, useDispatch } from "react-redux";
import axios from 'axios';
import { getAllProducts } from "./../../actions";
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

export default function Products() {

    const [open, setOpen] = React.useState(false);
    const [service, setService] = React.useState(0);
    const { products: data } = useSelector(state => state);
    const { useState } = React;
    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };
    React.useEffect(() => {
        (async function () {
            let { data: serv } = axios.get("http://localhost:4000/service");
            setService(serv)
        })()
    }, []);


    const [file, setFile] = useState(null);

    const fileSelectedHandler = (e) => {
        setFile(e.target.files[0]);
    }

    React.useEffect(() => {
        axios.get("http://localhost:4000/collections").then(({ data: collections }) => {
            setColumn([
                { title: 'Name', field: 'name', validate: rowData => rowData.name === '' ? { isValid: false, helperText: 'Name cannot be empty' } : true },
                { title: 'Price', field: 'price', type: "numeric", validate: rowData => !rowData.price ? { isValid: false, helperText: 'Price cannot be less than 0' } : true },
                { title: 'Price 0.7', field: 'price07', type: "numeric" },
                { title: 'Price 0.5', field: 'price05', type: "numeric" },
                {
                    title: 'Image', field: 'productImage', editable: "onAdd", editComponent: () => (
                        <input type="file" name="productImage" onChange={fileSelectedHandler} accept=".jpg, .jpeg, .png" />
                    ), render: rowData => {
                        let imageUrl = "http://localhost:4000/" + rowData.productImage
                        return (
                            <div style={{ marginLeft: "30px" }}>
                                <img style={{ width: "100px", borderRadius: "0px" }} src={imageUrl} alt="rasm yoq" />
                            </div>
                        );
                    }
                },
                { title: "Category", field: "category", initialEditValue: "milliys", lookup: collections, validate: rowData => rowData.category === '' ? { isValid: false, helperText: 'Category cannot be empty' } : true, editable: "onAdd" }
            ])
        })
    }, []);

    const [columns, setColumn] = useState([]);
    const dispatch = useDispatch();

    const updateGlobalProducts = () => {
        (async () => {
            const { data: initialData } = await axios.get("http://localhost:4000/data");
            axios.get("http://localhost:4000/collections").then(({ data: collections }) => {
                let result = Object.keys(collections).map((key) => {
                    return initialData[key].map((obj) => {
                        return { ...obj, category: key }
                    });
                });
                dispatch(getAllProducts(result.flat()));
            })
        })();
    }

    return (
        <div>
            <MaterialTable
                title="Editable Preview"
                columns={columns}
                data={data}
                options={
                    { pageSize: 10 }
                }
                editable={{
                    onRowAdd: newData =>
                        new Promise((resolve, reject) => {
                            let fd = new FormData();
                            fd.append('name', newData.name);
                            fd.append('category', newData.category);
                            fd.append('productImage', file);
                            if (newData.price07) {
                                fd.append('price07', newData.price07);
                            }
                            if (newData.price05) {
                                fd.append('price05', newData.price05);
                            }
                            if (newData.price) {
                                fd.append('price', newData.price);
                            }
                            axios({
                                method: 'post',
                                url: `http://localhost:4000/data/${newData.category}`,
                                data: fd
                            }).then((messsage) => {
                                if (messsage.status === 200) {
                                    updateGlobalProducts();
                                }
                            });
                            setTimeout(() => {
                                resolve();
                            }, 1000)
                        }),
                    onRowUpdate: (newData, oldData) =>
                        new Promise((resolve, reject) => {
                            axios.put(`http://localhost:4000/data/${oldData.category}/${oldData.name}`, { name: newData.name, price: newData.price, price05: newData.price05, price07: newData.price07 }).then(() => {
                                updateGlobalProducts();
                            });
                            setTimeout(() => {
                                resolve();
                            }, 1000)
                        }),
                    onRowDelete: oldData =>
                        new Promise((resolve, reject) => {
                            axios.delete(`http://localhost:4000/data/${oldData.category}/${oldData.name}`, { name: oldData.name }).then(() => {
                                updateGlobalProducts();
                            });
                            setTimeout(() => {
                                resolve()
                            }, 1000)
                        }),
                }
                }
            />
            <div style={{ marginTop: "20px", textAlign: "left", display: "flex", alignItems: "center", gap: "20px" }}>
                <TextField value={service} id="outlined-basic" onChange={(e) => { setService(e.target.value); }} label="Service %" variant="outlined" />
                <Button variant="contained" disabled={service > 0 ? false : true} onClick={handleClickOpen} color="primary">Confirm</Button>
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

