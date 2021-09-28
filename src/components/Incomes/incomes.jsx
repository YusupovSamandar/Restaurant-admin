import React, { useEffect, useState } from 'react';
import MaterialTable from 'material-table';
import axios from 'axios';
import Grid from '@material-ui/core/Grid';


export default function Incomes() {
    const [data, setData] = useState();
    useEffect(() => {
        (async function () {
            let { data: initialData } = await axios.get("http://localhost:4000/status");
            // let redesignedData = initialData.reduce((acc, obj) => {
            //     let [day, month, year] = obj.date.split("/");
            //     acc.push({ day, month, year, money: obj.money });
            //     return acc;
            // }, []);
            initialData.sort((a, b) => {
                let [aDay, aMonth, yearA] = a.date.split("/");
                let [bDay, bMonth, yearB] = b.date.split("/");

                if (Number(yearA) < Number(yearB)) {
                    return 1;
                } else if (Number(yearA) > Number(yearB)) {
                    return -1;
                } else {
                    if (Number(aMonth) < Number(bMonth)) {
                        return 1;
                    } else if (Number(aMonth) > Number(bMonth)) {
                        return -1;
                    } else if (Number(aMonth) === Number(bMonth)) {
                        if (Number(aDay) < Number(bDay)) {
                            return 1;
                        } else {
                            return -1;
                        }
                    }
                    return 0;
                }
            });
            setData(initialData);

        })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return (
        <Grid container spacing={2} style={{ justifyContent: "center", marginTop: "30px" }}>
            <Grid item xs={6} style={{ boxShadow: "0px 0px 37px 5px rgba(34, 60, 80, 0.2)", backgroundColor: "transparent" }}>
                <MaterialTable
                    title="Kunlik Daromad"
                    columns={[
                        { title: "Date", field: "date", align: "center" },
                        { title: 'Money', field: 'money', align: "center" }
                    ]}
                    data={data}
                    options={{
                        search: true,
                        pageSize: 10
                    }}
                />
            </Grid>
        </Grid>
    )
}