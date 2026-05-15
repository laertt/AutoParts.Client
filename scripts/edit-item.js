const forma = document.getElementById("item-form");
const params = new URLSearchParams(window.location.search);
const id = Number(params.get("id"));

async function mbushFormen() {
    if (!id) {
        alert("Id e artikullit mungon.");
        window.location.href = "index.html";
        return;
    }

    try {
        const artikulli = await merrArtikullNgaId(id);

        document.getElementById("emri").value = artikulli.emri;
        document.getElementById("tipi").value = artikulli.tipi;
        document.getElementById("kategoria").value = artikulli.kategoria;
        document.getElementById("pershtatja").value = artikulli.pershtatja;
        document.getElementById("cmimi").value = artikulli.cmimi;
        document.getElementById("gjendja").value = artikulli.gjendja;
    } catch (error) {
        alert(error.message);
        window.location.href = "index.html";
    }
}

forma.addEventListener("submit", async function (event) {
    event.preventDefault();

    const artikulli = lexoFormenEArtikullit();

    try {
        await perditesoArtikull(id, artikulli);
        alert("Artikulli u perditesua me sukses.");
        window.location.href = "index.html";
    } catch (error) {
        alert(error.message);
    }
});

mbushFormen();
