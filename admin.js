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

const foodContainer = document.getElementById('food-orders-container');
const serviceContainer = document.getElementById('service-requests-container');

// ดึงรายการสั่งอาหาร
database.ref('kitchen_orders').on('value', (snapshot) => {
    const data = snapshot.val();
    foodContainer.innerHTML = '';
    let hasData = false;

    if (data) {
        Object.entries(data).reverse().forEach(([key, order]) => {
            hasData = true;
            renderKitchenCard(key, order);
        });
    }
    if (!hasData) foodContainer.innerHTML = '<div class="empty-state">ຍັງບໍ່ມີອໍເດີ້เข้ามา</div>';
});

// ดึงการเรียกพนักงาน/เช็คบิล
database.ref('service_requests').on('value', (snapshot) => {
    const data = snapshot.val();
    serviceContainer.innerHTML = '';
    let hasData = false;

    if (data) {
        Object.entries(data).reverse().forEach(([key, req]) => {
            hasData = true;
            renderServiceCard(key, req);
        });
    }
    if (!hasData) serviceContainer.innerHTML = '<div class="empty-state">ຍັງບໍ່ມີการเรียก</div>';
});

function renderKitchenCard(key, order) {
    const card = document.createElement('div');
    card.className = 'order-card type-food';

    let itemsHTML = '';
    order.items.forEach((item) => {
        itemsHTML += `<li><span><strong>${item.name}</strong> x ${item.quantity}</span> <span>${(item.price * item.quantity).toLocaleString()} ກີບ</span></li>`;
    });

    card.innerHTML = `
        <div class="card-header">
            <span class="table-number">🍽️ ໂຕະ ${order.table}</span>
            <span style="font-size:0.85rem; color:#64748b;">⏱️ ${order.time}</span>
        </div>
        <ul class="item-list">${itemsHTML}</ul>
        <div style="text-align:right; font-weight:700; margin-bottom:10px;">ຍອດ: ${order.total.toLocaleString()} ກີບ</div>
        <div class="btn-group">
            <button class="btn btn-serve" onclick="serveOrder('${key}')">✅ ເສີບແລ້ວ (บันทึกยอดไปโต๊ะ)</button>
            <button class="btn btn-delete" onclick="deleteOrder('${key}')">🗑️ ຍົກເລີກ/ລົບ</button>
        </div>
    `;
    foodContainer.appendChild(card);
}

function renderServiceCard(key, req) {
    const card = document.createElement('div');
    const isBill = req.type === 'CHECK_BILL';
    card.className = `order-card ${isBill ? 'type-bill' : 'type-call'}`;

    card.innerHTML = `
        <div class="card-header">
            <span class="table-number">${isBill ? '💰 ແຈ້ງເຊັກບິນ' : '🙋‍♂️ ຮຽກພະນັກງານ'} - ໂຕະ ${req.table}</span>
            <span style="font-size:0.85rem; color:#64748b;">⏱️ ${req.time}</span>
        </div>
        ${isBill ? `<div style="font-weight:700; color:#10b981; margin-bottom:10px;">ຍອດລວມ: ${req.total.toLocaleString()} ກີບ</div>` : ''}
        <button class="btn btn-serve" style="width:100%;" onclick="resolveService('${key}', '${req.type}', '${req.table}')">
            ${isBill ? '✅ ຮັບເງິນเรียบร้อย (ລ້າງໂຕະ)' : '✅ ເຮັດเรียบร้อย'}
        </button>
    `;
    serviceContainer.appendChild(card);
}

// ยืนยันว่า "เสิร์ฟแล้ว" -> บันทึกยอดเข้าโต๊ะของลูกค้า
function serveOrder(key) {
    database.ref(`kitchen_orders/${key}`).once('value', (snapshot) => {
        const order = snapshot.val();
        if (!order) return;

        const tableRef = database.ref(`active_tables/table_${order.table}`);
        tableRef.once('value', (tSnapshot) => {
            const currentData = tSnapshot.val() || { total: 0, items: [] };
            const newTotal = (currentData.total || 0) + order.total;
            const newItems = [...(currentData.items || []), ...order.items];

            tableRef.set({
                table: order.table,
                total: newTotal,
                items: newItems,
                lastUpdated: new Date().toLocaleTimeString('lo-LA')
            }).then(() => {
                database.ref(`kitchen_orders/${key}`).remove();
            });
        });
    });
}

// ยกเลิก/ลบออเดอร์
function deleteOrder(key) {
    if (confirm('ທ່ານຕັ້ງໃຈຈະລົບອໍເດື້ນີ້ບໍ?')) {
        database.ref(`kitchen_orders/${key}`).remove();
    }
}

function resolveService(key, type, tableNum) {
    if (type === 'CHECK_BILL') {
        if (confirm(`ຢືນຢັນການຮັບຊຳລະເງິນ ໂຕະ ${tableNum}?`)) {
            database.ref(`active_tables/table_${tableNum}`).once('value', (snapshot) => {
                const tableData = snapshot.val();
                if (tableData) {
                    database.ref('transaction_history').push({
                        table: tableNum,
                        total: tableData.total,
                        items: tableData.items,
                        completedAt: new Date().toLocaleString('lo-LA'),
                        timestamp: Date.now()
                    }).then(() => {
                        database.ref(`active_tables/table_${tableNum}`).remove();
                        database.ref(`service_requests/${key}`).remove();
                        alert(`ຊຳລະເງິນ ໂຕະ ${tableNum} เรียบร้อย!`);
                    });
                } else {
                    database.ref(`service_requests/${key}`).remove();
                }
            });
        }
    } else {
        database.ref(`service_requests/${key}`).remove();
    }
}