let activeId = 0;
document.addEventListener("DOMContentLoaded",() => {
    if(localStorage.getItem("checkedProducts")){
        priceNQty = JSON.parse(localStorage.getItem("checkedProducts"))
        price = priceNQty.price
        qty = priceNQty.qty
        console.log("dom",priceNQty)
        countCheckOutPage(qty,price)
    }
})
const openNoteModal = (productId, note) => {
  console.log(note)
  currentNoteProductId = productId;
  activeId = productId
  document.getElementById('noteTextArea').value = note;
  const noteModal = new bootstrap.Modal(document.getElementById('noteModal'));
  noteModal.show();
};

const checkout = () => {
  window.location.href = "/check-out"
}

const saveNote = () => {
  const noteValue = document.getElementById('noteTextArea').value; 
  console.log(activeId, noteValue)
  updateNote(activeId, noteValue);
};

const updateNote = (productId, noteValue) => {
  axios({
    method: "put",
    url: `https://websites-projects.vercel.app/product/note/${productId}`,
    data: {
      note: noteValue
    }
  })
    .then(response => {
      if (response.status === 200) {
        console.log("Note updated successfully");
        alert("Catatan berhasil disimpan.");
        window.location.href = "/cart"
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

const setLocalStorage = (itemArr, PriceArr, idArr) => {
    let itemNPrice = {}
    if(localStorage.getItem("checkedProducts")){
        localStorage.removeItem("checkedProducts")
        console.log("local storage removed")
        itemNPrice.qty = itemArr
        itemNPrice.price = PriceArr
        itemNPrice.ids = idArr
        localStorage.setItem("checkedProducts", JSON.stringify(itemNPrice))
        console.log("set new localstorage after remove", itemNPrice)
    }
    if(!localStorage.getItem("checkedProducts")){
        itemNPrice.qty = itemArr
        itemNPrice.price = PriceArr
        itemNPrice.ids = idArr
        localStorage.setItem("checkedProducts", JSON.stringify(itemNPrice))
        console.log("set localstorage", itemNPrice)
    }
    countCheckOutPage(itemArr,PriceArr)
}

const formatPrice = (price) => {
  return price.toLocaleString('de-DE')
}

// console.log(formatPrice(4000),formatPrice(40000),formatPrice(400000),formatPrice(4000000),formatPrice(14000000))

const countCheckOutPage = (itemArr, PriceArr) => {
  console.log(itemArr, PriceArr)
  const totalItems = document.getElementById("total-items")
  const totalPrice = document.getElementById("total-price")

  let sumPrice = 0
  let sum = 0

  itemArr.forEach(qty => sum += qty)
  PriceArr.forEach(price => sumPrice += price)

  totalItems.innerHTML = sum
  totalPrice.innerHTML =`Rp ${formatPrice(sumPrice)}`
}


const updateCOPage = () => {
    let itemArr = []
    let PriceArr = []
    let ids = []
    mainCheckBox = document.getElementById("all-checked").checked
    //if all item in cart is checked
    if(mainCheckBox){
        
       document.querySelectorAll(".table-row").forEach(item => {
            let id = item.id
            let qty = parseInt(item.querySelector(".qty").value)
            let price = parseInt(item.querySelector(".item-price").textContent.replace(".","").slice(2))
            console.log("price",price)
            itemArr.push(qty)
            PriceArr.push(price*qty)
            ids.push(id)
        })
        
        setLocalStorage(itemArr,PriceArr,ids)
    }

    else if(!mainCheckBox){
        console.log("update co page all-checked = false")
    
        document.querySelectorAll(".table-row").forEach(item => {
            if(item.querySelector(".item-checkbox").checked){
                let product_id = item.id
                // console.log("product id after checked : ", product_id)
                let qty = parseInt(item.querySelector(".qty").value)
                let price = parseInt(item.querySelector(".item-price").textContent.replace(".","").slice(2))
                console.log("price",price)
                // console.log(price.slice(2))
                itemArr.push(qty)
                PriceArr.push(price*qty)
                ids.push(product_id)
            }
        })
     
        setLocalStorage(itemArr,PriceArr,ids)
    }
    
}

const checkAll = (check) => {
  let info = []
  
  if(check){
    document.querySelectorAll(".store-section").forEach(storeRow => {
      storeRow.querySelector(".store-checked").checked = true
      storeRow.querySelectorAll(".table-row").forEach(item => {
        let temp = {}
        item.querySelector(".item-checkbox").checked = true
        temp.qty = item.querySelector(".qty").value
        temp.id = item.id
        info.push(temp)
      })
    })
    updateCOPage()
    console.log(info)
    axios({
      method : "put",
      url : "https://websites-projects.vercel.app/allStores",
      data : {
        isChecked : 1,
        infos : info
      }
    }).then(results => console.log(results)).catch(err => console.log(err))
  }
  if(!check){
    document.querySelectorAll(".store-section").forEach(storeRow => {
      storeRow.querySelector(".store-checked").checked = false
      storeRow.querySelectorAll(".table-row").forEach(item => {
        let temp = {}
        item.querySelector(".item-checkbox").checked = false
        temp.qty = item.querySelector(".qty").value
        temp.id = parseInt(item.id)
        info.push(temp)
      })
    })
    updateCOPage()
    axios({
      method : "put",
      url : "https://websites-projects.vercel.app/allStores",
      data : {
        isChecked : 0,
        infos : info
      }
    }).then(results => console.log(results)).catch(err => console.log(err))
  }
}

function changeQty(event, incDec) {
  let curr = parseInt(event.target.closest(".table-row").querySelector(".control-quantity .qty-controls .qty").value)
  curr += parseInt(incDec)
  if (curr <= 1) {
    event.target.closest(".table-row").querySelector(".control-quantity .qty-controls .qty").value = 1
  } else{
  event.target.closest(".table-row").querySelector(".control-quantity .qty-controls .qty").value = curr
  }
}

function toggleStoreProducts(event, store_id , checked){
  let info = []
  let isChecked = 0
  
  if(checked === undefined){
    //fungsi jika nilai qty berubah kalau misal checkbox toko/ checkbox semua di klik
    const allChecked = document.getElementById("all-checked").checked
    const mainCheckboxChecked = event.target.closest(".store-section").querySelector(".store-checked").checked
    isChecked = 1
    if(allChecked){
      return checkAll(allChecked)
    }
    if(mainCheckboxChecked){
      console.log(2)
      updateCOPage()
      event.target.closest(".store-section").querySelectorAll(".table-row").forEach(tr => {
        let temp = {}
        temp.id = tr.id
        temp.qty = tr.querySelector(".qty").value
        info.push(temp)
      })

      axios({
        method : "put",
        url : `https://websites-projects.vercel.app/store/${store_id}`,
        data : {
              isChecked : isChecked,
              infos : info
            }
      }).then(results => console.log(results.status)).catch(err => console.log(err))
    }

  if(!mainCheckboxChecked){
    const productChecked = event.target.closest(".table-row").querySelector(".item-checkbox").checked
    console.log(productChecked)
    if(productChecked){
    const quantity = event.target.closest(".table-row").querySelector(".qty").value
    const product_id = parseInt(event.target.closest(".table-row").id)
    updateCOPage()
    axios({
      method : "put",
      url : `https://websites-projects.vercel.app/products/${product_id}`,
      data : {
        isChecked : 1,
        quantity : quantity
      }
    }).then((results) => {
      if(results.status == 200){
        console.log("successfully change isChecked")
      }
      else{
        console.log("failed to set isChecked")
      }
    }).catch(err => console.log(err))}
    }
  }

  if(checked){
    isChecked = 1
    event.target.closest(".store-section").querySelectorAll(".table-row").forEach(tr => {
      let temp = {}
      tr.querySelector(".item-checkbox").checked = true
      //get product_id and quantity
      temp.id = tr.id
      temp.qty = tr.querySelector(".qty").value
      info.push(temp)
    })
    updateCOPage()
    axios({
    method : "put",
    url : `https://websites-projects.vercel.app/store/${store_id}`,
    data : {
        isChecked : isChecked,
        infos : info
    }
    }).then(results => console.log(results, "successfully checked all store products")).catch(
        err => console.log(err)
    )

  }  

  else if(!checked && checked != undefined){
    event.target.closest(".store-section").querySelectorAll(".table-row").forEach(tr => {
      tr.querySelector(".item-checkbox").checked = false
      let temp = {}
      temp.id = tr.id
      //set 0 jika gak di check
      temp.qty = 0
      info.push(temp)
    })
    updateCOPage()
    axios({
      method : "put",
      url : `https://websites-projects.vercel.app/store/${store_id}`,
      data : {
        isChecked : isChecked,
        infos : info
      }
      }).then(results => console.log(results, "successfully checked all store products")).catch(
        err => console.log(err)
      )
 }
 checkIsChecked()
} 

function AddProduct(event, product_id, checked){
  checkIsChecked()
  const quantity = event.target.closest(".table-row").querySelector(".qty").value
  console.log(quantity)
  if(checked){
    updateCOPage()
    axios({
      method : "put",
      url : `https://websites-projects.vercel.app/products/${product_id}`,
      data : {
        isChecked : 1,
        quantity : quantity
      }
    }).then((results) => {
      if(results.status == 200){
        console.log("successfully change isChecked")
      }
      else{
        console.log("failed to set isChecked")
      }
    }).catch(err => console.log(err))
  }
  else{
    console.log("not checked") 
    updateCOPage()
    axios({
      method : "put",
      url : `https://websites-projects.vercel.app/products/${product_id}`,
      data : {
        isChecked : 0,
        quantity : 0
      }
    }).then((results) => {
      if(results.status == 200){
        console.log("successfully change isChecked")
      }
      else{
        console.log("failed to set isChecked")
      }
    }).catch(err => console.log(err))
  }
}

const checkIsChecked = () => {
  let allCheckedCount = 0
  document.querySelectorAll(".store-section").forEach(storeRow => {
    let checklistStore = 0
    storeRow.querySelectorAll(".table-row").forEach(productRow => {
      if(productRow.querySelector(".item-checkbox").checked){
        checklistStore += 1
        allCheckedCount += 1
      }
    }) 
    if (checklistStore == storeRow.querySelectorAll(".table-row").length ){
      storeRow.querySelector(".store-checked").checked = true
    }
    if (checklistStore != storeRow.querySelectorAll(".table-row").length ){
      storeRow.querySelector(".store-checked").checked = false
    }
  })
  if (allCheckedCount == document.querySelectorAll(".table-row").length ){
    document.getElementById("all-checked").checked = true
  }
  if (allCheckedCount != document.querySelectorAll(".table-row").length ){
    document.getElementById("all-checked").checked = false
  }
}

const reload = () => {
  axios.get("https://websites-projects.vercel.app/reload").then(response => {
    console.log(response)
    alert("reload success")
    if(localStorage.getItem("checkedProducts")){
      items = JSON.parse(localStorage.getItem("checkedProducts"))
      items.price= []
      items.qty = []
      items.ids = []
      localStorage.removeItem("checkedProducts")
      localStorage.setItem("checkedProducts",items)
    }
    window.location.href = "/cart"
  }
  ).catch(err => console.log(err))
}

function deleteStore(event, storeId) {
  axios.delete(`https://websites-projects.vercel.app/products/store/${storeId}`)
    .then(response => {
      if (response.status === 200) {
        console.log("Store deleted successfully");
        const currContainer = event.target.closest(".store-section");
        if (currContainer) {
          currContainer.remove()
          updateCOPage()
        };
      } else {
        console.log("Failed to delete store");
      }
    })
    .catch(err => console.error("Error:", err.message));
}

function deleteProduct(event, productId) {
  axios.delete(`https://websites-projects.vercel.app/products/${productId}`)
    .then(response => {
      if (response.status === 200) {
        console.log("Product deleted successfully");
        // console.log(event.target)
        const currProduct = event.target.closest(".table-row");
        if (currProduct){
            storeContainer = event.target.closest(".store-section")
            currProduct.remove()
            updateCOPage()
            if(storeContainer.querySelectorAll(".table-row").length === 0){
                storeContainer.remove()
            }
        };
      } else {
        console.log("Failed to delete product");
      }
    })
    .catch(err => console.error("Error:", err.message));
}