document.addEventListener("DOMContentLoaded", () => {
  const STORAGE_KEY = "solicitudesForm";

  const form = document.getElementById("registroForm");
  if (!form) return;

  const mensajeExito = document.getElementById("mensajeExito");

  const acordeones = document.querySelectorAll(".acordeon");

  const paisHidden = document.getElementById("pais");
  const paisLabel = document.getElementById("paisSeleccionado");
  const listaPaises = document.getElementById("listaPaises");

  const ciudadHidden = document.getElementById("ciudad");
  const ciudadLabel = document.getElementById("ciudadSeleccionada");
  const listaCiudades = document.getElementById("listaCiudades");

  const docHidden = document.getElementById("tipoDocumento");
  const docLabel = document.getElementById("docSeleccionado");
  const listaDocs = document.getElementById("listaDocs");

  const fechaNacimiento = document.getElementById("fechaNacimiento");
  const edadInput = document.getElementById("edad");

  const codigoSpan = document.getElementById("codigoGenerado");
  const codigoIngresado = document.getElementById("codigoIngresado");
  const btnRefrescarCodigo = document.getElementById("btnRefrescarCodigo");
  const errorCodigo = document.getElementById("errorCodigo");

  const phoneFlag = document.getElementById("phoneFlag");
  const phoneCode = document.getElementById("phoneCode");
  const telefonoInput = document.getElementById("telefono");

  const btnRuta = document.getElementById("btnRuta");
  const rutaSection = document.getElementById("rutaSection");
  const estadoSolicitud = document.getElementById("estadoSolicitud");
  const estadoTexto = document.getElementById("estadoTexto");
  const btnCerrarRuta = document.getElementById("btnCerrarRuta");

  const modal = document.getElementById("modalConfirmacion");
  const btnSi = document.getElementById("btnSi");
  const btnNo = document.getElementById("btnNo");

  let datosPendientes = null;

  const ciudadesPorPais = {
    "Argentina": ["Buenos Aires", "Córdoba", "Rosario", "Mendoza", "La Plata"],
    "Bolivia": ["La Paz", "Santa Cruz de la Sierra", "Cochabamba", "El Alto", "Sucre", "Tarija", "Oruro", "Potosí"],
    "Brasil": ["São Paulo", "Río de Janeiro", "Brasilia", "Salvador", "Fortaleza"],
    "Chile": ["Santiago", "Valparaíso", "Concepción", "La Serena", "Antofagasta", "Temuco"],
    "Colombia": ["Bogotá", "Medellín", "Cali", "Barranquilla", "Cartagena"],
    "Costa Rica": ["San José", "Alajuela", "Cartago", "Heredia"],
    "Cuba": ["La Habana", "Santiago de Cuba", "Camagüey", "Holguín"],
    "Ecuador": ["Quito", "Guayaquil", "Cuenca", "Ambato"],
    "El Salvador": ["San Salvador", "Santa Ana", "San Miguel"],
    "Guatemala": ["Ciudad de Guatemala", "Quetzaltenango", "Escuintla"],
    "Honduras": ["Tegucigalpa", "San Pedro Sula", "La Ceiba"],
    "México": ["Ciudad de México", "Guadalajara", "Monterrey", "Puebla", "Tijuana"],
    "Nicaragua": ["Managua", "León", "Granada"],
    "Panamá": ["Ciudad de Panamá", "Colón", "David"],
    "Paraguay": ["Asunción", "Ciudad del Este", "Encarnación"],
    "Perú": ["Lima", "Arequipa", "Trujillo", "Cusco", "Chiclayo"],
    "Puerto Rico": ["San Juan", "Ponce", "Mayagüez"],
    "República Dominicana": ["Santo Domingo", "Santiago de los Caballeros", "La Romana"],
    "Uruguay": ["Montevideo", "Salto", "Paysandú"],
    "Venezuela": ["Caracas", "Maracaibo", "Valencia", "Barquisimeto"]
  };

  const datosPaisTelefono = {
    "Argentina": { codigo: "+54", bandera: "🇦🇷" },
    "Bolivia": { codigo: "+591", bandera: "🇧🇴" },
    "Brasil": { codigo: "+55", bandera: "🇧🇷" },
    "Chile": { codigo: "+56", bandera: "🇨🇱" },
    "Colombia": { codigo: "+57", bandera: "🇨🇴" },
    "Costa Rica": { codigo: "+506", bandera: "🇨🇷" },
    "Cuba": { codigo: "+53", bandera: "🇨🇺" },
    "Ecuador": { codigo: "+593", bandera: "🇪🇨" },
    "El Salvador": { codigo: "+503", bandera: "🇸🇻" },
    "Guatemala": { codigo: "+502", bandera: "🇬🇹" },
    "Honduras": { codigo: "+504", bandera: "🇭🇳" },
    "México": { codigo: "+52", bandera: "🇲🇽" },
    "Nicaragua": { codigo: "+505", bandera: "🇳🇮" },
    "Panamá": { codigo: "+507", bandera: "🇵🇦" },
    "Paraguay": { codigo: "+595", bandera: "🇵🇾" },
    "Perú": { codigo: "+51", bandera: "🇵🇪" },
    "Puerto Rico": { codigo: "+1", bandera: "🇵🇷" },
    "República Dominicana": { codigo: "+1", bandera: "🇩🇴" },
    "Uruguay": { codigo: "+598", bandera: "🇺🇾" },
    "Venezuela": { codigo: "+58", bandera: "🇻🇪" }
  };

  acordeones.forEach(acc => {
    acc.addEventListener("click", () => {
      const targetId = acc.getAttribute("data-target");
      const lista = document.getElementById(targetId);
      if (lista) lista.classList.toggle("oculto");
    });
  });

  if (listaPaises) {
    listaPaises.querySelectorAll("div").forEach(item => {
      item.addEventListener("click", () => {
        const valor = item.dataset.valor;
        paisHidden.value = valor;
        paisLabel.textContent = valor;
        listaPaises.classList.add("oculto");
        actualizarCiudades(valor);

        if (datosPaisTelefono[valor]) {
          phoneFlag.textContent = datosPaisTelefono[valor].bandera;
          phoneCode.textContent = datosPaisTelefono[valor].codigo;
        } else {
          phoneFlag.textContent = "🌐";
          phoneCode.textContent = "+--";
        }
      });
    });
  }

  function actualizarCiudades(pais) {
    if (!listaCiudades) return;
    listaCiudades.innerHTML = "";
    ciudadHidden.value = "";
    ciudadLabel.textContent = "Selecciona tu ciudad";

    const ciudades = ciudadesPorPais[pais];
    if (ciudades && ciudades.length) {
      ciudades.forEach(c => {
        const div = document.createElement("div");
        div.textContent = c;
        div.dataset.valor = c;
        listaCiudades.appendChild(div);
      });
    } else {
      const div = document.createElement("div");
      div.textContent = "Sin lista disponible, indícala en Comentario.";
      div.dataset.valor = "";
      listaCiudades.appendChild(div);
    }
  }

  if (listaCiudades) {
    listaCiudades.addEventListener("click", (e) => {
      if (e.target && e.target.matches("div[data-valor]")) {
        const valor = e.target.dataset.valor;
        if (valor) {
          ciudadHidden.value = valor;
          ciudadLabel.textContent = valor;
        }
        listaCiudades.classList.add("oculto");
      }
    });
  }

  if (listaDocs) {
    listaDocs.querySelectorAll("div").forEach(item => {
      item.addEventListener("click", () => {
        const valor = item.dataset.valor;
        docHidden.value = valor;
        docLabel.textContent = valor;
        listaDocs.classList.add("oculto");
      });
    });
  }

  if (fechaNacimiento) {
    fechaNacimiento.addEventListener("change", () => {
      const v = fechaNacimiento.value;
      if (!v) return;
      const hoy = new Date();
      const fn = new Date(v);
      let edad = hoy.getFullYear() - fn.getFullYear();
      const m = hoy.getMonth() - fn.getMonth();
      if (m < 0 || (m === 0 && hoy.getDate() < fn.getDate())) edad--;
      if (edad >= 0 && edad <= 120) edadInput.value = edad;
    });
  }

  function generarCodigo() {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let code = "";
    for (let i = 0; i < 5; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    codigoSpan.textContent = code;
    codigoIngresado.value = "";
    errorCodigo.classList.add("oculto");
  }

  if (btnRefrescarCodigo) btnRefrescarCodigo.addEventListener("click", generarCodigo);
  generarCodigo();

  form.addEventListener("keydown", (e) => {
    if (e.key !== "Enter") return;
    if (e.target.tagName.toLowerCase() === "textarea") return;
    e.preventDefault();
    const focusables = Array.from(
      form.querySelectorAll("input, textarea, .acordeon, .btn-enviar")
    ).filter(el => el.offsetParent !== null && !el.disabled);
    const i = focusables.indexOf(e.target);
    if (i > -1 && i < focusables.length - 1) focusables[i + 1].focus();
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    mensajeExito.classList.add("oculto");
    errorCodigo.classList.add("oculto");

    const campos = [
      paisHidden.value.trim(),
      ciudadHidden.value.trim(),
      form.nombreCompleto.value.trim(),
      form.apellidoCompleto.value.trim(),
      fechaNacimiento.value.trim(),
      edadInput.value.trim(),
      docHidden.value.trim(),
      form.numeroDocumento.value.trim(),
      form.direccion.value.trim(),
      telefonoInput.value.trim(),
      form.email.value.trim()
    ];

    if (campos.some(c => !c)) {
      alert("Por favor completa todos los campos obligatorios.");
      return;
    }

    const edad = parseInt(edadInput.value.trim(), 10);
    if (isNaN(edad) || edad < 18) {
      alert("Para participar debes ser mayor de 18 años.");
      return;
    }

    const tel = telefonoInput.value.trim();
    if (!/^[0-9]{7,15}$/.test(tel)) {
      alert("Ingresa un número de celular válido (solo números, mínimo 7 dígitos).");
      return;
    }

    if (form.numeroDocumento.value.trim().length < 4) {
      alert("El número de documento es demasiado corto.");
      return;
    }

    const email = form.email.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert("Ingresa un correo electrónico válido.");
      return;
    }

    if (codigoIngresado.value.trim().toUpperCase() !== codigoSpan.textContent.trim().toUpperCase()) {
      errorCodigo.classList.remove("oculto");
      return;
    }

    datosPendientes = {
      pais: paisHidden.value,
      ciudad: ciudadHidden.value,
      nombreCompleto: form.nombreCompleto.value.trim(),
      apellidoCompleto: form.apellidoCompleto.value.trim(),
      fechaNacimiento: fechaNacimiento.value.trim(),
      edad: edadInput.value.trim(),
      tipoDocumento: docHidden.value,
      numeroDocumento: form.numeroDocumento.value.trim(),
      direccion: form.direccion.value.trim(),
      telefono: (phoneCode.textContent || "") + " " + telefonoInput.value.trim(),
      email: email,
      mensaje: form.mensaje ? form.mensaje.value.trim() : "",
      creadoEn: new Date().toLocaleString(),
      creadoEnMs: Date.now()
    };

    modal.classList.add("activo");
  });

  btnNo.addEventListener("click", () => {
    modal.classList.remove("activo");
    datosPendientes = null;
  });

  btnSi.addEventListener("click", () => {
    if (!datosPendientes) {
      modal.classList.remove("activo");
      return;
    }

    const solicitud = datosPendientes;
    const existentes = obtenerSolicitudes();
    existentes.push(solicitud);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(existentes));

    enviarPorCorreo(solicitud);

    datosPendientes = null;
    modal.classList.remove("activo");

    form.reset();
    paisHidden.value = "";
    paisLabel.textContent = "Selecciona tu país";
    ciudadHidden.value = "";
    ciudadLabel.textContent = "Selecciona tu ciudad";
    docHidden.value = "";
    docLabel.textContent = "Selecciona tipo de documento";
    phoneFlag.textContent = "🌐";
    phoneCode.textContent = "+--";
    generarCodigo();

    mensajeExito.textContent = "✅ TU SOLICITUD HA SIDO ENVIADA CORRECTAMENTE.";
    mensajeExito.classList.remove("oculto");

    setTimeout(() => {
      mensajeExito.textContent = "✅ Verificaremos tus datos y nos comunicaremos contigo.";
    }, 2500);
  });

  if (btnRuta) {
    btnRuta.addEventListener("click", () => {
      actualizarEstadoRuta();
      rutaSection.classList.remove("oculto");
    });
  }

  if (btnCerrarRuta) {
    btnCerrarRuta.addEventListener("click", () => {
      rutaSection.classList.add("oculto");
    });
  }

  function obtenerSolicitudes() {
    const data = localStorage.getItem(STORAGE_KEY);
    try {
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  function obtenerUltimaSolicitud() {
    const solicitudes = obtenerSolicitudes();
    if (!solicitudes.length) return null;
    return solicitudes[solicitudes.length - 1];
  }

  function actualizarEstadoRuta() {
    const ultima = obtenerUltimaSolicitud();
    estadoSolicitud.className = "estado-solicitud estado-ninguno";

    if (!ultima) {
      estadoTexto.textContent = "No hay solicitud registrada aún en este dispositivo.";
      return;
    }

    let creadoMs = ultima.creadoEnMs;
    if (!creadoMs && ultima.creadoEn) {
      const parsed = Date.parse(ultima.creadoEn);
      if (!isNaN(parsed)) creadoMs = parsed;
    }
    if (!creadoMs) {
      estadoTexto.textContent = "No se pudo calcular el estado de tu solicitud.";
      return;
    }

    const diffHoras = (Date.now() - creadoMs) / (1000 * 60 * 60);

    if (diffHoras < 1) {
      estadoSolicitud.classList.add("estado-celeste");
      estadoTexto.textContent =
        "Celeste: Tu solicitud fue recibida correctamente y está siendo registrada.";
    } else if (diffHoras < 5) {
      estadoSolicitud.classList.add("estado-amarillo");
      estadoTexto.textContent =
        "Amarillo: Tu solicitud ya ingresó al sistema y se encuentra en revisión.";
    } else {
      estadoSolicitud.classList.add("estado-rojo");
      estadoTexto.textContent =
        "Rojo: Tu solicitud fue rechazada después de la revisión. Puedes volver a intentarlo si corresponde.";
    }
  }

  function enviarPorCorreo(solicitud) {
    const fd = new FormData();
    for (const key in solicitud) {
      fd.append(key, solicitud[key]);
    }

    fetch("procesar_solicitud.php", {
      method: "POST",
      body: fd
    })
      .then(r => r.text())
      .then(t => {
        console.log("Respuesta servidor:", t);
      })
      .catch(e => {
        console.error("Error al enviar correo:", e);
      });
  }
});