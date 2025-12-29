const browserAPI = typeof browser !== 'undefined' ? browser : chrome;

const CSS_VAR_OVERRIDES = {
    'background': [
        '--color-background', '--color-bg', '--neutral-50', '--catppuccin-base',
        '--color-gray-50', '--color-cream'
    ],
    'surface': [
        '--color-surface', '--neutral-300', '--neutral-400', '--catppuccin-surface2',
        '--color-bread', '--color-soft-bone', '--color-gray-300', '--color-cream-dark'
    ],
    'surface-alt': [
        '--neutral-100', '--neutral-200', '--color-gray-100', '--color-gray-200'
    ],
    'accent': [
        '--color-accent', '--color-border', '--color-som-dark', '--color-som-bright',
        '--secondary-300', '--secondary-400', '--color-saddle-taupe', '--catppuccin-accent'
    ],
    'accent-alt': [
        '--color-blue-400', '--color-blue-500', '--secondary-200',
        '--color-nice-blue', '--color-dark-blue'
    ],
    'text': [
        '--color-text-primary', '--neutral-900', '--catppuccin-text',
        '--color-gray-900', '--color-brown'
    ],
    'text-secondary': [
        '--color-text-secondary', '--neutral-800', '--color-gray-800', '--color-brown-light'
    ],
    'text-muted': [
        '--color-text-muted', '--neutral-600', '--neutral-700',
        '--catppuccin-overlay0', '--color-gray-600'
    ],
    'border': [
        '--neutral-500', '--color-gray-500', '--color-brown-dark'
    ],
    'success': [
        '--color-green-400', '--color-green-500', '--color-green-600',
        '--primary-800', '--color-forest'
    ],
    'warning': [
        '--color-yellow-400', '--color-yellow-500', '--color-yellow-600',
        '--color-orange-400', '--primary-700', '--color-warm'
    ],
    'error': [
        '--color-red-400', '--color-red-500', '--color-red-600',
        '--primary-400', '--primary-500', '--color-vintage-red'
    ],
    'purple': [
        '--color-purple-400', '--color-purple-500', '--color-purple-600',
        '--primary-300', '--secondary-500'
    ],
    'teal': [
        '--color-teal-400', '--color-teal-500', '--primary-900', '--secondary-50'
    ],
    'pink': [
        '--color-pink-400', '--color-pink-500', '--primary-200', '--primary-100'
    ]
};

function loadTheme() {
    browserAPI.storage.sync.get(['theme', 'customColors'], (result) => {
        const theme = result.theme || 'default';
        const customColors = result.customColors || {};
        applyTheme(theme, customColors);
    });
}

function applyTheme(theme, customColors) {
    const existingTheme = document.getElementById('flavortown-theme');
    if (existingTheme) existingTheme.remove();

    const existingCustom = document.getElementById('flavortown-custom-vars');
    if (existingCustom) existingCustom.remove();

    if (theme === 'default') return;

    if (theme === 'custom') {
        const style = document.createElement('style');
        style.id = 'flavortown-custom-vars';

        let css = ':root, :host {\n';

        for (const [colorKey, value] of Object.entries(customColors)) {
            const mappedVars = CSS_VAR_OVERRIDES[colorKey];
            if (mappedVars && value) {
                mappedVars.forEach(varName => {
                    css += `    ${varName}: ${value} !important;\n`;
                });
            }
        }

        css += '}\n\n';

        const bg = customColors['background'] || '#1e1e2e';
        const surface = customColors['surface'] || '#313244';
        const text = customColors['text'] || '#cdd6f4';
        const accent = customColors['accent'] || '#cba6f7';
        const border = customColors['border'] || '#585b70';

        css += `
html, body {
    background: ${bg} !important;
    background-color: ${bg} !important;
    color: ${text} !important;
}

body::before {
    background: ${bg} !important;
    background-color: ${bg} !important;
}

.sidebar, .sidebar__content, .sidebar__menu {
    background: ${surface} !important;
}

.btn, button {
    border-color: ${border} !important;
}

a {
    color: ${accent} !important;
}

h1, h2, h3, h4, h5, h6, p, span, div {
    color: inherit;
}

.prose, .prose * {
    color: ${text} !important;
}
`;

        style.textContent = css;
        document.head.appendChild(style);
    } else {
        const link = document.createElement('link');
        link.id = 'flavortown-theme';
        link.rel = 'stylesheet';
        link.href = browserAPI.runtime.getURL(`themes/${theme}.css`);
        document.head.appendChild(link);


        if (['catppuccin', 'sea', 'overcooked'].includes(theme)) {
            setTimeout(() => recolorBackgroundTexture(theme), 0);
        }
    }
}

function recolorBackgroundTexture(theme) {
    const cacheKey = `flavortown-bg-${theme}`;
    const cached = localStorage.getItem(cacheKey);

    if (cached) {
        document.body.style.backgroundImage = `url("${cached}")`;
        return;
    }

    const bodyStyle = getComputedStyle(document.body);
    const bgImage = bodyStyle.backgroundImage;

    const urlMatch = bgImage.match(/url\(["']?([^"')]+)["']?\)/);
    if (!urlMatch) return;

    const imageUrl = urlMatch[1];

    const hueShifts = {
        'catppuccin': 200,
        'sea': 180,
        'overcooked': 0
    };

    const saturationMod = {
        'catppuccin': 0.4,
        'sea': 1.5,
        'overcooked': 0.3
    };

    const hueShift = hueShifts[theme] || 0;
    const satMod = saturationMod[theme] || 1;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');

        ctx.drawImage(img, 0, 0);

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;

        for (let i = 0; i < data.length; i += 4) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];

            const [h, s, l] = rgbToHsl(r, g, b);

            const newH = (h + hueShift / 360) % 1;
            const newS = Math.min(1, s * satMod);

            const [newR, newG, newB] = hslToRgb(newH, newS, l);

            data[i] = newR;
            data[i + 1] = newG;
            data[i + 2] = newB;
        }

        ctx.putImageData(imageData, 0, 0);

        const dataUrl = canvas.toDataURL('image/webp', 0.9);
        document.body.style.backgroundImage = `url("${dataUrl}")`;

        try {
            localStorage.setItem(cacheKey, dataUrl);
        } catch (e) {
        }
    };

    img.onerror = () => console.log('Could not load background for recoloring');
    img.src = imageUrl;
}

function rgbToHsl(r, g, b) {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max === min) {
        h = s = 0;
    } else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
            case g: h = ((b - r) / d + 2) / 6; break;
            case b: h = ((r - g) / d + 4) / 6; break;
        }
    }
    return [h, s, l];
}

function hslToRgb(h, s, l) {
    let r, g, b;
    if (s === 0) {
        r = g = b = l;
    } else {
        const hue2rgb = (p, q, t) => {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1 / 6) return p + (q - p) * 6 * t;
            if (t < 1 / 2) return q;
            if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
            return p;
        };
        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        r = hue2rgb(p, q, h + 1 / 3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1 / 3);
    }
    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}



browserAPI.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'APPLY_THEME') {
        applyTheme(message.theme, message.customColors || {});
        sendResponse({ success: true });
    }
    return true;
});

function initPinnableSidebar() {
    const sidebar = document.querySelector('.sidebar');
    if (!sidebar || sidebar.dataset.pinInitialized) return;
    sidebar.dataset.pinInitialized = 'true';

    const MOBILE_BREAKPOINT = 960;

    const pinBtn = document.createElement('button');
    pinBtn.className = 'sidebar__pin-btn';
    pinBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M16 12V4h1V2H7v2h1v8l-2 2v2h5.2v6h1.6v-6H18v-2l-2-2z"/></svg>`;
    pinBtn.title = 'Pin sidebar';

    const blob = sidebar.querySelector('.sidebar__blob');
    if (blob) {
        blob.style.position = 'relative';
        blob.appendChild(pinBtn);
    }

    function applyPinnedState(isPinned) {
        if (window.innerWidth < MOBILE_BREAKPOINT) {
            sidebar.classList.remove('sidebar--pinned');
            sidebar.style.width = '';
            return;
        }

        if (isPinned) {
            sidebar.classList.add('sidebar--pinned');
            sidebar.style.width = 'var(--sidebar-expanded-width, 300px)';
        } else {
            sidebar.classList.remove('sidebar--pinned');
            sidebar.style.width = '';
        }
    }

    try {
        browserAPI.storage.local.get(['sidebarPinned'], (result) => {
            const isPinned = result.sidebarPinned || false;

            if (isPinned && window.innerWidth >= MOBILE_BREAKPOINT) {
                sidebar.style.transition = 'none';
                applyPinnedState(true);

                requestAnimationFrame(() => {
                    requestAnimationFrame(() => {
                        sidebar.style.transition = '';
                    });
                });
            }
        });
    } catch (e) { }

    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            try {
                browserAPI.storage.local.get(['sidebarPinned'], (result) => {
                    applyPinnedState(result.sidebarPinned || false);
                });
            } catch (e) { }
        }, 100);
    });

    pinBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        e.preventDefault();

        if (window.innerWidth < MOBILE_BREAKPOINT) {
            return;
        }

        const isPinned = sidebar.classList.contains('sidebar--pinned');

        applyPinnedState(!isPinned);
        try {
            browserAPI.storage.local.set({ sidebarPinned: !isPinned });
        } catch (e) { }
    });
}

