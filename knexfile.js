require('dotenv').config();

module.exports = {

    development: {
      client: 'mysql',
      connection: {
        host: process.env.RDS_HOSTNAME || "awseb-e-au8tfmjzrp-stack-awsebrdsdatabase-qebejutdjc2e.czioauyi8xi5.us-east-1.rds.amazonaws.com",
        port: process.env.RDS_PORT || 3306,
        user: process.env.RDS_USERNAME || 'root',
        password: process.env.RDS_PASSWORD || 'root1234',
        database: process.env.RDS_DB_NAME || 'ebdb',
        ssl: process.env.DB_SSL ? {rejectUnauthorized: false} : false
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
        host: process.env.RDS_HOSTNAME || "awseb-e-au8tfmjzrp-stack-awsebrdsdatabase-qebejutdjc2e.czioauyi8xi5.us-east-1.rds.amazonaws.com",
        port: process.env.RDS_PORT || 3306,
        user: process.env.RDS_USERNAME || 'root',
        password: process.env.RDS_PASSWORD || 'root1234',
        database: process.env.RDS_DB_NAME || 'ebdb',
        ssl: process.env.DB_SSL ? {rejectUnauthorized: false} : false
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