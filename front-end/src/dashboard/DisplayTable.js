import React from "react";
import { deleteReservationFromTable } from "../utils/api";

export default function DisplayTable({ tables, loadTables, loadReservations }) {
  const finishHandler = async (table_id) => {
    const finished = window.confirm(
      "Ready to seat new guests?"
    );
    if (finished) {
      try {
        await deleteReservationFromTable(table_id);
        await loadTables();
        await loadReservations();
      } catch (error) {
        console.log(error);
      }
    }
  };




  return (
    <div>
      <ul className="tables_list p-0">
        {tables.map((table, index) =>
          table.reservation_id ? (
            <li key={table.table_id} className="table-list-item">
              <div
                className="card"
                style={{
                  backgroundColor: "pink",
                  border: "solid 2px red",
                  marginBottom: "15px",
                }}
              >
                <div className="card-body">
                  <h5>Table {table.table_id}:</h5>
                  <div>Name: {table.table_name}</div>
                  <div>Capacity: {table.capacity}</div>
                  <div data-table-id-status={table.table_id}>{`Status: ${
                    table.reservation_id ? "occupied" : "free"
                  }`}</div>
                  {table.reservation_id ? (
                    <button
                      onClick={() => finishHandler(table.table_id)}
                      data-table-id-finish={table.table_id}
                    >
                      Finish
                    </button>
                  ) : null}
            
                </div>
              </div>
            </li>
          ) : (
            <li key={table.table_id} className="table-list-item">
              <div
                className="card"
                style={{
                  backgroundColor: "lightgreen",
                  border: "solid 1px green",
                  marginBottom: "15px",
                }}
              >
                <div className="card-body">
                  <h5>Table {table.table_id}:</h5>
                  <div>Name: {table.table_name}</div>
                  <div>Capacity: {table.capacity}</div>
                  <div data-table-id-status={table.table_id}>{`Status: ${
                    table.reservation_id ? "occupied" : "free"
                  }`}</div>
                  {table.reservation_id ? (
                    <button
                      onClick={() => finishHandler(table.table_id)}
                      data-table-id-finish={table.table_id}
                    >
                      Finish
                    </button>
                  ) : null}
          
                </div>
              </div>
            </li>
          )
        )}
      </ul>
    </div>
  );
};