module.exports = (sequelize, DataTypes) => {

    const Transactions = sequelize.define("Transactions", {
        transactionId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },

        type: {
           type: DataTypes.STRING,
           allowNull: false 
        },

        amount: {
            type: DataTypes.DECIMAL,
            allowNull: false,
        },

        counterparty: {
           type: DataTypes.STRING,
           allowNull: false 
        },

        date: {
           type: DataTypes.DATEONLY,
           allowNull: false 
        },
    }, {
        tableName: 'transactions',
        freezeTableName: true
    });

    Transactions.associate = (models) => {
        Transactions.belongsTo(models.Users, { 
            foreignKey: 'userId' 
        });

        Transactions.belongsTo(models.Categories, { 
            foreignKey: 'categoryId' 
        });
    }

    return Transactions;
};