const hand = document.getElementById("hand");

let deck = [];
let discardPile = [];
let playerTiles = [];

let opponents = [
    { name: "Rakip 1", tiles: [] },
    { name: "Rakip 2", tiles: [] },
    { name: "Rakip 3", tiles: [] }
];

let currentTurn = "player";
let selectedTile = null;
let okeyTile = null;
let gameStarted = false;


// ==========================
// TAŞLAR
// ==========================

const colors = [
    {
        name: "Kırmızı",
        css: "red"
    },
    {
        name: "Sarı",
        css: "yellow"
    },
    {
        name: "Mavi",
        css: "blue"
    },
    {
        name: "Siyah",
        css: "black"
    }
];


// ==========================
// 106 TAŞ OLUŞTUR
// ==========================

function createTiles() {

    const tiles = [];

    for (let copy = 0; copy < 2; copy++) {

        for (const color of colors) {

            for (let number = 1; number <= 13; number++) {

                tiles.push({
                    type: "number",
                    color: color.name,
                    css: color.css,
                    number: number
                });

            }

        }

    }

    // 2 sahte okey
    tiles.push({
        type: "fake",
        color: "Sahte Okey",
        number: 0
    });

    tiles.push({
        type: "fake",
        color: "Sahte Okey",
        number: 0
    });

    return tiles;
}


// ==========================
// KARIŞTIR
// ==========================

function shuffle(array) {

    for (let i = array.length - 1; i > 0; i--) {

        const j = Math.floor(Math.random() * (i + 1));

        [array[i], array[j]] =
        [array[j], array[i]];
    }

    return array;
}


// ==========================
// OKEY BELİRLE
// ==========================

function determineOkey() {

    const index = Math.floor(
        Math.random() * deck.length
    );

    const indicator = deck.splice(index, 1)[0];

    if (indicator.type === "number") {

        let nextNumber =
            indicator.number + 1;

        if (nextNumber > 13) {
            nextNumber = 1;
        }

        okeyTile = {
            color: indicator.color,
            number: nextNumber
        };

    } else {

        okeyTile = {
            color: "Sahte",
            number: 0
        };
    }

    console.log(
        "Gösterge:",
        indicator
    );

    console.log(
        "Okey:",
        okeyTile
    );
}


// ==========================
// YENİ OYUN
// ==========================

function startGame() {

    deck = createTiles();

    shuffle(deck);

    discardPile = [];

    playerTiles = [];

    opponents.forEach(player => {
        player.tiles = [];
    });

    selectedTile = null;

    currentTurn = "player";

    gameStarted = true;

    determineOkey();

    // Sana 21
    for (let i = 0; i < 21; i++) {

        playerTiles.push(
            deck.pop()
        );

    }

    // Rakiplere 21
    opponents.forEach(opponent => {

        for (let i = 0; i < 21; i++) {

            opponent.tiles.push(
                deck.pop()
            );

        }

    });

    sortPlayerTiles();

    createGameInterface();

    showHand();

    updateStatus(
        "Senin sıran. Taş çek."
    );
}


// ==========================
// ARAYÜZ
// ==========================

function createGameInterface() {

    const table =
        document.querySelector(".table");

    // Rakip taşları
    document
        .querySelectorAll(".opponent-hand")
        .forEach(el => el.remove());

    const positions = [
        "top",
        "left",
        "right"
    ];

    positions.forEach((position, index) => {

        const container =
            document.createElement("div");

        container.className =
            "opponent-hand " + position;

        for (
            let i = 0;
            i < opponents[index].tiles.length;
            i++
        ) {

            const tile =
                document.createElement("div");

            tile.className =
                "back-tile";

            container.appendChild(tile);
        }

        table.appendChild(container);
    });


    // Kontroller
    let controls =
        document.querySelector(".controls");

    if (!controls) {

        controls =
            document.createElement("div");

        controls.className = "controls";

        controls.innerHTML = `
            <button id="drawButton">
                Taş Çek
            </button>

            <button id="discardButton">
                Taş At
            </button>
        `;

        table.parentElement.appendChild(
            controls
        );

        document
            .getElementById("drawButton")
            .onclick = drawTile;

        document
            .getElementById("discardButton")
            .onclick = discardSelectedTile;
    }


    let status =
        document.getElementById("status");

    if (!status) {

        status =
            document.createElement("div");

        status.id = "status";

        table.parentElement.appendChild(
            status
        );
    }
}


// ==========================
// TAŞLARI SIRALA
// ==========================

function sortPlayerTiles() {

    const colorOrder = {
        "Kırmızı": 1,
        "Sarı": 2,
        "Mavi": 3,
        "Siyah": 4,
        "Sahte Okey": 5
    };

    playerTiles.sort((a, b) => {

        if (colorOrder[a.color] !==
            colorOrder[b.color]) {

            return colorOrder[a.color] -
                   colorOrder[b.color];
        }

        return a.number - b.number;
    });
}


