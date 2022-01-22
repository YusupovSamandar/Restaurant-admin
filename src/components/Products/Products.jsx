import React from 'react';
import MaterialTable from 'material-table';
import { useSelector, useDispatch } from "react-redux";
import axios from 'axios';
import { getAllProducts } from "./../../actions";

export default function Products() {
    const { products: data } = useSelector(state => state);
    const { useState } = React;



    const [file, setFile] = useState(null);

    const fileSelectedHandler = (e) => {
        setFile(e.target.files[0]);
    }

    React.useEffect(() => {
        setColumn([
            { title: 'Name', field: 'name', validate: rowData => rowData.name === '' ? { isValid: false, helperText: 'Name cannot be empty' } : true },
            { title: 'Price', field: 'price', type: "numeric", validate: rowData => rowData.price > 0 },
            { title: 'Price 0.7', field: 'price07', type: "numeric" },
            { title: 'Price 0.5', field: 'price05', type: "numeric" },
            { title: 'Status', field: 'isAvailable', initialEditValue: 63, lookup: { 34: 'tugadi', 63: 'bor' } },
            { title: 'Tarif', field: 'description' },
            {
                title: 'Image', field: 'productImage', editable: "onAdd", editComponent: () => (
                    <input type="file" value={file} name="productImage" onChange={fileSelectedHandler} accept=".jpg, .jpeg, .png" />
                ), render: rowData => {
                    let imageUrl = "http://localhost:4000/" + rowData.productImage
                    return (
                        <div style={{ marginLeft: "30px" }}>
                            <img style={{ width: "100px", borderRadius: "0px" }} src={imageUrl} alt="rasm yoq" />
                        </div>
                    );
                }
            }
            // { title: "Category", field: "category", initialEditValue: Object.keys(collections)[0], lookup: collections, validate: rowData => rowData.category === '' ? { isValid: false, helperText: 'Category cannot be empty' } : true, editable: "onAdd" }
        ])
        // eslint-disable-next-line react-hooks/exhaustive-deps
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
                console.log(result.flat());
            })
        })();
    }

    return (
        <div style={{ marginTop: "4vh" }}>
            <MaterialTable
                title={localStorage.getItem('currentCollection')}
                columns={columns}
                data={data.filter((obj) => {
                    if (obj.category === localStorage.getItem('currentCollection')) {
                        return true;
                    } else {
                        return false
                    }
                })}
                options={
                    { pageSize: 10 }
                }
                editable={{
                    onRowAdd: newData =>
                        new Promise((resolve, reject) => {
                            let fd = new FormData();
                            fd.append('name', newData.name.trim());
                            fd.append('category', localStorage.getItem('currentCollection'));
                            fd.append('isAvailable', newData.isAvailable);
                            fd.append('productImage', file);
                            setFile(null);
                            if (newData.price07) {
                                fd.append('price07', newData.price07);
                            }
                            if (newData.description) {
                                fd.append('description', newData.description);
                            }
                            if (newData.price05) {
                                fd.append('price05', newData.price05);
                            }
                            if (newData.price) {
                                fd.append('price', newData.price);
                            }
                            axios({
                                method: 'post',
                                url: `http://localhost:4000/data/${localStorage.getItem('currentCollection')}`,
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
                            axios.put(`http://localhost:4000/data/${oldData.category}/${oldData.name}`, { name: newData.name, price: newData.price, price05: newData.price05, price07: newData.price07, isAvailable: newData.isAvailable, description: newData.description }).then(() => {
                                updateGlobalProducts();
                            });
                            setTimeout(() => {
                                resolve();
                            }, 1000)
                        }),
                    onRowDelete: oldData =>
                        new Promise((resolve, reject) => {
                            axios.delete(`http://localhost:4000/data/${oldData.category}/${oldData.name}`).then(() => {
                                updateGlobalProducts();
                            });
                            setTimeout(() => {
                                resolve()
                            }, 1000)
                        }),
                }
                }
            />
        </div>
    )
}

