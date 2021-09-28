import React, { useEffect } from "react";
import Chart from "react-apexcharts";
import axios from "axios";
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';


export default function Statistics() {

    const [currentyear] = React.useState(new Date().getFullYear())

    function getStatistics(year) {
        (async function () {
            var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
            let { data } = await axios.get("http://localhost:4000/status/" + year);
            let tempObj = {};
            data.forEach((obj) => {
                let month = obj.date.split("/")[1];
                if (!tempObj[month]) {
                    tempObj[month] = Number(obj.money);
                } else {
                    tempObj[month] = tempObj[month] + Number(obj.money)
                }
            });

            let monthedData = Object.entries(tempObj).map(([month, money]) => {
                return { date: `${month}/${year}`, money }
            });

            if (monthedData.length === 0) {
                document.getElementById("statistics-paper").innerHTML = `<h3>NO RESULTS FOR ${year}</h3>`
            } else {
                document.getElementById("statistics-paper").innerHTML = `<h3 style="margin: 0;">Stats for ${year}</h3>`
            }
            monthedData.sort((a, b) => {
                let [aMonth] = a.date.split("/");
                let [bMonth] = b.date.split("/");

                if (Number(aMonth) < Number(bMonth)) {
                    return -1;
                } else if (Number(aMonth) > Number(bMonth)) {
                    return 1;
                }
                return 0;
            });
            let incomes = [];
            let allMonths = [];
            monthedData.forEach((eachMonth) => {
                let [month] = eachMonth.date.split("/");
                let income = eachMonth.money
                incomes.push(Number(income))
                allMonths.push(month);
            });
            let newCategories = allMonths.map((monthNumber) => {
                return months[Number(monthNumber) - 1]
            });
            setOptions({ ...options, xaxis: { categories: newCategories } });
            setSeries([{
                name: "Income",
                data: incomes
            }]);
        })();
    }

    useEffect(() => {
        getStatistics(currentyear)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])


    const [options, setOptions] = React.useState({
        chart: {
            id: "basic-bar"
        },
        xaxis: {
            categories: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
        }
    });

    const [series, setSeries] = React.useState([
        {
            name: "Income",
            data: [30, 40]
        }
    ]);

    return (

        <div className="app">
            <div className="row">
                <div className="mixed-chart">
                    <div style={{ display: "flex", justifyContent: "space-evenly", margin: "20px auto", width: "1000px" }}>
                        {[currentyear + 1, currentyear, currentyear - 1, currentyear - 2].map((year, key) => (
                            <Button key={key} onClick={() => { getStatistics(year) }} variant="contained">{year}</Button>
                        ))}
                    </div>
                    <Paper style={{ width: "1000px", padding: "50px", margin: "0 auto", boxShadow: " 0px 0px 37px 5px rgba(34, 60, 80, 0.2)" }}>
                        <h2 id="statistics-paper">Stats for {currentyear}</h2>
                        <Chart
                            options={options}
                            series={series}
                            type="line"
                            width="800"
                        />
                    </Paper>
                </div>
            </div>
        </div >

    );
}