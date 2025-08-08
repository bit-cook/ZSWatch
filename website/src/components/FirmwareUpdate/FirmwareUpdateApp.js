import React, { useEffect } from "react";
import Layout from "@theme/Layout";
import "./mcumgr.css";

// Components
import BluetoothConnect from "./components/BluetoothConnect";
import ConnectingScreen from "./components/ConnectingScreen"; 
import DeviceControls from "./components/DeviceControls";
import PrebuiltFirmwares from "./components/PrebuiltFirmwares";
import FileUploadSection from "./components/FileUploadSection";
import FileSystemUpload from "./components/FileSystemUpload";

// Hooks
import { useMCUManager } from "./hooks/useMCUManager";
import { useFileUpload } from "./hooks/useFileUpload";
import { useFileSystemUpload } from "./hooks/useFileSystemUpload";
import { useFirmwareManagement } from "./hooks/useFirmwareManagement";

// Constants
import { SCREENS } from "./constants";

const FirmwareUpdateApp = () => {
  const {
    mcumgr,
    deviceName,
    screen,
    images,
    bluetoothAvailable,
    setScreen,
    handleDeviceNameChange,
    handleConnect,
    handleDisconnect,
  } = useMCUManager();

  const {
    fileUploadPercentage,
    fileUploadSpeed,
    isFileUploadInProgress,
    fileInfos,
    fileStatus,
    fileInputRef,
    handleFileChange,
    handleFileUpload,
    clearFiles,
    setupUploadListeners,
    setFileInfos,
  } = useFileUpload(mcumgr);

  const {
    fileSystemUploadProgress,
    fileSystemUploadStatus,
    fileFsInputRef,
    handleFileSystemUpload,
    setupFileSystemListeners,
  } = useFileSystemUpload(mcumgr);

  const {
    firmwares,
    isFetchingFirmwares,
    fetchAndSetFirmwares,
    downloadAndFlashFirmware,
  } = useFirmwareManagement();

  // Setup listeners when component mounts
  useEffect(() => {
    setupUploadListeners();
    setupFileSystemListeners();
  }, [setupUploadListeners, setupFileSystemListeners]);

  // Update file infos when images change from MCU Manager
  useEffect(() => {
    if (!images) return;
    
    fileInfos.forEach((fileInfo) => {
      const matchingImage = images.find(
        (image) =>
          image.image === fileInfo.imageNumber &&
          image.hash && fileInfo.hash && 
          Array.from(image.hash).map(byte => byte.toString(16).padStart(2, '0')).join('') === fileInfo.hash,
      );
      if (matchingImage) {
        setFileInfos((prevFileInfos) =>
          prevFileInfos.map((file) =>
            file === fileInfo
              ? {
                  ...file,
                  isUploaded: false,
                  mcuMgrImageStatus: `Active: ${matchingImage.active}, Pending: ${matchingImage.pending}, Slot: ${matchingImage.slot}`,
                }
              : file,
          ),
        );
      }
    });
  }, [images, fileInfos, setFileInfos]);

  const handleEchoTest = () => {
    const message = prompt("Enter a text message to send", "Hello World!");
    if (message) {
      mcumgr.smpEcho(message);
    }
  };

  const handleReset = () => {
    mcumgr.cmdReset();
  };

  const handleAdvancedMode = () => {
    setScreen(SCREENS.CONNECTED_ADVANCED);
  };

  const handlePreviewDemo = () => {
    setScreen(SCREENS.CONNECTED);
  };

  const renderScreen = () => {
    switch (screen) {
      case SCREENS.INITIAL:
        return (
          <BluetoothConnect
            bluetoothAvailable={bluetoothAvailable}
            deviceName={deviceName}
            onDeviceNameChange={handleDeviceNameChange}
            onConnect={handleConnect}
            onPreviewDemo={handlePreviewDemo}
          />
        );
      case SCREENS.CONNECTING:
        return <ConnectingScreen />;
      case SCREENS.CONNECTED:
        return renderConnectedImageManagement();
      case SCREENS.CONNECTED_ADVANCED:
        return renderAdvancedConnectedImageManagement();
      default:
        return null;
    }
  };

  const renderConnectedImageManagement = () => {
    return (
      <div className="space-y-6">
        {/* Device Controls */}
        <DeviceControls
          onEchoTest={handleEchoTest}
          onDisconnect={handleDisconnect}
          onReset={handleReset}
          onAdvancedMode={handleAdvancedMode}
        />
        
        {/* Prebuilt Firmwares Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center mb-3">
            <div className="w-6 h-6 bg-zswatch-secondary rounded-lg flex items-center justify-center mr-2">
              <span className="text-white text-xs">🏗️</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Prebuilt Firmwares</h3>
          </div>
          <p className="text-gray-600 dark:text-gray-400 mb-3 text-sm">
            Download the latest firmware builds directly from GitHub Actions
          </p>
          <PrebuiltFirmwares
            firmwares={firmwares}
            isFetchingFirmwares={isFetchingFirmwares}
            onFetchFirmwares={fetchAndSetFirmwares}
            onDownloadFirmware={(runId, artifactId) => downloadAndFlashFirmware(runId, artifactId)}
          />
        </div>

        {/* Manual Upload Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center mb-3">
            <div className="w-6 h-6 bg-zswatch-primary rounded-lg flex items-center justify-center mr-2">
              <span className="text-zswatch-darker text-xs">📁</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Manual Firmware Upload</h3>
          </div>
          
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-3 mb-4">
            <div className="flex items-start">
              <span className="text-blue-500 dark:text-blue-400 text-base mr-2">💡</span>
              <div>
                <h4 className="font-medium text-blue-800 dark:text-blue-300 mb-1 text-sm">How to upload firmware:</h4>
                <ol className="text-xs text-blue-700 dark:text-blue-300 space-y-0.5 list-decimal list-inside">
                  <li>Download the <strong>dfu_application.zip</strong> file</li>
                  <li>Select the file using the upload button below</li>
                  <li>Click <strong>Upload</strong> to start the firmware update</li>
                </ol>
              </div>
            </div>
          </div>
          
          <FileUploadSection
            fileInputRef={fileInputRef}
            fileStatus={fileStatus}
            fileUploadPercentage={fileUploadPercentage}
            fileUploadSpeed={fileUploadSpeed}
            fileInfos={fileInfos}
            isFileUploadInProgress={isFileUploadInProgress}
            onFileChange={handleFileChange}
            onFileUpload={handleFileUpload}
            onEraseFiles={() => mcumgr.cmdImageErase()}
            onConfirmFiles={() => mcumgr.cmdImageConfirm()}
            onClearFiles={clearFiles}
          />
          
          {/* Troubleshooting */}
          <details className="mt-4">
            <summary className="cursor-pointer text-gray-700 dark:text-gray-300 font-medium hover:text-gray-900 dark:hover:text-gray-100 text-sm">
              🛠️ Troubleshooting
            </summary>
            <div className="mt-2 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg">
              <p className="text-xs text-yellow-800 dark:text-yellow-300">
                <strong>Upload issues?</strong> If the upload hangs or doesn't start, try resetting the watch first. 
                If the watch firmware isn't working properly, you may need to use the <strong>mcumgr over USB</strong> method instead.
              </p>
            </div>
          </details>
        </div>

        {/* File System Upload */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center mb-3">
            <div className="w-6 h-6 bg-zswatch-dark rounded-lg flex items-center justify-center mr-2">
              <span className="text-white text-xs">💾</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">File System Upload</h3>
          </div>
          <FileSystemUpload
            fileFsInputRef={fileFsInputRef}
            fileSystemUploadStatus={fileSystemUploadStatus}
            fileSystemUploadProgress={fileSystemUploadProgress}
            onFileSystemUpload={handleFileSystemUpload}
          />
        </div>
      </div>
    );
  };

  const renderAdvancedConnectedImageManagement = () => {
    // This would be the advanced view - for now we'll keep it simple
    // and just show a basic version. You can expand this later.
    return (
      <div className="space-y-4">
        <DeviceControls
          onEchoTest={handleEchoTest}
          onDisconnect={handleDisconnect}
          onReset={handleReset}
          onAdvancedMode={() => setScreen(SCREENS.CONNECTED)}
        />
        <div className="text-center py-8">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">Advanced Mode</h3>
          <p className="text-gray-600 dark:text-gray-400">Advanced features coming soon...</p>
          <button
            onClick={() => setScreen(SCREENS.CONNECTED)}
            className="mt-4 px-4 py-2 bg-zswatch-secondary text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Back to Simple Mode
          </button>
        </div>
      </div>
    );
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-2 text-gray-900 dark:text-gray-100">
              ZSWatch Firmware Update
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Update your ZSWatch firmware wirelessly over Bluetooth Low Energy
            </p>
          </div>

          {/* Connection Status Card */}
          <div className="max-w-4xl mx-auto mb-8">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-zswatch-darker dark:text-gray-200 flex items-center">
                  <span className={`w-3 h-3 rounded-full mr-3 ${
                    screen === SCREENS.CONNECTED ? 'bg-green-500' : 
                    screen === SCREENS.CONNECTING ? 'bg-yellow-500 animate-pulse' : 
                    'bg-gray-400'
                  }`}></span>
                  Connection Status
                </h2>
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                  screen === SCREENS.CONNECTED ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300' :
                  screen === SCREENS.CONNECTING ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300' :
                  'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300'
                }`}>
                  {screen === SCREENS.CONNECTED ? `Connected to ${deviceName}` :
                   screen === SCREENS.CONNECTING ? 'Connecting...' :
                   'Disconnected'}
                </div>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                {renderScreen()}
              </div>
            </div>
          </div>

          {/* Information Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {/* Browser Compatibility */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-zswatch-secondary rounded-lg flex items-center justify-center mr-3">
                  <span className="text-white text-lg">🌐</span>
                </div>
                <h3 className="font-semibold text-gray-800 dark:text-gray-200">Browser Support</h3>
              </div>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  Chrome, Edge, Opera (Desktop)
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  Chrome (Android)
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></span>
                  Bluefy (iOS/iPadOS)
                </li>
              </ul>
            </div>

            {/* Update Process */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-zswatch-primary rounded-lg flex items-center justify-center mr-3">
                  <span className="text-zswatch-darker text-lg">⚡</span>
                </div>
                <h3 className="font-semibold text-gray-800 dark:text-gray-200">Update Process</h3>
              </div>
              <div className="space-y-3">
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <span className="w-6 h-6 bg-zswatch-secondary text-white rounded-full flex items-center justify-center mr-3 text-xs">1</span>
                  Connect to ZSWatch
                </div>
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <span className="w-6 h-6 bg-zswatch-secondary text-white rounded-full flex items-center justify-center mr-3 text-xs">2</span>
                  Select firmware file
                </div>
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <span className="w-6 h-6 bg-zswatch-secondary text-white rounded-full flex items-center justify-center mr-3 text-xs">3</span>
                  Upload and install
                </div>
              </div>
            </div>

            {/* Features */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-zswatch-dark rounded-lg flex items-center justify-center mr-3">
                  <span className="text-white text-lg">🔧</span>
                </div>
                <h3 className="font-semibold text-gray-800 dark:text-gray-200">Features</h3>
              </div>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-zswatch-primary rounded-full mr-2"></span>
                  Wireless updates via BLE
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-zswatch-primary rounded-full mr-2"></span>
                  Progress monitoring
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-zswatch-primary rounded-full mr-2"></span>
                  Automatic firmware detection
                </li>
              </ul>
            </div>
          </div>

          {/* Requirements Notice */}
          <div className="max-w-4xl mx-auto mt-8">
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <span className="text-blue-500 dark:text-blue-400 text-xl">ℹ️</span>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-blue-800 dark:text-blue-300">Requirements</h3>
                  <p className="mt-1 text-sm text-blue-700 dark:text-blue-300">
                    This tool requires a compatible browser with Web Bluetooth support and a working Bluetooth connection. 
                    Make sure your ZSWatch is powered on and within range.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default FirmwareUpdateApp;