function addDevlogFrequencyStat() {
    if (!/\/projects\/\d+$/.test(window.location.pathname)) {
        return;
    }
    if (document.querySelector('.flavortown-utils-frequency-stat')) return;

    const statsContainer = document.querySelector('.project-show-card__stats .project-show-card__stats');
    if (!statsContainer) return;

    const statElements = statsContainer.querySelectorAll('.project-show-card__stat');
    let devlogCount = 0;
    let totalMinutes = 0;

    for (const stat of statElements) {
        const text = stat.textContent.trim();
        const devlogMatch = text.match(/(\d+)\s*devlogs?/);
        if (devlogMatch) {
            devlogCount = parseInt(devlogMatch[1], 10);
        }
        const timeMatch = text.match(/(\d+)hr?\s*(\d+)min/);
        if (timeMatch) {
            totalMinutes = parseInt(timeMatch[1], 10) * 60 + parseInt(timeMatch[2], 10);
        }
    }

    if (devlogCount === 0 || totalMinutes === 0) return;

    const avgMinutes = Math.round(totalMinutes / devlogCount);
    const avgHours = Math.floor(avgMinutes / 60);
    const avgMins = avgMinutes % 60;

    const frequencyStat = document.createElement('div');
    frequencyStat.className = 'project-show-card__stat flavortown-utils-frequency-stat';
    frequencyStat.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.5-13H11v6l5.2 3.2.8-1.3-4.5-2.7V7z"/></svg>
        <span>1 devlog every ${avgHours}hr ${avgMins}min</span>
    `;
    statsContainer.appendChild(frequencyStat);
}

let inlineFormLoading = false;

const LUCIDE_ICONS = {
    bold: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 12h9a4 4 0 0 1 0 8H7a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h7a4 4 0 0 1 0 8"/></svg>',
    italic: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="19" x2="10" y1="4" y2="4"/><line x1="14" x2="5" y1="20" y2="20"/><line x1="15" x2="9" y1="4" y2="20"/></svg>',
    strikethrough: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 4H9a3 3 0 0 0-2.83 4"/><path d="M14 12a4 4 0 0 1 0 8H6"/><line x1="4" x2="20" y1="12" y2="12"/></svg>',
    heading1: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12h8"/><path d="M4 18V6"/><path d="M12 18V6"/><path d="m17 12 3-2v8"/></svg>',
    heading2: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12h8"/><path d="M4 18V6"/><path d="M12 18V6"/><path d="M21 18h-4c0-4 4-3 4-6 0-1.5-2-2.5-4-1"/></svg>',
    heading3: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12h8"/><path d="M4 18V6"/><path d="M12 18V6"/><path d="M17.5 10.5c1.7-1 3.5 0 3.5 1.5a2 2 0 0 1-2 2"/><path d="M17 17.5c2 1.5 4 .3 4-1.5a2 2 0 0 0-2-2"/></svg>',
    list: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="8" x2="21" y1="6" y2="6"/><line x1="8" x2="21" y1="12" y2="12"/><line x1="8" x2="21" y1="18" y2="18"/><line x1="3" x2="3.01" y1="6" y2="6"/><line x1="3" x2="3.01" y1="12" y2="12"/><line x1="3" x2="3.01" y1="18" y2="18"/></svg>',
    listOrdered: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="10" x2="21" y1="6" y2="6"/><line x1="10" x2="21" y1="12" y2="12"/><line x1="10" x2="21" y1="18" y2="18"/><path d="M4 6h1v4"/><path d="M4 10h2"/><path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1"/></svg>',
    listChecks: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 17 2 2 4-4"/><path d="m3 7 2 2 4-4"/><path d="M13 6h8"/><path d="M13 12h8"/><path d="M13 18h8"/></svg>',
    quote: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V21z"/><path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3z"/></svg>',
    code: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>',
    codeBlock: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 12.5 8 15l2 2.5"/><path d="m14 12.5 2 2.5-2 2.5"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7z"/></svg>',
    link: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>',
    image: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>',
    minus: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/></svg>',
    eye: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>',
    eyeOff: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" x2="22" y1="2" y2="22"/></svg>',
    underline: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 4v6a6 6 0 0 0 12 0V4"/><line x1="4" x2="20" y1="20" y2="20"/></svg>'
};

function parseMarkdown(text) {
    if (!text) return '';

    try {
        let html = text
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');

        html = html.replace(/```(\w*)\n([\s\S]*?)```/g, (_, lang, code) =>
            `<pre class="flavortown-md-pre"><code>${code.trim()}</code></pre>`);

        html = html.replace(/`([^`]+)`/g, '<code class="flavortown-md-code">$1</code>');

        html = html.replace(/^### (.+)$/gm, '<h3>$1</h3>');
        html = html.replace(/^## (.+)$/gm, '<h2>$1</h2>');
        html = html.replace(/^# (.+)$/gm, '<h1>$1</h1>');
        html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
        html = html.replace(/\*([^*]+)\*/g, '<em>$1</em>');
        html = html.replace(/~~([^~]+)~~/g, '<del>$1</del>');
        html = html.replace(/&lt;u&gt;(.+?)&lt;\/u&gt;/g, '<u>$1</u>');

        html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" class="flavortown-md-img">');

        html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>');

        html = html.replace(/^---$/gm, '<hr class="flavortown-md-hr">');

        html = html.replace(/^&gt;\s?(.+)$/gm, '<blockquote class="flavortown-md-quote">$1</blockquote>');

        html = html.replace(/^-\s?\[\s?\]\s?(.+)$/gm, '<div class="flavortown-md-task"><input type="checkbox" disabled> $1</div>');
        html = html.replace(/^-\s?\[[xX]\]\s?(.+)$/gm, '<div class="flavortown-md-task"><input type="checkbox" checked disabled> $1</div>');

        html = html.replace(/^-\s+(.+)$/gm, '<li class="flavortown-md-li">$1</li>');
        html = html.replace(/^\d+\.\s+(.+)$/gm, '<li class="flavortown-md-oli">$1</li>');

        const lines = html.split('\n');
        html = lines.map(line => {
            if (line.trim() === '') return '';
            if (/^<(h[1-6]|ul|ol|li|pre|blockquote|div|hr|img|code|strong|em|del|u|a)/.test(line)) return line;
            if (line.includes('<li')) return line;
            return `<p>${line}</p>`;
        }).join('\n');

        return html;
    } catch (e) {
        console.error('Flavortown parseMarkdown error:', e);
        return `<p>${text}</p>`;
    }
}

function addLivePreview(textarea, toolbar) {
    const inputWrapper = textarea.closest('.input');
    if (!inputWrapper || inputWrapper.dataset.livePreview) return;
    inputWrapper.dataset.livePreview = 'true';

    const container = document.createElement('div');
    container.className = 'flavortown-md-container';

    const resizeHandle = document.createElement('div');
    resizeHandle.className = 'flavortown-md-resize';
    resizeHandle.title = 'Drag to resize';
    resizeHandle.innerHTML = '⁞';

    const previewPanel = document.createElement('div');
    previewPanel.className = 'flavortown-md-preview input__field input__field--textarea';
    previewPanel.innerHTML = '<div class="flavortown-md-preview__placeholder">Preview will appear here...</div>';

    const closeBtn = document.createElement('button');
    closeBtn.type = 'button';
    closeBtn.className = 'flavortown-md-preview__close';
    closeBtn.innerHTML = '×';
    closeBtn.title = 'Close preview';

    textarea.parentNode.insertBefore(container, textarea);
    container.appendChild(textarea);
    container.appendChild(resizeHandle);
    container.appendChild(previewPanel);

    let previewVisible = false;
    let previewManuallyClosed = false;
    let debounceTimer = null;

    const markdownPatterns = /(\*\*|__|~~|`|#{1,3}\s|-\s|\d+\.\s|>\s|\[.+\]\(.+\)|!\[|<u>)/;

    function hidePreview() {
        previewVisible = false;
        previewManuallyClosed = true;
        container.classList.remove('flavortown-md-container--preview');
    }

    closeBtn.addEventListener('click', (e) => {
        e.preventDefault();
        hidePreview();
    });

    function updatePreview() {
        const text = textarea.value;
        const hasMarkdown = markdownPatterns.test(text);

        if (!text) {
            previewManuallyClosed = false;
        }

        if (hasMarkdown && !previewVisible && !previewManuallyClosed) {
            previewVisible = true;
            container.classList.add('flavortown-md-container--preview');
        }

        if (!previewVisible || !text) {
            previewPanel.innerHTML = '<div class="flavortown-md-preview__placeholder">Preview will appear here...</div>';
            return;
        }

        const html = parseMarkdown(text);
        previewPanel.innerHTML = '<button type="button" class="flavortown-md-preview__close" title="Close preview">×</button>' + html;
        previewPanel.querySelector('.flavortown-md-preview__close').addEventListener('click', (e) => {
            e.preventDefault();
            hidePreview();
        });
    }

    textarea.addEventListener('input', () => {
        if (debounceTimer) clearTimeout(debounceTimer);
        debounceTimer = setTimeout(updatePreview, 50);
    });

    let isResizing = false;
    let startX = 0;
    let startTextareaWidth = 0;

    resizeHandle.addEventListener('mousedown', (e) => {
        isResizing = true;
        startX = e.clientX;
        startTextareaWidth = textarea.offsetWidth;
        document.body.style.cursor = 'col-resize';
        document.body.style.userSelect = 'none';
        e.preventDefault();
    });

    document.addEventListener('mousemove', (e) => {
        if (!isResizing) return;
        const delta = e.clientX - startX;
        const newWidth = Math.max(150, Math.min(startTextareaWidth + delta, container.offsetWidth - 180));
        textarea.style.width = newWidth + 'px';
        textarea.style.flex = 'none';
    });

    document.addEventListener('mouseup', () => {
        if (isResizing) {
            isResizing = false;
            document.body.style.cursor = '';
            document.body.style.userSelect = '';
        }
    });

    if (textarea.value) {
        updatePreview();
    }
}

function addMarkdownToolbar(textarea) {
    if (!textarea || textarea.dataset.mdToolbar) return;
    textarea.dataset.mdToolbar = 'true';

    const inputWrapper = textarea.closest('.input');
    if (!inputWrapper) return;

    const toolbar = document.createElement('div');
    toolbar.className = 'flavortown-md-toolbar';

    const buttons = [
        { icon: 'bold', title: 'Bold', action: () => wrapSelection(textarea, '**', '**') },
        { icon: 'italic', title: 'Italic', action: () => wrapSelection(textarea, '*', '*') },
        { icon: 'underline', title: 'Underline', action: () => wrapSelection(textarea, '<u>', '</u>') },
        { icon: 'strikethrough', title: 'Strikethrough', action: () => wrapSelection(textarea, '~~', '~~') },
        { type: 'separator' },
        { icon: 'heading1', title: 'Heading 1', action: () => prefixLine(textarea, '# ') },
        { icon: 'heading2', title: 'Heading 2', action: () => prefixLine(textarea, '## ') },
        { icon: 'heading3', title: 'Heading 3', action: () => prefixLine(textarea, '### ') },
        { type: 'separator' },
        { icon: 'list', title: 'Bullet List', action: () => prefixLine(textarea, '- ') },
        { icon: 'listOrdered', title: 'Numbered List', action: () => prefixLine(textarea, '1. ') },
        { icon: 'listChecks', title: 'Task List', action: () => prefixLine(textarea, '- [ ] ') },
        { icon: 'quote', title: 'Blockquote', action: () => prefixLine(textarea, '> ') },
        { type: 'separator' },
        { icon: 'code', title: 'Inline Code', action: () => wrapSelection(textarea, '`', '`') },
        { icon: 'codeBlock', title: 'Code Block', action: () => insertBlock(textarea, '```\n', '\n```') },
        { icon: 'link', title: 'Link', action: () => insertLink(textarea) },
        { icon: 'minus', title: 'Horizontal Rule', action: () => insertText(textarea, '\n---\n') }
    ];

    buttons.forEach(btn => {
        if (btn.type === 'separator') {
            const sep = document.createElement('div');
            sep.className = 'flavortown-md-toolbar__separator';
            toolbar.appendChild(sep);
            return;
        }
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'flavortown-md-toolbar__btn';
        button.title = btn.title;
        button.innerHTML = LUCIDE_ICONS[btn.icon];
        button.addEventListener('click', (e) => {
            e.preventDefault();
            btn.action();
            textarea.focus();
        });
        toolbar.appendChild(button);
    });

    inputWrapper.style.position = 'relative';
    inputWrapper.insertBefore(toolbar, textarea);

    addLivePreview(textarea, toolbar);
}

function wrapSelection(textarea, before, after) {
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selected = text.substring(start, end) || 'text';
    const newText = text.substring(0, start) + before + selected + after + text.substring(end);
    textarea.value = newText;
    textarea.selectionStart = start + before.length;
    textarea.selectionEnd = start + before.length + selected.length;
    textarea.dispatchEvent(new Event('input', { bubbles: true }));
}

function prefixLine(textarea, prefix) {
    const start = textarea.selectionStart;
    const text = textarea.value;
    const lineStart = text.lastIndexOf('\n', start - 1) + 1;
    const newText = text.substring(0, lineStart) + prefix + text.substring(lineStart);
    textarea.value = newText;
    textarea.selectionStart = textarea.selectionEnd = start + prefix.length;
    textarea.dispatchEvent(new Event('input', { bubbles: true }));
}

function insertBlock(textarea, before, after) {
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selected = text.substring(start, end) || 'code';
    const newText = text.substring(0, start) + before + selected + after + text.substring(end);
    textarea.value = newText;
    textarea.selectionStart = start + before.length;
    textarea.selectionEnd = start + before.length + selected.length;
    textarea.dispatchEvent(new Event('input', { bubbles: true }));
}

function insertText(textarea, insertStr) {
    const start = textarea.selectionStart;
    const text = textarea.value;
    const newText = text.substring(0, start) + insertStr + text.substring(start);
    textarea.value = newText;
    textarea.selectionStart = textarea.selectionEnd = start + insertStr.length;
    textarea.dispatchEvent(new Event('input', { bubbles: true }));
}

function insertLink(textarea) {
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selected = text.substring(start, end) || 'link text';
    const insertStr = `[${selected}](url)`;
    const newText = text.substring(0, start) + insertStr + text.substring(end);
    textarea.value = newText;
    const urlStart = start + selected.length + 3;
    textarea.selectionStart = urlStart;
    textarea.selectionEnd = urlStart + 3;
    textarea.dispatchEvent(new Event('input', { bubbles: true }));
}

function inlineDevlogForm() {
    if (!/\/projects\/\d+$/.test(window.location.pathname)) {
        return;
    }
    if (document.querySelector('.flavortown-inline-form')) return;
    if (inlineFormLoading) return;

    const addDevlogBtn = document.querySelector('a.btn[href$="/devlogs/new"]');
    if (!addDevlogBtn) return;

    const container = addDevlogBtn.closest('.mt-4');
    if (!container) return;

    inlineFormLoading = true;
    const devlogNewUrl = addDevlogBtn.href;

    fetch(devlogNewUrl, { credentials: 'same-origin', headers: { 'X-Flavortown-Ext-135': 'true' } })
        .then(res => res.text())
        .then(html => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');

            const formContainer = doc.querySelector('.projects-new__container');
            if (!formContainer) {
                console.error('Flavortown Utils: Could not find form container');
                inlineFormLoading = false;
                return;
            }

            const heading = formContainer.querySelector('.ui-heading');
            if (heading) heading.remove();

            const wrapper = document.createElement('div');
            wrapper.className = 'flavortown-inline-form';
            wrapper.innerHTML = formContainer.innerHTML;

            const timePreview = wrapper.querySelector('.projects-new__time-preview');
            const card = wrapper.querySelector('.projects-new__card');
            const actions = wrapper.querySelector('.projects-new__actions');
            const attachmentField = wrapper.querySelectorAll('.projects-new__field')[1];

            if (card && timePreview && attachmentField) {
                attachmentField.after(timePreview);
            }

            if (card && actions) {
                card.appendChild(actions);
            }

            addDevlogBtn.style.display = 'none';
            container.parentNode.insertBefore(wrapper, container.nextSibling);

            const devlogTextarea = wrapper.querySelector('#post_devlog_body');
            if (devlogTextarea) {
                addMarkdownToolbar(devlogTextarea);
            }

            if (window.Stimulus && window.Stimulus.application) {
                const fileUploadEl = wrapper.querySelector('[data-controller="file-upload"]');
                if (fileUploadEl) {
                    window.Stimulus.application.router.loadDefinition({
                        identifier: 'file-upload',
                        ...window.Stimulus.application.router.modulesByIdentifier.get('file-upload')
                    });
                }
            }
        })
        .catch(err => {
            console.error('Flavortown Utils: Failed to load devlog form', err);
            inlineFormLoading = false;
        });
}

function enhanceShopGoals() {
    if (window.location.pathname !== '/shop') return;

    const goalsContainer = document.querySelector('.shop-goals__container');
    const balanceBtn = document.querySelector('.sidebar__user-balance');

    if (!balanceBtn) return;

    const balanceText = balanceBtn.textContent.trim();
    const currentCookies = parseInt(balanceText.replace(/[^0-9]/g, ''), 10) || 0;

    let updateDebounceTimer = null;
    let isProcessingClick = false;

    function updateStats(immediate = false) {
        if (updateDebounceTimer) {
            clearTimeout(updateDebounceTimer);
            updateDebounceTimer = null;
        }

        if (!immediate) {
            updateDebounceTimer = setTimeout(() => updateStats(true), 50);
            return;
        }

        const balanceBtn = document.querySelector('.sidebar__user-balance');
        const balanceText = balanceBtn ? balanceBtn.textContent.trim() : '0';
        const currentCookies = parseInt(balanceText.replace(/[^0-9]/g, ''), 10) || 0;

        const existingStats = document.querySelector('.flavortown-goals-enhanced');
        const wasAccordionOpen = existingStats?.querySelector('.flavortown-goals-enhanced__accordion')?.open ?? true;
        if (existingStats) existingStats.remove();

        const wishlistData = localStorage.getItem('shop_wishlist');
        if (!wishlistData) return;

        let wishlist;
        try {
            wishlist = JSON.parse(wishlistData);
        } catch (e) {
            return;
        }

        const priorityData = localStorage.getItem('shop_wishlist_priorities');
        const orderData = localStorage.getItem('shop_wishlist_order');
        const priorities = priorityData ? JSON.parse(priorityData) : [];
        const customOrder = orderData ? JSON.parse(orderData) : [];

        const goals = Object.entries(wishlist).map(([id, g]) => ({ ...g, id, price: Math.ceil(g.price || 0) }));
        if (goals.length === 0) return;

        const goalsWithQty = goals.map(g => ({
            ...g,
            quantity: g.quantity || 1,
            totalCost: (g.quantity || 1) * g.price,
            remaining: Math.max(0, ((g.quantity || 1) * g.price) - currentCookies),
            hoursNeeded: Math.ceil(Math.max(0, ((g.quantity || 1) * g.price) - currentCookies) / 10),
            isPriority: priorities.includes(g.id),
            hasAccessories: (g.accessories || []).length > 0
        }));

        goalsWithQty.sort((a, b) => {
            const orderA = customOrder.indexOf(a.id);
            const orderB = customOrder.indexOf(b.id);
            if (orderA !== -1 && orderB !== -1) return orderA - orderB;
            if (orderA !== -1) return -1;
            if (orderB !== -1) return 1;

            if (a.isPriority !== b.isPriority) return b.isPriority - a.isPriority;
            if (a.hasAccessories !== b.hasAccessories) return b.hasAccessories - a.hasAccessories;
            return a.name.localeCompare(b.name);
        });

        const totalGoals = goalsWithQty.length;
        const totalCookiesNeeded = goalsWithQty.reduce((sum, g) => sum + g.totalCost, 0);
        const cookiesRemaining = Math.max(0, totalCookiesNeeded - currentCookies);
        const hoursNeeded = Math.ceil(cookiesRemaining / 10);
        const progressPercent = totalCookiesNeeded > 0 ? Math.min(100, (currentCookies / totalCookiesNeeded) * 100) : 0;

        const progressMode = localStorage.getItem('flavortown_progress_mode') || 'individual';
        let runningTotal = 0;
        goalsWithQty.forEach(g => {
            if (progressMode === 'cumulative') {
                const availableForThis = Math.max(0, currentCookies - runningTotal);
                g.displayProgress = g.totalCost > 0 ? Math.min(100, (availableForThis / g.totalCost) * 100) : 100;
                runningTotal += g.totalCost;
            } else {
                g.displayProgress = g.totalCost > 0 ? Math.min(100, (currentCookies / g.totalCost) * 100) : 100;
            }
        });

        const priorityGoals = goalsWithQty.filter(g => g.isPriority);
        const priorityCookiesNeeded = priorityGoals.reduce((sum, g) => sum + g.totalCost, 0);
        const priorityRemaining = Math.max(0, priorityCookiesNeeded - currentCookies);
        const priorityHours = Math.ceil(priorityRemaining / 10);
        const priorityProgress = priorityCookiesNeeded > 0 ? Math.min(100, (currentCookies / priorityCookiesNeeded) * 100) : 0;

        const generateCardHtml = (g) => {
            const baseItemName = g.name.split(' (')[0];
            const accessories = g.accessories || [];
            const priorityClass = g.isPriority ? 'goal-item--priority' : '';
            const compactClass = !g.hasAccessories ? 'goal-item--compact' : '';
            const canAfford = g.remaining === 0;

            const accessoriesHtml = accessories.length > 0 ? `
                <div class="goal-item__accessories-row">
                    ${accessories.map((acc, idx) => `
                        <span class="goal-item__acc-pill" title="${acc.name}: 🍪${acc.price}">
                            + ${acc.name.length > 8 ? acc.name.slice(0, 8) + '…' : acc.name}
                            <button class="goal-item__acc-remove" data-goal-id="${g.id}" data-acc-idx="${idx}">×</button>
                        </span>
                    `).join('')}
                </div>
            ` : '';

            const statsHtml = canAfford
                ? '<span class="goal-item__affordable">✓</span>'
                : `<span class="goal-item__stats-compact">🍪${g.remaining.toLocaleString()}</span><span class="goal-item__time-compact">⏱${g.hoursNeeded}h</span>`;

            const itemProgress = g.displayProgress;
            let progressState = 'high';
            if (itemProgress < 30) progressState = 'low';
            else if (itemProgress < 70) progressState = 'mid';

            if (!g.hasAccessories) {
                return `
                    <div class="flavortown-goal-item goal-item ${priorityClass} ${compactClass}" 
                         data-goal-id="${g.id}" draggable="true" style="--progress: ${itemProgress}%" data-progress-state="${progressState}">
                        <span class="goal-item__drag-handle">⋮⋮</span>
                        <img src="${g.image}" alt="${baseItemName}" class="goal-item__img-compact">
                        <span class="goal-item__name-compact">${baseItemName}</span>
                        ${statsHtml}
                        <div class="goal-item__qty-compact">
                            <button class="goal-item__qty-btn-sm" data-action="decrease" data-goal-id="${g.id}">−</button>
                            <span>${g.quantity}</span>
                            <button class="goal-item__qty-btn-sm" data-action="increase" data-goal-id="${g.id}">+</button>
                        </div>
                        <button class="goal-item__priority-btn ${g.isPriority ? 'is-active' : ''}" data-goal-id="${g.id}" title="Toggle priority">⭐</button>
                        <button class="goal-item__remove-compact" data-goal-id="${g.id}" title="Remove">×</button>
                    </div>
                `;
            }

            const manyAccessories = accessories.length >= 4 ? 'goal-item--wide' : '';
            return `
                <div class="flavortown-goal-item goal-item ${priorityClass} ${manyAccessories}" 
                     data-goal-id="${g.id}" draggable="true" style="--progress: ${itemProgress}%" data-progress-state="${progressState}">
                    <span class="goal-item__drag-handle">⋮⋮</span>
                    <img src="${g.image}" alt="${baseItemName}" class="goal-item__img-compact">
                    <span class="goal-item__name-compact">${baseItemName}</span>
                    ${accessoriesHtml}
                    ${statsHtml}
                    <div class="goal-item__qty-compact">
                        <button class="goal-item__qty-btn-sm" data-action="decrease" data-goal-id="${g.id}">−</button>
                        <span>${g.quantity}</span>
                        <button class="goal-item__qty-btn-sm" data-action="increase" data-goal-id="${g.id}">+</button>
                    </div>
                    <button class="goal-item__priority-btn ${g.isPriority ? 'is-active' : ''}" data-goal-id="${g.id}" title="Toggle priority">⭐</button>
                    <button class="goal-item__remove-compact" data-goal-id="${g.id}" title="Remove">×</button>
                </div>
            `;
        };

        const itemsHtml = goalsWithQty.map(generateCardHtml).join('');

        const prioritySectionHtml = priorityGoals.length > 0 ? `
            <div class="flavortown-priority-section">
                <div class="flavortown-priority-section__header">
                    <span class="flavortown-priority-section__title">🎯 Priority Goals</span>
                    <span class="flavortown-priority-section__count">${priorityGoals.length} items</span>
                </div>
                <div class="flavortown-priority-section__progress">
                    <div class="flavortown-priority-section__progress-bar">
                        <div class="flavortown-priority-section__progress-fill" style="width: ${priorityProgress}%"></div>
                    </div>
                    <span class="flavortown-priority-section__pct">${Math.round(priorityProgress)}%</span>
                </div>
                <div class="flavortown-priority-section__stats">
                    <span>🍪 ${currentCookies.toLocaleString()}/${priorityCookiesNeeded.toLocaleString()}</span>
                    <span>📍 ${priorityRemaining.toLocaleString()} remaining</span>
                    <span>⏱ ~${priorityHours}h</span>
                </div>
                <div class="flavortown-priority-section__pills">
                    ${priorityGoals.map(g => {
            const qtyText = g.quantity > 1 ? ` x${g.quantity}` : '';
            const cookiesText = g.remaining > 0 ? ` 🍪${g.remaining.toLocaleString()}` : ' ✓';
            return `<span class="flavortown-priority-pill" data-goal-id="${g.id}">${g.name.split(' (')[0]}${qtyText}${cookiesText}</span>`;
        }).join('')}
                </div>
            </div>
        ` : '';

        const statsHtml = `
            <div class="flavortown-goals-enhanced">
                <div class="flavortown-goals-enhanced__progress">
                    <div class="flavortown-goals-enhanced__progress-bar">
                        <div class="flavortown-goals-enhanced__progress-fill" style="width: ${progressPercent}%"></div>
                    </div>
                    <span class="flavortown-goals-enhanced__pct">${Math.round(progressPercent)}%</span>
                </div>
                <div class="flavortown-goals-enhanced__cards">
                    <div class="flavortown-goals-enhanced__card">
                        <span class="flavortown-goals-enhanced__card-label">Goals</span>
                        <span class="flavortown-goals-enhanced__card-value">🎯 ${totalGoals}</span>
                    </div>
                    <div class="flavortown-goals-enhanced__card">
                        <span class="flavortown-goals-enhanced__card-label">Progress</span>
                        <span class="flavortown-goals-enhanced__card-value">🍪 ${currentCookies.toLocaleString()}/${totalCookiesNeeded.toLocaleString()}</span>
                    </div>
                    <div class="flavortown-goals-enhanced__card flavortown-goals-enhanced__card--danger">
                        <span class="flavortown-goals-enhanced__card-label">Remaining</span>
                        <span class="flavortown-goals-enhanced__card-value">🍪 ${cookiesRemaining.toLocaleString()}</span>
                    </div>
                    <div class="flavortown-goals-enhanced__card flavortown-goals-enhanced__card--success">
                        <span class="flavortown-goals-enhanced__card-label">Time Est.</span>
                        <span class="flavortown-goals-enhanced__card-value">⏱ ~${hoursNeeded}h</span>
                    </div>
                </div>
                ${prioritySectionHtml}
                <details class="flavortown-goals-enhanced__accordion" open>
                    <summary class="flavortown-goals-enhanced__accordion-header">
                        <div class="flavortown-accordion-inner">
                            <span class="flavortown-accordion-title">Goal Items</span>
                            <button class="flavortown-progress-mode-toggle" title="${progressMode === 'cumulative' ? 'Cumulative: fills in order' : 'Individual: each item independent'}">
                                ${progressMode === 'cumulative' ? '📊' : '📈'}
                            </button>
                            <span class="flavortown-goals-enhanced__accordion-icon">▼</span>
                        </div>
                    </summary>
                    <div class="flavortown-goals-enhanced__accordion-content">
                        ${itemsHtml}
                    </div>
                </details>
            </div>
        `;

        const container = document.querySelector('.shop-goals__container');
        if (container) {
            const titleEl = container.querySelector('.shop-goals__title');
            const existingItems = container.querySelector('.shop-goals__items');
            if (existingItems) existingItems.style.display = 'none';

            if (titleEl) {
                titleEl.insertAdjacentHTML('afterend', statsHtml);

                const newAccordion = container.querySelector('.flavortown-goals-enhanced__accordion');
                if (newAccordion) {
                    newAccordion.open = wasAccordionOpen;
                }
            }

            setupDragAndDrop();
        }
    }

    function setupDragAndDrop() {
        const container = document.querySelector('.flavortown-goals-enhanced__accordion-content');
        if (!container) return;

        let draggedEl = null;

        container.querySelectorAll('.flavortown-goal-item').forEach(item => {
            item.addEventListener('dragstart', (e) => {
                draggedEl = item;
                item.classList.add('is-dragging');
                e.dataTransfer.effectAllowed = 'move';
            });

            item.addEventListener('dragend', () => {
                item.classList.remove('is-dragging');
                draggedEl = null;
                saveOrder();
            });

            item.addEventListener('dragover', (e) => {
                e.preventDefault();
                if (!draggedEl || draggedEl === item) return;
                const rect = item.getBoundingClientRect();
                const midY = rect.top + rect.height / 2;
                if (e.clientY < midY) {
                    container.insertBefore(draggedEl, item);
                } else {
                    container.insertBefore(draggedEl, item.nextSibling);
                }
            });
        });

        function saveOrder() {
            const items = container.querySelectorAll('.flavortown-goal-item');
            const order = Array.from(items).map(el => el.dataset.goalId);
            localStorage.setItem('shop_wishlist_order', JSON.stringify(order));
            updateStats(true);
        }
    }

    function addQtyControlsToCards() {
        document.querySelectorAll('.shop-item-card').forEach(card => {
            const shopId = card.dataset.shopId;
            if (!shopId) return;

            const wishlistData = localStorage.getItem('shop_wishlist');
            let wishlist = {};
            try {
                wishlist = JSON.parse(wishlistData) || {};
            } catch (e) { }

            const isInGoals = !!wishlist[shopId];
            const existingQty = card.querySelector('.flavortown-card-qty');
            const starBtn = card.querySelector('.shop-item-card__star');

            if (!isInGoals) {
                if (existingQty) existingQty.remove();
                if (starBtn) starBtn.style.display = '';
                return;
            }

            if (starBtn) starBtn.style.display = 'none';

            if (existingQty) {
                const valEl = existingQty.querySelector('.flavortown-card-qty__val');
                if (valEl) valEl.textContent = wishlist[shopId]?.quantity || 1;
                return;
            }

            const qty = wishlist[shopId]?.quantity || 1;

            const qtyHtml = `
                <div class="flavortown-card-qty">
                    <button class="flavortown-card-qty__btn" data-action="minus" data-shop-id="${shopId}">−</button>
                    <span class="flavortown-card-qty__val">${qty}</span>
                    <button class="flavortown-card-qty__btn" data-action="plus" data-shop-id="${shopId}">+</button>
                </div>
            `;
            card.insertAdjacentHTML('afterbegin', qtyHtml);
        });
    }

    function handleQtyClick(e) {
        const progressModeToggle = e.target.closest('.flavortown-progress-mode-toggle');
        if (progressModeToggle) {
            e.preventDefault();
            e.stopPropagation();
            const currentMode = localStorage.getItem('flavortown_progress_mode') || 'individual';
            const newMode = currentMode === 'cumulative' ? 'individual' : 'cumulative';
            localStorage.setItem('flavortown_progress_mode', newMode);
            updateStats(true);
            return;
        }

        if (e.target.closest('.flavortown-goals-enhanced__accordion-header') ||
            e.target.closest('summary')) {
            return;
        }

        console.log('handleQtyClick fired', e.target, e.target.className);

        const removeBtn = e.target.closest('.goal-item__remove');
        if (removeBtn) {
            e.preventDefault();
            e.stopPropagation();
            const goalId = removeBtn.dataset.goalId;
            console.log('Removing goal:', goalId);
            const stored = localStorage.getItem('shop_wishlist');
            if (stored) {
                const data = JSON.parse(stored);
                delete data[goalId];
                localStorage.setItem('shop_wishlist', JSON.stringify(data));
                updateStats(true);
                addQtyControlsToCards();
            }
            return;
        }

        const qtyBtn = e.target.closest('.goal-item__qty-btn');
        if (qtyBtn) {
            e.preventDefault();
            e.stopPropagation();
            const goalId = qtyBtn.dataset.goalId;
            const action = qtyBtn.dataset.action;
            console.log('Qty button clicked:', action, 'for goal:', goalId);
            const stored = localStorage.getItem('shop_wishlist');
            if (stored) {
                const data = JSON.parse(stored);
                if (data[goalId]) {
                    const currentQty = data[goalId].quantity || 1;
                    if (action === 'increase') {
                        data[goalId].quantity = currentQty + 1;
                    } else if (action === 'decrease' && currentQty > 1) {
                        data[goalId].quantity = currentQty - 1;
                    }
                    localStorage.setItem('shop_wishlist', JSON.stringify(data));
                    updateStats(true);
                    addQtyControlsToCards();
                }
            }
            return;
        }

        const accRemoveBtn = e.target.closest('.goal-item__accessory-remove');
        if (accRemoveBtn) {
            e.preventDefault();
            e.stopPropagation();
            const goalId = accRemoveBtn.dataset.goalId;
            const accIdx = parseInt(accRemoveBtn.dataset.accIdx, 10);
            console.log('Removing accessory:', accIdx, 'from goal:', goalId);
            const stored = localStorage.getItem('shop_wishlist');
            if (stored) {
                const data = JSON.parse(stored);
                if (data[goalId] && data[goalId].accessories) {
                    const removedAcc = data[goalId].accessories[accIdx];
                    data[goalId].accessories.splice(accIdx, 1);
                    if (removedAcc) {
                        data[goalId].price = (data[goalId].price || 0) - removedAcc.price;
                    }
                    localStorage.setItem('shop_wishlist', JSON.stringify(data));
                    updateStats(true);
                    addQtyControlsToCards();
                }
            }
            return;
        }

        const accPillRemove = e.target.closest('.goal-item__acc-remove');
        if (accPillRemove) {
            e.preventDefault();
            e.stopPropagation();
            const goalId = accPillRemove.dataset.goalId;
            const accIdx = parseInt(accPillRemove.dataset.accIdx, 10);
            const stored = localStorage.getItem('shop_wishlist');
            if (stored) {
                const data = JSON.parse(stored);
                if (data[goalId] && data[goalId].accessories) {
                    const removedAcc = data[goalId].accessories[accIdx];
                    data[goalId].accessories.splice(accIdx, 1);
                    if (removedAcc) {
                        data[goalId].price = (data[goalId].price || 0) - removedAcc.price;
                    }
                    localStorage.setItem('shop_wishlist', JSON.stringify(data));
                    updateStats(true);
                }
            }
            return;
        }

        const priorityBtn = e.target.closest('.goal-item__priority-btn');
        if (priorityBtn) {
            e.preventDefault();
            e.stopPropagation();
            const goalId = priorityBtn.dataset.goalId;
            const priorityData = localStorage.getItem('shop_wishlist_priorities');
            let priorities = priorityData ? JSON.parse(priorityData) : [];

            if (priorities.includes(goalId)) {
                priorities = priorities.filter(id => id !== goalId);
            } else {
                priorities.push(goalId);
            }

            localStorage.setItem('shop_wishlist_priorities', JSON.stringify(priorities));
            updateStats(true);
            return;
        }

        const removeCompact = e.target.closest('.goal-item__remove-compact');
        if (removeCompact) {
            e.preventDefault();
            e.stopPropagation();
            const goalId = removeCompact.dataset.goalId;
            const stored = localStorage.getItem('shop_wishlist');
            if (stored) {
                const data = JSON.parse(stored);
                delete data[goalId];
                localStorage.setItem('shop_wishlist', JSON.stringify(data));
                updateStats(true);
                addQtyControlsToCards();
            }
            return;
        }

        const qtyBtnSm = e.target.closest('.goal-item__qty-btn-sm');
        if (qtyBtnSm) {
            e.preventDefault();
            e.stopPropagation();
            const goalId = qtyBtnSm.dataset.goalId;
            const action = qtyBtnSm.dataset.action;
            const stored = localStorage.getItem('shop_wishlist');
            if (stored) {
                const data = JSON.parse(stored);
                if (data[goalId]) {
                    const currentQty = data[goalId].quantity || 1;
                    if (action === 'increase') {
                        data[goalId].quantity = currentQty + 1;
                    } else if (action === 'decrease' && currentQty > 1) {
                        data[goalId].quantity = currentQty - 1;
                    }
                    localStorage.setItem('shop_wishlist', JSON.stringify(data));
                    updateStats(true);
                    addQtyControlsToCards();
                }
            }
            return;
        }

        const starBtn = e.target.closest('.flavortown-card-qty__star');
        if (starBtn) {
            e.preventDefault();
            e.stopPropagation();

            const shopId = starBtn.dataset.shopId;
            const stored = localStorage.getItem('shop_wishlist');
            if (!stored) return;

            const data = JSON.parse(stored);
            delete data[shopId];
            localStorage.setItem('shop_wishlist', JSON.stringify(data));

            updateStats();
            addQtyControlsToCards();
            return;
        }

        const btn = e.target.closest('.flavortown-card-qty__btn');
        if (!btn) return;

        e.preventDefault();
        e.stopPropagation();

        const shopId = btn.dataset.shopId;
        const isPlus = btn.dataset.action === 'plus';

        const stored = localStorage.getItem('shop_wishlist');
        if (!stored) return;

        const data = JSON.parse(stored);
        if (!data[shopId]) return;

        const currentQty = data[shopId].quantity || 1;

        if (!isPlus && currentQty <= 1) {
            const card = btn.closest('.shop-item-card');
            const originalStar = card?.querySelector('.shop-item-card__star');
            if (originalStar) {
                originalStar.style.display = '';
                originalStar.click();
            }
            return;
        }

        const newQty = isPlus ? currentQty + 1 : currentQty - 1;
        data[shopId].quantity = newQty;

        localStorage.setItem('shop_wishlist', JSON.stringify(data));

        const card = btn.closest('.shop-item-card');
        if (card) {
            const valEl = card.querySelector('.flavortown-card-qty__val');
            if (valEl) valEl.textContent = newQty;
        }

        updateStats();
    }

    if (!window.__flavortownShopQtyListener) {
        document.addEventListener('click', handleQtyClick);
        window.__flavortownShopQtyListener = true;
    }

    updateStats();
    addQtyControlsToCards();

    if (!window.__flavortownGoalsObserver) {
        const shopGrid = document.querySelector('.shop-items') || document.body;
        const observer = new MutationObserver(() => {
            setTimeout(() => {
                updateStats();
                addQtyControlsToCards();
            }, 100);
        });
        observer.observe(shopGrid, { childList: true, subtree: true });
        window.__flavortownGoalsObserver = observer;

        window.addEventListener('storage', (e) => {
            if (e.key === 'shop_wishlist') {
                updateStats();
                addQtyControlsToCards();
            }
        });
    }
}

async function initShopAccessories() {
    if (!window.location.pathname.startsWith('/shop') || window.location.pathname.includes('/order')) {
        return;
    }
    if (window.__shopAccessoriesInit) return;
    window.__shopAccessoriesInit = true;

    const shopCards = document.querySelectorAll('.shop-item-card[data-shop-id]');
    if (!shopCards.length) return;

    const cacheKey = 'flavortown-accessories-cache';
    const selectionsKey = 'flavortown-accessory-selections';
    let cache = {};
    let selections = {};

    try {
        cache = JSON.parse(localStorage.getItem(cacheKey) || '{}');
        selections = JSON.parse(localStorage.getItem(selectionsKey) || '{}');
    } catch (e) {
        cache = {};
        selections = {};
    }

    const itemsToFetch = [];
    shopCards.forEach(card => {
        const shopId = card.dataset.shopId;
        if (!cache[shopId]) {
            itemsToFetch.push(shopId);
        }
    });

    if (itemsToFetch.length > 0) {
        await Promise.all(itemsToFetch.map(async (shopId) => {
            try {
                const response = await fetch(`/shop/order?shop_item_id=${shopId}`, { headers: { 'X-Flavortown-Ext-135': 'true' } });
                const html = await response.text();
                const parser = new DOMParser();
                const doc = parser.parseFromString(html, 'text/html');

                const accessoryGroups = [];
                doc.querySelectorAll('.shop-order__accessory-group-section').forEach(section => {
                    const title = section.querySelector('h5')?.textContent?.trim() || 'Options';
                    const options = [];
                    section.querySelectorAll('.shop-order__accessory-option-label').forEach(label => {
                        const input = label.querySelector('input');
                        const nameEl = label.querySelector('.shop-order__accessory-option-name');
                        const priceEl = label.querySelector('.shop-order__accessory-option-price');
                        if (input && nameEl) {
                            options.push({
                                id: input.value,
                                name: nameEl.textContent.trim(),
                                price: parseFloat(input.dataset.price || 0),
                                priceText: priceEl?.textContent?.trim() || ''
                            });
                        }
                    });
                    if (options.length > 0) {
                        accessoryGroups.push({ title, options });
                    }
                });

                cache[shopId] = { groups: accessoryGroups, cachedAt: Date.now() };
            } catch (e) {
                console.error('Failed to fetch accessories for item', shopId, e);
            }
        }));

        localStorage.setItem(cacheKey, JSON.stringify(cache));
    }

    shopCards.forEach(card => {
        const shopId = card.dataset.shopId;
        const itemData = cache[shopId];
        if (!itemData || !itemData.groups || itemData.groups.length === 0) return;
        if (card.querySelector('.shop-item-card__accessories-toggle')) return;

        const orderButton = card.querySelector('.shop-item-card__order-button');
        if (!orderButton) return;

        const basePrice = parseFloat(card.dataset.shopWishlistItemPriceValue || 0);

        const wishlistData = localStorage.getItem('shop_wishlist');
        let wishlist = {};
        try { wishlist = JSON.parse(wishlistData) || {}; } catch (e) { }

        let itemSelections = selections[shopId] || {};
        const isInGoals = !!wishlist[shopId];

        if (isInGoals && wishlist[shopId].accessories) {
            wishlist[shopId].accessories.forEach(acc => {
                itemData.groups.forEach(group => {
                    const opt = group.options.find(o => o.price === acc.price && o.name === acc.name);
                    if (opt) {
                        itemSelections[group.title] = opt.id;
                    }
                });
            });
            selections[shopId] = itemSelections;
        }

        const toggleBtn = document.createElement('button');
        toggleBtn.className = 'shop-item-card__accessories-toggle';
        toggleBtn.innerHTML = `<span>⚙️ Accessories</span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"/></svg>`;

        const panel = document.createElement('div');
        panel.className = 'shop-item-card__accessories-panel';

        let panelHTML = '';
        itemData.groups.forEach(group => {
            panelHTML += `<div class="shop-item-card__accessory-group">
                <div class="shop-item-card__accessory-group-title">${group.title}</div>
                <div class="shop-item-card__accessory-chips">`;
            group.options.forEach(opt => {
                const isSelected = itemSelections[group.title] === opt.id;
                panelHTML += `<button class="shop-item-card__accessory-chip ${isSelected ? 'is-selected' : ''}" 
                    data-group="${group.title}" data-id="${opt.id}" data-price="${opt.price}">
                    ${opt.name} ${opt.priceText ? `(${opt.priceText})` : ''}
                </button>`;
            });
            panelHTML += `</div></div>`;
        });

        const calculateTotal = () => {
            let total = basePrice;
            Object.values(itemSelections).forEach(optId => {
                itemData.groups.forEach(g => {
                    const opt = g.options.find(o => o.id === optId);
                    if (opt) total += opt.price;
                });
            });
            return total;
        };

        const buttonText = isInGoals ? '🔄 Update Goal Accessories' : '⭐ Add with Accessories to Goals';

        panelHTML += `<div class="shop-item-card__total-price">
            <span>Total:</span>
            <span class="total-value">🍪${calculateTotal().toLocaleString()}</span>
        </div>
        <button class="shop-item-card__add-to-goals" type="button">${buttonText}</button>`;
        panel.innerHTML = panelHTML;

        toggleBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleBtn.classList.toggle('is-expanded');
            panel.classList.toggle('is-expanded');
        });

        panel.querySelectorAll('.shop-item-card__accessory-chip').forEach(chip => {
            chip.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const group = chip.dataset.group;
                const id = chip.dataset.id;

                panel.querySelectorAll(`.shop-item-card__accessory-chip[data-group="${group}"]`).forEach(c => {
                    c.classList.remove('is-selected');
                });

                if (itemSelections[group] === id) {
                    delete itemSelections[group];
                } else {
                    itemSelections[group] = id;
                    chip.classList.add('is-selected');
                }

                selections[shopId] = itemSelections;
                localStorage.setItem(selectionsKey, JSON.stringify(selections));

                const totalEl = panel.querySelector('.total-value');
                if (totalEl) {
                    totalEl.textContent = `🍪${calculateTotal().toLocaleString()}`;
                }

                const wishlistBtn = card.querySelector('[data-shop-wishlist-item-price-value]');
                if (wishlistBtn) {
                    wishlistBtn.dataset.shopWishlistItemPriceValue = calculateTotal();
                }
            });
        });

        const addToGoalsBtn = panel.querySelector('.shop-item-card__add-to-goals');
        if (addToGoalsBtn) {
            addToGoalsBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();

                const selectedAccessoriesData = [];
                Object.entries(itemSelections).forEach(([group, optId]) => {
                    itemData.groups.forEach(g => {
                        if (g.title === group) {
                            const opt = g.options.find(o => o.id === optId);
                            if (opt) {
                                selectedAccessoriesData.push({
                                    name: opt.name,
                                    price: opt.price
                                });
                            }
                        }
                    });
                });

                const currentWishlistData = localStorage.getItem('shop_wishlist');
                let currentWishlist = {};
                try { currentWishlist = JSON.parse(currentWishlistData) || {}; } catch (e) { }

                if (currentWishlist[shopId]) {
                    currentWishlist[shopId].accessories = selectedAccessoriesData;
                    currentWishlist[shopId].basePrice = basePrice;
                    currentWishlist[shopId].price = calculateTotal();
                    localStorage.setItem('shop_wishlist', JSON.stringify(currentWishlist));

                    window.dispatchEvent(new Event('storage'));

                    addToGoalsBtn.textContent = '✅ Updated!';
                    setTimeout(() => {
                        addToGoalsBtn.textContent = '🔄 Update Goal Accessories';
                    }, 2000);
                } else {
                    const starBtn = card.querySelector('[data-action*="shop-wishlist#toggle"]');
                    if (starBtn) {
                        starBtn.click();
                        setTimeout(() => {
                            const newWishlistData = localStorage.getItem('shop_wishlist');
                            try {
                                const newWishlist = JSON.parse(newWishlistData) || {};
                                if (newWishlist[shopId]) {
                                    newWishlist[shopId].accessories = selectedAccessoriesData;
                                    newWishlist[shopId].basePrice = basePrice;
                                    newWishlist[shopId].price = calculateTotal();
                                    localStorage.setItem('shop_wishlist', JSON.stringify(newWishlist));
                                    window.dispatchEvent(new Event('storage'));
                                }
                            } catch (err) { }
                        }, 100);

                        addToGoalsBtn.textContent = '✅ Added to Goals!';
                        setTimeout(() => {
                            addToGoalsBtn.textContent = '🔄 Update Goal Accessories';
                        }, 2000);
                    }
                }
            });
        }

        const wrapper = document.createElement('div');
        wrapper.className = 'shop-item-card__accessories-wrapper';
        wrapper.appendChild(toggleBtn);
        wrapper.appendChild(panel);

        orderButton.before(wrapper);
    });
}

