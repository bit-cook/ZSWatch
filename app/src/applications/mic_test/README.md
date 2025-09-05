# Microphone Test Application

1. Open the "Mic Test" application from the app menu
2. Press "Start" button to begin microphone recording
3. Press "Stop" after some time
4. The python script will for each start/stop sequence store the wav file.

## Analysis
Use the Python script `app/scripts/mic_analyze.py` to capture and analyze the UART output:

```bash
cd app/scripts
python mic_analyze.py
```

The script will save both raw PCM data and converted WAV files with timestamps.
After a recording it will also try to play the recorder sound using `aplay`.
