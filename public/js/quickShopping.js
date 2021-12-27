const categoriesOption = document.querySelectorAll('.quick-shopping-choice');
const viewResultBtn = document.querySelector('#quick-shopping-view-result-btn');
const bottomElement = document.querySelector('#quick-shopping-bottom-element')
const categoriesOptionContainer = document.querySelector('#quick-shopping-request-category-list');
const quickShoppingBtn = document.querySelector('#quick-shopping');
const quickShoppingSection = document.querySelector('#quick-shopping-container');
const closeShoppingSectionBtn = document.querySelector('#quick-shopping-time-button');
const limitRangeInput = document.querySelector("#quick-shopping-input-field");
const statistic = {
    total:0,
    saving:0
};
let limitRange = 0;
let categoriesOptionRemoveBtn = [];
let categoriesListTitle = [];
let categoriesListRootId = [];
let categoriesListId = [];
let optionArray = [];
let discountDishesList = [];
let normalDishesList = [];

const displayQuickShoppingSection = (status=false) => {
    if(status === true)
    {
        quickShoppingSection.style.display = 'unset';
        quickShoppingSection.classList.add('slide-in');
        // quickShoppingSection.style.top = '5%';
        return;
    }
    quickShoppingSection.classList.remove('slide-in');
    quickShoppingSection.classList.add('slide-out');
    setTimeout(()=>{
        quickShoppingSection.style.display = 'none';
        quickShoppingSection.classList.remove('slide-out');
    },500)
}

const decreaseDishesQuantity = (element) => {
    const idSplitter = element.id.split("_");
    const id = idSplitter[1];
    let index = 0;
    if(idSplitter.length > 2)
    {
        index = normalDishesList.findIndex(item=>item.id===id)
        if(index !== -1 && normalDishesList[index].quantity > 0)
        {
            normalDishesList[index].quantity--;
            calculateStatistic(index,'decrease','normal')
            renderNormalDishesList();
        }
        return;
    }
    index = discountDishesList.findIndex(item=>item.id===id)
    if(index !== -1 && discountDishesList[index].quantity > 0)
    {
        discountDishesList[index].quantity--;
        calculateStatistic(index,'decrease','discount')
        renderDiscountDishesList();
        initChangeQuantityEvent();
    }
}

const increaseDishesQuantity = (element) => {
    const idSplitter = element.id.split("_");
    const id = idSplitter[1];
    let index = 0;
    console.log(normalDishesList,discountDishesList);
    const normalDishesIndex = normalDishesList.findIndex(item=>item.id===id);
    index = discountDishesList.findIndex(item=>item.id===id)
    if(normalDishesIndex === -1)
    {
        let temporary = {
            id:discountDishesList[index].id,
            title:discountDishesList[index].title,
            price:discountDishesList[index].price,
            salePercent:discountDishesList[index].salePercent,
            thumbnail:discountDishesList[index].thumbnail,
            quantity:1
        }
        normalDishesList.push(temporary);
        // calculateStatistic(index,'increase','normal')
        renderNormalDishesList('first');
        return;
    }
    if(idSplitter.length > 2)
    {
        index = normalDishesList.findIndex(item=>item.id===id)
        if(index !== -1 && normalDishesList[index].quantity < 10)
        {
            normalDishesList[index].quantity++;
            calculateStatistic(index,'increase','normal');
            renderNormalDishesList();
        }
        return;
    }
    if(index !== -1 && discountDishesList[index].quantity < 1)
    {
        discountDishesList[index].quantity++;
        calculateStatistic(index,'increase','discount');
        renderDiscountDishesList();
        initChangeQuantityEvent();
        return;
    }
    index = normalDishesList.findIndex(item=>item.id===id)
    normalDishesList[index].quantity++;
    calculateStatistic(index,'increase','normal')
    renderNormalDishesList();
}

const removeDish = (element) => {
    const idSplitter = element.id.split("_");
    const id = idSplitter[1];
    let index = 0;
    console.log(normalDishesList,normalDishesList)
    if(idSplitter.length > 2)
    {
        index = normalDishesList.findIndex(item=>item.id===id);
        if(index !== -1)
        {
            calculateStatistic(index,'decrease','normal',normalDishesList[index].quantity);
            normalDishesList.splice(index,1);
            renderNormalDishesList();
            return;
        }
    }
    index = discountDishesList.findIndex(item=>item.id===id);
    calculateStatistic(index,'decrease','discount',discountDishesList[index].quantity)
    discountDishesList.splice(index,1);
    renderDiscountDishesList();
    initChangeQuantityEvent();
    console.log(normalDishesList,discountDishesList)
}

