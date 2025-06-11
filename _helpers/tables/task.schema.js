const { Model, DataTypes } = require('sequelize');
const sequelize = require('../../config/db');
const User = require('./user.schema');
const { Op } = require('sequelize');

class Task extends Model {
  static async getOverdueTasks(userId) {
    return await Task.findAll({
      where: {
        userId,
        status: {
          [Op.ne]: 'done',
        },
        dueDate: {
          [Op.lt]: new Date(),
        },
      },
      order: [['dueDate', 'ASC']],
    });
  }
}

Task.init(
  {
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
  },
  {
    sequelize,
    modelName: 'Task',
    tableName: 'tasks',
    timestamps: true,
  }
);

Task.belongsTo(User, { foreignKey: 'userId' });
User.hasMany(Task, { foreignKey: 'userId' });

module.exports = Task;
