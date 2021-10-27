import React from "react";
import ItemReservation from "./ItemReservation.js";

function DisplayReservation({ filteredList, loadReservations }) {
  return (
    <div>
      <ul className="reservations_list p-0">
        {filteredList.map((res) => (
          <ItemReservation
            key={res.reservation_id}
            reservation={res}
            loadReservations={loadReservations}
          />
        ))}
      </ul>
    </div>
  );
}

export default DisplayReservation;