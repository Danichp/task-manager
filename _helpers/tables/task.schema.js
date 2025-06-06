const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');
const User = require('./user.schema');

const Task = sequelize.define('Task', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
    },
    status: {
        type: DataTypes.ENUM('todo', 'in-progress', 'done'),
        defaultValue: 'todo',
    },
    dueDate: {
        type: DataTypes.DATE,
    },
}, {
    tableName: 'tasks',
    timestamps: true,
});

// Связь: одна задача принадлежит одному пользователю
Task.belongsTo(User, { foreignKey: 'userId' });
User.hasMany(Task, { foreignKey: 'userId' });

module.exports = Task;
