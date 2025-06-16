# 🎯 RDM UI Elements

A collection of modern, customizable, and accessible HTML5 UI components with Shadow DOM isolation.

## 📦 Components

### Select Component
A feature-rich select/dropdown component with:
- Multiple selection support
- Search functionality
- Validation states
- Keyboard navigation
- Font Awesome icon integration
- Full accessibility support

### Table Component
A powerful table component with:
- Sortable columns
- Search functionality
- Pagination
- Responsive design
- Customizable styling
- Accessibility features

## 🚀 Getting Started

1. Include the required files:
```html
<!-- Font Awesome (for icons) -->
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">

<!-- RDM UI Elements styles -->
<link rel="stylesheet" href="shared/styles/variables.css">
<link rel="stylesheet" href="shared/styles/common.css">

<!-- Include the components you need -->
<script src="components/select/rdm-select.js"></script>
<script src="components/table/rdm-table.js"></script>
```

2. Use the components in your HTML:
```html
<!-- Select Component -->
<rdm-select>
    <option value="1">Option 1</option>
    <option value="2">Option 2</option>
</rdm-select>

<!-- Table Component -->
<rdm-table 
    id="myTable"
    sortable
    searchable
    pageable>
</rdm-table>
```

3. Initialize table data (if using the table component):
```javascript
const data = [
    { id: 1, name: "John Doe", email: "john@example.com" },
    { id: 2, name: "Jane Smith", email: "jane@example.com" }
];

const columns = [
    { field: 'id', header: 'ID' },
    { field: 'name', header: 'Name' },
    { field: 'email', header: 'Email' }
];

document.getElementById('myTable').setAttribute('data', JSON.stringify(data));
document.getElementById('myTable').setAttribute('columns', JSON.stringify(columns));
```

## 🎨 Customization

All components use CSS custom properties (variables) for styling. You can override these variables to match your design:

```css
:root {
    --rdm-primary-color: #007bff;
    --rdm-secondary-color: #6c757d;
    --rdm-success-color: #28a745;
    --rdm-danger-color: #dc3545;
    --rdm-warning-color: #ffc107;
    /* ... more variables available in shared/styles/variables.css */
}
```

## 📚 Documentation

Each component has its own demo page with examples and documentation:
- [Select Component Demo](demos/select.html)
- [Table Component Demo](demos/table.html)

## 🛠 Development

1. Clone the repository:
```bash
git clone https://github.com/your-username/rdm-ui-elements.git
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 👤 Yapımcı

**Erdem Erciyas**

## 🚀 Hızlı Başlangıç

### HTML
```html
<!DOCTYPE html>
<html>
<head>
  <link rel="stylesheet" href="https://use.fontawesome.com/releases/v6.4.0/css/all.css">
</head>
<body>
  <rdm-select label="Ülke Seçin" placeholder="Bir ülke seçin">
    <rdm-select-option value="tr">Türkiye</rdm-select-option>
    <rdm-select-option value="us">Amerika Birleşik Devletleri</rdm-select-option>
    <rdm-select-option value="de">Almanya</rdm-select-option>
  </rdm-select>

  <script src="rdm-select.js"></script>
</body>
</html>
```

### JavaScript ile Seçenekler
```javascript
const select = document.querySelector('rdm-select');
select.options = [
  { value: 'tr', label: 'Türkiye' },
  { value: 'us', label: 'Amerika Birleşik Devletleri' },
  { value: 'de', label: 'Almanya' }
];
```

## 📖 Kullanım Örnekleri

### Temel Kullanım
```html
<rdm-select 
  label="Şehir" 
  placeholder="Şehir seçin"
  clearable>
  <rdm-select-option value="istanbul">İstanbul</rdm-select-option>
  <rdm-select-option value="ankara">Ankara</rdm-select-option>
  <rdm-select-option value="izmir">İzmir</rdm-select-option>
</rdm-select>
```

### Icon ile Kullanım
```html
<!-- Emoji Icon -->
<rdm-select 
  label="Kategori" 
  placeholder="Kategori seçin"
  icon="📁"
  icon-position="left">
  <rdm-select-option value="tech">Teknoloji</rdm-select-option>
  <rdm-select-option value="design">Tasarım</rdm-select-option>
</rdm-select>

<!-- Font Awesome Icon -->
<rdm-select 
  label="Kullanıcı" 
  placeholder="Kullanıcı seçin"
  icon-class="fas fa-user"
  icon-position="left">
  <rdm-select-option value="admin">Admin</rdm-select-option>
  <rdm-select-option value="user">Kullanıcı</rdm-select-option>
</rdm-select>
```

### Arama Özelliği
```html
<rdm-select 
  label="Programlama Dili" 
  placeholder="Dil seçin"
  search-bar
  search-bar-placeholder="Dil ara..."
  search-not-found-text="Sonuç bulunamadı">
  <rdm-select-option value="js">JavaScript</rdm-select-option>
  <rdm-select-option value="py">Python</rdm-select-option>
  <rdm-select-option value="java">Java</rdm-select-option>
