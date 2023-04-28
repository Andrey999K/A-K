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

const reviewsList = document.querySelector('.reviews__list');


const listCategories = document.querySelector('.categories__list');
const listSubcategories = document.querySelector('.subcategories__list');

const sectionsContents = document.querySelectorAll('.section__content');

const blockEditReview = document.querySelector('.review-edit');
const buttonCloseEditReview = document.querySelector('.review-edit-close');

const saveImageButton = document.querySelector('.review-edit__save-button');
const cancelImageButton = document.querySelector('.review-edit__cancel-button');

const toolbatItem = document.querySelectorAll('.toolbat__item');

const buttonsVideoPlay = document.querySelectorAll('button.video-play');
const videoReview = document.querySelectorAll('.review-card__video');

let selectedTool = 'brush', snapshot, prevMouseX, prevMouseY, imageEdit;

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
    if (listElem.classList.contains('list-reviews')) {
        const videoReviews = listElem.querySelectorAll('.review-card__video');
        videoReviews.forEach(video => {
            video.pause();
            video.currentTime = 0;
            video.parentElement.querySelector('button.video-play').classList.remove('playing');
        });
    }
    cancelAllEditText();
    listElem.classList.toggle('hidden');
    toggleArrow(button);
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
            let grid = buttonReview.closest('.section__subcategory-reviews-content');
            const countReviews = buttonReview.parentElement.parentElement.childElementCount;
            if (countReviews <= 2) {
                grid.closest('.section__item-content').querySelector('.edit-order-reviews').disabled = true;
            }
            if (countReviews === 1) {
                removeMasonryGrid(grid);
                buttonReview.parentElement.parentElement.innerHTML = '<span>0 отзывов</span>';
            } else {
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

// function deleteTagFromList(event, elem = false) {
//     if (elem) {
//         elem.closest('li.subcategories-tags__item.category').remove();
//     } else {
//         this.closest('li.subcategories-tags__item.category').remove();
//     }
//     console.log("Тег удалён из списка");
// }

// УДАЛЕНИЕ ТЕГА
function deleteTag() {
    if (this.getAttribute('id-tag')) {
        ajaxRequest('POST', {
            'delete': true,
            'category': 'tag',
            'subcategoryId': this.closest('.section__item.subcategory').getAttribute('id-subcategory'),
            'tagId': this.getAttribute('id-tag')
        }).then((response) => {
            if (response.startsWith('Error')) {
                alert(response.replace('Error:', ''));
            } else {
                console.log("Тег удалён из базы данных");
            }
        }).catch(e => console.log(e));
    }
    this.removeEventListener('click', deleteTag);
    this.closest('li.subcategories-tags__item.category').remove();
}

// function deleteTag() {
//     // console.log("deleteTag");
//     // const tagElem = this.closest('.subcategories-tags__item.category')
//     // const nameTag = tagElem.querySelector('span').textContent;
//     console.log(this);
//     console.log(this.closest('.section__item.subcategory'));
//     return;
//     // const tagDelete = confirm(`Удалить тег "${nameTag}"?`);
//     // console.log(tagDelete);
//     // if (tagDelete) {
//         ajaxRequest('POST', {
//             'delete': true,
//             'category': 'tag',
//             'subcategoryId': this.closest('.section__item.subcategory').getAttribute('id-subcategory'),
//             'tagId': this.getAttribute('id-tag')
//         }).then((response) => {
//             if (response.startsWith('Error')) {
//                 alert(response.replace('Error:', ''));
//             } else {
//                 console.log("Тег удалён из базы данных");
//                 this.removeEventListener('click', deleteTag);
//                 deleteTagFromList(null, this);
//             }
//         }).catch(e => console.log(e));
//     // }
// }

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

function dragLeave() {
    this.classList.remove('hovered');
}

function dragOver(event) {
    event.preventDefault();
}

function dragDrop(oldOrder, event) {
    const newOrder = getOrderList(Array.from(event.target.closest('.list-order-editable').children));
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
        // masonryGrid(listElement, 1100, 500);
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
function deleteCategory() {
    const nameCategory = this.parentNode.querySelector('.section__item-name').textContent;
    const deleteCategoryConfirm = confirm(`При удалении категории, удалятся все карточки с их отзывами.
Вы действительно хотите удалить категорию "${nameCategory}"?`);
    if (deleteCategoryConfirm) {
        ajaxRequest('POST', {
            'delete': true,
            'catId': this.id,
            'category': 'cat'
        }).then((response) => {
            const categoriesList = this.closest('.categories__list');
            if (categoriesList.childElementCount <= 2) {
                this.closest('.categories__content').querySelector('.button-edit-order').disabled = true;
            }
            if (categoriesList.childElementCount <= 1) {
                categoriesList.classList.add('hidden');
            }
            this.parentNode.remove();
            const deletedSubcategoriesBlocks = document.querySelectorAll(`.category-${this.id}`);
            if (deletedSubcategoriesBlocks) {
                deletedSubcategoriesBlocks.forEach(blockSubcategory => {
                    if (blockSubcategory.querySelector('form.subcategories__form')) {
                        blockSubcategory.querySelector('form.subcategories__form').removeEventListener('submit', addSubcategory);
                    }
                    if (blockSubcategory.parentElement.childElementCount === 1) blockSubcategory.parentElement.classList.add('hidden');
                    blockSubcategory.remove(); // УДАЛЕНИЯ КАРТОЧЕК КАТЕГОРИИ
                });
            }
            if (document.querySelector(`.category-${this.id}`)) {
                document.querySelector(`.category-${this.id}`).remove();
            }
            this.removeEventListener('click', deleteCategory);
            alert(`Категория "${nameCategory}" успешно удалена.`);
        }).catch(e => console.log(e));
    }
}

function deleteSubcategory() {
    const nameSubcategory = this.parentNode.querySelector('span.section__item-name').textContent;
    const deleteSubcategoryConfirm = confirm(`При удалении карточки, удалятся все её отзывы.
Вы действительно хотите удалить карточку "${nameSubcategory}"?`);
    if (deleteSubcategoryConfirm) {
        ajaxRequest('POST', {
            'delete': true,
            'catId': this.id,
            'category': 'subcat'
        }).then((response) => {
            console.log(response);
            const container = this.closest('.section__item-content');
            if (container.querySelector('.section__sub-list').childElementCount <= 2) {
                console.log(container.querySelector('.button-edit-order'));
                container.querySelector('.button-edit-order').disabled = true;
            }
            this.parentNode.remove();
            const idSubcategory = this.id;
            if (document.querySelector(`.subcategory-${idSubcategory}`)) {
                document.querySelector(`.subcategory-${idSubcategory}`).remove();
            }
            const elemSubcategoryInReviews = document.querySelector(`.reviews__content .section__item[subcategory-id="${idSubcategory}"]`);
            if (elemSubcategoryInReviews.parentElement.childElementCount === 1) elemSubcategoryInReviews.parentElement.classList.add('hidden');
            elemSubcategoryInReviews.remove();
            this.removeEventListener('click', deleteSubcategory);
            alert(`Карточка "${nameSubcategory}" успешно удалена.`);
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
    item.addEventListener('click', deleteCategory);
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
            if (listItem.childElementCount > 0) {
                listItem.classList.remove('hidden');
            }
            if (listItem.childElementCount > 1) {
                listItem.closest('.categories__content').querySelector('.button-edit-order').disabled = false;
            }
            newItem.querySelector('input.edit-image').addEventListener('change', editFile);
            newItem.querySelector('input.input-edit').addEventListener('input', inputEdited);
            categoriesList.push(newItem);
            const buttonDelete = newItem.querySelector('button.button-delete-category');
            buttonDelete.addEventListener('click', deleteCategory);

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
                        <ul class="section__sub-list list-order-editable"></ul>
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
                                    <span class="upload-file__text">Баннер карточки</span>
                                </label>
                            </div>
                            <div class="subcategories-tags">
                                <ul class="subcategories-tags__list" style="margin-right: 10px;"></ul>
                                <div class="input-tags-wrapper">
                                    <input type="text" class="subcategories-tags__input" placeholder="Теги">
                                </div>
                            </div>
                            <button class="section__button-arrow button-add-subcategory">Добавить</button>
                        </form>
                    </div>`
            );
            const tagsInput = newItem.querySelector('.subcategories-tags__input');
            tagsInput.addEventListener('change', addTagInList.bind(false, tagsInput, null));
            const formAddSubcategory = newItem.querySelector('form.subcategories__form');
            formAddSubcategory.addEventListener('submit', addSubcategory);
            const categoryList = subcategoriesContent.querySelector('.subcategories__list');
            categoryList.append(newItem);
            if (categoryList.childElementCount !== 0) categoryList.classList.remove('hidden');
            if (categoryList.childElementCount > 1) categoryList.classList.remove('hidden');
            const subcategoryList = newItem.querySelector('.list-subcategories-in-category');
            const buttonShowList = newItem.querySelector('.show-subcategories-in-category');
            showFileNameUpload(newItem.querySelector('.upload-file__wrapper'));
            buttonShowList.addEventListener('click', () => {
                toggleList(subcategoryList, buttonShowList);
            });
            alert(`Категория "${response['name_category']}" успешно добавлена.`);
            clearInput(inputIconCategory, 'Загрузить иконку категории');
            buttonsDeleteCategory = document.querySelectorAll('.button-delete-category');
        }
    }).catch(e => console.log(e));
});

// УДАЛЕНИЕ КАРТОЧКИ
buttonsDeleteSubcategory.forEach(item => {
    item.addEventListener('click', deleteSubcategory);
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
    listTags = listTags.join(',');
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
            newItem.setAttribute('id-subcategory', response['id_subcategory']);
            newItem.setAttribute('item-id', response['id_subcategory']);
            newItem.setAttribute('position', response['position_subcategory']);
            newItem.insertAdjacentHTML(
                'beforeend',
                `<div class="section__item-name-container item-name edit-text-container">
                        <span class="section__item-name text-editable name-subcategory-${response['id_subcategory']}">${response['name_subcategory']}</span>
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
            newItem.querySelector('.subcategory__tags-input').addEventListener('change', addTagInSubcategory);
            newItem.querySelectorAll('.button-tag-delete').forEach(tag => {
                tag.addEventListener('click', deleteTag);
            });
            newItem.querySelector('.edit-banner-subcategory').addEventListener('change', editFile);
            const inputsEdit = newItem.querySelectorAll('.input-edit');
            inputsEdit.forEach(item => {
                item.addEventListener('input', inputEdited)
            });
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
            buttonDeleteSubcat.addEventListener('click', deleteSubcategory);
            let sectionList = document.querySelector('ul.section__list.reviews__list');
            sectionList.insertAdjacentHTML(
                'beforeend',
                `<li class="section__item category-${idCategory}" subcategory-id="${response['id_subcategory']}">
                        <div class="section__item-top">
                            <h2 class="section__item-name name-subcategory-${response['id_subcategory']}">${response['name_subcategory']}</h2>
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
            sectionList.classList.remove('hidden');
            const formReview = sectionList.lastChild.querySelector(`form#subcategory-${response['id_subcategory']}`);
            formReview.addEventListener('submit', addReview);
            showFileNameUpload(sectionList.lastChild.querySelector('.upload-file__wrapper'));
            alert(`Карточка "${response['name_subcategory']}" успешно добавлена.`);
            inputNameSubcategory.value = '';
            inputTitleSubcategory.value = '';
            clearInput(inputBannerSubcategory, 'Баннер карточки');
            clearInputTags(this);
        }
    }).catch(e => console.log(e));
}

// ДОБАВЛЕНИЕ КАРТОЧКИ
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
// buttonsDeleteReview.forEach(item => {
//     item.addEventListener('click', () => {
//         deleteReview(item);
//     })
// });

function addReview() {
    event.preventDefault();
    const input = event.target.querySelector('.section__input');
    const files = input.files;
    const idSubcat = Number(event.target.id.replace('subcategory-', ''));
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
                container.closest('.list-content').querySelector('button.edit-order-reviews').disabled = false;
            }
            newReviewsFiles.forEach(elem => {

                // `<div class="review-card item-edit-order" item-id="23" position="0" style="height: initial">
                //                                                     <img class="review-card__image" src="../img/screens/23.png" alt="review screen" draggable="false">
                //                                                    <button class="review-card-button review-card__button-paint button-paint" data-review-id="23">
                //        <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                //            <path d="M24.322 2.2204C23.4181 1.32823 21.9525 1.32823 21.0494 2.2204L7.62816 15.4705C5.98441 15.4338 3.70939 16.0158 2.72734 19.2322C1.97659 20.9346 0 20.8487 0 20.8487C4.10394 25.4019 8.94071 22.8214 10.0454 21.7026C11.0157 20.719 11.1555 19.5166 11.0516 18.5549L24.322 5.45169C25.226 4.55952 25.226 3.11262 24.322 2.2204ZM8.95395 20.6253C8.18522 21.3385 4.74923 22.9284 2.72734 21.387C2.72734 21.387 3.43125 20.8378 3.96408 19.7354C5.23672 16.3549 8.40862 16.8548 8.40862 16.8548L9.49928 17.9322C9.51022 17.9424 10.3141 19.3643 8.95395 20.6253ZM10.5907 16.8549C10.4899 16.7557 9.50009 15.7775 9.50009 15.7775L11.1368 14.1619L12.2275 15.2392L10.5907 16.8549ZM23.2306 4.37435L13.3181 14.1619L12.2274 13.0846L22.14 3.29779C22.4416 3.00012 22.9298 3.00012 23.2306 3.29779C23.5322 3.59467 23.5322 4.07746 23.2306 4.37435Z"></path>
                //        </svg>
                //    </button>
                //     <button class="review-card-button review-card__button-crop button-crop">
                //         <svg width="30" height="26" viewBox="0 0 30 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                //             <line x1="0.5" y1="3.5" x2="2.66748" y2="3.5" stroke-linecap="round"></line>
                //             <rect x="4.5" y="3.5" width="20" height="18"></rect>
                //             <line x1="4.5" y1="3.58252" x2="4.5" y2="0.499991" stroke-linecap="round"></line>
                //             <line x1="24.5" y1="24.5825" x2="24.5" y2="21.5" stroke-linecap="round"></line>
                //             <line x1="26.5" y1="21.5" x2="28.6675" y2="21.5" stroke-linecap="round"></line>
                //         </svg>
                //     </button>
                //     <button class="review-card-button review-card__button-delete button-delete button-delete-review" id-review="23" file-review="23_">
                //         <svg width="19" height="20" viewBox="0 0 19 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                //             <line x1="0.362976" y1="0.656128" x2="18.363" y2="19.6561"></line>
                //             <line x1="0.637024" y1="19.6561" x2="18.637" y2="0.656128"></line>
                //         </svg>
                //     </button>
                // </div>`
                //
                // const newReview = createElement('div', 'review-card');
                // const imgReview = createElement('img', 'review-card__image');
                // imgReview.src = `../img/screens/${elem['fileName']}`;
                // imgReview.setAttribute('alt', 'review screen');
                // const buttonDelete = createElement('button', 'review-card__button-delete button-delete button-delete-review');
                // buttonDelete.setAttribute('id-review', elem['reviewId']);
                // buttonDelete.setAttribute('file-review', elem['fileName']);
                // newReview.append(imgReview);
                // newReview.append(buttonDelete);
                // container.append(newReview);
                // // removeMasonryGrid(container);
                //
                // if (container.childElementCount >= 2) {
                //     container.closest('.section__item-content').querySelector('.edit-order-reviews').disabled = false;
                // }
                // console.log(buttonDelete);
                // buttonDelete.addEventListener('click', () => {
                //     deleteReview(buttonDelete);
                // });
                // ['mp4',]elem['position'].split('.')[elem['position'].split('.').length - 1]
                container.insertAdjacentHTML("beforeend",
                `<div class="review-card item-edit-order" item-id="${elem['reviewId']}" position="${elem['position']}" style="height: initial; position: absolute;">
                          ${elem['typeReview'] === 'image' ? 
                            `<img class="review-card__image" src="../img/screens/${elem['fileName']}" alt="review screen" draggable="false">
                                <button class="review-card-button review-card__button-paint button-paint" data-review-id="${elem['reviewId']}">
                                  <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                                      <path d="M24.322 2.2204C23.4181 1.32823 21.9525 1.32823 21.0494 2.2204L7.62816 15.4705C5.98441 15.4338 3.70939 16.0158 2.72734 19.2322C1.97659 20.9346 0 20.8487 0 20.8487C4.10394 25.4019 8.94071 22.8214 10.0454 21.7026C11.0157 20.719 11.1555 19.5166 11.0516 18.5549L24.322 5.45169C25.226 4.55952 25.226 3.11262 24.322 2.2204ZM8.95395 20.6253C8.18522 21.3385 4.74923 22.9284 2.72734 21.387C2.72734 21.387 3.43125 20.8378 3.96408 19.7354C5.23672 16.3549 8.40862 16.8548 8.40862 16.8548L9.49928 17.9322C9.51022 17.9424 10.3141 19.3643 8.95395 20.6253ZM10.5907 16.8549C10.4899 16.7557 9.50009 15.7775 9.50009 15.7775L11.1368 14.1619L12.2275 15.2392L10.5907 16.8549ZM23.2306 4.37435L13.3181 14.1619L12.2274 13.0846L22.14 3.29779C22.4416 3.00012 22.9298 3.00012 23.2306 3.29779C23.5322 3.59467 23.5322 4.07746 23.2306 4.37435Z"></path>
                                  </svg>
                              </button>` :
                            `<video class="review-card__video" src="../video/${elem['fileName']}" alt="review video" draggable="false"></video>
                            <button class="video-play">
                                <img src="../img/play-review-icon.svg" alt="play icon" class="video-play__icon">
                            </button>`
                          }
<!--                          <button class="review-card-button review-card__button-crop button-crop">-->
<!--                              <svg width="30" height="26" viewBox="0 0 30 26" fill="none" xmlns="http://www.w3.org/2000/svg">-->
<!--                                  <line x1="0.5" y1="3.5" x2="2.66748" y2="3.5" stroke-linecap="round"></line>-->
<!--                                  <rect x="4.5" y="3.5" width="20" height="18"></rect>-->
<!--                                  <line x1="4.5" y1="3.58252" x2="4.5" y2="0.499991" stroke-linecap="round"></line>-->
<!--                                  <line x1="24.5" y1="24.5825" x2="24.5" y2="21.5" stroke-linecap="round"></line>-->
<!--                                  <line x1="26.5" y1="21.5" x2="28.6675" y2="21.5" stroke-linecap="round"></line>-->
<!--                              </svg>-->
<!--                          </button>-->
                          <button class="review-card-button review-card__button-delete button-delete button-delete-review" id-review="${elem['reviewId']}" file-review="${elem['fileName']}">
                              <svg width="19" height="20" viewBox="0 0 19 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <line x1="0.362976" y1="0.656128" x2="18.363" y2="19.6561"></line>
                                  <line x1="0.637024" y1="19.6561" x2="18.637" y2="0.656128"></line>
                              </svg>
                          </button>
                      </div>`
                );
                if (elem['typeReview'] === 'video') {
                    const newVideoReview = container.lastChild;
                    newVideoReview.querySelector('button.video-play').addEventListener('click', playVideo);
                    newVideoReview.querySelector('video.review-card__video').addEventListener('click', playVideo);
                }
            });
            if (container.lastChild.querySelector('.review-card__image')) {
                container.lastChild.querySelector('.review-card__image').addEventListener('load', reloadGrid);
            } else if (container.lastChild.querySelector('.review-card__video')) {
                reloadGrid(null, container.lastChild.querySelector('.review-card__video'));
                setTimeout(() => {
                    reloadGrid(null, container.lastChild.querySelector('.review-card__video'));
                }, 3000);
            }
            alert(response['message']);
            clearInput(input, 'Загрузить отзывы');
        } else {
            alert(response['error']);
        }
    }).catch(e => console.log(e));
}

