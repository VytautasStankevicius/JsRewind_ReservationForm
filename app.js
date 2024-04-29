const header = document.querySelector(".calendar h2");
const dates = document.querySelector(".dates");
const navs = document.querySelectorAll("#prev, #next");

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

let date = new Date();
let month = date.getMonth();
let year = date.getFullYear();
let clickedDate = null;

function renderCalendar() {
 const start = new Date(year, month, 1).getDay() || 7; 
 const endDate = new Date(year, month + 1, 0).getDate();
 const end = new Date(year, month, endDate).getDay() || 7;
 const endDatePrev = new Date(year, month, 0).getDate();
 
 let datesHtml = "";
 
 for (let i = start; i > 1; i--) { 
     datesHtml += `<li class="inactive">${endDatePrev - i + 1}</li>`;
 }
 
 for (let i = 1; i <= endDate; i++) {
     let className =
       i === date.getDate() &&
       month === new Date().getMonth() &&
       year === new Date().getFullYear()
         ? ' class="today"'
         : "";
     datesHtml += `<li${className} data-date="${year}-${month + 1}-${i}">${i}</li>`;
 }
   
 for (let i = end; i < 7; i++) {
     datesHtml += `<li class="inactive">${i - end + 1}</li>`;
 }
 
 dates.innerHTML = datesHtml;
 header.textContent = `${year} ${months[month]} `;

 const days = document.querySelectorAll('.dates li');
 days.forEach(day => {
    day.addEventListener('click', (event) => {
      const dayDate = day.getAttribute('data-date');
      clickedDate = new Date(dayDate);

      if (day.classList.contains('stored-date')) {
        event.preventDefault();
        const storedData = JSON.parse(localStorage.getItem('formDataArray'));
        const data = storedData.find(data => {
          const storedDate = new Date(data.date.year, data.date.month - 1, data.date.day);
          return storedDate.getTime() === clickedDate.getTime();
        });
        showModal(data);
      } else {
        document.querySelector('.formHolder').style.display = 'block';
      }
    });
 });

 styleReservation();
}

navs.forEach((nav) => {
 nav.addEventListener("click", (e) => {
    const btnId = e.target.id;

    if (btnId === "prev" && month === 0) {
      year--;
      month = 11;
    } else if (btnId === "next" && month === 11) {
      year++;
      month = 0;
    } else {
      month = btnId === "next" ? month + 1 : month - 1;
    }

    date = new Date(year, month, new Date().getDate());
    year = date.getFullYear();
    month = date.getMonth();

    renderCalendar();
 });
});

const form = document.getElementById('eventForm');
const formName = document.getElementById('name');
const email = document.getElementById('email');
const message = document.getElementById('message');
const formContainer = document.querySelector('.formHolder');

document.getElementById('cancelButton').addEventListener('click', function(event) {
  event.preventDefault();
  document.querySelector('.formHolder').style.display = 'none';
 });

form.addEventListener('submit', function(event) {
 event.preventDefault(); 

 const formData = {
    name: formName.value,
    email: email.value,
    message: message.value,
    date: {
      year: clickedDate.getFullYear(),
      month: clickedDate.getMonth() + 1,
      day: clickedDate.getDate()
    }
 };

 let existingData = localStorage.getItem('formDataArray');
 existingData = existingData ? JSON.parse(existingData) : [];

 existingData.push(formData);

 localStorage.setItem('formDataArray', JSON.stringify(existingData));

 formName.value = '';
 email.value = '';
 message.value = '';

 formContainer.style.display = 'none';
});

function styleReservation() {
 const storedData = JSON.parse(localStorage.getItem('formDataArray'));

 if (storedData && storedData.length > 0) {
      storedData.forEach(data => {
          const storedDate = new Date(data.date.year, data.date.month - 1, data.date.day);
          const dayElement = document.querySelector(`.dates li[data-date="${storedDate.getFullYear()}-${storedDate.getMonth() + 1}-${storedDate.getDate()}"]`);

          if (dayElement) {
              dayElement.classList.add('stored-date');
          }
      });
 }
}

function showModal(data) {
 const modal = document.getElementById("reservationModal");
 const reservationText = document.getElementById("reservationText");
 const closeBtn = document.querySelector(".close");

 reservationText.textContent = `Name: ${data.name}, Email: ${data.email}, Message: ${data.message}`;
 modal.style.display = "block";

 closeBtn.onclick = function() {
    modal.style.display = "none";
 };

 window.onclick = function(event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
 };
}

document.addEventListener('DOMContentLoaded', () => {
 styleReservation();
 renderCalendar();
});
