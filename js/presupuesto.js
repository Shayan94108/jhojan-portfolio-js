const formulario = document.querySelector(".formulario");
const nombre = document.getElementById("nombre");
const apellidos = document.getElementById("apellidos");
const telefono = document.getElementById("telefono");
const email = document.getElementById("email");

const soloLetras = /^\p{L}+$/u;
const soloTelefono = /^[0-9]{1,9}$/;

// Comprueba los datos cuando se pulsa Enviar solicitud.
formulario.noValidate = true;

const mensajeEnvio = document.getElementById("mensaje-envio");

formulario.addEventListener("input", function () {
    mensajeEnvio.textContent = "";
});

formulario.addEventListener("submit", function (evento) {
    evento.preventDefault();
    mensajeEnvio.textContent = "";
    nombre.setCustomValidity("");
    apellidos.setCustomValidity("");
    telefono.setCustomValidity("");
    email.setCustomValidity("");

    if (!soloLetras.test(nombre.value) || nombre.value.length > 15) {
        nombre.setCustomValidity("Escribe un nombre de hasta 15 letras.");
    }

    if (!soloLetras.test(apellidos.value) || apellidos.value.length > 40) {
        apellidos.setCustomValidity("Escribe apellidos de hasta 40 letras.");
    }

    if (!soloTelefono.test(telefono.value)) {
        telefono.setCustomValidity("Escribe un teléfono de 1 a 9 cifras.");
    }

    if (!email.validity.valid) {
        email.setCustomValidity("Escribe un correo válido, como nombre@ejemplo.com.");
    }

    const informacion = document.getElementById("informacion");
    informacion.setCustomValidity(
        informacion.value.trim() === "" ? "Describe qué página web necesitas." : ""
    );

    if (formulario.reportValidity()) {
    const totalEnviado = totalPresupuesto.value;

    formulario.reset();
    calcularPresupuesto();

    mensajeEnvio.textContent = "Solicitud de prueba validada. Presupuesto total " + totalEnviado + ".";
    }
});
const producto = document.getElementById("producto");
const plazo = document.getElementById("plazo");
const extras = formulario.querySelectorAll('input[name="extras"]');
const totalPresupuesto = document.getElementById("total-presupuesto");

// Suma el producto y los extras y aplica el descuento por plazo.
function calcularPresupuesto() {
    if (producto.value === "" || !plazo.validity.valid) {
        totalPresupuesto.value = "0,00 €";
        return;
    }

    let subtotal = Number(producto.value);

    extras.forEach(function (extra) {
        if (extra.checked) {
            subtotal += Number(extra.value);
        }
    });

    const meses = plazo.valueAsNumber;
    let descuento = 0;

    if (meses >= 3) {
        descuento = 0.10;
    } else if (meses === 2) {
        descuento = 0.05;
    }

    const total = subtotal - subtotal * descuento;
    totalPresupuesto.value = total.toFixed(2).replace(".", ",") + " €";
}

producto.addEventListener("change", calcularPresupuesto);
plazo.addEventListener("input", calcularPresupuesto);

extras.forEach(function (extra) {
    extra.addEventListener("change", calcularPresupuesto);
});

calcularPresupuesto();
