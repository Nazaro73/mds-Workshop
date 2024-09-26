const sequelize = require("./_database");
const Acquereur = require("./Acquereur");
const Cedeur = require("./Cedeur");

// // Synchronisation de la base
sequelize.sync();

module.exports = {
  Acquereur: Acquereur,
  Cedeur: Cedeur,
};
