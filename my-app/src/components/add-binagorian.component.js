import React, { Component } from "react";
import BinagoriansDataService from "../services/binagorians.service.js";
export default class AddBinagorian extends Component {
  constructor(props) {
    super(props);
    this.onChangeAddress = this.onChangeAddress.bind(this);
    this.onChangeName = this.onChangeName.bind(this);
    this.onChangeCreatedDate = this.onChangeCreatedDate.bind(this);
    this.onChangeRate = this.onChangeRate.bind(this);
    this.createBinagorian = this.createBinagorian.bind(this);
    this.newBinagorian = this.newBinagorian.bind(this);
    this.state = {
      address:"",
      name: "",
      createdDate: "", 
      rate: 0,
      submitted: false
    };
  }
  onChangeAddress(e) {
    this.setState({
      address: e.target.value
    });
  }
  onChangeName(e) {
    this.setState({
      name: e.target.value
    });
  }
  onChangeCreatedDate(e) {
    this.setState({
      createdDate: e.target.value
    });
  }
  onChangeRate(e) {
    this.setState({
      rate: e.target.value
    });
  }
  createBinagorian() {
    var data = {
      address: this.state.address,
      name: this.state.name,
      createdDate: this.state.createdDate,
      rate: this.state.rate
    };
    BinagoriansDataService.create(data)
      .then(response => {
        this.setState({
          address: response.data.address,
          createdDate: response.data.createdDate,
          name: response.data.name,
          rate: response.data.rate,
          submitted: true
        });
        console.log(response);
      })
      .catch(e => {
        console.log(e);
      });
  }
  newBinagorian() {
    this.setState({
        address:"",
        name: "",
        createdDate: "", 
        rate: 0,
        submitted: false
    });
  }
  render() {
    return (
      <div className="submit-form">
        {this.state.submitted ? (
          <div>
            <h4>You submitted successfully!</h4>
            <button className="btn btn-success" onClick={this.newBinagorian}>
              Add
            </button>
          </div>
        ) : (
          <div>
            <div className="form-group">
              <label htmlFor="address">Address</label>
              <input
                type="text"
                className="form-control"
                id="address"
                required
                value={this.state.address}
                onChange={this.onChangeAddress}
                name="address"
              />
            </div>
            <div className="form-group">
              <label htmlFor="createdDate">Created date</label>
              <input
                type="text"
                className="form-control"
                id="createdDate"
                required
                value={this.state.createdDate}
                onChange={this.onChangeCreatedDate}
                name="createdDate"
              />
            </div>
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                className="form-control"
                id="name"
                required
                value={this.state.name}
                onChange={this.onChangeName}
                name="name"
              />
            </div>
            <div className="form-group">
              <label htmlFor="rate">Rate</label>
              <input
                type="text"
                className="form-control"
                id="rate"
                required
                value={this.state.rate}
                onChange={this.onChangeRate}
                name="rate"
              />
            </div>
            <button onClick={this.createBinagorian} className="btn btn-success">
              Submit
            </button>
          </div>
        )}
      </div>
    );
  }
}