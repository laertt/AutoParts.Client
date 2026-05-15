const forma = document.getElementById("item-form");

forma.addEventListener("submit", async function (event) {
    event.preventDefault();

    const artikulli = lexoFormenEArtikullit();

    try {
        await shtoArtikull(artikulli);
        alert("Artikulli u shtua me sukses.");
        window.location.href = "index.html";
    } catch (error) {
        alert(error.message);
    }
});
