// TODO i need to come up with a better system for buttons
// this page doesn't really need its own script.... <a> would probably work best here tbh but i CBA to style it.

const return_button = document.getElementById("return_button");

return_button.addEventListener("click", () => {
    window.location.href = "https://violetfrost.github.io/sardines"
});