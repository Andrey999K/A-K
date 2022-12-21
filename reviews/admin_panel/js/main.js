let buttonsDeleteCategory = Array.from(document.querySelectorAll('.button-delete-category'));
const formAddCategory = document.querySelector('.categories__form');
const inputNameCategory = document.querySelector('.input-name-category');
const inputIconCategory = document.querySelector('.input-icon-category');

// let buttonsDeleteTag = document.querySelectorAll('.button-delete-tag');
const formAddTag = document.querySelector('.tags__form');
const inputNameTag = document.querySelector('.input-name-tag');

let buttonsDeleteSubcategory = document.querySelectorAll('.button-delete-subcategory');
let formsAddSubcategory = document.querySelectorAll('.subcategories__form');

let formsAddReviews = document.querySelectorAll('.reviews__form');
let buttonsDeleteReview = document.querySelectorAll('.button-delete-review');

// КНОПКА ПОКАЗА КАТЕГОРИЙ
const buttonShowCategories = document.getElementById('show-categories');
const categoriesContent = document.querySelector('.categories__content');

const buttonShowSubcategories = document.getElementById('show-subcategories');
const subcategoriesContent = document.querySelector('.subcategories__content');

const buttonShowTags = document.getElementById('show-tags');
const tagsContent = document.querySelector('.tags__content');

const buttonShowReviews = document.getElementById('show-reviews');
const reviewsContent = document.querySelector('.reviews__content');

let buttonsShowSubcatInCat = document.querySelectorAll('.show-subcategories-in-category');
let listsSubcatInCat = document.querySelectorAll('.list-subcategories-in-category');

let buttonsShowReviews = document.querySelectorAll('.show-reviews-subcategory');
let listsReviews = document.querySelectorAll('.list-reviews');

let inputsFile = document.querySelectorAll('.upload-file__wrapper');

let inputTagsForSubcategory = document.querySelectorAll('.subcategory__tags-input');
let inputTagsForm = document.querySelectorAll('form.subcategories__form .subcategories-tags__input');

let listsTagsInput = document.querySelectorAll('.dropdown-list-tags');

let buttonsEditBannerSubcat = document.querySelectorAll('.edit-banner-subcategory');
let buttonsEditImage = document.querySelectorAll('input.edit-image');

let buttonsDeleteTag = document.querySelectorAll('.subcategories-tags-item__button-delete.button-tag-delete');

let buttonEditOrderCategories = document.querySelector('.edit-order-categories');
let categoriesList = Array.from(document.querySelectorAll('.categories__list .section__item'));
let buttonsEditOrderSubcat = document.querySelectorAll('.edit-order-subcategories');
let subcategoriesList = document.querySelectorAll('.subcategories__item');
let buttonsEditOrderReviews = document.querySelectorAll('.edit-order-reviews');

let inputsEdit = document.querySelectorAll('.input-edit');



const listCategories = document.querySelector('.categories__list');
const listSubcategories = document.querySelector('.subcategories__list');

const sectionsContents = document.querySelectorAll('.section__content');



let tags = [];

let draggableElem = null;
// let orderCategories = getOrderList(categoriesList);
// let orderEditCategories = false;
// let listCategoriesId = getListIdCategories();

async function ajaxRequest(typeRequest='GET', data=false) {
    let fd = new FormData();
    if (data) {
        for (let key in data) {
            fd.set(key, data[key]);
        }
    }

    let response = await fetch(
        `scripts/ajax.php`,{
            method: typeRequest,
            body: fd,
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            }
        });
    return await response.json();
}

function createElement(tagName, className) {
    const elem = document.createElement(tagName);
    elem.className = className;
    return elem;
}

function toggleArrow(buttonArrow) {
    const [nameFile, pathFile] = getPathNameFile(buttonArrow.querySelector('img').src);
    nameFile === 'arrow_down.png' ?
        buttonArrow.querySelector('img').src = `${pathFile}/up_arrow.png` :
        buttonArrow.querySelector('img').src = `${pathFile}/arrow_down.png`;
}

function toggleList(listElem, button) {
    cancelAllEditText();
    listElem.classList.toggle('hidden');
    toggleArrow(button);
    console.log(listElem);
    console.log(listElem.classList.contains('.list-content'));
    if (listElem.classList.contains('list-content'))
        editOrderOff(listElem.querySelector('.button-edit-order'), true);
    // console.log(listElem);
    // if (!listElem.classList.contains('subcategories__content') &&
    //     !listElem.classList.contains('reviews__content')) {
    //     if (listElem.querySelectorAll('.section__button').length > 1) {
            // console.log(listElem.querySelectorAll('.section__item .edit-text-container .section__button'));
            // listElem.querySelectorAll('.section__button')[1].remove();
            // orderEditCategories = false;
        // }
        // if (listElem.querySelectorAll('.item-edit-order').length !== 0) {
        //     resetOrder(listElem.querySelector('.button-edit-order'),
        //         listElem.querySelectorAll('.item-edit-order'));
        // }
    // }
}

function getPathNameFile(fullName) {
    let pathName = fullName.split('/');
    const nameFile = pathName.pop();
    pathName = pathName.join('/');
    return [nameFile, pathName];
}

function deleteReview(buttonReview) {
    const deleteReview = confirm(`Удалить отзыв?`);
    if (deleteReview) {
        const idReview = buttonReview.getAttribute('id-review');
        const fileReview = buttonReview.getAttribute('file-review');
        ajaxRequest('POST', {
            'delete': true,
            'idReview': idReview,
            'fileName': fileReview,
            'category': 'review'
        }).then((response) => {
            if (buttonReview.parentElement.parentElement.childElementCount === 1) {
                buttonReview.parentElement.parentElement.innerHTML = '<span>0 отзывов</span>'
            } else {
                let grid = buttonReview.closest('.section__subcategory-reviews-content');
                buttonReview.parentNode.remove();
                masonryGrid(grid, 1100, 500);
            }
            alert(`Отзыв успешно удалён.`);
        }).catch(e => console.log(e));
    }
}

function getTags() {
    ajaxRequest('POST', {
        'get_tags': true
    }).then((response) => {
        tags = response;
    }).catch(e => console.log(e));
}

function clickTagInList(list, li) {
    list.style.display = 'none';
    console.log('id_tag: ', li.getAttribute('id-tag'));
    console.log('id_subcategory: ', list.closest('.section__item').getAttribute('id-subcategory'));
    ajaxRequest('POST', {
        'add_tag_in_subcat': true,
        'id_tag': li.getAttribute('id-tag'),
        'id_subcategory': list.closest('.section__item').getAttribute('id-subcategory')
    }).then((response) => {
        if (typeof response === 'string') {
            if (response.startsWith('Error')) {
                alert(response.replace('Error:', ''));
            }
        } else {
            const listTags = list.closest('.subcategories-tags').querySelector('.subcategories-tags__list');
            const newTag = createElement('li', 'subcategories-tags__item category');
            newTag.innerHTML = `<span>${li.textContent}</span>
                                <button class="subcategories-tags-item__button-delete">
                                    <svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" focusable="false" class="style-scope tp-yt-iron-icon" style="pointer-events: none; display: block; width: 100%; height: 100%;"><g class="style-scope tp-yt-iron-icon"><path d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z" class="style-scope tp-yt-iron-icon"></path></g></svg>
                                </button>`
            listTags.append(newTag);
        }
    }).catch(e => console.log(e));
}

