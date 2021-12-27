const descriptionNavigator = document.querySelector('#review-section-title-desc');
const informationNavigator = document.querySelector('#review-section-title-info');
const reviewNavigator = document.querySelector('#review-section-title-review');
const descriptionSection = document.querySelector('.review-section-description-container');
const informationSection = document.querySelector('.review-section-additional-section');
const reviewSection = document.querySelector('.review-section-review-container');

descriptionNavigator.addEventListener('click',()=>{
    descriptionNavigator.classList.add('border-bot');
    reviewNavigator.classList.remove('border-bot');
    informationNavigator.classList.remove('border-bot');
    descriptionSection.style.display = 'unset'
    informationSection.style.display = 'none';
    reviewSection.style.display = 'none';
})
informationNavigator.addEventListener('click',()=>{
    informationNavigator.classList.add('border-bot');
    reviewNavigator.classList.remove('border-bot');
    descriptionNavigator.classList.remove('border-bot');
    informationSection.style.display = 'flex';
    descriptionSection.style.display = 'none';
    reviewSection.style.display = 'none';
})
reviewNavigator.addEventListener('click',()=>{
    reviewNavigator.classList.add('border-bot');
    descriptionNavigator.classList.remove('border-bot');
    informationNavigator.classList.remove('border-bot');
    reviewSection.style.display = 'unset'
    informationSection.style.display = 'none';
    descriptionSection.style.display = 'none';
})