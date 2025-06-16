class RDMTable extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  static get observedAttributes() {
    return ['data', 'columns', 'sortable', 'searchable', 'pageable'];
  }

  connectedCallback() {
    this.render();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      this.render();
    }
  }

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

      table {
        width: 100%;
        border-collapse: collapse;
        background: var(--rdm-light-color);
        border: 1px solid var(--rdm-border-color);
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

      tr:nth-child(even) {
        background: rgba(0, 0, 0, 0.02);
      }

      tr:hover {
        background: rgba(0, 123, 255, 0.05);
      }
    `;

    this.shadowRoot.innerHTML = '';
    this.shadowRoot.appendChild(style);

    const table = document.createElement('table');
    table.classList.add('rdm-element');
    this.shadowRoot.appendChild(table);

    // Table implementation will be added here
  }
}

customElements.define('rdm-table', RDMTable); 