function createListTagsInput() {
    listsTagsInput.forEach(list => {
        list.innerHTML = '';
        tags.forEach(tag => {
            const li = createElement('li', 'dropdown-list-tags__item');
            li.textContent = tag['name_tag'];
            li.setAttribute('id-tag', tag['id_tag']);
            list.append(li);
            li.addEventListener('click', () => {
                clickTagInList(list, li);
            });
        });
    });
}

function renderListTagsInput(list, massData) {
    list.innerHTML = '';
    massData.forEach(tag => {
        let li = createElement('li', 'dropdown-list-tags__item');
        li.textContent = tag['name_tag'];
        li.setAttribute('id-tag', tag['id_tag']);
        list.append(li);
        li.addEventListener('click', () => {
            clickTagInList(list, li);
        });
    });
}

// СОРТИРОВКА ПО ПОЛЮ
function byField(field) {
    return (a, b) => a[field] > b[field] ? 1 : -1;
}

// ОЧИСТКА ПОЛЯ ВВОДА ФАЙЛОВ
function clearInput(input, textLabel) {
    input.value = '';
    input.parentElement.querySelector('.upload-file__text').textContent = textLabel;
}

// ОЧИСТКА ПОЛЯ ВВОДА ТЕГОВ
function clearInputTags(form) {
    form.querySelector('.subcategories-tags__list').innerHTML = '';
}

function deleteTagFromList(tag) {
    tag.remove();
}

// УДАЛЕНИЕ ТЕГА
function deleteTag(elem) {
    const tagElem = elem.closest('.subcategories-tags__item.category')
    const nameTag = tagElem.querySelector('span').textContent;
    const tagDelete = confirm(`Удалить тег "${nameTag}"?`);
    if (tagDelete) {
        ajaxRequest('POST', {
            'delete': true,
            'category': 'tag',
            'subcategoryId': elem.closest('.section__item.subcategory').getAttribute('id-subcategory'),
            'tagId': elem.getAttribute('id-tag')
        }).then((response) => {
            if (response.startsWith('Error')) {
                alert(response.replace('Error:', ''));
            } else {
                deleteTagFromList(tagElem);
            }
        }).catch(e => console.log(e));
    }
    console.log('Удаляем');
}

function dragStart(event) {
    event.target.classList.add('dragable');
    draggableElem = event.target;
    setTimeout(() => {
        event.target.style.opacity = '0';
    }, 0);
}

function dragEnd(event) {
    event.target.classList.remove('dragable');
    event.target.style.opacity = '';
}

function dragEnter(event) {
    event.preventDefault();
    if (this !== draggableElem) {
        const container = draggableElem.parentElement;
        draggableElem.remove();
        // console.log(this, this.nextElementSibling, container, draggableElem);
        insertAfter(this, container, draggableElem);
        // if (this.nextElementSibling) {
        //     container.insertBefore(draggableElem, this.nextElementSibling);
        // } else {
        //     container.append(draggableElem);
        // }
        if (container.classList.contains('section__subcategory-reviews-content')) {
            masonryGrid(container, 1100, 500);
        }
    }
    // console.log(event.target);
    // if (event.target.classList.contains('section__item-title')) {
    //     console.log(event.target.closest('li.subcategories__item.drag-and-drop'));
    //     event.target.closest('li.subcategories__item.drag-and-drop').classList.add('hovered');
    // } else {
    //     event.target.classList.add('hovered');
    // }
}

function dragLeave(event) {
    this.classList.remove('hovered');
}

function dragOver(event) {
    event.preventDefault();
}

function dragDrop(oldOrder, event) {
    console.log('drop');
    console.log(event.target);
    console.log(event.target.parentElement);
    const newOrder = getOrderList(Array.from(event.target.closest('.list-order-editable').children));
    console.log(oldOrder, newOrder);
    if (!equalArrays(oldOrder, newOrder)) {
        event.target.closest('.list-content').querySelector('.button-save-order')
            .classList.remove('hidden');
    } else {
        event.target.closest('.list-content').querySelector('.button-save-order')
            .classList.add('hidden');
    }
    // const newOrder = getOrderList(document.querySelectorAll('.categories__list .section__item'));
    // console.log(!orderEditCategories);
    // console.log(!equalArrays(newOrder, orderCategories));
    // if (!equalArrays(newOrder, orderCategories) && !orderEditCategories) {
    //     orderEditCategories = true;
    //     const buttonSaveOrder = createElement('button', 'section__button button-save-order');
    //     buttonSaveOrder.textContent = 'Сохранить';
    //     insertAfter(
    //         this.closest('.categories__content').querySelector('.section__button'),
    //         this.closest('.categories__content'), buttonSaveOrder);
    //     buttonSaveOrder.removeEventListener('click', saveOrderCategories);
    //     buttonSaveOrder.addEventListener('click', saveOrderCategories.bind(event, newOrder));
    // } else if (equalArrays(newOrder, orderCategories) && orderEditCategories){
    //     this.closest('.categories__content').querySelector('.button-save-order').remove();
    //     orderEditCategories = false;
    // }
}

function equalArrays(a,b) {
    if (a.length !== b.length) return false;

    for(let i = 0; i < a.length; i++)
        if (a[i] !== b[i]) return false;

    return true;
}

function insertAfter(elem, container, newElem) {
    if (elem.nextElementSibling) {
        container.insertBefore(newElem, elem.nextElementSibling);
    } else {
        container.append(draggableElem);
    }
}

// function dragAndDropOff(list) {
//     list.forEach(item => {
//         item.classList.remove('drag-and-drop');
//         for (let i = 0; i < item.children.length; i++) {
//             item.children[i].style.zIndex = '';
//         }
//         item.removeAttribute('draggable');
//         item.removeEventListener('dragstart', dragStart);
//         item.removeEventListener('dragend', dragEnd);
//     });
// }

function resetOrder(list) {
    const listElement = list[0].parentElement;
    listElement.innerHTML = '';
    list = sortList(list);
    list.forEach(item => {
        listElement.append(item);
    });
    if (listElement.classList.contains('section__subcategory-reviews-content')) {
        masonryGrid(listElement, 1100, 500);
    }
}