// ПЕРЕЗАГРУЗКА СЕТКИ ПОСЛЕ ДОБАВЛЕНИЯ НОВОГО ОТЗЫВА
function reloadGrid(event, elem=false) {
    console.log(elem);
    if (!elem) {
        elem = this;
    }
    masonryGrid(elem.closest('.section__subcategory-reviews-content'), 1100, 500);
    elem.removeEventListener('load', reloadGrid);
}

// ДОБАВЛЕНИЕ ОТЗЫВОВ
formsAddReviews.forEach(item => {
    item.addEventListener('submit', addReview)
});


// ПОКАЗ И СКРЫТИЕ КАТЕГОРИЙ
buttonShowCategories.addEventListener('click', () => {
    toggleList(categoriesContent, buttonShowCategories);
});

// ПОКАЗ И СКРЫТИЕ КАТЕГОРИЙ В КАРТОЧКАХ
buttonShowSubcategories.addEventListener('click', () => {
    toggleList(subcategoriesContent, buttonShowSubcategories);
});

// ПОКАЗ И СКРЫТИЕ ТЕГОВ
// buttonShowTags.addEventListener('click', () => {
//     toggleList(tagsContent, buttonShowTags);
// });

// ПОКАЗ И СКРЫТИЕ КАРТОЧЕК В СЕКЦИИ ОТЗЫВОВ
buttonShowReviews.addEventListener('click', () => {
    toggleList(reviewsContent, buttonShowReviews);
});

