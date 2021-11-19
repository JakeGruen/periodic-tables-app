/**
 * Defines the base URL for the API.
 * The default values is overridden by the `API_BASE_URL` environment variable.
 */
 import formatReservationDate from "./format-reservation-date";
 import formatReservationTime from "./format-reservation-date";
 
 const API_BASE_URL = "https://jg-reservations-backend.herokuapp.com" || "http://localhost:8000";
 
 /**
  * Defines the default headers for these functions to work with `json-server`
  */
 const headers = new Headers();
 headers.append("Content-Type", "application/json");
 
 /**
  * Fetch `json` from the specified URL and handle error status codes and ignore `AbortError`s
  *
  * This function is NOT exported because it is not needed outside of this file.
  *
  * @param url
  *  the url for the requst.
  * @param options
  *  any options for fetch
  * @param onCancel
  *  value to return if fetch call is aborted. Default value is undefined.
  * @returns {Promise<Error|any>}
  *  a promise that resolves to the `json` data or an error.
  *  If the response is not in the 200 - 399 range the promise is rejected.
  */
 async function fetchJson(url, options, onCancel) {
   try {
     const response = await fetch(url, options);
 
     if (response.status === 204) {
       return null;
     }
 
     const payload = await response.json();
 
     if (payload.error) {
       return Promise.reject({ message: payload.error });
     }
     return payload.data;
   } catch (error) {
     if (error.name !== "AbortError") {
       console.error(error.stack);
       throw error;
     }
     return Promise.resolve(onCancel);
   }
 }
 
 /**
  * Retrieves existing reservations.
  * @returns {Promise<[reservation]>}
  *  a promise that resolves to an array of reservation saved in the database.
  */
 
 export async function listReservations(params, signal) {
   const url = new URL(`${API_BASE_URL}/reservations`);
   Object.entries(params).forEach(([key, value]) =>
     url.searchParams.append(key, value.toString())
   );
   return await fetchJson(url, { headers, signal }, [])
     .then(formatReservationDate)
     .then(formatReservationTime);
 }
 
 export async function createReservation(reservation, signal) {
   const url = `${API_BASE_URL}/reservations`;
   const options = {
     method: "POST",
     headers,
     body: JSON.stringify({ data: reservation }),
     signal,
   };
   return await fetchJson(url, options);
 }
 
 export async function listTables(signal) {
   const url = new URL(`${API_BASE_URL}/tables`);
   return await fetchJson(url, { headers, signal }, []);
 }
 
 export async function createTable(table, signal) {
   const url = `${API_BASE_URL}/tables`;
   const options = {
     method: "POST",
     headers,
     body: JSON.stringify({ data: table }),
     signal,
   };
   return await fetchJson(url, options);
 }
 
 export async function seatReservation(reservation_id, table_id) {
   const url = `${API_BASE_URL}/tables/${table_id}/seat`;
   const options = {
     method: "PUT",
     body: JSON.stringify({ data: { reservation_id } }),
     headers,
   };
   return await fetchJson(url, options, []);
 }
 
 export async function getReservationById(reservation_id) {
   const url = new URL(`${API_BASE_URL}/reservations/${reservation_id}`);
   return await fetchJson(url, { headers }, []);
 }
 
 export async function deleteReservationFromTable(tableId) {
   const url = new URL(`${API_BASE_URL}/tables/${tableId}/seat`);
   return await fetchJson(url, { method: "DELETE", headers }, []);
 }
 
 export async function updateReservationStatus(reservation_id, status, signal) {
   const url = new URL(`${API_BASE_URL}/reservations/${reservation_id}/status`);
   return await fetchJson(
     url,
     {
       method: "PUT",
       headers,
       signal,
       body: JSON.stringify({ data: { status } }),
     },
     []
   );
 }
 
 export async function updateExistingReservation(
   reservation_id,
   newResData,
   signal
 ) {
   const url = `${API_BASE_URL}/reservations/${reservation_id}/edit`;
   const options = {
     method: "PUT",
     headers,
     body: JSON.stringify({ data: newResData }),
     signal,
   };
   return await fetchJson(url, options, {});
 }
