function render_cards(cards) {
    app_state.dom.card_grid.innerHTML = "";

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
            save_to_local_storage();
            render_cards(cards);
        });

        div.appendChild(title);
        div.appendChild(text);

        app_state.dom.card_grid.appendChild(div);
    });
}

app_state.dom.import_button.addEventListener("click", () => {
    app_state.dom.file_input.click();
});

app_state.dom.file_input.addEventListener("change", async (event) => {
    if (await load_from_file(event))
        app_state.dom.search.disabled = false
    else alert("Invalid JSON!");
    app_state.dom.file_input.value = "";
});

app_state.dom.search.addEventListener("input", search_cards);

app_state.dom.search.value = "";
app_state.dom.search.disabled = true;

load_from_local_storage();