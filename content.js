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
const PAYOUT_BLESSED_MULTIPLIER = 1.2;
const PAYOUT_CURSED_MULTIPLIER = 0.5;
const COMMUNITY_VOTES_SHIP_CUTOFF_ISO = '2026-02-23T20:41:00.000Z';
const COMMUNITY_VOTES_SHIP_CUTOFF_TS = new Date(COMMUNITY_VOTES_SHIP_CUTOFF_ISO).getTime();
const CURRENT_SCALE_ESTIMATE_MIN_VOTES = 12;
const LEGACY_VOTE_SCALE_MAX = 6;
const CURRENT_VOTE_SCALE_MAX = 9;
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
const SHIP_PAYOUT_CACHE_KEY = 'flavortown_ship_payouts_v2';
const SHIP_PAYOUT_CACHE_TTL = 15 * 60 * 1000;
const SHIP_TIME_CACHE_KEY = 'flavortown_ship_minutes';
const SHIP_TIME_CACHE_TTL = 24 * 60 * 60 * 1000;
const PROJECT_UNSHIPPED_CACHE_KEY = 'flavortown_project_unshipped';
const PROJECT_UNSHIPPED_CACHE_TTL = 24 * 60 * 60 * 1000;
const PROJECT_UNSHIPPED_CLEANUP_KEY = 'flavortown_project_unshipped_cleanup';
const DEVLOG_DRAFT_KEY_PREFIX = 'flavortown_devlog_draft_v1:';
const DEVLOG_DRAFT_AUTOSAVE_KEY = 'flavortown_devlog_draft_autosave';
const SHOP_WISHLIST_ORDERED_ITEMS_KEY = 'flavortown_shop_wishlist_ordered';
const LOCAL_STORAGE_SYNC_ENABLED_KEY = 'flavortownLocalStorageSyncEnabled';
const LOGPHEUS_SYNC_ENABLED_KEY = 'flavortownLogpheusGoalSyncEnabled';
const LOCAL_STORAGE_SYNC_KEY = 'flavortownLocalStorageSync';
const LOCAL_STORAGE_IMPORT_KEY = 'flavortownLocalStorageImport';
const LOCAL_STORAGE_SYNC_UPDATED_AT_KEY = 'flavortownLocalStorageSyncUpdatedAt';
const LOCAL_STORAGE_SYNC_MAX_BYTES = 90000;
const LOGPHEUS_API_BASE_URL = 'https://logpheus.gizzy.gay';
const LOGPHEUS_GOALS_ENDPOINT = `${LOGPHEUS_API_BASE_URL}/api/v1/goals`;
const LOGPHEUS_LAST_SYNC_SIGNATURE_KEY = 'flavortown_logpheus_sync_signature';
const LOGPHEUS_LAST_SYNC_AT_KEY = 'flavortown_logpheus_sync_at';
const GAMBLORPHEUS_LOTTERIES_ENDPOINT = 'https://gamblorpheus.hackclub.com/api/lotteries';
const GAMBLORPHEUS_LOTTERY_CACHE_KEY = 'flavortown_gamblorpheus_lottery_cache';
const GAMBLORPHEUS_LOTTERY_CACHE_TTL = 90 * 1000;
const LOTTERY_SHOP_ITEM_ID = '200';
const SHOP_RECENTLY_ADDED_COLLAPSED_KEY = 'flavortown_shop_recently_added_collapsed';
const CHANGELOG_DISMISS_KEY = 'flavortown_changelog_dismissed';
const CHANGELOG_OVERRIDE_KEY = 'flavortown_changelog_override';
const CHANGELOG_CACHE_KEY = 'flavortown_changelog_cache';
const CHANGELOG_FORMAT_KEY = 'flavortown_changelog_format';
const GITHUB_API_KEY_KEY = 'flavortown_github_api_key';
const CHANGELOG_FORMATS = [
    { id: 'subject', label: 'Commit message' },
    { id: 'subject-hash', label: 'Commit message (hash)' },
    { id: 'hash-subject', label: '(hash) Commit message' },
    { id: 'hash', label: '(hash) only' }
];
const CHANGELOG_CACHE_TTL = 10 * 60 * 1000;
const CHANGELOG_MAX_COMMITS = 200;
const CHANGELOG_RECENT_COMMITS = 10;
const COMMAND_PALETTE_SHORTCUT_KEY = 'flavortownCommandPaletteShortcut';
const DEFAULT_COMMAND_PALETTE_SHORTCUT = /Mac|iPhone|iPad|iPod/i.test(navigator.platform || navigator.userAgent)
    ? 'Cmd+K'
    : 'Ctrl+K';
const PROJECT_TODO_DISABLED_KEY = 'flavortown_project_todos_disabled';
const PROJECT_TODO_HIDDEN_KEY = 'flavortown_project_todos_hidden';
const USERS_API_RATE_LIMIT = 5;
const USERS_API_RATE_WINDOW_MS = 60 * 1000;
const USERS_PROJECT_STATS_CONCURRENCY = 3;
const USERS_TOTAL_PAGES_CACHE_KEY = 'flavortown_users_total_pages';
const LOCAL_STORAGE_SYNC_KEYS = [
    'flavortown_progress_mode',
    'flavortown_projection_mode',
    'flavortown_projection_source',
    'shop_wishlist',
    'shop_wishlist_priorities',
    'shop_wishlist_order',
    'flavortown_shop_wishlist_ordered',
    'flavortown_project_stats',
    'flavortown_tutorial_state',
    'flavortown_cmd_recent',
    'flavortown_heatmap_data',
    'flavortown_known_achievements',
    'flavortown_last_achievement_check',
    'bg-color-theme',
    'use-inline-devlog',
    'known_achievements',
    'auto_achievements_last_claim'
];
let localStorageSyncTimer = null;
let isApplyingLocalStorageSync = false;
let localStorageSyncEnabled = false;
let localStoragePatched = false;
let logpheusSyncEnabled = false;
let logpheusWatcherInterval = null;
let logpheusDebounceTimer = null;
let logpheusRetryTimer = null;
let logpheusLastWishlistRaw = null;
let logpheusLastSyncedSignature = null;
let logpheusSyncInFlight = false;
let logpheusSyncQueued = false;
let logpheusSyncFailureCount = 0;
let logpheusCorsBlockedUntil = 0;
let logpheusCorsWarned = false;
let commandPaletteShortcut = parseShortcutString(DEFAULT_COMMAND_PALETTE_SHORTCUT);
const usersProjectMinutesCache = new Map();
const usersAggregateCache = new Map();
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

function getGithubApiKey() {
    return localStorage.getItem(GITHUB_API_KEY_KEY) || '';
}

function setGithubApiKey(key) {
    if (key) {
        localStorage.setItem(GITHUB_API_KEY_KEY, key);
        browserAPI.storage.sync.set({ [GITHUB_API_KEY_KEY]: key });
    } else {
        localStorage.removeItem(GITHUB_API_KEY_KEY);
        browserAPI.storage.sync.remove(GITHUB_API_KEY_KEY);
    }
}

function loadGithubApiKey() {
    const cached = localStorage.getItem(GITHUB_API_KEY_KEY);
    if (cached) return;
    browserAPI.storage.sync.get([GITHUB_API_KEY_KEY], (result) => {
        const syncKey = result?.[GITHUB_API_KEY_KEY];
        if (syncKey) {
            localStorage.setItem(GITHUB_API_KEY_KEY, syncKey);
        }
    });
}

function parseShortcutString(value) {
    if (!value || typeof value !== 'string') return null;
    const parts = value
        .split('+')
        .map(part => part.trim())
        .filter(Boolean);
    if (parts.length < 2) return null;

    const key = normalizeShortcutKey(parts[parts.length - 1]);
    if (!key) return null;

    const mods = parts.slice(0, -1).map(part => part.toLowerCase());
    const shortcut = {
        key,
        ctrlKey: mods.includes('ctrl') || mods.includes('control'),
        metaKey: mods.includes('cmd') || mods.includes('command') || mods.includes('meta'),
        altKey: mods.includes('alt') || mods.includes('option'),
        shiftKey: mods.includes('shift')
    };

    if (!shortcut.ctrlKey && !shortcut.metaKey && !shortcut.altKey && !shortcut.shiftKey) {
        return null;
    }

    shortcut.display = value;
    return shortcut;
}

function normalizeShortcutKey(key) {
    if (!key) return '';
    if (key.length === 1) return key.toLowerCase();
    if (key.toLowerCase() === 'space') return 'space';
    return key.toLowerCase();
}

function setCommandPaletteShortcut(value) {
    commandPaletteShortcut = parseShortcutString(value) || parseShortcutString(DEFAULT_COMMAND_PALETTE_SHORTCUT);
}

function matchesCommandPaletteShortcut(event) {
    if (!commandPaletteShortcut) return false;
    if (event.ctrlKey !== !!commandPaletteShortcut.ctrlKey) return false;
    if (event.metaKey !== !!commandPaletteShortcut.metaKey) return false;
    if (event.altKey !== !!commandPaletteShortcut.altKey) return false;
    if (event.shiftKey !== !!commandPaletteShortcut.shiftKey) return false;

    const key = normalizeShortcutKey(event.key === ' ' ? 'space' : event.key);
    return key === commandPaletteShortcut.key;
}

function initCommandPaletteShortcut() {
    browserAPI.storage.sync.get([COMMAND_PALETTE_SHORTCUT_KEY], (result) => {
        setCommandPaletteShortcut(result[COMMAND_PALETTE_SHORTCUT_KEY]);
    });

    browserAPI.storage.onChanged.addListener((changes, area) => {
        if (area !== 'sync') return;
        if (changes[COMMAND_PALETTE_SHORTCUT_KEY]) {
            setCommandPaletteShortcut(changes[COMMAND_PALETTE_SHORTCUT_KEY].newValue);
        }
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

function hexToHue(hex) {
    hex = hex.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16) / 255;
    const g = parseInt(hex.substring(2, 4), 16) / 255;
    const b = parseInt(hex.substring(4, 6), 16) / 255;
    
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const diff = max - min;
    
    let hue = 0;
    if (diff !== 0) {
        switch (max) {
            case r: hue = ((g - b) / diff + (g < b ? 6 : 0)) / 6; break;
            case g: hue = ((b - r) / diff + 2) / 6; break;
            case b: hue = ((r - g) / diff + 4) / 6; break;
        }
    }
    
    return Math.round(hue * 360);
}

function migrateCustomColorsToNewFormat(colors) {
    if (!colors) return {};
    
    if (colors['bg-base'] || colors['text-primary']) {
        return colors;
    }
    
    const migrated = {};
    if (colors['background']) migrated['bg-base'] = colors['background'];
    if (colors['surface']) migrated['bg-surface'] = colors['surface'];
    if (colors['surface-alt']) migrated['surface-hover'] = colors['surface-alt'];
    if (colors['text']) migrated['text-primary'] = colors['text'];
    if (colors['text-secondary']) migrated['text-secondary'] = colors['text-secondary'];
    if (colors['text-muted']) migrated['text-muted'] = colors['text-muted'];
    if (colors['accent']) migrated['accent'] = colors['accent'];
    if (colors['accent-alt']) migrated['accent-alt'] = colors['accent-alt'];
    if (colors['border']) migrated['border'] = colors['border'];
    if (colors['success']) migrated['success'] = colors['success'];
    if (colors['error']) migrated['error'] = colors['error'];
    
    return migrated;
}

function applyTheme(theme, customColors, catppuccinAccent = 'mauve') {
    customColors = migrateCustomColorsToNewFormat(customColors);
    document.documentElement.dataset.flavortownTheme = theme || 'default';
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
        const link = document.createElement('link');
        link.id = 'flavortown-theme';
        link.rel = 'stylesheet';
        link.href = browserAPI.runtime.getURL('themes/custom.css');
        document.head.appendChild(link);
        
        const style = document.createElement('style');
        style.id = 'flavortown-custom-vars';
        
        const colorMapping = {
            'bg-base': '--custom-bg-base',
            'bg-mantle': '--custom-bg-mantle',
            'bg-surface': '--custom-bg-surface',
            'surface-hover': '--custom-surface-hover',
            'surface-active': '--custom-surface-active',
            'text-primary': '--custom-text-primary',
            'text-secondary': '--custom-text-secondary',
            'text-muted': '--custom-text-muted',
            'text-on-accent': '--custom-text-on-accent',
            'accent': '--custom-accent',
            'accent-hover': '--custom-accent-hover',
            'accent-alt': '--custom-accent-alt',
            'btn-primary-bg': '--custom-btn-primary-bg',
            'btn-primary-text': '--custom-btn-primary-text',
            'success': '--custom-success',
            'error': '--custom-error',
            'border': '--custom-border'
        };
        
        let css = ':root {\n';
        
        for (const [key, cssVar] of Object.entries(colorMapping)) {
            const value = customColors[key];
            if (value) {
                css += `    ${cssVar}: ${value} !important;\n`;
            }
        }
        
        const accent = customColors['accent'] || '#cba6f7';
        const accentHue = hexToHue(accent);
        css += `    --custom-accent-hue: ${accentHue}deg !important;\n`;
        
        if (customColors['bg-base']) {
            css += `    --color-cream: ${customColors['bg-base']} !important;\n`;
            css += `    --color-background-color: ${customColors['bg-base']} !important;\n`;
        }
        if (customColors['bg-mantle']) {
            css += `    --color-cream-dark: ${customColors['bg-mantle']} !important;\n`;
        }
        if (customColors['bg-surface']) {
            css += `    --color-surface: ${customColors['bg-surface']} !important;\n`;
        }
        if (customColors['accent']) {
            css += `    --color-brown: ${customColors['accent']} !important;\n`;
            css += `    --color-accent: ${customColors['accent']} !important;\n`;
        }
        if (customColors['text-primary']) {
            css += `    --color-text-primary: ${customColors['text-primary']} !important;\n`;
        }
        if (customColors['text-secondary']) {
            css += `    --color-text-secondary: ${customColors['text-secondary']} !important;\n`;
            css += `    --color-brown-light: ${customColors['text-secondary']} !important;\n`;
            css += `    --color-brown-dark: ${customColors['text-secondary']} !important;\n`;
        }
        if (customColors['text-muted']) {
            css += `    --color-text-muted: ${customColors['text-muted']} !important;\n`;
        }
        if (customColors['border']) {
            css += `    --color-border: ${customColors['border']} !important;\n`;
        }
        if (customColors['success']) {
            css += `    --color-green: ${customColors['success']} !important;\n`;
        }
        if (customColors['error']) {
            css += `    --color-red: ${customColors['error']} !important;\n`;
        }
        
        css += '}\n';
        
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
    --ctp-accent: #b4befe !important;
    --ctp-accent-hue: 190deg !important;
    --ctp-mauve: #b4befe !important;
    --ctp-accent-text: #313244 !important;
    --flavortown-on-accent: #313244 !important;
    --flavortown-toolbar-icon: #313244 !important;
    --flavortown-toolbar-icon-active: #313244 !important;
    --color-brown: #b4befe !important;
    --color-accent: #b4befe !important;
    --ft-votes-accent: #b4befe !important;
    --flavortown-preview-accent: #b4befe !important;
    --flavortown-doomscroll-btn-color: #b4befe !important;
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
    if (message.type === 'CLEAR_CACHES') {
        const keys = message.keys || [];
        
        keys.forEach(key => {
            localStorage.removeItem(key);
        });
        
        const allKeys = Object.keys(localStorage);
        allKeys.forEach(key => {
            if (key.startsWith('flavortown-github-repos-')) {
                localStorage.removeItem(key);
            }
        });
        
        window.__shipPayoutsCache = null;
        window.__changelogDataCache = null;
        window.__heatmapDataCache = null;
        window.__fundingChartsDataCache = null;
        
        sendResponse({ success: true, cleared: keys.length });
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

function mergeVoteBreakdownMetaIntoScores() {
    const entries = document.querySelectorAll('.post__votes-breakdown .post__vote-entry');
    if (!entries.length) return;

    entries.forEach((entry) => {
        if (entry.dataset.flavortownVotesMerged === 'true') return;

        const rows = entry.querySelectorAll(':scope > p');
        if (!rows.length) return;

        const metaRow = rows[0];
        const scoreRow = rows[1] || rows[0];

        const normalize = (value) => (value || '').replace(/\s+/g, ' ').trim();
        const scoreText = normalize(scoreRow.textContent);
        const metaRowText = normalize(metaRow.textContent);
        const voterMatch = metaRowText.match(/Voter\s*#(\d+)/i);
        const voteLabel = voterMatch ? `Vote #${voterMatch[1]}` : '';
        let metaText = metaRowText
            .replace(/^Voter\s*#\d+\s*/i, '')
            .replace(/^[·•\-\s]+/, '')
            .trim();

        const mergedPieces = [voteLabel, metaText, scoreText].filter(Boolean);
        const mergedText = mergedPieces.join(' · ');

        if (scoreRow !== metaRow) {
            if (mergedText) {
                scoreRow.textContent = mergedText;
            }
            metaRow.remove();
        } else if (mergedText) {
            scoreRow.textContent = mergedText;
        }

        scoreRow.classList.add('flavortown-vote-meta-scores');
        entry.dataset.flavortownVotesMerged = 'true';
    });
}

function makeVoteReasonMultiline() {
    if (!window.location.pathname.startsWith('/votes/new')) return;

    const reasonInput = document.querySelector('input#vote_reason');
    if (!reasonInput) return;

    const textarea = document.createElement('textarea');
    const attrsToSkip = new Set(['type', 'value']);
    for (const attrName of reasonInput.getAttributeNames()) {
        if (attrsToSkip.has(attrName)) continue;
        textarea.setAttribute(attrName, reasonInput.getAttribute(attrName) || '');
    }

    textarea.value = reasonInput.value || reasonInput.getAttribute('value') || '';
    textarea.rows = Math.max(3, Number(textarea.getAttribute('rows')) || 3);

    if (!textarea.classList.contains('input__field--textarea')) {
        textarea.classList.add('input__field--textarea');
    }

    reasonInput.replaceWith(textarea);
}

async function addShipStats() {
    if (!/\/projects\/\d+$/.test(window.location.pathname)) {
        return;
    }

    const shipPosts = document.querySelectorAll('article.post--ship, .post--ship');
    if (!shipPosts.length) return;

    const projectIdMatch = window.location.pathname.match(/\/projects\/(\d+)/);
    const projectId = projectIdMatch ? projectIdMatch[1] : null;
    let paidShipMinutes = 0;
    let paidCookies = 0;
    let paidRate = null;

    const cachedUnshipped = projectId ? getCachedProjectUnshipped(projectId) : null;
    if (cachedUnshipped) {
        paidShipMinutes = cachedUnshipped.paidShipMinutes || 0;
        paidCookies = cachedUnshipped.paidCookies || 0;
    }
    if ((!paidShipMinutes || !paidCookies) && projectId) {
        const stats = await fetchProjectUnshippedStats(projectId);
        if (stats) {
            paidShipMinutes = stats.paidShipMinutes || 0;
            paidCookies = stats.paidCookies || 0;
        }
    }
    if (paidShipMinutes > 0 && paidCookies > 0) {
        paidRate = getMultiplierFromCookies(paidCookies, paidShipMinutes / 60);
    }

    const buildPayoutItem = (label, value) => {
        const item = document.createElement('div');
        item.className = 'post__payout-item';
        item.innerHTML = `
            <span class="post__payout-label">${label}:</span>
            <span class="post__payout-value">${value}</span>
        `;
        return item;
    };

    shipPosts.forEach((shipPost) => {
        let footer = shipPost.querySelector('.post__payout-footer');
        if (footer && footer.dataset.flavortownExtras === 'true') return;

        let totalMinutes = 0;
        let devlogCount = 0;

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

        const shipTimestamp = getShipPostTimestamp(shipPost);

        const { cookiesValue, hoursValue, multiplierValue } = getShipFooterPayoutMetrics(footer);

        const isPaidShip = cookiesValue && cookiesValue > 0;
        if (isPaidShip && footer) {
            const rate = multiplierValue || (hoursValue && cookiesValue ? getMultiplierFromCookies(cookiesValue, hoursValue) : null);
            const estimate = rate ? buildShipVoteEstimate(shipPost, rate, shipTimestamp) : null;
            const isExactEstimate = estimate?.source === 'exact-votes';
            const useScaledEstimateDisplay = isExactEstimate || (Number(estimate?.scaleMax) > LEGACY_VOTE_SCALE_MAX);
            const overallScoreText = estimate?.overallScore
                ? (useScaledEstimateDisplay
                    ? formatScoreWithScale(estimate.overallScore, estimate.scaleMax || 9)
                    : formatScoreValue(estimate.overallScore))
                : '--';

            footer.appendChild(buildPayoutItem('Devlogs', devlogCount ? String(devlogCount) : '--'));
            footer.appendChild(buildPayoutItem('Percentile', rate ? formatCookiePercentileLine(rate) : '--'));
            footer.appendChild(buildPayoutItem('Avg stars', estimate?.overallScore ? `★ ${overallScoreText}` : '--'));

            if (estimate?.categories) {
                const formatCategory = (label, value) => {
                    const scoreText = useScaledEstimateDisplay
                        ? formatScoreWithScale(value, estimate.scaleMax || 9)
                        : formatScoreValue(value);
                    return `${label} ★${scoreText}`;
                };
                const mediansText = [
                    formatCategory('Originality', estimate.categories.originality),
                    formatCategory('Technical', estimate.categories.technical),
                    formatCategory('Usability', estimate.categories.usability),
                    formatCategory('Storytelling', estimate.categories.storytelling)
                ].join(' • ');
                footer.appendChild(buildPayoutItem(isExactEstimate ? 'Medians' : 'Est. medians', mediansText));
            }
        } else {
            const estimateHours = totalMinutes > 0
                ? (totalMinutes / 60)
                : (hoursValue && hoursValue > 0 ? hoursValue : 0);
            if (estimateHours <= 0) {
                if (totalMinutes > 0) {
                    shipPost.dataset.flavortownShipMinutes = String(totalMinutes);
                }
                if (footer) {
                    footer.dataset.flavortownExtras = 'true';
                }
                return;
            }

            const avgRate = getAverageMultiplierFallback();
            const estimatedRate = [multiplierValue, paidRate, avgRate]
                .find(rate => rate && isFinite(rate) && rate > 0);
            const adjustedEstimatedRate = applySidebarVoteVerdictToRate(estimatedRate);

            if (!adjustedEstimatedRate) {
                if (totalMinutes > 0) {
                    shipPost.dataset.flavortownShipMinutes = String(totalMinutes);
                }
                if (footer) {
                    footer.dataset.flavortownExtras = 'true';
                }
                return;
            }

            const estimatedCookies = Math.round(adjustedEstimatedRate * estimateHours);
            if (estimatedCookies > 0) {
                if (!footer) {
                    footer = document.createElement('div');
                    footer.className = 'post__payout-footer';
                    const body = shipPost.querySelector('.post__body');
                    if (body) {
                        body.insertAdjacentElement('afterend', footer);
                    } else {
                        shipPost.appendChild(footer);
                    }
                }

                footer.querySelectorAll('.flavortown-unpaid-ship-est').forEach(el => el.remove());
                const usesFallbackAverage = !multiplierValue
                    && !(paidRate && isFinite(paidRate) && paidRate > 0);
                const estimateLabel = usesFallbackAverage ? 'Est payout (avg)' : 'Est payout';
                const estimateItem = buildPayoutItem(estimateLabel, `~${estimatedCookies.toLocaleString()} cookies`);
                estimateItem.classList.add('flavortown-unpaid-ship-est');
                footer.appendChild(estimateItem);
            }
        }

        if (totalMinutes > 0) {
            shipPost.dataset.flavortownShipMinutes = String(totalMinutes);
        }

        if (footer) {
            footer.dataset.flavortownExtras = 'true';
        }
    });
}

function ensureShipStatsReady() {
    if (!/\/projects\/\d+$/.test(window.location.pathname)) return;
    const shipPosts = document.querySelectorAll('article.post--ship, .post--ship');
    if (!shipPosts.length) return;
    addShipStats();
}

function formatMinutesCompact(totalMinutes) {
    const minutes = Math.max(0, Math.round(totalMinutes || 0));
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0 && mins > 0) return `${hours}h ${mins}m`;
    if (hours > 0) return `${hours}h`;  
    return `${mins}m`;
}

let unshippedEstimateRunId = 0;

function shouldShowUnshippedCookieEstimate(shipButton) {
    if (!shipButton) return false;
    const labelText = (shipButton.textContent || '').replace(/\s+/g, ' ').trim().toLowerCase();
    if (!labelText) return true;
    return !labelText.includes('follow');
}

async function addUnshippedCookieEstimate(attempt = 0) {
    if (!/\/projects\/\d+$/.test(window.location.pathname)) return;

    const wrapper = document.getElementById('ship-btn-wrapper')
        || document.getElementById('ship-btn-wrapper-banner')
        || document.querySelector('.project-show-card__ship-wrapper');
    if (!wrapper) {
        if (attempt < 5) setTimeout(() => addUnshippedCookieEstimate(attempt + 1), 250);
        return;
    }

    const shipButton = wrapper.querySelector('.project-show-card__ship-btn');
    if (!shipButton) {
        if (attempt < 5) setTimeout(() => addUnshippedCookieEstimate(attempt + 1), 250);
        return;
    }

    shipButton.querySelectorAll('.flavortown-unshipped-cookie-est').forEach(el => el.remove());

    if (!shouldShowUnshippedCookieEstimate(shipButton)) return;

    const runId = ++unshippedEstimateRunId;

    const unshippedMinutes = getUnshippedMinutesSinceLastShip();
    if (unshippedMinutes <= 0) return;

    const projectName = getCurrentProjectName();
    if (!projectName) return;

    const projectIdMatch = window.location.pathname.match(/\/projects\/(\d+)/);
    const projectId = projectIdMatch ? projectIdMatch[1] : null;

    let stats = projectId ? getCachedProjectUnshipped(projectId) : null;
    if ((!stats || !stats.paidShipMinutes || !stats.paidCookies) && projectId) {
        stats = await fetchProjectUnshippedStats(projectId);
    }

    const paidMinutes = stats?.paidShipMinutes || 0;
    const paidHours = Number(stats?.paidShipHours) || 0;

    const pagePayouts = getShipPayoutsFromProjectPage();
    const payouts = pagePayouts.length ? pagePayouts : await fetchShipPayouts();

    const projectPayouts = payouts.filter(payout => projectNameMatches(payout.projectName, projectName));
    const payoutCookies = projectPayouts.reduce((sum, payout) => sum + (payout.amount || 0), 0);
    const baselineCookies = payoutCookies > 0 ? payoutCookies : (stats?.paidCookies || 0);
    let rate = getProjectRateFromCookies(baselineCookies, paidHours, paidMinutes);
    if (!rate || !isFinite(rate) || rate <= 0) {
        rate = getAverageMultiplierFallback();
    }

    const projectedRate = applySidebarVoteVerdictToRate(rate);
    if (!projectedRate || !isFinite(projectedRate) || projectedRate <= 0) return;

    const projectedCookies = Math.round(projectedRate * (unshippedMinutes / 60));

    if (!projectedCookies || !isFinite(projectedCookies) || projectedCookies <= 0) return;

    if (runId !== unshippedEstimateRunId || !shipButton.isConnected) return;
    shipButton.querySelectorAll('.flavortown-unshipped-cookie-est').forEach(el => el.remove());
    if (!shouldShowUnshippedCookieEstimate(shipButton)) return;

    const estimate = document.createElement('span');
    estimate.className = 'flavortown-unshipped-cookie-est';
    estimate.textContent = `🍪 ~${projectedCookies.toLocaleString()}`;
    shipButton.appendChild(estimate);
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

function isCookieTotalStat(el) {
    const text = (el?.textContent || '').trim();
    if (!text) return false;
    return text.includes('🍪') || /^cookies?\b/i.test(text);
}

function getShipPayoutsFromProjectPage() {
    if (!/\/projects\/\d+$/.test(window.location.pathname)) return [];

    const projectName = getCurrentProjectName();
    if (!projectName) return [];

    const payouts = [];
    const shipPosts = document.querySelectorAll('article.post--ship, .post--ship');
    shipPosts.forEach(shipPost => {
        const footer = shipPost.querySelector('.post__payout-footer');
        if (!footer) return;

        const payoutItems = Array.from(footer.querySelectorAll('.post__payout-item'));
        const cookiesItem = payoutItems.find(entry => {
            const labelText = entry.querySelector('.post__payout-label')?.textContent || '';
            return labelText.toLowerCase().includes('cookies');
        });
        if (!cookiesItem) return;

        const cookiesText = cookiesItem.querySelector('.post__payout-value')?.textContent?.trim() || '';
        const amount = parseNumberFromText(cookiesText);
        if (!amount || amount <= 0) return;

        const timeEl = shipPost.querySelector('.post__time');
        let stableDate = null;
        if (timeEl) {
            const timeTag = timeEl.matches('time') ? timeEl : timeEl.querySelector('time');
            const datetime = timeTag?.getAttribute('datetime');
            if (datetime) {
                const parsed = new Date(datetime);
                if (!isNaN(parsed.getTime())) stableDate = parsed;
            }
            if (!stableDate) {
                const timestamp = timeEl.getAttribute('data-timestamp') || timeEl.dataset?.timestamp;
                if (timestamp) {
                    const parsedTs = parseInt(timestamp, 10);
                    if (!isNaN(parsedTs)) {
                        const normalizedTs = parsedTs < 1000000000000 ? parsedTs * 1000 : parsedTs;
                        const parsed = new Date(normalizedTs);
                        if (!isNaN(parsed.getTime())) stableDate = parsed;
                    }
                }
            }
        }

        const date = stableDate || (timeEl ? parseDateFromTimeElement(timeEl) : new Date());
        if (!date || isNaN(date.getTime())) return;

        const relativeKey = (timeEl?.textContent || '').trim().toLowerCase();
        const dedupeKey = stableDate
            ? `${normalizeProjectName(projectName)}|${amount}|${stableDate.toISOString()}`
            : `${normalizeProjectName(projectName)}|${amount}|rel:${relativeKey}`;

        payouts.push({ projectName, amount, date, cacheable: !!stableDate, dedupeKey });
    });

    return payouts;
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
        return parsed || {};
    } catch (e) {
        return {};
    }
}

function writeProjectRepoMap(data) {
    try {
        localStorage.setItem(PROJECT_REPO_MAP_KEY, JSON.stringify(data || {}));
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
        const projectsUrl = toAbsoluteUrl('/projects');
        if (!projectsUrl) return [];
        const res = await fetch(projectsUrl, { credentials: 'include' });
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

async function getRepoUrlForProjectName(projectName, forceRefresh = false) {
    if (!projectName) return null;
    const normalizedName = normalizeProjectName(projectName);
    const repoMap = readProjectRepoMap();
    
    if (!forceRefresh && repoMap[normalizedName]) {
        return repoMap[normalizedName];
    }

    const projects = await fetchProjectsIndexData();
    const match = projects.find(project => normalizeProjectName(project.name) === normalizedName);
    if (!match || !match.href) return null;

    try {
        const projectUrl = toAbsoluteUrl(match.href);
        if (!projectUrl) return null;
        const res = await fetch(projectUrl, { credentials: 'include' });
        if (!res.ok) return null;
        const html = await res.text();
        const doc = new DOMParser().parseFromString(html, 'text/html');
        const owner = getProjectOwnerNameFromDocument(doc);
        const currentUser = getCurrentUserName();
        if (owner && currentUser && normalizeOwnerName(owner) !== normalizeOwnerName(currentUser)) return null;
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
        const profileUrl = toAbsoluteUrl(href);
        if (!profileUrl) return null;
        const res = await fetch(profileUrl, { credentials: 'include' });
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

    const repoMap = readProjectRepoMap();

    for (const project of sorted) {
        try {
            const projectUrl = toAbsoluteUrl(project.href);
            if (!projectUrl) continue;
            const res = await fetch(projectUrl, { credentials: 'include' });
            if (!res.ok) continue;
            const html = await res.text();
            const doc = new DOMParser().parseFromString(html, 'text/html');
            const owner = getProjectOwnerNameFromDocument(doc);
            if (currentUser && (!owner || normalizeOwnerName(owner) !== normalizeOwnerName(currentUser))) continue;

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
        const apiKey = getGithubApiKey();
        const headers = { 'Accept': 'application/vnd.github+json' };
        if (apiKey) {
            headers['Authorization'] = `Bearer ${apiKey}`;
        }
        const res = await fetch(`https://api.github.com/users/${username}/repos?per_page=100&sort=updated`, {
            headers
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

async function getHackatimeProjectFields(projectId) {
    const extractFields = (root) => {
        const container = root.querySelector('.hackatime-project-selector') || root;
        const candidates = Array.from(container.querySelectorAll(
            'input[name*="hackatime" i], select[name*="hackatime" i], textarea[name*="hackatime" i], input[id*="hackatime" i], select[id*="hackatime" i], textarea[id*="hackatime" i]'
        ));
        const fields = [];

        candidates.forEach(el => {
            const name = el.getAttribute('name');
            if (!name) return;

            const tag = el.tagName.toLowerCase();
            const type = (el.getAttribute('type') || '').toLowerCase();
            if ((type === 'checkbox' || type === 'radio') && !el.checked) return;

            let value = el.value;
            if (value === '' || value === null || value === undefined) {
                const attrValue = el.getAttribute('value');
                if (tag === 'select') {
                    const selectedOption = el.querySelector('option[selected]');
                    if (selectedOption) {
                        value = selectedOption.getAttribute('value') || selectedOption.textContent || '';
                    }
                }
                if ((value === '' || value === null || value === undefined) && attrValue !== null) {
                    value = attrValue;
                }
            }

            if (value === '' || value === null || value === undefined) return;
            fields.push({ name, value });
        });

        if (!fields.length) {
            const selector = root.querySelector('.hackatime-project-selector');
            if (selector) {
                const attributeName = selector.getAttribute('data-attribute') || 'hackatime_project_ids';
                const initialValue = selector.getAttribute('data-hackatime-project-selector-initial-projects-value') || '';
                let parsed = null;
                if (initialValue) {
                    try {
                        const cleaned = initialValue.replace(/&quot;/g, '"').replace(/&amp;/g, '&');
                        parsed = JSON.parse(cleaned);
                    } catch (e) {
                        parsed = null;
                    }
                }

                if (Array.isArray(parsed)) {
                    parsed.forEach(entry => {
                        const id = entry && (entry.id || entry.project_id);
                        if (!id) return;
                        fields.push({ name: `project[${attributeName}][]`, value: String(id) });
                    });
                }
            }
        }

        return fields;
    };

    const fromPage = extractFields(document);
    if (fromPage.length) return fromPage;

    if (!projectId) return [];

    try {
        const response = await fetch(`/projects/${projectId}/edit`, { credentials: 'include' });
        if (!response.ok) return [];
        const html = await response.text();
        const doc = new DOMParser().parseFromString(html, 'text/html');
        return extractFields(doc);
    } catch (e) {
        return [];
    }
}

async function updateProjectLinks(projectId, { repoUrl, demoUrl }) {
    if (!projectId || (!repoUrl && !demoUrl)) return false;
    const token = getCsrfToken();
    if (!token) return false;

    const hackatimeFields = await getHackatimeProjectFields(projectId);
    const params = new URLSearchParams();
    params.append('_method', 'patch');
    if (repoUrl) params.append('project[repo_url]', repoUrl);
    if (demoUrl) params.append('project[demo_url]', demoUrl);
    hackatimeFields.forEach(field => {
        params.append(field.name, field.value);
    });

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

async function initProjectTodos() {
    if (!/\/projects\/\d+$/.test(window.location.pathname)) return;
    if (document.querySelector('.flavortown-todo-card')) return;

    if (!isProjectOwnedByCurrentUser()) return;

    const projectIdMatch = window.location.pathname.match(/\/projects\/(\d+)/);
    const projectId = projectIdMatch ? projectIdMatch[1] : null;
    const projectName = getCurrentProjectName();
    if (!projectId || !projectName) return;

    const isDisabled = localStorage.getItem(PROJECT_TODO_DISABLED_KEY) === 'true';
    if (isDisabled) return;

    let hiddenMap = {};
    try {
        hiddenMap = JSON.parse(localStorage.getItem(PROJECT_TODO_HIDDEN_KEY) || '{}');
    } catch (e) {
        hiddenMap = {};
    }
    if (hiddenMap && hiddenMap[projectId]) return;

    const showCard = document.querySelector('.project-show-card');
    const insertTarget = showCard || document.querySelector('.projects-show__container') || document.body;

    const card = document.createElement('details');
    card.className = 'flavortown-todo-card';
    card.innerHTML = `
        <summary class="flavortown-todo-summary">
            <div class="flavortown-todo-summary-title">Tasks</div>
            <div class="flavortown-todo-summary-counts"><span class="flavortown-todo-summary-pill"><span class="flavortown-todo-count" data-status="all">0</span></span></div>
            <span class="flavortown-todo-summary-toggle">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"></polyline></svg>
            </span>
        </summary>
        <div class="flavortown-todo-body">
            <div class="flavortown-todo-input-row">
                <input type="text" class="flavortown-todo-input-field" placeholder="Add a task..." />
                <button type="button" class="flavortown-todo-btn flavortown-todo-btn--icon flavortown-todo-btn--primary" data-action="add" title="Add task">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                </button>
            </div>
            <div class="flavortown-todo-tabs" data-role="tabs">
                <button type="button" class="flavortown-todo-tab is-active" data-status="all">All<span class="flavortown-todo-count" data-status="all">0</span></button>
                <button type="button" class="flavortown-todo-tab" data-status="todo">Todo<span class="flavortown-todo-count" data-status="todo">0</span></button>
                <button type="button" class="flavortown-todo-tab" data-status="in_progress">In Progress<span class="flavortown-todo-count" data-status="in_progress">0</span></button>
                <button type="button" class="flavortown-todo-tab" data-status="done">Done<span class="flavortown-todo-count" data-status="done">0</span></button>
            </div>
            <div class="flavortown-todo-list" data-role="list"></div>
            <div class="flavortown-todo-footer">
                <div class="flavortown-todo-meta" data-role="meta">Synced just now</div>
                <div class="flavortown-todo-actions">
                    <button type="button" class="flavortown-todo-btn flavortown-todo-btn--icon" data-action="refresh" title="Refresh">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 4 23 10 17 10"></polyline><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path></svg>
                    </button>
                    <button type="button" class="flavortown-todo-btn flavortown-todo-btn--icon" data-action="hide" title="Hide for this project">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
                    </button>
                    <button type="button" class="flavortown-todo-btn flavortown-todo-btn--icon flavortown-todo-btn--danger" data-action="disable" title="Disable tasks">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>
                    </button>
                </div>
            </div>
        </div>
    `;

    if (showCard && showCard.parentNode) {
        showCard.insertAdjacentElement('afterend', card);
    } else if (insertTarget?.appendChild) {
        insertTarget.appendChild(card);
    }

    const input = card.querySelector('.flavortown-todo-input-field');
    const addBtn = card.querySelector('[data-action="add"]');
    const refreshBtn = card.querySelector('[data-action="refresh"]');
    const disableBtn = card.querySelector('[data-action="disable"]');
    const hideBtn = card.querySelector('[data-action="hide"]');
    const listEl = card.querySelector('[data-role="list"]');
    const tabs = Array.from(card.querySelectorAll('.flavortown-todo-tab'));
    const counts = Array.from(card.querySelectorAll('.flavortown-todo-count'));
    const metaEl = card.querySelector('[data-role="meta"]');

    let currentFilter = 'all';
    let items = [];

    const renderCounts = () => {
        const totals = { all: 0, todo: 0, in_progress: 0, done: 0 };
        items.forEach(item => {
            const key = item.status || 'todo';
            if (totals[key] !== undefined) totals[key] += 1;
        });
        totals.all = items.length;
        counts.forEach(countEl => {
            const key = countEl.dataset.status;
            countEl.textContent = totals[key] || 0;
        });
    };

    const renderList = () => {
        listEl.innerHTML = '';
        const visible = currentFilter === 'all'
            ? sortTodos(items)
            : sortTodos(items).filter(item => item.status === currentFilter);
        if (!visible.length) {
            const empty = document.createElement('div');
            empty.className = 'flavortown-todo-empty';
            empty.textContent = currentFilter === 'done' ? 'No completed tasks yet.' : 'No tasks yet.';
            listEl.appendChild(empty);
            return;
        }

        visible.forEach(item => {
            const row = document.createElement('div');
            row.className = `flavortown-todo-item${item.status === 'done' ? ' is-done' : ''}`;

            const textWrap = document.createElement('div');
            textWrap.className = 'flavortown-todo-text-wrap';

            const title = document.createElement('span');
            title.className = 'flavortown-todo-text';
            title.textContent = item.title;
            textWrap.appendChild(title);

            if (item.source === 'slack') {
                const badge = document.createElement('span');
                badge.className = 'flavortown-todo-badge';
                const displayName = item.slackDisplayName || item.slackUsername || 'Slack';
                badge.textContent = displayName;
                badge.title = `Added by ${displayName} via Slack`;
                textWrap.appendChild(badge);
            }

            const controls = document.createElement('div');
            controls.className = 'flavortown-todo-controls';

            const statusSelect = createTodoStatusSelect(item.status, false);
            statusSelect.addEventListener('change', () => {
                const next = statusSelect.value;
                items = items.map(entry => entry.id === item.id ? { ...entry, status: next, updatedAt: new Date().toISOString() } : entry);
                writeProjectTodos(projectId, items);
                renderCounts();
                renderList();
            });
            controls.appendChild(statusSelect);

            if (item.source !== 'slack') {
                const deleteBtn = document.createElement('button');
                deleteBtn.type = 'button';
                deleteBtn.className = 'flavortown-todo-delete';
                deleteBtn.textContent = '×';
                deleteBtn.addEventListener('click', () => {
                    items = items.filter(entry => entry.id !== item.id);
                    writeProjectTodos(projectId, items);
                    renderCounts();
                    renderList();
                });
                controls.appendChild(deleteBtn);
            }

            row.appendChild(textWrap);
            row.appendChild(controls);
            listEl.appendChild(row);
        });
    };

    const renderTabs = () => {
        tabs.forEach(tab => {
            tab.classList.toggle('is-active', tab.dataset.status === currentFilter);
        });
        renderCounts();
        renderList();
    };

    const addTask = () => {
        const value = (input.value || '').trim();
        if (!value) return;
        const newItem = {
            id: generateLocalTodoId(),
            title: value,
            status: 'todo',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            source: 'local'
        };
        items = [newItem, ...items];
        writeProjectTodos(projectId, items);
        input.value = '';
        currentFilter = 'all';
        renderTabs();
    };

    const syncSlackTasks = async (force = false) => {
        const local = readProjectTodos(projectId);
        const localItems = Array.isArray(local.items) ? local.items : [];
        const slackData = await fetchTodoData(force);
        if (!slackData) {
            items = localItems;
            if (metaEl) {
                metaEl.textContent = 'Slack sync unavailable • showing cached tasks';
            }
            renderTabs();
            return;
        }

        const tasks = extractTodoTasks(slackData);
        const filtered = filterSlackTodosForProject(tasks, projectId, projectName, getCurrentUserName());
        const slackItems = filtered.map(normalizeSlackTodo).filter(Boolean);

        if (!slackItems.length) {
            items = localItems;
            if (metaEl) {
                metaEl.textContent = 'Slack sync empty • showing cached tasks';
            }
            renderTabs();
            return;
        }

        items = mergeSlackTodos(localItems, slackItems, { preserveMissingSlack: !force });
        writeProjectTodos(projectId, items, Date.now());
        if (metaEl) {
            const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            metaEl.textContent = `Local tasks + Slack tasks • synced ${time}`;
        }
        renderTabs();
    };

    addBtn?.addEventListener('click', addTask);
    input?.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            addTask();
        }
    });

    refreshBtn?.addEventListener('click', () => syncSlackTasks(true));

    disableBtn?.addEventListener('click', () => {
        localStorage.setItem(PROJECT_TODO_DISABLED_KEY, 'true');
        card.remove();
    });

    hideBtn?.addEventListener('click', () => {
        let nextHidden = {};
        try {
            nextHidden = JSON.parse(localStorage.getItem(PROJECT_TODO_HIDDEN_KEY) || '{}');
        } catch (e) {
            nextHidden = {};
        }
        nextHidden[projectId] = true;
        localStorage.setItem(PROJECT_TODO_HIDDEN_KEY, JSON.stringify(nextHidden));
        card.remove();
    });

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            currentFilter = tab.dataset.status || 'all';
            renderTabs();
        });
    });

    const local = readProjectTodos(projectId);
    items = Array.isArray(local.items) ? local.items : [];
    const openItems = items.filter(item => item.status !== 'done');
    if (openItems.length) {
        card.open = true;
    }
    renderTabs();
    await syncSlackTasks(false);
    if (!items.length) {
        const fallback = readProjectTodos(projectId);
        if (Array.isArray(fallback.items) && fallback.items.length) {
            items = fallback.items;
            renderTabs();
        }
    }
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

function extractUndevloggedMinutesFromDocument(doc) {
    if (!doc) return 0;

    const previewStrong = doc.querySelector('.projects-new__time-preview strong');
    const previewContainer = doc.querySelector('.projects-new__time-preview');
    const previewText = (previewStrong?.textContent || previewContainer?.textContent || '').trim();
    if (!previewText) return 0;

    return Math.max(0, Math.round(parseDurationToMinutes(previewText)));
}

function parseNumberFromText(text) {
    if (!text) return null;
    const match = text.replace(/,/g, '').match(/[\d.]+/);
    return match ? parseFloat(match[0]) : null;
}

function getShipFooterPayoutMetrics(footer) {
    const empty = { cookiesValue: 0, hoursValue: 0, multiplierValue: 0 };
    if (!footer) return empty;

    const payoutItems = Array.from(footer.querySelectorAll('.post__payout-item'));
    const getPayoutValue = (labelMatch) => {
        const item = payoutItems.find(entry => {
            const labelText = entry.querySelector('.post__payout-label')?.textContent || '';
            return labelText.toLowerCase().includes(labelMatch);
        });
        return item ? item.querySelector('.post__payout-value')?.textContent?.trim() : '';
    };

    return {
        hoursValue: parseNumberFromText(getPayoutValue('hours')) || 0,
        cookiesValue: parseNumberFromText(getPayoutValue('cookies')) || 0,
        multiplierValue: parseNumberFromText(getPayoutValue('multiplier')) || 0
    };
}

function formatCookieRate(rate) {
    if (rate === null || rate === undefined || !isFinite(rate)) return '--';
    return rate
        .toFixed(2)
        .replace(/\.00$/, '')
        .replace(/(\.\d)0$/, '$1');
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

function getCanonicalPaidShipHours(shipPost, payoutMetrics = null) {
    const metrics = payoutMetrics || getShipFooterPayoutMetrics(shipPost?.querySelector('.post__payout-footer'));
    const cookiesValue = Number(metrics?.cookiesValue) || 0;
    const hoursValue = Number(metrics?.hoursValue) || 0;
    const multiplierValue = Number(metrics?.multiplierValue) || 0;

    if (multiplierValue > 0 && cookiesValue > 0) {
        return cookiesValue / multiplierValue;
    }

    if (hoursValue > 0) {
        return hoursValue;
    }

    const cachedMinutes = Number(shipPost?.dataset?.flavortownShipMinutes) || 0;
    if (cachedMinutes > 0) {
        return cachedMinutes / 60;
    }

    if (shipPost) {
        const collectedMinutes = collectShipMinutesFromPost(shipPost);
        if (collectedMinutes > 0) {
            return collectedMinutes / 60;
        }
    }

    return 0;
}

function getProjectRateFromCookies(totalCookies, paidHours = 0, paidMinutes = 0) {
    if (!Number.isFinite(totalCookies) || totalCookies <= 0) return null;

    if (Number.isFinite(paidHours) && paidHours > 0) {
        const rateFromHours = getMultiplierFromCookies(totalCookies, paidHours);
        if (rateFromHours && isFinite(rateFromHours) && rateFromHours > 0) {
            return rateFromHours;
        }
    }

    if (Number.isFinite(paidMinutes) && paidMinutes > 0) {
        return getMultiplierFromCookies(totalCookies, paidMinutes / 60);
    }

    return null;
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

function medianOfSorted(values) {
    if (!Array.isArray(values) || values.length === 0) return null;
    const sorted = [...values]
        .map(value => Number(value))
        .filter(value => isFinite(value))
        .sort((a, b) => a - b);
    if (!sorted.length) return null;
    const mid = Math.floor(sorted.length / 2);
    if (sorted.length % 2 === 1) return sorted[mid];
    return (sorted[mid - 1] + sorted[mid]) / 2;
}

function averageNumbers(values) {
    if (!Array.isArray(values) || values.length === 0) return null;
    const nums = values.map(value => Number(value)).filter(value => isFinite(value));
    if (!nums.length) return null;
    return nums.reduce((sum, value) => sum + value, 0) / nums.length;
}

function estimateMultiplierFromPercentile(percentile) {
    if (percentile === null || percentile === undefined || !isFinite(percentile)) return null;
    const p = clampValue(percentile / 100, 0, 1);
    if (!isFinite(p)) return null;

    if (!isFinite(PAYOUT_LOW_DOLLARS_PER_HOUR)
        || !isFinite(PAYOUT_HIGH_DOLLARS_PER_HOUR)
        || !isFinite(PAYOUT_GAMMA)
        || !isFinite(PAYOUT_TICKETS_PER_DOLLAR)
        || PAYOUT_HIGH_DOLLARS_PER_HOUR < PAYOUT_LOW_DOLLARS_PER_HOUR
        || PAYOUT_TICKETS_PER_DOLLAR <= 0) {
        return null;
    }

    const hourlyRate = PAYOUT_LOW_DOLLARS_PER_HOUR
        + (PAYOUT_HIGH_DOLLARS_PER_HOUR - PAYOUT_LOW_DOLLARS_PER_HOUR) * Math.pow(p, PAYOUT_GAMMA);
    if (!isFinite(hourlyRate) || hourlyRate <= 0) return null;
    return hourlyRate * PAYOUT_TICKETS_PER_DOLLAR;
}

function getAverageMultiplierFallback() {
    return estimateMultiplierFromPercentile(50);
}

function estimatePercentileFromNormalizedScore(scoreNorm) {
    if (!isFinite(scoreNorm)) return null;
    const target = clampValue(scoreNorm, 0, 1);

    let bestX = 0;
    let bestDiff = Infinity;
    const steps = 800;
    for (let i = 0; i <= steps; i++) {
        const x = i / steps;
        const y = polynomialCurve(x, SCORE_CURVE_COEFFS);
        const diff = Math.abs(y - target);
        if (diff < bestDiff) {
            bestDiff = diff;
            bestX = x;
        }
    }

    const corrected = hillCurve(bestX, PERCENTILE_HILL_SHAPE);
    return clampValue(corrected * 100, 0.01, 99.99);
}

function getSafeVoteScaleMax(scaleMax, fallback = LEGACY_VOTE_SCALE_MAX) {
    const numericScale = Number(scaleMax);
    return Number.isFinite(numericScale) && numericScale > 1 ? numericScale : fallback;
}

function convertScoreScale(score, fromScale = LEGACY_VOTE_SCALE_MAX, toScale = LEGACY_VOTE_SCALE_MAX) {
    if (!isFinite(score)) return null;
    const safeFrom = getSafeVoteScaleMax(fromScale, LEGACY_VOTE_SCALE_MAX);
    const safeTo = getSafeVoteScaleMax(toScale, LEGACY_VOTE_SCALE_MAX);
    const normalized = clampValue((score - 1) / (safeFrom - 1), 0, 1);
    return 1 + normalized * (safeTo - 1);
}

function estimatePercentileFromOverallScore(overallScore, scaleMax = LEGACY_VOTE_SCALE_MAX) {
    if (!overallScore || !isFinite(overallScore)) return null;
    const safeScale = getSafeVoteScaleMax(scaleMax, LEGACY_VOTE_SCALE_MAX);
    const scoreNorm = clampValue((overallScore - 1) / (safeScale - 1), 0, 1);
    return estimatePercentileFromNormalizedScore(scoreNorm);
}

function parseVoteEntryScores(entry) {
    if (!entry) return null;
    const text = Array.from(entry.querySelectorAll(':scope > p'))
        .map(node => (node.textContent || '').trim())
        .filter(Boolean)
        .join(' · ')
        .replace(/\s+/g, ' ')
        .trim();
    if (!text) return null;

    const patterns = [
        { key: 'originality', regex: /Originality\s+([0-9]+(?:\.[0-9]+)?)\s*\/\s*([0-9]+(?:\.[0-9]+)?)/i },
        { key: 'technical', regex: /Technical(?:ity)?\s+([0-9]+(?:\.[0-9]+)?)\s*\/\s*([0-9]+(?:\.[0-9]+)?)/i },
        { key: 'usability', regex: /Usability\s+([0-9]+(?:\.[0-9]+)?)\s*\/\s*([0-9]+(?:\.[0-9]+)?)/i },
        { key: 'storytelling', regex: /Storytelling\s+([0-9]+(?:\.[0-9]+)?)\s*\/\s*([0-9]+(?:\.[0-9]+)?)/i }
    ];

    const scores = {};
    const scales = [];

    patterns.forEach(({ key, regex }) => {
        const match = text.match(regex);
        if (!match) return;
        const value = Number(match[1]);
        const scale = Number(match[2]);
        if (!isFinite(value) || !isFinite(scale) || scale <= 0) return;
        scores[key] = value;
        scales.push(scale);
    });

    if (!Object.keys(scores).length) return null;

    const scaleMax = medianOfSorted(scales) || Math.max(...scales, 0) || 9;
    return { scores, scaleMax };
}

function buildExactVoteEstimateFromShipPost(shipPost, fallbackMultiplier = null) {
    if (!shipPost) return null;

    const breakdown = shipPost.querySelector('details.post__votes-breakdown');
    if (!breakdown) return null;

    const entries = Array.from(breakdown.querySelectorAll('.post__vote-entry'));
    if (!entries.length) return null;

    const categoryScores = {
        originality: [],
        technical: [],
        usability: [],
        storytelling: []
    };
    const scaleCandidates = [];

    entries.forEach((entry) => {
        const parsed = parseVoteEntryScores(entry);
        if (!parsed) return;

        scaleCandidates.push(parsed.scaleMax);
        Object.entries(parsed.scores).forEach(([key, value]) => {
            if (!Array.isArray(categoryScores[key])) return;
            if (!isFinite(value)) return;
            categoryScores[key].push(value);
        });
    });

    const categories = {
        originality: medianOfSorted(categoryScores.originality),
        technical: medianOfSorted(categoryScores.technical),
        usability: medianOfSorted(categoryScores.usability),
        storytelling: medianOfSorted(categoryScores.storytelling)
    };

    const overallScore = averageNumbers(Object.values(categories).filter(value => value !== null));
    if (!isFinite(overallScore)) return null;

    const scaleMax = medianOfSorted(scaleCandidates) || 9;
    const percentile = (fallbackMultiplier && isFinite(fallbackMultiplier) && fallbackMultiplier > 0)
        ? estimatePercentileFromMultiplier(fallbackMultiplier)
        : estimatePercentileFromOverallScore(overallScore, scaleMax);
    const inferredMultiplier = (fallbackMultiplier && isFinite(fallbackMultiplier) && fallbackMultiplier > 0)
        ? fallbackMultiplier
        : estimateMultiplierFromPercentile(percentile);
    const hasPayoutSignal = !!(fallbackMultiplier && isFinite(fallbackMultiplier) && fallbackMultiplier > 0);

    return {
        source: 'exact-votes',
        voteCount: entries.length,
        hasPayoutSignal,
        scaleMax,
        percentile,
        overallScore,
        categories,
        multiplier: inferredMultiplier
    };
}

function buildShipVoteEstimate(shipPost, multiplier, shipTimestamp) {
    const isCurrentScaleShip = Number.isFinite(shipTimestamp) && shipTimestamp >= COMMUNITY_VOTES_SHIP_CUTOFF_TS;
    if (isCurrentScaleShip) {
        const exact = buildExactVoteEstimateFromShipPost(shipPost, multiplier);
        if (exact) return exact;
    }

    if (!multiplier || !isFinite(multiplier)) return null;
    return buildVoteEstimate(multiplier, {
        source: isCurrentScaleShip ? 'current-multiplier' : 'legacy-multiplier',
        scaleMax: isCurrentScaleShip ? CURRENT_VOTE_SCALE_MAX : LEGACY_VOTE_SCALE_MAX
    });
}

function hasReliableCurrentScaleEstimate(estimate, minVotes = CURRENT_SCALE_ESTIMATE_MIN_VOTES) {
    if (!estimate || estimate.source !== 'exact-votes') return false;
    const voteCount = Number(estimate.voteCount);
    if (!Number.isFinite(voteCount)) return false;

    if (voteCount >= minVotes) return true;

    const hasPayoutSignal = !!estimate.hasPayoutSignal;
    if (hasPayoutSignal && voteCount >= (minVotes - 1)) return true;

    return false;
}

function pickReliableCurrentScaleEstimate(...candidates) {
    for (const candidate of candidates) {
        if (hasReliableCurrentScaleEstimate(candidate)) return candidate;
    }
    return null;
}

function parseShipPostDebugTimestamp(shipPost) {
    if (!shipPost) return NaN;

    const debugInfo = shipPost.querySelector('.debug-info');
    if (!debugInfo) return NaN;

    const text = (debugInfo.textContent || '').replace(/\s+/g, ' ').trim();
    if (!text) return NaN;

    const createdMatch = text.match(/created:\s*(\d{4}-\d{2}-\d{2})\s+(\d{2}:\d{2}:\d{2})/i);
    if (!createdMatch) return NaN;

    const datePart = createdMatch[1];
    const timePart = createdMatch[2];
    const isoLike = `${datePart}T${timePart}`;

    const parsedLocal = new Date(isoLike);
    if (!isNaN(parsedLocal.getTime())) return parsedLocal.getTime();

    const parsedUtc = new Date(`${isoLike}Z`);
    if (!isNaN(parsedUtc.getTime())) return parsedUtc.getTime();

    return NaN;
}

function getShipPostTimestamp(shipPost) {
    if (!shipPost) return NaN;
    const timeEl = shipPost.querySelector('.post__time');
    const directTimestamp = getTimeElementTimestampForCutoff(timeEl);
    if (Number.isFinite(directTimestamp)) return directTimestamp;

    const debugTimestamp = parseShipPostDebugTimestamp(shipPost);
    if (Number.isFinite(debugTimestamp)) return debugTimestamp;

    const relativeDate = parseDateFromTimeElement(timeEl);
    if (relativeDate && !isNaN(relativeDate.getTime())) {
        const relativeTimestamp = relativeDate.getTime();
        const cutoffSafetyWindowMs = 24 * 60 * 60 * 1000;
        if (Math.abs(relativeTimestamp - COMMUNITY_VOTES_SHIP_CUTOFF_TS) > cutoffSafetyWindowMs) {
            return relativeTimestamp;
        }
    }

    return NaN;
}

function aggregateExactShipEstimates(estimates) {
    if (!Array.isArray(estimates) || !estimates.length) return null;

    const overallScore = averageNumbers(estimates.map(estimate => estimate?.overallScore));
    if (!isFinite(overallScore)) return null;

    const categoryKeys = ['originality', 'technical', 'usability', 'storytelling'];
    const categories = categoryKeys.reduce((result, key) => {
        result[key] = averageNumbers(estimates.map(estimate => estimate?.categories?.[key]));
        return result;
    }, {});

    const percentile = averageNumbers(estimates.map(estimate => estimate?.percentile));
    let multiplier = averageNumbers(estimates.map(estimate => estimate?.multiplier));
    if ((!multiplier || !isFinite(multiplier)) && percentile && isFinite(percentile)) {
        multiplier = estimateMultiplierFromPercentile(percentile);
    }

    return {
        source: 'exact-votes',
        scaleMax: 9,
        shipCount: estimates.length,
        voteCount: estimates.reduce((sum, estimate) => {
            const voteCount = Number(estimate?.voteCount);
            return sum + (isFinite(voteCount) && voteCount > 0 ? voteCount : 0);
        }, 0),
        hasPayoutSignal: estimates.some(estimate => !!estimate?.hasPayoutSignal),
        percentile: percentile && isFinite(percentile) ? percentile : null,
        multiplier: multiplier && isFinite(multiplier) ? multiplier : null,
        overallScore,
        categories
    };
}

function getCurrentScaleProjectEstimateFromShipPosts(shipPosts) {
    const posts = Array.isArray(shipPosts) ? shipPosts : Array.from(shipPosts || []);
    if (!posts.length) {
        return {
            legacyShipCount: 0,
            currentShipCount: 0,
            exactCurrentShipCount: 0,
            currentScaleEstimate: null,
            usesMixedCurrentOnly: false
        };
    }

    let legacyShipCount = 0;
    let currentShipCount = 0;
    const exactCurrentEstimates = [];

    posts.forEach((shipPost) => {
        const shipTimestamp = getShipPostTimestamp(shipPost);
        if (!Number.isFinite(shipTimestamp)) return;

        if (shipTimestamp < COMMUNITY_VOTES_SHIP_CUTOFF_TS) {
            legacyShipCount += 1;
            return;
        }

        currentShipCount += 1;
        const footer = shipPost.querySelector('.post__payout-footer');
        const { cookiesValue, hoursValue, multiplierValue } = getShipFooterPayoutMetrics(footer);
        const rate = multiplierValue || (hoursValue && cookiesValue ? getMultiplierFromCookies(cookiesValue, hoursValue) : null);
        const estimate = buildShipVoteEstimate(shipPost, rate, shipTimestamp);
        if (estimate?.source === 'exact-votes') {
            exactCurrentEstimates.push(estimate);
        }
    });

    const currentScaleEstimate = aggregateExactShipEstimates(exactCurrentEstimates);
    const usesMixedCurrentOnly = legacyShipCount > 0 && currentShipCount > 0 && !!currentScaleEstimate;

    return {
        legacyShipCount,
        currentShipCount,
        exactCurrentShipCount: exactCurrentEstimates.length,
        currentScaleEstimate,
        usesMixedCurrentOnly
    };
}

function inferProjectFallbackScaleMax(estimateMeta = {}) {
    const currentShipCount = Number(estimateMeta?.currentShipCount) || 0;
    const legacyShipCount = Number(estimateMeta?.legacyShipCount) || 0;
    if (currentShipCount > 0 && legacyShipCount === 0) {
        return CURRENT_VOTE_SCALE_MAX;
    }
    return LEGACY_VOTE_SCALE_MAX;
}

function formatScoreWithScale(score, scaleMax) {
    const formatted = formatScoreValue(score);
    if (formatted === '--') return formatted;
    if (!scaleMax || !isFinite(scaleMax) || scaleMax <= 0) return formatted;
    const formattedScale = formatScoreValue(scaleMax);
    return `${formatted}/${formattedScale}`;
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

function estimateOverallScoreFromMultiplier(multiplier, scaleMax = LEGACY_VOTE_SCALE_MAX) {
    if (!multiplier || !isFinite(multiplier)) return null;
    const safeScale = getSafeVoteScaleMax(scaleMax, LEGACY_VOTE_SCALE_MAX);
    const hourlyRate = multiplier / PAYOUT_TICKETS_PER_DOLLAR;
    const normalized = (hourlyRate - PAYOUT_LOW_DOLLARS_PER_HOUR) / (PAYOUT_HIGH_DOLLARS_PER_HOUR - PAYOUT_LOW_DOLLARS_PER_HOUR);
    const clamped = clampValue(normalized, 0, 1);
    const pRaw = Math.pow(clamped, 1 / PAYOUT_GAMMA);
    const scoreNorm = polynomialCurve(pRaw, SCORE_CURVE_COEFFS);
    const score = 1 + (safeScale - 1) * scoreNorm;
    return clampValue(score, 1, safeScale);
}

function estimateCategoryScoresFromOverall(overallScore, percentile, scaleMax = LEGACY_VOTE_SCALE_MAX) {
    if (!overallScore || !isFinite(overallScore)) return null;
    const safeScale = getSafeVoteScaleMax(scaleMax, LEGACY_VOTE_SCALE_MAX);
    const legacyOverall = convertScoreScale(overallScore, safeScale, LEGACY_VOTE_SCALE_MAX);
    if (!legacyOverall || !isFinite(legacyOverall)) return null;

    const p = clampValue((percentile || 0) / 100, 0, 1);
    const scoreNorm = clampValue((legacyOverall - 1) / (LEGACY_VOTE_SCALE_MAX - 1), 0, 1);
    const originality = lerpRange(CATEGORY_SCORE_RANGES.originality.min, CATEGORY_SCORE_RANGES.originality.max, scoreNorm);
    const technical = lerpRange(CATEGORY_SCORE_RANGES.technical.min, CATEGORY_SCORE_RANGES.technical.max, scoreNorm);
    const usabilityBase = lerpRange(CATEGORY_SCORE_RANGES.usability.min, CATEGORY_SCORE_RANGES.usability.max, scoreNorm);
    const usability = usabilityBase + (CATEGORY_SCORE_RANGES.usability.percentileSlope || 0) * p;
    const storytelling = lerpRange(CATEGORY_SCORE_RANGES.storytelling.min, CATEGORY_SCORE_RANGES.storytelling.max, scoreNorm);

    const legacyScores = { originality, technical, usability, storytelling };
    if (safeScale === LEGACY_VOTE_SCALE_MAX) {
        return legacyScores;
    }

    return Object.fromEntries(
        Object.entries(legacyScores).map(([key, value]) => [key, convertScoreScale(value, LEGACY_VOTE_SCALE_MAX, safeScale)])
    );
}

function buildVoteEstimate(multiplier, options = {}) {
    const scaleMax = getSafeVoteScaleMax(options.scaleMax, LEGACY_VOTE_SCALE_MAX);
    const source = options.source || (scaleMax > LEGACY_VOTE_SCALE_MAX ? 'current-multiplier' : 'legacy-multiplier');
    const percentile = estimatePercentileFromMultiplier(multiplier);
    if (!percentile) return null;
    const overallScore = estimateOverallScoreFromMultiplier(multiplier, scaleMax);
    if (!overallScore) return null;
    const categoriesRaw = estimateCategoryScoresFromOverall(overallScore, percentile, scaleMax);
    if (!categoriesRaw) {
        return {
            source,
            scaleMax,
            percentile,
            overallScore,
            categories: null
        };
    }

    return {
        source,
        scaleMax,
        percentile,
        overallScore,
        categories: {
            originality: roundToHalf(clampValue(categoriesRaw.originality, 1, scaleMax)),
            technical: roundToHalf(clampValue(categoriesRaw.technical, 1, scaleMax)),
            usability: roundToHalf(clampValue(categoriesRaw.usability, 1, scaleMax)),
            storytelling: roundToHalf(clampValue(categoriesRaw.storytelling, 1, scaleMax))
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

    const isExact = options.exact || estimate.source === 'exact-votes';
    const scaleMax = options.scaleMax || estimate.scaleMax || (isExact ? 9 : 6);
    const useScaledDisplay = isExact || (Number(scaleMax) > LEGACY_VOTE_SCALE_MAX);
    const overallText = useScaledDisplay
        ? formatScoreWithScale(estimate.overallScore, scaleMax)
        : formatScoreValue(estimate.overallScore);

    const scorePill = document.createElement('h5');
    scorePill.className = 'flavortown-vote-estimate-pill';
    scorePill.textContent = `${isExact ? '' : '~ '}avg ⭐ ${overallText}`;

    let accordion = null;
    if (estimate.categories) {
        const formatCategory = (value) => (
            useScaledDisplay
                ? formatScoreWithScale(value, scaleMax)
                : formatScoreValue(value)
        );
        accordion = document.createElement('details');
        accordion.className = 'flavortown-vote-estimate-accordion';
        accordion.innerHTML = `
            <summary class="flavortown-vote-estimate-accordion__toggle">${isExact ? 'Category medians' : 'Est. category medians'}</summary>
            <div class="flavortown-vote-estimate-accordion__categories">
                <span>Originality ★${formatCategory(estimate.categories.originality)}</span>
                <span>Technical ★${formatCategory(estimate.categories.technical)}</span>
                <span>Usability ★${formatCategory(estimate.categories.usability)}</span>
                <span>Storytelling ★${formatCategory(estimate.categories.storytelling)}</span>
            </div>
        `;
    }

    return { scorePill, accordion };
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

function mergeShipPayouts(existingPayouts, newPayouts) {
    const merged = [];
    const seen = new Set();

    [...(existingPayouts || []), ...(newPayouts || [])].forEach(payout => {
        if (!payout || !payout.projectName || !payout.date || !payout.amount) return;
        const dateIso = payout.date instanceof Date ? payout.date.toISOString() : new Date(payout.date).toISOString();
        const key = payout.dedupeKey || `${normalizeProjectName(payout.projectName)}|${payout.amount}|${dateIso}`;
        if (seen.has(key)) return;
        seen.add(key);
        merged.push({
            projectName: payout.projectName,
            amount: Number(payout.amount) || 0,
            date: payout.date instanceof Date ? payout.date : new Date(payout.date),
            dedupeKey: payout.dedupeKey
        });
    });

    return merged.filter(entry => entry.amount > 0 && entry.date && !isNaN(entry.date.getTime()));
}


async function fetchShipPayouts() {
    const cached = readShipPayoutCache() || [];
    const pagePayouts = getShipPayoutsFromProjectPage();

    if (!pagePayouts.length) {
        return cached;
    }

    const cacheablePagePayouts = pagePayouts.filter(payout => payout.cacheable);
    if (cacheablePagePayouts.length) {
        const mergedCache = mergeShipPayouts(cached, cacheablePagePayouts);
        if (mergedCache.length) {
            writeShipPayoutCache(mergedCache);
        }
    }
    return mergeShipPayouts(cached, pagePayouts);
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

let projectBoardStatsRefreshTimer = null;
function scheduleProjectBoardStatsRefresh() {
    if (!window.location.pathname.endsWith('/projects')) return;
    if (projectBoardStatsRefreshTimer) {
        clearTimeout(projectBoardStatsRefreshTimer);
    }
    projectBoardStatsRefreshTimer = setTimeout(() => {
        initProjectBoardStats();
    }, 250);
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

function getSidebarVoteVerdictType() {
    const verdictEl = document.querySelector('#sidebar-verdict-cookie, .vote-verdict-cookie');
    if (!verdictEl) return 'neutral';

    const label = (verdictEl.getAttribute('aria-label') || '').toLowerCase();
    if (label.includes('blessed')) return 'blessed';
    if (label.includes('cursed')) return 'cursed';

    const imgSrc = (verdictEl.querySelector('img')?.getAttribute('src') || '').toLowerCase();
    if (imgSrc.includes('blessed-cookie')) return 'blessed';
    if (imgSrc.includes('cursed-cookie')) return 'cursed';

    const className = (verdictEl.className || '').toLowerCase();
    if (className.includes('blessed')) return 'blessed';
    if (className.includes('cursed')) return 'cursed';

    return 'neutral';
}

function getSidebarVoteVerdictMultiplier() {
    const verdictType = getSidebarVoteVerdictType();
    if (verdictType === 'blessed') return PAYOUT_BLESSED_MULTIPLIER;
    if (verdictType === 'cursed') return PAYOUT_CURSED_MULTIPLIER;
    return 1;
}

function applySidebarVoteVerdictToRate(rate) {
    if (!Number.isFinite(rate) || rate <= 0) return null;
    const multiplier = getSidebarVoteVerdictMultiplier();
    if (!Number.isFinite(multiplier) || multiplier <= 0) return rate;
    return rate * multiplier;
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

function normalizeUsernameForComparison(name) {
    if (!name) return '';
    return name
        .toLowerCase()
        .replace(/[._\-\s]+/g, '')
        .replace(/[^a-z0-9]/g, '')
        .trim();
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

function setCachedProjectUnshipped(projectId, entry, ownerName = null) {
    if (!projectId || !entry) return;
    const currentUser = getCurrentUserName();
    const ownerMatch = ownerName && currentUser
        ? normalizeOwnerName(currentUser) === normalizeOwnerName(ownerName)
        : false;
    const allowWhenOwnerUnknown = ownerName && !currentUser;
    if (!ownerMatch && !allowWhenOwnerUnknown && !isProjectOwnedByCurrentUser()) return;
    const cache = readProjectUnshippedCache();
    cache[projectId] = {
        totalMinutes: Math.max(0, entry.totalMinutes || 0),
        paidShipMinutes: Math.max(0, entry.paidShipMinutes || 0),
        paidShipHours: Math.max(0, Number(entry.paidShipHours) || 0),
        paidCookies: Math.max(0, entry.paidCookies || 0),
        unshippedMinutes: Math.max(0, entry.unshippedMinutes || 0),
        undevloggedMinutes: Math.max(0, Number(entry.undevloggedMinutes) || 0),
        singleCurrentScaleShip: !!entry.singleCurrentScaleShip,
        exactSingleShipEstimate: entry.exactSingleShipEstimate || null,
        legacyShipCount: Math.max(0, Number(entry.legacyShipCount) || 0),
        currentShipCount: Math.max(0, Number(entry.currentShipCount) || 0),
        exactCurrentShipCount: Math.max(0, Number(entry.exactCurrentShipCount) || 0),
        currentScaleEstimate: entry.currentScaleEstimate || null,
        usesMixedCurrentOnly: !!entry.usesMixedCurrentOnly,
        updatedAt: Date.now()
    };
    writeProjectUnshippedCache(cache);
    scheduleProjectBoardStatsRefresh();
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

function getShopGoalProjectionStats(currentCookies) {
    const { totalUnshippedMinutes, totalPaidMinutes, totalPaidCookies } = getAggregateUnshippedStats();

    const baseAverageRate = totalPaidMinutes > 0 ? totalPaidCookies / (totalPaidMinutes / 60) : null;
    const averageRate = applySidebarVoteVerdictToRate(baseAverageRate);
    const hasAverageRate = Number.isFinite(averageRate) && averageRate > 0;

    const averageProjectedCookies = hasAverageRate && totalUnshippedMinutes > 0
        ? Math.round(currentCookies + (averageRate * (totalUnshippedMinutes / 60)))
        : null;

    const cache = readProjectUnshippedCache();
    let projectExtraCookies = 0;
    let projectMinutesCovered = 0;
    let fallbackMinutes = 0;

    Object.values(cache).forEach((entry) => {
        if (!entry) return;
        const unshippedMinutes = Math.max(0, Number(entry.unshippedMinutes) || 0);
        if (unshippedMinutes <= 0) return;

        const paidMinutes = Math.max(0, Number(entry.paidShipMinutes) || 0);
        const paidCookies = Math.max(0, Number(entry.paidCookies) || 0);

        if (paidMinutes > 0 && paidCookies > 0) {
            const projectRate = applySidebarVoteVerdictToRate(paidCookies / (paidMinutes / 60));
            if (Number.isFinite(projectRate) && projectRate > 0) {
                projectExtraCookies += projectRate * (unshippedMinutes / 60);
                projectMinutesCovered += unshippedMinutes;
                return;
            }
        }

        fallbackMinutes += unshippedMinutes;
    });

    if (fallbackMinutes > 0 && hasAverageRate) {
        projectExtraCookies += averageRate * (fallbackMinutes / 60);
        projectMinutesCovered += fallbackMinutes;
    }

    const hasProjectRate = projectMinutesCovered > 0 && Number.isFinite(projectExtraCookies) && projectExtraCookies >= 0;
    const projectRate = hasProjectRate ? projectExtraCookies / (projectMinutesCovered / 60) : null;
    const projectProjectedCookies = hasProjectRate
        ? Math.round(currentCookies + projectExtraCookies)
        : null;

    return {
        totalUnshippedMinutes,
        averageRate: hasAverageRate ? averageRate : null,
        averageProjectedCookies,
        projectRate,
        projectProjectedCookies,
        projectFallbackMinutes: fallbackMinutes,
        hasAverageProjection: Number.isFinite(averageProjectedCookies),
        hasProjectProjection: Number.isFinite(projectProjectedCookies)
    };
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

async function fetchUndevloggedMinutesForProject(projectId) {
    if (!projectId) return 0;

    try {
        const response = await fetch(`/projects/${projectId}/devlogs/new`, {
            credentials: 'include',
            headers: { 'X-Flavortown-Ext-135': 'true' }
        });
        if (!response.ok) return 0;

        const html = await response.text();
        const doc = new DOMParser().parseFromString(html, 'text/html');
        return extractUndevloggedMinutesFromDocument(doc);
    } catch (e) {
        return 0;
    }
}

async function fetchProjectUnshippedStats(projectId) {
    if (!projectId) return null;

    try {
        const projectUrl = toAbsoluteUrl(`/projects/${projectId}`);
        if (!projectUrl) {
            return null;
        }
        const response = await fetch(projectUrl, { credentials: 'include' });
        if (!response.ok) {
            return null;
        }

        const html = await response.text();
        const doc = new DOMParser().parseFromString(html, 'text/html');
        const totalMinutes = getTotalDevlogMinutesFromDocument(doc);
        const ownerName = getProjectOwnerNameFromDocument(doc);
        const currentUser = getCurrentUserName();
        const isOwnerProject = !!(ownerName && currentUser
            && normalizeOwnerName(ownerName) === normalizeOwnerName(currentUser));
        const shipPosts = Array.from(doc.querySelectorAll('article.post--ship, .post--ship'));
        const projectVoteMeta = getCurrentScaleProjectEstimateFromShipPosts(shipPosts);
        let totalShipMinutes = 0;
        let paidShipMinutes = 0;
        let paidShipHours = 0;
        let paidCookies = 0;

        shipPosts.forEach(shipPost => {
            const shipMinutes = collectShipMinutesFromPost(shipPost);
            if (shipMinutes > 0) totalShipMinutes += shipMinutes;

            const footer = shipPost.querySelector('.post__payout-footer');
            const payoutMetrics = getShipFooterPayoutMetrics(footer);
            const { cookiesValue } = payoutMetrics;
            if (cookiesValue && cookiesValue > 0) {
                if (shipMinutes > 0) paidShipMinutes += shipMinutes;
                const canonicalHours = getCanonicalPaidShipHours(shipPost, payoutMetrics);
                if (canonicalHours > 0) paidShipHours += canonicalHours;
                paidCookies += cookiesValue;
            }
        });

        const safeTotalMinutes = totalMinutes > 0 ? totalMinutes : totalShipMinutes;
        const unshippedMinutes = Math.max(0, safeTotalMinutes - paidShipMinutes);
        const undevloggedMinutes = isOwnerProject
            ? await fetchUndevloggedMinutesForProject(projectId)
            : 0;
        const stats = {
            totalMinutes: safeTotalMinutes,
            totalShipMinutes,
            paidShipMinutes,
            paidShipHours,
            paidCookies,
            unshippedMinutes,
            undevloggedMinutes,
            singleCurrentScaleShip: projectVoteMeta.currentShipCount === 1,
            exactSingleShipEstimate: projectVoteMeta.currentShipCount === 1 ? projectVoteMeta.currentScaleEstimate : null,
            legacyShipCount: projectVoteMeta.legacyShipCount,
            currentShipCount: projectVoteMeta.currentShipCount,
            exactCurrentShipCount: projectVoteMeta.exactCurrentShipCount,
            currentScaleEstimate: projectVoteMeta.currentScaleEstimate,
            usesMixedCurrentOnly: projectVoteMeta.usesMixedCurrentOnly
        };

        if (stats.totalShipMinutes > 0) {
            setCachedShipMinutes(projectId, stats.totalShipMinutes);
        }

        if (stats.totalMinutes > 0 || stats.paidCookies > 0 || stats.currentScaleEstimate) {
            setCachedProjectUnshipped(projectId, stats, ownerName);
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

function getUnshippedMinutesSinceLastShip() {
    const posts = Array.from(document.querySelectorAll('article.post, .post'));
    if (!posts.length) return 0;
    let totalMinutes = 0;

    for (const post of posts) {
        if (post.classList.contains('post--ship')) break;
        if (post.classList.contains('post--devlog')) {
            const durationEl = post.querySelector('.post__duration');
            if (durationEl) {
                totalMinutes += parseDurationToMinutes(durationEl.textContent.trim());
            }
        }
    }

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

const HEATMAP_DATA_KEY = 'flavortown_heatmap_data';
const HEATMAP_PREFS_KEY = 'flavortown_heatmap_prefs';

function getHeatmapData() {
    try {
        const raw = localStorage.getItem(HEATMAP_DATA_KEY);
        if (!raw) return { version: 3, lastUpdated: null, projects: {}, dailyAggregates: {} };
        const data = JSON.parse(raw);
        if (data.version !== 3) {
            return { version: 3, lastUpdated: null, projects: {}, dailyAggregates: {} };
        }
        return data;
    } catch (e) {
        return { version: 3, lastUpdated: null, projects: {}, dailyAggregates: {} };
    }
}

function setHeatmapData(data) {
    try {
        data.lastUpdated = new Date().toISOString();
        localStorage.setItem(HEATMAP_DATA_KEY, JSON.stringify(data));
    } catch (e) {
        console.error('Failed to save heatmap data:', e);
    }
}

function getHeatmapPrefs() {
    try {
        const raw = localStorage.getItem(HEATMAP_PREFS_KEY);
        if (!raw) return { lastViewMode: 'combined' };
        return JSON.parse(raw);
    } catch (e) {
        return { lastViewMode: 'combined' };
    }
}

function setHeatmapPrefs(prefs) {
    try {
        localStorage.setItem(HEATMAP_PREFS_KEY, JSON.stringify(prefs));
    } catch (e) {
        console.error('Failed to save heatmap prefs:', e);
    }
}

function updateHeatmapDataForProject(projectSlug, projectName, devlogData) {
    const data = getHeatmapData();
    
    if (!data.projects[projectSlug]) {
        data.projects[projectSlug] = {
            name: projectName,
            lastScraped: new Date().toISOString(),
            devlogs: {}
        };
    }
    
    Object.entries(devlogData).forEach(([date, dayData]) => {
        data.projects[projectSlug].devlogs[date] = dayData;
    });
    
    data.projects[projectSlug].lastScraped = new Date().toISOString();
    
    data.dailyAggregates = {};
    Object.entries(data.projects).forEach(([slug, project]) => {
        Object.entries(project.devlogs).forEach(([date, dayData]) => {
            if (!data.dailyAggregates[date]) {
                data.dailyAggregates[date] = { totalHours: 0, totalDevlogs: 0, projects: [] };
            }
            data.dailyAggregates[date].totalHours += dayData.hours;
            data.dailyAggregates[date].totalDevlogs += dayData.count;
            if (!data.dailyAggregates[date].projects.includes(slug)) {
                data.dailyAggregates[date].projects.push(slug);
            }
        });
    });
    
    setHeatmapData(data);
    return data;
}

const API_BASE_URL = 'https://flavortown.hackclub.com/api/v1';
function toAbsoluteUrl(pathOrUrl) {
    if (!pathOrUrl) return null;
    try {
        return new URL(pathOrUrl, window.location.origin).toString();
    } catch (e) {
        return null;
    }
}

function createAsyncLimiter(maxConcurrent = 2) {
    let active = 0;
    const queue = [];

    const runNext = () => {
        if (active >= maxConcurrent) return;
        const next = queue.shift();
        if (!next) return;
        active += 1;
        next();
    };

    return (task) => new Promise((resolve, reject) => {
        const execute = () => {
            Promise.resolve()
                .then(task)
                .then(resolve, reject)
                .finally(() => {
                    active = Math.max(0, active - 1);
                    runNext();
                });
        };

        queue.push(execute);
        runNext();
    });
}

async function fetchApiKeyFromSettings() {
    try {
        const res = await fetch('/my/settings', { credentials: 'include' });
        if (!res.ok) return null;
        const html = await res.text();
        const doc = new DOMParser().parseFromString(html, 'text/html');
        const apiKeyDisplay = doc.querySelector('.api-key-display');
        if (!apiKeyDisplay) return null;
        const keyText = apiKeyDisplay.textContent.trim();
        if (!keyText || keyText === 'No API Key, press generate' || keyText.length <= 10) return null;
        return keyText;
    } catch (e) {
        return null;
    }
}

async function getApiKey() {
    const cached = localStorage.getItem('flavortown_api_key');
    if (cached) return cached;
    try {
        const syncResult = await browserAPI.storage.sync.get(['flavortown_api_key']);
        const syncKey = syncResult?.flavortown_api_key;
        if (syncKey) {
            localStorage.setItem('flavortown_api_key', syncKey);
            return syncKey;
        }
    } catch (e) {
    }
    const fromSettings = await fetchApiKeyFromSettings();
    if (fromSettings) {
        localStorage.setItem('flavortown_api_key', fromSettings);
        return fromSettings;
    }
    return null;
}

async function apiFetch(endpoint) {
    let apiKey = await getApiKey();
    if (!apiKey) {
        throw new Error('No API key found. Please visit your account settings to generate one.');
    }
    
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Accept': 'application/json',
            'X-Flavortown-Ext-135': 'true'
        },
        credentials: 'include'
    });
    
    if (!response.ok) {
        if (response.status === 401) {
            localStorage.removeItem('flavortown_api_key');
            apiKey = await fetchApiKeyFromSettings();
            if (apiKey) {
                localStorage.setItem('flavortown_api_key', apiKey);
                return apiFetch(endpoint);
            }
            throw new Error('Invalid API key. Please regenerate your API key in account settings.');
        }
        throw new Error(`API error: ${response.status}`);
    }
    
    return response.json();
}

function parseLogpheusGoalIds(rawWishlist) {
    if (!rawWishlist) return [];

    let parsed = null;
    try {
        parsed = JSON.parse(rawWishlist);
    } catch (e) {
        return [];
    }

    if (!parsed || typeof parsed !== 'object') return [];

    const ids = Object.keys(parsed)
        .map((key) => parseInt(key, 10))
        .filter((id) => Number.isFinite(id) && id > 0);

    return Array.from(new Set(ids)).sort((a, b) => a - b);
}

function queueLogpheusGoalsSync(delayMs = 1000) {
    if (!logpheusSyncEnabled) return;
    clearTimeout(logpheusDebounceTimer);
    logpheusDebounceTimer = setTimeout(() => {
        syncShopGoalsToLogpheus();
    }, delayMs);
}

function resetLogpheusSyncTimers() {
    clearInterval(logpheusWatcherInterval);
    clearTimeout(logpheusDebounceTimer);
    clearTimeout(logpheusRetryTimer);
    logpheusWatcherInterval = null;
    logpheusDebounceTimer = null;
    logpheusRetryTimer = null;
}

function startLogpheusSyncWatcher() {
    if (logpheusWatcherInterval) return;

    const checkForWishlistChanges = () => {
        const currentRaw = localStorage.getItem('shop_wishlist') || '{}';
        if (currentRaw !== logpheusLastWishlistRaw) {
            logpheusLastWishlistRaw = currentRaw;
            queueLogpheusGoalsSync(650);
        }
    };

    checkForWishlistChanges();
    logpheusWatcherInterval = setInterval(checkForWishlistChanges, 1200);
}

function scheduleLogpheusRetry() {
    if (!logpheusSyncEnabled) return;
    clearTimeout(logpheusRetryTimer);
    const retryDelay = Math.min(60000, Math.max(1500, 1500 * (2 ** Math.min(logpheusSyncFailureCount, 5))));
    logpheusRetryTimer = setTimeout(() => {
        syncShopGoalsToLogpheus();
    }, retryDelay);
}

function scheduleLogpheusCorsCooldown() {
    const cooldownMs = 10 * 60 * 1000;
    logpheusCorsBlockedUntil = Date.now() + cooldownMs;
    clearTimeout(logpheusRetryTimer);
    logpheusRetryTimer = setTimeout(() => {
        logpheusCorsBlockedUntil = 0;
        syncShopGoalsToLogpheus();
    }, cooldownMs);
}

function sendLogpheusSyncRequest(goals, apiKey) {
    return new Promise((resolve, reject) => {
        const payload = {
            type: 'LOGPHEUS_SYNC_GOALS',
            endpoint: LOGPHEUS_GOALS_ENDPOINT,
            method: 'PUT',
            goals,
            apiKey
        };

        let settled = false;
        const finalizeResolve = (value) => {
            if (settled) return;
            settled = true;
            resolve(value);
        };
        const finalizeReject = (error) => {
            if (settled) return;
            settled = true;
            reject(error);
        };

        const callback = (response) => {
            const lastError = browserAPI.runtime && browserAPI.runtime.lastError;
            if (lastError) {
                finalizeReject(new Error(lastError.message || 'Background request failed'));
                return;
            }

            if (!response) {
                finalizeReject(new Error('No response from background sync'));
                return;
            }

            finalizeResolve(response);
        };

        try {
            const maybePromise = browserAPI.runtime.sendMessage(payload, callback);
            if (maybePromise && typeof maybePromise.then === 'function') {
                maybePromise.then(finalizeResolve).catch(finalizeReject);
            }
        } catch (error) {
            finalizeReject(error);
        }
    });
}

async function syncShopGoalsToLogpheus(force = false) {
    if (!logpheusSyncEnabled) return;

    if (!force && logpheusCorsBlockedUntil && Date.now() < logpheusCorsBlockedUntil) {
        return;
    }

    if (logpheusSyncInFlight) {
        logpheusSyncQueued = true;
        return;
    }

    const wishlistRaw = localStorage.getItem('shop_wishlist') || '{}';
    const goals = parseLogpheusGoalIds(wishlistRaw);
    const signature = JSON.stringify(goals);

    if (!force && signature === logpheusLastSyncedSignature) return;

    const lastSharedSignature = localStorage.getItem(LOGPHEUS_LAST_SYNC_SIGNATURE_KEY);
    const lastSharedSyncAt = parseInt(localStorage.getItem(LOGPHEUS_LAST_SYNC_AT_KEY) || '0', 10);
    if (!force && lastSharedSignature === signature && Number.isFinite(lastSharedSyncAt) && Date.now() - lastSharedSyncAt < 5000) {
        logpheusLastSyncedSignature = signature;
        return;
    }

    const apiKey = await getApiKey();
    if (!apiKey) {
        scheduleLogpheusRetry();
        return;
    }

    logpheusSyncInFlight = true;

    try {
        const result = await sendLogpheusSyncRequest(goals, apiKey);

        if (!result.ok) {
            const statusCode = Number(result.status || 0);
            const isTransient = [408, 429, 500, 502, 503, 504].includes(statusCode);
            const maybeCors = statusCode === 0;

            if (maybeCors) {
                if (!logpheusCorsWarned) {
                    console.warn('Logpheus goal sync blocked by CORS/preflight on server. Waiting before retrying.');
                    logpheusCorsWarned = true;
                }
                throw new Error('Logpheus sync CORS/preflight blocked (0)');
            }

            if (!isTransient) {
                const payloadText = result.data ? JSON.stringify(result.data) : (result.raw || result.error || '');
                throw new Error(`Logpheus sync failed (${statusCode}) ${payloadText}`.trim());
            }
            throw new Error(`Logpheus sync transient failure (${statusCode})`);
        }

        logpheusLastSyncedSignature = signature;
        localStorage.setItem(LOGPHEUS_LAST_SYNC_SIGNATURE_KEY, signature);
        localStorage.setItem(LOGPHEUS_LAST_SYNC_AT_KEY, String(Date.now()));
        logpheusSyncFailureCount = 0;
        logpheusCorsBlockedUntil = 0;
        logpheusCorsWarned = false;
        clearTimeout(logpheusRetryTimer);
        logpheusRetryTimer = null;
    } catch (error) {
        logpheusSyncFailureCount += 1;
        const message = (error?.message || String(error || '')).toLowerCase();
        if (message.includes('missing logpheus host permission')) {
            setLogpheusSyncEnabled(false);
            browserAPI.storage.sync.set({
                [LOGPHEUS_SYNC_ENABLED_KEY]: false
            });
            return;
        }
        if (message.includes('cors/preflight blocked') || message.includes('(0)')) {
            scheduleLogpheusCorsCooldown();
        } else {
            if (logpheusSyncFailureCount <= 3 || logpheusSyncFailureCount % 5 === 0) {
                console.warn('Logpheus goal sync failed:', error?.message || error);
            }
            scheduleLogpheusRetry();
        }
    } finally {
        logpheusSyncInFlight = false;
        if (logpheusSyncQueued) {
            logpheusSyncQueued = false;
            queueLogpheusGoalsSync(200);
        }
    }
}

function setLogpheusSyncEnabled(enabled) {
    logpheusSyncEnabled = !!enabled;

    if (logpheusSyncEnabled) {
        logpheusLastWishlistRaw = localStorage.getItem('shop_wishlist') || '{}';
        startLogpheusSyncWatcher();
        syncShopGoalsToLogpheus(true);
        return;
    }

    resetLogpheusSyncTimers();
    logpheusSyncInFlight = false;
    logpheusSyncQueued = false;
    logpheusSyncFailureCount = 0;
    logpheusCorsBlockedUntil = 0;
    logpheusCorsWarned = false;
}

function initLogpheusGoalsSync() {
    browserAPI.storage.sync.get([LOGPHEUS_SYNC_ENABLED_KEY], (result) => {
        setLogpheusSyncEnabled(!!result?.[LOGPHEUS_SYNC_ENABLED_KEY]);
    });

    browserAPI.storage.onChanged.addListener((changes, area) => {
        if (area !== 'sync') return;
        if (changes[LOGPHEUS_SYNC_ENABLED_KEY]) {
            setLogpheusSyncEnabled(!!changes[LOGPHEUS_SYNC_ENABLED_KEY].newValue);
        }
    });
}

async function fetchProjectIdsFromPage() {
    try {
        const projectsUrl = toAbsoluteUrl('/projects');
        if (!projectsUrl) return [];
        const response = await fetch(projectsUrl, { credentials: 'include' });
        if (!response.ok) return [];

        const html = await response.text();
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

            const statsContainer = card.querySelector('.project-card__stats');
            let hasActivity = true;

            if (statsContainer) {
                const statText = statsContainer.textContent || '';
                const devlogMatch = statText.match(/(\d+)\s*devlog/i);
                const timeMatch = statText.match(/(\d+)h\s*(\d+)m/i);

                const devlogCount = devlogMatch ? parseInt(devlogMatch[1]) : 0;
                const hours = timeMatch ? parseInt(timeMatch[1]) : 0;
                const minutes = timeMatch ? parseInt(timeMatch[2]) : 0;

                if (devlogCount === 0 && hours === 0 && minutes === 0) {
                    hasActivity = false;
                }
            }

            if (hasActivity) {
                projects.push({ id: parseInt(id), title });
            }
        });

        return projects;
    } catch (e) {
        return [];
    }
}

async function fetchAllDevlogsForProjectAPI(projectId) {
    const allDevlogs = [];
    let page = 1;
    let hasMore = true;
    
    while (hasMore) {
        const data = await apiFetch(`/projects/${projectId}/devlogs?page=${page}`);
        allDevlogs.push(...data.devlogs);
        
        hasMore = data.pagination.next_page !== null;
        page = data.pagination.next_page;
        
        
    }
    
    return allDevlogs;
}

async function fetchAndUpdateHeatmapDataViaAPI(onProgress = null) {
    try {
        const projects = await fetchProjectIdsFromPage();

        if (onProgress) onProgress({ type: 'start', total: projects.length });

        for (let i = 0; i < projects.length; i++) {
            const project = projects[i];
            try {
                if (onProgress) onProgress({ type: 'project', current: i + 1, total: projects.length, name: project.title });

                const devlogs = await fetchAllDevlogsForProjectAPI(project.id);


                const projectData = {};
                
                devlogs.forEach(devlog => {
                    const createdAt = devlog.created_at;
                    if (!createdAt) {
                        return;
                    }
                    
                    const date = new Date(createdAt);
                    if (isNaN(date.getTime())) {
                        return;
                    }
                    
                    const dateStr = date.toISOString().split('T')[0];
                    const hours = (devlog.duration_seconds || 0) / 3600;
                    
                    if (!projectData[dateStr]) {
                        projectData[dateStr] = { hours: 0, count: 0, ids: [] };
                    }
                    projectData[dateStr].hours += hours;
                    projectData[dateStr].count += 1;
                    projectData[dateStr].ids.push(devlog.id);
                });
                
                if (Object.keys(projectData).length > 0) {
                    updateHeatmapDataForProject(project.id.toString(), project.title, projectData);
                }
            } catch (e) {
            }
        }
        
        if (onProgress) onProgress({ type: 'complete' });
        return getHeatmapData();
    } catch (e) {
        if (onProgress) onProgress({ type: 'error', error: e.message });
        return getHeatmapData();
    }
}


function getHeatmapColor(intensity, theme) {
    const root = document.documentElement;
    const computedStyle = getComputedStyle(root);
    
    const getVar = (name, fallback) => {
        const value = computedStyle.getPropertyValue(name)?.trim();
        return value || fallback;
    };
    
    const adjustColor = (hex, opacity) => {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return `rgba(${r}, ${g}, ${b}, ${opacity})`;
    };
    
    let accentColor;
    let surfaceColor;
    let emptyColor;
    
    switch(theme) {
        case 'catppuccin':
            accentColor = getVar('--ctp-accent', '#cba6f7');
            surfaceColor = getVar('--ctp-surface0', '#313244');
            emptyColor = getVar('--ctp-surface1', '#45475a');
            break;
        case 'sea':
            accentColor = getVar('--sea-cyan', '#22d3ee');
            surfaceColor = getVar('--sea-dark', '#102a4c');
            emptyColor = getVar('--sea-mid', '#1a3a5c');
            break;
        case 'overcooked':
            accentColor = getVar('--overcooked-accent', '#ef4444');
            surfaceColor = getVar('--overcooked-dark', '#2d1f1f');
            emptyColor = getVar('--overcooked-mid', '#3d2828');
            break;
        default:
            accentColor = getVar('--color-accent', '#ec8b33');
            surfaceColor = getVar('--color-surface', '#f5efe9');
            emptyColor = getVar('--color-cream-dark', '#efe6d5');
    }
    
    const colors = {
        level0: emptyColor,
        level1: adjustColor(accentColor, 0.25),
        level2: adjustColor(accentColor, 0.45),
        level3: adjustColor(accentColor, 0.7),
        level4: accentColor
    };
    
    return colors[`level${intensity}`] || colors.level0;
}

function getSecondaryHeatmapColor(intensity, theme) {
    const root = document.documentElement;
    const computedStyle = getComputedStyle(root);
    
    const getVar = (name, fallback) => {
        const value = computedStyle.getPropertyValue(name)?.trim();
        return value || fallback;
    };
    
    const adjustColor = (hex, opacity) => {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return `rgba(${r}, ${g}, ${b}, ${opacity})`;
    };
    
    let secondaryColor;
    let surfaceColor;
    
    switch(theme) {
        case 'catppuccin':
            secondaryColor = getVar('--ctp-teal', '#94e2d5');
            surfaceColor = getVar('--ctp-surface1', '#45475a');
            break;
        case 'sea':
            secondaryColor = getVar('--sea-spray', '#7ec8e3');
            surfaceColor = getVar('--sea-mid', '#1a3a5c');
            break;
        case 'overcooked':
            secondaryColor = getVar('--overcooked-gold', '#ffd700');
            surfaceColor = getVar('--overcooked-mid', '#3d2828');
            break;
        default:
            secondaryColor = getVar('--color-brown-light', '#c9a86c');
            surfaceColor = getVar('--color-cream-dark', '#efe6d5');
    }
    
    const colors = {
        level0: surfaceColor,
        level1: adjustColor(secondaryColor, 0.25),
        level2: adjustColor(secondaryColor, 0.45),
        level3: adjustColor(secondaryColor, 0.7),
        level4: secondaryColor
    };
    
    return colors[`level${intensity}`] || colors.level0;
}

function blendColorsForCombined(devlogIntensity, hoursIntensity, theme) {
    const color1 = getHeatmapColor(devlogIntensity, theme);
    const color2 = getSecondaryHeatmapColor(hoursIntensity, theme);
    
    if (devlogIntensity === 0 && hoursIntensity === 0) {
        return color1;
    }
    
    const hexToRgb = (hex) => {
        if (hex.startsWith('rgba')) {
            const match = hex.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
            return match ? [parseInt(match[1]), parseInt(match[2]), parseInt(match[3])] : [0, 0, 0];
        }
        if (hex.startsWith('#')) {
            return [
                parseInt(hex.slice(1, 3), 16),
                parseInt(hex.slice(3, 5), 16),
                parseInt(hex.slice(5, 7), 16)
            ];
        }
        return [0, 0, 0];
    };
    
    const rgb1 = hexToRgb(color1);
    const rgb2 = hexToRgb(color2);
    
    const totalIntensity = devlogIntensity + hoursIntensity;
    if (totalIntensity === 0) {
        return color1;
    }
    
    const weight1 = devlogIntensity / totalIntensity;
    const weight2 = hoursIntensity / totalIntensity;
    
    const r = Math.round(rgb1[0] * weight1 + rgb2[0] * weight2);
    const g = Math.round(rgb1[1] * weight1 + rgb2[1] * weight2);
    const b = Math.round(rgb1[2] * weight1 + rgb2[2] * weight2);
    
    return `rgb(${r}, ${g}, ${b})`;
}

function prepareHeatmapData(dailyAggregates) {
    const dates = Object.keys(dailyAggregates).sort();
    if (dates.length === 0) return { weeks: [], maxDevlogs: 0, maxHours: 0, months: [] };

    const firstDate = new Date(dates[0]);
    const lastDate = new Date();

    let maxDevlogs = 0;
    let maxHours = 0;
    Object.values(dailyAggregates).forEach(day => {
        maxDevlogs = Math.max(maxDevlogs, day.totalDevlogs);
        maxHours = Math.max(maxHours, day.totalHours);
    });

    const startDate = new Date(firstDate);
    const dayOfWeek = startDate.getDay();
    const daysToSubtract = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    startDate.setDate(startDate.getDate() - daysToSubtract);

    const allDays = [];
    const months = [];
    let currentMonth = -1;

    for (let d = new Date(startDate); d <= lastDate; d.setDate(d.getDate() + 1)) {
        const dateStr = d.toISOString().split('T')[0];
        const month = d.getMonth();

        if (month !== currentMonth) {
            months.push({
                name: d.toLocaleDateString('en-US', { month: 'short' }),
                weekIndex: Math.floor(allDays.length / 7)
            });
            currentMonth = month;
        }

        allDays.push({
            date: dateStr,
            ...(dailyAggregates[dateStr] || { totalDevlogs: 0, totalHours: 0, projects: [] })
        });
    }

    const weeks = [];
    for (let i = 0; i < allDays.length; i += 7) {
        weeks.push(allDays.slice(i, i + 7));
    }

    return { weeks, maxDevlogs, maxHours, months };
}

function renderHeatmap(canvas, data, viewMode) {
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;

    const { weeks, maxDevlogs, maxHours, months } = prepareHeatmapData(data.dailyAggregates);

    if (weeks.length === 0) {
        canvas.width = 600 * dpr;
        canvas.height = 120 * dpr;
        canvas.style.width = '600px';
        canvas.style.height = '120px';
        ctx.scale(dpr, dpr);
        ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--color-text-secondary') || '#666';
        ctx.font = '14px system-ui';
        ctx.textAlign = 'center';
        ctx.fillText('No activity data yet. Visit your projects to collect data.', 300, 60);
        return;
    }

    const cols = weeks.length;
    const rows = 7;

    let cellSize = 28;
    let gap = 4;
    const padding = { top: 40, right: 20, bottom: 48, left: 56 };

    const containerWidth = canvas.parentElement?.clientWidth || 0;
    if (containerWidth > 0) {
        const availableGridWidth = containerWidth - padding.left - padding.right;
        const minCellSize = 16;
        if (availableGridWidth > 0) {
            const fittedCellSize = Math.floor((availableGridWidth - (cols - 1) * gap) / cols);
            if (fittedCellSize < cellSize) {
                cellSize = Math.max(minCellSize, fittedCellSize);
            }
            if (cellSize <= 20) {
                gap = 3;
            }
        }
    }

    const width = padding.left + cols * (cellSize + gap) + padding.right;
    const height = padding.top + rows * (cellSize + gap) + padding.bottom;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    ctx.scale(dpr, dpr);

    const computedStyle = getComputedStyle(document.documentElement);
    let theme = 'default';
    
    if (computedStyle.getPropertyValue('--ctp-accent').trim()) {
        theme = 'catppuccin';
    } else if (computedStyle.getPropertyValue('--sea-cyan').trim()) {
        theme = 'sea';
    } else if (computedStyle.getPropertyValue('--overcooked-accent').trim()) {
        theme = 'overcooked';
    }

    ctx.clearRect(0, 0, width, height);

    ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--color-text-secondary') || '#666';
    ctx.font = '10px system-ui';
    ctx.textAlign = 'left';

    let lastMonth = '';
    months.forEach(month => {
        if (month.name !== lastMonth) {
            const x = padding.left + month.weekIndex * (cellSize + gap);
            ctx.fillText(month.name, x, padding.top - 8);
            lastMonth = month.name;
        }
    });

    const dayLabels = ['Mon', 'Wed', 'Fri'];
    const dayIndices = [0, 2, 4];
    ctx.textAlign = 'right';
    ctx.font = '12px system-ui';
    dayLabels.forEach((label, i) => {
        const dayIndex = dayIndices[i];
        ctx.fillText(label, padding.left - 8, padding.top + dayIndex * (cellSize + gap) + cellSize / 2 + 4);
    });

    weeks.forEach((week, weekIndex) => {
        week.forEach((day, dayIndex) => {
            const x = padding.left + weekIndex * (cellSize + gap);
            const y = padding.top + dayIndex * (cellSize + gap);

            if (viewMode === 'devlogs') {
                const intensity = day.totalDevlogs === 0 ? 0 : Math.min(4, Math.ceil((day.totalDevlogs / Math.max(1, maxDevlogs)) * 4));
                const color = getHeatmapColor(intensity, theme);
                ctx.fillStyle = color;
                ctx.beginPath();
                ctx.roundRect(x, y, cellSize, cellSize, 2);
                ctx.fill();
            } else if (viewMode === 'hours') {
                const intensity = day.totalHours === 0 ? 0 : Math.min(4, Math.ceil((day.totalHours / Math.max(1, maxHours)) * 4));
                const color = getHeatmapColor(intensity, theme);
                ctx.fillStyle = color;
                ctx.beginPath();
                ctx.roundRect(x, y, cellSize, cellSize, 2);
                ctx.fill();
            } else {
                const devlogIntensity = day.totalDevlogs === 0 ? 0 : Math.min(4, Math.ceil((day.totalDevlogs / Math.max(1, maxDevlogs)) * 4));
                const hoursIntensity = day.totalHours === 0 ? 0 : Math.min(4, Math.ceil((day.totalHours / Math.max(1, maxHours)) * 4));

                const blendedColor = blendColorsForCombined(devlogIntensity, hoursIntensity, theme);

                ctx.fillStyle = blendedColor;
                ctx.beginPath();
                ctx.roundRect(x, y, cellSize, cellSize, 2);
                ctx.fill();
            }
        });
    });

    canvas._heatmapCells = [];
    weeks.forEach((week, weekIndex) => {
        week.forEach((day, dayIndex) => {
            canvas._heatmapCells.push({
                x: padding.left + weekIndex * (cellSize + gap),
                y: padding.top + dayIndex * (cellSize + gap),
                width: cellSize,
                height: cellSize,
                data: day
            });
        });
    });
}

function createHeatmapTooltip() {
    const tooltip = document.createElement('div');
    tooltip.className = 'flavortown-heatmap-tooltip';
    tooltip.style.cssText = `
        position: absolute;
        padding: 8px 12px;
        border-radius: 6px;
        font-size: 12px;
        pointer-events: none;
        z-index: 10000;
        display: none;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        backdrop-filter: blur(4px);
    `;
    document.body.appendChild(tooltip);
    return tooltip;
}

function calculateLongestStreak(data) {
    const aggregates = Object.entries(data.dailyAggregates || {});
    if (aggregates.length === 0) return 0;
    
    const activeDates = aggregates
        .filter(([_, dayData]) => dayData.totalDevlogs > 0 || dayData.totalHours > 0)
        .map(([date]) => date)
        .sort();
    
    if (activeDates.length === 0) return 0;
    
    let longestStreak = 1;
    let currentStreak = 1;
    
    for (let i = 1; i < activeDates.length; i++) {
        const prevDate = new Date(activeDates[i - 1]);
        const currDate = new Date(activeDates[i]);
        
        const diffTime = currDate.getTime() - prevDate.getTime();
        const diffDays = diffTime / (1000 * 60 * 60 * 24);
        
        if (diffDays === 1) {
            currentStreak++;
            longestStreak = Math.max(longestStreak, currentStreak);
        } else {
            currentStreak = 1;
        }
    }
    
    return longestStreak;
}

function calculateHeatmapStats(data) {
    const aggregates = Object.entries(data.dailyAggregates || {});
    if (aggregates.length === 0) return null;

    let maxDevlogs = 0;
    let maxHours = 0;
    let bestDay = null;
    let bestDayHours = null;

    aggregates.forEach(([date, day]) => {
        if (day.totalDevlogs > maxDevlogs) {
            maxDevlogs = day.totalDevlogs;
            bestDay = date;
        }
        if (day.totalHours > maxHours) {
            maxHours = day.totalHours;
            bestDayHours = date;
        }
    });

    const sortedDates = aggregates.map(([date]) => date).sort();
    let currentStreak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const activeDateSet = new Set(
        aggregates
            .filter(([_, day]) => day.totalDevlogs > 0 || day.totalHours > 0)
            .map(([date]) => date)
    );
    
    for (let i = 0; i <= 365; i++) {
        const checkDate = new Date(today);
        checkDate.setDate(today.getDate() - i);
        const dateStr = checkDate.toISOString().split('T')[0];
        
        if (activeDateSet.has(dateStr)) {
            currentStreak++;
        } else if (i > 0) {
            break;
        }
    }

    return {
        bestDay,
        maxDevlogs,
        maxHours,
        currentStreak,
        totalDays: aggregates.filter(([_, day]) => day.totalDevlogs > 0 || day.totalHours > 0).length
    };
}

function createHeatmapComponent(data) {
    const container = document.createElement('div');
    container.className = 'flavortown-heatmap-card';

    const prefs = getHeatmapPrefs();
    let currentViewMode = prefs.lastViewMode || 'combined';
    
    const stats = calculateHeatmapStats(data);
    const longestStreak = calculateLongestStreak(data);
    
    const aggregates = Object.entries(data.dailyAggregates || {});
    const totalDevlogs = aggregates.reduce((sum, [_, day]) => sum + (day.totalDevlogs || 0), 0);
    
    container.innerHTML = `
        <div class="flavortown-heatmap-card-header">
            <h3>🔥 Activity Heatmap</h3>
            <div class="flavortown-heatmap-view-toggle">
                <button class="flavortown-heatmap-btn ${currentViewMode === 'devlogs' ? 'active' : ''}" data-mode="devlogs">Devlogs</button>
                <button class="flavortown-heatmap-btn ${currentViewMode === 'hours' ? 'active' : ''}" data-mode="hours">Hours</button>
                <button class="flavortown-heatmap-btn ${currentViewMode === 'combined' ? 'active' : ''}" data-mode="combined">Combined</button>
            </div>
        </div>
        <div class="flavortown-heatmap-card-content">
            <div class="flavortown-heatmap-side-stats left">
                ${stats ? `
                    <div class="flavortown-heatmap-stat-box">
                        <div class="flavortown-heatmap-stat-label">Best Day</div>
                        <div class="flavortown-heatmap-stat-value">${stats.bestDay ? new Date(stats.bestDay).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '-'}</div>
                        <div class="flavortown-heatmap-stat-sub">${stats.maxDevlogs} devlogs</div>
                    </div>
                    <div class="flavortown-heatmap-stat-box">
                        <div class="flavortown-heatmap-stat-label">Current Streak</div>
                        <div class="flavortown-heatmap-stat-value">${stats.currentStreak}</div>
                        <div class="flavortown-heatmap-stat-sub">days</div>
                    </div>
                ` : ''}
            </div>
            <div class="flavortown-heatmap-main">
                <div class="flavortown-heatmap-canvas-container">
                    <canvas id="flavortown-heatmap-canvas"></canvas>
                </div>
            </div>
            <div class="flavortown-heatmap-side-stats right">
                ${stats ? `
                    <div class="flavortown-heatmap-stat-box">
                        <div class="flavortown-heatmap-stat-label">Total Devlogs</div>
                        <div class="flavortown-heatmap-stat-value">${totalDevlogs}</div>
                        <div class="flavortown-heatmap-stat-sub">all time</div>
                    </div>
                    <div class="flavortown-heatmap-stat-box">
                        <div class="flavortown-heatmap-stat-label">Longest Streak</div>
                        <div class="flavortown-heatmap-stat-value">${longestStreak}</div>
                        <div class="flavortown-heatmap-stat-sub">days</div>
                    </div>
                ` : ''}
            </div>
        </div>
        <div class="flavortown-heatmap-footer">
            ${currentViewMode === 'combined' ? `
                <div class="flavortown-heatmap-legend">
                    <span>Less</span>
                    <div class="flavortown-heatmap-legend-cells">
                        <div class="flavortown-heatmap-legend-cell level-0-blended"></div>
                        <div class="flavortown-heatmap-legend-cell level-1-blended"></div>
                        <div class="flavortown-heatmap-legend-cell level-2-blended"></div>
                        <div class="flavortown-heatmap-legend-cell level-3-blended"></div>
                        <div class="flavortown-heatmap-legend-cell level-4-blended"></div>
                    </div>
                    <span>More</span>
                    <span class="flavortown-heatmap-legend-note">(Devlogs + Hours)</span>
                </div>
            ` : `
                <div class="flavortown-heatmap-legend">
                    <span>Less</span>
                    <div class="flavortown-heatmap-legend-cells">
                        <div class="flavortown-heatmap-legend-cell level-0"></div>
                        <div class="flavortown-heatmap-legend-cell level-1"></div>
                        <div class="flavortown-heatmap-legend-cell level-2"></div>
                        <div class="flavortown-heatmap-legend-cell level-3"></div>
                        <div class="flavortown-heatmap-legend-cell level-4"></div>
                    </div>
                    <span>More</span>
                </div>
            `}
        </div>
    `;

    const canvas = container.querySelector('#flavortown-heatmap-canvas');
    const tooltip = createHeatmapTooltip();

    const renderCurrentHeatmap = (sourceData = getHeatmapData()) => {
        renderHeatmap(canvas, sourceData, currentViewMode);
    };

    requestAnimationFrame(() => {
        renderCurrentHeatmap(data);
    });

    container.querySelectorAll('.flavortown-heatmap-view-toggle .flavortown-heatmap-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            container.querySelectorAll('.flavortown-heatmap-view-toggle .flavortown-heatmap-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentViewMode = btn.dataset.mode;
            setHeatmapPrefs({ ...getHeatmapPrefs(), lastViewMode: currentViewMode });
            renderCurrentHeatmap();
            updateHeatmapLegend(container, currentViewMode);
        });
    });

    canvas.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        const x = (e.clientX - rect.left) * (canvas.width / rect.width / (window.devicePixelRatio || 1));
        const y = (e.clientY - rect.top) * (canvas.height / rect.height / (window.devicePixelRatio || 1));
        
        const cell = canvas._heatmapCells?.find(c => 
            x >= c.x && x <= c.x + c.width &&
            y >= c.y && y <= c.y + c.height
        );
        
        if (cell) {
            const date = new Date(cell.data.date);
            const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
            tooltip.innerHTML = `
                <div style="font-weight: 600; margin-bottom: 4px;">${dateStr}</div>
                <div>${cell.data.totalDevlogs} devlog${cell.data.totalDevlogs !== 1 ? 's' : ''}</div>
                <div>${cell.data.totalHours.toFixed(1)} hours</div>
            `;
            tooltip.style.display = 'block';
            tooltip.style.left = `${e.pageX + 10}px`;
            tooltip.style.top = `${e.pageY - 10}px`;
        } else {
            tooltip.style.display = 'none';
        }
    });
    
    canvas.addEventListener('mouseleave', () => {
        tooltip.style.display = 'none';
    });
    
    document.addEventListener('flavortown-theme-changed', () => {
        renderCurrentHeatmap();
    });
    
    return container;
}

function updateHeatmapLegend(container, viewMode) {
    const footer = container.querySelector('.flavortown-heatmap-footer');
    if (!footer) return;
    
    if (viewMode === 'combined') {
        footer.innerHTML = `
            <div class="flavortown-heatmap-legend">
                <span>Less</span>
                <div class="flavortown-heatmap-legend-cells">
                    <div class="flavortown-heatmap-legend-cell level-0-blended"></div>
                    <div class="flavortown-heatmap-legend-cell level-1-blended"></div>
                    <div class="flavortown-heatmap-legend-cell level-2-blended"></div>
                    <div class="flavortown-heatmap-legend-cell level-3-blended"></div>
                    <div class="flavortown-heatmap-legend-cell level-4-blended"></div>
                </div>
                <span>More</span>
                <span class="flavortown-heatmap-legend-note">(Devlogs + Hours)</span>
            </div>
        `;
    } else {
        footer.innerHTML = `
            <div class="flavortown-heatmap-legend">
                <span>Less</span>
                <div class="flavortown-heatmap-legend-cells">
                    <div class="flavortown-heatmap-legend-cell level-0"></div>
                    <div class="flavortown-heatmap-legend-cell level-1"></div>
                    <div class="flavortown-heatmap-legend-cell level-2"></div>
                    <div class="flavortown-heatmap-legend-cell level-3"></div>
                    <div class="flavortown-heatmap-legend-cell level-4"></div>
                </div>
                <span>More</span>
            </div>
        `;
    }
}

async function addProjectCardCookieStats(skipBackloadRefresh = false) {
    if (!window.location.pathname.endsWith('/projects')) return;

    const cards = document.querySelectorAll('.projects-board__grid-item .project-card');
    if (!cards.length) return;

    const pagePayouts = getShipPayoutsFromProjectPage();
    const payouts = pagePayouts.length ? pagePayouts : await fetchShipPayouts();

    const renderCardStat = (card, totalCookies, minutes, paidHours = 0, estimateOverride = null, estimateMeta = {}) => {
        const existing = card.querySelector('.flavortown-project-cookies');
        if (existing) existing.remove();
        const existingDetails = card.querySelector('.flavortown-project-cookies-details');
        if (existingDetails) existingDetails.remove();
        card.querySelectorAll('.flavortown-vote-estimate, .flavortown-vote-estimate-pill, .flavortown-vote-estimate-accordion').forEach(el => el.remove());

        const existingMixedTip = card.querySelector('.flavortown-project-mixed-scale-tip');
        if (existingMixedTip) existingMixedTip.remove();

        if (estimateMeta.usesMixedCurrentOnly) {
            const mixedTip = document.createElement('button');
            mixedTip.type = 'button';
            mixedTip.className = 'flavortown-project-mixed-scale-tip';
            mixedTip.textContent = 'i';
            mixedTip.setAttribute('aria-label', 'Current-scale stats info');
            mixedTip.setAttribute('data-tooltip', 'Mixed voting scales detected. Showing stats from post-Feb-23 ships only for better accuracy.');
            if (!card.querySelector('.flavortown-project-pin-btn')) {
                mixedTip.classList.add('no-pin');
            }
            mixedTip.addEventListener('click', (event) => {
                event.preventDefault();
                event.stopPropagation();
            });
            card.appendChild(mixedTip);
        }

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
            existingStats.forEach(stat => {
                if (isCookieTotalStat(stat)) {
                    stat.remove();
                    return;
                }
                statsRow.appendChild(stat);
            });
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

        const rate = getProjectRateFromCookies(totalCookies, paidHours, minutes);
        const inferredScaleMax = inferProjectFallbackScaleMax(estimateMeta);
        const inferredEstimateSource = inferredScaleMax > LEGACY_VOTE_SCALE_MAX
            ? 'current-multiplier'
            : 'legacy-multiplier';
        const estimate = estimateOverride || (rate
            ? buildVoteEstimate(rate, { scaleMax: inferredScaleMax, source: inferredEstimateSource })
            : null);
        const isExactEstimate = estimate?.source === 'exact-votes';

        let rateLine = formatCookieRateLine(rate);
        if ((!rate || !isFinite(rate)) && isExactEstimate && estimate?.multiplier) {
            rateLine = `~${formatCookieRate(estimate.multiplier)} cookies/h`;
        }

        let percentileLine = formatCookiePercentileLine(rate);
        if ((!rate || !isFinite(rate)) && isExactEstimate && estimate?.percentile) {
            percentileLine = formatPercentileFromPercentile(estimate.percentile);
        }

        if (totalCookies > 0) {
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
        }

        const shouldRenderDetails = minutes > 0 || !!estimate;
        if (shouldRenderDetails) {
            const detailsRow = document.createElement('div');
            detailsRow.className = 'flavortown-project-cookies-details';
            detailsRow.style.cssText = 'width: 100%; margin-top: 8px; display: flex; gap: 8px; align-items: center; flex-wrap: wrap;';

            if (rateLine && rateLine !== '--') {
                const rateBox = document.createElement('h5');
                rateBox.textContent = rateLine;
                applyDetailStyle(rateBox);
                detailsRow.appendChild(rateBox);
            }

            if (percentileLine && percentileLine !== '--') {
                const percentileBox = document.createElement('h5');
                percentileBox.textContent = percentileLine;
                applyDetailStyle(percentileBox);
                detailsRow.appendChild(percentileBox);
            }

            const estimateResult = estimate
                ? createVoteEstimateElement(estimate, { exact: isExactEstimate, scaleMax: estimate.scaleMax })
                : null;
            if (estimateResult && estimateResult.scorePill) {
                applyDetailStyle(estimateResult.scorePill);
                detailsRow.appendChild(estimateResult.scorePill);
            }

            statsContainer.appendChild(detailsRow);

            if (estimateResult && estimateResult.accordion) {
                statsContainer.appendChild(estimateResult.accordion);
            }
        }

        if (getProjectSortPreference() !== 'default') {
            scheduleProjectBoardReorder();
        }
    };

    cards.forEach(card => {
        const projectName = card.querySelector('.project-card__title-link')?.textContent?.trim();
        if (!projectName) return;
        const projectPayouts = payouts.filter(payout => projectNameMatches(payout.projectName, projectName));
        const projectId = card.id ? card.id.replace('project_', '') : null;
        const cachedUnshipped = projectId ? getCachedProjectUnshipped(projectId) : null;
        const cachedCurrentEstimate = pickReliableCurrentScaleEstimate(
            cachedUnshipped?.currentScaleEstimate,
            cachedUnshipped?.exactSingleShipEstimate
        );
        const cachedEstimateMeta = {
            usesMixedCurrentOnly: !!cachedUnshipped?.usesMixedCurrentOnly,
            currentShipCount: Number(cachedUnshipped?.currentShipCount) || 0,
            legacyShipCount: Number(cachedUnshipped?.legacyShipCount) || 0
        };
        const projectStatsMinutes = projectId ? getProjectStatsMinutes(projectId) : 0;
        const payoutCookies = projectPayouts.reduce((sum, payout) => sum + payout.amount, 0);
        const cachedPaidMinutes = cachedUnshipped && typeof cachedUnshipped.paidShipMinutes === 'number'
            ? cachedUnshipped.paidShipMinutes
            : 0;

        let totalCookies = payoutCookies;
        if (totalCookies <= 0 && cachedUnshipped && typeof cachedUnshipped.paidCookies === 'number') {
            totalCookies = cachedUnshipped.paidCookies;
        }

        if (totalCookies <= 0 && projectId) {
            fetchProjectUnshippedStats(projectId).then(stats => {
                if (!stats) return;
                const fetchedEstimate = pickReliableCurrentScaleEstimate(
                    stats.currentScaleEstimate,
                    stats.exactSingleShipEstimate
                );
                const fetchedMeta = {
                    usesMixedCurrentOnly: !!stats.usesMixedCurrentOnly,
                    currentShipCount: Number(stats.currentShipCount) || 0,
                    legacyShipCount: Number(stats.legacyShipCount) || 0
                };
                const fetchedCookies = stats.paidCookies || 0;
                const fetchedMinutes = stats.paidShipMinutes || 0;
                const fetchedHours = stats.paidShipHours || 0;
                if (fetchedCookies <= 0 && !fetchedEstimate) return;
                renderCardStat(card, fetchedCookies, fetchedMinutes, fetchedHours, fetchedEstimate, fetchedMeta);
            });
        }

        if (totalCookies <= 0) {
            if (cachedCurrentEstimate) {
                renderCardStat(card, 0, cachedPaidMinutes, cachedUnshipped?.paidShipHours || 0, cachedCurrentEstimate, cachedEstimateMeta);
            }
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

        renderCardStat(card, totalCookies, cachedPaidMinutes, cachedUnshipped?.paidShipHours || 0, cachedCurrentEstimate, cachedEstimateMeta);

        const shouldRefreshFromProjectPage = projectId
            && (!cachedUnshipped
                || cachedPaidMinutes === 0
                || ((cachedUnshipped.paidCookies || 0) > 0 && (Number(cachedUnshipped.paidShipHours) || 0) <= 0)
                || typeof cachedUnshipped.currentShipCount !== 'number'
                || (cachedUnshipped.currentShipCount > 0 && !hasReliableCurrentScaleEstimate(cachedUnshipped.currentScaleEstimate)));

        if (shouldRefreshFromProjectPage) {
            fetchProjectUnshippedStats(projectId).then(stats => {
                if (!stats) return;
                const fetchedEstimate = pickReliableCurrentScaleEstimate(
                    stats.currentScaleEstimate,
                    stats.exactSingleShipEstimate
                );
                const fetchedMeta = {
                    usesMixedCurrentOnly: !!stats.usesMixedCurrentOnly,
                    currentShipCount: Number(stats.currentShipCount) || 0,
                    legacyShipCount: Number(stats.legacyShipCount) || 0
                };
                const fetchedCookies = stats.paidCookies > 0 ? stats.paidCookies : totalCookies;
                const fetchedMinutes = stats.paidShipMinutes || 0;
                const fetchedHours = stats.paidShipHours || 0;
                if (fetchedMinutes <= 0 && fetchedHours <= 0 && !fetchedEstimate) return;
                renderCardStat(card, fetchedCookies, fetchedMinutes, fetchedHours, fetchedEstimate, fetchedMeta);
            });
        }
    });

    if (!skipBackloadRefresh) {
        await backloadProjectStatsFromIndex(cards);
        setTimeout(() => {
            addProjectCardCookieStats(true);
        }, 0);
    }
    initProjectBoardStats();
}

async function backloadProjectStatsFromIndex(cards) {
    let stats = {};
    try {
        stats = JSON.parse(localStorage.getItem('flavortown_project_stats') || '{}');
    } catch (e) {
        stats = {};
    }

    const projectIds = Array.from(cards)
        .map(card => ({
            projectId: card.id ? card.id.replace('project_', '') : null,
            card
        }))
        .filter(({ projectId, card }) => {
            if (!projectId) return false;
            const entry = stats[projectId];
            let minutes = entry && typeof entry.minutes === 'number' ? entry.minutes : null;
            if (minutes === null) {
                const statLines = card.querySelectorAll('.project-card__stats h5');
                const timeText = statLines[1]?.textContent?.trim() || '';
                const hoursMatch = timeText.match(/(\d+)h/);
                const minsMatch = timeText.match(/(\d+)m/);
                let parsedMinutes = 0;
                if (hoursMatch) parsedMinutes += parseInt(hoursMatch[1]) * 60;
                if (minsMatch) parsedMinutes += parseInt(minsMatch[1]);
                minutes = parsedMinutes;
            }
            return minutes > 0;
        })
        .map(({ projectId }) => projectId);

    if (!projectIds.length) return;

    await Promise.all(projectIds.map(projectId => fetchProjectUnshippedStats(projectId)));
}

async function addProjectShowCookieStat(forceRefresh = false) {
    if (!/\/projects\/\d+$/.test(window.location.pathname)) return;
    
    const existingStat = document.querySelector('.flavortown-project-cookies-stat');
    const existingDetails = document.querySelector('.flavortown-project-cookies-details');
    const existingCategories = document.querySelector('.flavortown-project-category-stats');
    
    existingStat?.remove();
    existingDetails?.remove();
    existingCategories?.remove();

    const projectName = getCurrentProjectName();
    if (!projectName) return;

    const projectIdMatch = window.location.pathname.match(/\/projects\/(\d+)/);
    const projectId = projectIdMatch ? projectIdMatch[1] : null;

    const payouts = await fetchShipPayouts();
    const shipPostsOnPage = Array.from(document.querySelectorAll('article.post--ship, .post--ship'));
    const projectVoteMeta = getCurrentScaleProjectEstimateFromShipPosts(shipPostsOnPage);
    const currentScaleProjectEstimate = hasReliableCurrentScaleEstimate(projectVoteMeta.currentScaleEstimate)
        ? projectVoteMeta.currentScaleEstimate
        : null;
    const domPaidCookies = shipPostsOnPage.reduce((sum, shipPost) => {
        const footer = shipPost.querySelector('.post__payout-footer');
        const { cookiesValue } = getShipFooterPayoutMetrics(footer);
        return cookiesValue > 0 ? sum + cookiesValue : sum;
    }, 0);

    if (!payouts.length && domPaidCookies <= 0 && !currentScaleProjectEstimate) {
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
    if (!projectPayouts.length && domPaidCookies <= 0 && !currentScaleProjectEstimate) {
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

    const totalCookies = projectPayouts.reduce((sum, payout) => sum + payout.amount, 0) || domPaidCookies;
    if (totalCookies <= 0 && !currentScaleProjectEstimate) return;

    const statsWrapper = document.querySelector('.project-show-card__stats');
    if (!statsWrapper) return;

    const statsContainer = statsWrapper.querySelector('.project-show-card__stats') || statsWrapper;
    statsContainer.querySelectorAll('.project-show-card__stat').forEach(stat => {
        const text = (stat.textContent || '').trim();
        if (text.includes('🍪')) stat.remove();
    });

    let minutes = 0;
    let paidHours = 0;
    shipPostsOnPage.forEach(shipPost => {
        const footer = shipPost.querySelector('.post__payout-footer');
        const payoutMetrics = getShipFooterPayoutMetrics(footer);
        const { cookiesValue } = payoutMetrics;
        if (!cookiesValue || cookiesValue <= 0) return;

        const canonicalHours = getCanonicalPaidShipHours(shipPost, payoutMetrics);
        if (canonicalHours > 0) {
            paidHours += canonicalHours;
        }

        const cachedMinutes = shipPost.dataset.flavortownShipMinutes;
        const parsedMinutes = cachedMinutes ? parseFloat(cachedMinutes) : 0;
        if (parsedMinutes > 0) {
            minutes += parsedMinutes;
        } else {
            minutes += collectShipMinutesFromPost(shipPost);
        }
    });

    if (minutes === 0 && projectId) {
        const cachedUnshipped = getCachedProjectUnshipped(projectId);
        if (cachedUnshipped && typeof cachedUnshipped.paidShipMinutes === 'number') {
            minutes = cachedUnshipped.paidShipMinutes;
        }
        if (cachedUnshipped && typeof cachedUnshipped.paidShipHours === 'number' && cachedUnshipped.paidShipHours > 0) {
            paidHours = cachedUnshipped.paidShipHours;
        }
    }

    const rate = getProjectRateFromCookies(totalCookies, paidHours, minutes);
    const fallbackScaleMax = inferProjectFallbackScaleMax(projectVoteMeta);
    const fallbackEstimateSource = fallbackScaleMax > LEGACY_VOTE_SCALE_MAX
        ? 'current-multiplier'
        : 'legacy-multiplier';
    const projectEstimate = currentScaleProjectEstimate || (rate
        ? buildVoteEstimate(rate, { scaleMax: fallbackScaleMax, source: fallbackEstimateSource })
        : null);
    const isExactProjectEstimate = projectEstimate?.source === 'exact-votes';
    const useScaledProjectEstimateDisplay = isExactProjectEstimate || (Number(projectEstimate?.scaleMax) > LEGACY_VOTE_SCALE_MAX);

    let rateLine = formatCookieRateLine(rate);
    if ((!rate || !isFinite(rate)) && isExactProjectEstimate && projectEstimate?.multiplier) {
        rateLine = `~${formatCookieRate(projectEstimate.multiplier)} cookies/h`;
    }

    let percentileLine = formatCookiePercentileLine(rate);
    if ((!rate || !isFinite(rate)) && isExactProjectEstimate && projectEstimate?.percentile) {
        percentileLine = formatPercentileFromPercentile(projectEstimate.percentile);
    }

    if (totalCookies > 0) {
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
    }

    const detailsParent = statsWrapper.parentNode || statsWrapper;
    const detailsToRemove = detailsParent.querySelector('.flavortown-project-cookies-details');
    if (detailsToRemove) detailsToRemove.remove();
    detailsParent.querySelectorAll('.flavortown-vote-estimate, .flavortown-vote-estimate-pill, .flavortown-vote-estimate-accordion, .flavortown-project-category-stats').forEach(el => el.remove());

    const shouldRenderDetails = minutes > 0 || !!projectEstimate;
    if (shouldRenderDetails) {
        const estimate = projectEstimate;
        const sinceLastShipMinutes = getUnshippedMinutesSinceLastShip();

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

        if (rateLine && rateLine !== '--') {
            detailsRow.appendChild(createProjectShowStat(rateLine, clockIcon));
        }
        if (percentileLine && percentileLine !== '--') {
            detailsRow.appendChild(createProjectShowStat(percentileLine, trophyIcon));
        }
        if (sinceLastShipMinutes > 0) {
            detailsRow.appendChild(createProjectShowStat(`${formatMinutesCompact(sinceLastShipMinutes)} since latest ship`, clockIcon));
        }
        if (estimate?.overallScore) {
            const scoreValue = useScaledProjectEstimateDisplay
                ? formatScoreWithScale(estimate.overallScore, estimate.scaleMax || 9)
                : formatScoreValue(estimate.overallScore);
            const scoreText = `${isExactProjectEstimate ? '' : '~ '}avg ⭐ ${scoreValue}`;
            detailsRow.appendChild(createProjectShowStat(scoreText));
        }

        const detailsParent = statsWrapper.parentNode || statsWrapper;
        detailsParent.insertBefore(detailsRow, statsWrapper.nextSibling);

        if (estimate?.categories) {
            const categoriesRow = document.createElement('div');
            categoriesRow.className = 'project-show-card__stats flavortown-project-category-stats';

            const formatCategoryScore = (value) => (
                useScaledProjectEstimateDisplay
                    ? formatScoreWithScale(value, estimate.scaleMax || 9)
                    : formatScoreValue(value)
            );

            categoriesRow.appendChild(createProjectShowStat(`Originality ★${formatCategoryScore(estimate.categories.originality)}`));
            categoriesRow.appendChild(createProjectShowStat(`Technical ★${formatCategoryScore(estimate.categories.technical)}`));
            categoriesRow.appendChild(createProjectShowStat(`Usability ★${formatCategoryScore(estimate.categories.usability)}`));
            categoriesRow.appendChild(createProjectShowStat(`Storytelling ★${formatCategoryScore(estimate.categories.storytelling)}`));

            detailsParent.insertBefore(categoriesRow, detailsRow.nextSibling);
        }
    }
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

function processLists(html) {
    const lines = html.split('\n');
    const result = [];
    let currentListType = null;
    let listBuffer = [];
    let listStartNum = 1;
    
    const flushList = () => {
        if (listBuffer.length === 0) return;
        
        if (currentListType === 'ul') {
            result.push('<ul class="flavortown-md-ul">');
            listBuffer.forEach(item => {
                result.push(item.replace(/^<li class="flavortown-md-li">/, '<li>'));
            });
            result.push('</ul>');
        } else if (currentListType === 'ol') {
            result.push(`<ol class="flavortown-md-ol" start="${listStartNum}">`);
            listBuffer.forEach((item, idx) => {
                result.push(item.replace(/^<li class="flavortown-md-oli">/, '<li>'));
            });
            result.push('</ol>');
        }
        
        listBuffer = [];
        currentListType = null;
    };
    
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        
        const ulMatch = line.match(/^-\s+(.+)$/);
        const olMatch = line.match(/^(\d+)\.\s+(.+)$/);
        
        if (ulMatch) {
            const content = ulMatch[1];
            if (currentListType !== 'ul') {
                flushList();
                currentListType = 'ul';
            }
            listBuffer.push(`<li class="flavortown-md-li">${content}</li>`);
        } else if (olMatch) {
            const num = parseInt(olMatch[1], 10);
            const content = olMatch[2];
            if (currentListType !== 'ol') {
                flushList();
                currentListType = 'ol';
                listStartNum = num;
            }
            listBuffer.push(`<li class="flavortown-md-oli">${content}</li>`);
        } else {
            flushList();
            result.push(line);
        }
    }
    
    flushList();
    return result.join('\n');
}

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

        html = processLists(html);

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
        { icon: 'image', title: 'Image', action: () => insertImage(textarea) },
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

function insertImage(textarea) {
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selected = text.substring(start, end) || 'alt text';
    const insertStr = `![${selected}](url)`;
    const newText = text.substring(0, start) + insertStr + text.substring(end);
    textarea.value = newText;
    const urlStart = start + selected.length + 4;
    textarea.selectionStart = urlStart;
    textarea.selectionEnd = urlStart + 3;
    textarea.dispatchEvent(new Event('input', { bubbles: true }));
}

function getCurrentProjectIdFromPath() {
    const match = window.location.pathname.match(/\/projects\/(\d+)/);
    return match ? match[1] : null;
}

function getDevlogDraftStorageKey(projectId) {
    if (!projectId) return null;
    return `${DEVLOG_DRAFT_KEY_PREFIX}${projectId}`;
}

function readDevlogDraft(projectId) {
    const key = getDevlogDraftStorageKey(projectId);
    if (!key) return null;
    try {
        const raw = localStorage.getItem(key);
        if (!raw) return null;
        const parsed = JSON.parse(raw);
        if (!parsed || typeof parsed !== 'object') return null;
        const body = typeof parsed.body === 'string' ? parsed.body : '';
        const updatedAt = Number(parsed.updatedAt) || 0;
        if (!body.trim()) return null;
        return { body, updatedAt };
    } catch (e) {
        return null;
    }
}

function writeDevlogDraft(projectId, body) {
    const key = getDevlogDraftStorageKey(projectId);
    if (!key) return false;
    const text = typeof body === 'string' ? body : '';
    if (!text.trim()) {
        clearDevlogDraft(projectId);
        return true;
    }
    try {
        localStorage.setItem(key, JSON.stringify({
            body: text,
            updatedAt: Date.now()
        }));
        return true;
    } catch (e) {
        return false;
    }
}

function clearDevlogDraft(projectId) {
    const key = getDevlogDraftStorageKey(projectId);
    if (!key) return;
    try {
        localStorage.removeItem(key);
    } catch (e) {
    }
}

function formatDraftSavedAt(timestamp) {
    if (!timestamp || !isFinite(timestamp)) return '';
    try {
        return new Date(timestamp).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' });
    } catch (e) {
        return '';
    }
}

function isDevlogDraftAutosaveEnabled() {
    try {
        return localStorage.getItem(DEVLOG_DRAFT_AUTOSAVE_KEY) === 'true';
    } catch (e) {
        return false;
    }
}

function setDevlogDraftAutosaveEnabled(enabled) {
    try {
        localStorage.setItem(DEVLOG_DRAFT_AUTOSAVE_KEY, enabled ? 'true' : 'false');
    } catch (e) {
    }
}

function initDevlogDraftControls(wrapper, form, devlogTextarea) {
    if (!wrapper || !form || !devlogTextarea) return;
    if (wrapper.dataset.flavortownDevlogDraftInit === 'true') return;

    const projectId = getCurrentProjectIdFromPath();
    if (!projectId) return;

    const actions = wrapper.querySelector('.projects-new__actions');
    if (!actions) return;

    wrapper.dataset.flavortownDevlogDraftInit = 'true';

    const controls = document.createElement('div');
    controls.className = 'flavortown-devlog-draft-controls';

    const trailing = document.createElement('div');
    trailing.className = 'flavortown-devlog-draft-trailing';

    const saveDraftBtn = document.createElement('button');
    saveDraftBtn.type = 'button';
    saveDraftBtn.className = 'btn btn--brown flavortown-devlog-draft-btn-save';
    saveDraftBtn.textContent = 'Save Draft';

    const clearDraftBtn = document.createElement('button');
    clearDraftBtn.type = 'button';
    clearDraftBtn.className = 'flavortown-devlog-draft-btn flavortown-devlog-draft-btn-clear';
    clearDraftBtn.textContent = 'x';
    clearDraftBtn.setAttribute('aria-label', 'Clear draft');
    clearDraftBtn.title = 'Clear draft';

    const autoSaveWrap = document.createElement('label');
    autoSaveWrap.className = 'flavortown-devlog-draft-autosave';
    const autoSaveCheckbox = document.createElement('input');
    autoSaveCheckbox.type = 'checkbox';
    autoSaveCheckbox.className = 'flavortown-devlog-draft-autosave-checkbox';
    autoSaveCheckbox.checked = isDevlogDraftAutosaveEnabled();
    const autoSaveSwitch = document.createElement('span');
    autoSaveSwitch.className = 'flavortown-devlog-draft-autosave-switch';
    const autoSaveText = document.createElement('span');
    autoSaveText.className = 'flavortown-devlog-draft-autosave-text';
    autoSaveText.textContent = 'Auto-save';
    autoSaveWrap.appendChild(autoSaveCheckbox);
    autoSaveWrap.appendChild(autoSaveSwitch);
    autoSaveWrap.appendChild(autoSaveText);

    const status = document.createElement('span');
    status.className = 'flavortown-devlog-draft-status';

    const setStatus = (message) => {
        status.textContent = message || '';
    };

    let autoSaveTimer = null;
    let pendingSubmitClear = false;

    const queueAutoSave = () => {
        if (!autoSaveCheckbox.checked) return;
        if (autoSaveTimer) clearTimeout(autoSaveTimer);
        autoSaveTimer = setTimeout(() => {
            const ok = writeDevlogDraft(projectId, devlogTextarea.value || '');
            if (ok) {
                if ((devlogTextarea.value || '').trim()) {
                    setStatus(`Auto-saved ${formatDraftSavedAt(Date.now())}`);
                } else {
                    setStatus('Draft cleared');
                }
            }
        }, 700);
    };

    saveDraftBtn.addEventListener('click', () => {
        const ok = writeDevlogDraft(projectId, devlogTextarea.value || '');
        if (!ok) {
            setStatus('Failed to save draft');
            return;
        }
        if ((devlogTextarea.value || '').trim()) {
            setStatus(`Draft saved ${formatDraftSavedAt(Date.now())}`);
        } else {
            setStatus('Draft cleared');
        }
    });

    clearDraftBtn.addEventListener('click', () => {
        if (autoSaveTimer) clearTimeout(autoSaveTimer);
        clearDevlogDraft(projectId);
        setStatus('Draft cleared');
    });

    autoSaveCheckbox.addEventListener('change', () => {
        setDevlogDraftAutosaveEnabled(autoSaveCheckbox.checked);
        if (autoSaveCheckbox.checked) {
            const ok = writeDevlogDraft(projectId, devlogTextarea.value || '');
            if (ok) {
                setStatus((devlogTextarea.value || '').trim()
                    ? `Auto-save enabled (${formatDraftSavedAt(Date.now())})`
                    : 'Auto-save enabled');
            }
        } else {
            if (autoSaveTimer) clearTimeout(autoSaveTimer);
            setStatus('Auto-save disabled');
        }
    });

    devlogTextarea.addEventListener('input', queueAutoSave);

    const clearDraftAfterSuccessfulSubmit = () => {
        clearDevlogDraft(projectId);
        pendingSubmitClear = false;
    };

    form.addEventListener('submit', () => {
        pendingSubmitClear = true;
    });

    form.addEventListener('turbo:submit-end', (event) => {
        const success = !!event?.detail?.success;
        if (success) {
            clearDraftAfterSuccessfulSubmit();
            return;
        }
        pendingSubmitClear = false;
    });

    window.addEventListener('pagehide', () => {
        if (pendingSubmitClear) {
            clearDraftAfterSuccessfulSubmit();
        }
    });

    const existingDraft = readDevlogDraft(projectId);
    if (existingDraft) {
        if (!(devlogTextarea.value || '').trim()) {
            devlogTextarea.value = existingDraft.body;
            devlogTextarea.dispatchEvent(new Event('input', { bubbles: true }));
            setStatus(`Draft restored (${formatDraftSavedAt(existingDraft.updatedAt)})`);
        } else {
            setStatus(`Draft available (${formatDraftSavedAt(existingDraft.updatedAt)})`);
        }
    }

    controls.appendChild(status);
    trailing.appendChild(autoSaveWrap);
    trailing.appendChild(clearDraftBtn);
    trailing.appendChild(saveDraftBtn);

    const firstSubmit = actions.querySelector('button[type="submit"], input[type="submit"]');
    if (firstSubmit && firstSubmit.parentNode === actions) {
        trailing.appendChild(firstSubmit);
    }
    controls.appendChild(trailing);

    actions.insertBefore(controls, actions.firstChild);
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

            const form = wrapper.querySelector('form') || wrapper.closest('form');
            const devlogTextarea = wrapper.querySelector('#post_devlog_body');
            if (devlogTextarea) {
                addMarkdownToolbar(devlogTextarea);
                initSlackEmojiAutocomplete(devlogTextarea, wrapper);
                if (form) {
                    attachSlackEmojiSubmitHandler(form, devlogTextarea);
                }
                initDevlogDraftControls(wrapper, form, devlogTextarea);
            }

            initDevlogChangelog(wrapper);

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

function readChangelogCache() {
    try {
        const raw = localStorage.getItem(CHANGELOG_CACHE_KEY);
        if (!raw) return {};
        const parsed = JSON.parse(raw);
        return parsed && typeof parsed === 'object' ? parsed : {};
    } catch (e) {
        return {};
    }
}

function writeChangelogCache(data) {
    try {
        localStorage.setItem(CHANGELOG_CACHE_KEY, JSON.stringify(data || {}));
    } catch (e) {
    }
}

function getChangelogCacheEntry(cacheKey) {
    if (!cacheKey) return null;
    const cache = readChangelogCache();
    const entry = cache[cacheKey];
    if (!entry) return null;
    if (entry.updatedAt && Date.now() - entry.updatedAt > CHANGELOG_CACHE_TTL) return null;
    return entry;
}

function setChangelogCacheEntry(cacheKey, entry) {
    if (!cacheKey || !entry) return;
    const cache = readChangelogCache();
    cache[cacheKey] = { ...entry, updatedAt: Date.now() };
    writeChangelogCache(cache);
}

function getChangelogDismissed() {
    try {
        const raw = localStorage.getItem(CHANGELOG_DISMISS_KEY);
        return raw ? JSON.parse(raw) : {};
    } catch (e) {
        return {};
    }
}

function shouldDismissChangelog(projectId) {
    if (!projectId) return false;
    const dismissed = getChangelogDismissed();
    return !!dismissed[projectId];
}

function setChangelogDismissed(projectId) {
    if (!projectId) return;
    const dismissed = getChangelogDismissed();
    dismissed[projectId] = Date.now();
    try {
        localStorage.setItem(CHANGELOG_DISMISS_KEY, JSON.stringify(dismissed));
    } catch (e) {
    }
}

function getChangelogOverride(projectId) {
    if (!projectId) return null;
    try {
        const raw = localStorage.getItem(CHANGELOG_OVERRIDE_KEY);
        if (!raw) return null;
        const parsed = JSON.parse(raw);
        const entry = parsed?.[projectId];
        if (!entry || !entry.since) return null;
        return entry;
    } catch (e) {
        return null;
    }
}

function setChangelogOverride(projectId, override) {
    if (!projectId) return;
    try {
        const raw = localStorage.getItem(CHANGELOG_OVERRIDE_KEY);
        const parsed = raw ? JSON.parse(raw) : {};
        if (!override) {
            delete parsed[projectId];
        } else {
            parsed[projectId] = { ...override, updatedAt: Date.now() };
        }
        localStorage.setItem(CHANGELOG_OVERRIDE_KEY, JSON.stringify(parsed));
    } catch (e) {
    }
}

function toLocalDatetimeInputValue(date) {
    if (!date) return '';
    const pad = (val) => String(val).padStart(2, '0');
    return [
        date.getFullYear(),
        pad(date.getMonth() + 1),
        pad(date.getDate())
    ].join('-') + 'T' + [pad(date.getHours()), pad(date.getMinutes())].join(':');
}

function parseLocalDatetimeInput(value) {
    if (!value) return null;
    const [datePart, timePart] = value.split('T');
    if (!datePart || !timePart) return null;
    const [year, month, day] = datePart.split('-').map(Number);
    const [hour, minute] = timePart.split(':').map(Number);
    if ([year, month, day, hour, minute].some((val) => Number.isNaN(val))) return null;
    return new Date(year, month - 1, day, hour, minute);
}

function parseGithubRepoSlug(repoUrl) {
    if (!repoUrl) return null;
    try {
        const parsed = new URL(repoUrl, window.location.origin);
        if (!parsed.hostname.includes('github.com')) return null;
        const parts = parsed.pathname.split('/').filter(Boolean);
        if (parts.length < 2) return null;
        return { owner: parts[0], repo: parts[1].replace(/\.git$/i, ''), slug: `${parts[0]}/${parts[1].replace(/\.git$/i, '')}` };
    } catch (e) {
        return null;
    }
}

function extractCommitRefFromDevlog(devlogEl, repoSlug) {
    if (!devlogEl) return null;
    const links = Array.from(devlogEl.querySelectorAll('a[href*="/commit/"]'));
    for (const link of links) {
        const href = link.getAttribute('href');
        if (!href) continue;
        const match = href.match(/github\.com\/([^/]+)\/([^/]+)\/commit\/([a-f0-9]{7,40})/i);
        if (!match) continue;
        const slug = `${match[1]}/${match[2]}`;
        if (repoSlug && slug.toLowerCase() !== repoSlug.toLowerCase()) continue;
        return { sha: match[3], url: href };
    }

    const text = devlogEl.textContent || '';
    if (!/commit|sha|hash/i.test(text)) return null;
    const shaMatch = text.match(/\b([a-f0-9]{7,40})\b/i);
    return shaMatch ? { sha: shaMatch[1] } : null;
}

function getLastDevlogInfo() {
    const devlogs = Array.from(document.querySelectorAll('article.post--devlog, .post--devlog'));
    for (const devlog of devlogs) {
        const timeEl = devlog.querySelector('.post__time');
        const date = parseDateFromTimeElement(timeEl);
        if (!date) continue;
        return { element: devlog, date };
    }
    return null;
}

function isBotCommit(commit) {
    const login = typeof commit?.author === 'string' ? commit.author : commit?.author?.login || '';
    const name = commit?.authorName || commit?.commit?.author?.name || '';
    const committer = commit?.commit?.committer?.name || '';
    const combined = `${login} ${name} ${committer}`.toLowerCase();
    if (combined.includes('bot')) return true;
    if (combined.includes('dependabot') || combined.includes('github-actions')) return true;
    return false;
}

function isMergeCommit(commit) {
    if (commit?.isMerge) return true;
    const message = commit?.message || commit?.commit?.message || '';
    if (message.startsWith('Merge ')) return true;
    if (Array.isArray(commit?.parents) && commit.parents.length > 1) return true;
    return false;
}

function normalizeCommitForChangelog(commit) {
    if (!commit) return null;
    const message = commit.commit?.message || commit.message || '';
    const subject = commit.subject || formatCommitSubject(message) || 'Update';
    const url = commit.html_url || commit.url || '';
    const date = commit.date || commit.commit?.author?.date || commit.commit?.committer?.date || null;
    const authorName = commit.authorName || (typeof commit.author === 'string' ? commit.author : commit.author?.login) || commit.commit?.author?.name || '';
    const normalized = {
        sha: commit.sha,
        subject,
        url,
        date,
        authorName,
        message,
        isMerge: isMergeCommit(commit),
        isBot: isBotCommit({ author: authorName, commit: commit.commit })
    };
    return normalized;
}

function getChangelogFormat() {
    return localStorage.getItem(CHANGELOG_FORMAT_KEY) || 'subject';
}

function setChangelogFormat(value) {
    if (!value) return;
    localStorage.setItem(CHANGELOG_FORMAT_KEY, value);
}

function formatChangelogCommitLabel(commit, format) {
    const subject = commit.subject || 'Update';
    const hash = commit.sha ? commit.sha.slice(0, 7) : '';
    switch (format) {
        case 'hash':
            return hash || subject;
        case 'hash-subject':
            return hash ? `(${hash}) ${subject}` : subject;
        case 'subject-hash':
            return hash ? `${subject} (${hash})` : subject;
        case 'subject':
        default:
            return subject;
    }
}

function getChangelogCommitParts(commit) {
    return {
        subject: commit.subject || 'Update',
        hash: commit.sha ? commit.sha.slice(0, 7) : ''
    };
}

function shortenCommitUrl(url, hash) {
    if (!url || !hash) return url;
    try {
        const parsed = new URL(url);
        const parts = parsed.pathname.split('/');
        const commitIndex = parts.findIndex(part => part === 'commit');
        if (commitIndex >= 0 && parts[commitIndex + 1]) {
            parts[commitIndex + 1] = hash;
            parsed.pathname = parts.join('/');
            return parsed.toString();
        }
        return url;
    } catch (e) {
        return url;
    }
}

function formatCommitSubject(message) {
    if (!message) return '';
    return message.split('\n')[0].trim();
}

function escapeMarkdown(text) {
    if (!text) return '';
    return text.replace(/([\\\[\]])/g, '\\$1');
}

function buildChangelogMarkdown(commits, format = null) {
    const lines = ['### Changelog'];
    const selectedFormat = format || getChangelogFormat();
    commits.forEach(commit => {
        const { subject, hash } = getChangelogCommitParts(commit);
        const escapedSubject = escapeMarkdown(subject);
        const escapedHash = escapeMarkdown(hash);
        const url = commit.url || '';
        const shortUrl = shortenCommitUrl(url, hash);
        if (url) {
            if (selectedFormat === 'hash') {
                lines.push(`- [${escapedHash || escapedSubject}](${shortUrl})`);
                return;
            }
            if (selectedFormat === 'hash-subject') {
                const hashLink = escapedHash ? `[${escapedHash}](${shortUrl})` : `[${escapedSubject}](${shortUrl})`;
                lines.push(`- ${hashLink} ${escapedSubject}`);
                return;
            }
            if (selectedFormat === 'subject-hash') {
                const hashLink = escapedHash ? `[${escapedHash}](${shortUrl})` : `[${escapedSubject}](${shortUrl})`;
                lines.push(`- ${escapedSubject} (${hashLink})`);
                return;
            }
            lines.push(`- [${escapedSubject}](${shortUrl})`);
            return;
        }
        const label = escapeMarkdown(formatChangelogCommitLabel(commit, selectedFormat));
        lines.push(`- ${label}`);
    });
    return lines.join('\n');
}

function readTodoCache() {
    try {
        const raw = localStorage.getItem(TODO_CACHE_KEY);
        if (!raw) return null;
        const parsed = JSON.parse(raw);
        if (!parsed || typeof parsed !== 'object') return null;
        return parsed;
    } catch (e) {
        return null;
    }
}

function writeTodoCache(data) {
    try {
        localStorage.setItem(TODO_CACHE_KEY, JSON.stringify(data || {}));
    } catch (e) {
    }
}

async function fetchTodoData(force = false) {
    const cached = readTodoCache();
    
    if (!force && cached?.updatedAt && Date.now() - cached.updatedAt < TODO_CACHE_TTL) {
        return cached.data || null;
    }

    try {
        const response = await fetch(TODO_JSON_URL);
        if (!response.ok) {
            return cached?.data || null;
        }
        const data = await response.json();
        writeTodoCache({ updatedAt: Date.now(), data });
        return data;
    } catch (e) {
        return cached?.data || null;
    }
}

function getProjectTodoKey(projectId) {
    return `${PROJECT_TODO_KEY_PREFIX}${projectId}`;
}

function readProjectTodos(projectId) {
    if (!projectId) return { items: [], slackSyncedAt: 0 };
    try {
        const raw = localStorage.getItem(getProjectTodoKey(projectId));
        if (!raw) return { items: [], slackSyncedAt: 0 };
        const parsed = JSON.parse(raw);
        if (!parsed || typeof parsed !== 'object') return { items: [], slackSyncedAt: 0 };
        return {
            items: Array.isArray(parsed.items) ? parsed.items : [],
            slackSyncedAt: parsed.slackSyncedAt || 0
        };
    } catch (e) {
        return { items: [], slackSyncedAt: 0 };
    }
}

function writeProjectTodos(projectId, items, slackSyncedAt = 0) {
    if (!projectId) return;
    try {
        localStorage.setItem(getProjectTodoKey(projectId), JSON.stringify({
            items: items || [],
            slackSyncedAt: slackSyncedAt || Date.now(),
            updatedAt: Date.now()
        }));
    } catch (e) {
    }
}

function normalizeTodoStatus(value) {
    const raw = (value || '').toString().toLowerCase().trim();
    if (raw === 'in-progress' || raw === 'in progress' || raw === 'doing') return 'in_progress';
    if (raw === 'done' || raw === 'complete' || raw === 'completed') return 'done';
    return 'todo';
}

function generateLocalTodoId() {
    if (window.crypto?.randomUUID) {
        return `local_${window.crypto.randomUUID()}`;
    }
    return `local_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

function normalizeSlackTodo(task) {
    if (!task) return null;
    const status = normalizeTodoStatus(task.status);
    return {
        id: `slack:${task.id}`,
        externalId: task.id,
        title: task.title || task.text || 'Untitled task',
        description: task.description || '',
        status,
        priority: task.priority || 'medium',
        tags: Array.isArray(task.tags) ? task.tags : [],
        createdAt: task.createdAt || task.created_at || null,
        updatedAt: task.updatedAt || task.updated_at || null,
        source: 'slack',
        sourceMeta: {
            slackId: task.createdBy?.slackId || task.createdBy?.slack_id || null,
            slackName: task.createdBy?.slackName || task.createdBy?.slack_name || null
        }
    };
}

function extractTodoTasks(data) {
    if (!data) return [];
    
    if (data.users && typeof data.users === 'object') {
        const tasks = [];
        Object.entries(data.users).forEach(([userKey, userData]) => {
            if (!userData || !userData.projects) return;

            Object.entries(userData.projects).forEach(([projectKey, project]) => {
                if (!project) return;
                const items = project.tasks || [];
                if (!Array.isArray(items)) return;

                items.forEach(item => {
                    tasks.push({
                        ...item,
                        project: { name: project.name || projectKey },
                        slackDisplayName: userKey
                    });
                });
            });
        });
        return tasks;
    }
    return [];
}

function filterSlackTodosForProject(tasks, projectId, projectName, currentUser) {
    if (!tasks.length) return [];
    const normalizedProjectName = normalizeProjectName(projectName || '');
    const normalizedUser = currentUser ? normalizeUsernameForComparison(currentUser) : null;

    return tasks.filter(task => {
        if (!task || task.deleted) return false;
        const project = task.project || {};
        const matchesId = project.id && String(project.id) === String(projectId);
        const matchesName = project.name && normalizeProjectName(project.name) === normalizedProjectName;
        if (!matchesId && !matchesName) return false;

        const slackDisplayName = task.slackDisplayName;
        if (slackDisplayName && normalizedUser) {
            const normalizedSlackName = normalizeUsernameForComparison(slackDisplayName);
            if (normalizedSlackName !== normalizedUser) {
                return false;
            }
        }

        const target = task.targetUser || task.user || null;
        const targetName = target?.flavortownName || target?.flavortown_name || null;
        if (targetName && normalizedUser) {
            return normalizeUsernameForComparison(targetName) === normalizedUser;
        }
        if (targetName && !normalizedUser) return false;
        return true;
    });
}

function mergeSlackTodos(localItems, slackItems, options = {}) {
    const preserveMissingSlack = !!options.preserveMissingSlack;
    const local = Array.isArray(localItems) ? localItems : [];
    const slackMap = new Map();
    local.forEach(item => {
        if (item?.source === 'slack' && item.externalId) {
            slackMap.set(item.externalId, item);
        }
    });

    const mergedSlack = [];
    const slackIds = new Set();

    slackItems.forEach(task => {
        if (!task) return;
        slackIds.add(task.externalId);
        const existing = slackMap.get(task.externalId);
        if (existing) {
            mergedSlack.push({
                ...existing,
                ...task,
                id: existing.id || task.id,
                source: 'slack',
                externalId: task.externalId
            });
        } else {
            mergedSlack.push(task);
        }
    });

    const localOnly = local.filter(item => item?.source !== 'slack');
    const preservedSlack = preserveMissingSlack
        ? local.filter(item => item?.source === 'slack' && item.externalId && !slackIds.has(item.externalId))
        : [];
    return [...localOnly, ...mergedSlack, ...preservedSlack];
}

function sortTodos(items) {
    return (items || []).slice().sort((a, b) => {
        const statusA = TODO_STATUS_ORDER.indexOf(a.status || 'todo');
        const statusB = TODO_STATUS_ORDER.indexOf(b.status || 'todo');
        if (statusA !== statusB) return statusA - statusB;
        const updatedA = new Date(a.updatedAt || a.createdAt || 0).getTime();
        const updatedB = new Date(b.updatedAt || b.createdAt || 0).getTime();
        return updatedB - updatedA;
    });
}

function createTodoStatusSelect(status, disabled) {
    const select = document.createElement('select');
    select.className = 'flavortown-todo-status';
    select.disabled = !!disabled;
    Object.entries(TODO_STATUS_LABELS).forEach(([value, label]) => {
        const option = document.createElement('option');
        option.value = value;
        option.textContent = label;
        select.appendChild(option);
    });
    select.value = status || 'todo';
    return select;
}

function insertChangelogMarkdown(textarea, markdown) {
    if (!textarea || !markdown) return;
    const block = markdown.trim();
    const value = textarea.value || '';
    const stripMarkers = (text) => text
        .replace(/<!--\s*flavortown-changelog:(start|end)\s*-->\s*/g, '')
        .replace(/\[\/\/\]: # \(flavortown-changelog:(start|end)\)\s*/g, '');
    const stripExistingChangelog = (text) => {
        if (!text) return '';
        const lines = text.split('\n');
        const output = [];
        let i = 0;
        while (i < lines.length) {
            if (lines[i].trim() === '### Changelog') {
                i += 1;
                while (i < lines.length) {
                    const line = lines[i];
                    if (!line.trim()) {
                        i += 1;
                        break;
                    }
                    if (/^\s*[-*]\s+/.test(line)) {
                        i += 1;
                        continue;
                    }
                    break;
                }
                continue;
            }
            output.push(lines[i]);
            i += 1;
        }
        return output.join('\n').trim();
    };

    const cleaned = stripExistingChangelog(stripMarkers(value)).trim();
    textarea.value = cleaned ? `${cleaned}\n\n${block}\n` : `${block}\n`;
    textarea.dispatchEvent(new Event('input', { bubbles: true }));
}

function getNextLinkFromHeader(linkHeader) {
    if (!linkHeader) return null;
    const match = linkHeader.match(/<([^>]+)>;\s*rel="next"/i);
    return match ? match[1] : null;
}

async function fetchGithubCommitDate(owner, repo, sha) {
    if (!owner || !repo || !sha) return null;
    const url = `https://api.github.com/repos/${owner}/${repo}/commits/${sha}`;
    const apiKey = getGithubApiKey();
    const headers = { 'Accept': 'application/vnd.github+json' };
    if (apiKey) {
        headers['Authorization'] = `Bearer ${apiKey}`;
    }
    const res = await fetch(url, { headers });
    if (!res.ok) return null;
    const data = await res.json();
    const dateStr = data?.commit?.author?.date || data?.commit?.committer?.date;
    if (!dateStr) return null;
    const date = new Date(dateStr);
    return isNaN(date.getTime()) ? null : date;
}

async function fetchGithubCommitsSince(owner, repo, sinceIso, branch = null) {
    if (!owner || !repo || !sinceIso) return { commits: [], error: 'missing' };
    let url = `https://api.github.com/repos/${owner}/${repo}/commits?since=${encodeURIComponent(sinceIso)}&per_page=100`;
    if (branch) {
        url += `&sha=${encodeURIComponent(branch)}`;
    }
    const commits = [];
    const apiKey = getGithubApiKey();
    const headers = { 'Accept': 'application/vnd.github+json' };
    if (apiKey) {
        headers['Authorization'] = `Bearer ${apiKey}`;
    }

    while (url && commits.length < CHANGELOG_MAX_COMMITS) {
        const res = await fetch(url, { headers });
        if (!res.ok) {
            const remaining = res.headers.get('x-ratelimit-remaining');
            if (res.status === 403 && remaining === '0') {
                return { commits: [], error: 'rate-limit' };
            }
            return { commits: [], error: `request-${res.status}` };
        }
        const data = await res.json();
        if (Array.isArray(data)) {
            commits.push(...data);
        }
        if (commits.length >= CHANGELOG_MAX_COMMITS) break;
        url = getNextLinkFromHeader(res.headers.get('link'));
    }

    return { commits };
}

async function fetchGithubBranches(owner, repo) {
    if (!owner || !repo) return [];
    const url = `https://api.github.com/repos/${owner}/${repo}/branches?per_page=100`;
    const apiKey = getGithubApiKey();
    const headers = { 'Accept': 'application/vnd.github+json' };
    if (apiKey) {
        headers['Authorization'] = `Bearer ${apiKey}`;
    }

    try {
        const res = await fetch(url, { headers });
        if (!res.ok) {
            return [];
        }
        const data = await res.json();
        return Array.isArray(data) ? data.map(b => b.name) : [];
    } catch (e) {
        return [];
    }
}

async function fetchAllBranchesCommits(owner, repo, sinceIso) {
    if (!owner || !repo || !sinceIso) return { commits: [], error: 'missing', branchesScanned: 0 };

    const defaultResult = await fetchGithubCommitsSince(owner, repo, sinceIso);
    if (defaultResult.error === 'rate-limit') {
        return { commits: [], error: 'rate-limit', branchesScanned: 0 };
    }

    const allCommits = new Map();
    let branchesScanned = 1;

    (defaultResult.commits || []).forEach(commit => {
        if (commit?.sha) {
            allCommits.set(commit.sha, commit);
        }
    });

    const branches = await fetchGithubBranches(owner, repo);
    
    const defaultBranchNames = ['main', 'master'];
    const branchesToScan = branches.filter(b => !defaultBranchNames.includes(b.toLowerCase()));

    for (const branch of branchesToScan) {
        try {
            const result = await fetchGithubCommitsSince(owner, repo, sinceIso, branch);
            if (result.error === 'rate-limit') {
                break;
            }
            branchesScanned++;

            (result.commits || []).forEach(commit => {
                if (commit?.sha) {
                    allCommits.set(commit.sha, commit);
                }
            });
        } catch (e) {
            console.warn(`Flavortown: Failed to fetch commits from branch ${branch}:`, e);
        }
    }

    const commits = Array.from(allCommits.values()).sort((a, b) => {
        const dateA = new Date(a?.commit?.author?.date || a?.commit?.committer?.date || 0);
        const dateB = new Date(b?.commit?.author?.date || b?.commit?.committer?.date || 0);
        return dateB - dateA;
    });

    return {
        commits,
        error: null,
        branchesScanned
    };
}

async function fetchGithubRecentCommits(owner, repo, limit = CHANGELOG_RECENT_COMMITS) {
    if (!owner || !repo) return { commits: [], error: 'missing' };
    const safeLimit = Math.max(1, Math.min(limit || CHANGELOG_RECENT_COMMITS, 50));
    const url = `https://api.github.com/repos/${owner}/${repo}/commits?per_page=${safeLimit}`;
    const apiKey = getGithubApiKey();
    const headers = { 'Accept': 'application/vnd.github+json' };
    if (apiKey) {
        headers['Authorization'] = `Bearer ${apiKey}`;
    }
    const res = await fetch(url, { headers });
    if (!res.ok) {
        const remaining = res.headers.get('x-ratelimit-remaining');
        if (res.status === 403 && remaining === '0') {
            return { commits: [], error: 'rate-limit' };
        }
        return { commits: [], error: `request-${res.status}` };
    }
    const data = await res.json();
    return { commits: Array.isArray(data) ? data : [] };
}

async function initDevlogChangelog(wrapper) {
    if (!wrapper || wrapper.dataset.flavortownChangelog === 'true') return;
    wrapper.dataset.flavortownChangelog = 'true';

    const devlogTextarea = wrapper.querySelector('#post_devlog_body');
    if (!devlogTextarea) return;

    const projectName = getCurrentProjectName();
    if (!projectName) return;

    const projectIdMatch = window.location.pathname.match(/\/projects\/(\d+)/);
    const projectId = projectIdMatch ? projectIdMatch[1] : null;
    if (projectId && shouldDismissChangelog(projectId)) return;

    const card = document.createElement('div');
    card.className = 'flavortown-changelog-card';
    card.innerHTML = `
        <div class="flavortown-changelog__header">
            <div>
                <div class="flavortown-changelog__title">Changelog since last devlog</div>
                <div class="flavortown-changelog__meta" data-role="meta">Looking up your repo…</div>
            </div>
            <div class="flavortown-changelog__header-actions">
                <button type="button" class="flavortown-changelog__icon-btn" data-action="refresh" aria-label="Refresh">↻</button>
                <button type="button" class="flavortown-changelog__icon-btn" data-action="dismiss" aria-label="Dismiss">×</button>
            </div>
        </div>
        <div class="flavortown-changelog__body">
            <div class="flavortown-changelog__status" data-role="status">Loading commits…</div>
            <ul class="flavortown-changelog__list" data-role="list"></ul>
            <button type="button" class="flavortown-changelog__more" data-role="more">Show all</button>
        </div>
        <div class="flavortown-changelog__actions">
            <button type="button" class="btn btn--brown" data-action="insert">Insert into devlog</button>
            <button type="button" class="btn btn--borderless" data-action="adjust">Options</button>
        </div>
        <div class="flavortown-changelog__adjust is-hidden" data-role="adjust">
            <label class="flavortown-changelog__adjust-label">Start date/time</label>
            <input type="datetime-local" class="flavortown-changelog__input" data-role="since-input" />
            <label class="flavortown-changelog__adjust-label">Or pick a commit</label>
            <select class="flavortown-changelog__input" data-role="commit-select">
                <option value="">Select a commit</option>
            </select>
            <label class="flavortown-changelog__adjust-label">Commit display</label>
            <select class="flavortown-changelog__input" data-role="format-select"></select>
            <label class="flavortown-changelog__adjust-label">GitHub API Key <span style="opacity:0.6;font-size:0.85em">(prevents rate limits)</span></label>
            <input type="password" class="flavortown-changelog__input" data-role="github-key" placeholder="ghp_xxxx..." />
            <div class="flavortown-changelog__adjust-actions">
                <button type="button" class="btn btn--borderless" data-action="reset">Use last devlog</button>
                <button type="button" class="btn btn--brown" data-action="apply">Apply</button>
            </div>
        </div>
    `;

    const insertTarget = wrapper.querySelector('.projects-new__card') || wrapper;
    insertTarget.parentNode.insertBefore(card, insertTarget);

    const metaEl = card.querySelector('[data-role="meta"]');
    const statusEl = card.querySelector('[data-role="status"]');
    const listEl = card.querySelector('[data-role="list"]');
    const moreBtn = card.querySelector('[data-role="more"]');
    const adjustPanel = card.querySelector('[data-role="adjust"]');
    const sinceInput = card.querySelector('[data-role="since-input"]');
    const commitSelect = card.querySelector('[data-role="commit-select"]');
    const formatSelect = card.querySelector('[data-role="format-select"]');
    const githubKeyInput = card.querySelector('[data-role="github-key"]');
    if (githubKeyInput) {
        githubKeyInput.value = getGithubApiKey();
    }
    const insertBtn = card.querySelector('[data-action="insert"]');
    const adjustBtn = card.querySelector('[data-action="adjust"]');
    const refreshBtn = card.querySelector('[data-action="refresh"]');
    const dismissBtn = card.querySelector('[data-action="dismiss"]');
    const resetBtn = card.querySelector('[data-action="reset"]');
    const applyBtn = card.querySelector('[data-action="apply"]');

    const setButtonsDisabled = (disabled) => {
        [insertBtn, adjustBtn, refreshBtn, resetBtn, applyBtn].forEach(btn => {
            if (btn) btn.disabled = disabled;
        });
    };

    let repoUrl = await getRepoUrlForProjectName(projectName);
    let repoSlug = repoUrl ? parseGithubRepoSlug(repoUrl) : null;
    
    if (!repoSlug) {
        metaEl.textContent = 'Looking up your repo…';
        repoUrl = await getRepoUrlForProjectName(projectName, true);
        repoSlug = repoUrl ? parseGithubRepoSlug(repoUrl) : null;
    }

    adjustBtn?.addEventListener('click', () => {
        adjustPanel.classList.toggle('is-hidden');
    });

    refreshBtn?.addEventListener('click', async () => {
        if (!repoSlug) {
            metaEl.textContent = 'Looking up your repo…';
            repoUrl = await getRepoUrlForProjectName(projectName, true);
            repoSlug = repoUrl ? parseGithubRepoSlug(repoUrl) : null;
            
            if (repoSlug) {
                setButtonsDisabled(false);
                await loadChangelog({ force: true });
                return;
            }
        }
        loadChangelog({ force: true });
    });

    dismissBtn?.addEventListener('click', () => {
        if (projectId) setChangelogDismissed(projectId);
        card.remove();
    });

    resetBtn?.addEventListener('click', async () => {
        if (projectId) setChangelogOverride(projectId, null);
        adjustPanel.classList.add('is-hidden');
        await loadChangelog({ force: true });
    });

    applyBtn?.addEventListener('click', async () => {
        if (githubKeyInput) {
            const key = githubKeyInput.value.trim();
            if (key) {
                setGithubApiKey(key);
            } else {
                setGithubApiKey('');
            }
        }
        const inputDate = parseLocalDatetimeInput(sinceInput.value);
        if (!inputDate || isNaN(inputDate.getTime())) return;
        if (projectId) setChangelogOverride(projectId, { since: inputDate.toISOString() });
        adjustPanel.classList.add('is-hidden');
        await loadChangelog({ force: true, sinceDate: inputDate });
    });

    commitSelect.addEventListener('change', () => {
        if (!commitSelect.value) return;
        const date = new Date(commitSelect.value);
        if (!isNaN(date.getTime())) {
            sinceInput.value = toLocalDatetimeInputValue(date);
        }
    });

    if (formatSelect) {
        const selectedFormat = getChangelogFormat();
        formatSelect.innerHTML = CHANGELOG_FORMATS
            .map(option => `<option value="${option.id}">${option.label}</option>`)
            .join('');
        formatSelect.value = selectedFormat;
    }

    if (!repoSlug) {
        setButtonsDisabled(true);
        const suggestion = await getRepoSuggestionForProjectName(projectName);
        if (suggestion?.repoUrl) {
            metaEl.textContent = `Found a repo suggestion for ${projectName}.`;
            statusEl.textContent = '';
            const suggestionRow = document.createElement('div');
            suggestionRow.className = 'flavortown-changelog__repo-suggestion';
            suggestionRow.innerHTML = `
                <span class="flavortown-changelog__repo-url">${suggestion.repoUrl}</span>
                <button type="button" class="flavortown-changelog__repo-btn">Use repo</button>
            `;
            statusEl.appendChild(suggestionRow);
            suggestionRow.querySelector('button')?.addEventListener('click', async () => {
                const repoMap = readProjectRepoMap();
                repoMap[normalizeProjectName(projectName)] = suggestion.repoUrl;
                writeProjectRepoMap(repoMap);
                repoUrl = suggestion.repoUrl;
                repoSlug = parseGithubRepoSlug(repoUrl);
                setButtonsDisabled(false);
                await loadChangelog();
            });
        } else {
            metaEl.textContent = 'Link a GitHub repo to show commits here.';
            statusEl.textContent = 'No repo found for this project.';
        }
        listEl.innerHTML = '';
        moreBtn.style.display = 'none';
        return;
    }

    setButtonsDisabled(false);

    async function loadChangelog(options = {}) {
        statusEl.textContent = 'Loading commits…';
        listEl.innerHTML = '';
        moreBtn.style.display = 'none';

        const lastDevlog = getLastDevlogInfo();
        const lastDevlogDate = lastDevlog?.date || null;
        let sinceDate = lastDevlogDate || new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

        const override = projectId ? getChangelogOverride(projectId) : null;
        if (override?.since) {
            const overrideDate = new Date(override.since);
            if (!isNaN(overrideDate.getTime())) {
                sinceDate = overrideDate;
            }
        }

        if (options.sinceDate) {
            sinceDate = options.sinceDate;
        }

        if (!override?.since && !lastDevlogDate && lastDevlog?.element) {
            const commitRef = extractCommitRefFromDevlog(lastDevlog.element, repoSlug?.slug);
            if (commitRef?.sha) {
                const commitDate = await fetchGithubCommitDate(repoSlug.owner, repoSlug.repo, commitRef.sha);
                if (commitDate) sinceDate = commitDate;
            }
        }

        sinceDate = new Date(sinceDate.getTime());
        sinceDate.setSeconds(0, 0);

        if (sinceInput) {
            sinceInput.value = toLocalDatetimeInputValue(sinceDate);
        }

        const sinceIso = sinceDate.toISOString();
        const cacheKey = `${repoSlug.slug}|all-branches|${sinceIso}`;
        const recentCacheKey = `${repoSlug.slug}|recent|${CHANGELOG_RECENT_COMMITS}`;
        let cached = options.force ? null : getChangelogCacheEntry(cacheKey);
        let recentCached = options.force ? null : getChangelogCacheEntry(recentCacheKey);
        let normalizedCommits = cached?.commits || [];
        let normalizedRecentCommits = recentCached?.commits || [];
        let branchesScanned = cached?.branchesScanned || 1;

        if (!cached) {
            const response = await fetchAllBranchesCommits(repoSlug.owner, repoSlug.repo, sinceIso);
            if (response.error) {
                statusEl.textContent = response.error === 'rate-limit'
                    ? 'GitHub rate limit hit. Try again later.'
                    : 'Failed to load commits.';
                return;
            }

            branchesScanned = response.branchesScanned || 1;
            normalizedCommits = (response.commits || [])
                .map(normalizeCommitForChangelog)
                .filter(Boolean);
            setChangelogCacheEntry(cacheKey, { commits: normalizedCommits, branchesScanned });
        }

        if (!recentCached) {
            const recentResponse = await fetchGithubRecentCommits(repoSlug.owner, repoSlug.repo, CHANGELOG_RECENT_COMMITS);
            if (!recentResponse.error) {
                normalizedRecentCommits = (recentResponse.commits || [])
                    .map(normalizeCommitForChangelog)
                    .filter(Boolean);
                setChangelogCacheEntry(recentCacheKey, { commits: normalizedRecentCommits });
            }
        }

        const displayCommits = normalizedCommits
            .filter(commit => !commit.isBot)
            .filter(commit => !commit.isMerge);

        const recentCommits = (normalizedRecentCommits.length ? normalizedRecentCommits : normalizedCommits)
            .filter(commit => !commit.isBot)
            .filter(commit => !commit.isMerge);
        const commitSelectCommits = recentCommits.slice(0, CHANGELOG_RECENT_COMMITS);

        commitSelect.innerHTML = '<option value="">Select a commit</option>';
        const seenCommits = new Set();
        commitSelectCommits.forEach(commit => {
            if (!commit.date) return;
            const key = commit.sha || commit.date;
            if (seenCommits.has(key)) return;
            seenCommits.add(key);
            const opt = document.createElement('option');
            opt.value = commit.date;
            opt.textContent = commit.subject || commit.sha?.slice(0, 7) || 'Commit';
            commitSelect.appendChild(opt);
        });
        const sinceLabel = sinceDate.toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' });
        const branchInfo = branchesScanned > 1 ? ` • ${branchesScanned} branches scanned` : '';
        metaEl.textContent = `${repoSlug.slug} • since ${sinceLabel}${branchInfo}`;
        if (!displayCommits.length) {
            if (normalizedCommits.length > 0) {
                statusEl.textContent = 'All commits since your last devlog appear to be already documented. Great job keeping your devlogs up to date!';
            } else {
                statusEl.textContent = 'No commits since your last devlog.';
            }
            return;
        }
        statusEl.textContent = `${displayCommits.length} commit${displayCommits.length === 1 ? '' : 's'} found`;

        let currentLimit = 6;
        const renderList = (limit = currentLimit) => {
            currentLimit = limit;
            listEl.innerHTML = '';
            displayCommits.slice(0, limit).forEach(commit => {
                const item = document.createElement('li');
                const format = formatSelect?.value || getChangelogFormat();
                const label = formatChangelogCommitLabel(commit, format);
                if (commit.url) {
                    const link = document.createElement('a');
                    link.href = commit.url;
                    link.target = '_blank';
                    link.rel = 'noopener';
                    link.textContent = label;
                    item.appendChild(link);
                } else {
                    item.textContent = label;
                }
                listEl.appendChild(item);
            });
            if (displayCommits.length > limit) {
                moreBtn.style.display = 'inline-flex';
                moreBtn.textContent = `Show all (${displayCommits.length})`;
            } else {
                moreBtn.style.display = 'none';
            }
        };

        renderList();

        moreBtn.onclick = () => {
            renderList(displayCommits.length);
            moreBtn.style.display = 'none';
        };

        formatSelect?.addEventListener('change', () => {
            setChangelogFormat(formatSelect.value);
            renderList();
        });

        if (insertBtn) {
            insertBtn.onclick = () => {
                const format = formatSelect?.value || getChangelogFormat();
                const markdown = buildChangelogMarkdown(displayCommits, format);
                insertChangelogMarkdown(devlogTextarea, markdown);
                statusEl.textContent = 'Inserted into devlog.';
                card.classList.add('is-dismissed');
                setTimeout(() => card.remove(), 260);
            };
        }
    }

    await loadChangelog();
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

        const projectionStats = getShopGoalProjectionStats(currentCookies);
        const hasAverageProjection = !!projectionStats.hasAverageProjection;
        const hasProjectProjection = !!projectionStats.hasProjectProjection;
        const hasAnyProjection = hasAverageProjection || hasProjectProjection;

        let stackMode = localStorage.getItem('flavortown_progress_mode') || 'individual';
        let projectionMode = localStorage.getItem('flavortown_projection_mode') || 'actual';
        let projectionSource = localStorage.getItem('flavortown_projection_source') || 'average';

        if (projectionSource !== 'average' && projectionSource !== 'project') {
            projectionSource = 'average';
            localStorage.setItem('flavortown_projection_source', projectionSource);
        }

        if (stackMode === 'projected') {
            stackMode = 'individual';
            projectionMode = 'projected';
            localStorage.setItem('flavortown_progress_mode', stackMode);
            localStorage.setItem('flavortown_projection_mode', projectionMode);
        }

        if (projectionMode === 'projected' && !hasAnyProjection) {
            projectionMode = 'actual';
            localStorage.setItem('flavortown_projection_mode', projectionMode);
        }

        if (projectionMode === 'projected') {
            if (projectionSource === 'project' && !hasProjectProjection && hasAverageProjection) {
                projectionSource = 'average';
                localStorage.setItem('flavortown_projection_source', projectionSource);
            } else if (projectionSource === 'average' && !hasAverageProjection && hasProjectProjection) {
                projectionSource = 'project';
                localStorage.setItem('flavortown_projection_source', projectionSource);
            }
        }

        const selectedProjectedCookies = projectionSource === 'project'
            ? projectionStats.projectProjectedCookies
            : projectionStats.averageProjectedCookies;
        const selectedProjectionRate = projectionSource === 'project'
            ? projectionStats.projectRate
            : projectionStats.averageRate;

        const hasProjectedData = projectionMode === 'projected'
            && selectedProjectedCookies !== null
            && isFinite(selectedProjectedCookies);

        const effectiveCookies = projectionMode === 'projected' && hasProjectedData
            ? selectedProjectedCookies
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

        const fallbackRate = projectionStats.averageRate && projectionStats.averageRate > 0
            ? projectionStats.averageRate
            : (applySidebarVoteVerdictToRate(10) || 10);
        const effectiveRate = projectionMode === 'projected' && hasProjectedData && selectedProjectionRate && selectedProjectionRate > 0
            ? selectedProjectionRate
            : fallbackRate;

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

        const progressLabel = projectionMode === 'projected' && hasProjectedData
            ? (projectionSource === 'project' ? 'Projected (per project)' : 'Projected (avg)')
            : 'Progress';
        const progressValue = projectionMode === 'projected' && hasProjectedData
            ? `🍪 ${effectiveCookies.toLocaleString()}/${totalCookiesNeeded.toLocaleString()}`
            : `🍪 ${currentCookies.toLocaleString()}/${totalCookiesNeeded.toLocaleString()}`;
        const projectedToggleDisabled = hasAnyProjection ? '' : 'disabled';
        const projectionHintText = projectionSource === 'project'
            ? (projectionStats.projectFallbackMinutes > 0
                ? `Project-aware estimate. Avg fallback used for ${formatMinutesCompact(projectionStats.projectFallbackMinutes)}.`
                : 'Project-aware estimate using per-project rates.')
            : 'Single average rate across projects.';
        const projectionHintTitle = projectionSource === 'project' && projectionStats.projectFallbackMinutes > 0
            ? 'Some projects do not have enough paid-ship history yet, so their unpaid time uses your overall average rate.'
            : '';

        const projectionSourceToggleHtml = projectionMode === 'projected' ? `
            <div class="flavortown-progress-toggle-wrapper flavortown-progress-toggle-wrapper--source">
                <div class="flavortown-progress-toggle flavortown-progress-toggle--source">
                    <button class="flavortown-progress-toggle__btn ${projectionSource === 'average' ? 'active' : ''}" data-kind="projection-source" data-mode="average" ${hasAverageProjection ? '' : 'disabled'}>
                        Avg rate
                    </button>
                    <button class="flavortown-progress-toggle__btn ${projectionSource === 'project' ? 'active' : ''}" data-kind="projection-source" data-mode="project" ${hasProjectProjection ? '' : 'disabled'}>
                        Per project
                    </button>
                </div>
                <span class="flavortown-progress-toggle__hint" title="${projectionHintTitle}">
                    ${projectionHintText}
                </span>
            </div>
        ` : '';

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
                ${projectionSourceToggleHtml}
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
            } else if (kind === 'projection-source') {
                localStorage.setItem('flavortown_projection_source', newMode === 'project' ? 'project' : 'average');
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

function isLotteryItemName(name) {
    const normalized = normalizeShopItemName(name);
    return normalized.includes('lottery ticket');
}

function fetchGamblorpheusLotteriesViaBackground() {
    return new Promise((resolve, reject) => {
        const payload = {
            type: 'FETCH_GAMBLORPHEUS_LOTTERIES',
            url: GAMBLORPHEUS_LOTTERIES_ENDPOINT
        };

        let settled = false;
        const finalizeResolve = (value) => {
            if (settled) return;
            settled = true;
            resolve(value);
        };
        const finalizeReject = (error) => {
            if (settled) return;
            settled = true;
            reject(error);
        };

        const callback = (response) => {
            const lastError = browserAPI.runtime && browserAPI.runtime.lastError;
            if (lastError) {
                finalizeReject(new Error(lastError.message || 'Background request failed'));
                return;
            }

            if (!response) {
                finalizeReject(new Error('No response from lottery background fetch'));
                return;
            }

            finalizeResolve(response);
        };

        try {
            const maybePromise = browserAPI.runtime.sendMessage(payload, callback);
            if (maybePromise && typeof maybePromise.then === 'function') {
                maybePromise.then(finalizeResolve).catch(finalizeReject);
            }
        } catch (error) {
            finalizeReject(error);
        }
    });
}

function parseLotteryOrderIdsFromTickets(ticketsField) {
    const orderIds = [];
    const pushId = (value) => {
        const id = parseInt(String(value || '').replace(/[^0-9]/g, ''), 10);
        if (Number.isFinite(id) && id > 0) {
            orderIds.push(id);
        }
    };

    if (Array.isArray(ticketsField)) {
        ticketsField.forEach((ticket) => pushId(ticket?.order_id));
        return orderIds;
    }

    if (typeof ticketsField !== 'string' || !ticketsField.trim()) {
        return orderIds;
    }

    let match;
    const regex = /['"]order_id['"]\s*:\s*(\d+)/g;
    while ((match = regex.exec(ticketsField)) !== null) {
        pushId(match[1]);
    }

    if (!orderIds.length) {
        const fallbackRegex = /order_id\s*[:=]\s*(\d+)/g;
        while ((match = fallbackRegex.exec(ticketsField)) !== null) {
            pushId(match[1]);
        }
    }

    return orderIds;
}

function indexLotteryTicketsByOrder(orderIds) {
    const byOrder = {};
    orderIds.forEach((orderId) => {
        const key = String(orderId);
        byOrder[key] = (byOrder[key] || 0) + 1;
    });
    return byOrder;
}

function getLatestLotteryEntry(entries) {
    if (!Array.isArray(entries) || !entries.length) return null;
    return [...entries].sort((a, b) => (Number(b?.id) || 0) - (Number(a?.id) || 0))[0] || null;
}

function readLotteryOddsCache() {
    try {
        const raw = localStorage.getItem(GAMBLORPHEUS_LOTTERY_CACHE_KEY);
        if (!raw) return null;
        const parsed = JSON.parse(raw);
        if (!parsed || typeof parsed !== 'object') return null;
        const updatedAt = Number(parsed.updatedAt) || 0;
        if (!updatedAt || Date.now() - updatedAt > GAMBLORPHEUS_LOTTERY_CACHE_TTL) return null;
        return parsed;
    } catch (e) {
        return null;
    }
}

function writeLotteryOddsCache(data) {
    if (!data || typeof data !== 'object') return;
    try {
        localStorage.setItem(GAMBLORPHEUS_LOTTERY_CACHE_KEY, JSON.stringify({
            ...data,
            updatedAt: Date.now()
        }));
    } catch (e) {
    }
}

async function fetchLotteryOddsData() {
    const cached = readLotteryOddsCache();
    if (cached?.totalTickets) {
        return cached;
    }

    const response = await fetchGamblorpheusLotteriesViaBackground();
    if (!response?.ok || !Array.isArray(response?.data)) return null;

    const latestLottery = getLatestLotteryEntry(response.data);
    if (!latestLottery) return null;

    const orderIds = parseLotteryOrderIdsFromTickets(latestLottery.tickets);
    const totalTickets = orderIds.length;
    if (!totalTickets) return null;

    const data = {
        lotteryId: Number(latestLottery.id) || null,
        totalTickets,
        ticketsByOrder: indexLotteryTicketsByOrder(orderIds)
    };
    writeLotteryOddsCache(data);
    return data;
}

async function fetchMyOrdersDocument() {
    try {
        const response = await fetch('/shop/my_orders', {
            credentials: 'same-origin',
            headers: { 'X-Flavortown-Ext-135': 'true' }
        });
        if (!response.ok) return null;
        const html = await response.text();
        return new DOMParser().parseFromString(html, 'text/html');
    } catch (e) {
        return null;
    }
}

function getLotteryOrdersFromDoc(doc) {
    const orderIds = new Set();
    let orderedTickets = 0;

    if (!doc) {
        return { orderIds, orderedTickets };
    }

    doc.querySelectorAll('.my-orders__item').forEach((orderItem) => {
        const name = getOrderItemName(orderItem);
        if (!isLotteryItemName(name)) return;

        const orderId = getOrderNumberFromItem(orderItem);
        if (orderId) orderIds.add(String(orderId));

        orderedTickets += getOrderQuantityFromItem(orderItem);
    });

    return { orderIds, orderedTickets };
}

function formatLotteryPercent(value) {
    if (!Number.isFinite(value) || value <= 0) return '0%';
    if (value >= 10) return `${value.toFixed(1)}%`;
    if (value >= 1) return `${value.toFixed(2)}%`;
    if (value >= 0.1) return `${value.toFixed(3)}%`;
    return `${value.toFixed(4)}%`;
}

function findLotteryCard() {
    const directMatches = Array.from(document.querySelectorAll(`.shop-item-card[data-shop-id="${LOTTERY_SHOP_ITEM_ID}"]`));

    const fallbackMatches = Array.from(document.querySelectorAll('.shop-item-card[data-shop-id], .shop-item-card')).filter((card) => {
        const nameSources = [
            card.dataset.shopWishlistItemNameValue,
            card.dataset.shopItemName,
            card.dataset.itemName,
            card.querySelector('.shop-item-card__title')?.textContent,
            card.querySelector('.shop-item-card__name')?.textContent,
            card.querySelector('[data-shop-item-name]')?.textContent
        ].filter(Boolean);

        const joinedName = nameSources.join(' ').trim();
        if (joinedName && isLotteryItemName(joinedName)) return true;

        const cardText = normalizeShopItemName(card.textContent || '');
        return cardText.includes('lottery') && cardText.includes('ticket');
    });

    const candidates = directMatches.length ? directMatches : fallbackMatches;
    if (!candidates.length) return null;

    const scoreCard = (card) => {
        let score = 0;
        if (card.querySelector('.shop-item-card__content')) score += 3;
        if (card.querySelector('.shop-item-card__order-button')) score += 2;
        if (card.closest('.shop__items, .shop__grid, main')) score += 2;
        const style = window.getComputedStyle(card);
        if (style.display !== 'none' && style.visibility !== 'hidden' && style.opacity !== '0') score += 2;
        if (card.offsetParent) score += 2;
        return score;
    };

    return [...candidates].sort((a, b) => scoreCard(b) - scoreCard(a))[0] || null;
}

function upsertLotteryCardOdds(oneTicketChance, totalTickets) {
    const lotteryCard = findLotteryCard();
    if (!lotteryCard) return;

    const cardContent = lotteryCard.querySelector('.shop-item-card__content') || lotteryCard;
    const detailsRow = cardContent.querySelector('.shop-item-card__details') || lotteryCard.querySelector('.shop-item-card__details');
    const efficiencyBlock = cardContent.querySelector('.flavortown-efficiency');

    let oddsEl = lotteryCard.querySelector('.flavortown-lottery-card-odds');
    if (!oddsEl) {
        oddsEl = document.createElement('section');
        oddsEl.className = 'flavortown-lottery-card-odds';
    }

    if (efficiencyBlock) {
        efficiencyBlock.insertAdjacentElement('beforebegin', oddsEl);
    } else if (detailsRow) {
        if (oddsEl !== detailsRow.nextElementSibling) {
            detailsRow.insertAdjacentElement('afterend', oddsEl);
        }
    } else if (oddsEl.parentElement !== cardContent) {
        cardContent.appendChild(oddsEl);
    }

    oddsEl.innerHTML = `
        <div class="flavortown-lottery-card-odds__left">
            <span class="flavortown-lottery-card-odds__label">1 ticket chance</span>
            <strong class="flavortown-lottery-card-odds__value">${formatLotteryPercent(oneTicketChance)}</strong>
        </div>
    `;
}

function upsertLotterySummaryPanel(summary) {
    const recentlyAdded = document.querySelector('.shop__recently-added');
    if (!recentlyAdded) return;

    let panel = document.querySelector('.flavortown-lottery-summary');
    if (!panel) {
        panel = document.createElement('section');
        panel.className = 'flavortown-lottery-summary';
        recentlyAdded.insertAdjacentElement('afterend', panel);
    }

    const ticketsLabel = summary.userTickets === 1 ? 'ticket' : 'tickets';
    const pendingNote = summary.orderedTickets > summary.matchedTickets
        ? '<div class="flavortown-lottery-summary__note">Some recent ticket purchases may still be syncing into the lottery pool.</div>'
        : '';

    panel.innerHTML = `
        <div class="flavortown-lottery-summary__title">Lottery Odds</div>
        <div class="flavortown-lottery-summary__stats">
            <div class="flavortown-lottery-summary__stat">
                <span class="label">Tickets bought</span>
                <strong>${summary.userTickets}</strong>
                <span class="flavortown-lottery-summary__meta">${ticketsLabel}</span>
            </div>
            <div class="flavortown-lottery-summary__stat flavortown-lottery-summary__stat--accent">
                <span class="label">Your chance</span>
                <strong>${formatLotteryPercent(summary.userChance)}</strong>
                <span class="flavortown-lottery-summary__meta">based on matched orders</span>
            </div>
            <div class="flavortown-lottery-summary__stat flavortown-lottery-summary__stat--wide">
                <span class="label">Current pool size</span>
                <strong>${summary.totalTickets.toLocaleString()}</strong>
                <span class="flavortown-lottery-summary__meta">active tickets in drawing</span>
            </div>
        </div>
        ${pendingNote}
    `;
}

function removeLotterySummaryPanel() {
    const panel = document.querySelector('.flavortown-lottery-summary');
    if (panel) panel.remove();
}

async function addLotteryOddsInsights() {
    if (window.location.pathname !== '/shop') return;
    if (window.__flavortownLotteryOddsLoading) return;
    window.__flavortownLotteryOddsLoading = true;

    try {
        const lotteryData = await fetchLotteryOddsData();
        if (!lotteryData?.totalTickets) {
            removeLotterySummaryPanel();
            return;
        }

        const oneTicketChance = 100 / lotteryData.totalTickets;
        upsertLotteryCardOdds(oneTicketChance, lotteryData.totalTickets);

        const ordersDoc = await fetchMyOrdersDocument();
        const lotteryOrders = getLotteryOrdersFromDoc(ordersDoc);

        let matchedTickets = 0;
        lotteryOrders.orderIds.forEach((orderId) => {
            matchedTickets += lotteryData.ticketsByOrder[String(orderId)] || 0;
        });

        const userTickets = matchedTickets > 0 ? matchedTickets : lotteryOrders.orderedTickets;
        const userChance = userTickets > 0 ? (userTickets / lotteryData.totalTickets) * 100 : 0;

        if (userTickets <= 1) {
            removeLotterySummaryPanel();
            return;
        }

        upsertLotterySummaryPanel({
            totalTickets: lotteryData.totalTickets,
            oneTicketChance,
            userTickets,
            userChance,
            orderedTickets: lotteryOrders.orderedTickets,
            matchedTickets
        });
    } catch (e) {
    } finally {
        window.__flavortownLotteryOddsLoading = false;
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
    const baseEfficiency = totalPaidMinutes > 0 ? totalPaidCookies / (totalPaidMinutes / 60) : null;
    const efficiency = applySidebarVoteVerdictToRate(baseEfficiency);
    const fallbackEfficiency = applySidebarVoteVerdictToRate(10) || 10;
    const defaultRate = Math.min(30, Math.max(1, Math.round(efficiency || fallbackEfficiency)));
    const rates = [defaultRate, 20, 25].filter((rate, idx, arr) => arr.indexOf(rate) === idx);

    document.querySelectorAll('.shop-item-card[data-shop-id]').forEach(card => {
        if (card.querySelector('.flavortown-efficiency')) return;

        const price = Math.ceil(parseFloat(card.dataset.shopWishlistItemPriceValue) || 0);
        if (price === 0) return;

        const remaining = Math.max(0, price - currentCookies);
        const progress = price > 0 ? Math.min(100, (currentCookies / price) * 100) : 0;
        const canAfford = currentCookies >= price;
        const effectiveRate = efficiency && efficiency > 0 ? efficiency : fallbackEfficiency;
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
                </div>
            `;
        } else {
            efficiencyDiv.innerHTML = `
                <div class="flavortown-efficiency__progress-bar">
                    <div class="flavortown-efficiency__progress-fill" style="width: ${progress}%; background: ${progressColor}"></div>
                </div>
                <div class="flavortown-efficiency__row">
                    <span class="flavortown-efficiency__cookies">🍪 ${currentCookies}/${price}</span>
                    <span class="flavortown-efficiency__need">Need <strong>${remaining}</strong> more (${moreHours.toFixed(1)}h)</span>
                </div>
            `;
        }

        const cardContent = card.querySelector('.shop-item-card__content') || card;
        cardContent.appendChild(efficiencyDiv);

        const originalHours = card.querySelector('.shop-item-card__hours');
        if (originalHours) {
            originalHours.innerHTML = `〉 ${totalHours.toFixed(1)}h`;
            originalHours.style.color = canAfford ? '#48bb78' : '#ed8936';
        }

    });
}

function cleanupRecentlyAddedCarousel() {
    const state = window.__flavortownRecentlyAddedCarousel;
    if (!state) return;

    if (state.intervalId) {
        clearInterval(state.intervalId);
    }

    if (state.track && state.handlers) {
        state.track.removeEventListener('mouseenter', state.handlers.onMouseEnter);
        state.track.removeEventListener('mouseleave', state.handlers.onMouseLeave);
        state.track.removeEventListener('pointerdown', state.handlers.onUserInteract);
        state.track.removeEventListener('touchstart', state.handlers.onUserInteract);
        state.track.removeEventListener('wheel', state.handlers.onUserInteract);
    }

    window.__flavortownRecentlyAddedCarousel = null;
}

function ensureRecentlyAddedAccordion(section) {
    const inner = section.querySelector('.shop__recently-added-inner');
    if (!inner) return { inner: null, details: null, items: null };

    let details = inner.querySelector('.flavortown-recently-added-accordion');
    if (!details) {
        const header = inner.querySelector('.shop__recently-added-header');
        const items = inner.querySelector('.shop__recently-added-items');
        if (!items) return { inner, details: null, items: null };

        details = document.createElement('details');
        details.className = 'flavortown-recently-added-accordion';

        const summary = document.createElement('summary');
        summary.className = 'flavortown-recently-added-accordion__summary shop__recently-added-header';

        const titleWrap = document.createElement('div');
        titleWrap.className = 'flavortown-recently-added-accordion__summary-text';

        const title = document.createElement('h2');
        title.className = 'shop__recently-added-title';
        title.textContent = header?.querySelector('.shop__recently-added-title')?.textContent?.trim() || 'Recently Added';

        const subtitle = document.createElement('p');
        subtitle.className = 'shop__recently-added-subtitle';
        subtitle.textContent = header?.querySelector('.shop__recently-added-subtitle')?.textContent?.trim() || '';

        const icon = document.createElement('span');
        icon.className = 'flavortown-recently-added-accordion__icon';
        icon.textContent = 'x';

        titleWrap.appendChild(title);
        if (subtitle.textContent) titleWrap.appendChild(subtitle);
        summary.appendChild(titleWrap);
        summary.appendChild(icon);

        const content = document.createElement('div');
        content.className = 'flavortown-recently-added-accordion__content';
        content.appendChild(items);

        details.appendChild(summary);
        details.appendChild(content);

        const collapsedPref = localStorage.getItem(SHOP_RECENTLY_ADDED_COLLAPSED_KEY);
        const isCollapsed = collapsedPref === null ? true : collapsedPref === 'true';
        details.open = !isCollapsed;

        const syncIcon = () => {
            icon.textContent = details.open ? 'x' : '+';
        };
        syncIcon();

        details.addEventListener('toggle', () => {
            localStorage.setItem(SHOP_RECENTLY_ADDED_COLLAPSED_KEY, details.open ? 'false' : 'true');
            syncIcon();
            section.classList.toggle('flavortown-recently-added-collapsed', !details.open);
        });

        inner.insertBefore(details, inner.firstChild);
        if (header) header.remove();
    }

    section.classList.toggle('flavortown-recently-added-collapsed', !details.open);

    const items = details.querySelector('.shop__recently-added-items');
    return { inner, details, items };
}

function setupRecentlyAddedCarousel(items, details) {
    cleanupRecentlyAddedCarousel();

    if (!items) return;
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    items.classList.add('flavortown-recently-added-carousel');

    const state = {
        track: items,
        details,
        paused: false,
        userPausedUntil: 0,
        intervalId: null,
        handlers: {}
    };

    state.handlers.onMouseEnter = () => {
        state.paused = true;
    };

    state.handlers.onMouseLeave = () => {
        state.paused = false;
    };

    state.handlers.onUserInteract = () => {
        state.userPausedUntil = Date.now() + 4500;
    };

    items.addEventListener('mouseenter', state.handlers.onMouseEnter);
    items.addEventListener('mouseleave', state.handlers.onMouseLeave);
    items.addEventListener('pointerdown', state.handlers.onUserInteract, { passive: true });
    items.addEventListener('touchstart', state.handlers.onUserInteract, { passive: true });
    items.addEventListener('wheel', state.handlers.onUserInteract, { passive: true });

    state.intervalId = window.setInterval(() => {
        if (!document.body.contains(items)) {
            cleanupRecentlyAddedCarousel();
            return;
        }

        if (state.paused) return;
        if (Date.now() < state.userPausedUntil) return;
        if (state.details && !state.details.open) return;

        const maxScrollLeft = items.scrollWidth - items.clientWidth;
        if (maxScrollLeft <= 0) return;

        const next = items.scrollLeft + 1;
        items.scrollLeft = next >= maxScrollLeft - 1 ? 0 : next;
    }, 24);

    window.__flavortownRecentlyAddedCarousel = state;
}

function enhanceRecentlyAddedSection() {
    if (window.location.pathname !== '/shop') {
        cleanupRecentlyAddedCarousel();
        return;
    }

    const section = document.querySelector('.shop__recently-added');
    if (!section) {
        cleanupRecentlyAddedCarousel();
        return;
    }

    const { details, items } = ensureRecentlyAddedAccordion(section);

    const buttons = document.querySelector('.shop__buttons');
    if (buttons) {
        buttons.classList.add('flavortown-shop-buttons-under-recently-added');
        if (buttons.previousElementSibling !== section) {
            section.insertAdjacentElement('afterend', buttons);
        }
    }

    setupRecentlyAddedCarousel(items, details);
}

function addOutOfStockToggle() {
    if (window.location.pathname !== '/shop') return;
    if (document.querySelector('.flavortown-oos-toggle')) return;

    const container = document.querySelector('.shop__buttons');
    if (!container) return;

    const toggle = document.createElement('label');
    toggle.className = 'flavortown-oos-toggle';
    toggle.innerHTML = `
        <input type="checkbox" class="flavortown-oos-checkbox">
        <span class="flavortown-oos-switch"></span>
        <span class="flavortown-oos-label">Don't display out of stock items.</span>
    `;

    const checkbox = toggle.querySelector('input');
    checkbox.addEventListener('change', () => {
        const hideOOS = checkbox.checked;
        document.querySelectorAll('.shop-item-card--out-of-stock').forEach(card => {
            card.style.display = hideOOS ? 'none' : 'flex';
        });
        localStorage.setItem('flavortown-hide-oos', hideOOS);
    });

    const saved = localStorage.getItem('flavortown-hide-oos') === 'true';
    if (saved) {
        checkbox.checked = true;
        document.querySelectorAll('.shop-item-card--out-of-stock').forEach(card => {
            card.style.display = 'none';
        });
    }

    container.insertBefore(toggle, container.firstChild);
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
        try {
            browserAPI.storage.sync.set({ flavortown_api_key: keyText });
        } catch (e) {
        }
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

function addExploreUsersPage() {
    if (!window.location.pathname.startsWith('/explore')) return;
    if (document.querySelector('.flavortown-users-nav')) return;

    captureApiKey();

    const exploreRoot = document.querySelector('.explore');
    const exploreNav = document.querySelector('.explore__nav');
    if (!exploreRoot || !exploreNav) return;

    const desktopNav = exploreNav.querySelector('.explore__nav--type.explore__nav--desktop');
    if (!desktopNav) return;

    const usersNavItem = document.createElement('a');
    usersNavItem.href = '#';
    usersNavItem.className = 'explore__nav-component flavortown-users-nav';
    usersNavItem.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="27" height="27" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
        Users
    `;
    desktopNav.appendChild(usersNavItem);

    const usersPage = document.createElement('section');
    usersPage.className = 'flavortown-users-page';
    usersPage.style.display = 'none';
    usersPage.innerHTML = `
        <form class="flavortown-users-search-form" autocomplete="off">
            <div class="flavortown-search-input-wrapper flavortown-users-search-input-wrapper">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="flavortown-search-icon"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                <input type="text" class="flavortown-search-input flavortown-users-search-input" placeholder="Search users by display name or Slack ID" />
            </div>
            <div class="flavortown-users-search-actions">
                <button type="submit" class="btn btn--brown flavortown-users-search-btn">Search</button>
                <button type="button" class="btn flavortown-users-clear-btn">Clear</button>
            </div>
        </form>
        <p class="flavortown-users-status" data-state="info">Search users to get started.</p>
        <div class="flavortown-users-grid"></div>
        <div class="flavortown-users-pagination">
            <button type="button" class="btn btn--brown flavortown-users-load-more" style="display: none;">Load More Users</button>
        </div>
    `;
    exploreRoot.appendChild(usersPage);

    const searchForm = usersPage.querySelector('.flavortown-users-search-form');
    const searchInput = usersPage.querySelector('.flavortown-users-search-input');
    const searchBtn = usersPage.querySelector('.flavortown-users-search-btn');
    const clearBtn = usersPage.querySelector('.flavortown-users-clear-btn');
    const statusEl = usersPage.querySelector('.flavortown-users-status');
    const usersGrid = usersPage.querySelector('.flavortown-users-grid');
    const loadMoreBtn = usersPage.querySelector('.flavortown-users-load-more');

    const hideSelectors = [
        '.explore__header',
        '.project-list__search-container',
        '#project-list',
        '.explore__pagination',
        '.explore__list',
        '.explore__nav--sort',
        '.flavortown-explore-search'
    ];

    const runProjectStatsTask = createAsyncLimiter(USERS_PROJECT_STATS_CONCURRENCY);
    let usersRequestTimestamps = [];
    let currentQuery = '';
    let currentPage = 1;
    let nextPage = null;
    let isLoading = false;
    let hasLoadedInitial = false;
    let usersModeActive = false;
    let previousSelectedNav = null;
    let knownTotalPages = (() => {
        try {
            const raw = localStorage.getItem(USERS_TOTAL_PAGES_CACHE_KEY);
            const parsed = raw ? parseInt(raw, 10) : 1;
            return Number.isFinite(parsed) && parsed > 0 ? parsed : 1;
        } catch (e) {
            return 1;
        }
    })();

    const setStatus = (message, state = 'info') => {
        statusEl.textContent = message;
        statusEl.dataset.state = state;
    };

    const setKnownTotalPages = (value) => {
        const parsed = parseInt(value, 10);
        if (!Number.isFinite(parsed) || parsed <= 0) return;
        knownTotalPages = parsed;
        try {
            localStorage.setItem(USERS_TOTAL_PAGES_CACHE_KEY, String(parsed));
        } catch (e) {
        }
    };

    const getRandomUsersPage = () => {
        const maxPage = Math.max(1, knownTotalPages || 1);
        return Math.floor(Math.random() * maxPage) + 1;
    };

    const getRateLimitWaitSeconds = () => {
        const now = Date.now();
        usersRequestTimestamps = usersRequestTimestamps.filter(ts => now - ts < USERS_API_RATE_WINDOW_MS);
        if (usersRequestTimestamps.length < USERS_API_RATE_LIMIT) return 0;
        const oldest = usersRequestTimestamps[0];
        const waitMs = USERS_API_RATE_WINDOW_MS - (now - oldest);
        return Math.max(1, Math.ceil(waitMs / 1000));
    };

    const normalizeCookies = (value) => {
        if (typeof value === 'number' && isFinite(value)) return Math.max(0, Math.round(value));
        if (typeof value === 'string') {
            const parsed = parseNumberFromText(value);
            if (parsed && isFinite(parsed)) return Math.max(0, Math.round(parsed));
        }
        return 0;
    };

    const normalizeProjectIds = (projectIds) => {
        if (!Array.isArray(projectIds)) return [];
        const unique = new Set();
        projectIds.forEach(projectId => {
            if (projectId === null || projectId === undefined) return;
            const normalized = String(projectId).trim();
            if (!normalized) return;
            unique.add(normalized);
        });
        return Array.from(unique);
    };

    const fetchProjectMinutesForUsers = async (projectId) => {
        const cacheKey = String(projectId);
        if (usersProjectMinutesCache.has(cacheKey)) {
            return usersProjectMinutesCache.get(cacheKey);
        }

        const statsPromise = runProjectStatsTask(async () => {
            const stats = await fetchProjectUnshippedStats(cacheKey);
            if (!stats || !isFinite(stats.totalMinutes)) return null;
            return Math.max(0, Math.round(stats.totalMinutes));
        });

        usersProjectMinutesCache.set(cacheKey, statsPromise);
        return statsPromise;
    };

    const fetchUserAggregateMinutes = async (user) => {
        const projectIds = normalizeProjectIds(user.project_ids);
        const aggregateKey = `${user.id}:${projectIds.join(',')}`;
        if (usersAggregateCache.has(aggregateKey)) {
            return usersAggregateCache.get(aggregateKey);
        }

        const aggregatePromise = (async () => {
            if (!projectIds.length) {
                return { totalMinutes: 0, failedProjects: 0, projectCount: 0 };
            }

            const minutesList = await Promise.all(projectIds.map(async (projectId) => {
                try {
                    return await fetchProjectMinutesForUsers(projectId);
                } catch (e) {
                    return null;
                }
            }));

            let totalMinutes = 0;
            let failedProjects = 0;

            minutesList.forEach(minutes => {
                if (typeof minutes === 'number' && isFinite(minutes)) {
                    totalMinutes += Math.max(0, minutes);
                } else {
                    failedProjects += 1;
                }
            });

            return {
                totalMinutes: Math.max(0, Math.round(totalMinutes)),
                failedProjects,
                projectCount: projectIds.length
            };
        })();

        usersAggregateCache.set(aggregateKey, aggregatePromise);
        return aggregatePromise;
    };

    const setExploreSectionVisibility = (hidden) => {
        hideSelectors.forEach(selector => {
            document.querySelectorAll(selector).forEach(el => {
                if (usersPage.contains(el)) return;
                el.classList.toggle('flavortown-users-hidden', hidden);
            });
        });
    };

    const createStatBlock = (label, value, statKey = null) => {
        const stat = document.createElement('div');
        stat.className = 'flavortown-user-card__stat';

        const valueEl = document.createElement('strong');
        valueEl.className = 'flavortown-user-card__stat-value';
        valueEl.textContent = value;
        if (statKey) {
            valueEl.dataset.stat = statKey;
        }

        const labelEl = document.createElement('span');
        labelEl.className = 'flavortown-user-card__stat-label';
        labelEl.textContent = label;

        stat.appendChild(valueEl);
        stat.appendChild(labelEl);
        return stat;
    };

    const hydrateUserCard = async (user, card) => {
        const hoursEl = card.querySelector('[data-stat="hours"]');
        if (!hoursEl) return;

        const projectIds = normalizeProjectIds(user.project_ids);
        if (!projectIds.length) {
            hoursEl.textContent = '0m';
            return;
        }

        const aggregate = await fetchUserAggregateMinutes(user);
        if (!document.body.contains(card)) return;

        const totalMinutes = aggregate.totalMinutes || 0;
        hoursEl.textContent = formatMinutesCompact(totalMinutes);
    };

    const createUserCard = (user) => {
        const card = document.createElement('article');
        card.className = 'flavortown-user-card';

        const content = document.createElement('div');
        content.className = 'flavortown-user-card__content';

        const nameLink = document.createElement('a');
        nameLink.className = 'flavortown-user-card__name';
        nameLink.href = `/users/${user.id}`;
        nameLink.target = '_blank';
        nameLink.rel = 'noopener noreferrer';
        nameLink.textContent = user.display_name || `User #${user.id}`;

        const profileLink = document.createElement('a');
        profileLink.className = 'flavortown-user-card__profile-link';
        profileLink.href = `/users/${user.id}`;
        profileLink.target = '_blank';
        profileLink.rel = 'noopener noreferrer';
        profileLink.textContent = 'Open profile';

        const stats = document.createElement('div');
        stats.className = 'flavortown-user-card__stats';
        stats.appendChild(createStatBlock('Cookies', normalizeCookies(user.cookies).toLocaleString()));
        stats.appendChild(createStatBlock('Projects', String(normalizeProjectIds(user.project_ids).length)));
        stats.appendChild(createStatBlock('Hours', '...', 'hours'));

        const mediaLink = document.createElement('a');
        mediaLink.className = 'flavortown-user-card__media';
        mediaLink.href = `/users/${user.id}`;
        mediaLink.target = '_blank';
        mediaLink.rel = 'noopener noreferrer';

        if (user.avatar) {
            const avatar = document.createElement('img');
            avatar.className = 'flavortown-user-card__avatar';
            avatar.alt = user.display_name ? `${user.display_name} avatar` : `User #${user.id} avatar`;
            avatar.loading = 'lazy';
            avatar.src = user.avatar;
            avatar.referrerPolicy = 'no-referrer';
            mediaLink.appendChild(avatar);
        } else {
            const fallback = document.createElement('div');
            fallback.className = 'flavortown-user-card__avatar-fallback';
            fallback.textContent = (user.display_name || 'U').trim().charAt(0).toUpperCase() || 'U';
            mediaLink.appendChild(fallback);
        }

        content.appendChild(nameLink);
        content.appendChild(profileLink);
        content.appendChild(stats);

        card.appendChild(mediaLink);
        card.appendChild(content);

        hydrateUserCard(user, card).catch(() => {
            if (!document.body.contains(card)) return;
            const hoursEl = card.querySelector('[data-stat="hours"]');
            if (hoursEl) hoursEl.textContent = '--';
        });

        return card;
    };

    const fetchUsersPage = async (page, query) => {
        const waitSeconds = getRateLimitWaitSeconds();
        if (waitSeconds > 0) {
            throw new Error(`Rate limited locally. Try again in ${waitSeconds}s.`);
        }

        usersRequestTimestamps.push(Date.now());

        const params = [`page=${page}`];
        if (query) params.push(`query=${encodeURIComponent(query)}`);
        return apiFetch(`/users?${params.join('&')}`);
    };

    const setButtonsLoadingState = (loading) => {
        searchBtn.disabled = loading;
        clearBtn.disabled = loading;
        loadMoreBtn.disabled = loading;
        searchBtn.textContent = loading ? 'Loading...' : 'Search';
    };

    const runUsersSearch = async ({ append = false } = {}) => {
        if (isLoading) return;

        const nextQuery = searchInput.value.trim();
        if (!append) {
            currentQuery = nextQuery;
            currentPage = 1;
            nextPage = null;
            usersGrid.innerHTML = '';
        }

        let requestPage = append ? nextPage : 1;
        if (!append && !currentQuery) {
            requestPage = getRandomUsersPage();
        }
        if (append && !requestPage) return;

        isLoading = true;
        setButtonsLoadingState(true);
        setStatus(append ? 'Loading more users...' : 'Loading users...', 'loading');

        try {
            const data = await fetchUsersPage(requestPage, currentQuery);
            const users = Array.isArray(data?.users) ? data.users : [];

            if (!append) {
                usersGrid.innerHTML = '';
            }

            if (!users.length && !append) {
                const message = currentQuery
                    ? `No users found for "${currentQuery}".`
                    : 'No users found.';
                setStatus(message, 'info');
                loadMoreBtn.style.display = 'none';
                return;
            }

            const fragment = document.createDocumentFragment();
            users.forEach(user => {
                fragment.appendChild(createUserCard(user));
            });
            usersGrid.appendChild(fragment);

            const pagination = data?.pagination || {};
            currentPage = pagination.current_page || requestPage;
            nextPage = pagination.next_page || null;
            if (!currentQuery) {
                setKnownTotalPages(pagination.total_pages || knownTotalPages);
            }

            const shownCount = usersGrid.children.length;
            const totalCount = typeof pagination.total_count === 'number' ? pagination.total_count : shownCount;
            const suffix = currentQuery ? ` for "${currentQuery}"` : '';
            setStatus(`Page ${currentPage} - Showing ${shownCount} of ${totalCount} users${suffix}.`, 'ok');
            loadMoreBtn.style.display = nextPage ? 'inline-flex' : 'none';
        } catch (err) {
            const message = err?.message || 'Failed to fetch users.';
            if (message.includes('No API key')) {
                setStatus('No API key found. Generate one from settings.', 'error');
            } else if (message.includes('Invalid API key') || message.includes('401')) {
                setStatus('API key is invalid. Regenerate your key in settings.', 'error');
            } else if (message.toLowerCase().includes('rate') || message.includes('429')) {
                setStatus(message.includes('Try again in') ? message : 'Rate limited. Try again in about a minute.', 'warn');
            } else {
                setStatus(`Failed to fetch users: ${message}`, 'error');
            }
            loadMoreBtn.style.display = 'none';
            if (!append) {
                usersGrid.innerHTML = '';
            }
        } finally {
            isLoading = false;
            setButtonsLoadingState(false);
        }
    };

    const activateUsersMode = () => {
        if (usersModeActive) return;
        usersModeActive = true;
        previousSelectedNav = document.querySelector('.explore__nav-component.selected:not(.flavortown-users-nav)');

        document.querySelectorAll('.explore__nav-component.selected').forEach(el => {
            if (el !== usersNavItem) el.classList.remove('selected');
        });

        usersNavItem.classList.add('selected');
        usersPage.style.display = 'block';
        setExploreSectionVisibility(true);

        if (!hasLoadedInitial) {
            hasLoadedInitial = true;
            runUsersSearch({ append: false });
        } else {
            if (!searchInput.value.trim()) {
                runUsersSearch({ append: false });
            }
            searchInput.focus();
        }
    };

    const deactivateUsersMode = () => {
        if (!usersModeActive) return;
        usersModeActive = false;

        usersNavItem.classList.remove('selected');
        usersPage.style.display = 'none';
        setExploreSectionVisibility(false);

        if (previousSelectedNav && document.body.contains(previousSelectedNav)) {
            previousSelectedNav.classList.add('selected');
        }
    };

    usersNavItem.addEventListener('click', (e) => {
        e.preventDefault();
        if (usersModeActive) {
            deactivateUsersMode();
        } else {
            activateUsersMode();
        }
    });

    desktopNav.addEventListener('click', (e) => {
        const target = e.target.closest('.explore__nav-component');
        if (!target || target === usersNavItem) return;
        deactivateUsersMode();
    });

    searchForm.addEventListener('submit', (e) => {
        e.preventDefault();
        runUsersSearch({ append: false });
    });

    clearBtn.addEventListener('click', () => {
        searchInput.value = '';
        runUsersSearch({ append: false });
    });

    loadMoreBtn.addEventListener('click', () => {
        runUsersSearch({ append: true });
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

    let totalUnshippedMinutes = 0;
    let totalUndevloggedMinutes = 0;
    let totalProjectedCookies = 0;
    let totalPaidMinutes = 0;
    let totalPaidCookies = 0;
    Object.keys(stats).forEach(projectId => {
        const cached = getCachedProjectUnshipped(projectId);
        if (!cached) return;
        if (typeof cached.unshippedMinutes === 'number') {
            totalUnshippedMinutes += cached.unshippedMinutes;
        }
        if (typeof cached.undevloggedMinutes === 'number') {
            totalUndevloggedMinutes += cached.undevloggedMinutes;
        }
        if (typeof cached.paidShipMinutes === 'number') {
            totalPaidMinutes += cached.paidShipMinutes;
        }
        if (typeof cached.paidCookies === 'number') {
            totalPaidCookies += cached.paidCookies;
        }
    });
    const totalProjectedMinutes = totalUnshippedMinutes + totalUndevloggedMinutes;
    if (totalPaidMinutes > 0 && totalProjectedMinutes > 0) {
        const baseEfficiency = totalPaidCookies / (totalPaidMinutes / 60);
        const projectedEfficiency = applySidebarVoteVerdictToRate(baseEfficiency);
        if (isFinite(projectedEfficiency) && projectedEfficiency > 0) {
            totalProjectedCookies = Math.round(projectedEfficiency * (totalProjectedMinutes / 60));
        }
    }
    const totalUnshippedHours = Math.floor(totalUnshippedMinutes / 60);
    const totalUnshippedMins = totalUnshippedMinutes % 60;
    const totalUndevloggedHours = Math.floor(totalUndevloggedMinutes / 60);
    const totalUndevloggedMins = totalUndevloggedMinutes % 60;

    let freqText = '';
    if (totalDevlogs > 0) {
        const avgMinsPerLog = Math.round(totalMinutes / totalDevlogs);
        const freqHrs = Math.floor(avgMinsPerLog / 60);
        const freqMins = avgMinsPerLog % 60;
        freqText = `${freqHrs}hr ${freqMins}min`;
    }

    const heading = document.querySelector('.projects-board__heading');
    if (heading) {
        const statsMarkup = `
            <div class="flavortown-stat-pill" title="Total Projects">
                📦 <span class="flavortown-stat-value">${totalProjects}</span> Projects
            </div>
            <div class="flavortown-stat-pill" title="Total Devlogs">
                📝 <span class="flavortown-stat-value">${totalDevlogs}</span> Devlogs
            </div>
            <div class="flavortown-stat-pill" title="Total Time Spent">
                ⏱ <span class="flavortown-stat-value">${totalHours}h ${totalMinutes % 60}m</span>
            </div>
            ${totalUnshippedMinutes > 0 ? `
            <div class="flavortown-stat-pill flavortown-unpaid-pill" title="Total Unshipped Hours">
                💰 <span class="flavortown-stat-value">${totalUnshippedHours}h ${totalUnshippedMins}m</span> unshipped
            </div>
            ` : ''}
            ${totalUndevloggedMinutes > 0 ? `
            <div class="flavortown-stat-pill flavortown-undevlogged-pill" title="Total Undevlogged Hours">
                🕒 <span class="flavortown-stat-value">${totalUndevloggedHours}h ${totalUndevloggedMins}m</span> undevlogged
            </div>
            ` : ''}
            ${totalProjectedCookies > 0 ? `
            <div class="flavortown-stat-pill flavortown-projected-pill" title="Projected Cookies from Unpaid Hours">
                🍪 <span class="flavortown-stat-value">${totalProjectedCookies.toLocaleString()}</span> projected
            </div>` : ''}
            ${freqText ? `
            <div class="flavortown-stat-pill" title="Average time per devlog">
                1 📝 per <span class="flavortown-stat-value">${freqText}</span>
            </div>` : ''}
        `;
        const existingStats = document.querySelector('.flavortown-project-stats');
        if (existingStats) {
            existingStats.innerHTML = statsMarkup;
        } else {
            const statsEl = document.createElement('div');
            statsEl.className = 'flavortown-project-stats';
            statsEl.innerHTML = statsMarkup;
            heading.appendChild(statsEl);
        }
    }

    ensureProjectBoardSortControls();
    addProjectPinsFeature();
}

const PINNED_PROJECTS_KEY = 'flavortown_pinned_projects';
const PROJECT_SORT_KEY = 'flavortown_projects_sort';
const PROJECT_SORT_OPTIONS = [
    { value: 'default', label: 'Default' },
    { value: 'time_desc', label: 'Most Time Spent' },
    { value: 'devlogs_desc', label: 'Most Devlogs' },
    { value: 'time_asc', label: 'Least Time Spent' },
    { value: 'devlogs_asc', label: 'Least Devlogs' },
    { value: 'cookies_desc', label: 'Most Cookies' },
    { value: 'cookies_asc', label: 'Least Cookies' },
    { value: 'cookies_per_hour_desc', label: 'Highest Cookies/h' },
    { value: 'cookies_per_hour_asc', label: 'Lowest Cookies/h' }
];
let projectBoardReorderScheduled = false;

function scheduleProjectBoardReorder() {
    if (!window.location.pathname.endsWith('/projects')) return;
    if (projectBoardReorderScheduled) return;

    projectBoardReorderScheduled = true;
    requestAnimationFrame(() => {
        projectBoardReorderScheduled = false;
        addProjectPinsFeature();
    });
}

function getProjectSortPreference() {
    try {
        const value = (localStorage.getItem(PROJECT_SORT_KEY) || 'default').trim();
        return PROJECT_SORT_OPTIONS.some(option => option.value === value) ? value : 'default';
    } catch (e) {
        return 'default';
    }
}

function setProjectSortPreference(value) {
    const normalized = PROJECT_SORT_OPTIONS.some(option => option.value === value)
        ? value
        : 'default';
    try {
        localStorage.setItem(PROJECT_SORT_KEY, normalized);
    } catch (e) {
    }
}

function parseProjectMinutesFromCard(card) {
    const statLines = card.querySelectorAll('.project-card__stats h5');
    const timeText = statLines[1]?.textContent?.trim() || '';
    const hoursMatch = timeText.match(/(\d+)h/);
    const minsMatch = timeText.match(/(\d+)m/);

    let minutes = 0;
    if (hoursMatch) minutes += parseInt(hoursMatch[1], 10) * 60;
    if (minsMatch) minutes += parseInt(minsMatch[1], 10);
    return minutes;
}

function parseProjectDevlogsFromCard(card) {
    const statLines = card.querySelectorAll('.project-card__stats h5');
    const devlogText = statLines[0]?.textContent?.trim() || '';
    const match = devlogText.match(/([\d,]+)/);
    if (!match?.[1]) return 0;
    const parsed = parseInt(match[1].replace(/,/g, ''), 10);
    return Number.isFinite(parsed) ? parsed : 0;
}

function parseProjectCookiesFromCard(card) {
    const cookieValueEl = card.querySelector('.flavortown-project-cookies span:last-child');
    if (cookieValueEl) {
        const parsed = parseInt((cookieValueEl.textContent || '').replace(/,/g, ''), 10);
        if (Number.isFinite(parsed)) return parsed;
    }

    const cookieLine = Array.from(card.querySelectorAll('.project-card__stats h5'))
        .find(el => (el.textContent || '').includes('🍪'));
    if (!cookieLine) return 0;

    const parsed = parseInt((cookieLine.textContent || '').replace(/,/g, ''), 10);
    return Number.isFinite(parsed) ? parsed : 0;
}

function parseProjectCookiesPerHourFromCard(card) {
    const details = Array.from(card.querySelectorAll('.flavortown-project-cookies-details h5'));
    const rateLine = details.find(el => /cookies\s*\/\s*h/i.test(el.textContent || ''));
    if (!rateLine) return 0;

    const match = (rateLine.textContent || '').match(/([\d,.]+)\s*cookies\s*\/\s*h/i);
    if (!match?.[1]) return 0;
    const parsed = parseFloat(match[1].replace(/,/g, ''));
    return Number.isFinite(parsed) ? parsed : 0;
}

function getProjectSortMetrics(item) {
    const card = item.querySelector('.project-card');
    if (!card) {
        return { devlogs: 0, minutes: 0, cookies: 0, cookiesPerHour: 0 };
    }

    return {
        devlogs: parseProjectDevlogsFromCard(card),
        minutes: parseProjectMinutesFromCard(card),
        cookies: parseProjectCookiesFromCard(card),
        cookiesPerHour: parseProjectCookiesPerHourFromCard(card)
    };
}

function compareProjectItemsBySort(a, b, sortPreference) {
    if (sortPreference === 'default') {
        const aBase = parseInt(a.dataset.flavortownBaseOrder || '0', 10) || 0;
        const bBase = parseInt(b.dataset.flavortownBaseOrder || '0', 10) || 0;
        return aBase - bBase;
    }

    const aMetrics = getProjectSortMetrics(a);
    const bMetrics = getProjectSortMetrics(b);

    const compareDesc = (left, right) => right - left;
    const compareAsc = (left, right) => left - right;

    let comparison = 0;
    switch (sortPreference) {
    case 'time_desc':
        comparison = compareDesc(aMetrics.minutes, bMetrics.minutes);
        break;
    case 'time_asc':
        comparison = compareAsc(aMetrics.minutes, bMetrics.minutes);
        break;
    case 'devlogs_desc':
        comparison = compareDesc(aMetrics.devlogs, bMetrics.devlogs);
        break;
    case 'devlogs_asc':
        comparison = compareAsc(aMetrics.devlogs, bMetrics.devlogs);
        break;
    case 'cookies_desc':
        comparison = compareDesc(aMetrics.cookies, bMetrics.cookies);
        break;
    case 'cookies_asc':
        comparison = compareAsc(aMetrics.cookies, bMetrics.cookies);
        break;
    case 'cookies_per_hour_desc':
        comparison = compareDesc(aMetrics.cookiesPerHour, bMetrics.cookiesPerHour);
        break;
    case 'cookies_per_hour_asc':
        comparison = compareAsc(aMetrics.cookiesPerHour, bMetrics.cookiesPerHour);
        break;
    default:
        comparison = 0;
        break;
    }

    if (comparison !== 0) return comparison;

    const aBase = parseInt(a.dataset.flavortownBaseOrder || '0', 10) || 0;
    const bBase = parseInt(b.dataset.flavortownBaseOrder || '0', 10) || 0;
    return aBase - bBase;
}

function ensureProjectBoardSortControls() {
    if (!window.location.pathname.endsWith('/projects')) return;

    const header = document.querySelector('.projects-board__header');
    if (!header) return;

    const ideaButton = header.querySelector('.btn[data-action*="project-ideas#toggle"], .btn.btn--red[data-controller="project-ideas"]');
    let actionsWrap = header.querySelector('.flavortown-project-header-actions');
    if (!actionsWrap) {
        actionsWrap = document.createElement('div');
        actionsWrap.className = 'flavortown-project-header-actions';
        if (ideaButton && ideaButton.parentElement === header) {
            header.insertBefore(actionsWrap, ideaButton);
            actionsWrap.appendChild(ideaButton);
        } else {
            header.appendChild(actionsWrap);
        }
    } else if (ideaButton && ideaButton.parentElement !== actionsWrap) {
        actionsWrap.appendChild(ideaButton);
    }

    const existing = header.querySelector('.flavortown-project-sort-controls');
    const currentPreference = getProjectSortPreference();
    if (existing) {
        if (existing.parentElement !== actionsWrap) {
            actionsWrap.prepend(existing);
        }
        const select = existing.querySelector('.flavortown-project-sort-select');
        if (select) select.value = currentPreference;
        return;
    }

    const controls = document.createElement('div');
    controls.className = 'flavortown-project-sort-controls';
    controls.innerHTML = `
        <label class="flavortown-project-sort-label" for="flavortownProjectSortSelect">Sort:</label>
        <div class="flavortown-project-sort-select-wrap">
            <span class="flavortown-project-sort-icon" aria-hidden="true">↕</span>
            <select id="flavortownProjectSortSelect" class="flavortown-project-sort-select" aria-label="Sort projects">
                ${PROJECT_SORT_OPTIONS.map(option => `<option value="${option.value}">${option.label}</option>`).join('')}
            </select>
        </div>
    `;

    const select = controls.querySelector('.flavortown-project-sort-select');
    if (select) {
        select.value = currentPreference;
        select.addEventListener('change', () => {
            setProjectSortPreference(select.value);
            addProjectPinsFeature();
        });
    }

    actionsWrap.prepend(controls);
}

function getPinnedProjectIds() {
    try {
        const raw = localStorage.getItem(PINNED_PROJECTS_KEY);
        if (!raw) return [];
        const parsed = JSON.parse(raw);
        if (!Array.isArray(parsed)) return [];
        return parsed
            .map(id => String(id || '').trim())
            .filter(Boolean);
    } catch (e) {
        return [];
    }
}

function setPinnedProjectIds(ids) {
    try {
        const uniqueIds = [];
        const seen = new Set();
        (ids || []).forEach(id => {
            const normalized = String(id || '').trim();
            if (!normalized || seen.has(normalized)) return;
            seen.add(normalized);
            uniqueIds.push(normalized);
        });
        localStorage.setItem(PINNED_PROJECTS_KEY, JSON.stringify(uniqueIds));
    } catch (e) {
    }
}

function addProjectPinsFeature() {
    if (!window.location.pathname.endsWith('/projects')) return;

    const grid = document.querySelector('.projects-board__grid');
    if (!grid) return;

    const allItems = Array.from(grid.querySelectorAll(':scope > .projects-board__grid-item'));
    const createItem = allItems.find(item => item.classList.contains('projects-board__grid-item--create')) || null;
    const projectItems = allItems.filter(item => item.querySelector('.project-card'));
    if (!projectItems.length) return;

    const pinnedIds = getPinnedProjectIds();
    const pinnedSet = new Set(pinnedIds);

    const itemByProjectId = new Map();
    projectItems.forEach((item, index) => {
        if (!item.dataset.flavortownBaseOrder) {
            item.dataset.flavortownBaseOrder = String(index);
        }

        const card = item.querySelector('.project-card');
        const projectId = card?.id?.replace('project_', '') || '';
        if (!projectId) return;

        itemByProjectId.set(projectId, item);
        item.dataset.flavortownProjectId = projectId;

        card.classList.add('flavortown-project-pin-enabled');

        let pinBtn = card.querySelector('.flavortown-project-pin-btn');
        if (!pinBtn) {
            pinBtn = document.createElement('button');
            pinBtn.type = 'button';
            pinBtn.className = 'flavortown-project-pin-btn';
            pinBtn.innerHTML = `
                <svg class="flavortown-project-pin-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                    <path fill="currentColor" d="M16 12V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v8l-2 2v2h5v6h2v-6h5v-2z"/>
                </svg>
            `;
            pinBtn.addEventListener('click', (event) => {
                event.preventDefault();
                event.stopPropagation();

                const currentId = card.id?.replace('project_', '') || '';
                if (!currentId) return;

                const currentPinned = getPinnedProjectIds();
                const alreadyPinned = currentPinned.includes(currentId);
                const nextPinned = alreadyPinned
                    ? currentPinned.filter(id => id !== currentId)
                    : [currentId, ...currentPinned.filter(id => id !== currentId)];
                setPinnedProjectIds(nextPinned);
                addProjectPinsFeature();
            });
            card.appendChild(pinBtn);
        }

        const isPinned = pinnedSet.has(projectId);
        card.classList.toggle('flavortown-project-pinned', isPinned);
        pinBtn.classList.toggle('is-pinned', isPinned);
        pinBtn.setAttribute('aria-pressed', isPinned ? 'true' : 'false');
        const label = isPinned ? 'Unpin project' : 'Pin project';
        pinBtn.setAttribute('title', label);
        pinBtn.setAttribute('aria-label', label);
    });

    const orderedPinnedItems = pinnedIds
        .map(id => itemByProjectId.get(id))
        .filter(Boolean);
    const sortPreference = getProjectSortPreference();
    const unpinnedItems = projectItems
        .filter(item => !pinnedSet.has(item.dataset.flavortownProjectId || ''))
        .sort((a, b) => compareProjectItemsBySort(a, b, sortPreference));

    const orderedItems = [...orderedPinnedItems, ...unpinnedItems];
    orderedItems.forEach(item => {
        grid.insertBefore(item, createItem && createItem.parentElement === grid ? createItem : null);
    });

    if (createItem && createItem.parentElement === grid) {
        grid.appendChild(createItem);
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

function restructurePayoutVotesText() {
    const elements = document.querySelectorAll('.projects-show__payout-votes-text');
    elements.forEach(el => {
        if (el.dataset.flavortownRestructured) return;
        const strong = el.querySelector('strong');
        if (!strong) return;
        const textContent = el.textContent.trim();
        strong.textContent = textContent;
        el.innerHTML = '';
        el.appendChild(strong);
        el.dataset.flavortownRestructured = 'true';
    });
}

function initPayoutVotesTextRestructure() {
    restructurePayoutVotesText();
    const observer = new MutationObserver(() => {
        restructurePayoutVotesText();
    });
    observer.observe(document.body, { childList: true, subtree: true });
}

function syncDocsCodeThemeClass() {
    if (!document.body) return;
    document.body.classList.toggle('flavortown-docs-no-code-theme', window.location.pathname === '/api/v1/docs');
}

function init() {
    syncDocsCodeThemeClass();
    initLocalStorageSync();
    initLogpheusGoalsSync();
    loadTheme();
    loadGithubApiKey();
    initCommandPaletteShortcut();
    checkForUpdates();
    addDevlogFrequencyStat();
    addVotesDevlogFrequencyStat();
    mergeVoteBreakdownMetaIntoScores();
    ensureShipStatsReady();
    addShipStats();
    addUnshippedCookieEstimate();
    addProjectShowCookieStat();
    addMultiShipEfficiencyGraph();
    inlineDevlogForm();
    setupInlineDevlogEditing();
    enhanceCommentEmojiInputs();
    watchCommentEmojiInputs();
    enhanceShipEmojiInput();
    watchShipEmojiInput();
    cleanupUnownedUnshippedCache();
    enhanceShopGoals();
    runShopOrdersSync();
    initShopAccessories();
    addShopCardEfficiency();
    addOutOfStockToggle();
    addLotteryOddsInsights();
    enhanceRecentlyAddedSection();
    addExploreSearch();
    addExploreUsersPage();
    captureApiKey();
    initProjectBoardStats();
    addProjectCardCookieStats();
    addSkipButton();
    enhanceKitchenDashboard();
    setTimeout(enhanceLeaderboardPage, 0);
    enhanceAdminPage();
    initProjectRepoSuggestions();
    initProjectTodos();
    initShipFastFlow();
    initPayoutVotesTextRestructure();

    setTimeout(checkAchievements, 2000);
    setTimeout(initVotesFeature, 1000);
}

const VOTES_LAST_PROJECT_KEY = 'flavortown-votes-last-project';
const VOTES_REFRESH_ATTEMPTS_KEY = 'flavortown-votes-refresh-attempts';
const VOTES_SKIP_TRIGGER_KEY = 'flavortown-votes-skip-trigger';
const MAX_VOTES_REFRESH_ATTEMPTS = 2;
let skipButtonObserver;
let votesRotationChecked = false;
let shipGraphObserver = null;

function ensureVotesActionsStyles() {
    if (document.getElementById('flavortown-votes-actions-style')) return;
    const style = document.createElement('style');
    style.id = 'flavortown-votes-actions-style';
    style.textContent = `
        .flavortown-votes-actions {
            display: flex;
            justify-content: center;
            align-items: stretch;
gap: 4px;
            padding: 6px 0 24px;
            margin-top: 6px;
        }
        .flavortown-votes-actions .btn {
            margin: 0 !important;
            display: flex;
            align-items: center;
        }
        .flavortown-votes-actions .votes-new__prev-btn {
            margin-right: 4px !important;
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
const SPEED_READER_DEFAULT_WPM = 330;
const SPEED_READER_MIN_WPM = 150;
const SPEED_READER_MAX_WPM = 850;
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
        maxWpm: Math.floor(780 + Math.random() * 71),
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
            skipBtn.className = 'btn btn--brown btn--borderless flavortown-skip-btn';
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

let kitchenHeatmapRefreshPromise = null;

function ensureKitchenDashboardStyles() {
    if (document.getElementById('flavortown-kitchen-dashboard-style')) return;
    const style = document.createElement('style');
    style.id = 'flavortown-kitchen-dashboard-style';
    style.textContent = `
        @keyframes flavortown-kitchen-shimmer {
            0% { background-position: 200% 0; }
            100% { background-position: -200% 0; }
        }
        .flavortown-kitchen-skeleton {
            background: linear-gradient(90deg, rgba(255,255,255,0.2) 25%, rgba(255,255,255,0.48) 50%, rgba(255,255,255,0.2) 75%);
            background-size: 200% 100%;
            animation: flavortown-kitchen-shimmer 1.2s ease-in-out infinite;
            border-radius: 10px;
        }
        .flavortown-kitchen-skeleton-card {
            height: 88px;
            border: 1px solid var(--color-border, #d9cab4);
            background-color: color-mix(in oklab, var(--color-surface, #fff) 72%, var(--color-cream, #fff6ea) 28%);
            border-radius: 12px;
            padding: 14px;
        }
        .flavortown-kitchen-skeleton-graph {
            height: 300px;
            border: 1px solid var(--color-border, #d9cab4);
            border-radius: 14px;
            background-color: color-mix(in oklab, var(--color-surface, #fff) 78%, var(--color-cream, #fff6ea) 22%);
            position: relative;
            overflow: hidden;
        }
        .flavortown-kitchen-skeleton-graph::after {
            content: '';
            position: absolute;
            left: 20px;
            right: 20px;
            bottom: 20px;
            height: 2px;
            border-radius: 999px;
            background: color-mix(in oklab, var(--color-border, #d9cab4) 70%, transparent 30%);
        }
    `;
    document.head.appendChild(style);
}

function kitchenFetchWithTimeout(url, options = {}, timeoutMs = 6000) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    return fetch(url, { ...options, signal: controller.signal })
        .finally(() => clearTimeout(timer));
}

function startKitchenHeatmapRefresh(onProgress) {
    if (!kitchenHeatmapRefreshPromise) {
        kitchenHeatmapRefreshPromise = fetchAndUpdateHeatmapDataViaAPI(onProgress)
            .finally(() => {
                kitchenHeatmapRefreshPromise = null;
            });
        return kitchenHeatmapRefreshPromise;
    }

    if (typeof onProgress === 'function') {
        kitchenHeatmapRefreshPromise
            .then(() => onProgress({ type: 'complete' }))
            .catch((e) => onProgress({ type: 'error', error: e?.message || 'unknown error' }));
    }
    return kitchenHeatmapRefreshPromise;
}

async function enhanceKitchenDashboard() {
    if (window.location.pathname !== '/kitchen') return;
    if (document.querySelector('.flavortown-kitchen-dashboard')) return;

    const kitchenSetup = document.querySelector('.kitchen-setup');
    if (!kitchenSetup) return;

    ensureKitchenDashboardStyles();

    const t0 = performance.now();
    const nativeKitchenStats = document.querySelector('.kitchen-stats');
    let achievementCount = '';
    let achievementTotal = '';
    let achievementPercent = '';
    let leaderboardRank = '';
    let leaderboardCookies = '';
    if (nativeKitchenStats) {
        const countEl = nativeKitchenStats.querySelector('.kitchen-stats-card__count');
        const totalEl = nativeKitchenStats.querySelector('.kitchen-stats-card__total');
        const percentEl = nativeKitchenStats.querySelector('.state-card__description');
        const rankEl = nativeKitchenStats.querySelector('.kitchen-stats-card__rank');
        const cookiesEl = nativeKitchenStats.querySelectorAll('.state-card__description')[1];
        if (countEl) achievementCount = countEl.textContent.trim();
        if (totalEl) achievementTotal = totalEl.textContent.trim().replace('/', '').trim();
        if (percentEl) achievementPercent = percentEl.textContent.trim();
        if (rankEl) leaderboardRank = rankEl.textContent.trim();
        if (cookiesEl) leaderboardCookies = cookiesEl.textContent.trim();
        nativeKitchenStats.style.display = 'none';
    }

    const helpSection = document.querySelector('.kitchen-help');
    if (helpSection) helpSection.remove();
    const kitchenComic = document.querySelector('.kitchen-comic');
    if (kitchenComic) kitchenComic.remove();
    document.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach(heading => {
        if (heading.textContent.includes('Activity Heatmap') && !heading.closest('.flavortown-heatmap-card')) {
            heading.remove();
        }
    });

    const dashboard = document.createElement('div');
    dashboard.className = 'flavortown-kitchen-dashboard';
    dashboard.innerHTML = `
        <div class="flavortown-dashboard-header">
            <h2>🍪 Your Cookie Stats</h2>
        </div>
        <div class="flavortown-graph-container">
            <h3>Cookies Over Time</h3>
            <div class="flavortown-kitchen-skeleton-graph flavortown-kitchen-skeleton"></div>
        </div>
        <div class="flavortown-dashboard-header" style="margin-top: 24px;">
            <h2>📊 Your Progress</h2>
        </div>
        <div class="flavortown-stat-cards" id="flavortownKitchenStatCards">
            <div class="flavortown-kitchen-skeleton-card"><div class="flavortown-kitchen-skeleton" style="height:14px;width:45%;margin-bottom:14px;"></div><div class="flavortown-kitchen-skeleton" style="height:26px;width:60%;"></div></div>
            <div class="flavortown-kitchen-skeleton-card"><div class="flavortown-kitchen-skeleton" style="height:14px;width:45%;margin-bottom:14px;"></div><div class="flavortown-kitchen-skeleton" style="height:26px;width:60%;"></div></div>
            <div class="flavortown-kitchen-skeleton-card"><div class="flavortown-kitchen-skeleton" style="height:14px;width:45%;margin-bottom:14px;"></div><div class="flavortown-kitchen-skeleton" style="height:26px;width:60%;"></div></div>
            <div class="flavortown-kitchen-skeleton-card"><div class="flavortown-kitchen-skeleton" style="height:14px;width:45%;margin-bottom:14px;"></div><div class="flavortown-kitchen-skeleton" style="height:26px;width:60%;"></div></div>
        </div>
        <div class="flavortown-heatmap-section">
            <div class="flavortown-heatmap-loading" style="padding: 24px; text-align: center; color: var(--color-text-secondary, #6b5c4a);">
                <div style="font-size: 1.2em; margin-bottom: 8px;">⏳</div>
                <div>Loading activity data...</div>
                <div class="flavortown-heatmap-loading-progress" style="font-size: 0.85em; margin-top: 8px; opacity: 0.7;"></div>
            </div>
        </div>
    `;

    const parentContainer = kitchenSetup.parentNode;
    kitchenSetup.replaceWith(dashboard);
    const kitchenAnnouncement = document.querySelector('.kitchen-announcement');
    if (kitchenAnnouncement && parentContainer) {
        parentContainer.insertBefore(kitchenAnnouncement, dashboard);
    }

    const heatmapSection = dashboard.querySelector('.flavortown-heatmap-section');
    const cachedHeatmapData = getHeatmapData();
    const hasCachedData = cachedHeatmapData && Object.keys(cachedHeatmapData.dailyAggregates || {}).length > 0;
    if (hasCachedData) {
        heatmapSection.innerHTML = '';
        heatmapSection.appendChild(createHeatmapComponent(cachedHeatmapData));
        const loadingIndicator = document.createElement('div');
        loadingIndicator.className = 'flavortown-heatmap-loading-indicator';
        loadingIndicator.innerHTML = '<span class="flavortown-heatmap-loading-spinner"></span><span class="flavortown-heatmap-loading-text">Updating...</span>';
        heatmapSection.appendChild(loadingIndicator);
        startKitchenHeatmapRefresh((progress) => {
            if (progress.type === 'complete') {
                loadingIndicator.remove();
                const fresh = getHeatmapData();
                heatmapSection.innerHTML = '';
                heatmapSection.appendChild(createHeatmapComponent(fresh));
            } else if (progress.type === 'error') {
                loadingIndicator.innerHTML = '<span class="flavortown-heatmap-loading-text">Update failed</span>';
                setTimeout(() => loadingIndicator.remove(), 2500);
            }
        });
    } else {
        startKitchenHeatmapRefresh((progress) => {
            const progressEl = heatmapSection.querySelector('.flavortown-heatmap-loading-progress');
            if (progress.type === 'project' && progressEl) {
                progressEl.textContent = `Fetching ${progress.current}/${progress.total}: ${progress.name}`;
            } else if (progress.type === 'complete') {
                heatmapSection.innerHTML = '';
                heatmapSection.appendChild(createHeatmapComponent(getHeatmapData()));
            } else if (progress.type === 'error') {
                heatmapSection.innerHTML = '<div class="flavortown-heatmap-loading" style="padding:24px;text-align:center;color:#e53e3e;">Failed to load activity data</div>';
            }
        });
    }

    try {
        const balanceUrl = new URL('/my/balance', window.location.origin).toString();
        const parser = new DOMParser();
        const extractBalanceRows = (sourceDoc) => {
            let rows = sourceDoc.querySelectorAll('.balance-history__table tbody tr');
            if (rows.length === 0) rows = sourceDoc.querySelectorAll('table tbody tr');
            if (rows.length === 0) {
                const streamTemplates = sourceDoc.querySelectorAll('turbo-stream template');
                if (streamTemplates.length) {
                    const parsedRows = [];
                    streamTemplates.forEach(template => {
                        const fragmentDoc = parser.parseFromString(template.innerHTML, 'text/html');
                        const templateRows = fragmentDoc.querySelectorAll('.balance-history__table tbody tr, table tbody tr');
                        parsedRows.push(...Array.from(templateRows));
                    });
                    rows = parsedRows;
                }
            }
            return rows;
        };

        const response = await kitchenFetchWithTimeout(balanceUrl, {
            credentials: 'include',
            headers: {
                'Accept': 'text/html, application/xhtml+xml',
                'Turbo-Frame': 'balance_history',
                'X-Flavortown-Ext-135': 'true'
            }
        }, 7000);
        const html = await response.text();
        let doc = parser.parseFromString(html, 'text/html');
        let rows = extractBalanceRows(doc);
        if (rows.length === 0) {
            const fallbackResponse = await kitchenFetchWithTimeout(balanceUrl, {
                credentials: 'include',
                headers: {
                    'Accept': 'text/html, application/xhtml+xml',
                    'X-Flavortown-Ext-135': 'true'
                }
            }, 7000);
            if (fallbackResponse.ok) {
                doc = parser.parseFromString(await fallbackResponse.text(), 'text/html');
                rows = extractBalanceRows(doc);
            }
        }

        const transactions = [];
        let currentBalance = 0;
        const balanceHeader = doc.querySelector('.balance-history__header h1') || doc.querySelector('h1');
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
            const isNegative = amountText.includes('-');
            const numMatch = amountText.match(/(\d+)/);
            let amount = numMatch ? parseInt(numMatch[1], 10) : 0;
            if (isNegative) amount = -amount;
            const date = new Date(dateText);
            if (!isNaN(date.getTime())) transactions.push({ reason, amount, date });
        });

        let totalMinutes = 0;
        let totalDevlogs = 0;
        let devlogFrequency = '';
        try {
            const cachedStats = localStorage.getItem('flavortown_project_stats');
            if (cachedStats) {
                const stats = JSON.parse(cachedStats);
                Object.values(stats).forEach(project => {
                    totalMinutes += project.minutes || 0;
                    totalDevlogs += project.devlogs || 0;
                });
                if (totalDevlogs > 0 && totalMinutes > 0) {
                    const avgMinutesPerDevlog = Math.max(1, Math.round(totalMinutes / totalDevlogs));
                    const hours = Math.floor(avgMinutesPerDevlog / 60);
                    const mins = avgMinutesPerDevlog % 60;
                    devlogFrequency = hours > 0 ? `${hours}h ${mins}m/devlog` : `${mins}m/devlog`;
                }
            }
        } catch (e) {
            console.log('Could not read project stats:', e);
        }

        transactions.reverse();
        let runningTotal = currentBalance;
        for (let i = transactions.length - 1; i >= 0; i--) runningTotal -= transactions[i].amount;
        const dataPoints = [];
        let balance = runningTotal;
        transactions.forEach(t => {
            balance += t.amount;
            dataPoints.push({ date: t.date, balance, reason: t.reason, amount: t.amount });
        });

        const { totalEarned, totalSpent } = calculateSpendAndEarnTotals(transactions, 'amount');

        const statCards = dashboard.querySelector('#flavortownKitchenStatCards');
        if (statCards) {
            statCards.innerHTML = `
                <div class="flavortown-stat-card flavortown-stat-card--earned"><span class="flavortown-stat-card__label">Total Earned</span><span class="flavortown-stat-card__value">+${totalEarned}</span></div>
                <div class="flavortown-stat-card flavortown-stat-card--spent"><span class="flavortown-stat-card__label">Total Spent</span><span class="flavortown-stat-card__value">-${totalSpent}</span></div>
                <div class="flavortown-stat-card"><span class="flavortown-stat-card__label">Total Time</span><span class="flavortown-stat-card__value">⏱ ${Math.floor(totalMinutes / 60)}h ${totalMinutes % 60}m</span></div>
                ${devlogFrequency ? `<div class="flavortown-stat-card"><span class="flavortown-stat-card__label">Avg per Devlog</span><span class="flavortown-stat-card__value">⚡ ${devlogFrequency}</span></div>` : ''}
                ${achievementCount ? `<div class="flavortown-stat-card"><span class="flavortown-stat-card__label">Achievements</span><span class="flavortown-stat-card__value">🏆 ${achievementCount}/${achievementTotal}</span><span class="flavortown-stat-card__sublabel" style="font-size: 0.8em; opacity: 0.7;">${achievementPercent}</span></div>` : ''}
                ${leaderboardRank ? `<div class="flavortown-stat-card" id="flavortownKitchenLeaderboard"><span class="flavortown-stat-card__label">Leaderboard</span><span class="flavortown-stat-card__value">🏅 ${leaderboardRank}</span><span class="flavortown-stat-card__sublabel" style="font-size: 0.8em; opacity: 0.7;">${leaderboardCookies}</span></div>` : ''}
            `;
        }

        const graphContainer = dashboard.querySelector('.flavortown-graph-container');
        if (graphContainer) {
            graphContainer.innerHTML = '<h3>Cookies Over Time</h3><canvas id="flavortown-cookies-graph" width="800" height="300"></canvas>';
        }

        const canvas = dashboard.querySelector('#flavortown-cookies-graph');
        if (canvas && dataPoints.length > 1) {
            let revealProgress = 1;
            let rafId = null;

            const drawGraph = (lineReveal = 1, animationState = null) => {
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
                const textColor = isDarkTheme ? '#cdd6f4' : (styles.getPropertyValue('--color-text-primary')?.trim() || '#333');
                const gridColor = isDarkTheme ? '#45475a' : (styles.getPropertyValue('--color-border')?.trim() || '#e2d8cc');

                const balances = dataPoints.map(d => d.balance);
                const minBalance = Math.min(0, ...balances);
                const maxBalance = Math.max(...balances);
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

                const points = dataPoints.map((point, i) => ({
                    x: padding + (width / (dataPoints.length - 1)) * i,
                    y: padding + height - ((point.balance - minBalance) / balanceRange) * height,
                    data: point
                }));

                const maxSegmentFloat = Math.max(0, Math.min(points.length - 1, lineReveal * (points.length - 1)));
                const fullSegments = Math.floor(maxSegmentFloat);
                const segmentFraction = maxSegmentFloat - fullSegments;
                const pausedPointIndex = Number.isInteger(animationState?.pausedPointIndex)
                    ? animationState.pausedPointIndex
                    : -1;
                const pauseProgress = Math.max(0, Math.min(1, animationState?.pauseProgress || 0));
                const pausePulse = Math.sin(pauseProgress * Math.PI);

                const cubicPoint = (p0, p1, p2, p3, t) => {
                    const inv = 1 - t;
                    const x =
                        inv * inv * inv * p0.x +
                        3 * inv * inv * t * p1.x +
                        3 * inv * t * t * p2.x +
                        t * t * t * p3.x;
                    const y =
                        inv * inv * inv * p0.y +
                        3 * inv * inv * t * p1.y +
                        3 * inv * t * t * p2.y +
                        t * t * t * p3.y;
                    return { x, y };
                };

                ctx.lineWidth = 3;
                ctx.lineCap = 'round';
                ctx.lineJoin = 'round';

                for (let i = 1; i <= fullSegments; i++) {
                    const prev = points[i - 1];
                    const curr = points[i];
                    ctx.beginPath();
                    ctx.moveTo(prev.x, prev.y);
                    const cpX = (prev.x + curr.x) / 2;
                    ctx.bezierCurveTo(cpX, prev.y, cpX, curr.y, curr.x, curr.y);
                    ctx.strokeStyle = curr.data.amount >= 0 ? '#38a169' : '#e53e3e';
                    ctx.stroke();
                }

                let revealHead = null;
                if (segmentFraction > 0 && fullSegments + 1 < points.length) {
                    const prev = points[fullSegments];
                    const curr = points[fullSegments + 1];
                    const cpX = (prev.x + curr.x) / 2;
                    const cp1 = { x: cpX, y: prev.y };
                    const cp2 = { x: cpX, y: curr.y };
                    const steps = Math.max(2, Math.ceil(24 * segmentFraction));

                    ctx.beginPath();
                    ctx.moveTo(prev.x, prev.y);
                    for (let s = 1; s <= steps; s++) {
                        const t = (segmentFraction * s) / steps;
                        const point = cubicPoint(prev, cp1, cp2, curr, t);
                        ctx.lineTo(point.x, point.y);
                        revealHead = point;
                    }
                    ctx.strokeStyle = curr.data.amount >= 0 ? '#38a169' : '#e53e3e';
                    ctx.stroke();
                }

                points.forEach((point, idx) => {
                    if (idx > fullSegments) return;

                    let pointRadius = 6;
                    if (idx === pausedPointIndex) {
                        pointRadius += 2.6 * pausePulse;
                    }

                    if (idx === pausedPointIndex && pausePulse > 0.02) {
                        const glowColor = point.data.amount >= 0
                            ? 'rgba(56, 161, 105, 0.45)'
                            : 'rgba(229, 62, 62, 0.45)';
                        ctx.beginPath();
                        ctx.arc(point.x, point.y, pointRadius + 3 + pausePulse * 2, 0, Math.PI * 2);
                        ctx.strokeStyle = glowColor;
                        ctx.lineWidth = 2;
                        ctx.stroke();
                    }

                    ctx.beginPath();
                    ctx.arc(point.x, point.y, pointRadius, 0, Math.PI * 2);
                    ctx.fillStyle = point.data.amount >= 0 ? '#38a169' : '#e53e3e';
                    ctx.fill();
                    ctx.strokeStyle = '#fff';
                    ctx.lineWidth = idx === pausedPointIndex ? 2.5 : 2;
                    ctx.stroke();
                });

                if (revealHead) {
                    const nextPoint = points[Math.min(points.length - 1, fullSegments + 1)];
                    const headColor = nextPoint?.data?.amount >= 0 ? '#38a169' : '#e53e3e';
                    ctx.beginPath();
                    ctx.arc(revealHead.x, revealHead.y, 5.5, 0, Math.PI * 2);
                    ctx.fillStyle = headColor;
                    ctx.fill();
                    ctx.strokeStyle = '#fff';
                    ctx.lineWidth = 2;
                    ctx.stroke();
                }

                ctx.fillStyle = textColor;
                ctx.font = '11px system-ui';
                ctx.textAlign = 'center';
                const maxLabels = Math.min(dataPoints.length, 5);
                const step = Math.max(1, Math.floor((dataPoints.length - 1) / Math.max(1, maxLabels - 1)));
                for (let i = 0; i < dataPoints.length; i += step) {
                    const x = padding + (width / (dataPoints.length - 1)) * i;
                    const dateStr = dataPoints[i].date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                    ctx.fillText(dateStr, x, rect.height - 10);
                }
                canvas._pointPositions = points;
            };

            const animateLineReveal = ({ initial = false } = {}) => {
                if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
                    revealProgress = 1;
                    drawGraph(revealProgress);
                    return;
                }
                if (rafId) cancelAnimationFrame(rafId);
                revealProgress = 0;
                const segmentCount = Math.max(1, dataPoints.length - 1);

                const absMoves = dataPoints.slice(1).map(point => Math.abs(point.amount || 0)).filter(v => v > 0);
                const sortedMoves = absMoves.slice().sort((a, b) => a - b);
                const medianMove = sortedMoves.length
                    ? sortedMoves[Math.floor(sortedMoves.length / 2)]
                    : 0;

                const speedFactor = initial ? 0.52 : 1;
                const pauseFactor = initial ? 0.35 : 1;
                const baseSegmentDuration = 90;
                const basePointPause = 14;
                const segmentDurations = [];
                const pointPauses = [];

                for (let i = 0; i < segmentCount; i++) {
                    const move = Math.abs(dataPoints[i + 1]?.amount || 0);
                    const drama = medianMove > 0 ? Math.max(0, move / medianMove - 1) : 0;
                    const dramaticBoost = Math.min(1.8, drama);
                    segmentDurations.push((baseSegmentDuration + dramaticBoost * 40) * speedFactor);
                    pointPauses.push((basePointPause + dramaticBoost * 110) * pauseFactor);
                }

                const duration = segmentDurations.reduce((sum, value) => sum + value, 0)
                    + pointPauses.slice(0, -1).reduce((sum, value) => sum + value, 0);
                const start = performance.now();
                const tick = (now) => {
                    const elapsed = Math.max(0, now - start);
                    let remaining = elapsed;
                    let segmentsDone = 0;
                    let frac = 0;
                    let pausedPointIndex = null;
                    let pauseProgress = 0;

                    for (let i = 0; i < segmentCount; i++) {
                        const segmentDuration = segmentDurations[i];
                        if (remaining >= segmentDuration) {
                            segmentsDone += 1;
                            remaining -= segmentDuration;
                            if (i < segmentCount - 1) {
                                const pointPause = pointPauses[i];
                                if (remaining >= pointPause) {
                                    remaining -= pointPause;
                                } else {
                                    frac = 0;
                                    pausedPointIndex = i + 1;
                                    pauseProgress = pointPause > 0
                                        ? Math.max(0, Math.min(1, remaining / pointPause))
                                        : 0;
                                    break;
                                }
                            }
                        } else {
                            const linear = Math.max(0, Math.min(1, remaining / segmentDuration));
                            frac = 1 - Math.pow(1 - linear, 2);
                            break;
                        }
                    }

                    if (elapsed >= duration) {
                        revealProgress = 1;
                        pausedPointIndex = null;
                    } else {
                        revealProgress = (segmentsDone + frac) / segmentCount;
                    }
                    drawGraph(revealProgress, {
                        pausedPointIndex,
                        pauseProgress,
                    });
                    if (elapsed < duration) rafId = requestAnimationFrame(tick);
                };
                rafId = requestAnimationFrame(tick);
            };

            if (!canvas._flavortownGraphTooltipAttached) {
                const tooltip = document.createElement('div');
                tooltip.className = 'flavortown-graph-tooltip';
                tooltip.style.cssText = 'position:fixed;display:none;background:var(--color-surface,#fff);border:2px solid var(--color-border,#e2d8cc);border-radius:8px;padding:10px 14px;font-size:0.9em;line-height:1.35;pointer-events:none;z-index:1000;box-shadow:0 4px 12px rgba(0,0,0,0.15);max-width:280px;white-space:normal;word-break:break-word;overflow-wrap:anywhere;';
                document.body.appendChild(tooltip);

                canvas.addEventListener('click', () => animateLineReveal());
                canvas.addEventListener('mousemove', (e) => {
                    const points = canvas._pointPositions;
                    if (!points) return;
                    const rect = canvas.getBoundingClientRect();
                    const mouseX = e.clientX - rect.left;
                    const mouseY = e.clientY - rect.top;

                    let closest = null;
                    let closestXDist = Infinity;
                    points.forEach(p => {
                        const xDist = Math.abs(p.x - mouseX);
                        if (xDist < closestXDist) {
                            closestXDist = xDist;
                            closest = p;
                        }
                    });

                    if (!closest || closestXDist > 30) {
                        tooltip.style.display = 'none';
                        return;
                    }

                    const amountStr = closest.data.amount >= 0 ? `+${closest.data.amount}` : `${closest.data.amount}`;
                    tooltip.innerHTML = `<div style="font-weight:700;margin-bottom:4px;">🍪 ${closest.data.balance}</div><div style="color:${closest.data.amount >= 0 ? '#38a169' : '#e53e3e'};font-weight:600;">${amountStr}</div><div style="font-size:0.85em;color:var(--color-text-muted,#888);margin-top:4px;">${closest.data.reason}</div>`;
                    tooltip.style.display = 'block';

                    const tooltipWidth = tooltip.offsetWidth;
                    const tooltipHeight = tooltip.offsetHeight;

                    const anchorX = rect.left + closest.x;
                    const anchorY = rect.top + closest.y;

                    let tooltipLeft = anchorX + 14;
                    if (tooltipLeft + tooltipWidth > window.innerWidth - 8) {
                        tooltipLeft = anchorX - tooltipWidth - 14;
                    }
                    tooltipLeft = Math.max(8, Math.min(window.innerWidth - tooltipWidth - 8, tooltipLeft));

                    let tooltipTop = anchorY - tooltipHeight - 12;
                    if (tooltipTop < 8) {
                        tooltipTop = anchorY + 12;
                    }
                    if (tooltipTop + tooltipHeight > window.innerHeight - 8) {
                        tooltipTop = Math.max(8, window.innerHeight - tooltipHeight - 8);
                    }

                    tooltip.style.left = `${tooltipLeft}px`;
                    tooltip.style.top = `${tooltipTop}px`;
                });
                canvas.addEventListener('mouseleave', () => {
                    tooltip.style.display = 'none';
                    if (rafId) cancelAnimationFrame(rafId);
                    drawGraph(1);
                });
                canvas._flavortownGraphTooltipAttached = true;
            }

            if (!canvas._flavortownGraphInitialAnimated) {
                canvas._flavortownGraphInitialAnimated = true;
                animateLineReveal({ initial: true });
            } else {
                drawGraph(1);
            }
            document.addEventListener('flavortown-theme-changed', () => setTimeout(() => drawGraph(1), 150));
        }

        const rankNumber = leaderboardRank ? parseInt(leaderboardRank.replace(/[^\d]/g, ''), 10) : 0;
        if (rankNumber) {
            kitchenFetchWithTimeout('https://flavortown.hackclub.com/leaderboard', {
                headers: { 'Accept': 'text/html, application/xhtml+xml', 'X-Flavortown-Ext-135': 'true' },
                credentials: 'include'
            }, 5000)
                .then(res => res.text())
                .then(leaderboardHtml => {
                    const parser = new DOMParser();
                    const leaderboardDoc = parser.parseFromString(leaderboardHtml, 'text/html');
                    const subtitle = leaderboardDoc.querySelector('.leaderboard-hero .subtitle, p.subtitle');
                    const subtitleText = subtitle ? subtitle.textContent : '';
                    const totalMatch = subtitleText.match(/(\d[\d,]*)\s+users/i) || subtitleText.match(/(\d[\d,]*)/);
                    if (!totalMatch) return;
                    const totalUsers = parseInt(totalMatch[1].replace(/,/g, ''), 10);
                    if (!totalUsers) return;
                    const percentile = Math.max(1, Math.ceil((rankNumber / totalUsers) * 100));
                    const sub = dashboard.querySelector('#flavortownKitchenLeaderboard .flavortown-stat-card__sublabel');
                    if (sub) sub.textContent = `Top ${percentile}%`;
                })
                .catch(() => {});
        }

        console.debug('Flavortown kitchen timings', {
            totalMs: Math.round(performance.now() - t0)
        });
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

    const desktopNav = nav.querySelector('.explore__nav--type.explore__nav--desktop');
    if (desktopNav) {
        desktopNav.appendChild(toggleBtn);
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
        const activeElement = document.activeElement;
        const isTyping = activeElement && (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA' || activeElement.isContentEditable);
        if (isTyping) return;
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
    syncDocsCodeThemeClass();
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
    mergeVoteBreakdownMetaIntoScores();
    ensureShipStatsReady();
    addShipStats();
    addUnshippedCookieEstimate();
    addProjectShowCookieStat();
    inlineDevlogForm();
    setupInlineDevlogEditing();
    enhanceShopGoals();
    runShopOrdersSync();
    initShopAccessories();
    addShopCardEfficiency();
    addOutOfStockToggle();
    addLotteryOddsInsights();
    enhanceRecentlyAddedSection();
    addExploreSearch();
    addExploreUsersPage();
    captureApiKey();
    initProjectBoardStats();
    addSkipButton();
    enhanceKitchenDashboard();
    setTimeout(enhanceLeaderboardPage, 0);
    enhanceCommentEmojiInputs();
    watchCommentEmojiInputs();
    enhanceShipEmojiInput();
    watchShipEmojiInput();
    cleanupUnownedUnshippedCache();
    addDoomscrollMode();
    addAdminViewButton();
    addSidebarItems();
    enhanceAchievementsPage();
    initShotsEditor();
    enhanceAdminPage();
    initVotesFeature();
    initProjectRepoSuggestions();
    initProjectTodos();
    initShipFastFlow();
});

function ensureUploadToolsContainer(fileUploadArea) {
    let container = fileUploadArea.querySelector('.flavortown-upload-tools');
    if (!container) {
        container = document.createElement('div');
        container.className = 'flavortown-upload-tools';
        const uploadAreaStyle = window.getComputedStyle(fileUploadArea);
        if (uploadAreaStyle.position === 'static') {
            fileUploadArea.style.position = 'relative';
        }
        fileUploadArea.appendChild(container);
    }
    return container;
}

function createUploadToolButton({ className, label, title, onClick }) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = `flavortown-upload-tool-btn ${className}`;
    btn.innerHTML = label;
    btn.title = title;
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        onClick();
    });
    return btn;
}

function initShotsEditor() {
    function addUploadTools() {
        const fileUploadArea = document.querySelector('.file-upload');
        if (!fileUploadArea) return false;

        const container = ensureUploadToolsContainer(fileUploadArea);

        if (!container.querySelector('.flavortown-shots-btn')) {
            const shotsBtn = createUploadToolButton({
                className: 'flavortown-shots-btn',
                label: '✨ Style',
                title: 'Style your screenshot with shots.so - add backgrounds, frames, and effects',
                onClick: () => openShotsModal()
            });
            container.appendChild(shotsBtn);
        }

        if (!container.querySelector('.flavortown-annotate-btn')) {
            const annotateBtn = createUploadToolButton({
                className: 'flavortown-annotate-btn',
                label: '🛠️ Edit',
                title: 'Annotate and crop attachments locally',
                onClick: () => openAnnotatorModal()
            });
            container.appendChild(annotateBtn);
        }

        return true;
    }

    if (addUploadTools()) return;

    const observer = new MutationObserver(() => {
        if (addUploadTools()) {
            observer.disconnect();
        }
    });
    observer.observe(document.body, { childList: true, subtree: true });

    setTimeout(() => {
        if (addUploadTools()) {
            observer.disconnect();
        }
    }, 2000);
}

let _shotsOriginalFiles = [];
let _shotsStyledFileIndex = -1;
let _annotatorState = null;

function getFileUploadInput() {
    return document.querySelector('.file-upload input[type="file"]')
        || document.querySelector('[data-file-upload-target="input"]')
        || document.querySelector('input[type="file"]');
}

function getFileUploadFiles(fileInput) {
    return fileInput ? Array.from(fileInput.files || []) : [];
}

function getActivePreviewIndex() {
    const previewItems = document.querySelectorAll('.file-upload__preview-item, .file-upload__item');
    if (!previewItems.length) return 0;
    const activeItem = document.querySelector('.file-upload__preview-item.active, .file-upload__item.active');
    if (!activeItem) return 0;
    const index = Array.from(previewItems).indexOf(activeItem);
    return index === -1 ? 0 : index;
}

function showAnnotatorToast(message) {
    const existing = document.querySelector('.flavortown-annotator-toast');
    if (existing) existing.remove();
    const toast = document.createElement('div');
    toast.className = 'flavortown-annotator-toast';
    toast.textContent = message;
    document.body.appendChild(toast);
    requestAnimationFrame(() => toast.classList.add('is-visible'));
    setTimeout(() => {
        toast.classList.remove('is-visible');
        setTimeout(() => toast.remove(), 300);
    }, 2400);
}

function openAnnotatorModal() {
    if (_annotatorState?.overlay) return;

    const fileInput = getFileUploadInput();
    if (!fileInput || !fileInput.files || fileInput.files.length === 0) {
        showAnnotatorToast('Add an image first to edit it.');
        return;
    }

    const files = getFileUploadFiles(fileInput);
    const imageEntries = files
        .map((file, index) => {
            if (!file.type.startsWith('image/')) return null;
            return {
                file,
                index,
                url: URL.createObjectURL(file),
                state: null
            };
        })
        .filter(Boolean);

    if (!imageEntries.length) {
        showAnnotatorToast('No image attachments found.');
        return;
    }

    const activeIndex = Math.min(getActivePreviewIndex(), imageEntries.length - 1);

    const overlay = document.createElement('div');
    overlay.className = 'flavortown-annotator-overlay';
    overlay.innerHTML = `
        <div class="flavortown-annotator-modal" role="dialog" aria-modal="true">
            <div class="flavortown-annotator-header">
                <div class="flavortown-annotator-title">
                    <span class="flavortown-annotator-icon">🛠️</span>
                    <div>
                        <div class="flavortown-annotator-heading">Annotate & Crop</div>
                        <div class="flavortown-annotator-subtitle">Edits stay local until you save.</div>
                    </div>
                </div>
                <div class="flavortown-annotator-nav">
                    <button class="flavortown-annotator-nav-btn" data-action="prev" aria-label="Previous image">◀</button>
                    <span class="flavortown-annotator-counter">1 / 1</span>
                    <button class="flavortown-annotator-nav-btn" data-action="next" aria-label="Next image">▶</button>
                </div>
                <button class="flavortown-annotator-close" aria-label="Close">✕</button>
            </div>
            <div class="flavortown-annotator-toolbar">
                <div class="flavortown-annotator-group flavortown-annotator-group--tools">
                    <button class="flavortown-annotator-tool active" data-tool="arrow">Arrow</button>
                    <button class="flavortown-annotator-tool" data-tool="line">Line</button>
                    <button class="flavortown-annotator-tool" data-tool="curve">Curve</button>
                    <button class="flavortown-annotator-tool" data-tool="rect">Rect</button>
                    <button class="flavortown-annotator-tool" data-tool="ellipse">Ellipse</button>
                    <button class="flavortown-annotator-tool" data-tool="highlight">Highlight</button>
                    <button class="flavortown-annotator-tool" data-tool="text">Text</button>
                    <button class="flavortown-annotator-tool" data-tool="crop">Crop</button>
                </div>
                <div class="flavortown-annotator-group flavortown-annotator-group--color">
                    <label class="flavortown-annotator-label">Color</label>
                    <input class="flavortown-annotator-color-input" id="flavortownAnnotatorColor" type="color" value="#ec8b33">
                    <input class="flavortown-annotator-hex" id="flavortownAnnotatorHex" type="text" value="#ec8b33">
                </div>
                <div class="flavortown-annotator-group flavortown-annotator-group--shape">
                    <label class="flavortown-annotator-label">Opacity</label>
                    <input class="flavortown-annotator-range" id="flavortownAnnotatorOpacity" type="range" min="10" max="100" value="90">
                </div>
                <div class="flavortown-annotator-group flavortown-annotator-group--shape">
                    <label class="flavortown-annotator-label">Stroke</label>
                    <input class="flavortown-annotator-range" id="flavortownAnnotatorStroke" type="range" min="2" max="12" value="4">
                    <label class="flavortown-annotator-toggle"><input type="checkbox" id="flavortownAnnotatorFill"> Fill</label>
                </div>
                <div class="flavortown-annotator-group flavortown-annotator-group--shape">
                    <label class="flavortown-annotator-label">Rough</label>
                    <label class="flavortown-annotator-toggle"><input type="checkbox" id="flavortownAnnotatorRough" checked> On</label>
                    <input class="flavortown-annotator-range" id="flavortownAnnotatorRoughness" type="range" min="0" max="3" step="0.1" value="1.6">
                </div>
                <div class="flavortown-annotator-group flavortown-annotator-group--curve is-hidden">
                    <label class="flavortown-annotator-label">Curve</label>
                    <input class="flavortown-annotator-range" id="flavortownAnnotatorCurve" type="range" min="-1" max="1" step="0.05" value="0.25">
                </div>
                <div class="flavortown-annotator-group flavortown-annotator-group--text">
                    <label class="flavortown-annotator-label">Text</label>
                    <input class="flavortown-annotator-font-search" id="flavortownAnnotatorFontSearch" type="text" placeholder="Search fonts">
                    <select class="flavortown-annotator-select flavortown-annotator-font" id="flavortownAnnotatorFont"></select>
                    <select class="flavortown-annotator-select" id="flavortownAnnotatorTextSize">
                        <option value="12">12px</option>
                        <option value="16" selected>16px</option>
                        <option value="20">20px</option>
                        <option value="24">24px</option>
                        <option value="32">32px</option>
                        <option value="40">40px</option>
                        <option value="48">48px</option>
                        <option value="64">64px</option>
                    </select>
                    <select class="flavortown-annotator-select" id="flavortownAnnotatorTextWeight">
                        <option value="400">Regular</option>
                        <option value="600" selected>Semibold</option>
                        <option value="700">Bold</option>
                    </select>
                    <label class="flavortown-annotator-toggle"><input type="checkbox" id="flavortownAnnotatorShadow" checked> Shadow</label>
                </div>
                <div class="flavortown-annotator-group flavortown-annotator-actions">
                    <button class="flavortown-annotator-btn" data-action="undo">Undo</button>
                    <button class="flavortown-annotator-btn" data-action="redo">Redo</button>
                    <button class="flavortown-annotator-btn" data-action="clear">Reset</button>
                </div>
            </div>
            <div class="flavortown-annotator-canvas-wrap">
                <canvas class="flavortown-annotator-canvas"></canvas>
                <canvas class="flavortown-annotator-overlay-canvas"></canvas>
            </div>
            <div class="flavortown-annotator-footer">
                <div class="flavortown-annotator-status"></div>
                <div class="flavortown-annotator-footer-actions">
                    <button class="flavortown-annotator-footer-btn" data-action="close">Cancel</button>
                    <button class="flavortown-annotator-footer-btn primary" data-action="save">Replace Attachment</button>
                </div>
            </div>
            <datalist id="flavortownAnnotatorFontList"></datalist>
        </div>
    `;

    document.body.appendChild(overlay);

    _annotatorState = {
        overlay,
        fileInput,
        files,
        imageEntries,
        activeIndex,
        currentTool: 'arrow',
        currentColorKey: 'accent',
        currentColor: '#ec8b33',
        strokeWidth: 4,
        opacity: 0.9,
        fillEnabled: false,
        roughEnabled: true,
        roughness: 1.6,
        curveAmount: 0.25,
        textSize: 16,
        textWeight: 600,
        textFont: 'Inter',
        textShadow: false
    };

    setupAnnotatorUI();
}

function setupAnnotatorUI() {
    const { overlay, imageEntries } = _annotatorState;
    const closeBtn = overlay.querySelector('.flavortown-annotator-close');
    const footerActions = overlay.querySelector('.flavortown-annotator-footer-actions');
    const toolButtons = Array.from(overlay.querySelectorAll('.flavortown-annotator-tool'));
    const colorInput = overlay.querySelector('#flavortownAnnotatorColor');
    const hexInput = overlay.querySelector('#flavortownAnnotatorHex');
    const opacityInput = overlay.querySelector('#flavortownAnnotatorOpacity');
    const strokeInput = overlay.querySelector('#flavortownAnnotatorStroke');
    const fillToggle = overlay.querySelector('#flavortownAnnotatorFill');
    const roughToggle = overlay.querySelector('#flavortownAnnotatorRough');
    const roughnessInput = overlay.querySelector('#flavortownAnnotatorRoughness');
    const curveInput = overlay.querySelector('#flavortownAnnotatorCurve');
    const textSizeSelect = overlay.querySelector('#flavortownAnnotatorTextSize');
    const textWeightSelect = overlay.querySelector('#flavortownAnnotatorTextWeight');
    const fontInput = overlay.querySelector('#flavortownAnnotatorFont');
    const fontSearchInput = overlay.querySelector('#flavortownAnnotatorFontSearch');
    const shadowToggle = overlay.querySelector('#flavortownAnnotatorShadow');
    const actionButtons = Array.from(overlay.querySelectorAll('.flavortown-annotator-btn'));
    const navButtons = Array.from(overlay.querySelectorAll('.flavortown-annotator-nav-btn'));
    const fontList = overlay.querySelector('#flavortownAnnotatorFontList');
    const textGroups = Array.from(overlay.querySelectorAll('.flavortown-annotator-group--text'));
    const shapeGroups = Array.from(overlay.querySelectorAll('.flavortown-annotator-group--shape'));
    const colorGroups = Array.from(overlay.querySelectorAll('.flavortown-annotator-group--color'));
    const curveGroups = Array.from(overlay.querySelectorAll('.flavortown-annotator-group--curve'));

    const canvas = overlay.querySelector('.flavortown-annotator-canvas');
    const overlayCanvas = overlay.querySelector('.flavortown-annotator-overlay-canvas');
    const status = overlay.querySelector('.flavortown-annotator-status');

    const ctx = canvas.getContext('2d');
    const overlayCtx = overlayCanvas.getContext('2d');
    const dpr = Math.max(1, window.devicePixelRatio || 1);

    let image = new Image();
    let renderState = null;
    let draft = null;
    let cropDraft = null;
    let isDrawing = false;
    let loadedFonts = new Set();
    let fullFontList = [];
    let emojiMapCache = null;
    const emojiImageCache = new Map();
    let activeTextEditor = null;
    let activeTextPoint = null;
    let isClosingTextEditor = false;

    function ensureEntryState(entry) {
        if (entry.state) return;
        entry.state = {
            annotations: [],
            cropRect: null,
            history: [],
            historyIndex: -1
        };
        pushHistory(entry.state);
    }

    function pushHistory(state) {
        const snapshot = {
            annotations: state.annotations.map(item => ({ ...item })),
            cropRect: state.cropRect ? { ...state.cropRect } : null
        };
        state.history = state.history.slice(0, state.historyIndex + 1);
        state.history.push(snapshot);
        state.historyIndex = state.history.length - 1;
    }

    function applyHistory(state, index) {
        if (!state.history[index]) return;
        const snapshot = state.history[index];
        state.annotations = snapshot.annotations.map(item => ({ ...item }));
        state.cropRect = snapshot.cropRect ? { ...snapshot.cropRect } : null;
        state.historyIndex = index;
    }

    function updateHistoryControls() {
        const entry = imageEntries[_annotatorState.activeIndex];
        const state = entry.state;
        const undoBtn = overlay.querySelector('[data-action="undo"]');
        const redoBtn = overlay.querySelector('[data-action="redo"]');
        if (!state) return;
        if (undoBtn) undoBtn.disabled = state.historyIndex <= 0;
        if (redoBtn) redoBtn.disabled = state.historyIndex >= state.history.length - 1;
    }

    function updateNavControls() {
        const counter = overlay.querySelector('.flavortown-annotator-counter');
        if (counter) {
            counter.textContent = `${_annotatorState.activeIndex + 1} / ${imageEntries.length}`;
        }
        navButtons.forEach(btn => {
            const action = btn.dataset.action;
            if (action === 'prev') {
                btn.disabled = _annotatorState.activeIndex === 0;
            }
            if (action === 'next') {
                btn.disabled = _annotatorState.activeIndex === imageEntries.length - 1;
            }
        });
    }

    function resolveColor(key) {
        const styles = getComputedStyle(document.documentElement);
        const map = {
            accent: styles.getPropertyValue('--color-accent') || '#ec8b33',
            green: styles.getPropertyValue('--color-green') || '#38a169',
            yellow: styles.getPropertyValue('--color-yellow') || '#d97706',
            red: styles.getPropertyValue('--color-red') || '#e53e3e',
            text: styles.getPropertyValue('--color-text-primary') || '#5d4e37'
        };
        return (map[key] || '#5d4e37').trim();
    }

    function normalizeHex(value) {
        if (!value) return null;
        const trimmed = value.trim();
        if (/^#[0-9a-fA-F]{6}$/.test(trimmed)) return trimmed;
        const short = trimmed.match(/^#([0-9a-fA-F]{3})$/);
        if (short) {
            const [r, g, b] = short[1].split('');
            return `#${r}${r}${g}${g}${b}${b}`;
        }
        return null;
    }

    function setCurrentColor(hex) {
        const normalized = normalizeHex(hex);
        if (!normalized) return;
        _annotatorState.currentColor = normalized;
        if (colorInput) colorInput.value = normalized;
        if (hexInput) hexInput.value = normalized;
    }

    function getCurrentColor() {
        return _annotatorState.currentColor || resolveColor(_annotatorState.currentColorKey);
    }

    function hexToRgb(hex) {
        const normalized = normalizeHex(hex);
        if (!normalized) return null;
        const parsed = parseInt(normalized.slice(1), 16);
        return {
            r: (parsed >> 16) & 255,
            g: (parsed >> 8) & 255,
            b: parsed & 255
        };
    }

    function relativeLuminance({ r, g, b }) {
        const transform = (v) => {
            const srgb = v / 255;
            return srgb <= 0.03928 ? srgb / 12.92 : Math.pow((srgb + 0.055) / 1.055, 2.4);
        };
        return 0.2126 * transform(r) + 0.7152 * transform(g) + 0.0722 * transform(b);
    }

    function pickShadowColor(hex) {
        const rgb = hexToRgb(hex);
        if (!rgb) return 'rgba(0,0,0,0.35)';
        const lum = relativeLuminance(rgb);
        return lum > 0.6 ? 'rgba(0,0,0,0.35)' : 'rgba(255,255,255,0.35)';
    }

    function sendRuntimeMessage(payload) {
        return new Promise((resolve) => {
            try {
                browserAPI.runtime.sendMessage(payload, (response) => {
                    const err = browserAPI.runtime.lastError;
                    if (err) {
                        resolve({ ok: false, error: err.message });
                        return;
                    }
                    resolve(response);
                });
            } catch (e) {
                resolve({ ok: false, error: e.message });
            }
        });
    }

    const POPULAR_FONTS = [
        'Inter', 'Roboto', 'Poppins', 'Montserrat', 'Lora', 'Merriweather',
        'Playfair Display', 'Space Mono', 'DM Sans', 'Fira Code'
    ];

    async function loadGoogleFontsList() {
        if (!fontList) return;
        const cacheKey = 'flavortown_google_fonts_cache';
        const cacheTtl = 7 * 24 * 60 * 60 * 1000;
        try {
            const cachedRaw = localStorage.getItem(cacheKey);
            if (cachedRaw) {
                const cached = JSON.parse(cachedRaw);
                if (cached?.updatedAt && Date.now() - cached.updatedAt < cacheTtl) {
                    populateFontList(cached.items || []);
                    return;
                }
            }
        } catch (e) {
        }

        const response = await sendRuntimeMessage({ type: 'GET_GOOGLE_FONTS_LIST' });
        if (response?.ok && Array.isArray(response.items) && response.items.length) {
            populateFontList(response.items);
            localStorage.setItem(cacheKey, JSON.stringify({ updatedAt: Date.now(), items: response.items }));
            return;
        }

        try {
            const response = await fetch('https://fonts.google.com/metadata/fonts');
            const text = await response.text();
            const cleaned = text.replace(/^\)\]\}'\n/, '');
            const data = JSON.parse(cleaned);
            const items = (data?.familyMetadataList || [])
                .map(item => item.family)
                .filter(Boolean)
                .sort((a, b) => a.localeCompare(b));
            populateFontList(items);
            localStorage.setItem(cacheKey, JSON.stringify({ updatedAt: Date.now(), items }));
        } catch (e) {
            populateFontList(['Inter', 'Space Mono', 'Roboto', 'Lato']);
        }
    }

    function populateFontList(items) {
        if (!fontInput) return;
        fullFontList = items.filter(Boolean);
        renderFontOptions('');
    }

    function renderFontOptions(query) {
        if (!fontInput) return;
        const filter = (query || '').trim().toLowerCase();
        const popularSet = new Set(POPULAR_FONTS.map(name => name.toLowerCase()));
        const deduped = Array.from(new Set(fullFontList));

        const scoreMatch = (name) => {
            const lower = name.toLowerCase();
            if (!filter) return 0;
            if (lower.startsWith(filter)) return 0;
            if (lower.includes(filter)) return 1;
            return 2;
        };

        fontInput.innerHTML = '';

        if (filter) {
            const matches = deduped.filter(name => name.toLowerCase().includes(filter));
            matches.sort((a, b) => {
                const scoreA = scoreMatch(a);
                const scoreB = scoreMatch(b);
                if (scoreA !== scoreB) return scoreA - scoreB;
                return a.localeCompare(b);
            });
            const group = document.createElement('optgroup');
            group.label = 'Matches';
            matches.forEach(name => {
                const option = document.createElement('option');
                option.value = name;
                option.textContent = name;
                group.appendChild(option);
            });
            fontInput.appendChild(group);
        } else {
            const popular = POPULAR_FONTS.filter(name => deduped.some(item => item.toLowerCase() === name.toLowerCase()));
            const rest = deduped.filter(name => !popularSet.has(name.toLowerCase()));
            rest.sort((a, b) => a.localeCompare(b));

            const addGroup = (label, list) => {
                const group = document.createElement('optgroup');
                group.label = label;
                list.forEach(name => {
                    const option = document.createElement('option');
                    option.value = name;
                    option.textContent = name;
                    group.appendChild(option);
                });
                fontInput.appendChild(group);
            };

            addGroup('Popular', popular.length ? popular : POPULAR_FONTS);
            addGroup('All fonts', rest);
        }

        if (_annotatorState.textFont && fontInput.value !== _annotatorState.textFont) {
            fontInput.value = _annotatorState.textFont;
        }
    }

    function loadGoogleFont(fontFamily) {
        const name = fontFamily.trim();
        if (!name) return;
        if (loadedFonts.has(name)) return;
        const link = document.createElement('link');
        const familyParam = encodeURIComponent(name).replace(/%20/g, '+');
        link.rel = 'stylesheet';
        link.href = `https://fonts.googleapis.com/css2?family=${familyParam}:wght@300;400;500;600;700&display=swap`;
        document.head.appendChild(link);
        loadedFonts.add(name);
    }

    async function ensureEmojiMap() {
        if (emojiMapCache) return emojiMapCache;
        emojiMapCache = await fetchSlackEmojiMap();
        return emojiMapCache;
    }

    async function ensureEmojiImage(name) {
        if (emojiImageCache.has(name)) {
            const cached = emojiImageCache.get(name);
            if (cached.loaded) return cached.image;
            return null;
        }
        emojiImageCache.set(name, { loaded: false, image: null });
        const map = await ensureEmojiMap();
        const entry = map?.[name];
        const url = entry?.url;
        if (!url) return null;

        try {
            const response = await sendRuntimeMessage({ type: 'FETCH_EMOJI_IMAGE', url });
            if (!response?.ok || !response.dataUrl) return null;
            const img = new Image();
            img.onload = () => {
                emojiImageCache.set(name, { loaded: true, image: img });
                render();
            };
            img.onerror = () => {
                emojiImageCache.set(name, { loaded: true, image: null });
            };
            img.src = response.dataUrl;
            emojiImageCache.set(name, { loaded: false, image: img });
            return null;
        } catch (e) {
            return null;
        }
    }

    function parseEmojiTokens(text) {
        if (!text) return [];
        const parts = text.split(/(:[a-zA-Z0-9_+\-]+:)/g).filter(Boolean);
        return parts.map(part => {
            if (part.startsWith(':') && part.endsWith(':') && part.length > 2) {
                return { type: 'emoji', value: part.slice(1, -1) };
            }
            return { type: 'text', value: part };
        });
    }

    function drawTextWithEmojis(ctx, text, state) {
        const drawState = getDrawState(state);
        const point = toCanvasPoint({ x: text.x, y: text.y }, drawState);
        if (!point) return;
        ctx.save();
        ctx.fillStyle = text.color;
        ctx.font = `${text.weight} ${text.size * drawState.scale}px "${text.font}", Inter, system-ui, -apple-system, sans-serif`;
        ctx.textBaseline = 'top';
        if (text.shadow) {
            ctx.shadowColor = text.shadowColor || pickShadowColor(text.color);
            ctx.shadowBlur = 3 * drawState.scale;
            ctx.shadowOffsetY = 1 * drawState.scale;
        }

        const tokens = parseEmojiTokens(text.value);
        let cursorX = point.x;
        const emojiSize = text.size * drawState.scale;

        tokens.forEach(token => {
            if (token.type === 'text') {
                ctx.fillText(token.value, cursorX, point.y);
                cursorX += ctx.measureText(token.value).width;
                return;
            }
            if (token.type === 'emoji') {
                const image = emojiImageCache.get(token.value)?.image;
                if (image && image.complete) {
                    ctx.drawImage(image, cursorX, point.y, emojiSize, emojiSize);
                } else {
                    ensureEmojiImage(token.value);
                }
                cursorX += emojiSize;
            }
        });
        ctx.restore();
    }

    function resizeCanvas() {
        const wrap = overlay.querySelector('.flavortown-annotator-canvas-wrap');
        if (!wrap) return;
        const rect = wrap.getBoundingClientRect();
        const width = Math.max(1, rect.width);
        const height = Math.max(1, rect.height);
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;
        overlayCanvas.width = width * dpr;
        overlayCanvas.height = height * dpr;
        overlayCanvas.style.width = `${width}px`;
        overlayCanvas.style.height = `${height}px`;
        renderState = calculateRenderState(width, height);
        render();
    }

    function calculateRenderState(width, height) {
        if (!image.naturalWidth || !image.naturalHeight) return null;
        const scale = Math.min(width / image.naturalWidth, height / image.naturalHeight);
        const displayWidth = image.naturalWidth * scale;
        const displayHeight = image.naturalHeight * scale;
        const offsetX = (width - displayWidth) / 2;
        const offsetY = (height - displayHeight) / 2;
        return { scale, displayWidth, displayHeight, offsetX, offsetY, width, height };
    }

    function toImagePoint(event) {
        if (!renderState) return null;
        const rect = overlayCanvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        if (x < renderState.offsetX || y < renderState.offsetY) return null;
        if (x > renderState.offsetX + renderState.displayWidth) return null;
        if (y > renderState.offsetY + renderState.displayHeight) return null;
        const imgX = (x - renderState.offsetX) / renderState.scale;
        const imgY = (y - renderState.offsetY) / renderState.scale;
        return { x: imgX, y: imgY };
    }

    function createSeed() {
        return Math.floor(Math.random() * 1e9);
    }

    function seededRandom(seed) {
        let t = seed + 0x6D2B79F5;
        return function () {
            t = Math.imul(t ^ (t >>> 15), t | 1);
            t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
            return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
        };
    }

    function applyAlpha(hex, opacity) {
        const rgb = hexToRgb(hex);
        if (!rgb) return hex;
        return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${opacity})`;
    }

    function getDrawState(state) {
        return state || renderState;
    }

    function drawCleanLine(ctx, line, state) {
        const start = toCanvasPoint(line.start, state);
        const end = toCanvasPoint(line.end, state);
        if (!start || !end) return;
        ctx.strokeStyle = applyAlpha(line.color, line.opacity ?? 1);
        ctx.lineWidth = line.width * state.scale;
        ctx.lineCap = 'butt';
        ctx.lineJoin = 'round';
        ctx.beginPath();
        ctx.moveTo(start.x, start.y);
        ctx.lineTo(end.x, end.y);
        ctx.stroke();
    }

    function drawRoughLine(ctx, line, state) {
        const start = toCanvasPoint(line.start, state);
        const end = toCanvasPoint(line.end, state);
        if (!start || !end) return;
        const random = seededRandom(line.seed || 0);
        const dx = end.x - start.x;
        const dy = end.y - start.y;
        const length = Math.hypot(dx, dy);
        const roughness = (line.roughness || 1.2) * 3.5;
        const segments = Math.max(3, Math.round(length / 60));

        const buildPoints = () => {
            const points = [];
            for (let i = 0; i <= segments; i++) {
                const t = i / segments;
                const jitter = (random() - 0.5) * roughness * (1 - Math.abs(0.5 - t));
                const jitter2 = (random() - 0.5) * roughness * (1 - Math.abs(0.5 - t));
                points.push({
                    x: start.x + dx * t + jitter,
                    y: start.y + dy * t + jitter2
                });
            }
            return points;
        };

        const drawStroke = () => {
            const points = buildPoints();
            ctx.strokeStyle = applyAlpha(line.color, line.opacity ?? 1);
            ctx.lineWidth = line.width * state.scale;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            ctx.beginPath();
            points.forEach((pt, index) => {
                if (index === 0) ctx.moveTo(pt.x, pt.y);
                else ctx.lineTo(pt.x, pt.y);
            });
            ctx.stroke();
        };

        drawStroke();
        drawStroke();
    }

    function drawArrow(ctx, arrow, state) {
        const drawState = getDrawState(state);
        const start = toCanvasPoint(arrow.start, drawState);
        const end = toCanvasPoint(arrow.end, drawState);
        if (!start || !end) return;
        const angle = Math.atan2(end.y - start.y, end.x - start.x);
        const headLength = Math.max(6, arrow.width * 3) * drawState.scale;
        const lineEndX = end.x - headLength * Math.cos(angle);
        const lineEndY = end.y - headLength * Math.sin(angle);
        const line = {
            ...arrow,
            start: arrow.start,
            end: {
                x: (lineEndX - drawState.offsetX) / drawState.scale,
                y: (lineEndY - drawState.offsetY) / drawState.scale
            }
        };
        if (arrow.rough) {
            drawRoughLine(ctx, line, drawState);
        } else {
            drawCleanLine(ctx, line, drawState);
        }

        ctx.fillStyle = applyAlpha(arrow.color, arrow.opacity ?? 1);
        ctx.beginPath();
        ctx.moveTo(end.x, end.y);
        ctx.lineTo(end.x - headLength * Math.cos(angle - Math.PI / 6), end.y - headLength * Math.sin(angle - Math.PI / 6));
        ctx.lineTo(end.x - headLength * Math.cos(angle + Math.PI / 6), end.y - headLength * Math.sin(angle + Math.PI / 6));
        ctx.closePath();
        ctx.fill();
    }

    function drawLine(ctx, line, state) {
        const drawState = getDrawState(state);
        if (line.rough) {
            drawRoughLine(ctx, line, drawState);
        } else {
            drawCleanLine(ctx, line, drawState);
        }
    }

    function drawCurvedArrow(ctx, arrow, state) {
        const drawState = getDrawState(state);
        const start = toCanvasPoint(arrow.start, drawState);
        const end = toCanvasPoint(arrow.end, drawState);
        if (!start || !end) return;
        const dx = end.x - start.x;
        const dy = end.y - start.y;
        const length = Math.hypot(dx, dy);
        if (!length) return;
        const curve = arrow.curve ?? 0.25;
        const normal = { x: -dy / length, y: dx / length };
        const offset = curve * length * 0.25;
        const control = {
            x: (start.x + end.x) / 2 + normal.x * offset,
            y: (start.y + end.y) / 2 + normal.y * offset
        };

        const angle = Math.atan2(end.y - control.y, end.x - control.x);
        const headLength = Math.max(6, arrow.width * 3) * drawState.scale;
        const endAdjusted = {
            x: end.x - headLength * Math.cos(angle),
            y: end.y - headLength * Math.sin(angle)
        };

        const drawStroke = () => {
            ctx.strokeStyle = applyAlpha(arrow.color, arrow.opacity ?? 1);
            ctx.lineWidth = arrow.width * drawState.scale;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            ctx.beginPath();
            ctx.moveTo(start.x, start.y);
            ctx.quadraticCurveTo(control.x, control.y, endAdjusted.x, endAdjusted.y);
            ctx.stroke();
        };

        if (arrow.rough) {
            const random = seededRandom(arrow.seed || 0);
            const jitter = (arrow.roughness || 1.2) * 3.5;
            for (let i = 0; i < 2; i++) {
                const ctrl = {
                    x: control.x + (random() - 0.5) * jitter,
                    y: control.y + (random() - 0.5) * jitter
                };
                ctx.strokeStyle = applyAlpha(arrow.color, arrow.opacity ?? 1);
                ctx.lineWidth = arrow.width * drawState.scale;
                ctx.lineCap = 'round';
                ctx.lineJoin = 'round';
                ctx.beginPath();
                ctx.moveTo(start.x, start.y);
                ctx.quadraticCurveTo(ctrl.x, ctrl.y, endAdjusted.x, endAdjusted.y);
                ctx.stroke();
            }
        } else {
            drawStroke();
        }

        ctx.fillStyle = applyAlpha(arrow.color, arrow.opacity ?? 1);
        ctx.beginPath();
        ctx.moveTo(end.x, end.y);
        ctx.lineTo(end.x - headLength * Math.cos(angle - Math.PI / 6), end.y - headLength * Math.sin(angle - Math.PI / 6));
        ctx.lineTo(end.x - headLength * Math.cos(angle + Math.PI / 6), end.y - headLength * Math.sin(angle + Math.PI / 6));
        ctx.closePath();
        ctx.fill();
    }

    function drawRect(ctx, rect, state) {
        const drawState = getDrawState(state);
        const topLeft = toCanvasPoint({ x: rect.x, y: rect.y }, drawState);
        const bottomRight = toCanvasPoint({ x: rect.x + rect.width, y: rect.y + rect.height }, drawState);
        if (!topLeft || !bottomRight) return;
        const width = bottomRight.x - topLeft.x;
        const height = bottomRight.y - topLeft.y;
        if (width <= 0 || height <= 0) return;
        if (rect.rough) {
            const random = seededRandom(rect.seed || 0);
            const jitter = (rect.roughness || 1.2) * 3;
            ctx.save();
            ctx.strokeStyle = applyAlpha(rect.color, rect.opacity ?? 1);
            ctx.lineWidth = rect.widthValue * drawState.scale;
            for (let i = 0; i < 2; i++) {
                const offsetX = (random() - 0.5) * jitter;
                const offsetY = (random() - 0.5) * jitter;
                ctx.strokeRect(topLeft.x + offsetX, topLeft.y + offsetY, width, height);
            }
            ctx.restore();
        }
        if (rect.fill) {
            ctx.fillStyle = applyAlpha(rect.color, rect.opacity ?? 0.3);
            ctx.fillRect(topLeft.x, topLeft.y, width, height);
        }
        if (rect.stroke !== false) {
            const line = {
                start: { x: rect.x, y: rect.y },
                end: { x: rect.x + rect.width, y: rect.y },
                color: rect.color,
                width: rect.widthValue,
                rough: rect.rough,
                roughness: rect.roughness,
                seed: rect.seed,
                opacity: rect.opacity
            };
            const line2 = { ...line, start: { x: rect.x + rect.width, y: rect.y }, end: { x: rect.x + rect.width, y: rect.y + rect.height } };
            const line3 = { ...line, start: { x: rect.x + rect.width, y: rect.y + rect.height }, end: { x: rect.x, y: rect.y + rect.height } };
            const line4 = { ...line, start: { x: rect.x, y: rect.y + rect.height }, end: { x: rect.x, y: rect.y } };
            drawLine(ctx, line, drawState);
            drawLine(ctx, line2, drawState);
            drawLine(ctx, line3, drawState);
            drawLine(ctx, line4, drawState);
        }
    }

    function drawEllipse(ctx, ellipse, state) {
        const drawState = getDrawState(state);
        const center = toCanvasPoint({
            x: ellipse.x + ellipse.width / 2,
            y: ellipse.y + ellipse.height / 2
        }, drawState);
        if (!center) return;
        const rx = (ellipse.width / 2) * drawState.scale;
        const ry = (ellipse.height / 2) * drawState.scale;
        if (rx <= 0 || ry <= 0 || Number.isNaN(rx) || Number.isNaN(ry)) return;
        if (ellipse.fill) {
            ctx.beginPath();
            ctx.ellipse(center.x, center.y, rx, ry, 0, 0, Math.PI * 2);
            ctx.fillStyle = applyAlpha(ellipse.color, ellipse.opacity ?? 0.3);
            ctx.fill();
        }
        if (ellipse.stroke !== false && !ellipse.rough) {
            ctx.beginPath();
            ctx.ellipse(center.x, center.y, rx, ry, 0, 0, Math.PI * 2);
            ctx.strokeStyle = applyAlpha(ellipse.color, ellipse.opacity ?? 1);
            ctx.lineWidth = ellipse.widthValue * drawState.scale;
            ctx.stroke();
        }
        if (ellipse.rough) {
            const random = seededRandom(ellipse.seed || 0);
            const jitter = (ellipse.roughness || 1.2) * 3.5;
            ctx.strokeStyle = applyAlpha(ellipse.color, ellipse.opacity ?? 1);
            ctx.lineWidth = ellipse.widthValue * drawState.scale;
            for (let i = 0; i < 2; i++) {
                ctx.beginPath();
                ctx.ellipse(
                    center.x + (random() - 0.5) * jitter,
                    center.y + (random() - 0.5) * jitter,
                    rx + (random() - 0.5) * jitter,
                    ry + (random() - 0.5) * jitter,
                    0,
                    0,
                    Math.PI * 2
                );
                ctx.stroke();
            }
        }
    }

    function drawHighlight(ctx, highlight, state) {
        const drawState = getDrawState(state);
        const topLeft = toCanvasPoint({ x: highlight.x, y: highlight.y }, drawState);
        const bottomRight = toCanvasPoint({ x: highlight.x + highlight.width, y: highlight.y + highlight.height }, drawState);
        if (!topLeft || !bottomRight) return;
        const width = bottomRight.x - topLeft.x;
        const height = bottomRight.y - topLeft.y;
        if (width <= 0 || height <= 0) return;
        ctx.fillStyle = applyAlpha(highlight.color, highlight.opacity ?? 0.25);
        ctx.fillRect(topLeft.x, topLeft.y, width, height);
    }

    function drawText(ctx, text, state) {
        drawTextWithEmojis(ctx, text, state);
    }

    function toCanvasPoint(point, state = renderState) {
        if (!state) return null;
        return {
            x: state.offsetX + point.x * state.scale,
            y: state.offsetY + point.y * state.scale
        };
    }

    function renderCropOverlay(cropRect) {
        overlayCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
        overlayCtx.clearRect(0, 0, renderState.width, renderState.height);
        if (!cropRect) return;
        const topLeft = toCanvasPoint({ x: cropRect.x, y: cropRect.y });
        const bottomRight = toCanvasPoint({ x: cropRect.x + cropRect.width, y: cropRect.y + cropRect.height });
        if (!topLeft || !bottomRight) return;
        const x = topLeft.x;
        const y = topLeft.y;
        const w = bottomRight.x - topLeft.x;
        const h = bottomRight.y - topLeft.y;
        overlayCtx.fillStyle = 'rgba(0,0,0,0.4)';
        overlayCtx.fillRect(0, 0, renderState.width, renderState.height);
        overlayCtx.clearRect(x, y, w, h);
        overlayCtx.strokeStyle = getCurrentColor();
        overlayCtx.lineWidth = 2;
        overlayCtx.strokeRect(x, y, w, h);
    }

    function render() {
        if (!renderState) return;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        ctx.clearRect(0, 0, renderState.width, renderState.height);
        ctx.drawImage(
            image,
            renderState.offsetX,
            renderState.offsetY,
            renderState.displayWidth,
            renderState.displayHeight
        );

        const entry = imageEntries[_annotatorState.activeIndex];
        if (!entry.state) return;
        entry.state.annotations.forEach(annotation => {
            if (annotation.type === 'arrow') drawArrow(ctx, annotation);
            if (annotation.type === 'curve') drawCurvedArrow(ctx, annotation);
            if (annotation.type === 'line') drawLine(ctx, annotation);
            if (annotation.type === 'rect') drawRect(ctx, annotation);
            if (annotation.type === 'ellipse') drawEllipse(ctx, annotation);
            if (annotation.type === 'highlight') drawHighlight(ctx, annotation);
            if (annotation.type === 'text') drawText(ctx, annotation);
        });
        if (draft) {
            if (draft.type === 'arrow') drawArrow(ctx, draft);
            if (draft.type === 'curve') drawCurvedArrow(ctx, draft);
            if (draft.type === 'line') drawLine(ctx, draft);
            if (draft.type === 'rect') drawRect(ctx, draft);
            if (draft.type === 'ellipse') drawEllipse(ctx, draft);
            if (draft.type === 'highlight') drawHighlight(ctx, draft);
        }
        renderCropOverlay(entry.state.cropRect || cropDraft);
        updateHistoryControls();
    }

    function setActiveTool(tool) {
        _annotatorState.currentTool = tool;
        toolButtons.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.tool === tool);
        });
        if (tool !== 'text') {
            closeTextEditor(true);
        }
        const showText = tool === 'text';
        const showShape = ['arrow', 'line', 'curve', 'rect', 'ellipse', 'highlight'].includes(tool);
        const showColor = tool !== 'crop';
        const showCurve = tool === 'curve';
        textGroups.forEach(group => group.classList.toggle('is-hidden', !showText));
        shapeGroups.forEach(group => group.classList.toggle('is-hidden', !showShape));
        colorGroups.forEach(group => group.classList.toggle('is-hidden', !showColor));
        curveGroups.forEach(group => group.classList.toggle('is-hidden', !showCurve));
        if (tool === 'crop') {
            status.textContent = 'Drag to select crop area.';
        } else if (tool === 'text') {
            status.textContent = 'Click to place text.';
        } else if (tool === 'highlight') {
            status.textContent = 'Drag to highlight a region.';
            if (_annotatorState.opacity > 0.4) {
                _annotatorState.opacity = 0.25;
                if (opacityInput) opacityInput.value = '25';
            }
        } else {
            status.textContent = 'Click and drag to draw.';
        }
    }

    function setActiveColor(colorKey) {
        _annotatorState.currentColorKey = colorKey;
        const resolved = resolveColor(colorKey);
        setCurrentColor(resolved);
    }

    function closeTextEditor(commit = false) {
        if (!activeTextEditor) return;
        if (isClosingTextEditor) return;
        isClosingTextEditor = true;
        const editor = activeTextEditor;
        const entry = imageEntries[_annotatorState.activeIndex];
        if (commit && activeTextPoint) {
        const textValue = editor.textContent.trim();
            if (textValue) {
                ensureEntryState(entry);
                const size = _annotatorState.textSize / renderState.scale;
                const color = getCurrentColor();
                const font = _annotatorState.textFont || 'Inter';
                loadGoogleFont(font);
                entry.state.annotations.push({
                    type: 'text',
                    x: activeTextPoint.x,
                    y: activeTextPoint.y,
                    value: textValue,
                    size,
                    color,
                    weight: _annotatorState.textWeight || 600,
                    font,
                    shadow: _annotatorState.textShadow,
                    shadowColor: pickShadowColor(color)
                });
                pushHistory(entry.state);
                render();
            }
        }
        if (editor.parentNode && editor.parentNode.contains(editor)) {
            editor.remove();
        }
        activeTextEditor = null;
        activeTextPoint = null;
        isClosingTextEditor = false;
    }

    function openInlineTextEditor(point) {
        closeTextEditor(true);
        const wrap = overlay.querySelector('.flavortown-annotator-canvas-wrap');
        const canvasPoint = toCanvasPoint(point);
        if (!wrap || !canvasPoint) return;
        const editor = document.createElement('div');
        editor.className = 'flavortown-annotator-inline-text';
        editor.contentEditable = 'true';
        editor.spellcheck = false;
        editor.style.left = `${canvasPoint.x}px`;
        editor.style.top = `${canvasPoint.y}px`;
        editor.style.color = getCurrentColor();
        editor.style.fontSize = `${_annotatorState.textSize}px`;
        editor.style.fontWeight = String(_annotatorState.textWeight || 600);
        editor.style.fontFamily = `"${_annotatorState.textFont || 'Inter'}", Inter, system-ui, -apple-system, sans-serif`;
        if (_annotatorState.textShadow) {
            editor.style.textShadow = `0 1px 2px ${pickShadowColor(getCurrentColor())}`;
        } else {
            editor.style.textShadow = 'none';
        }
        wrap.appendChild(editor);
        editor.addEventListener('mousedown', (event) => event.stopPropagation());
        editor.addEventListener('pointerdown', (event) => event.stopPropagation());
        setTimeout(() => editor.focus(), 0);
        activeTextEditor = editor;
        activeTextPoint = point;
        status.textContent = 'Type and press Enter to save.';

        editor.addEventListener('blur', () => closeTextEditor(true), { once: true });
        editor.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
                event.preventDefault();
                closeTextEditor(true);
            }
            if (event.key === 'Escape') {
                event.preventDefault();
                closeTextEditor(false);
            }
        });
    }

    function updateActiveTextEditorStyle() {
        if (!activeTextEditor) return;
        activeTextEditor.style.color = getCurrentColor();
        activeTextEditor.style.fontSize = `${_annotatorState.textSize}px`;
        activeTextEditor.style.fontWeight = String(_annotatorState.textWeight || 600);
        activeTextEditor.style.fontFamily = `"${_annotatorState.textFont || 'Inter'}", Inter, system-ui, -apple-system, sans-serif`;
        if (_annotatorState.textShadow) {
            activeTextEditor.style.textShadow = `0 1px 2px ${pickShadowColor(getCurrentColor())}`;
        } else {
            activeTextEditor.style.textShadow = 'none';
        }
    }

    function finalizeDraft() {
        const entry = imageEntries[_annotatorState.activeIndex];
        if (!entry.state || !draft) return;

        if (draft.type === 'arrow' || draft.type === 'line' || draft.type === 'curve') {
            const dx = draft.end.x - draft.start.x;
            const dy = draft.end.y - draft.start.y;
            if (Math.hypot(dx, dy) < 6 / renderState.scale) {
                draft = null;
                render();
                return;
            }
            entry.state.annotations.push({ ...draft });
            pushHistory(entry.state);
            draft = null;
            render();
            return;
        }

        if (draft.type === 'rect' || draft.type === 'ellipse' || draft.type === 'highlight') {
            if (draft.width < 10 / renderState.scale || draft.height < 10 / renderState.scale) {
                draft = null;
                render();
                return;
            }
            entry.state.annotations.push({ ...draft });
            pushHistory(entry.state);
            draft = null;
            render();
        }
    }

    function finalizeCrop() {
        const entry = imageEntries[_annotatorState.activeIndex];
        if (!entry.state || !cropDraft) return;
        if (cropDraft.width < 10 || cropDraft.height < 10) {
            cropDraft = null;
            render();
            return;
        }
        entry.state.cropRect = { ...cropDraft };
        cropDraft = null;
        pushHistory(entry.state);
        render();
    }

    function resetCurrent() {
        const entry = imageEntries[_annotatorState.activeIndex];
        if (!entry.state) return;
        entry.state.annotations = [];
        entry.state.cropRect = null;
        pushHistory(entry.state);
        render();
    }

    async function saveCurrent() {
        const entry = imageEntries[_annotatorState.activeIndex];
        if (!entry.state) return;
        closeTextEditor(true);
        const exportCanvas = document.createElement('canvas');
        const crop = entry.state.cropRect;
        const exportWidth = crop ? crop.width : image.naturalWidth;
        const exportHeight = crop ? crop.height : image.naturalHeight;
        exportCanvas.width = exportWidth;
        exportCanvas.height = exportHeight;
        const exportCtx = exportCanvas.getContext('2d');
        if (crop) {
            exportCtx.drawImage(image, crop.x, crop.y, crop.width, crop.height, 0, 0, exportWidth, exportHeight);
        } else {
            exportCtx.drawImage(image, 0, 0, exportWidth, exportHeight);
        }

        const exportState = { scale: 1, offsetX: 0, offsetY: 0, width: exportWidth, height: exportHeight };

        entry.state.annotations.forEach(annotation => {
            if (annotation.type === 'arrow' || annotation.type === 'line' || annotation.type === 'curve') {
                const adjusted = {
                    ...annotation,
                    start: {
                        x: annotation.start.x - (crop ? crop.x : 0),
                        y: annotation.start.y - (crop ? crop.y : 0)
                    },
                    end: {
                        x: annotation.end.x - (crop ? crop.x : 0),
                        y: annotation.end.y - (crop ? crop.y : 0)
                    }
                };
                if (annotation.type === 'arrow') {
                    drawArrow(exportCtx, adjusted, exportState);
                } else if (annotation.type === 'curve') {
                    drawCurvedArrow(exportCtx, adjusted, exportState);
                } else {
                    drawLine(exportCtx, adjusted, exportState);
                }
            }
            if (annotation.type === 'rect' || annotation.type === 'ellipse' || annotation.type === 'highlight') {
                const adjusted = {
                    ...annotation,
                    x: annotation.x - (crop ? crop.x : 0),
                    y: annotation.y - (crop ? crop.y : 0)
                };
                if (annotation.type === 'rect') drawRect(exportCtx, adjusted, exportState);
                if (annotation.type === 'ellipse') drawEllipse(exportCtx, adjusted, exportState);
                if (annotation.type === 'highlight') drawHighlight(exportCtx, adjusted, exportState);
            }
            if (annotation.type === 'text') {
                const adjusted = {
                    ...annotation,
                    x: annotation.x - (crop ? crop.x : 0),
                    y: annotation.y - (crop ? crop.y : 0)
                };
                drawText(exportCtx, adjusted, exportState);
            }
        });

        const originalFile = entry.file;
        const exportType = originalFile.type === 'image/jpeg' ? 'image/jpeg' : 'image/png';
        const blob = await new Promise(resolve => exportCanvas.toBlob(resolve, exportType, 0.92));
        if (!blob) {
            status.textContent = 'Export failed. Try again.';
            return;
        }

        const newFile = new File([blob], originalFile.name, { type: exportType });
        const newFiles = _annotatorState.files.slice();
        newFiles[entry.index] = newFile;
        const dt = new DataTransfer();
        newFiles.forEach(file => dt.items.add(file));
        _annotatorState.fileInput.files = dt.files;
        ['input', 'change'].forEach(eventType => {
            _annotatorState.fileInput.dispatchEvent(new Event(eventType, { bubbles: true, cancelable: true }));
        });

        if (entry.url) URL.revokeObjectURL(entry.url);
        entry.file = newFile;
        entry.url = URL.createObjectURL(newFile);
        entry.state.annotations = [];
        entry.state.cropRect = null;
        entry.state.history = [];
        entry.state.historyIndex = -1;
        pushHistory(entry.state);
        status.textContent = 'Attachment replaced.';
        loadImage(entry.url);
    }

    function loadImage(url) {
        image.onload = () => {
            resizeCanvas();
        };
        image.src = url;
    }

    function cleanup() {
        closeTextEditor(false);
        imageEntries.forEach(entry => {
            if (entry.url) URL.revokeObjectURL(entry.url);
        });
        window.removeEventListener('resize', resizeCanvas);
        overlay.remove();
        _annotatorState = null;
    }

    toolButtons.forEach(btn => {
        btn.addEventListener('click', () => setActiveTool(btn.dataset.tool));
    });

    if (colorInput) {
        const accent = resolveColor('accent');
        colorInput.value = normalizeHex(accent) || '#ec8b33';
    }
    if (hexInput) {
        hexInput.value = colorInput?.value || '#ec8b33';
    }

    if (colorInput) {
        colorInput.addEventListener('input', (event) => {
            _annotatorState.currentColorKey = 'custom';
            setCurrentColor(event.target.value);
            updateActiveTextEditorStyle();
        });
    }

    if (hexInput) {
        hexInput.addEventListener('input', (event) => {
            const next = normalizeHex(event.target.value);
            if (next) {
                _annotatorState.currentColorKey = 'custom';
                setCurrentColor(next);
                updateActiveTextEditorStyle();
            }
        });
    }

    if (opacityInput) {
        opacityInput.addEventListener('input', (event) => {
            _annotatorState.opacity = Math.max(0.1, Math.min(1, Number(event.target.value) / 100));
        });
    }

    strokeInput.addEventListener('input', (event) => {
        _annotatorState.strokeWidth = Number(event.target.value) || 4;
    });

    if (fillToggle) {
        fillToggle.addEventListener('change', (event) => {
            _annotatorState.fillEnabled = !!event.target.checked;
        });
    }

    if (roughToggle) {
        roughToggle.addEventListener('change', (event) => {
            _annotatorState.roughEnabled = !!event.target.checked;
            if (roughnessInput) {
                roughnessInput.style.display = _annotatorState.roughEnabled ? '' : 'none';
            }
        });
    }

    if (roughnessInput) {
        roughnessInput.addEventListener('input', (event) => {
            _annotatorState.roughness = Number(event.target.value) || 1.6;
        });
    }

    if (curveInput) {
        curveInput.addEventListener('input', (event) => {
            _annotatorState.curveAmount = Number(event.target.value) || 0;
            if (draft && draft.type === 'curve') {
                draft.curve = _annotatorState.curveAmount;
                render();
            }
        });
    }

    textSizeSelect.addEventListener('change', (event) => {
        _annotatorState.textSize = Number(event.target.value) || 16;
        updateActiveTextEditorStyle();
    });

    if (textWeightSelect) {
        textWeightSelect.addEventListener('change', (event) => {
            _annotatorState.textWeight = Number(event.target.value) || 600;
            updateActiveTextEditorStyle();
        });
    }

    if (fontInput) {
        fontInput.addEventListener('change', (event) => {
            const next = event.target.value.trim() || 'Inter';
            _annotatorState.textFont = next;
            loadGoogleFont(next);
            updateActiveTextEditorStyle();
        });

        if (fontInput.value) {
            _annotatorState.textFont = fontInput.value;
            loadGoogleFont(fontInput.value);
        }
    }

    if (fontSearchInput) {
        fontSearchInput.addEventListener('input', (event) => {
            renderFontOptions(event.target.value);
        });
    }

    if (fontSearchInput) {
        fontSearchInput.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
                event.preventDefault();
                const firstOption = fontInput?.querySelector('option');
                if (firstOption) {
                    fontInput.value = firstOption.value;
                    _annotatorState.textFont = firstOption.value;
                    loadGoogleFont(firstOption.value);
                    updateActiveTextEditorStyle();
                }
            }
        });
    }

    if (shadowToggle) {
        shadowToggle.addEventListener('change', (event) => {
            _annotatorState.textShadow = !!event.target.checked;
            updateActiveTextEditorStyle();
        });
    }

    actionButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const action = btn.dataset.action;
            const entry = imageEntries[_annotatorState.activeIndex];
            ensureEntryState(entry);
            if (action === 'undo') {
                applyHistory(entry.state, Math.max(0, entry.state.historyIndex - 1));
                render();
            }
            if (action === 'redo') {
                applyHistory(entry.state, Math.min(entry.state.history.length - 1, entry.state.historyIndex + 1));
                render();
            }
            if (action === 'clear') {
                resetCurrent();
            }
        });
    });

    navButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const action = btn.dataset.action;
            if (action === 'prev' && _annotatorState.activeIndex > 0) {
                closeTextEditor(true);
                _annotatorState.activeIndex -= 1;
            }
            if (action === 'next' && _annotatorState.activeIndex < imageEntries.length - 1) {
                closeTextEditor(true);
                _annotatorState.activeIndex += 1;
            }
            const entry = imageEntries[_annotatorState.activeIndex];
            ensureEntryState(entry);
            draft = null;
            cropDraft = null;
            loadImage(entry.url);
            updateNavControls();
        });
    });

    footerActions.addEventListener('click', (event) => {
        const actionBtn = event.target.closest('button');
        if (!actionBtn) return;
        const action = actionBtn.dataset.action;
        if (action === 'close') cleanup();
        if (action === 'save') saveCurrent();
    });

    closeBtn.addEventListener('click', cleanup);

    overlay.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            if (activeTextEditor) {
                closeTextEditor(false);
                return;
            }
            cleanup();
        }

        const isTextEditing = activeTextEditor && (event.target === activeTextEditor || activeTextEditor.contains(event.target));
        if (isTextEditing) return;

        if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'z' && !event.shiftKey) {
            event.preventDefault();
            const entry = imageEntries[_annotatorState.activeIndex];
            ensureEntryState(entry);
            applyHistory(entry.state, Math.max(0, entry.state.historyIndex - 1));
            render();
        }
        if ((event.metaKey || event.ctrlKey) && (event.key.toLowerCase() === 'y' || (event.key.toLowerCase() === 'z' && event.shiftKey))) {
            event.preventDefault();
            const entry = imageEntries[_annotatorState.activeIndex];
            ensureEntryState(entry);
            applyHistory(entry.state, Math.min(entry.state.history.length - 1, entry.state.historyIndex + 1));
            render();
        }
        if (event.key === 'ArrowLeft') {
            navButtons.find(btn => btn.dataset.action === 'prev')?.click();
        }
        if (event.key === 'ArrowRight') {
            navButtons.find(btn => btn.dataset.action === 'next')?.click();
        }
    });

    overlayCanvas.addEventListener('pointerdown', (event) => {
        const point = toImagePoint(event);
        if (!point) return;
        const entry = imageEntries[_annotatorState.activeIndex];
        ensureEntryState(entry);
        const color = getCurrentColor();
        const widthValue = _annotatorState.strokeWidth / renderState.scale;
        const rough = _annotatorState.roughEnabled;
        const roughness = _annotatorState.roughness;
        const opacity = _annotatorState.opacity;
        const toolOpacity = _annotatorState.currentTool === 'highlight'
            ? Math.min(opacity, 0.25)
            : opacity;

        if (['arrow', 'line', 'curve'].includes(_annotatorState.currentTool)) {
            draft = {
                type: _annotatorState.currentTool,
                start: { ...point },
                end: { ...point },
                color,
                width: widthValue,
                rough,
                roughness,
                opacity,
                curve: _annotatorState.currentTool === 'curve' ? _annotatorState.curveAmount : 0,
                seed: createSeed()
            };
            isDrawing = true;
        }
        if (['rect', 'ellipse', 'highlight'].includes(_annotatorState.currentTool)) {
            draft = {
                type: _annotatorState.currentTool,
                x: point.x,
                y: point.y,
                width: 0,
                height: 0,
                color,
                widthValue,
                rough,
                roughness,
                opacity: toolOpacity,
                fill: _annotatorState.currentTool === 'highlight' ? true : _annotatorState.fillEnabled,
                stroke: _annotatorState.currentTool !== 'highlight',
                seed: createSeed()
            };
            isDrawing = true;
        }
        if (_annotatorState.currentTool === 'crop') {
            cropDraft = { x: point.x, y: point.y, width: 0, height: 0 };
            isDrawing = true;
        }
        if (_annotatorState.currentTool === 'text') {
            openInlineTextEditor(point);
        }
    });

    overlayCanvas.addEventListener('pointermove', (event) => {
        if (!isDrawing) return;
        const point = toImagePoint(event);
        if (!point) return;
        if (['arrow', 'line', 'curve'].includes(_annotatorState.currentTool) && draft) {
            draft.end = { ...point };
            render();
        }
        if (['rect', 'ellipse', 'highlight'].includes(_annotatorState.currentTool) && draft) {
            const x = Math.min(draft.x, point.x);
            const y = Math.min(draft.y, point.y);
            const width = Math.abs(point.x - draft.x);
            const height = Math.abs(point.y - draft.y);
            draft = { ...draft, x, y, width, height };
            render();
        }
        if (_annotatorState.currentTool === 'crop' && cropDraft) {
            const x = Math.min(cropDraft.x, point.x);
            const y = Math.min(cropDraft.y, point.y);
            const width = Math.abs(point.x - cropDraft.x);
            const height = Math.abs(point.y - cropDraft.y);
            cropDraft = { x, y, width, height };
            render();
        }
    });

    const endDrawing = () => {
        if (!isDrawing) return;
        isDrawing = false;
        if (_annotatorState.currentTool === 'crop') {
            finalizeCrop();
        } else {
            finalizeDraft();
        }
    };

    overlayCanvas.addEventListener('pointerup', endDrawing);
    overlayCanvas.addEventListener('pointerleave', endDrawing);

    window.addEventListener('resize', resizeCanvas);

    const entry = imageEntries[_annotatorState.activeIndex];
    ensureEntryState(entry);
    updateNavControls();
    setActiveTool('arrow');
    setActiveColor('accent');
    _annotatorState.opacity = 0.9;
    _annotatorState.fillEnabled = false;
    _annotatorState.roughEnabled = true;
    _annotatorState.roughness = 1.6;
    if (colorInput) colorInput.value = getCurrentColor();
    if (hexInput) hexInput.value = getCurrentColor();
    if (opacityInput) opacityInput.value = String(Math.round(_annotatorState.opacity * 100));
    if (fillToggle) fillToggle.checked = _annotatorState.fillEnabled;
    if (roughToggle) roughToggle.checked = _annotatorState.roughEnabled;
    if (roughnessInput) roughnessInput.value = String(_annotatorState.roughness);
    if (roughnessInput) roughnessInput.style.display = _annotatorState.roughEnabled ? '' : 'none';
    if (fontInput) fontInput.value = _annotatorState.textFont || 'Inter';
    if (textWeightSelect) textWeightSelect.value = String(_annotatorState.textWeight || 600);
    if (shadowToggle) shadowToggle.checked = _annotatorState.textShadow;
    loadGoogleFontsList();
    loadImage(entry.url);
    overlay.tabIndex = -1;
    overlay.focus();
}

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
gap: 4px;
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

function ensureSidebarNavFitsViewport(navList) {
    if (!navList) return;
    const sidebar = navList.closest('.sidebar');
    if (!sidebar) return;

    navList.style.removeProperty('max-height');
    navList.style.removeProperty('overflow-y');
    navList.style.removeProperty('overscroll-behavior');

    requestAnimationFrame(() => {
        const overflow = sidebar.scrollHeight - sidebar.clientHeight;
        if (overflow <= 0) return;

        const currentHeight = navList.getBoundingClientRect().height;
        const maxHeight = Math.max(140, Math.floor(currentHeight - overflow - 12));
        navList.style.maxHeight = `${maxHeight}px`;
        navList.style.overflowY = 'auto';
        navList.style.overscrollBehavior = 'contain';
    });
}

function addSidebarItems() {
    const navList = document.querySelector('.sidebar__nav-list');
    if (!navList) return;

    const currentPath = window.location.pathname;
    const templateItem = navList.querySelector('.sidebar__nav-item');
    if (!templateItem) return;

    const createItemFromTemplate = (href, label, svgPath, className) => {
        const isActive = currentPath === href || currentPath.startsWith(href + '/');
        const li = templateItem.cloneNode(true);
        li.className = `sidebar__nav-item ${className}`;

        const link = li.querySelector('a.sidebar__nav-link');
        const labelEl = li.querySelector('.sidebar__nav-label');
        const icon = li.querySelector('.sidebar__nav-icon');

        if (!link || !labelEl || !icon) return null;

        link.href = href;
        if (isActive) {
            link.classList.add('sidebar__nav-link--active');
            link.setAttribute('aria-current', 'page');
        } else {
            link.classList.remove('sidebar__nav-link--active');
            link.removeAttribute('aria-current');
        }

        labelEl.textContent = label;
        icon.setAttribute('viewBox', '0 0 24 24');
        icon.setAttribute('fill', 'currentColor');
        icon.innerHTML = svgPath;

        return li;
    };

    if (!navList.querySelector('a.sidebar__nav-link[href="/my/achievements"]')) {
        const achievementsItem = createItemFromTemplate(
            '/my/achievements',
            'Achievements',
            '<path d="M19 5h-2V3H7v2H5c-1.1 0-2 .9-2 2v1c0 2.55 1.92 4.63 4.39 4.94.63 1.5 1.98 2.63 3.61 2.96V19H7v2h10v-2h-4v-3.1c1.63-.33 2.98-1.46 3.61-2.96C19.08 12.63 21 10.55 21 8V7c0-1.1-.9-2-2-2zM5 8V7h2v3.82c-1.16-.41-2-1.51-2-2.82zm14 0c0 1.31-.84 2.41-2 2.82V7h2v1z"></path>',
            'flavortown-sidebar-achievements'
        );
        if (achievementsItem) navList.appendChild(achievementsItem);
    }

    if (!navList.querySelector('a.sidebar__nav-link[href="/leaderboard"]')) {
        const leaderboardItem = createItemFromTemplate(
            '/leaderboard',
            'Leaderboard',
            '<path d="M7.5 21H2V9h5.5v12zm7.25-18h-5.5v18h5.5V3zM22 11h-5.5v10H22V11z"></path>',
            'flavortown-sidebar-leaderboard'
        );
        if (leaderboardItem) navList.appendChild(leaderboardItem);
    }

    ensureSidebarNavFitsViewport(navList);

    if (!navList.dataset.flavortownSidebarResizeBound) {
        navList.dataset.flavortownSidebarResizeBound = 'true';
        window.addEventListener('resize', () => ensureSidebarNavFitsViewport(navList));
    }
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
    if (document.querySelector('.flavortown-admin-enhanced')) {
        if (window.location.pathname === '/admin') {
            enhanceAdminDashboard();
        }

        if (window.location.pathname.match(/\/admin\/users\/\d+/)) {
            enhanceAdminUserPage();
        }

        if (window.location.pathname === '/admin/reports') {
            enhanceAdminReportsPage();
        }

        if (window.location.pathname === '/admin/shop_orders') {
            enhanceAdminShopOrdersPage();
        }

        return;
    }
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

    if (window.location.pathname === '/admin/reports') {
        enhanceAdminReportsPage();
    }

    if (window.location.pathname === '/admin/shop_orders') {
        enhanceAdminShopOrdersPage();
    }
}

function enhanceAdminReportsPage() {
    document.body.classList.add('flavortown-admin-reports-page');

    const reportsStats = document.querySelector('.reports-stats');
    if (reportsStats) {
        reportsStats.classList.add('flavortown-reports-stats');
        reportsStats.querySelectorAll('.reports-stat-card').forEach(card => {
            card.classList.add('flavortown-reports-stat-card');
        });
    }

    const reportsTable = Array.from(document.querySelectorAll('.table-data')).find(table => {
        const headers = Array.from(table.querySelectorAll('thead th')).map(th => th.textContent.trim().toLowerCase());
        return headers.includes('report') && headers.includes('project') && headers.includes('reporter');
    });
    if (!reportsTable || reportsTable.dataset.flavortownGrouped === 'true') return;

    const tbody = reportsTable.querySelector('tbody');
    if (!tbody) return;

    const rows = Array.from(tbody.querySelectorAll('tr')).filter(row => row.querySelector('td'));
    if (!rows.length) return;

    const projectGroups = new Map();
    rows.forEach((row, index) => {
        const projectLink = row.querySelector('td:nth-child(2) a');
        const projectName = projectLink?.textContent?.trim() || 'Unknown Project';
        const projectHref = projectLink?.getAttribute('href') || '';
        const groupKey = `${projectHref}::${projectName.toLowerCase()}`;

        row.classList.add('flavortown-report-row');

        if (!projectGroups.has(groupKey)) {
            projectGroups.set(groupKey, {
                projectName,
                projectHref,
                rows: [],
                firstIndex: index,
            });
        }

        projectGroups.get(groupKey).rows.push(row);
    });

    const groupedProjects = Array.from(projectGroups.values())
        .sort((a, b) => {
            if (b.rows.length !== a.rows.length) return b.rows.length - a.rows.length;
            if (a.firstIndex !== b.firstIndex) return a.firstIndex - b.firstIndex;
            return a.projectName.localeCompare(b.projectName);
        });

    tbody.innerHTML = '';

    groupedProjects.forEach((group, index) => {
        if (group.rows.length <= 1) {
            group.rows.forEach(row => tbody.appendChild(row));
            return;
        }

        const groupRow = document.createElement('tr');
        groupRow.className = 'flavortown-report-group-row';

        const groupCell = document.createElement('td');
        groupCell.className = 'flavortown-report-group-cell';
        groupCell.colSpan = 8;

        const groupWrap = document.createElement('div');
        groupWrap.className = 'flavortown-report-group';

        const rankBadge = document.createElement('span');
        rankBadge.className = 'flavortown-report-group-rank';
        rankBadge.textContent = `#${index + 1}`;

        const titleEl = group.projectHref ? document.createElement('a') : document.createElement('span');
        titleEl.className = 'flavortown-report-group-title';
        if (group.projectHref) {
            titleEl.setAttribute('href', group.projectHref);
        }
        titleEl.textContent = group.projectName;

        const countBadge = document.createElement('span');
        countBadge.className = 'flavortown-report-group-count';
        countBadge.textContent = `${group.rows.length} report${group.rows.length === 1 ? '' : 's'}`;

        groupWrap.append(rankBadge, titleEl, countBadge);
        groupCell.appendChild(groupWrap);
        groupRow.appendChild(groupCell);
        tbody.appendChild(groupRow);

        group.rows.forEach(row => tbody.appendChild(row));
    });

    reportsTable.classList.add('flavortown-reports-table');
    reportsTable.dataset.flavortownGrouped = 'true';
}

const SHOP_ORDER_ON_HOLD_ACTOR_CACHE_TTL = 10 * 60 * 1000;
const shopOrderOnHoldActorCache = new Map();

function getShopOrderIdFromRow(row) {
    const inspectHref = row.querySelector('td:last-child a[href*="/admin/shop_orders/"]')?.getAttribute('href') || '';
    const inspectMatch = inspectHref.match(/\/admin\/shop_orders\/(\d+)/);
    if (inspectMatch) return inspectMatch[1];

    const idText = row.querySelector('td:first-child')?.textContent || '';
    const idMatch = idText.match(/#?(\d+)/);
    return idMatch ? idMatch[1] : null;
}

function getShopOrderStatusText(row) {
    return (row.querySelector('td:nth-child(6)')?.textContent || '')
        .trim()
        .replace(/\s+/g, ' ')
        .toLowerCase();
}

function shouldGroupShopOrdersByOnHoldActor(rows) {
    const params = new URLSearchParams(window.location.search);
    const statusParam = (params.get('status') || params.get('return_status') || '').toLowerCase();
    if (statusParam.includes('on_hold') || statusParam.includes('on hold')) return true;

    const statuses = rows.map(getShopOrderStatusText).filter(Boolean);
    return statuses.length > 0 && statuses.every(status => status.includes('on hold'));
}

function readCachedOnHoldActor(orderId) {
    if (!orderId) return null;
    const cached = shopOrderOnHoldActorCache.get(orderId);
    if (!cached) return null;
    if (Date.now() - cached.cachedAt > SHOP_ORDER_ON_HOLD_ACTOR_CACHE_TTL) {
        shopOrderOnHoldActorCache.delete(orderId);
        return null;
    }
    return cached.actor || null;
}

function writeCachedOnHoldActor(orderId, actor) {
    if (!orderId || !actor) return;
    shopOrderOnHoldActorCache.set(orderId, {
        actor,
        cachedAt: Date.now()
    });
}

function extractAuditActorName(userCell) {
    if (!userCell) return null;

    const systemBadge = userCell.querySelector('.audit-logs__system-badge');
    if (systemBadge) {
        const text = systemBadge.textContent.trim();
        if (text) return text;
    }

    const userName = userCell.querySelector('.audit-logs__user span');
    if (userName) {
        const text = userName.textContent.trim();
        if (text) return text;
    }

    const fallback = userCell.textContent.trim().replace(/\s+/g, ' ');
    return fallback || null;
}

function extractOnHoldActorFromOrderDoc(doc) {
    if (!doc) return null;

    const auditTable = Array.from(doc.querySelectorAll('.table-data')).find(table => {
        const headers = Array.from(table.querySelectorAll('thead th')).map(th => th.textContent.trim().toLowerCase());
        return headers.includes('timestamp') && headers.includes('user') && headers.includes('action') && headers.includes('changes');
    });

    if (!auditTable) return null;

    const auditRows = Array.from(auditTable.querySelectorAll('tbody tr')).filter(row => row.querySelector('td'));
    let actor = null;

    auditRows.forEach(row => {
        const actionText = row.querySelector('td:nth-child(3)')?.textContent?.trim().toLowerCase() || '';
        const changesText = row.querySelector('td:nth-child(4)')?.textContent?.trim().toLowerCase() || '';
        const isOnHold = actionText.includes('on hold') || changesText.includes('on_hold') || changesText.includes(' on hold');
        if (!isOnHold) return;

        const parsedActor = extractAuditActorName(row.querySelector('td:nth-child(2)'));
        if (parsedActor) actor = parsedActor;
    });

    return actor;
}

async function fetchOnHoldActorForOrder(orderId) {
    if (!orderId) return null;

    const cachedActor = readCachedOnHoldActor(orderId);
    if (cachedActor) return cachedActor;

    try {
        const response = await fetch(`/admin/shop_orders/${orderId}`, { credentials: 'same-origin' });
        if (!response.ok) return null;

        const html = await response.text();
        const doc = new DOMParser().parseFromString(html, 'text/html');
        const actor = extractOnHoldActorFromOrderDoc(doc);
        if (actor) writeCachedOnHoldActor(orderId, actor);
        return actor;
    } catch (e) {
        return null;
    }
}

async function getOnHoldActorsByOrderId(rows) {
    const orderIds = Array.from(new Set(rows
        .map(getShopOrderIdFromRow)
        .filter(Boolean)));

    const actorMap = new Map();
    if (!orderIds.length) return actorMap;

    const concurrency = Math.min(4, orderIds.length);
    let nextIndex = 0;

    const workers = Array.from({ length: concurrency }, async () => {
        while (nextIndex < orderIds.length) {
            const index = nextIndex;
            nextIndex += 1;
            const orderId = orderIds[index];
            const actor = await fetchOnHoldActorForOrder(orderId);
            if (actor) actorMap.set(orderId, actor);
        }
    });

    await Promise.all(workers);
    return actorMap;
}

async function enhanceAdminShopOrdersPage(attempt = 0) {
    document.body.classList.add('flavortown-admin-shop-orders-page');

    const shopOrdersTable = Array.from(document.querySelectorAll('.table-data')).find(table => {
        const headers = Array.from(table.querySelectorAll('thead th')).map(th => th.textContent.trim().toLowerCase());
        return headers.includes('id')
            && headers.includes('user')
            && headers.includes('item')
            && headers.includes('tickets')
            && headers.includes('status');
    });

    if (!shopOrdersTable) {
        if (attempt < 5) {
            setTimeout(() => {
                enhanceAdminShopOrdersPage(attempt + 1);
            }, 250);
        }
        return;
    }

    if (shopOrdersTable.dataset.flavortownUserGrouped === 'true' || shopOrdersTable.dataset.flavortownUserGrouped === 'processing') {
        return;
    }

    const tbody = shopOrdersTable.querySelector('tbody');
    if (!tbody) return;

    const rows = Array.from(tbody.querySelectorAll('tr')).filter(row => row.querySelector('td'));
    if (!rows.length) {
        if (attempt < 5) {
            setTimeout(() => {
                enhanceAdminShopOrdersPage(attempt + 1);
            }, 250);
        }
        return;
    }

    shopOrdersTable.dataset.flavortownUserGrouped = 'processing';

    try {
        const totalColumns = Math.max(1, shopOrdersTable.querySelectorAll('thead th').length || 8);
        const isOnHoldView = shouldGroupShopOrdersByOnHoldActor(rows);
        const onHoldActorMap = isOnHoldView ? await getOnHoldActorsByOrderId(rows) : new Map();
        const userGroups = new Map();
        const formatCookies = (value) => {
            if (!Number.isFinite(value)) return '0';
            const rounded = Math.round(value * 10) / 10;
            return Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(1);
        };

        rows.forEach((row, index) => {
            row.classList.add('flavortown-shop-order-row');

            const userCell = row.querySelector('td:nth-child(2)');
            const userLink = userCell?.querySelector('a[href*="/admin/users/"]');
            const userName = userLink?.textContent?.trim() || 'Unknown user';
            const userHref = userLink?.getAttribute('href') || '';
            const userEmail = userCell?.querySelector('small')?.textContent?.trim() || '';

            let groupKey = '';
            let title = '';
            let subtitle = '';
            let href = '';

            if (isOnHoldView) {
                const orderId = getShopOrderIdFromRow(row);
                const holdActor = (orderId && onHoldActorMap.get(orderId)) || 'Unknown';
                groupKey = `on-hold::${holdActor.toLowerCase()}`;
                title = holdActor;
                subtitle = 'set on hold by';
            } else {
                const groupKeyBase = `${userName.toLowerCase()}::${userEmail.toLowerCase()}`;
                groupKey = userHref || groupKeyBase;
                title = userName;
                subtitle = userEmail;
                href = userHref;
            }

            if (!userGroups.has(groupKey)) {
                userGroups.set(groupKey, {
                    title,
                    subtitle,
                    href,
                    rows: [],
                    firstIndex: index,
                    totalCookies: 0
                });
            }

            const ticketsText = row.querySelector('td:nth-child(5)')?.textContent?.trim() || '';
            const ticketsValue = parseNumberFromText(ticketsText) || 0;

            const group = userGroups.get(groupKey);
            group.rows.push(row);
            group.totalCookies += ticketsValue;
        });

        const groupedUsers = Array.from(userGroups.values())
            .sort((a, b) => {
                if (b.rows.length !== a.rows.length) return b.rows.length - a.rows.length;
                return a.firstIndex - b.firstIndex;
            });

        tbody.innerHTML = '';
        let groupedRank = 0;

        const multiOrderGroups = groupedUsers.filter(group => group.rows.length > 1);
        const singleOrderGroups = groupedUsers.filter(group => group.rows.length <= 1);

        const appendGroupHeader = (group, rowClass = 'flavortown-shop-orders-group-row', rankText = null) => {
            const groupRow = document.createElement('tr');
            groupRow.className = rowClass;

            const groupCell = document.createElement('td');
            groupCell.className = 'flavortown-shop-orders-group-cell';
            groupCell.colSpan = totalColumns;

            const groupWrap = document.createElement('div');
            groupWrap.className = 'flavortown-shop-orders-group';

            if (rankText) {
                const rankBadge = document.createElement('span');
                rankBadge.className = 'flavortown-shop-orders-group-rank';
                rankBadge.textContent = rankText;
                groupWrap.appendChild(rankBadge);
            }

            const titleWrap = document.createElement('div');
            titleWrap.className = 'flavortown-shop-orders-group-user';

            const titleEl = group.href ? document.createElement('a') : document.createElement('span');
            titleEl.className = 'flavortown-shop-orders-group-title';
            if (group.href) {
                titleEl.setAttribute('href', group.href);
            }
            titleEl.textContent = group.title;
            titleWrap.appendChild(titleEl);

            if (group.subtitle) {
                const subtitleEl = document.createElement('span');
                subtitleEl.className = 'flavortown-shop-orders-group-email';
                subtitleEl.textContent = group.subtitle;
                titleWrap.appendChild(subtitleEl);
            }

            groupWrap.appendChild(titleWrap);

            if (Number.isFinite(group.totalCookies)) {
                const cookiesBadge = document.createElement('span');
                cookiesBadge.className = 'flavortown-shop-orders-group-cookies';
                cookiesBadge.textContent = `Total 🍪 ${formatCookies(group.totalCookies)}`;
                groupWrap.appendChild(cookiesBadge);
            }

            groupCell.appendChild(groupWrap);
            groupRow.appendChild(groupCell);
            tbody.appendChild(groupRow);
        };

        multiOrderGroups.forEach(group => {
            groupedRank += 1;
            appendGroupHeader(group, 'flavortown-shop-orders-group-row', `#${groupedRank}`);
            group.rows.forEach(row => tbody.appendChild(row));
        });

        if (isOnHoldView && singleOrderGroups.length > 0) {
            appendGroupHeader(
                {
                    title: 'Others:',
                    subtitle: 'single-order on-hold cases',
                    href: '',
                    totalCookies: singleOrderGroups.reduce((sum, group) => sum + (group.totalCookies || 0), 0)
                },
                'flavortown-shop-orders-group-row flavortown-shop-orders-others-row'
            );
            singleOrderGroups.forEach(group => {
                group.rows.forEach(row => tbody.appendChild(row));
            });
        } else {
            singleOrderGroups.forEach(group => {
                group.rows.forEach(row => tbody.appendChild(row));
            });
        }

        shopOrdersTable.classList.add('flavortown-shop-orders-table');
        shopOrdersTable.dataset.flavortownUserGrouped = 'true';
    } catch (e) {
        shopOrdersTable.dataset.flavortownUserGrouped = '';
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

    const ledgerHistoryCard = Array.from(document.querySelectorAll('.card')).find(card => {
        const heading = card.querySelector('h3, h2');
        return heading && heading.textContent.toLowerCase().includes('ledger history');
    });

    const showAndTellRegex = /\bshow\s*(?:and|&)\s*tell\b/i;
    const showAndTellSourceRegex = /show[_\s]*and[_\s]*tell/i;
    let showAndTellCredits = 0;
    if (ledgerHistoryCard) {
        const rows = ledgerHistoryCard.querySelectorAll('tbody tr');
        rows.forEach(row => {
            const cells = row.querySelectorAll('td');
            if (cells.length < 6) return;

            const amountText = cells[2].textContent || '';
            const amountNumberMatch = amountText.match(/(\d[\d,]*)/);
            if (!amountNumberMatch) return;

            const parsedAmount = parseInt(amountNumberMatch[1].replace(/,/g, ''), 10);
            if (!Number.isFinite(parsedAmount) || parsedAmount <= 0 || amountText.includes('-')) return;

            const reasonText = (cells[3].textContent || '').trim();
            const sourceText = `${(cells[4].textContent || '').trim()} ${(cells[5].textContent || '').trim()}`.trim();
            const isShowAndTell = showAndTellRegex.test(reasonText) || showAndTellSourceRegex.test(sourceText);
            if (isShowAndTell) {
                showAndTellCredits += parsedAmount;
            }
        });
    }

    const deductableBalance = Math.max(0, currentBalance - showAndTellCredits);

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
                <span>Show &amp; Tell Credits:</span>
                <span class="font-mono">-${showAndTellCredits}</span>
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
        { id: 'activity-heatmap', label: 'View Activity Heatmap', category: 'Actions', action: 'activityHeatmap' },
        { id: 'settings', label: 'Open Settings', category: 'Actions', action: 'openSettings' },
        { id: 'api-docs', label: 'API Documentation', category: 'Actions', url: '/api/v1/docs', external: true },
        { id: 'setting-votes', label: 'Toggle: Send Votes to Slack', category: 'Settings', action: 'toggleSetting', settingId: 'send_votes_to_slack' },
        { id: 'setting-leaderboard', label: 'Toggle: Leaderboard Opt-in', category: 'Settings', action: 'toggleSetting', settingId: 'leaderboard_optin' },
        { id: 'setting-balance', label: 'Toggle: Balance Notifications', category: 'Settings', action: 'toggleSetting', settingId: 'slack_balance_notifications' },
        { id: 'setting-effects', label: 'Toggle: Special Effects', category: 'Settings', action: 'toggleSetting', settingId: 'special_effects_enabled' },
        { id: 'set-github-key', label: 'Set GitHub API Key', category: 'Settings', action: 'setGithubApiKey' },
        { id: 'clear-github-key', label: 'Clear GitHub API Key', category: 'Settings', action: 'clearGithubApiKey' },
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
        } else if (cmd.action === 'activityHeatmap') {
            if (window.location.pathname !== '/kitchen') {
                window.location.href = '/kitchen';
            } else {
                const heatmapSection = document.querySelector('.flavortown-heatmap-section');
                if (heatmapSection) {
                    heatmapSection.scrollIntoView({ behavior: 'smooth' });
                }
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
        } else if (cmd.action === 'setGithubApiKey') {
            const currentKey = getGithubApiKey();
            const key = prompt('Enter your GitHub Personal Access Token:\n\nThis will be used for the changelog to avoid rate limits.\nCreate one at: https://github.com/settings/tokens\n\nRequired scopes: repo (full)', currentKey || '');
            if (key !== null) {
                setGithubApiKey(key.trim());
                const toast = document.createElement('div');
                toast.style.cssText = 'position:fixed;bottom:20px;right:20px;background:#4ade80;color:#15803d;padding:12px 20px;border-radius:8px;font-weight:600;z-index:999999;animation:fadeOut 2s forwards';
                toast.textContent = key.trim() ? 'GitHub API key saved!' : 'GitHub API key cleared';
                document.body.appendChild(toast);
                setTimeout(() => toast.remove(), 2000);
            }
        } else if (cmd.action === 'clearGithubApiKey') {
            setGithubApiKey('');
            const toast = document.createElement('div');
            toast.style.cssText = 'position:fixed;bottom:20px;right:20px;background:#4ade80;color:#15803d;padding:12px 20px;border-radius:8px;font-weight:600;z-index:999999;animation:fadeOut 2s forwards';
            toast.textContent = 'GitHub API key cleared';
            document.body.appendChild(toast);
            setTimeout(() => toast.remove(), 2000);
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
        if (matchesCommandPaletteShortcut(e)) {
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
const TODO_JSON_URL = 'https://flavortown-todo-bot.hridayahoney.workers.dev/todos.json';
const TODO_CACHE_KEY = 'flavortown_todos_cache';
const TODO_CACHE_TTL = 60 * 1000;
const PROJECT_TODO_KEY_PREFIX = 'flavortown_project_todos_v1:';
const TODO_STATUS_ORDER = ['todo', 'in_progress', 'done'];
const TODO_STATUS_LABELS = {
    todo: 'Todo',
    in_progress: 'In progress',
    done: 'Done'
};
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
const EMOJI_USAGE_KEY = 'flavortown_emoji_usage';
const EMOJI_USAGE_LIMIT = 300;
const EMOJI_FREQUENT_LIMIT = 8;

function readEmojiUsage() {
    try {
        const raw = localStorage.getItem(EMOJI_USAGE_KEY);
        if (!raw) return {};
        const parsed = JSON.parse(raw);
        return parsed && typeof parsed === 'object' ? parsed : {};
    } catch (e) {
        return {};
    }
}

function writeEmojiUsage(data) {
    try {
        localStorage.setItem(EMOJI_USAGE_KEY, JSON.stringify(data || {}));
    } catch (e) {
    }
}

function getEmojiUsageScore(entry, now) {
    if (!entry) return 0;
    const count = Math.max(0, entry.count || 0);
    const lastUsed = entry.lastUsed || 0;
    const daysAgo = Math.max(0, (now - lastUsed) / (24 * 60 * 60 * 1000));
    const recencyBoost = Math.max(0, 30 - daysAgo);
    return count * 10 + recencyBoost;
}

function getFrequentEmojiNames(limit = EMOJI_FREQUENT_LIMIT, usage = null, now = null, query = '') {
    if (!slackEmojiIndex.length) return [];
    const usageMap = usage || readEmojiUsage();
    const nowTime = now || Date.now();
    const names = Object.keys(usageMap).filter(name => slackEmojiMap && slackEmojiMap[name]);
    const filtered = query
        ? names.filter(name => name.includes(query))
        : names;
    return filtered
        .sort((a, b) => {
            const diff = getEmojiUsageScore(usageMap[b], nowTime) - getEmojiUsageScore(usageMap[a], nowTime);
            return diff || a.localeCompare(b);
        })
        .slice(0, limit);
}

function recordEmojiUsage(name, increment = 1) {
    if (!name) return;
    const usage = readEmojiUsage();
    const entry = usage[name] || { count: 0, lastUsed: 0 };
    entry.count = Math.max(0, entry.count || 0) + Math.max(1, increment || 1);
    entry.lastUsed = Date.now();
    usage[name] = entry;

    const keys = Object.keys(usage);
    if (keys.length > EMOJI_USAGE_LIMIT) {
        const now = Date.now();
        const trimmed = keys
            .sort((a, b) => getEmojiUsageScore(usage[b], now) - getEmojiUsageScore(usage[a], now))
            .slice(0, EMOJI_USAGE_LIMIT)
            .reduce((acc, key) => {
                acc[key] = usage[key];
                return acc;
            }, {});
        writeEmojiUsage(trimmed);
        return;
    }

    writeEmojiUsage(usage);
}

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
    const colonIndex = before.lastIndexOf(':');
    if (colonIndex < 0) return null;
    const query = before.slice(colonIndex + 1);
    if (!/^[a-z0-9_+\-]{0,40}$/i.test(query)) return null;
    if (!query.length) {
        const prevChar = colonIndex > 0 ? before[colonIndex - 1] : '';
        if (prevChar && /[a-z0-9]/i.test(prevChar)) return null;
    }
    return {
        start: colonIndex,
        end: cursor,
        query: query.toLowerCase(),
    };
}

function getEmojiMatches(query) {
    if (!slackEmojiIndex.length) return [];
    const maxResults = 10;
    const usage = readEmojiUsage();
    const now = Date.now();
    const scoreForName = (name) => getEmojiUsageScore(usage[name], now);
    const compareNames = (a, b) => {
        const diff = scoreForName(b) - scoreForName(a);
        return diff || a.localeCompare(b);
    };

    if (query === '') {
        return getFrequentEmojiNames(maxResults, usage, now, '')
            .slice(0, maxResults);
    }
    const startsWith = [];
    const includes = [];

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

    startsWith.sort(compareNames);
    includes.sort(compareNames);

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
    let suppressUsageTracking = false;
    let emojiUsageSnapshot = {};

    const buildEmojiTokenCounts = (text) => {
        if (!text) return {};
        const counts = {};
        const tokens = text.match(/:([a-z0-9_+\-]{1,40}):/gi) || [];
        tokens.forEach(token => {
            const name = token.slice(1, -1).toLowerCase();
            if (slackEmojiMap && slackEmojiMap[name]) {
                counts[name] = (counts[name] || 0) + 1;
            }
        });
        return counts;
    };

    const trackEmojiUsageFromText = () => {
        if (!slackEmojiMap || !Object.keys(slackEmojiMap).length) return;
        const currentCounts = buildEmojiTokenCounts(textarea.value || '');
        Object.keys(currentCounts).forEach(name => {
            const prev = emojiUsageSnapshot[name] || 0;
            const diff = currentCounts[name] - prev;
            if (diff > 0) {
                recordEmojiUsage(name, diff);
            }
        });
        emojiUsageSnapshot = currentCounts;
    };

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

        if (activeQuery && activeQuery.query === '') {
            const header = document.createElement('div');
            header.className = 'flavortown-emoji-suggest__section';
            header.textContent = 'Frequently used';
            list.appendChild(header);
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
        recordEmojiUsage(name, 1);
        suppressUsageTracking = true;
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
        if (!queryInfo) {
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

    textarea.addEventListener('input', () => {
        if (suppressUsageTracking) {
            suppressUsageTracking = false;
            emojiUsageSnapshot = buildEmojiTokenCounts(textarea.value || '');
        } else {
            trackEmojiUsageFromText();
        }
        updateSuggestions();
    });
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
        trackEmojiUsageFromText();
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

function enhanceShipEmojiInput() {
    const textarea = document.querySelector('#ship_update')
        || document.querySelector('textarea[name="ship_update"]');
    if (!textarea) return;
    initSlackEmojiAutocomplete(textarea, textarea.closest('.input') || textarea.parentElement);
    const form = textarea.closest('form');
    if (form) {
        attachSlackEmojiSubmitHandler(form, textarea);
    }
}

function ensureShipFastStyles() {
    if (document.getElementById('flavortown-ship-fast-style')) return;
    const style = document.createElement('style');
    style.id = 'flavortown-ship-fast-style';
    style.textContent = `
        .flavortown-ship-fast {
            margin-top: 12px;
            display: flex;
            flex-direction: column;
            gap: 12px;
        }
        .flavortown-ship-fast__toolbar {
            display: flex;
            gap: 8px;
            flex-wrap: wrap;
        }
        .flavortown-ship-fast__loading {
            opacity: 0.8;
            font-size: 0.95rem;
        }
        .flavortown-ship-fast__status-chip {
            align-self: flex-start;
            display: inline-flex;
            align-items: center;
            gap: 6px;
            padding: 6px 10px;
            border-radius: 999px;
            font-size: 0.85rem;
            border: 1px solid color-mix(in oklab, var(--color-green-500, #22c55e) 35%, transparent 65%);
            background: color-mix(in oklab, var(--color-green-500, #22c55e) 10%, transparent 90%);
            color: var(--color-green-700, #166534);
        }
        .flavortown-ship-fast__section {
            border: 1px solid var(--color-border, #d9cab4);
            border-radius: 12px;
            background: linear-gradient(180deg, var(--color-cream-dark, #fff8ee) 0%, var(--color-surface, #fff) 100%);
            overflow: hidden;
            box-shadow: 0 1px 0 rgba(0, 0, 0, 0.04);
        }
        .flavortown-ship-fast__section > .projects-ship__step {
            margin: 0;
            border: 0;
            border-radius: 0;
            box-shadow: none;
            background: transparent;
        }
        .flavortown-ship-fast__toolbar .btn {
            border-radius: 999px;
            padding-left: 12px;
            padding-right: 12px;
        }
        .flavortown-ship-fast__accordion > summary {
            cursor: pointer;
            list-style: none;
            padding: 12px 14px;
            font-weight: 600;
            display: flex;
            align-items: center;
            gap: 8px;
            user-select: none;
            border-bottom: 1px solid transparent;
            color: var(--color-brown-dark, #5a342f);
            background:
                linear-gradient(180deg,
                    color-mix(in oklab, var(--color-cream, #fff6ea) 74%, var(--color-orange-300, #fdba74) 26%) 0%,
                    color-mix(in oklab, var(--color-cream-dark, #fff8ee) 80%, var(--color-brown-light, #8a6d47) 20%) 100%);
            box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.35);
            transition: background 0.16s ease, border-color 0.16s ease, box-shadow 0.16s ease;
        }
        .flavortown-ship-fast__accordion > summary:hover {
            background:
                linear-gradient(180deg,
                    color-mix(in oklab, var(--color-cream, #fff6ea) 65%, var(--color-orange-300, #fdba74) 35%) 0%,
                    color-mix(in oklab, var(--color-cream-dark, #fff8ee) 72%, var(--color-brown-light, #8a6d47) 28%) 100%);
            border-bottom-color: color-mix(in oklab, var(--color-border, #d9cab4) 75%, var(--color-orange-400, #fb923c) 25%);
        }
        .flavortown-ship-fast__accordion[open] > summary {
            border-bottom-color: color-mix(in oklab, var(--color-border, #d9cab4) 65%, var(--color-orange-400, #fb923c) 35%);
            box-shadow: inset 0 -1px 0 rgba(168, 85, 44, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.4);
        }
        .flavortown-ship-fast__accordion > summary::-webkit-details-marker {
            display: none;
        }
        .flavortown-ship-fast__accordion-chevron {
            display: inline-block;
            transform: rotate(0deg);
            transition: transform 0.16s ease;
        }
        .flavortown-ship-fast__accordion[open] .flavortown-ship-fast__accordion-chevron {
            transform: rotate(90deg);
        }
        .flavortown-ship-fast__accordion-body {
            padding: 12px;
        }
        .flavortown-ship-fast__ship-action {
            display: flex;
            justify-content: flex-end;
            margin-top: 12px;
        }
        .flavortown-ship-fast__checklist {
            display: grid;
            gap: 8px;
            grid-template-columns: repeat(2, minmax(0, 1fr));
        }
        .flavortown-ship-fast__checklist-item {
            display: flex;
            align-items: flex-start;
            gap: 8px;
            padding: 9px 10px;
            border-radius: 10px;
            background: color-mix(in oklab, var(--color-surface, #fff) 86%, var(--color-cream, #fff6ea) 14%);
            border: 1px solid color-mix(in oklab, var(--color-border, #d9cab4) 82%, transparent 18%);
            line-height: 1.25;
            font-size: 0.95rem;
        }
        .flavortown-ship-fast__checklist-item--failed {
            border-color: color-mix(in oklab, var(--color-red-500, #ef4444) 45%, transparent 55%);
            background: color-mix(in oklab, var(--color-red-500, #ef4444) 9%, var(--color-surface, #fff) 91%);
        }
        .flavortown-ship-fast__checklist-icon {
            flex: 0 0 auto;
            width: 18px;
            height: 18px;
            border-radius: 999px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            font-size: 0.75rem;
            font-weight: 700;
        }
        .flavortown-ship-fast__checklist-item--passed .flavortown-ship-fast__checklist-icon {
            background: color-mix(in oklab, var(--color-green-500, #22c55e) 22%, transparent 78%);
            color: var(--color-green-700, #166534);
        }
        .flavortown-ship-fast__checklist-item--failed .flavortown-ship-fast__checklist-icon {
            background: color-mix(in oklab, var(--color-red-500, #ef4444) 22%, transparent 78%);
            color: var(--color-red-700, #991b1b);
        }
        .flavortown-ship-fast__devlogs {
            display: flex;
            flex-direction: column;
            gap: 10px;
        }
        .flavortown-ship-fast__devlogs-summary {
            display: flex;
            gap: 8px;
            flex-wrap: wrap;
        }
        .flavortown-ship-fast__devlogs-pill {
            display: inline-flex;
            align-items: center;
            padding: 5px 10px;
            border-radius: 999px;
            font-size: 0.85rem;
            border: 1px solid var(--color-border, #d9cab4);
            background: color-mix(in oklab, var(--color-cream, #fff6ea) 78%, var(--color-surface, #fff) 22%);
        }
        .flavortown-ship-fast__devlog-list {
            display: grid;
            gap: 8px;
        }
        .flavortown-ship-fast__devlog-card {
            border: 1px solid var(--color-border, #d9cab4);
            border-radius: 10px;
            padding: 10px;
            background: color-mix(in oklab, var(--color-surface, #fff) 88%, var(--color-cream, #fff6ea) 12%);
        }
        .flavortown-ship-fast__devlog-top {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 8px;
            margin-bottom: 4px;
        }
        .flavortown-ship-fast__devlog-time {
            font-size: 0.82rem;
            opacity: 0.8;
        }
        .flavortown-ship-fast__devlog-duration {
            font-size: 0.8rem;
            border-radius: 999px;
            padding: 3px 8px;
            border: 1px solid var(--color-border, #d9cab4);
            background: color-mix(in oklab, var(--color-blue-400, #60a5fa) 10%, transparent 90%);
        }
        .flavortown-ship-fast__devlog-title {
            font-weight: 600;
            line-height: 1.25;
            margin-bottom: 4px;
        }
        .flavortown-ship-fast__devlog-excerpt {
            font-size: 0.9rem;
            opacity: 0.9;
            line-height: 1.3;
        }
        .flavortown-ship-fast__devlog-attachments {
            margin-top: 10px;
            display: grid;
            gap: 8px;
        }
        .flavortown-ship-fast__devlog-attachment-hero {
            width: 100%;
            height: 180px;
            border-radius: 10px;
            border: 1px solid var(--color-border, #d9cab4);
            background: color-mix(in oklab, var(--color-cream, #fff6ea) 65%, var(--color-surface, #fff) 35%);
            overflow: hidden;
            position: relative;
            display: block;
            text-decoration: none;
            color: inherit;
        }
        .flavortown-ship-fast__devlog-attachment-hero img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            display: block;
        }
        .flavortown-ship-fast__devlog-attachment-row {
            display: flex;
            gap: 6px;
            flex-wrap: wrap;
        }
        .flavortown-ship-fast__devlog-attachment-pill {
            position: absolute;
            right: 8px;
            bottom: 8px;
            font-size: 0.68rem;
            line-height: 1;
            padding: 4px 7px;
            border-radius: 999px;
            color: #fff;
            background: rgba(0, 0, 0, 0.66);
            letter-spacing: 0.02em;
        }
        .flavortown-ship-fast__devlog-attachment {
            width: 56px;
            height: 56px;
            border-radius: 8px;
            border: 1px solid var(--color-border, #d9cab4);
            background: color-mix(in oklab, var(--color-cream, #fff6ea) 68%, var(--color-surface, #fff) 32%);
            overflow: hidden;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            position: relative;
            text-decoration: none;
            color: inherit;
            font-size: 0.72rem;
            font-weight: 600;
        }
        .flavortown-ship-fast__devlog-attachment img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            display: block;
        }
        .flavortown-ship-fast__devlog-attachment--video::after {
            content: 'VIDEO';
            position: absolute;
            right: 4px;
            bottom: 4px;
            font-size: 0.6rem;
            line-height: 1;
            padding: 2px 4px;
            border-radius: 999px;
            color: #fff;
            background: rgba(0, 0, 0, 0.66);
        }
        .flavortown-ship-fast__devlog-attachment--more {
            font-size: 0.78rem;
            background: color-mix(in oklab, var(--color-blue-400, #60a5fa) 14%, var(--color-surface, #fff) 86%);
        }
        .flavortown-ship-fast__blocked-note {
            margin-top: 8px;
            padding: 10px 12px;
            border-radius: 10px;
            border: 1px dashed color-mix(in oklab, var(--color-red-500, #ef4444) 35%, transparent 65%);
            background: color-mix(in oklab, var(--color-red-500, #ef4444) 8%, transparent 92%);
            font-size: 0.92rem;
        }
        @media (max-width: 900px) {
            .flavortown-ship-fast__checklist {
                grid-template-columns: 1fr;
            }
            .flavortown-ship-fast__devlog-attachment-hero {
                height: 150px;
            }
        }
    `;
    document.head.appendChild(style);
}

function buildShipAccordion(title, bodyNode, open = false) {
    const section = document.createElement('details');
    section.className = 'flavortown-ship-fast__section flavortown-ship-fast__accordion';
    section.open = !!open;

    const summary = document.createElement('summary');
    summary.innerHTML = `<span class="flavortown-ship-fast__accordion-chevron">▶</span><span>${title}</span>`;

    const body = document.createElement('div');
    body.className = 'flavortown-ship-fast__accordion-body';
    body.appendChild(bodyNode);

    section.appendChild(summary);
    section.appendChild(body);
    return section;
}

async function fetchShipStepDoc(projectId, step) {
    const url = `/projects/${projectId}/ships/new?step=${step}`;
    const response = await fetch(url, { credentials: 'include' });
    if (!response.ok) {
        throw new Error(`Failed ship step ${step}: ${response.status}`);
    }
    const html = await response.text();
    return new DOMParser().parseFromString(html, 'text/html');
}

function extractShipStepNode(doc) {
    const step = doc.querySelector('.projects-ship__content .projects-ship__step');
    return step ? step.cloneNode(true) : null;
}

function extractShipStepNav(doc) {
    const nav = doc.querySelector('.projects-ship__content .projects-ship__navigation');
    return nav ? nav.cloneNode(true) : null;
}

function buildCompactChecklist(stepNode) {
    if (!stepNode) return null;

    const desc = stepNode.querySelector('.projects-ship__section-desc')?.textContent?.trim() || '';
    const validations = Array.from(stepNode.querySelectorAll('.projects-ship__validation'));

    if (!validations.length) return null;

    const wrap = document.createElement('div');
    wrap.className = 'projects-ship__step';

    if (desc) {
        const paragraph = document.createElement('p');
        paragraph.className = 'projects-ship__section-desc';
        paragraph.textContent = desc;
        wrap.appendChild(paragraph);
    }

    const grid = document.createElement('div');
    grid.className = 'flavortown-ship-fast__checklist';

    let totalCount = 0;
    let failedCount = 0;

    validations.forEach(validation => {
        const passed = validation.classList.contains('projects-ship__validation--passed');
        const label = validation.querySelector('.projects-ship__validation-label')?.textContent?.trim();
        if (!label) return;

        totalCount += 1;
        if (passed) return;
        failedCount += 1;

        const item = document.createElement('div');
        item.className = 'flavortown-ship-fast__checklist-item flavortown-ship-fast__checklist-item--failed';
        item.innerHTML = `
            <span class="flavortown-ship-fast__checklist-icon">!</span>
            <span>${label}</span>
        `;
        grid.appendChild(item);
    });

    if (!failedCount) {
        return { node: null, failedCount: 0, totalCount };
    }

    wrap.appendChild(grid);
    return { node: wrap, failedCount, totalCount };
}

function textFromFirst(root, selectors) {
    if (!root) return '';
    for (const selector of selectors) {
        const el = root.querySelector(selector);
        const text = el?.textContent?.trim();
        if (text) return text;
    }
    return '';
}

function collapseWhitespace(text) {
    return (text || '').replace(/\s+/g, ' ').trim();
}

function buildCompactDevlogs(stepNode) {
    if (!stepNode) return null;

    const desc = stepNode.querySelector('.projects-ship__section-desc')?.textContent?.trim() || '';
    const reviewRoot = stepNode.querySelector('.projects-ship__section-content, .projects-ship__section-body, .projects-ship__body') || stepNode;
    const candidates = Array.from(reviewRoot.querySelectorAll('article.post--devlog, article.post, .post--devlog, .projects-ship__devlog, .projects-ship__review-item, li'));

    const seen = new Set();
    const entries = [];

    for (const node of candidates) {
        const title = textFromFirst(node, ['.post__title', 'h3', 'h4', '.projects-ship__devlog-title', 'strong']);
        const linkEl = node.querySelector('a[href*="/devlogs/"], a[href*="/posts/"]');
        const link = linkEl?.getAttribute('href') || '';
        const time = textFromFirst(node, ['.post__time', 'time', '.projects-ship__devlog-time']);
        const duration = textFromFirst(node, ['.post__duration', '.duration', '.projects-ship__devlog-duration']);
        const bodyText = textFromFirst(node, ['.post__body', '.projects-ship__devlog-body', 'p']);
        const excerpt = collapseWhitespace(bodyText).slice(0, 240);
        const attachments = [];
        node.querySelectorAll('.post__slide').forEach(slide => {
            const img = slide.querySelector('img');
            const video = slide.querySelector('video');
            if (img?.src) {
                attachments.push({ type: 'image', src: img.src, alt: img.alt || 'Devlog attachment' });
            } else if (video?.src) {
                attachments.push({ type: 'video', src: video.src, poster: video.poster || '' });
            }
        });

        if (!title && !excerpt) continue;

        const key = `${link}::${title}::${time}`;
        if (seen.has(key)) continue;
        seen.add(key);

        entries.push({ title, link, time, duration, excerpt, attachments });
        if (entries.length >= 8) break;
    }

    if (!entries.length) return null;

    let totalMinutes = 0;
    entries.forEach(item => {
        totalMinutes += parseDurationToMinutes(item.duration);
    });

    const wrap = document.createElement('div');
    wrap.className = 'projects-ship__step flavortown-ship-fast__devlogs';

    const heading = document.createElement('h2');
    heading.className = 'projects-ship__section-title';
    heading.textContent = 'Devlogs since last ship';
    wrap.appendChild(heading);

    if (desc) {
        const paragraph = document.createElement('p');
        paragraph.className = 'projects-ship__section-desc';
        paragraph.textContent = desc;
        wrap.appendChild(paragraph);
    }

    const summary = document.createElement('div');
    summary.className = 'flavortown-ship-fast__devlogs-summary';
    summary.innerHTML = `
        <span class="flavortown-ship-fast__devlogs-pill">${entries.length} devlog${entries.length === 1 ? '' : 's'}</span>
        ${totalMinutes > 0 ? `<span class="flavortown-ship-fast__devlogs-pill">${formatMinutesCompact(totalMinutes)} logged</span>` : ''}
    `;
    wrap.appendChild(summary);

    const list = document.createElement('div');
    list.className = 'flavortown-ship-fast__devlog-list';

    entries.forEach(entry => {
        const card = document.createElement('article');
        card.className = 'flavortown-ship-fast__devlog-card';

        const titleHtml = entry.link
            ? `<a href="${escapeHtml(entry.link)}">${escapeHtml(entry.title || 'Open devlog')}</a>`
            : escapeHtml(entry.title || 'Devlog');

        card.innerHTML = `
            <div class="flavortown-ship-fast__devlog-top">
                <span class="flavortown-ship-fast__devlog-time">${escapeHtml(entry.time || 'Recent')}</span>
                ${entry.duration ? `<span class="flavortown-ship-fast__devlog-duration">${escapeHtml(entry.duration)}</span>` : ''}
            </div>
            <div class="flavortown-ship-fast__devlog-title">${titleHtml}</div>
            ${entry.excerpt ? `<div class="flavortown-ship-fast__devlog-excerpt">${escapeHtml(entry.excerpt)}</div>` : ''}
        `;

        if (entry.attachments?.length) {
            const attachmentsWrap = document.createElement('div');
            attachmentsWrap.className = 'flavortown-ship-fast__devlog-attachments';

            const primary = entry.attachments[0];
            const hero = document.createElement('a');
            hero.className = `flavortown-ship-fast__devlog-attachment-hero ${primary.type === 'video' ? 'flavortown-ship-fast__devlog-attachment--video' : ''}`;
            hero.href = primary.src;
            hero.target = '_blank';
            hero.rel = 'noopener noreferrer';

            if (primary.type === 'image') {
                hero.innerHTML = `<img src="${escapeHtml(primary.src)}" alt="${escapeHtml(primary.alt || 'Attachment')}" loading="lazy">`;
            } else if (primary.poster) {
                hero.innerHTML = `<img src="${escapeHtml(primary.poster)}" alt="Video attachment" loading="lazy">`;
            } else {
                hero.textContent = 'Video attachment';
            }
            if (primary.type === 'video') {
                const tag = document.createElement('span');
                tag.className = 'flavortown-ship-fast__devlog-attachment-pill';
                tag.textContent = 'VIDEO';
                hero.appendChild(tag);
            }
            attachmentsWrap.appendChild(hero);

            const row = document.createElement('div');
            row.className = 'flavortown-ship-fast__devlog-attachment-row';

            const secondary = entry.attachments.slice(1, 4);
            secondary.forEach(attachment => {
                const item = document.createElement('a');
                item.className = `flavortown-ship-fast__devlog-attachment ${attachment.type === 'video' ? 'flavortown-ship-fast__devlog-attachment--video' : ''}`;
                item.href = attachment.src;
                item.target = '_blank';
                item.rel = 'noopener noreferrer';

                if (attachment.type === 'image') {
                    item.innerHTML = `<img src="${escapeHtml(attachment.src)}" alt="${escapeHtml(attachment.alt || 'Attachment')}" loading="lazy">`;
                } else if (attachment.poster) {
                    item.innerHTML = `<img src="${escapeHtml(attachment.poster)}" alt="Video attachment" loading="lazy">`;
                } else {
                    item.textContent = 'Video';
                }

                row.appendChild(item);
            });

            if (entry.attachments.length > 4) {
                const more = document.createElement('span');
                more.className = 'flavortown-ship-fast__devlog-attachment flavortown-ship-fast__devlog-attachment--more';
                more.textContent = `+${entry.attachments.length - 4}`;
                row.appendChild(more);
            }

            if (secondary.length || entry.attachments.length > 4) {
                attachmentsWrap.appendChild(row);
            }

            card.appendChild(attachmentsWrap);
        }

        list.appendChild(card);
    });

    wrap.appendChild(list);
    return wrap;
}

async function initShipFastFlow() {
    const match = window.location.pathname.match(/^\/projects\/(\d+)\/ships\/new$/);
    if (!match) return;

    const content = document.querySelector('.projects-ship__content');
    if (!content) return;
    if (content.dataset.flavortownShipFastLoading === 'true') return;

    const existingFast = content.querySelector('.flavortown-ship-fast');
    if (existingFast) {
        if (content.dataset.flavortownShipFast === 'true') return;
        existingFast.remove();
    }

    content.dataset.flavortownShipFastLoading = 'true';

    const projectId = match[1];
    ensureShipFastStyles();

    const heading = content.querySelector('.projects-ship__title');
    if (!heading) return;

    const fast = document.createElement('div');
    fast.className = 'flavortown-ship-fast';
    heading.insertAdjacentElement('afterend', fast);

    try {
        let step1Node = content.querySelector('.projects-ship__step')?.cloneNode(true) || null;
        if (!step1Node) {
            const step1Doc = await fetchShipStepDoc(projectId, 1);
            step1Node = extractShipStepNode(step1Doc);
        }
        if (!step1Node) {
            fast.remove();
            return;
        }

        const checklist = buildCompactChecklist(step1Node);
        const hasChecklistIssues = !!checklist?.failedCount;

        const nodes = [];

        if (checklist?.totalCount) {
            const statusChip = document.createElement('div');
            statusChip.className = 'flavortown-ship-fast__status-chip';
            statusChip.textContent = hasChecklistIssues
                ? `${checklist.failedCount} checklist item${checklist.failedCount === 1 ? '' : 's'} left`
                : 'Checklist clear. Ready to ship.';
            nodes.push(statusChip);
        }

        if (hasChecklistIssues && checklist?.node) {
            const checklistSection = document.createElement('section');
            checklistSection.className = 'flavortown-ship-fast__section';
            checklistSection.id = 'flavortownShipChecklist';
            checklistSection.appendChild(checklist.node);

            const blockedNote = document.createElement('div');
            blockedNote.className = 'flavortown-ship-fast__blocked-note';
            blockedNote.textContent = 'Finish the checklist first. Ship message, details, and devlog review unlock after all checks pass.';
            checklistSection.appendChild(blockedNote);

            nodes.push(checklistSection);
        }

        if (hasChecklistIssues) {
            content.querySelectorAll('.projects-ship__step, .projects-ship__navigation').forEach(el => {
                if (el.closest('.flavortown-ship-fast')) return;
                el.remove();
            });

            fast.replaceChildren(...nodes);
            content.dataset.flavortownShipFast = 'true';
            return;
        }

        const docs = await Promise.all([
            fetchShipStepDoc(projectId, 2),
            fetchShipStepDoc(projectId, 3),
            fetchShipStepDoc(projectId, 4),
        ]);

        const step2Node = extractShipStepNode(docs[0]);
        const step3Node = extractShipStepNode(docs[1]);
        const step4Node = extractShipStepNode(docs[2]);
        const step4Nav = extractShipStepNav(docs[2]);

        if (!step4Node) {
            fast.remove();
            return;
        }

        if (step2Node) {
            const detailsForm = step2Node.querySelector('#ship-details-form');
            if (detailsForm) {
                const detailsAction = document.createElement('div');
                detailsAction.className = 'flavortown-ship-fast__ship-action';
                detailsAction.innerHTML = '<button type="submit" form="ship-details-form" class="btn btn--blue btn--borderless">Save details</button>';
                step2Node.appendChild(detailsAction);
            }
            nodes.push(buildShipAccordion('Project details (optional)', step2Node, false));
        }
        if (step3Node) {
            const compactDevlogs = buildCompactDevlogs(step3Node);
            nodes.push(buildShipAccordion('Devlogs since last ship', compactDevlogs || step3Node, false));
        }

        const shipMessageSection = document.createElement('section');
        shipMessageSection.className = 'flavortown-ship-fast__section';
        shipMessageSection.id = 'flavortownShipMessage';
        shipMessageSection.appendChild(step4Node);

        if (step4Nav) {
            const shipBtn = step4Nav.querySelector('button[form="ship-form"]');
            if (shipBtn) {
                const shipAction = document.createElement('div');
                shipAction.className = 'flavortown-ship-fast__ship-action';
                shipAction.appendChild(shipBtn.cloneNode(true));
                shipMessageSection.appendChild(shipAction);
            }
        }

        nodes.push(shipMessageSection);

        content.querySelectorAll('.projects-ship__step, .projects-ship__navigation').forEach(el => {
            if (el.closest('.flavortown-ship-fast')) return;
            el.remove();
        });

        fast.replaceChildren(...nodes);
        content.dataset.flavortownShipFast = 'true';

        enhanceShipEmojiInput();
    } catch (e) {
        console.error('Failed to init ship fast flow:', e);
        fast.innerHTML = `
            <div class="flavortown-ship-fast__loading">
                Could not build single-page ship flow. You can still use the normal steps.
            </div>
        `;
    } finally {
        delete content.dataset.flavortownShipFastLoading;
    }
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

function normalizeBalanceReason(reason) {
    if (!reason) return '';
    return String(reason).trim().replace(/\s+/g, ' ').toLowerCase();
}

function getPairingLabelFromReason(reason) {
    const normalizedReason = normalizeBalanceReason(reason);
    if (!normalizedReason) {
        return { normalizedReason: '', exactLabel: null, isDomainSpend: false, isGenericDomainRefund: false };
    }

    const rejectedOrderRefundMatch = normalizedReason.match(/^refund for rejected order of\s+(.+)$/i);
    if (rejectedOrderRefundMatch?.[1]) {
        return {
            normalizedReason,
            exactLabel: rejectedOrderRefundMatch[1].trim(),
            isDomainSpend: false,
            isGenericDomainRefund: false,
        };
    }

    const domainGrantRefundMatch = normalizedReason.match(/^refund of domain grant(?:\s+(?:for|of)\s+(.+))?$/i);
    if (domainGrantRefundMatch) {
        const grantLabel = domainGrantRefundMatch[1]?.trim();
        return {
            normalizedReason,
            exactLabel: grantLabel || null,
            isDomainSpend: false,
            isGenericDomainRefund: !grantLabel,
        };
    }

    const shopOrderMatch = normalizedReason.match(/^shop order of\s+(.+)$/i);
    if (shopOrderMatch?.[1]) {
        const label = shopOrderMatch[1].trim();
        return {
            normalizedReason,
            exactLabel: label,
            isDomainSpend: /\bdomain\b/i.test(label),
            isGenericDomainRefund: false,
        };
    }

    const domainGrantSpendMatch = normalizedReason.match(/^domain grant(?:\s+(?:for|of)\s+(.+))?$/i);
    if (domainGrantSpendMatch) {
        const grantLabel = domainGrantSpendMatch[1]?.trim();
        return {
            normalizedReason,
            exactLabel: grantLabel || null,
            isDomainSpend: true,
            isGenericDomainRefund: false,
        };
    }

    return { normalizedReason, exactLabel: null, isDomainSpend: false, isGenericDomainRefund: false };
}

function getRejectedOrderRefundPairKey(reason, amount) {
    if (!Number.isFinite(amount) || amount <= 0) return null;
    const { exactLabel } = getPairingLabelFromReason(reason);
    if (!exactLabel) return null;
    return `${amount}::${exactLabel}`;
}

function getRejectedOrderSpendPairKey(reason, amount) {
    if (!Number.isFinite(amount) || amount >= 0) return null;
    const { exactLabel } = getPairingLabelFromReason(reason);
    if (!exactLabel) return null;
    return `${Math.abs(amount)}::${exactLabel}`;
}

function calculateSpendAndEarnTotals(entries, amountKey = 'amount') {
    if (!Array.isArray(entries) || entries.length === 0) {
        return { totalEarned: 0, totalSpent: 0 };
    }

    const refundCounts = new Map();
    const spendCounts = new Map();
    const domainSpendByAmount = new Map();
    const genericDomainRefundByAmount = new Map();
    const spendKeyMeta = new Map();
    let totalEarned = 0;
    let totalSpent = 0;

    entries.forEach(entry => {
        if (!entry || typeof entry !== 'object') return;
        const amount = Number(entry[amountKey]);
        if (!Number.isFinite(amount) || amount === 0) return;

        if (amount > 0) {
            totalEarned += amount;
            const refundKey = getRejectedOrderRefundPairKey(entry.reason, amount);
            if (refundKey) {
                refundCounts.set(refundKey, (refundCounts.get(refundKey) || 0) + 1);
            }
            const { isGenericDomainRefund } = getPairingLabelFromReason(entry.reason);
            if (isGenericDomainRefund) {
                genericDomainRefundByAmount.set(amount, (genericDomainRefundByAmount.get(amount) || 0) + 1);
            }
            return;
        }

        totalSpent += Math.abs(amount);
        const spendKey = getRejectedOrderSpendPairKey(entry.reason, amount);
        if (spendKey) {
            spendCounts.set(spendKey, (spendCounts.get(spendKey) || 0) + 1);
            const { isDomainSpend } = getPairingLabelFromReason(entry.reason);
            spendKeyMeta.set(spendKey, { isDomainSpend, amount: Math.abs(amount) });
        }

        const { isDomainSpend } = getPairingLabelFromReason(entry.reason);
        if (isDomainSpend) {
            const absAmount = Math.abs(amount);
            domainSpendByAmount.set(absAmount, (domainSpendByAmount.get(absAmount) || 0) + 1);
        }
    });

    let pairedAmount = 0;
    refundCounts.forEach((refundCount, pairKey) => {
        const spendCount = spendCounts.get(pairKey) || 0;
        if (spendCount === 0) return;

        const splitIndex = pairKey.indexOf('::');
        const amountValue = Number(pairKey.slice(0, splitIndex));
        if (!Number.isFinite(amountValue) || amountValue <= 0) return;

        const matchedCount = Math.min(refundCount, spendCount);
        pairedAmount += matchedCount * amountValue;

        spendCounts.set(pairKey, spendCount - matchedCount);

        const meta = spendKeyMeta.get(pairKey);
        if (meta?.isDomainSpend) {
            const remainingDomainSpend = domainSpendByAmount.get(meta.amount) || 0;
            domainSpendByAmount.set(meta.amount, Math.max(0, remainingDomainSpend - matchedCount));
        }
    });

    genericDomainRefundByAmount.forEach((refundCount, amountValue) => {
        const domainSpendCount = domainSpendByAmount.get(amountValue) || 0;
        if (domainSpendCount === 0) return;

        const matchedCount = Math.min(refundCount, domainSpendCount);
        pairedAmount += matchedCount * amountValue;
        domainSpendByAmount.set(amountValue, Math.max(0, domainSpendCount - matchedCount));
    });

    return {
        totalEarned: Math.max(0, totalEarned - pairedAmount),
        totalSpent: Math.max(0, totalSpent - pairedAmount),
    };
}

function getLeaderboardStats(entries) {
    const { totalEarned, totalSpent } = calculateSpendAndEarnTotals(entries, 'delta');
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

var SHIP_EMOJI_OBSERVER_KEY = 'flavortownShipEmojiObserver';
function watchShipEmojiInput() {
    if (document.body.dataset[SHIP_EMOJI_OBSERVER_KEY] === 'true') return;
    document.body.dataset[SHIP_EMOJI_OBSERVER_KEY] = 'true';

    const observer = new MutationObserver(() => {
        enhanceShipEmojiInput();
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

function parseReliableTimestampFromTimeElement(timeEl) {
    if (!timeEl) return NaN;

    const timeTag = timeEl.matches('time') ? timeEl : timeEl.querySelector('time');
    if (timeTag) {
        const datetime = (timeTag.getAttribute('datetime') || '').trim();
        if (datetime) {
            const hasTimezone = /(?:Z|[+-]\d{2}:?\d{2})$/i.test(datetime);
            if (hasTimezone) {
                const parsed = new Date(datetime);
                if (!isNaN(parsed.getTime())) return parsed.getTime();
            }
        }
    }

    const timestamp = timeEl.getAttribute('data-timestamp') || timeEl.dataset?.timestamp;
    if (timestamp) {
        const parsedTs = parseInt(timestamp, 10);
        if (!isNaN(parsedTs)) {
            return parsedTs < 1000000000000 ? parsedTs * 1000 : parsedTs;
        }
    }

    return NaN;
}

function getTimeElementTimestampForCutoff(timeEl, fallbackDate = null) {
    if (!timeEl) return fallbackDate instanceof Date ? fallbackDate.getTime() : NaN;

    const reliableTimestamp = parseReliableTimestampFromTimeElement(timeEl);
    if (Number.isFinite(reliableTimestamp)) return reliableTimestamp;

    if (fallbackDate instanceof Date && !isNaN(fallbackDate.getTime())) {
        return fallbackDate.getTime();
    }
    return NaN;
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
    const validVotes = votes
        .map(vote => {
            let time = null;
            if (vote.timestamp) {
                const parsed = new Date(vote.timestamp);
                if (!isNaN(parsed.getTime())) time = parsed.getTime();
            }
            if (!time && vote.slackTs) {
                const raw = Number(vote.slackTs);
                if (isFinite(raw)) {
                    time = raw < 1000000000000 ? raw * 1000 : raw;
                }
            }
            return { vote, time };
        })
        .filter(entry => entry.time && !isNaN(entry.time));

    if (!validShips.length || !validVotes.length) return clustered;

    const sortedShips = validShips.slice().sort((a, b) => a.date - b.date);
    const sortedVotes = validVotes.slice().sort((a, b) => a.time - b.time);

    const shipMin = sortedShips[0].date.getTime();
    const shipMax = sortedShips[sortedShips.length - 1].date.getTime();
    const voteMin = sortedVotes[0].time;
    const voteMax = sortedVotes[sortedVotes.length - 1].time;

    const shipRange = shipMax - shipMin;
    const voteRange = voteMax - voteMin;

    const gaps = [];
    for (let i = 1; i < sortedVotes.length; i++) {
        gaps.push({ index: i, gap: sortedVotes[i].time - sortedVotes[i - 1].time });
    }

    const gapValues = gaps.map(entry => entry.gap).sort((a, b) => a - b);
    const medianGap = gapValues.length
        ? gapValues[Math.floor((gapValues.length - 1) / 2)]
        : 0;
    const minGap = Math.max(medianGap * 3, 60 * 60 * 1000);
    const maxSplits = Math.max(0, Math.min(sortedShips.length - 1, gaps.length));
    const splitCandidates = gaps
        .filter(entry => entry.gap >= minGap)
        .sort((a, b) => b.gap - a.gap)
        .slice(0, maxSplits);
    const splitIndices = new Set(splitCandidates.map(entry => entry.index));

    const clusters = [];
    let currentCluster = {
        votes: [sortedVotes[0].vote],
        start: sortedVotes[0].time,
        end: sortedVotes[0].time
    };

    for (let i = 1; i < sortedVotes.length; i++) {
        if (splitIndices.has(i)) {
            clusters.push(currentCluster);
            currentCluster = {
                votes: [sortedVotes[i].vote],
                start: sortedVotes[i].time,
                end: sortedVotes[i].time
            };
        } else {
            currentCluster.votes.push(sortedVotes[i].vote);
            currentCluster.end = sortedVotes[i].time;
        }
    }
    clusters.push(currentCluster);

    const shipTimes = sortedShips.map(ship => ship.date.getTime());
    const clusterEntries = clusters.map((cluster, index) => {
        const clusterTime = cluster.start + (cluster.end - cluster.start) / 2;
        let mappedTime = clusterTime;
        if (voteRange > 0 && shipRange > 0) {
            const t = clampValue((clusterTime - voteMin) / voteRange, 0, 1);
            mappedTime = shipMin + t * shipRange;
        } else if (shipRange > 0 && clusters.length > 1) {
            const t = index / (clusters.length - 1);
            mappedTime = shipMin + t * shipRange;
        }
        return { cluster, mappedTime };
    });

    const clusterCount = clusterEntries.length;
    const shipCount = shipTimes.length;
    const dp = Array.from({ length: clusterCount }, () => Array(shipCount).fill(Infinity));
    const back = Array.from({ length: clusterCount }, () => Array(shipCount).fill(-1));

    for (let j = 0; j < shipCount; j++) {
        dp[0][j] = Math.abs(clusterEntries[0].mappedTime - shipTimes[j]);
    }

    for (let i = 1; i < clusterCount; i++) {
        let best = dp[i - 1][0];
        let bestIndex = 0;
        for (let j = 0; j < shipCount; j++) {
            if (dp[i - 1][j] < best) {
                best = dp[i - 1][j];
                bestIndex = j;
            }
            dp[i][j] = Math.abs(clusterEntries[i].mappedTime - shipTimes[j]) + best;
            back[i][j] = bestIndex;
        }
    }

    let bestEnd = 0;
    let bestCost = dp[clusterCount - 1][0];
    for (let j = 1; j < shipCount; j++) {
        if (dp[clusterCount - 1][j] < bestCost) {
            bestCost = dp[clusterCount - 1][j];
            bestEnd = j;
        }
    }

    const assignments = Array(clusterCount).fill(0);
    let cursor = bestEnd;
    for (let i = clusterCount - 1; i >= 0; i--) {
        assignments[i] = cursor;
        cursor = i > 0 ? back[i][cursor] : cursor;
    }

    clusterEntries.forEach((entry, index) => {
        const shipIndex = assignments[index];
        const targetShip = sortedShips[shipIndex] || sortedShips[0];
        entry.cluster.votes.forEach(vote => clustered.get(targetShip).push(vote));
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

function hasRenderableCommunityVoteFeedback(vote) {
    const feedback = (vote?.feedback || '').replace(/\s+/g, ' ').trim();
    if (!feedback) return false;

    const normalized = feedback.toLowerCase();
    if (normalized === 'no feedback provided' || normalized === 'no feedback') {
        return false;
    }

    return true;
}

function createVotesContainer(votes, usersMap) {
    const renderableVotes = votes.filter(hasRenderableCommunityVoteFeedback);
    if (!renderableVotes.length) return null;

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
        <span>Community Votes (${renderableVotes.length})</span>
    `;
    votesContainer.appendChild(header);

    const votesList = document.createElement('div');
    votesList.style.cssText = 'display: flex; flex-direction: column; gap: 8px;';

    let shownCount = 0;
    const renderNextBatch = () => {
        const nextVotes = renderableVotes.slice(shownCount, shownCount + 5);
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
        const remaining = renderableVotes.length - shownCount;
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
                const cutoffTimestamp = getTimeElementTimestampForCutoff(timeEl, date);
                ships.push({
                    element: post,
                    statsElement: shipStats,
                    date: date,
                    cutoffTimestamp,
                    relativeTime: relativeTime
                });
            }
        }
    });

    if (ships.length === 0) return;

    const eligibleShips = ships.filter(ship => {
        const shipTs = Number.isFinite(ship?.cutoffTimestamp)
            ? ship.cutoffTimestamp
            : (ship?.date ? ship.date.getTime() : NaN);
        return Number.isFinite(shipTs) && shipTs < COMMUNITY_VOTES_SHIP_CUTOFF_TS;
    });
    if (eligibleShips.length === 0) return;

    const clusteredVotes = clusterVotesToShips(projectVotes, eligibleShips);

    eligibleShips.forEach(ship => {
        const shipVotes = clusteredVotes.get(ship);
        if (!shipVotes || shipVotes.length === 0) return;

        const insertAfter = ship.statsElement || ship.element.querySelector('.post__body');
        if (!insertAfter) return;

        const votesContainer = createVotesContainer(shipVotes, votesData.users);
        if (!votesContainer) return;
        insertAfter.parentNode.insertBefore(votesContainer, insertAfter.nextSibling);
    });
}

async function addMultiShipEfficiencyGraph() {
    if (!/\/projects\/\d+$/.test(window.location.pathname)) return;

    if (shipGraphObserver) {
        shipGraphObserver.disconnect();
        shipGraphObserver = null;
    }

    const adminActions = document.querySelector('.projects-show__admin-actions');
    if (!adminActions) {
        shipGraphObserver = new MutationObserver(() => {
            if (document.querySelector('.projects-show__admin-actions')) {
                shipGraphObserver.disconnect();
                shipGraphObserver = null;
                addMultiShipEfficiencyGraph();
            }
        });
        shipGraphObserver.observe(document.body, { childList: true, subtree: true });
        return;
    }

    if (document.querySelector('.flavortown-ship-graph-btn')) {
        return;
    }

    const shipPosts = document.querySelectorAll('article.post--ship');

    if (shipPosts.length < 2) {
        shipGraphObserver = new MutationObserver(() => {
            const newShipPosts = document.querySelectorAll('article.post--ship');
            if (newShipPosts.length >= 2) {
                shipGraphObserver.disconnect();
                shipGraphObserver = null;
                addMultiShipEfficiencyGraph();
            }
        });
        shipGraphObserver.observe(document.body, { childList: true, subtree: true });
        return;
    }

    const allShipsHaveExtras = Array.from(shipPosts).every(post => {
        const footer = post.querySelector('.post__payout-footer');
        return footer && footer.dataset.flavortownExtras === 'true';
    });

    if (!allShipsHaveExtras) {
        shipGraphObserver = new MutationObserver(() => {
            const updatedShipPosts = document.querySelectorAll('article.post--ship');
            const allHaveExtras = Array.from(updatedShipPosts).every(post => {
                const footer = post.querySelector('.post__payout-footer');
                return footer && footer.dataset.flavortownExtras === 'true';
            });

            if (allHaveExtras) {
                shipGraphObserver.disconnect();
                shipGraphObserver = null;
                addMultiShipEfficiencyGraph();
            }
        });
        shipGraphObserver.observe(document.body, { childList: true, subtree: true });
        return;
    }

    const paidShips = [];

    shipPosts.forEach((post, index) => {
        const payoutFooter = post.querySelector('.post__payout-footer');
        if (!payoutFooter) {
            return;
        }
        
        const timeEl = post.querySelector('.post__time');
        if (!timeEl) {
            return;
        }
        
        const date = parseDateFromTimeElement(timeEl);
        if (!date) {
            return;
        }
        
        const hasExtras = payoutFooter.dataset.flavortownExtras === 'true';
        
        const payoutItems = payoutFooter.querySelectorAll('.post__payout-item');
        
        let hoursEl = null, cookiesEl = null, starsEl = null;
        
        payoutItems.forEach(item => {
            const label = item.querySelector('.post__payout-label');
            const value = item.querySelector('.post__payout-value');
            if (!label || !value) return;
            
            const labelText = label.textContent.trim().toLowerCase();
            if (labelText.includes('hours')) hoursEl = value;
            else if (labelText.includes('cookies')) cookiesEl = value;
            else if (labelText.includes('stars')) {
                starsEl = value;
            }
        });
        
        if (!hoursEl || !cookiesEl) {
            return;
        }
        
        const hoursText = hoursEl.textContent.trim();
        const cookiesText = cookiesEl.textContent.trim();

        const hoursMatch = hoursText.match(/([\d.]+)/);
        const cookiesMatch = cookiesText.match(/([\d,]+)/);
        const starsMatch = starsEl ? starsEl.textContent.match(/([\d.]+)/) : null;
        
        if (!hoursMatch || !cookiesMatch) {
            return;
        }
        
        const hours = parseFloat(hoursMatch[1]);
        const cookies = parseInt(cookiesMatch[1].replace(/,/g, ''), 10);
        const avgStars = starsMatch ? parseFloat(starsMatch[1]) : null;
  
        if (hours > 0 && cookies > 0) {
            paidShips.push({
                shipNumber: index + 1,
                date: date,
                hours: hours,
                cookies: cookies,
                efficiency: cookies / hours,
                avgStars: avgStars
            });
        }
    });
    
    if (paidShips.length < 2) {
        return;
    }

    paidShips.sort((a, b) => a.date - b.date);
    
    paidShips.forEach((ship, index) => {
        ship.shipNumber = index + 1;
    });
    
    const graphBtn = document.createElement('button');
    graphBtn.type = 'button';
    graphBtn.className = 'btn btn--brown btn--borderless projects-show__icon-btn flavortown-ship-graph-btn';
    graphBtn.setAttribute('aria-label', 'View ship efficiency graph');
    graphBtn.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="20" x2="18" y2="10"/>
            <line x1="12" y1="20" x2="12" y2="4"/>
            <line x1="6" y1="20" x2="6" y2="14"/>
        </svg>
    `;
    
    const editBtn = adminActions.querySelector('a[href*="/edit"]');
    if (editBtn) {
        editBtn.insertAdjacentElement('afterend', graphBtn);
    } else {
        adminActions.insertBefore(graphBtn, adminActions.firstChild);
    }
    
    graphBtn.addEventListener('click', () => {
        showShipEfficiencyModal(paidShips);
    });
}


function showShipEfficiencyModal(ships) {
    const predictedPoint = calculateLinearRegression(ships);
    
    const modal = document.createElement('div');
    modal.className = 'flavortown-leaderboard-modal';
    modal.style.zIndex = '10060';
    
    const styles = getComputedStyle(document.documentElement);
    const isDarkTheme = document.getElementById('flavortown-theme');
    
    const chartBgColor = styles.getPropertyValue('--color-surface')?.trim() || (isDarkTheme ? '#1e1e2e' : '#ffffff');
    const textColor = styles.getPropertyValue('--color-text-primary')?.trim() || (isDarkTheme ? '#cdd6f4' : '#333333');
    const gridColor = styles.getPropertyValue('--color-border')?.trim() || (isDarkTheme ? '#45475a' : '#e2d8cc');
    const efficiencyColor = styles.getPropertyValue('--color-brown')?.trim() || '#b08d57';
    const starsColor = styles.getPropertyValue('--color-blue')?.trim() || '#4a90a4';
    
    modal.innerHTML = `
        <div class="flavortown-leaderboard-modal__dialog" style="width: min(960px, 98vw); max-width: 960px;">
            <button type="button" class="flavortown-leaderboard-modal__close" aria-label="Close">×</button>
            <h3 style="margin-bottom: 20px; font-size: 1.4em;">Ship Efficiency Graph</h3>
            <div class="flavortown-graph-container" style="padding: 16px; background: ${chartBgColor}; border-radius: 12px; position: relative;">
                <canvas id="flavortown-ship-efficiency-graph" style="max-height: 400px; width: 100%;"></canvas>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    const closeBtn = modal.querySelector('.flavortown-leaderboard-modal__close');
    closeBtn.addEventListener('click', () => modal.remove());
    modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.remove();
    });
    
    requestAnimationFrame(() => {
        createChartJSGraph(ships, predictedPoint, isDarkTheme, textColor, gridColor, efficiencyColor, starsColor);
    });
}

function createChartJSGraph(ships, predictedPoint, isDarkTheme, textColor, gridColor, efficiencyColor, starsColor) {
    const ctx = document.getElementById('flavortown-ship-efficiency-graph').getContext('2d');
    
    const labels = ships.map(s => s.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
    labels.push(predictedPoint.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) + ' (Predicted)');
    
    const efficiencyData = ships.map(s => s.efficiency);
    efficiencyData.push(predictedPoint.efficiency);
    
    const starsData = ships.map(s => s.avgStars || null);
    starsData.push(predictedPoint.avgStars);
    
    const hexToRgba = (hex, alpha) => {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    };
    
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Efficiency (cookies/hour)',
                    data: efficiencyData,
                    borderColor: efficiencyColor,
                    backgroundColor: hexToRgba(efficiencyColor, 0.1),
                    borderWidth: 3,
                    pointRadius: 6,
                    pointBackgroundColor: efficiencyColor,
                    pointBorderColor: isDarkTheme ? '#1e1e2e' : '#ffffff',
                    pointBorderWidth: 2,
                    tension: 0.4,
                    yAxisID: 'y',
                    segment: {
                        borderDash: ctx => ctx.p1DataIndex === ships.length ? [6, 6] : undefined
                    }
                },
                {
                    label: 'Avg Stars',
                    data: starsData,
                    borderColor: starsColor,
                    backgroundColor: hexToRgba(starsColor, 0.1),
                    borderWidth: 3,
                    pointRadius: 6,
                    pointBackgroundColor: starsColor,
                    pointBorderColor: isDarkTheme ? '#1e1e2e' : '#ffffff',
                    pointBorderWidth: 2,
                    tension: 0.4,
                    yAxisID: 'y1',
                    spanGaps: false
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                mode: 'index',
                intersect: false
            },
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        color: textColor,
                        padding: 20,
                        usePointStyle: true,
                        pointStyle: 'circle'
                    }
                },
                tooltip: {
                    backgroundColor: isDarkTheme ? 'rgba(30, 30, 46, 0.95)' : 'rgba(255, 255, 255, 0.95)',
                    titleColor: isDarkTheme ? '#cdd6f4' : '#333',
                    bodyColor: isDarkTheme ? '#cdd6f4' : '#333',
                    borderColor: gridColor,
                    borderWidth: 1,
                    padding: 12,
                    cornerRadius: 8,
                    callbacks: {
                        title: function(context) {
                            const index = context[0].dataIndex;
                            if (index === ships.length) {
                                return 'Predicted Next Ship';
                            }
                            return 'Ship #' + ships[index].shipNumber;
                        },
                        afterTitle: function(context) {
                            const index = context[0].dataIndex;
                            if (index < ships.length) {
                                const ship = ships[index];
                                return `Hours: ${ship.hours.toFixed(2)} | Cookies: 🍪${ship.cookies}`;
                            }
                            return '';
                        }
                    }
                }
            },
            scales: {
                x: {
                    grid: {
                        color: gridColor,
                        drawBorder: false
                    },
                    ticks: {
                        color: textColor,
                        font: { size: 11 }
                    }
                },
                y: {
                    type: 'linear',
                    display: true,
                    position: 'left',
                    title: {
                        display: true,
                        text: 'Efficiency (cookies/hour)',
                        color: efficiencyColor,
                        font: { weight: 'bold' }
                    },
                    grid: {
                        color: gridColor,
                        drawBorder: false
                    },
                    ticks: {
                        color: efficiencyColor,
                        callback: function(value) {
                            return value.toFixed(1);
                        }
                    },
                    suggestedMin: Math.min(...efficiencyData) - 0.5,
                    suggestedMax: Math.max(...efficiencyData) + 0.5
                },
                y1: {
                    type: 'linear',
                    display: true,
                    position: 'right',
                    title: {
                        display: true,
                        text: 'Average Stars',
                        color: starsColor,
                        font: { weight: 'bold' }
                    },
                    grid: {
                        drawOnChartArea: false
                    },
                    ticks: {
                        color: starsColor,
                        callback: function(value) {
                            return value.toFixed(1);
                        }
                    },
                    min: Math.max(1, Math.min(...starsData.filter(v => v !== null)) - 0.5),
                    max: Math.min(6, Math.max(...starsData.filter(v => v !== null)) + 0.5)
                }
            }
        }
    });
}

function calculateLinearRegression(ships) {
    const n = ships.length;
    
    let sumX = 0, sumY = 0, sumXY = 0, sumXX = 0;
    
    ships.forEach((ship, index) => {
        const x = index;
        const y = ship.efficiency;
        sumX += x;
        sumY += y;
        sumXY += x * y;
        sumXX += x * x;
    });
    
    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;
    
    const nextIndex = n;
    const predictedEfficiency = slope * nextIndex + intercept;
    
    let sumXStars = 0, sumYStars = 0, sumXYStars = 0, sumXXStars = 0;
    let starsCount = 0;
    
    ships.forEach((ship, index) => {
        if (ship.avgStars !== null && ship.avgStars !== undefined) {
            const x = index;
            const y = ship.avgStars;
            sumXStars += x;
            sumYStars += y;
            sumXYStars += x * y;
            sumXXStars += x * x;
            starsCount++;
        }
    });
    
    let predictedStars = null;
    if (starsCount >= 2) {
        const starsSlope = (starsCount * sumXYStars - sumXStars * sumYStars) / (starsCount * sumXXStars - sumXStars * sumXStars);
        const starsIntercept = (sumYStars - starsSlope * sumXStars) / starsCount;
        predictedStars = Math.max(1, Math.min(6, starsSlope * nextIndex + starsIntercept));
    }
    
    const lastShip = ships[ships.length - 1];
    const nextDate = new Date(lastShip.date);
    nextDate.setDate(nextDate.getDate() + 7);
    
    return {
        shipNumber: n + 1,
        date: nextDate,
        efficiency: Math.max(0, predictedEfficiency),
        avgStars: predictedStars,
        isPredicted: true
    };
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
    makeVoteReasonMultiline();
    addProjectVotesDisplay();
    initSpeedReaderOnVotesPage();
    addSpeedReaderStyles();
}

document.addEventListener('turbo:load', () => {
    if (window.location.pathname.startsWith('/votes/new')) {
        initSpeedReaderOnVotesPage();
    }
});

const EXTENSION_VERSION = browserAPI.runtime.getManifest().version;

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
        afterNavTarget: '.projects-new__card, .flavortown-inline-devlog, .post-form, form[action*="devlogs"]',
        position: 'center',
        icon: '📝',
        interactive: 'navigate-project-devlog'
    },
    {
        id: 'changelog',
        title: 'Auto-generated changelogs',
        description: 'We can pull your git commits since your last devlog to help you write updates faster. Just click "Changelog" below the devlog form!',
        target: '.flavortown-changelog-card',
        position: 'center',
        icon: '📋',
        requiresElement: true,
        allowInteraction: true
    },
    {
        id: 'inline-devlog-emoji',
        title: 'Slack emojis in devlogs and comments',
        description: 'Try typing a Slack emoji like :yay: to see the autocomplete. You can also use them in comments! ',
        target: '.projects-new__card textarea, .flavortown-inline-devlog textarea, .post-form textarea, form[action*="devlogs"] textarea',
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
        id: 'annotate-screenshots',
        title: 'Screenshot annotation',
        description: 'Draw arrows, add text, highlight areas, and crop your screenshots right in the browser before uploading. Click Edit after uploading an attachment!',
        target: '.flavortown-annotate-btn',
        position: 'center',
        icon: '🛠️',
        requiresElement: true,
        allowInteraction: true
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
        id: 'shop-time-calc',
        title: 'Personalized pace',
        description: 'See how long it\'ll take to earn an item using your current earning pace.',
        afterNavDescription: 'The hours shown on each item are personalized based on your earning rate.',
        target: null,
        afterNavTarget: '.shop-item-card__hours',
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
    '3.6.0': [
        { title: 'Shop lottery stats', description: 'Lottery Ticket cards now show ticket odds', icon: '🎟️' },
        { title: 'Recently Added refresh', description: 'Recently Added is now an accordion with auto-scroll behavior and cleaner button placement.', icon: '🛍️' },
        { title: 'Vote scale reliability fixes', description: 'Post-Feb-23 vote scaling is now stricter and more accurate, including edge cases like invalidated votes after payout.', icon: '⭐' },
        { title: 'Project/ship stats consistency', description: 'Project rate math now prefers canonical payout data, so project cards and ship posts match more reliably.', icon: '📊' },
        { title: 'Theme and UI polish', description: 'More theme coverage and targeted visual cleanups across shop/admin surfaces.', icon: '🎨' }
    ],
    '3.3.0': [
        { title: 'Explore Users page', description: 'Browse Flavortown users from Explore with search by display name or Slack ID and quick user cards.', icon: '👥' },
        { title: 'Multiline vote feedback', description: 'Vote feedback on /votes/new now supports multiline input for clearer, richer feedback.', icon: '📝' },
        { title: 'New voting system support', description: 'Updated vote handling for the current Flavortown voting flow with improved estimate reliability.', icon: '⭐' },
        { title: 'Vote UI polish', description: 'Cleaner vote breakdown presentation and better theme consistency in voting surfaces.', icon: '🎨' },
        { title: 'Pinned projects', description: 'Pin your important projects so they stay easy to access on the projects board.', icon: '📌' },
        { title: 'Spicetown -> FT Utils migration', description: 'Migrate key Spicetown settings/data into Flavortown Utils from the popup.', icon: '🔁' },
        { title: 'General improvements', description: 'Bug fixes and quality-of-life polish across core extension flows.', icon: '✨' }
    ],
    '2.9.0': [
        { title: 'Project Todos', description: 'Add and manage todos directly on project pages. Use the Slack bot to create tasks from Slack!', icon: '✅' },
        { title: 'Frequently used emojis', description: 'Slack emojis you use most often appear first in autocomplete suggestions.', icon: '😀' },
        { title: 'Changelog customization', description: 'Customize how commits are displayed in the changelog generator with multiple format options.', icon: '📋' },
        { title: 'Firefox fixes', description: 'Various compatibility improvements and bug fixes for Firefox users.', icon: '🦊' },
        { title: 'Theming improvements', description: 'Better theme consistency across all UI elements and improved custom theme options.', icon: '🎨' },
        { title: 'Overall improvements', description: 'Bug fixes, and general polish throughout the extension.', icon: '✨' }
    ],
    '2.6.0': [
        { title: 'Activity Heatmap', description: 'GitHub-style visualization showing your devlog activity over time with streaks, best day, and project breakdowns.', icon: '🔥' },
        { title: 'Multi-ship efficiency graphs', description: 'Compare efficiency across multiple ships with visual graphs on project pages.', icon: '📊' },
        { title: 'Git branch scanning', description: 'Changelog now scans all branches to find commits, not just the default branch.', icon: '🌿' },
        { title: 'Markdown image support', description: 'Image tool inside the markdown toolbar', icon: '🖼️' },
        { title: 'Theme coverage', description: 'Better theme coverage for all UI elements across the site.', icon: '🎨' }
    ],
    '2.5.0': [
        { title: 'Screenshot annotation tool', description: 'Draw arrows, add text, highlight areas, and crop screenshots before uploading.', icon: '🛠️' },
        { title: 'Theme revamp', description: 'Complete overhaul of theme system with accent colors and better styling.', icon: '🎨' },
        { title: 'Git changelog generation', description: 'Auto-generate changelogs from your Git commits since last devlog.', icon: '📋' },
        { title: 'Estimated payout display', description: 'See estimated payout amounts directly on ship posts.', icon: '💰' },
        { title: 'Command modal key binding', description: 'Customize the keyboard shortcut for opening the command palette.', icon: '⌨️' },
        { title: 'Firefox support', description: 'Full compatibility with Firefox browser.', icon: '🦊' },
        { title: 'Repo linker improvements', description: 'Better link detection and project matching from GitHub repos.', icon: '🔗' },
        { title: 'Tutorial improvements', description: 'Enhanced onboarding with new feature highlights including changelog and screenshot tools.', icon: '💡' },
        { title: 'Improved changelog', description: 'Changelog now uses HTML URLs for better reliability and viewing.', icon: '📋' },
        { title: 'Theme gap fixes', description: 'Better theme coverage for all UI elements across the site.', icon: '🔧' }
    ],
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
            const hoursSelector = '.shop-item-card__hours';

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
                const hoursEl = document.querySelector(hoursSelector);
                if (!hoursEl) return;
                
                const card = hoursEl.closest('.shop-item-card');
                const scrollTarget = card || hoursEl;
                scrollTarget.scrollIntoView({ behavior: 'smooth', block: 'center' });

                setTimeout(() => {
                    if (this.steps[this.currentStep]?.id !== step.id) return;
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

        if (step.skip) {
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
        max-width: 800px;
        width: 90%;
        max-height: 85vh;
        overflow-y: auto;
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
        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; margin-bottom: 24px;">
            ${features.map(f => `
                <div style="
                    display: flex;
                    align-items: flex-start;
                    gap: 10px;
                    padding: 10px 12px;
                    background: var(--flavortown-tutorial-surface, #efe6d5);
                    border-radius: 10px;
                ">
                    <span style="font-size: 1.3em; flex-shrink: 0;">${f.icon}</span>
                    <div style="min-width: 0;">
                        <div style="font-weight: 600; color: inherit; margin-bottom: 2px; font-size: 0.95em;">
                            ${f.title}
                        </div>
                        <div style="font-size: 0.85em; color: var(--flavortown-tutorial-subtext, #8b7355); line-height: 1.3;">
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
