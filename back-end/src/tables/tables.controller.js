const service = require("./tables.service");
const resService = require("../reservations/reservations.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const { destroy } = require("../db/connection");
const hasProperties = require("../errors/hasProperties")(
  "table_name",
  "capacity"
);
//create new table
async function create(req, res, next) {
  service
    .create(req.body.data)
    .then((data) => res.status(201).json({ data }))
    .catch(next);
}
//list tables
async function list(req, res, next) {
  const tableList = await service.list();
  if (tableList.length > 1) {
    tableList.sort((a, b) => a.table_name.localeCompare(b.table_name));
  }
  res.json({ data: tableList });
}
//make changes to table(s)
async function update(req, res, next) {
  const { reservation_id } = req.body.data;
  await resService.updateResStatus(Number(reservation_id), "seated");
  const updatedTable = {
    ...res.locals.table,
    reservation_id: reservation_id,
  };
  res.json({ data: await service.update(updatedTable) });
}
//remove reservation from table
async function removeReservation(req, res, next) {
  const table = res.locals.table
  const res_id = table.reservation_id;
  await service.removeResFromTable(table.table_id);
  const data = await resService.updateResStatus(Number(res_id), "finished")
  res.json({data})
}
//Validates table or throws error
function validTable(req, res, next) {
  if (!req.body.data) {
    return next({
      status: 400,
      message: "No data found in req.body",
    });
  }

  const { table_name, capacity } = req.body.data;
  const validCapacity = typeof capacity === "number";

  if (table_name.length < 2) {
    return next({
      status: 400,
      message: "Invalid table_name",
    });
  }
  if (capacity == 0 || validCapacity == false) {
    return next({
      status: 400,
      message: "Invalid capacity",
    });
  }
  next();
}
//Validates reservation/throws error if invalid.
async function reservationValidation(req, res, next) {
  if (!req.body.data) {
    return next({
      status: 400,
      message: "Data not found.",
    });
  }
  if (!req.body.data.reservation_id) {
    return next({
      status: 400,
      message: "reservation_id not found",
    });
  }
  const reservation = await resService.listById(req.body.data.reservation_id);

  if (reservation === undefined) {
    return next({
      status: 404,
      message: `reservation_id: ${req.body.data.reservation_id} not found`,
    });
  }
  res.locals.reservation = reservation;
  next();
}
//Validates table capacity
async function validateTableCapacity(req, res, next) {
  const reservation = res.locals.reservation;
  const { table_id } = req.params;
  const table = await service.read(table_id);
  if (table) {
    res.locals.table = table;
    if (reservation.people > table.capacity) {
      return next({
        status: 400,
        message: "insufficient table capacity",
      });
    }
    if (table.reservation_id) {
      return next({
        status: 400,
        message: "table is occupied",
      });
    }

    next();
  } else {
    return next({
      status: 404,
      message: `table_id: ${table_id} not found`,
    });
  }
}
//checks if table is occupied
async function isTableOccupied(req, res, next){
  const { table_id } = req.params;
  const table = await service.read(table_id)
  if(!table){
    return next({
      status: 404,
      message: `table_id: ${table_id}, not found `
    })
  }
  if(!table.reservation_id){
    return next({
      status: 400,
      message: `Table: ${table.table_id} is not occupied`
    })
  }
  res.locals.table = table;
  next();
}
//checks if guests have already been seated.
async function alreadySeated(req, res, next){
  const status = res.locals.reservation.status;
  if(status === "seated"){
    return next({
      status: 400,
      message: "These guests have already been seated."
    })
  }
  next();
}



module.exports = {
  create: [hasProperties, validTable, asyncErrorBoundary(create)],
  list,
  update: [
    asyncErrorBoundary(reservationValidation),
    asyncErrorBoundary(validateTableCapacity),
    asyncErrorBoundary(alreadySeated),
    asyncErrorBoundary(update),
  ],
  removeResFromTable: [asyncErrorBoundary(isTableOccupied), asyncErrorBoundary(removeReservation)],

};