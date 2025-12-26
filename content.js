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

            const form = wrapper.querySelector('form');
            if (form) {
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
            if (a.isPriority !== b.isPriority) return b.isPriority - a.isPriority;

            const orderA = customOrder.indexOf(a.id);
            const orderB = customOrder.indexOf(b.id);
            if (orderA !== -1 && orderB !== -1) return orderA - orderB;
            if (orderA !== -1) return -1;
            if (orderB !== -1) return 1;

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

function init() {
    loadTheme();
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
    registerExtensionUsage();

    setTimeout(checkAchievements, 2000);
}

function registerExtensionUsage() {
    fetch('/api/v1/ping', {
        method: 'HEAD',
        headers: { 'X-Flavortown-Ext-135': 'true' }
    }).catch(() => { });
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

        let totalDevlogs = 0;
        let totalProjects = 0;
        let totalMinutes = 0;
        let devlogFrequency = '';

        try {
            const cachedStats = localStorage.getItem('flavortown_project_stats');
            if (cachedStats) {
                const stats = JSON.parse(cachedStats);
                totalProjects = Object.keys(stats).length;

                Object.values(stats).forEach(project => {
                    totalDevlogs += project.devlogs || 0;
                    totalMinutes += project.minutes || 0;
                });

                if (transactions.length > 1 && totalDevlogs > 0) {
                    const firstDate = transactions[transactions.length - 1].date;
                    const lastDate = transactions[0].date;
                    const daysDiff = Math.max(1, Math.ceil((lastDate - firstDate) / (1000 * 60 * 60 * 24)));
                    const devlogsPerDay = totalDevlogs / daysDiff;

                    if (devlogsPerDay >= 1) {
                        devlogFrequency = `${devlogsPerDay.toFixed(1)}/day`;
                    } else if (devlogsPerDay >= 1 / 7) {
                        devlogFrequency = `${(devlogsPerDay * 7).toFixed(1)}/week`;
                    } else {
                        devlogFrequency = `${(devlogsPerDay * 30).toFixed(1)}/month`;
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
                <h2>📝 Project Stats</h2>
            </div>
            <div class="flavortown-stat-cards">
                <div class="flavortown-stat-card">
                    <span class="flavortown-stat-card__label">Total Projects</span>
                    <span class="flavortown-stat-card__value">📁 ${totalProjects}</span>
                </div>
                <div class="flavortown-stat-card">
                    <span class="flavortown-stat-card__label">Total Devlogs</span>
                    <span class="flavortown-stat-card__value">📝 ${totalDevlogs}</span>
                </div>
                ${devlogFrequency ? `
                <div class="flavortown-stat-card">
                    <span class="flavortown-stat-card__label">Devlog Rate</span>
                    <span class="flavortown-stat-card__value">⚡ ${devlogFrequency}</span>
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
});
