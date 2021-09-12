import './App.css';
import Sidebar from "./components/Sidebar/sidebar";
import Waiters from './components/Waiters/waiters';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";

function App() {
  return (
    <div className="App">
      <Router>
        <Switch>
          <Route exact path="/">
            <Sidebar contents={<p>Home</p>} />
          </Route>
          <Route exact path="/waiters">
            <Sidebar contents={<Waiters />} />
          </Route>
          <Route exact path="/stats">
            <Sidebar contents={<p>Status Page</p>} />
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
