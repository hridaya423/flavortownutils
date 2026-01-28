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

const COOKIE_RATE_MIN = 1;
const COOKIE_RATE_MAX = 30;
const PAYOUT_LOW_DOLLARS_PER_HOUR = 0.3;
const PAYOUT_HIGH_DOLLARS_PER_HOUR = 6.0;
const PAYOUT_GAMMA = 1.745427173;
const PAYOUT_TICKETS_PER_DOLLAR = 5;
const PERCENTILE_HILL_SHAPE = 1.08;
const THEME_CACHE_KEY = 'flavortown-theme-cache';
const THEME_PRELOAD_STYLE_ID = 'flavortown-theme-preload';
const SLACK_EMOJI_URL = 'https://cachet.dunkirk.sh/emojis';
const THEME_PALETTE_VARS = [
    '--color-cream',
    '--color-cream-dark',
    '--color-brown',
    '--color-brown-light',
    '--color-brown-dark',
    '--color-background',
    '--color-surface',
    '--color-text-primary',
    '--color-text-secondary',
    '--color-text-muted',
    '--color-border',
    '--color-accent'
];
const SCORE_CURVE_COEFFS = [
    0.0654770022136067,
    4.9873443913234494,
    -23.337176021689906,
    58.83329667184651,
    -76.01887125623473,
    47.32169499600278,
    -10.863898322106492
];
const CATEGORY_SCORE_RANGES = {
    originality: { min: 1.3399256178444185, max: 5.825152142613143 },
    technical: { min: 1.1910278012630102, max: 6.15532650901786 },
    usability: { min: 1.5577755101474042, max: 5.333419758087392, percentileSlope: -0.3 },
    storytelling: { min: 0.9456184633427491, max: 6.136955727382335 }
};
const SHIP_PAYOUT_CACHE_KEY = 'flavortown_ship_payouts';
const SHIP_PAYOUT_CACHE_TTL = 15 * 60 * 1000;
const SHIP_TIME_CACHE_KEY = 'flavortown_ship_minutes';
const SHIP_TIME_CACHE_TTL = 24 * 60 * 60 * 1000;
const PROJECT_UNSHIPPED_CACHE_KEY = 'flavortown_project_unshipped';
const PROJECT_UNSHIPPED_CACHE_TTL = 24 * 60 * 60 * 1000;
const PROJECT_UNSHIPPED_CLEANUP_KEY = 'flavortown_project_unshipped_cleanup';
const SHOP_WISHLIST_ORDERED_ITEMS_KEY = 'flavortown_shop_wishlist_ordered';
const LOCAL_STORAGE_SYNC_ENABLED_KEY = 'flavortownLocalStorageSyncEnabled';
const LOCAL_STORAGE_SYNC_KEY = 'flavortownLocalStorageSync';
const LOCAL_STORAGE_IMPORT_KEY = 'flavortownLocalStorageImport';
const LOCAL_STORAGE_SYNC_UPDATED_AT_KEY = 'flavortownLocalStorageSyncUpdatedAt';
const LOCAL_STORAGE_SYNC_MAX_BYTES = 90000;
const LOCAL_STORAGE_SYNC_KEYS = [
    'flavortown_progress_mode',
    'flavortown_projection_mode',
    'shop_wishlist',
    'shop_wishlist_priorities',
    'shop_wishlist_order',
    'flavortown_project_stats',
    'flavortown_tutorial_state',
    'flavortown_cmd_recent'
];
let localStorageSyncTimer = null;
let isApplyingLocalStorageSync = false;
let localStorageSyncEnabled = false;
let localStoragePatched = false;
const originalLocalStorageSetItem = localStorage.setItem.bind(localStorage);
const originalLocalStorageRemoveItem = localStorage.removeItem.bind(localStorage);

function loadTheme() {
    browserAPI.storage.sync.get(['theme', 'customColors', 'catppuccinAccent'], (result) => {
        const theme = result.theme || 'default';
        const customColors = result.customColors || {};
        const catppuccinAccent = result.catppuccinAccent || 'mauve';
        applyTheme(theme, customColors, catppuccinAccent);
    });
}

function initLocalStorageSync() {
    browserAPI.storage.sync.get([LOCAL_STORAGE_SYNC_ENABLED_KEY, LOCAL_STORAGE_SYNC_KEY, LOCAL_STORAGE_IMPORT_KEY], (result) => {
        const enabled = !!result[LOCAL_STORAGE_SYNC_ENABLED_KEY];
        const importPayload = result[LOCAL_STORAGE_IMPORT_KEY];
        if (importPayload) {
            applyLocalStorageImport(importPayload);
        }
        const payload = result[LOCAL_STORAGE_SYNC_KEY];
        if (enabled) {
            enableLocalStorageSync(payload);
        } else {
            disableLocalStorageSync();
        }
    });

    browserAPI.storage.onChanged.addListener((changes, area) => {
        if (area !== 'sync') return;

        if (changes[LOCAL_STORAGE_IMPORT_KEY]?.newValue) {
            applyLocalStorageImport(changes[LOCAL_STORAGE_IMPORT_KEY].newValue);
        }

        if (changes[LOCAL_STORAGE_SYNC_ENABLED_KEY]) {
            const enabled = !!changes[LOCAL_STORAGE_SYNC_ENABLED_KEY].newValue;
            if (enabled) {
                enableLocalStorageSync(changes[LOCAL_STORAGE_SYNC_KEY]?.newValue);
            } else {
                disableLocalStorageSync();
            }
        }

        if (localStorageSyncEnabled && changes[LOCAL_STORAGE_SYNC_KEY]) {
            applyLocalStorageSyncPayload(changes[LOCAL_STORAGE_SYNC_KEY].newValue);
        }
    });
}

function applyLocalStorageImport(payload) {
    if (!payload || typeof payload !== 'object' || !payload.data) return;
    applyLocalStorageSnapshot(payload.data, payload.updatedAt || Date.now());
    browserAPI.storage.sync.remove(LOCAL_STORAGE_IMPORT_KEY);
}

function enableLocalStorageSync(payload) {
    if (localStorageSyncEnabled && localStoragePatched) {
        if (payload) applyLocalStorageSyncPayload(payload);
        return;
    }
    localStorageSyncEnabled = true;
    patchLocalStorageSyncHandlers();
    const payloadUpdatedAt = Number(payload?.updatedAt || 0);
    const localUpdatedAt = Number(localStorage.getItem(LOCAL_STORAGE_SYNC_UPDATED_AT_KEY) || 0);
    if (payload && payloadUpdatedAt > localUpdatedAt) {
        applyLocalStorageSyncPayload(payload);
    }
    if (!payload || localUpdatedAt > payloadUpdatedAt) {
        scheduleLocalStorageSyncWrite();
    }
}

function disableLocalStorageSync() {
    localStorageSyncEnabled = false;
    clearTimeout(localStorageSyncTimer);
    localStorageSyncTimer = null;
    if (localStoragePatched) {
        localStorage.setItem = originalLocalStorageSetItem;
        localStorage.removeItem = originalLocalStorageRemoveItem;
        localStoragePatched = false;
    }
}

function patchLocalStorageSyncHandlers() {
    if (localStoragePatched) return;
    localStoragePatched = true;
    localStorage.setItem = (key, value) => {
        originalLocalStorageSetItem(key, value);
        if (!isApplyingLocalStorageSync && shouldSyncLocalStorageKey(key)) {
            scheduleLocalStorageSyncWrite();
        }
    };

    localStorage.removeItem = (key) => {
        originalLocalStorageRemoveItem(key);
        if (!isApplyingLocalStorageSync && shouldSyncLocalStorageKey(key)) {
            scheduleLocalStorageSyncWrite();
        }
    };
}

function shouldSyncLocalStorageKey(key) {
    if (!key || key === LOCAL_STORAGE_SYNC_UPDATED_AT_KEY) return false;
    return LOCAL_STORAGE_SYNC_KEYS.includes(key);
}

function getLocalStorageSnapshot(keys = LOCAL_STORAGE_SYNC_KEYS) {
    const snapshot = {};
    keys.forEach((key) => {
        const value = localStorage.getItem(key);
        if (value !== null) {
            snapshot[key] = value;
        }
    });
    return snapshot;
}

function applyLocalStorageSyncPayload(payload) {
    if (!payload || typeof payload !== 'object' || !payload.data) return;
    const updatedAt = Number(payload.updatedAt || 0);
    const localUpdatedAt = Number(localStorage.getItem(LOCAL_STORAGE_SYNC_UPDATED_AT_KEY) || 0);
    if (updatedAt && updatedAt <= localUpdatedAt) return;
    applyLocalStorageSnapshot(payload.data, updatedAt || Date.now());
}

function applyLocalStorageSnapshot(snapshot, updatedAt) {
    if (!snapshot || typeof snapshot !== 'object') return;
    isApplyingLocalStorageSync = true;
    try {
        LOCAL_STORAGE_SYNC_KEYS.forEach((key) => {
            if (!(key in snapshot)) return;
            const value = snapshot[key];
            const prevValue = localStorage.getItem(key);
            if (value === null || value === undefined) {
                originalLocalStorageRemoveItem(key);
                emitLocalStorageEvent(key, null, prevValue);
            } else {
                const normalized = typeof value === 'string' ? value : JSON.stringify(value);
                originalLocalStorageSetItem(key, normalized);
                if (normalized !== prevValue) {
                    emitLocalStorageEvent(key, normalized, prevValue);
                }
            }
        });
        if (updatedAt) {
            originalLocalStorageSetItem(LOCAL_STORAGE_SYNC_UPDATED_AT_KEY, String(updatedAt));
        }
    } finally {
        isApplyingLocalStorageSync = false;
    }
}

function emitLocalStorageEvent(key, newValue, oldValue) {
    try {
        const event = new StorageEvent('storage', {
            key,
            newValue,
            oldValue,
            storageArea: localStorage,
            url: window.location.href
        });
        window.dispatchEvent(event);
    } catch (e) {
        const fallbackEvent = new Event('storage');
        window.dispatchEvent(fallbackEvent);
    }
}

function scheduleLocalStorageSyncWrite() {
    if (!localStorageSyncEnabled) return;
    if (isApplyingLocalStorageSync) return;
    clearTimeout(localStorageSyncTimer);
    localStorageSyncTimer = setTimeout(writeLocalStorageSync, 800);
}

function writeLocalStorageSync() {
    if (!localStorageSyncEnabled) return;
    if (isApplyingLocalStorageSync) return;
    const data = getLocalStorageSnapshot();
    const payload = {
        version: 1,
        updatedAt: Date.now(),
        data
    };
    const serialized = JSON.stringify(payload);
    if (serialized.length > LOCAL_STORAGE_SYNC_MAX_BYTES) {
        console.warn('Local storage sync payload too large, skipping sync');
        return;
    }
    browserAPI.storage.sync.set({ [LOCAL_STORAGE_SYNC_KEY]: payload });
    originalLocalStorageSetItem(LOCAL_STORAGE_SYNC_UPDATED_AT_KEY, String(payload.updatedAt));
}

function readThemeCache() {
    try {
        const cached = localStorage.getItem(THEME_CACHE_KEY);
        return cached ? JSON.parse(cached) : null;
    } catch (e) {
        return null;
    }
}

function writeThemeCache(data) {
    try {
        localStorage.setItem(THEME_CACHE_KEY, JSON.stringify(data));
    } catch (e) {
    }
}

function captureThemePalette() {
    const styles = getComputedStyle(document.documentElement);
    const palette = {};
    THEME_PALETTE_VARS.forEach(varName => {
        const value = styles.getPropertyValue(varName).trim();
        if (value) palette[varName] = value;
    });
    return palette;
}

function cacheThemePalette(theme, customColors, catppuccinAccent) {
    const palette = captureThemePalette();
    if (!palette || Object.keys(palette).length === 0) return;
    writeThemeCache({
        theme: theme || 'default',
        customColors: customColors || {},
        catppuccinAccent: catppuccinAccent || 'mauve',
        palette
    });
}

function applyTheme(theme, customColors, catppuccinAccent = 'mauve') {
    writeThemeCache({
        theme: theme || 'default',
        customColors: customColors || {},
        catppuccinAccent: catppuccinAccent || 'mauve',
        palette: readThemeCache()?.palette || {}
    });

    const preloadStyle = document.getElementById(THEME_PRELOAD_STYLE_ID);
    if (preloadStyle) preloadStyle.remove();

    const existingTheme = document.getElementById('flavortown-theme');
    if (existingTheme) existingTheme.remove();

    const existingCustom = document.getElementById('flavortown-custom-vars');
    if (existingCustom) existingCustom.remove();
    
    const existingAccent = document.getElementById('flavortown-accent-override');
    if (existingAccent) existingAccent.remove();

    if (theme === 'default') {
        setTimeout(() => {
            document.dispatchEvent(new CustomEvent('flavortown-theme-changed', { detail: { theme } }));
        }, 100);
        return;
    }

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
        setTimeout(() => cacheThemePalette(theme, customColors, catppuccinAccent), 0);
    } else {
        const link = document.createElement('link');
        link.id = 'flavortown-theme';
        link.rel = 'stylesheet';
        link.href = browserAPI.runtime.getURL(`themes/${theme}.css`);
        link.addEventListener('load', () => {
            setTimeout(() => cacheThemePalette(theme, customColors, catppuccinAccent), 0);
        });
        document.head.appendChild(link);


        if (['catppuccin', 'sea', 'overcooked'].includes(theme)) {
            setTimeout(() => recolorBackgroundTexture(theme), 0);
        }
        
        if (theme === 'catppuccin' && catppuccinAccent === 'lavender') {
            const accentStyle = document.createElement('style');
            accentStyle.id = 'flavortown-accent-override';
            accentStyle.textContent = `
:root {
    --ctp-mauve: #b4befe !important;
    --color-brown: #b4befe !important;
    --color-accent: #b4befe !important;
}
`;
            document.head.appendChild(accentStyle);
        }
    }
    
    setTimeout(() => {
        document.dispatchEvent(new CustomEvent('flavortown-theme-changed', { detail: { theme } }));
    }, 100);
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
        applyTheme(message.theme, message.customColors || {}, message.catppuccinAccent || 'mauve');
        sendResponse({ success: true });
    }
    if (message.type === 'EXPORT_DATA') {
        const keys = Array.isArray(message.keys) ? message.keys : LOCAL_STORAGE_SYNC_KEYS;
        const localStorageData = getLocalStorageSnapshot(keys);
        sendResponse({ localStorage: localStorageData });
    }
    if (message.type === 'IMPORT_DATA') {
        applyLocalStorageSnapshot(message.localStorage || {}, Date.now());
        scheduleLocalStorageSyncWrite();
        sendResponse({ success: true });
    }
    return true;
});

function addDevlogFrequencyStat() {
    if (!/\/projects\/\d+$/.test(window.location.pathname)) {
        return;
    }
    if (document.querySelector('.flavortown-utils-frequency-stat')) return;

    const statsContainer = document.querySelector('.project-show-card__stats');
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
        const timeMatch = text.match(/(\d+)h[r]?\s*(\d+)m[in]*/);
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
        <span>${avgHours > 0 ? avgHours + 'h ' : ''}${avgMins}m/devlog</span>
    `;
    statsContainer.appendChild(frequencyStat);
}

function addVotesDevlogFrequencyStat() {
    if (!window.location.pathname.startsWith('/votes/new')) return;

    const cards = document.querySelectorAll('.votes-new__project-card');
    if (!cards.length) return;

    cards.forEach(card => {
        if (card.querySelector('.flavortown-votes-devlog-frequency')) return;

        const statsContainer = card.querySelector('.votes-new__project-card-stats');
        if (!statsContainer) return;

        const statTexts = Array.from(statsContainer.querySelectorAll('.votes-new__project-card-stat span'))
            .map(span => span.textContent.trim())
            .filter(Boolean);

        const devlogText = statTexts.find(text => /devlogs?/i.test(text));
        const timeText = statTexts.find(text => /\d+h|\d+m|\d+s/i.test(text));
        if (!devlogText || !timeText) return;

        const devlogMatch = devlogText.match(/(\d+)\s*devlogs?/i);
        const devlogCount = devlogMatch ? parseInt(devlogMatch[1], 10) : 0;
        const totalMinutes = parseDurationToMinutes(timeText);
        if (!devlogCount || !totalMinutes) return;

        const avgMinutes = Math.max(1, Math.round(totalMinutes / devlogCount));
        const avgHours = Math.floor(avgMinutes / 60);
        const avgMins = avgMinutes % 60;
        const avgText = `${avgHours > 0 ? `${avgHours}h ` : ''}${avgMins}m`;

        const freqStat = document.createElement('div');
        freqStat.className = 'votes-new__project-card-stat flavortown-votes-devlog-frequency';
        freqStat.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.5-13H11v6l5.2 3.2.8-1.3-4.5-2.7V7z"/></svg>
            <span>1 devlog every ${avgText}</span>
        `;

        statsContainer.appendChild(freqStat);
    });
}

function addShipStats() {
    if (!/\/projects\/\d+$/.test(window.location.pathname)) {
        return;
    }

    const shipPosts = document.querySelectorAll('article.post--ship, .post--ship');
    if (!shipPosts.length) return;

    shipPosts.forEach((shipPost) => {
        if (shipPost.querySelector('.flavortown-ship-stats')) return;

        let totalMinutes = 0;
        let devlogCount = 0;

        const timeEl = shipPost.querySelector('.post__time');
        const shipDate = timeEl ? parseDateFromTimeElement(timeEl) : null;

        let currentElement = shipPost.nextElementSibling;
        while (currentElement) {
            if (currentElement.classList.contains('post--ship')) {
                break;
            }

            if (currentElement.classList.contains('post--devlog')) {
                devlogCount++;
                const durationEl = currentElement.querySelector('.post__duration');
                if (durationEl) {
                    const durationText = durationEl.textContent.trim();
                    totalMinutes += parseDurationToMinutes(durationText);
                }
            }

            currentElement = currentElement.nextElementSibling;
        }

        if (devlogCount === 0) return;

        const totalHours = Math.floor(totalMinutes / 60);
        const remainingMins = totalMinutes % 60;

        const statsDiv = document.createElement('div');
        statsDiv.className = 'flavortown-ship-stats';
        statsDiv.style.cssText = `
            display: flex;
            flex-wrap: wrap;
            gap: 16px;
            margin-top: 12px;
            padding: 12px 16px;
            background: var(--catppuccin-surface0, var(--color-cream-dark, rgba(0,0,0,0.05)));
            border-radius: 8px;
            font-size: 0.9em;
        `;

        statsDiv.dataset.shipMinutes = totalMinutes.toString();
        if (shipDate) {
            statsDiv.dataset.shipDate = shipDate.toISOString();
        }

        statsDiv.innerHTML = `
            <div style="display: flex; align-items: center; gap: 6px;">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style="opacity: 0.7;">
                    <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.5-13H11v6l5.2 3.2.8-1.3-4.5-2.7V7z"/>
                </svg>
                <span><strong>Total time:</strong> ${totalHours}h ${remainingMins}m</span>
            </div>
            <div style="display: flex; align-items: center; gap: 6px;">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style="opacity: 0.7;">
                    <path d="m19.18 7.132-4.206-4.306c-.512-.513-1.23-.82-2.05-.82H6.871C5.333 1.903 4 3.236 4 4.774v14.355A2.866 2.866 0 0 0 6.872 22h10.256A2.866 2.866 0 0 0 20 19.129V9.081c0-.718-.308-1.436-.82-1.949M8.923 10.106H12c.41 0 .82.308.82.82 0 .513-.307.82-.82.82H8.923a.81.81 0 0 1-.82-.82c0-.513.41-.82.82-.82m6.154 5.742H8.923c-.41 0-.82-.308-.82-.82s.307-.82.82-.82h6.154c.41 0 .82.307.82.82s-.41.82-.82.82"/>
                </svg>
                <span><strong>${devlogCount}</strong> devlog${devlogCount !== 1 ? 's' : ''} on this ship</span>
            </div>
        `;

        const postBody = shipPost.querySelector('.post__body');
        if (postBody) {
            postBody.after(statsDiv);
        } else {
            const shipTitle = shipPost.querySelector('.post__ship-title');
            if (shipTitle) {
                shipTitle.after(statsDiv);
            }
        }
    });
}

function ensureShipStatsReady() {
    if (!/\/projects\/\d+$/.test(window.location.pathname)) return;
    const shipPosts = document.querySelectorAll('article.post--ship, .post--ship');
    if (!shipPosts.length) return;
    if (document.querySelector('.flavortown-ship-stats')) return;

    addShipStats();
}

function normalizeProjectName(name) {
    return (name || '')
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, '')
        .replace(/\s+/g, ' ')
        .trim();
}

function projectNameMatches(nameA, nameB) {
    if (!nameA || !nameB) return false;
    const normalizedA = normalizeProjectName(nameA);
    const normalizedB = normalizeProjectName(nameB);
    return normalizedA === normalizedB || normalizedA.includes(normalizedB) || normalizedB.includes(normalizedA);
}

const PROJECT_REPO_MAP_KEY = 'flavortown-project-repo-map';
const PROJECT_REPO_MAP_TTL = 2 * 60 * 60 * 1000;
const GITHUB_USERNAME_KEY = 'flavortown-github-username';
const GITHUB_REPOS_CACHE_PREFIX = 'flavortown-github-repos-';
const GITHUB_REPOS_CACHE_TTL = 15 * 60 * 1000;
const REPO_SUGGESTION_DISMISS_KEY = 'flavortown-repo-suggest-dismissed';
const REPO_SUGGESTION_PENDING_KEY = 'flavortown-repo-suggest-pending';
let githubUsernameLookupPromise = null;
let githubReposLookupPromise = null;

function readProjectRepoMap() {
    try {
        const raw = localStorage.getItem(PROJECT_REPO_MAP_KEY);
        if (!raw) return {};
        const parsed = JSON.parse(raw);
        if (!parsed || typeof parsed !== 'object') return {};
        const now = Date.now();
        if (parsed.updatedAt && now - parsed.updatedAt > PROJECT_REPO_MAP_TTL) return {};
        return parsed.data || {};
    } catch (e) {
        return {};
    }
}

function writeProjectRepoMap(data) {
    try {
        localStorage.setItem(PROJECT_REPO_MAP_KEY, JSON.stringify({
            updatedAt: Date.now(),
            data: data || {}
        }));
    } catch (e) {
    }
}

function getDismissedRepoSuggestions() {
    try {
        const raw = localStorage.getItem(REPO_SUGGESTION_DISMISS_KEY);
        return raw ? JSON.parse(raw) : {};
    } catch (e) {
        return {};
    }
}

function setDismissedRepoSuggestion(key) {
    if (!key) return;
    const dismissed = getDismissedRepoSuggestions();
    dismissed[key] = Date.now();
    try {
        localStorage.setItem(REPO_SUGGESTION_DISMISS_KEY, JSON.stringify(dismissed));
    } catch (e) {
    }
}

function extractGithubUsernameFromUrl(url) {
    if (!url) return null;
    const match = url.match(/github\.com\/?([^/?#]+)/i);
    return match ? match[1] : null;
}

function normalizeGithubRepoUrl(url) {
    if (!url) return null;
    try {
        const parsed = new URL(url, window.location.origin);
        if (!parsed.hostname.includes('github.com')) return null;
        const parts = parsed.pathname.split('/').filter(Boolean);
        if (parts.length < 2) return null;
        const owner = parts[0];
        const repo = parts[1].replace(/\.git$/i, '');
        if (!owner || !repo) return null;
        return `https://github.com/${owner}/${repo}`;
    } catch (e) {
        return null;
    }
}

function extractGithubProfileUsername(url) {
    if (!url) return null;
    try {
        const parsed = new URL(url, window.location.origin);
        if (!parsed.hostname.includes('github.com')) return null;
        const parts = parsed.pathname.split('/').filter(Boolean);
        if (parts.length !== 1) return null;
        return parts[0];
    } catch (e) {
        return null;
    }
}

function normalizeRepoName(name) {
    return normalizeProjectName(name || '');
}

async function fetchProjectsIndexData() {
    try {
        const res = await fetch('/projects', { credentials: 'same-origin' });
        if (!res.ok) return [];
        const html = await res.text();
        const doc = new DOMParser().parseFromString(html, 'text/html');
        const cards = Array.from(doc.querySelectorAll('.project-card'));
        return cards.map(card => {
            const link = card.querySelector('a[href*="/projects/"]');
            const href = link ? link.getAttribute('href') : null;
            const name = card.querySelector('.project-card__title-link')?.textContent?.trim() || null;
            const stats = Array.from(card.querySelectorAll('.project-card__stats h5'));
            let minutes = 0;
            stats.forEach(stat => {
                const parsed = parseDurationToMinutes(stat.textContent || '');
                if (parsed > minutes) minutes = parsed;
            });
            const shipped = !!card.querySelector('.badge--shipped, .badge-shipped, .project-card__badge--shipped, .shipped');
            return { name, href, minutes, shipped };
        }).filter(item => item.name && item.href);
    } catch (e) {
        return [];
    }
}

function extractRepoUrlFromProjectDoc(doc) {
    if (!doc) return null;
    const repoButton = Array.from(doc.querySelectorAll('.project-show-card a.btn[href*="github.com"], .project-show-card a[href*="github.com"]'))
        .find(link => {
            const text = (link.textContent || '').trim().toLowerCase();
            return text.includes('repo') || text.includes('repository');
        });
    const repoUrl = repoButton ? repoButton.getAttribute('href') : null;
    return normalizeGithubRepoUrl(repoUrl);
}

async function getRepoUrlForProjectName(projectName) {
    if (!projectName) return null;
    const normalizedName = normalizeProjectName(projectName);
    const repoMap = readProjectRepoMap();
    if (repoMap[normalizedName]) return repoMap[normalizedName];

    const projects = await fetchProjectsIndexData();
    const match = projects.find(project => normalizeProjectName(project.name) === normalizedName);
    if (!match || !match.href) return null;

    try {
        const res = await fetch(match.href, { credentials: 'same-origin' });
        if (!res.ok) return null;
        const html = await res.text();
        const doc = new DOMParser().parseFromString(html, 'text/html');
        const owner = getProjectOwnerNameFromDocument(doc);
        if (owner && normalizeOwnerName(owner) !== normalizeOwnerName(getCurrentUserName())) return null;
        const repoUrl = extractRepoUrlFromProjectDoc(doc);
        if (repoUrl) {
            repoMap[normalizedName] = repoUrl;
            writeProjectRepoMap(repoMap);
        }
        return repoUrl || null;
    } catch (e) {
        return null;
    }
}

function getCachedGithubUsernameEntry() {
    const raw = localStorage.getItem(GITHUB_USERNAME_KEY);
    if (!raw) return null;
    try {
        const parsed = JSON.parse(raw);
        if (parsed && parsed.username) return parsed;
    } catch (e) {
    }
    return { username: raw, source: 'legacy' };
}

function getCachedGithubUsername() {
    const entry = getCachedGithubUsernameEntry();
    return entry ? entry.username : null;
}

function setCachedGithubUsername(username, source = 'project-scan') {
    if (!username) return;
    try {
        localStorage.setItem(GITHUB_USERNAME_KEY, JSON.stringify({
            username,
            source,
            updatedAt: Date.now()
        }));
    } catch (e) {
    }
}

async function fetchGithubUsernameFromProfile() {
    const profileLink = document.querySelector('a[href^="/users/"]');
    if (!profileLink) return null;
    const href = profileLink.getAttribute('href');
    if (!href) return null;

    try {
        const res = await fetch(href, { credentials: 'same-origin' });
        if (!res.ok) return null;
        const html = await res.text();
        const doc = new DOMParser().parseFromString(html, 'text/html');
        const ghLinks = Array.from(doc.querySelectorAll('a[href*="github.com/"]'));
        const profileLink = ghLinks.find(link => extractGithubProfileUsername(link.getAttribute('href')));
        const username = profileLink ? extractGithubProfileUsername(profileLink.getAttribute('href')) : null;
        if (username) setCachedGithubUsername(username, 'profile');
        return username || null;
    } catch (e) {
        return null;
    }
}

async function findGithubUsernameFromProjectsIndex() {
    const projects = await fetchProjectsIndexData();
    if (!projects.length) return null;

    const sorted = projects.slice().sort((a, b) => {
        if (!!a.shipped !== !!b.shipped) return a.shipped ? -1 : 1;
        return (b.minutes || 0) - (a.minutes || 0);
    });

    const currentUser = getCurrentUserName();
    if (!currentUser) return null;

    const repoMap = readProjectRepoMap();

    for (const project of sorted) {
        try {
            const res = await fetch(project.href, { credentials: 'same-origin' });
            if (!res.ok) continue;
            const html = await res.text();
            const doc = new DOMParser().parseFromString(html, 'text/html');
            const owner = getProjectOwnerNameFromDocument(doc);
            if (!owner || normalizeOwnerName(owner) !== normalizeOwnerName(currentUser)) continue;

            const repoUrl = extractRepoUrlFromProjectDoc(doc);
            if (!repoUrl) continue;
            const normalizedRepo = normalizeGithubRepoUrl(repoUrl);
            if (!normalizedRepo) continue;

            const username = extractGithubUsernameFromUrl(normalizedRepo);
            if (!username) continue;

            const normalizedName = normalizeProjectName(project.name);
            if (normalizedName) {
                repoMap[normalizedName] = normalizedRepo;
                writeProjectRepoMap(repoMap);
            }

            setCachedGithubUsername(username, 'project-scan');
            return username;
        } catch (e) {
        }
    }

    return null;
}

async function resolveGithubUsername() {
    if (githubUsernameLookupPromise) return githubUsernameLookupPromise;

    githubUsernameLookupPromise = (async () => {
        const cached = getCachedGithubUsernameEntry();
        if (cached && cached.source === 'project-scan') return cached.username;

        const fromProjects = await findGithubUsernameFromProjectsIndex();
        if (fromProjects) return fromProjects;

        if (cached && cached.source === 'profile') return cached.username;

        const profile = await fetchGithubUsernameFromProfile();
        return profile || null;
    })();

    const result = await githubUsernameLookupPromise;
    if (!result) {
        githubUsernameLookupPromise = null;
    }
    return result;
}

function readGithubReposCache(username) {
    if (!username) return null;
    try {
        const raw = localStorage.getItem(`${GITHUB_REPOS_CACHE_PREFIX}${username}`);
        if (!raw) return null;
        const parsed = JSON.parse(raw);
        if (!parsed || !Array.isArray(parsed.data)) return null;
        const sample = parsed.data[0];
        if (sample && typeof sample.homepage === 'undefined' && typeof sample.has_pages === 'undefined') {
            return null;
        }
        if (parsed.updatedAt && Date.now() - parsed.updatedAt > GITHUB_REPOS_CACHE_TTL) return null;
        return parsed.data;
    } catch (e) {
        return null;
    }
}

function writeGithubReposCache(username, repos) {
    if (!username) return;
    try {
        localStorage.setItem(`${GITHUB_REPOS_CACHE_PREFIX}${username}`, JSON.stringify({
            updatedAt: Date.now(),
            data: repos || []
        }));
    } catch (e) {
    }
}

async function fetchGithubRepos(username) {
    if (!username) return [];
    const cached = readGithubReposCache(username);
    if (cached) return cached;

    try {
        const res = await fetch(`https://api.github.com/users/${username}/repos?per_page=100&sort=updated`, {
            headers: { 'Accept': 'application/vnd.github+json' }
        });
        if (!res.ok) return [];
        const data = await res.json();
        const repos = Array.isArray(data) ? data.map(repo => ({
            name: repo.name,
            full_name: repo.full_name,
            html_url: repo.html_url,
            homepage: repo.homepage,
            has_pages: repo.has_pages,
            owner: repo.owner ? { login: repo.owner.login } : null
        })) : [];
        writeGithubReposCache(username, repos);
        return repos;
    } catch (e) {
        return [];
    }
}

async function resolveGithubRepos() {
    const username = await resolveGithubUsername();
    if (!username) return [];
    if (githubReposLookupPromise) return githubReposLookupPromise;

    githubReposLookupPromise = fetchGithubRepos(username);
    const result = await githubReposLookupPromise;
    if (!result || !result.length) {
        githubReposLookupPromise = null;
    }
    return result || [];
}

function findBestRepoMatch(projectName, repos) {
    if (!projectName || !repos || !repos.length) return null;
    const normalizedProject = normalizeRepoName(projectName);
    let best = null;
    let bestScore = 0;

    repos.forEach(repo => {
        const repoName = normalizeRepoName(repo.name);
        if (!repoName) return;
        let score = 0;
        if (repoName === normalizedProject) score = 3;
        else if (repoName.includes(normalizedProject) || normalizedProject.includes(repoName)) score = 2;
        else if (repoName.startsWith(normalizedProject) || normalizedProject.startsWith(repoName)) score = 1;
        if (score > bestScore) {
            bestScore = score;
            best = repo;
        }
    });

    return bestScore > 0 ? best : null;
}

function getDemoUrlFromRepo(repo) {
    if (!repo) return null;
    const homepage = (repo.homepage || '').trim();
    const normalizedHomepage = normalizeDemoUrl(homepage);
    if (normalizedHomepage && isLikelyValidDemoUrl(normalizedHomepage)) return normalizedHomepage;

    if (repo.has_pages && repo.owner?.login && repo.name) {
        const url = `https://${repo.owner.login}.github.io/${repo.name}`;
        if (isLikelyValidDemoUrl(url)) return url;
    }

    return null;
}

function normalizeDemoUrl(url) {
    if (!url) return null;
    const trimmed = url.trim();
    if (!trimmed) return null;
    if (/^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(trimmed)) return trimmed;
    return `https://${trimmed}`;
}

function isLikelyValidDemoUrl(url) {
    if (!url) return false;
    try {
        const parsed = new URL(url, window.location.origin);
        if (!['http:', 'https:'].includes(parsed.protocol)) return false;
        if (parsed.hostname.includes('github.com')) return false;
        if (parsed.hostname.includes('api.github.com')) return false;
        return true;
    } catch (e) {
        return false;
    }
}

function createRepoSuggestionCard({ title, repoUrl, actionLabel, onConfirm, onDismiss }) {
    const card = document.createElement('div');
    card.className = 'flavortown-repo-suggestion';
    card.innerHTML = `
        <div class="flavortown-repo-suggestion__label">${title}</div>
        <div class="flavortown-repo-suggestion__row">
            <span class="flavortown-repo-suggestion__repo">${repoUrl}</span>
            <div class="flavortown-repo-suggestion__actions">
                <button type="button" class="flavortown-repo-suggestion__btn flavortown-repo-suggestion__btn--primary">${actionLabel}</button>
                <button type="button" class="flavortown-repo-suggestion__btn flavortown-repo-suggestion__btn--ghost">Not now</button>
            </div>
        </div>
    `;

    const [primaryBtn, dismissBtn] = card.querySelectorAll('button');
    if (primaryBtn) primaryBtn.addEventListener('click', onConfirm);
    if (dismissBtn) dismissBtn.addEventListener('click', onDismiss);
    return card;
}

function createProjectLinksSuggestionCard({
    label,
    repoUrl,
    demoUrl,
    repoActionLabel,
    demoActionLabel,
    onRepo,
    onDemo,
    onDismiss,
    onApplyAll
}) {
    const card = document.createElement('div');
    card.className = 'flavortown-repo-suggestion flavortown-links-suggestion';

    const headerLabel = label || 'I found links for this project';
    const repoBtnLabel = repoActionLabel || 'Link repo';
    const demoBtnLabel = demoActionLabel || 'Link demo';

    const rows = [];
    if (repoUrl) {
        rows.push(`
            <div class="flavortown-repo-suggestion__row">
                <span class="flavortown-repo-suggestion__repo">
                    <span class="flavortown-repo-suggestion__tag">Repo</span>
                    <span class="flavortown-repo-suggestion__url">${repoUrl}</span>
                </span>
                <div class="flavortown-repo-suggestion__actions">
                    <button type="button" class="flavortown-repo-suggestion__btn flavortown-repo-suggestion__btn--primary" data-action="repo">${repoBtnLabel}</button>
                </div>
            </div>
        `);
    }

    if (demoUrl) {
        rows.push(`
            <div class="flavortown-repo-suggestion__row">
                <span class="flavortown-repo-suggestion__repo">
                    <span class="flavortown-repo-suggestion__tag">Demo</span>
                    <span class="flavortown-repo-suggestion__url">${demoUrl}</span>
                </span>
                <div class="flavortown-repo-suggestion__actions">
                    <button type="button" class="flavortown-repo-suggestion__btn flavortown-repo-suggestion__btn--primary" data-action="demo">${demoBtnLabel}</button>
                </div>
            </div>
        `);
    }

    card.innerHTML = `
        <div class="flavortown-repo-suggestion__header">
            <div class="flavortown-repo-suggestion__label">${headerLabel}</div>
            <div class="flavortown-repo-suggestion__header-actions">
                <button type="button" class="flavortown-repo-suggestion__apply" aria-label="Autofill all">✓</button>
                <button type="button" class="flavortown-repo-suggestion__close" aria-label="Dismiss">×</button>
            </div>
        </div>
        ${rows.join('')}
    `;

    const repoBtn = card.querySelector('[data-action="repo"]');
    const demoBtn = card.querySelector('[data-action="demo"]');
    const dismissBtn = card.querySelector('.flavortown-repo-suggestion__close');
    const applyAllBtn = card.querySelector('.flavortown-repo-suggestion__apply');

    if (repoBtn) repoBtn.addEventListener('click', onRepo);
    if (demoBtn) demoBtn.addEventListener('click', onDemo);
    if (dismissBtn) dismissBtn.addEventListener('click', onDismiss);
    if (applyAllBtn) applyAllBtn.addEventListener('click', onApplyAll);

    return card;
}

async function getRepoSuggestionForProjectName(projectName) {
    const repoFromProjects = await getRepoUrlForProjectName(projectName);
    if (repoFromProjects) {
        const normalized = normalizeGithubRepoUrl(repoFromProjects);
        if (normalized) return { repoUrl: normalized, source: 'project' };
    }

    const username = await resolveGithubUsername();
    if (!username) return null;

    const repos = await resolveGithubRepos();
    const match = findBestRepoMatch(projectName, repos);
    if (!match || !match.html_url) return null;
    const normalized = normalizeGithubRepoUrl(match.html_url);
    if (!normalized) return null;
    return { repoUrl: normalized, source: 'github' };
}

async function getLinkSuggestionsForProjectName(projectName) {
    const repoSuggestion = await getRepoSuggestionForProjectName(projectName);
    const demoSuggestion = await getDemoSuggestionForProjectName(projectName);
    return {
        repoUrl: repoSuggestion?.repoUrl || null,
        demoUrl: demoSuggestion?.demoUrl || null
    };
}

async function getDemoSuggestionForProjectName(projectName) {
    const repos = await resolveGithubRepos();
    const match = findBestRepoMatch(projectName, repos);
    if (!match) return null;
    const demoUrl = getDemoUrlFromRepo(match);
    if (!demoUrl) return null;
    return { demoUrl };
}

function findDemoInput() {
    const direct = document.querySelector('#project_demo_url')
        || document.querySelector('input[name="project[demo_url]"]')
        || document.querySelector('input[name="project[demo]"]');
    if (direct) return direct;

    const fuzzy = document.querySelector(
        'input[type="url"][id*="demo" i], input[type="text"][id*="demo" i], input[type="url"][name*="demo" i], input[type="text"][name*="demo" i]'
    );
    if (fuzzy) return fuzzy;

    const labels = Array.from(document.querySelectorAll('.input__label'));
    const label = labels.find(el => (el.textContent || '').toLowerCase().includes('demo'));
    if (!label) return null;
    const container = label.closest('.input') || label.closest('.projects-new__field') || label.parentElement;
    return container ? container.querySelector('input[type="url"], input[type="text"]') : null;
}

function findRepoInput() {
    const direct = document.querySelector('#project_repo_url')
        || document.querySelector('input[name="project[repo_url]"]')
        || document.querySelector('input[name="project[repo]"]');
    if (direct) return direct;

    const fuzzy = document.querySelector(
        'input[type="url"][id*="repo" i], input[type="text"][id*="repo" i], input[type="url"][name*="repo" i], input[type="text"][name*="repo" i]'
    );
    return fuzzy || null;
}

function extractDemoUrlFromProjectDoc(doc) {
    if (!doc) return null;
    const demoLink = Array.from(doc.querySelectorAll('.project-show-card a'))
        .find(link => (link.textContent || '').toLowerCase().includes('demo'));
    return demoLink ? demoLink.getAttribute('href') : null;
}

function shouldDismissRepoSuggestion(key) {
    const dismissed = getDismissedRepoSuggestions();
    return !!dismissed[key];
}

function initProjectRepoSuggestionOnNewProject() {
    if (window.location.pathname !== '/projects/new') return;
    if (window.__flavortownRepoSuggestNew) return;
    window.__flavortownRepoSuggestNew = true;
    const titleField = document.querySelector('#project_title');
    if (!titleField) return;

    const titleContainer = titleField.closest('.projects-new__field--title') || titleField.closest('.input');
    if (!titleContainer) return;

    let currentCard = null;
    let currentValue = '';
    let timer = null;

    const removeCard = () => {
        if (currentCard) currentCard.remove();
        currentCard = null;
        titleContainer.classList.remove('flavortown-title-match');
    };

    const showSuggestion = (repoUrl, key) => {
        removeCard();
        const card = createRepoSuggestionCard({
            title: 'Found a repo that matches this project name',
            repoUrl,
            actionLabel: 'Autofill repo',
            onConfirm: () => {
                const repoInput = document.querySelector('#project_repo_url');
                if (repoInput) {
                    repoInput.value = repoUrl;
                    repoInput.dispatchEvent(new Event('input', { bubbles: true }));
                    repoInput.dispatchEvent(new Event('change', { bubbles: true }));
                    repoInput.focus();
                }
                setDismissedRepoSuggestion(key);
                removeCard();
            },
            onDismiss: () => {
                setDismissedRepoSuggestion(key);
                removeCard();
            }
        });
        currentCard = card;
        titleContainer.appendChild(card);
        titleContainer.classList.add('flavortown-title-match');
    };

    const handleInput = async () => {
        const value = titleField.value.trim();
        currentValue = value;
        if (!value) {
            removeCard();
            return;
        }
        const dismissKey = `new:${normalizeProjectName(value)}`;
        if (shouldDismissRepoSuggestion(dismissKey)) return;

        const repoInput = document.querySelector('#project_repo_url');
        if (repoInput && repoInput.value.trim()) {
            removeCard();
            return;
        }

        const suggestion = await getRepoSuggestionForProjectName(value);
        if (!suggestion || !suggestion.repoUrl) return;
        if (value !== currentValue) return;
        showSuggestion(suggestion.repoUrl, dismissKey);
    };

    const schedule = () => {
        if (timer) window.clearTimeout(timer);
        timer = window.setTimeout(handleInput, 350);
    };

    titleField.addEventListener('input', schedule);
    titleField.addEventListener('blur', handleInput);
}

function initProjectDemoSuggestionOnNewProject() {
    if (window.location.pathname !== '/projects/new') return;
    if (window.__flavortownDemoSuggestNew) return;
    window.__flavortownDemoSuggestNew = true;
    const titleField = document.querySelector('#project_title');
    if (!titleField) return;

    let demoInput = findDemoInput();
    if (!demoInput) {
        const observer = new MutationObserver(() => {
            demoInput = findDemoInput();
            if (demoInput) {
                observer.disconnect();
                initProjectDemoSuggestionOnNewProject();
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
        setTimeout(() => observer.disconnect(), 5000);
        return;
    }

    const demoContainer = demoInput.closest('.projects-new__field') || demoInput.closest('.input') || demoInput.parentElement;
    if (!demoContainer) return;

    let currentCard = null;
    let currentValue = '';
    let timer = null;

    const removeCard = () => {
        if (currentCard) currentCard.remove();
        currentCard = null;
    };

    const showSuggestion = (demoUrl, key) => {
        removeCard();
        const card = createRepoSuggestionCard({
            title: 'Found a demo link from this repo',
            repoUrl: demoUrl,
            actionLabel: 'Autofill demo',
            onConfirm: () => {
                if (demoInput) {
                    demoInput.value = demoUrl;
                    demoInput.dispatchEvent(new Event('input', { bubbles: true }));
                    demoInput.dispatchEvent(new Event('change', { bubbles: true }));
                    demoInput.focus();
                }
                setDismissedRepoSuggestion(key);
                removeCard();
            },
            onDismiss: () => {
                setDismissedRepoSuggestion(key);
                removeCard();
            }
        });
        currentCard = card;
        demoContainer.appendChild(card);
    };

    const handleInput = async () => {
        const value = titleField.value.trim();
        currentValue = value;
        if (!value) {
            removeCard();
            return;
        }
        if (demoInput.value.trim()) {
            removeCard();
            return;
        }
        const dismissKey = `new-demo:${normalizeProjectName(value)}`;
        if (shouldDismissRepoSuggestion(dismissKey)) return;

        const suggestion = await getDemoSuggestionForProjectName(value);
        if (!suggestion || !suggestion.demoUrl) return;
        if (value !== currentValue) return;
        showSuggestion(suggestion.demoUrl, dismissKey);
    };

    const schedule = () => {
        if (timer) window.clearTimeout(timer);
        timer = window.setTimeout(handleInput, 350);
    };

    titleField.addEventListener('input', schedule);
    titleField.addEventListener('blur', handleInput);
}

function initProjectLinkSuggestionOnNewProject() {
    if (window.location.pathname !== '/projects/new') return;
    if (window.__flavortownLinkSuggestNew) return;
    window.__flavortownLinkSuggestNew = true;
    const titleField = document.querySelector('#project_title');
    if (!titleField) return;

    const titleContainer = titleField.closest('.projects-new__field--title') || titleField.closest('.input');
    if (!titleContainer) return;

    let currentCard = null;
    let currentValue = '';
    let timer = null;

    const removeCard = () => {
        if (currentCard) currentCard.remove();
        currentCard = null;
        titleContainer.classList.remove('flavortown-title-match');
    };

    const showSuggestion = ({ repoUrl, demoUrl, dismissKey }) => {
        removeCard();
        const card = createProjectLinksSuggestionCard({
            label: 'Found links for this project',
            repoUrl,
            demoUrl,
            repoActionLabel: 'Autofill repo',
            demoActionLabel: 'Autofill demo',
            onRepo: () => {
                const repoInput = findRepoInput();
                if (repoInput && repoUrl) {
                    repoInput.value = repoUrl;
                    repoInput.dispatchEvent(new Event('input', { bubbles: true }));
                    repoInput.dispatchEvent(new Event('change', { bubbles: true }));
                }
                setTimeout(handleInput, 0);
            },
            onDemo: () => {
                const demoInput = findDemoInput();
                if (demoInput && demoUrl) {
                    demoInput.value = demoUrl;
                    demoInput.dispatchEvent(new Event('input', { bubbles: true }));
                    demoInput.dispatchEvent(new Event('change', { bubbles: true }));
                }
                setTimeout(handleInput, 0);
            },
            onDismiss: () => {
                setDismissedRepoSuggestion(dismissKey);
                removeCard();
            },
            onApplyAll: () => {
                const repoInput = findRepoInput();
                const demoInput = findDemoInput();
                if (repoInput && repoUrl && !repoInput.value.trim()) {
                    repoInput.value = repoUrl;
                    repoInput.dispatchEvent(new Event('input', { bubbles: true }));
                    repoInput.dispatchEvent(new Event('change', { bubbles: true }));
                }
                if (demoInput && demoUrl && !demoInput.value.trim()) {
                    demoInput.value = demoUrl;
                    demoInput.dispatchEvent(new Event('input', { bubbles: true }));
                    demoInput.dispatchEvent(new Event('change', { bubbles: true }));
                }
                setDismissedRepoSuggestion(dismissKey);
                removeCard();
            }
        });
        currentCard = card;
        titleContainer.appendChild(card);
        titleContainer.classList.add('flavortown-title-match');
    };

    const handleInput = async () => {
        const value = titleField.value.trim();
        currentValue = value;
        if (!value) {
            removeCard();
            return;
        }

        const dismissKey = `new-links:${normalizeProjectName(value)}`;
        if (shouldDismissRepoSuggestion(dismissKey)) return;

        const repoInput = findRepoInput();
        const demoInput = findDemoInput();

        const repoFilled = !!(repoInput && repoInput.value.trim());
        const demoFilled = !!(demoInput && demoInput.value.trim());

        if (repoFilled && demoFilled) {
            removeCard();
            return;
        }

        const suggestions = await getLinkSuggestionsForProjectName(value);
        if (value !== currentValue) return;

        const repoUrl = !repoFilled && repoInput ? suggestions.repoUrl : null;
        const demoUrl = !demoFilled && demoInput ? suggestions.demoUrl : null;

        if (!repoUrl && !demoUrl) {
            removeCard();
            return;
        }

        showSuggestion({ repoUrl, demoUrl, dismissKey });
    };

    const schedule = () => {
        if (timer) window.clearTimeout(timer);
        timer = window.setTimeout(handleInput, 350);
    };

    titleField.addEventListener('input', schedule);
    titleField.addEventListener('blur', handleInput);

    if (!findDemoInput()) {
        const observer = new MutationObserver(() => {
            if (findDemoInput()) {
                observer.disconnect();
                handleInput();
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
        setTimeout(() => observer.disconnect(), 5000);
    }
}

function storePendingRepoLink(projectId, repoUrl, demoUrl = null) {
    if (!projectId || (!repoUrl && !demoUrl)) return;
    try {
        sessionStorage.setItem(REPO_SUGGESTION_PENDING_KEY, JSON.stringify({ projectId, repoUrl, demoUrl }));
    } catch (e) {
    }
}

function getCsrfToken() {
    return document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || null;
}

async function updateProjectLinks(projectId, { repoUrl, demoUrl }) {
    if (!projectId || (!repoUrl && !demoUrl)) return false;
    const token = getCsrfToken();
    if (!token) return false;

    const params = new URLSearchParams();
    params.append('_method', 'patch');
    if (repoUrl) params.append('project[repo_url]', repoUrl);
    if (demoUrl) params.append('project[demo_url]', demoUrl);

    try {
        const response = await fetch(`/projects/${projectId}`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                'X-CSRF-Token': token,
                'X-Requested-With': 'XMLHttpRequest'
            },
            body: params.toString()
        });

        return response.ok;
    } catch (e) {
        return false;
    }
}

function readPendingRepoLink() {
    try {
        const raw = sessionStorage.getItem(REPO_SUGGESTION_PENDING_KEY);
        if (!raw) return null;
        return JSON.parse(raw);
    } catch (e) {
        return null;
    }
}

function clearPendingRepoLink() {
    try {
        sessionStorage.removeItem(REPO_SUGGESTION_PENDING_KEY);
    } catch (e) {
    }
}

function initProjectRepoAutoLinkOnEdit() {
    const match = window.location.pathname.match(/^\/projects\/(\d+)\/edit/);
    if (!match) return;
    if (window.__flavortownRepoSuggestEdit) return;
    window.__flavortownRepoSuggestEdit = true;
    const pending = readPendingRepoLink();
    if (!pending || pending.projectId !== match[1]) return;

    const repoInput = document.querySelector('#project_repo_url');
    const demoInput = findDemoInput();
    const submitBtn = document.querySelector('button[type="submit"], .btn.btn--blue');
    if (!submitBtn) return;

    if (repoInput && pending.repoUrl && !repoInput.value.trim()) {
        repoInput.value = pending.repoUrl;
        repoInput.dispatchEvent(new Event('input', { bubbles: true }));
        repoInput.dispatchEvent(new Event('change', { bubbles: true }));
    }

    if (demoInput && pending.demoUrl && !demoInput.value.trim()) {
        demoInput.value = pending.demoUrl;
        demoInput.dispatchEvent(new Event('input', { bubbles: true }));
        demoInput.dispatchEvent(new Event('change', { bubbles: true }));
    }
    clearPendingRepoLink();
    submitBtn.click();
}

async function initProjectLinkSuggestionOnProjectShow() {
    if (!/\/projects\/\d+$/.test(window.location.pathname)) return;
    if (window.__flavortownLinkSuggestShow) return;
    window.__flavortownLinkSuggestShow = true;
    if (!isProjectOwnedByCurrentUser()) return;
    if (document.querySelector('.flavortown-links-suggestion')) return;

    const projectName = getCurrentProjectName();
    if (!projectName) return;
    const projectIdMatch = window.location.pathname.match(/\/projects\/(\d+)/);
    const projectId = projectIdMatch ? projectIdMatch[1] : null;
    if (!projectId) return;

    const dismissKey = `show-links:${projectId}`;
    if (shouldDismissRepoSuggestion(dismissKey)) return;

    const showCard = document.querySelector('.project-show-card');
    if (!showCard) return;
    const hasRepoLink = !!extractRepoUrlFromProjectDoc(document);
    const hasDemoLink = !!extractDemoUrlFromProjectDoc(document);
    if (hasRepoLink && hasDemoLink) return;

    const suggestions = await getLinkSuggestionsForProjectName(projectName);
    const repoUrl = !hasRepoLink ? suggestions.repoUrl : null;
    const demoUrl = !hasDemoLink ? suggestions.demoUrl : null;
    if (!repoUrl && !demoUrl) return;

    const byline = showCard.querySelector('.project-show-card__byline');
    if (!byline) return;

    const card = createProjectLinksSuggestionCard({
        repoUrl,
        demoUrl,
        onRepo: () => {
            if (!repoUrl) return;
            updateProjectLinks(projectId, { repoUrl, demoUrl: null }).then(success => {
                if (success) {
                    card.remove();
                    window.location.reload();
                }
            });
        },
        onDemo: () => {
            if (!demoUrl) return;
            updateProjectLinks(projectId, { repoUrl: null, demoUrl }).then(success => {
                if (success) {
                    card.remove();
                    window.location.reload();
                }
            });
        },
        onDismiss: () => {
            setDismissedRepoSuggestion(dismissKey);
            card.remove();
        },
        onApplyAll: () => {
            updateProjectLinks(projectId, { repoUrl: repoUrl || null, demoUrl: demoUrl || null }).then(success => {
                if (success) {
                    card.remove();
                    window.location.reload();
                }
            });
        }
    });

    byline.insertAdjacentElement('afterend', card);
}

function initProjectRepoSuggestions() {
    initProjectLinkSuggestionOnNewProject();
    initProjectLinkSuggestionOnProjectShow();
    initProjectRepoAutoLinkOnEdit();
}

function parseDurationToMinutes(text) {
    if (!text) return 0;
    const hoursMatch = text.match(/(\d+)\s*h/i);
    const minsMatch = text.match(/(\d+)\s*m/i);
    const secsMatch = text.match(/(\d+)\s*s/i);
    let minutes = 0;

    if (hoursMatch) minutes += parseInt(hoursMatch[1], 10) * 60;
    if (minsMatch) minutes += parseInt(minsMatch[1], 10);
    if (secsMatch) minutes += parseInt(secsMatch[1], 10) / 60;

    return minutes;
}

function formatCookieRate(rate) {
    if (rate === null || rate === undefined || !isFinite(rate)) return '--';
    return rate.toFixed(1);
}

function normalizePayoutHours(hours) {
    if (!hours || !isFinite(hours)) return null;
    return Math.round(hours * 100) / 100;
}

function getMultiplierFromCookies(totalCookies, hours) {
    if (!totalCookies || !hours || !isFinite(totalCookies) || !isFinite(hours)) return null;
    const roundedHours = normalizePayoutHours(hours);
    if (!roundedHours || roundedHours <= 0) return null;
    return totalCookies / roundedHours;
}

function clampValue(value, min, max) {
    if (!isFinite(value)) return min;
    return Math.min(max, Math.max(min, value));
}

function hillCurve(value, shape) {
    if (!isFinite(value)) return 0;
    const clamped = clampValue(value, 0, 1);
    const raised = Math.pow(clamped, shape);
    const inverted = Math.pow(1 - clamped, shape);
    return raised / (raised + inverted);
}

function polynomialCurve(value, coeffs) {
    if (!isFinite(value)) return 0;
    let total = 0;
    for (let i = 0; i < coeffs.length; i++) {
        total += coeffs[i] * Math.pow(value, i);
    }
    return total;
}

function lerpRange(min, max, t) {
    return min + (max - min) * t;
}

function roundToHalf(value) {
    if (!isFinite(value)) return null;
    return Math.round(value * 2) / 2;
}

function estimatePercentileFromMultiplier(multiplier) {
    if (!multiplier || !isFinite(multiplier)) return null;
    const hourlyRate = multiplier / PAYOUT_TICKETS_PER_DOLLAR;
    const normalized = (hourlyRate - PAYOUT_LOW_DOLLARS_PER_HOUR) / (PAYOUT_HIGH_DOLLARS_PER_HOUR - PAYOUT_LOW_DOLLARS_PER_HOUR);
    const clamped = clampValue(normalized, 0, 1);
    const pRaw = Math.pow(clamped, 1 / PAYOUT_GAMMA);
    const corrected = hillCurve(pRaw, PERCENTILE_HILL_SHAPE);
    return clampValue(corrected * 100, 0.01, 99.99);
}

function estimateOverallScoreFromMultiplier(multiplier) {
    if (!multiplier || !isFinite(multiplier)) return null;
    const hourlyRate = multiplier / PAYOUT_TICKETS_PER_DOLLAR;
    const normalized = (hourlyRate - PAYOUT_LOW_DOLLARS_PER_HOUR) / (PAYOUT_HIGH_DOLLARS_PER_HOUR - PAYOUT_LOW_DOLLARS_PER_HOUR);
    const clamped = clampValue(normalized, 0, 1);
    const pRaw = Math.pow(clamped, 1 / PAYOUT_GAMMA);
    const scoreNorm = polynomialCurve(pRaw, SCORE_CURVE_COEFFS);
    const score = 1 + 5 * scoreNorm;
    return clampValue(score, 1, 6);
}

function estimateCategoryScoresFromOverall(overallScore, percentile) {
    if (!overallScore || !isFinite(overallScore)) return null;
    const p = clampValue((percentile || 0) / 100, 0, 1);
    const scoreNorm = clampValue((overallScore - 1) / 5, 0, 1);
    const originality = lerpRange(CATEGORY_SCORE_RANGES.originality.min, CATEGORY_SCORE_RANGES.originality.max, scoreNorm);
    const technical = lerpRange(CATEGORY_SCORE_RANGES.technical.min, CATEGORY_SCORE_RANGES.technical.max, scoreNorm);
    const usabilityBase = lerpRange(CATEGORY_SCORE_RANGES.usability.min, CATEGORY_SCORE_RANGES.usability.max, scoreNorm);
    const usability = usabilityBase + (CATEGORY_SCORE_RANGES.usability.percentileSlope || 0) * p;
    const storytelling = lerpRange(CATEGORY_SCORE_RANGES.storytelling.min, CATEGORY_SCORE_RANGES.storytelling.max, scoreNorm);

    return { originality, technical, usability, storytelling };
}

function buildVoteEstimate(multiplier) {
    const percentile = estimatePercentileFromMultiplier(multiplier);
    if (!percentile) return null;
    const overallScore = estimateOverallScoreFromMultiplier(multiplier);
    if (!overallScore) return null;
    const categoriesRaw = estimateCategoryScoresFromOverall(overallScore, percentile);
    if (!categoriesRaw) return { percentile, overallScore, categories: null };

    return {
        percentile,
        overallScore,
        categories: {
            originality: roundToHalf(clampValue(categoriesRaw.originality, 1, 6)),
            technical: roundToHalf(clampValue(categoriesRaw.technical, 1, 6)),
            usability: roundToHalf(clampValue(categoriesRaw.usability, 1, 6)),
            storytelling: roundToHalf(clampValue(categoriesRaw.storytelling, 1, 6))
        }
    };
}

function formatScoreValue(score) {
    if (!score || !isFinite(score)) return '--';
    return score.toFixed(2).replace(/\.00$/, '');
}

function formatPercentileFromPercentile(percentile) {
    if (!percentile || !isFinite(percentile)) return '--';
    if (percentile >= 50) {
        const topPercent = clampValue(100 - percentile, 0.01, 99.99);
        return `Top ${topPercent.toFixed(2)}%`;
    }
    return `Bottom ${percentile.toFixed(2)}%`;
}

function getRatePercentile(rate) {
    if (rate === null || rate === undefined || !isFinite(rate)) return null;
    const clamped = Math.min(COOKIE_RATE_MAX, Math.max(COOKIE_RATE_MIN, rate));
    return estimatePercentileFromMultiplier(clamped);
}

function formatPercentile(rate) {
    const percentile = getRatePercentile(rate);
    return formatPercentileFromPercentile(percentile);
}

function formatCookieRateLine(rate) {
    const rateText = formatCookieRate(rate);
    return rateText === '--' ? '--' : `${rateText} cookies/h`;
}

function formatCookiePercentileLine(rate) {
    return formatPercentile(rate);
}

function createVoteEstimateElement(estimate, options = {}) {
    if (!estimate) return null;

    const overallText = formatScoreValue(estimate.overallScore);

    const scorePill = document.createElement('h5');
    scorePill.className = 'flavortown-vote-estimate-pill';
    scorePill.textContent = `~ avg ⭐ ${overallText}`;

    let accordion = null;
    if (estimate.categories) {
        accordion = document.createElement('details');
        accordion.className = 'flavortown-vote-estimate-accordion';
        accordion.innerHTML = `
            <summary class="flavortown-vote-estimate-accordion__toggle">Est. category medians</summary>
            <div class="flavortown-vote-estimate-accordion__categories">
                <span>Originality ★${formatScoreValue(estimate.categories.originality)}</span>
                <span>Technical ★${formatScoreValue(estimate.categories.technical)}</span>
                <span>Usability ★${formatScoreValue(estimate.categories.usability)}</span>
                <span>Storytelling ★${formatScoreValue(estimate.categories.storytelling)}</span>
            </div>
        `;
    }

    return { scorePill, accordion };
}

function getCookieRange(hours) {
    if (!hours || hours <= 0) return null;
    const normalizedHours = normalizePayoutHours(hours) || hours;
    const minCookies = Math.max(1, Math.ceil(normalizedHours * COOKIE_RATE_MIN));
    const maxCookies = Math.max(minCookies, Math.floor(normalizedHours * COOKIE_RATE_MAX));
    const expectedCookies = normalizedHours * ((COOKIE_RATE_MIN + COOKIE_RATE_MAX) / 2);
    return { minCookies, maxCookies, expectedCookies };
}

function getPayoutAssignmentCost(ship, payout, expectedRate) {
    if (!ship || !payout || !ship.date || !payout.date) return null;
    if (!isFinite(ship.hours) || ship.hours <= 0) return null;
    if (payout.date < ship.date) return null;

    const rate = getMultiplierFromCookies(payout.amount, ship.hours);
    if (!rate || !isFinite(rate)) return null;
    if (rate < COOKIE_RATE_MIN || rate > COOKIE_RATE_MAX) return null;

    const avgRate = (COOKIE_RATE_MIN + COOKIE_RATE_MAX) / 2;
    const targetRate = expectedRate && isFinite(expectedRate) ? expectedRate : avgRate;
    const rateDiff = Math.abs(rate - targetRate);
    const cookieDiff = Math.abs(rate - avgRate);
    const timeDiffDays = Math.abs(payout.date - ship.date) / (1000 * 60 * 60 * 24);

    return rateDiff + cookieDiff + (timeDiffDays * 0.01);
}

function assignPayoutsToShips(payouts, ships) {
    const assignments = new Map();
    ships.forEach(ship => assignments.set(ship, []));

    if (!ships.length || !payouts.length) return assignments;

    const validShips = ships.filter(ship => ship.date && isFinite(ship.hours) && ship.hours > 0);
    const validPayouts = payouts.filter(payout => payout.date && isFinite(payout.amount));

    if (!validShips.length || !validPayouts.length) return assignments;

    const totalShipHours = validShips.reduce((sum, ship) => sum + ship.hours, 0);
    const totalCookies = validPayouts.reduce((sum, payout) => sum + payout.amount, 0);
    const expectedRate = totalShipHours > 0
        ? clampValue(totalCookies / totalShipHours, COOKIE_RATE_MIN, COOKIE_RATE_MAX)
        : null;

    const shipEntries = validShips.map(ship => {
        const candidates = validPayouts.map((payout, index) => {
            const cost = getPayoutAssignmentCost(ship, payout, expectedRate);
            if (cost === null) return null;
            return { payout, index, cost };
        }).filter(Boolean);
        return { ship, candidates };
    }).sort((a, b) => a.candidates.length - b.candidates.length);

    const best = { count: -1, cost: Infinity, pairs: new Map() };
    const used = new Set();

    const search = (idx, count, cost, pairs) => {
        const remainingShips = shipEntries.length - idx;
        const remainingPayouts = validPayouts.length - used.size;
        const maxPossible = count + Math.min(remainingShips, remainingPayouts);
        if (maxPossible < best.count) return;

        if (idx >= shipEntries.length) {
            if (count > best.count || (count === best.count && cost < best.cost)) {
                best.count = count;
                best.cost = cost;
                best.pairs = new Map(pairs);
            }
            return;
        }

        const entry = shipEntries[idx];

        search(idx + 1, count, cost, pairs);

        entry.candidates.forEach(candidate => {
            if (used.has(candidate.index)) return;
            used.add(candidate.index);
            pairs.set(entry.ship, candidate.payout);
            search(idx + 1, count + 1, cost + candidate.cost, pairs);
            pairs.delete(entry.ship);
            used.delete(candidate.index);
        });
    };

    search(0, 0, 0, new Map());

    best.pairs.forEach((payout, ship) => {
        assignments.get(ship).push(payout);
    });

    return assignments;
}

function readShipPayoutCache() {
    try {
        const cached = localStorage.getItem(SHIP_PAYOUT_CACHE_KEY);
        if (!cached) return null;
        const parsed = JSON.parse(cached);
        if (!parsed || !parsed.timestamp || !Array.isArray(parsed.payouts)) return null;
        if (Date.now() - parsed.timestamp > SHIP_PAYOUT_CACHE_TTL) return null;

        const payouts = parsed.payouts
            .map(payout => ({
                ...payout,
                date: payout.date ? new Date(payout.date) : null
            }))
            .filter(payout => payout.date && !isNaN(payout.date.getTime()));
        return payouts.length ? payouts : null;
    } catch (e) {
        return null;
    }
}

function writeShipPayoutCache(payouts) {
    try {
        localStorage.setItem(SHIP_PAYOUT_CACHE_KEY, JSON.stringify({
            timestamp: Date.now(),
            payouts: payouts.map(payout => ({
                ...payout,
                date: payout.date.toISOString()
            }))
        }));
    } catch (e) {
    }
}


function parseShipPayoutsFromBalance(doc) {
    if (!doc) return [];
    let rows = doc.querySelectorAll('.balance-history__table tbody tr');
    if (rows.length === 0) {
        rows = doc.querySelectorAll('table tbody tr');
    }

    if (rows.length === 0) {
        const streamTemplates = doc.querySelectorAll('turbo-stream template');
        if (streamTemplates.length) {
            const parsedRows = [];
            streamTemplates.forEach(template => {
                const fragmentDoc = new DOMParser().parseFromString(template.innerHTML, 'text/html');
                const templateRows = fragmentDoc.querySelectorAll('.balance-history__table tbody tr, table tbody tr');
                parsedRows.push(...Array.from(templateRows));
            });
            rows = parsedRows;
        }
    }

    const payouts = [];


    rows.forEach(row => {
        const cells = row.querySelectorAll('td');
        if (cells.length < 3) return;

        const reason = cells[0].textContent.replace(/\s+/g, ' ').trim();
        const match = reason.match(/ship event payout:\s*(.+)$/i);
        if (!match) return;

        const projectName = match[1].trim();
        const amountText = cells[1].textContent.trim();
        const numMatch = amountText.match(/(\d+)/);
        if (!numMatch) return;

        let amount = parseInt(numMatch[1], 10);
        if (amountText.includes('-')) amount = -amount;
        if (amount <= 0) return;

        const date = parseDateFromCell(cells[2]);
        if (!date || isNaN(date.getTime())) return;

        payouts.push({ projectName, amount, date });
    });

    return payouts;
}

async function fetchShipPayouts() {
    const cached = readShipPayoutCache();
    if (cached) return cached;

    try {
        const balanceUrl = new URL('/my/balance', window.location.origin).toString();
        
        const response = await fetch(balanceUrl, {
            credentials: 'include',
            headers: {
                'Accept': 'text/html, application/xhtml+xml',
                'Turbo-Frame': 'balance_history',
                'X-Flavortown-Ext-135': 'true'
            }
        });

        if (!response.ok) return [];

        const html = await response.text();
        const doc = new DOMParser().parseFromString(html, 'text/html');
        let payouts = parseShipPayoutsFromBalance(doc);

        if (payouts.length === 0) {
            const fallbackResponse = await fetch(balanceUrl, {
                credentials: 'include',
                headers: {
                    'Accept': 'text/html, application/xhtml+xml',
                    'X-Flavortown-Ext-135': 'true'
                }
            });

            if (fallbackResponse.ok) {
                const fallbackHtml = await fallbackResponse.text();
                const fallbackDoc = new DOMParser().parseFromString(fallbackHtml, 'text/html');
                payouts = parseShipPayoutsFromBalance(fallbackDoc);
            }
        }

        if (payouts.length > 0) {
            writeShipPayoutCache(payouts);
        }
        return payouts;
    } catch (e) {
        return [];
    }
}

function readShipTimeCache() {
    try {
        const raw = localStorage.getItem(SHIP_TIME_CACHE_KEY);
        if (!raw) return {};
        const parsed = JSON.parse(raw);
        if (!parsed || typeof parsed !== 'object') return {};

        const now = Date.now();
        const data = parsed.data || parsed;
        const cleaned = {};

        Object.entries(data).forEach(([projectId, entry]) => {
            if (!entry || typeof entry.minutes !== 'number') return;
            if (entry.updatedAt && now - entry.updatedAt > SHIP_TIME_CACHE_TTL) return;
            cleaned[projectId] = entry;
        });

        return cleaned;
    } catch (e) {
        return {};
    }
}

function writeShipTimeCache(data) {
    try {
        localStorage.setItem(SHIP_TIME_CACHE_KEY, JSON.stringify({ data }));
    } catch (e) {
    }
}

function getCachedShipMinutes(projectId) {
    if (!projectId) return 0;
    const cache = readShipTimeCache();
    const entry = cache[projectId];
    return entry ? entry.minutes : 0;
}

function setCachedShipMinutes(projectId, minutes) {
    if (!projectId || !minutes) return;
    const cache = readShipTimeCache();
    cache[projectId] = { minutes, updatedAt: Date.now() };
    writeShipTimeCache(cache);
}

function readProjectUnshippedCache() {
    try {
        const raw = localStorage.getItem(PROJECT_UNSHIPPED_CACHE_KEY);
        if (!raw) return {};
        const parsed = JSON.parse(raw);
        if (!parsed || typeof parsed !== 'object') return {};

        const now = Date.now();
        const data = parsed.data || parsed;
        const cleaned = {};

        Object.entries(data).forEach(([projectId, entry]) => {
            if (!entry || typeof entry.unshippedMinutes !== 'number') return;
            if (entry.updatedAt && now - entry.updatedAt > PROJECT_UNSHIPPED_CACHE_TTL) return;
            cleaned[projectId] = entry;
        });

        return cleaned;
    } catch (e) {
        return {};
    }
}

function writeProjectUnshippedCache(data) {
    try {
        localStorage.setItem(PROJECT_UNSHIPPED_CACHE_KEY, JSON.stringify({ data }));
    } catch (e) {
    }
}

function getCachedProjectUnshipped(projectId) {
    if (!projectId) return null;
    const cache = readProjectUnshippedCache();
    return cache[projectId] || null;
}

function getCurrentUserName() {
    const nameEl = document.querySelector('.sidebar__user-name');
    if (!nameEl) return null;
    return nameEl.textContent.trim();
}

function getProjectOwnerName() {
    const byline = document.querySelector('.project-show-card__byline');
    if (!byline) return null;
    const link = byline.querySelector('a');
    if (link) return link.textContent.trim();
    const text = byline.textContent || '';
    const match = text.match(/Created by:\s*(.+)/i);
    return match ? match[1].trim() : null;
}

function getProjectOwnerNameFromDocument(doc) {
    if (!doc) return null;
    const byline = doc.querySelector('.project-show-card__byline');
    if (!byline) return null;
    const link = byline.querySelector('a');
    if (link) return link.textContent.trim();
    const text = byline.textContent || '';
    const match = text.match(/Created by:\s*(.+)/i);
    return match ? match[1].trim() : null;
}

function normalizeOwnerName(name) {
    return (name || '').toLowerCase().replace(/\s+/g, ' ').trim();
}

function isProjectOwnedByCurrentUser() {
    if (!/\/projects\/\d+$/.test(window.location.pathname)) return false;
    const currentUser = getCurrentUserName();
    const owner = getProjectOwnerName();
    if (!currentUser || !owner) return false;
    return normalizeOwnerName(currentUser) === normalizeOwnerName(owner);
}

async function cleanupUnownedUnshippedCache() {
    const currentUser = getCurrentUserName();
    if (!currentUser) return;

    const lastRun = parseInt(localStorage.getItem(PROJECT_UNSHIPPED_CLEANUP_KEY) || '0', 10);
    const now = Date.now();
    if (lastRun && now - lastRun < 24 * 60 * 60 * 1000) return;
    localStorage.setItem(PROJECT_UNSHIPPED_CLEANUP_KEY, String(now));

    const cache = readProjectUnshippedCache();
    const projectIds = Object.keys(cache);
    if (!projectIds.length) return;

    const normalizedUser = normalizeOwnerName(currentUser);
    let changed = false;

    for (const projectId of projectIds) {
        try {
            const response = await fetch(`/projects/${projectId}`, { credentials: 'same-origin' });
            if (!response.ok) continue;
            const html = await response.text();
            const doc = new DOMParser().parseFromString(html, 'text/html');
            const owner = getProjectOwnerNameFromDocument(doc);
            if (!owner) continue;
            if (normalizeOwnerName(owner) !== normalizedUser) {
                delete cache[projectId];
                changed = true;
            }
        } catch (e) {
        }
    }

    if (changed) {
        writeProjectUnshippedCache(cache);
    }
}

function setCachedProjectUnshipped(projectId, entry) {
    if (!projectId || !entry) return;
    if (!isProjectOwnedByCurrentUser()) return;
    const cache = readProjectUnshippedCache();
    cache[projectId] = {
        totalMinutes: Math.max(0, entry.totalMinutes || 0),
        paidShipMinutes: Math.max(0, entry.paidShipMinutes || 0),
        paidCookies: Math.max(0, entry.paidCookies || 0),
        unshippedMinutes: Math.max(0, entry.unshippedMinutes || 0),
        updatedAt: Date.now()
    };
    writeProjectUnshippedCache(cache);
}

function getProjectStatsMinutes(projectId) {
    if (!projectId) return 0;
    try {
        const raw = localStorage.getItem('flavortown_project_stats');
        if (!raw) return 0;
        const stats = JSON.parse(raw);
        const entry = stats ? stats[projectId] : null;
        return entry && typeof entry.minutes === 'number' ? entry.minutes : 0;
    } catch (e) {
        return 0;
    }
}

function getAggregateUnshippedStats() {
    const cache = readProjectUnshippedCache();
    let totalUnshippedMinutes = 0;
    let totalPaidMinutes = 0;
    let totalPaidCookies = 0;

    Object.values(cache).forEach(entry => {
        if (!entry) return;
        if (typeof entry.unshippedMinutes === 'number') totalUnshippedMinutes += entry.unshippedMinutes;
        if (typeof entry.paidShipMinutes === 'number') totalPaidMinutes += entry.paidShipMinutes;
        if (typeof entry.paidCookies === 'number') totalPaidCookies += entry.paidCookies;
    });

    return { totalUnshippedMinutes, totalPaidMinutes, totalPaidCookies };
}

function getTotalDevlogMinutesFromDocument(doc) {
    const devlogs = doc.querySelectorAll('article.post--devlog, .post--devlog');
    let totalMinutes = 0;

    devlogs.forEach(devlog => {
        const durationEl = devlog.querySelector('.post__duration');
        if (!durationEl) return;
        totalMinutes += parseDurationToMinutes(durationEl.textContent.trim());
    });

    return totalMinutes;
}

function buildShipStatsFromDocument(doc) {
    const shipPosts = doc.querySelectorAll('article.post--ship, .post--ship');
    if (!shipPosts.length) return [];

    const ships = [];

    shipPosts.forEach(shipPost => {
        const minutes = collectShipMinutesFromPost(shipPost);
        if (!minutes || minutes <= 0) return;

        const timeEl = shipPost.querySelector('.post__time');
        const shipDate = timeEl ? parseDateFromTimeElement(timeEl) : null;
        if (!shipDate || isNaN(shipDate.getTime())) return;

        const hours = minutes / 60;
        const range = getCookieRange(hours);
        if (!range) return;

        ships.push({
            date: shipDate,
            minutes,
            hours,
            minCookies: range.minCookies,
            maxCookies: range.maxCookies,
            expectedCookies: range.expectedCookies
        });
    });

    return ships;
}

function calculatePaidShipTotals(ships, projectPayouts) {
    if (!ships.length || !projectPayouts || !projectPayouts.length) {
        return { paidShipMinutes: 0, paidCookies: 0 };
    }

    const assignments = assignPayoutsToShips(projectPayouts, ships);
    let paidShipMinutes = 0;
    let paidCookies = 0;

    assignments.forEach((payouts, ship) => {
        if (!payouts.length) return;
        paidShipMinutes += ship.minutes;
        paidCookies += payouts.reduce((sum, payout) => sum + payout.amount, 0);
    });

    return { paidShipMinutes, paidCookies };
}

function computeUnshippedStats(totalMinutes, ships, projectPayouts) {
    const totalShipMinutes = ships.reduce((sum, ship) => sum + ship.minutes, 0);
    const safeTotalMinutes = totalMinutes > 0 ? totalMinutes : totalShipMinutes;
    const { paidShipMinutes, paidCookies } = calculatePaidShipTotals(ships, projectPayouts);
    const unshippedMinutes = Math.max(0, safeTotalMinutes - paidShipMinutes);

    return {
        totalMinutes: safeTotalMinutes,
        totalShipMinutes,
        paidShipMinutes,
        paidCookies,
        unshippedMinutes
    };
}

async function fetchProjectUnshippedStats(projectId, projectPayouts) {
    if (!projectId) return null;

    try {
        const response = await fetch(`/projects/${projectId}`, { credentials: 'same-origin' });
        if (!response.ok) return null;

        const html = await response.text();
        const doc = new DOMParser().parseFromString(html, 'text/html');
        const totalMinutes = getTotalDevlogMinutesFromDocument(doc);
        const ships = buildShipStatsFromDocument(doc);
        const stats = computeUnshippedStats(totalMinutes, ships, projectPayouts);

        if (stats.totalShipMinutes > 0) {
            setCachedShipMinutes(projectId, stats.totalShipMinutes);
        }

        if (stats.totalMinutes > 0 || stats.paidCookies > 0) {
            setCachedProjectUnshipped(projectId, stats);
        }

        return stats;
    } catch (e) {
        return null;
    }
}

function collectShipMinutesFromPost(shipPost) {
    let totalMinutes = 0;
    let currentElement = shipPost.nextElementSibling;

    while (currentElement) {
        if (currentElement.classList.contains('post--ship')) {
            break;
        }

        if (currentElement.classList.contains('post--devlog')) {
            const durationEl = currentElement.querySelector('.post__duration');
            if (durationEl) {
                totalMinutes += parseDurationToMinutes(durationEl.textContent.trim());
            }
        }

        currentElement = currentElement.nextElementSibling;
    }

    return totalMinutes;
}

function extractShipMinutesFromDocument(doc) {
    const shipPosts = doc.querySelectorAll('article.post--ship, .post--ship');
    if (!shipPosts.length) return 0;

    let totalMinutes = 0;
    shipPosts.forEach(shipPost => {
        totalMinutes += collectShipMinutesFromPost(shipPost);
    });

    return totalMinutes;
}

async function fetchProjectShipMinutes(projectId) {
    if (!projectId) return 0;
    const cachedMinutes = getCachedShipMinutes(projectId);
    if (cachedMinutes) return cachedMinutes;

    try {
        const response = await fetch(`/projects/${projectId}`, { credentials: 'same-origin' });
        if (!response.ok) return 0;

        const html = await response.text();
        const doc = new DOMParser().parseFromString(html, 'text/html');
        const minutes = extractShipMinutesFromDocument(doc);
        if (minutes > 0) {
            setCachedShipMinutes(projectId, minutes);
        }
        return minutes;
    } catch (e) {
        return 0;
    }
}

async function addProjectCardCookieStats() {
    if (!window.location.pathname.endsWith('/projects')) return;

    const cards = document.querySelectorAll('.projects-board__grid-item .project-card');
    if (!cards.length) return;

    const payouts = await fetchShipPayouts();

    const renderCardStat = (card, totalCookies, minutes) => {
        const existing = card.querySelector('.flavortown-project-cookies');
        if (existing) existing.remove();
        const existingDetails = card.querySelector('.flavortown-project-cookies-details');
        if (existingDetails) existingDetails.remove();
        card.querySelectorAll('.flavortown-vote-estimate, .flavortown-vote-estimate-pill, .flavortown-vote-estimate-accordion').forEach(el => el.remove());

        const statsContainer = card.querySelector('.project-card__stats');
        if (!statsContainer) return;

        let baseStatsGap = statsContainer.dataset.flavortownStatsGap;
        if (!baseStatsGap) {
            baseStatsGap = getComputedStyle(statsContainer).gap || '1.5em';
            statsContainer.dataset.flavortownStatsGap = baseStatsGap;
        }

        let statsRow = statsContainer.querySelector('.flavortown-project-stats-row');
        if (!statsRow) {
            statsRow = document.createElement('div');
            statsRow.className = 'flavortown-project-stats-row';

            const existingStats = Array.from(statsContainer.querySelectorAll('h5'));
            existingStats.forEach(stat => statsRow.appendChild(stat));
            statsContainer.appendChild(statsRow);
        }

        statsRow.style.cssText = `display: flex; flex-wrap: nowrap; gap: ${baseStatsGap}; align-items: center; width: 100%;`;
        statsContainer.style.display = 'flex';
        statsContainer.style.flexDirection = 'column';
        statsContainer.style.gap = '8px';

        const applyRowStatLayout = (element) => {
            element.style.flex = '0 0 auto';
            element.style.whiteSpace = 'nowrap';
        };

        const applyDetailStyle = (element) => {
            element.style.display = 'inline-flex';
            element.style.alignItems = 'center';
            element.style.gap = '6px';
            element.style.whiteSpace = 'nowrap';
            element.style.margin = '0';
            element.style.flex = '0 0 auto';
            element.style.paddingLeft = '0.6em';
            element.style.paddingRight = '0.6em';
        };

        statsRow.querySelectorAll('h5').forEach(stat => applyRowStatLayout(stat));

        const hours = minutes > 0 ? minutes / 60 : null;
        const rate = hours ? getMultiplierFromCookies(totalCookies, hours) : null;
        const rateLine = formatCookieRateLine(rate);
        const percentileLine = formatCookiePercentileLine(rate);
        const estimate = rate ? buildVoteEstimate(rate) : null;

        const cookieStat = document.createElement('h5');
        cookieStat.className = 'flavortown-project-cookies';
        cookieStat.style.display = 'inline-flex';
        cookieStat.style.alignItems = 'center';
        cookieStat.style.gap = '6px';
        cookieStat.style.whiteSpace = 'nowrap';
        cookieStat.style.margin = '0';
        cookieStat.style.flex = '0 0 auto';
        cookieStat.style.padding = '0.2em 0.6em';
        cookieStat.style.lineHeight = '1.1';
        cookieStat.replaceChildren();
        const cookieIcon = document.createElement('span');
        cookieIcon.style.cssText = 'display: inline-flex; align-items: center; justify-content: center; font-size: 1em; line-height: 1; opacity: 0.9;';
        cookieIcon.textContent = '🍪';
        const cookieValue = document.createElement('span');
        cookieValue.textContent = totalCookies.toLocaleString();
        cookieStat.appendChild(cookieIcon);
        cookieStat.appendChild(cookieValue);
        statsRow.appendChild(cookieStat);

        if (minutes > 0) {
            const detailsRow = document.createElement('div');
            detailsRow.className = 'flavortown-project-cookies-details';
            detailsRow.style.cssText = 'width: 100%; margin-top: 8px; display: flex; gap: 8px; align-items: center; flex-wrap: wrap;';

            const rateBox = document.createElement('h5');
            rateBox.textContent = rateLine;
            applyDetailStyle(rateBox);

            const percentileBox = document.createElement('h5');
            percentileBox.textContent = percentileLine;
            applyDetailStyle(percentileBox);

            detailsRow.appendChild(rateBox);
            detailsRow.appendChild(percentileBox);

            const estimateResult = estimate ? createVoteEstimateElement(estimate) : null;
            if (estimateResult && estimateResult.scorePill) {
                applyDetailStyle(estimateResult.scorePill);
                detailsRow.appendChild(estimateResult.scorePill);
            }

            statsContainer.appendChild(detailsRow);

            if (estimateResult && estimateResult.accordion) {
                statsContainer.appendChild(estimateResult.accordion);
            }
        }
    };

    cards.forEach(card => {
        const projectName = card.querySelector('.project-card__title-link')?.textContent?.trim();
        if (!projectName) return;

        const projectPayouts = payouts.filter(payout => projectNameMatches(payout.projectName, projectName));
        const projectId = card.id ? card.id.replace('project_', '') : null;
        const cachedUnshipped = projectId ? getCachedProjectUnshipped(projectId) : null;
        const projectStatsMinutes = projectId ? getProjectStatsMinutes(projectId) : 0;

        if (!projectPayouts.length) {
            if (projectId && projectStatsMinutes > 0) {
                setCachedProjectUnshipped(projectId, {
                    totalMinutes: projectStatsMinutes,
                    paidShipMinutes: 0,
                    paidCookies: 0,
                    unshippedMinutes: projectStatsMinutes
                });
            }
            return;
        }

        const totalCookies = projectPayouts.reduce((sum, payout) => sum + payout.amount, 0);
        if (totalCookies <= 0) return;

        const cachedMinutes = projectId ? getCachedShipMinutes(projectId) : 0;
        renderCardStat(card, totalCookies, cachedMinutes);

        if (projectId && (!cachedMinutes || !cachedUnshipped)) {
            fetchProjectUnshippedStats(projectId, projectPayouts).then(stats => {
                if (stats && stats.totalShipMinutes > 0) {
                    renderCardStat(card, totalCookies, stats.totalShipMinutes);
                }
            });
        }
    });
}

async function addProjectShowCookieStat() {
    if (!/\/projects\/\d+$/.test(window.location.pathname)) return;
    if (document.querySelector('.flavortown-project-cookies-stat')) return;

    const projectName = getCurrentProjectName();
    if (!projectName) return;

    const projectIdMatch = window.location.pathname.match(/\/projects\/(\d+)/);
    const projectId = projectIdMatch ? projectIdMatch[1] : null;

    const payouts = await fetchShipPayouts();
    if (!payouts.length) {
        logShipPayoutDebug('warn', 'Project show: no payouts found');
        if (projectId) {
            const totalMinutes = getTotalDevlogMinutesFromDocument(document);
            if (totalMinutes > 0) {
                setCachedProjectUnshipped(projectId, {
                    totalMinutes,
                    paidShipMinutes: 0,
                    paidCookies: 0,
                    unshippedMinutes: totalMinutes
                });
            }
        }
        return;
    }

    const projectPayouts = payouts.filter(payout => projectNameMatches(payout.projectName, projectName));
    if (!projectPayouts.length) {
        logShipPayoutDebug('warn', 'Project show: no payouts matched project', projectName);
        if (projectId) {
            const totalMinutes = getTotalDevlogMinutesFromDocument(document);
            if (totalMinutes > 0) {
                setCachedProjectUnshipped(projectId, {
                    totalMinutes,
                    paidShipMinutes: 0,
                    paidCookies: 0,
                    unshippedMinutes: totalMinutes
                });
            }
        }
        return;
    }

    const totalCookies = projectPayouts.reduce((sum, payout) => sum + payout.amount, 0);
    if (totalCookies <= 0) return;

    const statsWrapper = document.querySelector('.project-show-card__stats');
    if (!statsWrapper) return;

    const statsContainer = statsWrapper.querySelector('.project-show-card__stats') || statsWrapper;

    const shipStats = document.querySelectorAll('.flavortown-ship-stats');
    let minutes = 0;
    shipStats.forEach(stat => {
        const minutesValue = stat.dataset.shipMinutes;
        const value = minutesValue ? parseInt(minutesValue, 10) : 0;
        if (value > 0) minutes += value;
    });

    if (minutes === 0) {
        if (projectId) {
            minutes = getCachedShipMinutes(projectId) || 0;
        }
    }

    const hours = minutes > 0 ? minutes / 60 : null;
    const rate = hours ? getMultiplierFromCookies(totalCookies, hours) : null;
    const rateLine = formatCookieRateLine(rate);
    const percentileLine = formatCookiePercentileLine(rate);

    const cookieStat = document.createElement('div');
    cookieStat.className = 'project-show-card__stat flavortown-project-cookies-stat';
    cookieStat.style.cssText = 'display: inline-flex; align-items: center; gap: 8px; white-space: nowrap; flex: 0 0 auto;';
    cookieStat.innerHTML = `
        <span style="font-size: 1em; opacity: 0.8;">🍪</span>
        <span>${totalCookies.toLocaleString()}</span>
    `;
    const frequencyStat = statsContainer.querySelector('.flavortown-utils-frequency-stat');
    if (frequencyStat) {
        frequencyStat.after(cookieStat);
    } else {
        statsContainer.appendChild(cookieStat);
    }

    const detailsParent = statsWrapper.parentNode || statsWrapper;
    const existingDetails = detailsParent.querySelector('.flavortown-project-cookies-details');
    if (existingDetails) existingDetails.remove();
    detailsParent.querySelectorAll('.flavortown-vote-estimate, .flavortown-vote-estimate-pill, .flavortown-vote-estimate-accordion, .flavortown-project-category-stats').forEach(el => el.remove());

    if (minutes > 0) {
        const estimate = rate ? buildVoteEstimate(rate) : null;

        const detailsRow = document.createElement('div');
        detailsRow.className = 'project-show-card__stats flavortown-project-cookies-details';

        const createProjectShowStat = (text, iconSvg = '') => {
            const stat = document.createElement('div');
            stat.className = 'project-show-card__stat';
            stat.innerHTML = iconSvg ? `${iconSvg}<span>${text}</span>` : `<span>${text}</span>`;
            return stat;
        };

        const clockIcon = `
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style="opacity: 0.7;">
                <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.5-13H11v6l5.2 3.2.8-1.3-4.5-2.7V7z"/>
            </svg>
        `;
        const trophyIcon = `
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style="opacity: 0.7;">
                <path d="M19 4h-3V3H8v1H5v4c0 2.76 2.24 5 5 5h4c2.76 0 5-2.24 5-5V4zm-2 4c0 1.66-1.34 3-3 3h-4c-1.66 0-3-1.34-3-3V6h10v2zM8 15h8v2H8v-2zm-1 3h10v2H7v-2z"/>
            </svg>
        `;

        detailsRow.appendChild(createProjectShowStat(rateLine, clockIcon));
        detailsRow.appendChild(createProjectShowStat(percentileLine, trophyIcon));
        if (estimate?.overallScore) {
            const scoreText = `~ avg ⭐ ${formatScoreValue(estimate.overallScore)}`;
            detailsRow.appendChild(createProjectShowStat(scoreText));
        }

        const detailsParent = statsWrapper.parentNode || statsWrapper;
        detailsParent.insertBefore(detailsRow, statsWrapper.nextSibling);

        if (estimate?.categories) {
            const categoriesRow = document.createElement('div');
            categoriesRow.className = 'project-show-card__stats flavortown-project-category-stats';

            categoriesRow.appendChild(createProjectShowStat(`Originality ★${formatScoreValue(estimate.categories.originality)}`));
            categoriesRow.appendChild(createProjectShowStat(`Technical ★${formatScoreValue(estimate.categories.technical)}`));
            categoriesRow.appendChild(createProjectShowStat(`Usability ★${formatScoreValue(estimate.categories.usability)}`));
            categoriesRow.appendChild(createProjectShowStat(`Storytelling ★${formatScoreValue(estimate.categories.storytelling)}`));

            detailsParent.insertBefore(categoriesRow, detailsRow.nextSibling);
        }
    }
}

function getShipStatsData(statsElement) {
    const minutesValue = statsElement.dataset.shipMinutes;
    let minutes = minutesValue ? parseFloat(minutesValue) : 0;
    if (!minutes || minutes <= 0) {
        const timeSpan = Array.from(statsElement.querySelectorAll('span'))
            .find(span => span.textContent.includes('Total time'));
        if (timeSpan) {
            minutes = parseDurationToMinutes(timeSpan.textContent);
        }
    }
    if (!minutes || minutes <= 0) return null;

    const dateValue = statsElement.dataset.shipDate;
    let shipDate = dateValue ? new Date(dateValue) : null;
    if (!shipDate || isNaN(shipDate.getTime())) {
        const shipPost = statsElement.closest('article.post--ship');
        const timeEl = shipPost ? shipPost.querySelector('.post__time') : null;
        shipDate = timeEl ? parseDateFromTimeElement(timeEl) : null;
    }
    if (!shipDate || isNaN(shipDate.getTime())) return null;

    const hours = minutes / 60;
    const range = getCookieRange(hours);
    if (!range) return null;

    return {
        statsElement,
        date: shipDate,
        minutes,
        hours,
        minCookies: range.minCookies,
        maxCookies: range.maxCookies,
        expectedCookies: range.expectedCookies
    };
}

async function addShipPayoutStats() {
    if (!/\/projects\/\d+$/.test(window.location.pathname)) return;

    let shipStats = document.querySelectorAll('.flavortown-ship-stats');
    if (!shipStats.length) {
        addShipStats();
        shipStats = document.querySelectorAll('.flavortown-ship-stats');
    }
    if (!shipStats.length) return;

    const projectIdMatch = window.location.pathname.match(/\/projects\/(\d+)/);
    const projectId = projectIdMatch ? projectIdMatch[1] : null;

    const projectName = getCurrentProjectName();
    if (!projectName) return;

    const payouts = await fetchShipPayouts();
    if (!payouts.length) return;

    const projectPayouts = payouts.filter(payout => projectNameMatches(payout.projectName, projectName));
    if (!projectPayouts.length) return;

    const ships = Array.from(shipStats)
        .filter(stat => !stat.querySelector('.flavortown-ship-cookies'))
        .map(stat => getShipStatsData(stat))
        .filter(Boolean);

    if (!ships.length) return;

    let totalShipMinutes = 0;
    if (projectId) {
        totalShipMinutes = ships.reduce((sum, ship) => sum + ship.minutes, 0);
        if (totalShipMinutes > 0) {
            setCachedShipMinutes(projectId, totalShipMinutes);
        }
    }

    const assignments = assignPayoutsToShips(projectPayouts, ships);
    if (projectId) {
        let paidShipMinutes = 0;
        let paidCookies = 0;
        assignments.forEach((payouts, ship) => {
            if (!payouts.length) return;
            paidShipMinutes += ship.minutes;
            paidCookies += payouts.reduce((sum, payout) => sum + payout.amount, 0);
        });

        const totalMinutes = getTotalDevlogMinutesFromDocument(document);
        const safeTotalMinutes = totalMinutes > 0 ? totalMinutes : totalShipMinutes;
        const unshippedMinutes = Math.max(0, safeTotalMinutes - paidShipMinutes);

        setCachedProjectUnshipped(projectId, {
            totalMinutes: safeTotalMinutes,
            paidShipMinutes,
            paidCookies,
            unshippedMinutes
        });
    }

    ships.forEach(ship => {
        const shipPayouts = assignments.get(ship) || [];
        if (!shipPayouts.length) return;

        const totalCookies = shipPayouts.reduce((sum, payout) => sum + payout.amount, 0);
        if (totalCookies <= 0) return;

        const rate = ship.hours > 0 ? getMultiplierFromCookies(totalCookies, ship.hours) : null;
        const rateValid = rate && isFinite(rate) && rate >= COOKIE_RATE_MIN && rate <= COOKIE_RATE_MAX;
        const rateLine = rateValid ? formatCookieRateLine(rate) : '--';
        const percentileLine = rateValid ? formatCookiePercentileLine(rate) : '--';
        const detailsText = rateValid ? ` (${rateLine}, ${percentileLine})` : '';
        const estimate = rateValid ? buildVoteEstimate(rate) : null;

        const cookieStat = document.createElement('div');
        cookieStat.className = 'flavortown-ship-cookies';
        cookieStat.style.cssText = 'display: flex; align-items: center; gap: 6px;';
        cookieStat.innerHTML = `
            <span style="font-size: 16px; opacity: 0.8;">🍪</span>
            <span><strong>${totalCookies.toLocaleString()}</strong> cookies${detailsText}</span>
        `;

        ship.statsElement.appendChild(cookieStat);

        if (estimate) {
            ship.statsElement.querySelectorAll('.flavortown-vote-estimate, .flavortown-vote-estimate-pill, .flavortown-vote-estimate-accordion').forEach(el => el.remove());
            const estimateResult = createVoteEstimateElement(estimate);
            if (estimateResult) {
                if (estimateResult.scorePill) {
                    estimateResult.scorePill.style.cssText = 'display: inline-flex; align-items: center; gap: 6px; font-weight: 600; margin-left: 8px;';
                    cookieStat.appendChild(estimateResult.scorePill);
                }
                if (estimateResult.accordion) {
                    ship.statsElement.appendChild(estimateResult.accordion);
                }
            }
        }
    });
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

        html = html.replace(/!\[([^\]]*)\]\(([^)\s]+)(?:\s*=\s*(\d+)(?:x(\d+))?)?\)/g, (_, alt, url, width, height) => {
            let sizeAttrs = '';
            if (width) {
                sizeAttrs += ` width="${width}"`;
                if (height) {
                    sizeAttrs += ` height="${height}"`;
                }
            }
            return `<img src="${url}" alt="${alt}" class="flavortown-md-img"${sizeAttrs}>`;
        });

        html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>');

        html = html.replace(/^---$/gm, '<hr class="flavortown-md-hr">');

        html = html.replace(/^&gt;\s?(.+)$/gm, '<blockquote class="flavortown-md-quote">$1</blockquote>');

        html = html.replace(/^-\s?\[\s?\]\s?(.+)$/gm, '<div class="flavortown-md-task"><input type="checkbox" disabled> $1</div>');
        html = html.replace(/^-\s?\[[xX]\]\s?(.+)$/gm, '<div class="flavortown-md-task"><input type="checkbox" checked disabled> $1</div>');

        html = html.replace(/^-\s+(.+)$/gm, '<li class="flavortown-md-li">$1</li>');
        html = html.replace(/^\d+\.\s+(.+)$/gm, '<li class="flavortown-md-oli">$1</li>');

        html = replaceEmojiTokensInHtml(html);

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

function replaceEmojiTokensInHtml(html) {
    if (!html || !slackEmojiMap || !Object.keys(slackEmojiMap).length) return html;

    return html.replace(/:([a-z0-9_+\-]{1,40}):/gi, (match, name) => {
        const entry = slackEmojiMap[name];
        if (!entry || !entry.url) return match;
        const safeName = name.replace(/"/g, '');
        const url = buildEmojiProxyUrl(entry.url);
        const size = SLACK_EMOJI_MARKDOWN_SIZE;
        return `<img src="${url}" alt=":${safeName}:" title=":${safeName}:" class="flavortown-slack-emoji" style="height: ${size}px; width: ${size}px; vertical-align: -0.15em; display: inline-block;" />`;
    });
}

function buildEmojiProxyUrl(url) {
    if (!url) return '';
    const encoded = encodeURIComponent(url);
    const size = SLACK_EMOJI_MARKDOWN_SIZE;
    return `https://images.weserv.nl/?url=${encoded}&w=${size}&h=${size}&fit=contain&n=-1`;
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
                initSlackEmojiAutocomplete(devlogTextarea, wrapper);
                const form = wrapper.querySelector('form') || wrapper.closest('form');
                if (form) {
                    attachSlackEmojiSubmitHandler(form, devlogTextarea);
                }
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

function setupInlineDevlogEditing() {
    if (!/\/projects\/\d+$/.test(window.location.pathname)) return;

    const editButtons = document.querySelectorAll('article.post--devlog .post__action-btn[href*="/edit"]');
    editButtons.forEach(btn => {
        if (btn.dataset.flavortownInlineEdit) return;
        btn.dataset.flavortownInlineEdit = 'true';

        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const post = btn.closest('article.post--devlog');
            enableInlineDevlogEdit(post, btn.href);
        });
    });
}

async function enableInlineDevlogEdit(postElement, editUrl) {
    if (postElement.querySelector('.flavortown-inline-edit')) return;

    const postBody = postElement.querySelector('.post__body');
    if (!postBody) return;

    const originalHtml = postBody.innerHTML;

    postBody.innerHTML = '<div style="padding: 12px; color: var(--color-text-muted, #888); font-style: italic;">Loading...</div>';

    try {
        const { body, csrfToken, formAction } = await fetchDevlogEditContent(editUrl);
        createDevlogEditUI(postElement, postBody, body, originalHtml, csrfToken, formAction, editUrl);
    } catch (error) {
        console.error('Flavortown Utils: Failed to load devlog for editing', error);
        postBody.innerHTML = originalHtml;
        alert('Failed to load devlog for editing. Please try again.');
    }
}

async function fetchDevlogEditContent(editUrl) {
    const response = await fetch(editUrl, { credentials: 'same-origin' });
    const html = await response.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    const textarea = doc.querySelector('#post_devlog_body');
    const body = textarea ? textarea.value : '';

    const csrfMeta = document.querySelector('meta[name="csrf-token"]');
    const csrfToken = csrfMeta ? csrfMeta.content : '';

    const form = doc.querySelector('form.projects-new__form');
    const formAction = form ? form.action : '';

    return { body, csrfToken, formAction };
}

function createDevlogEditUI(postElement, postBody, currentText, originalHtml, csrfToken, formAction, editUrl) {
    const editWrapper = document.createElement('div');
    editWrapper.className = 'flavortown-inline-edit';
    editWrapper.style.cssText = `
        display: flex;
        flex-direction: column;
        gap: 12px;
    `;

    const inputWrapper = document.createElement('div');
    inputWrapper.className = 'input flavortown-inline-edit-input';
    inputWrapper.style.cssText = `
        position: relative;
        background: var(--color-cream, #fdf6e3);
        border-radius: 12px;
        overflow: hidden;
        border: 2px solid var(--color-border, rgba(0,0,0,0.08));
        box-shadow: inset 0 1px 3px rgba(0,0,0,0.04);
    `;

    const textarea = document.createElement('textarea');
    textarea.className = 'flavortown-inline-edit__textarea input__field input__field--textarea';
    textarea.value = currentText;
    textarea.placeholder = 'Write a few sentences about what you worked on…';
    textarea.style.cssText = `
        width: 100%;
        padding: 14px 16px;
        border: none;
        font-family: inherit;
        font-size: 1em;
        line-height: 1.7;
        resize: none;
        background: transparent;
        color: var(--color-text-primary, #333);
        min-height: 100px;
        max-height: 500px;
        overflow-y: auto;
        outline: none;
    `;


    const autoExpand = () => {
        textarea.style.height = 'auto';
        textarea.style.height = Math.min(Math.max(textarea.scrollHeight, 100), 500) + 'px';
    };
    textarea.addEventListener('input', autoExpand);

    inputWrapper.appendChild(textarea);

    setTimeout(autoExpand, 0);

    const actions = document.createElement('div');
    actions.className = 'flavortown-inline-edit__actions';
    actions.style.cssText = `
        display: flex;
        gap: 10px;
        justify-content: flex-end;
    `;

    const cancelBtn = document.createElement('button');
    cancelBtn.type = 'button';
    cancelBtn.className = 'btn btn--borderless';
    cancelBtn.textContent = 'Cancel';
    cancelBtn.onclick = () => {
        postBody.innerHTML = originalHtml;
    };

    const saveBtn = document.createElement('button');
    saveBtn.type = 'button';
    saveBtn.className = 'btn btn--brown';
    saveBtn.textContent = 'Save Changes';
    saveBtn.onclick = () => saveDevlogEdit(textarea.value, csrfToken, formAction, postBody, editWrapper, originalHtml, saveBtn);

    actions.appendChild(cancelBtn);
    actions.appendChild(saveBtn);

    editWrapper.appendChild(inputWrapper);
    editWrapper.appendChild(actions);

    postBody.innerHTML = '';
    postBody.appendChild(editWrapper);

    addInlineEditToolbar(textarea, inputWrapper);
    initSlackEmojiAutocomplete(textarea, inputWrapper);

    textarea.focus();

    const versionsUrl = editUrl.replace('/edit', '/versions');
    fetchDevlogVersions(versionsUrl).then(versions => {
        if (versions) {
            createVersionHistoryAccordion(versions, editWrapper);
        }
    });
}

function addInlineEditToolbar(textarea, inputWrapper) {
    if (!textarea || textarea.dataset.mdToolbar) return;
    textarea.dataset.mdToolbar = 'true';

    const toolbar = document.createElement('div');
    toolbar.className = 'flavortown-md-toolbar flavortown-inline-toolbar';
    toolbar.style.cssText = `
        display: flex;
        flex-wrap: wrap;
        gap: 2px;
        padding: 8px 12px;
        background: rgba(0,0,0,0.03);
        border-bottom: 1px solid rgba(0,0,0,0.06);
    `;

    const buttons = [
        { icon: 'bold', title: 'Bold', action: () => wrapSelection(textarea, '**', '**') },
        { icon: 'italic', title: 'Italic', action: () => wrapSelection(textarea, '*', '*') },
        { icon: 'strikethrough', title: 'Strikethrough', action: () => wrapSelection(textarea, '~~', '~~') },
        { type: 'separator' },
        { icon: 'heading1', title: 'Heading 1', action: () => prefixLine(textarea, '# ') },
        { icon: 'heading2', title: 'Heading 2', action: () => prefixLine(textarea, '## ') },
        { type: 'separator' },
        { icon: 'list', title: 'Bullet List', action: () => prefixLine(textarea, '- ') },
        { icon: 'listOrdered', title: 'Numbered List', action: () => prefixLine(textarea, '1. ') },
        { type: 'separator' },
        { icon: 'code', title: 'Inline Code', action: () => wrapSelection(textarea, '`', '`') },
        { icon: 'link', title: 'Link', action: () => insertLink(textarea) }
    ];

    buttons.forEach(btn => {
        if (btn.type === 'separator') {
            const sep = document.createElement('div');
            sep.style.cssText = 'width: 1px; height: 16px; background: rgba(0,0,0,0.1); margin: 0 6px; align-self: center;';
            toolbar.appendChild(sep);
            return;
        }
        const button = document.createElement('button');
        button.type = 'button';
        button.style.cssText = `
            padding: 5px 7px;
            background: transparent;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            color: var(--color-text-secondary, #666);
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.1s ease;
        `;
        button.title = btn.title;
        button.innerHTML = LUCIDE_ICONS[btn.icon];
        button.querySelector('svg')?.setAttribute('width', '16');
        button.querySelector('svg')?.setAttribute('height', '16');
        button.addEventListener('mouseenter', () => {
            button.style.background = 'rgba(0,0,0,0.08)';
            button.style.color = 'var(--color-text-primary, #333)';
        });
        button.addEventListener('mouseleave', () => {
            button.style.background = 'transparent';
            button.style.color = 'var(--color-text-secondary, #666)';
        });
        button.addEventListener('click', (e) => {
            e.preventDefault();
            btn.action();
            textarea.focus();
        });
        toolbar.appendChild(button);
    });

    inputWrapper.insertBefore(toolbar, textarea);
}

async function saveDevlogEdit(newBody, csrfToken, formAction, postBody, editWrapper, originalHtml, saveBtn) {
    const originalBtnText = saveBtn.textContent;
    saveBtn.textContent = 'Saving...';
    saveBtn.disabled = true;

    try {
        const processedBody = replaceEmojiTokensWithImages(newBody);
        const formData = new FormData();
        formData.append('post_devlog[body]', processedBody);
        formData.append('authenticity_token', csrfToken);
        formData.append('_method', 'patch');

        const response = await fetch(formAction, {
            method: 'POST',
            credentials: 'same-origin',
            body: formData
        });

        if (response.ok) {
            const responseText = await response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(responseText, 'text/html');

            const thisPostId = formAction.match(/\/devlogs\/(\d+)/)?.[1];
            if (thisPostId) {
                const updatedPost = doc.querySelector(`article.post--devlog a[href*="/devlogs/${thisPostId}/edit"]`)?.closest('article.post--devlog');
                if (updatedPost) {
                    const updatedBody = updatedPost.querySelector('.post__body');
                    if (updatedBody) {
                        postBody.innerHTML = updatedBody.innerHTML;
                        return;
                    }
                }
            }

            const updatedHtml = simpleMarkdownToHtml(processedBody);
            postBody.innerHTML = updatedHtml;
        } else {
            throw new Error('Save failed');
        }
    } catch (error) {
        console.error('Flavortown Utils: Failed to save devlog:', error);
        saveBtn.textContent = originalBtnText;
        saveBtn.disabled = false;
        alert('Failed to save changes. Please try again.');
    }
}

function simpleMarkdownToHtml(markdown) {
    let html = markdown
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');

    html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');
    html = html.replace(/~~(.+?)~~/g, '<del>$1</del>');
    html = html.replace(/`([^`]+)`/g, '<code>$1</code>');
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
    html = html.replace(/^### (.+)$/gm, '<h3>$1</h3>');
    html = html.replace(/^## (.+)$/gm, '<h2>$1</h2>');
    html = html.replace(/^# (.+)$/gm, '<h1>$1</h1>');
    html = html.replace(/^- (.+)$/gm, '<li>$1</li>');
    html = html.replace(/(<li>.*<\/li>\n?)+/g, '<ul>$&</ul>');

    const paragraphs = html.split(/\n\n+/);
    html = paragraphs.map(p => {
        p = p.trim();
        if (!p) return '';
        if (p.startsWith('<h') || p.startsWith('<ul') || p.startsWith('<ol')) return p;
        return `<p>${p.replace(/\n/g, '<br>')}</p>`;
    }).join('\n');

    return html;
}

async function fetchDevlogVersions(versionsUrl) {
    try {
        const response = await fetch(versionsUrl, { credentials: 'same-origin' });
        if (!response.ok) return null;

        const html = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');

        const versions = [];

        const currentCard = doc.querySelector('.projects-new__card');
        if (currentCard) {
            const contentDiv = currentCard.querySelector('div[style*="pre-wrap"]');
            if (contentDiv) {
                versions.push({
                    label: 'Current Version',
                    content: contentDiv.textContent.trim(),
                    editedBy: null,
                    editedAt: null
                });
            }
        }

        const versionCards = doc.querySelectorAll('.projects-new__card[style*="margin-top"]');
        versionCards.forEach(card => {
            const heading = card.querySelector('h3');
            const timeSpan = card.querySelector('span[style*="color"]');
            const contentDiv = card.querySelector('div[style*="pre-wrap"]');

            if (heading && contentDiv) {
                versions.push({
                    label: heading.textContent.trim(),
                    content: contentDiv.textContent.trim(),
                    editedBy: timeSpan ? timeSpan.textContent.trim() : null
                });
            }
        });

        return versions.length > 1 ? versions : null;   
    } catch (error) {
        console.error('Flavortown Utils: Failed to fetch versions:', error);
        return null;
    }
}

function computeLineDiff(oldText, newText) {
    const oldLines = oldText.split('\n');
    const newLines = newText.split('\n');

    const lcs = [];
    for (let i = 0; i <= oldLines.length; i++) {
        lcs[i] = [];
        for (let j = 0; j <= newLines.length; j++) {
            if (i === 0 || j === 0) {
                lcs[i][j] = 0;
            } else if (oldLines[i - 1] === newLines[j - 1]) {
                lcs[i][j] = lcs[i - 1][j - 1] + 1;
            } else {
                lcs[i][j] = Math.max(lcs[i - 1][j], lcs[i][j - 1]);
            }
        }
    }

    let i = oldLines.length;
    let j = newLines.length;
    const result = [];

    while (i > 0 || j > 0) {
        if (i > 0 && j > 0 && oldLines[i - 1] === newLines[j - 1]) {
            result.unshift({ type: 'unchanged', text: oldLines[i - 1] });
            i--;
            j--;
        } else if (j > 0 && (i === 0 || lcs[i][j - 1] >= lcs[i - 1][j])) {
            result.unshift({ type: 'added', text: newLines[j - 1] });
            j--;
        } else if (i > 0) {
            result.unshift({ type: 'removed', text: oldLines[i - 1] });
            i--;
        }
    }

    return result;
}

function createVersionHistoryAccordion(versions, editWrapper) {
    if (!versions || versions.length < 2) return;

    const accordion = document.createElement('div');
    accordion.className = 'flavortown-version-history';
    accordion.style.cssText = 'margin-top: 8px;';

    let isOpen = false;

    const header = document.createElement('button');
    header.type = 'button';
    header.className = 'flavortown-version-history__header';
    header.style.cssText = `
        width: 100%;
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 10px 14px;
        background: var(--color-cream, #fdf6e3);
        border: 2px solid var(--color-border, rgba(0,0,0,0.08));
        border-radius: 10px;
        cursor: pointer;
        font-size: 0.85em;
        font-weight: 500;
        color: var(--color-text-secondary, #666);
        transition: all 0.15s ease;
    `;

    header.addEventListener('mouseenter', () => {
        header.style.borderColor = 'rgba(0,0,0,0.15)';
    });
    header.addEventListener('mouseleave', () => {
        if (!isOpen) header.style.borderColor = 'var(--color-border, rgba(0,0,0,0.08))';
    });

    const chevronIcon = document.createElement('span');
    chevronIcon.innerHTML = LUCIDE_ICONS.chevronRight || '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>';
    chevronIcon.style.cssText = 'transition: transform 0.2s ease; display: flex; opacity: 0.5;';
    chevronIcon.querySelector('svg')?.setAttribute('width', '14');
    chevronIcon.querySelector('svg')?.setAttribute('height', '14');

    const headerText = document.createElement('span');
    headerText.textContent = `Version History`;
    headerText.style.cssText = 'flex: 1; text-align: left;';

    const badge = document.createElement('span');
    badge.textContent = `${versions.length - 1} previous`;
    badge.style.cssText = `
        color: var(--color-text-muted, #999);
        font-size: 0.9em;
        font-weight: 400;
    `;

    header.appendChild(chevronIcon);
    header.appendChild(headerText);
    header.appendChild(badge);

    const content = document.createElement('div');
    content.className = 'flavortown-version-history__content';
    content.style.cssText = `
        display: none;
        background: var(--color-cream, #fdf6e3);
        border: 2px solid var(--color-border, rgba(0,0,0,0.08));
        border-top: none;
        border-radius: 0 0 10px 10px;
        overflow: hidden;
        max-height: 350px;
        overflow-y: auto;
    `;

    for (let i = 0; i < versions.length - 1; i++) {
        const newerVersion = versions[i];
        const olderVersion = versions[i + 1];

        const diffSection = document.createElement('div');
        diffSection.className = 'flavortown-version-diff';
        if (i > 0) {
            diffSection.style.borderTop = '1px solid rgba(0,0,0,0.06)';
        }

        const diffHeader = document.createElement('div');
        diffHeader.style.cssText = `
            padding: 10px 14px;
            background: rgba(0,0,0,0.02);
            font-size: 0.8em;
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 1px solid rgba(0,0,0,0.04);
        `;

        const diffTitle = document.createElement('span');
        diffTitle.style.cssText = 'font-weight: 600; color: var(--color-text-primary, #333);';
        diffTitle.textContent = `${newerVersion.label} → ${olderVersion.label}`;

        const diffMeta = document.createElement('span');
        diffMeta.style.cssText = 'color: var(--color-text-muted, #999); font-size: 0.9em;';
        if (olderVersion.editedBy) {
            diffMeta.textContent = olderVersion.editedBy.replace('Edited by ', '').replace(' on ', ' · ');
        }

        diffHeader.appendChild(diffTitle);
        diffHeader.appendChild(diffMeta);

        const diffBody = document.createElement('div');
        diffBody.style.cssText = `
            font-family: ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace;
            font-size: 0.8em;
            line-height: 1.6;
        `;

        const diff = computeLineDiff(olderVersion.content, newerVersion.content);

        diff.forEach(line => {
            const lineEl = document.createElement('div');
            lineEl.style.cssText = `
                padding: 3px 14px;
                white-space: pre-wrap;
                word-break: break-word;
                border-left: 3px solid transparent;
            `;

            const escapedText = escapeHtml(line.text);

            if (line.type === 'added') {
                lineEl.style.background = 'rgba(46, 160, 67, 0.12)';
                lineEl.style.borderLeftColor = '#2ea043';
                lineEl.style.color = '#1a7f37';
                lineEl.innerHTML = `<span style="opacity: 0.5; user-select: none; margin-right: 6px;">+</span>${escapedText}`;
            } else if (line.type === 'removed') {
                lineEl.style.background = 'rgba(248, 81, 73, 0.12)';
                lineEl.style.borderLeftColor = '#f85149';
                lineEl.style.color = '#cf222e';
                lineEl.innerHTML = `<span style="opacity: 0.5; user-select: none; margin-right: 6px;">−</span>${escapedText}`;
            } else {
                lineEl.style.color = '#888';
                lineEl.innerHTML = `<span style="opacity: 0.3; user-select: none; margin-right: 6px;">&nbsp;</span>${escapedText}`;
            }

            diffBody.appendChild(lineEl);
        });

        diffSection.appendChild(diffHeader);
        diffSection.appendChild(diffBody);
        content.appendChild(diffSection);
    }

    header.addEventListener('click', () => {
        isOpen = !isOpen;
        content.style.display = isOpen ? 'block' : 'none';
        chevronIcon.style.transform = isOpen ? 'rotate(90deg)' : 'rotate(0deg)';
        header.style.borderRadius = isOpen ? '10px 10px 0 0' : '10px';
        header.style.borderBottom = isOpen ? 'none' : '';
    });

    accordion.appendChild(header);
    accordion.appendChild(content);
    editWrapper.appendChild(accordion);
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
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

        const { totalUnshippedMinutes, totalPaidMinutes, totalPaidCookies } = getAggregateUnshippedStats();
        const totalUnshippedHours = totalUnshippedMinutes / 60;
        const efficiency = totalPaidMinutes > 0 ? totalPaidCookies / (totalPaidMinutes / 60) : null;
        const projectedCookies = efficiency && totalUnshippedMinutes > 0
            ? Math.round(currentCookies + (efficiency * totalUnshippedHours))
            : null;
        const hasProjectedData = projectedCookies !== null && isFinite(projectedCookies) && totalUnshippedMinutes > 0;

        let stackMode = localStorage.getItem('flavortown_progress_mode') || 'individual';
        let projectionMode = localStorage.getItem('flavortown_projection_mode') || 'actual';

        if (stackMode === 'projected') {
            stackMode = 'individual';
            projectionMode = 'projected';
            localStorage.setItem('flavortown_progress_mode', stackMode);
            localStorage.setItem('flavortown_projection_mode', projectionMode);
        }

        if (projectionMode === 'projected' && !hasProjectedData) {
            projectionMode = 'actual';
            localStorage.setItem('flavortown_projection_mode', projectionMode);
        }

        const effectiveCookies = projectionMode === 'projected' && hasProjectedData
            ? projectedCookies
            : currentCookies;

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

        const effectiveRate = efficiency && efficiency > 0 ? efficiency : 10;

        const goalsWithQty = goals.map(g => ({
            ...g,
            quantity: g.quantity || 1,
            totalCost: (g.quantity || 1) * g.price,
            remaining: Math.max(0, ((g.quantity || 1) * g.price) - effectiveCookies),
            hoursNeeded: Math.ceil(Math.max(0, ((g.quantity || 1) * g.price) - effectiveCookies) / effectiveRate),
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
        const cookiesRemaining = Math.max(0, totalCookiesNeeded - effectiveCookies);
        const hoursNeeded = Math.ceil(cookiesRemaining / effectiveRate);
        const progressPercent = totalCookiesNeeded > 0 ? Math.min(100, (effectiveCookies / totalCookiesNeeded) * 100) : 0;
        let runningTotal = 0;
        goalsWithQty.forEach(g => {
            if (stackMode === 'cumulative') {
                const availableForThis = Math.max(0, effectiveCookies - runningTotal);
                g.displayProgress = g.totalCost > 0 ? Math.min(100, (availableForThis / g.totalCost) * 100) : 100;
                runningTotal += g.totalCost;
            } else {
                g.displayProgress = g.totalCost > 0 ? Math.min(100, (effectiveCookies / g.totalCost) * 100) : 100;
            }
        });

        const priorityGoals = goalsWithQty.filter(g => g.isPriority);
        const priorityCookiesNeeded = priorityGoals.reduce((sum, g) => sum + g.totalCost, 0);
        const priorityRemaining = Math.max(0, priorityCookiesNeeded - effectiveCookies);
        const priorityHours = Math.ceil(priorityRemaining / effectiveRate);
        const priorityProgress = priorityCookiesNeeded > 0 ? Math.min(100, (effectiveCookies / priorityCookiesNeeded) * 100) : 0;
        const priorityCookiesDisplay = projectionMode === 'projected' && hasProjectedData
            ? effectiveCookies
            : currentCookies;

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
                    <span>🍪 ${priorityCookiesDisplay.toLocaleString()}/${priorityCookiesNeeded.toLocaleString()}</span>
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

        const progressLabel = projectionMode === 'projected' && hasProjectedData ? 'Projected' : 'Progress';
        const progressValue = projectionMode === 'projected' && hasProjectedData
            ? `🍪 ${effectiveCookies.toLocaleString()}/${totalCookiesNeeded.toLocaleString()}`
            : `🍪 ${currentCookies.toLocaleString()}/${totalCookiesNeeded.toLocaleString()}`;
        const projectedToggleDisabled = hasProjectedData ? '' : 'disabled';

        const projectionToggleHtml = `
            <div class="flavortown-progress-toggle">
                <button class="flavortown-progress-toggle__btn ${projectionMode === 'actual' ? 'active' : ''}" data-kind="projection" data-mode="actual">
                    Actual
                </button>
                <button class="flavortown-progress-toggle__btn ${projectionMode === 'projected' ? 'active' : ''}" data-kind="projection" data-mode="projected" ${projectedToggleDisabled}>
                    Projected
                </button>
            </div>
        `;

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
                        <span class="flavortown-goals-enhanced__card-label">${progressLabel}</span>
                        <span class="flavortown-goals-enhanced__card-value">${progressValue}</span>
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
                <div class="flavortown-progress-toggle-wrapper">
                    <div class="flavortown-progress-toggle">
                        <button class="flavortown-progress-toggle__btn ${stackMode === 'cumulative' ? 'active' : ''}" data-kind="stack" data-mode="cumulative">
                            Cumulative
                        </button>
                        <button class="flavortown-progress-toggle__btn ${stackMode === 'individual' ? 'active' : ''}" data-kind="stack" data-mode="individual">
                            Individual
                        </button>
                    </div>
                </div>
                <details class="flavortown-goals-enhanced__accordion" open>
                    <summary class="flavortown-goals-enhanced__accordion-header">
                        <span class="flavortown-accordion-title">Goal Items</span>
                        <span class="flavortown-goals-enhanced__accordion-icon">▼</span>
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

                const existingToggle = titleEl.querySelector('.flavortown-goals-projection-toggle');
                if (existingToggle) existingToggle.remove();

                let titleText = titleEl.querySelector('.flavortown-goals-title-text');
                if (!titleText) {
                    titleText = document.createElement('span');
                    titleText.className = 'flavortown-goals-title-text';
                    while (titleEl.firstChild) {
                        titleText.appendChild(titleEl.firstChild);
                    }
                    titleEl.appendChild(titleText);
                }

                const projectionToggle = document.createElement('span');
                projectionToggle.className = 'flavortown-goals-projection-toggle';
                projectionToggle.innerHTML = projectionToggleHtml;
                titleEl.appendChild(projectionToggle);

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
        const progressToggleBtn = e.target.closest('.flavortown-progress-toggle__btn');
        if (progressToggleBtn) {
            if (progressToggleBtn.disabled) return;
            e.preventDefault();
            e.stopPropagation();
            const newMode = progressToggleBtn.dataset.mode;
            const kind = progressToggleBtn.dataset.kind || 'stack';
            if (kind === 'projection') {
                localStorage.setItem('flavortown_projection_mode', newMode);
            } else {
                localStorage.setItem('flavortown_progress_mode', newMode);
            }
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
        let isUpdating = false;
        
        const shopGrid = document.querySelector('.shop-items') || document.body;
        const observer = new MutationObserver((mutations) => {
            if (isUpdating) return;
            
            const shouldUpdate = mutations.some(m => {
                for (const node of [...m.addedNodes, ...m.removedNodes]) {
                    if (node.nodeType === 1) {
                        if (node.classList?.contains('shop-item-card') || 
                            node.classList?.contains('shop-goals__item') ||
                            node.closest?.('.shop-items')) {
                            return true;
                        }
                    }
                }
                return false;
            });
            
            if (shouldUpdate) {
                isUpdating = true;
                setTimeout(() => {
                    updateStats();
                    addQtyControlsToCards();
                    isUpdating = false;
                }, 100);
            }
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

function normalizeShopItemName(name) {
    return (name || '')
        .split(' (')[0]
        .toLowerCase()
        .replace(/\s+/g, ' ')
        .trim();
}

function getOrderNumberFromItem(orderItem) {
    const labelEls = orderItem.querySelectorAll('.my-orders__header-label');
    for (const label of labelEls) {
        const text = label.textContent || '';
        const match = text.match(/Order\s*#\s*(\d+)/i);
        if (match) return match[1];
    }
    return null;
}

function getOrderQuantityFromItem(orderItem) {
    const rows = orderItem.querySelectorAll('.my-orders__detail-row');
    for (const row of rows) {
        const label = row.querySelector('.my-orders__label')?.textContent || '';
        if (label.toLowerCase().includes('quantity')) {
            const valueText = row.querySelector('.my-orders__value')?.textContent || '';
            const qty = parseInt(valueText.replace(/[^0-9]/g, ''), 10);
            return Number.isFinite(qty) && qty > 0 ? qty : 1;
        }
    }
    return 1;
}

function getOrderItemName(orderItem) {
    const nameEl = orderItem.querySelector('.my-orders__item-name');
    return nameEl ? nameEl.textContent.trim() : null;
}

function applyOrderToWishlist(wishlist, itemName, qtyToRemove, changes) {
    const normalizedTarget = normalizeShopItemName(itemName);
    if (!normalizedTarget) return 0;

    const matches = Object.entries(wishlist).filter(([, item]) => {
        const name = normalizeShopItemName(item?.name || '');
        return name && name === normalizedTarget;
    });

    if (!matches.length) return 0;

    let remaining = qtyToRemove;
    matches.forEach(([id, item]) => {
        if (remaining <= 0) return;
        const currentQty = Math.max(1, item.quantity || 1);
        if (remaining >= currentQty) {
            remaining -= currentQty;
            if (changes) {
                changes.push({
                    id,
                    name: item?.name || itemName,
                    removedQty: currentQty,
                    remainingQty: 0
                });
            }
            delete wishlist[id];
        } else {
            item.quantity = currentQty - remaining;
            if (changes) {
                changes.push({
                    id,
                    name: item?.name || itemName,
                    removedQty: remaining,
                    remainingQty: item.quantity
                });
            }
            remaining = 0;
        }
    });

    return qtyToRemove - remaining;
}

function syncShopGoalsWithOrders(doc, options = {}) {
    const root = doc || document;
    const wishlistData = localStorage.getItem('shop_wishlist');
    if (!wishlistData) return;

    let wishlist = {};
    try {
        wishlist = JSON.parse(wishlistData) || {};
    } catch (e) {
        return;
    }

    const processedRaw = localStorage.getItem(SHOP_WISHLIST_ORDERED_ITEMS_KEY);
    let processed = {};
    try {
        processed = processedRaw ? JSON.parse(processedRaw) : {};
    } catch (e) {
        processed = {};
    }

    const orderItems = root.querySelectorAll('.my-orders__item');
    if (!orderItems.length) return;

    let wishlistChanged = false;
    let processedChanged = false;
    const changes = [];

    orderItems.forEach(orderItem => {
        const orderId = getOrderNumberFromItem(orderItem);
        const itemName = getOrderItemName(orderItem);
        if (!orderId || !itemName) return;

        const key = `${orderId}:${normalizeShopItemName(itemName)}`;
        if (processed[key]) return;

        const qty = getOrderQuantityFromItem(orderItem);
        if (qty > 0) {
            const removed = applyOrderToWishlist(wishlist, itemName, qty, changes);
            if (removed > 0) wishlistChanged = true;
        }

        processed[key] = { processedAt: Date.now(), quantity: qty };
        processedChanged = true;
    });

    if (changes.length) {
        showShopGoalsOrderToast(changes);
    }

    const commit = () => {
        if (wishlistChanged) {
            localStorage.setItem('shop_wishlist', JSON.stringify(wishlist));
            window.dispatchEvent(new Event('storage'));
        }

        if (processedChanged) {
            localStorage.setItem(SHOP_WISHLIST_ORDERED_ITEMS_KEY, JSON.stringify(processed));
        }
    };

    if (options.animate && changes.length) {
        applyGoalChangeAnimations(changes);
        setTimeout(commit, 260);
    } else {
        commit();
    }
}

function applyGoalChangeAnimations(changes) {
    const byId = new Map();
    changes.forEach(change => {
        if (!change?.id) return;
        byId.set(change.id, change);
    });

    byId.forEach(change => {
        const goalEl = document.querySelector(`.flavortown-goal-item[data-goal-id="${change.id}"]`);
        if (!goalEl) return;
        if (change.remainingQty === 0) {
            goalEl.classList.add('flavortown-goal-item--removing');
        } else {
            goalEl.classList.add('flavortown-goal-item--updated');
            const qtyEl = goalEl.querySelector('.goal-item__qty-compact span');
            if (qtyEl) qtyEl.textContent = change.remainingQty;
            setTimeout(() => goalEl.classList.remove('flavortown-goal-item--updated'), 600);
        }
    });
}

function showShopGoalsOrderToast(changes) {
    const existingToast = document.querySelector('.flavortown-order-sync-toast');
    if (existingToast) existingToast.remove();

    const summaryMap = new Map();
    changes.forEach(change => {
        const name = normalizeShopItemName(change.name || 'item') || (change.name || 'item');
        const entry = summaryMap.get(name) || { name: change.name || name, qty: 0 };
        entry.qty += change.removedQty || 0;
        summaryMap.set(name, entry);
    });

    const summary = Array.from(summaryMap.values());
    summary.sort((a, b) => b.qty - a.qty);
    const summaryText = summary
        .slice(0, 3)
        .map(item => `${item.qty}x ${item.name}`)
        .join(', ');
    const moreCount = summary.length - 3;

    const toast = document.createElement('div');
    toast.className = 'flavortown-achievement-toast flavortown-order-sync-toast';
    toast.innerHTML = `
        <div class="flavortown-achievement-toast__content">
            <div class="flavortown-achievement-toast__title">Goals updated from recent orders</div>
            <div class="flavortown-achievement-toast__names">
                Removed: ${summaryText}${moreCount > 0 ? ` +${moreCount} more` : ''}
            </div>
            <div class="flavortown-order-sync-toast__note">Applied quantities based on your purchase history.</div>
        </div>
        <button class="flavortown-achievement-toast__close">×</button>
    `;

    document.body.appendChild(toast);
    requestAnimationFrame(() => toast.classList.add('is-visible'));

    const closeBtn = toast.querySelector('.flavortown-achievement-toast__close');
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            toast.classList.remove('is-visible');
            setTimeout(() => toast.remove(), 300);
        });
    }

    setTimeout(() => {
        if (toast.parentNode) {
            toast.classList.remove('is-visible');
            setTimeout(() => toast.remove(), 300);
        }
    }, 5000);
}

async function runShopOrdersSync() {
    if (window.location.pathname === '/shop/my_orders') {
        syncShopGoalsWithOrders(document, { animate: true });
        return;
    }

    if (window.location.pathname !== '/shop') return;

    try {
        const response = await fetch('/shop/my_orders', { credentials: 'same-origin' });
        if (!response.ok) return;
        const html = await response.text();
        const doc = new DOMParser().parseFromString(html, 'text/html');
        syncShopGoalsWithOrders(doc, { animate: true });
    } catch (e) {
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

    const { totalPaidMinutes, totalPaidCookies } = getAggregateUnshippedStats();
    const efficiency = totalPaidMinutes > 0 ? totalPaidCookies / (totalPaidMinutes / 60) : null;
    const defaultRate = Math.min(30, Math.max(1, Math.round(efficiency || 10)));
    const rates = [defaultRate, 20, 25].filter((rate, idx, arr) => arr.indexOf(rate) === idx);

    document.querySelectorAll('.shop-item-card[data-shop-id]').forEach(card => {
        if (card.querySelector('.flavortown-efficiency')) return;

        const price = Math.ceil(parseFloat(card.dataset.shopWishlistItemPriceValue) || 0);
        if (price === 0) return;

        const remaining = Math.max(0, price - currentCookies);
        const progress = price > 0 ? Math.min(100, (currentCookies / price) * 100) : 0;
        const canAfford = currentCookies >= price;
        const effectiveRate = efficiency && efficiency > 0 ? efficiency : 10;
        const moreHours = Math.max(0, remaining / effectiveRate);
        const totalHours = price / effectiveRate;

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
                <div class="flavortown-efficiency__hours">
                    <span>⏱ 0h more</span>
                    <span>⏱ ${totalHours.toFixed(1)}h total</span>
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
                <div class="flavortown-efficiency__hours">
                    <span>⏱ ${moreHours.toFixed(1)}h more</span>
                    <span>⏱ ${totalHours.toFixed(1)}h total</span>
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
                <button class="flavortown-search-more" type="button" style="display: none;">Show 5 more</button>
                <div class="flavortown-search-loading" style="display: none;">Searching...</div>
                <div class="flavortown-search-error" style="display: none;"></div>
            </div>
        </div>
    `;

    exploreNav.after(searchContainer);

    const input = searchContainer.querySelector('.flavortown-search-input');
    const resultsContainer = searchContainer.querySelector('.flavortown-search-results');
    const resultsGrid = searchContainer.querySelector('.flavortown-search-grid');
    const moreBtn = searchContainer.querySelector('.flavortown-search-more');
    const loadingEl = searchContainer.querySelector('.flavortown-search-loading');
    const errorEl = searchContainer.querySelector('.flavortown-search-error');
    const countEl = searchContainer.querySelector('.flavortown-search-count');
    const closeBtn = searchContainer.querySelector('.flavortown-search-close');

    let currentResults = [];
    let shownCount = 0;

    const scoreProject = (query, project) => {
        const q = query.toLowerCase();
        const title = (project.title || '').toLowerCase();
        const desc = (project.description || '').toLowerCase();
        let score = 0;

        if (title === q) score += 100;
        if (title.startsWith(q)) score += 80;
        if (title.includes(q)) score += 40;
        if (title.split(/\s+/).includes(q)) score += 60;
        if (desc.includes(q)) score += 10;

        return score;
    };

    const renderNextResults = () => {
        const nextBatch = currentResults.slice(shownCount, shownCount + 5);
        nextBatch.forEach(project => {
            resultsGrid.insertAdjacentHTML('beforeend', `
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
            `);
        });
        shownCount += nextBatch.length;

        const remaining = currentResults.length - shownCount;
        if (remaining > 0) {
            const nextCount = Math.min(5, remaining);
            moreBtn.textContent = `Show ${nextCount} more`;
            moreBtn.style.display = 'block';
        } else {
            moreBtn.style.display = 'none';
        }

        const total = currentResults.length;
        countEl.textContent = `Showing ${shownCount} of ${total} projects`;
    };

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
                moreBtn.style.display = 'none';
                return;
            }

            currentResults = data.projects
                .map((project, index) => ({ project, index, score: scoreProject(query, project) }))
                .sort((a, b) => {
                    if (b.score !== a.score) return b.score - a.score;
                    return a.index - b.index;
                })
                .map(entry => entry.project);

            resultsGrid.innerHTML = '';
            shownCount = 0;
            renderNextResults();

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
        currentResults = [];
        shownCount = 0;
        moreBtn.style.display = 'none';
    });

    moreBtn.addEventListener('click', () => {
        renderNextResults();
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
        const hoursMatch = timeText.match(/(\d+)h/);
        const minsMatch = timeText.match(/(\d+)m/);

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
    initLocalStorageSync();
    loadTheme();
    checkForUpdates();
    addDevlogFrequencyStat();
    addVotesDevlogFrequencyStat();
    ensureShipStatsReady();
    addShipStats();
    addShipPayoutStats();
    addProjectShowCookieStat();
    inlineDevlogForm();
    setupInlineDevlogEditing();
    enhanceCommentEmojiInputs();
    watchCommentEmojiInputs();
    cleanupUnownedUnshippedCache();
    enhanceShopGoals();
    runShopOrdersSync();
    initShopAccessories();
    addShopCardEfficiency();
    addExploreSearch();
    captureApiKey();
    initProjectBoardStats();
    addProjectCardCookieStats();
    addSkipButton();
    enhanceKitchenDashboard();
    setTimeout(enhanceLeaderboardPage, 0);
    enhanceAdminPage();
    initProjectRepoSuggestions();

    setTimeout(checkAchievements, 2000);
    setTimeout(initVotesFeature, 1000);
}

const VOTES_LAST_PROJECT_KEY = 'flavortown-votes-last-project';
const VOTES_REFRESH_ATTEMPTS_KEY = 'flavortown-votes-refresh-attempts';
const VOTES_SKIP_TRIGGER_KEY = 'flavortown-votes-skip-trigger';
const MAX_VOTES_REFRESH_ATTEMPTS = 2;
let skipButtonObserver;
let votesRotationChecked = false;

function ensureVotesActionsStyles() {
    if (document.getElementById('flavortown-votes-actions-style')) return;
    const style = document.createElement('style');
    style.id = 'flavortown-votes-actions-style';
    style.textContent = `
        .flavortown-votes-actions {
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 0;
            padding: 6px 0 12px;
            margin-top: 6px;
        }
        .flavortown-votes-actions .btn {
            margin: 0 !important;
            min-height: 38px;
        }
        .flavortown-votes-actions .flavortown-skip-btn,
        .flavortown-votes-actions .votes-new__prev-btn {
            background: var(--ft-votes-bg, rgba(173, 119, 87, 0.12)) !important;
            border: 2px solid var(--ft-votes-accent, rgb(173, 119, 87)) !important;
            border-radius: 12px !important;
            box-shadow: none !important;
            padding: 10px 14px !important;
            color: var(--ft-votes-text, inherit) !important;
            font-weight: 700 !important;
            position: relative;
            overflow: hidden;
        }
        .flavortown-votes-actions .flavortown-skip-btn::before,
        .flavortown-votes-actions .votes-new__prev-btn::before {
            content: '';
            position: absolute;
            inset: 0;
            background: none;
            pointer-events: none;
        }
        .flavortown-votes-actions .flavortown-skip-btn:hover,
        .flavortown-votes-actions .votes-new__prev-btn:hover {
            background: var(--ft-votes-bg-hover, rgba(173, 119, 87, 0.2)) !important;
        }
    `;
    document.head.appendChild(style);
}

function getCurrentVotesProjectKey() {
    const card = document.querySelector('.votes-new__project-card');
    if (!card) return null;

    const title = card.querySelector('h1')?.textContent?.trim() || '';
    const banner = card.querySelector('img')?.src || '';
    const repo = card.querySelector('a[aria-label="Repo"]')?.href || '';

    const key = [title, banner, repo].filter(Boolean).join('|');
    return key || null;
}

const SPEED_READER_TOO_FAST_KEY = 'flavortown_speed_reader_too_fast';
const SPEED_READER_DEFAULT_WPM = 300;
const SPEED_READER_MIN_WPM = 150;
const SPEED_READER_MAX_WPM = 700;
const SPEED_READER_STEP = 25;
const SPEED_READER_RAMP_STEP_MIN = 3;
const SPEED_READER_RAMP_STEP_MAX = 4;
const SPEED_READER_RAMP_TICK_MS = 1000;
const SPEED_READER_FADE_MS = 200;

function getComfortCap() {
    try {
        const val = parseInt(localStorage.getItem(SPEED_READER_TOO_FAST_KEY), 10);
        if (!Number.isNaN(val)) return Math.max(SPEED_READER_MIN_WPM, val - 50);
    } catch (e) {
        console.warn('SpeedReader: cannot read comfort cap', e);
    }
    return null;
}

function storeTooFast(wpm) {
    try {
        localStorage.setItem(SPEED_READER_TOO_FAST_KEY, String(wpm));
    } catch (e) {
        console.warn('SpeedReader: cannot store too-fast wpm', e);
    }
}

function getStartingWpm() {
    const cap = getComfortCap();
    if (cap) return Math.min(SPEED_READER_DEFAULT_WPM, cap);
    return SPEED_READER_DEFAULT_WPM;
}

function computeOrpIndex(word) {
    const len = word.length;
    if (len <= 1) return 0;
    return Math.floor((len - 1) / 2);
}

function splitWords(text) {
    if (!text) return [];
    return text
        .replace(/\s+/g, ' ')
        .trim()
        .split(' ')
        .filter(Boolean);
}

function highlightWord(word, wrap = true) {
    const idx = computeOrpIndex(word);
    const pre = word.slice(0, idx);
    const orp = word.slice(idx, idx + 1) || '';
    const post = word.slice(idx + 1);
    const inner = `<span class="sr-pre">${pre}</span><span class="sr-orp">${orp}</span><span class="sr-post">${post}</span>`;
    return wrap ? `<span class="sr-word-inner">${inner}</span>` : inner;
}

async function gatherProjectTextsForSpeedRead() {
    const card = document.querySelector('.votes-new__project-card');
    const projectTitle = card?.querySelector('h1')?.textContent?.trim();
    const projectIdMatch = card?.querySelector('a[href*="/projects/"]')?.getAttribute('href')?.match(/\/(\d+)/);
    const projectId = projectIdMatch ? projectIdMatch[1] : null;

    const pagePosts = Array.from(document.querySelectorAll('.votes-new__devlogs article.post .post__body'));
    if (pagePosts.length === 0) return { text: '', count: 0, projectTitle, projectId };

    const entries = pagePosts
        .map((el, idx) => ({ body: el.textContent?.trim() || '', idx }))
        .filter(e => e.body);

    entries.reverse();

    const allText = entries.map(e => e.body).join(' \n ');
    return { text: allText, count: entries.length, projectTitle, projectId };
}

let speedReaderModal = null;
let speedReaderState = null;

function closeSpeedReader() {
    if (speedReaderState?.timer) {
        clearTimeout(speedReaderState.timer);
    }
    if (speedReaderState?.rampTimeout) {
        clearTimeout(speedReaderState.rampTimeout);
    }
    speedReaderState = null;
    document.removeEventListener('keydown', handleSpeedReaderKeys, true);

    if (speedReaderModal) {
        const modal = speedReaderModal;
        speedReaderModal = null;
        modal.classList.add('sr-modal-closing');
        setTimeout(() => {
            modal.remove();
        }, SPEED_READER_FADE_MS);
    }
}

function handleSpeedReaderKeys(e) {
    if (!speedReaderState) return;
    if (e.key === 'Escape') {
        e.preventDefault();
        closeSpeedReader();
        return;
    }
    if (e.key === 'y' || e.key === 'Y') {
        e.preventDefault();
        adjustSpeed(SPEED_READER_STEP, false);
    }
    if (e.key === 'x' || e.key === 'X') {
        e.preventDefault();
        storeTooFast(speedReaderState.wpm);
        adjustSpeed(-SPEED_READER_STEP, true);
    }
}

function adjustSpeed(delta, markTooFast) {
    if (!speedReaderState) return;
    const prev = speedReaderState.wpm;
    const maxCap = Math.min(SPEED_READER_MAX_WPM, speedReaderState.maxWpm || SPEED_READER_MAX_WPM);
    let next = prev + delta;
    next = Math.max(SPEED_READER_MIN_WPM, Math.min(maxCap, next));

    if (markTooFast && delta < 0 && prev > next) {
        storeTooFast(prev);
        speedReaderState.rampActive = false;
        if (speedReaderState.rampTimeout) {
            clearTimeout(speedReaderState.rampTimeout);
            speedReaderState.rampTimeout = null;
        }
    }

    speedReaderState.wpm = next;
    if (speedReaderModal) {
        const status = speedReaderModal.querySelector('.sr-status');
        if (status) status.textContent = `${Math.round(next)} wpm · ${speedReaderState.index + 1}/${speedReaderState.words.length}`;
    }
}


function showSpeedReader(words) {
    closeSpeedReader();

    const modal = document.createElement('div');
    modal.className = 'sr-modal-overlay';
    modal.innerHTML = `
        <div class="sr-modal">
            <div class="sr-word-box">
                <div class="sr-word-line"></div>
                <div class="sr-word">
                    <div class="sr-word-measure"></div>
                </div>
            </div>
            <div class="sr-controls">Y speed up · X too fast · Esc close</div>
            <div class="sr-status"></div>
        </div>
    `;

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeSpeedReader();
        }
    });
    modal.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            e.preventDefault();
            closeSpeedReader();
        }
    });
    modal.tabIndex = -1;
    setTimeout(() => modal.focus(), 0);

    document.body.appendChild(modal);
    speedReaderModal = modal;

    const wordEl = modal.querySelector('.sr-word');
    const measureEl = modal.querySelector('.sr-word-measure');
    const statusEl = modal.querySelector('.sr-status');
    const wordBox = modal.querySelector('.sr-word-box');

    const wpm = Math.min(getStartingWpm(), SPEED_READER_MAX_WPM);
    speedReaderState = {
        words,
        index: 0,
        wpm,
        timer: null,
        rampTimeout: null,
        rampActive: true,
        maxWpm: Math.floor(650 + Math.random() * 51),
    };

    function scheduleRamp() {
        if (!speedReaderState?.rampActive) return;
        const step = SPEED_READER_RAMP_STEP_MIN + Math.random() * (SPEED_READER_RAMP_STEP_MAX - SPEED_READER_RAMP_STEP_MIN);
        speedReaderState.rampTimeout = setTimeout(() => {
            if (!speedReaderState?.rampActive) return;
            adjustSpeed(step, false);
            scheduleRamp();
        }, SPEED_READER_RAMP_TICK_MS);
    }

function renderWord(word) {
    if (!wordEl || !measureEl) return;
    measureEl.innerHTML = highlightWord(word, false);
    const orpSpan = measureEl.querySelector('.sr-orp');
    let offset = 0;
    if (orpSpan) {
        offset = orpSpan.offsetLeft + orpSpan.offsetWidth / 2;
    }
    wordEl.innerHTML = highlightWord(word, true);
    const inner = wordEl.querySelector('.sr-word-inner');
    if (!wordBox) return;

    if (inner) {
        inner.style.setProperty('--sr-focal-offset', `${offset}px`);
    }
    if (wordEl) {
        wordEl.style.setProperty('--sr-focal-offset', `${offset}px`);
    }

    const guidePx = wordBox.clientWidth * 0.38;
    const paddingLeft = parseFloat(getComputedStyle(wordBox).paddingLeft || '0');
    let shift = guidePx - paddingLeft - offset;
    if (inner) {
        inner.style.setProperty('--sr-shift', `${shift}px`);
        requestAnimationFrame(() => {
            const orp = inner.querySelector('.sr-orp');
            if (!orp || !wordBox) return;
            const orpRect = orp.getBoundingClientRect();
            const boxRect = wordBox.getBoundingClientRect();
            const lineX = boxRect.left + boxRect.width * 0.38;
            const delta = (orpRect.left + orpRect.width / 2) - lineX;
            if (Math.abs(delta) > 0.5) {
                shift -= delta;
                inner.style.setProperty('--sr-shift', `${shift}px`);
            }
        });
    }
}


    function step() {
        if (!speedReaderState || speedReaderState.index >= speedReaderState.words.length) {
            closeSpeedReader();
            return;
        }
        const word = speedReaderState.words[speedReaderState.index];
        renderWord(word);
        if (statusEl) statusEl.textContent = `${Math.round(speedReaderState.wpm)} wpm · ${speedReaderState.index + 1}/${speedReaderState.words.length}`;

        speedReaderState.index += 1;

        const baseDelay = 60000 / speedReaderState.wpm;
        const lastChar = word.slice(-1);
        let extra = 0;
        if (/[,;:]/.test(lastChar)) extra += 20;
        if (/[\.!?]/.test(lastChar)) extra += 40;
        if (/\n/.test(word)) extra += 60;

        speedReaderState.timer = setTimeout(step, baseDelay + extra);
    }

    scheduleRamp();
    document.addEventListener('keydown', handleSpeedReaderKeys, true);
    step();
}

function initSpeedReaderOnVotesPage() {
    if (!window.location.pathname.startsWith('/votes/new')) return;

    const card = document.querySelector('.votes-new__project-card');
    if (!card) return;

    const buttonsContainer = card.querySelector('.votes-new__project-buttons');
    if (!buttonsContainer) return;

    let btn = buttonsContainer.querySelector('.sr-devlog-btn');
    if (!btn) {
        btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'btn btn--brown btn--borderless sr-devlog-btn';
        btn.textContent = 'Speed read devlogs';
        buttonsContainer.appendChild(btn);
    }

    const updateBtnState = async () => {
        const { text, count } = await gatherProjectTextsForSpeedRead();
        const hasText = text && text.trim().length > 0 && count > 0;
        btn.disabled = !hasText;
        btn.title = hasText ? 'Open speed reader for devlogs & ships' : 'No devlogs/ships to read';
    };

    btn.addEventListener('click', async () => {
        const { text, count } = await gatherProjectTextsForSpeedRead();
        if (!text || !text.trim() || count === 0) {
            btn.disabled = true;
            btn.title = 'No devlogs/ships to read';
            return;
        }
        const words = splitWords(text);
        if (words.length === 0) {
            btn.disabled = true;
            btn.title = 'No devlogs/ships to read';
            return;
        }
        showSpeedReader(words);
    });

    updateBtnState();
}

function ensureVotesProjectRotation() {
    if (votesRotationChecked) return;
    if (!window.location.pathname.startsWith('/votes/new')) return;
    const skipTriggered = sessionStorage.getItem(VOTES_SKIP_TRIGGER_KEY) === '1';
    if (!skipTriggered) return;

    const currentKey = getCurrentVotesProjectKey();
    if (!currentKey) return;

    votesRotationChecked = true;

    const lastKey = sessionStorage.getItem(VOTES_LAST_PROJECT_KEY);
    let attempts = Number(sessionStorage.getItem(VOTES_REFRESH_ATTEMPTS_KEY) || '0');
    if (Number.isNaN(attempts)) attempts = 0;

    if (lastKey && lastKey === currentKey) {
        if (attempts < MAX_VOTES_REFRESH_ATTEMPTS) {
            attempts += 1;
            sessionStorage.setItem(VOTES_REFRESH_ATTEMPTS_KEY, String(attempts));
            votesRotationChecked = false;
            window.location.reload();
            return;
        }
        sessionStorage.removeItem(VOTES_SKIP_TRIGGER_KEY);
        sessionStorage.setItem(VOTES_REFRESH_ATTEMPTS_KEY, '0');
        votesRotationChecked = false;
        return;
    }

    sessionStorage.setItem(VOTES_LAST_PROJECT_KEY, currentKey);
    sessionStorage.setItem(VOTES_REFRESH_ATTEMPTS_KEY, '0');
    sessionStorage.removeItem(VOTES_SKIP_TRIGGER_KEY);
    votesRotationChecked = false;
}

function addSkipButton() {
    if (!window.location.pathname.startsWith('/votes/new')) {
        if (skipButtonObserver) {
            skipButtonObserver.disconnect();
            skipButtonObserver = null;
        }
        votesRotationChecked = false;
        return;
    }

    const ensureSkipButton = () => {
        const prevBtn = document.querySelector('.votes-new__prev-btn');
        const form = document.querySelector('.votes-new__form');
        const submitBtn = form?.querySelector('button[type="submit"], input[type="submit"], .btn--brown');
        const target = prevBtn || submitBtn;

        if (!target || !target.parentNode) return false;

        let skipBtn = document.querySelector('.flavortown-skip-btn');
        if (!skipBtn) {
            skipBtn = document.createElement('button');
            skipBtn.type = 'button';
            skipBtn.className = 'btn btn--borderless flavortown-skip-btn';
            skipBtn.textContent = 'Skip';
            skipBtn.addEventListener('click', () => {
                const currentKey = getCurrentVotesProjectKey();
                if (currentKey) {
                    sessionStorage.setItem(VOTES_LAST_PROJECT_KEY, currentKey);
                    sessionStorage.setItem(VOTES_REFRESH_ATTEMPTS_KEY, '0');
                }
                sessionStorage.setItem(VOTES_SKIP_TRIGGER_KEY, '1');
                votesRotationChecked = false;
                window.location.reload();
            });
        }

        if (prevBtn) {
            ensureVotesActionsStyles();
            let container = prevBtn.closest('.flavortown-votes-actions');
            if (!container) {
                container = document.createElement('div');
                container.className = 'flavortown-votes-actions';
                prevBtn.parentNode.insertBefore(container, prevBtn);
                container.appendChild(prevBtn);
            }
            container.appendChild(skipBtn);
        } else {
            target.insertAdjacentElement('afterend', skipBtn);
        }

        ensureVotesProjectRotation();
        return true;
    };

    if (skipButtonObserver) {
        skipButtonObserver.disconnect();
        skipButtonObserver = null;
    }

    if (ensureSkipButton()) return;

    skipButtonObserver = new MutationObserver(() => {
        if (ensureSkipButton()) {
            skipButtonObserver.disconnect();
            skipButtonObserver = null;
        }
    });

    skipButtonObserver.observe(document.body, { childList: true, subtree: true });

    setTimeout(() => {
        if (skipButtonObserver) {
            skipButtonObserver.disconnect();
            skipButtonObserver = null;
        }
    }, 5000);
}

async function enhanceKitchenDashboard() {
    if (window.location.pathname !== '/kitchen') return;
    if (document.querySelector('.flavortown-kitchen-dashboard')) return;

    const kitchenSetup = document.querySelector('.kitchen-setup');
    if (!kitchenSetup) return;

    const helpSection = document.querySelector('.kitchen-help');
    if (helpSection) helpSection.remove();

    const kitchenComic = document.querySelector('.kitchen-comic');
    if (kitchenComic) kitchenComic.remove();

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


        const parentContainer = kitchenSetup.parentNode;
        kitchenSetup.replaceWith(dashboard);

        const kitchenAnnouncement = document.querySelector('.kitchen-announcement');
        if (kitchenAnnouncement && parentContainer) {
            parentContainer.insertBefore(kitchenAnnouncement, dashboard);
        }

        const canvas = document.getElementById('flavortown-cookies-graph');
        if (canvas && dataPoints.length > 1) {
        
            const drawGraph = () => {
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
            const themeStyles = document.getElementById('flavortown-theme');
            const isDarkTheme = !!themeStyles;
            let textColor, gridColor;
            if (isDarkTheme) {
                textColor = '#cdd6f4';
                gridColor = '#45475a';
            } else {
                textColor = styles.getPropertyValue('--color-text-primary')?.trim() || '#333';
                gridColor = styles.getPropertyValue('--color-border')?.trim() || '#e2d8cc';
            }

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
                        ctx.fillText(dateStr, x, rect.height - 10);
                    }
                }
                if (step > 1) {
                    const lastX = padding + width;
                    const lastDateStr = dataPoints[dataPoints.length - 1].date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                    ctx.fillText(lastDateStr, lastX, rect.height - 10);
                }
            }
            
            canvas._pointPositions = pointPositions;
            canvas._dpr = dpr;
            }; 
            
            if (!document.querySelector('.flavortown-graph-tooltip')) {
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
                    const tooltip = document.querySelector('.flavortown-graph-tooltip');
                    const pointPositions = canvas._pointPositions;
                    if (!pointPositions || !tooltip) return;
                    
                    const rect = canvas.getBoundingClientRect();
                   
                    const mouseX = e.clientX - rect.left;
                    const mouseY = e.clientY - rect.top;

                    let closestPoint = null;
                    let closestDist = Infinity;
                    pointPositions.forEach(p => {
                        const dist = Math.sqrt((p.x - mouseX) ** 2 + (p.y - mouseY) ** 2);
                        if (dist < closestDist && dist < 50) {
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

                        let tooltipX = closestPoint.x + 15;
                        const tooltipWidth = 220;
                        if (tooltipX + tooltipWidth > rect.width) {
                            tooltipX = closestPoint.x - tooltipWidth - 15;
                        }
                        tooltip.style.left = `${tooltipX}px`;
                        tooltip.style.top = `${closestPoint.y - 20}px`;
                    } else {
                        tooltip.style.display = 'none';
                    }
                });

                canvas.addEventListener('mouseleave', () => {
                    const tooltip = document.querySelector('.flavortown-graph-tooltip');
                    if (tooltip) tooltip.style.display = 'none';
                });
            }
            
            drawGraph();
            
            document.addEventListener('flavortown-theme-changed', () => {
                setTimeout(drawGraph, 150);
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

        card.addEventListener('dblclick', (e) => {
            const isInteractive = e.target.closest('button, a, input, textarea, .flavortown-doomscroll__comment-form, .flavortown-doomscroll__actions');
            if (isInteractive) return;
            if (!likeBtn) return;
            if (likeBtn.classList.contains('is-liked')) return;
            likeBtn.click();
        });

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
        votesRotationChecked = false;
        window.__flavortownRepoSuggestNew = false;
        window.__flavortownRepoSuggestShow = false;
        window.__flavortownRepoSuggestEdit = false;
        window.__flavortownDemoSuggestNew = false;
        window.__flavortownDemoSuggestShow = false;
        window.__flavortownLinkSuggestShow = false;
        window.__flavortownLinkSuggestNew = false;
        sessionStorage.removeItem(VOTES_SKIP_TRIGGER_KEY);
        lastPathname = window.location.pathname;
    }
    sessionStorage.removeItem(VOTES_SKIP_TRIGGER_KEY);
    addDevlogFrequencyStat();
    addVotesDevlogFrequencyStat();
    ensureShipStatsReady();
    addShipStats();
    addShipPayoutStats();
    addProjectShowCookieStat();
    inlineDevlogForm();
    setupInlineDevlogEditing();
    enhanceShopGoals();
    runShopOrdersSync();
    initShopAccessories();
    addShopCardEfficiency();
    addExploreSearch();
    captureApiKey();
    initProjectBoardStats();
    addSkipButton();
    enhanceKitchenDashboard();
    setTimeout(enhanceLeaderboardPage, 0);
    enhanceCommentEmojiInputs();
    watchCommentEmojiInputs();
    cleanupUnownedUnshippedCache();
    addDoomscrollMode();
    addAdminViewButton();
    addSidebarItems();
    enhanceAchievementsPage();
    initShotsEditor();
    enhanceAdminPage();
    initVotesFeature();
    initProjectRepoSuggestions();
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

    const imageFiles = _shotsOriginalFiles.filter(f => f.type.startsWith('image/'));

    if (imageFiles.length >= 2) {
        showImageSelectionUI(imageFiles, (selectedImages) => {
            proceedWithShotsModal(selectedImages, imageUrl);
        });
        return;
    }
    
    proceedWithShotsModal([{ file: imageFiles[0] || null, url: imageUrl }], imageUrl);
}

function showImageSelectionUI(imageFiles, onComplete) {
    const selectionOverlay = document.createElement('div');
    selectionOverlay.className = 'flavortown-image-selection';
    selectionOverlay.style.cssText = `
        position: fixed;
        top: 0; left: 0; right: 0; bottom: 0;
        background: rgba(139, 119, 101, 0.85);
        backdrop-filter: blur(8px);
        z-index: 999999;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 20px;
        animation: fadeIn 0.2s ease-out;
    `;
    
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        .flavortown-image-selection .image-option:hover { transform: translateY(-3px); box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2); }
        .flavortown-image-selection .layout-btn:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15); }
        .flavortown-image-selection .cancel-btn:hover { background: #c9a88a !important; }
        .flavortown-image-selection .proceed-btn:not(:disabled):hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(90, 130, 70, 0.3); }
    `;
    document.head.appendChild(style);
    
    let selectedImages = [];
    let layoutMode = 'single';
    
    const content = document.createElement('div');
    content.className = 'flavortown-screenshot-modal';
    content.style.cssText = `
        background: linear-gradient(145deg, #f5e6d3 0%, #ece0d1 100%);
        border: 3px solid #a94442;
        border-radius: 16px;
        padding: 0;
        max-width: 600px;
        width: 90%;
        color: #4a3728;
        box-shadow: 0 16px 48px rgba(0, 0, 0, 0.25);
        animation: slideUp 0.25s ease-out;
        overflow: hidden;
    `;
    
    const renderUI = () => {
        content.innerHTML = `
            <div style="
                background: linear-gradient(135deg, #a94442 0%, #8b3533 100%);
                padding: 14px 20px;
                display: flex;
                align-items: center;
                gap: 10px;
            ">
                <span style="font-size: 1.3em;">🎨</span>
                <div>
                    <h2 style="margin: 0; font-size: 1.1em; font-weight: 700; color: #fff;">Style Your Screenshots</h2>
                    <p style="margin: 2px 0 0; font-size: 0.75em; color: rgba(255,255,255,0.75);">Pick your layout</p>
                </div>
            </div>
            
            <div style="padding: 24px 28px 28px;">
                <div style="display: flex; gap: 14px; margin-bottom: 24px;">
                    <button class="layout-btn" data-layout="single" style="
                        flex: 1; padding: 12px 10px; border-radius: 10px; cursor: pointer;
                        background: ${layoutMode === 'single' ? 'linear-gradient(135deg, #7a9e5a 0%, #6b8f4a 100%)' : '#e8dcc8'};
                        border: 2px solid ${layoutMode === 'single' ? '#5a7e3a' : '#d4c4a8'};
                        color: ${layoutMode === 'single' ? '#fff' : '#5a4a3a'};
                        font-weight: 600; font-size: 0.9em;
                        transition: all 0.2s ease;
                        display: flex; flex-direction: column; align-items: center; gap: 4px;
                    ">
                        <span style="font-size: 1.4em;">📷</span>
                        <span>Single</span>
                    </button>
                    <button class="layout-btn" data-layout="dual" style="
                        flex: 1; padding: 12px 10px; border-radius: 10px; cursor: pointer;
                        background: ${layoutMode === 'dual' ? 'linear-gradient(135deg, #7a9e5a 0%, #6b8f4a 100%)' : '#e8dcc8'};
                        border: 2px solid ${layoutMode === 'dual' ? '#5a7e3a' : '#d4c4a8'};
                        color: ${layoutMode === 'dual' ? '#fff' : '#5a4a3a'};
                        font-weight: 600; font-size: 0.9em;
                        transition: all 0.2s ease;
                        display: flex; flex-direction: column; align-items: center; gap: 4px;
                    ">
                        <span style="font-size: 1.4em;">📷📷</span>
                        <span>Two-Panel</span>
                    </button>
                </div>
                
            <div class="image-grid" style="
                display: grid; 
                grid-template-columns: repeat(auto-fill, minmax(130px, 1fr)); 
                gap: 12px; 
                margin-bottom: 28px;
                max-height: 400px;
                overflow-y: auto;
                padding: 4px;
            ">
                ${imageFiles.map((file, i) => {
                    const isSelected = selectedImages.some(s => s.index === i);
                    const selOrder = selectedImages.findIndex(s => s.index === i) + 1;
                    return `
                        <div class="image-option" data-index="${i}" style="
                            position: relative; 
                            aspect-ratio: 1; 
                            border-radius: 8px; 
                            overflow: hidden;
                            cursor: pointer; 
                            border: 3px solid ${isSelected ? '#7a9e5a' : '#d4c4a8'};
                            transition: all 0.2s ease;
                            box-shadow: ${isSelected ? '0 3px 12px rgba(90, 130, 70, 0.3)' : '0 2px 6px rgba(0,0,0,0.1)'};
                            background: #fff;
                        ">
                            <img src="${URL.createObjectURL(file)}" style="width: 100%; height: 100%; object-fit: cover;">
                            ${isSelected ? `
                                <div style="
                                    position: absolute; top: 4px; right: 4px;
                                    background: linear-gradient(135deg, #7a9e5a 0%, #5a7e3a 100%);
                                    color: white; width: 22px; height: 22px;
                                    border-radius: 50%; display: flex; align-items: center; justify-content: center;
                                    font-weight: bold; font-size: 0.8em;
                                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
                                    border: 2px solid #fff;
                                ">${selOrder}</div>
                                <div style="
                                    position: absolute; inset: 0;
                                    background: rgba(90, 130, 70, 0.1);
                                    pointer-events: none;
                                "></div>
                            ` : ''}
                        </div>
                    `;
                }).join('')}
            </div>
            
            <div style="display: flex; gap: 10px;">
                <button class="cancel-btn" style="
                    flex: 1; padding: 12px; border-radius: 8px; cursor: pointer;
                    background: #e0d4c0; 
                    border: 2px solid #c9b89a; 
                    color: #5a4a3a; font-weight: 600; font-size: 0.9em;
                    transition: all 0.2s ease;
                ">Cancel</button>
                <button class="proceed-btn" style="
                    flex: 1; padding: 12px; border-radius: 8px; cursor: pointer;
                    background: ${selectedImages.length >= (layoutMode === 'single' ? 1 : 2) ? 'linear-gradient(135deg, #7a9e5a 0%, #5a8649 100%)' : '#c9b89a'};
                    border: 2px solid ${selectedImages.length >= (layoutMode === 'single' ? 1 : 2) ? '#4a6e3a' : '#b0a090'}; 
                    color: ${selectedImages.length >= (layoutMode === 'single' ? 1 : 2) ? '#fff' : '#8a7a6a'};
                    font-weight: 600; font-size: 0.9em;
                    transition: all 0.2s ease;
                " ${selectedImages.length < (layoutMode === 'single' ? 1 : 2) ? 'disabled' : ''}>
                    Continue →
                </button>
            </div>
            </div>
        `;
        
        content.querySelectorAll('.layout-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                layoutMode = btn.dataset.layout;
                selectedImages = [];
                renderUI();
            });
        });
        
        content.querySelectorAll('.image-option').forEach(opt => {
            opt.addEventListener('click', () => {
                const idx = parseInt(opt.dataset.index);
                const existingIdx = selectedImages.findIndex(s => s.index === idx);
                
                if (existingIdx !== -1) {
                    selectedImages.splice(existingIdx, 1);
                } else if (layoutMode === 'single') {
                    selectedImages = [{ index: idx, file: imageFiles[idx] }];
                } else if (selectedImages.length < 2) {
                    selectedImages.push({ index: idx, file: imageFiles[idx] });
                }
                renderUI();
            });
        });
        
        content.querySelector('.cancel-btn').addEventListener('click', () => {
            selectionOverlay.remove();
        });
        
        content.querySelector('.proceed-btn').addEventListener('click', () => {
            if (selectedImages.length >= (layoutMode === 'single' ? 1 : 2)) {
                selectionOverlay.remove();
                const result = selectedImages.map(s => ({
                    file: s.file,
                    url: URL.createObjectURL(s.file)
                }));
                onComplete(result);
            }
        });
    };
    
    renderUI();
    selectionOverlay.appendChild(content);
    document.body.appendChild(selectionOverlay);
}

function proceedWithShotsModal(selectedImages, originalImageUrl) {
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
    
    const imageUrl = selectedImages[0]?.url || originalImageUrl;
    const secondImageUrl = selectedImages[1]?.url || null;

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

                            if (selectedImages && selectedImages.length > 0) {
                                _shotsOriginalFiles.forEach(originalFile => {
                                    const isSelected = selectedImages.some(selected => 
                                        selected.file === originalFile || 
                                        (selected.file && originalFile && selected.file.name === originalFile.name && selected.file.size === originalFile.size)
                                    );
                                    if (!isSelected) {
                                        dt.items.add(originalFile);
                                    }
                                });
                            } else {
                                for (let i = 0; i < _shotsOriginalFiles.length; i++) {
                                    if (i === _shotsStyledFileIndex) continue;
                                    dt.items.add(_shotsOriginalFiles[i]);
                                }
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
                    const newDt = new DataTransfer();
                    
                    if (selectedImages && selectedImages.length > 0) {
                        _shotsOriginalFiles.forEach(originalFile => {
                            const isSelected = selectedImages.some(selected => 
                                selected.file === originalFile || 
                                (selected.file && originalFile && selected.file.name === originalFile.name && selected.file.size === originalFile.size)
                            );
                            if (!isSelected) {
                                newDt.items.add(originalFile);
                            }
                        });
                    }
                    
                    newDt.items.add(file);
                    
                    fileInput.files = newDt.files;

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
                    
                    let secondImageDataUrl = null;
                    if (secondImageUrl) {
                        try {
                            const resp2 = await fetch(secondImageUrl);
                            const blob2 = await resp2.blob();
                            secondImageDataUrl = await new Promise(resolve => {
                                const r2 = new FileReader();
                                r2.onload = () => resolve(r2.result);
                                r2.readAsDataURL(blob2);
                            });
                        } catch (e) {
                            console.error('[Flavortown] Failed to load second image:', e);
                        }
                    }

                    browserAPI.runtime.sendMessage({
                        type: 'INJECT_SHOTS_HELPER',
                        tabId: await getCurrentTabId(),
                        imageDataUrl: imageDataUrl,
                        secondImageDataUrl: secondImageDataUrl
                    }, (response) => {
                        if (response?.success) {
                            const instructions = header.querySelector('p');
                            if (instructions) {
                                const msg = secondImageDataUrl 
                                    ? '✓ Images loaded! Style them → click the green 📋 copy button!'
                                    : '✓ Image loaded! Style it → click the green 📋 copy button!';
                                instructions.innerHTML = `<strong style="color: #10b981;">${msg}</strong>`;
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

function enhanceAdminPage() {
    if (!window.location.pathname.startsWith('/admin')) return;
    if (document.querySelector('.flavortown-admin-enhanced')) return;
    document.body.classList.add('flavortown-admin-enhanced');

    const h1Elements = document.querySelectorAll('h1');
    h1Elements.forEach(h1 => {
        if (h1.textContent.includes('Fraud Dept')) {
            try {
                localStorage.setItem('flavortown-fraud', 'true');
            } catch (e) {}
        }
    });

    document.querySelectorAll('.card').forEach(card => {
        const h2 = card.querySelector('h2');
        if (h2 && h2.textContent.includes('Shop Orders Summary')) {
            const viewAllDetails = card.querySelector('details');
            if (viewAllDetails) {
                const summary = viewAllDetails.querySelector('summary');
                if (summary && summary.textContent.includes('View All Orders')) {
                    viewAllDetails.remove();
                }
            }
        }
    });

    let buttonsCard = null;
    let shopItemCard = null;
    let auditLogCard = null;
    let internalNotesCard = null;

    document.querySelectorAll('.card').forEach(card => {
        const h2 = card.querySelector('h2');
        if (h2) {
            if (h2.textContent.includes('Buttons')) {
                buttonsCard = card;
            } else if (h2.textContent.includes('shop item')) {
                shopItemCard = card;
            }
        }
        const summary = card.querySelector('details summary');
        if (summary) {
            if (summary.textContent.includes('Audit Log')) {
                auditLogCard = card;
            } else if (summary.textContent.includes('Internal Notes')) {
                internalNotesCard = card;
            }
        }
    });

    if (buttonsCard && shopItemCard) {
        const grid = buttonsCard.querySelector('[style*="grid-template-columns"]');
        if (grid) {
            const buttonContainer = document.createElement('div');
            buttonContainer.className = 'flavortown-admin-buttons';
            buttonContainer.style.cssText = `
                display: flex;
                flex-wrap: wrap;
                gap: 8px;
                margin-top: 1rem;
                padding-top: 1rem;
                border-top: 1px solid #e5e7eb;
                align-items: stretch;
            `;

            const directChildren = Array.from(grid.children);
            directChildren.forEach(el => {
                if (el.tagName === 'DIALOG') return;
                
                const buttonStyle = 'width: auto; padding: 8px 16px; height: 100%; min-height: 36px; display: inline-flex; align-items: center; justify-content: center; box-sizing: border-box; margin: 0;';
                
                if (el.tagName === 'FORM') {
                    const clonedForm = el.cloneNode(true);
                    clonedForm.querySelectorAll('dialog').forEach(d => d.remove());
                    clonedForm.style.cssText = 'display: flex; width: auto; margin: 0; align-items: stretch;';
                    const btn = clonedForm.querySelector('button, input[type="submit"]');
                    if (btn) {
                        btn.style.cssText = buttonStyle;
                    }
                    buttonContainer.appendChild(clonedForm);
                } else if (el.tagName === 'A') {
                    const clonedLink = el.cloneNode(true);
                    clonedLink.style.cssText = buttonStyle;
                    buttonContainer.appendChild(clonedLink);
                } else if (el.tagName === 'BUTTON') {
                    const clonedBtn = el.cloneNode(true);
                    clonedBtn.style.cssText = buttonStyle;
                    buttonContainer.appendChild(clonedBtn);
                }
            });

            const dialog = grid.querySelector('dialog');
            if (dialog) {
                document.body.appendChild(dialog);
            }

            shopItemCard.appendChild(buttonContainer);
            buttonsCard.remove();
        }
    }

    if (auditLogCard && internalNotesCard && auditLogCard !== internalNotesCard) {
        auditLogCard.after(internalNotesCard);
    }
    const detailsElements = document.querySelectorAll('.card details');
    detailsElements.forEach(details => {
        const summary = details.querySelector('summary');
        
        if (summary && !summary.textContent.includes('Internal Notes')) {
            details.setAttribute('open', '');
        }
        
        if (summary) {
            summary.style.fontSize = '1rem';
            summary.style.fontWeight = '600';
            summary.style.padding = '0.5rem 0';
            summary.style.color = 'var(--color-brown, #374151)';
        }
    });

    document.querySelectorAll('.card').forEach(card => {
        const h2 = card.querySelector('h2');
        if (h2 && h2.textContent.includes('Fulfillment Information')) {
            const infoRows = card.querySelector('.info-rows');
            if (infoRows && infoRows.children.length === 0) {
                card.remove();
            }
        }
    });

    if (window.location.pathname === '/admin') {
        enhanceAdminDashboard();
    }
    
    if (window.location.pathname.match(/\/admin\/users\/\d+/)) {
        enhanceAdminUserPage();
    }
}

function enhanceAdminUserPage() {
    const flexContainer = document.querySelector('.flex');
    if (flexContainer) {
        flexContainer.style.cssText = 'display: flex; flex-wrap: wrap; gap: 1rem; align-items: stretch;';
        
        flexContainer.querySelectorAll('.card').forEach(card => {
            const h2 = card.querySelector('h2');
            if (h2) {
                h2.style.cssText = 'font-size: 0.9rem; margin-bottom: 0.5rem;';
                
                if (h2.textContent.includes('actions')) {
                    card.style.cssText += 'padding: 0.75rem; flex: 2; min-width: 350px;';
                } else {
                    card.style.cssText += 'padding: 0.75rem; flex: 1; min-width: 180px; max-width: 250px;';
                }
            }
        });
    }
    
    const actionHistoryCard = Array.from(document.querySelectorAll('.card')).find(card => {
        const h2 = card.querySelector('h2');
        return h2 && h2.textContent.includes('Action History');
    });
    
    if (actionHistoryCard) {
        actionHistoryCard.style.maxWidth = '100%';
        
        const table = actionHistoryCard.querySelector('table');
        if (table) {
            table.style.fontSize = '1rem';
            table.querySelectorAll('th, td').forEach(cell => {
                cell.style.padding = '0.5rem 1rem';
            });

            const rows = table.querySelectorAll('tbody tr');
            rows.forEach(row => {
                const cells = row.querySelectorAll('td');
                if (cells.length >= 3) {
                    const changesCell = cells[2];
                    
                    changesCell.querySelectorAll('div').forEach(div => {
                        const text = div.textContent;
                        
                        if (text.includes('Tutorial Steps Completed:')) {
                            const match = text.match(/\[([^\]]+)\]\s*→\s*\[([^\]]+)\]/);
                            if (match) {
                                const oldSteps = match[1].split(',').map(s => s.trim().replace(/"/g, ''));
                                const newSteps = match[2].split(',').map(s => s.trim().replace(/"/g, ''));
                                const addedSteps = newSteps.filter(s => !oldSteps.includes(s));
                                
                                if (addedSteps.length > 0) {
                                    const humanSteps = addedSteps.map(s => s.replace(/_/g, ' ')).join(', ');
                                    div.innerHTML = `<strong>Completed:</strong> ${humanSteps}`;
                                }
                            }
                        }
                        
                        if (text.includes('Updated At:')) {
                            div.style.display = 'none';
                        }
                        
                        if (text.includes('Has Gotten Free Stickers:')) {
                            div.innerHTML = '<strong>Got free stickers</strong>';
                        }
                    });
                }
            });
        }
    }
    
    const shopOrdersDetails = Array.from(document.querySelectorAll('.card details')).find(d => {
        const summary = d.querySelector('summary');
        return summary && summary.textContent.includes('Shop Orders');
    });
    
    if (shopOrdersDetails) {
        const shopRows = shopOrdersDetails.querySelectorAll('tbody tr');
        if (shopRows.length > 3) {
            shopOrdersDetails.removeAttribute('open');
        }
    }

    let currentBalance = 0;
    const basicInfoCard = Array.from(document.querySelectorAll('.card')).find(card => {
        const h2 = card.querySelector('h2');
        return h2 && h2.textContent.toLowerCase().includes('basic info');
    });

    if (basicInfoCard) {
        const balanceMatch = basicInfoCard.textContent.match(/Balance:\s*(\d+)/i);
        if (balanceMatch) {
            currentBalance = parseInt(balanceMatch[1], 10);
        }
    }

    let achievementCredits = 0;
    if (actionHistoryCard) {
        const rows = actionHistoryCard.querySelectorAll('tbody tr');
        rows.forEach(row => {
            const text = row.textContent;
            if (text.toLowerCase().includes('achievement')) {
                const ticketMatch = text.match(/\+(\d+)\s*tickets/i);
                if (ticketMatch) {
                    achievementCredits += parseInt(ticketMatch[1], 10);
                } else {
                    const balanceChange = text.match(/Balance:\s*(\d+)\s*→\s*(\d+)/);
                    if (balanceChange) {
                        const diff = parseInt(balanceChange[2], 10) - parseInt(balanceChange[1], 10);
                        if (diff > 0) achievementCredits += diff;
                    }
                }
            }
        });
    }

    const deductableBalance = Math.max(0, currentBalance - achievementCredits);

    const deductionCard = document.createElement('div');
    deductionCard.className = 'card';
    deductionCard.style.cssText = 'padding: 0.75rem; flex: 1; min-width: 250px; max-width: 300px; border-left: 4px solid var(--color-yellow, #f59e0b); display: flex; flex-direction: column; justify-content: center;';
    deductionCard.innerHTML = `
        <h2 style="font-size: 0.9rem; margin-bottom: 0.5rem; display: flex; align-items: center; gap: 0.5rem;">
            Deduction Calculator
        </h2>
        <div style="display: flex; flex-direction: column; gap: 0.25rem; font-size: 0.9rem;">
            <div style="display: flex; justify-content: space-between;">
                <span>Total Balance:</span>
                <span class="font-mono">${currentBalance}</span>
            </div>
            <div style="display: flex; justify-content: space-between; color: var(--color-gray-dark, #666);">
                <span>Achievement Credits:</span>
                <span class="font-mono">-${achievementCredits}</span>
            </div>
            <div style="display: flex; justify-content: space-between; border-top: 1px dashed #ddd; padding-top: 4px; margin-top: 2px;">
                <span style="font-weight: 500;">Deductable Balance:</span>
                <span class="font-mono" style="font-weight: 600;">${deductableBalance}</span>
            </div>
            <div style="display: flex; align-items: center; justify-content: space-between; margin-top: 8px;">
                <span>Deduction Rate (%):</span>
                <input type="number" id="deduction-rate" value="30" min="0" max="100" style="width: 60px; padding: 4px; border: 1px solid #ddd; border-radius: 4px; text-align: right;">
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center; background: rgba(0,0,0,0.03); padding: 6px; border-radius: 4px; margin-top: 4px;">
                <span style="font-weight: 600;">Deduction:</span>
                <span id="deduction-amount" style="font-weight: 700; color: #d97706;">0</span>
            </div>
        </div>
    `;

    const rateInput = deductionCard.querySelector('#deduction-rate');
    const amountDisplay = deductionCard.querySelector('#deduction-amount');

    const updateCalc = () => {
        const rate = parseFloat(rateInput.value) || 0;
        const deduction = Math.round(deductableBalance * (rate / 100));
        amountDisplay.textContent = -deduction;
    };

    rateInput.addEventListener('input', updateCalc);
    rateInput.addEventListener('change', updateCalc);
    updateCalc();

    if (flexContainer) {
        flexContainer.appendChild(deductionCard);
    }
}

function enhanceAdminDashboard() {
    const isFraudDept = localStorage.getItem('flavortown-fraud') === 'true';
    
    if (document.querySelector('.flavortown-admin-dashboard')) return;

    if (isFraudDept) {
        document.querySelectorAll('.button-grid a.btn-primary').forEach(btn => {
            const text = btn.textContent.trim();
            if (text.includes('Help bot') || text.includes('Ship Cert Dashboard')) {
                btn.remove();
            }
        });
    }

    const h2Elements = document.querySelectorAll('h2');
    let tasksH2 = null;
    h2Elements.forEach(h2 => {
        if (h2.textContent.trim() === 'tasks') {
            tasksH2 = h2;
        }
    });

    if (!tasksH2) return;

    const dashboard = document.createElement('div');
    dashboard.className = 'flavortown-admin-dashboard';
    dashboard.style.cssText = `
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        gap: 1rem;
        margin-top: 1.5rem;
        margin-bottom: 2rem;
    `;

    dashboard.innerHTML = `
        <div class="card flavortown-dashboard-card" style="padding: 1rem;">
            <h3 style="color: #a855f7; font-size: 1rem; margin-bottom: 0.75rem;">📊 Quick Stats</h3>
            <div class="flavortown-stats-content" style="font-size: 0.875rem; line-height: 1.8;">
                <div style="color: #6b7280;">Loading...</div>
            </div>
        </div>
        <div class="card flavortown-dashboard-card" style="padding: 1rem;">
            <h3 style="color: #ef4444; font-size: 1rem; margin-bottom: 0.75rem;">🚨 Top Reported Users</h3>
            <div class="flavortown-reports-users" style="font-size: 0.875rem; line-height: 1.8;">
                <div style="color: #6b7280;">Loading...</div>
            </div>
        </div>
        <div class="card flavortown-dashboard-card" style="padding: 1rem;">
            <h3 style="color: #f59e0b; font-size: 1rem; margin-bottom: 0.75rem;">📁 Top Reported Projects</h3>
            <div class="flavortown-reports-projects" style="font-size: 0.875rem; line-height: 1.8;">
                <div style="color: #6b7280;">Loading...</div>
            </div>
        </div>
        <div class="card flavortown-dashboard-card" style="padding: 1rem;">
            <h3 style="color: #10b981; font-size: 1rem; margin-bottom: 0.75rem;">📦 Shop Order Rates</h3>
            <div class="flavortown-shop-rates" style="font-size: 0.875rem; line-height: 1.8;">
                <div style="color: #6b7280;">Loading...</div>
            </div>
        </div>
    `;

    tasksH2.before(dashboard);
    
    const dashboardsH2 = Array.from(document.querySelectorAll('h2')).find(h2 => h2.textContent.trim() === 'dashboards');
    if (dashboardsH2) {
        const dashboardsButtonGrid = dashboardsH2.nextElementSibling;
        const oldestSection = document.createElement('div');
        oldestSection.className = 'flavortown-oldest-section';
        oldestSection.style.cssText = 'display: flex; gap: 1rem; margin-top: 1.5rem;';
        oldestSection.innerHTML = `
            <div class="card flavortown-dashboard-card" style="padding: 1rem; flex: 1;">
                <h3 style="color: #f97316; font-size: 1rem; margin-bottom: 0.75rem;">⏳ Oldest Pending Reports</h3>
                <div class="flavortown-oldest-reports" style="font-size: 0.875rem; line-height: 1.6;">
                    <div style="color: #6b7280;">Loading...</div>
                </div>
            </div>
            <div class="card flavortown-dashboard-card" style="padding: 1rem; flex: 1;">
                <h3 style="color: #3b82f6; font-size: 1rem; margin-bottom: 0.75rem;">🛒 Oldest Pending Orders</h3>
                <div class="flavortown-oldest-orders" style="font-size: 0.875rem; line-height: 1.6;">
                    <div style="color: #6b7280;">Loading...</div>
                </div>
            </div>
        `;
        if (dashboardsButtonGrid) {
            dashboardsButtonGrid.after(oldestSection);
        } else {
            dashboardsH2.after(oldestSection);
        }
    }
    
    fetchAdminStats();
    fetchOldestPending();
}

async function fetchOldestPending() {
    try {
        const reportsRes = await fetch('/admin/reports?status=pending', { credentials: 'same-origin' });
        const reportsHtml = await reportsRes.text();
        const reportsDoc = new DOMParser().parseFromString(reportsHtml, 'text/html');
        
        const rows = reportsDoc.querySelectorAll('table tbody tr');
        const oldestReports = [];
        
        const rowsArray = Array.from(rows);
        const oldest = rowsArray.slice(-5).reverse();
        
        oldest.forEach(row => {
            const idCell = row.querySelector('td:nth-child(1)');
            const projectCell = row.querySelector('td:nth-child(2) a');
            const dateCell = row.querySelector('td:nth-child(7)');
            
            const reportId = idCell?.textContent?.trim()?.replace('#', '') || '';
            const project = projectCell?.textContent?.trim() || 'Unknown';
            const date = dateCell?.textContent?.trim()?.split('\n')[0] || '';
            
            if (reportId) {
                oldestReports.push({ id: reportId, project, date });
            }
        });
        
        const reportsCard = document.querySelector('.flavortown-oldest-reports');
        if (reportsCard) {
            if (oldestReports.length === 0) {
                reportsCard.innerHTML = '<span style="color: #10b981;">✓ No pending reports</span>';
            } else {
                reportsCard.innerHTML = oldestReports.map(r => `
                    <div style="display: flex; justify-content: space-between; padding: 4px 0; border-bottom: 1px solid #f3f4f6;">
                        <a href="/admin/reports/${r.id}" style="color: #3b82f6; text-decoration: none; max-width: 160px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${r.project}</a>
                        <span style="color: #9ca3af; font-size: 0.8rem;">${r.date}</span>
                    </div>
                `).join('');
            }
        }
    } catch (e) {
        console.error('Oldest reports error:', e);
    }
    
    try {
        const ordersRes = await fetch('/admin/shop_orders?view=shop_orders', { credentials: 'same-origin' });
        const ordersHtml = await ordersRes.text();
        const ordersDoc = new DOMParser().parseFromString(ordersHtml, 'text/html');
        
        const ordersTable = ordersDoc.querySelector('table.table-data');
        const ordersRows = ordersTable ? ordersTable.querySelectorAll('tbody tr') : [];
        const oldestOrders = [];
        
        const rowsArray = Array.from(ordersRows);
        const oldest = rowsArray.slice(-5).reverse();
        
        oldest.forEach(row => {
            const idCell = row.querySelector('td:nth-child(1)');
            const itemCell = row.querySelector('td:nth-child(3)');
            const dateCell = row.querySelector('td:nth-child(7)');
            
            const orderId = idCell?.textContent?.trim() || '';
            const item = itemCell?.textContent?.trim()?.split('\n')[0] || 'Order';
            const date = dateCell?.textContent?.trim()?.split('\n')[0] || '';
            
            if (orderId && orderId.startsWith('#')) {
                const orderNum = orderId.replace('#', '');
                oldestOrders.push({ id: orderId, orderNum, item, date });
            }
        });
        
        const ordersCard = document.querySelector('.flavortown-oldest-orders');
        if (ordersCard) {
            if (oldestOrders.length === 0) {
                ordersCard.innerHTML = '<span style="color: #10b981;">✓ No pending orders</span>';
            } else {
                ordersCard.innerHTML = oldestOrders.map(o => `
                    <div style="display: flex; justify-content: space-between; padding: 4px 0; border-bottom: 1px solid #f3f4f6;">
                        <a href="/admin/shop_orders/${o.orderNum}" style="color: #3b82f6; text-decoration: none; max-width: 160px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="${o.id}">${o.item}</a>
                        <span style="color: #9ca3af; font-size: 0.8rem;">${o.date}</span>
                    </div>
                `).join('');
            }
        }
    } catch (e) {
        console.error('Oldest orders error:', e);
    }
    
    fetchShopOrderRates();
}

async function fetchShopOrderRates() {
    try {
        const ratesPanel = document.querySelector('.flavortown-shop-rates');
        if (!ratesPanel) return;
        
        const statuses = [
            { key: 'pending', url: '/admin/shop_orders?view=shop_orders' },
            { key: 'fulfilled', url: '/admin/shop_orders?status=fulfilled&view=shop_orders' },
            { key: 'awaiting', url: '/admin/shop_orders?status=awaiting_periodical_fulfillment&view=shop_orders' },
            { key: 'rejected', url: '/admin/shop_orders?status=rejected&view=shop_orders' },
            { key: 'hold', url: '/admin/shop_orders?status=on_hold&view=shop_orders' }
        ];
        
        const counts = {};
        
        for (const s of statuses) {
            try {
                const res = await fetch(s.url, { credentials: 'same-origin' });
                const html = await res.text();
                const doc = new DOMParser().parseFromString(html, 'text/html');
                
                const ordersTable = doc.querySelector('table.table-data');
                if (ordersTable) {
                    const rows = ordersTable.querySelectorAll('tbody tr');
                    counts[s.key] = rows.length;
                } else {
                    counts[s.key] = 0;
                }
            } catch (e) {
                counts[s.key] = 0;
            }
        }
        
        const approved = counts.fulfilled + counts.awaiting;
        const total = counts.pending + approved + counts.rejected + counts.hold;
        
        const approvalRate = total > 0 ? Math.round((approved / total) * 100) : 0;
        const rejectionRate = total > 0 ? Math.round((counts.rejected / total) * 100) : 0;
        const holdRate = total > 0 ? Math.round((counts.hold / total) * 100) : 0;
        const pendingRate = total > 0 ? Math.round((counts.pending / total) * 100) : 0;
        
        ratesPanel.innerHTML = `
            <div style="display: flex; justify-content: space-between; padding: 4px 0; border-bottom: 1px solid #f3f4f6;">
                <span>✅ Approved:</span>
                <strong style="color: #10b981;">${approvalRate}% (${approved})</strong>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 4px 0; border-bottom: 1px solid #f3f4f6;">
                <span>❌ Rejected:</span>
                <strong style="color: #ef4444;">${rejectionRate}% (${counts.rejected})</strong>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 4px 0; border-bottom: 1px solid #f3f4f6;">
                <span>⏸️ On Hold:</span>
                <strong style="color: #f59e0b;">${holdRate}% (${counts.hold})</strong>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 4px 0;">
                <span>⏳ Pending:</span>
                <strong style="color: #6b7280;">${pendingRate}% (${counts.pending})</strong>
            </div>
        `;
    } catch (e) {
        console.error('Shop rates error:', e);
    }
}

async function fetchAdminStats() {
    try {
        const reportsRes = await fetch('/admin/reports', { credentials: 'same-origin' });
        const reportsHtml = await reportsRes.text();
        const reportsDoc = new DOMParser().parseFromString(reportsHtml, 'text/html');

        const reportRows = reportsDoc.querySelectorAll('table tbody tr');
        const projectReports = {};
        
        reportRows.forEach(row => {
            const projectLink = row.querySelector('td:nth-child(2) a');
            if (projectLink) {
                const href = projectLink.getAttribute('href') || '';
                const projectId = href.match(/\/projects\/(\d+)/)?.[1];
                const projectName = projectLink.textContent.trim();
                if (projectId) {
                    if (!projectReports[projectId]) {
                        projectReports[projectId] = { name: projectName, count: 0 };
                    }
                    projectReports[projectId].count++;
                }
            }
        });

        const topProjects = Object.entries(projectReports)
            .sort((a, b) => b[1].count - a[1].count)
            .slice(0, 5);

        const projectsToFetch = Object.entries(projectReports)
            .sort((a, b) => b[1].count - a[1].count)
            .slice(0, 10);
        
        const userReports = {};
        const usersContent = document.querySelector('.flavortown-reports-users');
        if (usersContent) {
            usersContent.innerHTML = '<div style="color: #6b7280;">Fetching user data...</div>';
        }

        for (const [projectId, projectData] of projectsToFetch) {
            try {
                const projectRes = await fetch(`/admin/projects/${projectId}`, { credentials: 'same-origin' });
                const projectHtml = await projectRes.text();
                const projectDoc = new DOMParser().parseFromString(projectHtml, 'text/html');
                
                const membersCard = Array.from(projectDoc.querySelectorAll('.card')).find(card => {
                    const h2 = card.querySelector('h2');
                    return h2 && h2.textContent.includes('Members');
                });
                
                if (membersCard) {
                    const memberLinks = membersCard.querySelectorAll('a[href*="/admin/users/"]');
                    memberLinks.forEach(link => {
                        const href = link.getAttribute('href') || '';
                        const userId = href.match(/\/users\/(\d+)/)?.[1];
                        const userName = link.textContent.trim();
                        if (userId) {
                            if (!userReports[userId]) {
                                userReports[userId] = { name: userName, count: 0, projects: [] };
                            }
                            userReports[userId].count += projectData.count;
                            if (!userReports[userId].projects.includes(projectData.name)) {
                                userReports[userId].projects.push(projectData.name);
                            }
                        }
                    });
                }
            } catch (e) {
                console.error('Failed to fetch project', projectId, e);
            }
        }

        const topUsers = Object.entries(userReports)
            .sort((a, b) => b[1].count - a[1].count)
            .slice(0, 5);

        const shopOrdersBtn = document.querySelector('a[href*="shop_orders"] span');
        const pendingOrders = shopOrdersBtn ? shopOrdersBtn.textContent.trim() : '0';

        const reportsBtn = document.querySelector('a[href*="reports"] span');
        const reportsCount = reportsBtn ? reportsBtn.textContent.trim() : '0';

        const statsContent = document.querySelector('.flavortown-stats-content');
        if (statsContent) {
            statsContent.innerHTML = `
                <div style="display: flex; justify-content: space-between; padding: 4px 0; border-bottom: 1px solid #f3f4f6;">
                    <span>🛒 Pending Orders:</span>
                    <strong style="color: #10b981;">${pendingOrders}</strong>
                </div>
                <div style="display: flex; justify-content: space-between; padding: 4px 0; border-bottom: 1px solid #f3f4f6;">
                    <span>🚨 Open Reports:</span>
                    <strong style="color: #ef4444;">${reportsCount}</strong>
                </div>
                <div style="display: flex; justify-content: space-between; padding: 4px 0;">
                    <span>📁 Reported Projects:</span>
                    <strong>${Object.keys(projectReports).length}</strong>
                </div>
            `;
        }

        if (usersContent) {
            if (topUsers.length === 0) {
                usersContent.innerHTML = '<div style="color: #10b981;">✓ No reported users</div>';
            } else {
                usersContent.innerHTML = topUsers.map(([id, data]) => `
                    <div style="display: flex; justify-content: space-between; padding: 4px 0; border-bottom: 1px solid #f3f4f6; align-items: center;">
                        <a href="/admin/users/${id}" style="color: #3b82f6; text-decoration: none; max-width: 140px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="${data.projects.join(', ')}">${data.name || 'User #' + id}</a>
                        <span style="background: #fecaca; color: #991b1b; padding: 0 6px; border-radius: 9999px; font-size: 0.75rem;">${data.count} reports</span>
                    </div>
                `).join('');
            }
        }

        const projectsContent = document.querySelector('.flavortown-reports-projects');
        if (projectsContent) {
            if (topProjects.length === 0) {
                projectsContent.innerHTML = '<div style="color: #10b981;">✓ No reported projects</div>';
            } else {
                projectsContent.innerHTML = topProjects.map(([id, data]) => `
                    <div style="display: flex; justify-content: space-between; padding: 4px 0; border-bottom: 1px solid #f3f4f6;">
                        <a href="/admin/projects/${id}" style="color: #3b82f6; text-decoration: none; max-width: 180px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${data.name || 'Project #' + id}</a>
                        <span style="background: #fef3c7; color: #92400e; padding: 0 6px; border-radius: 9999px; font-size: 0.75rem;">${data.count}</span>
                    </div>
                `).join('');
            }
        }
    } catch (e) {
        console.error('Flavortown admin stats error:', e);
        const statsContent = document.querySelector('.flavortown-stats-content');
        if (statsContent) statsContent.innerHTML = '<div style="color: #ef4444;">Failed to load</div>';
    }
}


function setupCommandPalette() {
    if (document.querySelector('.flavortown-cmd-palette')) return;

    const isAdmin = !!document.querySelector('a[href="/admin"], a[href*="/admin"]');
    
    const staticCommands = [
        { id: 'home', label: 'Go to Kitchen', category: 'Navigation', url: '/' },
        { id: 'projects', label: 'My Projects', category: 'Navigation', url: '/projects' },
        { id: 'shop', label: 'Open Shop', category: 'Navigation', url: '/shop' },
        { id: 'explore', label: 'Explore', category: 'Navigation', url: '/explore' },
        { id: 'leaderboard', label: 'Leaderboard', category: 'Navigation', url: '/leaderboard' },
        { id: 'achievements', label: 'My Achievements', category: 'Navigation', url: '/my/achievements' },
        { id: 'profile', label: 'My Profile', category: 'Navigation', url: '/my' },
        { id: 'search-projects', label: 'Search Projects', category: 'Actions', action: 'searchProjects' },
        { id: 'new-project', label: 'New Project', category: 'Actions', url: '/projects/new' },
        { id: 'buffet', label: 'Toggle Buffet Mode', category: 'Actions', action: 'buffet' },
        { id: 'settings', label: 'Open Settings', category: 'Actions', action: 'openSettings' },
        { id: 'api-docs', label: 'API Documentation', category: 'Actions', url: '/api/v1/docs', external: true },
        { id: 'setting-votes', label: 'Toggle: Send Votes to Slack', category: 'Settings', action: 'toggleSetting', settingId: 'send_votes_to_slack' },
        { id: 'setting-leaderboard', label: 'Toggle: Leaderboard Opt-in', category: 'Settings', action: 'toggleSetting', settingId: 'leaderboard_optin' },
        { id: 'setting-balance', label: 'Toggle: Balance Notifications', category: 'Settings', action: 'toggleSetting', settingId: 'slack_balance_notifications' },
        { id: 'setting-effects', label: 'Toggle: Special Effects', category: 'Settings', action: 'toggleSetting', settingId: 'special_effects_enabled' },
        { id: 'theme-default', label: 'Theme: Default', category: 'Themes', action: 'theme', theme: 'default' },
        { id: 'theme-catppuccin', label: 'Theme: Catppuccin', category: 'Themes', action: 'theme', theme: 'catppuccin' },
        { id: 'theme-sea', label: 'Theme: Sea', category: 'Themes', action: 'theme', theme: 'sea' },
        { id: 'theme-overcooked', label: 'Theme: Overcooked', category: 'Themes', action: 'theme', theme: 'overcooked' },
        { id: 'accent-mauve', label: 'Catppuccin: Mauve Accent', category: 'Themes', action: 'setAccent', accent: 'mauve' },
        { id: 'accent-lavender', label: 'Catppuccin: Lavender Accent', category: 'Themes', action: 'setAccent', accent: 'lavender' },
    ];
    
    if (isAdmin) {
        staticCommands.push(
            { id: 'admin', label: 'Admin Dashboard', category: 'Admin', url: '/admin' },
            { id: 'admin-reports', label: 'Admin: Pending Reports', category: 'Admin', url: '/admin/reports' },
            { id: 'admin-orders', label: 'Admin: Shop Orders', category: 'Admin', url: '/admin/shop_orders' },
            { id: 'admin-users', label: 'Admin: Search Users', category: 'Admin', url: '/admin/users' },
        );
    }

    let allCommands = [...staticCommands];
    let selectedIndex = 0;
    let filteredCommands = [];
    let projectsLoaded = false;

    function getRecentCommands() {
        try {
            return JSON.parse(localStorage.getItem('flavortown_cmd_recent') || '[]');
        } catch { return []; }
    }

    function saveRecentCommand(cmdId) {
        let recent = getRecentCommands();
        recent = recent.filter(id => id !== cmdId);
        recent.unshift(cmdId);
        recent = recent.slice(0, 5);
        localStorage.setItem('flavortown_cmd_recent', JSON.stringify(recent));
    }

    const overlay = document.createElement('div');
    overlay.className = 'flavortown-cmd-palette';
    overlay.innerHTML = `
        <div class="flavortown-cmd-modal">
            <div class="flavortown-cmd-input-wrapper">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                <input type="text" class="flavortown-cmd-input" placeholder="Type a command..." autofocus />
                <kbd class="flavortown-cmd-hint">ESC</kbd>
            </div>
            <div class="flavortown-cmd-results"></div>
            <div class="flavortown-cmd-footer">
                <span>↑↓ Navigate</span>
                <span>↵ Select</span>
                <span>ESC Close</span>
            </div>
        </div>
    `;
    document.body.appendChild(overlay);

    const input = overlay.querySelector('.flavortown-cmd-input');
    const results = overlay.querySelector('.flavortown-cmd-results');

    function fuzzyMatch(text, query) {
        const lowerText = text.toLowerCase();
        const lowerQuery = query.toLowerCase();
        return lowerQuery.split('').every(char => lowerText.includes(char)) && lowerText.includes(lowerQuery.charAt(0));
    }

    function render() {
        const query = input.value.trim();
        const recent = getRecentCommands();

        if (!query) {
            const recentCmds = recent.map(id => allCommands.find(c => c.id === id)).filter(Boolean);
            const otherCmds = allCommands.filter(c => !recent.includes(c.id));
            filteredCommands = [...recentCmds, ...otherCmds];
        } else {
            filteredCommands = allCommands.filter(cmd => 
                fuzzyMatch(cmd.label, query) || fuzzyMatch(cmd.category, query)
            );
        }

        if (selectedIndex >= filteredCommands.length) selectedIndex = Math.max(0, filteredCommands.length - 1);

        let html = '';
        let lastCategory = '';

        filteredCommands.forEach((cmd, i) => {
            const isRecent = !query && recent.includes(cmd.id) && i < recent.length;
            const cat = isRecent ? 'Recent' : cmd.category;
            
            if (cat !== lastCategory) {
                html += `<div class="flavortown-cmd-category">${cat}</div>`;
                lastCategory = cat;
            }

            html += `
                <div class="flavortown-cmd-item ${i === selectedIndex ? 'active' : ''}" data-index="${i}">
                    <span class="flavortown-cmd-label">${cmd.label}</span>
                    ${cmd.shortcut ? `<kbd class="flavortown-cmd-shortcut">${cmd.shortcut}</kbd>` : ''}
                </div>
            `;
        });

        results.innerHTML = html || '<div class="flavortown-cmd-empty">No commands found</div>';

        const activeEl = results.querySelector('.flavortown-cmd-item.active');
        if (activeEl) activeEl.scrollIntoView({ block: 'nearest' });
    }

    function executeCommand(cmd) {
        if (!cmd) return;
        saveRecentCommand(cmd.id);
        closePalette();

        if (cmd.url) {
            if (cmd.action === 'devlog' && cmd.projectId) {
                window.location.href = `/projects/${cmd.projectId}#devlog`;
                sessionStorage.setItem('flavortown_focus_devlog', 'true');
            } else {
                if (window.__flavortownTutorial?.isActive) {
                    const t = window.__flavortownTutorial;
                    const currentStep = t.steps[t.currentStep];

                    if (currentStep?.interactive === 'open-command-palette') {
                        const nextStepIndex = t.currentStep + 1;
                        if (nextStepIndex < t.steps.length) {
                            const nextStep = t.steps[nextStepIndex];
                            const targetHighlight = nextStep?.afterNavTarget || nextStep?.target || null;
                            saveTutorialState(t.currentPhase, nextStepIndex, targetHighlight, true, nextStep.id, t.stepOrder || t.steps.map(s => s.id));
                        }
                    } else {
                        const targetHighlight = currentStep?.afterNavTarget || currentStep?.target || null;
                        saveTutorialState(t.currentPhase, t.currentStep, targetHighlight, true, currentStep?.id, t.stepOrder || t.steps.map(s => s.id));
                    }
                    sessionStorage.setItem('flavortown_tutorial_resume', JSON.stringify({
                        phase: t.currentPhase,
                        step: t.currentStep
                    }));
                }
                window.location.href = cmd.url;
            }
        } else if (cmd.action === 'theme' && cmd.theme) {
            browserAPI.storage.sync.set({ theme: cmd.theme }, () => {
                browserAPI.storage.sync.get(['catppuccinAccent'], (result) => {
                    applyTheme(cmd.theme, {}, result.catppuccinAccent || 'mauve');
                });
            });
        } else if (cmd.action === 'setAccent' && cmd.accent) {
            browserAPI.storage.sync.set({ catppuccinAccent: cmd.accent }, () => {
                browserAPI.storage.sync.get(['theme'], (result) => {
                    if (result.theme === 'catppuccin') {
                        applyTheme('catppuccin', {}, cmd.accent);
                    }
                });
                const toast = document.createElement('div');
                toast.style.cssText = 'position:fixed;bottom:20px;right:20px;background:#cba6f7;color:#1e1e2e;padding:12px 20px;border-radius:8px;font-weight:600;z-index:999999';
                toast.textContent = `Catppuccin accent: ${cmd.accent}`;
                if (cmd.accent === 'lavender') {
                    toast.style.background = '#b4befe';
                }
                document.body.appendChild(toast);
                setTimeout(() => toast.remove(), 2000);
            });
        } else if (cmd.action === 'buffet') {
            if (!window.location.pathname.startsWith('/explore')) {
                sessionStorage.setItem('flavortown_toggle_buffet', 'true');
                window.location.href = '/explore';
            } else {
                const buffetBtn = document.querySelector('.flavortown-doomscroll-toggle');
                if (buffetBtn) buffetBtn.click();
            }
        } else if (cmd.action === 'openSettings') {
            const settingsModal = document.getElementById('settings-modal');
            if (settingsModal) {
                settingsModal.showModal();
            }
        } else if (cmd.action === 'toggleSetting' && cmd.settingId) {
            const csrfToken = document.querySelector('meta[name="csrf-token"]')?.content || 
                              document.querySelector('input[name="authenticity_token"]')?.value;
            
            const checkbox = document.getElementById(cmd.settingId);
            const newValue = checkbox ? !checkbox.checked : true;
            
            const formData = new FormData();
            formData.append('_method', 'patch');
            formData.append(cmd.settingId, newValue ? '1' : '0');
            
            fetch('/my/settings', {
                method: 'POST',
                headers: {
                    'X-CSRF-Token': csrfToken,
                },
                body: formData,
                credentials: 'same-origin'
            }).then(res => {
                if (res.ok) {
                    const toast = document.createElement('div');
                    toast.style.cssText = 'position:fixed;bottom:20px;right:20px;background:#4ade80;color:#15803d;padding:12px 20px;border-radius:8px;font-weight:600;z-index:999999;animation:fadeOut 2s forwards';
                    toast.textContent = `${cmd.label.replace('Toggle: ', '')} ${newValue ? 'enabled' : 'disabled'}`;
                    document.body.appendChild(toast);
                    setTimeout(() => toast.remove(), 2000);
                    if (checkbox) checkbox.checked = newValue;
                }
            });
        } else if (cmd.action === 'searchProjects') {
            if (window.location.pathname !== '/explore') {
                sessionStorage.setItem('flavortown_focus_search', 'true');
                window.location.href = '/explore';
            } else {
                const searchInput = document.querySelector('.flavortown-search-container input, .flavortown-search-input');
                if (searchInput) searchInput.focus();
            }
        }
    }

    function openPalette() {
        overlay.classList.add('open');
        input.value = '';
        selectedIndex = 0;
        loadProjects();
        render();
        setTimeout(() => input.focus(), 50);
    }

    function closePalette() {
        overlay.classList.remove('open');
        input.value = '';
    }

    async function loadProjects() {
        if (projectsLoaded) return;
        projectsLoaded = true;

        try {
            const res = await fetch('/projects', { credentials: 'same-origin' });
            if (!res.ok) return;
            const html = await res.text();
            const doc = new DOMParser().parseFromString(html, 'text/html');
            
            const projectCards = doc.querySelectorAll('.project-card[id^="project_"]');
            const projects = [];
            
            projectCards.forEach(card => {
                const cardId = card.getAttribute('id');
                const idMatch = cardId.match(/project_(\d+)/);
                if (!idMatch) return;
                
                const id = idMatch[1];
                const titleLink = card.querySelector('.project-card__title-link');
                const title = titleLink ? titleLink.textContent.trim() : `Project #${id}`;
                
                projects.push({ id, title });
            });
            
            if (projects.length > 0) {
                const projectCmds = projects.slice(0, 10).flatMap(p => [
                    { id: `proj-${p.id}`, label: `Go to "${p.title}"`, category: 'Your Projects', url: `/projects/${p.id}` },
                    { id: `devlog-${p.id}`, label: `New Devlog on "${p.title}"`, category: 'Your Projects', url: `/projects/${p.id}`, action: 'devlog', projectId: p.id },
                ]);
                allCommands = [...staticCommands, ...projectCmds];
                render();
            }
        } catch (e) {
            console.error('Command palette: Failed to load projects', e);
        }
    }

    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) closePalette();
        const item = e.target.closest('.flavortown-cmd-item');
        if (item) {
            const idx = parseInt(item.dataset.index);
            executeCommand(filteredCommands[idx]);
        }
    });

    input.addEventListener('input', () => {
        selectedIndex = 0;
        render();
    });

    input.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            selectedIndex = Math.min(selectedIndex + 1, filteredCommands.length - 1);
            render();
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            selectedIndex = Math.max(selectedIndex - 1, 0);
            render();
        } else if (e.key === 'Enter') {
            e.preventDefault();
            executeCommand(filteredCommands[selectedIndex]);
        } else if (e.key === 'Escape') {
            closePalette();
        }
    });

    document.addEventListener('keydown', (e) => {
        if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
            e.preventDefault();
            if (overlay.classList.contains('open')) {
                closePalette();
            } else {
                openPalette();
            }
        }
        if (e.key === 'Escape' && overlay.classList.contains('open')) {
            closePalette();
        }
    });
}

if (sessionStorage.getItem('flavortown_focus_devlog') === 'true') {
    sessionStorage.removeItem('flavortown_focus_devlog');
    
    let attempts = 0;
    const maxAttempts = 20; 
    
    const pollForDevlogForm = () => {
        const devlogForm = document.querySelector('.flavortown-inline-form');
        if (devlogForm) {
            devlogForm.scrollIntoView({ behavior: 'smooth', block: 'center' });
            const textarea = devlogForm.querySelector('textarea');
            if (textarea) {
                setTimeout(() => textarea.focus(), 300);
            }
        } else if (attempts < maxAttempts) {
            attempts++;
            setTimeout(pollForDevlogForm, 250);
        }
    };
    
    setTimeout(pollForDevlogForm, 500);
}

if (sessionStorage.getItem('flavortown_toggle_buffet') === 'true') {
    sessionStorage.removeItem('flavortown_toggle_buffet');
    
    let attempts = 0;
    const maxAttempts = 20;
    
    const pollForBuffet = () => {
        const buffetBtn = document.querySelector('.flavortown-doomscroll-toggle');
        if (buffetBtn) {
            buffetBtn.click();
        } else if (attempts < maxAttempts) {
            attempts++;
            setTimeout(pollForBuffet, 250);
        }
    };
    
    setTimeout(pollForBuffet, 500);
}

if (sessionStorage.getItem('flavortown_focus_search') === 'true') {
    sessionStorage.removeItem('flavortown_focus_search');
    
    let attempts = 0;
    const maxAttempts = 20;
    
    const pollForSearch = () => {
        const searchInput = document.querySelector('.flavortown-search-container input, .flavortown-search-input');
        if (searchInput) {
            searchInput.focus();
        } else if (attempts < maxAttempts) {
            attempts++;
            setTimeout(pollForSearch, 250);
        }
    };
    
    setTimeout(pollForSearch, 500);
}

setupCommandPalette();


const VOTES_JSON_URL = 'https://raw.githubusercontent.com/hridaya423/flavortownutils/refs/heads/main/data/votes.json';
const LEADERBOARD_FEED_URL = 'https://raw.githubusercontent.com/hridaya423/flavortownutils/refs/heads/main/data/lbfeed.json';
const SLACK_EMOJI_MARKDOWN_SIZE = 30;

async function fetchVotesData() {
    try {
        const response = await fetch(VOTES_JSON_URL);
        if (!response.ok) return null;
        return await response.json();
    } catch (e) {
        console.error('Failed to fetch votes data:', e);
        return null;
    }
}

var slackEmojiMap = null;
var slackEmojiIndex = [];
var slackEmojiPromise = null;

async function fetchSlackEmojiMap() {
    if (slackEmojiMap) return slackEmojiMap;
    if (slackEmojiPromise) return slackEmojiPromise;

    const emojiUrl = SLACK_EMOJI_URL;
    slackEmojiPromise = fetchEmojiListViaBackground(emojiUrl)
        .then(data => {
            if (!data) {
                slackEmojiMap = {};
                slackEmojiIndex = [];
                return slackEmojiMap;
            }

            let map = {};
            if (Array.isArray(data)) {
                map = buildEmojiMapFromCachet(data);
            } else if (data && typeof data === 'object') {
                const emojiData = data.emoji || data;
                if (emojiData && typeof emojiData === 'object' && !Array.isArray(emojiData)) {
                    Object.keys(emojiData).forEach(name => {
                        const entry = emojiData[name];
                        const url = typeof entry === 'string' ? entry : entry?.url;
                        if (!url || !url.startsWith('http')) return;
                        map[name] = {
                            url,
                            animated: typeof entry === 'object' ? !!entry.animated : url.toLowerCase().endsWith('.gif'),
                        };
                    });
                }
            }

            slackEmojiMap = map;
            slackEmojiIndex = Object.keys(map).sort();
            return slackEmojiMap;
        })
        .catch(e => {
            console.error('Failed to fetch slack emojis:', e);
            slackEmojiMap = {};
            slackEmojiIndex = [];
            return slackEmojiMap;
        })
        .finally(() => {
            slackEmojiPromise = null;
        });

    return slackEmojiPromise;
}

function fetchEmojiListViaBackground(url) {
    return new Promise((resolve, reject) => {
        try {
            browserAPI.runtime.sendMessage({ type: 'FETCH_EMOJI_LIST', url }, (response) => {
                const err = browserAPI.runtime.lastError;
                if (err) {
                    reject(err);
                    return;
                }
                if (!response || !response.ok) {
                    reject(new Error(response?.error || 'Failed to fetch emojis'));
                    return;
                }
                resolve(response.data);
            });
        } catch (error) {
            reject(error);
        }
    });
}

function buildEmojiMapFromCachet(list) {
    const entries = new Map();

    list.forEach(item => {
        if (!item || !item.name) return;
        entries.set(item.name, {
            url: item.imageUrl || '',
            alias: item.alias || ''
        });
    });

    const resolved = {};

    const resolveUrl = (name, visited = new Set()) => {
        if (!name || visited.has(name)) return '';
        visited.add(name);
        const entry = entries.get(name);
        if (!entry) return '';
        if (entry.url && entry.url.startsWith('http')) return entry.url;
        if (entry.alias) {
            const aliasName = entry.alias
                .replace(/^alias:/i, '')
                .replace(/^:/, '')
                .replace(/:$/, '')
                .trim();
            if (!aliasName || aliasName === name) return '';
            return resolveUrl(aliasName, visited);
        }
        return '';
    };

    entries.forEach((_, name) => {
        const url = resolveUrl(name);
        if (!url) return;
        resolved[name] = {
            url,
            animated: url.toLowerCase().endsWith('.gif')
        };
    });

    return resolved;
}

function getEmojiQuery(text, cursor) {
    if (!text || cursor === null || cursor === undefined) return null;
    const before = text.slice(0, cursor);
    const match = before.match(/:([a-z0-9_+\-]{1,40})$/i);
    if (!match) return null;

    const token = `:${match[1]}`;
    const start = before.lastIndexOf(token);
    if (start < 0) return null;
    return {
        start,
        end: cursor,
        query: match[1].toLowerCase(),
    };
}

function getEmojiMatches(query) {
    if (!query) return [];
    const startsWith = [];
    const includes = [];
    const maxResults = 10;

    for (const name of slackEmojiIndex) {
        if (startsWith.length >= maxResults) break;
        if (name.startsWith(query)) startsWith.push(name);
    }

    if (startsWith.length < maxResults) {
        for (const name of slackEmojiIndex) {
            if (startsWith.length + includes.length >= maxResults) break;
            if (startsWith.includes(name)) continue;
            if (name.includes(query)) includes.push(name);
        }
    }

    return startsWith.concat(includes).slice(0, maxResults);
}

function replaceEmojiTokensWithImages(text) {
    if (!text || !slackEmojiMap || !Object.keys(slackEmojiMap).length) return text;

    return text.replace(/:([a-z0-9_+\-]{1,40}):/gi, (match, name) => {
        const entry = slackEmojiMap[name];
        if (!entry || !entry.url) return match;
        const safeName = name.replace(/"/g, '');
        const proxyUrl = buildEmojiProxyUrl(entry.url);
        return `![${safeName}](${proxyUrl})`;
    });
}

function initSlackEmojiAutocomplete(textarea, container) {
    if (!textarea || textarea.dataset.flavortownEmojiInit === 'true') return;
    textarea.dataset.flavortownEmojiInit = 'true';

    const anchor = textarea.closest('.input') || container || textarea.parentElement;
    if (!anchor) return;

    if (getComputedStyle(anchor).position === 'static') {
        anchor.style.position = 'relative';
    }

    const dropdown = document.createElement('div');
    dropdown.className = 'flavortown-emoji-suggest';
    dropdown.style.display = 'none';
    const list = document.createElement('div');
    list.className = 'flavortown-emoji-suggest__list';
    dropdown.appendChild(list);
    document.body.appendChild(dropdown);

    let isOpen = false;
    let activeQuery = null;
    let matches = [];
    let selectedIndex = 0;

    const closeDropdown = () => {
        dropdown.style.display = 'none';
        dropdown.setAttribute('aria-hidden', 'true');
        isOpen = false;
        activeQuery = null;
        matches = [];
        selectedIndex = 0;
    };

    const positionDropdown = () => {
        if (!isOpen) return;
        const rect = textarea.getBoundingClientRect();
        const padding = 12;
        const maxWidth = Math.min(rect.width, window.innerWidth - padding * 2);
        let left = rect.left;
        let top = rect.bottom + 8;
        dropdown.style.width = `${maxWidth}px`;

        const dropdownHeight = dropdown.offsetHeight || 240;
        if (left + maxWidth > window.innerWidth - padding) {
            left = Math.max(padding, window.innerWidth - padding - maxWidth);
        }
        if (top + dropdownHeight > window.innerHeight - padding) {
            top = Math.max(padding, rect.top - dropdownHeight - 8);
        }

        dropdown.style.left = `${left}px`;
        dropdown.style.top = `${top}px`;
    };

    const renderDropdown = () => {
        list.innerHTML = '';
        if (!matches.length) {
            closeDropdown();
            return;
        }

        matches.forEach((name, index) => {
            const entry = slackEmojiMap[name];
            if (!entry) return;
            const item = document.createElement('button');
            item.type = 'button';
            item.className = `flavortown-emoji-suggest__item${index === selectedIndex ? ' is-selected' : ''}`;
            item.dataset.name = name;
            item.innerHTML = `
                <img class="flavortown-emoji-suggest__img" src="${entry.url}" alt=":${name}:" />
                <span class="flavortown-emoji-suggest__name">:${name}:</span>
            `;
            item.addEventListener('mousedown', (event) => {
                event.preventDefault();
                insertEmoji(name);
            });
            list.appendChild(item);
        });

        dropdown.style.display = 'block';
        dropdown.removeAttribute('aria-hidden');
        isOpen = true;
        positionDropdown();
    };

    const insertEmoji = (name) => {
        if (!activeQuery) return;
        const value = textarea.value;
        const before = value.slice(0, activeQuery.start);
        const after = value.slice(activeQuery.end);
        const insertText = `:${name}: `;
        textarea.value = `${before}${insertText}${after}`;
        const cursor = before.length + insertText.length;
        textarea.selectionStart = cursor;
        textarea.selectionEnd = cursor;
        textarea.dispatchEvent(new Event('input', { bubbles: true }));
        closeDropdown();
        textarea.focus();
    };

    const updateSuggestions = () => {
        if (!slackEmojiMap || !slackEmojiIndex.length) {
            closeDropdown();
            return;
        }
        const queryInfo = getEmojiQuery(textarea.value, textarea.selectionStart);
        if (!queryInfo || !queryInfo.query) {
            closeDropdown();
            return;
        }

        const nextMatches = getEmojiMatches(queryInfo.query);
        if (!nextMatches.length) {
            closeDropdown();
            return;
        }

        activeQuery = queryInfo;
        matches = nextMatches;
        selectedIndex = 0;
        renderDropdown();
    };

    textarea.addEventListener('input', updateSuggestions);
    textarea.addEventListener('click', updateSuggestions);

    textarea.addEventListener('keydown', (event) => {
        if (!isOpen) return;
        if (event.key === 'ArrowDown') {
            event.preventDefault();
            selectedIndex = (selectedIndex + 1) % matches.length;
            renderDropdown();
        } else if (event.key === 'ArrowUp') {
            event.preventDefault();
            selectedIndex = (selectedIndex - 1 + matches.length) % matches.length;
            renderDropdown();
        } else if (event.key === 'Enter' || event.key === 'Tab') {
            event.preventDefault();
            insertEmoji(matches[selectedIndex]);
        } else if (event.key === 'Escape') {
            event.preventDefault();
            closeDropdown();
        }
    });

    document.addEventListener('click', (event) => {
        if (!anchor.contains(event.target) && !dropdown.contains(event.target)) {
            closeDropdown();
        }
    });

    window.addEventListener('resize', positionDropdown);
    window.addEventListener('scroll', positionDropdown, true);

    fetchSlackEmojiMap().then(() => {
        updateSuggestions();
    });
}

function attachSlackEmojiSubmitHandler(form, textarea) {
    if (!form || !textarea || form.dataset.flavortownEmojiSubmit === 'true') return;
    form.dataset.flavortownEmojiSubmit = 'true';

    form.addEventListener('submit', () => {
        if (!slackEmojiMap || !Object.keys(slackEmojiMap).length) return;
        textarea.value = replaceEmojiTokensWithImages(textarea.value);
    });
}

function enhanceCommentEmojiInputs() {
    const inputs = document.querySelectorAll('.comment-form__input');
    if (!inputs.length) return;

    inputs.forEach(input => {
        initSlackEmojiAutocomplete(input, input.closest('.comment-form') || input.parentElement);
        const form = input.closest('form');
        if (form) {
            attachSlackEmojiSubmitHandler(form, input);
        }
    });
}

let leaderboardFeedCache = null;
let leaderboardFeedPromise = null;
let leaderboardHistoryModal = null;
let leaderboardHistoryLink = null;
let leaderboardHistoryCleanup = null;

async function fetchLeaderboardFeed() {
    if (leaderboardFeedCache) return leaderboardFeedCache;
    if (leaderboardFeedPromise) return leaderboardFeedPromise;

    leaderboardFeedPromise = fetch(LEADERBOARD_FEED_URL)
        .then(response => {
            if (!response.ok) return null;
            return response.json();
        })
        .then(data => {
            leaderboardFeedCache = data && typeof data === 'object' ? data : {};
            return leaderboardFeedCache;
        })
        .catch(e => {
            console.error('Failed to fetch leaderboard feed:', e);
            leaderboardFeedCache = {};
            return leaderboardFeedCache;
        })
        .finally(() => {
            leaderboardFeedPromise = null;
        });

    return leaderboardFeedPromise;
}

function normalizeLeaderboardUserKey(name) {
    return (name || '')
        .replace(/^@/, '')
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '');
}

function parseLeaderboardEntries(rawEntries) {
    if (!Array.isArray(rawEntries)) return [];

    return rawEntries
        .map(entry => {
            if (!entry) return null;
            const ts = entry.ts || entry.timestamp;
            const date = ts ? new Date(ts) : null;
            if (!date || Number.isNaN(date.getTime())) return null;

            const delta = Number(entry.delta);
            const balance = Number(entry.balance);
            if (!Number.isFinite(delta) || !Number.isFinite(balance)) return null;

            const rawReason = entry.reason ?? entry.achievement ?? '';
            const reason = rawReason ? String(rawReason) : '';
            const reasonType = entry.reasonType
                ? String(entry.reasonType)
                : (entry.achievement ? 'achievement' : '');

            return {
                date,
                delta,
                balance,
                reason,
                reasonType,
            };
        })
        .filter(Boolean)
        .sort((a, b) => a.date - b.date);
}

function buildLeaderboardDataPoints(entries) {
    return entries.map(entry => {
        let reasonLabel = 'Balance change';
        if (entry.reason) {
            if (entry.reasonType === 'achievement') {
                reasonLabel = `Achievement: ${entry.reason}`;
            } else {
                reasonLabel = entry.reason;
            }
        }
        return {
            date: entry.date,
            balance: entry.balance,
            reason: reasonLabel,
            amount: entry.delta,
        };
    });
}

function getLeaderboardStats(entries) {
    const totalEarned = entries.reduce((sum, entry) => sum + (entry.delta > 0 ? entry.delta : 0), 0);
    const totalSpent = Math.abs(entries.reduce((sum, entry) => sum + (entry.delta < 0 ? entry.delta : 0), 0));
    const netChange = entries.reduce((sum, entry) => sum + entry.delta, 0);
    const latestEntry = entries.length ? entries[entries.length - 1] : null;
    const recentReason = [...entries].reverse().find(entry => entry.reason);

    return {
        totalEarned,
        totalSpent,
        netChange,
        latestEntry,
        recentReason,
    };
}

function formatSignedValue(value) {
    if (!Number.isFinite(value) || value === 0) return '0';
    return value > 0 ? `+${value}` : `${value}`;
}

function drawLeaderboardGraph(canvas, dataPoints) {
    if (!canvas || !dataPoints || dataPoints.length < 2) return;

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
    const themeStyles = document.getElementById('flavortown-theme');
    const isDarkTheme = !!themeStyles;
    let textColor;
    let gridColor;
    if (isDarkTheme) {
        textColor = '#cdd6f4';
        gridColor = '#45475a';
    } else {
        textColor = styles.getPropertyValue('--color-text-primary')?.trim() || '#333';
        gridColor = styles.getPropertyValue('--color-border')?.trim() || '#e2d8cc';
    }

    const minBalance = Math.min(...dataPoints.map(d => d.balance));
    const maxBalance = Math.max(...dataPoints.map(d => d.balance));
    const balanceRange = maxBalance - minBalance || 1;

    ctx.strokeStyle = gridColor;
    ctx.lineWidth = 1;
    for (let i = 0; i <= 5; i++) {
        const y = padding + (height / 5) * i;
        ctx.beginPath();
        ctx.moveTo(padding, y);
        ctx.lineTo(rect.width - padding, y);
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

    pointPositions.forEach(point => {
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
            const x = padding + (width / (dataPoints.length - 1)) * i;
            const dateStr = dataPoints[i].date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            ctx.fillText(dateStr, x, rect.height - 10);
        }
        if (step > 1) {
            const lastX = padding + width;
            const lastDateStr = dataPoints[dataPoints.length - 1].date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            ctx.fillText(lastDateStr, lastX, rect.height - 10);
        }
    }

    canvas._leaderboardPointPositions = pointPositions;
    canvas._leaderboardDpr = dpr;

    if (!canvas._leaderboardTooltipAttached) {
        const tooltip = document.createElement('div');
        tooltip.className = 'flavortown-leaderboard-graph-tooltip';
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
            const pointPositions = canvas._leaderboardPointPositions;
            if (!pointPositions || !tooltip) return;

            const canvasRect = canvas.getBoundingClientRect();
            const mouseX = e.clientX - canvasRect.left;
            const mouseY = e.clientY - canvasRect.top;

            let closestPoint = null;
            let closestDist = Infinity;
            pointPositions.forEach(p => {
                const dist = Math.sqrt((p.x - mouseX) ** 2 + (p.y - mouseY) ** 2);
                if (dist < closestDist && dist < 50) {
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

                const canvasOffsetX = canvas.offsetLeft || 0;
                const canvasOffsetY = canvas.offsetTop || 0;
                const tooltipWidth = tooltip.offsetWidth || 220;
                let tooltipX = closestPoint.x + canvasOffsetX + 15;
                const parentWidth = canvas.parentNode.clientWidth || canvas.offsetWidth;
                if (tooltipX + tooltipWidth > parentWidth) {
                    tooltipX = closestPoint.x + canvasOffsetX - tooltipWidth - 15;
                }
                if (tooltipX < 8) tooltipX = 8;
                tooltip.style.left = `${tooltipX}px`;
                tooltip.style.top = `${closestPoint.y + canvasOffsetY - 20}px`;
            } else {
                tooltip.style.display = 'none';
            }
        });

        canvas.addEventListener('mouseleave', () => {
            if (tooltip) tooltip.style.display = 'none';
        });

        canvas._leaderboardTooltipAttached = true;
    }
}

function closeLeaderboardHistoryModal() {
    if (leaderboardHistoryCleanup) {
        leaderboardHistoryCleanup();
        leaderboardHistoryCleanup = null;
    }
    if (leaderboardHistoryModal) {
        leaderboardHistoryModal.remove();
        leaderboardHistoryModal = null;
    }
    if (leaderboardHistoryLink) {
        leaderboardHistoryLink.classList.remove('flavortown-leaderboard-user-link--armed');
        leaderboardHistoryLink = null;
    }
    document.body.style.overflow = '';
}

function openLeaderboardHistoryModal({ userName, entries, linkEl, profileUrl }) {
    closeLeaderboardHistoryModal();

    const stats = getLeaderboardStats(entries);
    const lastChange = stats.latestEntry
        ? `${stats.latestEntry.delta >= 0 ? '+' : ''}${stats.latestEntry.delta} on ${stats.latestEntry.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`
        : '';

    const dataPoints = buildLeaderboardDataPoints(entries);

    let graphMarkup = '';
    if (!entries.length) {
        graphMarkup = '<div class="flavortown-leaderboard-empty">No earnings history yet.</div>';
    } else if (dataPoints.length < 2) {
        graphMarkup = '<div class="flavortown-leaderboard-empty">Only one entry so far. Check back after a few more payouts.</div>';
    } else {
        graphMarkup = `
            <div class="flavortown-graph-container">
                <h3>Cookies Over Time</h3>
                <canvas class="flavortown-leaderboard-graph" width="800" height="260"></canvas>
            </div>
        `;
    }

    let reasonMarkup = '';
    if (stats.recentReason?.reason) {
        const reasonLabel = stats.recentReason.reasonType === 'achievement'
            ? 'Latest achievement'
            : 'Latest reason';
        reasonMarkup = `<div class="flavortown-leaderboard-modal__reason">${reasonLabel}: ${stats.recentReason.reason}</div>`;
    }

    const modal = document.createElement('div');
    modal.className = 'flavortown-leaderboard-modal';
    modal.innerHTML = `
        <div class="flavortown-leaderboard-modal__dialog" role="dialog" aria-modal="true" aria-label="${userName} earnings history">
            <button class="flavortown-leaderboard-modal__close" type="button" aria-label="Close">x</button>
            <div class="flavortown-leaderboard-modal__header">
                <div class="flavortown-leaderboard-modal__title">
                    <h2>
                        <a class="flavortown-leaderboard-modal__name" href="${profileUrl || '#'}">${userName}</a>
                    </h2>
                    <p class="flavortown-leaderboard-modal__subtitle">Leaderboard earnings history</p>
                    ${lastChange ? `<p class="flavortown-leaderboard-modal__meta">Last change: ${lastChange}</p>` : ''}
                </div>
            </div>
            <div class="flavortown-leaderboard-modal__stats">
                <div class="flavortown-leaderboard-stat">
                    <span class="flavortown-leaderboard-stat__label">Total Earned</span>
                    <span class="flavortown-leaderboard-stat__value is-positive">${stats.totalEarned ? `+${stats.totalEarned}` : '0'}</span>
                </div>
                <div class="flavortown-leaderboard-stat">
                    <span class="flavortown-leaderboard-stat__label">Total Spent</span>
                    <span class="flavortown-leaderboard-stat__value is-negative">${stats.totalSpent ? `-${stats.totalSpent}` : '0'}</span>
                </div>
                <div class="flavortown-leaderboard-stat">
                    <span class="flavortown-leaderboard-stat__label">Net Change</span>
                    <span class="flavortown-leaderboard-stat__value ${stats.netChange < 0 ? 'is-negative' : stats.netChange > 0 ? 'is-positive' : ''}">${formatSignedValue(stats.netChange)}</span>
                </div>
            </div>
            ${reasonMarkup}
            ${graphMarkup}
        </div>
    `;

    leaderboardHistoryModal = modal;
    leaderboardHistoryLink = linkEl || null;

    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';

    const closeBtn = modal.querySelector('.flavortown-leaderboard-modal__close');
    if (closeBtn) closeBtn.addEventListener('click', closeLeaderboardHistoryModal);

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeLeaderboardHistoryModal();
        }
    });

    modal.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeLeaderboardHistoryModal();
        }
    });

    modal.tabIndex = -1;
    setTimeout(() => modal.focus(), 0);

    if (leaderboardHistoryLink) {
        leaderboardHistoryLink.classList.add('flavortown-leaderboard-user-link--armed');
    }

    const canvas = modal.querySelector('.flavortown-leaderboard-graph');
    if (canvas && dataPoints.length > 1) {
        const draw = () => drawLeaderboardGraph(canvas, dataPoints);
        requestAnimationFrame(draw);

        const onThemeChange = () => setTimeout(draw, 150);
        const onResize = () => draw();
        document.addEventListener('flavortown-theme-changed', onThemeChange);
        window.addEventListener('resize', onResize);

        leaderboardHistoryCleanup = () => {
            document.removeEventListener('flavortown-theme-changed', onThemeChange);
            window.removeEventListener('resize', onResize);
        };
    }
}

async function enhanceLeaderboardPage() {
    if (window.location.pathname !== '/leaderboard') return;

    const userLinks = document.querySelectorAll('.user .content h2 a[href^="/users/"]');
    if (!userLinks.length) return;

    await fetchLeaderboardFeed();

    const feed = leaderboardFeedCache || {};
    const entriesMap = feed.entries || feed;
    const usersMap = feed.users || {};

    userLinks.forEach(link => {
        const userName = link.textContent.trim();
        const userCard = link.closest('.user');
        const avatarSrc = userCard?.querySelector('img')?.getAttribute('src') || '';
        const avatarMatch = avatarSrc.match(/\/users\/([^/]+)\//i);
        const avatarKey = avatarMatch ? avatarMatch[1] : '';
        const userKey = normalizeLeaderboardUserKey(avatarKey || userName);
        const entriesForUser = resolveLeaderboardEntries({ userName, userKey, entriesMap, usersMap });
        updateLeaderboardCardDelta({ userCard, entries: entriesForUser, days: 5 });

        if (link.dataset.flavortownLeaderboardHistory === 'true') return;
        link.dataset.flavortownLeaderboardHistory = 'true';
        link.classList.add('flavortown-leaderboard-user-link');

        link.addEventListener('click', (e) => {
            if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
            if (link.classList.contains('flavortown-leaderboard-user-link--armed')) {
                closeLeaderboardHistoryModal();
                return;
            }

            e.preventDefault();
            const profileUrl = link.getAttribute('href') || '#';
            openLeaderboardHistoryModal({ userName, entries: entriesForUser, linkEl: link, profileUrl });
        });
    });
}

var COMMENT_EMOJI_OBSERVER_KEY = 'flavortownCommentEmojiObserver';
function watchCommentEmojiInputs() {
    if (document.body.dataset[COMMENT_EMOJI_OBSERVER_KEY] === 'true') return;
    document.body.dataset[COMMENT_EMOJI_OBSERVER_KEY] = 'true';

    const observer = new MutationObserver(() => {
        enhanceCommentEmojiInputs();
    });

    observer.observe(document.body, { childList: true, subtree: true });
}

function getRecentDelta(entries, days) {
    if (!Array.isArray(entries) || !entries.length) return 0;
    const now = Date.now();
    const windowMs = (days || 0) * 24 * 60 * 60 * 1000;
    if (!windowMs) return 0;

    return entries
        .filter(entry => entry?.date && (now - entry.date.getTime()) <= windowMs)
        .reduce((sum, entry) => sum + (Number.isFinite(entry.delta) ? entry.delta : 0), 0);
}

function resolveLeaderboardEntries({ userName, userKey, entriesMap, usersMap }) {
    let entries = parseLeaderboardEntries(entriesMap[userKey] || []);

    if (!entries.length && usersMap && userName) {
        const nameKey = normalizeLeaderboardUserKey(userName);
        const matchedUserId = Object.keys(usersMap).find(userId => {
            const user = usersMap[userId] || {};
            const candidates = [user.username, user.displayName, user.realName]
                .filter(Boolean)
                .map(name => normalizeLeaderboardUserKey(name));
            return candidates.includes(nameKey);
        });

        if (matchedUserId) {
            const fallbackKey = normalizeLeaderboardUserKey(matchedUserId);
            entries = parseLeaderboardEntries(entriesMap[fallbackKey] || []);
        }
    }

    return entries;
}

function updateLeaderboardCardDelta({ userCard, entries, days }) {
    if (!userCard || !entries || !entries.length) return;

    const cookiesEl = userCard.querySelector('p');
    if (!cookiesEl) return;

    let baseCount = cookiesEl.dataset.flavortownCookiesCount;
    if (!baseCount) {
        const countMatch = (cookiesEl.textContent || '').match(/([\d,]+)/);
        if (countMatch) {
            baseCount = countMatch[1];
        }
        cookiesEl.dataset.flavortownCookiesCount = baseCount || cookiesEl.textContent.trim();
    }

    const delta = getRecentDelta(entries, days || 5);

    cookiesEl.innerHTML = '';
    const countSpan = document.createElement('span');
    countSpan.className = 'flavortown-leaderboard-cookie-count';
    countSpan.textContent = cookiesEl.dataset.flavortownCookiesCount || '';

    const deltaSpan = document.createElement('span');
    deltaSpan.className = `flavortown-leaderboard-recent-delta ${delta < 0 ? 'is-negative' : delta > 0 ? 'is-positive' : ''}`;
    deltaSpan.textContent = ` (${formatSignedValue(delta)} past 5d)`;

    const iconSpan = document.createElement('span');
    iconSpan.className = 'flavortown-leaderboard-cookie-icon';
    iconSpan.textContent = '🍪';

    cookiesEl.appendChild(countSpan);
    cookiesEl.appendChild(deltaSpan);
    cookiesEl.appendChild(document.createTextNode(' '));
    cookiesEl.appendChild(iconSpan);
}

function getRelativeTime(timestamp) {
    const now = new Date();
    const date = new Date(timestamp);
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
}

function truncateFeedback(text, maxLength = 120) {
    if (!text || text.length <= maxLength) return text || '';
    return text.substring(0, maxLength).trim() + '...';
}

function getCurrentProjectName() {
    const projectHeader = document.querySelector('.project-show__header h1, .project-show-card__title');
    if (projectHeader) return projectHeader.textContent.trim();

    const pageTitle = document.querySelector('h1');
    if (pageTitle) return pageTitle.textContent.trim();

    return null;
}

function parseRelativeTime(relativeStr) {
    if (!relativeStr) return null;
    const now = new Date();
    const str = relativeStr.toLowerCase().trim();

    if (str.includes('just now') || str.includes('moment')) return now;
    if (str === 'today') return now;
    if (str === 'yesterday') return new Date(now.getTime() - 24 * 60 * 60 * 1000);

    const match = str.match(/(\d+)\s*(second|minute|hour|day|week|month|year)s?\s*ago/i);
    if (match) {
        const num = parseInt(match[1]);
        const unit = match[2].toLowerCase();

        const ms = {
            second: 1000,
            minute: 60 * 1000,
            hour: 60 * 60 * 1000,
            day: 24 * 60 * 60 * 1000,
            week: 7 * 24 * 60 * 60 * 1000,
            month: 30 * 24 * 60 * 60 * 1000,
            year: 365 * 24 * 60 * 60 * 1000,
        };

        return new Date(now.getTime() - num * ms[unit]);
    }

    const shortMatch = str.match(/(\d+)\s*(s|sec|secs|second|seconds|m|min|mins|minute|minutes|h|hr|hrs|hour|hours|d|day|days|w|wk|wks|week|weeks|mo|mon|mos|month|months|y|yr|yrs|year|years)\s*ago?/i);
    if (shortMatch) {
        const num = parseInt(shortMatch[1]);
        const unitKey = shortMatch[2].toLowerCase();
        const unitMap = {
            s: 'second',
            sec: 'second',
            secs: 'second',
            second: 'second',
            seconds: 'second',
            m: 'minute',
            min: 'minute',
            mins: 'minute',
            minute: 'minute',
            minutes: 'minute',
            h: 'hour',
            hr: 'hour',
            hrs: 'hour',
            hour: 'hour',
            hours: 'hour',
            d: 'day',
            day: 'day',
            days: 'day',
            w: 'week',
            wk: 'week',
            wks: 'week',
            week: 'week',
            weeks: 'week',
            mo: 'month',
            mon: 'month',
            mos: 'month',
            month: 'month',
            months: 'month',
            y: 'year',
            yr: 'year',
            yrs: 'year',
            year: 'year',
            years: 'year'
        };
        const unit = unitMap[unitKey];
        if (!unit) return null;

        const ms = {
            second: 1000,
            minute: 60 * 1000,
            hour: 60 * 60 * 1000,
            day: 24 * 60 * 60 * 1000,
            week: 7 * 24 * 60 * 60 * 1000,
            month: 30 * 24 * 60 * 60 * 1000,
            year: 365 * 24 * 60 * 60 * 1000,
        };

        return new Date(now.getTime() - num * ms[unit]);
    }

    return parseAbsoluteDateText(relativeStr);
}

function parseAbsoluteDateText(text) {
    if (!text) return null;
    const cleaned = text
        .replace(/\s+/g, ' ')
        .replace(/(\d+)(st|nd|rd|th)/gi, '$1')
        .replace(/\s+at\s+/i, ' ')
        .replace(/\s+·\s+/g, ' ')
        .trim();
    if (!cleaned) return null;
    const date = new Date(cleaned);
    if (!isNaN(date.getTime())) return date;

    const isoMatch = cleaned.match(/(\d{4})[\/\-](\d{1,2})[\/\-](\d{1,2})(?:\s+(\d{1,2})(?::(\d{2}))?\s*(am|pm)?)?/i);
    if (isoMatch) {
        const year = parseInt(isoMatch[1], 10);
        const month = parseInt(isoMatch[2], 10) - 1;
        const day = parseInt(isoMatch[3], 10);
        let hour = isoMatch[4] ? parseInt(isoMatch[4], 10) : 0;
        const minute = isoMatch[5] ? parseInt(isoMatch[5], 10) : 0;
        const meridiem = isoMatch[6] ? isoMatch[6].toLowerCase() : null;
        if (meridiem) {
            if (meridiem === 'pm' && hour < 12) hour += 12;
            if (meridiem === 'am' && hour === 12) hour = 0;
        }
        const isoDate = new Date(year, month, day, hour, minute);
        if (!isNaN(isoDate.getTime())) return isoDate;
    }

    const monthMatch = cleaned.match(/([a-zA-Z]+)\s+(\d{1,2})(?:,)?\s+(\d{4})(?:\s+(\d{1,2})(?::(\d{2}))?\s*(am|pm)?)?/i);
    if (monthMatch) {
        const monthName = monthMatch[1].toLowerCase();
        const monthKey = monthName.startsWith('sept') ? 'sep' : monthName.slice(0, 3);
        const monthMap = {
            jan: 0,
            feb: 1,
            mar: 2,
            apr: 3,
            may: 4,
            jun: 5,
            jul: 6,
            aug: 7,
            sep: 8,
            oct: 9,
            nov: 10,
            dec: 11
        };
        const month = monthMap[monthKey];
        if (month !== undefined) {
            const day = parseInt(monthMatch[2], 10);
            const year = parseInt(monthMatch[3], 10);
            let hour = monthMatch[4] ? parseInt(monthMatch[4], 10) : 0;
            const minute = monthMatch[5] ? parseInt(monthMatch[5], 10) : 0;
            const meridiem = monthMatch[6] ? monthMatch[6].toLowerCase() : null;
            if (meridiem) {
                if (meridiem === 'pm' && hour < 12) hour += 12;
                if (meridiem === 'am' && hour === 12) hour = 0;
            }
            const monthDate = new Date(year, month, day, hour, minute);
            if (!isNaN(monthDate.getTime())) return monthDate;
        }
    }

    return null;
}

function parseDateFromTimeElement(timeEl) {
    if (!timeEl) return null;
    const timeTag = timeEl.matches('time') ? timeEl : timeEl.querySelector('time');
    if (timeTag) {
        const datetime = timeTag.getAttribute('datetime');
        if (datetime) {
            const date = new Date(datetime);
            if (!isNaN(date.getTime())) return date;
        }
    }

    const timestamp = timeEl.getAttribute('data-timestamp') || timeEl.dataset?.timestamp;
    if (timestamp) {
        const parsedTs = parseInt(timestamp, 10);
        if (!isNaN(parsedTs)) {
            const normalizedTs = parsedTs < 1000000000000 ? parsedTs * 1000 : parsedTs;
            const date = new Date(normalizedTs);
            if (!isNaN(date.getTime())) return date;
        }
    }

    const text = timeEl.textContent.trim();
    return parseRelativeTime(text);
}

function parseDateFromCell(cell) {
    if (!cell) return null;
    const timeTag = cell.querySelector('time');
    if (timeTag) {
        const date = parseDateFromTimeElement(timeTag);
        if (date) return date;
    }

    const timestamp = cell.getAttribute('data-timestamp') || cell.dataset?.timestamp;
    if (timestamp) {
        const parsedTs = parseInt(timestamp, 10);
        if (!isNaN(parsedTs)) {
            const normalizedTs = parsedTs < 1000000000000 ? parsedTs * 1000 : parsedTs;
            const date = new Date(normalizedTs);
            if (!isNaN(date.getTime())) return date;
        }
    }

    const dateText = cell.textContent.trim();
    return parseRelativeTime(dateText);
}

function clusterVotesToShips(votes, ships) {
    const clustered = new Map();
    ships.forEach(ship => clustered.set(ship, []));

    if (!votes.length || !ships.length) return clustered;

    const validShips = ships.filter(ship => ship.date && !isNaN(ship.date.getTime()));
    const validVotes = votes.filter(vote => vote.timestamp && !isNaN(new Date(vote.timestamp).getTime()));

    if (!validShips.length || !validVotes.length) return clustered;

    const sortedShips = validShips.slice().sort((a, b) => a.date - b.date);
    const sortedVotes = validVotes.slice().sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

    const shipMin = sortedShips[0].date.getTime();
    const shipMax = sortedShips[sortedShips.length - 1].date.getTime();
    const voteMin = new Date(sortedVotes[0].timestamp).getTime();
    const voteMax = new Date(sortedVotes[sortedVotes.length - 1].timestamp).getTime();

    const shipRange = shipMax - shipMin;
    const voteRange = voteMax - voteMin;

    const mappedShips = sortedShips.map((ship, index) => {
        let mappedTime = voteMin;
        if (shipRange > 0) {
            const t = (ship.date.getTime() - shipMin) / shipRange;
            mappedTime = voteMin + (voteRange > 0 ? t * voteRange : 0);
        } else if (sortedShips.length > 1 && voteRange > 0) {
            const step = voteRange / (sortedShips.length - 1);
            mappedTime = voteMin + step * index;
        }
        return { ship, mappedTime };
    });

    validVotes.forEach(vote => {
        const voteTime = new Date(vote.timestamp).getTime();
        let bestShip = null;
        let smallestGap = Infinity;

        mappedShips.forEach(entry => {
            const gap = Math.abs(voteTime - entry.mappedTime);
            if (gap < smallestGap) {
                smallestGap = gap;
                bestShip = entry.ship;
            }
        });

        if (bestShip) {
            clustered.get(bestShip).push(vote);
        }
    });

    return clustered;
}

function createVoteCard(vote, usersMap) {
    const voteCard = document.createElement('div');
    voteCard.style.cssText = `
        padding: 10px 12px;
        background: var(--catppuccin-base, var(--color-cream, rgba(255,255,255,0.5)));
        border: 1px solid var(--catppuccin-surface2, var(--color-brown-light, #c4b5a5));
        border-radius: 8px;
        font-size: 0.9em;
        color: var(--catppuccin-text, var(--color-brown, #5d4e37));
    `;

    const feedbackText = truncateFeedback(vote.feedback);
    const hasMore = vote.feedback && vote.feedback.length > 120;

    const user = usersMap && usersMap[vote.votedBy];
    const voterDisplay = user
        ? `<img src="${user.avatar}" alt="" style="width: 18px; height: 18px; border-radius: 50%; vertical-align: middle;"> ${user.username}`
        : (vote.votedBy && vote.votedBy !== 'Unknown' ? `@${vote.votedBy}` : '');

    voteCard.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
            <span style="color: var(--catppuccin-subtext0, var(--color-brown-light, #8b7355)); font-size: 0.85em;">
                ${getRelativeTime(vote.timestamp)}
            </span>
            ${voterDisplay ? `<span style="font-size: 0.8em; color: var(--catppuccin-subtext1, var(--color-brown-light, #8b7355));">${voterDisplay}</span>` : ''}
        </div>
        <div class="vote-feedback-text" style="line-height: 1.4; color: var(--catppuccin-text, var(--color-brown, #5d4e37));">
            ${feedbackText || '<em style="opacity: 0.6;">No feedback provided</em>'}
        </div>
        ${hasMore ? `<button class="vote-expand-btn" style="
            background: none;
            border: none;
            color: var(--catppuccin-mauve, var(--color-accent, var(--color-brown, #b4854a)));
            cursor: pointer;
            padding: 4px 0 0 0;
            font-size: 0.85em;
        ">Show more</button>` : ''}
    `;

    if (hasMore) {
        const expandBtn = voteCard.querySelector('.vote-expand-btn');
        const feedbackEl = voteCard.querySelector('.vote-feedback-text');
        let expanded = false;
        expandBtn.addEventListener('click', () => {
            expanded = !expanded;
            feedbackEl.textContent = expanded ? vote.feedback : truncateFeedback(vote.feedback);
            expandBtn.textContent = expanded ? 'Show less' : 'Show more';
        });
    }

    return voteCard;
}

function createVotesContainer(votes, usersMap) {
    const votesContainer = document.createElement('div');
    votesContainer.className = 'flavortown-project-votes';
    votesContainer.style.cssText = `
        margin-top: 12px;
        padding: 14px;
        background: var(--catppuccin-surface0, var(--color-cream-dark, #efe6d5));
        border-radius: 10px;
        border-left: 3px solid var(--catppuccin-mauve, var(--color-accent, var(--color-brown, #b4854a)));
        color: var(--catppuccin-text, var(--color-brown, #5d4e37));
    `;

    const header = document.createElement('div');
    header.style.cssText = `
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 10px;
        font-weight: 600;
        font-size: 0.9em;
        color: var(--catppuccin-text, var(--color-brown, #5d4e37));
    `;
    header.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="var(--catppuccin-yellow, var(--color-brown, #d4a857))" style="opacity: 0.9;">
            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
        </svg>
        <span>Community Votes (${votes.length})</span>
    `;
    votesContainer.appendChild(header);

    const votesList = document.createElement('div');
    votesList.style.cssText = 'display: flex; flex-direction: column; gap: 8px;';

    let shownCount = 0;
    const renderNextBatch = () => {
        const nextVotes = votes.slice(shownCount, shownCount + 5);
        nextVotes.forEach(vote => {
            votesList.insertBefore(createVoteCard(vote, usersMap), moreButton);
        });
        shownCount += nextVotes.length;
        updateMoreButton();
    };

    const moreButton = document.createElement('button');
    moreButton.type = 'button';
    moreButton.style.cssText = `
        background: none;
        border: none;
        color: var(--catppuccin-mauve, var(--color-accent, var(--color-brown, #b4854a)));
        cursor: pointer;
        font-size: 0.85em;
        opacity: 0.85;
        text-align: center;
        padding-top: 6px;
    `;
    const updateMoreButton = () => {
        const remaining = votes.length - shownCount;
        if (remaining <= 0) {
            moreButton.remove();
            return;
        }
        const nextCount = Math.min(5, remaining);
        moreButton.textContent = `+ ${remaining} more votes (show ${nextCount})`;
    };
    moreButton.addEventListener('click', renderNextBatch);

    votesList.appendChild(moreButton);
    renderNextBatch();

    votesContainer.appendChild(votesList);
    return votesContainer;
}

async function addProjectVotesDisplay() {
    if (!/\/projects\/\d+$/.test(window.location.pathname)) return;

    const shipPosts = document.querySelectorAll('article.post--ship');
    if (shipPosts.length === 0) return;

    if (document.querySelector('.flavortown-project-votes')) return;

    const projectName = getCurrentProjectName();
    if (!projectName) return;

    const votesData = await fetchVotesData();
    if (!votesData || !votesData.votes || votesData.votes.length === 0) return;

    const projectVotes = votesData.votes.filter(vote =>
        vote.project && projectName &&
        vote.project.toLowerCase().trim() === projectName.toLowerCase().trim()
    );

    if (projectVotes.length === 0) return;

    const ships = [];
    shipPosts.forEach(post => {
        const timeEl = post.querySelector('.post__time');
        const shipStats = post.querySelector('.flavortown-ship-stats');

        if (timeEl) {
            const relativeTime = timeEl.textContent.trim();
            const date = parseDateFromTimeElement(timeEl);

            if (date) {
                ships.push({
                    element: post,
                    statsElement: shipStats,
                    date: date,
                    relativeTime: relativeTime
                });
            }
        }
    });

    if (ships.length === 0) return;

    const clusteredVotes = clusterVotesToShips(projectVotes, ships);

    ships.forEach(ship => {
        const shipVotes = clusteredVotes.get(ship);
        if (!shipVotes || shipVotes.length === 0) return;

        const insertAfter = ship.statsElement || ship.element.querySelector('.post__body');
        if (!insertAfter) return;

        const votesContainer = createVotesContainer(shipVotes, votesData.users);
        insertAfter.parentNode.insertBefore(votesContainer, insertAfter.nextSibling);
    });
}

function addSpeedReaderStyles() {
    if (document.querySelector('#sr-styles')) return;
    const style = document.createElement('style');
    style.id = 'sr-styles';
    style.textContent = `
    .sr-modal-overlay {
        position: fixed;
        inset: 0;
        background: rgba(0,0,0,0.85);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 99999;
    }
    .sr-modal {
        position: relative;
        width: min(90vw, 800px);
        height: min(70vh, 400px);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        color: #eee;
        font-family: 'Inter', system-ui, -apple-system, sans-serif;
        text-align: center;
        gap: 10px;
        --sr-guide-x: 38%;
    }
    .sr-word-box {
        background: rgba(0,0,0,0.9);
        padding: 24px 32px;
        border-radius: 16px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.35);
        min-width: min(80vw, 600px);
        position: relative;
        overflow: hidden;
    }
    .sr-controls {
        font-size: 14px;
        opacity: 0.7;
    }
    .sr-word {
        font-size: clamp(32px, 6vw, 64px);
        font-weight: 600;
        line-height: 1.2;
        color: #eee;
        position: relative;
        width: 100%;
        min-height: 1.2em;
        white-space: nowrap;
    }
    .sr-word-line {
        position: absolute;
        left: 38%;
        top: 0;
        height: 100%;
        width: 2px;
        background: linear-gradient(
            to bottom,
            rgba(255,255,255,0.35) 0%,
            rgba(255,255,255,0.35) 20%,
            transparent 45%,
            transparent 55%,
            rgba(255,255,255,0.35) 80%,
            rgba(255,255,255,0.35) 100%
        );
        transform: translateX(-50%);
        pointer-events: none;
    }
    .sr-word-line::after {
        content: '';
        display: none;
    }
    .sr-word-inner {
        display: inline-block;
        position: absolute;
        left: 0;
        transform: translateX(var(--sr-shift, 0px));
        white-space: nowrap;
        will-change: transform;
    }
    .sr-word-measure {
        position: absolute;
        left: -9999px;
        top: 0;
        visibility: hidden;
        white-space: nowrap;
        font-size: inherit;
        font-weight: inherit;
        font-family: inherit;
        line-height: inherit;
    }
    .sr-word .sr-orp { color: #ff6b6b; font-weight: 700; }
    .sr-status {
        font-size: 14px;
        opacity: 0.8;
    }
    .sr-pre, .sr-post { opacity: 0.85; }
    .sr-modal-overlay { transition: opacity 0.2s ease; }
    .sr-modal-overlay.sr-modal-closing { opacity: 0; }
    .sr-modal-overlay:focus { outline: none; }
    `;
    document.head.appendChild(style);
}

function initVotesFeature() {
    addProjectVotesDisplay();
    initSpeedReaderOnVotesPage();
    addSpeedReaderStyles();
}

document.addEventListener('turbo:load', () => {
    if (window.location.pathname.startsWith('/votes/new')) {
        initSpeedReaderOnVotesPage();
    }
});

const EXTENSION_VERSION = chrome.runtime.getManifest().version;

const THEME_OPTIONS = [
    { id: 'default', name: 'Default', color: '#ec8b33' },
    { id: 'catppuccin', name: 'Catppuccin', color: '#cba6f7' },
    { id: 'sea', name: 'Sea', color: '#7dd3fc' },
    { id: 'overcooked', name: 'Overcooked', color: '#f97316' }
];

let tutorialUserContext = {
    username: null,
    hasProjects: false,
    projectWithShips: null,
    projectForDevlog: null,
    hasVotes: false,
    scanned: false
};

async function scanUserContext() {
    if (tutorialUserContext.scanned) return tutorialUserContext;

    try {
        const profileLink = document.querySelector('a[href^="/users/"], .sidebar__user-name');
        if (profileLink) {
            const href = profileLink.getAttribute('href');
            if (href) {
                tutorialUserContext.username = href.split('/users/')[1]?.split('/')[0];
            } else {
                tutorialUserContext.username = profileLink.textContent?.trim();
            }
        }

        const projectsRes = await fetch('/projects', { credentials: 'same-origin' });
        if (projectsRes.ok) {
            const html = await projectsRes.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            const projectCards = doc.querySelectorAll('.project-card');

            tutorialUserContext.hasProjects = projectCards.length > 0;

            let projectWithTime = null;
            let fallbackProject = null;
            const projectIds = [];

            for (const card of projectCards) {
                const link = card.querySelector('a[href*="/projects/"]');
                if (!link) continue;

                const href = link.getAttribute('href');
                const match = href.match(/\/projects\/(\d+)/);
                if (!match) continue;

                const projectId = match[1];
                const projectName = card.querySelector('.project-card__title-link')?.textContent?.trim() || 'Your Project';
                projectIds.push({ id: projectId, name: projectName, href });

                const stats = card.querySelectorAll('.project-card__stats h5');
                let hasTime = false;
                for (const stat of stats) {
                    const text = stat.textContent.trim();
                    if (text.match(/\d+h/) || (text.match(/\d+m/) && !text.match(/^0m$/))) {
                        hasTime = true;
                        break;
                    }
                }

                if (hasTime && !projectWithTime) {
                    projectWithTime = { id: projectId, name: projectName };
                }
                if (!fallbackProject) {
                    fallbackProject = { id: projectId, name: projectName };
                }

                const shipBadge = card.querySelector('.badge--shipped, .shipped, [class*="ship"]');
                const devlogCount = card.querySelector('[class*="devlog"]');
                if ((shipBadge || devlogCount) && !tutorialUserContext.projectWithShips) {
                    tutorialUserContext.projectWithShips = {
                        id: projectId,
                        url: href,
                        name: projectName
                    };
                }
            }

            tutorialUserContext.projectForDevlog = projectWithTime || fallbackProject;

            if (!tutorialUserContext.projectWithShips && projectIds.length > 0) {
                for (const project of projectIds) {
                    try {
                        const projectRes = await fetch(`/projects/${project.id}`, { credentials: 'same-origin' });
                        if (!projectRes.ok) continue;
                        const projectHtml = await projectRes.text();
                        const projectDoc = parser.parseFromString(projectHtml, 'text/html');
                        const shipPost = projectDoc.querySelector('article.post--ship, .post--ship, .post__ship-title');
                        if (shipPost) {
                            tutorialUserContext.projectWithShips = {
                                id: project.id,
                                url: project.href,
                                name: project.name
                            };
                            break;
                        }
                    } catch (e) {
                        console.warn('Tutorial: Could not scan project for ships', e);
                    }
                }
            }
        }
    } catch (e) {
        console.warn('Tutorial: Could not scan user context', e);
    }

    tutorialUserContext.scanned = true;
    return tutorialUserContext;
}

const TUTORIAL_PHASE_1 = [
    {
        id: 'welcome',
        title: 'Thanks for installing! 🎉',
        description: 'Welcome to Flavortown Utils. Let me give you a quick tour of the cool features! It\'ll only take a minute.',
        target: null,
        position: 'center',
        icon: '👋'
    },
    {
        id: 'themes-demo',
        title: 'Pick a theme',
        description: 'First up, choose a look. Try one below, you can always change it later with Ctrl+Shift+T.',
        target: null,
        position: 'center',
        icon: '🎨',
        interactive: 'theme-picker'
    },
    {
        id: 'command-palette-demo',
        title: 'Quick navigation',
        description: 'Press Ctrl+K anytime to open the command palette. Jump anywhere, change settings, all from your keyboard. Give it a try!',
        target: null,
        position: 'center',
        icon: '⌨️',
        interactive: 'open-command-palette'
    },
    {
        id: 'phase-choice',
        title: 'That\'s the essentials!',
        description: 'Want to see what else Flavortown Utils has to offer? There\'s a lot more.',
        target: null,
        position: 'center',
        icon: '✨',
        isChoice: true
    }
];

const TUTORIAL_PHASE_2 = [
    {
        id: 'inline-devlog',
        title: 'Inline devlog posting',
        description: 'Post devlogs right from your project page, no extra step of clicking a button. Let me show you...',
        afterNavDescription: 'Here you go! Look for the devlog form right here on the project page. Quick and easy.',
        target: null,
        afterNavTarget: '.flavortown-inline-devlog, .post-form, form[action*="devlogs"]',
        position: 'center',
        icon: '📝',
        interactive: 'navigate-project-devlog'
    },
    {
        id: 'inline-devlog-emoji',
        title: 'Slack emojis in devlogs and comments',
        description: 'Try typing a Slack emoji like :yay: to see the autocomplete. You can also use them in comments! ',
        target: '.flavortown-inline-devlog textarea, .post-form textarea, form[action*="devlogs"] textarea',
        position: 'center',
        icon: '😺',
        requiresElement: true,
        allowInteraction: true,
        autoFocusTarget: true
    },
    {
        id: 'vote-stats',
        title: 'Vote stats',
        description: 'If you have a shipped project, we estimate your cookies/hour, percentile, and score from payouts.',
        afterNavDescription: 'These stats are based on your payout rate and show your estimated score.',
        target: null,
        afterNavTarget: '.flavortown-project-cookies-details, .flavortown-project-category-stats',
        position: 'center',
        icon: '⭐',
        interactive: 'navigate-project-vote-stats',
        requiresProjectWithShips: true,
        requiresElement: true
    },
    {
        id: 'shots-integration',
        title: 'Image styling',
        description: 'Built-in shots.so integration for beautifying your devlog images. Look for it when uploading attachments.',
        target: null,
        afterNavTarget: '.flavortown-shots-btn',
        position: 'center',
        icon: '📸',
        interactive: 'navigate-shots'
    },
    {
        id: 'ship-stats',
        title: 'Ship stats',
        description: 'Every ship post now shows detailed stats, time spent, devlog count, and more. Check them out on any project page!',
        target: null,
        position: 'center',
        icon: '📊'
    },
    {
        id: 'kitchen-dashboard',
        title: 'Dashboard graphs',
        description: 'Your home page now shows activity graphs and stats. Let me take you there...',
        afterNavDescription: 'This is your dashboard! Activity graphs show your coding patterns over time.',
        target: null,
        afterNavTarget: '.flavortown-kitchen-dashboard, .flavortown-graph-container',
        position: 'center',
        icon: '📈',
        interactive: 'navigate-dashboard'
    },
    {
        id: 'community-votes',
        title: 'Community votes',
        description: 'See feedback from people who voted on your projects, right on the project page.',
        target: null,
        position: 'center',
        icon: '⭐',
        skip: true
    },
    {
        id: 'shop-time-calc',
        title: 'Personalized pace',
        description: 'See how long it\'ll take to earn an item using your current earning pace.',
        afterNavDescription: 'These lines show your remaining and total time based on your pace.',
        target: null,
        afterNavTarget: '.flavortown-efficiency__hours',
        position: 'center',
        icon: '⏱️',
        interactive: 'navigate-shop-time-calc'
    },
    {
        id: 'shop-accessories',
        title: 'Accessories panel',
        description: 'Bundle upgrades together! Click the accessories button on any item to add extras to your purchase.',
        target: '.shop-item-card__accessories-wrapper',
        afterNavTarget: '.shop-item-card__accessories-wrapper',
        position: 'center',
        icon: '⚙️',
        interactive: 'show-shop-accessories'
    },
    {
        id: 'shop-goals',
        title: 'Goals panel',
        description: 'Save items for later and track your progress. Your wishlist, always visible at the top!',
        target: '.flavortown-goals-enhanced, .shop-goals',
        position: 'center',
        icon: '⭐',
        interactive: 'show-shop-goals'
    },
    {
        id: 'shop-goals-priority',
        title: 'Priority goals',
        description: 'Mark a few items as priority and see their combined progress at a glance.',
        target: '.flavortown-priority-section',
        position: 'center',
        icon: '🎯',
        requiresElement: true
    },
    {
        id: 'shop-goals-progress-mode',
        title: 'Cumulative vs individual',
        description: 'Toggle between cumulative progress and item-by-item progress.',
        target: '.flavortown-progress-toggle__btn[data-kind="stack"]',
        position: 'center',
        icon: '📊',
        requiresElement: true
    },
    {
        id: 'shop-goals-projection',
        title: 'Actual vs projected',
        description: 'Switch between actual progress and projected progress using your pace.',
        target: '.flavortown-progress-toggle__btn[data-kind="projection"]',
        position: 'center',
        icon: '🔮',
        requiresElement: true
    },
    {
        id: 'phase2-choice',
        title: 'Want to see more?',
        description: 'There\'s still a lot more, shop features, image tools, and a few other goodies.',
        target: null,
        position: 'center',
        icon: '📦',
        isChoice: true,
        choicePhase: 3
    }
];

const TUTORIAL_PHASE_3 = [
    {
        id: 'search-projects',
        title: 'Project search',
        description: 'Use the search bar or Ctrl+K to quickly find any project.',
        target: null,
        position: 'center',
        icon: '🔍',
        interactive: 'navigate-project-search'
    },
    {
        id: 'buffet-mode',
        title: 'Buffet mode',
        description: 'Endless devlog browsing. Look for the Buffet button on any project to start scrolling.',
        afterNavDescription: 'Found it! Click this button to enter Buffet mode and scroll through devlogs infinitely.',
        target: null,
        afterNavTarget: '.flavortown-doomscroll-toggle',
        position: 'center',
        icon: '🍱',
        interactive: 'show-buffet-button'
    },
    {
        id: 'auto-achievements',
        title: 'Auto achievements',
        description: 'Achievements get claimed automatically, no more clicking through each one.',
        target: null,
        position: 'center',
        icon: '🏆'
    },
    {
        id: 'done',
        title: 'You\'re all set! 🎉',
        description: 'That\'s most of it! Check the README for more features!. Now go ship something great!',
        target: null,
        position: 'center',
        icon: '🚀',
        isFinal: true
    }
];

const VERSION_FEATURES = {
    '2.2.0': [
        { title: 'Slack emojis in devlogs & comments', description: 'Type :emoji: with autocomplete, and it renders for everyone.', icon: '💬' },
        { title: 'Leaderboard balance history', description: 'Click a user to see their cookie history graph and stats.', icon: '📈' },
        { title: 'Recent balance change on leaderboard', description: 'See the past 5 day change right next to each user.', icon: '🍪' },
        { title: 'Shop goals auto-change', description: 'Orders now reduce goal quantities with a quick toast + animation.', icon: '🛒' },
        { title: 'Syncing settings/data across devices', description: 'Your settings and data are now synced across all devices.', icon: '🔄' },
        { title: 'Tutorial improvements', description: 'Add major new features to the onboarding experience for new users', icon: '💡' }
    ],
    '2.1.0': [
        { title: 'Zero-flash themes', description: 'Themes now preload before paint to avoid the default flash.', icon: '✨' },
        { title: 'Vote estimation', description: 'Estimated overall stars and category medians from payout rates.', icon: '⭐' },
        { title: 'Vote stats', description: 'See cookies/hour multiplier and percentile on projects and ships.', icon: '📊' },
        { title: 'Shop projections', description: 'Projected progress plus time-to-item based on your pace.', icon: '🛒' }
    ],
    '1.9.0': [
        { title: 'Speed reader in votes', description: 'Read devlogs and ships fast.', icon: '⚡' },
        { title: 'Community votes fixes', description: 'Some clustering logic fixes and data fetching issues.', icon: '🛠️' }
    ],
    '1.8.1': [
        { title: 'Vote feature fixes', description: 'Skip now works 100% of the time and My votes isnt bugged anymore.', icon: '🛠️' },
        { title: 'Theme polish', description: 'Improved styling for voting elements.', icon: '🎨' }
    ]
};

async function getOnboardingState() {
    return new Promise(resolve => {
        browserAPI.storage.local.get([
            'flavortown_onboarding_complete',
            'flavortown_last_version',
            'flavortown_whatsnew_seen'
        ], result => {
            resolve({
                onboardingComplete: result.flavortown_onboarding_complete || false,
                lastVersion: result.flavortown_last_version || null,
                whatsNewSeen: result.flavortown_whatsnew_seen || null
            });
        });
    });
}

async function setOnboardingComplete() {
    return new Promise(resolve => {
        browserAPI.storage.local.set({
            flavortown_onboarding_complete: true,
            flavortown_last_version: EXTENSION_VERSION,
            flavortown_whatsnew_seen: EXTENSION_VERSION
        }, resolve);
    });
}

async function setLastVersion() {
    return new Promise(resolve => {
        browserAPI.storage.local.set({
            flavortown_last_version: EXTENSION_VERSION,
            flavortown_whatsnew_seen: EXTENSION_VERSION
        }, resolve);
    });
}

function saveTutorialState(phase, stepIndex, targetHighlight = null, runHandlerAgain = false, stepId = null, stepOrder = null) {
    localStorage.setItem('flavortown_tutorial_state', JSON.stringify({
        phase,
        stepIndex,
        stepId,
        targetHighlight,
        runHandlerAgain,
        stepOrder,
        timestamp: Date.now()
    }));
}

function getTutorialState() {
    try {
        const state = localStorage.getItem('flavortown_tutorial_state');
        if (!state) return null;
        const parsed = JSON.parse(state);
        if (Date.now() - parsed.timestamp > 30 * 60 * 1000) {
            localStorage.removeItem('flavortown_tutorial_state');
            return null;
        }
        return parsed;
    } catch {
        return null;
    }
}

function clearTutorialState() {
    localStorage.removeItem('flavortown_tutorial_state');
    sessionStorage.removeItem('flavortown_tutorial_state');
    sessionStorage.removeItem('flavortown_tutorial_resume');
}

function injectTutorialStyles() {
    if (document.getElementById('flavortown-tutorial-styles')) return;

    const style = document.createElement('style');
    style.id = 'flavortown-tutorial-styles';
    style.textContent = `
        @keyframes flavortown-pulse {
            0%, 100% { box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.6), 0 0 0 4px var(--flavortown-tutorial-accent, #ec8b33); }
            50% { box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.6), 0 0 0 8px var(--flavortown-tutorial-accent, #ec8b33), 0 0 20px var(--flavortown-tutorial-accent, #ec8b33); }
        }

        @keyframes flavortown-confetti-fall {
            0% { transform: translateY(-100vh) rotate(0deg); opacity: 1; }
            100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
        }

        @keyframes flavortown-confetti-burst {
            0% {
                transform: translate(-50%, -50%) scale(1);
                opacity: 1;
            }
            100% {
                transform: translate(calc(-50% + var(--end-x)), calc(-50% + var(--end-y))) scale(0.5);
                opacity: 0;
            }
        }

        @keyframes flavortown-bounce {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
        }

        @keyframes flavortown-fade-in {<div class="shop-item-card__accessories-wrapper"><button class="shop-item-card__accessories-toggle"><span>⚙️ Accessories</span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"></path></svg></button><div class="shop-item-card__accessories-panel"><div class="shop-item-card__accessory-group">
                <div class="shop-item-card__accessory-group-title">Other upgrades</div>
                <div class="shop-item-card__accessory-chips"><button class="shop-item-card__accessory-chip is-selected" data-group="Other upgrades" data-id="53" data-price="300">
                    $100 Credit (🍪 300)
                </button></div></div><div class="shop-item-card__total-price">
            <span>Total:</span>
            <span class="total-value">🍪600</span>
        </div>
        <button class="shop-item-card__add-to-goals" type="button">⭐ Add with Accessories to Goals</button></div></div>
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }

        @keyframes flavortown-scale-in {
            from { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
            to { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        }

        .flavortown-tutorial-spotlight {
            animation: flavortown-pulse 2s ease-in-out infinite;
        }

        .flavortown-confetti {
            position: fixed;
            width: 10px;
            height: 10px;
            top: -20px;
            z-index: 100001;
            pointer-events: none;
            animation: flavortown-confetti-fall 3s linear forwards;
        }

        .flavortown-theme-btn {
            padding: 12px 20px;
            border-radius: 10px;
            border: 2px solid var(--flavortown-tutorial-border, rgba(0, 0, 0, 0.25));
            background: var(--flavortown-tutorial-surface, rgba(255, 255, 255, 0.9));
            color: var(--flavortown-tutorial-text, inherit);
            cursor: pointer;
            font-size: 0.9em;
            font-weight: 600;
            transition: all 0.2s ease;
            display: flex;
            align-items: center;
            gap: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.12);
        }

        .flavortown-theme-btn:hover {
            transform: translateY(-2px);
            border-color: var(--flavortown-tutorial-accent, #ec8b33);
            background: var(--flavortown-tutorial-bg, rgba(255, 255, 255, 1));
        }

        .flavortown-theme-btn.active {
            border-color: var(--flavortown-tutorial-accent, #ec8b33);
            background: var(--flavortown-tutorial-bg, rgba(255, 255, 255, 1));
            box-shadow: 0 6px 18px rgba(0,0,0,0.2);
        }

        .flavortown-theme-dot {
            width: 14px;
            height: 14px;
            border-radius: 50%;
            border: 2px solid rgba(0,0,0,0.15);
            flex-shrink: 0;
        }

        #flavortown-tutorial-modal {
            /* Default theme (cream/brown) - fallback values match Flavortown's default */
            --flavortown-tutorial-accent: var(--ctp-mauve, var(--sea-cyan, var(--overcooked-coral, var(--color-brown, #5d4e37))));
            --flavortown-tutorial-bg: var(--ctp-base, var(--sea-dark, var(--overcooked-dark, var(--color-cream, #fdf6e3))));
            --flavortown-tutorial-surface: var(--ctp-surface0, var(--sea-mid, var(--overcooked-mid, var(--color-cream-dark, #efe6d5))));
            --flavortown-tutorial-border: var(--ctp-surface1, var(--sea-surface, var(--overcooked-surface, var(--color-brown-light, #8b7355))));
            --flavortown-tutorial-text: var(--ctp-text, var(--sea-white, var(--overcooked-white, var(--color-brown, #5d4e37))));
            --flavortown-tutorial-subtext: var(--ctp-subtext0, var(--sea-foam, var(--overcooked-foam, var(--color-brown-light, #8b7355))));
        }
    `;
    document.head.appendChild(style);
}

function showConfetti() {
    const colors = ['#cba6f7', '#f38ba8', '#a6e3a1', '#89b4fa', '#fab387', '#f9e2af'];
    const confettiCount = 30;

    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;

    for (let i = 0; i < confettiCount; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'flavortown-confetti-burst';

        const angle = (Math.PI * 2 * i) / confettiCount + (Math.random() - 0.5) * 0.5;
        const velocity = 100 + Math.random() * 120;
        const endX = Math.cos(angle) * velocity;
        const endY = Math.sin(angle) * velocity;

        confetti.style.cssText = `
            position: fixed;
            width: ${6 + Math.random() * 6}px;
            height: ${6 + Math.random() * 6}px;
            left: ${centerX}px;
            top: ${centerY}px;
            background-color: ${colors[Math.floor(Math.random() * colors.length)]};
            z-index: 100001;
            pointer-events: none;
            border-radius: ${Math.random() > 0.5 ? '50%' : '2px'};
            opacity: 1;
            transform: translate(-50%, -50%) rotate(${Math.random() * 360}deg);
            animation: flavortown-confetti-burst ${0.5 + Math.random() * 0.3}s ease-out forwards;
            --end-x: ${endX}px;
            --end-y: ${endY}px;
        `;

        document.body.appendChild(confetti);
        setTimeout(() => confetti.remove(), 1000);
    }
}

class TutorialController {
    constructor() {
        this.currentPhase = 1;
        this.currentStep = 0;
        this.steps = [...TUTORIAL_PHASE_1];
        this.stepOrder = this.steps.map(s => s.id);
        this.overlay = null;
        this.spotlight = null;
        this.modal = null;
        this.escHandler = null;
        this.clickWaitHandler = null;
        this.targetRetryCount = 0;
        this.targetRetryStepId = null;
        this.targetObserver = null;
        this.targetObserverCleanup = null;
        this.targetObserverStepId = null;
        this.debugIndicator = null;
        this.debugOutline = null;
        window.__flavortownTutorial = this;
        this.resumeState = null;
        this.alwaysDebug = localStorage.getItem('flavortown_tutorial_debug') === 'true';
        this.pendingNavigationTimeout = null;
        this.navigationStepId = null;
        this.pendingInteractiveTimeouts = [];
        this.userHasTheme = false;
        this.preloadUserState();
    }

    preloadUserState() {
        browserAPI.storage.sync.get(['theme'], (result) => {
            this.userHasTheme = result.theme && result.theme !== 'default';
        });
    }

    prepareGoalInBackground() {
        if (this.goalPrepared) return;

        const goalsPanel = document.querySelector('.flavortown-goals-enhanced, .shop-goals');
        if (!goalsPanel) return;

        const goalItems = goalsPanel.querySelectorAll('.flavortown-goal-item, .goal-item-card, .shop-goals__item');
        const hasGoals = goalItems.length > 0;

        if (!hasGoals) {
            this.goalPrepared = true;
            const starBtn = document.querySelector('.shop-item-card__star[aria-pressed="false"], .shop-item-card__star:not([aria-pressed="true"])');
            if (starBtn) {
                starBtn.click();
            }
        } else {
            this.goalPrepared = true;
        }
    }

    setInteractiveTimeout(callback, delay, stepId) {
        const timeoutId = setTimeout(() => {
            if (this.steps[this.currentStep]?.id === stepId) {
                callback();
            }
            this.pendingInteractiveTimeouts = this.pendingInteractiveTimeouts.filter(t => t.id !== timeoutId);
        }, delay);
        this.pendingInteractiveTimeouts.push({ id: timeoutId, stepId });
        return timeoutId;
    }

    clearInteractiveTimeouts() {
        this.pendingInteractiveTimeouts.forEach(t => clearTimeout(t.id));
        this.pendingInteractiveTimeouts = [];
    }

    start() {
        injectTutorialStyles();
        this.overlay = this.createOverlay();
        this.stepOrder = this.steps.map(s => s.id);
        this.goalPrepared = false;
        this.handledStepId = null;
        this.showStep(0);

        scanUserContext().catch(e => console.warn('Tutorial scan failed:', e));

        this.escHandler = (e) => {
            if (e.key === 'Escape') {
                this.end();
            }
        };
        document.addEventListener('keydown', this.escHandler);
    }

    createOverlay() {
        const overlay = document.createElement('div');
        overlay.id = 'flavortown-tutorial-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.35);
            z-index: 99998;
            opacity: 0;
            transition: opacity 0.3s ease;
        `;
        document.body.appendChild(overlay);
        requestAnimationFrame(() => overlay.style.opacity = '1');
        return overlay;
    }

    createSpotlight(targetElement, stepId = null) {
        if (stepId && this.steps[this.currentStep]?.id !== stepId) {
            return null;
        }

        if (this.spotlight) this.spotlight.remove();

        if (this.overlay) {
            this.overlay.style.opacity = '0';
        }

        const spotlight = document.createElement('div');
        spotlight.id = 'flavortown-tutorial-spotlight';
        spotlight.className = 'flavortown-tutorial-spotlight';

        const rect = targetElement.getBoundingClientRect();
        let padding = 8;
        let computedRadius = window.getComputedStyle(targetElement).borderRadius || '12px';

        spotlight.style.cssText = `
            position: fixed;
            top: ${rect.top - padding}px;
            left: ${rect.left - padding}px;
            width: ${rect.width + padding * 2}px;
            height: ${rect.height + padding * 2}px;
            border-radius: ${computedRadius || '12px'};
            z-index: 99999;
            pointer-events: none;
            box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.65), 0 0 0 5px var(--flavortown-tutorial-accent, #ec8b33), 0 0 25px rgba(236, 139, 51, 0.45);
            outline: 2px solid var(--flavortown-tutorial-accent, #ec8b33);
            transition: top 0.05s linear, left 0.05s linear, width 0.2s ease, height 0.2s ease;
        `;

        document.body.appendChild(spotlight);
        this.spotlight = spotlight;

        if (this.spotlightScrollHandler) {
            window.removeEventListener('scroll', this.spotlightScrollHandler, true);
        }

        this.spotlightTargetElement = targetElement;
        this.spotlightPadding = padding;

        this.spotlightScrollHandler = () => {
            if (!this.spotlight || !this.spotlightTargetElement) return;
            const newRect = this.spotlightTargetElement.getBoundingClientRect();
            this.spotlight.style.top = `${newRect.top - this.spotlightPadding}px`;
            this.spotlight.style.left = `${newRect.left - this.spotlightPadding}px`;
            this.spotlight.style.width = `${newRect.width + this.spotlightPadding * 2}px`;
            this.spotlight.style.height = `${newRect.height + this.spotlightPadding * 2}px`;
        };

        window.addEventListener('scroll', this.spotlightScrollHandler, true);

        return spotlight;
    }

    createModal(step, index) {
        if (this.modal) {
            this.modal.remove();
            this.modal = null;
        }

        const modal = document.createElement('div');
        modal.id = 'flavortown-tutorial-modal';

        const totalSteps = this.steps.length;
        const progress = ((index + 1) / totalSteps) * 100;
        const target = step.target ? this.findTargetMatch([step.target])?.el : null;
        const canAutoPosition = step.position === 'center' && target;
        let useCenterPosition = !canAutoPosition && (step.position === 'center' || !target);
        let modalTransformEnd = '';
        const isPaletteStep = step.interactive === 'open-command-palette';
        if (isPaletteStep) {
            useCenterPosition = false;
            modalTransformEnd = 'translateX(-50%) scale(1)';
        }

        modal.style.cssText = `
            position: fixed;
            z-index: 100000;
            background: var(--flavortown-tutorial-bg, #fdf6e3);
            border: 2px solid var(--flavortown-tutorial-border, #8b7355);
            border-radius: 16px;
            padding: 24px;
            max-width: 420px;
            width: 90%;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            color: var(--flavortown-tutorial-text, #5d4e37);
            opacity: 0;
            transition: all 0.3s ease;
        `;

        if (step.interactive === 'open-command-palette') {
            modal.style.bottom = '40px';
            modal.style.left = '50%';
            modal.style.top = 'auto';
            modal.style.transform = 'translateX(-50%) scale(0.9)';
        } else if (canAutoPosition && target) {
            const rect = target.getBoundingClientRect();
            const modalWidth = 420;
            const modalHeight = 260;
            const spaceRight = window.innerWidth - rect.right;
            const spaceLeft = rect.left;
            const spaceBelow = window.innerHeight - rect.bottom;

            if (spaceRight >= modalWidth + 24) {
                modal.style.top = `${Math.min(rect.top + 20, window.innerHeight - 350)}px`;
                modal.style.left = `${Math.min(rect.right + 24, window.innerWidth - 450)}px`;
                modal.style.transform = 'translateX(20px)';
                modalTransformEnd = 'translateX(0)';
            } else if (spaceLeft >= modalWidth + 24) {
                modal.style.top = `${Math.min(rect.top + 20, window.innerHeight - 350)}px`;
                modal.style.left = `${Math.max(20, rect.left - modalWidth - 24)}px`;
                modal.style.transform = 'translateX(-20px)';
                modalTransformEnd = 'translateX(0)';
            } else if (spaceBelow >= modalHeight + 24) {
                modal.style.top = `${Math.min(rect.bottom + 24, window.innerHeight - 300)}px`;
                modal.style.left = `${Math.min(Math.max(20, rect.left), window.innerWidth - 450)}px`;
                modal.style.transform = 'translateY(20px)';
                modalTransformEnd = 'translateY(0)';
            } else {
                useCenterPosition = true;
            }
        }

        if (useCenterPosition) {
            modal.style.top = '50%';
            modal.style.left = '50%';
            modal.style.transform = 'translate(-50%, -50%) scale(0.9)';
        } else if (step.position === 'right' && target) {
            const rect = target.getBoundingClientRect();
            const leftOffset = step.target === '.sidebar__blob' ? 320 : rect.right + 24;
            modal.style.top = `${Math.min(rect.top + 20, window.innerHeight - 350)}px`;
            modal.style.left = `${Math.min(leftOffset, window.innerWidth - 450)}px`;
            modal.style.transform = 'translateX(20px)';
        } else if (step.position === 'left' && target) {
            const rect = target.getBoundingClientRect();
            const modalWidth = 420;
            modal.style.top = `${Math.min(rect.top + 20, window.innerHeight - 350)}px`;
            modal.style.left = `${Math.max(20, rect.left - modalWidth - 24)}px`;
            modal.style.transform = 'translateX(-20px)';
        }

        let interactiveContent = '';
        let buttonsHtml = '';

        if (step.interactive === 'theme-picker') {
            interactiveContent = `
                <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; margin: 16px 0;">
                    ${THEME_OPTIONS.map(theme => `
                        <button class="flavortown-theme-btn" data-theme="${theme.id}">
                            <span class="flavortown-theme-dot" style="background: ${theme.color}"></span>
                            ${theme.name}
                        </button>
                    `).join('')}
                </div>
            `;
        }

        if (step.isChoice) {
            const nextPhase = step.choicePhase || 2;
            const skipText = nextPhase === 3 ? "I've seen enough!" : "I'm good, let's go!";
            const continueText = nextPhase === 3 ? "Show me everything!" : "Show me more!";
            buttonsHtml = `
                <div style="display: flex; gap: 10px; justify-content: center; flex-wrap: wrap;">
                    <button id="tutorial-skip-choice" data-phase="${nextPhase}" style="
                        padding: 12px 24px;
                        border-radius: 8px;
                        border: 1px solid var(--flavortown-tutorial-border, #8b7355);
                        background: transparent;
                        color: inherit;
                        cursor: pointer;
                        font-size: 0.9em;
                        transition: all 0.2s;
                    ">${skipText}</button>
                    <button id="tutorial-continue-choice" data-phase="${nextPhase}" style="
                        padding: 12px 24px;
                        border-radius: 8px;
                        border: none;
                        background: var(--flavortown-tutorial-accent, #5d4e37);
                        color: var(--flavortown-tutorial-bg, #fdf6e3);
                        cursor: pointer;
                        font-size: 0.9em;
                        font-weight: 600;
                        transition: all 0.2s;
                    ">${continueText}</button>
                </div>
            `;
        } else if (step.isFinal) {
            buttonsHtml = `
                <div style="display: flex; gap: 10px; justify-content: center;">
                    <button id="tutorial-finish" style="
                        padding: 14px 32px;
                        border-radius: 8px;
                        border: none;
                        background: var(--flavortown-tutorial-accent, #5d4e37);
                        color: var(--flavortown-tutorial-bg, #fdf6e3);
                        cursor: pointer;
                        font-size: 1em;
                        font-weight: 600;
                        transition: all 0.2s;
                    ">Let's go! 🎉</button>
                </div>
            `;
        } else {
            buttonsHtml = `
                <div style="display: flex; gap: 10px; justify-content: flex-end;">
                    ${index > 0 ? `
                        <button id="tutorial-prev" style="
                            padding: 10px 20px;
                            border-radius: 8px;
                            border: 1px solid var(--flavortown-tutorial-border, #3a3a3a);
                            background: transparent;
                            color: inherit;
                            cursor: pointer;
                            font-size: 0.9em;
                            transition: all 0.2s;
                        ">Back</button>
                    ` : ''}
                    <button id="tutorial-next" style="
                        padding: 10px 24px;
                        border-radius: 8px;
                        border: none;
                        background: var(--flavortown-tutorial-accent, #5d4e37);
                        color: var(--flavortown-tutorial-bg, #fdf6e3);
                        cursor: pointer;
                        font-size: 0.9em;
                        font-weight: 600;
                        transition: all 0.2s;
                    ">${step.waitForClick ? 'Waiting...' : 'Next'}</button>
                </div>
            `;
        }

        modal.innerHTML = `
            <div style="margin-bottom: 16px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                    <span style="font-size: 0.8em; color: var(--flavortown-tutorial-subtext, #8b7355);">
                        ${this.currentPhase === 1 ? 'Essentials' : this.currentPhase === 2 ? 'Core Features' : 'Extra Features'} • Step ${index + 1} of ${totalSteps}
                    </span>
                    <button id="tutorial-skip" style="
                        background: none;
                        border: none;
                        color: var(--flavortown-tutorial-subtext, #8b7355);
                        cursor: pointer;
                        font-size: 0.85em;
                        padding: 4px 8px;
                        border-radius: 4px;
                        transition: background 0.2s;
                    ">Skip</button>
                </div>
                <div style="
                    width: 100%;
                    height: 4px;
                    background: var(--flavortown-tutorial-surface, #efe6d5);
                    border-radius: 2px;
                    overflow: hidden;
                ">
                    <div style="
                        width: ${progress}%;
                        height: 100%;
                        background: var(--flavortown-tutorial-accent, #5d4e37);
                        transition: width 0.3s ease;
                    "></div>
                </div>
            </div>

            <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 12px;">
                <span style="font-size: 2em;">${step.icon || '✨'}</span>
                <h3 style="
                    margin: 0;
                    font-size: 1.3em;
                    color: inherit;
                ">${step.title}</h3>
            </div>

            <p style="
                margin: 0 0 16px 0;
                color: var(--flavortown-tutorial-subtext, #8b7355);
                line-height: 1.6;
                font-size: 0.95em;
                white-space: pre-line;
            ">${step.description}</p>

            ${interactiveContent}
            ${buttonsHtml}
        `;

        document.body.appendChild(modal);
        this.modal = modal;

        requestAnimationFrame(() => {
            modal.style.opacity = '1';
            if (useCenterPosition) {
                modal.style.transform = 'translate(-50%, -50%) scale(1)';
            } else if (modalTransformEnd) {
                modal.style.transform = modalTransformEnd;
            } else {
                modal.style.transform = 'translateX(0)';
            }
        });

        this.setupModalListeners(step);

        return modal;
    }

    setupModalListeners(step) {
        const modal = this.modal;

        const skipBtn = modal.querySelector('#tutorial-skip');
        if (skipBtn) {
            skipBtn.addEventListener('mouseenter', () => skipBtn.style.background = 'rgba(255,255,255,0.1)');
            skipBtn.addEventListener('mouseleave', () => skipBtn.style.background = 'none');
            skipBtn.addEventListener('click', () => this.end());
        }

        const nextBtn = modal.querySelector('#tutorial-next');
        if (nextBtn && !step.waitForClick) {
            nextBtn.addEventListener('mouseenter', () => nextBtn.style.opacity = '0.85');
            nextBtn.addEventListener('mouseleave', () => nextBtn.style.opacity = '1');
            nextBtn.addEventListener('click', () => {
                if (step.interactive === 'open-command-palette') {
                    const palette = document.querySelector('.flavortown-cmd-palette');
                    if (palette) {
                        palette.classList.remove('open');
                        const paletteInput = palette.querySelector('input');
                        if (paletteInput) paletteInput.value = '';
                    }
                }
                this.next();
            });
        }

        const prevBtn = modal.querySelector('#tutorial-prev');
        if (prevBtn) {
            prevBtn.addEventListener('mouseenter', () => prevBtn.style.background = 'rgba(255,255,255,0.1)');
            prevBtn.addEventListener('mouseleave', () => prevBtn.style.background = 'transparent');
            prevBtn.addEventListener('click', () => this.prev());
        }

        const skipChoiceBtn = modal.querySelector('#tutorial-skip-choice');
        if (skipChoiceBtn) {
            skipChoiceBtn.addEventListener('click', () => this.end());
        }

        const continueChoiceBtn = modal.querySelector('#tutorial-continue-choice');
        if (continueChoiceBtn) {
            const targetPhase = parseInt(continueChoiceBtn.dataset.phase) || 2;
            continueChoiceBtn.addEventListener('mouseenter', () => continueChoiceBtn.style.opacity = '0.85');
            continueChoiceBtn.addEventListener('mouseleave', () => continueChoiceBtn.style.opacity = '1');
            continueChoiceBtn.addEventListener('click', () => {
                if (targetPhase === 2) {
                    this.startPhase2();
                } else if (targetPhase === 3) {
                    this.startPhase3();
                }
            });
        }

        const finishBtn = modal.querySelector('#tutorial-finish');
        if (finishBtn) {
            finishBtn.addEventListener('click', () => {
                showConfetti();
                this.end();
            });
        }

        const themeBtns = modal.querySelectorAll('.flavortown-theme-btn');
        themeBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const themeId = btn.dataset.theme;
                browserAPI.storage.sync.set({ theme: themeId });
                themeBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                if (typeof applyTheme === 'function') {
                    applyTheme(themeId);
                }
            });
        });

        if (step.waitForClick) {
            const waitTarget = document.querySelector(step.waitForClick);
            if (waitTarget) {
                this.clickWaitHandler = () => {
                    this.next();
                };
                waitTarget.addEventListener('click', this.clickWaitHandler, { once: true });
            }
        }

        if (step.interactive === 'open-command-palette') {
            saveTutorialState(this.currentPhase, this.currentStep, null, true, step.id, this.stepOrder);

            this.setInteractiveTimeout(() => {
                const isMac = navigator.userAgent.indexOf('Mac') >= 0;
                document.dispatchEvent(new KeyboardEvent('keydown', {
                    key: 'k',
                    code: 'KeyK',
                    ctrlKey: !isMac,
                    metaKey: isMac,
                    bubbles: true
                }));

                const cmdPalette = document.querySelector('.flavortown-cmd-palette');
                if (cmdPalette) {
                    const stepBeforeOpen = this.currentStep;

                    const observer = new MutationObserver((mutations) => {
                        for (const mutation of mutations) {
                            if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                                if (!cmdPalette.classList.contains('open')) {
                                    observer.disconnect();
                                    if (this.steps[this.currentStep]?.id !== step.id) {
                                        return;
                                    }
                                    const savedState = getTutorialState();
                                    if (savedState && savedState.stepIndex !== stepBeforeOpen) {
                                        return;
                                    }
                                    this.setInteractiveTimeout(() => {
                                        if (this.steps[this.currentStep]?.id === step.id) {
                                            this.next();
                                        }
                                    }, 300, step.id);
                                }
                            }
                        }
                    });
                    observer.observe(cmdPalette, { attributes: true });

                    this.cmdPaletteObserver = observer;
                }
            }, 800, step.id);
        }
        if (step.interactive === 'navigate-project-devlog') {
            const pathname = window.location.pathname;
            const isProjectDetailPage = /^\/projects\/\d+$/.test(pathname);
            if (isProjectDetailPage) {
                return;
            }

            if (tutorialUserContext.projectForDevlog) {
                saveTutorialState(this.currentPhase, this.currentStep, '.flavortown-inline-devlog, .post-form, form[action*="devlogs"]', false, step.id, this.stepOrder);
                window.location.href = `/projects/${tutorialUserContext.projectForDevlog.id}`;
                return;
            }

            this.setInteractiveTimeout(() => {
                const isProjectsListPage = pathname === '/projects';

                if (isProjectsListPage) {
                    const projectCards = document.querySelectorAll('.project-card');
                    let bestProjectId = null;
                    let fallbackProjectId = null;

                    for (const card of projectCards) {
                        const link = card.querySelector('a[href*="/projects/"]');
                        if (!link) continue;

                        const match = link.getAttribute('href').match(/\/projects\/(\d+)/);
                        if (!match) continue;

                        const projectId = match[1];
                        const stats = card.querySelectorAll('.project-card__stats h5');
                        let hasTime = false;
                        for (const stat of stats) {
                            const text = stat.textContent.trim();
                            if (text.match(/\d+h/) || (text.match(/\d+m/) && !text.match(/^0m$/))) {
                                hasTime = true;
                                break;
                            }
                        }

                        if (hasTime && !bestProjectId) bestProjectId = projectId;
                        if (!fallbackProjectId) fallbackProjectId = projectId;
                    }

                    const projectId = bestProjectId || fallbackProjectId;
                    if (projectId) {
                        saveTutorialState(this.currentPhase, this.currentStep, '.flavortown-inline-devlog, .post-form, form[action*="devlogs"]', false, step.id, this.stepOrder);
                        window.location.href = `/projects/${projectId}`;
                        return;
                    }
                    this.next();
                } else {
                    saveTutorialState(this.currentPhase, this.currentStep, null, true, step.id, this.stepOrder);
                    window.location.href = '/projects';
                }
            }, 200, step.id);
        }

        if (step.interactive === 'navigate-project-vote-stats') {
            if (this.handledStepId === step.id) return;
            this.handledStepId = step.id;

            const pathname = window.location.pathname;
            const isProjectDetailPage = /^\/projects\/\d+$/.test(pathname);
            const statsSelectors = '.flavortown-project-cookies-details, .flavortown-project-category-stats';
            const targetProject = tutorialUserContext.projectWithShips;

            if (!targetProject?.id) {
                this.next();
                return;
            }

            if (!isProjectDetailPage || !pathname.endsWith(`/${targetProject.id}`)) {
                saveTutorialState(this.currentPhase, this.currentStep, statsSelectors, false, step.id, this.stepOrder);
                window.location.href = `/projects/${targetProject.id}`;
                return;
            }

            this.setInteractiveTimeout(() => {
                const statsEl = document.querySelector(statsSelectors);
                if (!statsEl) {
                    this.next();
                    return;
                }
                statsEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
                this.setInteractiveTimeout(() => {
                    if (this.steps[this.currentStep]?.id !== step.id) return;
                    this.createSpotlight(statsEl, step.id);
                    this.createModal(step, this.currentStep);
                }, 400, step.id);
            }, 400, step.id);
            return;
        }

        if (step.interactive === 'navigate-dashboard') {
            this.navigationStepId = step.id;
            this.pendingNavigationTimeout = setTimeout(() => {
                if (this.steps[this.currentStep]?.id !== 'kitchen-dashboard') {
                    return;
                }
                if (window.location.pathname === '/kitchen') {
                    return;
                }
                saveTutorialState(this.currentPhase, this.currentStep, '.flavortown-kitchen-dashboard, .flavortown-graph-container', false, step.id, this.stepOrder);
                window.location.href = '/kitchen';
            }, 1000);
        }

        if (step.interactive === 'show-buffet-button') {
            const stepId = step.id;
            this.setInteractiveTimeout(() => {
                const onExplore = window.location.pathname.startsWith('/explore');
                if (!onExplore) {
                    sessionStorage.setItem('flavortown_toggle_buffet', 'true');
                    saveTutorialState(this.currentPhase, this.currentStep, '.flavortown-doomscroll-toggle', true, stepId, this.stepOrder);
                    window.location.href = '/explore';
                    return;
                }

                const openOverlay = document.querySelector('.flavortown-doomscroll');
                if (openOverlay) {
                    const closeBtn = openOverlay.querySelector('.flavortown-doomscroll__close');
                    this.setInteractiveTimeout(() => {
                        closeBtn?.click();
                        this.setInteractiveTimeout(() => {
                            if (this.steps[this.currentStep]?.id !== stepId) return;
                            this.createSpotlight(document.querySelector('.flavortown-doomscroll-toggle, .flavortown-buffet-btn'), stepId);
                        }, 300, stepId);
                    }, 7000, stepId);
                    return;
                }

                let attempts = 0;
                const maxAttempts = 20;
                const pollForBuffet = () => {
                    const buffetBtn = document.querySelector('.flavortown-doomscroll-toggle, .flavortown-buffet-btn');
                    if (buffetBtn) {
                        buffetBtn.click();
                        this.setInteractiveTimeout(() => {
                            const closeBtn = document.querySelector('.flavortown-doomscroll__close');
                            closeBtn?.click();
                            this.setInteractiveTimeout(() => {
                                if (this.steps[this.currentStep]?.id !== stepId) return;
                                this.createSpotlight(buffetBtn, stepId);
                            }, 300, stepId);
                        }, 7000, stepId);
                        return;
                    } else if (attempts < maxAttempts) {
                        attempts++;
                        this.setInteractiveTimeout(pollForBuffet, 250, stepId);
                    } else {
                        this.next();
                    }
                };

                pollForBuffet();
            }, 300, stepId);
        }

        if (step.interactive === 'navigate-shots') {
            const pathname = window.location.pathname;
            const isProjectDetailPage = /^\/projects\/\d+$/.test(pathname);
            const shotsSelectors = ['.flavortown-shots-btn', '.flavortown-inline-form .flavortown-shots-btn'];

            const gotoProject = (projectId) => {
                saveTutorialState(this.currentPhase, this.currentStep, shotsSelectors.join(','), false, step.id, this.stepOrder);
                window.location.href = `/projects/${projectId}`;
            };

            if (!isProjectDetailPage) {
                const targetProject = tutorialUserContext.projectForDevlog || tutorialUserContext.projectWithShips;
                if (targetProject?.id) {
                    gotoProject(targetProject.id);
                    return;
                }
                this.next();
                return;
            }

            this.setInteractiveTimeout(() => {
                const fileArea = document.querySelector('.file-upload, .flavortown-inline-form');
                if (!fileArea) {
                    this.next();
                    return;
                }
                if (typeof addShotsButton === 'function') addShotsButton();
                const shotsBtn = document.querySelector(shotsSelectors.join(','));
                if (shotsBtn) {
                    this.createSpotlight(shotsBtn, step.id);
                    this.setInteractiveTimeout(() => this.next(), 1500, step.id);
                } else {
                    this.next();
                }
            }, 400, step.id);
        }

        if (step.interactive === 'navigate-project-search') {
            const onExplore = window.location.pathname.startsWith('/explore');
            if (!onExplore) {
                saveTutorialState(this.currentPhase, this.currentStep, '.flavortown-search-container input, .flavortown-search-input', true, step.id, this.stepOrder);
                window.location.href = '/explore';
                return;
            }
            const searchInput = document.querySelector('.flavortown-search-container input, .flavortown-search-input');
            if (searchInput) {
                this.createSpotlight(searchInput, step.id);
                searchInput.focus();
            } else {
                this.next();
            }
        }

        if (step.interactive === 'navigate-shop-time-calc') {
            if (this.handledStepId === step.id) return;
            this.handledStepId = step.id;

            const onShop = window.location.pathname === '/shop';
            const hoursSelector = '.flavortown-efficiency__hours';

            if (!onShop) {
                this.navigationStepId = step.id;
                this.pendingNavigationTimeout = setTimeout(() => {
                    if (this.steps[this.currentStep]?.interactive !== 'navigate-shop-time-calc') {
                        return;
                    }
                    saveTutorialState(this.currentPhase, this.currentStep, hoursSelector, false, step.id, this.stepOrder);
                    window.location.href = '/shop';
                }, 1000);
                return;
            }

            this.setInteractiveTimeout(() => {
                const efficiency = document.querySelector('.flavortown-efficiency');
                if (!efficiency) return;
                efficiency.scrollIntoView({ behavior: 'smooth', block: 'center' });

                setTimeout(() => {
                    if (this.steps[this.currentStep]?.id !== step.id) return;
                    const hoursEl = efficiency.querySelector(hoursSelector) || efficiency;
                    this.createSpotlight(hoursEl, step.id);
                    this.createModal(step, this.currentStep);
                }, 500);
            }, 500, step.id);
            return;
        }

        if (step.interactive === 'show-shop-accessories') {
            if (this.handledStepId === step.id) return;
            this.handledStepId = step.id;

            const accessoriesToggle = document.querySelector('.shop-item-card__accessories-toggle');
            if (accessoriesToggle) {
                accessoriesToggle.scrollIntoView({ behavior: 'smooth', block: 'center' });

                this.setInteractiveTimeout(() => {
                    const panel = accessoriesToggle.closest('.shop-item-card__accessories-wrapper')?.querySelector('.shop-item-card__accessories-panel');
                    if (panel && !panel.classList.contains('is-open')) {
                        accessoriesToggle.click();
                    }

                    setTimeout(() => {
                        if (this.steps[this.currentStep]?.id !== step.id) return;
                        const wrapper = accessoriesToggle.closest('.shop-item-card__accessories-wrapper');
                        if (wrapper) {
                            this.createSpotlight(wrapper, step.id);
                            this.createModal(step, this.currentStep);
                        }

                        this.prepareGoalInBackground();
                    }, 400);
                }, 600, step.id);
                return;
            }
        }

        if (step.interactive === 'show-shop-goals') {
            if (this.handledStepId === step.id) return;
            this.handledStepId = step.id;

            const goalsPanel = document.querySelector('.flavortown-goals-enhanced, .shop-goals');

            const goalItems = goalsPanel?.querySelectorAll('.flavortown-goal-item, .goal-item-card, .shop-goals__item') || [];
            const hasGoals = goalItems.length > 0;

            if (!hasGoals) {
                const starBtn = document.querySelector('.shop-item-card__star[aria-pressed="false"], .shop-item-card__star:not([aria-pressed="true"])');
                if (starBtn) {
                    starBtn.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    setTimeout(() => {
                        if (this.steps[this.currentStep]?.id !== step.id) return;
                        starBtn.click();

                        this.setInteractiveTimeout(() => {
                            const updatedGoals = document.querySelector('.flavortown-goals-enhanced, .shop-goals');
                            if (updatedGoals) {
                                updatedGoals.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                setTimeout(() => {
                                    if (this.steps[this.currentStep]?.id !== step.id) return;
                                    this.createSpotlight(updatedGoals, step.id);
                                    this.createModal(step, this.currentStep);
                                }, 600);
                            }
                        }, 1000, step.id);
                    }, 500);
                    return;
                }
            }

            if (goalsPanel) {
                goalsPanel.scrollIntoView({ behavior: 'smooth', block: 'start' });
                this.setInteractiveTimeout(() => {
                    this.createSpotlight(goalsPanel, step.id);
                    this.createModal(step, this.currentStep);
                }, 600, step.id);
                return;
            }
        }
    }

    setupTargetObserver(selectors, step, index) {
        if (this.targetObserverStepId === step.id) return;
        if (this.targetObserver) {
            this.targetObserver.disconnect();
            this.targetObserver = null;
        }
        if (this.targetObserverCleanup) {
            this.targetObserverCleanup();
            this.targetObserverCleanup = null;
        }

        const check = () => {
            if (!this.findTargetMatch(selectors)) return;
            if (this.targetObserver) {
                this.targetObserver.disconnect();
                this.targetObserver = null;
            }
            if (this.targetObserverCleanup) {
                this.targetObserverCleanup();
                this.targetObserverCleanup = null;
            }
            this.targetObserverStepId = null;
            this.showStep(index);
        };

        this.targetObserver = new MutationObserver(check);
        this.targetObserver.observe(document.body, { childList: true, subtree: true });

        const scrollHandler = () => check();
        window.addEventListener('scroll', scrollHandler, { passive: true });
        this.targetObserverCleanup = () => window.removeEventListener('scroll', scrollHandler);
        this.targetObserverStepId = step.id;

        setTimeout(check, 0);
    }

    findTargetMatch(selectors, forceFirstCandidate = false) {
        let fallback = null;
        for (const selector of selectors) {
            const candidates = Array.from(document.querySelectorAll(selector));
            for (const el of candidates) {
                if (forceFirstCandidate && candidates.length > 0) {
                    return { el: candidates[0], selector };
                }
                const rect = el.getBoundingClientRect();
                if (rect.width <= 0 || rect.height <= 0) continue;
                return { el, selector };
            }
            if (!fallback && candidates.length > 0) {
                fallback = { el: candidates[0], selector };
            }
        }
        return fallback;
    }

    showDebugIndicator(message, rect = null) {
        this.debugIndicator?.remove();
        this.debugOutline?.remove();

        const badge = document.createElement('div');
        badge.id = 'flavortown-tutorial-debug';
        badge.style.cssText = `
            position: fixed;
            top: 16px;
            right: 16px;
            z-index: 100001;
            background: rgba(0,0,0,0.85);
            color: #fff;
            padding: 8px 12px;
            border-radius: 8px;
            font-size: 12px;
            font-family: system-ui, sans-serif;
            box-shadow: 0 4px 16px rgba(0,0,0,0.4);
            pointer-events: none;
            max-width: 260px;
            line-height: 1.4;
        `;
        badge.textContent = message;

        if (rect) {
            const outline = document.createElement('div');
            outline.id = 'flavortown-tutorial-debug-outline';
            outline.style.cssText = `
                position: fixed;
                top: ${rect.top - 6}px;
                left: ${rect.left - 6}px;
                width: ${rect.width + 12}px;
                height: ${rect.height + 12}px;
                border: 2px dashed #cba6f7;
                border-radius: 10px;
                z-index: 100000;
                pointer-events: none;
            `;
            document.body.appendChild(outline);
            this.debugOutline = outline;
            badge.textContent = `${message} (highlighted)`;
        }

        document.body.appendChild(badge);
        this.debugIndicator = badge;
    }

    showStep(index) {
        const step = this.steps[index];
        if (!step) return;

        const previousStep = this.currentStep !== index ? this.steps[this.currentStep] : null;

        if (previousStep && this.handledStepId !== step.id) {
            this.handledStepId = null;
        }

        this.clearInteractiveTimeouts();

        if (previousStep?.interactive === 'show-buffet-button') {
            const buffetOverlay = document.querySelector('.flavortown-doomscroll');
            const closeBtn = buffetOverlay?.querySelector('.flavortown-doomscroll__close');
            closeBtn?.click();
        }

        if (this.pendingNavigationTimeout && this.navigationStepId !== step.id) {
            clearTimeout(this.pendingNavigationTimeout);
            this.pendingNavigationTimeout = null;
            this.navigationStepId = null;
        }

        this.currentStep = index;
        const debugMode = localStorage.getItem('flavortown_tutorial_debug') === 'true';

        if (this.targetObserverStepId && this.targetObserverStepId !== step.id) {
            if (this.targetObserver) {
                this.targetObserver.disconnect();
                this.targetObserver = null;
            }
            if (this.targetObserverCleanup) {
                this.targetObserverCleanup();
                this.targetObserverCleanup = null;
            }
            this.targetObserverStepId = null;
        }

        if (step.requiresProjectWithShips) {
            if (!tutorialUserContext.scanned) {
                scanUserContext().then(() => {
                    if (this.steps[this.currentStep]?.id === step.id) {
                        this.showStep(index);
                    }
                }).catch(() => {
                    if (this.steps[this.currentStep]?.id === step.id) {
                        this.showStep(index);
                    }
                });
                return;
            }
            if (!tutorialUserContext.projectWithShips) {
                if (this.currentStep < this.steps.length - 1) {
                    this.showStep(this.currentStep + 1);
                } else {
                    this.end();
                }
                return;
            }
        }

        if (step.id === 'community-votes' || step.skip) {
            if (this.currentStep < this.steps.length - 1) {
                this.showStep(this.currentStep + 1);
            } else {
                this.end();
            }
            return;
        }

        if (step.id === 'themes-demo' && this.userHasTheme) {
            if (this.currentStep < this.steps.length - 1) {
                this.showStep(this.currentStep + 1);
            } else {
                this.end();
            }
            return;
        }

        if (this.spotlight) {
            this.spotlight.remove();
            this.spotlight = null;
            if (this.overlay) {
                this.overlay.style.opacity = '1';
            }
        }

        if (this.clickWaitHandler) {
            const waitTarget = document.querySelector(this.steps[index - 1]?.waitForClick);
            if (waitTarget) {
                waitTarget.removeEventListener('click', this.clickWaitHandler);
            }
            this.clickWaitHandler = null;
        }

        const targetSelectors = [];
        if (step.target) targetSelectors.push(step.target);
        if (step.afterNavTarget) {
            targetSelectors.push(...step.afterNavTarget.split(',').map(s => s.trim()).filter(Boolean));
        }

        if (step.interactive === 'navigate-project-devlog') {
            const pathname = window.location.pathname;
            const isProjectDetailPage = /^\/projects\/\d+/.test(pathname);
            if (!isProjectDetailPage) {
                targetSelectors.length = 0;
            }
        }

        if (step.interactive === 'navigate-project-vote-stats') {
            const pathname = window.location.pathname;
            const isProjectDetailPage = /^\/projects\/\d+/.test(pathname);
            if (!isProjectDetailPage) {
                targetSelectors.length = 0;
            }
        }

        let displayStep = step;
        const found = this.findTargetMatch(targetSelectors, false);
        let target = found ? found.el : null;

        if (this.overlay) {
            this.overlay.style.pointerEvents = step.allowInteraction ? 'none' : 'auto';
        }

        if (found && step.afterNavTarget && (!step.target || found.selector !== step.target)) {
            displayStep = { ...step };
            if (step.afterNavDescription) {
                displayStep.description = step.afterNavDescription;
            }
            displayStep.target = found.selector;
        }

        const requiresElement = displayStep.requiresElement && !(displayStep.interactive === 'navigate-shop' && !window.location.pathname.startsWith('/shop'));

        if (requiresElement && displayStep.target && !target) {
            if (!target) {
                if (debugMode) {
                    this.showDebugIndicator(`Waiting for target: ${targetSelectors.join(' , ')}`);
                }
                if (this.targetRetryStepId !== step.id) {
                    this.targetRetryStepId = step.id;
                    this.targetRetryCount = 0;
                }
                if (this.targetRetryCount < 20) {
                    this.targetRetryCount += 1;
                    if (targetSelectors.length) {
                        this.setupTargetObserver(targetSelectors, step, index);
                    }
                    setTimeout(() => this.showStep(index), 300);
                    return;
                }
                this.targetRetryCount = 0;
                this.targetRetryStepId = null;
                if (this.currentStep < this.steps.length - 1) {
                    this.showStep(this.currentStep + 1);
                } else {
                    this.end();
                }
                return;
            }
        }
        this.targetRetryCount = 0;
        this.targetRetryStepId = null;
        if (this.targetObserverStepId === step.id) {
            if (this.targetObserver) {
                this.targetObserver.disconnect();
                this.targetObserver = null;
            }
            if (this.targetObserverCleanup) {
                this.targetObserverCleanup();
                this.targetObserverCleanup = null;
            }
            this.targetObserverStepId = null;
        }

        if (debugMode) {
            if (target) {
                const rect = target.getBoundingClientRect();
                this.showDebugIndicator(`Target: ${displayStep.target} (w:${Math.round(rect.width)} h:${Math.round(rect.height)})`, rect);
            } else {
                this.showDebugIndicator(`No target found for selectors: ${targetSelectors.join(' , ')}`);
            }
        }

        if (target) {
            const rect = target.getBoundingClientRect();
            const inView = rect.top >= 0 && rect.bottom <= window.innerHeight;
            if (!inView) {
                target.scrollIntoView({ behavior: 'smooth', block: 'center' });
                setTimeout(() => {
                    if (this.currentStep !== index) return;
                    this.createSpotlight(target, step.id);
                    this.createModal(displayStep, index);
                    if (step.autoFocusTarget && typeof target.focus === 'function') {
                        setTimeout(() => target.focus(), 150);
                    }
                }, 600);
                return;
            }
            this.createSpotlight(target, step.id);
            if (step.autoFocusTarget && typeof target.focus === 'function') {
                setTimeout(() => target.focus(), 150);
            }
        } else if (this.overlay) {
            this.overlay.style.opacity = '1';
        }

        setTimeout(() => {
            this.createModal(displayStep, index);
        }, this.spotlight ? 200 : 0);
    }

    next() {
        const current = this.steps[this.currentStep];
        if (current?.interactive === 'open-command-palette') {
            const palette = document.querySelector('.flavortown-cmd-palette');
            if (palette) {
                palette.classList.remove('open');
                const paletteInput = palette.querySelector('input');
                if (paletteInput) paletteInput.value = '';
            }
        }
        if (this.currentStep < this.steps.length - 1) {
            const nextStep = this.currentStep + 1;
            const nextStepId = this.steps[nextStep]?.id;
            saveTutorialState(this.currentPhase, nextStep, null, false, nextStepId, this.stepOrder);
            this.showStep(nextStep);
        } else {
            this.end();
        }
    }

    prev() {
        if (this.currentStep > 0) {
            const prevStep = this.currentStep - 1;
            const prevStepId = this.steps[prevStep]?.id;
            saveTutorialState(this.currentPhase, prevStep, null, false, prevStepId, this.stepOrder);
            this.showStep(prevStep);
        }
    }

    reorderStepsForCurrentPage(steps) {
        const pathname = window.location.pathname;
        const reordered = [...steps];

        const pageStepMap = {
            '/kitchen': ['kitchen-dashboard'],
            '/explore': ['search-projects'],
            '/shop': ['shop-time-calc', 'shop-accessories', 'shop-goals']
        };

        let priorityStepIds = [];
        for (const [pagePath, stepIds] of Object.entries(pageStepMap)) {
            if (pathname.startsWith(pagePath)) {
                priorityStepIds = stepIds;
                break;
            }
        }

        if (priorityStepIds.length === 0) return reordered;

        const prioritySteps = [];
        for (const id of priorityStepIds) {
            const step = reordered.find(s => s.id === id);
            if (step) prioritySteps.push(step);
        }
        const otherSteps = reordered.filter(s => !priorityStepIds.includes(s.id));

        let insertIndex = 0;
        for (let i = 0; i < otherSteps.length; i++) {
            if (otherSteps[i].interactive) {
                insertIndex = i;
                break;
            }
        }

        otherSteps.splice(insertIndex, 0, ...prioritySteps);
        return otherSteps;
    }

    applySavedOrder(baseSteps, savedOrder) {
        if (!Array.isArray(savedOrder) || savedOrder.length === 0) return baseSteps;
        const byId = new Map(baseSteps.map(s => [s.id, s]));
        const ordered = [];
        for (const id of savedOrder) {
            if (byId.has(id)) {
                ordered.push(byId.get(id));
                byId.delete(id);
            }
        }
        for (const [, step] of byId) {
            ordered.push(step);
        }
        return ordered;
    }

    getPhaseSteps(phase, savedOrder = null) {
        let base;
        if (phase === 2) base = [...TUTORIAL_PHASE_2];
        else if (phase === 3) base = [...TUTORIAL_PHASE_3];
        else base = [...TUTORIAL_PHASE_1];
        return this.applySavedOrder(base, savedOrder);
    }

    startPhase2() {
        this.currentPhase = 2;
        this.steps = this.reorderStepsForCurrentPage(this.getPhaseSteps(2));
        this.stepOrder = this.steps.map(s => s.id);
        this.currentStep = 0;
        this.showStep(0);
    }

    startPhase3() {
        this.currentPhase = 3;
        this.steps = this.reorderStepsForCurrentPage(this.getPhaseSteps(3));
        this.stepOrder = this.steps.map(s => s.id);
        this.currentStep = 0;
        this.showStep(0);
    }

    end() {
        if (this.escHandler) {
            document.removeEventListener('keydown', this.escHandler);
        }

        this.clearInteractiveTimeouts();

        if (this.cmdPaletteObserver) {
            this.cmdPaletteObserver.disconnect();
            this.cmdPaletteObserver = null;
        }

        if (this.spotlightScrollHandler) {
            window.removeEventListener('scroll', this.spotlightScrollHandler, true);
            this.spotlightScrollHandler = null;
            this.spotlightTargetElement = null;
        }

        if (this.modal) {
            this.modal.style.opacity = '0';
            this.modal.style.transform = 'translate(-50%, -50%) scale(0.9)';
        }
        if (this.spotlight) {
            this.spotlight.remove();
        }
        if (this.overlay) {
            this.overlay.style.opacity = '0';
        }
        this.debugIndicator?.remove();
        this.debugOutline?.remove();

        setTimeout(() => {
            this.modal?.remove();
            this.overlay?.remove();
            this.debugIndicator?.remove();
            this.debugOutline?.remove();
        }, 300);

        setOnboardingComplete();
    }
}

function createWhatsNewModal(features) {
    injectTutorialStyles();

    const overlay = document.createElement('div');
    overlay.id = 'flavortown-tutorial-overlay';
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.75);
        z-index: 99998;
        opacity: 0;
        transition: opacity 0.3s ease;
    `;
    document.body.appendChild(overlay);
    requestAnimationFrame(() => overlay.style.opacity = '1');

    const modal = document.createElement('div');
    modal.id = 'flavortown-tutorial-modal';
    modal.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%) scale(0.9);
        z-index: 100000;
        background: var(--flavortown-tutorial-bg, #fdf6e3);
        border: 2px solid var(--flavortown-tutorial-border, #8b7355);
        border-radius: 16px;
        padding: 28px;
        max-width: 450px;
        width: 90%;
        color: var(--flavortown-tutorial-text, #5d4e37);
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        opacity: 0;
        transition: all 0.3s ease;
    `;

    modal.innerHTML = `
        <div style="text-align: center; margin-bottom: 20px;">
            <div style="font-size: 2.5em; margin-bottom: 8px;">🎉</div>
            <h2 style="
                margin: 0;
                font-size: 1.4em;
                color: inherit;
            ">What's New in v${EXTENSION_VERSION}</h2>
        </div>
        <div style="display: flex; flex-direction: column; gap: 12px; margin-bottom: 24px;">
            ${features.map(f => `
                <div style="
                    display: flex;
                    align-items: flex-start;
                    gap: 12px;
                    padding: 12px;
                    background: var(--flavortown-tutorial-surface, #efe6d5);
                    border-radius: 10px;
                ">
                    <span style="font-size: 1.4em;">${f.icon}</span>
                    <div>
                        <div style="font-weight: 600; color: inherit; margin-bottom: 2px;">
                            ${f.title}
                        </div>
                        <div style="font-size: 0.9em; color: var(--flavortown-tutorial-subtext, #8b7355);">
                            ${f.description}
                        </div>
                    </div>
                </div>
            `).join('')}
        </div>
        <div style="display: flex; gap: 10px; justify-content: center;">
            <button id="whatsnew-close" style="
                padding: 12px 32px;
                border-radius: 8px;
                border: none;
                background: var(--flavortown-tutorial-accent, #5d4e37);
                color: var(--flavortown-tutorial-bg, #fdf6e3);
                cursor: pointer;
                font-size: 0.95em;
                font-weight: 600;
                transition: all 0.2s;
            ">Awesome!</button>
        </div>
    `;

    document.body.appendChild(modal);

    requestAnimationFrame(() => {
        modal.style.opacity = '1';
        modal.style.transform = 'translate(-50%, -50%) scale(1)';
    });

    const closeBtn = modal.querySelector('#whatsnew-close');
    closeBtn.addEventListener('mouseenter', () => closeBtn.style.opacity = '0.85');
    closeBtn.addEventListener('mouseleave', () => closeBtn.style.opacity = '1');

    const closeModal = () => {
        modal.style.opacity = '0';
        modal.style.transform = 'translate(-50%, -50%) scale(0.9)';
        overlay.style.opacity = '0';
        setTimeout(() => {
            modal.remove();
            overlay.remove();
        }, 300);
        setLastVersion();
    };

    closeBtn.addEventListener('click', closeModal);
    overlay.addEventListener('click', closeModal);
}

async function runTutorial() {
    const tutorial = new TutorialController();
    tutorial.start();
}

async function resumeTutorial(savedState) {
    const tutorial = new TutorialController();

    tutorial.currentPhase = savedState.phase || 1;
    const savedOrder = Array.isArray(savedState.stepOrder) ? savedState.stepOrder : null;
    if (tutorial.currentPhase === 2) {
        tutorial.steps = tutorial.getPhaseSteps(2, savedOrder);
    } else if (tutorial.currentPhase === 3) {
        tutorial.steps = tutorial.getPhaseSteps(3, savedOrder);
    } else {
        tutorial.steps = tutorial.getPhaseSteps(1, savedOrder);
    }
    tutorial.stepOrder = tutorial.steps.map(s => s.id);

    let savedStepId = savedState.stepId;
    let stepIndex = savedState.stepIndex;

    if (savedStepId) {
        const foundIndex = tutorial.steps.findIndex(s => s.id === savedStepId);
        if (foundIndex !== -1) {
            stepIndex = foundIndex;
        }
    }

    const currentStep = tutorial.steps[stepIndex];
    if (!currentStep) return;

    clearTutorialState();

    if (savedState.runHandlerAgain) {
        tutorial.currentStep = stepIndex;
        tutorial.isActive = true;
        injectTutorialStyles();
        tutorial.overlay = tutorial.createOverlay();
        tutorial.escHandler = (e) => {
            if (e.key === 'Escape') {
                tutorial.end();
            }
        };
        document.addEventListener('keydown', tutorial.escHandler);
        tutorial.showStep(stepIndex);
        return;
    }

    const targetSelectors = currentStep.afterNavTarget
        ? currentStep.afterNavTarget.split(',').map(s => s.trim())
        : (savedState.targetHighlight ? savedState.targetHighlight.split(',').map(s => s.trim()) : []);
    let targetElement = null;

    await new Promise(r => setTimeout(r, 1200));

    for (let i = 0; i < 25; i++) {
        for (const selector of targetSelectors) {
            const el = document.querySelector(selector);
            if (el) {
                const rect = el.getBoundingClientRect();
                if (rect.width > 0 && rect.height > 0) {
                    targetElement = el;
                    break;
                }
            }
        }
        if (targetElement) break;
        await new Promise(r => setTimeout(r, 500));
    }

    tutorial.currentStep = stepIndex;
    tutorial.isActive = true;

    injectTutorialStyles();

    tutorial.overlay = tutorial.createOverlay();

    const displayStep = { ...currentStep };
    if (currentStep.afterNavDescription) {
        displayStep.description = currentStep.afterNavDescription;
    }
    if (targetElement && currentStep.afterNavTarget) {
        displayStep.target = currentStep.afterNavTarget;
    }

    if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });

        setTimeout(() => {
            let finalTarget = targetElement;
            for (const selector of targetSelectors) {
                const el = document.querySelector(selector);
                if (el) {
                    const rect = el.getBoundingClientRect();
                    if (rect.width > 0 && rect.height > 0) {
                        finalTarget = el;
                        break;
                    }
                }
            }

            tutorial.createSpotlight(finalTarget);

            setTimeout(() => {
                tutorial.createModal(displayStep, stepIndex);
            }, 400);
        }, 1000);
    } else {
        setTimeout(() => {
            tutorial.createModal(displayStep, stepIndex);
        }, 100);
    }

    tutorial.escHandler = (e) => {
        if (e.key === 'Escape') {
            tutorial.end();
        }
    };
    document.addEventListener('keydown', tutorial.escHandler);
}

async function initOnboarding() {
    const state = await getOnboardingState();

    if (state.onboardingComplete) {
        clearTutorialState();

        const seen = state.whatsNewSeen === EXTENSION_VERSION;

        if (!state.lastVersion) {
            await setLastVersion();
            return;
        }

        if (!seen) {
            const features = VERSION_FEATURES[EXTENSION_VERSION];
            if (features && features.length > 0) {
                createWhatsNewModal(features);
            } else {
                await setLastVersion();
            }
        }
        return;
    }

    const savedState = getTutorialState();
    if (savedState) {
        resumeTutorial(savedState);
        return;
    }

    runTutorial();
}

setTimeout(initOnboarding, 50);