// function editOrder(button, list) {
//     button.addEventListener('click', () => {
//         if (button.textContent === 'Изменить порядок') {
//             button.textContent = 'Отмена';
//             list.forEach(item => {
//                 item.classList.add('drag-and-drop');
//                 for (let i = 0; i < item.children.length; i++) {
//                     item.children[i].style.zIndex = '-1';
//                 }
//                 item.setAttribute('draggable', 'true');
//                 item.addEventListener('dragstart', dragStart);
//                 item.addEventListener('dragend', dragEnd);
//                 item.addEventListener('dragenter', dragEnter);
//                 item.addEventListener('dragleave', dragLeave);
//                 item.addEventListener('dragover', dragOver);
//                 item.addEventListener('drop', dragDrop);
//             });
//         } else {
//             resetOrder(button, list);
//         }
//     });
// }

function getOrderList(list) {
    let mass = [];
    list.forEach(item => {
        mass.push(Number(item.getAttribute('position')));
    });
    return mass;
}

function getListId(list) {
    let massId = [];
    list.forEach(item => {
        massId.push(Number(item.getAttribute('item-id')));
    });
    return massId;
}

// СОРТИРОВКА СПИСКА ЭЛЕМЕНТОВ ПО ПОЗИЦИЯМ
function sortList(list) {
    return Array.from(list).sort(function (a, b) {
        if (Number(a.getAttribute('position')) >
            Number(b.getAttribute('position'))) {
            return 1;
        }
        if (Number(a.getAttribute('position')) <
            Number(b.getAttribute('position'))) {
            return -1;
        }
        return 0;
    });
    // let mass = [];
    // while (list.length !== mass.length) {
    //     let minElem = list[0];
    //     if (mass.length !== 0) {
    //         minElem = mass[mass.length - 1];
    //     }
    //     for (let i = 0; i < list.length; i++) {
    //         console.log(
    //             Number(list[i].getAttribute('position')),
    //             Number(minElem.getAttribute('position'))
    //         );
    //         if (Number(list[i].getAttribute('position')) <
    //             Number(minElem.getAttribute('position'))) {
    //             minElem = list[i];
    //         }
    //     }
    //     mass.push(minElem);
    //     console.log(mass);
    // }
    // return mass;
}

// СОХРАНЕНИЕ ПОРЯДКА КАТЕГОРИЙ
// function saveOrderCategories(newOrder, event) {
//     ajaxRequest('POST', {
//         'request': 'edit_order_categories',
//         'list_id_categories': listCategoriesId,
//         'new_order': newOrder
//     }).then((response) => {
//         const listElem = document.querySelectorAll('.categories__list li.section__item');
//         dragAndDropOff(listElem);
//         for (let i = 0; i < listElem.length; i++) {
//             listElem[i].setAttribute('position', String(i + 1));
//         }
//         event.target.remove();
//         document.querySelector('.section__content .button-edit-order').textContent = 'Изменить порядок';
//         alert(response['message']);
//     }).catch(e => console.log(e));
// }

// УДАЛЕНИЕ КАТЕГОРИИ
function deleteCategory(item) {
    const nameCategory = item.parentNode.querySelector('.section__item-name').textContent;
    const deleteCategory = confirm(`Удалить категорию "${nameCategory}"?`);
    if (deleteCategory) {
        ajaxRequest('POST', {
            'delete': true,
            'catId': item.id,
            'category': 'cat'
        }).then((response) => {
            console.log(response);
            item.parentNode.remove();
            const deletedSubcategoriesBlocks = document.querySelectorAll(`.category-${item.id}`);
            if (deletedSubcategoriesBlocks) {
                deletedSubcategoriesBlocks.forEach(blockSubcategory => {
                    blockSubcategory.remove();
                });
            }
            if (document.querySelector(`.category-${item.id}`)) {
                document.querySelector(`.category-${item.id}`).remove(); // УДАЛЕНИЯ ПОДКАТЕГОРИЙ КАТЕГОРИИ
            }
            alert(`Категория "${nameCategory}" успешно удалена.`);
        }).catch(e => console.log(e));
    }
}

function deleteSubcategory(item) {
    const nameSubcategory = item.parentNode.querySelector('span.section__item-name').textContent;
    const deleteSubcategory = confirm(`Удалить подкатегорию "${nameSubcategory}"?`);
    if (deleteSubcategory) {
        ajaxRequest('POST', {
            'delete': true,
            'catId': item.id,
            'category': 'subcat'
        }).then((response) => {
            console.log(response);
            item.parentNode.remove();
            if (document.querySelector(`.subcategory-${item.id}`)) {
                document.querySelector(`.subcategory-${item.id}`).remove();
            }
            alert(`Подкатегория "${nameSubcategory}" успешно удалена.`);
        }).catch(e => console.log(e));
    }
}

function editText(item) {
    item.querySelector('.text-editable').classList.add('hidden');
    item.querySelector('input.input-edit').classList.remove('hidden');
    item.querySelector('button.edit-button').classList.add('hidden');
    item.querySelector('button.button-cancel').classList.remove('hidden');
}

function editTextOff(item) {
    const currentText = item.querySelector('.text-editable');
    currentText.classList.remove('hidden');
    const inputText = item.querySelector('input.input-edit');
    inputText.classList.add('hidden');
    inputText.value = currentText.textContent;
    item.querySelector('button.edit-button').classList.remove('hidden');
    item.querySelector('button.button-save').classList.add('hidden');
    item.querySelector('button.button-cancel').classList.add('hidden');
}

function checkErrorResponse(response) {
    if (typeof response === 'string') {
        if (response.startsWith('Error')) {
            alert(response.replace('Error:', ''));
            return false;
        }
        return true;
    } else {
        if (response['error']) {
            alert(response['error']);
            return false;
        } else {
            return true;
        }
    }
}

function editFile() {
    console.log(this);
    const container = this.closest('.image-wrapper');
    const imageLoad = container.querySelector('img.image-load');
    const image = container.querySelector('img.file-image');
    image.style.display = 'none';
    imageLoad.style.display = 'block';
    ajaxRequest('POST', {
        'request': 'editFile',
        'requestData': this.dataset.typeRequest,
        'itemId': this.dataset.itemId,
        'file': this.files[0]
    }).then((response) => {
        if (checkErrorResponse(response)) {
            // image.style.width = '';
            setTimeout(() => {
                image.src = response + `?v=${new Date().getTime()}`;
                image.style.display = 'block';
                imageLoad.style.display = 'none';
            }, 0);
        }
        this.value = '';
    }).catch(e => console.log(e));


}

// УДАЛЕНИЕ КАТЕГОРИИ
buttonsDeleteCategory.forEach(item => {
    item.addEventListener('click', deleteCategory.bind(event, item));
});