</rdm-select>
```

### Çoklu Seçim
```html
<rdm-select 
  label="Hobiler" 
  placeholder="Hobiler seçin"
  multiple
  option-style="checkbox">
  <rdm-select-option value="reading">Okuma</rdm-select-option>
  <rdm-select-option value="music">Müzik</rdm-select-option>
  <rdm-select-option value="sports">Spor</rdm-select-option>
</rdm-select>
```

### Validasyon Durumları
```html
<!-- Hata Durumu -->
<rdm-select 
  label="Gerekli Alan" 
  placeholder="Seçim yapın"
  validation-state="invalid"
  invalid-text="Bu alan zorunludur!"
  required>
  <rdm-select-option value="1">Seçenek 1</rdm-select-option>
</rdm-select>

<!-- Başarı Durumu -->
<rdm-select 
  label="Onaylandı" 
  placeholder="Seçim yapın"
  validation-state="success"
  success-text="Seçim onaylandı!">
  <rdm-select-option value="1">Seçenek 1</rdm-select-option>
</rdm-select>
```

## 🔧 Attribute Referansı

| Attribute | Tip | Varsayılan | Açıklama |
|-----------|-----|------------|----------|
| `name` | string | - | Form alanının adı |
| `value` | string | null | Seçili değer |
| `label` | string | - | Üst etiket metni |
| `placeholder` | string | "Select an option" | Placeholder metni |
| `size` | small \| medium \| large | medium | Bileşen boyutu |
| `required` | boolean | false | Zorunlu alan |
| `disabled` | boolean | false | Devre dışı durumu |
| `clearable` | boolean | false | Temizle butonu |
| `multiple` | boolean | false | Çoklu seçim modu |
| `search-bar` | boolean | false | Arama çubuğu |
| `search-bar-placeholder` | string | "Search..." | Arama placeholder'ı |
| `search-not-found-text` | string | "No results found" | Sonuç bulunamadı metni |
| `option-borders` | boolean | false | Seçenekler arası çizgi |
| `option-style` | default \| checkbox \| radio | default | Seçenek görünüm stili |
| `validation-state` | default \| invalid \| warning \| success | default | Validation durumu |
| `help-text` | string | - | Yardım metni |
| `invalid-text` | string | - | Hata mesajı |
| `warning-text` | string | - | Uyarı mesajı |
| `success-text` | string | - | Başarı mesajı |
| `icon` | string | - | Emoji veya text icon |
| `icon-class` | string | - | CSS class ile icon |
| `icon-position` | left \| right | left | Icon konumu |

## 🎮 JavaScript API

### Metodlar
```javascript
const select = document.querySelector('rdm-select');

// Dropdown'ı aç/kapat
select.open();
select.close();

// Seçimi temizle
select.clear();

// Elemente odaklan
select.focus();

// Değer al/ayarla
console.log(select.value);
select.value = 'new-value';

// Seçenekleri ayarla
select.options = [
  { value: '1', label: 'Seçenek 1' },
  { value: '2', label: 'Seçenek 2' }
];
```

### Event Dinleme
```javascript
select.addEventListener('rdm-select', (e) => {
  console.log('Seçilen değer:', e.detail.value);
  console.log('Seçilen label:', e.detail.label);
});
```

## 🎨 Özelleştirme

### CSS Custom Properties
```css
rdm-select {
  --rdm-select-border-color: #d1d5db;
  --rdm-select-focus-color: #3b82f6;
  --rdm-select-error-color: #ef4444;
  --rdm-select-success-color: #10b981;
  --rdm-select-warning-color: #f59e0b;
}
```

### Boyut Seçenekleri
- `size="small"`: 36px yükseklik, 14px font
- `size="medium"`: 44px yükseklik, 16px font (varsayılan)
- `size="large"`: 52px yükseklik, 18px font

## 🌐 Tarayıcı Desteği

- ✅ Chrome 54+
- ✅ Firefox 63+
- ✅ Safari 10.1+
- ✅ Edge 79+

## 📦 Kurulum

### CDN
```html
<script src="https://unpkg.com/rdm-select@latest/rdm-select.js"></script>
```

### NPM
```bash
npm install rdm-select
```

### Manuel
1. `rdm-select.js` dosyasını indirin
2. HTML sayfanızda script tag ile ekleyin
3. Font Awesome için CSS linkini ekleyin (isteğe bağlı)

## 🤝 Katkıda Bulunma

1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Değişikliklerinizi commit edin (`git commit -m 'Add amazing feature'`)
4. Branch'inizi push edin (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun

## 📞 İletişim

Sorularınız için issue açabilir veya pull request gönderebilirsiniz.

---

⭐ Bu projeyi beğendiyseniz yıldız vermeyi unutmayın! 