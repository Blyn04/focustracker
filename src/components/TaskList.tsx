import React from "react";
import "../styles/TaskList.css";

interface TaskListProps {
  tasks: string[];
}

const TaskList: React.FC<TaskListProps> = ({ tasks }) => (
  <div className="task-list">
    <h3>Completed Tasks</h3>
    {tasks.length > 0 ? (
      <ul>
        {tasks.map((task, index) => (
          <li key={index}>{task}</li>
        ))}
      </ul>
    ) : (
      <p>No tasks yet. Start focusing!</p>
    )}
  </div>
);

export default TaskList;
