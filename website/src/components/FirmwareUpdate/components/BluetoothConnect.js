import React from "react";

const BluetoothConnect = ({ 
  bluetoothAvailable, 
  deviceName, 
  onDeviceNameChange, 
  onConnect,
  onPreviewDemo 
}) => {
  return (
    <div className="space-y-4">
      {/* Bluetooth Status */}
      <div className={`p-3 rounded-lg border ${
        bluetoothAvailable 
          ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' 
          : 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800'
      }`}>
        <div className="flex items-center mb-1">
          <span className="text-lg mr-2">
            {bluetoothAvailable ? '✅' : '⚠️'}
          </span>
          <h3 className="font-medium text-gray-800 dark:text-gray-200 text-sm">
            Bluetooth {bluetoothAvailable ? 'Available' : 'Compatibility Warning'}
          </h3>
        </div>
        <p className={`text-xs ${
          bluetoothAvailable ? 'text-green-700 dark:text-green-300' : 'text-yellow-700 dark:text-yellow-300'
        }`}>
          {bluetoothAvailable
            ? "Your browser supports Web Bluetooth. You can connect to your ZSWatch."
            : `This tool requires a compatible browser with Web Bluetooth support. 
               Please use Chrome, Edge, or Opera on desktop/laptop, Chrome on Android, 
               or Bluefy on iOS/iPadOS.`}
        </p>
      </div>

      {/* Connection Interface */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
        <h3 className="text-base font-medium text-gray-800 dark:text-gray-200 mb-3">Connect to ZSWatch</h3>
        
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
              Device Name (optional)
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-zswatch-secondary focus:border-transparent outline-none transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm"
              placeholder="ZSWatch"
              value={deviceName}
              onChange={(e) => onDeviceNameChange(e.target.value)}
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              Leave empty to scan for any compatible device
            </p>
          </div>

          <button
            onClick={onConnect}
            disabled={!bluetoothAvailable}
            className={`w-full flex items-center justify-center px-4 py-2 rounded-lg font-medium transition-all text-sm ${
              bluetoothAvailable
                ? 'bg-zswatch-secondary hover:bg-blue-600 text-white shadow-md hover:shadow-lg'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            <span className="mr-1">📱</span>
            {bluetoothAvailable ? 'Connect to ZSWatch' : 'Bluetooth Not Available'}
          </button>

          {/* Demo Mode Button */}
          <button
            onClick={onPreviewDemo}
            className="w-full flex items-center justify-center px-4 py-2 rounded-lg font-medium bg-zswatch-primary text-zswatch-darker hover:bg-orange-300 transition-all border-2 border-zswatch-primary text-sm"
          >
            <span className="mr-1">👁️</span>
            Preview Connected Interface (Demo)
          </button>
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
        <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-1 text-sm">Connection Instructions</h4>
        <ol className="text-xs text-gray-600 dark:text-gray-400 space-y-0.5 list-decimal list-inside">
          <li>Make sure your ZSWatch is powered on and has Bluetooth enabled</li>
          <li>Click the "Connect to ZSWatch" button above</li>
          <li>Select your ZSWatch from the browser's device list</li>
          <li>Wait for the connection to establish</li>
        </ol>
      </div>
    </div>
  );
};

export default BluetoothConnect;
