import React, { Component } from 'react';
import './App.css';
import 'react-dates/initialize';
import { connect } from 'react-redux';
import { addBooking, checkAvailability } from './actions';
import { Button, Form, FormGroup, Col } from 'reactstrap';
import { DateRangePicker } from 'react-dates';
import 'react-dates/lib/css/_datepicker.css';
import './react_dates_overrides.css';
import Moment from 'moment';
import { extendMoment } from 'moment-range'
const moment = extendMoment(Moment);

class Hotel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      customerDetails: [],
      startDate: null,
      endDate: null,
      inputName: '',
      inputLocation: '',
      failureMessage: '',
      successMessage: '',
      iteratedRange: '',
      invalidData: true,
      range: ''
    }
  }

  handleChange = (e) => {
    e.preventDefault();
    this.setState({
      inputName: e.target.value,
      inputLocation: e.target.value
    });
  }

  handleSelect = date => {
    const { inputName, inputLocation, startDate, endDate, customerDetails } = this.state;
    const newEntry = {
      inputName: inputName,
      inputLocation: inputLocation,
      startDate: startDate._d,
      endDate: endDate._d,
    };

    var start = moment(startDate._d);
    var end = moment(endDate._d);
    var range = moment.range(start, end);


    if (customerDetails.length === 0) {
      customerDetails.push(newEntry);
      this.setState({ successMessage: "Room available! Click on Book Room to confirm.", failureMessage: "", iteratedRange: "", invalidData: false, inputName: "", inputLocation: "" })
    }

    else if (customerDetails.length > 0) {
      const customerDetailsLength = customerDetails.length;
      for (let i = 0; i < customerDetailsLength; i++) {
        var iteratedRange = moment.range(customerDetails[i].startDate, customerDetails[i].endDate)
        var isValid = range.overlaps(iteratedRange);
      }

      if (isValid === false) {
        customerDetails.push(newEntry);
        this.setState({ successMessage: "Room available! Click on Book Room to confirm.", failureMessage: "", iteratedRange: "", invalidData: false, inputName: '', inputLocation: '' })
      }

      else {
        for (let i = 0; i < customerDetailsLength; i++) {
          var iteratedRange = moment.range(customerDetails[i].startDate, customerDetails[i].endDate);
          var intersectedRange = iteratedRange.intersect(range);
          var isValid = range.overlaps(intersectedRange);

          var overlapingStartDate = intersectedRange.start._d.getDate();
          var overlapingEndDate = intersectedRange.end._d.getDate();
          var overlapingStartMonth = intersectedRange.start._d.getMonth() + 1;
          var overlapingEndMonth = intersectedRange.end._d.getMonth() + 1;
          this.setState({ successMessage: "", iteratedRange: `Dates ${overlapingStartDate}/${overlapingStartMonth} to ${overlapingEndDate}/${overlapingEndMonth} are not available ! Please select a different date. `, invalidData: true })
        }
      }
    }
    this.setState({ customerDetails: customerDetails }); 
    this.invalidDate(range)
  }

  invalidDate = range => {
    console.log('range', range)
    if(range) {
      return true;
      this.setState({range: "color: grey"})
    }
    else {
      return false;
    }
  }

  getOutsideDateRange = day => {
    console.log(day._d)
  }

  handleBook = date => {
    this.setState({ successMessage: "Room booked successfully!", failureMessage: "", iteratedRange: "" });
    this.createeTable();
  }

    

  createeTable = pageNumber => {
    const { customerDetails } = this.state;
    var html = '<table class="table table-striped table-bordered" border=1 width: 100% text-align= "center" id="tablee">';
    html += '<tr class="text-uppercase text-success">';
    html += '<th scope="col">' + 'Name' + '</th>';
    html += '<th scope="col">' + 'Start Date' + '</th>';
    html += '<th scope="col">' + 'End Date' + '</th>';
    html += '</tr>';
    var i;
    const customerDetailsLength = customerDetails.length;

    for (i = 0; i < customerDetailsLength; i++) {
      html += '<tr class="text-primary">';
      html += '<td class="lead ">' + customerDetails[i].inputName + '</td>';
      html += '<td class="lead">' + customerDetails[i].startDate.getDate() + '/' + customerDetails[i].startDate.getMonth() + '</td>';
      html += '<td class="lead">' + customerDetails[i].endDate.getDate() + '/' + customerDetails[i].startDate.getMonth() + '</td>';
      html += '</tr>';
    }
    html += '</table>';
    document.getElementById('details').innerHTML = html;
  }


  render() {
    const { successMessage, failureMessage, iteratedRange } = this.state;
    const { customerDetails } = this.state;
    
    return (

      <div className="App">
        <div className="row">
          <div className='col-md-5 order-md-2 mb-4 '>
            <Form className="text">
              <div className="jumbotron">
                <h3 className="text-info"> Book your rooms here! </h3>
                <div> </div>
                <div className="row">
                  <div className="col-md-6 mb-3 ">
                    <div align="left">
                    </div>
                    <input type='text' className="form-control " name='name' id='name' placeholder='Enter name' onChange={this.handleChange} />
                  </div>
                  <div className="col-md-6 mb-3">
                    <div align="left">
                    </div>
                    <input type='text' name='location' className="form-control " id='location' placeholder='Enter your location' />
                  </div>
                </div>

                <FormGroup row>
                  <Col sm={12}>
                    <div align='left'>
                      <DateRangePicker
                        startDate={this.state.startDate}
                        startDateId="start_date_id"
                        endDate={this.state.endDate}
                        onSelect={this.handleSelect}
                        isOutsideRange={(day) => day.isAfter(moment()) || day.isBefore(moment().subtract(30, 'days'))}
                        // isDayBlocked= {([this.state.startDate, this.state.endDate])}
                        endDateId="end_date_id"
                        onDatesChange={({ startDate, endDate }) => this.setState({ startDate, endDate })}
                        focusedInput={this.state.focusedInput}
                        onInit={this.handleSelect}
                        onChange={this.handleSelect}
                        onFocusChange={focusedInput => this.setState({ focusedInput })}
                        startDatePlaceholderText="Check In"
                        endDatePlaceholderText="Check Out" />
                    </div>
                  </Col>
                </FormGroup>

                <div className="row">
                  <div className="col-md-6 mb-3 ">
                    <FormGroup row>
                      <Col lg={12} >
                        <Button color="info"
                          disabled={!this.state.startDate}
                          disabled={!this.state.endDate} onClick={this.handleSelect} > Search Availablity </Button>
                      </Col>
                    </FormGroup>
                  </div> <div className="col-md-6 mb-3 ">
                    <FormGroup row>
                      <Col lg={12} >
                        <Button color="success" id='book' disabled={this.state.invalidData} onClick={this.handleBook}> Book room </Button>
                      </Col>
                    </FormGroup>

                  </div>
                </div>
                <p className="text-success"> {successMessage} </p>
                <p className="text-danger"> {failureMessage} </p>
                <p className="text-danger"> {iteratedRange} </p>

              </div>

            </Form>
          </div>


          <div className='col-md-6 order-md-2 mb-4 '>

            <Col align='right'>
              <div className="jumbotron">
                <h3 className="text-info" align='center'> Booked rooms! </h3>
                <p id='details'> </p>

              </div>
            </Col>

          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = ({ customerDetails }) => {
  return {
    customerDetails: customerDetails
  }
}

const mapDispatchToProps = {
  addBooking: addBooking,
  checkAvailability: checkAvailability
}

export default connect(mapStateToProps, mapDispatchToProps)(Hotel);
