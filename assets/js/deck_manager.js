function load_json(json) {
    try {
        if (tv4.validate(json, sardines_schema)) {
            app_state.json = json;
            app_state.fuse = new Fuse(app_state.json.cards, {
                keys: [
                    "title",
                    "category",
                    "text"
                ],
                threshold: 0.35,
                ignoreLocation: true
            });

            render_cards(app_state.json.cards);
            app_state.dom.header_text.textContent = json.deck.name;
            app_state.dom.search.disabled = false;
            save_to_local_storage();
            return true;
        }
    } catch (err) {
        console.error("Invalid JSON:", err);
        return false;
    }
}

async function load_from_file(event) {
    const file = event.target.files[0];
    if (!file) return false;

    var text = await file.text();
    return load_json(JSON.parse(text));
}

function load_from_url() {
    // TODO not yet implemented
}

function save_to_local_storage() {
    localStorage.setItem("user_state", JSON.stringify(app_state.json));
}

function load_from_local_storage() {
    var ls = localStorage.getItem("user_state");
    if (ls) {
        // TODO this probbly needs more robust error handling... not a huge priority
        // as it SHOULD hopefully only break if someone goes poking around... probably....
        
        if(!load_json(JSON.parse(ls)))
        {
            alert("Your session has been reset as the local storage data was made invalid.");
            localStorage.removeItem("user_state");
        }
    }
}

function is_category_valid(category)
{
    return app_state.json.deck.categories.includes(category);
}

function search_cards() {
    const query = app_state.dom.search.value.trim();

    if (!app_state.fuse) {
        return;
    }

    if (query === "") {
        render_cards(app_state.json.cards);
        return;
    }

    const results = app_state.fuse.search(query);

    const cards = results.map(result => result.item);

    render_cards(cards);
}
