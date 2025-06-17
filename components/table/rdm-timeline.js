/**
 * RDM Timeline Table - Chronological Data Display
 * Displays data in a visual timeline format with events and milestones
 */
class RDMTimeline {
    constructor(containerId, options = {}) {
        this.container = document.getElementById(containerId);
        if (!this.container) {
            throw new Error(`Container with ID "${containerId}" not found`);
        }

        // Configuration
        this.options = {
            showFilters: true,
            showHeader: true,
            sortOrder: 'desc', // desc for newest first, asc for oldest first
            filterBy: 'all', // all, completed, in-progress, pending, cancelled
            searchable: true,
            ...options
        };

        // State
        this.data = [];
        this.filteredData = [];
        this.searchTerm = '';
        this.isLoading = false;

        // Initialize
        this.init();
        this.loadSampleData();
    }

    init() {
        this.render();
        this.attachEventListeners();
    }

    render() {
        this.container.innerHTML = `
            <div class="timeline-container">
                ${this.options.showHeader ? this.renderHeader() : ''}
                ${this.options.showFilters ? this.renderFilters() : ''}
                <div class="timeline-wrapper">
                    <div class="timeline-line"></div>
                    <div class="timeline-items" id="timelineItems">
                        ${this.renderLoadingState()}
                    </div>
                </div>
            </div>
        `;
    }

    renderHeader() {
        return `
            <div class="timeline-header">
                <h2>🕐 Proje Zaman Çizelgesi</h2>
                <p>Projelerin kronolojik gelişimini takip edin</p>
            </div>
        `;
    }

    renderFilters() {
        return `
            <div class="timeline-filters">
                <div class="filter-group">
                    <select class="filter-select" id="statusFilter">
                        <option value="all">Tüm Durumlar</option>
                        <option value="completed">Tamamlanan</option>
                        <option value="in-progress">Devam Eden</option>
                        <option value="pending">Bekleyen</option>
                        <option value="cancelled">İptal Edilen</option>
                    </select>
                    <select class="filter-select" id="sortOrder">
                        <option value="desc">Yeni → Eski</option>
                        <option value="asc">Eski → Yeni</option>
                    </select>
                </div>
                <div class="filter-search">
                    <span class="filter-search-icon">🔍</span>
                    <input type="text" placeholder="Proje ara..." id="timelineSearch">
                </div>
            </div>
        `;
    }

    renderTimeline() {
        if (this.isLoading) {
            return this.renderLoadingState();
        }

        if (this.filteredData.length === 0) {
            return this.renderEmptyState();
        }

        return this.filteredData.map(item => this.renderTimelineItem(item)).join('');
    }

    renderTimelineItem(item) {
        const statusColors = {
            'completed': 'completed',
            'in-progress': 'in-progress',
            'pending': 'pending',
            'cancelled': 'cancelled'
        };

        const statusLabels = {
            'completed': 'Tamamlandı',
            'in-progress': 'Devam Ediyor',
            'pending': 'Bekliyor',
            'cancelled': 'İptal Edildi'
        };

        return `
            <div class="timeline-item" data-id="${item.id}">
                <div class="timeline-content">
                    <div class="timeline-status ${statusColors[item.status]}"></div>
                    <div class="timeline-date">
                        📅 ${this.formatDate(item.date)}
                    </div>
                    <h3 class="timeline-title">${item.title}</h3>
                    <p class="timeline-description">${item.description}</p>
                    
                    <div class="timeline-details">
                        <div class="timeline-detail">
                            <div class="timeline-detail-label">Durum</div>
                            <div class="timeline-detail-value">${statusLabels[item.status]}</div>
                        </div>
                        <div class="timeline-detail">
                            <div class="timeline-detail-label">Kategori</div>
                            <div class="timeline-detail-value">${item.category}</div>
                        </div>
                        <div class="timeline-detail">
                            <div class="timeline-detail-label">Öncelik</div>
                            <div class="timeline-detail-value">${item.priority}</div>
                        </div>
                        <div class="timeline-detail">
                            <div class="timeline-detail-label">Süre</div>
                            <div class="timeline-detail-value">${item.duration}</div>
                        </div>
                    </div>

                    ${item.tags ? `
                        <div class="timeline-tags">
                            ${item.tags.map(tag => `<span class="timeline-tag">${tag}</span>`).join('')}
                        </div>
                    ` : ''}

                    <div class="timeline-actions">
                        <button class="timeline-btn primary" onclick="timelineInstance.viewDetails(${item.id})">
                            👁️ Detaylar
                        </button>
                        <button class="timeline-btn" onclick="timelineInstance.editItem(${item.id})">
                            ✏️ Düzenle
                        </button>
                        ${item.link ? `<a href="${item.link}" class="timeline-btn" target="_blank">🔗 Bağlantı</a>` : ''}
                    </div>
                </div>
                <div class="timeline-dot"></div>
            </div>
        `;
    }

