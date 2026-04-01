module.exports = (sequelize, DataTypes) => {

    const Users = sequelize.define("Users", {
        userId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },

        email: {
           type: DataTypes.STRING,
           allowNull: false 
        },

        name: {
           type: DataTypes.STRING,
           allowNull: false 
        }
    }, {
        tableName: 'users',
        freezeTableName: true
    });

    Users.associate = (models) => {
        Users.hasMany(models.Transactions, { 
            foreignKey: 'userId',
            onDelete: 'CASCADE' 
        });

        Users.hasMany(models.RecurringTransactions, { 
            foreignKey: 'userId',
            onDelete: 'CASCADE' 
        });

        Users.hasMany(models.Categories, { 
            foreignKey: 'userId',
            onDelete: 'CASCADE' 
        });

        Users.hasMany(models.Budgets, { 
            foreignKey: 'userId',
            onDelete: 'CASCADE' 
        });
        
    }

    return Users;
};