// ПОКАЗ И СКРЫТИЕ КАРТОЧЕК
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

// ПОКАЗ И СКРЫТИЕ ОТЗЫВОВ КАРТОЧЕК
// for (let i = 0; i < buttonsShowReviews.length; i++) {
//     buttonsShowReviews[i].addEventListener('click', () => {
//         toggleList(listsReviews[i], buttonsShowReviews[i]);
//         let grids = document.querySelectorAll('.section__subcategory-reviews-content');
//         if (grids[i].querySelectorAll('.item-edit-order').length !== 0) {
//             masonryGrid(grids[i], 1100, 500);
//         }
//     });
// }

function showFileNameUpload(item) {
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
    showFileNameUpload(item);
});

getTags();
setTimeout(() => {
    createListTagsInput();
}, 2000);

function addTagInList(input, data=false, event=false) {
    console.log("addTagInList");
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
    buttonDeleteTag.addEventListener('click', deleteTag);
    input.value = '';
    // return buttonDeleteTag;
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
            const buttonDeleteTag = addTagInList(this, response);
            // buttonDeleteTag.addEventListener('click', deleteTag);
        }
    }).catch(e => {
        console.log(e);
        alert(`Непредвиденная ошибка!`);
    });
}

// ДОБАВЛЕНИЕ ТЕГА В КАРТОЧКУ
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


