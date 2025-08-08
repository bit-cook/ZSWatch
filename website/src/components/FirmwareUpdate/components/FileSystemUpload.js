import React from "react";

const FileSystemUpload = ({
  fileFsInputRef,
  fileSystemUploadStatus,
  fileSystemUploadProgress,
  onFileSystemUpload,
}) => {
  return (
    <div className="space-y-3">
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-3">
        <div className="flex items-start">
          <span className="text-blue-500 dark:text-blue-400 text-base mr-2">💡</span>
          <div>
            <h4 className="font-medium text-blue-800 dark:text-blue-300 mb-1 text-sm">How to upload filesystem:</h4>
            <p className="text-xs text-blue-700 dark:text-blue-300">
              Select the <strong>lvgl_resources_raw.bin</strong> file found in the previously downloaded zip file.
            </p>
          </div>
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
          Select Filesystem File
        </label>
        <input
          type="file"
          ref={fileFsInputRef}
          onChange={onFileSystemUpload}
          className="block w-full text-xs text-gray-500 dark:text-gray-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-medium file:bg-zswatch-dark file:text-white hover:file:bg-gray-700 file:transition-colors"
          accept=".bin"
        />
      </div>

      {/* Status Display */}
      <div className={`p-2.5 rounded-lg ${
        fileSystemUploadStatus.includes('Upload complete') ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700' :
        fileSystemUploadStatus.includes('failed') ? 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700' :
        'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700'
      }`}>
        <div className="flex items-center">
          <span className="mr-2">
            {fileSystemUploadStatus.includes('Upload complete') ? '✅' :
             fileSystemUploadStatus.includes('failed') ? '❌' : 
             '💾'}
          </span>
          <span className={`text-xs font-medium ${
            fileSystemUploadStatus.includes('Upload complete') ? 'text-green-800 dark:text-green-300' :
            fileSystemUploadStatus.includes('failed') ? 'text-red-800 dark:text-red-300' :
            'text-blue-800 dark:text-blue-300'
          }`}>
            Status: {fileSystemUploadStatus}
          </span>
        </div>
        
        {fileSystemUploadProgress !== null && (
          <div className="mt-1.5">
            <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-1.5">
              <div 
                className="bg-zswatch-dark h-1.5 rounded-full transition-all duration-300" 
                style={{width: `${fileSystemUploadProgress}%`}}
              ></div>
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">
              Progress: {fileSystemUploadProgress}%
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileSystemUpload;
