/**
 * RDM Card Grid Table - Modern Card Layout Component
 * Displays tabular data in a responsive card grid format
 */
class RDMCardGrid {
    constructor(containerId, options = {}) {
        this.container = document.getElementById(containerId);
        if (!this.container) {
            throw new Error(`Container with ID "${containerId}" not found`);
        }

        // Configuration
        this.options = {
            itemsPerPage: 12,
            searchable: true,
            sortable: true,
            pagination: true,
            showHeader: true,
            showToolbar: true,
            ...options
        };

        // State
        this.data = [];
        this.filteredData = [];
        this.currentPage = 1;
        this.sortField = 'name';
        this.sortDirection = 'asc';
        this.searchTerm = '';
        this.isLoading = false;
        this.viewMode = 'cards'; // cards or list

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
            <div class="cardgrid-container">
                ${this.options.showHeader ? this.renderHeader() : ''}
                ${this.options.showToolbar ? this.renderToolbar() : ''}
                <div class="cardgrid-wrapper">
                    <div class="cards-grid" id="cardsGrid">
                        ${this.renderLoadingState()}
                    </div>
                    ${this.options.pagination ? this.renderPagination() : ''}
                </div>
            </div>
        `;
    }

    renderHeader() {
        return `
            <div class="cardgrid-header">
                <h2>👥 Çalışan Profilleri</h2>
                <p>Modern kart görünümü ile personel bilgilerini keşfedin</p>
            </div>
        `;
    }

    renderToolbar() {
        return `
            <div class="cardgrid-toolbar">
                <div class="view-controls">
                    <button class="view-btn ${this.viewMode === 'cards' ? 'active' : ''}" data-view="cards">
                        🎴 Kart Görünümü
                    </button>
                    <button class="view-btn ${this.viewMode === 'list' ? 'active' : ''}" data-view="list">
                        📋 Liste Görünümü
                    </button>
                </div>
                <div class="search-filter-group">
                    <div class="search-box">
                        <span class="search-icon">🔍</span>
                        <input type="text" class="search-input" placeholder="Çalışan ara..." id="searchInput">
                    </div>
                    <select class="sort-select" id="sortSelect">
                        <option value="name-asc">Ad (A-Z)</option>
                        <option value="name-desc">Ad (Z-A)</option>
                        <option value="department-asc">Departman (A-Z)</option>
                        <option value="salary-desc">Maaş (Yüksek-Düşük)</option>
                        <option value="salary-asc">Maaş (Düşük-Yüksek)</option>
                        <option value="startDate-desc">Başlangıç (Yeni-Eski)</option>
                    </select>
                </div>
            </div>
        `;
    }

    renderCards() {
        if (this.isLoading) {
            return this.renderLoadingState();
        }

        if (this.filteredData.length === 0) {
            return this.renderEmptyState();
        }

        const startIndex = (this.currentPage - 1) * this.options.itemsPerPage;
        const endIndex = startIndex + this.options.itemsPerPage;
        const pageData = this.filteredData.slice(startIndex, endIndex);

        return pageData.map(employee => this.renderCard(employee)).join('');
    }

    renderCard(employee) {
        const initials = employee.name.split(' ').map(n => n[0]).join('').toUpperCase();
        const formattedSalary = new Intl.NumberFormat('tr-TR', {
            style: 'currency',
            currency: 'TRY'
        }).format(employee.salary);

        return `
            <div class="employee-card" data-id="${employee.id}">
                <div class="card-header">
                    <div class="card-avatar">${initials}</div>
                    <div class="card-info">
                        <div class="card-name">${employee.name}</div>
                        <div class="card-email">${employee.email}</div>
                    </div>
                </div>
                <div class="card-body">
                    <div class="card-field">
                        <div class="card-label">Departman</div>
                        <div class="card-value">${employee.department}</div>
                    </div>
                    <div class="card-field">
                        <div class="card-label">Pozisyon</div>
                        <div class="card-value">${employee.position}</div>
                    </div>
                    <div class="card-field">
                        <div class="card-label">Maaş</div>
                        <div class="card-value salary">${formattedSalary}</div>
                    </div>
                    <div class="card-field">
                        <div class="card-label">Durum</div>
                        <div class="card-value">
                            <span class="status-badge ${employee.status.toLowerCase()}">${employee.status}</span>
                        </div>
                    </div>
                    <div class="card-field">
                        <div class="card-label">Başlangıç</div>
                        <div class="card-value">${this.formatDate(employee.startDate)}</div>
                    </div>
                    <div class="card-field">
                        <div class="card-label">Telefon</div>
                        <div class="card-value">${employee.phone}</div>
                    </div>
                </div>
                <div class="card-actions">
                    <div class="card-id">#${employee.id}</div>
                    <button class="card-menu" title="Menü">⋮</button>
                </div>
            </div>
        `;
    }

    renderLoadingState() {
        return Array.from({ length: 8 }, (_, i) => `
            <div class="skeleton-card">
                <div class="skeleton-header">
                    <div class="skeleton-avatar"></div>
                    <div class="skeleton-info">
                        <div class="skeleton-name"></div>
                        <div class="skeleton-email"></div>
                    </div>
                </div>
                <div class="skeleton-body">
                    <div class="skeleton-field"></div>
                    <div class="skeleton-field"></div>
                    <div class="skeleton-field"></div>
                    <div class="skeleton-field"></div>
                </div>
            </div>
        `).join('');
    }

    renderEmptyState() {
        return `
            <div class="empty-state">
                <div class="empty-state-icon">🔍</div>
                <h3>Sonuç Bulunamadı</h3>
                <p>Arama kriterlerinize uygun çalışan bulunamadı.</p>
            </div>
        `;
    }

    renderPagination() {
        const totalPages = Math.ceil(this.filteredData.length / this.options.itemsPerPage);
        if (totalPages <= 1) return '';

        let pagination = '<div class="cardgrid-pagination">';
        
        // Previous button
        pagination += `
            <button class="page-btn" ${this.currentPage === 1 ? 'disabled' : ''} data-page="${this.currentPage - 1}">
                ‹ Önceki
            </button>
        `;

        // Page numbers
        const startPage = Math.max(1, this.currentPage - 2);
        const endPage = Math.min(totalPages, this.currentPage + 2);

        if (startPage > 1) {
            pagination += '<button class="page-btn" data-page="1">1</button>';
            if (startPage > 2) {
                pagination += '<span class="page-btn">...</span>';
            }
        }

        for (let i = startPage; i <= endPage; i++) {
            pagination += `
                <button class="page-btn ${i === this.currentPage ? 'active' : ''}" data-page="${i}">
                    ${i}
                </button>
            `;
        }

        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                pagination += '<span class="page-btn">...</span>';
            }
            pagination += `<button class="page-btn" data-page="${totalPages}">${totalPages}</button>`;
        }

        // Next button
        pagination += `
            <button class="page-btn" ${this.currentPage === totalPages ? 'disabled' : ''} data-page="${this.currentPage + 1}">
                Sonraki ›
            </button>
        `;

        pagination += '</div>';
        return pagination;
    }

    attachEventListeners() {
        // Search
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.searchTerm = e.target.value.toLowerCase();
                this.applyFilters();
            });
        }

        // Sort
        const sortSelect = document.getElementById('sortSelect');
        if (sortSelect) {
            sortSelect.addEventListener('change', (e) => {
                const [field, direction] = e.target.value.split('-');
                this.sortField = field;
                this.sortDirection = direction;
                this.applyFilters();
            });
        }

        // View mode
        this.container.addEventListener('click', (e) => {
            if (e.target.classList.contains('view-btn')) {
                const viewMode = e.target.dataset.view;
                this.setViewMode(viewMode);
            }
        });

        // Pagination
        this.container.addEventListener('click', (e) => {
            if (e.target.classList.contains('page-btn') && e.target.dataset.page) {
                const page = parseInt(e.target.dataset.page);
                this.goToPage(page);
            }
        });

        // Card actions
        this.container.addEventListener('click', (e) => {
            if (e.target.classList.contains('card-menu')) {
                const card = e.target.closest('.employee-card');
                const employeeId = card.dataset.id;
                this.showCardMenu(employeeId, e.target);
            }
        });
    }

    setViewMode(mode) {
        this.viewMode = mode;
        
        // Update view buttons
        const viewBtns = this.container.querySelectorAll('.view-btn');
        viewBtns.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.view === mode);
        });

        // Update grid class for different layouts
        const cardsGrid = document.getElementById('cardsGrid');
        if (mode === 'list') {
            cardsGrid.style.gridTemplateColumns = '1fr';
            cardsGrid.style.gap = '0.75rem';
        } else {
            cardsGrid.style.gridTemplateColumns = 'repeat(auto-fill, minmax(320px, 1fr))';
            cardsGrid.style.gap = '1.5rem';
        }
    }

    applyFilters() {
        this.filteredData = this.data.filter(employee => {
            const searchMatch = !this.searchTerm || 
                employee.name.toLowerCase().includes(this.searchTerm) ||
                employee.email.toLowerCase().includes(this.searchTerm) ||
                employee.department.toLowerCase().includes(this.searchTerm) ||
                employee.position.toLowerCase().includes(this.searchTerm);

            return searchMatch;
        });

        this.sortData();
        this.currentPage = 1;
        this.updateDisplay();
    }

    sortData() {
        this.filteredData.sort((a, b) => {
            let aValue = a[this.sortField];
            let bValue = b[this.sortField];

            // Handle different data types
            if (this.sortField === 'salary') {
                aValue = parseFloat(aValue);
                bValue = parseFloat(bValue);
            } else if (this.sortField === 'startDate') {
                aValue = new Date(aValue);
                bValue = new Date(bValue);
            } else {
                aValue = aValue.toString().toLowerCase();
                bValue = bValue.toString().toLowerCase();
            }

            if (aValue < bValue) return this.sortDirection === 'asc' ? -1 : 1;
            if (aValue > bValue) return this.sortDirection === 'asc' ? 1 : -1;
            return 0;
        });
    }

    updateDisplay() {
        const cardsGrid = document.getElementById('cardsGrid');
        if (cardsGrid) {
            cardsGrid.innerHTML = this.renderCards();
        }

        // Update pagination
        const paginationContainer = this.container.querySelector('.cardgrid-pagination');
        if (paginationContainer) {
            paginationContainer.outerHTML = this.renderPagination();
        }
    }

    goToPage(page) {
        const totalPages = Math.ceil(this.filteredData.length / this.options.itemsPerPage);
        if (page >= 1 && page <= totalPages) {
            this.currentPage = page;
            this.updateDisplay();
            
            // Scroll to top of cards
            const cardsGrid = document.getElementById('cardsGrid');
            if (cardsGrid) {
                cardsGrid.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }
    }

    showCardMenu(employeeId, button) {
        // Simple menu implementation
        const employee = this.data.find(emp => emp.id == employeeId);
        if (employee) {
            alert(`Çalışan Menüsü: ${employee.name}\n\n• Profili Görüntüle\n• Düzenle\n• Sil\n• Rapor Al`);
        }
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('tr-TR', {
            day: '2-digit',
            month: '2-digit',
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
        const departments = ['İnsan Kaynakları', 'Bilgi İşlem', 'Pazarlama', 'Satış', 'Muhasebe', 'Operasyon', 'Ar-Ge'];
        const positions = ['Uzman', 'Kıdemli Uzman', 'Müdür', 'Müdür Yardımcısı', 'Direktör', 'Koordinatör', 'Analyst'];
        const statuses = ['Active', 'Inactive'];
        
        const sampleNames = [
            'Ahmet Yılmaz', 'Ayşe Kaya', 'Mehmet Demir', 'Fatma Şahin', 'Ali Çelik',
            'Zeynep Arslan', 'Mustafa Koç', 'Elif Özkan', 'Emre Yıldız', 'Seda Aydın',
            'Burak Öztürk', 'Gamze Polat', 'Oğuz Erdoğan', 'Deniz Kılıç', 'Cem Güler',
            'Pınar Akın', 'Serkan Doğan', 'Esra Yavuz', 'Tolga Karaca', 'Neslihan Özer',
            'Kemal Taş', 'Sibel Uçar', 'Murat Keskin', 'Gülşen Acar', 'Hakan Bozkurt',
            'Derya Çiftçi', 'İbrahim Kara', 'Tülay Sezer', 'Yasin Aktaş', 'Burcu Tunç'
        ];

        return Array.from({ length: 30 }, (_, i) => {
            const name = sampleNames[i] || `Çalışan ${i + 1}`;
            const firstName = name.split(' ')[0].toLowerCase();
            const lastName = name.split(' ')[1]?.toLowerCase() || 'test';
            
            return {
                id: i + 1,
                name: name,
                email: `${firstName}.${lastName}@sirket.com`,
                department: departments[Math.floor(Math.random() * departments.length)],
                position: positions[Math.floor(Math.random() * positions.length)],
                salary: Math.floor(Math.random() * 50000) + 15000,
                status: statuses[Math.floor(Math.random() * statuses.length)],
                phone: `0${Math.floor(Math.random() * 900) + 500} ${Math.floor(Math.random() * 900) + 100} ${Math.floor(Math.random() * 90) + 10} ${Math.floor(Math.random() * 90) + 10}`,
                startDate: new Date(2020 + Math.floor(Math.random() * 4), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString().split('T')[0]
            };
        });
    }

    // Public API methods
    setData(data) {
        this.data = data;
        this.filteredData = [...data];
        this.currentPage = 1;
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
window.RDMCardGrid = RDMCardGrid; 