// ДОБАВЛЕНИЕ КАТЕГОРИИ
formAddCategory.addEventListener('submit', () => {
    event.preventDefault();
    ajaxRequest('POST', {
        'insert': true,
        'category': 'cat',
        'name': inputNameCategory.value,
        'icon': inputIconCategory.files[0]
    }).then((response) => {
        if (typeof response == 'string') {
            if (response.startsWith('Error:')) {
                response = response.replace('Error:', '');
            }
            alert(response);
        } else {
            inputNameCategory.value = '';
            let newItem = createElement('li', 'section__item item-edit-order item-editable');
            newItem.setAttribute('category-id', response['id_category']);
            newItem.setAttribute('item-id', response['id_category']);
            newItem.setAttribute('position', response['position_category']);
            newItem.insertAdjacentHTML(
                'afterbegin',
                `<div class="nav-item__image-container">
                            <div class="category__icon image-wrapper">
                                <img class="image-load" src="https://i.gifer.com/origin/b4/b4d657e7ef262b88eb5f7ac021edda87_w200.webp" alt="" style="display: none;">
                                <img src="../img/menu/${response['id_category']}.svg" alt="icon" class="nav-item__icon file-image">
                                <label class="edit-button" for="edit-icon-category${response['id_category']}">
                                    <input type="file" data-type-request="editIconCategory" data-item-id="${response['id_category']}" class="edit-icon-category edit-image" id="edit-icon-category${response['id_category']}" style="width: 1px; height: 1px;">
                                    <svg class="edit-icon" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M20.8984 0.972656C19.8516 0.972656 18.8047 1.37891 17.9922 2.19531L2.17969 18.0078L0.726562 25.2734L7.99219 23.8203L23.8047 8.00781C25.4336 6.38281 25.4336 3.82031 23.8047 2.19531C22.9922 1.37891 21.9492 0.972656 20.8984 0.972656ZM20.8984 2.875C21.4023 2.875 21.9063 3.12109 22.3945 3.60547C23.3672 4.58203 23.3672 5.62109 22.3945 6.59375L21.6992 7.28516L18.7148 4.30078L19.4062 3.60938C19.8945 3.12109 20.3984 2.87891 20.9023 2.87891L20.8984 2.875ZM17.3008 5.71484L20.2852 8.69922L8.17578 20.8125C7.51953 19.5195 6.48047 18.4805 5.19141 17.8242L17.3008 5.71484ZM3.90625 19.5742C5.07031 20.0664 5.9375 20.9297 6.42578 22.0938L3.27344 22.7266L3.90625 19.5742Z"/>
                                    </svg>
                                </label>
                            </div>
                        </div>
                        <div class="section__item-name-container item-name edit-text-container">
                            <span class="section__item-name text-editable name-category-${response['id_category']}">${response['name_category']}</span>
                            <input type="text" class="section__item-name input-edit hidden" data-request="categoryName" 
                            data-item-id="${response['id_category']}" value="${response['name_category']}">
                            <button class="edit-button edit-button-text edit-button-category-name">
                                <svg class="edit-icon" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M20.8984 0.972656C19.8516 0.972656 18.8047 1.37891 17.9922 2.19531L2.17969 18.0078L0.726562 25.2734L7.99219 23.8203L23.8047 8.00781C25.4336 6.38281 25.4336 3.82031 23.8047 2.19531C22.9922 1.37891 21.9492 0.972656 20.8984 0.972656ZM20.8984 2.875C21.4023 2.875 21.9063 3.12109 22.3945 3.60547C23.3672 4.58203 23.3672 5.62109 22.3945 6.59375L21.6992 7.28516L18.7148 4.30078L19.4062 3.60938C19.8945 3.12109 20.3984 2.87891 20.9023 2.87891L20.8984 2.875ZM17.3008 5.71484L20.2852 8.69922L8.17578 20.8125C7.51953 19.5195 6.48047 18.4805 5.19141 17.8242L17.3008 5.71484ZM3.90625 19.5742C5.07031 20.0664 5.9375 20.9297 6.42578 22.0938L3.27344 22.7266L3.90625 19.5742Z"></path>
                                </svg>
                            </button>
                            <div class="section__buttons">
                                <button class="section__button button-save hidden">Сохранить</button>
                                <button class="section__button button-cancel hidden">Отмена</button>
                            </div>
                        </div>
                        <button class="section__button-arrow categories__item button-delete-category" id="${response['id_category']}">Удалить</button>`
            );
            const listItem = formAddCategory.parentNode.querySelector('.categories__list');
            listItem.append(newItem);
            newItem.querySelector('input.edit-image').addEventListener('change', editFile);
            newItem.querySelector('input.input-edit').addEventListener('input', inputEdited);
            categoriesList.push(newItem);
            const buttonDelete = newItem.querySelector('button.button-delete-category');
            buttonDelete.addEventListener('click', deleteCategory.bind(event, buttonDelete));

            newItem = createElement(
                'li',
                `section__item subcategories__item category-${response['id_category']}`
            );
            newItem.insertAdjacentHTML(
                'afterbegin',
                `<div class="section__item-top">
                        <h2 class="section__item-title name-category-${response['id_category']}">${response['name_category']}</h2>
                        <button class="section__button-arrow button-arrow-down show-subcategories-in-category">
                            <img src="img/arrow_down.png" alt="arrow down">
                        </button>
                    </div>
                    <div class="section__item-content list-subcategories-in-category list-content hidden">
                        <button class="section__button button-save-order save-order-subcategories hidden" data-request="saveOrderSubcategories">Сохранить</button>
                        <button class="section__button button-edit-order edit-order-subcategories" disabled>Изменить порядок</button>
                        <ul class="section__sub-list"></ul>
                        <form class="section__item section__sub-item subcategories__form" id="${response['id_category']}">
                            <input type="text" class="section__input input-name-subcategory" placeholder="Название" required>
                            <input type="text" class="section__input input-title-subcategory" placeholder="Заголовок" required>
                            <div class="upload-file__wrapper">
                                <input type="file" name="files" id="new-subcategory-${response['id_category']}" class="upload-file__input input-banner-subcategory" required>
                                <label class="upload-file__label" for="new-subcategory-${response['id_category']}">
                                    <svg class="upload-file__icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                                        <path
                                                d="M286 384h-80c-14.2 1-23-10.7-24-24V192h-87.7c-17.8 0-26.7-21.5-14.1-34.1L242.3 5.7c7.5-7.5 19.8-7.5 27.3 0l152.2 152.2c11.6 11.6 3.7 33.1-13.1 34.1H320v168c0 13.3-10.7 24-24 24zm216-8v112c0 13.3-10.7 24-24 24H24c-13.3 0-24-10.7-23-23V366c0-13.3 10.7-24 24-24h136v8c0 31 24.3 56 56 56h80c30.9 0 55-26.1 57-55v-8h135c13.3 0 24 10.6 24 24zm-124 88c0-11-9-20-19-20s-19 9-20 20 9 19 20 20 21-9 20-20zm64 0c0-12-9-20-20-20s-20 9-19 20 9 20 20 20 21-9 20-20z">
                                        </path>
                                    </svg>
                                    <span class="upload-file__text">Баннер подкатегории</span>
                                </label>
                            </div>
                            <button class="section__button-arrow button-add-subcategory">Добавить</button>
                            <div class="subcategories-tags">
                                <ul class="subcategories-tags__list" style="margin-right: 10px;"></ul>
                                <div class="input-tags-wrapper">
                                    <input type="text" class="subcategories-tags__input" placeholder="Теги">
                                </div>
                            </div>
                        </form>
                    </div>`
            );
            const categoryList = subcategoriesContent.querySelector('.subcategories__list');
            categoryList.append(newItem);
            const subcategoryList = newItem.querySelector('.list-subcategories-in-category');
            const buttonShowList = newItem.querySelector('.show-subcategories-in-category');
            showFilaNameUpload(newItem.querySelector('.upload-file__wrapper'));
            buttonShowList.addEventListener('click', () => {
                toggleList(subcategoryList, buttonShowList);
            });
            alert(`Категория "${response['name_category']}" успешно добавлена.`);
            clearInput(inputIconCategory, 'Загрузить иконку категории');
            buttonsDeleteCategory = document.querySelectorAll('.button-delete-category');
        }
    }).catch(e => console.log(e));
});

