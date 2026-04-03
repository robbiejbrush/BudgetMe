module.exports = (sequelize, DataTypes) => {

    const Budgets = sequelize.define("Budgets", {
        budgetId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },

        monthlyLimit: {
           type: DataTypes.DECIMAL(10, 2),
           allowNull: false 
        }
    }, {
        tableName: 'budgets',
        freezeTableName: true
    });

    Budgets.associate = (models) => {
        Budgets.belongsTo(models.Users, { 
            foreignKey: 'userId' 
        });

        Budgets.belongsTo(models.Categories, { 
            foreignKey: 'categoryId' 
        });
        
    }

    return Budgets;
};