const orderBtn = document.querySelector('.dish-detail-info-order-btn');
const quantityInput = document.querySelector('#dish-detail-info-input-quantity');
const increaseBtn = document.querySelector('#quick-shopping-btn-increase');
const decreaseBtn = document.querySelector('#quick-shopping-btn-decrease');
const dishStorage = localStorage.getItem('order_items') === null ? {normal_dish:[],sale_dish:[]} : JSON.parse(localStorage.getItem('order_items'));
const dishId = orderBtn.id.split("__")[1];
let saleAccepted = false;
let quantity = 1;
let dishInfo;
console.log(dishStorage);
const showToast = () => {
    const toast = document.querySelector('#order-dish-toast-container');
    const closeToastBtn = document.querySelector('#close-toast-btn');
    const toastContent = document.querySelector('#order-dish-toast-list');
    if(saleAccepted && dishInfo.sale_percent > 0){
        toastContent.innerHTML=`
            <div class="order-dish-toast-body" id="order-dish-toast-body">
                <div class="order-dish-toast-thumbnail" style="background-image: url('/images/product-images/${dishInfo.thumbnail}');">

                </div>
                <div class="order-dish-toast-title">
                    ${dishInfo.title}
                </div>
                <div class="order-dish-toast-quantity">
                    1
                </div>
                <div class="order-dish-toast-price">
                    $${dishInfo.price*(100-dishInfo.sale_percent)/100}
                </div>
                <div class="order-dish-toast-total">
                    $${dishInfo.price*(100-dishInfo.sale_percent)/100}
                </div>
            </div>
        `
    }
    else{
        toastContent.innerHTML += `
            <div class="order-dish-toast-body" id="order-dish-toast-body">
                <div class="order-dish-toast-thumbnail" style="background-image: url('/images/product-images/${dishInfo.thumbnail}');">

                </div>
                <div class="order-dish-toast-title">
                    ${dishInfo.title}
                </div>
                <div class="order-dish-toast-quantity">
                    ${quantity}
                </div>
                <div class="order-dish-toast-price">
                    $${dishInfo.price}
                </div>
                <div class="order-dish-toast-total">
                    $${dishInfo.price*quantity}
                </div>
            </div>
        `
    }
    if(quantity - 1 > 0 && saleAccepted === true && dishInfo.sale_percent > 0){
        toastContent.innerHTML += `
            <div class="order-dish-toast-body" id="order-dish-toast-body">
                <div class="order-dish-toast-thumbnail" style="background-image: url('/images/product-images/${dishInfo.thumbnail}');">

                </div>
                <div class="order-dish-toast-title">
                    ${dishInfo.title}
                </div>
                <div class="order-dish-toast-quantity">
                    ${saleAccepted === true ? quantity-1:quantity}
                </div>
                <div class="order-dish-toast-price">
                    $${dishInfo.price}
                </div>
                <div class="order-dish-toast-total">
                    $${saleAccepted === true ? dishInfo.price*(quantity-1):dishInfo.price*quantity}
                </div>
            </div>
        `
    }
    toast.classList.add('order-toast-slide-in');
    toast.classList.remove('order-toast-slide-out');
    closeToastBtn.addEventListener('click',()=>{
        toast.classList.remove('order-toast-slide-in');
        toast.classList.add('order-toast-slide-out');
        setTimeout(()=>{
            toastContent.innerHTML = '';
        },1000)
        return;
    })
    setTimeout(()=>{
        toast.classList.remove('order-toast-slide-in');
        toast.classList.add('order-toast-slide-out');
        setTimeout(()=>{
            toastContent.innerHTML = '';
        },1000)
    },5000)
}

increaseBtn.addEventListener('click',()=>{
    quantityInput.value++;
    quantity++;
})

decreaseBtn.addEventListener('click',()=>{
    quantityInput.value--;
    quantity--;
})

fetch(`http://localhost:4000/api/product/detail/${dishId}`).then(response=>{
    return response.json();
}).then(result=>{
    dishInfo = result.result[0];
}).catch(error=>{
    console.log(error);
});

quantityInput.addEventListener('keyup',(event)=>{
    quantity = event.target.value;
})

orderBtn.addEventListener('click',()=>{
    const isExistedInSaleDish = dishStorage.sale_dish.findIndex(dish=>dish.id === dishId)
    const normalListIndex = dishStorage.normal_dish.findIndex(dish=>dish.id===dishId)
    console.log("is existed in sale: ",isExistedInSaleDish);
    console.log("is existed in normal: ",normalListIndex);
    if(isExistedInSaleDish === -1 && dishInfo.sale_percent > 0){
        saleAccepted = true;
        dishStorage.sale_dish.push(
            {
                id: dishId,
                title: dishInfo.title,
                price: dishInfo.price,
                salePercent: dishInfo.sale_percent,
                quantity:1,
                thumbnail: dishInfo.thumbnail
            }
        )
        if(quantity - 1 < 1){
            localStorage.setItem('order_items',JSON.stringify(dishStorage));
            showToast();
            quantity = 1;
            quantityInput.value = 1;
            saleAccepted = false;
            return;
        }
    }
    if(normalListIndex !== -1){
        isExistedInSaleDish === -1 ? dishStorage.normal_dish[normalListIndex].quantity += quantity-1 : dishStorage.normal_dish[normalListIndex].quantity += quantity;
        showToast();
    }
    else{
        dishStorage.normal_dish.push({
            id: dishId,
            title: dishInfo.title,
            price: dishInfo.price,
            salePercent: dishInfo.sale_percent,
            quantity: saleAccepted === true?quantity-1:quantity,
            thumbnail: dishInfo.thumbnail
        })
        showToast();
    }
    localStorage.setItem('order_items',JSON.stringify(dishStorage));
    quantity = 1;
    quantityInput.value = 1;
    saleAccepted = false;
})