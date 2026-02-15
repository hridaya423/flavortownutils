const browserAPI = typeof browser !== 'undefined' ? browser : chrome;

const DEFAULT_CUSTOM_COLORS = {
    'bg-base': '#1e1e2e',
    'bg-mantle': '#181825',
    'bg-surface': '#313244',
    'surface-hover': '#45475a',
    'surface-active': '#585b70',
    'text-primary': '#cdd6f4',
    'text-secondary': '#bac2de',
    'text-muted': '#a6adc8',
    'text-on-accent': '#11111b',
    'accent': '#cba6f7',
    'accent-hover': '#b4befe',
    'accent-alt': '#89b4fa',
    'btn-primary-bg': '#cba6f7',
    'btn-primary-text': '#11111b',
    'success': '#a6e3a1',
    'error': '#f38ba8',
    'border': '#45475a'
};

const COLOR_LABELS = {
    'bg-base': 'Background',
    'bg-mantle': 'Background Alt',
    'bg-surface': 'Surface',
    'surface-hover': 'Hover',
    'surface-active': 'Active',
    'text-primary': 'Text',
    'text-secondary': 'Text Secondary',
    'text-muted': 'Text Muted',
    'text-on-accent': 'Text on Accent',
    'accent': 'Accent',
    'accent-hover': 'Accent Hover',
    'accent-alt': 'Links',
    'btn-primary-bg': 'Button BG',
    'btn-primary-text': 'Button Text',
    'success': 'Success',
    'error': 'Error',
    'border': 'Border'
};

const COLOR_SECTIONS = {
    'Backgrounds': ['bg-base', 'bg-mantle', 'bg-surface'],
    'Surfaces': ['surface-hover', 'surface-active'],
    'Text': ['text-primary', 'text-secondary', 'text-muted', 'text-on-accent'],
    'Accent': ['accent', 'accent-hover', 'accent-alt'],
    'Buttons': ['btn-primary-bg', 'btn-primary-text'],
    'Status': ['success', 'error', 'border']
};

const POPUP_THEMES = {
    'default': {
        '--popup-bg': '#fdf6e3',
        '--popup-surface': '#f5efe6',
        '--popup-surface-hover': '#efe6d5',
        '--popup-border': '#e0d4c4',
        '--popup-text': '#5d4e37',
        '--popup-text-dim': '#8b7355',
        '--popup-accent': '#d97706',
        '--popup-accent-dim': '#b45309',
        '--popup-success': '#38a169',
        '--popup-error': '#e53e3e'
    },
    'catppuccin': {
        '--popup-bg': '#1e1e2e',
        '--popup-surface': '#313244',
        '--popup-surface-hover': '#45475a',
        '--popup-border': '#585b70',
        '--popup-text': '#cdd6f4',
        '--popup-text-dim': '#a6adc8',
        '--popup-accent': '#cba6f7',
        '--popup-accent-dim': '#b4befe',
        '--popup-success': '#a6e3a1',
        '--popup-error': '#f38ba8'
    },
    'sea': {
        '--popup-bg': '#0a192f',
        '--popup-surface': '#112240',
        '--popup-surface-hover': '#1d3557',
        '--popup-border': '#233554',
        '--popup-text': '#ccd6f6',
        '--popup-text-dim': '#8892b0',
        '--popup-accent': '#66d9ef',
        '--popup-accent-dim': '#7fdbca',
        '--popup-success': '#7fdbca',
        '--popup-error': '#ff6b6b'
    },
    'overcooked': {
        '--popup-bg': '#1a0f0f',
        '--popup-surface': '#2b1212',
        '--popup-surface-hover': '#4a1818',
        '--popup-border': '#742a2a',
        '--popup-text': '#fff5f5',
        '--popup-text-dim': '#feb2b2',
        '--popup-accent': '#ed8936',
        '--popup-accent-dim': '#fbd38d',
        '--popup-success': '#68d391',
        '--popup-error': '#f56565'
    },
    'custom': null
};