const calculateStatistic = (index,operator,list,quantity = 1) => {
    console.log('statistic')
    if(index !== -1)
    {
        if(operator === 'increase')
        {
            statistic.total += list === 'normal'?normalDishesList[index].price*quantity:discountDishesList[index].price*quantity;
            console.log(normalDishesList[index].price*quantity, normalDishesList[index].price,quantity);
            statistic.saving += list === 'normal'?0:discountDishesList[index].price*discountDishesList[index].salePercent/100;
            // renderTotalSection();
            return;
        }

        statistic.total -= list === 'normal'?normalDishesList[index].price*quantity:discountDishesList[index].price*quantity;
        statistic.saving -= list === 'normal'?0:discountDishesList[index].price*discountDishesList[index].salePercent/100;
        // renderTotalSection();
    }
}

const calculateFirstTimeRender = (list) => {
    // console.log(1);
    if(list === 'normal')
    {
        normalDishesList.forEach(element=>{
            statistic.total += element.price * element.quantity;
        })
        console.log('statistic: ',statistic)
        return;
    }
    discountDishesList.forEach(element=>{
        statistic.total += element.price * element.quantity;
        statistic.saving += element.price * element.salePercent/100 * element.quantity
    })
    console.log('statistic: ',statistic)
}

const initChangeNormalDishesQuantityEvent = () => {
    const btnIncreaseNormal = document.querySelectorAll('.quick-shopping-btn-increase-normal');
    const btnDecreaseNormal = document.querySelectorAll('.quick-shopping-btn-decrease-normal');
    const btnRemoveNormal = document.querySelectorAll('.quick-shopping-btn-remove-normal');
    if(btnDecreaseNormal)
    {
        btnDecreaseNormal.forEach(element=>{
            element.addEventListener('click',() => decreaseDishesQuantity(element))
        })
    }
    if(btnIncreaseNormal)
    {
        btnIncreaseNormal.forEach(element=>{
            element.addEventListener('click',() => increaseDishesQuantity(element))
        })
    }
    if(btnRemoveNormal)
    {
        btnRemoveNormal.forEach(element=>{
            element.addEventListener('click',() => removeDish(element));
        })
    }
}

const initChangeQuantityEvent = () =>{
    const btnIncrease = document.querySelectorAll('.quick-shopping-btn-increase');
    const btnDecrease = document.querySelectorAll('.quick-shopping-btn-decrease');
    const btnRemove = document.querySelectorAll('.quick-shopping-btn-remove');
    if(btnDecrease)
    {
        btnDecrease.forEach(element=>{
            element.addEventListener('click',() => decreaseDishesQuantity(element))
        })
    }
    if(btnIncrease)
    {
        btnIncrease.forEach(element=>{
            element.addEventListener('click',() => increaseDishesQuantity(element))
        })
    }
    if(btnRemove)
    {
        btnRemove.forEach(element=>{
            element.addEventListener('click',() => removeDish(element));
        })
    }
}

const addCategoriesOption = (event) => {
    const categoryValue = event.target.value.toString().split('-');
    const idSplitter = categoryValue[0].toString().split('_');
    let existedIndex = categoriesListId.findIndex(category=>
        category[0] === idSplitter[0]
    )
    if(existedIndex === -1){
        categoriesListTitle.push(categoryValue[1]);
        let optionString = '';
        let innerOption = idSplitter[0] !== idSplitter[1]? `<div class="quick-shopping-request-category-item">${categoriesListTitle[categoriesListTitle.length - 1]}<i class="fas fa-times remove-category" id="remove-category-${categoryValue[0]}" style="cursor: pointer;font-size: 13px;margin-left:5px"></i></div></br>`:`<div class="quick-shopping-request-category-item root-item">${categoriesListTitle[categoriesListTitle.length - 1]}<i class="fas fa-times remove-category" id="root_remove-category-${categoryValue[0]}" style="cursor: pointer;font-size: 13px;margin-left:5px"></i></div></br>`
        if(idSplitter[0] === idSplitter[1])
        {
            categoriesListRootId.push(idSplitter[0]);
            categoriesListId.push([idSplitter[0],idSplitter[1]]);
        }
        else
        {
            categoriesListId.push([idSplitter[0],idSplitter[1]]);
        }
        // console.log(categoriesListId)
        optionArray.push(innerOption);
        optionString = optionArray.join('');
        categoriesOptionContainer.innerHTML = optionString;
        // console.log(categoriesListId);
        addRemoveFunction();
    }
}

