/**
 * RDM Navigation Component
 * Shared navigation and header for all demo pages
 */
class RDMNavigation {
    constructor(options = {}) {
        this.options = {
            currentPage: '',
            showBreadcrumb: true,
            showStats: false,
            ...options
        };

        this.components = [
            { id: 'table', name: 'Sticky Table', icon: '📊', path: 'table.html', status: 'stable' },
            { id: 'datagrid', name: 'Data Grid', icon: '📋', path: 'datagrid.html', status: 'stable' },
            { id: 'cardgrid', name: 'Card Grid', icon: '🎴', path: 'cardgrid.html', status: 'new' },
            { id: 'timeline', name: 'Timeline', icon: '🕐', path: 'timeline.html', status: 'new' },
            { id: 'select', name: 'Select', icon: '🔽', path: 'select.html', status: 'stable' }
        ];

        this.init();
    }

    init() {
        this.injectStyles();
        this.createNavigation();
        this.attachEventListeners();
    }

    injectStyles() {
        const styles = `
            <style id="rdm-navigation-styles">
                /* Navigation Styles */
                .rdm-nav {
                    background: rgba(255, 255, 255, 0.95);
                    backdrop-filter: blur(10px);
                    border-bottom: 1px solid rgba(255, 255, 255, 0.2);
                    position: relative;
                    z-index: 1000;
                    box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
                    transition: all 0.3s ease;
                }

                .rdm-nav-container {
                    max-width: 1400px;
                    margin: 0 auto;
                    padding: 1rem 2rem;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    flex-wrap: wrap;
                    gap: 1rem;
                }

                .rdm-nav-brand {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    text-decoration: none;
                    color: inherit;
                }

                .rdm-nav-logo {
                    font-size: 1.5rem;
                    font-weight: 700;
                    background: linear-gradient(135deg, #667eea, #764ba2);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                }

                .rdm-nav-breadcrumb {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    font-size: 0.875rem;
                    color: #64748b;
                }

                .rdm-nav-breadcrumb-sep {
                    color: #cbd5e1;
                }

                .rdm-nav-current {
                    color: #667eea;
                    font-weight: 600;
                }

                .rdm-nav-links {
                    display: flex;
                    gap: 0.5rem;
                    align-items: center;
                    flex-wrap: wrap;
                }

                .rdm-nav-link {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    padding: 0.5rem 1rem;
                    border-radius: 8px;
                    text-decoration: none;
                    color: #64748b;
                    font-weight: 500;
                    font-size: 0.875rem;
                    transition: all 0.2s ease;
                    position: relative;
                }

                .rdm-nav-link:hover {
                    color: #1e293b;
                    background: rgba(102, 126, 234, 0.1);
                    text-decoration: none;
                }

                .rdm-nav-link.active {
                    color: #667eea;
                    background: rgba(102, 126, 234, 0.1);
                    font-weight: 600;
                }

                .rdm-nav-link.active::after {
                    content: '';
                    position: absolute;
                    bottom: -1rem;
                    left: 50%;
                    transform: translateX(-50%);
                    width: 4px;
                    height: 4px;
                    background: #667eea;
                    border-radius: 50%;
                }

                .rdm-nav-status {
                    font-size: 0.625rem;
                    padding: 0.125rem 0.375rem;
                    border-radius: 6px;
                    text-transform: uppercase;
                    font-weight: 600;
                    letter-spacing: 0.05em;
                }

                .rdm-nav-status.new {
                    background: #fef3c7;
                    color: #92400e;
                }

                .rdm-nav-status.stable {
                    background: #dcfce7;
                    color: #166534;
                }

                .rdm-nav-actions {
                    display: flex;
                    gap: 0.5rem;
                    align-items: center;
                }

                .rdm-nav-btn {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    padding: 0.5rem 1rem;
                    border-radius: 8px;
                    border: 1px solid #e2e8f0;
                    background: white;
                    color: #64748b;
                    text-decoration: none;
                    font-size: 0.875rem;
                    font-weight: 500;
                    transition: all 0.2s ease;
                    cursor: pointer;
                }

                .rdm-nav-btn:hover {
                    background: #f8fafc;
                    border-color: #cbd5e1;
                    color: #1e293b;
                    text-decoration: none;
                }

                .rdm-nav-btn.primary {
                    background: linear-gradient(135deg, #667eea, #764ba2);
                    color: white;
                    border-color: transparent;
                }

                .rdm-nav-btn.primary:hover {
                    transform: translateY(-1px);
                    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
                    color: white;
                }

                /* Mobile Navigation */
                .rdm-nav-mobile-toggle {
                    display: none;
                    background: none;
                    border: none;
                    font-size: 1.25rem;
                    cursor: pointer;
                    padding: 0.5rem;
                    border-radius: 6px;
                    transition: background 0.2s ease;
                }

                .rdm-nav-mobile-toggle:hover {
                    background: rgba(102, 126, 234, 0.1);
                }

                .rdm-nav-mobile-menu {
                    display: none;
                    position: absolute;
                    top: 100%;
                    left: 0;
                    right: 0;
                    background: rgba(255, 255, 255, 0.98);
                    backdrop-filter: blur(10px);
                    border-top: 1px solid #e2e8f0;
                    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
                    padding: 1rem;
                    flex-direction: column;
                    gap: 0.5rem;
                }

                .rdm-nav-mobile-menu.open {
                    display: flex;
                }

                /* Responsive */
                @media (max-width: 768px) {
                    .rdm-nav-container {
                        padding: 1rem;
                    }

                    .rdm-nav-links {
                        display: none;
                    }

                    .rdm-nav-mobile-toggle {
                        display: block;
                    }

                    .rdm-nav-breadcrumb {
                        display: none;
                    }
                }

                @media (max-width: 480px) {
                    .rdm-nav-brand {
                        flex-direction: column;
                        gap: 0.5rem;
                        text-align: center;
                    }

                    .rdm-nav-logo {
                        font-size: 1.25rem;
                    }
                }

                /* Back to Top Button */
                .rdm-back-to-top {
                    position: fixed;
                    bottom: 2rem;
                    right: 2rem;
                    width: 3rem;
                    height: 3rem;
                    background: linear-gradient(135deg, #667eea, #764ba2);
                    color: white;
                    border: none;
                    border-radius: 50%;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 1.25rem;
                    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
                    transition: all 0.3s ease;
                    opacity: 0;
                    visibility: hidden;
                    z-index: 1000;
                }

                .rdm-back-to-top.visible {
                    opacity: 1;
                    visibility: visible;
                }

                .rdm-back-to-top:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
                }

                /* Theme Toggle */
                .rdm-theme-toggle {
                    background: none;
                    border: 1px solid #e2e8f0;
                    border-radius: 8px;
                    padding: 0.5rem;
                    cursor: pointer;
                    font-size: 1rem;
                    transition: all 0.2s ease;
                }

                .rdm-theme-toggle:hover {
                    background: rgba(102, 126, 234, 0.1);
                    border-color: #cbd5e1;
                }
            </style>
        `;

        // Remove existing styles if any
        const existingStyles = document.getElementById('rdm-navigation-styles');
        if (existingStyles) {
            existingStyles.remove();
        }

        document.head.insertAdjacentHTML('beforeend', styles);
    }

