import React from "react";
import DisplayReservation from "./DisplayReservation";
import DisplayTable from "./DisplayTable";
import { useHistory } from "react-router-dom";
import { previous, today, next } from "../utils/date-time";

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
export default function Dashboard({
  date,
  reservations,
  reservationsError,
  tables,
  tablesError,
  getTables,
  getReservations,
}) {
  const history = useHistory();
  const filteredReservations = reservations.filter(
    (res) =>
      res.reservation_date === date &&
      res.status !== "finished" &&
      res.status !== "cancelled"
  );
  return (
    <main  className="main container-fluid">
      <div className="dashboard-title">
        <h1 style={{ textAlign: 'center', marginTop: '10px', WebkitTextFillColor: 'darkgray'}}>Dashboard</h1>
      </div>

      <hr className="page-title-separator" />

      <div className="row">
        <div className="col-sm-12 col-md-6 col-lg-6">
          <div className="reservation-date-area container col">
            <h4 className="section-title row justify-content-center">
              Reservations:
            </h4>

            <p className="date-display row justify-content-center">
              Date: {date}
            </p>
            <div className="button-row row justify-content-center">
              <button
                type="button"
                className="btn btn-light btn-sm mx-1 p-0"
                onClick={() =>
                  history.push(`/dashboard?date=${previous(date)}`)
                }
              >
                {`< Previous`}
              </button>
              <button
                type="button"
                className="btn btn-light btn-sm mx-1 p-0"
                onClick={() => history.push(`/dashboard?date=${today()}`)}
              >
                Today
              </button>
              <button
                type="button"
                className="btn btn-light btn-sm mx-1 p-0"
                onClick={() => history.push(`/dashboard?date=${next(date)}`)}
              >
                {`Next >`}
              </button>
            </div>
          </div>
          <div className="reservation-list">
            <DisplayReservation
              filteredList={filteredReservations}
              getReservations={getReservations}
            />
          </div>
        </div>

        <div className="col-sm-12 col-md-6 col-lg-6">
          <div className="table-list-area container col">
            <h4 className="section-title row justify-content-center">
              Tables:
            </h4>
          </div>
          <div className="table-list">
            <DisplayTable
              tables={tables}
              getTables={getTables}
              getReservations={getReservations}
            />
          </div>
        </div>
      </div>
    </main>
  );
}