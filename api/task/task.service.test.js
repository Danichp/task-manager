const TaskService = require('./task.service');
const Task = require('../../_helpers/tables/task.schema');

// Подделываем (mock) модель Task
jest.mock('../../_helpers/tables/task.schema');

describe('TaskService', () => {});