// УДАЛЕНИЕ ПОДКАТЕГОРИИ
buttonsDeleteSubcategory.forEach(item => {
    item.addEventListener('click', deleteSubcategory.bind(event, item));
});

function addSubcategory() {
    event.preventDefault();
    const inputNameSubcategory = this.querySelector('.input-name-subcategory');
    const inputTitleSubcategory = this.querySelector('.input-title-subcategory');
    const inputBannerSubcategory = this.querySelector('.input-banner-subcategory');
    const idCategory = this.id;
    let listTags = [];
    this.querySelectorAll('.category span').forEach(elem => {
        listTags.push(elem.textContent.replace(',', ''));
    });
    console.log(listTags);
    ajaxRequest('POST', {
        'insert': true,
        'category': 'subcat',
        'name': inputNameSubcategory.value,
        'title': inputTitleSubcategory.value,
        'banner': inputBannerSubcategory.files[0],
        'idCat': idCategory,
        'tags': listTags
    }).then((response) => {
        console.log(response);
        if (typeof response == 'string') {
            if (response.startsWith('Error:')) {
                response = response.replace('Error:', '');
            }
            alert(response);
        } else {
            let tags = '';
            response['tags'].forEach(item => {
                tags += `<li class="subcategories-tags__item category">
                            <span>${item['name_tag']}</span>
                            <button class="subcategories-tags-item__button-delete button-tag-delete" id-tag="${item['id_tag']}">
                                <svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" focusable="false" class="style-scope tp-yt-iron-icon" style="pointer-events: none; display: block; width: 100%; height: 100%;"><g class="style-scope tp-yt-iron-icon"><path d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z" class="style-scope tp-yt-iron-icon"></path></g></svg>
                            </button>
                        </li>`
            });
            const newItem = createElement('li', 'section__item subcategory item-edit-order');
            newItem.insertAdjacentHTML(
                'afterbegin',
                `<div class="section__item-name-container item-name edit-text-container">
                        <span class="section__item-name text-editable">${response['name_subcategory']}</span>
                        <input type="text" class="section__item-name input-edit hidden" data-request="subcategoryName" data-item-id="${response['id_subcategory']}" value="${response['name_subcategory']}">
                        <button class="edit-button edit-button-text edit-button-subcategory-name">
                            <svg class="edit-icon" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M20.8984 0.972656C19.8516 0.972656 18.8047 1.37891 17.9922 2.19531L2.17969 18.0078L0.726562 25.2734L7.99219 23.8203L23.8047 8.00781C25.4336 6.38281 25.4336 3.82031 23.8047 2.19531C22.9922 1.37891 21.9492 0.972656 20.8984 0.972656ZM20.8984 2.875C21.4023 2.875 21.9063 3.12109 22.3945 3.60547C23.3672 4.58203 23.3672 5.62109 22.3945 6.59375L21.6992 7.28516L18.7148 4.30078L19.4062 3.60938C19.8945 3.12109 20.3984 2.87891 20.9023 2.87891L20.8984 2.875ZM17.3008 5.71484L20.2852 8.69922L8.17578 20.8125C7.51953 19.5195 6.48047 18.4805 5.19141 17.8242L17.3008 5.71484ZM3.90625 19.5742C5.07031 20.0664 5.9375 20.9297 6.42578 22.0938L3.27344 22.7266L3.90625 19.5742Z"></path>
                            </svg>
                        </button>
                        <div class="section__buttons">
                            <button class="section__button button-save hidden">Сохранить</button>
                            <button class="section__button button-cancel hidden">Отмена</button>
                        </div>
                    </div>
                    <div class="subcategory__banner">
                        <div class="section__item-name-container edit-text-container">
                            <span class="section__item-banner-title text-editable">${response['page_banner_title']}</span>
                            <input type="text" class="section__item-name input-edit hidden" data-request="subcategoryTitle" data-item-id="${response['id_subcategory']}" value="${response['page_banner_title']}">
                            <button class="edit-button edit-button-text edit-button-subcategory-name">
                                <svg class="edit-icon" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M20.8984 0.972656C19.8516 0.972656 18.8047 1.37891 17.9922 2.19531L2.17969 18.0078L0.726562 25.2734L7.99219 23.8203L23.8047 8.00781C25.4336 6.38281 25.4336 3.82031 23.8047 2.19531C22.9922 1.37891 21.9492 0.972656 20.8984 0.972656ZM20.8984 2.875C21.4023 2.875 21.9063 3.12109 22.3945 3.60547C23.3672 4.58203 23.3672 5.62109 22.3945 6.59375L21.6992 7.28516L18.7148 4.30078L19.4062 3.60938C19.8945 3.12109 20.3984 2.87891 20.9023 2.87891L20.8984 2.875ZM17.3008 5.71484L20.2852 8.69922L8.17578 20.8125C7.51953 19.5195 6.48047 18.4805 5.19141 17.8242L17.3008 5.71484ZM3.90625 19.5742C5.07031 20.0664 5.9375 20.9297 6.42578 22.0938L3.27344 22.7266L3.90625 19.5742Z"></path>
                                </svg>
                            </button>
                            <div class="section__buttons">
                                <button class="section__button button-save hidden">Сохранить</button>
                                <button class="section__button button-cancel hidden">Отмена</button>
                            </div>
                        </div>
                        <div class="subcategory__banner-image image-wrapper">
                            <img class="image-load" src="https://i.gifer.com/origin/b4/b4d657e7ef262b88eb5f7ac021edda87_w200.webp" alt="" style="display: none;">
                            <img class="subcategory__banner-file file-image" src="../img/banners/${response['banner_file_name']}" alt="">
                            <label class="subcategory__banner-edit-button edit-button
" for="edit-banner-subcategory${response['id_subcategory']}">
                                <input type="file" data-type-request="editBannerSubcategory" data-item-id="${response['id_subcategory']}" class="edit-image edit-banner-subcategory" id="edit-banner-subcategory${response['id_subcategory']}" style="width: 1px; height: 1px;">
                                <svg class="edit-icon" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M20.8984 0.972656C19.8516 0.972656 18.8047 1.37891 17.9922 2.19531L2.17969 18.0078L0.726562 25.2734L7.99219 23.8203L23.8047 8.00781C25.4336 6.38281 25.4336 3.82031 23.8047 2.19531C22.9922 1.37891 21.9492 0.972656 20.8984 0.972656ZM20.8984 2.875C21.4023 2.875 21.9063 3.12109 22.3945 3.60547C23.3672 4.58203 23.3672 5.62109 22.3945 6.59375L21.6992 7.28516L18.7148 4.30078L19.4062 3.60938C19.8945 3.12109 20.3984 2.87891 20.9023 2.87891L20.8984 2.875ZM17.3008 5.71484L20.2852 8.69922L8.17578 20.8125C7.51953 19.5195 6.48047 18.4805 5.19141 17.8242L17.3008 5.71484ZM3.90625 19.5742C5.07031 20.0664 5.9375 20.9297 6.42578 22.0938L3.27344 22.7266L3.90625 19.5742Z"></path>
                                </svg>
                            </label>
                        </div>
                    </div>
                    
                    <div class="subcategories-tags">
                        <ul class="subcategories-tags__list" style="margin-right: 10px">
                            ${tags}
                        </ul>
                        <div class="input-tags-wrapper">
                            <input type="text" class="subcategories-tags__input subcategory__tags-input" placeholder="Теги">
                        </div>
                    </div>
                <button class="section__button-arrow category__item button-delete-subcategory"
                id="${response['id_subcategory']}">Удалить</button>`
            );
            let listItem = this.parentNode.querySelector('.section__sub-list');
            if (!listItem) {
                listItem = createElement('ul', 'section__sub-list');
                this.parentNode.insertBefore(listItem, this);
            }
            listItem.append(newItem);
            if (listItem.childElementCount > 1) {
                listItem.parentElement.querySelector('.button-edit-order').removeAttribute('disabled');
            }
            const buttonDeleteSubcat = newItem.querySelector('.button-delete-subcategory');
            buttonDeleteSubcat.addEventListener('click', deleteCategory.bind(event, buttonDeleteSubcat));
            document.querySelector('ul.section__list.reviews__list').insertAdjacentHTML(
                'afterbegin',
                `<li class="section__item">
                        <div class="section__item-top">
                            <h2 class="section__item-name">${response['name_subcategory']}</h2>
                            <button class="section__button-arrow button-arrow-down show-reviews-subcategory">
                                <img src="img/arrow_down.png" alt="arrow down">
                            </button>
                        </div>
                        <div class="section__item-content list-reviews list-content hidden">
                            <button class="section__button button-save-order save-order-reviews hidden" data-request="saveOrderReviews">Сохранить</button>
                            <button class="section__button button-edit-order edit-order-reviews" disabled="">Изменить порядок</button>
                            <div class="section__subcategory-reviews-content subcategory-${response['id_subcategory']} list-order-editable">
                                <span>0 отзывов</span>
                            </div>
                            <form class="reviews__form" enctype="multipart/form-data" id="subcategory-${response['id_subcategory']}">
                                <div class="upload-file__wrapper">
                                    <input type="file" name="files" id="new-reviews-subcategory-${response['id_subcategory']}" class="section__input upload-file__input" multiple="" required="">
                                    <label class="upload-file__label" for="new-reviews-subcategory-${response['id_subcategory']}">
                                        <svg class="upload-file__icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                                            <path d="M286 384h-80c-14.2 1-23-10.7-24-24V192h-87.7c-17.8 0-26.7-21.5-14.1-34.1L242.3 5.7c7.5-7.5 19.8-7.5 27.3 0l152.2 152.2c11.6 11.6 3.7 33.1-13.1 34.1H320v168c0 13.3-10.7 24-24 24zm216-8v112c0 13.3-10.7 24-24 24H24c-13.3 0-24-10.7-23-23V366c0-13.3 10.7-24 24-24h136v8c0 31 24.3 56 56 56h80c30.9 0 55-26.1 57-55v-8h135c13.3 0 24 10.6 24 24zm-124 88c0-11-9-20-19-20s-19 9-20 20 9 19 20 20 21-9 20-20zm64 0c0-12-9-20-20-20s-20 9-19 20 9 20 20 20 21-9 20-20z"></path>
                                        </svg>
                                        <span class="upload-file__text">Загрузить отзывы</span>
                                    </label>
                                </div>
                                <button class="section__button-arrow category__item button-add-reviews">Добавить</button>
                            </form>
                        </div>
                    </li>`
            );
            alert(`Подкатегория "${response['name_subcategory']}" успешно добавлена.`);
            inputNameSubcategory.value = '';
            inputTitleSubcategory.value = '';
            clearInput(inputBannerSubcategory, 'Баннер подкатегории');
            clearInputTags(this);
        }
    }).catch(e => console.log(e));
}

