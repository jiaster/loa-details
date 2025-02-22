import { MessageApi } from "app/types";
import { contextBridge, IgnoreMouseEventsOptions, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("messageApi", {
  send: (channel, data) => {
    const validChannels = ["window-to-main"];

    if (validChannels.includes(channel)) {
      ipcRenderer.send(channel, data);
    }
  },
  receive: (channel, func) => {
    const validChannels = [
      "updater-message",
      "pcap-on-message",
      "pcap-on-state-change",
      "pcap-on-reset-state",
      "on-settings-change",
      "parsed-logs-list",
      "parsed-log",
      "log-parser-status",
      "on-restore-from-taskbar",
      "shortcut-action",
      "selected-log-path-folder",
      "uploader-message",
    ];

    if (validChannels.includes(channel)) {
      // Deliberately strip event as it includes `sender`
      ipcRenderer.on(channel, (event, args) => func(args));
    }
  },
} as MessageApi);

contextBridge.exposeInMainWorld("windowControlApi", {
  minimize: () => ipcRenderer.send("minimize"),
  toggleMaximize: () => ipcRenderer.send("toggleMaximize"),
  close: () => ipcRenderer.send("close"),
  hide: () => ipcRenderer.send("hide"),
  setIgnoreMouseEvents: (ignore: boolean, options: IgnoreMouseEventsOptions) =>
    ipcRenderer.send("toggleMaximize", ignore, options),
});