function addShopCardEfficiency() {
    if (window.location.pathname !== '/shop') return;

    const balanceBtn = document.querySelector('.sidebar__user-balance');
    const currentCookies = balanceBtn ? parseInt(balanceBtn.textContent.replace(/[^0-9]/g, ''), 10) || 0 : 0;

    const defaultRate = 10;
    const rates = [10, 20, 25];

    document.querySelectorAll('.shop-item-card[data-shop-id]').forEach(card => {
        if (card.querySelector('.flavortown-efficiency')) return;

        const price = Math.ceil(parseFloat(card.dataset.shopWishlistItemPriceValue) || 0);
        if (price === 0) return;

        const remaining = Math.max(0, price - currentCookies);
        const progress = price > 0 ? Math.min(100, (currentCookies / price) * 100) : 0;
        const canAfford = currentCookies >= price;

        const efficiencyDiv = document.createElement('div');
        efficiencyDiv.className = 'flavortown-efficiency';

        const progressColor = canAfford ? '#48bb78' : '#ed8936';

        if (canAfford) {
            efficiencyDiv.innerHTML = `
                <div class="flavortown-efficiency__progress-bar">
                    <div class="flavortown-efficiency__progress-fill" style="width: 100%; background: ${progressColor}"></div>
                </div>
                <div class="flavortown-efficiency__row">
                    <span class="flavortown-efficiency__cookies">🍪 ${currentCookies}/${price}</span>
                    <span class="flavortown-efficiency__affordable">✅ You can afford this!</span>
                </div>
            `;
        } else {
            efficiencyDiv.innerHTML = `
                <div class="flavortown-efficiency__progress-bar">
                    <div class="flavortown-efficiency__progress-fill" style="width: ${progress}%; background: ${progressColor}"></div>
                </div>
                <div class="flavortown-efficiency__row">
                    <span class="flavortown-efficiency__cookies">🍪 ${currentCookies}/${price}</span>
                    <span class="flavortown-efficiency__need">Need <strong>${remaining}</strong> more</span>
                </div>
                <details class="flavortown-efficiency__accordion">
                    <summary class="flavortown-efficiency__accordion-toggle">⏱️ Time Calculator</summary>
                    <div class="flavortown-efficiency__accordion-content">
                        <div class="flavortown-efficiency__rates">
                            ${rates.map(rate => {
                const hours = (remaining / rate).toFixed(1);
                return `<div class="flavortown-efficiency__rate">
                                    <span class="flavortown-efficiency__rate-val">${rate}</span>
                                    <span class="flavortown-efficiency__rate-time">${hours}h</span>
                                </div>`;
            }).join('')}
                        </div>
                        <div class="flavortown-efficiency__slider-row">
                            <input type="range" class="flavortown-efficiency__slider" min="1" max="30" value="${defaultRate}">
                            <span class="flavortown-efficiency__slider-label"><span class="flavortown-efficiency__custom-rate">${defaultRate}</span> 🍪/h = <span class="flavortown-efficiency__custom-time">${(remaining / defaultRate).toFixed(1)}</span>h</span>
                        </div>
                    </div>
                </details>
            `;
        }

        const cardContent = card.querySelector('.shop-item-card__content') || card;
        cardContent.appendChild(efficiencyDiv);

        const slider = efficiencyDiv.querySelector('.flavortown-efficiency__slider');
        const sliderRow = efficiencyDiv.querySelector('.flavortown-efficiency__slider-row');
        const accordion = efficiencyDiv.querySelector('.flavortown-efficiency__accordion');
        const accordionToggle = efficiencyDiv.querySelector('.flavortown-efficiency__accordion-toggle');

        if (accordion) {
            accordion.addEventListener('click', (e) => e.stopPropagation());
        }
        if (accordionToggle) {
            accordionToggle.addEventListener('click', (e) => e.stopPropagation());
        }

        if (sliderRow) {
            ['mousedown', 'mousemove', 'mouseup', 'click', 'touchstart', 'touchmove', 'touchend'].forEach(evt => {
                sliderRow.addEventListener(evt, (e) => {
                    e.stopPropagation();
                    if (evt === 'click') e.preventDefault();
                });
            });
        }

        if (slider) {
            const itemRemaining = remaining;
            slider.addEventListener('input', function (e) {
                e.stopPropagation();
                const rate = parseInt(e.target.value, 10);
                const rateEl = efficiencyDiv.querySelector('.flavortown-efficiency__custom-rate');
                const timeEl = efficiencyDiv.querySelector('.flavortown-efficiency__custom-time');
                if (rateEl) rateEl.textContent = rate;
                if (timeEl) timeEl.textContent = (itemRemaining / rate).toFixed(1);
            });
        }
    });
}

