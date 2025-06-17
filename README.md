# RDM Component Library

Modern, özelleştirilebilir ve erişilebilir HTML bileşenleri.

## Bileşenler

### RDM Select

Modern ve özelleştirilebilir bir select bileşeni. Aşağıdaki özellikleri destekler:

- Tekli ve çoklu seçim
- Arama/filtreleme
- Özelleştirilebilir görünüm
- Klavye navigasyonu
- Erişilebilirlik desteği
- Form validasyonu
- İkon desteği
- Responsive tasarım

[Select Demo](demos/select.html)

#### Kullanım

```html
<!-- HTML ile -->
<rdm-select label="Ülke Seçin" placeholder="Bir ülke seçin" clearable>
  <rdm-select-option value="tr">Türkiye</rdm-select-option>
  <rdm-select-option value="us">Amerika Birleşik Devletleri</rdm-select-option>
  <rdm-select-option value="de">Almanya</rdm-select-option>
  <rdm-select-option value="fr">Fransa</rdm-select-option>
</rdm-select>

<!-- JavaScript ile -->
<rdm-select id="select" label="Ülke Seçin" placeholder="Bir ülke seçin" clearable></rdm-select>

<script>
const select = document.getElementById('select');
select.options = [
  { value: 'tr', label: 'Türkiye' },
  { value: 'us', label: 'Amerika Birleşik Devletleri' },
  { value: 'de', label: 'Almanya' },
  { value: 'fr', label: 'Fransa' }
];
</script>
```

#### Özellikler

| Özellik | Tip | Varsayılan | Açıklama |
|---------|-----|------------|-----------|
| label | string | - | Bileşen etiketi |
| placeholder | string | "Select an option" | Seçim yapılmadığında gösterilecek metin |
| value | string | - | Seçili değer |
| clearable | boolean | false | Seçimi temizleme butonu göster/gizle |
| disabled | boolean | false | Bileşeni devre dışı bırak |
| multiple | boolean | false | Çoklu seçim modu |
| required | boolean | false | Form validasyonu için zorunlu alan |
| size | string | "medium" | Boyut (small, medium, large) |
| search-bar | boolean | false | Arama/filtreleme özelliği |
| validation-state | string | "default" | Validasyon durumu (default, invalid, warning, success) |

## Geliştirme

1. Projeyi klonlayın
2. Bağımlılıkları yükleyin: `npm install`
3. Geliştirme sunucusunu başlatın: `npm start`
4. Tarayıcıda açın: `http://localhost:3000`

## Lisans

MIT 