    renderLoadingState() {
        return Array.from({ length: 6 }, (_, i) => `
            <div class="timeline-skeleton">
                <div class="skeleton-content"></div>
                <div class="skeleton-dot"></div>
            </div>
        `).join('');
    }

    renderEmptyState() {
        return `
            <div class="timeline-empty">
                <div class="timeline-empty-icon">📅</div>
                <h3>Henüz Etkinlik Yok</h3>
                <p>Filtreleme kriterlerinize uygun etkinlik bulunamadı.</p>
            </div>
        `;
    }

    attachEventListeners() {
        // Status filter
        const statusFilter = document.getElementById('statusFilter');
        if (statusFilter) {
            statusFilter.addEventListener('change', (e) => {
                this.options.filterBy = e.target.value;
                this.applyFilters();
            });
        }

        // Sort order
        const sortOrder = document.getElementById('sortOrder');
        if (sortOrder) {
            sortOrder.addEventListener('change', (e) => {
                this.options.sortOrder = e.target.value;
                this.applyFilters();
            });
        }

        // Search
        const searchInput = document.getElementById('timelineSearch');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.searchTerm = e.target.value.toLowerCase();
                this.applyFilters();
            });
        }
    }

    applyFilters() {
        this.filteredData = this.data.filter(item => {
            // Status filter
            const statusMatch = this.options.filterBy === 'all' || item.status === this.options.filterBy;

            // Search filter
            const searchMatch = !this.searchTerm || 
                item.title.toLowerCase().includes(this.searchTerm) ||
                item.description.toLowerCase().includes(this.searchTerm) ||
                item.category.toLowerCase().includes(this.searchTerm) ||
                (item.tags && item.tags.some(tag => tag.toLowerCase().includes(this.searchTerm)));

            return statusMatch && searchMatch;
        });

        this.sortData();
        this.updateDisplay();
    }

    sortData() {
        this.filteredData.sort((a, b) => {
            const dateA = new Date(a.date);
            const dateB = new Date(b.date);
            
            return this.options.sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
        });
    }

    updateDisplay() {
        const timelineItems = document.getElementById('timelineItems');
        if (timelineItems) {
            timelineItems.innerHTML = this.renderTimeline();
        }
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        // Relative time for recent dates
        if (diffDays === 0) {
            return 'Bugün';
        } else if (diffDays === 1) {
            return date < now ? 'Dün' : 'Yarın';
        } else if (diffDays < 7) {
            return `${diffDays} gün ${date < now ? 'önce' : 'sonra'}`;
        }

        // Regular date format
        return date.toLocaleDateString('tr-TR', {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        });
    }

    loadSampleData() {
        this.isLoading = true;
        this.updateDisplay();

        // Simulate loading delay
        setTimeout(() => {
            this.data = this.generateSampleData();
            this.filteredData = [...this.data];
            this.isLoading = false;
            this.applyFilters();
        }, 1500);
    }

    generateSampleData() {
        const statuses = ['completed', 'in-progress', 'pending', 'cancelled'];
        const categories = ['Geliştirme', 'Tasarım', 'Test', 'Deployment', 'Analiz', 'Planlama'];
        const priorities = ['Yüksek', 'Orta', 'Düşük'];
        
        const projects = [
            {
                title: 'Web Sitesi Yenileme Projesi',
                description: 'Şirket web sitesinin tamamen yeniden tasarlanması ve modern teknolojilerle geliştirilmesi.',
                category: 'Geliştirme',
                tags: ['React', 'Node.js', 'MongoDB'],
                link: 'https://example.com'
            },
            {
                title: 'Mobil Uygulama Lansmanı',
                description: 'iOS ve Android platformları için mobil uygulamanın mağazalarda yayınlanması.',
                category: 'Deployment',
                tags: ['React Native', 'Firebase', 'Push Notifications']
            },
            {
                title: 'Kullanıcı Deneyimi Araştırması',
                description: 'Mevcut ürünlerin kullanıcı deneyiminin analiz edilmesi ve iyileştirme önerilerinin hazırlanması.',
                category: 'Analiz',
                tags: ['UX Research', 'User Testing', 'Analytics']
            },
            {
                title: 'API Güvenlik Güncellemesi',
                description: 'Tüm API endpoints için güvenlik açıklarının kapatılması ve JWT token sisteminin implementasyonu.',
                category: 'Geliştirme',
                tags: ['Security', 'JWT', 'API']
            },
            {
                title: 'Veritabanı Optimizasyonu',
                description: 'Performans sorunlarının çözülmesi için veritabanı sorguları ve indekslerin optimize edilmesi.',
                category: 'Geliştirme',
                tags: ['Database', 'Performance', 'SQL']
            },
            {
                title: 'CI/CD Pipeline Kurulumu',
                description: 'Otomatik deployment ve test süreçleri için Jenkins pipeline kurulumu.',
                category: 'Deployment',
                tags: ['Jenkins', 'Docker', 'AWS']
            },
            {
                title: 'Brand Identity Tasarımı',
                description: 'Şirket kimliği için logo, renk paleti ve tipografi çalışmalarının tamamlanması.',
                category: 'Tasarım',
                tags: ['Branding', 'Logo', 'Design System']
            },
            {
                title: 'E-ticaret Entegrasyonu',
                description: 'Mevcut sisteme e-ticaret modülünün entegre edilmesi ve ödeme sistemlerinin kurulması.',
                category: 'Geliştirme',
                tags: ['E-commerce', 'Payment', 'Integration']
            },
            {
                title: 'Performans Test Süreci',
                description: 'Yük testleri ve stress testleri ile sistem performansının değerlendirilmesi.',
                category: 'Test',
                tags: ['Load Testing', 'Performance', 'JMeter']
            },
            {
                title: 'Sosyal Medya Kampanyası',
                description: 'Yeni ürün lansmanı için sosyal medya stratejisinin geliştirilmesi ve uygulanması.',
                category: 'Planlama',
                tags: ['Social Media', 'Marketing', 'Campaign']
            }
        ];

        return projects.map((project, index) => ({
            id: index + 1,
            ...project,
            status: statuses[Math.floor(Math.random() * statuses.length)],
            priority: priorities[Math.floor(Math.random() * priorities.length)],
            duration: `${Math.floor(Math.random() * 12) + 1} hafta`,
            date: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        }));
    }

    // Public API methods
    viewDetails(id) {
        const item = this.data.find(item => item.id === id);
        if (item) {
            alert(`📋 Proje Detayları\n\n${item.title}\n\n${item.description}\n\nDurum: ${item.status}\nKategori: ${item.category}\nÖncelik: ${item.priority}`);
        }
    }

    editItem(id) {
        const item = this.data.find(item => item.id === id);
        if (item) {
            alert(`✏️ Düzenleme\n\n"${item.title}" projesini düzenlemek için form açılacak.`);
        }
    }

    addItem(itemData) {
        const newItem = {
            id: Math.max(...this.data.map(item => item.id)) + 1,
            ...itemData,
            date: itemData.date || new Date().toISOString().split('T')[0]
        };
        
        this.data.push(newItem);
        this.applyFilters();
        return newItem;
    }

    updateItem(id, updates) {
        const itemIndex = this.data.findIndex(item => item.id === id);
        if (itemIndex !== -1) {
            this.data[itemIndex] = { ...this.data[itemIndex], ...updates };
            this.applyFilters();
            return this.data[itemIndex];
        }
        return null;
    }

    removeItem(id) {
        const itemIndex = this.data.findIndex(item => item.id === id);
        if (itemIndex !== -1) {
            const removedItem = this.data.splice(itemIndex, 1)[0];
            this.applyFilters();
            return removedItem;
        }
        return null;
    }

    setData(data) {
        this.data = data;
        this.filteredData = [...data];
        this.applyFilters();
    }

    getData() {
        return this.data;
    }

    getFilteredData() {
        return this.filteredData;
    }

    refresh() {
        this.applyFilters();
    }

    destroy() {
        // Cleanup event listeners and DOM
        this.container.innerHTML = '';
    }
}

// Export for use
window.RDMTimeline = RDMTimeline; 