// ДОБАВЛЕНИЕ ПОДКАТЕГОРИИ
formsAddSubcategory.forEach(item => {
    item.addEventListener('submit', addSubcategory);
});

// УДАЛЕНИЕ ТЕГА
// buttonsDeleteTag.forEach(item => {
//     item.addEventListener('click', () => {
//         const nameTag = item.parentNode.children[0].textContent;
//         const deleteTag = confirm(`Удалить тег "${nameTag}"?`);
//         if (deleteTag) {
//             ajaxRequest('POST', {
//                 'delete': true,
//                 'tagId': item.id,
//                 'category': 'tag'
//             }).then((response) => {
//                 console.log(response);
//                 item.parentNode.remove();
//                 alert(`Тег "${nameTag}" успешно удалён.`);
//             }).catch(e => console.log(e));
//         }
//     });
// });

// ДОБАВЛЕНИЕ ТЕГА
// formAddTag.addEventListener('submit', () => {
//     event.preventDefault();
//     ajaxRequest('POST', {
//         'insert': true,
//         'category': 'tag',
//         'name': inputNameTag.value
//     }).then((response) => {
//         inputNameTag.value = '';
//         const newItem = createElement('li', 'section__item');
//         newItem.insertAdjacentHTML(
//             'afterbegin',
//             `<span class="section__item-name">${response['name_tag']}</span>
//                   <button class="section__button-arrow category__item button-delete-category"
//                    id="${response['id_tag']}">Удалить</button>`
//         );
//         formAddTag.parentNode.insertBefore(newItem, formAddTag);
//         getTags();
//         alert(`Тег "${response['name_tag']}" успешно добавлен.`);
//     }).catch(e => console.log(e));
// });

// УДАЛЕНИЕ ОТЗЫВОВ
buttonsDeleteReview.forEach(item => {
    item.addEventListener('click', () => {
        deleteReview(item);
    })
});

