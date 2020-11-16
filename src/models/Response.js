const Sequelize = require('sequelize');
const connection = require('../database/database');
const Ask = require('./Ask');

const Response = connection.define('response', {
  body: {
    type: Sequelize.TEXT,
    allowNull: false,
  },
  questionId: {
    type: Sequelize.INTEGER,
    allowNull: false,
  }
});

Response.sync({ force: false }).then(() => {});


module.exports = Response;