    createNavigation() {
        const currentComponent = this.getCurrentComponent();
        
        const nav = `
            <nav class="rdm-nav">
                <div class="rdm-nav-container">
                    <div class="rdm-nav-brand">
                        <a href="../index.html" class="rdm-nav-logo">🎨 RDM Components</a>
                        ${this.options.showBreadcrumb ? this.renderBreadcrumb(currentComponent) : ''}
                    </div>

                    <!-- Desktop Navigation -->
                    <div class="rdm-nav-links">
                        ${this.components.map(comp => this.renderNavLink(comp, currentComponent)).join('')}
                    </div>

                    <!-- Actions -->
                    <div class="rdm-nav-actions">
                        <button class="rdm-theme-toggle" id="themeToggle" title="Tema Değiştir">🌓</button>
                        <a href="../index.html" class="rdm-nav-btn">
                            <span>🏠</span>
                            <span>Ana Sayfa</span>
                        </a>
                        <button class="rdm-nav-btn primary" onclick="rdmNav.showQuickSwitcher()">
                            <span>⚡</span>
                            <span>Hızlı Geçiş</span>
                        </button>
                    </div>

                    <!-- Mobile Toggle -->
                    <button class="rdm-nav-mobile-toggle" id="mobileToggle">☰</button>
                </div>

                <!-- Mobile Menu -->
                <div class="rdm-nav-mobile-menu" id="mobileMenu">
                    ${this.components.map(comp => this.renderNavLink(comp, currentComponent)).join('')}
                    <div style="border-top: 1px solid #e2e8f0; margin: 0.5rem 0; padding-top: 0.5rem;">
                        <a href="../index.html" class="rdm-nav-link">
                            <span>🏠</span>
                            <span>Ana Sayfa</span>
                        </a>
                    </div>
                </div>
            </nav>

            <!-- Back to Top Button -->
            <button class="rdm-back-to-top" id="backToTop" title="Yukarı Çık">↑</button>
        `;

        // Insert navigation at the beginning of body
        document.body.insertAdjacentHTML('afterbegin', nav);
    }

