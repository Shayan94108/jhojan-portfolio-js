const fotos = document.querySelectorAll(".galeria .proyecto");
const controles = document.getElementById("controles-galeria");
const contador = document.getElementById("contador-fotos");
const anterior = document.getElementById("foto-anterior");
const siguiente = document.getElementById("foto-siguiente");

let fotoActual = 0;

// Muestra una foto y actualiza el contador.
function mostrarFoto() {
    fotos.forEach((foto, posicion) => {
        foto.hidden = posicion !== fotoActual;
    });

    contador.textContent = `${fotoActual + 1} de ${fotos.length}`;
}

if (fotos.length > 1) {
    anterior.addEventListener("click", () => {
        fotoActual = (fotoActual - 1 + fotos.length) % fotos.length;
        mostrarFoto();
    });

    siguiente.addEventListener("click", () => {
        fotoActual = (fotoActual + 1) % fotos.length;
        mostrarFoto();
    });

    mostrarFoto();
    controles.hidden = false;
}