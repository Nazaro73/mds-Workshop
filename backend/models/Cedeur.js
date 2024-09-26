const sequelize = require('./_database');
const { DataTypes } = require('sequelize');

const Cedeur = sequelize.define('Cedeur', {
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
    codeNaf: {
        type: DataTypes.STRING,
        allowNull: false
    },
    tailleEffectif: {
        type: DataTypes.STRING,
        allowNull: false
    },
    localisation: {
        type: DataTypes.STRING,
        allowNull: false
    },
    niveauCA: {
        type: DataTypes.STRING,
        allowNull: false
    },
});

module.exports = Cedeur;