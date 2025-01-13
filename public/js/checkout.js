document.addEventListener("DOMContentLoaded", () => {
    if (!document.getElementById('noteModal')) {
        let noteModal = document.createElement("div");
        noteModal.className = "modal fade";
        noteModal.id = "noteModal";
        noteModal.tabIndex = -1;
        noteModal.setAttribute("aria-labelledby", "noteModalLabel");
        noteModal.setAttribute("aria-hidden", "true");

        noteModal.innerHTML = `
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
`;
        document.body.appendChild(noteModal); 
    }
    if (localStorage.getItem("checkedProducts")) {
        const priceNQty = JSON.parse(localStorage.getItem("checkedProducts"));
        getItems(priceNQty); 
    }
});

const countCheckOutPage = (itemArr, priceArr) => {
    console.log(itemArr, priceArr);
    const totalItems = document.getElementById("total-items");
    const totalPrice = document.getElementById("total-price");

    let sumPrice = 0;
    let sum = 0;

    itemArr.forEach(qty => (sum += qty));
    priceArr.forEach(price => (sumPrice += price));

    totalItems.innerHTML = sum;
    totalPrice.innerHTML = `Rp ${sumPrice.toLocaleString('id-ID')}`;
};


const getStoreName = (datas) => {
    stores = []
    datas.forEach(data => {
        if(stores.indexOf(data.store_name) == -1){
            stores.push(data.store_name)
        }
    })
    return stores.sort()
}


const openNoteModal = (productId, note) => {
    console.log(document.getElementById('noteTextArea'));
    console.log(note)
    currentNoteProductId = productId;
    activeId = productId
    document.getElementById('noteTextArea').value = note;
    const noteModal = new bootstrap.Modal(document.getElementById('noteModal'));
    noteModal.show();
  };

const saveNote = () => {
    const noteValue = document.getElementById('noteTextArea').value; 
    console.log(activeId, noteValue)
    updateNote(activeId, noteValue);
};

const updateNote = (productId, noteValue) => {
axios({
    method: "put",
    url: `http://localhost:3000/product/note/${productId}`,
    data: {
    note: noteValue
    }
})
    .then(response => {
    if (response.status === 200) {
        console.log("Note updated successfully");
        alert("Catatan berhasil disimpan.");
        window.location.href = "/check-out"
        // const noteModal = bootstrap.Modal.getInstance(document.getElementById('noteModal'));
        // if (noteModal) noteModal.hide();
    }
    })
    .catch(err => {
    if(err.response && err.response.status == 400){
        alert("Belum Mengisi Note")
    }
    else{console.error("Error updating note:", err.message)}
    });
};

const getDatas = async (idsArr) => {
    try{
        const response = await axios({
            method : "post",
            url : "http://localhost:3000/get-product-info",
            data : {
                ids : idsArr
            }
        })
        return response.data.data
    }
    catch(err){ console.log(err)}
}

const getItems = async (priceNQty) => {
    const items = JSON.parse(localStorage.getItem("checkedProducts"));
    console.log(items);

    // Add to HTML
    await addToHTML(items);

    countCheckOutPage(priceNQty.qty, priceNQty.price);
};

const addToHTML = async (items) => {
    if (items.ids.length === 0) {
        document.getElementById("checkout").innerHTML = `
          <div class="d-flex align-items-center justify-content-center vh-100">
            <p class="text-center" style="background-color: #FF6600 ; color: white; padding: 50px; border-radius: 5px; font-weight: bold; ">
            Tidak ada Barang untuk di check-out!
            </p>
        </div>

        `;
    } else {
        let rootContainer = document.createElement("div");
        rootContainer.id = "content";
        rootContainer.className = "container my-5 px-4 mx-auto";

        let mainContainer = document.createElement("div");
        mainContainer.className = "table-responsive";
        rootContainer.appendChild(mainContainer);

        let datas = await getDatas(items.ids);
        console.log(datas);

        let stores = getStoreName(datas);
        console.log(stores);

        let mainStoreContainer = document.createElement("div");
        mainStoreContainer.className = "container my-5 px-4 mx-auto";

        stores.forEach((store) => {
            let storeContainer = document.createElement("div");
            storeContainer.className = "mb-4 border-bottom pb-3";

            let storeHeader = document.createElement("div");
            storeHeader.className = "d-flex align-items-center justify-content-between bg-light p-3";
            storeHeader.style.setProperty("background-color", "#FFFFFF", "important");
            storeHeader.style.setProperty("box-shadow", "0 4px 6px rgba(0, 0, 0, 0.1)", "important");
            storeHeader.innerHTML = `<h3 class="m-0" style="color:#FF6600; font-weight:bold;">${store}</h3>`;
            storeContainer.appendChild(storeHeader);

            datas.forEach((product, index) => {
                if (product.store_name === store) {
                    let productContainer = document.createElement("div");
                    productContainer.className = "d-flex align-items-center p-3 border-bottom";
                    productContainer.style.setProperty("box-shadow", "0 4px 6px rgba(0, 0, 0, 0.1)", "important");


                    productContainer.innerHTML = `
                          <img src="${product.product_image_link}" alt="Product Image" class="img-thumbnail" style="width: 100px; height: auto;">
                        <div class="ms-3 flex-grow-1">
                        <p class="fw-bold m-0" style="margin-left: 15px !important; font-weight:bold;">${product.product_name}</p>
                        <div style="margin-left: 15px; margin-top: 15px;">
                        <button class="btn btn-sm btn-outline-secondary note-icon" onclick="openNoteModal(${product.product_id}, '${product.note !== null ? product.note : ""}')"
                            style="background-color: #FF6600; color: white;  padding: 5px 10px;">
                            <i class="bi bi-card-text"></i>
                        </button>
                        </div>
                        </div>
                        <div class="text-end" style="width: 120px; padding-left: 20px; font-weight:bold;">
                            <p class="m-0">Rp ${(product.product_price * (1 - product.discount)).toLocaleString()}</p>
                        </div>


                        <div class="text-end" style="width: 125px; padding: 10px; margin-left:40px; font-weight:bold;">
                            <p class="m-0">${items.qty[index]}</p>
                        </div>


                        <div class="text-end" style="width: 120px; padding-left: 20px; color:#ff6600; font-weight:bold;">
                            <p class="m-0">Rp ${items.price[index].toLocaleString()}</p>
                            
                        </div>
                        `;

                    storeContainer.appendChild(productContainer);
                }
            });

            mainStoreContainer.appendChild(storeContainer);
        });

        let footer = document.createElement("footer");
        footer.className = "bg-light p-3 mt-4 ";
        footer.style.setProperty("background-color", "#FFFFFF", "important");
        footer.style.setProperty("box-shadow", "0 4px 6px rgba(0, 0, 0, 0.1)", "important");
        footer.innerHTML = `
            <div class="d-flex justify-content-between" style="background-color: #FFFFFF; padding: 10px; border-radius:5px;">
               <h5 style="background-color: #ff6600; padding: 10px; color: #FFFFFF; margin-top:5px; font-weight:bold;">Total Order</h5>
                <div class="d-flex align-items-center justify-content-center" >
                    <div class="fw-bold me-2" id="total-items" style="margin-right:120px; margin-left:5px; font-weight:bold;"></div> 
                    <div class="fw-bold ms-3" id="total-price" style="color: #FF6600; font-weight:bold; margin-right:20px;" ></div>
                </div>
            </div>
        `;
        mainStoreContainer.appendChild(footer);

        document.getElementById("checkout").appendChild(mainStoreContainer);
    }
};



