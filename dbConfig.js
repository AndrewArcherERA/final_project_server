const knex = require("knex");

const config = require("./knexfile");

const dbEnv = 'development';
/*console.log("Knex is using the following configuration:", config[dbEnv]);*/
module.exports = knex(config[dbEnv]);