const path = require('path');
const { app, BrowserWindow, desktopCapturer, session } = require('electron');
const isDev = require('electron-is-dev');

async function createWindow() {
  // Create the browser window.
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    },
  });

  // session.defaultSession.setDisplayMediaRequestHandler((request, callback) => {
  //   // Allow the tab to capture itself.
  //   callback({ video: request.frame })
  // })

  session.defaultSession.setDisplayMediaRequestHandler((request, callback) => {
    desktopCapturer.getSources({ types: ['window', 'screen'] }).then(async sources => {
      for (const source of sources) {
        if (source.name === 'Entire screen') {
          callback({ video: source })
        }
      }
    })
  })

  // win.webContents.on('will-attach-webview', (event, webPreferences, params) => {
  //   if (params && params.mediaType === 'screen') {
  //     event.preventDefault()

  //     // Implement your custom logic here to decide whether to grant permission
  //     // for entire screen capture or not.
  //     const shouldGrantPermission = true // Your logic here

  //     if (shouldGrantPermission) {
  //       webPreferences.allowDisplayingInsecureContent = true
  //       event.accept()
  //     } else {
  //       event.reject()
  //     }
  //   }
  // })

  // win.loadURL(
  //   isDev
  //     ? 'http://localhost:3000'
  //     : `file://${path.join(__dirname, '../build/index.html')}`
  // );

  await win.loadURL('app://./index.html')

  win.webContents.openDevTools();
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