    renderBreadcrumb(currentComponent) {
        if (!currentComponent) return '';
        
        return `
            <div class="rdm-nav-breadcrumb">
                <span>Ana Sayfa</span>
                <span class="rdm-nav-breadcrumb-sep">/</span>
                <span class="rdm-nav-current">${currentComponent.name}</span>
            </div>
        `;
    }

    renderNavLink(component, currentComponent) {
        const isActive = currentComponent && currentComponent.id === component.id;
        
        return `
            <a href="${component.path}" class="rdm-nav-link ${isActive ? 'active' : ''}">
                <span>${component.icon}</span>
                <span>${component.name}</span>
                <span class="rdm-nav-status ${component.status}">${component.status}</span>
            </a>
        `;
    }

    getCurrentComponent() {
        const currentPath = window.location.pathname;
        return this.components.find(comp => currentPath.includes(comp.path.replace('.html', '')));
    }

    attachEventListeners() {
        // Mobile menu toggle
        const mobileToggle = document.getElementById('mobileToggle');
        const mobileMenu = document.getElementById('mobileMenu');
        
        if (mobileToggle && mobileMenu) {
            mobileToggle.addEventListener('click', () => {
                mobileMenu.classList.toggle('open');
            });

            // Close mobile menu when clicking outside
            document.addEventListener('click', (e) => {
                if (!mobileToggle.contains(e.target) && !mobileMenu.contains(e.target)) {
                    mobileMenu.classList.remove('open');
                }
            });
        }

        // Back to top button
        const backToTop = document.getElementById('backToTop');
        if (backToTop) {
            window.addEventListener('scroll', () => {
                if (window.scrollY > 300) {
                    backToTop.classList.add('visible');
                } else {
                    backToTop.classList.remove('visible');
                }
            });

            backToTop.addEventListener('click', () => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
        }

        // Theme toggle
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', this.toggleTheme.bind(this));
            this.initTheme();
        }

        // Keyboard shortcuts
        document.addEventListener('keydown', this.handleKeyboardShortcuts.bind(this));
    }

    toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('rdm-theme', newTheme);
        
