(function () {
    const THEME_CACHE_KEY = 'flavortown-theme-cache';
    const PRELOAD_STYLE_ID = 'flavortown-theme-preload';
    const api = typeof browser !== 'undefined' ? browser : chrome;

    const appendToHead = (el) => {
        const target = document.head || document.documentElement;
        target.appendChild(el);
    };

    let cached = null;
    try {
        cached = JSON.parse(localStorage.getItem(THEME_CACHE_KEY));
    } catch (e) {
        cached = null;
    }

    const theme = cached && cached.theme ? cached.theme : 'default';
    if (!theme || theme === 'default') return;

    const palette = cached && cached.palette ? cached.palette : {};
    const bg = palette['--color-background'] || palette['--color-cream'];
    const surface = palette['--color-surface'] || palette['--color-cream-dark'];
    const text = palette['--color-text-primary'] || palette['--color-brown'];

    if (bg || surface || text || Object.keys(palette).length > 0) {
        const style = document.createElement('style');
        style.id = PRELOAD_STYLE_ID;
        const vars = Object.entries(palette)
            .filter(([, value]) => value)
            .map(([key, value]) => `    ${key}: ${value} !important;`)
            .join('\n');
        style.textContent = `
        :root {
${vars}
        }

        html, body {
            ${bg ? `background: ${bg} !important;` : ''}
            ${bg ? `background-color: ${bg} !important;` : ''}
            ${text ? `color: ${text} !important;` : ''}
        }

        body::before {
            ${bg ? `background: ${bg} !important;` : ''}
            ${bg ? `background-color: ${bg} !important;` : ''}
        }

        .sidebar, .sidebar__content, .sidebar__menu {
            ${surface ? `background: ${surface} !important;` : ''}
        }
        `;
        appendToHead(style);
    }

    if (theme === 'custom') {
        const customColors = cached && cached.customColors ? cached.customColors : {};
        const customBg = customColors.background || bg || '#1e1e2e';
        const customSurface = customColors.surface || surface || '#313244';
        const customText = customColors.text || text || '#cdd6f4';

        const style = document.createElement('style');
        style.id = 'flavortown-custom-vars';
        style.textContent = `
        html, body {
            background: ${customBg} !important;
            background-color: ${customBg} !important;
            color: ${customText} !important;
        }

        body::before {
            background: ${customBg} !important;
            background-color: ${customBg} !important;
        }

        .sidebar, .sidebar__content, .sidebar__menu {
            background: ${customSurface} !important;
        }
        `;
        appendToHead(style);
        return;
    }

    const link = document.createElement('link');
    link.id = 'flavortown-theme';
    link.rel = 'stylesheet';
    link.href = api.runtime.getURL(`themes/${theme}.css`);
    appendToHead(link);

    if (theme === 'catppuccin' && cached && cached.catppuccinAccent === 'lavender') {
        const accentStyle = document.createElement('style');
        accentStyle.id = 'flavortown-accent-override';
        accentStyle.textContent = `
        :root {
            --ctp-mauve: #b4befe !important;
            --color-brown: #b4befe !important;
            --color-accent: #b4befe !important;
            --flavortown-toolbar-icon: #313244 !important;
            --flavortown-toolbar-icon-active: #313244 !important;
        }
        `;
        appendToHead(accentStyle);
    }
})();
