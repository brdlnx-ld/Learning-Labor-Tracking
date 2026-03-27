
// ==UserScript==
// @name        Learning Labor Tracking
// @version     1.0
// @description Adds Calm Code Buttons into the FCLM Labor Tracking Kiosk. Ben Edition.
// @author      brdlnx
// @match       https://fcmenu-dub-regionalized.corp.amazon.com/*/laborTrackingKiosk
// @match       http://fcmenu-dub-regionalized.corp.amazon.com/*/laborTrackingKiosk
// @updateURL   https://raw.githubusercontent.com/brdlinx/Learning-Labor-Tracking/main/Learning-Labor-Tracking.user.js
// @downloadURL https://raw.githubusercontent.com/brdlinx/Learning-Labor-Tracking/main/Learning-Labor-Tracking.user.js
// ==/UserScript==

var css = document.createElement("style");
css.innerHTML = `
* { box-sizing: border-box; margin: 0; padding: 0; }

#body {
    display: flex;
    flex-flow: column nowrap;
    align-items: stretch;
}

#body > #toolbox {
    display: flex;
    flex-flow: column nowrap;
    gap: 3px;
    padding: 6px 0;
    margin-top: 6px;
    align-items: center;
}

#body > #toolbox > .row {
    width: 280px;
    border-radius: 6px;
    overflow: hidden;
    border: 1px solid rgba(0,0,0,0.15);
}

#body > #toolbox > .row > h1 {
    margin: 0;
    padding: 6px 10px;
    font-weight: bold;
    text-align: center;
    font-size: 12px;
    letter-spacing: 0.5px;
    text-transform: uppercase;
    background: rgba(0,0,0,0.2);
    cursor: pointer;
    user-select: none;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
}

#body > #toolbox > .row > h1::after {
    content: 'v';
    font-size: 9px;
}

#body > #toolbox > .row.open > h1::after {
    content: '^';
}

#body > #toolbox > .row > .roles {
    display: flex;
    flex-flow: column nowrap;
    gap: 2px;
    padding: 0 4px;
    overflow: hidden;
    max-height: 0;
    transition: max-height 0.25s ease, padding 0.25s ease;
}

#body > #toolbox > .row.open > .roles {
    max-height: 300px;
    padding: 4px;
}

#body > #toolbox > .row > .roles > button {
    width: 100%;
    background: rgba(255,255,255,0.45);
    border-radius: 4px;
    border: 1px solid rgba(0,0,0,0.2);
    color: #000;
    font-size: 11px;
    padding: 4px 8px;
    cursor: pointer;
    transition: background-color 0.15s;
    text-align: center;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

#body > #toolbox > .row > .roles > button:hover {
    background: #3cb0fd;
    color: #fff;
}

#ben-corner {
    position: fixed;
    bottom: 12px;
    right: 12px;
    width: 90px;
    height: 90px;
    border-radius: 50%;
    overflow: hidden;
    border: 3px solid #ffc400;
    box-shadow: 0 2px 8px rgba(0,0,0,0.4);
    z-index: 9999;
    cursor: pointer;
}

#ben-corner img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center top;
}

#ben-label {
    position: fixed;
    bottom: 106px;
    right: 12px;
    font-size: 10px;
    font-weight: bold;
    color: #fff;
    background: rgba(0,0,0,0.55);
    padding: 2px 6px;
    border-radius: 4px;
    z-index: 9999;
    text-align: center;
    width: 90px;
}
`;

document.querySelector("head").appendChild(css);

function movebox() {
    let el = document.querySelector('#body > .login');
    if (el) { el.style = ''; } else { setTimeout(movebox, 500); }
}
movebox();


// Ben's corner photo
(function addBen() {
    const benImg = document.createElement('div');
    benImg.id = 'ben-corner';

    const img = document.createElement('img');
    img.src = 'https://i.imgur.com/ItL4ztw.png';
    img.alt = 'Ben';
    benImg.appendChild(img);

    const label = document.createElement('div');
    label.id = 'ben-label';
    label.textContent = 'Ben Approved';

    document.body.appendChild(benImg);
    document.body.appendChild(label);
})();


var codes = [
    {
        title: 'Training',
        color: '#ffc400',
        roles: [
            {name: 'Cross Training', code: 'AMBSMALLS'},
            {name: 'TDR Theory', code: 'SCTDRCLASS'},
            {name: 'PIT Classroom', code: 'SCPITCLASS'},
            {name: 'Recertification', code: 'LOADCLASS'},
        ]
    },
    {
        title: 'Instructor',
        color: '#0578FF',
        roles: [
            {name: 'Instructor Learning', code: 'SCAMBTR'},
            {name: 'Instructor Delivery', code: 'AMBSPLTFACR'},
            {name: 'Instructor Coaching', code: 'SPLTFACRCLASS'},
            {name: 'Crosstrain AA', code: 'SMALLSCLASS'},
        ]
    },
    {
        title: 'New Hires',
        color: '#ffc400',
        roles: [
            {name: 'Onboarding', code: 'TROR'},
            {name: 'D1/D2 Instructor', code: 'PALTBLDCLASS'},
            {name: 'D1/D2 Process Training', code: 'AMBPALTBLD'},
        ]
    },
    {
        title: 'STOP TASK',
        color: '#ff4444',
        roles: [
            {name: 'Master Stop', code: 'MSTOP'},
            {name: 'Indriect Stop', code: 'ISTOP'},
        ]
    },
];


let toolbox = document.createElement('div');
toolbox.id = "toolbox";

let toolboxHTML = '';

for (let i = 0; i < codes.length; i++) {
    const shift = codes[i];

    toolboxHTML += `<div class="row" style="background-color:${shift.color};">
    <h1>${shift.title}</h1>
    <div class="roles">`;

    for (let j = 0; j < shift.roles.length; j++) {
        const role = shift.roles[j];
        toolboxHTML += `<button value="${role.code}" title="${role.code}">${role.name}</button>`;
    }

    toolboxHTML += `</div></div>`;
}

toolbox.innerHTML = toolboxHTML;

document.querySelector('#body').appendChild(toolbox);


// menu open/close
Array.from(document.querySelectorAll('#body > #toolbox > .row > h1')).forEach(header => {
    header.addEventListener('click', () => {
        const row = header.parentElement;
        row.classList.toggle('open');
    });
});


// button press
Array.from(document.querySelectorAll('#body > #toolbox > .row > .roles > button')).forEach(el => {
    el.addEventListener('click', () => {
        document.getElementById('calmCode').value = el.value;
        document.forms[0].submit();
    });
});

