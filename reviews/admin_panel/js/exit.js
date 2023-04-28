const formExit = document.querySelector('.exit__form');

async function exit() {
    let fd = new FormData();
    fd.set('exit', 'true');
    let response = await fetch('./scripts/exit.php', {
        method: 'POST',
        body: fd
    });
    return await response.json();
}

formExit.addEventListener('submit', () => {
    event.preventDefault();
    exit().then((response) => {
        if (response) {
            location.reload();
        }
    }).catch(e => console.log(e));
});