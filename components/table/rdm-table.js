// Sticky header sistemi için global değişkenler
let globalStickyHeader = null;
let globalIsSticky = false;

// Tablo verilerini oluştur
function generateTableData() {
    const table = document.getElementById('dataTable');
    
    // Mevcut sticky header'ı temizle
    cleanupStickyHeader();
    
    // Header oluştur
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    
    // Sütun başlıkları
    const columns = ['ID', 'Isim', 'Soyisim', 'Email', 'Telefon', 'Şehir', 'Yaş', 'Meslek', 'Maaş', 'Departman',
                   'Başlangıç Tarihi', 'Doğum Tarihi', 'Cinsiyet', 'Medeni Durum', 'Eğitim', 'Deneyim', 
                   'Proje Sayısı', 'Performans', 'Bonus', 'Sicil No', 'Vardiya', 'Lokasyon', 'Manager',
                   'Sertifika', 'Dil', 'Yetenek', 'Hobi', 'Acil Durum', 'Kan Grubu', 'Sigorta',
                   'Banka Hesap', 'IBAN', 'Vergi No', 'SGK No', 'Adres', 'Posta Kodu', 'Ülke',
                   'Notlar', 'Durum', 'Son Güncelleme'];
    
    columns.forEach(column => {
        const th = document.createElement('th');
        th.textContent = column;
        headerRow.appendChild(th);
    });
    
    thead.appendChild(headerRow);
    table.appendChild(thead);
    
    // Body oluştur
    const tbody = document.createElement('tbody');
    
    // 200 satır veri oluştur
    for (let i = 1; i <= 200; i++) {
        const row = document.createElement('tr');
        
        // Her sütun için veri oluştur
        const rowData = [
            i.toString().padStart(3, '0'),
            `İsim${i}`,
            `Soyisim${i}`,
            `kullanici${i}@email.com`,
            `+90 5${Math.floor(Math.random() * 100000000).toString().padStart(8, '0')}`,
            ['İstanbul', 'Ankara', 'İzmir', 'Bursa', 'Antalya'][Math.floor(Math.random() * 5)],
            Math.floor(Math.random() * 40) + 22,
            ['Yazılım Geliştirici', 'Veri Analisti', 'Proje Yöneticisi', 'Tasarımcı', 'Test Uzmanı'][Math.floor(Math.random() * 5)],
            `${(Math.floor(Math.random() * 50000) + 15000).toLocaleString('tr-TR')} ₺`,
            ['IT', 'İnsan Kaynakları', 'Pazarlama', 'Satış', 'Muhasebe'][Math.floor(Math.random() * 5)],
            `${Math.floor(Math.random() * 28) + 1}.${Math.floor(Math.random() * 12) + 1}.${Math.floor(Math.random() * 5) + 2020}`,
            `${Math.floor(Math.random() * 28) + 1}.${Math.floor(Math.random() * 12) + 1}.${Math.floor(Math.random() * 30) + 1980}`,
            ['Erkek', 'Kadın'][Math.floor(Math.random() * 2)],
            ['Bekar', 'Evli', 'Boşanmış'][Math.floor(Math.random() * 3)],
            ['Lisans', 'Yüksek Lisans', 'Doktora', 'Lise'][Math.floor(Math.random() * 4)],
            `${Math.floor(Math.random() * 15) + 1} yıl`,
            Math.floor(Math.random() * 20) + 1,
            `${Math.floor(Math.random() * 100) + 1}%`,
            `${Math.floor(Math.random() * 10000)} ₺`,
            `EMP${i.toString().padStart(4, '0')}`,
            ['Gündüz', 'Gece', 'Vardiyalı'][Math.floor(Math.random() * 3)],
            ['Merkez', 'Şube A', 'Şube B', 'Uzaktan'][Math.floor(Math.random() * 4)],
            `Manager${Math.floor(Math.random() * 20) + 1}`,
            ['PMP', 'SCRUM', 'AWS', 'Azure', 'Yok'][Math.floor(Math.random() * 5)],
            ['İngilizce', 'Almanca', 'Fransızca', 'İspanyolca'][Math.floor(Math.random() * 4)],
            ['JavaScript', 'Python', 'Java', 'C#', 'PHP'][Math.floor(Math.random() * 5)],
            ['Spor', 'Müzik', 'Okuma', 'Seyahat', 'Fotoğrafçılık'][Math.floor(Math.random() * 5)],
            `+90 5${Math.floor(Math.random() * 100000000).toString().padStart(8, '0')}`,
            ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'][Math.floor(Math.random() * 8)],
            ['Var', 'Yok'][Math.floor(Math.random() * 2)],
            `TR${Math.floor(Math.random() * 1000000000000000000)}`,
            `TR${Math.floor(Math.random() * 100000000000000000000000000)}`,
            `${Math.floor(Math.random() * 90000000000) + 10000000000}`,
            `${Math.floor(Math.random() * 900000000) + 100000000}`,
            `Adres ${i}, Sokak No: ${Math.floor(Math.random() * 100) + 1}`,
            `${Math.floor(Math.random() * 90000) + 10000}`,
            'Türkiye',
            `Not ${i} - Özel bilgiler`,
            ['Aktif', 'Pasif', 'İzinli'][Math.floor(Math.random() * 3)],
            `${new Date().toLocaleDateString('tr-TR')} ${new Date().toLocaleTimeString('tr-TR')}`
        ];
        
        rowData.forEach(cellData => {
            const td = document.createElement('td');
            td.textContent = cellData;
            row.appendChild(td);
        });
        
        tbody.appendChild(row);
    }
    
    table.appendChild(tbody);
}