// КНОПКИ УДАЛЕНИЯ ТЕГОВ КАРТОЧЕК
buttonsDeleteTag.forEach(item => {
    item.addEventListener('click', deleteTag)
});

// КНОПКИ ИЗМЕНЕНИЯ ПОРЯДКА КАРТОЧЕК
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
                    switch (dataRequest) {
                        case 'categoryName':
                            document.querySelectorAll(`.name-category-${itemId}`).forEach(elem => {
                                elem.textContent = newText;
                            });
                            break;
                        case 'subcategoryName':
                            document.querySelectorAll(`.name-subcategory-${itemId}`).forEach(elem => {
                                elem.textContent = newText;
                            });
                            break;
                        case 'subcategoryTitle':
                            container.querySelector('.section__item-banner-title').textContent = newText;
                            break;
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
    if (items.length !== 0) {
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
}

function handler(event) {
    const imageElem = this;
    imageElem.classList.remove('hidden');
    canvas.width = imageElem.clientWidth;
    canvas.height = imageElem.clientHeight;
    imageElem.classList.add('hidden');
    imageEdit = imageElem;
    ctx.drawImage(imageEdit, 0, 0, canvas.width, canvas.height);
    this.removeEventListener(event.type, handler);
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
        } else if (event.target.closest('.button-paint')) {
            blockEditReview.classList.remove('hidden');
            saveImageButton.dataset.reviewId = event.target.closest('.button-paint').dataset.reviewId;
            const image = event.target.closest('.button-paint').parentElement.querySelector('img.review-card__image').src;
            const imageElem = blockEditReview.querySelector('img');
            imageElem.addEventListener('load', handler);
            imageElem.src = image;
        } else if (event.target.closest('.button-delete')) {
            deleteReview(event.target.closest('.button-delete'));
        }
    });
});

