import React, { useState } from "react";
import { listReservations } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import DisplayReservation from "./DisplayReservation";
/* eslint-disable */

export default function SearchByPhone() {
  const [phoneNum, setPhoneNum] = useState({});
  const [errors, setErrors] = useState([]);
  const [resByPhone, setResByPhone] = useState([]);
  const [status, setStatus] = useState(true);

  const clickHandler = async (event) => {
    event.preventDefault();
    const data = await listReservations({
      mobile_number: phoneNum.mobile_number,
    });
    data.length < 1 ? setStatus(false) : setResByPhone(data);
  };

  const changeHandler = ({ target }) => {
    const value = target.value;
    setPhoneNum({
      ...phoneNum,
      [target.name]: value,
    });
  };

  const errorList = () => {
    return errors.map((err, index) => <ErrorAlert key={index} error={err} />);
  };

  return (
    <div className="container ">
      <div className="dashboard-title">
        <h1 style={{textAlign: 'center', WebkitTextFillColor: "darkgray", marginTop: '10px'}}>Search</h1>
      </div>

      <hr className="page-title-separator" />
      <form>
        <div className="form-group">
          <label>Search for a Reservation: </label>
          <input
            name="mobile_number"
            className="form-control mb-2"
            value={phoneNum.mobile_number}
            placeholder="Enter a customer's phone number"
            type="text"
            id="mobile_number"
            onChange={changeHandler}
            required
          />
          <button type="submit" onClick={clickHandler}>
            Find
          </button>
        </div>
      </form>
      {errorList()}
      <div className="container-fluid p-0">
        {status ? (
          <DisplayReservation filteredList={resByPhone} />
        ) : (
          <p style={{ color: "yellow" }}>No reservations found</p>
        )}
      </div>
    </div>
  );
}