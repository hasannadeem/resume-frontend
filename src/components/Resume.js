import { Query, Mutation } from "react-apollo";
import gql from "graphql-tag";
import React, { Component } from "react";
import CreatePosition from "./CreatePosition";
import "font-awesome/css/font-awesome.min.css";
import FontAwesome from "react-fontawesome";

const RESUME_QUERY = gql`
  query {
    resume {
      id
      name
      address
      positions {
        id
        position
        description
        year
      }
    }
  }
`;

const DELETE_POSITION = gql`
  mutation DeletePosition($id: String!) {
    deletePosition(input: { id: $id }) {
      position {
        id
      }
      errors
    }
  }
`;

class Resume extends Component {
  state = {
    showForm: false
  };

  updatePositions = (cache, { data: { createPosition } }) => {
    const { resume } = cache.readQuery({ query: RESUME_QUERY });
    cache.writeQuery({
      query: RESUME_QUERY,
      data: {
        resume: {
          ...resume,
          positions: resume.positions.concat(createPosition.position)
        }
      }
    });
  };

  updateDeletedPositions = (cache, { data: { deletePosition } }) => {
    const { resume } = cache.readQuery({ query: RESUME_QUERY });
    cache.writeQuery({
      query: RESUME_QUERY,
      data: {
        resume: {
          ...resume,
          positions: resume.positions.concat(deletePosition.position)
        }
      }
    });
  };

  handleAddRecord = _ => {
    this.setState(prevState => ({ showForm: !prevState.showForm }));
  };

  render() {
    const { showForm } = this.state;

    return (
      <Query query={RESUME_QUERY}>
        {({ loading, error, data }) => {
          if (loading) return <div>Fetching..</div>;
          if (error) return <div>Error!</div>;
          return (
            <div
              className="container rounded shadow-lg h-100 main-div"
              style={{ padding: "3% 7%" }}
            >
              <div className="row justify-content-center align-items-center">
                <img
                  src="https://res.cloudinary.com/practicaldev/image/fetch/s--CY7xLNoW--/c_fill,f_auto,fl_progressive,h_320,q_auto,w_320/https://thepracticaldev.s3.amazonaws.com/uploads/user/profile_image/72098/ad23a42c-69da-4751-b588-76b04d4cc970.jpeg"
                  className="img-fluid img-shape"
                  alt="hasan-nadeem-img"
                />
              </div>
              <h1 className="name row justify-content-center align-items-center pt-4 m-0">
                {data.resume.name}
              </h1>

              <span className="email row justify-content-center align-items-centers">
                {data.resume.address}
              </span>

              <h5 className="row p-3 m-0" style={{ display: "inline-block" }}>
                Experience
              </h5>
              {!showForm && (
                <FontAwesome
                  name="plus"
                  style={{
                    backgroundColor: "#008000bf",
                    padding: "4px 15px",
                    borderRadius: 15,
                    color: "white",
                    cursor: "pointer"
                  }}
                  onClick={this.handleAddRecord}
                />
              )}
              {showForm && (
                <FontAwesome
                  name="times"
                  style={{
                    backgroundColor: "#db2b2b",
                    padding: "4px 15px",
                    borderRadius: 15,
                    color: "white",
                    cursor: "pointer"
                  }}
                  onClick={this.handleAddRecord}
                />
              )}
              {showForm && (
                <CreatePosition
                  onCreatePosition={this.updatePositions}
                  closeForm={this.handleAddRecord}
                />
              )}

              {data.resume.positions.map(position => (
                <div
                  key={position.id}
                  className="card"
                  style={{
                    border: "none",
                    borderTop: "1px #D2D2D2 solid",
                    borderRadius: 0
                  }}
                >
                  <div className="card-body">
                    <h5
                      className="card-title"
                      style={{ display: "inline-block", verticalAlign: "sub" }}
                    >
                      {position.position}
                    </h5>
                    <h6
                      className="card-subtitle mb-2 text-muted"
                      style={{
                        display: "inline-block",
                        float: "right",
                        marginTop: 5
                      }}
                    >
                      {position.year}

                      <Mutation
                        mutation={DELETE_POSITION}
                        update={(cache, { data: { deletePosition } }) => {
                          const { resume } = cache.readQuery({
                            query: RESUME_QUERY
                          });
                          cache.writeQuery({
                            query: RESUME_QUERY,
                            data: {
                              resume: {
                                ...resume,
                                positions: resume.positions.filter(
                                  e => e.id !== position.id
                                )
                              }
                            }
                          });
                        }}
                      >
                        {(deletePosition, { data }) => (
                          <FontAwesome
                            name="trash"
                            style={{
                              cursor: "pointer"
                            }}
                            onClick={e => {
                              deletePosition({
                                variables: {
                                  id: position.id
                                }
                              });
                            }}
                          />
                        )}
                      </Mutation>

                      {/* <Mutation
                        mutation={DELETE_TODO}
                        update={}
                      >
                        {(deleteTodo, { data }) => (
                          <button
                            onClick={e => {
                              deleteTodo({
                                variables: {
                                  id
                                }
                              });
                            }}
                          >
                            Delete
                          </button>
                        )}
                      </Mutation> */}

                      {/*
                      <Mutation
                        mutation={DELETE_TODO}
                        update={cache => {
                          const data = cache.readQuery({
                            query: FETCH_TODOS,
                            variables: {
                              isPublic
                            }
                          });
                          const newData = {
                            todos: data.todos.filter(t => t.id !== item.id)
                          };
                          cache.writeQuery({
                            query: FETCH_TODOS,
                            variables: {
                              isPublic
                            },
                            data: newData
                          });
                        }}
                      >
                        {(deleteTodo, { loading, error }) => {
                          const remove = () => {
                            if (loading) {
                              return;
                            }
                            deleteTodo({
                              variables: { id: item.id }
                            });
                          };

                          <FontAwesome
                            name="trash"
                            style={{
                              cursor: "pointer"
                            }}
                            onClick={this.handleDelRecord}
                          />;
                        }}
                      </Mutation> */}
                    </h6>
                    <p className="card-text">{position.description}</p>
                  </div>
                </div>
              ))}
            </div>
          );
        }}
      </Query>
    );
  }
}
export default Resume;
