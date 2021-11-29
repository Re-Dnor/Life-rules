window.addEventListener('DOMContentLoaded', () => {

  const tabs = document.querySelectorAll('.tabheader__item');
  const tabsContent = document.querySelectorAll('.tabcontent');
  const tabsParent = document.querySelector('.tabheader__items');
  const home = document.querySelector('.home');
  const tabcontentHome = document.querySelector('.tabcontent__home');


  function hideTabContent() {
    tabsContent.forEach(item => {                 //перебор всех '.tabcontent' и добавление и
      item.classList.add('hide');                 // удаление классов
      item.classList.remove('show', 'fade');
    });

    tabs.forEach(item => {
    item.classList.remove('tabheader__item_active');
    });
  }

  function showTabContent(i = 0) {
    tabsContent[i].classList.add('show', 'fade');
    tabsContent[i].classList.remove('hide');
    tabs[i].classList.add('tabheader__item_active');
  }

  function showHome() {
    tabcontentHome.classList.remove('hide');
    tabcontentHome.classList.add('show', 'fade');
  }

  hideTabContent();
  showHome();

  tabsParent.addEventListener('click', (event) => {
    const target = event.target;

    if (target && target.classList.contains('tabheader__item')) {
      tabs.forEach((item, i) => {
        if (target == item) {
          hideTabContent();
          showTabContent(i);
        }
      });
    }
  });

  home.addEventListener('click', () => {
    hideTabContent();
    showHome();
    
  });

  const modalTrigger = document.querySelector('.rules');
  const modal = document.querySelector('.modal');

  function openModal() {
    modal.classList.add('show');
    modal.classList.remove('hide');     
    document.body.style.overflow = 'hidden';
  }

  modalTrigger.addEventListener('click', openModal);

  function closeModal() {
    modal.classList.add('hide');
    modal.classList.remove('show');
    document.body.style.overflow = '';
  }

  modal.addEventListener('click', (e) => {  
    // console.log(e.target);
    // console.log(e.currentTarget);
    
    // закрытие модального окна на зону вокруг него
    if (e.target === modal || e.target.getAttribute('data-close') == '') {
      closeModal();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.code === 'Escape' && modal.classList.contains('show')) {
      closeModal();
    }
  });

  // FORM


  const forms = document.querySelectorAll('form');
  const message = {
    loading: './img/spinner.svg',
    success: 'Благодарю за ваше правило!',
    failure: 'Что-то пошло не так...'
  };  

  forms.forEach(item => {
    bindPostData(item);
  });

  const postData = async (url, data) => {   //async асинхронный код
    const res = await fetch(url, {       //await дождаться выполнения этого
      method: "POST",
      headers: {
        'Content-type': 'application/json'
      },
      body: data
    });

    return await res.json();
  };

  function bindPostData(form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const statusMessage = document.createElement('img');
      statusMessage.src = message.loading;
      statusMessage.style.cssText = `
      display: block;
      margin: 0 auto;
      `;

      form.insertAdjacentElement('afterend', statusMessage);


      const formData = new FormData(form);

      const json = JSON.stringify(Object.fromEntries(formData.entries()));

        postData('http://localhost:3000/requests', json)
        .then(data => {
          console.log(data);
          showThanksModal(message.success);
          form.reset();
          statusMessage.remove();
        }).catch(() => {
          showThanksModal(message.failure);
        }).finally(() => {
          form.reset();
        });
    });
  }

    //THanks Modal Window

    function showThanksModal(message) {
      const prevModalDialog = document.querySelector('.modal__dialog');
  
      prevModalDialog.classList.add('hide');
      openModal();
  
      const thanksModal = document.createElement('div');
      thanksModal.classList.add('modal__dialog');
      thanksModal.innerHTML = `
        <div class="modal__content">
        <div class="modal__close" data-close>&times;</div>
        <div class="modal__title-thx">${message}</div>
        </div>
      `;
  
      document.querySelector('.modal').append(thanksModal);
      setTimeout(() => {
        thanksModal.remove();
        prevModalDialog.classList.add('show');
        prevModalDialog.classList.remove('hide');
        closeModal();
      }, 2500);
    }
  

});