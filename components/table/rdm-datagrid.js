/**
 * RDM Data Grid Table
 * Advanced table with sorting, filtering, pagination, and search
 */

class RDMDataGrid {
  constructor(containerId, options = {}) {
    this.container = document.getElementById(containerId);
    this.options = {
      pageSize: 10,
      pageSizes: [5, 10, 25, 50, 100],
      sortable: true,
      filterable: true,
      searchable: true,
      selectable: true,
      exportable: true,
      ...options
    };
    
    this.data = [];
    this.filteredData = [];
    this.currentPage = 1;
    this.sortColumn = null;
    this.sortDirection = 'asc';
    this.selectedRows = new Set();
    this.filters = {};
    this.searchTerm = '';
    
    this.init();
  }
  
  init() {
    this.render();
    this.attachEvents();
    this.generateSampleData();
  }
  
  generateSampleData() {
    const departments = ['IT', 'HR', 'Finance', 'Marketing', 'Sales', 'Operations'];
    const positions = ['Manager', 'Developer', 'Analyst', 'Coordinator', 'Specialist', 'Director'];
    const cities = ['Istanbul', 'Ankara', 'Izmir', 'Bursa', 'Antalya', 'Adana'];
    
    this.data = Array.from({ length: 150 }, (_, i) => ({
      id: i + 1,
      name: `Çalışan ${i + 1}`,
      email: `calisan${i + 1}@company.com`,
      department: departments[Math.floor(Math.random() * departments.length)],
      position: positions[Math.floor(Math.random() * positions.length)],
      salary: Math.floor(Math.random() * 50000) + 30000,
      city: cities[Math.floor(Math.random() * cities.length)],
      startDate: new Date(2020 + Math.floor(Math.random() * 4), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toLocaleDateString('tr-TR'),
      status: Math.random() > 0.2 ? 'Aktif' : 'Pasif'
    }));
    
    this.filteredData = [...this.data];
    this.updateTable();
  }
  
  render() {
    this.container.innerHTML = `
      <div class="datagrid-container">
        <div class="datagrid-header">
          <div class="datagrid-title">
            <h2>📊 Gelişmiş Veri Tablosu</h2>
            <p>Sıralama, filtreleme, arama ve sayfalama özellikleri</p>
          </div>
          <div class="datagrid-toolbar">
            <div class="search-box">
              <span class="search-icon">🔍</span>
              <input type="text" class="search-input" placeholder="Ara..." id="searchInput">
            </div>
            <div class="filter-dropdown">
              <button class="filter-btn" id="filterBtn">
                🔽 Filtrele
              </button>
              <div class="filter-menu" id="filterMenu">
                <div class="filter-group">
                  <label class="filter-label">Departman</label>
                  <select class="filter-input" id="departmentFilter">
                    <option value="">Tümü</option>
                    <option value="IT">IT</option>
                    <option value="HR">HR</option>
                    <option value="Finance">Finance</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Sales">Sales</option>
                    <option value="Operations">Operations</option>
                  </select>
                </div>
                <div class="filter-group">
                  <label class="filter-label">Durum</label>
                  <select class="filter-input" id="statusFilter">
                    <option value="">Tümü</option>
                    <option value="Aktif">Aktif</option>
                    <option value="Pasif">Pasif</option>
                  </select>
                </div>
                <div class="filter-group">
                  <label class="filter-label">Maaş Aralığı</label>
                  <input type="number" class="filter-input" id="minSalary" placeholder="Min maaş">
                  <input type="number" class="filter-input" id="maxSalary" placeholder="Max maaş" style="margin-top: 0.5rem;">
                </div>
                <div class="filter-actions">
                  <button class="filter-apply" id="applyFilters">Uygula</button>
                  <button class="filter-clear" id="clearFilters">Temizle</button>
                </div>
              </div>
            </div>
            <button class="export-btn" id="exportBtn">📥 Dışa Aktar</button>
          </div>
        </div>
        
        <div class="datagrid-wrapper">
          <div class="loading-overlay" id="loadingOverlay">
            <div class="loading-spinner"></div>
          </div>
          <table class="datagrid-table">
            <thead>
              <tr>
                <th><input type="checkbox" class="row-checkbox" id="selectAll"></th>
                <th class="sortable" data-column="id">ID <span class="sort-icon">▼</span></th>
                <th class="sortable" data-column="name">Ad Soyad <span class="sort-icon">▼</span></th>
                <th class="sortable" data-column="email">E-mail <span class="sort-icon">▼</span></th>
                <th class="sortable" data-column="department">Departman <span class="sort-icon">▼</span></th>
                <th class="sortable" data-column="position">Pozisyon <span class="sort-icon">▼</span></th>
                <th class="sortable" data-column="salary">Maaş <span class="sort-icon">▼</span></th>
                <th class="sortable" data-column="city">Şehir <span class="sort-icon">▼</span></th>
                <th class="sortable" data-column="startDate">Başlangıç <span class="sort-icon">▼</span></th>
                <th class="sortable" data-column="status">Durum <span class="sort-icon">▼</span></th>
              </tr>
            </thead>
            <tbody id="tableBody">
            </tbody>
          </table>
        </div>
        
        <div class="datagrid-footer">
          <div class="records-info" id="recordsInfo">
            Toplam 0 kayıt
          </div>
          <div class="pagination" id="pagination">
          </div>
          <div class="page-size-selector">
            <span>Sayfa başına:</span>
            <select class="page-size-select" id="pageSizeSelect">
              <option value="5">5</option>
              <option value="10" selected>10</option>
              <option value="25">25</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>
          </div>
        </div>
      </div>
    `;
  }
  
  attachEvents() {
    // Search
    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', (e) => {
      this.searchTerm = e.target.value.toLowerCase();
      this.applyFiltersAndSearch();
    });
    
