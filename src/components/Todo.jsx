import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import toast from 'react-hot-toast';

export function Todo({ title, is_completed, priority, id, updateTodos }) {
    async function deleteClick() {
        const r = await fetch("https://5nvfy5p7we.execute-api.ap-south-1.amazonaws.com/dev/todo/" + id, {
            method: "DELETE"
        })
        const j = await r.json();
        toast.success(j.message);
        updateTodos();
    }
    return <div style={{ padding: "20px", margin: "10px", border: "1px solid black", borderRadius: "10px", backgroundColor: priority > 8 ? "rgba(255,0,0,0.3)" : "rgba(0,255,0,0.3)"}}>
        <div style={{fontSize: "30px", textDecoration: is_completed ? "line-through": ""}}>
            {is_completed ? "✅" : "⌛"}
            {title}
        </div>
        <div style={{display:'flex', width:'100%', justifyContent:"end"}}>
            <div onClick={deleteClick} style={{fontSize: "30px", cursor: "pointer"}}>❌</div>
        </div>
    </div>
}