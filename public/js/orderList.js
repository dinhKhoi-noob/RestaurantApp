const orderListQuantity = document.querySelector('#order-list-items');
const orderListTotalOrder = document.querySelector('#order-list-total-amount');
const orderTable = document.querySelector('#order-list-table');
const orderListContainer = document.querySelector('#order-list-container');
const dishesStorage = localStorage.getItem('order_items') === null ? {normal_dish:[],sale_dish:[]} : JSON.parse(localStorage.getItem('order_items'));
const closeOrderListBtn = document.querySelector('#order-list-close-btn');

closeOrderListBtn.addEventListener('click',()=>{
    orderListContainer.classList.remove("show-order-list");
    orderListContainer.classList.add("hide-order-list");
    localStorage.setItem('order_items',JSON.stringify(dishesStorage));
    setTimeout(()=>{
    orderListContainer.style.display = 'none';
    orderListContainer.style.visibility = 'hidden !important';
    },1200)
  })

const changeOrderItemValue = (btn,isSubtraction) => {
    
    const id = btn.id.split('__')[1];
    const inputQuantity = document.querySelector(`#order-list-quantity-input__${id}`);
    const dishTotal = document.querySelector(`#order-list-total-item-price__${id}`);
    const dishPriceTag = document.querySelector(`#order-list-price__${id}`);
    const dishPrice = parseInt(dishPriceTag.innerHTML.split('$')[1]);
    const index = dishesStorage.normal_dish.findIndex(item=>item.id === id);
    
    let temporaryTotal = parseInt(dishTotal.innerHTML.split('$')[1]);
    let temporaryQuantity = parseInt(orderListQuantity.innerHTML)
    let temporaryTotalPayment = parseFloat(orderListTotalOrder.innerHTML.split('$')[1]);
    
    isSubtraction ? (()=>{
        temporaryTotal -= dishPrice;
        temporaryTotalPayment -= dishPrice;
        inputQuantity.value--;
        dishesStorage.normal_dish[index].quantity--;
        temporaryQuantity--;
    })()
    :
    (()=>{
        temporaryTotal += dishPrice;
        temporaryTotalPayment += dishPrice;
        inputQuantity.value++;
        dishesStorage.normal_dish[index].quantity++;
        temporaryQuantity++;
    })();
    orderListQuantity.innerHTML = temporaryQuantity;
    dishTotal.innerHTML = "$"+temporaryTotal.toString();
    orderListTotalOrder.innerHTML = "$"+temporaryTotalPayment.toString();
}

const renderOrderList = () => {
    let totalPayment = 0;
    let orderQuantity = 0;
    const orderListData = localStorage.getItem('order_items') === null ? {normal_dish:[],sale_dish:[]} : JSON.parse(localStorage.getItem('order_items'));
    orderListData.sale_dish.forEach(dish=>{
        orderQuantity += dish.quantity;
        totalPayment += dish.price*dish.quantity*(100-dish.salePercent)/100;
    })
    orderListData.normal_dish.forEach(dish=>{
        orderQuantity += dish.quantity;
        totalPayment += dish.price*dish.quantity;
    })
    orderListQuantity.innerHTML = orderQuantity;
    orderListTotalOrder.innerHTML = "$"+totalPayment.toString();
    if(orderListData.normal_dish.length < 1 && orderListData.sale_dish.length < 1)
    {
        orderListContainer.innerHTML = `
            <div class="order-list-empty">
                <div>
                    You have not ordered any dish yet
                </div>
                <i class="fas fa-times order-list-close-btn" id="empty-order-list-close-btn"></i>
            </div>
        `;
        const orderCloseBtn = document.querySelector('#empty-order-list-close-btn');
        orderCloseBtn.addEventListener('click',()=>{
            orderListContainer.classList.remove("show-order-list");
            orderListContainer.classList.add("hide-order-list");
            setTimeout(()=>{
                orderListContainer.style.display = 'none';
                orderListContainer.style.visibility = 'hidden !important';
            },1200)
        })
        return;
    }
    let orderItems = "";
    if(orderListData.sale_dish.length > 0){
        orderItems += orderListData.sale_dish.map((item)=>(
            `<div class="order-list-card">
                <div class="order-list-thumbnail" style="background-image: url('/images/product-images/${item.thumbnail}');">
    
                </div>
                <div class="order-list-title">
                    ${item.title}
                </div>
                <div class="order-list-quantity-section" style="text-align:center;display:unset">
                    <div class="order-list-quantity">
                        ${item.quantity}
                    </div>
                </div>
                <div class="order-list-price">
                    $${item.price*(100-item.salePercent)/100}
                </div>
                <div class="order-list-total-item-price">
                    $${item.quantity*item.price*(100-item.salePercent)/100}
                </div>
            </div>
            `
        )).join('');
    }
    if(orderListData.normal_dish.length > 0){
        orderItems += orderListData.normal_dish.map((item)=>(
            `<div class="order-list-card">
                <div class="order-list-thumbnail" style="background-image: url('/images/product-images/${item.thumbnail}');">
    
                </div>
                <div class="order-list-title">
                    ${item.title}
                </div>
                <div class="order-list-quantity-section">
                    <i class="fas fa-minus-circle order-list-btn-decrease" id="order-list-btn-decrease__${item.id}"></i>
                    <div class="order-list-quantity">
                        <input type="text" value="${item.quantity}" id="order-list-quantity-input__${item.id}" class="order-list-quantity-input">
                    </div>
                    <i class="fas fa-plus-circle order-list-btn-increase" id="order-list-btn-increase__${item.id}"></i>
                </div>
                <div class="order-list-price" id="order-list-price__${item.id}">
                    $${item.price}
                </div>
                <div class="order-list-total-item-price" id="order-list-total-item-price__${item.id}">
                    $${item.price*item.quantity}
                </div>
            </div>
            `
        )).join('');
    }
    orderTable.innerHTML = orderItems;
    const orderListIncreaseBtns = document.querySelectorAll('.order-list-btn-increase');
    const orderListDecreaseBtns = document.querySelectorAll('.order-list-btn-decrease');
    orderListIncreaseBtns.forEach(btn=>{
        btn.addEventListener(
            'click',
            ()=>changeOrderItemValue(btn,false)
        );
    })
    
    orderListDecreaseBtns.forEach(btn=>{
        btn.addEventListener(
            'click',
            ()=>changeOrderItemValue(btn,true)
        );
    })
}

renderOrderList();