// ==========================
// ELİ GÖSTER
// ==========================

function showHand() {

    hand.innerHTML = "";

    playerTiles.forEach(
        (tile, index) => {

            const tileElement =
                document.createElement("div");

            tileElement.className =
                "tile";

            // Sahte okey
            if (tile.type === "fake") {

                tileElement.classList.add(
                    "joker"
                );

                tileElement.textContent =
                    "★";

            } else {

                tileElement.classList.add(
                    tile.css
                );

                tileElement.textContent =
                    tile.number;
            }

            tileElement.title =
                tile.color;

            tileElement.onclick = () => {

                selectTile(
                    index,
                    tileElement
                );

            };

            hand.appendChild(
                tileElement
            );
        }
    );
}


// ==========================
// TAŞ SEÇ
// ==========================

function selectTile(
    index,
    element
) {

    if (!gameStarted) {
        return;
    }

    if (currentTurn !== "player") {
        return;
    }

    document
        .querySelectorAll(".tile")
        .forEach(tile => {

            tile.classList.remove(
                "selected"
            );

        });

    element.classList.add(
        "selected"
    );

    selectedTile = index;

    updateStatus(
        "Taş seçildi. Atmak için 'Taş At' butonuna bas."
    );
}


// ==========================
// TAŞ ÇEK
// ==========================

function drawTile() {

    if (!gameStarted) {
        return;
    }

    if (currentTurn !== "player") {
        return;
    }

    if (playerTiles.length >= 22) {

        updateStatus(
            "Önce bir taş atmalısın."
        );

        return;
    }

    if (deck.length === 0) {

        updateStatus(
            "Taş destesi bitti."
        );

        return;
    }

    const tile =
        deck.pop();

    playerTiles.push(tile);

    sortPlayerTiles();

    selectedTile = null;

    showHand();

    updateStatus(
        "Taş çektin. Şimdi bir taş seçip at."
    );
}


// ==========================
// TAŞ AT
// ==========================

function discardSelectedTile() {

    if (!gameStarted) {
        return;
    }

    if (currentTurn !== "player") {
        return;
    }

    if (selectedTile === null) {

        updateStatus(
            "Önce atacağın taşı seç."
        );

        return;
    }

    const tile =
        playerTiles.splice(
            selectedTile,
            1
        )[0];

    discardPile.push(tile);

    selectedTile = null;

    showHand();

    showDiscardedTile(tile);

    updateStatus(
        "Taşı attın. Rakiplerin sırası."
    );

    currentTurn = "opponents";

    setTimeout(
        playOpponents,
        1000
    );
}


// ==========================
// ATILAN TAŞI GÖSTER
// ==========================

function showDiscardedTile(tile) {

    const discard =
        document.querySelector(
            ".discard"
        );

    if (!discard) {
        return;
    }

    discard.className =
        "discard";

    if (tile.type === "fake") {

        discard.textContent =
            "★";

        discard.style.color =
            "#8a00d4";

    } else {

        discard.textContent =
            tile.number;

        discard.classList.add(
            tile.css
        );
    }
}


// ==========================
// RAKİPLER OYNASIN
// ==========================

function playOpponents() {

    opponents.forEach(
        opponent => {

            if (deck.length > 0) {

                opponent.tiles.push(
                    deck.pop()
                );

            }

            if (opponent.tiles.length > 21) {

                const randomIndex =
                    Math.floor(
                        Math.random() *
                        opponent.tiles.length
                    );

                const discarded =
                    opponent.tiles.splice(
                        randomIndex,
                        1
                    )[0];

                discardPile.push(
                    discarded
                );
            }
        }
    );

    updateOpponentHands();

    currentTurn = "player";

    updateStatus(
        "Senin sıran. Taş çek."
    );
}


// ==========================
// RAKİP TAŞLARINI GÜNCELLE
// ==========================

function updateOpponentHands() {

    const hands =
        document.querySelectorAll(
            ".opponent-hand"
        );

    hands.forEach(
        (hand, index) => {

            hand.innerHTML = "";

            opponents[index]
                .tiles
                .forEach(() => {

                    const tile =
                        document.createElement(
                            "div"
                        );

                    tile.className =
                        "back-tile";

                    hand.appendChild(tile);
                });
        }
    );
}


// ==========================
// DURUM MESAJI
// ==========================

function updateStatus(message) {

    const status =
        document.getElementById(
            "status"
        );

    if (status) {

        status.textContent =
            message;
    }
}


// ==========================
// OTOMATİK BAŞLATMA
// ==========================

window.startGame = startGame;
