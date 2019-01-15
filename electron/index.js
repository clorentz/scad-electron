const { app, BrowserWindow } = require('electron');
let CipherHandler = require("./drive/cipherHandler.js");
let DriveHandler = require("./drive/driveHandler.js")
const path = require('path');
const url = require('url');
var express = require("express");
var expressApp = express(); 
expressApp.use(express.json());

// If modifying these scopes, delete token.json.
// const SCOPES = ['https://www.googleapis.com/auth/drive.metadata.readonly'];
const SCOPES = ['https://www.googleapis.com/auth/drive.file'];
const TOKEN_PATH = './tokens/token.json';

var cipherHandler = new CipherHandler();
var driveHandler = new DriveHandler(SCOPES, TOKEN_PATH);
cipherHandler.setDriveHandler(driveHandler);
driveHandler.setCipherHandler(cipherHandler);

expressApp.post("/upload", (req, res) => {
  console.log(req.body);
  res.json({"res": cipherHandler.encrypt(req.body.filePath)});
});
expressApp.post("/download", (req, res) => {
  console.log(req.body);
  res.json({"res": driveHandler.downloadFile(req.body.fileId)});
});

expressApp.post("/delete", (req, res) => {
  res.json({"res": driveHandler.test()});
});
expressApp.post("/list", (req, res) => {
  driveHandler.listFiles().then(ret => res.json(ret));
});
expressApp.get("/clean", (req, res) => {
  driveHandler.cleanDrive(); 
  res.json({"res": "Drive cleaned"});
});
expressApp.listen(3000);
console.log("Express started");
// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win;

function createWindow() { 
  // const electronScreen = import screen from "electron";
  // const size = electronScreen.getPrimaryDisplay().workAreaSize;

  // // Create the browser window.
  // win = new BrowserWindow({
  //   x: 0,
  //   y: 0,
  //   width: size.width,
  //   height: size.height
  // });

  // Create the browser window.
  win = new BrowserWindow({ width: 800, height: 600 });

  // and load the index.html of the app.
  win.loadURL(
    url.format({
      pathname: path.join(__dirname, 'app', 'index.html'),
      protocol: 'file:',
      slashes: true,
    }),
  );

  // Open the DevTools.
  win.webContents.openDevTools();

  // Emitted when the window is closed.
  win.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null;
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
