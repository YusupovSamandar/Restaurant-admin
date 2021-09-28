import React from 'react';
import MaterialTable from 'material-table';
import { useSelector, useDispatch } from "react-redux";
import axios from 'axios';
import { getAllProducts } from "./../../actions";

export default function Products() {

    const { products: data } = useSelector(state => state);
    // const [lookupStructure, setlookupStructure] = React.useState({});
    const { useState } = React;

    React.useEffect(() => {
        axios.get("http://localhost:4000/collections").then(({ data: collections }) => {
            setColumn([
                { title: 'Name', field: 'name', validate: rowData => rowData.name === '' ? { isValid: false, helperText: 'Name cannot be empty' } : true },
                { title: 'Price', field: 'price', type: "numeric", validate: rowData => rowData.price === '' ? { isValid: false, helperText: 'Name cannot be empty' } : true },
                { title: "Category", field: "category", initialEditValue: "milliys", lookup: collections, validate: rowData => rowData.category === '' ? { isValid: false, helperText: 'Name cannot be empty' } : true, editable: "onAdd" }
            ])
        })
    }, [])

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
                        axios({
                            method: 'post',
                            url: `http://localhost:4000/data/${newData.category}`,
                            data: newData
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
                        axios.put(`http://localhost:4000/data/${oldData.category}/${oldData.name}`, { name: newData.name, price: newData.price }).then(() => {
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
    )
}

