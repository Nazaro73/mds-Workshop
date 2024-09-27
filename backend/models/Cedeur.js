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
        allowNull: true
    },
    tailleEffectif: {
        type: DataTypes.STRING,
        allowNull: true
    },
    localisation: {
        type: DataTypes.STRING,
        allowNull: true
    },
    niveauCA: {
        type: DataTypes.STRING,
        allowNull: true
    },
});

module.exports = Cedeur;