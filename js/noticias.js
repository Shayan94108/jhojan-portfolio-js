// Carga las noticias del archivo JSON mediante Ajax.
async function cargarNoticias() {
    const lista = document.getElementById("lista-noticias");

    try {
        const respuesta = await fetch("./noticias.json");

        if (!respuesta.ok) {
            throw new Error("No se pudo abrir noticias.json");
        }

        const noticias = await respuesta.json();

        for (const noticia of noticias) {
            const articulo = document.createElement("article");
            const titulo = document.createElement("h3");
            const descripcion = document.createElement("p");

            titulo.textContent = noticia.titulo;
            descripcion.textContent = noticia.descripcion;

            articulo.append(titulo, descripcion);
            lista.append(articulo);
        }
    } catch (error) {
        lista.textContent = "No se pudieron cargar las noticias.";
        console.error(error);
    }
}

cargarNoticias();