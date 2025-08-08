import React from "react";

const PrebuiltFirmwares = ({ 
  firmwares, 
  isFetchingFirmwares, 
  onFetchFirmwares, 
  onDownloadFirmware 
}) => {
  return (
    <div className="space-y-4">
      {/* Help Section */}
      <details className="bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg">
        <summary className="cursor-pointer p-4 font-medium text-gray-800 dark:text-gray-200 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors">
          📋 Help - How to download firmware
        </summary>
        <div className="px-4 pb-4">
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-4 mt-2">
            <p className="text-sm text-blue-800 dark:text-blue-300 mb-2">
              <strong>If you don't have firmware files:</strong>
            </p>
            <ol className="text-sm text-blue-700 dark:text-blue-300 space-y-1 list-decimal list-inside">
              <li>Fetch the latest builds from GitHub Actions below</li>
              <li>Pick the build you want (e.g., latest build on <strong>main branch</strong>)</li>
              <li>Choose the artifact for your watch version (v4 or v5)</li>
              <li>Download and unzip the file</li>
              <li>Upload the <strong>dfu_application.zip</strong> file in the upload section</li>
            </ol>
          </div>
        </div>
      </details>

      {/* Info Notice */}
      <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-lg p-4">
        <div className="flex items-start">
          <span className="text-amber-600 dark:text-amber-400 text-lg mr-3">💡</span>
          <p className="text-sm text-amber-800 dark:text-amber-300">
            Once downloaded, you need to unzip it and upload the <strong>dfu_application.zip</strong> file in the manual upload section below.
          </p>
        </div>
      </div>

      {/* Fetch Button */}
      <button
        onClick={() => onFetchFirmwares(6)}
        className="w-full flex items-center justify-center px-6 py-3 bg-zswatch-secondary text-white rounded-lg hover:bg-blue-600 transition-colors font-medium shadow-md"
      >
        <span className="mr-2">🔄</span>
        Fetch Prebuilt Firmwares from GitHub
      </button>

      {/* Loading/Results */}
      {isFetchingFirmwares ? (
        <div className="text-center py-8">
          <div className="inline-flex items-center justify-center w-8 h-8 bg-zswatch-secondary rounded-full animate-spin mb-2">
            <span className="text-white text-sm">⏳</span>
          </div>
          <p className="text-gray-700 dark:text-gray-300 font-medium">Loading firmwares...</p>
        </div>
      ) : firmwares.length === 0 ? (
        <div className="text-center py-8 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg">
          <span className="text-4xl mb-2 block">📦</span>
          <p className="text-gray-700 dark:text-gray-300 font-medium">No prebuilt firmwares fetched yet</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">Click the button above to fetch the latest builds</p>
        </div>
      ) : (
        <div className="space-y-3">
          {firmwares.map((firmware, index) => (
            <details key={index} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg overflow-hidden">
              <summary className="cursor-pointer p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center justify-between">
                <span className="font-medium text-gray-800 dark:text-gray-200">
                  Branch: <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300 rounded text-sm">{firmware.branch}</span>
                  {" "}by{" "}
                  <span className="px-2 py-1 bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300 rounded text-sm">{firmware.user}</span>
                </span>
                <span className="text-gray-400 dark:text-gray-500 text-sm">▼</span>
              </summary>
              <div className="p-4 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600">
                <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-3">Available Artifacts:</h4>
                <div className="space-y-2">
                  {firmware.artifacts.map((artifact, artifactIndex) => (
                    <button
                      key={artifactIndex}
                      onClick={() => onDownloadFirmware(firmware.runId, artifact.id)}
                      className="w-full flex items-center justify-between p-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-zswatch-primary hover:border-zswatch-primary hover:text-zswatch-darker transition-colors text-left group"
                    >
                      <span className="font-medium text-gray-800 dark:text-gray-200 group-hover:text-zswatch-darker">{artifact.name}</span>
                      <span className="text-sm text-gray-500 dark:text-gray-400 group-hover:text-zswatch-darker flex items-center">
                        <span className="mr-1">📥</span>
                        Download
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </details>
          ))}
        </div>
      )}
    </div>
  );
};

export default PrebuiltFirmwares;
