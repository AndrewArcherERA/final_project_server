require('dotenv').config();

module.exports = {

    development: {
        client: 'mysql',
        connection: {
            host: process.env.RDS_HOSTNAME,
            port: process.env.RDS_PORT,
            user: process.env.RDS_USERNAME,
            password: process.env.RDS_PASSWORD,
            database: process.env.RDS_DB_NAME,
            ssl: process.env.DB_SSL ? {rejectUnauthorized: false} : false
        },

        pool: {
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
            host: process.env.RDS_HOSTNAME,
            port: process.env.RDS_PORT,
            user: process.env.RDS_USERNAME,
            password: process.env.RDS_PASSWORD,
            database: process.env.RDS_DB_NAME,
            ssl: process.env.DB_SSL ? {rejectUnauthorized: false} : false
        },

        pool: {
            min: 2,
            max: 10,
        },

        migrations: {
            tableName: 'knex_migration'
        },

    }
};