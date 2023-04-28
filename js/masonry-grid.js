function getMinCoord(coordMass) {
    let min = coordMass[0];
    let minIndex = 0;
    for (let i = 0; i < coordMass.length; i++) {
        if (min > coordMass[i]) {
            min = coordMass[i];
            minIndex = i;
        }
    }
    return [min, minIndex];
}

function getMaxCoord(coordMass) {
    let min = coordMass[0];
    for (let i = 0; i < coordMass.length; i++) {
        if (min < coordMass[i]) {
            min = coordMass[i];
        }
    }
    return min;
}

function masonryGrid(elem, desktopWidth, tabletWidth) {
    elem.style.position = 'relative';
    let currentElemTop = 0;
    let widthContainer = elem.clientWidth;
    let lengthRow = 4;
    let rowNumber = 0;
    let coordColumns = [];
    if (widthContainer === desktopWidth) {
        lengthRow = 4;
        coordColumns = [0, 0, 0, 0]
    } else if (widthContainer === tabletWidth) {
        lengthRow = 2;
        coordColumns = [0, 0]
    } else {
        lengthRow = 1;
        coordColumns = [0];
    }

    for (let i = 0; i < elem.children.length; i++) {
        elem.children[i].style.position = 'absolute';
        let min = getMinCoord(coordColumns);
        let minCoord = min[0];
        let minColumn = min[1];
        coordColumns[minColumn] += elem.children[i].clientHeight + (desktopWidth === 1100 ? 20 : 40);
        // currentElemTop = 400 * rowNumber;
        elem.children[i].style.top = `${minCoord + (desktopWidth === 1100 ? 20 : 40)}px`;
        elem.children[i].style.left = `${(desktopWidth === 1100 ? 280 : 300) * minColumn}px`;
        if (i % lengthRow === lengthRow - 1) {
            rowNumber++;
        }
        // currentElemTop += elem.children[i].clientHeight + 40;
        elem.style.height = `${getMaxCoord(coordColumns)}px`;
    }
}

function removeMasonryGrid(elem) {
    elem.style.position = '';
    for (let i = 0; i < elem.children.length; i++) {
        elem.children[i].style.position = '';
        elem.children[i].style.top = '';
        elem.children[i].style.left = '';
        elem.children[i].style.height = '';
    }
    elem.style.height = ``;
}