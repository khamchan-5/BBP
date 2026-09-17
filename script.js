const firebaseConfig = {
    apiKey: "AIzaSyBuSEbFvAoU3Z9X3LktX_SlIm6EMHRRtsg",
    authDomain: "my-restaurant-3da21.firebaseapp.com",
    databaseURL: "https://my-restaurant-3da21-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "my-restaurant-3da21",
    storageBucket: "my-restaurant-3da21.firebasestorage.app",
    messagingSenderId: "932377209963",
    appId: "1:932377209963:web:b2b117656e0d7e3366d52e",
    measurementId: "G-4DQHD8RLB8"
};

firebase.initializeApp(firebaseConfig);
const database = firebase.database();

const urlParams = new URLSearchParams(window.location.search);
const currentTable = urlParams.get('table') || '1';
document.getElementById('table-display').innerText = `ໂຕະ: ${currentTable}`;

// ข้อมูลเมนู 20 รายการ พร้อมรูปภาพ
const menuList = [
    // ອາຫານ (Food)
    { id: 'm1', name: 'ເຝີເນື້ອ (Pho Beef)', price: 35000, cat: 'food', img: 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=200' },
    { id: 'm2', name: 'ຕຳໝາກຮຸ່ງ (Papaya Salad)', price: 20000, cat: 'food', img: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=200' },
    { id: 'm3', name: 'ລາບໝູ (Larb Pork)', price: 40000, cat: 'food', img: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=200' },
    { id: 'm4', name: 'ເຂົ້າຜັດກຸ້ງ (Shrimp Fried Rice)', price: 35000, cat: 'food', img: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=200' },
    { id: 'm5', name: 'ຕົ້ມຍຳກຸ້ງ (Tom Yum Shrimp)', price: 50000, cat: 'food', img: 'https://images.unsplash.com/photo-1548946526-f69e2424cf45?w=200' },
    { id: 'm6', name: 'ໄກ່ລາດຍ່າງ (Grilled Chicken)', price: 60000, cat: 'food', img: 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?w=200' },
    
    // ເຄື່ອງດື່ມ (Drink)
    { id: 'm7', name: 'Beerlao Gold (ໃຫຍ່)', price: 22000, cat: 'drink', img: 'https://images.unsplash.com/photo-1608270586620-248524c67de9?w=200' },
    { id: 'm8', name: 'Beerlao Lager (ໃຫຍ່)', price: 18000, cat: 'drink', img: 'https://images.unsplash.com/photo-1535958636474-b021ee887b13?w=200' },
    { id: 'm9', name: 'ໂຄ້ກ / Pepsi (Coke)', price: 10000, cat: 'drink', img: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=200' },
    { id: 'm10', name: 'ນ້ຳດື່ມບໍລິສຸດ (Water)', price: 5000, cat: 'drink', img: 'https://images.unsplash.com/photo-1548839140-29a749e1bc4e?w=200' },
    { id: 'm11', name: 'ຊາເຢັນ (Thai Iced Tea)', price: 15000, cat: 'drink', img: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=200' },
    { id: 'm12', name: 'ກາເຟເຢັນ (Iced Coffee)', price: 18000, cat: 'drink', img: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=200' },

    // ຂອງແກ້ມ (Snack)
    { id: 'm13', name: 'ເອັນໄກ່ທອດ (Fried Chicken Tendon)', price: 30000, cat: 'snack', img: 'https://images.unsplash.com/photo-1562967914-608f82629710?w=200' },
    { id: 'm14', name: 'ໝູແດດດຽວ (Sun-dried Pork)', price: 35000, cat: 'snack', img: 'https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=200' },
    { id: 'm15', name: 'ຖົ່ວດິນທອດ (Fried Peanuts)', price: 15000, cat: 'snack', img: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=200' },
    { id: 'm16', name: 'เฟรนช์ฟรายส์ (French Fries)', price: 25000, cat: 'snack', img: 'https://images.unsplash.com/photo-1576107232684-1279f3908594?w=200' },
    { id: 'm17', name: 'ກຸ້ງແຊ່ນ້ຳປາ (Raw Shrimp Salad)', price: 45000, cat: 'snack', img: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=200' },

    // ບໍລິການ (Service)
    { id: 'm18', name: 'ນ້ຳແຂງ (ถังใหญ่) (Ice Bucket)', price: 10000, cat: 'service', img: 'https://images.unsplash.com/photo-1518110165387-03f3183a6479?w=200' },
    { id: 'm19', name: 'ທິຊຊູ່ (Tissue)', price: 5000, cat: 'service', img: 'https://images.unsplash.com/photo-1584556812952-905ffd0c611a?w=200' },
    { id: 'm20', name: 'ຖ้วຍ/ຈານ ເພີ່ມ (Extra Plates)', price: 0, cat: 'service', img: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=200' }
];

let cart = {};
let currentCategory = 'food';

// แสดงเมนูตามหมวดหมู่
function filterCategory(cat) {
    currentCategory = cat;
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    renderMenu();
}

function renderMenu() {
    const container = document.getElementById('menu-container');
    container.innerHTML = '';

    const filtered = menuList.filter(item => item.cat === currentCategory);
    filtered.forEach(item => {
        const qty = cart[item.id] ? cart[item.id].quantity : 0;
        const card = document.createElement('div');
        card.className = 'menu-card';
        card.innerHTML = `
            <img src="${item.img}" class="menu-thumb" alt="${item.name}">
            <div class="menu-info">
                <h3>${item.name}</h3>
                <div class="price">${item.price.toLocaleString()} ກີບ</div>
            </div>
            <div class="quantity-control">
                <button class="btn-qty" onclick="updateQuantity('${item.id}', '${item.name}', ${item.price}, -1)">-</button>
                <span id="count-${item.id}" style="font-weight:700;">${qty}</span>
                <button class="btn-qty add" onclick="updateQuantity('${item.id}', '${item.name}', ${item.price}, 1)">+</button>
            </div>
        `;
        container.appendChild(card);
    });
}

function updateQuantity(id, name, price, change) {
    if (!cart[id]) cart[id] = { id, name, price, quantity: 0 };
    cart[id].quantity += change;

    if (cart[id].quantity <= 0) delete cart[id];

    const countEl = document.getElementById(`count-${id}`);
    if (countEl) countEl.innerText = cart[id] ? cart[id].quantity : 0;

    renderCartSummary();
}

function renderCartSummary() {
    const items = Object.values(cart);
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    const bar = document.getElementById('cart-bar');
    if (bar) {
        bar.style.display = totalItems > 0 ? 'flex' : 'none';
        document.getElementById('cart-count').innerText = `${totalItems} รายการ`;
        document.getElementById('cart-total').innerText = `${totalPrice.toLocaleString()} ກີບ`;
    }
}

function submitOrder() {
    const items = Object.values(cart);
    if (items.length === 0) return alert('ກະລຸນາເລືອກອາຫານກ່ອນສົ່ງສັ່ງ');

    const totalPrice = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const timeStr = new Date().toLocaleTimeString('lo-LA', { hour: '2-digit', minute: '2-digit' });

    database.ref('kitchen_orders').push({
        table: currentTable,
        items: items,
        total: totalPrice,
        time: timeStr,
        timestamp: Date.now()
    });

    alert('ສົ່ງອໍເດີ້เรียบร้อยແລ້ວ!');
    cart = {};
    renderMenu();
    renderCartSummary();
}

function callStaff() {
    const timeStr = new Date().toLocaleTimeString('lo-LA', { hour: '2-digit', minute: '2-digit' });
    database.ref('service_requests').push({ table: currentTable, type: 'CALL_STAFF', time: timeStr, timestamp: Date.now() });
    alert('ໂທຮຽກພະນັກງານเรียบร้อยແລ້ວ');
}

function requestBill() {
    database.ref(`active_tables/table_${currentTable}`).once('value', (snapshot) => {
        const tableData = snapshot.val();
        if (!tableData || tableData.total === 0) return alert('ຍັງບໍ່ມີรายการອາຫານທີ່ຕ້ອງຊຳລະເງິນ');

        const timeStr = new Date().toLocaleTimeString('lo-LA', { hour: '2-digit', minute: '2-digit' });
        database.ref('service_requests').push({
            table: currentTable,
            type: 'CHECK_BILL',
            total: tableData.total,
            items: tableData.items,
            time: timeStr,
            timestamp: Date.now()
        });
        alert(`ແຈ້ງເຊັກບິນ ໂຕະ ${currentTable} เรียบร้อยແລ້ວ`);
    });
}

// ติดตามรายการที่เสิร์ฟแล้วของโต๊ะตัวเอง
database.ref(`active_tables/table_${currentTable}`).on('value', (snapshot) => {
    const data = snapshot.val();
    const listEl = document.getElementById('served-items-list');
    const totalEl = document.getElementById('served-total-price');

    if (data && data.items && data.items.length > 0) {
        listEl.innerHTML = '';
        data.items.forEach(item => {
            const div = document.createElement('div');
            div.className = 'served-item';
            div.innerHTML = `
                <span>${item.name} x ${item.quantity}</span>
                <span style="font-weight:600;">${(item.price * item.quantity).toLocaleString()} ກີບ</span>
            `;
            listEl.appendChild(div);
        });
        totalEl.innerText = `${data.total.toLocaleString()} ກີບ`;
    } else {
        listEl.innerHTML = '<div style="color: #94a3b8; font-size: 0.85rem;">ຍັງບໍ່ມີรายการที่เสิร์ฟ</div>';
        totalEl.innerText = '0 ກີບ';
    }
});

// เริ่มต้นโหลดรายการอาหาร
renderMenu();