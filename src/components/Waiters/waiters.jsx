import React from 'react';
import MaterialTable from 'material-table';
import { useSelector, useDispatch } from "react-redux";
import axios from 'axios';
import { updateWaiters } from "./../../actions";

export default function Waiters() {
    const { waiters: data } = useSelector(state => state);
    const { useState } = React;
    const [columns] = useState([
        { title: 'Name', field: 'name', validate: rowData => rowData.name === '' ? { isValid: false, helperText: 'Name cannot be empty' } : true, },
        { title: 'Surname', field: 'surname', validate: rowData => rowData.surname === '' ? { isValid: false, helperText: 'Surname cannot be empty' } : true, },
        { title: "Phone-Number", field: 'phoneNumber' }
    ]);
    const dispatch = useDispatch();

    const updateGlobalWaiters = () => {
        axios.get("http://localhost:4000/data/waiters").then(({ data: allWaiters }) => {
            dispatch(updateWaiters(allWaiters));
        });
    }

    return (
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
                            axios.put(`http://localhost:4000/data/waiters/${oldData.name}`, { name: newData.name, surname: newData.surname, phoneNumber: newData.phoneNumber }).then(() => {
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
    )
}