reviewsList.addEventListener('click', event => {
   if (event.target.closest('.show-reviews-subcategory')) {
       const sectionItem = event.target.closest('.section__item');
       toggleList(sectionItem.querySelector('.section__item-content'), event.target.closest('.show-reviews-subcategory'));
       if (sectionItem.querySelectorAll('.review-card').length !== 0) {
           masonryGrid(sectionItem.querySelector('.section__subcategory-reviews-content'), 1100, 500);
       }
   }
});

inputsEdit.forEach(item => {
    item.addEventListener('input', inputEdited)
});

buttonCloseEditReview.addEventListener('click', () => {
    blockEditReview.classList.add('hidden');
    cancelСhanges();
});



// ВОЗМОЖНОСТЬ РИСОВАНИЯ НА СКРИНЕ ОТЗЫВА
const canvas = document.querySelector(".review-edit canvas"),
    ctx = canvas.getContext("2d");
let isDrawing = false,
    brushWidth = 5;

const startDraw = (e) => {
    isDrawing = true;
    prevMouseX = e.offsetX;
    prevMouseY = e.offsetY;
    // ctx.fillStyle = document.querySelector('.toolbar__input-color').value;
    ctx.strokeStyle = ctx.fillStyle = document.querySelector('.toolbar__input-color').value;
    ctx.beginPath();
    snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);
    ctx.lineWidth = brushWidth;
    saveImageButton.classList.remove('hidden');
    cancelImageButton.classList.remove('hidden');
};

