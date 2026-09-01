# 🏥 AIML Health Project — Surgical Instrument Safety Monitor

This project is a browser-based AI safety assistant for surgical video review.  
It detects instruments in uploaded surgery videos, tracks what has been seen vs what is currently visible, and raises alerts when previously seen critical tools are no longer detected.

---

## 📌 What this project does

- Uploads a surgery video in the browser
- Runs real-time instrument detection on video frames
- Tracks:
  - total instruments seen during the procedure
  - instruments currently visible
  - instruments that are now missing
- Triggers a **critical safety alert** when missing instruments are marked as critical
- Supports a final safety check workflow before closure

---

## 🧠 Detection approach

The app uses a dual-mode detection pipeline:

1. **Primary model: Roboflow API**
   - Endpoint configured in `js/config.js`
   - Frames are captured from video and posted to the model endpoint
2. **Fallback model: COCO-SSD (TensorFlow.js)**
   - Automatically used if Roboflow connection/init fails
   - Maps generic COCO classes (e.g., `knife`, `scissors`) to surgical types

This gives the app resilience when the hosted model is unavailable.

---

## 🧩 How it works (module-by-module)

### `index.html`
- Defines UI layout:
  - video + detection overlay area
  - live detected instrument panel
  - safety monitor panel
  - stats panel
  - critical alert modal

### `js/main.js`
- Entry point
- Creates `SurgicalSafetyEngine` and initializes it on `DOMContentLoaded`

### `js/engine.js`
- Orchestrates app behavior:
  - initialization and model readiness
  - event listeners for controls
  - video playback lifecycle (start/pause/stop)
  - frame-by-frame detection loop
  - safety checks and alert triggering

### `js/detection.js`
- Handles AI detection services:
  - Roboflow connectivity test
  - Roboflow prediction requests
  - fallback COCO model initialization
  - normalized instrument output format

### `js/tracking.js`
- Maintains tracking state using maps:
  - `allInstrumentsSeen`
  - `currentlyVisible`
  - `missingInstruments`
- Computes stats and identifies critical missing tools

### `js/ui.js`
- Updates all visible UI state:
  - detection cards
  - safety counters
  - FPS and confidence values
  - alert modal open/close behavior

### `js/config.js`
- Centralized configuration/constants:
  - API key and model endpoint
  - frame skip rate
  - class mappings and DOM selectors

### `js/utils.js`
- Helper utilities:
  - frame capture to base64
  - confidence formatting
  - surgical class lookup

### `css/styles.css`
- Full responsive UI styling and alert visual states

---

## 🔄 Runtime workflow

1. User selects a surgery video.
2. Engine enables controls and starts playback.
3. Detection loop runs every Nth frame (`frameSkip`).
4. Detections are normalized and passed to tracker.
5. Tracker updates total/visible/missing sets.
6. UI refreshes panels and stats.
7. If critical tools are missing, alert modal appears.
8. User can run final safety check / verify safe / emergency stop.

---

## 🚀 Setup and run

This is a static frontend project (no backend server in this repo).

### Option 1: Quick start
1. Clone/download the repository.
2. Open `/home/runner/work/AIML-health-project-deployed/AIML-health-project-deployed/index.html` in a modern browser.

### Option 2: Local static server (recommended)
Serve the repository root with any static server, then open `index.html`.

Examples:
- VS Code Live Server
- Python: `python -m http.server`

---

## 🎮 How to use

1. Click **📁 Choose Surgery Video**
2. Click **▶️ Start Analysis**
3. Watch:
   - **Live Surgical Instrument Detection**
   - **Total / Visible / Missing** counters
4. If an alert appears, perform manual verification.
5. Click **✅ Final Safety Check** before completion.

---

## ⚙️ Important configuration

In `js/config.js`:
- `apiKey`: Roboflow API key
- `modelEndpoint`: Roboflow model URL
- `frameSkip`: controls detection frequency/performance

Also defined:
- surgical class metadata (`SURGICAL_MAPPING`)
- COCO fallback mappings (`COCO_MAPPING`)

---

## 📁 Project structure

```text
AIML-health-project-deployed/
├── index.html
├── css/
│   └── styles.css
├── js/
│   ├── main.js
│   ├── engine.js
│   ├── detection.js
│   ├── tracking.js
│   ├── ui.js
│   ├── config.js
│   └── utils.js
├── PROJECT-GUIDE.md
└── SETUP-INSTRUCTIONS.md
```

---

## ⚠️ Notes and limitations

- This tool is an assistive safety layer and should not replace clinical protocol.
- Detection quality depends on video quality, camera angle, and model performance.
- Browser/network conditions affect live inference speed.

---

## 🎥 Sample test video

- https://drive.google.com/file/d/12Zlrzv3TdDnWK5zbJNENP8o3j2OM7R3s/view?usp=drivesdk