const addRemoveFunction = () =>{
    let removeCategoryOptionBtn = document.querySelectorAll('.remove-category');
    categoriesOptionRemoveBtn = removeCategoryOptionBtn;
    categoriesOptionRemoveBtn.forEach(element=>element.addEventListener('click',()=>{
        let index = optionArray.findIndex(item=>item.includes(element.id));
        optionArray.splice(index,1);
        categoriesListId.splice(index,1);
        if(element.id.toString().includes('root_'))
        {
            const rootId = element.id.toString().split('_')[2];
            const rootIdIndex = categoriesListRootId.indexOf(rootId);
            categoriesListRootId.splice(rootIdIndex,1);
        }
        // console.log(categoriesListRootId,categoriesListId)
        optionString = optionArray.join('');
        categoriesOptionContainer.innerHTML = optionString;
        addRemoveFunction();
    }))
}

const renderNormalDishesList = (time = 'other') => {
    const normalDishesContainer = document.querySelector('#normal-dishes-list');
    if(normalDishesList.length > 0)
    {
        // console.log('first')
        if(time==='first')
        {
            // console.log('normal')
            calculateFirstTimeRender('normal')
        }
        let tableHeader = `
        <div class="order-item-list-row item-row m-lr-5p pd-tb-3-p height-auto">
                <div class="order-item-thumbnail w-18-p"></div>
                <div class="order-item-info">
                    <strong class="order-item-title w-18-p">
                        Title
                    </strong>
                    <strong class="order-item-price w-18-p">
                        Price
                    </strong>
                    <strong class="order-item-quantity-group-title w-18-p">
                        Quantity
                    </strong>
                    <strong class="order-item-total w-18-p">
                        Total
                    </strong>
                    <div class="w-10-p"></div>
                </div>
            </div>
        `
        let dishesList = tableHeader;
        dishesList += normalDishesList.map(element=>
            `
            <div class="order-item-list-row item-row m-lr-5p pd-tb-3-p height-auto">
                <div class="w-18-p">
                    <img src="/images/product-images/${element.thumbnail}" alt="thumbnail" class="order-item-thumbnail w-100-p">
                </div>
                <div class="order-item-info">
                    <div class="order-item-title w-18-p">
                        ${element.title}
                    </div>
                    <div class="order-item-price w-18-p">
                        ${element.price}
                    </div>
                    <div class="order-item-quantity-group w-18-p">
                        <i class="fas fa-minus-circle quick-shopping-btn-decrease-normal" id="quick-shopping-btn-decrease_${element.id}_normal"></i>
                        <div class="product-quantity">
                            ${element.quantity}
                        </div>
                        <i class="fas fa-plus-circle quick-shopping-btn-increase-normal" id="quick-shopping-btn-increase_${element.id}_normal"></i>
                    </div>
                    <div class="order-item-total w-18-p">
                        ${element.price * element.quantity}
                    </div>
                    <i class="fas fa-times-circle quick-shopping-btn-remove-normal w-10-p" id="quick-shopping-btn-remove_${element.id}_normal"></i>
                </div>
            </div>`
        ).join('');
        normalDishesContainer.innerHTML = dishesList;
        renderTotalSection();
        initChangeNormalDishesQuantityEvent();
        return;
    }
    renderTotalSection();
    normalDishesContainer.innerHTML = "";
}

const renderDiscountDishesList = (time = 'other') => {
    const adviceList = document.querySelector('#advice-list');
    if(discountDishesList.length > 0)
    {
        // console.log(time);
        if(time === 'first')
        {
            // console.log(2);
            calculateFirstTimeRender('discount');
        }
        let advices = "";
        let tableHeader = `
        <div class="order-item-list-row item-row m-lr-5p pd-tb-3-p height-auto">
                <div class="order-item-thumbnail w-18-p"></div>
                <div class="order-item-info">
                    <strong class="order-item-title w-18-p">
                        Title
                    </strong>
                    <strong class="order-item-price w-18-p">
                        Price
                    </strong>
                    <strong class="order-item-quantity-group-title w-18-p">
                        Quantity
                    </strong>
                    <strong class="order-item-total w-18-p">
                        Total
                    </strong>
                    <div class="w-10-p"></div>
                </div>
            </div>
        `
        advices = tableHeader;
        advices += discountDishesList.map(element=>
            `
            <div class="order-item-list-row item-row m-lr-5p pd-tb-3-p height-auto">
                <div class="w-18-p">
                    <img src="/images/product-images/${element.thumbnail}" alt="thumbnail" class="order-item-thumbnail w-100-p">
                </div>
                <div class="order-item-info">
                    <div class="order-item-title w-18-p">
                        ${element.title}
                    </div>
                    <div class="order-item-price w-18-p">
                        ${element.price*(100-element.salePercent)/100}
                    </div>
                    <div class="order-item-quantity-group w-18-p">
                        <i class="fas fa-minus-circle quick-shopping-btn-decrease" id="quick-shopping-btn-decrease_${element.id}"></i>
                        <div class="product-quantity">
                            ${element.quantity}
                        </div>
                        <i class="fas fa-plus-circle quick-shopping-btn-increase" id="quick-shopping-btn-increase_${element.id}"></i>
                    </div>
                    <div class="order-item-total w-18-p">
                        ${element.price * (100-element.salePercent)/100 * element.quantity}
                    </div>
                    <i class="fas fa-times-circle quick-shopping-btn-remove w-10-p" id="quick-shopping-btn-remove_${element.id}"></i>
                </div>
            </div>`
        ).join('');
        adviceList.innerHTML = advices;
        renderTotalSection();
        return;
    }
    renderTotalSection();
    adviceList.innerHTML = "<div style='font-size:30px;text-align:center;margin-top:10%'>Oops, We can't find any dish match with your request in your money limit range, try it again</div>";
}

