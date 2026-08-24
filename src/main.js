const { app, BrowserWindow, dialog, ipcMain, clipboard } = require('electron');
const fs = require('node:fs/promises');
const path = require('node:path');

// O painel administrativo não precisa de GPU; isso melhora a abertura em PCs de produção antigos.
app.disableHardwareAcceleration();

function createWindow() {
  const window = new BrowserWindow({
    width: 1440,
    height: 920,
    minWidth: 1100,
    minHeight: 720,
    backgroundColor: '#07111f',
    webPreferences: { preload: path.join(__dirname, 'preload.js'), contextIsolation: true, sandbox: true }
  });
  window.loadFile(path.join(__dirname, 'renderer', 'index.html'));
}

app.whenReady().then(() => {
  ipcMain.handle('select-file', async (_, filters) => {
    const result = await dialog.showOpenDialog({ properties: ['openFile'], filters });
    return result.canceled ? null : result.filePaths[0];
  });

  ipcMain.handle('read-text-file', async (_, filePath) => fs.readFile(filePath, 'utf8'));
  ipcMain.handle('copy-text', (_, value) => clipboard.writeText(value));

  ipcMain.handle('export-overlay', async (_, payload) => {
    const destination = await dialog.showOpenDialog({ title: 'Escolha a pasta de destino', properties: ['openDirectory', 'createDirectory'] });
    if (destination.canceled) return { canceled: true };
    const folder = path.join(destination.filePaths[0], `Tela-Apoiadores-${safeFileName(payload.title || 'Esquadrao-Nerdola')}`);
    await fs.mkdir(folder, { recursive: true });
    const template = path.join(__dirname, 'overlay');
    for (const file of ['styles.css', 'overlay.js']) {
      await fs.copyFile(path.join(template, file), path.join(folder, file));
    }
    const { audioPath, ...settingsPayload } = payload;
    const settings = { ...settingsPayload, audioFile: null };
    if (payload.audioPath) {
      const extension = path.extname(payload.audioPath).toLowerCase() || '.mp3';
      const audioFile = `musica${extension}`;
      await fs.copyFile(payload.audioPath, path.join(folder, audioFile));
      settings.audioFile = audioFile;
    }
    const indexTemplate = await fs.readFile(path.join(template, 'index.html'), 'utf8');
    const inlineData = JSON.stringify(settings).replace(/</g, '\\u003c');
    await fs.writeFile(path.join(folder, 'index.html'), indexTemplate.replace('<!--OVERLAY_DATA-->', inlineData), 'utf8');
    await fs.writeFile(path.join(folder, 'dados.json'), JSON.stringify(settings, null, 2), 'utf8');
    return { canceled: false, folder, indexPath: path.join(folder, 'index.html') };
  });
  createWindow();
  app.on('activate', () => { if (BrowserWindow.getAllWindows().length === 0) createWindow(); });
});

app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit(); });

function safeFileName(value) {
  return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9_-]+/gi, '-').replace(/^-+|-+$/g, '').slice(0, 60) || 'Apoiadores';
}
