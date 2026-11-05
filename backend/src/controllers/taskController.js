import Task from '../models/Task.js';

// @desc Create task
// @route POST /api/weddings/:id/tasks
export const createTask = async (req, res, next) => {
  try {
    const {
      title,
      description,
      category = 'General',
      timelineBucket = '6 Months Before',
      dueDate,
      priority = 'Medium',
      assignedTo = 'Shared',
      notes = '',
    } = req.body;

    if (!title) {
      return res.status(400).json({ success: false, message: 'Task title is required.' });
    }

    const task = await Task.create({
      wedding: req.params.id,
      title,
      description,
      category,
      timelineBucket,
      dueDate,
      priority,
      assignedTo,
      notes,
      status: 'Pending',
    });

    res.status(201).json({
      success: true,
      message: 'Task added successfully.',
      task,
    });
  } catch (error) {
    next(error);
  }
};

// @desc Get all tasks for wedding
// @route GET /api/weddings/:id/tasks
export const getTasks = async (req, res, next) => {
  try {
    const { status, timelineBucket, priority, assignedTo } = req.query;

    const query = { wedding: req.params.id };

    if (status && status !== 'All') {
      query.status = status;
    }

    if (timelineBucket && timelineBucket !== 'All') {
      query.timelineBucket = timelineBucket;
    }

    if (priority && priority !== 'All') {
      query.priority = priority;
    }

    if (assignedTo && assignedTo !== 'All') {
      query.assignedTo = assignedTo;
    }

    const tasks = await Task.find(query).sort({ dueDate: 1, createdAt: -1 });

    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.status === 'Completed').length;
    const pendingTasks = tasks.filter(t => t.status === 'Pending').length;
    const inProgressTasks = tasks.filter(t => t.status === 'In Progress').length;
    const progressPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    res.status(200).json({
      success: true,
      progress: {
        totalTasks,
        completedTasks,
        pendingTasks,
        inProgressTasks,
        progressPercent,
      },
      tasks,
    });
  } catch (error) {
    next(error);
  }
};

// @desc Update task
// @route PUT /api/weddings/:id/tasks/:taskId
export const updateTask = async (req, res, next) => {
  try {
    const task = await Task.findOne({
      _id: req.params.taskId,
      wedding: req.params.id,
    });

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found.' });
    }

    if (req.body.status === 'Completed' && task.status !== 'Completed') {
      req.body.completedAt = new Date();
    } else if (req.body.status && req.body.status !== 'Completed') {
      req.body.completedAt = null;
    }

    Object.assign(task, req.body);
    await task.save();

    res.status(200).json({
      success: true,
      message: 'Task updated successfully.',
      task,
    });
  } catch (error) {
    next(error);
  }
};

// @desc Delete task
// @route DELETE /api/weddings/:id/tasks/:taskId
export const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.taskId,
      wedding: req.params.id,
    });

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found.' });
    }

    res.status(200).json({
      success: true,
      message: 'Task removed successfully.',
    });
  } catch (error) {
    next(error);
  }
};

