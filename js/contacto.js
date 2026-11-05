// Coordenadas del Mercado Municipal de La Vall d’Uixó.
const ubicacion = [39.8219, -0.23171];
const mapa = L.map("mapa").setView(ubicacion, 16);

L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(mapa);

L.marker(ubicacion)
    .addTo(mapa)
    .bindPopup("Mercado Municipal de La Vall d’Uixó");
const botonRuta = document.getElementById("calcular-ruta");
const estadoRuta = document.getElementById("estado-ruta");
const servicioRuta = "https://routing.openstreetmap.de/routed-car/route/v1/driving/";
const creditosRuta = 'Ruta por <a href="https://routing.openstreetmap.de/about.html">OSRM / FOSSGIS</a> · ' +
    '<a href="https://www.openstreetmap.org/fixthemap">Corregir el mapa</a>';

const capaRuta = L.geoJSON(null, {
    style: { color: "#197a8d", weight: 5 },
    attribution: creditosRuta
}).addTo(mapa);

estadoRuta.textContent = "Si das permiso, tu ubicación se enviará a FOSSGIS para calcular la ruta.";

botonRuta.addEventListener("click", () => {
    if (!navigator.geolocation) {
        estadoRuta.textContent = "La ubicación no está disponible en esta página.";
        return;
    }

    capaRuta.clearLayers();
    botonRuta.disabled = true;
    estadoRuta.textContent = "Buscando tu ubicación…";

    navigator.geolocation.getCurrentPosition(calcularRuta, () => {
        estadoRuta.textContent = "Revisa el permiso de ubicación del navegador y vuelve a intentarlo.";
        botonRuta.disabled = false;
    }, { timeout: 10000 });
});

async function calcularRuta(posicion) {
    const { latitude, longitude } = posicion.coords;

    try {
        if (mapa.distance(ubicacion, [latitude, longitude]) < 30) {
            estadoRuta.textContent = "Ya estás muy cerca del Mercado Municipal.";
            return;
        }

        // El servicio recibe primero la longitud y después la latitud.
        const origen = `${ubicacion[1]},${ubicacion[0]}`;
        const destino = `${longitude},${latitude}`;
        const url = `${servicioRuta}${origen};${destino}?geometries=geojson`;

        estadoRuta.textContent = "Calculando la ruta…";
        const respuesta = await fetch(url, { signal: AbortSignal.timeout(12000) });
        const datos = await respuesta.json();
        const ruta = datos.routes?.[0];

        if (!respuesta.ok || !ruta?.geometry) {
            throw new Error("Ruta no disponible");
        }

        capaRuta.addData(ruta.geometry);
        mapa.fitBounds(capaRuta.getBounds(), { padding: [20, 20], maxZoom: 17 });
        estadoRuta.textContent = "Ruta en coche del Mercado Municipal hasta tu ubicación.";
    } catch {
        capaRuta.clearLayers();
        estadoRuta.textContent = "No se pudo calcular la ruta. Vuelve a intentarlo.";
    } finally {
        // Esperamos un segundo antes de permitir otra consulta.
        setTimeout(() => {
            botonRuta.disabled = false;
        }, 1000);
    }
}