function addReview() {
    event.preventDefault();
    const input = this.querySelector('.section__input');
    const files = input.files;
    const idSubcat = Number(this.id.replace('subcategory-', ''));
    // console.log(item.id.replace('subcategory-'));
    let data = {
        'insert': true,
        'category': 'reviews',
        'idSubcat': idSubcat,
    };
    for (let i = 0; i < files.length; i++) {
        data['file' + i] = files[i];
    }
    ajaxRequest('POST', data).then((response) => {
        if (!response['error']) {
            const newReviewsFiles = response['newFiles'];
            const idSubcat = newReviewsFiles[0]['idSubcat'];
            const container = document.querySelector(`.subcategory-${idSubcat}`);
            if (container.querySelector('span')) {
                container.innerHTML = '';
            }
            newReviewsFiles.forEach(elem => {
                const newReview = createElement('div', 'review-card');
                const imgReview = createElement('img', 'review-card__image');
                imgReview.src = `../img/screens/${elem['fileName']}`;
                imgReview.setAttribute('alt', 'review screen');
                const buttonDelete = createElement('button', 'review-card__button-delete button-delete button-delete-review');
                buttonDelete.setAttribute('id-review', elem['reviewId']);
                buttonDelete.setAttribute('file-review', elem['fileName']);
                newReview.append(imgReview);
                newReview.append(buttonDelete);
                container.append(newReview);
                masonryGrid(container, 1160, 560);
                console.log(buttonDelete);
                buttonDelete.addEventListener('click', () => {
                    deleteReview(buttonDelete);
                });
            });
            alert(response['message']);
            clearInput(input, 'Загрузить отзывы');
        } else {
            alert(response['error']);
        }
    }).catch(e => console.log(e));
}

// ДОБАВЛЕНИЕ ОТЗЫВОВ
formsAddReviews.forEach(item => {
    item.addEventListener('submit', () => {
        addReview();
    })
});


// ПОКАЗ И СКРЫТИЕ КАТЕГОРИЙ
buttonShowCategories.addEventListener('click', () => {
    toggleList(categoriesContent, buttonShowCategories);
});

// ПОКАЗ И СКРЫТИЕ КАТЕГОРИЙ В ПОДКАТЕГОРИЯХ
buttonShowSubcategories.addEventListener('click', () => {
    toggleList(subcategoriesContent, buttonShowSubcategories);
});

// ПОКАЗ И СКРЫТИЕ ТЕГОВ
// buttonShowTags.addEventListener('click', () => {
//     toggleList(tagsContent, buttonShowTags);
// });

// ПОКАЗ И СКРЫТИЕ ПОДКАТЕГОРИЙ В СЕКЦИИ ОТЗЫВОВ
buttonShowReviews.addEventListener('click', () => {
    toggleList(reviewsContent, buttonShowReviews);
});

// ПОКАЗ И СКРЫТИЕ ПОДКАТЕГОРИЙ
for (let i = 0; i < buttonsShowSubcatInCat.length; i++) {
    buttonsShowSubcatInCat[i].addEventListener('click', () => {
        toggleList(listsSubcatInCat[i], buttonsShowSubcatInCat[i]);
        // let allSubcatHidden = true;
        // listsSubcatInCat.forEach(item => {
        //     console.log(item);
        //     if (!item.classList.contains('hidden')) {
        //         buttonEditOrderSubcat.style.display = 'none';
        //         allSubcatHidden = false;
        //     }
        // });
        // if (allSubcatHidden) {
        //     buttonEditOrderSubcat.style.display = 'block';
        // }
    });
}

// ПОКАЗ И СКРЫТИЕ ОТЗЫВОВ ПОДКАТЕГОРИЙ
for (let i = 0; i < buttonsShowReviews.length; i++) {
    buttonsShowReviews[i].addEventListener('click', () => {
        toggleList(listsReviews[i], buttonsShowReviews[i]);
        let grids = document.querySelectorAll('.section__subcategory-reviews-content');
        if (grids[i].querySelectorAll('.item-edit-order').length !== 0) {
            masonryGrid(grids[i], 1100, 500);
        }
    });
}

function showFilaNameUpload(item) {
    const inputFile = item.querySelector(".upload-file__input");
    let textSelector = item.querySelector(".upload-file__text");
    inputFile.addEventListener('change', () => {
        if (inputFile.files.length > 1) {
            let text = inputFile.files.length;
            const lastNumber = inputFile.files.length % 10;
            if ((text > 4 && text < 20) || (lastNumber > 4 || lastNumber === 0)) {
                text = `${text} файлов`;
            } else if (lastNumber > 1) {
                text = `${text} файла`;
            } else {
                text = `${text} файл`;
            }
            textSelector.textContent = text;
        } else {
            textSelector.textContent = inputFile.files[0].name;
        }
    });
}

// ПОКАЗ ИМЕНИ ВЫБРАННОГО ФАЙЛА, ПОСЛЕ ВЫБОРА ФАЙЛА В ПОЛЕ
inputsFile.forEach(item => {
    showFilaNameUpload(item);
});

getTags();
setTimeout(() => {
    createListTagsInput();
}, 2000);

function addTagInList(input, data=false, event=false) {
    let idTag = '';
    if (data) {
        idTag = data['data']['id_tag'];
    }
    const newTag = createElement('li', 'subcategories-tags__item category');
    newTag.innerHTML =
        `<span>${input.value}</span>
        <button class="subcategories-tags-item__button-delete" id-tag="${idTag}">
            <svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" focusable="false" class="style-scope tp-yt-iron-icon" style="pointer-events: none; display: block; width: 100%; height: 100%;"><g class="style-scope tp-yt-iron-icon"><path d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z" class="style-scope tp-yt-iron-icon"></path></g></svg>
        </button>`;
    const listTag = input.closest('.subcategories-tags').querySelector('.subcategories-tags__list');
    listTag.append(newTag);
    const buttonDeleteTag = newTag.querySelector('.subcategories-tags-item__button-delete');
    buttonDeleteTag.addEventListener('click', () => {
        deleteTagFromList(newTag);
    });
    input.value = '';
}

function addTagInSubcategory() {
    ajaxRequest('POST', {
        'request': 'add_tag',
        'subcategoryId': this.closest('.section__item.subcategory').getAttribute('id-subcategory'),
        'tagName': this.value
    }).then((response) => {
        if (response['error']) {
            alert(response['error']);
        } else {
            addTagInList(this, response);
        }
    }).catch(e => {
        console.log(e);
        alert(`Непредвиденная ошибка!`);
    });
}

// ДОБАВЛЕНИЕ ТЕГА В ПОДКАТЕГОРИЮ
inputTagsForSubcategory.forEach(item => {
    // item.addEventListener('input', () => {
    //     // console.log(item.value.toLowerCase());
    //     // tags.forEach(tag => {
    //     //     console.log(tag['name_tag']);
    //     //     console.log(tag['name_tag'].toLowerCase().startsWith(item.value.toLowerCase()))
    //     // });
    //     let listTags = tags.filter(
    //         tag => tag['name_tag']
    //             .toLowerCase()
    //             .startsWith(
    //                 item.value.toLowerCase()
    //             )
    //     ).sort(byField('name_tag'));
    //     renderListTagsInput(item.parentElement.querySelector('.dropdown-list-tags'), listTags);
    //     // listTags.forEach(item => {
    //     //     console.log(item['name_tag']);
    //     // });
    // });
    // item.addEventListener('focus', () => {
    //     item.parentElement.querySelector('.dropdown-list-tags').style.display = 'block';
    // });
    // item.addEventListener('focusout', () => {
    //     console.log(item.value);
    // });
    item.addEventListener('change', addTagInSubcategory);
});