const LOCAL_STORAGE_SYNC_ENABLED_KEY = 'flavortownLocalStorageSyncEnabled';
const LOCAL_STORAGE_SYNC_KEY = 'flavortownLocalStorageSync';
const LOCAL_STORAGE_IMPORT_KEY = 'flavortownLocalStorageImport';
const COMMAND_PALETTE_SHORTCUT_KEY = 'flavortownCommandPaletteShortcut';
const EXPORT_VERSION = 1;
const LOCAL_STORAGE_EXPORT_KEYS = [
    'flavortown_progress_mode',
    'flavortown_projection_mode',
    'shop_wishlist',
    'shop_wishlist_priorities',
    'shop_wishlist_order',
    'flavortown_project_stats',
    'flavortown_tutorial_state',
    'flavortown_cmd_recent'
];

let currentTheme = 'default';
let customColors = { ...DEFAULT_CUSTOM_COLORS };
let catppuccinAccent = 'mauve';
let localStorageSyncEnabled = false;
let commandPaletteShortcut = null;
const isMac = /Mac|iPhone|iPad|iPod/i.test(navigator.platform || navigator.userAgent);
const DEFAULT_COMMAND_PALETTE_SHORTCUT = isMac ? 'Cmd+K' : 'Ctrl+K';

document.addEventListener('DOMContentLoaded', async () => {
    await loadSettings();
    setupEventListeners();
    updateUI();
});

async function loadSettings() {
    const result = await browserAPI.storage.sync.get([
        'theme',
        'customColors',
        'catppuccinAccent',
        LOCAL_STORAGE_SYNC_ENABLED_KEY,
        COMMAND_PALETTE_SHORTCUT_KEY
    ]);
    currentTheme = result.theme || 'default';
    catppuccinAccent = result.catppuccinAccent || 'mauve';
    if (result.customColors) {
        customColors = migrateCustomColors(result.customColors);
    }
    localStorageSyncEnabled = !!result[LOCAL_STORAGE_SYNC_ENABLED_KEY];
    commandPaletteShortcut = normalizeShortcutString(result[COMMAND_PALETTE_SHORTCUT_KEY]) || DEFAULT_COMMAND_PALETTE_SHORTCUT;
}

function migrateCustomColors(oldColors) {
    const migrated = { ...DEFAULT_CUSTOM_COLORS };
    
    if (oldColors['background']) migrated['bg-base'] = oldColors['background'];
    if (oldColors['surface']) migrated['bg-surface'] = oldColors['surface'];
    if (oldColors['surface-alt']) migrated['surface-hover'] = oldColors['surface-alt'];
    if (oldColors['text']) migrated['text-primary'] = oldColors['text'];
    if (oldColors['text-secondary']) migrated['text-secondary'] = oldColors['text-secondary'];
    if (oldColors['text-muted']) migrated['text-muted'] = oldColors['text-muted'];
    if (oldColors['accent']) migrated['accent'] = oldColors['accent'];
    if (oldColors['accent-alt']) migrated['accent-alt'] = oldColors['accent-alt'];
    if (oldColors['border']) migrated['border'] = oldColors['border'];
    if (oldColors['success']) migrated['success'] = oldColors['success'];
    if (oldColors['error']) migrated['error'] = oldColors['error'];
    
    Object.keys(DEFAULT_CUSTOM_COLORS).forEach(key => {
        if (oldColors[key]) migrated[key] = oldColors[key];
    });
    
    return migrated;
}

function setupEventListeners() {
    document.querySelectorAll('.theme-card').forEach(card => {
        card.addEventListener('click', () => {
            const theme = card.dataset.theme;
            setTheme(theme);
        });
    });

    document.getElementById('resetBtn')?.addEventListener('click', () => {
        customColors = { ...DEFAULT_CUSTOM_COLORS };
        renderCustomVars();
        updateCustomPreview();
        saveAndApply();
    });

    document.querySelectorAll('.accent-toggle__btn').forEach(btn => {
        btn.addEventListener('click', () => {
            catppuccinAccent = btn.dataset.accent;
            updateAccentToggleUI();
            saveAndApply();
        });
    });

    const syncToggle = document.getElementById('autoSyncToggle');
    syncToggle?.addEventListener('change', async (event) => {
        localStorageSyncEnabled = event.target.checked;
        await browserAPI.storage.sync.set({
            [LOCAL_STORAGE_SYNC_ENABLED_KEY]: localStorageSyncEnabled
        });
        showStatus(localStorageSyncEnabled ? 'Auto-sync on' : 'Auto-sync off');
    });

    document.getElementById('exportBtn')?.addEventListener('click', exportData);
    document.getElementById('importFile')?.addEventListener('change', handleImportFile);

    const shortcutBtn = document.getElementById('commandPaletteShortcut');
    const shortcutReset = document.getElementById('commandPaletteShortcutReset');
    if (shortcutBtn) {
        shortcutBtn.addEventListener('click', () => beginShortcutCapture(shortcutBtn));
    }
    shortcutReset?.addEventListener('click', () => resetShortcut(shortcutBtn));

    document.getElementById('clearCacheBtn')?.addEventListener('click', clearAllCaches);
}

