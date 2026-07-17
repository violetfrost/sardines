const import_button = document.getElementById("import_button");
const file_input = document.getElementById("finput");
const search = document.getElementById("search");
const card_grid = document.getElementById("card_grid");
const header_text = document.getElementById("header_text");
// TODO see help.js
const help_button = document.getElementById("help_button");

let json = {};
let fuse = null;

function search_cards() {
    const query = search.value.trim();

    if (!fuse) {
        return;
    }

    if (query === "") {
        render_cards(json.cards);
        return;
    }

    const results = fuse.search(query);

    const cards = results.map(result => result.item);

    render_cards(cards);
}

function render_cards(cards) {
    card_grid.innerHTML = "";

    cards.forEach(card => {
        const div = document.createElement("div");
        div.className = "card";

        const title = document.createElement("h1");
        title.textContent = card.title;

        const text = document.createElement("p");
        text.textContent = card.text;

        div.addEventListener("click", async (e) => {
            await navigator.clipboard.writeText(card.text);

            setTimeout(() => {
                div.style.opacity = "1";
            }, 150);
        });

        div.addEventListener("contextmenu", async (e) => {
            e.preventDefault();

            // TODO something to do with favorites
        });

        div.appendChild(title);
        div.appendChild(text);

        card_grid.appendChild(div);
    });
}

async function read_json() {
    const file = event.target.files[0];
    if (!file) return;

    try {
        const text = await file.text();
        json = JSON.parse(text);

        if (tv4.validate(json, sardines_schema)) {
            console.log("Valid JSON!");

            fuse = new Fuse(json.cards, {
                keys: [
                    "title",
                    "text"
                ],
                threshold: 0.35,
                ignoreLocation: true
            });

            await render_cards(json.cards);
            header_text.textContent = json.deck_name;

            return true;
        }

    } catch (err) {
        console.error("Invalid JSON:", err);
        return false;
    }
}

import_button.addEventListener("click", () => {
    file_input.click();
});

help_button.addEventListener("click", () => {
    window.location.href = "https://violetfrost.github.io/sardines/help"
});

file_input.addEventListener("change", async (event) => {
    read_json().then(result => {
        if (!result) return alert("Invalid JSON!");

        search.disabled = false; // TODO do we need to generalize this process a little bit? in preparation for save/load state
    });

    file_input.value = "";
});

search.addEventListener("input", search_cards);
search.value = "";
search.disabled = true;
