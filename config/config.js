const {POSTGRES_USER, POSTGRES_PASSWORD, POSTGRES_DB, POSTGRES_HOST, POSTGRES_PROTOCOL, POSTGRES_PORT} = require('../credentials').config;

console.log('process.env.NODE_ENV = ', process.env.NODE_ENV)
console.log('process.env.POSTGRES_USER = ', process.env.POSTGRES_USER)

module.exports =
    {
      "username": process.env.POSTGRES_USER,
      "password": process.env.POSTGRES_PASSWORD,
      "database": process.env.POSTGRES_DB,
      "host": process.env.POSTGRES_HOST,
      "dialect": 'postgres',
      "protocol": process.env.POSTGRES_PROTOCOL,
      "port": +process.env.POSTGRES_PORT,

      "dialectOptions": {
        "ssl": {
          "require": process.env.NODE_ENV == 'development',
          "rejectUnauthorized": false
        }
      }
    }