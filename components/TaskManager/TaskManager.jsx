"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { PlusCircle, CheckCircle2, Lock, Unlock } from "lucide-react";
import axios from "axios";

export default function TaskManager() {
  const [regularTasks, setRegularTasks] = useState([]);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [isAddingDisabled, setIsAddingDisabled] = useState(false);

  // Fetch user permissions and tasks from the backend
  const fetchTasksAndPermissions = async () => {
    const token = localStorage.getItem("accessToken");
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };

    try {
      const response = await axios.get(
        "https://kooviot.vercel.app/user/canAddTasks",
        config
      );

      if (response.status === 200) {
        const { canAssignTasks, tasks } = response.data;
        setIsAddingDisabled(!canAssignTasks);
        console.log("canAsignTasks", canAssignTasks);
        setRegularTasks(tasks.regularTasks);
        setCompletedTasks([...tasks.completedTasks, ...tasks.extraAddedTasks]);
      }
    } catch (error) {
      console.error("Error fetching tasks and permission:", error);
    }
  };

  useEffect(() => {
    fetchTasksAndPermissions();
  }, []);

  const addTask = async (e) => {
    e.preventDefault();
    if (newTask.trim() === "" || isAddingDisabled) return;

    const token = localStorage.getItem("accessToken");
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };

    const taskData = {
      tasks: [{ description: newTask, isExtraTask: false }],
    };

    try {
      const response = await axios.post(
        "https://kooviot.vercel.app/user/assignDailyTask",
        taskData,
        config
      );

      if (response.status === 200) {
        const newTaskObj = {
          _id: response.data.newTaskId, // Ensure this ID is returned by the backend
          description: newTask,
          completed: false,
        };
        setRegularTasks((prevTasks) => [...prevTasks, newTaskObj]);
        setNewTask(""); // Clear the input after successful assignment
        fetchTasksAndPermissions();
      }
    } catch (error) {
      console.error("Error assigning task:", error);
    }
  };

  const toggleTaskCompletion = async (taskId, isCompleted) => {
    const token = localStorage.getItem("accessToken");
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };

    try {
      await axios.post(
        "https://kooviot.vercel.app/user/markTaskAsCompleted",
        { taskId },
        config
      );

      // Update local state after successful toggle
      if (isCompleted) {
        setCompletedTasks((prev) => prev.filter((task) => task._id !== taskId));
        const updatedTask = regularTasks.find((task) => task._id === taskId);
        setRegularTasks((prev) => [
          ...prev,
          { ...updatedTask, completed: false },
        ]);
      } else {
        const updatedTask = regularTasks.find((task) => task._id === taskId);
        setRegularTasks((prev) => prev.filter((task) => task._id !== taskId));
        setCompletedTasks((prev) => [
          ...prev,
          { ...updatedTask, completed: true },
        ]);
      }
    } catch (error) {
      console.error("Error toggling task completion:", error);
    }
  };

  const incompleteTasks = regularTasks.filter((task) => !task.completed);
  const completedTaskList = completedTasks; // Already filtered from backend

  return (
    <div className="p-6 bg-background text-foreground rounded-lg shadow-md border">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Daily Task Manager</h1>
        <div className="flex items-center space-x-4">
          <Switch
            checked={isAddingDisabled}
            aria-label="Toggle Adding New Tasks"
            disabled
          />
          <span className="text-sm font-medium">
            {isAddingDisabled ? (
              <Lock className="w-4 h-4" />
            ) : (
              <Unlock className="w-4 h-4" />
            )}
          </span>
        </div>
      </div>

      <form onSubmit={addTask} className="mb-6">
        <div className="flex space-x-2">
          <Input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="Add a new task"
            className="flex-grow"
            disabled={isAddingDisabled}
          />
          <Button type="submit" disabled={isAddingDisabled}>
            <PlusCircle className="w-4 h-4 mr-2" />
            Add Task
          </Button>
        </div>
      </form>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-3">Today&apos;s Tasks</h2>
        {incompleteTasks.length === 0 ? (
          <p className="text-muted-foreground">
            No tasks for today. Add a new task!
          </p>
        ) : (
          <ul className="space-y-2">
            {incompleteTasks.map((task) => (
              <li key={task._id} className="flex items-center space-x-2">
                <Checkbox
                  id={task._id}
                  checked={task.completed}
                  onCheckedChange={() =>
                    toggleTaskCompletion(task._id, task.completed)
                  }
                />
                <label htmlFor={task._id} className="flex-grow">
                  {task.description}
                </label>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-3">Completed Tasks</h2>
        {completedTaskList.length === 0 ? (
          <p className="text-muted-foreground">
            No completed tasks yet. Keep going!
          </p>
        ) : (
          <ul className="space-y-2">
            {completedTaskList.map((task) => (
              <li
                key={task._id}
                className="flex items-center space-x-2 text-muted-foreground"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{task.description}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
