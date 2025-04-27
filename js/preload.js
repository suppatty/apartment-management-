const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("api", {
    fetchMessages: () => ipcRenderer.invoke("fetchMessages")
});