const ACHIEVEMENT_STORAGE_KEY = 'flavortown_known_achievements';
const ACHIEVEMENT_CHECK_INTERVAL = 12 * 60 * 60 * 1000;
const ACHIEVEMENT_LAST_CHECK_KEY = 'flavortown_last_achievement_check';

function showAchievementToast(achievements, totalCookies, isWelcome = false) {
    const existingToast = document.querySelector('.flavortown-achievement-toast');
    if (existingToast) existingToast.remove();

    const names = achievements.map(a => a.name).join(', ');
    const title = isWelcome
        ? '🎉 Welcome! I collected your achievements: (or these are your already collected ones)'
        : '🏆 Achievements earned while you were away:';

    const toast = document.createElement('div');
    toast.className = 'flavortown-achievement-toast';
    toast.innerHTML = `
        <div class="flavortown-achievement-toast__content">
            <div class="flavortown-achievement-toast__title">${title}</div>
            <div class="flavortown-achievement-toast__names">${names}</div>
            ${totalCookies > 0 ? `<div class="flavortown-achievement-toast__cookies">🍪 +${totalCookies} cookies</div>` : ''}
        </div>
        <button class="flavortown-achievement-toast__close">×</button>
    `;

    document.body.appendChild(toast);

    requestAnimationFrame(() => {
        toast.classList.add('is-visible');
    });
    toast.querySelector('.flavortown-achievement-toast__close').addEventListener('click', () => {
        toast.classList.remove('is-visible');
        setTimeout(() => toast.remove(), 300);
    });

    setTimeout(() => {
        if (toast.parentNode) {
            toast.classList.remove('is-visible');
            setTimeout(() => toast.remove(), 300);
        }
    }, 8000);
}

function checkAchievements() {
    if (window.location.pathname.includes('/my/achievements')) return;

    const lastCheck = localStorage.getItem(ACHIEVEMENT_LAST_CHECK_KEY);
    const now = Date.now();
    if (lastCheck && (now - parseInt(lastCheck)) < ACHIEVEMENT_CHECK_INTERVAL) {
        return;
    }

    const iframe = document.createElement('iframe');
    iframe.style.cssText = 'position:absolute;width:1px;height:1px;left:-9999px;visibility:hidden;';
    iframe.src = 'https://flavortown.hackclub.com/my/achievements';

    iframe.onload = () => {
        setTimeout(() => {
            try {
                const doc = iframe.contentDocument || iframe.contentWindow.document;
                const earnedCards = doc.querySelectorAll('.achievements__card--earned');

                const currentAchievements = [];
                let totalNewCookies = 0;

                earnedCards.forEach(card => {
                    const slug = card.dataset.slug || card.id?.replace('achievement-', '') || '';
                    const name = card.querySelector('.achievements__name')?.textContent?.trim() || 'Unknown';
                    const rewardEl = card.querySelector('.achievements__reward');
                    let cookies = 0;
                    if (rewardEl) {
                        const match = rewardEl.textContent.match(/\+(\d+)/);
                        if (match) cookies = parseInt(match[1]);
                    }

                    currentAchievements.push({ slug, name, cookies });
                });

                const storedData = localStorage.getItem(ACHIEVEMENT_STORAGE_KEY);
                const knownSlugs = storedData ? JSON.parse(storedData) : null;

                if (knownSlugs === null) {
                    const achievementsWithRewards = currentAchievements.filter(a => a.cookies > 0);
                    if (achievementsWithRewards.length > 0) {
                        const totalCookies = achievementsWithRewards.reduce((sum, a) => sum + a.cookies, 0);
                        showAchievementToast(achievementsWithRewards, totalCookies, true);
                    }
                } else {
                    const newAchievements = currentAchievements.filter(a => !knownSlugs.includes(a.slug));
                    if (newAchievements.length > 0) {
                        const newWithRewards = newAchievements.filter(a => a.cookies > 0);
                        if (newWithRewards.length > 0) {
                            const totalCookies = newWithRewards.reduce((sum, a) => sum + a.cookies, 0);
                            showAchievementToast(newWithRewards, totalCookies, false);
                        } else if (newAchievements.length > 0) {
                            showAchievementToast(newAchievements, 0, false);
                        }
                    }
                }

                const allSlugs = currentAchievements.map(a => a.slug);
                localStorage.setItem(ACHIEVEMENT_STORAGE_KEY, JSON.stringify(allSlugs));
                localStorage.setItem(ACHIEVEMENT_LAST_CHECK_KEY, now.toString());

            } catch (e) {
                console.error('Flavortown: Failed to check achievements', e);
            } finally {
                iframe.remove();
            }
        }, 2000);
    };

    iframe.onerror = () => {
        console.error('Flavortown: Failed to load achievements iframe');
        iframe.remove();
    };

    document.body.appendChild(iframe);
}

function captureApiKey() {
    const apiKeyDisplay = document.querySelector('.api-key-display');
    if (!apiKeyDisplay) return;

    const keyText = apiKeyDisplay.textContent.trim();

    if (keyText && keyText !== 'No API Key, press generate' && keyText.length > 10) {
        localStorage.setItem('flavortown_api_key', keyText);
        return;
    }

    const hasTriedGenerate = sessionStorage.getItem('flavortown_api_key_auto_generate');
    if (hasTriedGenerate) return;

    const generateBtn = document.querySelector('.api-key-section form[action="/my/roll_api_key"] button');
    if (generateBtn) {
        sessionStorage.setItem('flavortown_api_key_auto_generate', 'true');
        setTimeout(() => {
            const form = generateBtn.closest('form');
            if (form) {
                form.requestSubmit();
            }
        }, 500);
    }
}