function setTheme(theme) {
    currentTheme = theme;
    updateUI();
    applyPopupTheme();
    saveAndApply();
}

function updateUI() {
    document.querySelectorAll('.theme-card').forEach(card => {
        card.classList.toggle('active', card.dataset.theme === currentTheme);
    });

    const customSection = document.getElementById('customSection');
    if (currentTheme === 'custom') {
        customSection.classList.add('visible');
        renderCustomVars();
    } else {
        customSection.classList.remove('visible');
    }

    const accentToggle = document.getElementById('accentToggle');
    if (currentTheme === 'catppuccin') {
        accentToggle?.classList.add('visible');
    } else {
        accentToggle?.classList.remove('visible');
    }
    updateAccentToggleUI();

    updateCustomPreview();
    applyPopupTheme();
    updateSyncToggleUI();
    updateShortcutUI();
}

function updateSyncToggleUI() {
    const syncToggle = document.getElementById('autoSyncToggle');
    if (syncToggle) {
        syncToggle.checked = localStorageSyncEnabled;
    }
}

function updateAccentToggleUI() {
    document.querySelectorAll('.accent-toggle__btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.accent === catppuccinAccent);
    });
}

function applyPopupTheme() {
    const root = document.documentElement;
    let themeVars;

    if (currentTheme === 'custom') {
        themeVars = {
            '--popup-bg': customColors['bg-base'] || DEFAULT_CUSTOM_COLORS['bg-base'],
            '--popup-surface': customColors['bg-surface'] || DEFAULT_CUSTOM_COLORS['bg-surface'],
            '--popup-surface-hover': customColors['surface-hover'] || DEFAULT_CUSTOM_COLORS['surface-hover'],
            '--popup-border': customColors['border'] || DEFAULT_CUSTOM_COLORS['border'],
            '--popup-text': customColors['text-primary'] || DEFAULT_CUSTOM_COLORS['text-primary'],
            '--popup-text-dim': customColors['text-secondary'] || DEFAULT_CUSTOM_COLORS['text-secondary'],
            '--popup-accent': customColors['accent'] || DEFAULT_CUSTOM_COLORS['accent'],
            '--popup-accent-dim': customColors['accent-alt'] || DEFAULT_CUSTOM_COLORS['accent-alt'],
            '--popup-success': customColors['success'] || DEFAULT_CUSTOM_COLORS['success']
        };
    } else if (currentTheme === 'catppuccin') {
        themeVars = { ...POPUP_THEMES['catppuccin'] };
        if (catppuccinAccent === 'lavender') {
            themeVars['--popup-accent'] = '#b4befe';
            themeVars['--popup-accent-dim'] = '#89b4fa';
        }
    } else {
        themeVars = POPUP_THEMES[currentTheme] || POPUP_THEMES['default'];
    }

    for (const [varName, value] of Object.entries(themeVars)) {
        root.style.setProperty(varName, value);
    }
}

