const sequelize = require("./_database");
const Acquereur = require("./Acquereur");

// // Synchronisation de la base
sequelize.sync();

module.exports = {
  Acquereur: Acquereur,
};
