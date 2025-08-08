import React from "react";
import { formatFileSize, copyToClipboard } from "../utils/helpers";

const FileUploadSection = ({
  fileInputRef,
  fileStatus,
  fileUploadPercentage,
  fileUploadSpeed,
  fileInfos,
  isFileUploadInProgress,
  onFileChange,
  onFileUpload,
  onEraseFiles,
  onConfirmFiles,
  onClearFiles,
}) => {
  return (
    <div className="space-y-3">
      {/* File Input */}
      <div>
        <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
          Select Firmware File
        </label>
        <input
          type="file"
          className="block w-full text-xs text-gray-500 dark:text-gray-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-medium file:bg-zswatch-secondary file:text-white hover:file:bg-blue-600 file:transition-colors"
          id="file-image"
          onChange={onFileChange}
          disabled={isFileUploadInProgress}
          ref={fileInputRef}
          accept=".zip,.bin"
        />
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
          Accepted formats: .zip (containing firmware) or .bin files
        </p>
      </div>

      {/* Upload Status */}
      {fileStatus && (
        <div className={`p-2.5 rounded-lg ${
          fileStatus.includes('Upload complete') ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700' :
          fileStatus.includes('Failed') ? 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700' :
          'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700'
        }`}>
          <div className="flex items-center">
            <span className="mr-2">
              {fileStatus.includes('Upload complete') ? '✅' :
               fileStatus.includes('Failed') ? '❌' : 
               '📤'}
            </span>
            <span className={`text-xs font-medium ${
              fileStatus.includes('Upload complete') ? 'text-green-800 dark:text-green-300' :
              fileStatus.includes('Failed') ? 'text-red-800 dark:text-red-300' :
              'text-blue-800 dark:text-blue-300'
            }`}>
              {fileStatus}
            </span>
          </div>
          
          {/* Progress Bar */}
          {fileUploadPercentage !== null && (
            <div className="mt-1.5">
              <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-1.5">
                <div 
                  className="bg-zswatch-secondary h-1.5 rounded-full transition-all duration-300" 
                  style={{width: `${fileUploadPercentage}%`}}
                ></div>
              </div>
              <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 mt-0.5">
                <span>{fileUploadPercentage}%</span>
                {fileUploadSpeed && <span>{fileUploadSpeed} KB/s</span>}
              </div>
            </div>
          )}
        </div>
      )}

      {/* File Information Cards */}
      {fileInfos && fileInfos.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {fileInfos.map((fileInfo, index) => (
            <div key={index} className="bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-gray-800 dark:text-gray-200 text-sm">{fileInfo.name}</h4>
                <div className="flex items-center">
                  {fileInfo.isUploaded && <span className="text-green-500 text-xs">✅ Uploaded</span>}
                  {fileInfo.isUploading && <span className="text-blue-500 text-xs">⏳ Uploading</span>}
                </div>
              </div>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Image:</span>
                  <span className="font-medium text-gray-800 dark:text-gray-200">{fileInfo.imageNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Version:</span>
                  <span className="font-medium text-gray-800 dark:text-gray-200">{fileInfo.version}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Size:</span>
                  <span className="font-medium text-gray-800 dark:text-gray-200">{formatFileSize(fileInfo.fileSize)}</span>
                </div>
                {fileInfo.hash && (
                  <div className="mt-1">
                    <span className="text-gray-600 dark:text-gray-400 text-xs">Hash:</span>
                    <div 
                      className="font-mono text-xs bg-white dark:bg-gray-800 p-1.5 rounded border dark:border-gray-600 break-all cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200"
                      title="Click to copy hash"
                      onClick={() => copyToClipboard(fileInfo.hash, "Hash copied to clipboard!")}
                    >
                      {fileInfo.hash}
                    </div>
                  </div>
                )}
                
                {/* Upload Progress for Individual Files */}
                {fileInfo.isUploading && (
                  <div className="mt-1">
                    <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-1.5">
                      <div 
                        className="bg-green-500 h-1.5 rounded-full transition-all duration-300" 
                        style={{width: `${fileUploadPercentage}%`}}
                      ></div>
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">
                      {fileUploadPercentage}% {fileUploadSpeed && `(${fileUploadSpeed} KB/s)`}
                    </div>
                  </div>
                )}
                
                {fileInfo.isUploaded && fileInfo.mcuMgrImageStatus && (
                  <div className="mt-1 text-xs text-green-700 dark:text-green-300 bg-green-50 dark:bg-green-900/20 p-1.5 rounded">
                    {fileInfo.mcuMgrImageStatus}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={onFileUpload}
          disabled={!fileInfos || fileInfos.length === 0 || isFileUploadInProgress}
          className={`flex items-center px-4 py-2 rounded-lg font-medium transition-all text-sm ${
            fileInfos && fileInfos.length > 0 && !isFileUploadInProgress
              ? 'bg-zswatch-primary text-zswatch-darker hover:bg-orange-300 shadow-md'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          <span className="mr-1">⬆️</span>
          {isFileUploadInProgress ? 'Uploading...' : 'Upload Firmware'}
        </button>
        
        <button
          onClick={onEraseFiles}
          className="flex items-center px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium text-sm"
        >
          <span className="mr-1">🗑️</span>
          Erase Files
        </button>
        
        <button
          onClick={onConfirmFiles}
          className="flex items-center px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium text-sm"
        >
          <span className="mr-1">✅</span>
          Confirm Files
        </button>
        
        {fileInfos && fileInfos.length > 0 && (
          <button
            onClick={onClearFiles}
            className="flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm"
          >
            <span className="mr-1">🔄</span>
            Clear Files
          </button>
        )}
      </div>
    </div>
  );
};

export default FileUploadSection;
