#!/bin/sh

#npm install

#cd siquelize_cli
npx sequelize-cli db:migrate
#cd ..
npm run start:dev

#npx sequelize-cli db:migrate:undo:all
#npx browserslist@latest --update-db
#npm start
#npx sequelize-cli db:migrate:undo