const renderTotalSection = () => {
    console.log(discountDishesList.length,normalDishesList.length);
    if(discountDishesList.length < 1 && normalDishesList.length < 1)
    {
        bottomElement.innerHTML = "";
        return;
    }
    bottomElement.innerHTML = `
    <div class="quick-shopping-bottom-element-notice">* Discount just apply for first dishes</div>
    <div class="quick-shopping-bottom-element-item">
        <div class="quick-shopping-statistic-container">
            <div class="quick-shopping-statistic-total">
                <strong class="quick-shopping-statistic-title">
                    Total:
                </strong>
                <div class="quick-shopping-statistic-detail">
                    ${statistic.total}
                </div>
            </div>
            <div class="quick-shopping-statistic-saving">
                <strong class="quick-shopping-statistic-title">
                    Total saving:
                </strong>
                <div class="quick-shopping-statistic-detail">
                    ${statistic.saving}
                </div>
            </div>
            <hr/>
            <div class="quick-shopping-statistic-payment">
                <strong class="quick-shopping-statistic-title">
                    Total payment:
                </strong>
                <div class="quick-shopping-statistic-detail">
                    ${statistic.total - statistic.saving}
                </div>
            </div>
        </div>
        <div class="flex-section w-25-p">
            <button class="quick-shopping-order-btn" id="quick-shopping-order-btn">
                Order now
            </button>&nbsp;
            <button class="quick-shopping-reset-btn" id="quick-shopping-reset-btn">
                Reset
            </button>
        </div>
    </div>
    `;
    document.querySelector('#quick-shopping-order-btn').addEventListener('click',()=>{
        localStorage.setItem("order_items",JSON.stringify({normal_dish:normalDishesList,sale_dish:discountDishesList}));
        alert("Order succeeded!")
    })
}

const receiveAdvice = () => {
    let temporary = categoriesListId;
    for(let i = 0;i < categoriesListRootId.length;i++)
    {
        temporary = temporary.map(element=>
            {
                return element[1] === categoriesListRootId[i]?"-":element
            }
        )
    }
    const data = {
        root_id:categoriesListRootId,
        category_id:temporary,
        limit_range:limitRange
    }
    console.log(data);
    fetch(`http://localhost:5000/calculate/1234567890`,{
        method:'POST',
        headers:{
            'Content-Type': 'application/json'
        },
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'same-origin',
        redirect: 'follow',
        referrerPolicy: 'no-referrer',
        body:JSON.stringify(data)
    })
    .then(response=>response.json())
    .then(result=>{
        // console.log(result)
        discountDishesList = []
        statistic.saving = 0;
        statistic.total = 0;
        result.data.forEach(element=>{
            let temporary = {
                id:element[0],
                title:element[1],
                price:element[2],
                salePercent:element[3],
                thumbnail:element[4],
                quantity:1
            }
            discountDishesList.push(temporary);
        })
        quickShoppingSection.classList.add('widen-section');
        setTimeout(()=>{
            renderDiscountDishesList('first');
            initChangeQuantityEvent();
        },800);
    })
    .catch(error=>{
        quickShoppingSection.classList.add('widen-section');
        setTimeout(()=>{
            renderDiscountDishesList('first');
            initChangeQuantityEvent();
        },800);
    });
}
limitRangeInput.addEventListener('keyup',(event)=>{
    limitRange = event.target.value;
})
viewResultBtn.addEventListener('click',receiveAdvice);
quickShoppingBtn.addEventListener('click',()=>displayQuickShoppingSection(true));
closeShoppingSectionBtn.addEventListener('click',displayQuickShoppingSection);
categoriesOption.forEach(element=>{
    element.addEventListener('click',addCategoriesOption);
})