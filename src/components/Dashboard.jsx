import React, { useState, useEffect, useRef } from "react";
import { Button, TextField, List, ListItem, ListItemText, IconButton, MenuItem, Select, FormControl, Checkbox } from "@mui/material";
import { Delete } from "@mui/icons-material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Stopwatch from "./Stopwatch";
import Countdown from "./Countdown";
import { useNavigate } from "react-router-dom";
import { Doughnut } from "react-chartjs-2";
import { Chart, ArcElement, Tooltip, Legend } from "chart.js";
Chart.register(ArcElement, Tooltip, Legend);


const Dashboard = () => {
    const username = localStorage.getItem("username");
    const [tasks, setTasks] = useState([]);
    const [task, setTask] = useState("");
    const [description, setDescription] = useState("");
    const [deadline, setDeadline] = useState("");
    const [priority, setPriority] = useState(1);
    const [searchQuery, setSearchQuery] = useState("");
    const [filterPriority, setFilterPriority] = useState("");
    const [sortBy, setSortBy] = useState("");
    const navigate = useNavigate();
    const chartRef = useRef(null);

    const profileClick = () => {
        navigate("/profile");
    }

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const response = await fetch("https://5nvfy5p7we.execute-api.ap-south-1.amazonaws.com/dev/todos");
                if (!response.ok) throw new Error("Failed to fetch tasks");
                const data = await response.json();
                setTasks(data);
            } catch (error) {
                console.error("Error fetching tasks:", error);
            }
        };
        fetchTasks();
    }, []);
    const completedTasks = tasks.filter(task => task.is_completed).length;
    const incompleteTasks = tasks.length - completedTasks;


    const pieData = {
        labels: ["Completed", "Incomplete"],
        datasets: [
            {
                data: [completedTasks, incompleteTasks],
                backgroundColor: ["#4caf50", "#f44336"],
                hoverBackgroundColor: ["#66bb6a", "#e57373"],
            },
        ],
    };


    const addTask = async () => {
        if (task.trim() === "" || deadline === "") return;

        const newTask = {
            title: task,
            description: description || "No description",
            created_at: new Date(),
            deadline: new Date(deadline),
            priority,
            is_completed: false,
        };

        try {
            const response = await fetch("https://5nvfy5p7we.execute-api.ap-south-1.amazonaws.com/dev/todo", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newTask),
            });
            if (!response.ok) throw new Error("Error adding task");

            const data = await response.json();
            setTasks((prevTasks) => [...prevTasks, data]);
            setTask("");
            setDescription("");
            setDeadline("");
            setPriority(1);
            toast.success("Task added successfully!");
        } catch (error) {
            console.error("Error adding task:", error);
            toast.error("Failed to add task!");
        }
    };

    const toggleTask = async (id) => {
        const taskToUpdate = tasks.find((task) => task.id === id);
        if (!taskToUpdate) return;

        const updatedTask = { ...taskToUpdate, is_completed: !taskToUpdate.is_completed };

        try {
            const response = await fetch(`https://5nvfy5p7we.execute-api.ap-south-1.amazonaws.com/dev/todo/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updatedTask),
            });
            if (!response.ok) throw new Error("Error updating task completion");
            const data = await response.json();
            setTasks((prevTasks) => prevTasks.map((task) => (task.id === id ? data : task)));
        } catch (error) {
            console.error("Error toggling task completion:", error);
        }
    };

    const deleteTask = async (id) => {
        setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
        try {
            await fetch(`https://5nvfy5p7we.execute-api.ap-south-1.amazonaws.com/dev/todo/${id}`, { method: "DELETE" });
        } catch (error) {
            console.error("Error deleting task:", error);
        }
    };

    const filteredTasks = tasks
        .filter(
            (task) =>
                task.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
                (filterPriority ? task.priority === Number(filterPriority) : true)
        )
        .sort((a, b) => {
            if (sortBy === "created_at") return new Date(a.created_at) - new Date(b.created_at);
            if (sortBy === "deadline") return new Date(a.deadline) - new Date(b.deadline);
            if (sortBy === "priority") return b.priority - a.priority; // Descending order
            return 0;
        });
    useEffect(() => {
        if (!username) navigate("/login");
    }, [])
    function logoutClick() {
        localStorage.removeItem("username");
        toast.success("Logged out successfully");
        navigate("/login");
    }
    return (
        <div className="max-w-lg mx-auto mt-10 p-6 bg-gray-100 rounded-lg shadow-md">
            <ToastContainer />
            <h1 className="text-2xl font-bold text-center mb-4">Welcome, {username}!</h1>
            <div className="flex flex-col gap-3 mb-4">
                <Button variant="contained" color="secondary" onClick={profileClick}>Profile</Button>
            </div>
            <div className="flex flex-col gap-3 mb-4">
                <Button variant="contained" color="error" onClick={logoutClick}>Logout</Button>
            </div>
            <div className="flex justify-center mb-6">
                <div className="w-64 h-64">
                    <Doughnut data={pieData} ref={chartRef} />
                </div>
            </div>

            <Stopwatch />
            <div className="flex flex-col gap-3 mb-4">
                <TextField fullWidth label="Add a task" value={task} onChange={(e) => setTask(e.target.value)} />
                <TextField fullWidth label="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
                <TextField fullWidth type="datetime-local" value={deadline} onChange={(e) => setDeadline(e.target.value)} InputLabelProps={{ shrink: true }} />
                <FormControl fullWidth>
                    <Select value={priority} onChange={(e) => setPriority(Number(e.target.value))}>
                        <MenuItem value={0}>Low Priority</MenuItem>
                        <MenuItem value={1}>Medium Priority</MenuItem>
                        <MenuItem value={2}>High Priority</MenuItem>
                    </Select>
                </FormControl>
                <Button variant="contained" color="primary" onClick={addTask}>Add Task</Button>
            </div>
            {/* Search and Filters */}
            <div className="mb-4 flex flex-col gap-3">
                <TextField
                    fullWidth
                    label="Search Task"
                    variant="outlined"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <FormControl fullWidth>
                    <Select value={filterPriority} onChange={(e) => setFilterPriority(e.target.value)}>
                        <MenuItem value="">All</MenuItem>
                        <MenuItem value={2}>High Priority</MenuItem>
                        <MenuItem value={1}>Medium Priority</MenuItem>
                        <MenuItem value={0}>Low Priority</MenuItem>
                    </Select>
                </FormControl>
                <FormControl fullWidth>
                    <Select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                        <MenuItem value="">None</MenuItem>
                        <MenuItem value="created_at">created_at Time</MenuItem>
                        <MenuItem value="deadline">Deadline</MenuItem>
                        <MenuItem value="priority">Priority</MenuItem>
                    </Select>
                </FormControl>
            </div>
            <List>
                {filteredTasks.map(({ id, title, description, created_at, deadline, priority, is_completed }) => (
                    <ListItem key={id} className={`flex flex-col p-3 rounded-lg shadow-sm mb-2 ${is_completed ? "bg-green-200" : "bg-white"}`}>
                        <ListItemText primary={<span className="text-2xl">{title}</span>} secondary={
                            <>
                                <br />
                                <div>📅 Created: {new Date(created_at).toLocaleString()}</div>
                                <div>⏳ Deadline: {new Date(deadline).toLocaleString()}</div>
                                <div className="font-semibold">
                                    ⚡ Priority: {priority === 0 ? "Low" : priority === 1 ? "Medium" : "High"}
                                </div>
                            </>
                        } />
                        {!is_completed && <Countdown deadline={deadline} />}
                        <div>
                            <Checkbox checked={is_completed} onChange={() => toggleTask(id)} color="success" />
                            <IconButton color="error" onClick={() => deleteTask(id)}><Delete /></IconButton>
                        </div>
                    </ListItem>
                ))}
            </List>
        </div>
    );
};

export default Dashboard;
