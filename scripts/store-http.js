const API_URL = "http://localhost:5000/ArtikujtAuto";

async function merrArtikujt() {
    const response = await fetch(API_URL);

    if (!response.ok) {
        throw new Error("Nuk u ngarkuan dot artikujt nga API-ja.");
    }

    return await response.json();
}

async function merrArtikullNgaId(id) {
    const response = await fetch(`${API_URL}/${id}`);

    if (!response.ok) {
        throw new Error("Artikulli nuk u gjet.");
    }

    return await response.json();
}

async function shtoArtikull(artikulli) {
    const response = await fetch(API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(artikulli)
    });

    if (!response.ok) {
        throw new Error("Artikulli nuk u shtua dot.");
    }

    return await response.json();
}

async function perditesoArtikull(id, artikulli) {
    const response = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(artikulli)
    });

    if (!response.ok) {
        throw new Error("Artikulli nuk u perditesua dot.");
    }
}

async function fshiArtikull(id) {
    const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE"
    });

    if (!response.ok) {
        throw new Error("Artikulli nuk u fshi dot.");
    }
}

function lexoFormenEArtikullit() {
    return {
        emri: document.getElementById("emri").value.trim(),
        tipi: document.getElementById("tipi").value,
        kategoria: document.getElementById("kategoria").value.trim(),
        pershtatja: document.getElementById("pershtatja").value.trim(),
        cmimi: Number(document.getElementById("cmimi").value),
        gjendja: document.getElementById("gjendja").value
    };
}
