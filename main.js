// Modules to control application life and create native browser window
const { app, BrowserWindow } = require("electron");
const { ipcMain } = require("electron");
const { spawn } = require("child_process");
const path = require("node:path");

ipcMain.on("send-command", async (event, arg) => {
  console.log("Command received v0.1.2: ", arg);
  // Handle your command here
  const printWindow = new BrowserWindow({ show: false });
  printWindow.loadURL(
    `data:text/html;charset=utf-8,<html>
    <style>
      * {
        font-size: 12px;
        font-family: Arial, sans-serif;
        max-width: 320px;
      }
    </style>
    <body>
    <center>
      <div style="margin: 20px">
        <h1 style="margin: 0px">Restaurant Name</h1>
        <address>
          <div>123th Ave, City, State 12345</div>
          <div>Phone: 123-456-7890</div>
        </address>
      </div>
      <div style="margin: 20px">
        <div style="font-size: 20px;">Order: T12/12345</div>
        <div>${new Date().toLocaleString()}</div>
      </div>
      <div style="display: flex; justify-content: space-between; margin: 20px ">
        <span>${arg.name} x ${arg.number}</span>
        <span>${arg.price * arg.number}</span>
      </div>
      <div style="display: flex; justify-content: space-between; margin: 20px ">
        <span>Visa 1234</span>
        <span>Sale</span>
      </div>
      <div style="display: flex; justify-content: space-between">
        <span>Subtotal</span>
        <span>$${arg.price * arg.number}</span>
      </div>
      <div style="display: flex; justify-content: space-between ">
        <span>Tax</span>
        <span>$${(arg.price * 0.8).toFixed(2)}</span>
      </div>
      <div style="display: flex; justify-content: space-between ">
        <span>Total</span>
        <span>$${arg.price * arg.number + arg.price * 0.8}</span>
      </div>
      <div style="display: flex; justify-content: space-between; margin: 40px">
        <span>Tip</span>
        <span style="border-bottom: 1px solid black; width: 100px"></span>
      </div>
     <div style="display: flex; justify-content: space-between; margin: 40px">
        <span>x</span>
        <span style="border-bottom: 1px solid black; width: 100px"></span>
      </div>
      <div>Merchandise Copy</div>
      <div>Thanks for visiting our restaurant!</div>
    </div>
    </center></body></html>`
  );
  printWindow.webContents.on("did-finish-load", () => {
    console.log("did-finish-load");
    const options = {
      silent: true, // Enable silent printing
      printBackground: true,
    };
    printWindow.webContents.print(options, (success, errorType) => {
      if (!success) {
        console.error("Print failed:", errorType);
      } else {
        console.log("Print initiated successfully");
      }
      printWindow.close(); // Close the window after printing
    });
  });
  printWindow.webContents.on(
    "did-fail-load",
    (event, errorCode, errorDescription) => {
      console.error("Failed to load:", errorDescription);
      printWindow.close(); // Close the window if it fails
    }
  );
});

app.disableHardwareAcceleration();

function startServer() {
  return new Promise((resolve, reject) => {
    const serverProcess = spawn(
      "npx",
      ["serve", "frontend/out", "-p", "8000"],
      {
        stdio: "pipe",
        shell: true,
      }
    );

    serverProcess.stdout.on("data", (data) => {
      console.log(`Server output: ${data}`);
      if (data.includes("Accepting connections at")) {
        resolve(serverProcess);
      }
    });

    // serverProcess.stderr.on("data", (data) => {
    //   console.error(`Server error: ${data}`);
    // });

    // serverProcess.on("error", (err) => {
    //   console.error("Failed to start server:", err);
    //   reject(err);
    // });

    // serverProcess.on("close", (code) => {
    //   if (code !== 0) {
    //     console.error(`Server process exited with code ${code}`);
    //     reject(new Error(`Server process exited with code ${code}`));
    //   }
    // });
  });
}

async function createWindow() {
  const isDev = (await import("electron-is-dev")).default;
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  // and load the index.html of the app.
  if (isDev) {
    // During development, load the React/Next.js dev server (localhost)
    // mainWindow.loadURL("http://localhost:3000");
    mainWindow.loadURL("http://localhost:3000");
  } else {
    // In production, load the static files from the "build" or "out" folder
    mainWindow.loadURL("http://localhost:8000");
    // For Next.js static export, replace 'build' with 'out'
  }

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(async () => {
  try {
    await startServer();
    createWindow();
  } catch (err) {
    console.error("Error starting application:", err);
    app.quit();
  }

  app.on("activate", function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", function () {
  if (process.platform !== "darwin") app.quit();
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