inputTagsForm.forEach(item => {
    item.addEventListener('change', addTagInList.bind(false, item, null));
});


// КНОПКИ ИЗМЕНЕНИЯ КАРТИНОК
buttonsEditImage.forEach(item => {
    item.addEventListener('change', editFile);
});


// КНОПКИ УДАЛЕНИЯ ТЕГОВ ПОДКАТЕГОРИЙ
buttonsDeleteTag.forEach(item => {
    item.addEventListener('click', () => {
        deleteTag(item);
    })
});

// КНОПКИ ИЗМЕНЕНИЯ ПОРЯДКА ПОДКАТЕГОРИЙ
// buttonsEditOrderSubcat.forEach(elem => {
//     elem.addEventListener('click', () => {
//         if (elem.textContent === 'Изменить порядок') {
//             elem.textContent = 'Отмена';
//             document.querySelectorAll('.subcategories__item').forEach(item => {
//                 item.classList.add('drag-and-drop');
//                 item.setAttribute('draggable', 'true');
//                 item.addEventListener('dragstart', dragStart);
//                 item.addEventListener('dragend', dragEnd);
//                 item.addEventListener('dragenter', dragEnter);
//                 item.addEventListener('dragleave', dragLeave);
//             });
//         } else {
//             elem.textContent = 'Изменить порядок';
//             document.querySelectorAll('.subcategories__item').forEach(item => {
//                 item.classList.remove('drag-and-drop');
//                 item.removeAttribute('draggable');
//                 item.removeEventListener('dragstart', dragStart);
//                 item.removeEventListener('dragend', dragEnd);
//             });
//         }
//     });
// });

// editOrder(buttonEditOrderCategories, categoriesList);
// buttonsEditOrderSubcat.forEach(item => {
//     editOrder(item, item.parentElement.querySelectorAll('.section__sub-list .section__item'));
// });
// buttonsEditOrderReviews.forEach(item => {
//     editOrder(item, item.parentElement.querySelectorAll('.review-card'));
// });



function cancelAllEditText() {
    const containers = document.querySelectorAll('.edit-text-container');
    containers.forEach(item => {
        editTextOff(item);
    });
}

function inputEdited() {
    const container = this.parentElement;
    if (container.querySelector('.section__item-name').textContent !==
        this.value) {
        container.querySelector('.button-save').classList.remove('hidden');
    } else {
        container.querySelector('.button-save').classList.add('hidden');
    }
}

[listCategories, listSubcategories].forEach(item => {
    item.addEventListener('click', (event) => {
        console.log(event.target);
        if (event.target.tagName === 'path' || event.target.tagName === 'svg') {
            if (event.target.closest('.edit-button-text')) {
                cancelAllEditText();
                editText(event.target.closest('.edit-text-container'));
            }
        } else if (event.target.classList.contains('button-cancel')) {
            editTextOff(event.target.closest('.edit-text-container'));
        } else if (event.target.classList.contains('button-save')) {
            const container = event.target.closest('.section__buttons').parentElement;
            const inputText = container.querySelector('input.input-edit');
            const newText = inputText.value;
            const dataRequest = inputText.dataset.request;
            const itemId = inputText.dataset.itemId;
            ajaxRequest('POST', {
                'request': 'editText',
                'type': dataRequest,
                'idItem': itemId,
                'newText': newText
            }).then((response) => {
                if (checkErrorResponse(response)) {
                    // container.querySelector('.text-editable').textContent = newText;
                    editTextOff(container);
                    if (dataRequest === 'categoryName') {
                        document.querySelectorAll(`.name-category-${itemId}`).forEach(elem => {
                            elem.textContent = newText;
                        });
                    }
                }
            }).catch(e => console.log(e));
        }
    });
});

function editOrderOn(button) {
    button.textContent = 'Отмена';
    const list = button.parentElement.querySelector('.list-order-editable');
    const items = Array.from(list.children);
    let itemsOrder = getOrderList(items);
    console.log('Порядок');
    console.log(itemsOrder);
    items.forEach(item => {
        item.classList.add('drag-and-drop');
        item.setAttribute('draggable', 'true');
        item.addEventListener('dragstart', dragStart);
        item.addEventListener('dragend', dragEnd);
        item.addEventListener('dragenter', dragEnter);
        item.addEventListener('dragleave', dragLeave);
        item.addEventListener('dragover', dragOver);
        item.addEventListener('drop', dragDrop.bind(event, itemsOrder));
    });
}

function editOrderOff(button, reset=false) {
    button.parentElement.querySelector('.button-edit-order').textContent = 'Изменить порядок';
    button.parentElement.querySelector('.button-save-order').classList.add('hidden');
    const list = button.parentElement.querySelector('.list-order-editable');
    const items = Array.from(list.children);
    items.forEach(item => {
        item.classList.remove('drag-and-drop');
        item.removeAttribute('draggable');
        item.removeEventListener('dragstart', dragStart);
        item.removeEventListener('dragend', dragEnd);
        item.removeEventListener('dragenter', dragEnter);
        item.removeEventListener('dragleave', dragLeave);
        item.removeEventListener('dragover', dragOver);
        item.removeEventListener('drop', dragDrop);
    });
    if (reset) resetOrder(items);
}

sectionsContents.forEach(item => {
    item.addEventListener('click', (event) => {
        if (event.target.classList.contains('button-edit-order')) {
            const button = event.target;
            if (button.textContent === 'Изменить порядок') {
                editOrderOn(event.target);
            } else {
                editOrderOff(event.target, true);
            }
        } else if (event.target.classList.contains('button-save-order')) {
            const buttonSave = event.target;
            const requestData = buttonSave.dataset.request;
            const listItem = buttonSave.parentElement.querySelectorAll('.item-edit-order');
            ajaxRequest('POST', {
                'request': 'editOrder',
                'type': requestData,
                'itemsId': getListId(buttonSave.parentElement.querySelectorAll('.item-edit-order'))
            }).then((response) => {
                editOrderOff(buttonSave);
                // const listElem = document.querySelectorAll('.categories__list li.section__item');
                // dragAndDropOff(listElem);
                for (let i = 0; i < listItem.length; i++) {
                    listItem[i].setAttribute('position', String(i + 1));
                }
                // event.target.remove();
                // document.querySelector('.section__content .button-edit-order').textContent = 'Изменить порядок';
                alert(response['message']);
            }).catch(e => console.log(e));
        }
    });
});

inputsEdit.forEach(item => {
    item.addEventListener('input', inputEdited)
});