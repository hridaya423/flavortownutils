
const browserAPI = typeof browser !== 'undefined' ? browser : chrome;

browserAPI.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'GET_TAB_ID') {
        sendResponse({ tabId: sender.tab?.id });
        return false;
    }

    if (message.type === 'INJECT_SHOTS_HELPER') {
        const tabId = message.tabId || sender.tab?.id;
        const imageDataUrl = message.imageDataUrl;

        if (!tabId) {
            sendResponse({ success: false, error: 'No tab ID' });
            return false;
        }

        browserAPI.scripting.executeScript({
            target: { tabId: tabId, allFrames: true },
            func: loadImageIntoShotsso,
            args: [imageDataUrl]
        }).then(() => {
            sendResponse({ success: true });
        }).catch((err) => {
            console.error('[Background] Failed to inject:', err);
            sendResponse({ success: false, error: err.message });
        });

        return true;
    }
});

function loadImageIntoShotsso(imageDataUrl) {
    if (!window.location.hostname.includes('shots.so')) return;

    (async () => {
        try {

           
            let copyNotified = false;
            const checkForCopyToast = () => {
                const toast = document.querySelector('[role="status"][aria-live="polite"]');
                if (toast && toast.textContent.includes('Copied to clipboard') && !copyNotified) {
                    copyNotified = true;
                    window.parent.postMessage({ type: 'SHOTS_COPY_COMPLETE' }, '*');
                    setTimeout(() => { copyNotified = false; }, 3000);
                }
            };
            setInterval(checkForCopyToast, 300);

           
            const styleCopyButton = () => {
                const copyBtn = document.querySelector('.copy-button-wrapper button, button.copy-button, .copy-button');
                if (copyBtn && !copyBtn.dataset.flavortownStyled) {
                    copyBtn.dataset.flavortownStyled = 'true';
                    copyBtn.style.cssText += `
                        background: linear-gradient(135deg, #10b981, #059669) !important;
                        color: white !important;
                        border-radius: 8px !important;
                        box-shadow: 0 2px 8px rgba(16, 185, 129, 0.5) !important;
                    `;
                    copyBtn.title = 'Copy to clipboard (auto-uploads to devlog)';
                    const wrapper = copyBtn.closest('.copy-button-wrapper');
                    if (wrapper) {
                        wrapper.style.cssText += 'transform: scale(1.1); transition: transform 0.2s;';
                    }
                }
            };
            setTimeout(styleCopyButton, 1000);
            setInterval(styleCopyButton, 3000);

            const existingImage = document.querySelector('.dropped-image');

            if (existingImage) {
                const startOverBtn = document.querySelector('.start-new-placeholder .start-new-component')
                    || document.querySelector('.start-new-placeholder');

                if (startOverBtn) {
                    const rect = startOverBtn.getBoundingClientRect();
                    const x = rect.left + rect.width / 2;
                    const y = rect.top + rect.height / 2;

                    ['mousedown', 'mouseup', 'click'].forEach(eventType => {
                        startOverBtn.dispatchEvent(new MouseEvent(eventType, {
                            bubbles: true, cancelable: true, view: window, clientX: x, clientY: y
                        }));
                    });

                    let dialogBtns = null;
                    for (let i = 0; i < 20; i++) {
                        await new Promise(r => setTimeout(r, 50));
                        dialogBtns = document.querySelectorAll('.start-new-component .buttons button');
                        if (dialogBtns.length > 0) break;
                    }

                    if (dialogBtns) {
                        for (const btn of dialogBtns) {
                            if (btn.innerText.includes('Start Over') || btn.classList.contains('primary-button')) {
                                btn.click();
                                break;
                            }
                        }
                    }

                    for (let i = 0; i < 60; i++) {
                        await new Promise(r => setTimeout(r, 50));
                        if (!document.querySelector('.dropped-image')) break;
                    }

                    await new Promise(r => setTimeout(r, 200));
                }
            }

            const response = await fetch(imageDataUrl);
            const blob = await response.blob();
            const file = new File([blob], 'screenshot.png', { type: blob.type });

            const fileInput = document.querySelector('.dropzone input[type="file"]')
                || document.querySelector('input[type="file"]');

            if (fileInput) {
                const dt = new DataTransfer();
                dt.items.add(file);
                fileInput.files = dt.files;
                ['input', 'change'].forEach(evt => {
                    fileInput.dispatchEvent(new Event(evt, { bubbles: true, cancelable: true }));
                });
                return;
            }

            const dropzone = document.querySelector('.dropzone') || document.querySelector('.file-drop');
            if (dropzone) {
                const dt = new DataTransfer();
                dt.items.add(file);

                ['dragenter', 'dragover', 'drop'].forEach(eventType => {
                    const evt = new DragEvent(eventType, {
                        bubbles: true,
                        cancelable: true,
                        dataTransfer: dt
                    });
                    dropzone.dispatchEvent(evt);
                });
            }
        } catch (err) {
            console.error('[SHOTS] Error:', err);
        }
    })();
}