function renderCustomVars() {
    const container = document.getElementById('customVars');
    if (!container) return;

    container.innerHTML = '';

    Object.entries(COLOR_SECTIONS).forEach(([sectionName, keys]) => {
        const sectionDiv = document.createElement('div');
        sectionDiv.className = 'custom-section';
        
        const title = document.createElement('div');
        title.className = 'custom-section__title';
        title.textContent = sectionName;
        sectionDiv.appendChild(title);
        
        const grid = document.createElement('div');
        grid.className = 'custom-section__grid';
        
        keys.forEach(key => {
            const div = document.createElement('div');
            div.className = 'color-item';
            div.innerHTML = `
                <input type="color" class="color-item__input" data-key="${key}" value="${customColors[key] || DEFAULT_CUSTOM_COLORS[key]}">
                <span class="color-item__label">${COLOR_LABELS[key] || key}</span>
            `;
            grid.appendChild(div);
        });
        
        sectionDiv.appendChild(grid);
        container.appendChild(sectionDiv);
    });

    container.querySelectorAll('.color-item__input').forEach(input => {
        input.addEventListener('input', (e) => {
            const key = e.target.dataset.key;
            customColors[key] = e.target.value;
            updateCustomPreview();
            applyPopupTheme();

            clearTimeout(input._saveTimeout);
            input._saveTimeout = setTimeout(() => saveAndApply(), 150);
        });
    });
}

function updateCustomPreview() {
    const previewCard = document.getElementById('customPreview');
    if (!previewCard) return;
    
    const previewBg = previewCard.querySelector('.preview-bg');
    if (previewBg) {
        previewBg.style.background = customColors['bg-base'] || DEFAULT_CUSTOM_COLORS['bg-base'];
        previewBg.style.color = customColors['text-primary'] || DEFAULT_CUSTOM_COLORS['text-primary'];
    }
    
    const previewBtn = previewCard.querySelector('.preview-btn');
    if (previewBtn) {
        previewBtn.style.background = customColors['btn-primary-bg'] || customColors['accent'] || DEFAULT_CUSTOM_COLORS['accent'];
        previewBtn.style.color = customColors['btn-primary-text'] || DEFAULT_CUSTOM_COLORS['btn-primary-text'];
    }
    
    const previewSurface = previewCard.querySelector('.preview-surface');
    if (previewSurface) {
        previewSurface.style.background = customColors['bg-surface'] || DEFAULT_CUSTOM_COLORS['bg-surface'];
        previewSurface.style.borderColor = customColors['border'] || DEFAULT_CUSTOM_COLORS['border'];
    }
    
    const previewLink = previewCard.querySelector('.preview-link');
    if (previewLink) {
        previewLink.style.color = customColors['accent-alt'] || DEFAULT_CUSTOM_COLORS['accent-alt'];
    }
}

async function saveAndApply() {
    try {
        await browserAPI.storage.sync.set({
            theme: currentTheme,
            customColors: customColors,
            catppuccinAccent: catppuccinAccent
        });

        const tabs = await browserAPI.tabs.query({ url: 'https://flavortown.hackclub.com/*' });

        for (const tab of tabs) {
            try {
                await browserAPI.tabs.sendMessage(tab.id, {
                    type: 'APPLY_THEME',
                    theme: currentTheme,
                    customColors: customColors,
                    catppuccinAccent: catppuccinAccent
                });
            } catch (e) {
                console.log('Tab not ready:', tab.id, e.message);
            }
        }

        showStatus('✓ Applied!');
    } catch (error) {
        console.error('Failed to apply theme:', error);
        showStatus('Failed to apply', true);
    }
}

function showStatus(text, isError = false) {
    const status = document.getElementById('status');
    if (!status) return;

    status.textContent = text;
    status.classList.toggle('error', isError);

    setTimeout(() => {
        status.textContent = '';
    }, 2000);
}

function normalizeShortcutString(value) {
    if (!value || typeof value !== 'string') return null;
    const cleaned = value
        .split('+')
        .map(part => part.trim())
        .filter(Boolean);
    if (!cleaned.length) return null;

    const key = cleaned[cleaned.length - 1];
    const mods = cleaned.slice(0, -1).map(part => part.toLowerCase());
    const normalizedMods = [];
    if (mods.includes('cmd') || mods.includes('command') || mods.includes('meta')) normalizedMods.push('Cmd');
    if (mods.includes('ctrl') || mods.includes('control')) normalizedMods.push('Ctrl');
    if (mods.includes('alt') || mods.includes('option')) normalizedMods.push('Alt');
    if (mods.includes('shift')) normalizedMods.push('Shift');

    const keyLabel = normalizeKeyLabel(key);
    if (!keyLabel) return null;
    if (!normalizedMods.length) return null;
    return [...normalizedMods, keyLabel].join('+');
}

