const calendar = document.querySelector(".calendar"),
  date = document.querySelector(".date"),
  daysContainer = document.querySelector(".days"),
  prev = document.querySelector(".prev"),
  next = document.querySelector(".next"),
  todayBtn = document.querySelector(".today-btn"),
  gotoBtn = document.querySelector(".goto-btn"),
  dateInput = document.querySelector(".date-input"),
  eventDay = document.querySelector(".event-day"),
  eventDate = document.querySelector(".event-date");

let today = new Date();
let activeDay;
let month = today.getMonth();
let year = today.getFullYear();

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

//add days
function initCalendar(){
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const prevLastDay = new Date(year, month, 0);
  const prevDays = prevLastDay.getDate();
  const lastDate = lastDay.getDate();
  const day = firstDay.getDay();
  const nextDays = 7 - lastDay.getDay() - 1;

  date.innerHTML = months[month] + " " + year;

  let days = "";

  //Past days
  for (let x = day; x > 0; x--) {
    days += `<div class="day prev-date">${prevDays - x + 1}</div>`;
  }

  //current days
  for (let i = 1; i <= lastDate; i++){
    if(
      i === new Date().getDate() &&
      year === new Date().getFullYear() &&
      month === new Date().getMonth()){
        days += `<div class="day today active" >${i}</div>`;
     }
     else{
      days += `<div class="day " >${i}</div>`;
     }
  }

  //Next days
  for(let j = 1; j <= nextDays; j++){
    days += `<div class="day next-date" >${j}</div>`;
  }

  daysContainer.innerHTML = days;
  addListner();
}

initCalendar();

function prevMonth() {
  month--;
  if (month < 0) {
    month = 11;
    year--;
  }
  initCalendar();
}
function nextMonth() {
  month++;
  if (month > 11) {
    month = 0;
    year++;
  }
  initCalendar();
}
prev.addEventListener("click", prevMonth);
next.addEventListener("click", nextMonth);

//function to add active on day
function addListner() {
  const days = document.querySelectorAll(".day");
  days.forEach((day) => {
    day.addEventListener("click", (e) => {
      getActiveDay(e.target.innerHTML);
      activeDay = Number(e.target.innerHTML);
      //remove active
      days.forEach((day) => {
        day.classList.remove("active");
      });
      //if clicked prev-date or next-date switch to that month
      if (e.target.classList.contains("prev-date")) {
        prevMonth();
        //add active to clicked day afte month is change
        setTimeout(() => {
          //add active where no prev-date or next-date
          const days = document.querySelectorAll(".day");
          days.forEach((day) => {
            if (
              !day.classList.contains("prev-date") &&
              day.innerHTML === e.target.innerHTML
            ) {
              day.classList.add("active");
            }
          });
        }, 100);
      } else if (e.target.classList.contains("next-date")) {
        nextMonth();
        //add active to clicked day afte month is changed
        setTimeout(() => {
          const days = document.querySelectorAll(".day");
          days.forEach((day) => {
            if (
              !day.classList.contains("next-date") &&
              day.innerHTML === e.target.innerHTML
            ) {
              day.classList.add("active");
            }
          });
        }, 100);
      } else {
        e.target.classList.add("active");
      }
    });
  });
}

//function get active day day name and date and update eventday eventdate
function getActiveDay(date) {
  const day = new Date(year, month, date);
  const dayName = day.toString().split(" ")[0];
  eventDay.innerHTML = dayName;
  eventDate.innerHTML = date + " " + months[month] + " " + year;
}

todayBtn.addEventListener("click", () => {
  today = new Date();
  month = today.getMonth();
  year = today.getFullYear();
  initCalendar();
});

dateInput.addEventListener("input", (e) => {
  dateInput.value = dateInput.value.replace(/[^0-9/]/g, "");
  if (dateInput.value.length === 2) {
    dateInput.value += "/";
  }
  if (dateInput.value.length > 7) {
    dateInput.value = dateInput.value.slice(0, 7);
  }
  if (e.inputType === "deleteContentBackward") {
    if (dateInput.value.length === 3) {
      dateInput.value = dateInput.value.slice(0, 2);
    }
  }
});

gotoBtn.addEventListener("click", gotoDate);

function gotoDate() {
  console.log("here");
  const dateArr = dateInput.value.split("/");
  if (dateArr.length === 2) {
    if (dateArr[0] > 0 && dateArr[0] < 13 && dateArr[1].length === 4) {
      month = dateArr[0] - 1;
      year = dateArr[1];
      initCalendar();
      return;
    }
  }
  alert("Invalid Date");
}

/* Scraper */
document.querySelector(".add-event").addEventListener("click", async (event) => {
  const button = event.currentTarget; // Obtén el botón
  const icon = button.querySelector("i"); // Obtén el ícono dentro del botón

  // Cambia el ícono a un spinner animado
  icon.classList.remove("fa-arrow-right");
  icon.classList.add("fa-spinner", "fa-spin");

  // Deshabilita el botón para evitar múltiples clics
  button.disabled = true;

  try {
    const day = new Date(year, month, activeDay);
    const formattedDate = day.toISOString().split("T")[0]; // Formato yyyy-mm-dd
    console.log(formattedDate);

    // Realiza la solicitud al servidor
    const response = await fetch("/run-scraper", {
      method: "POST",
      headers: {
        "Content-Type": "application/json", // Indicamos que enviamos JSON
      },
      body: JSON.stringify({ date: formattedDate }), // Enviamos la fecha en el cuerpo
    });

    // Verifica si la respuesta es JSON válida
    const data = await response.json();

    if (data.error) {
      alert("Error al ejecutar el script: " + data.error);
    } else {
      // Guardar resultados en localStorage
      localStorage.setItem("scraperResults", JSON.stringify(data));

      // Redirigir a la página de resultados
      window.location.href = "/static/cartelera.html";
    }
  } catch (error) {
    alert("Error en la comunicación con el servidor: " + error.message);
  } finally {
    // Restablece el ícono del botón
    icon.classList.remove("fa-spinner", "fa-spin");
    icon.classList.add("fa-arrow-right");

    // Habilita el botón nuevamente
    button.disabled = false;
  }
});

function renderResults(data) {
  const container = document.getElementById("results");
  container.innerHTML = ""; // Limpiar resultados anteriores
  console.log(data);

  // Verificar si data está vacío o no contiene eventos
  if (!data || data.length === 0) {
    container.innerHTML = "<p>No hay eventos disponibles.</p>";
    return;
  }

  // Iterar sobre los eventos directamente en el array data
  data.forEach((eventInfo) => {
    const card = document.createElement("div");
    card.classList.add("card");

    // Asignar los valores directamente
    const { link, sinopsis, teatro, titulo } = eventInfo;

    card.innerHTML = `
      <h3>${titulo || "Sin título"}</h3>
      <p><strong>Teatro:</strong> ${teatro || "N/A"}</p>
      <p>${sinopsis || "No disponible"}</p>
      <a href="${link}" target="_blank">Ver más</a>
    `;

    container.appendChild(card);
  });
}