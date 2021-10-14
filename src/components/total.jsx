const Total = (props) => {
  return (
    <div className="container mt-4">
      Totals{" "}
      <span
        className={
          props.totalNumbers === 0 ? "badge badge-warning" : "badge badge-success"
        }
      >
        {props.totalNumbers}
      </span>
    </div>
  );
};

export default Total;