function normalizeKeyLabel(key) {
    if (!key) return '';
    if (key.length === 1) return key.toUpperCase();
    if (key.toLowerCase() === 'space') return 'Space';
    return key.replace(/^./, (char) => char.toUpperCase());
}

function updateShortcutUI() {
    const shortcutBtn = document.getElementById('commandPaletteShortcut');
    if (shortcutBtn) {
        shortcutBtn.textContent = commandPaletteShortcut || DEFAULT_COMMAND_PALETTE_SHORTCUT;
    }
}

function resetShortcut(button) {
    commandPaletteShortcut = DEFAULT_COMMAND_PALETTE_SHORTCUT;
    updateShortcutUI();
    browserAPI.storage.sync.set({
        [COMMAND_PALETTE_SHORTCUT_KEY]: commandPaletteShortcut
    });
    showStatus('Shortcut reset');
    if (button) button.classList.remove('is-capturing');
}

function beginShortcutCapture(button) {
    if (!button) return;
    button.classList.add('is-capturing');
    const previous = button.textContent;
    button.textContent = 'Press keys...';

    const handleKey = async (event) => {
        event.preventDefault();
        event.stopPropagation();

        if (event.key === 'Escape') {
            button.textContent = previous || commandPaletteShortcut || DEFAULT_COMMAND_PALETTE_SHORTCUT;
            button.classList.remove('is-capturing');
            document.removeEventListener('keydown', handleKey, true);
            return;
        }

        const combo = buildShortcutFromEvent(event);
        if (!combo) return;

        commandPaletteShortcut = combo;
        button.textContent = combo;
        button.classList.remove('is-capturing');
        document.removeEventListener('keydown', handleKey, true);

        await browserAPI.storage.sync.set({
            [COMMAND_PALETTE_SHORTCUT_KEY]: combo
        });
        showStatus('Shortcut saved');
    };

    document.addEventListener('keydown', handleKey, true);
}

function buildShortcutFromEvent(event) {
    const key = normalizeKeyLabel(event.key === ' ' ? 'Space' : event.key);
    if (!key || ['Shift', 'Ctrl', 'Control', 'Alt', 'Meta', 'Cmd', 'Command'].includes(key)) return null;

    const mods = [];
    if (event.metaKey) mods.push('Cmd');
    if (event.ctrlKey) mods.push('Ctrl');
    if (event.altKey) mods.push('Alt');
    if (event.shiftKey) mods.push('Shift');
    if (!mods.length) return null;
    return [...mods, key].join('+');
}

async function exportData() {
    try {
        const syncData = await browserAPI.storage.sync.get(null);
        const localStorageData = await getLocalStorageSnapshot();

        const payload = {
            version: EXPORT_VERSION,
            exportedAt: new Date().toISOString(),
            sync: syncData,
            localStorage: localStorageData
        };

        downloadJson(payload, `flavortown-utils-backup-${Date.now()}.json`);
        showStatus('Exported data');
    } catch (error) {
        console.error('Export failed:', error);
        showStatus('Export failed', true);
    }
}

async function handleImportFile(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
        const text = await file.text();
        const payload = JSON.parse(text);

        if (!payload || typeof payload !== 'object') {
            throw new Error('Invalid payload');
        }

        if (payload.sync && typeof payload.sync === 'object') {
            await browserAPI.storage.sync.set(payload.sync);
        }

        if (payload.localStorage && typeof payload.localStorage === 'object') {
            const importPayload = {
                version: EXPORT_VERSION,
                updatedAt: Date.now(),
                data: payload.localStorage
            };
            try {
                await browserAPI.storage.sync.set({
                    [LOCAL_STORAGE_IMPORT_KEY]: importPayload,
                    [LOCAL_STORAGE_SYNC_KEY]: importPayload
                });
            } catch (syncError) {
                console.warn('Sync import skipped:', syncError);
            }
            await importLocalStorageSnapshot(payload.localStorage);
        }

        await loadSettings();
        updateUI();
        showStatus('Imported data');
    } catch (error) {
        console.error('Import failed:', error);
        showStatus('Import failed', true);
    } finally {
        event.target.value = '';
    }
}

