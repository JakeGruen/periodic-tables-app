import React from "react";
import { updateReservationStatus } from "../utils/api";


export default function ItemReservation({ reservation, loadReservations}){
    const {
        first_name,
        last_name,
        mobile_number,
        reservation_time,
        reservation_date,
        people,
      } = reservation;
    
      const reservation_id = reservation.reservation_id;
      const status = reservation.status;
    
      const cancelHandler = async (reservation_id) => {
        const confirm = window.confirm(
          "Are you sure you want to cancel this reservation? This cannot be undone."
        );
        if (confirm) {
          try {
            console.log(reservation_id);
            await updateReservationStatus(reservation_id, "cancelled");
            await loadReservations();
          } catch (error) {
            console.log(error);
          }
        }
      };
    
      return (
        <li>
          {status === "booked" ? (
            <div
              className="card"
              style={{
                backgroundColor: "yellow",
                border: "solid 1px green",
                marginBottom: "15px",
              }}
            >
              <div className="card-body">
                <h5>Reservation {reservation_id}:</h5>
                <div>{`Name: ${first_name} ${last_name}`}</div>
                <div>{`Phone: ${mobile_number}`}</div>
                <div>{`Time: ${reservation_time}`}</div>
                <div>{`Date: ${reservation_date}`}</div>
                <div>{`Party Size: ${people}`}</div>
                <div
                  data-reservation-id-status={reservation_id}
                >{`Status: ${status}`}</div>
                {status === "booked" ? (
                  <a
                    href={`/reservations/${reservation_id}/seat`}
                    className="btn btn-primary btn-sm mx-1"
                  >
                    Seat
                  </a>
                ) : null}
                <a
                  href={`/reservations/${reservation_id}/edit`}
                  className="btn btn-primary btn-sm mx-1"
                >
                  Edit
                </a>
                <button
                  className="btn btn-danger btn-sm mx-1"
                  onClick={() => cancelHandler(reservation_id)}
                  data-reservation-id-cancel={reservation_id}
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : status === "seated" ? (
            <div
              className="card"
              style={{
                backgroundColor: "lightyellow",
                border: "solid 1px yellow",
                marginBottom: "15px",
              }}
            >
              <div className="card-body">
                <h5>Reservation {reservation_id}:</h5>
                <div>{`Name: ${first_name} ${last_name}`}</div>
                <div>{`Phone: ${mobile_number}`}</div>
                <div>{`Time: ${reservation_time}`}</div>
                <div>{`Date: ${reservation_date}`}</div>
                <div>{`Party Size: ${people}`}</div>
                <div
                  data-reservation-id-status={reservation_id}
                >{`Status: ${status}`}</div>
                <a
                  href={`/reservations/${reservation_id}/edit`}
                  className="btn btn-primary btn-sm mx-1"
                >
                  Edit
                </a>
                <button
                  className="btn btn-danger btn-sm mx-1"
                  onClick={() => cancelHandler(reservation_id)}
                  data-reservation-id-cancel={reservation_id}
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div
              className="card"
              style={{
                backgroundColor: "grey",
                border: "solid 1px red",
                marginBottom: "15px",
              }}
            >
              <div className="card-body">
                <h5>Reservation {reservation_id}:</h5>
                <div>{`Name: ${first_name} ${last_name}`}</div>
                <div>{`Phone: ${mobile_number}`}</div>
                <div>{`Time: ${reservation_time}`}</div>
                <div>{`Date: ${reservation_date}`}</div>
                <div>{`Party Size: ${people}`}</div>
                <div
                  data-reservation-id-status={reservation_id}
                >{`Status: ${status}`}</div>
                <a
                  href={`/reservations/${reservation_id}/edit`}
                  className="btn btn-primary btn-sm mx-1"
                >
                  Edit
                </a>
                <button
                  className="btn btn-danger btn-sm mx-1"
                  onClick={() => cancelHandler(reservation_id)}
                  data-reservation-id-cancel={reservation_id}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </li>
      );





}