"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
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
  const [extraTask, setExtraTask] = useState(""); // State for extra tasks
  const [isAddingDisabled, setIsAddingDisabled] = useState(false);
  const { theme, setTheme } = useTheme();

  // Fetch user permissions and tasks from the backend
  const fetchTasksAndPermissions = async () => {
    const token = localStorage.getItem("accessToken");
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };

    try {
      const response = await axios.get(
        "http://127.0.0.1:8000/user/canAddTasks",
        config
      );

      if (response.status === 200) {
        const { canAssignTasks, tasks } = response.data;
        setIsAddingDisabled(!canAssignTasks); // disable adding if user cannot assign tasks
        setRegularTasks(tasks.regularTasks);
        setCompletedTasks([...tasks.completedTasks, ...tasks.extraAddedTasks]); // Combine completed and extra tasks into the completed list
        console.log("Permission and tasks:", response.data);
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
      jobId: "J1", // Ensure this is dynamic or relevant
      tasks: [{ description: newTask, isExtraTask: false }],
    };

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/user/assignDailyTask",
        taskData,
        config
      );

      if (response.status === 200) {
        const newTaskObj = {
          _id: response.data.newTaskId, // Assuming backend returns the new task's ID
          description: newTask,
          completed: false,
        };
        setRegularTasks([...regularTasks, newTaskObj]);
        setNewTask("");
      }
    } catch (error) {
      console.error("Error assigning task:", error);
    }
  };

  const addExtraTask = async (e) => {
    e.preventDefault();
    console.log("Attempting to add extra task:", extraTask); // Log input value
    if (extraTask.trim() === "" || isAddingDisabled) {
      console.log("Cannot add extra task: empty or disabled");
      return;
    }
  
    const token = localStorage.getItem("accessToken");
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };
  
    const taskData = {
      description: extraTask,
    };
  
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/user/addExtraTask",
        taskData,
        config
      );
  
      console.log("Response from addExtraTask:", response.data); // Log response
      
      if (response.status === 200) {
        const newExtraTaskObj = {
          _id: response.data.newTaskId, // Ensure the backend returns this ID
          description: extraTask,
          completed: true,
          isExtraTask: true,
        };
        
        setCompletedTasks((prev) => [...prev, newExtraTaskObj]);
        setExtraTask(""); // Reset the input field
        fetchTasksAndPermissions(); // Re-fetch permissions and tasks
      }
    } catch (error) {
      console.error("Error adding extra task:", error);
    }
  };
  

  // Toggle task completion and sync with backend
  const toggleTaskCompletion = async (taskId, isCompleted) => {
    const token = localStorage.getItem("accessToken");
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };

    try {
      await axios.post(
        "http://127.0.0.1:8000/user/markTaskAsCompleted",
        { taskId },
        config
      );

      // If successful, update the local UI state
      if (isCompleted) {
        // Move the task from completedTasks to regularTasks
        const updatedTask = completedTasks.find((task) => task._id === taskId);
        setCompletedTasks(completedTasks.filter((task) => task._id !== taskId));
        setRegularTasks([
          ...regularTasks,
          { ...updatedTask, completed: false },
        ]);
      } else {
        // Move the task from regularTasks to completedTasks
        const updatedTask = regularTasks.find((task) => task._id === taskId);
        setRegularTasks(regularTasks.filter((task) => task._id !== taskId));
        setCompletedTasks([
          ...completedTasks,
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
          <div className="flex items-center space-x-2">
            <Switch
              checked={isAddingDisabled} // The switch is controlled by backend data
              aria-label="Toggle Adding New Tasks"
              disabled // Prevent users from toggling the switch
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
      </div>

      <form onSubmit={addTask} className="mb-6">
        <div className="flex space-x-2">
          <Input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="Add a new task"
            className="flex-grow"
            disabled={isAddingDisabled} // Disable input if not allowed to add tasks
          />
          <Button type="submit" disabled={isAddingDisabled}>
            <PlusCircle className="w-4 h-4 mr-2" />
            Add Task
          </Button>
        </div>
      </form>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-3">Today's Tasks</h2>
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

      {/* {isAddingDisabled && (
        <form onSubmit={addExtraTask}>
          <h2 className="text-xl font-semibold mb-3">
            Add Extra Completed Task
          </h2>
          <div className="flex space-x-2">
            <Input
              type="text"
              value={extraTask}
              onChange={(e) => setExtraTask(e.target.value)}
              placeholder="Add an extra completed task"
              className="flex-grow"
            />
            <Button type="submit">
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Add
            </Button>
          </div>
        </form>
      )} */}
    </div>
  );
}
