const formAutorization = document.querySelector('.autorization__form');

async function checkDataForm() {
    let response = await fetch('./scripts/autorization.php', {
        method: 'POST',
        body: new FormData(formAutorization)
    });
    return await response.json();
}

formAutorization.addEventListener('submit', () => {
    event.preventDefault();
    console.log("ffff");
    checkDataForm().then((response) => {
        if (response['error']) {
            alert(response['error']);
        } else {
            console.log(response);
            // const html = response['html'];
            // document.querySelector('.autorization').remove();
            // document.querySelector('.main').insertAdjacentHTML(
            //     'afterbegin',
            //     html);
            location.reload();
        }
    }).catch(e => console.log(e));
});