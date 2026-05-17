document.addEventListener('DOMContentLoaded', async () => {
    const togglePipBtn = document.getElementById('togglePip');
    const toggleSiteBtn = document.getElementById('toggleSite');

    // Aktif sekmeyi bul
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    // Geçerli bir web sayfası değilse (örneğin chrome:// sayfası) butonları devre dışı bırak
    if (!tab || !tab.url.startsWith('http')) {
        toggleSiteBtn.disabled = true;
        togglePipBtn.disabled = true;
        return;
    }

    const url = new URL(tab.url);
    const hostname = url.hostname;

    // Sitenin devre dışı listesinde olup olmadığını kontrol et
    chrome.storage.local.get(['disabledSites'], (result) => {
        const disabledSites = result.disabledSites || [];
        const isDisabled = disabledSites.includes(hostname);
        
        if (isDisabled) {
            toggleSiteBtn.textContent = "Bu Sitede Aç";
            toggleSiteBtn.className = "success";
        } else {
            toggleSiteBtn.textContent = "Bu Sitede Kapat";
            toggleSiteBtn.className = "danger";
        }
    });

    // Devre Dışı Bırak / Aç butonuna tıklama olayı
    toggleSiteBtn.addEventListener('click', () => {
        chrome.storage.local.get(['disabledSites'], (result) => {
            let disabledSites = result.disabledSites || [];
            const isDisabled = disabledSites.includes(hostname);

            if (isDisabled) {
                // Siteden engeli kaldır
                disabledSites = disabledSites.filter(site => site !== hostname);
            } else {
                // Siteyi engelle
                disabledSites.push(hostname);
            }

            // Listeyi kaydet ve sekmeyi yenile
            chrome.storage.local.set({ disabledSites }, () => {
                chrome.tabs.reload(tab.id);
                window.close();
            });
        });
    });

    // Manuel PiP açma butonu (Eski background.js işlevi)
    togglePipBtn.addEventListener('click', () => {
        chrome.scripting.executeScript({
            target: { tabId: tab.id, allFrames: true },
            func: () => {
                const videos = Array.from(document.querySelectorAll('video'));
                if (videos.length === 0) {
                    if (window === window.top) alert("Bu sayfada oynatılabilir bir video bulunamadı!");
                    return;
                }
                let targetVideo = videos.find(v => !v.paused) || videos[0];
                if (document.pictureInPictureElement) {
                    document.exitPictureInPicture().catch(console.error);
                } else {
                    targetVideo.requestPictureInPicture().catch(e => {
                        console.error(e);
                        if (window === window.top) alert("Video bu modda oynatılamıyor.");
                    });
                }
            }
        }, () => {
            window.close();
        });
    });
});
