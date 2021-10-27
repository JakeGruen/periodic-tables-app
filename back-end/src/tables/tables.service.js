const knex = require("../db/connection");

function create(table){
    return knex("tables").insert(table, "*").then((tables) => tables[0])
}
function read(tableId){
    return knex("tables").select("*").where({table_id: tableId}).first();
}
function update(updatedTable){
    return knex("tables").where({table_id: updatedTable.table_id}).update(updatedTable, "*");
}
function list(){
    return knex("tables").select("*");
}
function removeResFromTable(tableId){
    return knex("tables").update({reservation_id: null}, "*").where({ table_id: tableId}).then((table) => table[0])
}
module.exports ={
    create,
    read,
    update,
    list,
    removeResFromTable,
}