async function getLocalStorageSnapshot() {
    const tabs = await browserAPI.tabs.query({ url: 'https://flavortown.hackclub.com/*' });
    for (const tab of tabs) {
        try {
            const response = await browserAPI.tabs.sendMessage(tab.id, {
                type: 'EXPORT_DATA',
                keys: LOCAL_STORAGE_EXPORT_KEYS
            });
            if (response?.localStorage) {
                return response.localStorage;
            }
        } catch (error) {
            console.warn('Export tab not ready:', tab.id, error.message);
        }
    }
    return {};
}

async function importLocalStorageSnapshot(localStorageData) {
    const tabs = await browserAPI.tabs.query({ url: 'https://flavortown.hackclub.com/*' });
    if (!tabs.length) return;

    await Promise.all(tabs.map(async (tab) => {
        try {
            await browserAPI.tabs.sendMessage(tab.id, {
                type: 'IMPORT_DATA',
                localStorage: localStorageData
            });
        } catch (error) {
            console.warn('Import tab not ready:', tab.id, error.message);
        }
    }));
}

function downloadJson(data, filename) {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
}

async function clearAllCaches() {
    const CACHE_KEYS_TO_CLEAR = [
        'flavortown_project_stats',
        'flavortown_project_unshipped',
        'flavortown_ship_payouts',
        'flavortown_ship_minutes',
        'flavortown-project-repo-map',
        'flavortown_changelog_cache',
        'flavortown_heatmap_data'
    ];

    const GITHUB_REPO_CACHE_PREFIX = 'flavortown-github-repos-';

    const btn = document.getElementById('clearCacheBtn');
    const originalHTML = btn.innerHTML;
    btn.disabled = true;
    btn.classList.add('popup__cache-btn--clearing');
    btn.innerHTML = '<span class="popup__cache-icon">🧹</span>Clearing...';

    try {
        const allSyncKeys = await browserAPI.storage.sync.get(null);
        const syncKeysToRemove = Object.keys(allSyncKeys).filter(key =>
            CACHE_KEYS_TO_CLEAR.includes(key) ||
            key.startsWith(GITHUB_REPO_CACHE_PREFIX)
        );

        if (syncKeysToRemove.length > 0) {
            await browserAPI.storage.sync.remove(syncKeysToRemove);
        }

        const tabs = await browserAPI.tabs.query({ url: 'https://flavortown.hackclub.com/*' });
        if (tabs.length > 0) {
            await Promise.all(tabs.map(async (tab) => {
                try {
                    await browserAPI.tabs.sendMessage(tab.id, {
                        type: 'CLEAR_CACHES',
                        keys: CACHE_KEYS_TO_CLEAR
                    });
                } catch (error) {
                    console.warn('Clear cache message failed:', tab.id, error.message);
                }
            }));

            await Promise.all(tabs.map(async (tab) => {
                try {
                    await browserAPI.tabs.reload(tab.id);
                } catch (error) {
                    console.warn('Tab reload failed:', tab.id, error.message);
                }
            }));
        }

        btn.classList.remove('popup__cache-btn--clearing');
        btn.innerHTML = '<span class="popup__cache-icon">✓</span>Cleared!';
        btn.classList.add('popup__cache-btn--success');

        setTimeout(() => {
            btn.innerHTML = originalHTML;
            btn.classList.remove('popup__cache-btn--success');
            btn.disabled = false;
        }, 2000);

        showStatus('Cache cleared! Page reloading...');
    } catch (error) {
        console.error('Clear cache failed:', error);
        btn.classList.remove('popup__cache-btn--clearing');
        btn.innerHTML = '<span class="popup__cache-icon">✗</span>Failed';
        btn.classList.add('popup__cache-btn--error');

        setTimeout(() => {
            btn.innerHTML = originalHTML;
            btn.classList.remove('popup__cache-btn--error');
            btn.disabled = false;
        }, 2000);

        showStatus('Failed to clear cache', true);
    }
}
