(function () {
    if (window.__pipExtensionLoaded) return;
    window.__pipExtensionLoaded = true;

    chrome.storage.local.get(['disabledSites'], (result) => {
        const disabledSites = result.disabledSites || [];
        const hostname = window.location.hostname;
        
        if (disabledSites.includes(hostname)) {
            return; // Bu sitede PiP butonu devre dışı
        }
        
        initPipButton();
    });

    function initPipButton() {

    const btn = document.createElement('div');
    btn.className = 'custom-pip-button';
    btn.innerHTML = `
        <svg width="24" height="24" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
          <path d="M19 11H11V17H19V11Z" fill="white"/>
          <path fill-rule="evenodd" clip-rule="evenodd" d="M21 5H3C1.89 5 1 5.89 1 7V17C1 18.11 1.89 19 3 19H21C22.11 19 23 18.11 23 17V7C23 5.89 22.11 5 21 5ZM21 17H3V7H21V17Z" fill="white"/>
        </svg>
    `;
    Object.assign(btn.style, {
        position: 'fixed',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        borderRadius: '4px',
        width: '30px',
        height: '30px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        zIndex: '2147483647',
        opacity: '0',
        pointerEvents: 'none',
        transition: 'opacity 0.2s ease, transform 0.2s ease',
        transform: 'scale(0.9)',
    });

    // Güvenli bir şekilde butonu ekle
    const appendToDOM = () => {
        (document.body || document.documentElement).appendChild(btn);
    };
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', appendToDOM);
    } else {
        appendToDOM();
    }

    let currentVideo = null;
    let hideTimeout = null;
    const liveVideos = document.getElementsByTagName('video');

    function togglePiP(video) {
        if (document.pictureInPictureElement === video) {
            document.exitPictureInPicture().catch(console.error);
        } else {
            video.requestPictureInPicture().catch(console.error);
        }
    }

    function updateButtonPosition(video) {
        const rect = video.getBoundingClientRect();
        // Üst orta (Top-Center) pozisyonu YouTube gibi sitelerde diğer butonlarla çakışmayı önler
        const top = rect.top + 12;
        const left = rect.left + (rect.width / 2) - 20; // 40px buton genişliğinin yarısı

        btn.style.top = `${top}px`;
        btn.style.left = `${left}px`;
    }

    function showButton(video) {
        // Çok küçük videoları atla (örn: arkaplan videoları, tracking pikseller)
        if (video.offsetWidth < 200 || video.offsetHeight < 150) return;

        currentVideo = video;
        updateButtonPosition(video);
        btn.style.opacity = '1';
        btn.style.pointerEvents = 'auto';
        btn.style.transform = 'scale(1)';
        clearTimeout(hideTimeout);
    }

    function hideButton() {
        hideTimeout = setTimeout(() => {
            btn.style.opacity = '0';
            btn.style.pointerEvents = 'none';
            btn.style.transform = 'scale(0.7)';
        }, 300);
    }

    document.addEventListener('mousemove', (e) => {
        const target = e.target;

        // Eğer mouse butonun üzerindeyse gizleme
        if (target === btn || btn.contains(target)) {
            clearTimeout(hideTimeout);
            return;
        }

        let hoveredVideo = null;

        // Mouse koordinatlarının herhangi bir videonun üzerinde olup olmadığını kontrol et
        for (let i = 0; i < liveVideos.length; i++) {
            const video = liveVideos[i];
            const rect = video.getBoundingClientRect();

            // Çok küçük veya görünmez videoları atla
            if (rect.width < 200 || rect.height < 150) continue;

            // Koordinatlar video sınırları içinde mi?
            if (e.clientX >= rect.left && e.clientX <= rect.right &&
                e.clientY >= rect.top && e.clientY <= rect.bottom) {
                hoveredVideo = video;
                break;
            }
        }

        if (hoveredVideo) {
            showButton(hoveredVideo);
        } else {
            if (btn.style.opacity === '1') {
                hideButton();
            }
        }
    }, true);

    window.addEventListener('scroll', () => {
        if (currentVideo && btn.style.opacity === '1') {
            updateButtonPosition(currentVideo);
        }
    }, true);

    window.addEventListener('resize', () => {
        if (currentVideo && btn.style.opacity === '1') {
            updateButtonPosition(currentVideo);
        }
    });

    btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (currentVideo) {
            togglePiP(currentVideo);
        }
    });

    btn.addEventListener('mouseenter', () => {
        clearTimeout(hideTimeout);
        btn.style.backgroundColor = 'rgba(0, 0, 0, 0.9)';
    });

    btn.addEventListener('mouseleave', () => {
        btn.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
        hideButton();
    });
    }
})();