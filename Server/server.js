const WebSocket = require("ws");
const express = require("express");
const cors = require("cors");
const app = express();
const fs = require("fs");
const filePath = "./info.json";

// Create a basic HTTP server
const server = require("http").createServer(app);

// Initialize the WebSocket server on top of the HTTP server
const wss = new WebSocket.Server({ server });

app.use(cors());
app.use(express.json());

// Middleware for logging requests
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url} - ${new Date().toISOString()}`);
  next();
});

const readTasksFromFile = () => {
  const data = fs.readFileSync("./info.json", "utf8");
  return JSON.parse(data);
};

// Helper function to write data to the file
const writeDataToFile = (data) => {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
};

app.get("/admin_settings", (req, res) => {
  const tasks = readTasksFromFile();
  res.json(tasks);
});

// Update a specific field
app.put("/edit", (req, res) => {
  const newData = req.body;
  console.log(newData);

  if (!newData) {
    return res.status(400).send("Invalid request");
  }

  let data = readTasksFromFile();
  writeDataToFile(newData);

  res.status(200).send(newData);
});

// Message queue class to handle WebSocket messages
class MessageQueue {
  constructor() {
    this.queue = [];
    this.processing = false;
  }

  add(message, ws) {
    this.queue.push({ message, ws });
    this.process();
  }

  async process() {
    if (this.processing) return;
    this.processing = true;
    while (this.queue.length > 0) {
      const { message, ws } = this.queue.shift();
      await this.handleMessage(message, ws);
    }
    this.processing = false;
  }

  async handleMessage(messageStr, ws) {
    console.log("Received message:", messageStr);
    try {
      const data = JSON.parse(messageStr);

      if (data.type === "app") {
        console.log(`App connected: ${data.appName}`);
        ws.appName = data.appName;

        // Store additional data for this client, e.g., routes
        ws.routes = data.routes || [];

        // Send the current login status, selected option, and stored routes to the newly connected client
        ws.send(
          JSON.stringify({ type: "loginStatus", isEnabled: currentLoginStatus })
        );
        ws.send(
          JSON.stringify({ type: "selection", option: currentSelectedOption })
        );
        ws.send(JSON.stringify({ type: "routes", routes: ws.routes }));
      } else if (data.type === "loginControl") {
        currentLoginStatus = data.isEnabled;
        console.log({ currentLoginStatus });
        const fileData = readTasksFromFile();
        writeDataToFile({ ...fileData, allow_access: currentLoginStatus });
        // Broadcast login status to all clients
        wss.clients.forEach((client) => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(
              JSON.stringify({ type: "loginStatus", isEnabled: data.isEnabled })
            );
          }
        });
      } else if (data.type === "optionSelect") {
        currentSelectedOption = data.option;
        // Broadcast the selected option to all clients
        wss.clients.forEach((client) => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(
              JSON.stringify({ type: "selection", option: data.option })
            );
          }
        });
      } else if (data.type === "chapterSelection") {
        const fileData = readTasksFromFile();
        writeDataToFile({ ...fileData, chapters_selected: data.chapters });
        // Broadcast the selected chapters to all clients
        wss.clients.forEach((client) => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(
              JSON.stringify({
                type: "chapterSelection",
                chapters: data.chapters,
              })
            );
          }
        });
      } else if (data.type === "quizLength") {
        // Broadcast the quiz length to all clients
        wss.clients.forEach((client) => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(
              JSON.stringify({
                type: "quizLength",
                quizLength: data.quizLength,
              })
            );
          }
        });
      } else if (data.type === "score") {
        // Broadcast score data to all clients
        wss.clients.forEach((client) => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(
              JSON.stringify({
                type: "score",
                appName: data.appName,
                name: data.name,
                std: data.std,
                value: data.value,
                total: data.totalq,
              })
            );
          }
        });
      }
    } catch (error) {
      console.error("Error parsing message:", error);
    }
  }
}

// Default states
let currentLoginStatus = true; // Default login status
let currentSelectedOption = "Select"; // Default selected option

// Initialize message queue
const messageQueue = new MessageQueue();

// Handle WebSocket connection events
wss.on("connection", (ws) => {
  console.log("A new client connected");

  // Handle incoming messages
  ws.on("message", (message) => {
    const messageObj = JSON.parse(message.toString());

    // Check if the connected client is an admin app
    if (messageObj.type === "app" && messageObj.appName === "AdminApp") {
      console.log("Admin app connected");

      // Reset test value modes
      currentLoginStatus = true;
      currentSelectedOption = "Select";

      // Broadcast reset state to all clients
      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(
            JSON.stringify({ type: "loginStatus", isEnabled: currentLoginStatus })
          );
          client.send(
            JSON.stringify({ type: "selection", option: currentSelectedOption })
          );
        }
      });
    }

    // Add the message to the queue for further processing
    messageQueue.add(message.toString(), ws);
  });

  // Handle client disconnection
  ws.on("close", () => {
    console.log("Client disconnected");

    // Check if the disconnected client was an admin app
    if (ws.appName === "AdminApp") {
      console.log("Admin app disconnected");

      // Reset test value modes
      currentLoginStatus = true;
      currentSelectedOption = "Select";

      // Broadcast reset state to all remaining clients
      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(
            JSON.stringify({ type: "loginStatus", isEnabled: currentLoginStatus })
          );
          client.send(
            JSON.stringify({ type: "selection", option: currentSelectedOption })
          );
        }
      });
    }
  });

  // Handle WebSocket errors
  ws.on("error", (error) => {
    console.error("WebSocket error:", error);
  });
});

// Define server host and port
const HOST = "192.168.184.48";
const PORT = 8080;

// Start the server
server.listen(PORT, HOST, () => {
  console.log(`Server is listening on ws://${HOST}:${PORT}`);
});
