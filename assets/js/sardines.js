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

    // Is this too slow for large decks? works for now
    // might be better to just manually put them into another list or change the schema though...
    // food for thought!
    cards.sort((a, b) => (b.favorited === true) - (a.favorited === true));

    cards.forEach(card => {
        const div = document.createElement("div");
        div.className = card.favorited ? "card favorited" : "card";

        const title = document.createElement("h1");
        title.textContent = card.title;

        const text = document.createElement("p");
        text.textContent = card.text;

        div.addEventListener("click", async (e) => {

            // stupid workaround
            // because currenttarget is only valid
            // when the event is being handled -V
            const card_div = e.currentTarget;

            await navigator.clipboard.writeText(card.text);

            card_div.classList.add("copied");
            await setTimeout(() => {
                card_div.classList.remove("copied");
            }, 1000);
        });

        div.addEventListener("contextmenu", async (e) => {
            e.preventDefault();
            card.favorited = !card.favorited;
            local_storage_write();
            render_cards(cards);
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
            local_storage_write();

            return true;
        }

    } catch (err) {
        console.error("Invalid JSON:", err);
        return false;
    }
}

/**
 * Write the current internal JSON state to local storage
 */
async function local_storage_write() {
    localStorage.setItem("user_state", JSON.stringify(json));
}

/**
 * Read the current local storage state to internal JSON, if it exists 
 */
async function local_storage_read() {
    var ls = localStorage.getItem("user_state");
    if (ls) {
        // TODO this probbly needs more robust error handling... not a huge priority
        // as it SHOULD hopefully only break if someone goes poking around... probably....
        json = JSON.parse(ls);

        render_cards(json.cards);
        header_text.textContent = json.deck_name;
        search.disabled = false;
    }
}

import_button.addEventListener("click", () => {
    file_input.click();
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

local_storage_read();