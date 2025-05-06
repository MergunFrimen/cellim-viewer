import { useState, useEffect } from "react";
import axios from "axios";

const TaskProgressComponent = () => {
  const [taskId, setTaskId] = useState(null);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("Ready to start");
  const [duration, setDuration] = useState(10);
  const [socket, setSocket] = useState<WebSocket | undefined>(undefined);
  const [isRunning, setIsRunning] = useState(false);

  const startTask = async () => {
    try {
      setStatus("Starting task...");
      setIsRunning(true);
      setProgress(0);

      // Call your FastAPI endpoint to start the task
      const response = await axios.post(
        "http://localhost:8000/api/v1/tasks",
        {
          seconds: duration,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("access_token")}`, // If using auth
          },
        },
      );

      const newTaskId = response.data.task_id;
      setTaskId(newTaskId);
      setStatus(`Task ${newTaskId} started`);

      // Connect to WebSocket for progress updates
      const newSocket = new WebSocket(
        `ws://localhost:8000/api/v1/ws/progress/${newTaskId}`,
      );

      newSocket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.status === "PROGRESS") {
          setProgress(data.progress);
          setStatus(`Processing (${data.current}/${data.total})`);
        } else if (data.status === "COMPLETED") {
          setStatus("Task completed successfully");
          setIsRunning(false);
          newSocket.close();
        }
      };

      newSocket.onerror = (error) => {
        console.error("WebSocket error:", error);
        setStatus("WebSocket connection error");
        setIsRunning(false);
      };

      newSocket.onclose = () => {
        console.log("WebSocket connection closed");
      };

      setSocket(newSocket);
    } catch (error) {
      console.error("Error starting task:", error);
      setStatus("Failed to start task");
      setIsRunning(false);
    }
  };

  const stopTask = () => {
    if (socket) {
      socket.close();
      setStatus("Task stopped by user");
      setIsRunning(false);
    }
  };

  useEffect(() => {
    return () => {
      // Clean up WebSocket connection when component unmounts
      if (socket) {
        socket.close();
      }
    };
  }, [socket]);

  return (
    <div
      style={{
        maxWidth: "500px",
        margin: "20px auto",
        padding: "20px",
        border: "1px solid #ddd",
        borderRadius: "8px",
        backgroundColor: "#f9f9f9",
      }}
    >
      <h2 style={{ textAlign: "center", color: "#333" }}>
        Task Progress Monitor
      </h2>

      <div style={{ margin: "20px 0" }}>
        <label style={{ display: "block", marginBottom: "8px" }}>
          Task Duration (seconds):
          <input
            type="number"
            value={duration}
            onChange={(e) => setDuration(parseInt(e.target.value) || 10)}
            min="1"
            max="60"
            style={{
              marginLeft: "10px",
              padding: "5px",
              width: "60px",
            }}
            disabled={isRunning}
          />
        </label>
      </div>

      <div
        style={{
          margin: "20px 0",
          display: "flex",
          justifyContent: "center",
          gap: "10px",
        }}
      >
        <button
          onClick={startTask}
          disabled={isRunning}
          style={{
            padding: "10px 20px",
            backgroundColor: "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            opacity: isRunning ? 0.5 : 1,
          }}
        >
          Start Task
        </button>

        <button
          onClick={stopTask}
          disabled={!isRunning}
          style={{
            padding: "10px 20px",
            backgroundColor: "#f44336",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            opacity: !isRunning ? 0.5 : 1,
          }}
        >
          Stop Task
        </button>
      </div>

      <div style={{ margin: "20px 0" }}>
        <div
          style={{
            width: "100%",
            backgroundColor: "#e0e0e0",
            borderRadius: "4px",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: `${progress}%`,
              height: "30px",
              backgroundColor: progress === 100 ? "#4CAF50" : "#2196F3",
              transition: "width 0.3s ease",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontWeight: "bold",
            }}
          >
            {progress.toFixed(1)}%
          </div>
        </div>
      </div>

      <div
        style={{
          padding: "10px",
          backgroundColor: "#eee",
          borderRadius: "4px",
          textAlign: "center",
          minHeight: "20px",
        }}
      >
        <strong>Status:</strong> {status}
      </div>

      {taskId && (
        <div
          style={{
            marginTop: "10px",
            fontSize: "0.8em",
            color: "#666",
            textAlign: "center",
          }}
        >
          Task ID: {taskId}
        </div>
      )}
    </div>
  );
};

export default TaskProgressComponent;