const drawing = (e) => {
    if (!isDrawing) return;
    ctx.putImageData(snapshot, 0, 0);
    if (selectedTool === 'brush') {
        ctx.lineTo(e.offsetX, e.offsetY);
        ctx.stroke();
    } else if (selectedTool === 'rectangle') {
        ctx.strokeRect(e.offsetX, e.offsetY, prevMouseX - e.offsetX, prevMouseY - e.offsetY);
    } else if (selectedTool === 'rectangleFill') {
        ctx.fillRect(e.offsetX, e.offsetY, prevMouseX - e.offsetX, prevMouseY - e.offsetY);
    } else if (selectedTool.startsWith('circle')) {
        ctx.beginPath();
        let radius = Math.sqrt(Math.pow((prevMouseX - e.offsetX), 2) + Math.pow((prevMouseX - e.offsetY), 2));
        ctx.arc(prevMouseX, prevMouseY, radius, 0, 2 * Math.PI);
        if (selectedTool === 'circle') {
            ctx.stroke();
        } else {
            ctx.fill();
        }
    }
};

function cancelСhanges() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    console.log(imageEdit);
    ctx.drawImage(imageEdit, 0, 0, canvas.width, canvas.height);
    saveImageButton.classList.add('hidden');
    cancelImageButton.classList.add('hidden');
    this.removeEventListener('load', cancelСhanges);
}

