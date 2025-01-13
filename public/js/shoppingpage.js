const templateHTML = `
  <div class="header-container d-flex justify-content-between align-items-center mb-4">
  <div class="d-flex align-items-center">
    <h1 class="m-0">Daftar Produk</h1>
    <div class="top-checkbox-container d-flex align-items-center justify-content-center ms-3">
      <input type="checkbox" id="all-checked" onclick="checkAll(this.checked)" />
      <p class="m-0 ms-1"> Pilih semua </p>
    </div>
  </div>
    <button id="reload" onclick="reload()" class="btn">
      <i class="bi bi-arrow-clockwise"></i>
    </button>
</div>

<div class="d-flex" style=" width:1280px;">
    <!-- Table Section -->
    <div class="table-responsive flex-grow-1" id="store-list">
      <table class="table" id="store-list">
        <colgroup>
          <col style="width: 100%;"> <!-- Check column -->
          <col style="width: 25%;"> <!-- Image column -->
          <col style="width: 15%;"> <!-- Product Name column -->
          <col style="width: 10%;"> <!-- Price column -->
        </colgroup>
      </table>
    </div>
  </div>
</div>

<div class="shopping-summary p-2 border-top shadow" 
     style="max-width: 100%; width: 100%; background-color: #ffffff; font-family: 'Poppins', sans-serif; color: #111111; position: fixed; bottom: 0; left: 0; z-index: 1000; box-shadow: 0 -2px 5px rgba(0, 0, 0, 0.1); padding: 20px 0;">
  <div class="d-flex justify-content-between align-items-center mb-3">
    <strong style="font-size: 16px;">Total Produk:</strong>
    <span id="total-items" style="font-size: 16px; margin-right:30px;">0</span>
  </div>

  <div class="d-flex justify-content-between align-items-center mb-3">
    <strong style="font-size: 16px;">Total Harga:</strong>
    <span id="total-price" style="font-size: 16px; font-weight: bold; color: #FF4500; margin-right:20px;">Rp 0</span>
  </div>

  <div class="d-flex justify-content-end">
    <button 
      class="btn btn-primary shadow-sm" 
      style="background-color: #FF6600; color: white; font-family: 'Poppins', sans-serif; font-weight: bold; font-size: 18px; border: none; border-radius: 5px; margin-right:15px;" 
      onclick="checkout()">
      Checkout
    </button>
  </div>
</div>

<!-- Modal for editing note -->
<div class="modal fade" id="noteModal" tabindex="-1" aria-labelledby="noteModalLabel" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="noteModalLabel">Edit Note</h5>
        <button type="button" class="btn btn-secondary btn-close d-flex align-items-center" data-bs-dismiss="modal">
          <i class="bi bi-x-circle me-2"></i> 
        </button>
      </div>
      <div class="modal-body">
        <textarea id="noteTextArea" class="form-control" rows="4" placeholder="Enter your note here..."></textarea>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary d-flex align-items-center" data-bs-dismiss="modal">
           Close
        </button>
        <button type="button" class="btn btn-primary" onclick="saveNote()">Save Note</button>
      </div>
    </div>
  </div>
</div>


`;

const style = document.createElement("style");
style.textContent = `

  .header-container {
    background-color: #FFFFFF;
    padding: 10px 20px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    margin-top: 50px;
    width: 80%;
    margin: 50px auto 0;  /* Menambahkan margin otomatis di kiri dan kanan untuk memusatkan */
}

  .header-container h1 {
    font-size: 24px;
    color: #FF6600;
    margin: 0;
  }
  .top-checkbox-container {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 5px 15px;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }
 
  .top-checkbox-container input[type="checkbox"] {
   
    margin-right: 10px;
    transform: scale(1.2);
    cursor: pointer;
  }
  .top-checkbox-container p {
    margin: 0;
    color: #FF6600;
    font-size: 1.2.rem;
    font-family: 'Roboto', sans-serif;
    font-weight: bold;
  }
  #store-list {
  padding-bottom: 180px; 
  }

  .store-avatar {
    width: 40px;          
    height: 40px;         
    border-radius: 50%;  
    object-fit: cover;    
    margin-left: 10px;   
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); 
    border: 2px solid #FF6600;
  }


`;
document.head.appendChild(style);

document.getElementById('content').innerHTML = templateHTML;

const getData = () => {
  fetch("https://websites-projects.vercel.app/").then(results => {
    return results.json()
  }).then(data => addDataToHTML(data)).catch(err => console.log(err))
}

getData()

const getStoreName = (datas) => {
  let storesMap = new Map(); 

  datas.response.forEach(data => {
    if (!storesMap.has(data.store_name)) {
      storesMap.set(data.store_name, {
        store_name: data.store_name,
        store_img_link: data.store_image_link
      });
    }
  });

  return Array.from(storesMap.values()).sort((a, b) => a.store_name.localeCompare(b.store_name));
};
const getId = (datas, storeName) => {
  let storeIds = []
  for(let i = 0; i < storeName.length; i++){
    datas.response.forEach(data => {
      if(data.store_name == storeName[i].store_name && storeIds.indexOf(data.store_id) == -1){
        storeIds.push(data.store_id)
      }
    })
  }
  return storeIds
}

let currentNoteProductId = null;

