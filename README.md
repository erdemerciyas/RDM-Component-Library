# RDM Component Library

<div align="center">

![RDM Components](https://img.shields.io/badge/RDM-Components-blue?style=for-the-badge)
![Version](https://img.shields.io/badge/Version-1.0.0-green?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)

**Modern, özelleştirilebilir ve erişilebilir HTML bileşenleri**

[🚀 Demo](https://erdemerciyas.github.io/RDM-Component-Library/) • [📖 Dokümantasyon](#bileşenler) • [💻 GitHub](https://github.com/erdemerciyas/RDM-Component-Library)

</div>

---

## 📋 İçindekiler

- [Genel Bakış](#genel-bakış)
- [Özellikler](#özellikler)
- [Kurulum](#kurulum)
- [Hızlı Başlangıç](#hızlı-başlangıç)
- [Bileşenler](#bileşenler)
  - [RDM Select](#rdm-select)
  - [RDM Table](#rdm-table)
  - [RDM DataGrid](#rdm-datagrid)
  - [RDM CardGrid](#rdm-cardgrid)
  - [RDM Timeline](#rdm-timeline)
- [Stil Sistemi](#stil-sistemi)
- [Geliştirme](#geliştirme)
- [Katkıda Bulunma](#katkıda-bulunma)
- [Lisans](#lisans)

---

## 🎯 Genel Bakış

RDM Component Library, modern web uygulamaları için tasarlanmış, özelleştirilebilir ve erişilebilir HTML bileşenleri koleksiyonudur. Vanilla JavaScript ile geliştirilmiş olup, herhangi bir framework'e bağımlılığı yoktur.

### ✨ Temel Özellikler

- 🎨 **Modern Tasarım** - Glassmorphism ve gradient efektleri
- ♿ **Erişilebilirlik** - WCAG 2.1 AA standartlarına uygun
- 📱 **Responsive** - Tüm ekran boyutlarında mükemmel görünüm
- 🎛️ **Özelleştirilebilir** - CSS değişkenleri ile kolay tema değişimi
- ⚡ **Performans** - Optimize edilmiş, hızlı yükleme
- 🌐 **Framework Agnostic** - Herhangi bir JavaScript framework'ü ile uyumlu
- 🔧 **TypeScript Desteği** - Tip güvenliği için hazır
- 📦 **Modüler Yapı** - İhtiyacınız olan bileşenleri seçerek kullanın

---

## 🚀 Kurulum

### CDN ile Hızlı Başlangıç

```html
<!-- Ana stil dosyası -->
<link rel="stylesheet" href="shared/styles/variables.css">

<!-- Select bileşeni -->
<link rel="stylesheet" href="components/select/rdm-select.css">
<script src="components/select/rdm-select.js"></script>

<!-- Table bileşenleri -->
<link rel="stylesheet" href="components/table/rdm-table.css">
<script src="components/table/rdm-table.js"></script>
```

### Manuel Kurulum

1. Projeyi klonlayın:
```bash
git clone https://github.com/erdemerciyas/RDM-Component-Library.git
```

2. Bağımlılıkları yükleyin:
```bash
npm install
```

3. Geliştirme sunucusunu başlatın:
```bash
npm start
```

---

## ⚡ Hızlı Başlangıç

```html
<!DOCTYPE html>
<html lang="tr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>RDM Components Demo</title>
    
    <!-- RDM Components CSS -->
    <link rel="stylesheet" href="components/select/rdm-select.css">
    <link rel="stylesheet" href="shared/styles/variables.css">
</head>
<body>
    <!-- RDM Select Bileşeni -->
    <rdm-select 
        label="Ülke Seçin" 
        placeholder="Bir ülke seçin..." 
        clearable 
        search-bar>
        <rdm-select-option value="tr">Türkiye</rdm-select-option>
        <rdm-select-option value="us">Amerika Birleşik Devletleri</rdm-select-option>
        <rdm-select-option value="de">Almanya</rdm-select-option>
    </rdm-select>

    <!-- RDM Components JS -->
    <script src="components/select/rdm-select.js"></script>
</body>
</html>
```

---

## 🧩 Bileşenler

### 🔽 RDM Select

Modern ve özelleştirilebilir dropdown seçim bileşeni.

#### Öne Çıkan Özellikler
- ✅ Tekli ve çoklu seçim desteği
- 🔍 Gerçek zamanlı arama/filtreleme
- 🎨 5 farklı boyut seçeneği (xs, small, medium, large, xl)
- ⚠️ Form validasyon durumları (default, invalid, warning, success)
- 🎯 İkon desteği (Font Awesome)
- ⌨️ Tam klavye navigasyonu
- ♿ Ekran okuyucu desteği
- 📱 Responsive tasarım

#### Temel Kullanım

```html
<!-- HTML ile -->
<rdm-select label="Kategori" placeholder="Seçin..." clearable>
    <rdm-select-option value="web">Web Geliştirme</rdm-select-option>
    <rdm-select-option value="mobile">Mobil Geliştirme</rdm-select-option>
    <rdm-select-option value="design">UI/UX Tasarım</rdm-select-option>
</rdm-select>

<!-- JavaScript ile -->
<rdm-select id="dynamic-select" label="Şehir" search-bar></rdm-select>

<script>
const select = document.getElementById('dynamic-select');
select.options = [
    { value: 'istanbul', label: 'İstanbul' },
    { value: 'ankara', label: 'Ankara' },
    { value: 'izmir', label: 'İzmir' }
];
</script>
```

#### API Referansı

| Özellik | Tip | Varsayılan | Açıklama |
|---------|-----|------------|-----------|
| `label` | string | - | Bileşen etiketi |
| `placeholder` | string | "Select an option" | Placeholder metni |
| `value` | string | - | Seçili değer |
| `multiple` | boolean | false | Çoklu seçim modu |
| `clearable` | boolean | false | Temizleme butonu |
| `disabled` | boolean | false | Devre dışı durumu |
| `required` | boolean | false | Zorunlu alan |
| `search-bar` | boolean | false | Arama özelliği |
| `size` | string | "medium" | Boyut (xs, small, medium, large, xl) |
| `validation-state` | string | "default" | Validasyon durumu |
| `icon` | string | - | Font Awesome ikon sınıfı |
| `icon-position` | string | "left" | İkon pozisyonu (left, right) |
| `help-text` | string | - | Yardım metni |
| `invalid-text` | string | - | Hata mesajı |
| `warning-text` | string | - | Uyarı mesajı |
| `success-text` | string | - | Başarı mesajı |

[📖 Detaylı Select Dokümantasyonu](demos/select.html)

---

### 📊 RDM Table

Temel tablo görünümü için optimize edilmiş bileşen.

#### Özellikler
- 📋 Bootstrap uyumlu stil
- 📌 Sticky header desteği
- 🎨 Özelleştirilebilir renkler
- 📱 Responsive tasarım
- ⚡ Hızlı render
- 🎯 Striped, bordered, hover efektleri

#### Kullanım

```html
<rdm-table id="basic-table" striped bordered hover></rdm-table>

<script>
const table = document.getElementById('basic-table');
table.data = [
    { id: 1, name: 'Ahmet Yılmaz', email: 'ahmet@example.com', role: 'Developer' },
    { id: 2, name: 'Ayşe Kaya', email: 'ayse@example.com', role: 'Designer' }
];
table.columns = [
    { key: 'id', title: 'ID' },
    { key: 'name', title: 'Ad Soyad' },
    { key: 'email', title: 'E-posta' },
    { key: 'role', title: 'Rol' }
];
</script>
```

[📖 Detaylı Table Dokümantasyonu](demos/table.html)

---

### 🗃️ RDM DataGrid

Gelişmiş veri yönetimi için tam özellikli data grid bileşeni.

#### Özellikler
- 🔍 Gelişmiş filtreleme
- 📊 Sütun bazlı sıralama
- 📄 Sayfalama (pagination)
- 🔢 Satır seçimi
- 📤 Veri dışa aktarma (CSV, JSON)
- 🎛️ Sütun yeniden boyutlandırma
- 💾 Durum kaydetme
- 🔄 Gerçek zamanlı veri güncelleme

#### Kullanım

```html
<rdm-datagrid 
    id="data-grid" 
    filterable 
    sortable 
    paginated 
    selectable 
    exportable>
</rdm-datagrid>

<script>
const dataGrid = document.getElementById('data-grid');
dataGrid.data = employees; // Büyük veri seti
dataGrid.pageSize = 10;
dataGrid.columns = [
    { key: 'name', title: 'Ad Soyad', sortable: true, filterable: true },
    { key: 'department', title: 'Departman', filterable: true },
    { key: 'salary', title: 'Maaş', sortable: true, type: 'currency' }
];
</script>
```

[📖 Detaylı DataGrid Dokümantasyonu](demos/datagrid.html)

---

### 🃏 RDM CardGrid

Modern kart tabanlı veri görünümü bileşeni.

#### Özellikler
- 🎴 Esnek kart düzeni
- 🔍 Arama ve filtreleme
- 📊 Sıralama seçenekleri
- 📱 Responsive grid
- 🎨 Özelleştirilebilir kart şablonları
- ⚡ Lazy loading
- 🖼️ Resim optimizasyonu

#### Kullanım

```html
<rdm-cardgrid 
    id="product-cards" 
    searchable 
    sortable 
    columns="3">
</rdm-cardgrid>

<script>
const cardGrid = document.getElementById('product-cards');
cardGrid.data = products;
cardGrid.cardTemplate = (item) => `
    <div class="product-card">
        <img src="${item.image}" alt="${item.name}">
        <h3>${item.name}</h3>
        <p class="price">${item.price}</p>
    </div>
`;
</script>
```

[📖 Detaylı CardGrid Dokümantasyonu](demos/cardgrid.html)

---

### ⏰ RDM Timeline

Kronolojik veri görselleştirme bileşeni.

#### Özellikler
- 📅 Tarih bazlı sıralama
- 🎯 Durum göstergeleri (completed, in-progress, pending)
- 🔍 Filtreleme seçenekleri
- 📱 Responsive tasarım
- 🎨 Özelleştirilebilir tema
- ⚡ Smooth animasyonlar
- 🏷️ Tip kategorileri (milestone, development, release)

#### Kullanım

```html
<rdm-timeline 
    id="project-timeline" 
    filterable 
    animated>
</rdm-timeline>

<script>
const timeline = document.getElementById('project-timeline');
timeline.data = [
    {
        date: '2024-01-15',
        title: 'Proje Başlangıcı',
        description: 'RDM Component Library projesi başlatıldı',
        status: 'completed',
        type: 'milestone'
    },
    {
        date: '2024-02-01',
        title: 'Select Bileşeni',
        description: 'İlk bileşen geliştirildi',
        status: 'completed',
        type: 'development'
    }
];
</script>
```

[📖 Detaylı Timeline Dokümantasyonu](demos/timeline.html)

---

## 🎨 Stil Sistemi

RDM Components, tutarlı ve özelleştirilebilir bir tasarım sistemi kullanır.

### CSS Değişkenleri

```css
:root {
  /* Ana Renkler */
  --rdm-primary: #667eea;
  --rdm-secondary: #764ba2;
  --rdm-success: #10b981;
  --rdm-warning: #f59e0b;
  --rdm-error: #ef4444;
  
  /* Boyutlar */
  --rdm-border-radius: 8px;
  --rdm-spacing-xs: 4px;
  --rdm-spacing-sm: 8px;
  --rdm-spacing-md: 16px;
  --rdm-spacing-lg: 24px;
  
  /* Typography */
  --rdm-font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  --rdm-font-size-sm: 14px;
  --rdm-font-size-md: 16px;
  --rdm-font-size-lg: 18px;
}
```

### Tema Özelleştirme

```css
/* Özel tema */
.dark-theme {
  --rdm-primary: #3b82f6;
  --rdm-background: #1f2937;
  --rdm-text: #f9fafb;
}
```

---

## 🛠️ Geliştirme

### Gereksinimler

- Node.js 16+
- Modern tarayıcı (ES6+ desteği)

### Geliştirme Ortamı

```bash
# Projeyi klonla
git clone https://github.com/erdemerciyas/RDM-Component-Library.git
cd RDM-Component-Library

# Bağımlılıkları yükle
npm install

# Geliştirme sunucusunu başlat
npm start

# Tarayıcıda aç
open http://localhost:3000
```

### Proje Yapısı

```
RDM-Component-Library/
├── components/          # Bileşen dosyaları
│   ├── select/         # RDM Select
│   │   ├── rdm-select.css
│   │   └── rdm-select.js
│   └── table/          # Table bileşenleri
│       ├── rdm-table.css
│       ├── rdm-table.js
│       ├── rdm-datagrid.css
│       ├── rdm-datagrid.js
│       ├── rdm-cardgrid.css
│       ├── rdm-cardgrid.js
│       ├── rdm-timeline.css
│       └── rdm-timeline.js
├── demos/              # Demo sayfaları
│   ├── select.html
│   ├── table.html
│   ├── datagrid.html
│   ├── cardgrid.html
│   └── timeline.html
├── shared/             # Ortak dosyalar
│   ├── components/     # Yardımcı bileşenler
│   │   └── navigation.js
│   └── styles/         # Global stiller
│       ├── variables.css
│       ├── common.css
│       └── theme.css
├── index.html          # Ana sayfa
└── package.json        # Proje yapılandırması
```

### Yeni Bileşen Ekleme

1. `components/` dizininde yeni klasör oluşturun
2. CSS ve JS dosyalarını ekleyin
3. `demos/` dizininde demo sayfası oluşturun
4. Ana sayfaya bileşeni ekleyin

---

## 🤝 Katkıda Bulunma

Katkılarınızı memnuniyetle karşılıyoruz! 

### Katkı Süreci

1. **Fork** edin
2. **Feature branch** oluşturun (`git checkout -b feature/amazing-feature`)
3. **Commit** edin (`git commit -m 'feat: Add amazing feature'`)
4. **Push** edin (`git push origin feature/amazing-feature`)
5. **Pull Request** açın

### Geliştirme Kuralları

- ✅ ES6+ JavaScript kullanın
- ✅ Responsive tasarım uygulayın
- ✅ Erişilebilirlik standartlarına uyun
- ✅ JSDoc ile dokümante edin
- ✅ Demo sayfası ekleyin

---

## 📈 Yol Haritası

### v1.1.0 (Q2 2024)
- [ ] Form bileşenleri (Input, Textarea, Checkbox)
- [ ] Modal ve Dialog bileşenleri
- [ ] Tooltip ve Popover
- [ ] Loading ve Progress bileşenleri

### v1.2.0 (Q3 2024)
- [ ] Chart bileşenleri
- [ ] Date/Time picker
- [ ] File upload bileşeni
- [ ] Drag & Drop desteği

### v2.0.0 (Q4 2024)
- [ ] Web Components v2 desteği
- [ ] TypeScript tam desteği
- [ ] Tema editörü
- [ ] Performans optimizasyonları

---

## 📊 İstatistikler

- **5** Ana Bileşen
- **23+** Özelleştirme Seçeneği
- **2500+** Kod Satırı
- **98%** Tarayıcı Uyumluluğu
- **AAA** Erişilebilirlik Skoru

---

## 📞 Destek

- 🐛 **Bug Report**: [GitHub Issues](https://github.com/erdemerciyas/RDM-Component-Library/issues)
- 💡 **Feature Request**: [GitHub Discussions](https://github.com/erdemerciyas/RDM-Component-Library/discussions)
- 📧 **E-posta**: erdem.erciyas@gmail.com

---

## 📄 Lisans

Bu proje [MIT Lisansı](LICENSE) altında lisanslanmıştır.

```
MIT License

Copyright (c) 2024 Erdem Erciyas

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

<div align="center">

**RDM Component Library ile modern web uygulamaları geliştirin! 🚀**

[⭐ Star](https://github.com/erdemerciyas/RDM-Component-Library) • [🍴 Fork](https://github.com/erdemerciyas/RDM-Component-Library/fork) • [📖 Docs](https://erdemerciyas.github.io/RDM-Component-Library/)

</div> 