function imageReload(image) {
    const imageSrc = image.src;
    image.src = '';
    let path = imageSrc.split('.');
    path.pop();
    path.push('png');
    path = path.join('.');
    setTimeout(() => {
        image.src = path + `?v=${new Date().getTime()}`;
        console.log(path);
    }, 2000);
}

function imageReloadCanvas(image) {
    const imageSrc = image.src;
    image.src = '';
    let path = imageSrc.split('.');
    path.pop();
    path.push('png');
    path = path.join('.');
    image.addEventListener('load', cancelСhanges);
    setTimeout(() => {
        image.src = path + `?v=${new Date().getTime()}`;
        imageEdit = image;
        console.log(path);
    }, 2000);
    // image.addEventListener('load', handler);
    // image.src = imageSrc;
}

canvas.addEventListener("mousedown", startDraw);
canvas.addEventListener("mousemove", drawing);
canvas.addEventListener("mouseup", () => isDrawing = false);

saveImageButton.addEventListener("click", () => {
    const dataURL = canvas.toDataURL();
    ajaxRequest('POST', {
        'request': 'paint',
        'reviewId': saveImageButton.dataset.reviewId,
        'image': dataURL
    }).then((response) => {
        console.log(response);
        const imageReview = document.querySelector(`.review-card[item-id="${response}"] .review-card__image`);
        const canvasImage = document.querySelector('.review-edit img');
        imageReload(imageReview);
        imageReloadCanvas(canvasImage);

        // if (buttonReview.parentElement.parentElement.childElementCount === 1) {
        //     buttonReview.parentElement.parentElement.innerHTML = '<span>0 отзывов</span>'
        // } else {
        //     let grid = buttonReview.closest('.section__subcategory-reviews-content');
        //     buttonReview.parentNode.remove();
        //     masonryGrid(grid, 1100, 500);
        // }
        alert(`Изображение отзыва изменено`);
    }).catch(e => console.log(e));
});

cancelImageButton.addEventListener('click', cancelСhanges);

toolbatItem.forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelector('.toolbat__item.active').classList.remove('active');
        btn.classList.add('active');
        selectedTool = btn.id;
        console.log(selectedTool);
   }) ;
});

// PLAY
function playVideo(event, elem) {
    if (!elem) {
        elem = this;
    }
    const review = elem.closest('.review-card');
    const video = review.querySelector('.review-card__video');
    const button = review.querySelector('button.video-play');
    if (button.classList.contains('playing')) {
        video.pause();
        button.classList.remove('playing');
        video.currentTime = 0;
    } else {
        const allVideo = document.querySelectorAll('video');
        allVideo.forEach(video => {
            video.pause();
            video.currentTime = 0;
            const button = video.parentElement.querySelector('button.video-play');
            if (button.classList.contains('playing')) {
                button.classList.remove('playing');
            }
        });
        video.play();
        button.classList.add('playing')
    }
}

// PAUSE
// function pauseVideo() {
//     video.pause();
//     video.parentElement.children[1].classList.remove('playing')
// }

buttonsVideoPlay.forEach(item => {
   item.addEventListener('click', playVideo);
});

videoReview.forEach(item => {
    item.addEventListener('click', playVideo);
});