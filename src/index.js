const alertEl = document.querySelector('.alert')
const fromEl = document.getElementById('grocery-form')
const groceryInput = document.getElementById('grocery-item')
const groceryContainer = document.getElementById('grocery-container')
const groceryList = document.getElementById('grocery-list')
const submitBtn = document.getElementById('submit-btn')
const clearBtn = document.querySelector('.clear-btn')


//edit
let editElement;
let editFlag = false
let editId = ""

fromEl.addEventListener('submit', addGrocery)
clearBtn.addEventListener('click', clearGroceryList)
window.addEventListener('DOMContentLoaded', initialItemLoad())

function addGrocery(event){
      event.preventDefault()
      const item = groceryInput.value
      const itemId = new Date().getTime().toString()
      //console.log(itemId)
      if(item && !editFlag){
        createListItems(itemId,item )
        displayAlert('Item added to list' , 'success')
        addToLocalStorage(itemId,item)
        setDefault()
        
         
      }else if(item && editFlag){
         editElement.innerHTML = item
          displayAlert('Item edited in the list', 'success')
          editLocalStorage(editId,item)
          setDefault()
      }else{
        displayAlert('Please enter the item', 'danger')
      }
      
      
   }

function createListItems(id, value){
   const groceryItemEl = document.createElement('article')
        groceryItemEl.classList.add('grocery-item')
        const attr = document.createAttribute('data-id')
        attr.value = id
        groceryItemEl.setAttributeNode(attr)
        groceryItemEl.innerHTML = `<p class="item">${value}</p>
                    <button type="button" class="btn edit-btn">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button type="button" class="btn delete-btn" data-delete='delete'>
                        <i class="fas fa-trash"></i>
                    </button>`
        const deleteBtn = groceryItemEl.querySelector('.delete-btn')
        const editBtn = groceryItemEl.querySelector('.edit-btn')
        deleteBtn.addEventListener('click', deleteItem)
        editBtn.addEventListener('click', editItem)
        groceryList.appendChild(groceryItemEl)
        groceryContainer.classList.add('show-grocery-container')
}

function clearGroceryList(){
   const items = document.querySelectorAll('.grocery-item')
   if(items.length > 0){
      items.forEach(item => {
         groceryList.removeChild(item)
      })
      displayAlert('All items were deleted', 'danger')
      setDefault()
      groceryContainer.classList.remove('show-grocery-container')
   }
   localStorage.removeItem("grocery-list")
}

function displayAlert(text, action ){
    alertEl.textContent = text
    alertEl.classList.add(`alert-${action}`)

    setTimeout(()=>{
        alertEl.textContent = ''
        alertEl.classList.remove(`alert-${action}`)

    },1000)
}
function setDefault(){
   groceryInput.value = ''
   editFlag = false
   editElement=""
   editId = ""
   submitBtn.textContent="Submit"
}

function deleteItem(e){
   const item = e.currentTarget.parentElement
   console.log(item.dataset.id)
   removeFromLocalStorage(item.dataset.id)
   groceryList.removeChild(item)
   
   if(groceryList.children.length === 0){
      groceryContainer.classList.remove('show-grocery-container')
   }
   displayAlert("Item removed from the list", 'success')
   
      
}

function editItem(e){
   submitBtn.textContent = "Edit"
   editFlag = true
   const item = e.currentTarget.parentElement
   editElement = e.currentTarget.previousElementSibling
   editId = item.dataset.id
   groceryInput.value = editElement.innerHTML
      
}

function addToLocalStorage(id, value){
   const grocery = {
                     id : id,
                     value : value
                  
                  }
   const items = getLocalStorage()
   
   items.push(grocery)
   localStorage.setItem("grocery-list", JSON.stringify(items))
  

}

function removeFromLocalStorage(id){
   let items = getLocalStorage()
   items = items.filter((item) => {
      if(id !== item.id){
         return item
      }
   })
   
   localStorage.setItem("grocery-list", JSON.stringify(items))
}

function editLocalStorage(id,value){
   let items = getLocalStorage()
   items = items.map(item => {
      if(item.id === id){
         item.value = value 
         
      }
      return item
   })
   localStorage.setItem("grocery-list", JSON.stringify(items))

}

function initialItemLoad(){
   const items = getLocalStorage()
   if(items.length > 0){
      items.forEach(item => createListItems(item.id, item.value))
   }
}

function getLocalStorage(){
   return localStorage.getItem("grocery-list") ? JSON.parse(localStorage.getItem("grocery-list")) : []
}