    // Sort
    const sortableHeaders = document.querySelectorAll('.sortable');
    sortableHeaders.forEach(header => {
      header.addEventListener('click', () => {
        const column = header.dataset.column;
        this.sort(column);
      });
    });
    
    // Filter dropdown
    const filterBtn = document.getElementById('filterBtn');
    const filterMenu = document.getElementById('filterMenu');
    
    filterBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      filterMenu.classList.toggle('show');
    });
    
    document.addEventListener('click', () => {
      filterMenu.classList.remove('show');
    });
    
    filterMenu.addEventListener('click', (e) => {
      e.stopPropagation();
    });
    
    // Filter actions
    document.getElementById('applyFilters').addEventListener('click', () => {
      this.applyFilters();
      filterMenu.classList.remove('show');
    });
    
    document.getElementById('clearFilters').addEventListener('click', () => {
      this.clearFilters();
    });
    
    // Page size
    document.getElementById('pageSizeSelect').addEventListener('change', (e) => {
      this.options.pageSize = parseInt(e.target.value);
      this.currentPage = 1;
      this.updateTable();
    });
    
    // Select all
    document.getElementById('selectAll').addEventListener('change', (e) => {
      this.selectAll(e.target.checked);
    });
    
    // Export
    document.getElementById('exportBtn').addEventListener('click', () => {
      this.exportData();
    });
  }
  
  sort(column) {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
    
    this.filteredData.sort((a, b) => {
      let aVal = a[column];
      let bVal = b[column];
      
      // Handle different data types
      if (column === 'salary') {
        aVal = parseFloat(aVal);
        bVal = parseFloat(bVal);
      } else if (column === 'startDate') {
        aVal = new Date(aVal.split('.').reverse().join('-'));
        bVal = new Date(bVal.split('.').reverse().join('-'));
      } else {
        aVal = aVal.toString().toLowerCase();
        bVal = bVal.toString().toLowerCase();
      }
      
      if (aVal < bVal) return this.sortDirection === 'asc' ? -1 : 1;
      if (aVal > bVal) return this.sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
    
    this.updateSortIcons();
    this.currentPage = 1;
    this.updateTable();
  }
  
  updateSortIcons() {
    document.querySelectorAll('.sortable').forEach(header => {
      header.classList.remove('asc', 'desc');
      if (header.dataset.column === this.sortColumn) {
        header.classList.add(this.sortDirection);
      }
    });
  }
  
  applyFilters() {
    const department = document.getElementById('departmentFilter').value;
    const status = document.getElementById('statusFilter').value;
    const minSalary = document.getElementById('minSalary').value;
    const maxSalary = document.getElementById('maxSalary').value;
    
    this.filters = {
      department,
      status,
      minSalary: minSalary ? parseFloat(minSalary) : null,
      maxSalary: maxSalary ? parseFloat(maxSalary) : null
    };
    
    this.applyFiltersAndSearch();
  }
  
  clearFilters() {
    document.getElementById('departmentFilter').value = '';
    document.getElementById('statusFilter').value = '';
    document.getElementById('minSalary').value = '';
    document.getElementById('maxSalary').value = '';
    
    this.filters = {};
    this.applyFiltersAndSearch();
  }
  
  applyFiltersAndSearch() {
    this.showLoading();
    
    setTimeout(() => {
      this.filteredData = this.data.filter(row => {
        // Search filter
        if (this.searchTerm) {
          const searchableText = Object.values(row).join(' ').toLowerCase();
          if (!searchableText.includes(this.searchTerm)) {
            return false;
          }
        }
        
        // Column filters
        if (this.filters.department && row.department !== this.filters.department) {
          return false;
        }
        
        if (this.filters.status && row.status !== this.filters.status) {
          return false;
        }
        
        if (this.filters.minSalary && row.salary < this.filters.minSalary) {
          return false;
        }
        
        if (this.filters.maxSalary && row.salary > this.filters.maxSalary) {
          return false;
        }
        
        return true;
      });
      
      this.currentPage = 1;
      this.hideLoading();
      this.updateTable();
    }, 500);
  }
  
  updateTable() {
    const startIndex = (this.currentPage - 1) * this.options.pageSize;
    const endIndex = startIndex + this.options.pageSize;
    const pageData = this.filteredData.slice(startIndex, endIndex);
    
    const tbody = document.getElementById('tableBody');
    tbody.innerHTML = pageData.map(row => `
      <tr class="${this.selectedRows.has(row.id) ? 'selected-row' : ''}">
        <td><input type="checkbox" class="row-checkbox" data-id="${row.id}" ${this.selectedRows.has(row.id) ? 'checked' : ''}></td>
        <td>${row.id}</td>
        <td>${row.name}</td>
        <td>${row.email}</td>
        <td>${row.department}</td>
        <td>${row.position}</td>
        <td>${row.salary.toLocaleString('tr-TR')} ₺</td>
        <td>${row.city}</td>
        <td>${row.startDate}</td>
        <td><span class="badge ${row.status === 'Aktif' ? 'badge-success' : 'badge-secondary'}">${row.status}</span></td>
      </tr>
    `).join('');
    
    // Attach row selection events
    tbody.querySelectorAll('.row-checkbox').forEach(checkbox => {
      checkbox.addEventListener('change', (e) => {
        const id = parseInt(e.target.dataset.id);
        if (e.target.checked) {
          this.selectedRows.add(id);
        } else {
          this.selectedRows.delete(id);
        }
        this.updateRowSelection();
      });
    });
    
    this.updatePagination();
    this.updateRecordsInfo();
  }
  
  updatePagination() {
    const totalPages = Math.ceil(this.filteredData.length / this.options.pageSize);
    const pagination = document.getElementById('pagination');
    
    let paginationHTML = '';
    
    // Previous button
    paginationHTML += `<button class="page-btn" ${this.currentPage === 1 ? 'disabled' : ''} onclick="dataGrid.goToPage(${this.currentPage - 1})">‹</button>`;
    
    // Page numbers
    const startPage = Math.max(1, this.currentPage - 2);
    const endPage = Math.min(totalPages, this.currentPage + 2);
    
    if (startPage > 1) {
      paginationHTML += `<button class="page-btn" onclick="dataGrid.goToPage(1)">1</button>`;
      if (startPage > 2) {
        paginationHTML += `<span class="page-btn" disabled>...</span>`;
      }
    }
    
    for (let i = startPage; i <= endPage; i++) {
      paginationHTML += `<button class="page-btn ${i === this.currentPage ? 'active' : ''}" onclick="dataGrid.goToPage(${i})">${i}</button>`;
    }
    
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        paginationHTML += `<span class="page-btn" disabled>...</span>`;
      }
      paginationHTML += `<button class="page-btn" onclick="dataGrid.goToPage(${totalPages})">${totalPages}</button>`;
    }
    
    // Next button
    paginationHTML += `<button class="page-btn" ${this.currentPage === totalPages ? 'disabled' : ''} onclick="dataGrid.goToPage(${this.currentPage + 1})">›</button>`;
    
    pagination.innerHTML = paginationHTML;
  }
  
  updateRecordsInfo() {
    const startRecord = (this.currentPage - 1) * this.options.pageSize + 1;
    const endRecord = Math.min(this.currentPage * this.options.pageSize, this.filteredData.length);
    const totalRecords = this.filteredData.length;
    
    document.getElementById('recordsInfo').textContent = 
      `${startRecord}-${endRecord} / ${totalRecords} kayıt (${this.selectedRows.size} seçili)`;
  }
  
  goToPage(page) {
    const totalPages = Math.ceil(this.filteredData.length / this.options.pageSize);
    if (page >= 1 && page <= totalPages) {
      this.currentPage = page;
      this.updateTable();
    }
  }
  
  selectAll(checked) {
    if (checked) {
      this.filteredData.forEach(row => this.selectedRows.add(row.id));
    } else {
      this.selectedRows.clear();
    }
    this.updateTable();
  }
  
  updateRowSelection() {
    const tbody = document.getElementById('tableBody');
    tbody.querySelectorAll('tr').forEach((row, index) => {
      const checkbox = row.querySelector('.row-checkbox');
      if (checkbox && checkbox.checked) {
        row.classList.add('selected-row');
      } else {
        row.classList.remove('selected-row');
      }
    });
    this.updateRecordsInfo();
  }
  
  exportData() {
    const selectedData = this.selectedRows.size > 0 
      ? this.filteredData.filter(row => this.selectedRows.has(row.id))
      : this.filteredData;
    
    const csvContent = this.convertToCSV(selectedData);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `calisan_verileri_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }
  
  convertToCSV(data) {
    const headers = ['ID', 'Ad Soyad', 'E-mail', 'Departman', 'Pozisyon', 'Maaş', 'Şehir', 'Başlangıç', 'Durum'];
    const csvRows = [headers.join(',')];
    
    data.forEach(row => {
      const values = [
        row.id,
        `"${row.name}"`,
        `"${row.email}"`,
        `"${row.department}"`,
        `"${row.position}"`,
        row.salary,
        `"${row.city}"`,
        `"${row.startDate}"`,
        `"${row.status}"`
      ];
      csvRows.push(values.join(','));
    });
    
    return csvRows.join('\n');
  }
  
  showLoading() {
    document.getElementById('loadingOverlay').classList.add('show');
  }
  
  hideLoading() {
    document.getElementById('loadingOverlay').classList.remove('show');
  }
}

// Initialize the data grid when the page loads
let dataGrid;
document.addEventListener('DOMContentLoaded', function() {
  dataGrid = new RDMDataGrid('dataGridContainer');
  console.log('🎯 Data Grid Table Loaded');
}); 