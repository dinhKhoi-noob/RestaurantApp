const componentCategoryOptions = document.querySelectorAll('.option-dropdown-option');
const rootCategoryOptions = document.querySelectorAll('.option-dropdown-root-option');
const searchInput = document.querySelector('#search-category-input');
const searchBtn = document.querySelector('#search-bar-btn');

let categorySelected="all";
let searchString="";
let isRoot=0;
let isSearchAll = true;

searchInput.addEventListener('keyup',(event)=>{
    if(event.keyCode === 13){
        if(isSearchAll){
            isRoot = 1;
        }
        searchInput.value = "";
        window.location.href = `http://localhost:4000/page/search/${categorySelected}?root=${isRoot}&search=${searchString}`;
    }
    searchString = event.target.value;
})

componentCategoryOptions.forEach(option=>{
    option.addEventListener('click',(event)=>{
        const value = event.target.value;
        categorySelected = value;
        isSearchAll = false;
        isRoot = 0;
        console.log("Component: ",event.target.value);
    })
})

rootCategoryOptions.forEach(option=>{
    option.addEventListener('click',(event)=>{
        const value = event.target.value;
        categorySelected = value;
        isRoot = 1;
        isSearchAll = false;
        console.log("Root: ",event.target.value);
    })
});

searchBtn.addEventListener('click',()=>{
    if(searchString === undefined || searchString === ""){
        searchString = "";
    }
    searchInput.value = "";
    window.location.href = `http://localhost:4000/page/search/${categorySelected}?root=${isRoot}&search=${searchString}`;
})