function addExploreSearch() {
    if (!window.location.pathname.startsWith('/explore')) return;
    if (document.querySelector('.flavortown-explore-search')) return;
    captureApiKey();

    const exploreNav = document.querySelector('.explore__nav');
    if (!exploreNav) return;

    const searchContainer = document.createElement('div');
    searchContainer.className = 'flavortown-explore-search';
    searchContainer.innerHTML = `
        <div class="flavortown-search-bar">
            <div class="flavortown-search-input-wrapper">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="flavortown-search-icon"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                <input type="text" class="flavortown-search-input" placeholder="Search projects..." />
            </div>
            <div class="flavortown-search-results" style="display: none;">
                <div class="flavortown-search-header">
                    <span class="flavortown-search-count"></span>
                    <button class="flavortown-search-close">✕ Clear</button>
                </div>
                <div class="flavortown-search-grid"></div>
                <div class="flavortown-search-loading" style="display: none;">Searching...</div>
                <div class="flavortown-search-error" style="display: none;"></div>
            </div>
        </div>
    `;

    exploreNav.after(searchContainer);

    const input = searchContainer.querySelector('.flavortown-search-input');
    const resultsContainer = searchContainer.querySelector('.flavortown-search-results');
    const resultsGrid = searchContainer.querySelector('.flavortown-search-grid');
    const loadingEl = searchContainer.querySelector('.flavortown-search-loading');
    const errorEl = searchContainer.querySelector('.flavortown-search-error');
    const countEl = searchContainer.querySelector('.flavortown-search-count');
    const closeBtn = searchContainer.querySelector('.flavortown-search-close');

    async function doSearch(query) {
        const apiKey = localStorage.getItem('flavortown_api_key');
        if (!apiKey) {
            errorEl.textContent = '⚠️ No API key found. Go to Settings and generate one.';
            errorEl.style.display = 'block';
            loadingEl.style.display = 'none';
            resultsContainer.style.display = 'block';
            return;
        }

        loadingEl.style.display = 'block';
        errorEl.style.display = 'none';
        resultsGrid.innerHTML = '';
        resultsContainer.style.display = 'block';

        try {
            const response = await fetch(`https://flavortown.hackclub.com/api/v1/projects?query=${encodeURIComponent(query)}&page=1`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Accept': 'application/json',
                    'X-Flavortown-Ext-135': 'true'
                }
            });

            if (!response.ok) {
                throw new Error(`API error: ${response.status}`);
            }

            const data = await response.json();
            console.log('Flavortown Search Response:', data);
            loadingEl.style.display = 'none';

            if (!data.projects || data.projects.length === 0) {
                countEl.textContent = 'No projects found';
                resultsGrid.innerHTML = '<p class="flavortown-search-empty">No matching projects found.</p>';
                return;
            }

            countEl.textContent = `${data.projects.length} project${data.projects.length !== 1 ? 's' : ''} found`;

            resultsGrid.innerHTML = data.projects.map(project => `
                <div class="flavortown-project-card">
                    <a href="/projects/${project.id}" class="flavortown-project-link">
                        <h4 class="flavortown-project-title">${project.title}</h4>
                        <p class="flavortown-project-desc">${project.description?.slice(0, 120) || ''}${project.description?.length > 120 ? '...' : ''}</p>
                    </a>
                    <div class="flavortown-project-actions">
                        ${project.demo_url ? `<a href="${project.demo_url}" target="_blank" class="flavortown-project-btn flavortown-project-btn--demo">🚀 Demo</a>` : ''}
                        ${project.repo_url ? `<a href="${project.repo_url}" target="_blank" class="flavortown-project-btn flavortown-project-btn--repo">📦 Repo</a>` : ''}
                    </div>
                </div>
            `).join('');

        } catch (err) {
            console.error('Flavortown: Search error', err);
            loadingEl.style.display = 'none';
            errorEl.textContent = `❌ Search failed: ${err.message}`;
            errorEl.style.display = 'block';
        }
    }

    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const query = input.value.trim();
            if (query) doSearch(query);
        }
    });

    closeBtn.addEventListener('click', () => {
        resultsContainer.style.display = 'none';
        resultsGrid.innerHTML = '';
        input.value = '';
    });
}

function initProjectBoardStats() {
    if (!window.location.pathname.endsWith('/projects')) return;

    const cards = document.querySelectorAll('.projects-board__grid-item .project-card');
    if (!cards.length) return;

    let stats = {};
    try {
        stats = JSON.parse(localStorage.getItem('flavortown_project_stats') || '{}');
    } catch (e) { }

    cards.forEach(card => {
        const id = card.id.replace('project_', '');
        const statLines = card.querySelectorAll('.project-card__stats h5');
        if (statLines.length < 2) return;

        const devlogText = statLines[0].textContent.trim();
        const timeText = statLines[1].textContent.trim();

        const devlogs = parseInt(devlogText) || 0;

        let minutes = 0;
        const hoursMatch = timeText.match(/(\d+)hr/);
        const minsMatch = timeText.match(/(\d+)min/);

        if (hoursMatch) minutes += parseInt(hoursMatch[1]) * 60;
        if (minsMatch) minutes += parseInt(minsMatch[1]);

        stats[id] = {
            devlogs,
            minutes,
            lastUpdated: Date.now()
        };
    });

    localStorage.setItem('flavortown_project_stats', JSON.stringify(stats));

    let totalProjects = Object.keys(stats).length;
    let totalDevlogs = 0;
    let totalMinutes = 0;

    Object.values(stats).forEach(s => {
        totalDevlogs += s.devlogs;
        totalMinutes += s.minutes;
    });

    const totalHours = Math.floor(totalMinutes / 60);

    let freqText = '';
    if (totalDevlogs > 0) {
        const avgMinsPerLog = Math.round(totalMinutes / totalDevlogs);
        const freqHrs = Math.floor(avgMinsPerLog / 60);
        const freqMins = avgMinsPerLog % 60;
        freqText = `${freqHrs}hr ${freqMins}min`;
    }

    const heading = document.querySelector('.projects-board__heading');
    if (heading && !document.querySelector('.flavortown-project-stats')) {
        const statsEl = document.createElement('div');
        statsEl.className = 'flavortown-project-stats';
        statsEl.innerHTML = `
            <div class="flavortown-stat-pill" title="Total Projects">
                📦 <span class="flavortown-stat-value">${totalProjects}</span> Projects
            </div>
            <div class="flavortown-stat-pill" title="Total Devlogs">
                📝 <span class="flavortown-stat-value">${totalDevlogs}</span> Devlogs
            </div>
            <div class="flavortown-stat-pill" title="Total Time Spent">
                ⏱ <span class="flavortown-stat-value">${totalHours}h ${totalMinutes % 60}m</span>
            </div>
            ${freqText ? `
            <div class="flavortown-stat-pill" title="Average time per devlog">
                1 📝 per <span class="flavortown-stat-value">${freqText}</span>
            </div>` : ''}
        `;
        heading.appendChild(statsEl);
    }
}

const UPDATE_CHECK_KEY = 'flavortown_last_update_check';
const UPDATE_CHECK_INTERVAL = 12 * 60 * 60 * 1000;

function compareVersions(v1, v2) {
    const p1 = v1.split('.').map(Number);
    const p2 = v2.split('.').map(Number);
    for (let i = 0; i < Math.max(p1.length, p2.length); i++) {
        const n1 = p1[i] || 0;
        const n2 = p2[i] || 0;
        if (n1 > n2) return 1;
        if (n1 < n2) return -1;
    }
    return 0;
}

function showUpdateToast(version, url, isStore) {
    const existingToast = document.querySelector('.flavortown-update-toast');
    if (existingToast) return;

    const toast = document.createElement('div');
    toast.className = 'flavortown-achievement-toast flavortown-update-toast';

    toast.style.cursor = 'default';

    const sourceText = isStore ? 'the Web Store' : 'GitHub Releases';
    const actionText = isStore ? 'View in Store' : 'Download Update';

    toast.innerHTML = `
        <div class="flavortown-achievement-toast__content">
            <div class="flavortown-achievement-toast__title">🚀 Update Available: v${version}</div>
            <div class="flavortown-achievement-toast__names">
                A new version is available on ${sourceText}.
                <div style="margin-top: 4px;">
                    <a href="${url}" target="_blank" style="color: inherit; text-decoration: underline; font-weight: bold;">${actionText}</a>
                </div>
            </div>
        </div>
        <button class="flavortown-achievement-toast__close">×</button>
    `;

    document.body.appendChild(toast);

    requestAnimationFrame(() => toast.classList.add('is-visible'));

    toast.querySelector('.flavortown-achievement-toast__close').addEventListener('click', () => {
        toast.classList.remove('is-visible');
        setTimeout(() => toast.remove(), 300);
    });
}

function checkForUpdates() {
    const lastCheck = localStorage.getItem(UPDATE_CHECK_KEY);
    const now = Date.now();

    if (lastCheck && (now - parseInt(lastCheck, 10) < UPDATE_CHECK_INTERVAL)) {
        return;
    }

    fetch('https://api.github.com/repos/hridaya423/flavortownutils/releases/latest')
        .then(r => r.json())
        .then(data => {
            localStorage.setItem(UPDATE_CHECK_KEY, now.toString());

            if (!data.tag_name) return;

            const latestVersion = data.tag_name.replace(/^v/, '');
            const currentVersion = browserAPI.runtime.getManifest().version;

            if (compareVersions(latestVersion, currentVersion) > 0) {
                const manifest = browserAPI.runtime.getManifest();
                const isStore = !!manifest.update_url;

                let updateUrl = data.html_url;

                if (isStore) {
                    if (navigator.userAgent.includes('Firefox')) {
                        updateUrl = 'https://addons.mozilla.org/en-US/firefox/search/?q=Flavortown+Utils';
                    } else if (navigator.userAgent.includes('Chrome')) {
                        updateUrl = 'https://chromewebstore.google.com/detail/flavortown-utils/fdacgialppflhglkinbiapaenfahhjge';
                    }
                }

                showUpdateToast(latestVersion, updateUrl, isStore);
            }
        })
        .catch(e => console.error('Flavortown update check failed:', e));
}

function init() {
    loadTheme();
    checkForUpdates();
    initPinnableSidebar();
    addDevlogFrequencyStat();
    inlineDevlogForm();
    enhanceShopGoals();
    initShopAccessories();
    addShopCardEfficiency();
    addExploreSearch();
    captureApiKey();
    initProjectBoardStats();
    addSkipButton();
    transformVotesTable();
    enhanceKitchenDashboard();

    setTimeout(checkAchievements, 2000);
}


function addSkipButton() {
    if (!document.querySelector('.votes-new')) return;

    if (document.querySelector('.votes-new__skip-btn')) return;

    const prevBtn = document.querySelector('.votes-new__prev-btn');
    if (!prevBtn) return;
    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'votes-new__action-row';
    buttonContainer.style.display = 'flex';
    buttonContainer.style.justifyContent = 'center';
    buttonContainer.style.alignItems = 'center';
    buttonContainer.style.gap = '12px';
    buttonContainer.style.marginBottom = '24px';
    buttonContainer.style.marginTop = '24px';

    prevBtn.parentNode.insertBefore(buttonContainer, prevBtn);

    buttonContainer.appendChild(prevBtn);

    prevBtn.style.setProperty('margin', '0', 'important');
    prevBtn.style.setProperty('display', 'inline-flex', 'important');
    prevBtn.style.setProperty('align-items', 'center', 'important');
    prevBtn.style.setProperty('width', 'auto', 'important');

    const skipBtn = document.createElement('a');
    skipBtn.className = 'btn btn--brown btn--borderless votes-new__skip-btn';
    skipBtn.style.cursor = 'pointer';
    skipBtn.title = 'Skip this project';
    skipBtn.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="13 17 18 12 13 7"></polyline>
            <polyline points="6 17 11 12 6 7"></polyline>
        </svg>
        Skip
    `;

    skipBtn.addEventListener('click', (e) => {
        e.preventDefault();
        window.location.reload();
    });

    buttonContainer.appendChild(skipBtn);

    skipBtn.style.setProperty('margin', '0', 'important');
}

function transformVotesTable() {
    if (!/\/votes\.\d+/.test(window.location.pathname)) return;

    const table = document.querySelector('table');
    if (!table || table.dataset.flavortownTransformed) return;
    table.dataset.flavortownTransformed = 'true';

    const tbody = table.querySelector('tbody');
    if (!tbody) return;

    const rows = Array.from(tbody.querySelectorAll('tr'));
    if (rows.length === 0) return;

    const projectVotes = {};
    rows.forEach(row => {
        const cells = row.querySelectorAll('td');
        if (cells.length < 4) return;

        const projectName = cells[0].textContent.trim();
        const category = cells[1].textContent.trim().toLowerCase();
        const score = cells[2].textContent.trim();
        const viewLink = cells[3].querySelector('a')?.href || '';

        if (!projectVotes[projectName]) {
            projectVotes[projectName] = {
                name: projectName,
                link: viewLink,
                originality: '-',
                technical: '-',
                usability: '-'
            };
        }

        if (category === 'originality') projectVotes[projectName].originality = score;
        else if (category === 'technical') projectVotes[projectName].technical = score;
        else if (category === 'usability') projectVotes[projectName].usability = score;
    });

    const thead = table.querySelector('thead');
    if (thead) {
        thead.innerHTML = `
            <tr>
                <th>Project</th>
                <th>Originality</th>
                <th>Technical</th>
                <th>Usability</th>
            </tr>
        `;
    }

    tbody.innerHTML = '';
    Object.values(projectVotes).forEach(project => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><a href="${project.link}">${project.name}</a></td>
            <td>${project.originality}</td>
            <td>${project.technical}</td>
            <td>${project.usability}</td>
        `;
        tbody.appendChild(row);
    });
}

