import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import TextField from "@mui/material/TextField"
import { useState } from 'react';
import toast from 'react-hot-toast';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '400px',
  bgcolor: 'background.paper',
  boxShadow: 24,
  display: 'flex',
  alignItems: 'center', 
  justifyContent: 'center'
};
export function CreateTodoModal({ updateTodos }) {
    const [isOpen, setIsOpen] = useState(false);
    const [title, setTitle] = useState("");
    const [priority, setPriority] = useState("0");

    async function createTodoClick() {
        const body = {
            "title": title,
            "description": "string",
            "deadline": "2025-01-29T16:34:37.131Z",
            "priority": parseInt(priority)
        };
        const r = await fetch("https://5nvfy5p7we.execute-api.ap-south-1.amazonaws.com/dev/todo", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        });
        const j = await r.json();
        console.log(j);
        toast.success("Todo created");
        setTitle("");
        setPriority("");
        setIsOpen(false);
        updateTodos();
    }
    return <div>
        <Button onClick={() => setIsOpen(true)} variant="contained" size="large">Create</Button>
        <Modal open={isOpen} onClose={() => setIsOpen(false)}>
            <div style={style}>
                <div style={{backgroundColor:"white", padding: "20px"}}>
                    <h1>Add a Todo</h1>
                    <br/>
                    <br/>
                    <TextField placeholder='Title' value={title} onChange={e => setTitle(e.target.value)}/>
                    <br/>
                    <br/>
                    <TextField placeholder='Priority'  value={priority} onChange={e => setPriority(e.target.value)}/>
                    <br/>
                    <br/>
                    <Button onClick={createTodoClick} fullWidth variant="contained" size="large">Create</Button>
                </div>
            </div>
        </Modal>
    </div>
}