const addDataToHTML = (datas) => {
  const storeList = document.getElementById('store-list');
  const storeName = getStoreName(datas);
  const idList = getId(datas, storeName);
  let seeIfAllChecked = 0;

  for (let i = 0; i < storeName.length; i++) {
    const rootContainer = document.createElement("div");
    rootContainer.id = `store-${idList[i]}`;
    rootContainer.className = "store-section mb-4";
    rootContainer.style.marginLeft = " 130px";
    
    const storeRows = document.createElement("div");
    storeRows.className = "d-flex justify-content-between align-items-center p-2 border rounded bg-light mb-2";
    storeRows.style.justifyContent = "center";
    storeRows.innerHTML = `
      <div class="d-flex align-items-center ms-2">
        <input type="checkbox" class="store-checked" id="check-store-${idList[i]}" onchange="toggleStoreProducts(event, ${idList[i]}, this.checked)" />
        <strong  style="font-size: 16px; font-family: 'Arial', sans-serif; color: #FF6600 ; margin-left:15px;">${storeName[i].store_name}</strong>
        <img src="${storeName[i].store_img_link}" class="store-avatar" alt="${storeName[i].store_name}">
      </div>
      <button class="btn btn-danger btn-sm" onclick="deleteStore(event, ${idList[i]})">Hapus Toko</button>
    `;
    rootContainer.appendChild(storeRows);

    const table = document.createElement("table");
    table.className = "table table-striped";
    const thead = document.createElement("thead");
    const tbody = document.createElement("tbody");
    tbody.id = `table-${idList[i]}`;

    const headerRow = document.createElement("tr");
    headerRow.className = "table";
    
    thead.appendChild(headerRow);
    table.appendChild(thead);
    table.appendChild(tbody);
    rootContainer.appendChild(table);

    let storeProducts = [];
    datas.response.forEach(data => {
      if (data.store_name === storeName[i].store_name) {
        storeProducts.push(data);
      }
    });

    let isCheckedAll = 0;

    storeProducts.forEach((item, index) => {
      if (item.isChecked == 1) {
        isCheckedAll += 1;
        seeIfAllChecked += 1;
      }

      const row = document.createElement("tr");
      row.className = "table-row";
      row.style.setProperty("box-shadow", "0 4px 6px rgba(0, 0, 0, 0.1)", "important");
    
      row.id = `${item.product_id}`;
      row.innerHTML = `
        <td>
        <td>
          <input type="checkbox" ${item.isChecked === 1 ? "checked" : ""} onclick="AddProduct(event, ${item.product_id}, this.checked)" class="item-checkbox" id="check-${item.id}-${index}" />
        </td>
        <td>
          <img src="${item.product_image_link}" alt="${item.product_name}" style="width: 90px; height: 100px">
        </td>
        <td>
          <strong>${item.product_name}</strong>
          <p class="text-muted m-0">${item.description}</p>
        </td>
        <div class="container d-flex flex-column align-items-center justify-content-center">
          <div><small><s>${item.product_price}</s></small></div>
          <div class="item-price">Rp${formatPrice((1-item.discount)*item.product_price)}</div>
        </div>
        <td style="font-size: 16px; font-family: 'Arial', sans-serif; color: #e74c3c; font-weight: bold; text-transform: uppercase;">
        ${item.discount * 100}%</td>
        <td>
          <button class="btn btn-sm btn-outline-secondary note-icon" onclick="openNoteModal(${item.product_id}, '${item.note !== null? item.note : ""}')">
            <i class="bi bi-card-text"></i>
          </button>
        </td>
       <td class="control-quantity" style="text-align: center; width: 150px; padding: 10px;">
    <div class="qty-controls d-flex justify-content-center align-items-center">
        <button class="btn btn-sm btn-outline-secondary" onclick="changeQty(event, -1); toggleStoreProducts(event, ${idList[i]})" id="dec-${item.product_id}-${index}">-</button>
        <input type="number" value="${item.isChecked == 1 ? item.quantity : 1}" min="1" id="qty-${item.product_id}-${index}" class="qty form-control form-control-sm mx-2" style="width: 50px; text-align: center;" oninput="toggleStoreProducts(event, ${idList[i]})">
        <button class="btn btn-sm btn-outline-secondary" onclick="changeQty(event, 1); toggleStoreProducts(event, ${idList[i]})" id="inc-${item.product_id}-${index}">+</button>
    </div>
</td>

       <td>
  <button class="btn btn-danger btn-sm" onclick="deleteProduct(event, ${item.product_id})">
    <i class="bi bi-trash"></i>
  </button>
</td>

      `;
      tbody.appendChild(row);
    });

    storeList.appendChild(rootContainer);

    if (isCheckedAll == storeProducts.length) {
      document.querySelector(`#check-store-${idList[i]}`).checked = true;
    } else if (isCheckedAll != storeProducts.length) {
      document.querySelector(`#check-store-${idList[i]}`).checked = false;
    }
  }
  if (seeIfAllChecked == datas.response.length) {
    document.getElementById("all-checked").checked = true;
  } else if (seeIfAllChecked != datas.response.length) {
    document.getElementById("all-checked").checked = false;
  }
};



document.addEventListener("DOMContentLoaded", function () {
  const reloadButton = document.getElementById("reload");
  reloadButton.innerHTML = '<i class="bi bi-arrow-clockwise"></i>'; 
  reloadButton.style.fontSize = "1.5rem"; 
  reloadButton.style.color = "#FF6600";  
  reloadButton.style.backgroundColor = "transparent"; 
  reloadButton.style.border = "none"; 
  reloadButton.style.cursor = "pointer";
});


