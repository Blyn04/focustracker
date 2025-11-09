import React from "react";
import "../styles/TaskList.css";

export interface TaskItem {
  name: string;
  priority: "High" | "Medium" | "Low";
  focusLevel?: number;
  date?: string;
}

interface TaskListProps {
  tasks: TaskItem[];
}

function TaskList({ tasks }: TaskListProps) {
  const sortedTasks = [...tasks].sort((a, b) => {
    const order = { High: 3, Medium: 2, Low: 1 };
    return (order[b.priority] || 0) - (order[a.priority] || 0);
  });

  return (
    <div className="task-list">
      <h3>✅ Completed Tasks</h3>
      {sortedTasks.length > 0 ? (
        <ul>
          {sortedTasks.map((task, index) => (
            <li key={index}>
              <span>{task.name}</span>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <span className={`priority-badge priority-${task.priority}`}>
                  {task.priority}
                </span>
                {task.focusLevel !== undefined && (
                  <span className="focus-level">⭐ {task.focusLevel}</span>
                )}
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p style={{ color: "#888", textAlign: "center", marginTop: "1rem" }}>
          No tasks yet. Start focusing!
        </p>
      )}
    </div>
  );
}

export default TaskList;