        // Update theme toggle icon
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.textContent = newTheme === 'dark' ? '🌞' : '🌓';
        }
    }

    initTheme() {
        const savedTheme = localStorage.getItem('rdm-theme') || 'light';
        document.documentElement.setAttribute('data-theme', savedTheme);
        
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.textContent = savedTheme === 'dark' ? '🌞' : '🌓';
        }
    }

    showQuickSwitcher() {
        // Create modal for quick component switching
        const modal = document.createElement('div');
        modal.className = 'rdm-quick-switcher-modal';
        modal.innerHTML = `
            <div class="rdm-quick-switcher-backdrop" onclick="this.parentElement.remove()"></div>
            <div class="rdm-quick-switcher">
                <div class="rdm-quick-switcher-header">
                    <h3>⚡ Hızlı Geçiş</h3>
                    <button onclick="this.closest('.rdm-quick-switcher-modal').remove()">✕</button>
                </div>
                <div class="rdm-quick-switcher-search">
                    <input type="text" placeholder="Bileşen ara..." id="quickSearch" autofocus>
                </div>
                <div class="rdm-quick-switcher-list">
                    ${this.components.map((comp, index) => `
                        <a href="${comp.path}" class="rdm-quick-switcher-item" data-index="${index}">
                            <span class="rdm-quick-switcher-icon">${comp.icon}</span>
                            <div class="rdm-quick-switcher-info">
                                <div class="rdm-quick-switcher-name">${comp.name}</div>
                                <div class="rdm-quick-switcher-desc">Demo sayfasına git</div>
                            </div>
                            <span class="rdm-quick-switcher-status ${comp.status}">${comp.status}</span>
                        </a>
                    `).join('')}
                </div>
            </div>
        `;

        // Add modal styles
        const modalStyles = `
            <style>
                .rdm-quick-switcher-modal {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    z-index: 2000;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    animation: fadeIn 0.2s ease;
                }

                .rdm-quick-switcher-backdrop {
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0, 0, 0, 0.5);
                    backdrop-filter: blur(4px);
                }

                .rdm-quick-switcher {
                    background: white;
                    border-radius: 16px;
                    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
                    width: 90%;
                    max-width: 500px;
                    max-height: 80vh;
                    overflow: hidden;
                    position: relative;
                    animation: slideUp 0.3s ease;
                }

                .rdm-quick-switcher-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 1.5rem;
                    border-bottom: 1px solid #e2e8f0;
                }

                .rdm-quick-switcher-header h3 {
                    margin: 0;
                    font-size: 1.25rem;
                    color: #1e293b;
                }

                .rdm-quick-switcher-header button {
                    background: none;
                    border: none;
                    font-size: 1.25rem;
                    cursor: pointer;
                    padding: 0.5rem;
                    border-radius: 6px;
                    transition: background 0.2s ease;
                }

                .rdm-quick-switcher-header button:hover {
                    background: #f1f5f9;
                }

                .rdm-quick-switcher-search {
                    padding: 1rem 1.5rem;
                    border-bottom: 1px solid #e2e8f0;
                }

                .rdm-quick-switcher-search input {
                    width: 100%;
                    padding: 0.75rem 1rem;
                    border: 1px solid #d1d5db;
                    border-radius: 8px;
                    font-size: 1rem;
                    outline: none;
                    transition: border-color 0.2s ease;
                }

                .rdm-quick-switcher-search input:focus {
                    border-color: #667eea;
                    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
                }

                .rdm-quick-switcher-list {
                    max-height: 300px;
                    overflow-y: auto;
                }

                .rdm-quick-switcher-item {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    padding: 1rem 1.5rem;
                    text-decoration: none;
                    color: inherit;
                    transition: background 0.2s ease;
                    border-bottom: 1px solid #f1f5f9;
                }

                .rdm-quick-switcher-item:hover,
                .rdm-quick-switcher-item.selected {
                    background: #f8fafc;
                }

                .rdm-quick-switcher-icon {
                    font-size: 1.5rem;
                }

                .rdm-quick-switcher-info {
                    flex: 1;
                }

                .rdm-quick-switcher-name {
                    font-weight: 600;
                    color: #1e293b;
                    margin-bottom: 0.25rem;
                }

                .rdm-quick-switcher-desc {
                    font-size: 0.875rem;
                    color: #64748b;
                }

                .rdm-quick-switcher-status {
                    font-size: 0.75rem;
                    padding: 0.25rem 0.5rem;
                    border-radius: 6px;
                    text-transform: uppercase;
                    font-weight: 600;
                }

                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }

                @keyframes slideUp {
                    from { transform: translateY(20px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
            </style>
        `;

        document.head.insertAdjacentHTML('beforeend', modalStyles);
        document.body.appendChild(modal);

        // Handle search and keyboard navigation
        const searchInput = document.getElementById('quickSearch');
        const items = modal.querySelectorAll('.rdm-quick-switcher-item');
        let selectedIndex = 0;

        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase();
            items.forEach((item, index) => {
                const name = item.querySelector('.rdm-quick-switcher-name').textContent.toLowerCase();
                const visible = name.includes(query);
                item.style.display = visible ? 'flex' : 'none';
            });
        });

        modal.addEventListener('keydown', (e) => {
            const visibleItems = Array.from(items).filter(item => item.style.display !== 'none');
            
            switch(e.key) {
                case 'ArrowDown':
                    e.preventDefault();
                    selectedIndex = Math.min(selectedIndex + 1, visibleItems.length - 1);
                    updateSelection(visibleItems);
                    break;
                case 'ArrowUp':
                    e.preventDefault();
                    selectedIndex = Math.max(selectedIndex - 1, 0);
                    updateSelection(visibleItems);
                    break;
                case 'Enter':
                    e.preventDefault();
                    if (visibleItems[selectedIndex]) {
                        visibleItems[selectedIndex].click();
                    }
                    break;
                case 'Escape':
                    modal.remove();
                    break;
            }
        });

        function updateSelection(visibleItems) {
            visibleItems.forEach((item, index) => {
                item.classList.toggle('selected', index === selectedIndex);
            });
        }

        updateSelection(Array.from(items));
    }

    handleKeyboardShortcuts(e) {
        // Ctrl/Cmd + K for quick switcher
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            this.showQuickSwitcher();
        }

        // Alt + H for home
        if (e.altKey && e.key === 'h') {
            e.preventDefault();
            window.location.href = '../index.html';
        }

        // Alt + 1-5 for direct component navigation
        if (e.altKey && e.key >= '1' && e.key <= '5') {
            e.preventDefault();
            const index = parseInt(e.key) - 1;
            if (this.components[index]) {
                window.location.href = this.components[index].path;
            }
        }
    }

    // Public API
    updateCurrentPage(pageId) {
        this.options.currentPage = pageId;
        // Update active states
        document.querySelectorAll('.rdm-nav-link').forEach(link => {
            link.classList.remove('active');
            if (link.href.includes(pageId)) {
                link.classList.add('active');
            }
        });
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `rdm-notification rdm-notification-${type}`;
        notification.innerHTML = `
            <div class="rdm-notification-content">
                <span>${message}</span>
                <button onclick="this.parentElement.parentElement.remove()">✕</button>
            </div>
        `;

        const styles = `
            <style>
                .rdm-notification {
                    position: fixed;
                    top: 5rem;
                    right: 2rem;
                    background: white;
                    border-radius: 8px;
                    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
                    z-index: 1500;
                    animation: slideInRight 0.3s ease;
                    max-width: 400px;
                }

                .rdm-notification-content {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 1rem 1.5rem;
                    gap: 1rem;
                }

                .rdm-notification-info {
                    border-left: 4px solid #3b82f6;
                }

                .rdm-notification-success {
                    border-left: 4px solid #10b981;
                }

                .rdm-notification-warning {
                    border-left: 4px solid #f59e0b;
                }

                .rdm-notification-error {
                    border-left: 4px solid #ef4444;
                }

                @keyframes slideInRight {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
            </style>
        `;

        if (!document.getElementById('rdm-notification-styles')) {
            document.head.insertAdjacentHTML('beforeend', styles.replace('<style>', '<style id="rdm-notification-styles">'));
        }

        document.body.appendChild(notification);

        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 5000);
    }
}

// Initialize navigation when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.rdmNav = new RDMNavigation();
    
    // Show welcome notification
    setTimeout(() => {
        window.rdmNav.showNotification('🎨 RDM Component Library yüklendi! Ctrl+K ile hızlı geçiş yapabilirsiniz.', 'info');
    }, 1000);
});

// Export for manual initialization
window.RDMNavigation = RDMNavigation; 