// Sticky header temizleme fonksiyonu
function cleanupStickyHeader() {
    // Tüm mevcut sticky header'ları bul ve temizle
    const existingStickyHeaders = document.querySelectorAll('.sticky-header');
    existingStickyHeaders.forEach(header => {
        if (header.parentNode) {
            header.parentNode.removeChild(header);
        }
    });
    
    // Global değişkenleri sıfırla
    globalStickyHeader = null;
    globalIsSticky = false;
    
    // Mevcut event listener'ları temizle
    const oldHandlers = window.stickyHeaderHandlers || [];
    oldHandlers.forEach(handler => {
        window.removeEventListener('scroll', handler);
        const tableWrapper = document.querySelector('.table-wrapper');
        if (tableWrapper) {
            tableWrapper.removeEventListener('scroll', handler);
        }
        window.removeEventListener('resize', handler);
    });
    window.stickyHeaderHandlers = [];
}

// Sticky header fonksiyonu
function initStickyHeader() {
    const table = document.getElementById('dataTable');
    const thead = table.querySelector('thead');
    const tbody = table.querySelector('tbody');
    const tableWrapper = document.querySelector('.table-wrapper');
    
    if (!thead || !tableWrapper || !tbody) return;
    
    // Global değişkenleri kullan
    let stickyHeader = globalStickyHeader;
    let isSticky = globalIsSticky;
    
    // Sticky header oluştur
    function createStickyHeader() {
        if (stickyHeader) return stickyHeader;
        
        // Orijinal thead'i klonla
        stickyHeader = document.createElement('div');
        stickyHeader.className = 'sticky-header';
        
        // Tablo wrapper'ın aynısını oluştur
        const stickyTableWrapper = document.createElement('div');
        stickyTableWrapper.style.overflowX = 'hidden';
        stickyTableWrapper.style.width = '100%';
        stickyTableWrapper.style.position = 'relative';
        
        // Tablo oluştur
        const stickyTable = document.createElement('table');
        stickyTable.style.width = table.style.width || table.offsetWidth + 'px';
        stickyTable.style.tableLayout = 'fixed';
        stickyTable.style.borderCollapse = 'separate';
        stickyTable.style.borderSpacing = '0';
        stickyTable.style.margin = '0';
        
        // Thead klonla
        const clonedThead = thead.cloneNode(true);
        stickyTable.appendChild(clonedThead);
        
        stickyTableWrapper.appendChild(stickyTable);
        stickyHeader.appendChild(stickyTableWrapper);
        
        // İlk sütun için özel sticky ayarları
        const firstTh = clonedThead.querySelector('th:first-child');
        if (firstTh) {
            firstTh.style.position = 'sticky';
            firstTh.style.left = '0px';
            firstTh.style.zIndex = '1001';
            firstTh.style.background = '#2c3e50';
            firstTh.style.borderRight = '2px solid #bdc3c7';
        }
        
        // Global değişkeni güncelle
        globalStickyHeader = stickyHeader;
        
        return stickyHeader;
    }
    
    // Sütun genişliklerini senkronize et
    function syncColumnWidths() {
        if (!stickyHeader || !isSticky) return;
        
        const originalCells = thead.querySelectorAll('th');
        const stickyCells = stickyHeader.querySelectorAll('th');
        
        originalCells.forEach((cell, index) => {
            if (stickyCells[index]) {
                const width = cell.getBoundingClientRect().width;
                stickyCells[index].style.width = width + 'px';
                stickyCells[index].style.minWidth = width + 'px';
                stickyCells[index].style.maxWidth = width + 'px';
            }
        });
    }
    
    // Tablo pozisyon bilgilerini al
    function getTableInfo() {
        const tableRect = table.getBoundingClientRect();
        const wrapperRect = tableWrapper.getBoundingClientRect();
        return {
            tableTop: tableRect.top,
            tableBottom: tableRect.bottom,
            wrapperLeft: wrapperRect.left,
            wrapperWidth: wrapperRect.width,
            scrollLeft: tableWrapper.scrollLeft,
            tableWidth: table.offsetWidth
        };
    }
    
    // Scroll event handler
    function handleScroll() {
        const info = getTableInfo();
        
        // Tablo görünür alanda mı ve header üstte mi kontrol et
        if (info.tableTop <= 0 && info.tableBottom > 60) {
            if (!isSticky) {
                // Sticky duruma geç
                isSticky = true;
                globalIsSticky = true;
                const sticky = createStickyHeader();
                
                // Sticky header'ı sayfaya ekle
                document.body.appendChild(sticky);
                
                // Pozisyon ve boyut ayarları
                sticky.style.left = info.wrapperLeft + 'px';
                sticky.style.width = info.wrapperWidth + 'px';
                
                // Sütun genişliklerini senkronize et
                setTimeout(syncColumnWidths, 10);
                
                // Original thead'i gizle
                thead.style.visibility = 'hidden';
                
                // Tbody'e padding ekle
                tbody.style.paddingTop = '60px';
                
                // Scroll pozisyonunu senkronize et
                const stickyTableWrapper = sticky.querySelector('div');
                stickyTableWrapper.scrollLeft = info.scrollLeft;
            }
            
            // Yatay scroll senkronizasyonu
            if (isSticky && stickyHeader) {
                const stickyTableWrapper = stickyHeader.querySelector('div');
                if (stickyTableWrapper) {
                    stickyTableWrapper.scrollLeft = info.scrollLeft;
                    
                    // İlk sütun sticky pozisyonunu her zaman koru
                    const firstTh = stickyHeader.querySelector('th:first-child');
                    if (firstTh) {
                        firstTh.style.position = 'sticky';
                        firstTh.style.left = '0px';
                        firstTh.style.zIndex = '1001';
                        firstTh.style.background = '#2c3e50';
                        firstTh.style.borderRight = '2px solid #bdc3c7';
                    }
                }
            }
        } else {
            // Normal duruma dön
            if (isSticky) {
                isSticky = false;
                globalIsSticky = false;
                
                // Sticky header'ı kaldır
                if (stickyHeader && stickyHeader.parentNode) {
                    stickyHeader.parentNode.removeChild(stickyHeader);
                }
                
                // Global değişkeni sıfırla
                globalStickyHeader = null;
                stickyHeader = null;
                
                // Original thead'i göster
                thead.style.visibility = 'visible';
                
                // Tbody padding'ini kaldır
                tbody.style.paddingTop = '0';
            }
        }
    }
    
    // Yatay scroll event handler
    function handleHorizontalScroll() {
        if (isSticky && stickyHeader) {
            const info = getTableInfo();
            const stickyTableWrapper = stickyHeader.querySelector('div');
            if (stickyTableWrapper) {
                stickyTableWrapper.scrollLeft = info.scrollLeft;
                
                // İlk sütun için sticky pozisyonunu koru
                const firstTh = stickyHeader.querySelector('th:first-child');
                if (firstTh) {
                    firstTh.style.position = 'sticky';
                    firstTh.style.left = '0px';
                    firstTh.style.zIndex = '1001';
                    firstTh.style.transform = 'translateX(0px)';
                }
            }
        }
    }
    
    // Resize event handler
    function handleResize() {
        if (isSticky) {
            const info = getTableInfo();
            if (stickyHeader) {
                stickyHeader.style.left = info.wrapperLeft + 'px';
                stickyHeader.style.width = info.wrapperWidth + 'px';
                syncColumnWidths();
            }
        }
    }
    
    // Event listeners'ı kaydet (temizleme için)
    window.stickyHeaderHandlers = window.stickyHeaderHandlers || [];
    window.stickyHeaderHandlers.push(handleScroll, handleHorizontalScroll, handleResize);
    
    // Event listeners
    window.addEventListener('scroll', handleScroll);
    tableWrapper.addEventListener('scroll', handleHorizontalScroll);
    window.addEventListener('resize', handleResize);
    
    // İlk kontrol
    handleScroll();
}

// Sayfa yüklendiğinde tabloyu oluştur ve sticky header'ı başlat
document.addEventListener('DOMContentLoaded', function() {
    generateTableData();
    // Tablo oluşturulduktan sonra sticky header'ı başlat
    setTimeout(initStickyHeader, 100);
});