# FirmwareUpdate Component Refactoring

This directory contains the refactored firmware update functionality, previously contained in a single 1300+ line file.

## Structure

```
src/components/FirmwareUpdate/
├── FirmwareUpdateApp.js          # Main component that orchestrates everything
├── index.js                      # Export file for easy importing
├── mcumgr.css                    # CSS styles for MCU manager components
├── constants.js                  # All constants and configuration
├── components/                   # UI components
│   ├── BluetoothConnect.js       # Connection interface
│   ├── ConnectingScreen.js       # Loading state component
│   ├── DeviceControls.js         # Device action buttons
│   ├── PrebuiltFirmwares.js      # GitHub artifacts fetching
│   ├── FileUploadSection.js      # Firmware file upload UI
│   └── FileSystemUpload.js       # Filesystem upload UI
├── hooks/                        # Custom React hooks for business logic
│   ├── useMCUManager.js          # MCU Manager connection & state
│   ├── useFileUpload.js          # File upload logic
│   ├── useFileSystemUpload.js    # Filesystem upload logic
│   └── useFirmwareManagement.js  # GitHub firmware fetching
└── utils/                        # Utility functions
    ├── helpers.js                # Generic helper functions
    └── githubApi.js              # GitHub API interactions
```

## Benefits of This Refactoring

### 1. **Separation of Concerns**
- **UI Components**: Focus only on rendering and user interaction
- **Custom Hooks**: Handle all business logic and state management
- **Utils**: Pure functions for data processing and API calls
- **Constants**: Centralized configuration

### 2. **Improved Maintainability**
- Each file has a single, clear responsibility
- Easier to find and fix bugs
- Simpler to add new features
- Better code organization

### 3. **Reusability**
- Components can be easily reused in other parts of the application
- Hooks can be shared between components
- Utils can be imported wherever needed

### 4. **Testing**
- Individual components can be tested in isolation
- Business logic in hooks can be unit tested
- Utils are pure functions, easy to test

### 5. **Developer Experience**
- Smaller files are easier to navigate
- Clear file names make it obvious where to look for specific functionality
- Reduced cognitive load when working on specific features

## Key Custom Hooks

### `useMCUManager`
Manages the MCU Manager instance, connection state, and device communication.

### `useFileUpload`
Handles firmware file processing, upload progress, and file state management.

### `useFileSystemUpload`
Manages filesystem image upload functionality.

### `useFirmwareManagement`
Handles fetching prebuilt firmwares from GitHub Actions.

## Components

### `BluetoothConnect`
Initial connection interface with device selection and compatibility checks.

### `FileUploadSection`
Complete firmware upload interface with progress tracking and file info display.

### `PrebuiltFirmwares`
Interface for browsing and downloading prebuilt firmware from GitHub.

## Usage

```javascript
import FirmwareUpdateApp from '../components/FirmwareUpdate';

// Use in a page component
export default function UpdatePage() {
  return <FirmwareUpdateApp />;
}
```

The refactored component maintains 100% compatibility with the original functionality while providing a much better developer experience and foundation for future enhancements.
