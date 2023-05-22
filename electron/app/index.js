const { app } = require('electron');
const Window = require('../window');
const EE = require('../../ee/');
const Log = require('../../log');
const Electron = require('../index');

/**
 * CoreElectronApp (框架封装的electron app对象)
 */
const CoreElectronApp = {

  /**
   * 创建electron应用
   */
  async create() {
    const { CoreApp } = EE;

    const gotTheLock = app.requestSingleInstanceLock();
    if (!gotTheLock) {
      app.quit();
      return;
    }

    app.on('second-instance', (event) => {
      Window.restoreMainWindow();
    })
  
    app.whenReady().then(() => {
      CoreApp.createWindow();
      app.on('activate', () => {
        Window.restoreMainWindow();
      })
    })
    
    app.on('window-all-closed', () => {
      if (process.platform !== 'darwin') {
        Log.coreLogger.info('[ee-core] [lib/eeApp] window-all-closed quit');
        CoreApp.appQuit();
      }
    })

    app.on('before-quit', () => {
      Electron.extra.closeWindow = true;
    })

    if (CoreApp.config.hardGpu.enable == false) {
      app.disableHardwareAcceleration();
    }

    return app;
  },

  /**
   * 退出app
   */
  quit() {
    app.quit();
  }
}

module.exports = CoreElectronApp;
