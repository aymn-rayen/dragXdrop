let btn = document.getElementById('btn');
let inp = document.getElementById('inp');
let boxs = document.querySelectorAll('.box');
let drag = null;
let addBoxBtn = document.getElementById('addBoxBtn');

// -------- Save Data --------
function saveData() {
    let data = {
        items: Array.from(document.querySelectorAll('.box')).map(box => {
            return Array.from(box.querySelectorAll('.item-text')).map(span => span.innerText);
        }),
        titles: Array.from(document.querySelectorAll('.box-title')).map(t => t.innerText)
    };
    localStorage.setItem('dragDropData', JSON.stringify(data));
}

// -------- Create Item (with delete button) --------
function createItem(text) {
    let p = document.createElement('p');
    p.className = 'item';
    p.draggable = true;

    // Span to hold text separately
    let span = document.createElement('span');
    span.className = 'item-text';
    span.innerText = text;

    // Delete button
    let delBtn = document.createElement('button');
    delBtn.className = 'delete-item';
    delBtn.innerText = '×';
    delBtn.onclick = function () {
        p.remove();
        saveData();
    };

    p.appendChild(span);
    p.appendChild(delBtn);
    return p;
}

// -------- Load Data --------
window.onload = function () {
    let saved = JSON.parse(localStorage.getItem('dragDropData')) || { items: [], titles: [] };
    let list = document.getElementById('list');
    list.innerHTML = '';

    saved.items.forEach((boxData, index) => {
        let box = createBox(saved.titles[index] || 'Box');
        boxData.forEach(itemText => {
            box.appendChild(createItem(itemText));
        });
        list.appendChild(box);
    });

    if (saved.items.length === 0) {
        for (let i = 0; i < 4; i++) {
            list.appendChild(createBox('Box'));
        }
    }

    boxs = document.querySelectorAll('.box');
    dragitem();
};

// -------- Create Box Function --------
function createBox(titleText) {
    let box = document.createElement('div');
    box.className = 'box';

    // Delete button for box
    let delBtn = document.createElement('button');
    delBtn.className = 'delete-box';
    delBtn.innerText = '×';
    delBtn.onclick = function () {
        box.remove();
        boxs = document.querySelectorAll('.box');
        saveData();
    };

    let title = document.createElement('h2');
    title.className = 'box-title';
    title.contentEditable = 'true';
    title.innerText = titleText;
    title.addEventListener('input', saveData);

    box.appendChild(delBtn);
    box.appendChild(title);
    return box;
}

// -------- Add New Item --------
btn.onclick = function () {
    if (inp.value !== '') {
        let p = createItem(inp.value);
        document.querySelector('.box').appendChild(p);
        inp.value = '';
        dragitem();
        saveData();
    }
};

// -------- Add New Box --------
addBoxBtn.onclick = function () {
    let list = document.getElementById('list');
    list.appendChild(createBox('Box'));
    boxs = document.querySelectorAll('.box');
    dragitem();
    saveData();
};

// -------- Drag & Drop --------
function dragitem() {
    let items = document.querySelectorAll('.item');
    items.forEach(item => {
        item.addEventListener('dragstart', function () {
            drag = item;
            item.style.opacity = '0.5';
        });
        item.addEventListener('dragend', function () {
            drag = null;
            item.style.opacity = '1';
            saveData();
        });
    });

    boxs.forEach(box => {
        box.addEventListener('dragover', function (e) {
            e.preventDefault();
            this.style.background = 'rgba(0, 0, 29, 1)';
            this.style.color = '#fff';
        });
        box.addEventListener('dragleave', function () {
            this.style.background = '#fff';
            this.style.color = '#000';
        });
        box.addEventListener('drop', function () {
            this.append(drag);
            this.style.background = '#fff';
            this.style.color = '#000';
            saveData();
        });
    });
}
