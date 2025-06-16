class RDMTable extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    
    // Internal state
    this._data = [];
    this._columns = [];
    this._currentPage = 1;
    this._itemsPerPage = 10;
    this._sortField = null;
    this._sortDirection = 'asc';
    this._searchTerm = '';
    this._validationState = null;
    this._validationMessage = '';
  }

  static get observedAttributes() {
    return [
      'data',
      'columns',
      'sortable',
      'searchable',
      'pageable',
      'items-per-page',
      'validation',
      'validation-message',
      'loading'
    ];
  }

  // Getters and setters for properties
  get data() {
    return this._data;
  }

  set data(value) {
    this._data = Array.isArray(value) ? value : [];
    this.render();
  }

  get columns() {
    return this._columns;
  }

  set columns(value) {
    this._columns = Array.isArray(value) ? value : [];
    this.render();
  }

  // Lifecycle callbacks
  connectedCallback() {
    this.render();
    this._addEventListeners();
  }

  disconnectedCallback() {
    this._removeEventListeners();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue) return;

    switch (name) {
      case 'data':
        try {
          this.data = JSON.parse(newValue);
        } catch (e) {
          console.error('Invalid data format:', e);
        }
        break;
      case 'columns':
        try {
          this.columns = JSON.parse(newValue);
        } catch (e) {
          console.error('Invalid columns format:', e);
        }
        break;
      case 'items-per-page':
        this._itemsPerPage = parseInt(newValue) || 10;
        this.render();
        break;
      case 'validation':
        this._validationState = newValue;
        this._updateValidation();
        break;
      case 'validation-message':
        this._validationMessage = newValue;
        this._updateValidation();
        break;
      case 'loading':
        this._updateLoadingState(newValue !== null);
        break;
    }
  }

  // Private methods
  _addEventListeners() {
    this.shadowRoot.addEventListener('click', this._handleClick.bind(this));
    if (this.hasAttribute('searchable')) {
      const searchInput = this.shadowRoot.querySelector('.rdm-table-search input');
      if (searchInput) {
        searchInput.addEventListener('input', this._handleSearch.bind(this));
      }
    }
  }

  _removeEventListeners() {
    this.shadowRoot.removeEventListener('click', this._handleClick.bind(this));
    if (this.hasAttribute('searchable')) {
      const searchInput = this.shadowRoot.querySelector('.rdm-table-search input');
      if (searchInput) {
        searchInput.removeEventListener('input', this._handleSearch.bind(this));
      }
    }
  }

  _handleClick(event) {
    const target = event.target;
    
    // Handle sortable column headers
    if (target.closest('th.sortable')) {
      const field = target.closest('th').dataset.field;
      this._handleSort(field);
    }
    
    // Handle pagination
    if (target.closest('.rdm-table-pagination button')) {
      const action = target.closest('button').dataset.action;
      this._handlePagination(action);
    }
  }

  _handleSort(field) {
    if (this._sortField === field) {
      this._sortDirection = this._sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this._sortField = field;
      this._sortDirection = 'asc';
    }
    
    this._data.sort((a, b) => {
      const aVal = a[field];
      const bVal = b[field];
      
      if (aVal === bVal) return 0;
      
      const comparison = aVal > bVal ? 1 : -1;
      return this._sortDirection === 'asc' ? comparison : -comparison;
    });
    
    this.render();
  }

  _handleSearch(event) {
    this._searchTerm = event.target.value.toLowerCase();
    this._currentPage = 1;
    this.render();
  }

  _handlePagination(action) {
    const totalPages = Math.ceil(this._getFilteredData().length / this._itemsPerPage);
    
    switch (action) {
      case 'first':
        this._currentPage = 1;
        break;
      case 'prev':
        this._currentPage = Math.max(1, this._currentPage - 1);
        break;
      case 'next':
        this._currentPage = Math.min(totalPages, this._currentPage + 1);
        break;
      case 'last':
        this._currentPage = totalPages;
        break;
    }
    
    this.render();
  }

  _getFilteredData() {
    if (!this._searchTerm) return this._data;
    
    return this._data.filter(item =>
      Object.values(item).some(val =>
        String(val).toLowerCase().includes(this._searchTerm)
      )
    );
  }

  _getPaginatedData() {
    const filteredData = this._getFilteredData();
    const start = (this._currentPage - 1) * this._itemsPerPage;
    return filteredData.slice(start, start + this._itemsPerPage);
  }

  _updateValidation() {
    const table = this.shadowRoot.querySelector('table');
    if (!table) return;

    // Remove existing validation classes
    table.classList.remove('is-valid', 'is-invalid', 'has-warning');

    // Add new validation class
    switch (this._validationState) {
      case 'success':
        table.classList.add('is-valid');
        break;
      case 'error':
        table.classList.add('is-invalid');
        break;
      case 'warning':
        table.classList.add('has-warning');
        break;
    }

    // Update validation message
    const messageElement = this.shadowRoot.querySelector('.validation-message');
    if (messageElement) {
      messageElement.textContent = this._validationMessage;
    }
  }

  _updateLoadingState(isLoading) {
    const table = this.shadowRoot.querySelector('table');
    if (!table) return;

    if (isLoading) {
      table.classList.add('is-loading');
      // Add loading spinner
      const loadingSpinner = document.createElement('div');
      loadingSpinner.className = 'loading-spinner';
      loadingSpinner.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
      this.shadowRoot.appendChild(loadingSpinner);
    } else {
      table.classList.remove('is-loading');
      // Remove loading spinner
      const loadingSpinner = this.shadowRoot.querySelector('.loading-spinner');
      if (loadingSpinner) {
        loadingSpinner.remove();
      }
    }
  }

  _getValidationIcon() {
    switch (this._validationState) {
      case 'success':
        return '<i class="fas fa-circle-check"></i>';
      case 'error':
        return '<i class="fas fa-circle-xmark"></i>';
      case 'warning':
        return '<i class="fas fa-triangle-exclamation"></i>';
      default:
        return '';
    }
  }

  // Render methods
  render() {
    const style = document.createElement('style');
    style.textContent = `
      @import url('../../shared/styles/variables.css');
      @import url('../../shared/styles/common.css');
      @import url('./rdm-table.css');

      :host {
        display: block;
        margin: var(--rdm-spacing-md) 0;
      }

      .rdm-table-container {
        position: relative;
        overflow-x: auto;
      }

      table {
        width: 100%;
        border-collapse: collapse;
        background: var(--rdm-light-color);
        border: 1px solid var(--rdm-border-color);
        font-family: var(--rdm-font-family);
      }

      th, td {
        padding: var(--rdm-spacing-sm) var(--rdm-spacing-md);
        border: 1px solid var(--rdm-border-color);
      }

      th {
        background: var(--rdm-secondary-color);
        color: var(--rdm-light-color);
        font-weight: bold;
        text-align: left;
      }

      th.sortable {
        cursor: pointer;
        user-select: none;
      }

      th.sortable:hover {
        background: var(--rdm-primary-color);
      }

      tr:nth-child(even) {
        background: rgba(0, 0, 0, 0.02);
      }

      tr:hover {
        background: rgba(0, 123, 255, 0.05);
      }

      .validation-message {
        margin-top: var(--rdm-spacing-sm);
        display: flex;
        align-items: center;
        gap: var(--rdm-spacing-sm);
      }

      .validation-message i {
        font-size: 1.2em;
      }

      .is-valid .validation-message {
        color: var(--rdm-success-color);
      }

      .is-invalid .validation-message {
        color: var(--rdm-danger-color);
      }

      .has-warning .validation-message {
        color: var(--rdm-warning-color);
      }

      .loading-spinner {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-size: 2em;
        color: var(--rdm-primary-color);
      }

      .is-loading {
        opacity: 0.5;
      }
    `;

    const container = document.createElement('div');
    container.className = 'rdm-table-container';

    // Add search if searchable
    if (this.hasAttribute('searchable')) {
      container.appendChild(this._renderSearch());
    }

    // Add table
    container.appendChild(this._renderTable());

    // Add pagination if pageable
    if (this.hasAttribute('pageable')) {
      container.appendChild(this._renderPagination());
    }

    // Add validation message if needed
    if (this._validationState && this._validationMessage) {
      const validationMessage = document.createElement('div');
      validationMessage.className = 'validation-message';
      validationMessage.innerHTML = `${this._getValidationIcon()} ${this._validationMessage}`;
      container.appendChild(validationMessage);
    }

    this.shadowRoot.innerHTML = '';
    this.shadowRoot.appendChild(style);
    this.shadowRoot.appendChild(container);
  }

  _renderSearch() {
    const searchContainer = document.createElement('div');
    searchContainer.className = 'rdm-table-search';
    searchContainer.innerHTML = `
      <input type="text" 
             placeholder="Search..." 
             value="${this._searchTerm}"
             aria-label="Search table contents">
    `;
    return searchContainer;
  }

  _renderTable() {
    const table = document.createElement('table');
    table.className = 'rdm-element';
    
    // Add header
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    
    this._columns.forEach(column => {
      const th = document.createElement('th');
      th.textContent = column.header;
      th.dataset.field = column.field;
      
      if (this.hasAttribute('sortable')) {
        th.classList.add('sortable');
        if (this._sortField === column.field) {
          th.classList.add(`sorted-${this._sortDirection}`);
        }
      }
      
      headerRow.appendChild(th);
    });
    
    thead.appendChild(headerRow);
    table.appendChild(thead);
    
    // Add body
    const tbody = document.createElement('tbody');
    const dataToShow = this.hasAttribute('pageable') ? 
      this._getPaginatedData() : 
      this._getFilteredData();
    
    dataToShow.forEach(item => {
      const row = document.createElement('tr');
      this._columns.forEach(column => {
        const td = document.createElement('td');
        td.textContent = item[column.field];
        row.appendChild(td);
      });
      tbody.appendChild(row);
    });
    
    table.appendChild(tbody);
    return table;
  }

  _renderPagination() {
    const filteredData = this._getFilteredData();
    const totalPages = Math.ceil(filteredData.length / this._itemsPerPage);
    
    const pagination = document.createElement('div');
    pagination.className = 'rdm-table-pagination';
    
    pagination.innerHTML = `
      <button data-action="first" ${this._currentPage === 1 ? 'disabled' : ''}>
        <i class="fas fa-angles-left"></i>
      </button>
      <button data-action="prev" ${this._currentPage === 1 ? 'disabled' : ''}>
        <i class="fas fa-angle-left"></i>
      </button>
      <span class="current-page">
        Page ${this._currentPage} of ${totalPages}
      </span>
      <button data-action="next" ${this._currentPage === totalPages ? 'disabled' : ''}>
        <i class="fas fa-angle-right"></i>
      </button>
      <button data-action="last" ${this._currentPage === totalPages ? 'disabled' : ''}>
        <i class="fas fa-angles-right"></i>
      </button>
    `;
    
    return pagination;
  }
}

customElements.define('rdm-table', RDMTable); 