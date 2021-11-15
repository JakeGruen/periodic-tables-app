import React, { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import ErrorAlert from "../layout/ErrorAlert";
import { seatReservation, getReservationById } from "../utils/api";
import formatReservationDate from "../utils/format-reservation-date";
/* eslint-disable */
export default function SeatReservation({
  tables,
  reservations,
  loadTables,
  loadReservations,
}) {
  const { reservation_id } = useParams();
  const history = useHistory();
  const [error, setError] = useState(null);
  const [dataError, setDataError] = useState([]);
  const [tableId, setTableId] = useState(0);
  const [reservationData, setReservationData] = useState({});

  function loadRes() {
    const abortController = new AbortController();
    setError(null);
    getReservationById(reservation_id, abortController.signal)
      .then(setReservationData)
      .catch(setError);
  }

  useEffect(loadRes, [reservation_id]);

  const validation = () => {
    const errors = [];
    let valid = true;
    const table = tables.find((table) => table.table_id === Number(tableId));
    if (reservationData.people > table.capacity) {
      errors.push({ message: "Table not large enough." });
      valid = false;
    }
    if (table.reservation_id) {
      errors.push({ message: "Table is occupied." });
      valid = false;
    }
    setDataError(errors);
    return valid;
  };

  async function submitHandler(event) {
    event.preventDefault();
    if (validation()) {
      try {
        await seatReservation(reservation_id, tableId);
        await loadTables();
        await loadReservations();
        formatReservationDate(reservationData);
        history.push(`/dashboard?date=${reservationData.reservation_date}`);
      } catch (error) {
        console.log(error);
      }
    }
  }

  async function cancelHandler(event) {
    event.preventDefault();
    history.goBack();
  }

  async function changeHandler({ target }) {
    setTableId(target.value);
  }

  return (
    <div>
      {dataError.map((err, index) => (
        <ErrorAlert key={index} error={err} />
      ))}

      <select
        name="table_id"
        id="table_name"
        onChange={changeHandler}
        value={tableId}
      >
        <option defaultValue={0}>Select A Table</option>
        {tables.map((table) => (
          <option key={table.table_id} value={table.table_id}>
            {table.table_name} - {table.capacity}
          </option>
        ))}
      </select>
      <button type="submit" onClick={submitHandler}>
        Submit
      </button>
      <button onClick={cancelHandler}>Cancel</button>
    </div>
  );
}