async function enhanceKitchenDashboard() {
    if (window.location.pathname !== '/kitchen') return;
    if (document.querySelector('.flavortown-kitchen-dashboard')) return;

    const kitchenSetup = document.querySelector('.kitchen-setup');
    if (!kitchenSetup) return;

    const helpSection = document.querySelector('.kitchen-help');
    if (helpSection) helpSection.remove();

    try {
        const response = await fetch('/my/balance', {
            headers: {
                'Accept': 'text/html, application/xhtml+xml',
                'Turbo-Frame': 'balance_history',
                'X-Flavortown-Ext-135': 'true'
            }
        });
        const html = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');

        let rows = doc.querySelectorAll('.balance-history__table tbody tr');
        if (rows.length === 0) {
            rows = doc.querySelectorAll('table tbody tr');
        }

        const transactions = [];
        let currentBalance = 0;

        let balanceHeader = doc.querySelector('.balance-history__header h1');
        if (!balanceHeader) {
            balanceHeader = doc.querySelector('h1');
        }
        if (balanceHeader) {
            const match = balanceHeader.textContent.match(/(\d+)/);
            if (match) currentBalance = parseInt(match[1], 10);
        }

        rows.forEach(row => {
            const cells = row.querySelectorAll('td');
            if (cells.length < 3) return;

            const reason = cells[0].textContent.trim();
            const amountText = cells[1].textContent.trim();
            const dateText = cells[2].textContent.trim();

            const isPositive = amountText.includes('+');
            const isNegative = amountText.includes('-');
            const numMatch = amountText.match(/(\d+)/);
            let amount = numMatch ? parseInt(numMatch[1], 10) : 0;
            if (isNegative) amount = -amount;

            const date = new Date(dateText);
            if (!isNaN(date.getTime())) {
                transactions.push({ reason, amount, date });
            }
        });

        let totalProjects = 0;
        let totalMinutes = 0;
        let totalDevlogs = 0;
        let devlogFrequency = '';

        try {
            const cachedStats = localStorage.getItem('flavortown_project_stats');
            if (cachedStats) {
                const stats = JSON.parse(cachedStats);
                totalProjects = Object.keys(stats).length;

                Object.values(stats).forEach(project => {
                    totalMinutes += project.minutes || 0;
                    totalDevlogs += project.devlogs || 0;
                });

                if (totalDevlogs > 0 && totalMinutes > 0) {
                    const avgMinutesPerDevlog = totalMinutes / totalDevlogs;
                    const hours = Math.floor(avgMinutesPerDevlog / 60);
                    const mins = Math.round(avgMinutesPerDevlog % 60);
                    if (hours > 0) {
                        devlogFrequency = `${hours}h ${mins}m/devlog`;
                    } else {
                        devlogFrequency = `${mins}m/devlog`;
                    }
                }
            }
        } catch (e) {
            console.log('Could not read project stats:', e);
        }

        transactions.reverse();
        let runningTotal = currentBalance;
        for (let i = transactions.length - 1; i >= 0; i--) {
            runningTotal -= transactions[i].amount;
        }
        const dataPoints = [];
        let balance = runningTotal;
        transactions.forEach(t => {
            balance += t.amount;
            dataPoints.push({ date: t.date, balance, reason: t.reason, amount: t.amount });
        });

        const totalEarned = transactions.filter(t => t.amount > 0).reduce((sum, t) => sum + t.amount, 0);
        const totalSpent = Math.abs(transactions.filter(t => t.amount < 0).reduce((sum, t) => sum + t.amount, 0));

        let achievementCount = '';
        let achievementTotal = '';
        let achievementPercent = '';
        let leaderboardRank = '';
        let leaderboardCookies = '';

        const kitchenStats = document.querySelector('.kitchen-stats');
        if (kitchenStats) {
            const countEl = kitchenStats.querySelector('.kitchen-stats-card__count');
            const totalEl = kitchenStats.querySelector('.kitchen-stats-card__total');
            const percentEl = kitchenStats.querySelector('.state-card__description');

            if (countEl) achievementCount = countEl.textContent.trim();
            if (totalEl) achievementTotal = totalEl.textContent.trim().replace('/', '').trim();
            if (percentEl) achievementPercent = percentEl.textContent.trim();

            const rankEl = kitchenStats.querySelector('.kitchen-stats-card__rank');
            const cookiesEl = kitchenStats.querySelectorAll('.state-card__description')[1];

            if (rankEl) leaderboardRank = rankEl.textContent.trim();
            if (cookiesEl) leaderboardCookies = cookiesEl.textContent.trim();

            kitchenStats.style.display = 'none';
        }

        const dashboard = document.createElement('div');
        dashboard.className = 'flavortown-kitchen-dashboard';
        dashboard.innerHTML = `
            <div class="flavortown-dashboard-header">
                <h2>🍪 Your Cookie Stats</h2>
            </div>
            <div class="flavortown-stat-cards">
                <div class="flavortown-stat-card flavortown-stat-card--balance">
                    <span class="flavortown-stat-card__label">Current Balance</span>
                    <span class="flavortown-stat-card__value">🍪 ${currentBalance}</span>
                </div>
                <div class="flavortown-stat-card flavortown-stat-card--earned">
                    <span class="flavortown-stat-card__label">Total Earned</span>
                    <span class="flavortown-stat-card__value">+${totalEarned}</span>
                </div>
                <div class="flavortown-stat-card flavortown-stat-card--spent">
                    <span class="flavortown-stat-card__label">Total Spent</span>
                    <span class="flavortown-stat-card__value">-${totalSpent}</span>
                </div>
            </div>
            <div class="flavortown-graph-container">
                <h3>Cookies Over Time</h3>
                <canvas id="flavortown-cookies-graph" width="800" height="300"></canvas>
            </div>
            <div class="flavortown-dashboard-header" style="margin-top: 24px;">
                <h2>📊 Your Progress</h2>
            </div>
            <div class="flavortown-stat-cards">
                <div class="flavortown-stat-card">
                    <span class="flavortown-stat-card__label">Total Projects</span>
                    <span class="flavortown-stat-card__value">📁 ${totalProjects}</span>
                </div>
                <div class="flavortown-stat-card">
                    <span class="flavortown-stat-card__label">Total Time</span>
                    <span class="flavortown-stat-card__value">⏱ ${Math.floor(totalMinutes / 60)}h ${totalMinutes % 60}m</span>
                </div>
                ${devlogFrequency ? `
                <div class="flavortown-stat-card">
                    <span class="flavortown-stat-card__label">Avg per Devlog</span>
                    <span class="flavortown-stat-card__value">⚡ ${devlogFrequency}</span>
                </div>
                ` : ''}
                ${achievementCount ? `
                <div class="flavortown-stat-card">
                    <span class="flavortown-stat-card__label">Achievements</span>
                    <span class="flavortown-stat-card__value">🏆 ${achievementCount}/${achievementTotal}</span>
                    <span class="flavortown-stat-card__sublabel" style="font-size: 0.8em; opacity: 0.7;">${achievementPercent}</span>
                </div>
                ` : ''}
                ${leaderboardRank ? `
                <div class="flavortown-stat-card">
                    <span class="flavortown-stat-card__label">Leaderboard</span>
                    <span class="flavortown-stat-card__value">🏅 ${leaderboardRank}</span>
                    <span class="flavortown-stat-card__sublabel" style="font-size: 0.8em; opacity: 0.7;">${leaderboardCookies}</span>
                </div>
                ` : ''}
            </div>
        `;

        kitchenSetup.replaceWith(dashboard);

        const canvas = document.getElementById('flavortown-cookies-graph');
        if (canvas && dataPoints.length > 1) {
            const ctx = canvas.getContext('2d');

            const dpr = window.devicePixelRatio || 1;
            const rect = canvas.getBoundingClientRect();
            canvas.width = rect.width * dpr;
            canvas.height = rect.height * dpr;
            canvas.style.width = rect.width + 'px';
            canvas.style.height = rect.height + 'px';
            ctx.scale(dpr, dpr);

            const padding = 50;
            const width = rect.width - padding * 2;
            const height = rect.height - padding * 2;

            const styles = getComputedStyle(document.documentElement);
            const lineColor = styles.getPropertyValue('--color-accent')?.trim() || '#8b7355';
            const textColor = styles.getPropertyValue('--color-text-primary')?.trim() || '#333';
            const gridColor = styles.getPropertyValue('--color-border')?.trim() || '#e2d8cc';

            const minBalance = Math.min(...dataPoints.map(d => d.balance));
            const maxBalance = Math.max(...dataPoints.map(d => d.balance));
            const balanceRange = maxBalance - minBalance || 1;

            ctx.strokeStyle = gridColor;
            ctx.lineWidth = 1;
            for (let i = 0; i <= 5; i++) {
                const y = padding + (height / 5) * i;
                ctx.beginPath();
                ctx.moveTo(padding, y);
                ctx.lineTo(canvas.width - padding, y);
                ctx.stroke();

                const value = Math.round(maxBalance - (balanceRange / 5) * i);
                ctx.fillStyle = textColor;
                ctx.font = '12px system-ui';
                ctx.textAlign = 'right';
                ctx.fillText(value.toString(), padding - 10, y + 4);
            }

            const pointPositions = dataPoints.map((point, i) => ({
                x: padding + (width / (dataPoints.length - 1)) * i,
                y: padding + height - ((point.balance - minBalance) / balanceRange) * height,
                data: point
            }));

            for (let i = 1; i < pointPositions.length; i++) {
                const prev = pointPositions[i - 1];
                const curr = pointPositions[i];
                const isGain = curr.data.amount >= 0;

                const segmentGradient = ctx.createLinearGradient(0, padding, 0, padding + height);
                if (isGain) {
                    segmentGradient.addColorStop(0, 'rgba(56, 161, 105, 0.4)');
                    segmentGradient.addColorStop(1, 'rgba(56, 161, 105, 0.05)');
                } else {
                    segmentGradient.addColorStop(0, 'rgba(229, 62, 62, 0.4)');
                    segmentGradient.addColorStop(1, 'rgba(229, 62, 62, 0.05)');
                }

                ctx.beginPath();
                ctx.moveTo(prev.x, prev.y);

                const cpX = (prev.x + curr.x) / 2;
                ctx.bezierCurveTo(cpX, prev.y, cpX, curr.y, curr.x, curr.y);

                ctx.lineTo(curr.x, padding + height);
                ctx.lineTo(prev.x, padding + height);
                ctx.closePath();
                ctx.fillStyle = segmentGradient;
                ctx.fill();
            }
            ctx.lineWidth = 3;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';

            for (let i = 1; i < pointPositions.length; i++) {
                const prev = pointPositions[i - 1];
                const curr = pointPositions[i];
                const isGain = curr.data.amount >= 0;

                ctx.beginPath();
                ctx.moveTo(prev.x, prev.y);
                const cpX = (prev.x + curr.x) / 2;
                ctx.bezierCurveTo(cpX, prev.y, cpX, curr.y, curr.x, curr.y);
                ctx.strokeStyle = isGain ? '#38a169' : '#e53e3e';
                ctx.stroke();
            }

            pointPositions.forEach((point, i) => {
                const isGain = point.data.amount >= 0;
                const pointColor = isGain ? '#38a169' : '#e53e3e';

                ctx.beginPath();
                ctx.arc(point.x, point.y, 6, 0, Math.PI * 2);
                ctx.fillStyle = pointColor;
                ctx.fill();
                ctx.strokeStyle = '#fff';
                ctx.lineWidth = 2;
                ctx.stroke();
            });

            ctx.fillStyle = textColor;
            ctx.font = '11px system-ui';
            ctx.textAlign = 'center';
            if (dataPoints.length > 0) {
                const maxLabels = Math.min(dataPoints.length, 5);
                const step = Math.max(1, Math.floor((dataPoints.length - 1) / (maxLabels - 1)));

                for (let i = 0; i < dataPoints.length; i += step) {
                    if (i === 0 || i >= dataPoints.length - 1 || (i > 0 && i < dataPoints.length - 1)) {
                        const x = padding + (width / (dataPoints.length - 1)) * i;
                        const dateStr = dataPoints[i].date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                        ctx.fillText(dateStr, x, canvas.height - 10);
                    }
                }
                if (step > 1) {
                    const lastX = padding + width;
                    const lastDateStr = dataPoints[dataPoints.length - 1].date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                    ctx.fillText(lastDateStr, lastX, canvas.height - 10);
                }
            }

            const tooltip = document.createElement('div');
            tooltip.className = 'flavortown-graph-tooltip';
            tooltip.style.cssText = `
                position: absolute;
                display: none;
                background: var(--color-surface, #fff);
                border: 2px solid var(--color-border, #e2d8cc);
                border-radius: 8px;
                padding: 10px 14px;
                font-size: 0.9em;
                pointer-events: none;
                z-index: 1000;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                max-width: 220px;
                white-space: nowrap;
            `;
            canvas.parentNode.style.position = 'relative';
            canvas.parentNode.appendChild(tooltip);

            canvas.addEventListener('mousemove', (e) => {
                const rect = canvas.getBoundingClientRect();
                const scaleX = canvas.width / rect.width;
                const scaleY = canvas.height / rect.height;
                const mouseX = (e.clientX - rect.left) * scaleX;
                const mouseY = (e.clientY - rect.top) * scaleY;

                let closestPoint = null;
                let closestDist = Infinity;
                pointPositions.forEach(p => {
                    const dist = Math.sqrt((p.x - mouseX) ** 2 + (p.y - mouseY) ** 2);
                    if (dist < closestDist && dist < 30) {
                        closestDist = dist;
                        closestPoint = p;
                    }
                });

                if (closestPoint) {
                    const amountStr = closestPoint.data.amount >= 0 ? `+${closestPoint.data.amount}` : `${closestPoint.data.amount}`;
                    const dateStr = closestPoint.data.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                    tooltip.innerHTML = `
                        <div style="font-weight: 700; margin-bottom: 4px;">🍪 ${closestPoint.data.balance}</div>
                        <div style="color: ${closestPoint.data.amount >= 0 ? '#38a169' : '#e53e3e'}; font-weight: 600;">${amountStr}</div>
                        <div style="font-size: 0.85em; color: var(--color-text-muted, #888); margin-top: 4px;">${closestPoint.data.reason}</div>
                        <div style="font-size: 0.8em; color: var(--color-text-muted, #888);">${dateStr}</div>
                    `;
                    tooltip.style.display = 'block';

                    let tooltipX = (closestPoint.x / scaleX) + 15;
                    const tooltipWidth = 220;
                    if (tooltipX + tooltipWidth > rect.width) {
                        tooltipX = (closestPoint.x / scaleX) - tooltipWidth - 15;
                    }
                    tooltip.style.left = `${tooltipX}px`;
                    tooltip.style.top = `${(closestPoint.y / scaleY) - 20}px`;
                } else {
                    tooltip.style.display = 'none';
                }
            });

            canvas.addEventListener('mouseleave', () => {
                tooltip.style.display = 'none';
            });
        }
    } catch (e) {
        console.error('Failed to enhance kitchen dashboard:', e);
    }
}

