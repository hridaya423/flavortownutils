// ==UserScript==
// @name         Flavortown Utils
// @namespace    https://flavortown.hackclub.com/
// @version      1.0.0
// @description  
// @author       You
// @match        https://flavortown.hackclub.com/*
// @grant        none
// @run-at       document-idle
// ==/UserScript==

(function() {
    'use strict';

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
        initPasteUpload();
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
        initPasteUpload();
    });
})();
