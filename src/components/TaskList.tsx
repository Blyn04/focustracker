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
  pendingTasks: TaskItem[];
  onStartTask: (taskName: string) => void;
}

function TaskList({ tasks, pendingTasks, onStartTask }: TaskListProps) {
  const sortByPriority = (a: TaskItem, b: TaskItem) => {
    const order = { High: 3, Medium: 2, Low: 1 };
    return (order[b.priority] || 0) - (order[a.priority] || 0);
  };

  const sortedCompleted = [...tasks].sort(sortByPriority);
  const sortedPending = [...pendingTasks].sort(sortByPriority);

  return (
    <div className="task-list">
      <h3>🕒 Pending Tasks</h3>
      {sortedPending.length > 0 ? (
        <ul>
          {sortedPending.map((task, index) => (
            <li key={`pending-${index}`} className="task-item">
              <span>{task.name}</span>
              <div className="task-right">
                <span className={`priority-badge priority-${task.priority}`}>
                  {task.priority}
                </span>
                <button
                  className="start-btn"
                  onClick={() => onStartTask(task.name)}
                >
                  ▶ Start
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="empty-text">No pending tasks. Add one to get started!</p>
      )}

      <h3>✅ Completed Tasks</h3>
      {sortedCompleted.length > 0 ? (
        <ul>
          {sortedCompleted.map((task, index) => (
            <li key={`done-${index}`} className="task-item">
              <span>{task.name}</span>
              <div className="task-right">
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
        <p className="empty-text">No completed tasks yet.</p>
      )}
    </div>
  );
}

export default TaskList;
