const confirmationModalContainer = document.querySelector('#confirmation-modal-container');
const confirmationModalSubtitle = document.querySelector('#confirmation-modal-subtitle');
const confirmationModalBtnArea = document.querySelector('#confirmation-modal-btn-container');
const confirmationModalTitle = document.querySelector('#confirmation-modal-title');

const displayConfirmationModal = (title,btns) =>{
    confirmationModalContainer.style.display = 'unset';
    confirmationModalSubtitle.innerHTML = title;
    confirmationModalBtnArea.innerHTML = btns.map((btn)=>
        `<div class="confirmation-modal-btn-btn" id="confirmation-modal-btn-${btn.id}">
            ${btn.title}
        </div>`
    ).join('');
    confirmationModalTitle.classList.remove('confirmation-title-narrow');
    confirmationModalTitle.classList.add('confirmation-title-scale');
}

const hideConfirmationModal = () => {
    confirmationModalTitle.classList.remove('confimation-title-scale');
    confirmationModalTitle.classList.add('confirmation-title-narrow');
    setTimeout(()=>{
        confirmationModalContainer.style.display = 'none';
    },1000)
}