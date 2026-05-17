chrome.action.onClicked.addListener((tab) => {
  // Sadece http veya https sayfalarında çalışmasını sağla
  if (tab.url.startsWith("http://") || tab.url.startsWith("https://")) {
    chrome.scripting.executeScript({
      target: { tabId: tab.id, allFrames: true },
      func: () => {
        const videos = Array.from(document.querySelectorAll('video'));
        if (videos.length === 0) {
            // Sadece ana frame'de uyarı verelim
            if (window === window.top) alert("Bu sayfada oynatılabilir bir video bulunamadı!");
            return;
        }

        let targetVideo = videos.find(v => !v.paused) || videos[0];

        if (document.pictureInPictureElement) {
            document.exitPictureInPicture().catch(error => console.error("PiP'ten çıkılamadı:", error));
        } else {
            targetVideo.requestPictureInPicture().catch(error => {
                console.error("Picture-in-Picture başlatılamadı:", error);
                if (window === window.top) alert("Video bu modda oynatılamıyor.");
            });
        }
      }
    });
  }
});