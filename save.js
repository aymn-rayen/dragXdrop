let btn = document.getElementById('btn');
let inp = document.getElementById('inp');
let boxs = document.querySelectorAll('.box');
let drag = null;

// Load saved items on page load
window.onload = function () {
    let savedData = JSON.parse(localStorage.getItem('dragDropData')) || [];
    savedData.forEach((boxData, index) => {
        boxData.forEach(itemText => {
            let p = document.createElement('p');
            p.className = 'item';
            p.draggable = true;
            p.innerText = itemText;
            boxs[index].appendChild(p);
        });
    });
    dragitem();
};

btn.onclick = function () {
    if (inp.value !== '') {
        let p = document.createElement('p');
        p.className = 'item';
        p.draggable = true;
        p.innerText = inp.value;
        boxs[0].appendChild(p);
        inp.value = '';
        dragitem();
        saveData();
    }
};

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
            saveData(); // Save after moving item
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

function saveData() {
    let data = Array.from(boxs).map(box => {
        return Array.from(box.querySelectorAll('.item')).map(item => item.innerText);
    });
    localStorage.setItem('dragDropData', JSON.stringify(data));
}



// Save box titles too
function saveData() {
    let data = {
        items: Array.from(boxs).map(box => {
            return Array.from(box.querySelectorAll('.item')).map(item => item.innerText);
        }),
        titles: Array.from(document.querySelectorAll('.box-title')).map(t => t.innerText)
    };
    localStorage.setItem('dragDropData', JSON.stringify(data));
}

// Load saved items + titles
window.onload = function () {
    let saved = JSON.parse(localStorage.getItem('dragDropData')) || { items: [], titles: [] };
    
    saved.items.forEach((boxData, index) => {
        boxData.forEach(itemText => {
            let p = document.createElement('p');
            p.className = 'item';
            p.draggable = true;
            p.innerText = itemText;
            boxs[index].appendChild(p);
        });
    });

    document.querySelectorAll('.box-title').forEach((title, i) => {
        if (saved.titles[i]) title.innerText = saved.titles[i];
        title.addEventListener('input', saveData);
    });

    dragitem();
};