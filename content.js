function removeDialogueElements() {
    if (!window.location.pathname.includes('/shop')) {
        return;
    }
    const dialogueWrapper = document.querySelector('.dialogue-box-wrapper');
    if (dialogueWrapper) {
        dialogueWrapper.remove();
    }
}

function initPasteUpload() {
    if (!/\/projects\/\d+\/devlogs\/new/.test(window.location.pathname)) {
        return;
    }
    if (window.__flavortownPasteUploadInit) return;
    window.__flavortownPasteUploadInit = true;

    document.addEventListener('paste', (e) => {
        const fileInput = document.querySelector('.file-upload__input');
        if (!fileInput) return;

        const items = e.clipboardData?.items;
        if (!items) return;

        const files = [];
        for (const item of items) {
            if (item.kind === 'file') {
                const file = item.getAsFile();
                if (file) files.push(file);
            }
        }

        if (files.length === 0) return;

        e.preventDefault();
        e.stopPropagation();

        const dataTransfer = new DataTransfer();
        files.forEach(file => dataTransfer.items.add(file));
        fileInput.files = dataTransfer.files;
        fileInput.dispatchEvent(new Event('change', { bubbles: true }));
    });
}

function init() {
    removeDialogueElements();
    initPasteUpload();

    if (document.body) {
        const observer = new MutationObserver((mutations) => {
            removeDialogueElements();
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

let lastPathname = window.location.pathname;
document.addEventListener('turbo:load', () => {
    if (window.location.pathname !== lastPathname) {
        window.__flavortownPasteUploadInit = false;
        lastPathname = window.location.pathname;
    }
    removeDialogueElements();
    initPasteUpload();
});
document.addEventListener('turbo:render', removeDialogueElements);
document.addEventListener('turbo:frame-load', removeDialogueElements);
window.addEventListener('popstate', removeDialogueElements);
