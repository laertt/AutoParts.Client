const trupiIArtikujve = document.getElementById("artikujt-body");
const searchInput = document.getElementById("search-input");
const filterTipi = document.getElementById("filter-tipi");
const pastroKerkiminButton = document.getElementById("pastro-kerkimin");
const rezultatiKerkimit = document.getElementById("rezultati-kerkimit");
const totalArtikuj = document.getElementById("total-artikuj");
const totalPjese = document.getElementById("total-pjese");
const totalSherbime = document.getElementById("total-sherbime");

let teGjitheArtikujt = [];

function formatoCmimin(cmimi) {
    return `${Number(cmimi).toFixed(2)} €`;
}

function pastroHtml(vlera) {
    return String(vlera)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

function merrShenjenEGjendjes(gjendja) {
    const gjendjaEPastruar = pastroHtml(gjendja);
    const gjendjaLower = gjendja.toLowerCase();

    if (gjendjaLower.includes("nuk")) {
        return `<span class="badge text-bg-danger badge-status">${gjendjaEPastruar}</span>`;
    }

    if (gjendjaLower.includes("stok") || gjendjaLower.includes("disponueshem")) {
        return `<span class="badge text-bg-success badge-status">${gjendjaEPastruar}</span>`;
    }

    if (gjendjaLower.includes("aplikim") || gjendjaLower.includes("porosi")) {
        return `<span class="badge text-bg-warning badge-status">${gjendjaEPastruar}</span>`;
    }

    return `<span class="badge text-bg-secondary badge-status">${gjendjaEPastruar}</span>`;
}

function merrIkonenETipit(tipi) {
    return tipi === "Sherbim" ? "🛠️" : "📦";
}

function perditesoStatistikat(artikujt) {
    const nrPjese = artikujt.filter(artikulli => artikulli.tipi === "Pjese").length;
    const nrSherbime = artikujt.filter(artikulli => artikulli.tipi === "Sherbim").length;

    totalArtikuj.textContent = `${artikujt.length} artikuj`;
    totalPjese.textContent = nrPjese;
    totalSherbime.textContent = nrSherbime;
}

function filtroArtikujt() {
    const kerkimi = searchInput.value.trim().toLowerCase();
    const tipiIZgjedhur = filterTipi.value;

    return teGjitheArtikujt.filter(artikulli => {
        const perputhetMeTipin = tipiIZgjedhur === "" || artikulli.tipi === tipiIZgjedhur;
        const tekstiIArtikullit = [
            artikulli.emri,
            artikulli.tipi,
            artikulli.kategoria,
            artikulli.pershtatja,
            artikulli.gjendja,
            artikulli.cmimi
        ].join(" ").toLowerCase();

        const perputhetMeKerkimin = kerkimi === "" || tekstiIArtikullit.includes(kerkimi);
        return perputhetMeTipin && perputhetMeKerkimin;
    });
}

function shfaqArtikujt(artikujt) {
    rezultatiKerkimit.textContent = `U shfaqen ${artikujt.length} nga ${teGjitheArtikujt.length} artikuj.`;

    if (artikujt.length === 0) {
        trupiIArtikujve.innerHTML = `
            <tr>
                <td colspan="7" class="text-center py-5">
                    <div class="fw-bold mb-1">Nuk u gjet asnje artikull.</div>
                    <div class="text-secondary">Provo nje fjale tjeter ose pastro kerkimin.</div>
                </td>
            </tr>
        `;
        return;
    }

    trupiIArtikujve.innerHTML = artikujt.map(artikulli => `
        <tr>
            <td class="item-name">${pastroHtml(artikulli.emri)}</td>
            <td><span class="type-pill">${merrIkonenETipit(artikulli.tipi)} ${pastroHtml(artikulli.tipi)}</span></td>
            <td>${pastroHtml(artikulli.kategoria)}</td>
            <td>${pastroHtml(artikulli.pershtatja)}</td>
            <td class="fw-bold">${formatoCmimin(artikulli.cmimi)}</td>
            <td>${merrShenjenEGjendjes(artikulli.gjendja)}</td>
            <td>
                <div class="action-buttons">
                    <a href="edit-item.html?id=${artikulli.id}" class="btn btn-sm btn-outline-primary">Modifiko</a>
                    <button class="btn btn-sm btn-outline-danger" onclick="hiqArtikullin(${artikulli.id})">Fshi</button>
                </div>
            </td>
        </tr>
    `).join("");
}

function aplikoFiltrat() {
    const artikujtEFiltruar = filtroArtikujt();
    shfaqArtikujt(artikujtEFiltruar);
}

async function ngarkoArtikujt() {
    try {
        teGjitheArtikujt = await merrArtikujt();
        perditesoStatistikat(teGjitheArtikujt);
        aplikoFiltrat();
    } catch (error) {
        trupiIArtikujve.innerHTML = `
            <tr>
                <td colspan="7" class="text-center text-danger py-4">
                    Nuk u lidh dot me API-ne. Sigurohu qe back-end eshte duke punuar ne http://localhost:5000.
                </td>
            </tr>
        `;
        rezultatiKerkimit.textContent = "API nuk eshte lidhur.";
    }
}

async function hiqArtikullin(id) {
    const konfirmo = confirm("A je i sigurt qe deshiron ta fshish kete artikull?");

    if (!konfirmo) {
        return;
    }

    try {
        await fshiArtikull(id);
        await ngarkoArtikujt();
    } catch (error) {
        alert(error.message);
    }
}

searchInput.addEventListener("input", aplikoFiltrat);
filterTipi.addEventListener("change", aplikoFiltrat);
pastroKerkiminButton.addEventListener("click", () => {
    searchInput.value = "";
    filterTipi.value = "";
    aplikoFiltrat();
    searchInput.focus();
});

ngarkoArtikujt();
