# Mobile Device Testing Tools

**Website:** [https://mobiledevice.github.io](https://mobiledevice.github.io)

A collection of free, browser-based diagnostic tools to test your phone's hardware features directly in your mobile browser — no apps, no sign-ups, no installations required.

## Overview

This project provides a suite of single-purpose hardware diagnostic tests that run entirely client-side. Each tool checks one specific feature of your device (camera, microphone, sensors, etc.) and gives instant pass/fail feedback.

**Important Notice:**  
The code in this repository is **not free to use** for commercial purposes or redistribution without explicit permission. See the license (or contact the maintainer) for details.

## Available Tools

### Camera Test (`/camera-test`)
- Checks front and rear cameras.
- Detects dead pixels, focus issues, and flash functionality.
- Live preview with test controls.

### Microphone Test (`/mic-test`)
- Records a short audio sample.
- Verifies that the microphone captures sound clearly.

### Speaker Test (`/speaker-test`)
- Plays test tones through device speakers.
- Helps identify rattling, distortion, or dead speaker channels.

### Touch Screen Test (`/swipe-test`)
- Interactive grid for dragging/swiping.
- Reveals unresponsive or dead touch zones.

### Display & Dead Pixel Test (`/display-test`)
- Cycles through solid colors (including black/white).
- Spots dead pixels, burn-in, or backlight bleed.

### Vibration Test (`/vibration-test`)
- Triggers haptic/vibration motor pulses.
- Confirms vibration motor functionality.

### Sensor Test (`/sensor-test`)
- Tests motion sensors (accelerometer, gyroscope).
- Tilt and rotate your device to verify responses.

### Battery Test (`/battery-test`)
- Displays charge level, charging status, and basic battery health info.

### GPS / Location Test (`/gps-test`)
- Requests location and verifies GPS fix accuracy.

### Bluetooth Test (`/bluetooth-test`)
- Scans for nearby Bluetooth devices.
- Confirms Bluetooth radio is operational.

### Network Speed Test (`/network-speed-test`)
- Measures download and upload speeds on Wi-Fi or mobile data.

### Device Detector (`/detector`)
- Identifies device model, browser, and basic hardware information.

## How to Use

1. Open any test page on your mobile device (e.g., `https://mobiledevice.github.io/camera-test`).
2. Grant the required permissions when prompted (camera, mic, location, etc.).
3. Follow on-screen instructions.
4. Get instant results.

All tests are privacy-focused — data never leaves your device.

## Project Structure

- `index.html` — Main landing page with tool overview.
- Individual `*-test.html` files for each diagnostic tool.
- `/css/` — Stylesheets.
- `/js/` — JavaScript for test logic and device APIs.
- `/data/` — Supporting assets.

## License & Usage Rights

The code is **not free to use**. This repository and its contents are provided for the hosted service at mobiledevice.github.io. Unauthorized copying, modification, or commercial use is prohibited. For licensing inquiries, please refer to the repository or contact the maintainer.

## Contributing

Contributions are welcome for bug fixes or improvements to existing tests. Please open an issue or PR on the [GitHub repository](https://github.com/mobiledevice/mobiledevice.github.io).

---

**Made for quick hardware checks on any modern mobile browser.**
