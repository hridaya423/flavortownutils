
const browserAPI = typeof browser !== 'undefined' ? browser : chrome;
const GAMBLORPHEUS_LOTTERIES_URL = 'https://gamblorpheus.hackclub.com/api/lotteries';
const GAMBLORPHEUS_LOTTERIES_FALLBACK_URL = 'https://r.jina.ai/http://gamblorpheus.hackclub.com/api/lotteries';

function parseLotteryPayload(text) {
    if (typeof text !== 'string' || !text.trim()) return null;

    try {
        return JSON.parse(text);
    } catch (e) {
    }

    const marker = 'Markdown Content:';
    const markerIndex = text.indexOf(marker);
    const body = markerIndex >= 0 ? text.slice(markerIndex + marker.length).trim() : text;
    const start = body.indexOf('[');
    const end = body.lastIndexOf(']');
    if (start < 0 || end <= start) return null;

    try {
        return JSON.parse(body.slice(start, end + 1));
    } catch (e) {
        return null;
    }
}

async function fetchLotteryPayload(url) {
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Accept': 'application/json, text/plain;q=0.9, */*;q=0.8'
            }
        });
        const text = await response.text().catch(() => '');
        const data = parseLotteryPayload(text);

        return {
            ok: response.ok,
            status: response.status,
            data,
            raw: data ? null : text,
            error: null
        };
    } catch (err) {
        return {
            ok: false,
            status: 0,
            data: null,
            raw: null,
            error: err?.message || 'Network error'
        };
    }
}

browserAPI.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'GET_TAB_ID') {
        sendResponse({ tabId: sender.tab?.id });
        return false;
    }

    if (message.type === 'INJECT_SHOTS_HELPER') {
        const tabId = message.tabId || sender.tab?.id;
        const imageDataUrl = message.imageDataUrl;
        const secondImageDataUrl = message.secondImageDataUrl || null;

        if (!tabId) {
            sendResponse({ success: false, error: 'No tab ID' });
            return false;
        }

        browserAPI.scripting.executeScript({
            target: { tabId: tabId, allFrames: true },
            func: loadImageIntoShotsso,
            args: [imageDataUrl, secondImageDataUrl]
        }).then(() => {
            sendResponse({ success: true });
        }).catch((err) => {
            console.error('[Background] Failed to inject:', err);
            sendResponse({ success: false, error: err.message });
        });

        return true;
    }

    if (message.type === 'FETCH_EMOJI_LIST') {
        const url = message.url;
        if (!url) {
            sendResponse({ ok: false, error: 'Missing url' });
            return false;
        }

        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                sendResponse({ ok: true, data });
            })
            .catch(err => {
                sendResponse({ ok: false, error: err.message });
            });

        return true;
    }

    if (message.type === 'GET_GOOGLE_FONTS_LIST') {
        fetch('https://fonts.google.com/metadata/fonts')
            .then(response => response.text())
            .then(text => {
                const cleaned = text.replace(/^\)\]\}'\n/, '');
                const data = JSON.parse(cleaned);
                const items = (data?.familyMetadataList || [])
                    .map(item => item.family)
                    .filter(Boolean)
                    .sort((a, b) => a.localeCompare(b));
                sendResponse({ ok: true, items });
            })
            .catch(err => {
                sendResponse({ ok: false, error: err.message });
            });
        return true;
    }

    if (message.type === 'FETCH_EMOJI_IMAGE') {
        const url = message.url;
        if (!url) {
            sendResponse({ ok: false, error: 'Missing url' });
            return false;
        }

        fetch(url)
            .then(async response => {
                if (!response.ok) throw new Error(`HTTP ${response.status}`);
                const blob = await response.blob();
                const arrayBuffer = await blob.arrayBuffer();
                const bytes = new Uint8Array(arrayBuffer);
                let binary = '';
                const chunkSize = 0x8000;
                for (let i = 0; i < bytes.length; i += chunkSize) {
                    binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize));
                }
                const base64 = btoa(binary);
                const dataUrl = `data:${blob.type};base64,${base64}`;
                sendResponse({ ok: true, dataUrl });
            })
            .catch(err => {
                sendResponse({ ok: false, error: err.message });
            });

        return true;
    }

    if (message.type === 'FETCH_GAMBLORPHEUS_LOTTERIES') {
        const url = message.url || GAMBLORPHEUS_LOTTERIES_URL;

        (async () => {
            const fallbackResult = await fetchLotteryPayload(GAMBLORPHEUS_LOTTERIES_FALLBACK_URL);
            if (fallbackResult.ok && Array.isArray(fallbackResult.data)) {
                sendResponse({ ...fallbackResult, source: 'fallback' });
                return;
            }

            const primaryResult = await fetchLotteryPayload(url);
            if (primaryResult.ok && Array.isArray(primaryResult.data)) {
                sendResponse({ ...primaryResult, source: 'primary' });
                return;
            }

            sendResponse({
                ok: false,
                status: primaryResult.status || fallbackResult.status || 0,
                error: primaryResult.error || fallbackResult.error || 'Unable to fetch lotteries',
                data: null,
                raw: primaryResult.raw || fallbackResult.raw || null,
                source: 'failed'
            });
        })();

        return true;
    }

    if (message.type === 'LOGPHEUS_SYNC_GOALS') {
        const endpoint = message.endpoint;
        const goals = Array.isArray(message.goals) ? message.goals : [];
        const apiKey = typeof message.apiKey === 'string' ? message.apiKey.trim() : '';
        const method = typeof message.method === 'string' ? message.method.toUpperCase() : 'PUT';
        const logpheusOrigin = 'https://logpheus.gizzy.gay/*';

        if (!endpoint) {
            sendResponse({ ok: false, status: 0, error: 'Missing endpoint' });
            return false;
        }

        if (!apiKey) {
            sendResponse({ ok: false, status: 0, error: 'Missing API key' });
            return false;
        }

        const runSyncFetch = () => {
            fetch(endpoint, {
                method,
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ goals })
            })
                .then(async (response) => {
                    const text = await response.text().catch(() => '');
                    let data = null;
                    try {
                        data = text ? JSON.parse(text) : null;
                    } catch (e) {
                        data = null;
                    }

                    sendResponse({
                        ok: response.ok,
                        status: response.status,
                        data,
                        raw: data ? null : text
                    });
                })
                .catch((err) => {
                    sendResponse({ ok: false, status: 0, error: err?.message || 'Network error' });
                });
        };

        const handlePermissionResult = (granted) => {
            if (!granted) {
                sendResponse({ ok: false, status: 0, error: 'Missing Logpheus host permission' });
                return;
            }
            runSyncFetch();
        };

        if (!browserAPI.permissions || typeof browserAPI.permissions.contains !== 'function') {
            runSyncFetch();
            return true;
        }

        try {
            const maybePromise = browserAPI.permissions.contains({ origins: [logpheusOrigin] });
            if (maybePromise && typeof maybePromise.then === 'function') {
                maybePromise.then((granted) => handlePermissionResult(!!granted)).catch(() => handlePermissionResult(false));
                return true;
            }
        } catch (e) {
        }

        try {
            browserAPI.permissions.contains({ origins: [logpheusOrigin] }, (granted) => {
                handlePermissionResult(!!granted);
            });
        } catch (e) {
            handlePermissionResult(false);
        }

        return true;
    }
});

function loadImageIntoShotsso(imageDataUrl, secondImageDataUrl) {
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
            
            const selectAspectRatio = async () => {
                await new Promise(r => setTimeout(r, 800));
                
                const frameTab = Array.from(document.querySelectorAll('.panel-tabs button span'))
                    .find(s => s.textContent === 'Frame');
                if (frameTab) {
                    frameTab.closest('button').click();
                    await new Promise(r => setTimeout(r, 200));
                }
                
                const aspectBtn = document.querySelector('.panel-selector-btn-desktop') 
                    || document.querySelector('.button-wrapper button');
                if (aspectBtn) {
                    aspectBtn.click();
                    await new Promise(r => setTimeout(r, 200));
                    
                    const frameItems = document.querySelectorAll('.frame-item');
                    for (const item of frameItems) {
                        const label = item.querySelector('.label');
                        if (label && label.textContent.trim() === '16:9') {
                            item.click();
                            break;
                        }
                    }
                    await new Promise(r => setTimeout(r, 150));
                }
                
                if (secondImageDataUrl) {
                    await setup2PanelLayout();
                }
                
                const mockupTab = Array.from(document.querySelectorAll('.panel-tabs button span'))
                    .find(s => s.textContent === 'Mockup');
                if (mockupTab) {
                    mockupTab.closest('button').click();
                }
            };
                
            const setup2PanelLayout = async () => { 
                const switchButtons = document.querySelectorAll('.layout-filters .switch .switch-button');
                if (switchButtons.length >= 2) {
                    const btn = switchButtons[1];
                    ['mousedown', 'mouseup', 'click'].forEach(evt => {
                        btn.dispatchEvent(new MouseEvent(evt, { bubbles: true, cancelable: true }));
                    });
                    await new Promise(r => setTimeout(r, 600));
                }
                
                const layoutItems = document.querySelectorAll('.panel-control .layout-item');
                if (layoutItems.length > 0) {
                    const targetItem = layoutItems[1] || layoutItems[0];
                    targetItem.scrollIntoView({ behavior: 'instant', block: 'center' });
                    await new Promise(r => setTimeout(r, 100));
                    ['mousedown', 'mouseup', 'click'].forEach(evt => {
                        targetItem.dispatchEvent(new MouseEvent(evt, { bubbles: true, cancelable: true }));
                    });
                    await new Promise(r => setTimeout(r, 500));
                }
                
                await new Promise(r => setTimeout(r, 500));
                
                const mainCanvas = document.querySelector('.frame-editor, .main-canvas, [class*="editor"]');
                const allDropzones = document.querySelectorAll('.display-container-single .dropzone');
                
                let emptyDropzone = null;
                for (const dz of allDropzones) {
                    if (dz.querySelector('.empty-state') && !dz.querySelector('.dropped-image')) {
                        emptyDropzone = dz;
                        break;
                    }
                }
                
                if (emptyDropzone) {
                    const fileInputSecond = emptyDropzone.querySelector('input[type="file"]');
                    
                    if (fileInputSecond) {
                        const response = await fetch(secondImageDataUrl);
                        const blob = await response.blob();
                        const file = new File([blob], 'screenshot2.png', { type: blob.type });
                        
                        const dt = new DataTransfer();
                        dt.items.add(file);
                        fileInputSecond.files = dt.files;
                        ['input', 'change'].forEach(evt => {
                            fileInputSecond.dispatchEvent(new Event(evt, { bubbles: true, cancelable: true }));
                        });
                        await new Promise(r => setTimeout(r, 500));
                    } else {
                        const response = await fetch(secondImageDataUrl);
                        const blob = await response.blob();
                        const file = new File([blob], 'screenshot2.png', { type: blob.type });
                        
                        const fileDrop = emptyDropzone.querySelector('.file-drop');
                        if (fileDrop) {
                            const dt = new DataTransfer();
                            dt.items.add(file);
                            ['dragenter', 'dragover', 'drop'].forEach(eventType => {
                                const evt = new DragEvent(eventType, {
                                    bubbles: true,
                                    cancelable: true,
                                    dataTransfer: dt
                                });
                                fileDrop.dispatchEvent(evt);
                            });
                            await new Promise(r => setTimeout(r, 500));
                        }
                    }
                }
            };
            
            selectAspectRatio();
        } catch (err) {
            console.error('[SHOTS] Error:', err);
        }
    })();
}
