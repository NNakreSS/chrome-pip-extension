# Video Pop-out Player (Smart Picture-in-Picture)

A sleek, lightweight browser extension that brings Opera-style Picture-in-Picture (PiP) functionality to Chrome and Edge. It allows you to instantly pop out any web video into a floating, resizable window that stays on top of all other applications.

## ✨ Features

- **Smart Hover Button**: A non-intrusive PiP button automatically appears at the top-center of videos when you hover over them.
- **Advanced Overlay Detection**: Unlike many other PiP extensions, this one calculates real-time mouse coordinates to detect the video under the cursor. This means it works perfectly on sites like YouTube and Netflix that place invisible overlay layers on top of their video players.
- **Per-Site Toggles**: Don't want the button appearing on a specific website? Click the extension icon and hit **"Disable on this site"** to add it to your blacklist.
- **Manual Trigger**: You can also use the extension popup to manually force the active video into Picture-in-Picture mode with a single click.
- **Lightweight**: Built with vanilla JavaScript and CSS without any heavy frameworks. Uses Manifest V3 for optimal performance and security.

## 🚀 Installation (Developer Mode)

1. Clone or download this repository to your local machine.
2. Open your Chromium-based browser (Chrome, Edge, Brave, etc.).
3. Navigate to the extensions page: `chrome://extensions/`
4. Turn on **Developer mode** (usually a toggle in the top right corner).
5. Click **Load unpacked**.
6. Select the folder containing this extension's files.
7. The extension is now installed! 

## 💡 Usage

- **Auto-mode:** Simply hover your mouse over any HTML5 video on any website. Click the white PiP icon that appears at the top center of the video.
- **Manual-mode:** Click the extension's puzzle piece icon (or pin it to your toolbar) and click **"Pop-out"** to grab the playing video.
- **Blacklisting:** Click the extension icon while on a site you want to ignore, and click **"Disable on this site"**. The extension will remember your preference.

## 🛠️ Built With

- JavaScript (ES6+)
- Manifest V3 API
- Chrome Storage API
- Chrome Scripting API

## 📝 License

This project is open-source and available under the MIT License.
# chrome-pip-extension
