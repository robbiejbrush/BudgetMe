module.exports = (sequelize, DataTypes) => {

    const Categories = sequelize.define("Categories", {
        categoryId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },

        name: {
           type: DataTypes.STRING,
           allowNull: false 
        },

        type: {
           type: DataTypes.STRING,
           allowNull: false 
        },
    }, {
        tableName: 'categories',
        freezeTableName: true
    });

    Categories.associate = (models) => {
        Categories.hasMany(models.Transactions, { 
            foreignKey: 'categoryId' 
        });

        Categories.hasMany(models.RecurringTransactions, { 
            foreignKey: 'categoryId'
        });

        Categories.hasMany(models.Budgets, { 
            foreignKey: 'categoryId'
        });

        Categories.belongsTo(models.Users, { 
            foreignKey: 'userId' 
        });
        
    }

    return Categories;
};