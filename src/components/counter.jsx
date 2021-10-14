import React, { Component } from "react";
import { Remove, Add, Clear } from "@material-ui/icons";

class Counter extends Component {
  buttonStyle = {
    fontSize: "18px",
  };

  render() {
    const { onIncrement, onDecrement, onDelete, counter } = this.props;
    return (
      <div className="row align-items-center mb-2">
        <div className="col-1">
          <span
            className={
              counter.value === 0 ? "badge badge-warning" : "badge badge-primary"
            }
          >
            {counter.value === 0 ? "Zero" : counter.value}
          </span>
        </div>
        <div className="mr-2">
          <button
            onClick={() => onIncrement(counter)}
            className="btn btn-secondary btn-sm"
          >
            <Add fontSize="small" />
          </button>
        </div>
        <div className="mr-2">
          <button
            onClick={() => onDecrement(counter)}
            className="btn btn-secondary btn-sm"
            disabled={counter.value === 0 ? true : false}
          >
            <Remove fontSize="small" />
          </button>
        </div>
        <div className="mr-2">
          <button onClick={() => onDelete(counter.id)} className="btn btn-danger btn-sm">
            <Clear fontSize="small" />
          </button>
        </div>
      </div>
    );
  }
}

export default Counter;
