module.exports = (sequelize, DataTypes) => {

    const RecurringTransactions = sequelize.define("RecurringTransactions", {
        recurringTransactionId: {
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

        frequency: {
            type: DataTypes.STRING,
            allowNull: false
        },

        startDate: {
           type: DataTypes.DATEONLY,
           allowNull: false 
        },

        endDate: {
           type: DataTypes.DATEONLY,
           allowNull: true 
        },

        lastChargedDate: {
           type: DataTypes.DATEONLY,
           allowNull: true 
        },
    }, {
        tableName: 'recurringtransactions',
        freezeTableName: true
    });

    RecurringTransactions.associate = (models) => {
        RecurringTransactions.belongsTo(models.Users, { 
            foreignKey: 'userId' 
        });

        RecurringTransactions.belongsTo(models.Categories, { 
            foreignKey: 'categoryId' 
        });
    }

    return RecurringTransactions;
};