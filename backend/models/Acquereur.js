const sequelize = require('./_database');
const { DataTypes } = require('sequelize');

const Acquereur = sequelize.define('Acquereur', {
    nom: {
        type: DataTypes.STRING,
        allowNull: false
    },
    prenom: {
        type: DataTypes.STRING,
        allowNull: false
    },
    societe: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false
    },
    secteur: { // Ajout du champ secteur
        type: DataTypes.STRING,
        allowNull: true // Le secteur peut ne pas être obligatoire
    }
});

module.exports = Acquereur;
