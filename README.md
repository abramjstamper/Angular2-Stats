# Basketball Stats
Currently working on adapting a project that I wrote nearly all the backend for to a new web app
for basketball stats. I liked the tech stack enough that I just forked the project and started
changing stuff to reflect a new data model.

# Prerequisites
`npm install`
`npm install -g knex angular-cli`

# Server

To Import Database Schema:
`knex migrate:latest`

To Import Database Data:
`knex seed:run`

To run server:
run `node server/start.js` in terminal

In a browser visit `localhost:3000`


To run express-admin:
run `node server/node_modules/express-admin server/express-admin`

In a browser visit: `localhost:5000`

User: admin
Pass: AdmiN123

# Client

To start webapp server (in `webapp` directory):
run `ng serve`

In a browser visit: `localhost:4200`

To login:

User: test@example.com
Pass: pass
