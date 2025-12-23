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
    }
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

    const pinBtn = document.createElement('button');
    pinBtn.className = 'sidebar__pin-btn';
    pinBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M16 12V4h1V2H7v2h1v8l-2 2v2h5.2v6h1.6v-6H18v-2l-2-2z"/></svg>`;
    pinBtn.title = 'Pin sidebar';

    const blob = sidebar.querySelector('.sidebar__blob');
    if (blob) {
        blob.style.position = 'relative';
        blob.appendChild(pinBtn);
    }

    browserAPI.storage.local.get(['sidebarPinned'], (result) => {
        const isPinned = result.sidebarPinned || false;

        if (isPinned) {
            sidebar.style.transition = 'none';
            sidebar.classList.add('sidebar--pinned');
            sidebar.style.width = 'var(--sidebar-expanded-width, 300px)';

            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    sidebar.style.transition = '';
                });
            });
        }
    });

    pinBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        e.preventDefault();

        const isPinned = sidebar.classList.contains('sidebar--pinned');

        if (isPinned) {
            sidebar.classList.remove('sidebar--pinned');
            sidebar.style.width = '';
        } else {
            sidebar.classList.add('sidebar--pinned');
            sidebar.style.width = 'var(--sidebar-expanded-width, 300px)';
        }

        browserAPI.storage.local.set({ sidebarPinned: !isPinned });
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

    fetch(devlogNewUrl, { credentials: 'same-origin' })
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

    function updateStats() {
        const existingStats = document.querySelector('.flavortown-goals-enhanced');
        if (existingStats) existingStats.remove();

        const wishlistData = localStorage.getItem('shop_wishlist');
        if (!wishlistData) return;

        let wishlist;
        try {
            wishlist = JSON.parse(wishlistData);
        } catch (e) {
            return;
        }

        const goals = Object.values(wishlist);
        if (goals.length === 0) return;

        const goalsWithQty = goals.map(g => ({
            ...g,
            quantity: g.quantity || 1,
            totalCost: (g.quantity || 1) * g.price,
            remaining: Math.max(0, ((g.quantity || 1) * g.price) - currentCookies),
            hoursNeeded: Math.ceil(Math.max(0, ((g.quantity || 1) * g.price) - currentCookies) / 10)
        }));

        const totalGoals = goalsWithQty.length;
        const totalCookiesNeeded = goalsWithQty.reduce((sum, g) => sum + g.totalCost, 0);
        const cookiesRemaining = Math.max(0, totalCookiesNeeded - currentCookies);
        const hoursNeeded = Math.ceil(cookiesRemaining / 10);
        const progressPercent = totalCookiesNeeded > 0 ? Math.min(100, (currentCookies / totalCookiesNeeded) * 100) : 0;

        const itemsHtml = goalsWithQty.map(g => {
            const itemProgress = g.totalCost > 0 ? Math.min(100, (currentCookies / g.totalCost) * 100) : 0;
            return `
                <div class="flavortown-goal-item">
                    <div class="flavortown-goal-item__header">
                        <img src="${g.image}" alt="${g.name}" class="flavortown-goal-item__img">
                        <div class="flavortown-goal-item__info">
                            <span class="flavortown-goal-item__name">${g.name}</span>
                            <div class="flavortown-goal-item__progress-bar">
                                <div class="flavortown-goal-item__progress-fill" style="width: ${itemProgress}%"></div>
                            </div>
                        </div>
                    </div>
                    <div class="flavortown-goal-item__stats">
                        <span>🍪${g.remaining} more</span>
                        <span>⏱️ ~${g.hoursNeeded}h</span>
                        <span>×${g.quantity}</span>
                    </div>
                </div>
            `;
        }).join('');

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
                        <span class="flavortown-goals-enhanced__card-value">🍪 ${currentCookies}/${totalCookiesNeeded}</span>
                    </div>
                    <div class="flavortown-goals-enhanced__card flavortown-goals-enhanced__card--danger">
                        <span class="flavortown-goals-enhanced__card-label">Remaining</span>
                        <span class="flavortown-goals-enhanced__card-value">🍪 ${cookiesRemaining}</span>
                    </div>
                    <div class="flavortown-goals-enhanced__card flavortown-goals-enhanced__card--success">
                        <span class="flavortown-goals-enhanced__card-label">Time Est.</span>
                        <span class="flavortown-goals-enhanced__card-value">⏱️ ~${hoursNeeded}h</span>
                    </div>
                </div>
                <details class="flavortown-goals-enhanced__accordion" open>
                    <summary class="flavortown-goals-enhanced__accordion-header">
                        <span>Goal Items</span>
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
            }
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

function init() {
    loadTheme();
    initPinnableSidebar();
    addDevlogFrequencyStat();
    inlineDevlogForm();
    enhanceShopGoals();
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
        lastPathname = window.location.pathname;
    }
    initPinnableSidebar();
    addDevlogFrequencyStat();
    inlineDevlogForm();
    enhanceShopGoals();
});
