## Installation:

$ npm install

## DB:

create postgres db (or import from dump)

## Migrations:

npx sequelize-cli db:migrate

#### Remove all migration tables:

npx sequelize-cli db:migrate:undo:all

## Running the app:

$ npm run start:dev

## Running the app with Docker:

npm run start:docker

## Testing endpoints in Swagger:

http://localhost:5000/api/docs

## Unit tests (Jest):

$ npm run test
