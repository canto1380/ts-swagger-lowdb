import { Handler } from 'express'
import { getConnection } from '../db'
import { nanoid } from 'nanoid'
import { Task } from '../interfaces/Task.interface'

export const getTasks: Handler = (req, res) => {
  const data = getConnection().get('tasks').value()

  return res.json(data)
}
export const getTasksById: Handler = (req, res) => {
  const { id } = req.params
  const task = getConnection().get('tasks').find({ id: id }).value()
  if(!task) return res.status(404).json({ msg: 'Task was not found' })

  return res.json(task)
}

export const countTasks: Handler = (req, res) => {
  let tasksCount = getConnection().get('tasks').value().length

  return res.json(tasksCount)
}
export const addTask: Handler = (req, res) => {
  try {
    const { title, description } = req.body

    const newTask: Task = {
      id       : nanoid(),
      title,
      description,
      completed: false
    }
    getConnection().get('tasks').push(newTask).write()
    res.json(newTask)
  } catch (error) {
    res.status(400).send(error)
  }
}
export const updateTask: Handler = (req, res) => {
  const { id } = req.params
  const taskFound = getConnection().get('tasks').find({ id }).value()
  if(!taskFound) return res.status(404).json({ msg: ' Task was not found' })
  const updatedTask = getConnection()
    .get('tasks')
    .find({ id })
    .assign(req.body)
    .write()

  return res.json(updatedTask)
}
export const deleteTask: Handler = (req, res) => {
  const { id } = req.params
  const taskFound = getConnection().get('tasks').find({ id }).value()
  if(!taskFound) return res.status(404).json({ msg: 'Task was not found' })
  const deleteTask = getConnection().get('tasks').remove({ id }).write()

  return res.json(deleteTask)
}