function addDoomscrollMode() {
    const path = window.location.pathname;
    if (path !== '/explore' && path !== '/explore/following' && !path.match(/^\/explore\/?$/)) return;
    if (document.querySelector('.flavortown-doomscroll-toggle')) return;

    const nav = document.querySelector('.explore__nav');
    if (!nav) return;

    const toggleBtn = document.createElement('a');
    toggleBtn.className = 'explore__nav-component flavortown-doomscroll-toggle';
    toggleBtn.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="27" height="27" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="3" width="18" height="18" rx="2"/>
            <path d="M10 8l6 4-6 4V8z" fill="currentColor"/>
        </svg>
        Buffet
    `;
    toggleBtn.title = 'All-you-can-eat devlogs (Immersive Mode)';

    const navList = nav.querySelector('ul, .nav__list');
    if (navList) {
        const li = document.createElement('li');
        li.className = 'nav__item';
        li.appendChild(toggleBtn);
        navList.appendChild(li);
    } else {
        nav.appendChild(toggleBtn);
    }

    let doomscrollActive = false;
    let doomscrollContainer = null;
    let currentIndex = 0;
    let posts = [];
    let originalPosts = [];

    function extractPostData(postEl, index) {
        const avatar = postEl.querySelector('.post__avatar img')?.src || '';
        const username = postEl.querySelector('.post__author a')?.textContent?.trim() || 'Unknown';
        const userLink = postEl.querySelector('.post__author a')?.href || '#';
        const projectName = postEl.querySelector('.post__author a:last-of-type')?.textContent?.trim() || '';
        const projectLink = postEl.querySelector('.post__author a:last-of-type')?.href || '#';
        const bodyEl = postEl.querySelector('.post__body');
        const body = bodyEl?.innerHTML || '';
        const bodyText = bodyEl?.textContent?.trim() || '';
        const time = postEl.querySelector('.post__time')?.textContent?.trim() || '';
        const duration = postEl.querySelector('.post__duration')?.textContent?.trim() || '';

        const media = [];
        postEl.querySelectorAll('.post__slide').forEach(slide => {
            const img = slide.querySelector('img');
            const video = slide.querySelector('video');
            if (img) media.push({ type: 'image', src: img.src, alt: img.alt });
            else if (video) media.push({ type: 'video', src: video.src });
        });

        const likeBtn = postEl.querySelector('.like-button__btn');
        const likeCount = postEl.querySelector('.like-button__count')?.textContent?.trim() || '0';
        const likeHref = likeBtn?.href || '';
        const isLiked = likeBtn?.classList.contains('is-liked') || false;
        const commentCount = postEl.querySelector('.comments-count__count')?.textContent?.trim() || '0';

        const comments = [];
        postEl.querySelectorAll('.comment').forEach(c => {
            comments.push({
                author: c.querySelector('.comment__author')?.textContent?.trim() || '',
                body: c.querySelector('.comment__body')?.textContent?.trim() || ''
            });
        });

        const postClasses = postEl.className;
        let postType = 'devlog';
        if (postClasses.includes('post--fire')) postType = 'fire';
        else if (postClasses.includes('post--certified')) postType = 'certified';
        else if (postClasses.includes('post--ship')) postType = 'ship';

        return { avatar, username, userLink, projectName, projectLink, body, bodyText, time, duration, media, likeCount, likeHref, isLiked, commentCount, comments, postType, index };
    }

    function createDoomscrollCard(postData, index) {
        const card = document.createElement('div');
        card.className = 'flavortown-doomscroll__card';
        card.dataset.index = index;

        const hasMedia = postData.media.length > 0;
        const isTextHeavy = postData.bodyText.length > 250;

        let mediaHTML = '';
        if (hasMedia) {
            const firstMedia = postData.media[0];
            mediaHTML = firstMedia.type === 'image'
                ? `<img src="${firstMedia.src}" alt="${firstMedia.alt || ''}" loading="lazy">`
                : `<video src="${firstMedia.src}" controls autoplay muted loop playsinline></video>`;

            if (postData.media.length > 1) {
                const dotsHTML = postData.media.map((_, i) => `<button class="flavortown-doomscroll__gallery-dot ${i === 0 ? 'active' : ''}" data-index="${i}"></button>`).join('');
                mediaHTML = `<div class="flavortown-doomscroll__gallery"><div class="flavortown-doomscroll__gallery-media">${mediaHTML}</div><button class="flavortown-doomscroll__gallery-nav flavortown-doomscroll__gallery-nav--prev" style="display:none;">‹</button><button class="flavortown-doomscroll__gallery-nav flavortown-doomscroll__gallery-nav--next">›</button><div class="flavortown-doomscroll__gallery-dots">${dotsHTML}</div></div>`;
            }
        }

        const typeBadge = { fire: '🔥', certified: '✅', ship: '🚀', devlog: '📝' }[postData.postType];

        const projectIdMatch = postData.projectLink.match(/\/projects\/(\d+)/);
        const projectId = projectIdMatch ? projectIdMatch[1] : null;

        card.innerHTML = `
            <div class="flavortown-doomscroll__background">
                ${hasMedia ? mediaHTML : `<div class="flavortown-doomscroll__text-only">${postData.body}</div>`}
            </div>
            <div class="flavortown-doomscroll__overlay">
                <div class="flavortown-doomscroll__info">
                    <div class="flavortown-doomscroll__author-row">
                        <img src="${postData.avatar}" alt="${postData.username}" class="flavortown-doomscroll__avatar">
                        <div class="flavortown-doomscroll__author-meta">
                            <a href="${postData.userLink}" class="flavortown-doomscroll__username" target="_blank">${typeBadge} @${postData.username}</a>
                            <span class="flavortown-doomscroll__project-row"><a href="${postData.projectLink}" class="flavortown-doomscroll__project-name" target="_blank">${postData.projectName}</a> · <span class="flavortown-doomscroll__time">${postData.time}</span>${postData.duration ? ` · <span class="flavortown-doomscroll__duration">${postData.duration}</span>` : ''}</span>
                        </div>
                    </div>
                    <div class="flavortown-doomscroll__caption ${isTextHeavy ? 'expandable' : ''}">
                        <div class="flavortown-doomscroll__caption-text">${postData.bodyText.substring(0, isTextHeavy ? 250 : 500)}${isTextHeavy ? '...' : ''}</div>
                        ${isTextHeavy ? '<button class="flavortown-doomscroll__expand-btn">more</button>' : ''}
                    </div>
                    ${postData.comments.length > 0 ? `
                    <div class="flavortown-doomscroll__comments-preview">
                        ${postData.comments.slice(0, 3).map(c => `
                            <div class="flavortown-doomscroll__comment">
                                <span class="flavortown-doomscroll__comment-author">@${c.author}</span>
                                <span class="flavortown-doomscroll__comment-text">${c.body}</span>
                            </div>
                        `).join('')}
                        ${postData.comments.length > 3 ? `<button class="flavortown-doomscroll__more-comments">View all ${postData.commentCount} comments</button>` : ''}
                    </div>
                    ` : ''}
                    <div class="flavortown-doomscroll__comment-form">
                        <input type="text" class="flavortown-doomscroll__comment-input" placeholder="Add a comment..." data-index="${index}">
                        <button class="flavortown-doomscroll__comment-submit" data-index="${index}">Post</button>
                    </div>
                </div>
                <div class="flavortown-doomscroll__actions">
                    <button class="flavortown-doomscroll__action ${postData.isLiked ? 'is-liked' : ''}" data-action="like">
                        <div class="flavortown-doomscroll__action-icon"><svg viewBox="0 0 24 24" class="like-icon"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg></div>
                        <span class="flavortown-doomscroll__action-count">${postData.likeCount}</span>
                    </button>
                    <button class="flavortown-doomscroll__action" data-action="comment">
                        <div class="flavortown-doomscroll__action-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg></div>
                        <span class="flavortown-doomscroll__action-count">${postData.commentCount}</span>
                    </button>
                    <button class="flavortown-doomscroll__action" data-action="follow" data-project-id="${projectId}">
                        <div class="flavortown-doomscroll__action-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/></svg></div>
                        <span class="flavortown-doomscroll__action-label">Follow</span>
                    </button>
                    <button class="flavortown-doomscroll__action" data-action="report" data-project-id="${projectId}">
                        <div class="flavortown-doomscroll__action-icon"><svg viewBox="0 0 25 25" fill="currentColor"><path fill-rule="evenodd" clip-rule="evenodd" d="M3.125 2.34375C3.3322 2.34375 3.53091 2.42606 3.67743 2.57257C3.82394 2.71909 3.90625 2.9178 3.90625 3.125V3.6875L5.82083 3.20833C8.17281 2.62027 10.6576 2.89295 12.826 3.97708L12.9385 4.03333C14.7366 4.9325 16.793 5.17283 18.75 4.7125L21.9896 3.95C22.1111 3.9215 22.2376 3.92253 22.3587 3.95299C22.4797 3.98345 22.5917 4.04246 22.6852 4.12508C22.7787 4.2077 22.8511 4.31152 22.8963 4.42786C22.9414 4.5442 22.9581 4.66966 22.9448 4.79375C22.5572 8.37261 22.5589 11.983 22.95 15.5615C22.9708 15.7511 22.9215 15.9419 22.8114 16.0977C22.7012 16.2535 22.5379 16.3637 22.3521 16.4073L19.1083 17.1708C16.7954 17.7152 14.3648 17.4314 12.2396 16.3687L12.1271 16.3125C10.2924 15.3951 8.19008 15.1641 6.2 15.6615L3.90625 16.2344V21.875C3.90625 22.0822 3.82394 22.2809 3.67743 22.4274C3.53091 22.5739 3.3322 22.6562 3.125 22.6562C2.9178 22.6562 2.71909 22.5739 2.57257 22.4274C2.42606 22.2809 2.34375 22.0822 2.34375 21.875V3.125C2.34375 3.0224 2.36396 2.92081 2.40322 2.82603C2.44248 2.73124 2.50003 2.64512 2.57257 2.57257C2.64512 2.50003 2.73124 2.44248 2.82603 2.40322C2.92081 2.36396 3.0224 2.34375 3.125 2.34375Z"/></svg></div>
                    </button>
                </div>
            </div>
        `;

        if (postData.media.length > 1) {
            let currentMediaIndex = 0;
            const galleryMedia = card.querySelector('.flavortown-doomscroll__gallery-media');
            const prevBtn = card.querySelector('.flavortown-doomscroll__gallery-nav--prev');
            const nextBtn = card.querySelector('.flavortown-doomscroll__gallery-nav--next');
            const dots = card.querySelectorAll('.flavortown-doomscroll__gallery-dot');
            function showMedia(idx) {
                currentMediaIndex = idx;
                const m = postData.media[idx];
                galleryMedia.innerHTML = m.type === 'image' ? `<img src="${m.src}" alt="${m.alt || ''}" loading="lazy">` : `<video src="${m.src}" controls autoplay muted loop playsinline></video>`;
                dots.forEach((d, i) => d.classList.toggle('active', i === idx));
                prevBtn.style.display = idx === 0 ? 'none' : 'flex';
                nextBtn.style.display = idx === postData.media.length - 1 ? 'none' : 'flex';
            }
            prevBtn?.addEventListener('click', e => { e.stopPropagation(); showMedia(currentMediaIndex - 1); });
            nextBtn?.addEventListener('click', e => { e.stopPropagation(); showMedia(currentMediaIndex + 1); });
            dots.forEach((dot, i) => dot.addEventListener('click', e => { e.stopPropagation(); showMedia(i); }));
        }

        const expandBtn = card.querySelector('.flavortown-doomscroll__expand-btn');
        expandBtn?.addEventListener('click', () => {
            const caption = card.querySelector('.flavortown-doomscroll__caption');
            const textEl = card.querySelector('.flavortown-doomscroll__caption-text');
            caption.classList.toggle('expanded');
            if (caption.classList.contains('expanded')) {
                textEl.textContent = postData.bodyText;
                expandBtn.textContent = 'less';
            } else {
                textEl.textContent = postData.bodyText.substring(0, 100) + '...';
                expandBtn.textContent = 'more';
            }
        });

        const likeBtn = card.querySelector('[data-action="like"]');
        if (likeBtn) {
            likeBtn.addEventListener('click', e => {
                e.stopPropagation();
                const originalLikeBtn = originalPosts[postData.index]?.querySelector('.like-button__btn');
                if (originalLikeBtn) {
                    originalLikeBtn.click();
                    setTimeout(() => {
                        const isNowLiked = originalLikeBtn.classList.contains('is-liked');
                        const originalCount = originalPosts[postData.index]?.querySelector('.like-button__count')?.textContent || '0';
                        likeBtn.classList.toggle('is-liked', isNowLiked);
                        likeBtn.querySelector('.flavortown-doomscroll__action-count').textContent = originalCount;
                        likeBtn.querySelector('.like-icon').style.transform = 'scale(1.3)';
                        setTimeout(() => likeBtn.querySelector('.like-icon').style.transform = '', 200);
                    }, 300);
                }
            });
        }

        const commentInput = card.querySelector('.flavortown-doomscroll__comment-input');
        const commentSubmit = card.querySelector('.flavortown-doomscroll__comment-submit');
        if (commentInput && commentSubmit) {
            const submitComment = () => {
                const text = commentInput.value.trim();
                if (!text) return;

                const originalForm = originalPosts[postData.index]?.querySelector('.comment-form');
                const originalInput = originalForm?.querySelector('.comment-form__input');
                const originalSubmit = originalForm?.querySelector('button[type="submit"], .comment-form__submit');

                if (originalInput && originalSubmit) {
                    originalInput.value = text;
                    originalInput.dispatchEvent(new Event('input', { bubbles: true }));
                    originalSubmit.click();
                    commentInput.value = '';

                    setTimeout(() => {
                        const newCount = originalPosts[postData.index]?.querySelector('.comments-count__count')?.textContent || '0';
                        card.querySelector('[data-action="comment"] .flavortown-doomscroll__action-count').textContent = newCount;
                    }, 500);
                }
            };

            commentSubmit.addEventListener('click', e => { e.stopPropagation(); submitComment(); });
            commentInput.addEventListener('keydown', e => { if (e.key === 'Enter') { e.stopPropagation(); submitComment(); } });
            commentInput.addEventListener('click', e => e.stopPropagation());
        }

        card.querySelector('[data-action="comment"]')?.addEventListener('click', e => {
            e.stopPropagation();
            commentInput?.focus();
        });

        card.querySelector('[data-action="follow"]')?.addEventListener('click', async e => {
            e.stopPropagation();
            const followBtn = e.currentTarget;
            const projectId = followBtn.dataset.projectId;
            if (!projectId) return;

            const originalFollowBtn = originalPosts[postData.index]?.querySelector('form[action*="/follow"] button');
            if (originalFollowBtn) {
                originalFollowBtn.click();
                setTimeout(() => {
                    followBtn.classList.toggle('is-following');
                    const label = followBtn.querySelector('.flavortown-doomscroll__action-label');
                    if (label) label.textContent = followBtn.classList.contains('is-following') ? 'Following' : 'Follow';
                }, 200);
            } else {
                try {
                    const token = document.querySelector('meta[name="csrf-token"]')?.content;
                    await fetch(`/projects/${projectId}/follow`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded',
                            'X-CSRF-Token': token,
                            'Accept': 'text/vnd.turbo-stream.html'
                        },
                        credentials: 'same-origin'
                    });
                    followBtn.classList.toggle('is-following');
                    const label = followBtn.querySelector('.flavortown-doomscroll__action-label');
                    if (label) label.textContent = followBtn.classList.contains('is-following') ? 'Following' : 'Follow';
                } catch (err) { console.error('Follow failed:', err); }
            }
        });

        card.querySelector('[data-action="report"]')?.addEventListener('click', e => {
            e.stopPropagation();
            const reportBtn = e.currentTarget;
            if (reportBtn.classList.contains('reported')) return;

            if (confirm('Report this devlog for inappropriate content?')) {
                reportBtn.classList.add('reported');
                reportBtn.style.opacity = '0.5';
                alert('Thanks for reporting. The Flavortown team will review this.');
            }
        });

        card.querySelector('.flavortown-doomscroll__more-comments')?.addEventListener('click', e => {
            e.stopPropagation();
            closeDoomscroll();
            originalPosts[postData.index]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        });

        return card;
    }

    function scrollToIndex(index) {
        if (index < 0 || index >= posts.length) return;
        currentIndex = index;
        const phoneFrame = doomscrollContainer?.querySelector('.flavortown-doomscroll__container');
        phoneFrame?.querySelectorAll('.flavortown-doomscroll__card')[index]?.scrollIntoView({ behavior: 'smooth' });
    }

    function handleKeydown(e) {
        if (!doomscrollActive) return;
        const phoneFrame = doomscrollContainer?.querySelector('.flavortown-doomscroll__container');
        switch (e.key) {
            case 'Escape': closeDoomscroll(); break;
            case 'ArrowDown': case 'j': case ' ': e.preventDefault(); scrollToIndex(currentIndex + 1); break;
            case 'ArrowUp': case 'k': e.preventDefault(); scrollToIndex(currentIndex - 1); break;
            case 'l': phoneFrame?.querySelectorAll('.flavortown-doomscroll__card')[currentIndex]?.querySelector('[data-action="like"]')?.click(); break;
        }
    }

    function openDoomscroll() {
        const postEls = document.querySelectorAll('.explore__list .post');
        if (postEls.length === 0) { alert('No posts found!'); return; }

        originalPosts = Array.from(postEls);
        posts = originalPosts.map((el, i) => extractPostData(el, i));
        currentIndex = 0;
        let isLoadingMore = false;

        doomscrollContainer = document.createElement('div');
        doomscrollContainer.className = 'flavortown-doomscroll';
        const phoneFrame = document.createElement('div');
        phoneFrame.className = 'flavortown-doomscroll__container';

        const closeBtn = document.createElement('button');
        closeBtn.className = 'flavortown-doomscroll__close';
        closeBtn.innerHTML = '×';
        closeBtn.addEventListener('click', closeDoomscroll);
        doomscrollContainer.appendChild(closeBtn);

        const hint = document.createElement('div');
        hint.className = 'flavortown-doomscroll__nav-hint';
        hint.innerHTML = '↑↓ or <kbd>J</kbd>/<kbd>K</kbd> · <kbd>L</kbd> to like · <kbd>ESC</kbd> exit';
        doomscrollContainer.appendChild(hint);
        setTimeout(() => hint.style.opacity = '0', 4000);

        posts.forEach((p, i) => phoneFrame.appendChild(createDoomscrollCard(p, i)));

        async function loadMorePosts() {
            if (isLoadingMore) return;
            const loadMoreBtn = document.querySelector('.explore__pagination [data-action="load-more#load"]');
            if (!loadMoreBtn) return;

            isLoadingMore = true;

            loadMoreBtn.click();

            await new Promise(resolve => setTimeout(resolve, 1500));

            const allPostEls = document.querySelectorAll('.explore__list .post');
            const newPostEls = Array.from(allPostEls).slice(originalPosts.length);

            if (newPostEls.length > 0) {
                newPostEls.forEach((el, i) => {
                    const postData = extractPostData(el, posts.length);
                    posts.push(postData);
                    originalPosts.push(el);
                    phoneFrame.appendChild(createDoomscrollCard(postData, posts.length - 1));
                });
            }

            isLoadingMore = false;
        }

        phoneFrame.addEventListener('scroll', () => {
            const cardHeight = phoneFrame.querySelector('.flavortown-doomscroll__card')?.offsetHeight || phoneFrame.clientHeight;
            const newIndex = Math.round(phoneFrame.scrollTop / cardHeight);
            if (newIndex !== currentIndex && newIndex >= 0 && newIndex < posts.length) {
                currentIndex = newIndex;
            }

            if (currentIndex >= posts.length - 3) {
                loadMorePosts();
            }
        });

        doomscrollContainer.appendChild(phoneFrame);
        document.body.appendChild(doomscrollContainer);
        document.body.style.overflow = 'hidden';
        document.addEventListener('keydown', handleKeydown);
        doomscrollActive = true;
        toggleBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="27" height="27" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>Exit`;
        toggleBtn.classList.add('active');
    }

    function closeDoomscroll() {
        doomscrollContainer?.remove();
        doomscrollContainer = null;
        document.body.style.overflow = '';
        document.removeEventListener('keydown', handleKeydown);
        doomscrollActive = false;
        toggleBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="27" height="27" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M10 8l6 4-6 4V8z" fill="currentColor"/></svg>Buffet`;
        toggleBtn.classList.remove('active');
    }

    toggleBtn.addEventListener('click', () => doomscrollActive ? closeDoomscroll() : openDoomscroll());
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

let lastPathname = window.location.pathname;
document.addEventListener('turbo:load', () => {
    if (window.location.pathname !== lastPathname) {
        inlineFormLoading = false;
        window.__flavortownGoalsEnhanced = false;
        window.__shopAccessoriesInit = false;
        lastPathname = window.location.pathname;
    }
    initPinnableSidebar();
    addDevlogFrequencyStat();
    inlineDevlogForm();
    enhanceShopGoals();
    initShopAccessories();
    addShopCardEfficiency();
    addExploreSearch();
    captureApiKey();
    initProjectBoardStats();
    addSkipButton();
    transformVotesTable();
    enhanceKitchenDashboard();
    addDoomscrollMode();
    addAdminViewButton();
    addSidebarItems();
    enhanceAchievementsPage();
    initShotsEditor();
});

