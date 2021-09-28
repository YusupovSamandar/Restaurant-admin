import './App.css';
import { useEffect } from 'react';
import Sidebar from "./components/Sidebar/sidebar";
import Waiters from './components/Waiters/waiters';
import { useDispatch } from 'react-redux'
import { loadData, getAllProducts } from "./actions";
import axios from "axios";
import Home from "./components/Home/home";
import Products from "./components/Products/Products";
import Category from './components/Category/category';
import Statistics from './components/Statistics/statistics';
import Incomes from './components/Incomes/incomes';
import Orders from "./components/Orders/orders";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from "react-router-dom";

function App() {
  const dispatch = useDispatch()

  useEffect(() => {
    (async () => {
      const { data: initialData } = await axios.get("http://localhost:4000/data");
      const { data: waiters } = await axios.get("http://localhost:4000/data/waiters");
      axios.get("http://localhost:4000/collections").then(({ data: collections }) => {
        let result = Object.keys(collections).map((key) => {
          if (initialData[key]) {
            return initialData[key].map((obj) => {
              return { ...obj, category: key }
            });
          } else {
            return null
          }
        }).filter((elem) => elem !== null);
        dispatch(getAllProducts(result.flat()));

      })
      dispatch(loadData(initialData, waiters));
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="App">
      <Router>
        <Switch>
          <Route exact path="/">
            <Redirect to="/add" />
          </Route>
          <Route exact path="/add">
            <Sidebar contents={<Home />} />
          </Route>
          <Route exact path="/waiters">
            <Sidebar contents={<Waiters />} />
          </Route>
          <Route exact path="/stats">
            <Sidebar contents={<Statistics />} />
          </Route>
          <Route exact path="/add-product">
            <Sidebar contents={<Products />} />
          </Route>
          <Route exact path="/daily-income">
            <Sidebar contents={<Incomes />} />
          </Route>
          <Route exact path="/add-category">
            <Sidebar contents={<Category />} />
          </Route>
          <Route exact path="/orders">
            <Orders />
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
