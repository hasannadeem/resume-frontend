import React, { Component } from "react";
import gql from "graphql-tag";
import { Mutation } from "react-apollo";
import validate from "./validate";

const CREATE_POSITION = gql`
  mutation CreatePosition(
    $position: String!
    $description: String!
    $year: String!
  ) {
    createPosition(
      input: { position: $position, description: $description, year: $year }
    ) {
      position {
        id
        position
        description
        year
      }
      errors
    }
  }
`;

class CreatePosition extends Component {
  state = {
    formValues: {
      position: "",
      description: "",
      year: ""
    },
    errors: {}
  };

  onSubmit = (e, createUser) => {
    let errors = validate(this.state.formValues);

    if (Object.entries(errors).length !== 0) {
      e.preventDefault();
      this.setState({ errors: errors });
    } else {
      e.preventDefault();
      createUser({ variables: this.state.formValues });
      this.setState({
        formValues: {
          ...this.state.formValues,
          position: "",
          description: "",
          year: ""
        },
        errors: {}
      });

      this.props.closeForm();
    }
  };

  handleFieldChange = ({ target }, name) => {
    this.setState({
      formValues: { ...this.state.formValues, [name]: target.value }
    });
  };

  render() {
    const { errors } = this.state;

    return (
      <Mutation mutation={CREATE_POSITION} update={this.props.onCreatePosition}>
        {createPositionMutation => (
          <form
            className="mb-4"
            style={{
              padding: 10,
              border: "0.5px #adb5bd solid",
              borderRadius: 5,
              margin: "0px 25px"
            }}
            onSubmit={e => this.onSubmit(e, createPositionMutation)}
          >
            <div className="form-row mb-2">
              <div className="col-sm-3">
                <input
                  className="form-control"
                  type="text"
                  value={this.state.position}
                  placeholder="Position"
                  onChange={e => this.handleFieldChange(e, "position")}
                  style={{ fontSize: 13 }}
                />
                {errors.position && (
                  <span
                    style={{
                      marginLeft: 3,
                      fontSize: 10,
                      verticalAlign: "top",
                      color: "red"
                    }}
                  >
                    {errors.position}
                  </span>
                )}
              </div>

              <div className="col-sm-2 year-field">
                <input
                  className="form-control"
                  type="text"
                  value={this.state.year}
                  placeholder="Starting Year"
                  onChange={e => this.handleFieldChange(e, "year")}
                  style={{ fontSize: 13 }}
                />
                {errors.year && (
                  <span
                    style={{
                      marginLeft: 3,
                      fontSize: 10,
                      verticalAlign: "top",
                      color: "red"
                    }}
                  >
                    {errors.year}
                  </span>
                )}
              </div>
            </div>

            <div className="form-row mb-2">
              <div className="col">
                <input
                  className="form-control"
                  type="text"
                  value={this.state.description}
                  placeholder="Description"
                  onChange={e => this.handleFieldChange(e, "description")}
                  style={{ fontSize: 13 }}
                />
                {errors.description && (
                  <span
                    style={{
                      marginLeft: 3,
                      fontSize: 10,
                      verticalAlign: "top",
                      color: "red"
                    }}
                  >
                    {errors.description}
                  </span>
                )}
              </div>
            </div>
            <button
              className="btn btn-primary"
              type="submit"
              style={{ fontSize: 12, padding: "2px 10px" }}
            >
              Add
            </button>
          </form>
        )}
      </Mutation>
    );
  }
}
export default CreatePosition;
