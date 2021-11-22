import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import {
  createReservation,
  getReservationById,
  updateExistingReservation,
} from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import formatReservationDate from "../utils/format-reservation-date";
import formatReservationTime from "../utils/format-reservation-time";

export default function DisplayReservationForm({ loadReservations }) {
  const history = useHistory();

  const { reservation_id } = useParams();
  /* eslint-disable */
  let initialData = {
    first_name: "",
    last_name: "",
    mobile_number: "",
    reservation_date: "",
    reservation_time: "",
    people: 0,
  };

  const [errors, setErrors] = useState([]);

  const [reservationInfo, setreservationInfo] = useState({
    ...initialData,
  });

  useEffect(() => {
    if (reservation_id) {
      getReservationById(reservation_id)
        .then((reservation) => {
          formatReservationDate(reservation);
          formatReservationTime(reservation);
          setreservationInfo({
            first_name: reservation.first_name,
            last_name: reservation.last_name,
            mobile_number: reservation.mobile_number,
            reservation_date: reservation.reservation_date,
            reservation_time: reservation.reservation_time,
            people: reservation.people,
          });
        })
        .catch(setErrors);
    } else {
      setreservationInfo({ ...initialData });
    }
  }, [reservation_id]);

  const submitHandler = async (event) => {
    event.preventDefault();
    if (getBusinessHours() !== false) {
      try {
        if (reservation_id) {
          await updateExistingReservation(reservation_id, {
            ...reservationInfo,
            reservation_id: reservation_id,
            status: "booked",
          });
          await loadReservations();
          history.push(`/dashboard?date=${reservationInfo.reservation_date}`);
        } else {
          await createReservation(reservationInfo).then((res) =>
            history.push(`/dashboard?date=${reservationInfo.reservation_date}`)
          );
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  const changeHandler = ({ target }) => {
    setreservationInfo({
      ...reservationInfo,
      [target.name]: target.value,
    });
  };

  const numOfGuestsHandler = ({ target }) => {
    setreservationInfo({
      ...reservationInfo,
      [target.name]: Number(target.value),
    });
  };

  const cancelHandler = async (event) => {
    event.preventDefault();
    setreservationInfo({ ...initialData });
    history.goBack();
   
  };

  const getBusinessHours = async () => {
    const reservationDate = new Date(
      `${reservationInfo.reservation_date}T${reservationInfo.reservation_time}:00.000`
    );
    const todaysDate = new Date();
    const foundErrors = [];
    if (reservationDate < todaysDate) {
      foundErrors.push({ message: "Date has already passed." });
    }
    if (reservationDate.getDay() === 2) {
      foundErrors.push({ message: "Sorry, the restaurant is closed on Tuesdays." });
    }
    if (
      reservationDate.getHours() < 10 ||
      (reservationDate.getHours() === 10 &&
        reservationDate.getMinutes() <= 30) ||
      reservationDate.getHours() >= 22
    ) {
      foundErrors.push({ message: "The restaurant opens at 10:30am." });
    } else if (
      reservationDate.getHours() === 21 &&
      reservationDate.getMinutes() >= 30
    ) {
      foundErrors.push({
        message:
          "The restaurant closes at 10:30 PM, and the customer must have time to enjoy their meal.",
      });
    }
    setErrors(foundErrors);
    return foundErrors.length === 0;
  };

  const errorList = () => {
    return errors.map((err, index) => <ErrorAlert key={index} error={err} />);
  };

  return (
    <div className="container pl-0">
      <div className="dashboard-title">
        <h1 style={{textAlign: 'center', WebkitTextFillColor: 'darkgray', marginTop: '10px'}}>Add / Edit Reservation</h1>
      </div>

      <hr className="page-title-separator" />

      <div className="row justify-content-center align-items-center h-100 px-5">
        <div className="col col-sm-12 col-md-6 col-lg-4 col-xl-4">
          <form>
            {errorList()}
            <div className="form-group">
              <label>First Name</label>
              <input
                value={reservationInfo.first_name}
                onChange={changeHandler}
                id="first_name"
                placeholder="Enter a first name."
                type="text"
                name="first_name"
                className="form-control"
                required
              />
              <label>Last Name</label>
              <input
                value={reservationInfo.last_name}
                onChange={changeHandler}
                id="last_name"
                placeholder="Enter a last name."
                type="text"
                name="last_name"
                className="form-control"
                required
              />
              <label>Phone Number</label>

              <input
                value={reservationInfo.mobile_number}
                onChange={changeHandler}
                id="mobile_number"
                placeholder="Enter a phone number."
                type="tel"
                name="mobile_number"
                className="form-control"
                required
              />
              <label>Reservation Date</label>

              <input
                value={reservationInfo.reservation_date}
                onChange={changeHandler}
                id="reservation_date"
                type="date"
                name="reservation_date"
                className="form-control"
                required
              />
              <label>Reservation Time</label>

              <input
                value={reservationInfo.reservation_time}
                onChange={changeHandler}
                id="reservation_time"
                type="time"
                name="reservation_time"
                className="form-control"
                required
              />
              <label>Party Size</label>

              <input
                value={reservationInfo.people}
                onChange={numOfGuestsHandler}
                id="people"
                type="number"
                name="people"
                className="form-control mb-3"
                required
              />
              <div>
                <button className="mx-2" type="submit" onClick={submitHandler}>
                  Submit
                </button>
                <button type="cancel" onClick={cancelHandler}>
                  Cancel
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}