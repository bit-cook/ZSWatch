export const imageNameMapping = {
  0: "App Internal",
  1: "Net Core", 
  2: "App External (XIP)",
};

export const binaryFileNameToImageId = {
  "app.internal.bin": 0,
  "ipc_radio.bin": 1,
  "app.external.bin": 2,
};

export const GITHUB_CONFIG = {
  owner: "ZSWatch",
  repo: "ZSWatch", 
  token: process.env.REACT_APP_GITHUB_TOKEN || ""
};

export const SCREENS = {
  INITIAL: "initial",
  CONNECTING: "connecting", 
  CONNECTED: "connected",
  CONNECTED_ADVANCED: "connected_advanced"
};
