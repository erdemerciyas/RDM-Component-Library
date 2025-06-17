class RdmSelect extends HTMLElement {
  static get observedAttributes() {
    return [
      'name', 'value', 'label', 'placeholder', 'size', 'required', 'disabled', 
      'clearable', 'multiple', 'autofocus', 'label-fixed', 'help-text', 
      'invalid-text', 'search-bar', 'search-bar-placeholder', 'search-not-found-text',
      'option-borders', 'option-style', 'validation-state', 'warning-text', 'success-text',
      'icon', 'icon-position', 'icon-class'
    ];
  }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._options = [];
    this._value = null;
    this._selectedValues = []; // For multiple selection
    this._isOpen = false;
    this._searchTerm = '';
    this._filteredOptions = [];
    this._dropdownPortal = null;
    this._scrollHandler = null;
    this._resizeHandler = null;
    
    // Initial render with proper timing
    requestAnimationFrame(() => {
      this._render();
      this._attachEvents();
    });
  }

  connectedCallback() {
    this._parseSlottedOptions();
  }

  disconnectedCallback() {
    this._removeDropdownPortal();
    this._removeScrollListeners();
    
    if (this._clickHandler) {
      this.shadowRoot.removeEventListener('click', this._clickHandler);
    }
    if (this._keydownHandler) {
      this.shadowRoot.removeEventListener('keydown', this._keydownHandler);
    }
    if (this._outsideClickHandler) {
      document.removeEventListener('click', this._outsideClickHandler);
    }
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      requestAnimationFrame(() => {
        this._render();
      });
    }
  }

  set options(val) {
    this._options = Array.isArray(val) ? val : [];
    this._filteredOptions = [...this._options];
    this._render();
  }

  get options() {
    return this._options;
  }

  set value(val) {
    this._value = val;
    
    // Update selectedValues array for multiple selection
    if (this.hasAttribute('multiple')) {
      this._selectedValues = val ? val.split(',').filter(v => v.trim()) : [];
    }
    
    this.setAttribute('value', val || '');
    this._render();
    this._dispatchChangeEvent();
  }

  get value() {
    return this._value || this.getAttribute('value') || null;
  }

  _parseSlottedOptions() {
    // Try rdm-select-option first, then regular option tags
    let slottedOptions = this.querySelectorAll('rdm-select-option');
    if (slottedOptions.length === 0) {
      slottedOptions = this.querySelectorAll('option');
    }
    
    if (slottedOptions.length > 0) {
      this._options = Array.from(slottedOptions).map(option => ({
        value: option.getAttribute('value') || option.textContent,
        label: option.textContent.trim()
      }));
      this._filteredOptions = [...this._options];
      this._render();
    }
  }

  _render() {
    const label = this.getAttribute('label') || '';
    const placeholder = this.getAttribute('placeholder') || 'Select an option';
    const disabled = this.hasAttribute('disabled');
    const clearable = this.hasAttribute('clearable');
    const helpText = this.getAttribute('help-text') || '';
    const invalidText = this.getAttribute('invalid-text') || '';
    const warningText = this.getAttribute('warning-text') || '';
    const successText = this.getAttribute('success-text') || '';
    const size = this.getAttribute('size') || 'medium';
    const searchBar = this.hasAttribute('search-bar');
    const searchBarPlaceholder = this.getAttribute('search-bar-placeholder') || 'Search...';
    const validationState = this.getAttribute('validation-state') || 'default'; // default, invalid, warning, success
    const required = this.hasAttribute('required');
    const icon = this.getAttribute('icon') || '';
    const iconClass = this.getAttribute('icon-class') || '';
    const iconPosition = this.getAttribute('icon-position') || 'left'; // left, right
    const hasIcon = icon || iconClass;
    
    this.shadowRoot.innerHTML = `
      <link rel="stylesheet" href="https://use.fontawesome.com/releases/v6.4.0/css/all.css">
      <style>
        * {
          box-sizing: border-box;
        }

        :host {
          display: block;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          width: 100%;
          position: relative;
          z-index: 1;
          transform: translateZ(0);
          contain: layout style;
        }

        .rdm-select {
          position: relative;
          width: 100%;
          z-index: auto;
        }

        .rdm-select__label {
          display: block;
          min-height: 20px;
          margin-bottom: 8px;
          font-weight: 500;
          font-size: 14px;
          color: #374151;
        }

        .rdm-select__label--hidden {
          visibility: hidden;
        }

        .rdm-select__label--required::after {
          content: ' *';
          color: #ef4444;
        }

        .rdm-select__trigger {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          background: white;
          border: 2px solid ${this._getBorderColor(validationState)};
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s;
          position: relative;
          box-sizing: border-box;
          z-index: 2;
          transform: translateZ(0);
        }

        .rdm-select__trigger:hover:not(.rdm-select__trigger--disabled) {
          border-color: ${this._getHoverBorderColor(validationState)};
        }

        .rdm-select__trigger:focus {
          outline: none;
          border-color: ${this._getFocusBorderColor(validationState)};
          box-shadow: 0 0 0 3px ${this._getFocusBoxShadowColor(validationState)};
        }

        .rdm-select__trigger--open {
          border-color: ${this._getFocusBorderColor(validationState)};
          box-shadow: 0 0 0 3px ${this._getFocusBoxShadowColor(validationState)};
        }

        .rdm-select__trigger--disabled {
          opacity: 0.6;
          cursor: not-allowed;
          background: #f9fafb;
        }

        .rdm-select--small .rdm-select__trigger {
          padding: 6px 12px;
          font-size: 14px;
          min-height: 36px;
        }

        .rdm-select--medium .rdm-select__trigger {
          padding: 8px 16px;
          font-size: 16px;
          min-height: 44px;
        }

        .rdm-select--large .rdm-select__trigger {
          padding: 12px 20px;
          font-size: 18px;
          min-height: 52px;
        }

        .rdm-select__value {
          flex: 1;
          text-align: left;
          color: #111827;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .rdm-select__placeholder {
          color: #9ca3af;
        }

        .rdm-select__icons {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-left: 8px;
          flex-shrink: 0;
        }

        .rdm-select__clear {
          display: ${clearable && this.value ? 'flex' : 'none'};
          align-items: center;
          justify-content: center;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: #9ca3af;
          color: white;
          cursor: pointer;
          font-size: 14px;
          font-weight: normal;
          line-height: 1;
          transition: all 0.2s;
          flex-shrink: 0;
        }

        .rdm-select__clear:hover {
          background: #6b7280;
          transform: scale(1.1);
        }

        .rdm-select__arrow {
          width: 0;
          height: 0;
          border-left: 5px solid transparent;
          border-right: 5px solid transparent;
          border-top: 6px solid #6b7280;
          transition: transform 0.2s;
          transform: ${this._isOpen ? 'rotate(180deg)' : 'rotate(0deg)'};
        }

        .rdm-select__help-text {
          display: ${helpText ? 'block' : 'none'};
          margin-top: 6px;
          font-size: 14px;
          color: #6b7280;
        }

        .rdm-select__message {
          margin-top: 6px;
          font-size: 14px;
          font-weight: 500;
        }

        .rdm-select__message--invalid {
          display: ${validationState === 'invalid' && invalidText ? 'block' : 'none'};
          color: #ef4444;
        }

        .rdm-select__message--warning {
          display: ${validationState === 'warning' && warningText ? 'block' : 'none'};
          color: #f59e0b;
        }

        .rdm-select__message--success {
          display: ${validationState === 'success' && successText ? 'block' : 'none'};
          color: #10b981;
        }

        .rdm-select__validation-icon {
          width: 20px;
          height: 20px;
          display: ${validationState !== 'default' ? 'flex' : 'none'};
          align-items: center;
          justify-content: center;
          font-size: 16px;
          font-weight: 600;
          line-height: 1;
          flex-shrink: 0;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.9);
          border: 2px solid;
          margin-left: 4px;
        }

        .rdm-select__validation-icon--invalid {
          color: #ef4444;
          border-color: #ef4444;
          background: rgba(239, 68, 68, 0.1);
        }

        .rdm-select__validation-icon--warning {
          color: #f59e0b;
          border-color: #f59e0b;
          background: rgba(245, 158, 11, 0.1);
        }

        .rdm-select__validation-icon--success {
          color: #10b981;
          border-color: #10b981;
          background: rgba(16, 185, 129, 0.1);
        }

        .rdm-select__custom-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 20px;
          height: 20px;
          font-size: 16px;
          color: #6b7280;
          flex-shrink: 0;
          transition: color 0.2s;
        }

        .rdm-select__custom-icon i,
        .rdm-select__custom-icon .icon {
          font-size: inherit;
          color: inherit;
          line-height: 1;
        }

        .rdm-select__custom-icon--left {
          margin-right: 8px;
        }

        .rdm-select__custom-icon--right {
          margin-left: 8px;
        }

        .rdm-select__trigger:hover .rdm-select__custom-icon {
          color: #374151;
        }

        .rdm-select__trigger--disabled .rdm-select__custom-icon {
          color: #9ca3af;
        }

        .rdm-select__content {
          display: flex;
          align-items: center;
          flex: 1;
          min-width: 0;
        }

        .rdm-select__content--icon-left {
          flex-direction: row;
        }

        .rdm-select__content--icon-right {
          flex-direction: row;
        }
      </style>
      
      <div class="rdm-select rdm-select--${size}">
        <label class="rdm-select__label${label ? '' : ' rdm-select__label--hidden'}${required ? ' rdm-select__label--required' : ''}">${label || ''}</label>
        
        <div class="rdm-select__trigger ${this._isOpen ? 'rdm-select__trigger--open' : ''} ${disabled ? 'rdm-select__trigger--disabled' : ''}" 
             tabindex="${disabled ? '-1' : '0'}" 
             role="combobox" 
             aria-expanded="${this._isOpen}"
             aria-haspopup="listbox">
          
          <div class="rdm-select__content rdm-select__content--icon-${iconPosition}">
            ${hasIcon && iconPosition === 'left' ? `
              <div class="rdm-select__custom-icon rdm-select__custom-icon--left">
                ${iconClass ? `<i class="${iconClass}"></i>` : icon}
              </div>
            ` : ''}
            <span class="rdm-select__value ${this.value ? '' : 'rdm-select__placeholder'}">
              ${this.value ? this._getSelectedLabel() : placeholder}
            </span>
            ${hasIcon && iconPosition === 'right' ? `
              <div class="rdm-select__custom-icon rdm-select__custom-icon--right">
                ${iconClass ? `<i class="${iconClass}"></i>` : icon}
              </div>
            ` : ''}
          </div>
          
          <div class="rdm-select__icons">
            <div class="rdm-select__validation-icon rdm-select__validation-icon--${validationState}">
              ${this._getValidationIcon(validationState)}
            </div>
            <div class="rdm-select__clear" title="Clear selection">×</div>
            <div class="rdm-select__arrow"></div>
          </div>
        </div>
        
        <div class="rdm-select__help-text">${helpText}</div>
        <div class="rdm-select__message rdm-select__message--invalid">${invalidText}</div>
        <div class="rdm-select__message rdm-select__message--warning">${warningText}</div>
        <div class="rdm-select__message rdm-select__message--success">${successText}</div>
      </div>
    `;
    
    this._attachEvents();
  }

  _renderOptions() {
    if (this._filteredOptions.length === 0) {
      const searchNotFoundText = this.getAttribute('search-not-found-text') || 'No results found';
      return `<div class="rdm-select__no-results">${searchNotFoundText}</div>`;
    }

    return this._filteredOptions.map(option => `
      <div class="rdm-select__option ${this.value === option.value ? 'rdm-select__option--selected' : ''}" 
           data-value="${option.value}">
        ${option.label}
      </div>
    `).join('');
  }

  _attachEvents() {
    // Remove old listeners
    if (this._clickHandler) {
      this.shadowRoot.removeEventListener('click', this._clickHandler);
    }
    if (this._keydownHandler) {
      this.shadowRoot.removeEventListener('keydown', this._keydownHandler);
    }
    if (this._outsideClickHandler) {
      document.removeEventListener('click', this._outsideClickHandler);
    }

    // Add new listeners
    this._clickHandler = this._handleClick.bind(this);
    this._keydownHandler = this._handleKeydown.bind(this);
    this._outsideClickHandler = this._handleOutsideClick.bind(this);

    this.shadowRoot.addEventListener('click', this._clickHandler);
    this.shadowRoot.addEventListener('keydown', this._keydownHandler);
    document.addEventListener('click', this._outsideClickHandler);

    // Search input listener
    const searchInput = this.shadowRoot.querySelector('.rdm-select__search-input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this._searchTerm = e.target.value.toLowerCase();
        this._filteredOptions = this._options.filter(option => 
          option.label.toLowerCase().includes(this._searchTerm)
        );
        this._updateOptionsDisplay();
      });
    }
  }

  _handleClick(event) {
    if (this.hasAttribute('disabled')) return;

    const trigger = event.target.closest('.rdm-select__trigger');
    const clear = event.target.closest('.rdm-select__clear');
    const option = event.target.closest('.rdm-select__option');

    if (clear) {
      event.stopPropagation();
      this._clearValue();
    } else if (option) {
      this._selectOption(option.dataset.value);
    } else if (trigger) {
      this._toggleDropdown();
    }
  }

  _handleKeydown(event) {
    if (this.hasAttribute('disabled')) return;

    switch (event.key) {
      case 'Enter':
      case ' ':
        if (!this._isOpen) {
          event.preventDefault();
          this._openDropdown();
        }
        break;
      case 'Escape':
        if (this._isOpen) {
          event.preventDefault();
          this._closeDropdown();
        }
        break;
      case 'ArrowDown':
        event.preventDefault();
        if (!this._isOpen) {
          this._openDropdown();
        }
        break;
      case 'ArrowUp':
        event.preventDefault();
        if (this._isOpen) {
          // Navigate up
        }
        break;
    }
  }

  _handleOutsideClick(event) {
    if (!this.contains(event.target) && 
        (!this._dropdownPortal || !this._dropdownPortal.contains(event.target))) {
      this._closeDropdown();
    }
  }

  _toggleDropdown() {
    if (this._isOpen) {
      this._closeDropdown();
    } else {
      this._openDropdown();
    }
  }

  _openDropdown() {
    this._isOpen = true;
    this._render();
    
    // Create and position portal dropdown
    this._createDropdownPortal();
    
    // Attach scroll listeners
    this._attachScrollListeners();
    
    // Position and show dropdown immediately
    this._positionDropdown();
    if (this._dropdownPortal) {
      this._dropdownPortal.classList.add('open');
    }
    
    // Focus search input if available
    setTimeout(() => {
      const searchInput = this._dropdownPortal?.querySelector('.rdm-select-portal__search-input');
      if (searchInput && this.hasAttribute('search-bar')) {
        searchInput.focus();
      }
    }, 10);
  }

  _closeDropdown() {
    this._isOpen = false;
    this._searchTerm = '';
    this._filteredOptions = [...this._options];
    
    // Remove scroll listeners
    this._removeScrollListeners();
    
    // Remove portal dropdown
    this._removeDropdownPortal();
    
    this._render();
  }

  _selectOption(value) {
    const isMultiple = this.hasAttribute('multiple');
    
    if (isMultiple) {
      const index = this._selectedValues.indexOf(value);
      if (index > -1) {
        // Remove if already selected
        this._selectedValues.splice(index, 1);
      } else {
        // Add if not selected
        this._selectedValues.push(value);
      }
      this.value = this._selectedValues.join(',');
      this._updatePortalOptionsDisplay();
      // Don't close dropdown for multiple selection
    } else {
      this.value = value;
      this._closeDropdown();
    }
  }

  _clearValue() {
    this._selectedValues = [];
    this.value = null;
  }

  _updateOptionsDisplay() {
    const optionsContainer = this.shadowRoot.querySelector('.rdm-select__options');
    if (optionsContainer) {
      optionsContainer.innerHTML = this._renderOptions();
    }
  }

  _getSelectedLabel() {
    const isMultiple = this.hasAttribute('multiple');
    
    if (isMultiple && this._selectedValues.length > 0) {
      if (this._selectedValues.length === 1) {
        const selected = this._options.find(opt => opt.value === this._selectedValues[0]);
        return selected ? selected.label : '';
      } else {
        return this._getMultipleSelectionLabel();
      }
    } else {
      const selected = this._options.find(opt => opt.value === this.value);
      return selected ? selected.label : '';
    }
  }

  _getMultipleSelectionLabel() {
    const trigger = this.shadowRoot.querySelector('.rdm-select__trigger');
    if (!trigger) {
      // Fallback if trigger not available
      const firstSelected = this._options.find(opt => opt.value === this._selectedValues[0]);
      const remainingCount = this._selectedValues.length - 1;
      return firstSelected ? `${firstSelected.label} + ${remainingCount}` : `${this._selectedValues.length} item selected`;
    }

    const triggerRect = trigger.getBoundingClientRect();
    const availableWidth = triggerRect.width - 80; // Reserve space for icons and padding
    
    if (availableWidth <= 0) {
      // Fallback for very small widths
      const firstSelected = this._options.find(opt => opt.value === this._selectedValues[0]);
      const remainingCount = this._selectedValues.length - 1;
      return firstSelected ? `${firstSelected.label} + ${remainingCount}` : `${this._selectedValues.length} item selected`;
    }

    // Create a temporary element to measure text width
    const measurer = document.createElement('span');
    measurer.style.visibility = 'hidden';
    measurer.style.position = 'absolute';
    measurer.style.fontSize = window.getComputedStyle(trigger).fontSize;
    measurer.style.fontFamily = window.getComputedStyle(trigger).fontFamily;
    document.body.appendChild(measurer);

    let displayText = '';
    let usedWidth = 0;
    let displayedCount = 0;

    for (let i = 0; i < this._selectedValues.length; i++) {
      const option = this._options.find(opt => opt.value === this._selectedValues[i]);
      if (!option) continue;

      const separator = displayedCount > 0 ? ', ' : '';
      const testText = displayText + separator + option.label;
      
      // If this is not the last item, we need to reserve space for "+ X" format
      const remainingCount = this._selectedValues.length - displayedCount - 1;
      const plusText = remainingCount > 0 ? ` + ${remainingCount}` : '';
      const fullTestText = testText + plusText;

      measurer.textContent = fullTestText;
      const textWidth = measurer.offsetWidth;

      if (textWidth <= availableWidth) {
        displayText = testText;
        displayedCount++;
        usedWidth = textWidth;
      } else {
        // Can't fit this item, break and show "+ remaining"
        break;
      }
    }

    document.body.removeChild(measurer);

    // Add remaining count if there are items that didn't fit
    const remainingCount = this._selectedValues.length - displayedCount;
    if (remainingCount > 0) {
      displayText += ` + ${remainingCount}`;
    }

    return displayText || `${this._selectedValues.length} item selected`;
  }

  _dispatchChangeEvent() {
    this.dispatchEvent(new CustomEvent('rdm-select', {
      detail: { value: this.value },
      bubbles: true
    }));
  }

  // Public API Methods
  open() {
    this._openDropdown();
  }

  close() {
    this._closeDropdown();
  }

  clear() {
    this._clearValue();
  }

  focus() {
    const trigger = this.shadowRoot.querySelector('.rdm-select__trigger');
    if (trigger) trigger.focus();
  }

  _createDropdownPortal() {
    if (this._dropdownPortal) {
      this._removeDropdownPortal();
    }

    const searchBar = this.hasAttribute('search-bar');
    const searchBarPlaceholder = this.getAttribute('search-bar-placeholder') || 'Search...';
    const optionBorders = this.hasAttribute('option-borders');
    const optionStyle = this.getAttribute('option-style') || 'default'; // default, checkbox, radio

    this._dropdownPortal = document.createElement('div');
    this._dropdownPortal.className = 'rdm-select-portal';
    this._dropdownPortal.innerHTML = `
      <style>
        .rdm-select-portal {
          position: fixed;
          z-index: 999999;
          background: white;
          border: 2px solid #3b82f6;
          border-radius: 8px;
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
          max-height: 300px;
          overflow: hidden;
          min-width: 200px;
        }

        .rdm-select-portal.open {
          /* No animation, just show */
        }

        .rdm-select-portal__search {
          display: ${searchBar ? 'block' : 'none'};
          padding: 12px;
          border-bottom: 1px solid #e5e7eb;
          background: #f9fafb;
        }

        .rdm-select-portal__search-input {
          width: 100%;
          padding: 8px 12px;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          font-size: 14px;
          outline: none;
          background: white;
          box-sizing: border-box;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .rdm-select-portal__search-input:focus {
          border-color: #3b82f6;
          box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
        }

        .rdm-select-portal__options {
          max-height: 200px;
          overflow-y: auto;
        }

        .rdm-select-portal__option {
          padding: 12px 16px;
          cursor: pointer;
          border-bottom: ${optionBorders ? '1px solid #d1d5db' : 'none'};
          transition: all 0.15s;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          display: ${optionStyle !== 'default' ? 'flex' : 'block'};
          align-items: ${optionStyle !== 'default' ? 'center' : 'initial'};
          gap: ${optionStyle !== 'default' ? '8px' : '0'};
        }

        .rdm-select-portal__option:last-child {
          border-bottom: none;
        }

        .rdm-select-portal__option:hover {
          background-color: #eff6ff;
          color: #1d4ed8;
        }

        .rdm-select-portal__option--selected {
          background-color: #dbeafe;
          color: #1e40af;
          font-weight: 500;
        }

        .rdm-select-portal__option--selected::after {
          content: ${optionStyle === 'default' ? "'✓'" : "''"};
          float: ${optionStyle === 'default' ? 'right' : 'none'};
          color: #2563eb;
          font-weight: bold;
          display: ${optionStyle === 'default' ? 'inline' : 'none'};
        }

        .rdm-select-portal__option-control {
          width: 16px;
          height: 16px;
          border: 2px solid #d1d5db;
          border-radius: ${optionStyle === 'radio' ? '50%' : '3px'};
          background: white;
          position: relative;
          flex-shrink: 0;
          transition: all 0.15s;
        }

        .rdm-select-portal__option--selected .rdm-select-portal__option-control {
          border-color: #3b82f6;
          background: #3b82f6;
        }

        .rdm-select-portal__option--selected .rdm-select-portal__option-control::after {
          content: '';
          position: absolute;
          display: block;
        }

        .rdm-select-portal__option--selected .rdm-select-portal__option-control::after {
          ${optionStyle === 'checkbox' ? `
            left: 3px;
            top: 0px;
            width: 6px;
            height: 10px;
            border: solid white;
            border-width: 0 2px 2px 0;
            transform: rotate(45deg);
          ` : optionStyle === 'radio' ? `
            left: 50%;
            top: 50%;
            width: 6px;
            height: 6px;
            border-radius: 50%;
            background: white;
            transform: translate(-50%, -50%);
          ` : ''}
        }

        .rdm-select-portal__option-text {
          flex: 1;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .rdm-select-portal__no-results {
          padding: 20px 16px;
          text-align: center;
          color: #6b7280;
          font-style: italic;
          font-size: 14px;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }
      </style>
      
      <div class="rdm-select-portal__search">
        <input class="rdm-select-portal__search-input" 
               type="text" 
               placeholder="${searchBarPlaceholder}">
      </div>
      
      <div class="rdm-select-portal__options">
        ${this._renderPortalOptions()}
      </div>
    `;

    document.body.appendChild(this._dropdownPortal);
    this._attachPortalEvents();
  }

  _removeDropdownPortal() {
    if (this._dropdownPortal) {
      document.body.removeChild(this._dropdownPortal);
      this._dropdownPortal = null;
    }
  }

  _renderPortalOptions() {
    const optionStyle = this.getAttribute('option-style') || 'default';
    const isMultiple = this.hasAttribute('multiple');
    
    return this._filteredOptions.map(option => {
      let isSelected;
      
      if (isMultiple) {
        // For multiple selection (checkbox), use _selectedValues array
        isSelected = this._selectedValues.includes(option.value);
      } else {
        // For single selection (radio/default), use this.value
        isSelected = this.value === option.value;
      }
      
      const selectedClass = isSelected ? 'rdm-select-portal__option--selected' : '';
      
      if (optionStyle === 'checkbox' || optionStyle === 'radio') {
        return `
          <div class="rdm-select-portal__option ${selectedClass}" data-value="${option.value}">
            <div class="rdm-select-portal__option-control"></div>
            <span class="rdm-select-portal__option-text">${option.label}</span>
          </div>
        `
      } else {
        return `
          <div class="rdm-select-portal__option ${selectedClass}" data-value="${option.value}">
            ${option.label}
          </div>
        `;
      }
    }).join('');
  }

  _attachPortalEvents() {
    if (!this._dropdownPortal) return;

    // Option click events
    this._dropdownPortal.addEventListener('click', (e) => {
      const option = e.target.closest('.rdm-select-portal__option');
      if (option) {
        e.stopPropagation(); // Prevent event bubbling
        this._selectOption(option.dataset.value);
      }
    });

    // Search input events
    const searchInput = this._dropdownPortal.querySelector('.rdm-select-portal__search-input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this._searchTerm = e.target.value.toLowerCase();
        this._filteredOptions = this._options.filter(option => 
          option.label.toLowerCase().includes(this._searchTerm)
        );
        this._updatePortalOptionsDisplay();
      });
      
      // Prevent search input clicks from closing dropdown
      searchInput.addEventListener('click', (e) => {
        e.stopPropagation();
      });
    }
  }

  _updatePortalOptionsDisplay() {
    if (!this._dropdownPortal) return;
    
    const optionsContainer = this._dropdownPortal.querySelector('.rdm-select-portal__options');
    if (optionsContainer) {
      optionsContainer.innerHTML = this._renderPortalOptions();
    }
  }

  _positionDropdown() {
    if (!this._dropdownPortal) return;

    const trigger = this.shadowRoot.querySelector('.rdm-select__trigger');
    if (!trigger) return;

    const triggerRect = trigger.getBoundingClientRect();
    
    // Check if trigger is still visible
    if (triggerRect.width === 0 || triggerRect.height === 0) {
      this._closeDropdown();
      return;
    }

    const dropdownHeight = this._dropdownPortal.offsetHeight;
    const viewportHeight = window.innerHeight;
    const viewportWidth = window.innerWidth;

    // Calculate position - direkt input altında
    let top = triggerRect.bottom + 2;
    let left = triggerRect.left;

    // Check if dropdown fits below
    if (top + dropdownHeight > viewportHeight - 20) {
      top = triggerRect.top - dropdownHeight - 2;
    }

    // Check if dropdown fits on the right
    const dropdownWidth = Math.max(triggerRect.width, 200);
    if (left + dropdownWidth > viewportWidth - 20) {
      left = triggerRect.right - dropdownWidth;
    }

    // Apply position directly without transform
    this._dropdownPortal.style.top = `${top}px`;
    this._dropdownPortal.style.left = `${left}px`;
    this._dropdownPortal.style.width = `${triggerRect.width}px`;
    this._dropdownPortal.style.minWidth = `${triggerRect.width}px`;
  }

  _attachScrollListeners() {
    if (this._scrollHandler) {
      this._removeScrollListeners();
    }

    this._scrollHandler = () => {
      if (this._isOpen && this._dropdownPortal) {
        this._positionDropdown();
      }
    };

    this._resizeHandler = () => {
      if (this._isOpen && this._dropdownPortal) {
        this._positionDropdown();
      }
      // Update label display on resize for multiple selections
      if (this.hasAttribute('multiple') && this._selectedValues.length > 1) {
        this._render();
      }
    };

    // Window scroll ve resize event'leri
    window.addEventListener('scroll', this._scrollHandler, { passive: true });
    window.addEventListener('resize', this._resizeHandler, { passive: true });
    document.addEventListener('scroll', this._scrollHandler, { passive: true });
  }

  _removeScrollListeners() {
    if (!this._scrollHandler) return;

    // Window event'lerini kaldır
    window.removeEventListener('scroll', this._scrollHandler);
    window.removeEventListener('resize', this._resizeHandler);
    document.removeEventListener('scroll', this._scrollHandler);

    this._scrollHandler = null;
    this._resizeHandler = null;
  }

  _getBorderColor(state) {
    switch (state) {
      case 'invalid': return '#ef4444';
      case 'warning': return '#f59e0b';
      case 'success': return '#10b981';
      default: return '#d1d5db';
    }
  }

  _getHoverBorderColor(state) {
    switch (state) {
      case 'invalid': return '#dc2626';
      case 'warning': return '#d97706';
      case 'success': return '#059669';
      default: return '#3b82f6';
    }
  }

  _getFocusBorderColor(state) {
    switch (state) {
      case 'invalid': return '#ef4444';
      case 'warning': return '#f59e0b';
      case 'success': return '#10b981';
      default: return '#3b82f6';
    }
  }

  _getFocusBoxShadowColor(state) {
    switch (state) {
      case 'invalid': return 'rgba(239, 68, 68, 0.1)';
      case 'warning': return 'rgba(245, 158, 11, 0.1)';
      case 'success': return 'rgba(16, 185, 129, 0.1)';
      default: return 'rgba(59, 130, 246, 0.1)';
    }
  }

  _getValidationIcon(state) {
    switch (state) {
      case 'invalid':
        return '<i class="fas fa-circle-xmark"></i>';
      case 'warning':
        return '<i class="fas fa-triangle-exclamation"></i>';
      case 'success':
        return '<i class="fas fa-circle-check"></i>';
      default:
        return '';
    }
  }
}

// Define rdm-select-option for slotted content
class RdmSelectOption extends HTMLElement {
  constructor() {
    super();
  }
}

customElements.define('rdm-select', RdmSelect);
customElements.define('rdm-select-option', RdmSelectOption);