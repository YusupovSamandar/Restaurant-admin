import React from 'react';
import MaterialTable from 'material-table';
import axios from 'axios';

export default function Category() {

    const [allCollections, setallCollections] = React.useState([]);

    const updateGlobalCategory = () => {
        (async function () {
            const { data } = await axios.get("http://192.168.1.200:4000/collections");
            console.log(data);
            let maped = Object.keys(data).map((collection) => {
                return { name: collection };
            });
            setallCollections(maped);
        })();
    }

    React.useEffect(() => {
        updateGlobalCategory()
    }, []);

    const { useState } = React;

    const [columns] = useState([
        { title: 'Name', field: 'name', validate: rowData => rowData.name === '' ? { isValid: false, helperText: 'Name cannot be empty' } : true },
    ]);



    return (
        <MaterialTable
            title="Editable Preview"
            columns={columns}
            data={allCollections}
            options={
                { pageSize: 10 }
            }
            editable={{
                onRowAdd: newData =>
                    new Promise((resolve, reject) => {
                        setTimeout(() => {
                            axios({
                                method: 'get',
                                url: `http://192.168.1.200:4000/data/${newData.name.trim}`,
                                data: newData
                            }).then(() => {
                                updateGlobalCategory();
                            });
                            resolve();
                        }, 1000)
                    }),
                onRowDelete: oldData =>
                    new Promise((resolve, reject) => {
                        axios.delete(`http://192.168.1.200:4000/data/${oldData.name}`).then((_response) => {

                        });
                        setTimeout(() => {
                            updateGlobalCategory();
                            resolve()
                        }, 1000)
                    }),
            }
            }
        />
    )
}

