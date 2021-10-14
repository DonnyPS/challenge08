import React, { Component } from "react";
import NavBar from "./components/navbar";
import Movies from "./components/Movies";
import { Switch, Redirect, Route } from "react-router-dom";
import MoviesForm from "./components/moviesForm";

class App extends Component {
  state = {
    counters: [
      { id: 1, value: 4 },
      { id: 2, value: 0 },
      { id: 3, value: 0 },
    ],
  };

  handleIncrement = (counter) => {
    const counters = [...this.state.counters];
    const index = counters.indexOf(counter);
    counters[index] = { ...counter };
    counters[index].value++;
    this.setState({ counters });
  };

  handleDecrement = (counter) => {
    const counters = [...this.state.counters];
    const index = counters.indexOf(counter);
    counters[index] = { ...counter };
    counters[index].value--;
    this.setState({ counters });
  };

  handleDelete = (counterId) => {
    const counters = this.state.counters.filter((counter) => counter.id !== counterId);
    this.setState({ counters });
  };

  handleReset = () => {
    const counters = this.state.counters.map((counter) => {
      counter.value = 0;
      return counter;
    });
    this.setState({ counters });
  };

  render() {
    return (
      <>
        <NavBar />
        <main>
          {/* <Total totalNumbers={this.state.counters.filter((c) => c.value > 0).length} /> */}
          <div className="container" style={{ marginTop: 13 }}>
            <Switch>
              <Route path="/movies" exact component={Movies} />
              <Route path="/movies/:id" component={MoviesForm} />
              <Redirect from="/" exact to="/movies" />
            </Switch>
          </div>
        </main>
      </>
    );
  }
}

export default App;
