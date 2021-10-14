import { Component } from "react";
import Joi from "joi";
import Input from "./input";
import Select from "./select";

class Form extends Component {
  state = {
    data: {},
    errors: {},
  };

  validate = () => {
    const { data } = this.state;

    const onSubmitSchema = Joi.object(this.schema);

    const options = { abortEarly: false };
    const { error } = onSubmitSchema.validate(data, options);

    if (!error) return null;

    const errors = {};
    error.details.map((e) => (errors[e.path[0]] = e.message));
    return errors;
  };

  handleSubmit = (e) => {
    e.preventDefault();

    const errors = this.validate();
    this.setState({ errors: errors || {} });
    if (errors) return;

    this.doSubmit();
  };

  validateProperty = ({ name, value }) => {
    const propertySchema = Joi.object({ [name]: this.schema[name] });

    const { error } = propertySchema.validate({ [name]: value });
    return error ? error.details[0].message : null;
  };

  handleChange = ({ currentTarget: input }) => {
    const errorMessage = this.validateProperty(input);

    const errors = { ...this.state.errors };
    if (errorMessage) errors[input.name] = errorMessage;
    else delete errors[input.name];

    const data = { ...this.state.data };
    data[input.name] = input.value;

    this.setState({ data, errors });
  };

  renderInput = (name, label, type = "text") => {
    const { data, errors } = this.state;
    return (
      <Input
        name={name}
        label={label}
        type={type}
        error={errors[name]}
        value={data[name]}
        onChange={this.handleChange}
      />
    );
  };

  renderButton = (label) => {
    return (
      <button disabled={this.validate()} className="btn btn-primary">
        {label}
      </button>
    );
  };

  renderSelect = (name, label, options) => {
    const { data, errors } = this.state;
    return (
      <Select
        onChange={this.handleChange}
        name={name}
        label={label}
        value={data[name]}
        options={options}
        error={errors[name]}
      />
    );
  };
}

export default Form;