function initShotsEditor() {
    function addShotsButton() {
        const fileUploadArea = document.querySelector('.file-upload');
        if (!fileUploadArea) return false;
        if (document.querySelector('.flavortown-shots-btn')) return true;

        const attachmentContainer = fileUploadArea.closest('.form-group') ||
            fileUploadArea.closest('[class*="attachment"]') ||
            fileUploadArea.parentElement;

        const shotsBtn = document.createElement('button');
        shotsBtn.type = 'button';
        shotsBtn.className = 'flavortown-shots-btn';
        shotsBtn.innerHTML = '✨ Style';
        shotsBtn.title = 'Style your screenshot with shots.so - add backgrounds, frames, and effects';
        shotsBtn.style.cssText = `
            position: absolute;
            top: 8px;
            right: 8px;
            z-index: 10;
            display: inline-flex;
            align-items: center;
            gap: 4px;
            padding: 5px 12px;
            background: rgba(255, 255, 255, 0.85);
            color: #5a7052;
            border: 1px solid rgba(90, 112, 82, 0.3);
            border-radius: 6px;
            font-weight: 600;
            font-size: 0.8em;
            cursor: pointer;
            transition: all 0.2s ease;
            backdrop-filter: blur(4px);
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        `;
        shotsBtn.onmouseenter = () => {
            shotsBtn.style.background = 'rgba(90, 112, 82, 0.15)';
            shotsBtn.style.borderColor = 'rgba(90, 112, 82, 0.5)';
        };
        shotsBtn.onmouseleave = () => {
            shotsBtn.style.background = 'rgba(255, 255, 255, 0.85)';
            shotsBtn.style.borderColor = 'rgba(90, 112, 82, 0.3)';
        };
        shotsBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            openShotsModal();
        });

        const uploadAreaStyle = window.getComputedStyle(fileUploadArea);
        if (uploadAreaStyle.position === 'static') {
            fileUploadArea.style.position = 'relative';
        }

        fileUploadArea.appendChild(shotsBtn);
        return true;
    }

    if (addShotsButton()) return;

    const observer = new MutationObserver(() => {
        if (addShotsButton()) {
            observer.disconnect();
        }
    });
    observer.observe(document.body, { childList: true, subtree: true });

    setTimeout(() => {
        if (addShotsButton()) {
            observer.disconnect();
        }
    }, 2000);
}

let _shotsOriginalFiles = [];
let _shotsStyledFileIndex = -1;

function openShotsModal() {
    const overlay = document.createElement('div');
    overlay.className = 'flavortown-shots-overlay';
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.9);
        z-index: 999999;
        display: flex;
        flex-direction: column;
        padding: 20px;
    `;

    const previewImg = document.querySelector('.file-upload__preview img');
    const imageUrl = previewImg ? previewImg.src : null;

    const fileInput = document.querySelector('.file-upload input[type="file"]')
        || document.querySelector('[data-file-upload-target="input"]')
        || document.querySelector('input[type="file"]');
    
    _shotsOriginalFiles = fileInput ? Array.from(fileInput.files || []) : [];
    _shotsStyledFileIndex = -1;

    async function findStyledFileIndex() {
        if (!imageUrl || _shotsOriginalFiles.length === 0) return -1;
        if (_shotsOriginalFiles.length === 1) return 0;

        try {
            const previewBlob = await fetch(imageUrl).then(r => r.blob());
            const previewSize = previewBlob.size;

            let bestMatchIndex = -1;
            let bestSizeDiff = Infinity;

            for (let i = 0; i < _shotsOriginalFiles.length; i++) {
                if (!_shotsOriginalFiles[i].type.startsWith('image/')) continue;

                const sizeDiff = Math.abs(_shotsOriginalFiles[i].size - previewSize);
 
                if (sizeDiff === 0) {
                    return i;
                }

                if (sizeDiff < bestSizeDiff) {
                    bestSizeDiff = sizeDiff;
                    bestMatchIndex = i;
                }
            }

            if (bestMatchIndex !== -1 && bestSizeDiff < previewSize * 0.05) {
                return bestMatchIndex;
            }

            const previewItems = document.querySelectorAll('.file-upload__preview-item, .file-upload__item');
            if (previewItems.length > 1) {
                const activeItem = document.querySelector('.file-upload__preview-item.active, .file-upload__item.active');
                if (activeItem) {
                    const index = Array.from(previewItems).indexOf(activeItem);
                    if (index !== -1) return index;
                }
            }

            return bestMatchIndex !== -1 ? bestMatchIndex : 0;
        } catch (e) {
            console.error('[Flavortown] Error finding styled file:', e);
            return 0;
        }
    }
    
    findStyledFileIndex().then(idx => {
        _shotsStyledFileIndex = idx;
    });

    const header = document.createElement('div');
    header.style.cssText = `
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 12px 20px;
        background: rgba(255, 255, 255, 0.1);
        border-radius: 12px;
        margin-bottom: 12px;
        color: white;
    `;
    header.innerHTML = `
        <div style="display: flex; align-items: center; gap: 12px;">
            <span style="font-size: 1.5em;">✨</span>
            <div>
                <strong style="font-size: 1.1em;">Style Your Screenshot</strong>
                <p style="margin: 4px 0 0; opacity: 0.8; font-size: 0.9em;">
                    ${imageUrl ? 'Your image is being loaded... ' : 'Drop your image into the editor. '}
                    Style it → Click the green 📋 copy button to upload!
                </p>
            </div>
        </div>
        <button id="flavortown-shots-close" style="
            background: rgba(255,255,255,0.2);
            border: none;
            color: white;
            padding: 8px 16px;
            border-radius: 8px;
            cursor: pointer;
            font-weight: 600;
        ">✕ Close</button>
    `;
    overlay.appendChild(header);

    const iframeContainer = document.createElement('div');
    iframeContainer.style.cssText = `
        flex: 1;
        border-radius: 12px;
        overflow: hidden;
        background: #1a1a2e;
    `;

    const iframe = document.createElement('iframe');
    iframe.src = 'https://shots.so';
    iframe.style.cssText = `
        width: 100%;
        height: 100%;
        border: none;
    `;
    iframe.allow = 'clipboard-write';
    iframeContainer.appendChild(iframe);
    overlay.appendChild(iframeContainer);

    document.body.appendChild(overlay);

    function handleExportMessage(event) {
        if (event.data?.type === 'SHOTS_COPY_COMPLETE') {
            const instructions = header.querySelector('p');
            if (instructions) {
                instructions.innerHTML = '<strong style="color: #f59e0b;">⏳ Reading from clipboard...</strong>';
            }

            navigator.clipboard.read().then(async (items) => {
                for (const item of items) {
                    const imageType = item.types.find(t => t.startsWith('image/'));
                    if (imageType) {
                        const blob = await item.getType(imageType);
                        const file = new File([blob], 'styled-screenshot.png', { type: imageType });

                        const currentFileInput = document.querySelector('.file-upload input[type="file"]')
                            || document.querySelector('[data-file-upload-target="input"]')
                            || document.querySelector('input[type="file"]');

                        if (currentFileInput) {
                            const dt = new DataTransfer();

                            for (let i = 0; i < _shotsOriginalFiles.length; i++) {
                             
                                if (i === _shotsStyledFileIndex) continue;
                                dt.items.add(_shotsOriginalFiles[i]);
                            }

                            dt.items.add(file);

                            currentFileInput.files = dt.files;
                           

                            ['input', 'change'].forEach(eventType => {
                                currentFileInput.dispatchEvent(new Event(eventType, { bubbles: true, cancelable: true }));
                            });

                           

                            if (instructions) {
                                instructions.innerHTML = '<strong style="color: #10b981;">✓ Styled image added!</strong> Closing...';
                            }

                            setTimeout(() => {
                                window.removeEventListener('message', handleExportMessage);
                                overlay.remove();
                            }, 1500);
                            return;
                        }
                    }
                }

                if (instructions) {
                    instructions.innerHTML = '<strong style="color: #ef4444;">No image in clipboard.</strong> Try copying again.';
                }
            }).catch(err => {
                console.error('[Flavortown] Clipboard read failed:', err);
                if (instructions) {
                    instructions.innerHTML = '<strong style="color: #ef4444;">Clipboard access denied.</strong> Grant permission and try again.';
                }
            });
            return;
        }

        if (event.data?.type === 'SHOTS_CAPTURE_FAILED') {
            console.error('[Flavortown] Canvas capture failed:', event.data.error);
            return;
        }

        if (event.data?.type !== 'SHOTS_EXPORT_COMPLETE') return;

        const { dataUrl, filename } = event.data;

        fetch(dataUrl)
            .then(res => res.blob())
            .then(blob => {
                const file = new File([blob], filename || 'styled-screenshot.png', { type: blob.type });

                const fileInput = document.querySelector('.file-upload input[type="file"]')
                    || document.querySelector('[data-file-upload-target="input"]')
                    || document.querySelector('input[type="file"]');

                if (fileInput) {
                    const dt = new DataTransfer();
                    dt.items.add(file);
                    fileInput.files = dt.files;

                    ['input', 'change'].forEach(eventType => {
                        fileInput.dispatchEvent(new Event(eventType, { bubbles: true, cancelable: true }));
                    });


                    const instructions = header.querySelector('p');
                    if (instructions) {
                        instructions.innerHTML = '<strong style="color: #10b981;">✓ Styled image uploaded!</strong> Closing in 2 seconds...';
                    }

                    setTimeout(() => {
                        window.removeEventListener('message', handleExportMessage);
                        overlay.remove();
                    }, 2000);
                } else {
                    console.error('[Flavortown] Could not find file input');
                    const instructions = header.querySelector('p');
                    if (instructions) {
                        instructions.innerHTML = '<strong style="color: #ef4444;">Could not find upload field.</strong> Please close and try again.';
                    }
                }
            })
            .catch(err => {
                console.error('[Flavortown] Failed to process export:', err);
            });
    }

    window.addEventListener('message', handleExportMessage);

    async function getCurrentTabId() {
        return new Promise(resolve => {
            browserAPI.runtime.sendMessage({ type: 'GET_TAB_ID' }, (response) => {
                resolve(response?.tabId);
            });
        }).catch(() => null);
    }

    iframe.addEventListener('load', async () => {
        await new Promise(r => setTimeout(r, 500));

        if (imageUrl) {
            try {
                const response = await fetch(imageUrl);
                const blob = await response.blob();
                const reader = new FileReader();

                reader.onload = async () => {
                    const imageDataUrl = reader.result;

                    browserAPI.runtime.sendMessage({
                        type: 'INJECT_SHOTS_HELPER',
                        tabId: await getCurrentTabId(),
                        imageDataUrl: imageDataUrl
                    }, (response) => {
                        if (response?.success) {
                            const instructions = header.querySelector('p');
                            if (instructions) {
                                instructions.innerHTML = '<strong style="color: #10b981;">✓ Image loaded!</strong> Style it → click the green 📋 copy button!';
                            }
                        } else {
                            console.error('[Flavortown] Injection failed:', response?.error);
                            fallbackToClipboard(blob, header);
                        }
                    });
                };
                reader.readAsDataURL(blob);
            } catch (err) {
                console.error('[Flavortown] Error:', err);
            }
        } else {
            const instructions = header.querySelector('p');
            if (instructions) {
                instructions.innerHTML = 'Drop your image into the editor. Style it → click the green 📋 copy button!';
            }
        }
    });

    async function fallbackToClipboard(blob, header) {
        try {
            await navigator.clipboard.write([new ClipboardItem({ [blob.type]: blob })]);
            const instructions = header.querySelector('p');
            if (instructions) {
                instructions.innerHTML = '<strong style="color: #f59e0b;">Image copied to clipboard!</strong> Press Ctrl+V in shots.so to paste.';
            }
        } catch (e) {
            console.error('[Flavortown] Clipboard failed:', e);
        }
    }

    document.getElementById('flavortown-shots-close').addEventListener('click', () => {
        window.removeEventListener('message', handleExportMessage);
        overlay.remove();
    });

    const escHandler = (e) => {
        if (e.key === 'Escape') {
            window.removeEventListener('message', handleExportMessage);
            overlay.remove();
            document.removeEventListener('keydown', escHandler);
        }
    };
    document.addEventListener('keydown', escHandler);
}

function enhanceAchievementsPage() {
    if (!window.location.pathname.startsWith('/my/achievements')) return;
    if (document.querySelector('.flavortown-achievements-enhanced')) return;

    const statsSection = document.querySelector('.achievements__stats');
    if (!statsSection) return;

    const countEl = statsSection.querySelector('.achievements__stats-count');
    const totalEl = statsSection.querySelector('.achievements__stats-total');
    const fillEl = statsSection.querySelector('.achievements__stats-fill');
    const barEl = statsSection.querySelector('.achievements__stats-bar');

    const earned = countEl ? parseInt(countEl.textContent.trim(), 10) : 0;
    const total = totalEl ? parseInt(totalEl.textContent.trim(), 10) : 0;
    const percent = total > 0 ? Math.round((earned / total) * 100) : 0;

    if (fillEl && !fillEl.querySelector('.flavortown-percent')) {
        const percentLabel = document.createElement('span');
        percentLabel.className = 'flavortown-percent';
        percentLabel.textContent = `${percent}%`;
        percentLabel.style.cssText = 'position: absolute; right: 8px; top: 50%; transform: translateY(-50%); font-size: 0.8em; font-weight: 800; color: #fff; text-shadow: 0 1px 3px rgba(0,0,0,0.5), 0 0 8px rgba(0,0,0,0.3);';
        fillEl.style.position = 'relative';
        fillEl.appendChild(percentLabel);
    }

    let potentialCookies = 0;
    document.querySelectorAll('.achievements__card:not(.achievements__card--earned)').forEach(card => {
        const rewardEl = card.querySelector('.achievements__reward');
        if (rewardEl) {
            const match = rewardEl.textContent.match(/\+(\d+)/);
            if (match) potentialCookies += parseInt(match[1], 10);
        }
    });

    if (potentialCookies > 0) {
        const potentialLine = document.createElement('div');
        potentialLine.className = 'flavortown-achievements-enhanced';
        potentialLine.style.cssText = 'margin-top: 8px; font-size: 0.9em; color: var(--color-text-muted, #666); text-align: center;';
        potentialLine.innerHTML = `🍪 <strong>+${potentialCookies}</strong> potential cookies from remaining achievements`;
        statsSection.appendChild(potentialLine);
    }
}

function addSidebarItems() {
    const navList = document.querySelector('.sidebar__nav-list');
    if (!navList) return;

    if (document.querySelector('.flavortown-sidebar-achievements')) return;

    const currentPath = window.location.pathname;

    const createItem = (href, label, svgPath, className) => {
        const isActive = currentPath === href || currentPath.startsWith(href + '/');
        const li = document.createElement('li');
        li.className = `sidebar__nav-item ${className}`;
        li.innerHTML = `
            <a class="sidebar__nav-link${isActive ? ' sidebar__nav-link--active' : ''}" ${isActive ? 'aria-current="page"' : ''} href="${href}">
                <span class="sidebar__nav-icon-wrapper" aria-hidden="true">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" class="sidebar__nav-icon" fill="currentColor">
                        ${svgPath}
                    </svg>
                </span>
                <span class="sidebar__nav-label">${label}</span>
            </a>
        `;
        return li;
    };

    const achievementsItem = createItem(
        '/my/achievements',
        'Achievements',
        '<path d="M19 5h-2V3H7v2H5c-1.1 0-2 .9-2 2v1c0 2.55 1.92 4.63 4.39 4.94.63 1.5 1.98 2.63 3.61 2.96V19H7v2h10v-2h-4v-3.1c1.63-.33 2.98-1.46 3.61-2.96C19.08 12.63 21 10.55 21 8V7c0-1.1-.9-2-2-2zM5 8V7h2v3.82c-1.16-.41-2-1.51-2-2.82zm14 0c0 1.31-.84 2.41-2 2.82V7h2v1z"></path>',
        'flavortown-sidebar-achievements'
    );

    const leaderboardItem = createItem(
        '/leaderboard',
        'Leaderboard',
        '<path d="M7.5 21H2V9h5.5v12zm7.25-18h-5.5v18h5.5V3zM22 11h-5.5v10H22V11z"></path>',
        'flavortown-sidebar-leaderboard'
    );

    navList.appendChild(achievementsItem);
    navList.appendChild(leaderboardItem);
}

function addAdminViewButton() {
    const match = window.location.pathname.match(/^\/users\/(\d+)/);
    if (!match) return;

    const userId = match[1];
    const hasAdmin = document.querySelector('.sidebar__nav-link[href="/admin"]');
    if (!hasAdmin) return;

    if (document.querySelector('.flavortown-admin-view-btn')) return;

    const profileIdentity = document.querySelector('.user-profile__identity h1');
    if (!profileIdentity) return;

    const adminBtn = document.createElement('a');
    adminBtn.className = 'flavortown-admin-view-btn';
    adminBtn.href = `/admin/users/${userId}`;
    adminBtn.title = 'View in Admin';
    adminBtn.textContent = '👁️';
    adminBtn.style.cssText = 'margin-left: 8px; font-size: 0.8em; text-decoration: none; opacity: 0.7; cursor: pointer; transition: opacity 0.2s;';
    adminBtn.onmouseenter = () => adminBtn.style.opacity = '1';
    adminBtn.onmouseleave = () => adminBtn.style.opacity = '0.7';

    profileIdentity.appendChild(adminBtn);
}
