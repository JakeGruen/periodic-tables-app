import React, { useState, useEffect } from "react";
import { listReservations, listTables } from "../utils/api";
import { Redirect, Route, Switch } from "react-router-dom";
import Dashboard from "../dashboard/Dashboard";
import ReservationForm from "../dashboard/ReservationForm";
import ReserveSeat from "../dashboard/ReserveSeat";
import NotFound from "./NotFound";
import useQuery from "../utils/useQuery";
import TableForm from "../dashboard/TableForm";
import { today } from "../utils/date-time";
import Search from "../dashboard/Search";
/**
 * Defines all the routes for the application.
 *
 * You will need to make changes to this file.
 *
 * @returns {JSX.Element}
 */

function Routes() {
  const query = useQuery();
  const date = query.get("date");
  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);
  const [tables, setTables] = useState([]);
  const [tablesError, setTablesError] = useState(null);
  useEffect(loadDashboard, [date]);

  function loadDashboard() {
    const abortController = new AbortController();
    setReservationsError(null);
    listReservations({ date }, abortController.signal)
      .then(setReservations)
      .catch(setReservationsError);
    listTables(abortController.signal).then(setTables).catch(setTablesError);
    return () => abortController.abort();
  }

  function loadTables() {
    const abortController = new AbortController();
    setTablesError(null);
    return listTables(abortController.signal)
      .then(setTables)
      .catch(setTablesError);
  }

  function loadReservations() {
    setReservationsError(null);
    return listReservations({ date })
      .then(setReservations)
      .catch(setReservationsError);
  }

  return (
    <Switch>
      <Route exact={true} path="/">
        <Redirect to={"/dashboard"} />
      </Route>
      <Route path="/reservations/:reservation_id/edit">
        <ReservationForm loadReservations={loadReservations} />
      </Route>
      <Route path="/reservations/:reservation_id/seat">
        <ReserveSeat
          tables={tables}
          reservations={reservations}
          loadTables={loadTables}
          loadReservations={loadReservations}
        />
      </Route>
      <Route path="/reservations/new">
        <ReservationForm />
      </Route>
      <Route exact={true} path="/reservations">
        <Redirect to={"/dashboard"} />
      </Route>
      <Route path="/search">
        <Search reservations={reservations} />
      </Route>
      <Route path="/dashboard">
        <Dashboard
          date={date ? date : today()}
          reservations={reservations}
          reservationsError={reservationsError}
          tables={tables}
          tablesError={tablesError}
          loadTables={loadTables}
          loadReservations={loadReservations}
        />
      </Route>
      <Route path="/tables/new">
        <TableForm />
      </Route>
      <Route>
        <NotFound />
      </Route>
    </Switch>
  );
}

export default Routes;
