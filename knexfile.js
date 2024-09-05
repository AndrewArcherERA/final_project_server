require('dotenv').config();

module.exports = {

    development: {
      client: 'mysql',
      connection: {
        host: process.env.DB_HOST,
        port: 3306,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME 
      },
  
      pool:{
        min: 2,
        max: 10,
      },
  
      migrations: {
      tableName: 'knex_migration'
      },
    },

    production: {
      client: 'mysql',
      connection: {
        host: process.env.DB_HOST,
        port: 3306,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME 
      },
  
      pool:{
        min: 2,
        max: 10,
      },
  
      migrations: {
      tableName: 'knex_migration'
      },
  
    }
  };