const { contextBridge } = require('electron');

contextBridge.exposeInMainWorld('fermentationLabDesktop', Object.freeze({
  platform: process.platform,
  isDesktop: true,
}));
