/**
 * Defines the router for reservation resources.
 *
 * @type {Router}
 */

 const router = require("express").Router();
 const methodNotAllowed = require("../errors/methodNotAllowed");
 const controller = require("./reservations.controller");
 
 router.route("/:reservation_id/edit").put(controller.update).all(methodNotAllowed);
 
 router.route("/:reservation_id/status").put(controller.updateReservation).all(methodNotAllowed);
 
 router.route("/:reservation_Id").get(controller.listById).put(controller.update).all(methodNotAllowed);
 
 router.route("/").get(controller.list).post(controller.create).all(methodNotAllowed);
 
 module.exports = router;