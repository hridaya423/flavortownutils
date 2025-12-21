function removeDialogueElements() {
    if (!window.location.pathname.includes('/shop')) {
        return;
    }
    const dialogueWrapper = document.querySelector('.dialogue-box-wrapper');
    if (dialogueWrapper) {
        dialogueWrapper.remove();
    }
}

function init() {
    removeDialogueElements();

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

document.addEventListener('turbo:load', removeDialogueElements);
document.addEventListener('turbo:render', removeDialogueElements);
document.addEventListener('turbo:frame-load', removeDialogueElements);
window.addEventListener('popstate', removeDialogueElements);
