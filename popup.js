const browserAPI = typeof browser !== 'undefined' ? browser : chrome;

const DEFAULT_CUSTOM_COLORS = {
    'background': '#1e1e2e',
    'surface': '#313244',
    'surface-alt': '#45475a',
    'accent': '#cba6f7',
    'accent-alt': '#89b4fa',
    'text': '#cdd6f4',
    'text-secondary': '#a6adc8',
    'text-muted': '#6c7086',
    'border': '#585b70',
    'success': '#a6e3a1',
    'warning': '#f9e2af',
    'error': '#f38ba8',
    'purple': '#cba6f7',
    'teal': '#94e2d5',
    'pink': '#f5c2e7'
};

const COLOR_LABELS = {
    'background': 'Background',
    'surface': 'Surface',
    'surface-alt': 'Surface Alt',
    'accent': 'Accent',
    'accent-alt': 'Links',
    'text': 'Text',
    'text-secondary': 'Text Dim',
    'text-muted': 'Text Muted',
    'border': 'Border',
    'success': 'Green',
    'warning': 'Yellow',
    'error': 'Red',
    'purple': 'Purple',
    'teal': 'Teal',
    'pink': 'Pink'
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
        '--popup-success': '#38a169'
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
        '--popup-success': '#a6e3a1'
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
        '--popup-success': '#7fdbca'
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
        '--popup-success': '#68d391'
    },
    'custom': null
};

let currentTheme = 'default';
let customColors = { ...DEFAULT_CUSTOM_COLORS };
let catppuccinAccent = 'mauve';

document.addEventListener('DOMContentLoaded', async () => {
    await loadSettings();
    setupEventListeners();
    updateUI();
});

async function loadSettings() {
    const result = await browserAPI.storage.sync.get(['theme', 'customColors', 'catppuccinAccent']);
    currentTheme = result.theme || 'default';
    catppuccinAccent = result.catppuccinAccent || 'mauve';
    if (result.customColors) {
        customColors = { ...DEFAULT_CUSTOM_COLORS, ...result.customColors };
    }
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
            '--popup-bg': customColors['background'],
            '--popup-surface': customColors['surface'],
            '--popup-surface-hover': customColors['surface-alt'],
            '--popup-border': customColors['border'],
            '--popup-text': customColors['text'],
            '--popup-text-dim': customColors['text-secondary'],
            '--popup-accent': customColors['accent'],
            '--popup-accent-dim': customColors['accent-alt'],
            '--popup-success': customColors['success']
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

    Object.keys(DEFAULT_CUSTOM_COLORS).forEach(key => {
        const div = document.createElement('div');
        div.className = 'color-item';
        div.innerHTML = `
            <input type="color" class="color-item__input" data-key="${key}" value="${customColors[key]}">
            <span class="color-item__label">${COLOR_LABELS[key] || key}</span>
        `;
        container.appendChild(div);
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
    const previewColors = document.getElementById('customPreviewColors');
    if (previewColors) {
        const spans = previewColors.querySelectorAll('span');
        if (spans.length >= 3) {
            spans[0].style.background = customColors['background'];
            spans[1].style.background = customColors['accent'];
            spans[2].style.background = customColors['text'];
        }
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
