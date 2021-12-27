const checkoutDishesSection = document.querySelector('#order-item-list-container');
const normalDishes = JSON.parse(localStorage.getItem('order_items')).normal_dish;
const saleDishes = JSON.parse(localStorage.getItem('order_items')).sale_dish;

if(normalDishes.length < 1 && saleDishes.length < 1){
    checkoutDishesSection.innerHTML = `<div class="order-item-list-empty-notification" id="order-item-list-empty-notification">You didn't order any dish, let's back and order</div>`
}
else{
    let saleList = '';
    let normalList = '';
    let total = 0;
    if(saleDishes.length > 0)
    {
        saleList = `
        <div id="sale-dish-container">
            <div style="font-size:30px;text-align:center;text-decoration:underline;margin:2% 0">
                Discounting Dishes
            </div>
            <div class="order-item-list-row item-row height-50-p">
                <div class="order-item-thumbnail"></div>
                <div class="order-item-info font-18-p">
                    <strong class="order-item-title">
                        Title
                    </strong>
                    <strong class="order-item-price">
                        Price
                    </strong>
                    <strong class="order-item-quantity-group-title">
                        Quantity
                    </strong>
                    <strong class="order-item-total">
                        Total
                    </strong>
                    <div class="order-btn-remove"></div>
                </div>
            </div>
        `
        saleList += saleDishes.map((element)=>{
            total += element.price*(100-element.salePercent)/100;
            return (
                `
                <div class="order-item-list-row item-row" id="order-item-list-row-sale__${element.id}">
                    <img class="order-item-thumbnail" src="/images/product-images/${element.thumbnail}" alt="thumbnail"/>
                    <div class="order-item-info">
                        <div class="order-item-title">
                            ${element.title}
                        </div>
                        <div class="order-item-price">
                            $${element.price*(100-element.salePercent)/100}
                        </div>
                        <div class="order-item-quantity-group">
                            <div class="product-quantity">
                                ${element.quantity}
                            </div>
                        </div>
                        <div class="order-item-total">
                            $${element.quantity*element.price*(100-element.salePercent)/100}
                        </div>
                        <i class="fas fa-times-circle order-btn-remove-sale-dish" id="order-btn-remove__${element.id}"></i>
                    </div>
                </div>`
            )
        }).join('');
        saleList += "</div>"
    }
    if(normalDishes.length > 0)
    {
        normalList = `
        <div id="normal-dish-container">
            <div style="font-size:30px;text-align:center;text-decoration:underline;margin:2% 0">
                Dishes
            </div>
            <div class="order-item-list-row item-row height-50-p">
                <div class="order-item-thumbnail"></div>
                <div class="order-item-info font-18-p">
                    <strong class="order-item-title">
                        Title
                    </strong>
                    <strong class="order-item-price">
                        Price
                    </strong>
                    <strong class="order-item-quantity-group-title">
                        Quantity
                    </strong>
                    <strong class="order-item-total">
                        Total
                    </strong>
                    <div class="order-btn-remove"></div>
                </div>
            </div>
        `
        normalList += normalDishes.map((element)=>{
            total += element.quantity*element.price;
            return(
                `
                <div class="order-item-list-row item-row" id="order-item-list-row__${element.id}">
                <img class="order-item-thumbnail" src="/images/product-images/${element.thumbnail}" alt="thumbnail"/>
                <div class="order-item-info">
                    <div class="order-item-title">
                        ${element.title}
                    </div>
                    <div class="order-item-price" id="order-item-price__${element.id}">
                        $${element.price}
                    </div>
                    <div class="order-item-quantity-group">
                        <i class="fas fa-minus-circle order-btn-decrease" id="order-btn-decrease__${element.id}"></i>
                        <input type="text" value="${element.quantity}" class="product-quantity-input product-quantity" id="product-quantity__${element.id}">
                        <i class="fas fa-plus-circle order-btn-increase" id="order-btn-increase__${element.id}"></i>
                    </div>
                    <div class="order-item-total" id="order-item-total__${element.id}">
                        $${element.quantity*element.price}
                    </div>
                    <i class="fas fa-times-circle order-btn-remove" id="order-btn-remove__${element.id}"></i>
                </div>
            </div>`
            )
        }).join('');
        normalList += '</div>'
    }
    normalList+=`<div class="total-section" id="total-section" style="display:flex;align-items:center">
                    <strong style="font-size:20px">Total:</strong>&nbsp;
                    <div id="total-order-payment">$${total}</div>
                </div>`
    checkoutDishesSection.innerHTML = saleList+normalList;

    const quantityInputs = document.querySelectorAll('.product-quantity-input');
    const decreaseBtns = document.querySelectorAll('.order-btn-decrease');
    const increaseBtns = document.querySelectorAll('.order-btn-increase');
    const removeNormalDishBtn = document.querySelectorAll('.order-btn-remove');
    const removeSaleDishBtn = document.querySelectorAll('.order-btn-remove-sale-dish');

    quantityInputs.forEach(input=>{
        const dishId = input.id.split('__')[1];
        const dishPriceTagContent = document.querySelector(`#order-item-price__${dishId}`);
        const dishTotalTagContent = document.querySelector(`#order-item-total__${dishId}`);
        const notificationToast = document.querySelector('#notification-toast-container');
        const totalPaymentTagContent = document.querySelector(`#total-order-payment`);
        const dishPrice = parseInt(dishPriceTagContent.innerHTML.split('$')[1]);
        let value = input.value;
        let sustainableValue = value;
        let temporaryTotal = parseInt(dishTotalTagContent.innerHTML.split('$')[1]);
        let temporaryTotalOrderPayment = parseInt(totalPaymentTagContent.innerHTML.split('$')[1]);
        input.addEventListener('keydown',(event)=>{
            console.log(event.target.value);
        })
        input.addEventListener('keyup',(event)=>{
            const totalPaymentTagContent = document.querySelector(`#total-order-payment`);
            const dishPrice = parseInt(dishPriceTagContent.innerHTML.split('$')[1]);
            const inputValue = parseInt(event.target.value);
            if(isNaN(inputValue) || inputValue > 100 || inputValue < 0){
                value = sustainableValue;
                notificationToast.classList.remove('toast-slide-out');
                notificationToast.classList.add('toast-slide-in');
                setTimeout(()=>{
                    notificationToast.classList.remove('toast-slide-in');
                    notificationToast.classList.add('toast-slide-out');
                },3000)
                return;
            }
            console.log(isNaN(inputValue),inputValue);
            const index = normalDishes.findIndex(dish=>dish.id===dishId);
            const currentQuantity = normalDishes[index].quantity;
            normalDishes[index].quantity =  inputValue;
            temporaryTotal = dishPrice*inputValue;
            temporaryTotalOrderPayment += dishPrice*(inputValue - currentQuantity);
            totalPaymentTagContent.innerHTML = "$"+temporaryTotalOrderPayment.toString();
            dishTotalTagContent.innerHTML = "$"+temporaryTotal.toString();
        })
    })

    const removeDish = (btn,isOnsaleDish) => {
        const dishId = btn.id.split('__')[1];
        const totalPaymentTagContent = document.querySelector(`#total-order-payment`);
        let temporaryTotalOrderPayment = parseInt(totalPaymentTagContent.innerHTML.split('$')[1]);
        isOnsaleDish
        ?
        (()=>{
            const dishContainer = document.querySelector(`#order-item-list-row-sale__${dishId}`);
            const index = saleDishes.findIndex(item=>item.id===dishId);
            const {salePercent,price} = saleDishes[index];
            temporaryTotalOrderPayment -= price*(100-salePercent)/100;
            saleDishes.splice(index,1);
            if(saleDishes.length === 0){
                const dishesContainer = document.querySelector('#sale-dish-container');
                dishesContainer.classList.add('order-item-normal-list-narrow');
                setTimeout(()=>{
                    dishesContainer.style.display = 'none';
                },1000);
                if(normalDishes.length === 0){
                    const totalSection = document.querySelector('#total-section');
                    totalSection.classList.add('hide-total-section');
                    setTimeout(()=>{
                        checkoutDishesSection.innerHTML = `<div class="order-item-list-empty-notification" id="order-item-list-empty-notification">You didn't order any dish, let's back and order</div>`
                    },1000)
                }
                dishContainer.classList.add('order-item-row-narrow');
                totalPaymentTagContent.innerHTML = "$" + temporaryTotalOrderPayment.toString();
                return;
            }
            dishContainer.classList.add('order-item-row-narrow');
            totalPaymentTagContent.innerHTML = "$" + temporaryTotalOrderPayment.toString();
            setTimeout(()=>{
                dishContainer.style.display = 'none';
            },1000)
        })()
        :
        (()=>{
            const dishContainer = document.querySelector(`#order-item-list-row__${dishId}`);
            const index = normalDishes.findIndex(item=>item.id===dishId);
            const {quantity,price} = normalDishes[index];
            temporaryTotalOrderPayment -= quantity*price;
            normalDishes.splice(index,1);
            if(normalDishes.length === 0){
                const dishesContainer = document.querySelector('#normal-dish-container');
                dishesContainer.classList.add('order-item-normal-list-narrow');
                setTimeout(()=>{
                    dishesContainer.style.display = 'none';
                },1000);
                if(saleDishes.length === 0){
                    const totalSection = document.querySelector('#total-section');
                    totalSection.classList.add('hide-total-section');
                    setTimeout(()=>{
                        checkoutDishesSection.innerHTML = `<div class="order-item-list-empty-notification" id="order-item-list-empty-notification">You didn't order any dish, let's back and order</div>`
                    },1000)
                }
                dishContainer.classList.add('order-item-row-narrow');
                totalPaymentTagContent.innerHTML = "$" + temporaryTotalOrderPayment.toString();
                return;
            }
            dishContainer.classList.add('order-item-row-narrow');
            totalPaymentTagContent.innerHTML = "$" + temporaryTotalOrderPayment.toString();
            setTimeout(()=>{
                dishContainer.style.display = 'none';
            },1000)
        })()
    }

    const changeDishQuantity = (btn,isSubtraction) => {
        const dishId = btn.id.split("__")[1];
        const index = normalDishes.findIndex(dish=>dish.id===dishId);
        const dishPriceTagContent = document.querySelector(`#order-item-price__${dishId}`);
        const dishTotalTagContent = document.querySelector(`#order-item-total__${dishId}`);
        const totalPaymentTagContent = document.querySelector(`#total-order-payment`);
        const quantityInput = document.querySelector(`#product-quantity__${dishId}`);
        const dishPrice = parseInt(dishPriceTagContent.innerHTML.split('$')[1]);
        let temporaryTotal = parseInt(dishTotalTagContent.innerHTML.split('$')[1]);
        let temporaryTotalOrderPayment = parseInt(totalPaymentTagContent.innerHTML.split('$')[1]);

        isSubtraction ?
        (()=>{
            temporaryTotal -= dishPrice;
            temporaryTotalOrderPayment -= dishPrice;
            quantityInput.value--;
            normalDishes[index].quantity--;
        })()
        :
        (()=>{
            temporaryTotal += dishPrice;
            temporaryTotalOrderPayment += dishPrice;
            quantityInput.value++;
            normalDishes[index].quantity++;
        })()
        totalPaymentTagContent.innerHTML = "$"+temporaryTotalOrderPayment.toString();
        dishTotalTagContent.innerHTML = "$"+temporaryTotal.toString();
    }

    decreaseBtns.forEach(btn=>{
        btn.addEventListener('click',()=>changeDishQuantity(btn,true));
    })

    increaseBtns.forEach(btn=>{
        btn.addEventListener('click',()=>changeDishQuantity(btn,false));
    })

    removeNormalDishBtn.forEach(btn=>{
        btn.addEventListener('click',()=>removeDish(btn,false));
    })

    removeSaleDishBtn.forEach(btn=>{
        btn.addEventListener('click',()=>removeDish(btn,true));
    })

}

window.onbeforeunload = () => {
    const normalDishesResult = normalDishes.filter(dish=>dish.quantity > 0);
    const saleDishesResult = saleDishes.filter(dish=>dish.quantity > 0);
    localStorage.setItem('order_items',JSON.stringify({normal_dish:normalDishesResult,sale_dish:saleDishesResult}));
}