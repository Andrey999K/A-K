let buttonsDeleteAdmin = document.querySelectorAll('.button-delete-admin');
const formAddAdmin = document.querySelector('.admins__form');

const buttonShowAdmins = document.getElementById('show-admins');
const adminsList = document.querySelector('.admins__content');

// УДАЛЕНИЕ ПОЛЬЗОВАТЕЛЯ
buttonsDeleteAdmin.forEach(item => {
    item.addEventListener('click', () => {
        const nameUser = item.parentNode.children[0].textContent;
        const deleteCategory = confirm(`Удалить пользователя "${nameUser}"?`);
        if (deleteCategory) {
            ajaxRequest('POST', {
                'delete': true,
                'userId': item.id,
                'category': 'admins'
            }).then((response) => {
                if (typeof response == 'string') {
                    if (response.startsWith('Error:')) {
                        response = response.replace('Error:', '');
                    }
                    alert(response);
                } else {
                    console.log(response);
                    item.parentNode.remove();
                    alert(`Пользователь "${nameUser}" успешно удалён.`);
                }
            }).catch(e => console.log(e));
        }
    });
});

// ДОБАВЛЕНИЕ ПОЛЬЗОВАТЕЛЯ
formAddAdmin.addEventListener('submit', () => {
    console.log("ffff");
    event.preventDefault();
    const inputLoginAdmin = formAddAdmin.querySelector('.input-login-admin');
    const inputPasswordAdmin = formAddAdmin.querySelector('.input-password-admin');
    ajaxRequest('POST', {
        'insert': true,
        'category': 'admins',
        'login': inputLoginAdmin.value,
        'password': inputPasswordAdmin.value
    }).then((response) => {
        if (typeof response == 'string' && response.startsWith('Error:')) {
            response = response.replace('Error:', '');
            alert(response);
        } else {
            inputLoginAdmin.value = '';
            inputPasswordAdmin.value = '';
            let newItem = createElement('li', 'section__item');
            newItem.insertAdjacentHTML(
                'afterbegin',
                `<span class="section__item-name">${response['login']}</span>
                    <button class="section__button-arrow category__item button-delete-category"
                    id="${response['id_admin']}">Удалить</button>`
            );
            const listItem = formAddAdmin.parentNode.querySelector('.admins__list');
            listItem.append(newItem);

            alert(`Пользователь "${response['login']}" успешно добавлен.`);
            buttonsDeleteAdmin = document.querySelectorAll('.button-delete-admin');
        }
    }).catch(e => console.log(e));
});

// ПОКАЗ И СКРЫТИЕ ПОЛЬЗОВАТЕЛЕЙ
buttonShowAdmins.addEventListener('click', () => {
    toggleList(adminsList, buttonShowAdmins);
});