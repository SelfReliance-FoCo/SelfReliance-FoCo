const { app, BrowserWindow, shell } = require('electron');
const path = require('path');

const { isAllowedExternalUrl } = require('./externalUrl');

const isDev = !app.isPackaged;

function openExternalIfAllowed(url) {
  if (!isAllowedExternalUrl(url)) return;
  Promise.resolve(shell.openExternal(url)).catch(() => {});
}

function isDevNavigation(url) {
  if (!isDev || !process.env.FOCO_DEV_URL) return false;
  try {
    return new URL(url).origin === new URL(process.env.FOCO_DEV_URL).origin;
  } catch {
    return false;
  }
}

function createWindow() {
  const win = new BrowserWindow({
    width: 1100,
    height: 800,
    minWidth: 360,
    minHeight: 640,
    title: 'Self-Reliance FoCo',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
  });

  // Packaged: load Expo web export. Dev: optional localhost.
  if (isDev && process.env.FOCO_DEV_URL) {
    win.loadURL(process.env.FOCO_DEV_URL);
  } else {
    win.loadFile(path.join(__dirname, '..', 'dist-web', 'index.html'));
  }

  win.webContents.setWindowOpenHandler(({ url }) => {
    openExternalIfAllowed(url);
    return { action: 'deny' };
  });

  win.webContents.on('will-navigate', (event, url) => {
    if (isDevNavigation(url)) return;
    event.preventDefault();
    openExternalIfAllowed(url);
  });
}

app.whenReady().then(() => {
  createWindow();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
