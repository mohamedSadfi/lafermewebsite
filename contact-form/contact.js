// Form submission handler
document
  .getElementById("reservationForm")
  .addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent default form submission
    // Disable the submit button to prevent multiple clicks
    const submitButton = document.querySelector(
      "#reservationForm button[type='submit']"
    );
    submitButton.disabled = true;

    // Collect form data
    const nom = document.getElementById("nom").value;
    const prenom = document.getElementById("prenom").value;
    const email = document.getElementById("email").value;
    const phone = document.getElementById("phone").value;
    const date = document.getElementById("date").value;
    const heure = document.getElementById("heure").value;
    const adult = document.getElementById("adult").value;
    const child = document.getElementById("child").value;
    const meal = document.getElementById("meal").value;

    // Validate date: Ensure it's not a Monday
    const selectedDate = new Date(date);
    const dayOfWeek = selectedDate.getUTCDay();
    if (dayOfWeek === 1) {
      alert(
        "Nous sommes fermés les lundis. Veuillez sélectionner une autre date."
      );
      submitButton.disabled = false;
      return; // Stop submission
    }

    // Validate time: Ensure it's within working hours
    const minTime = "09:00";
    const maxTime = "17:00";
    if (heure < minTime || heure > maxTime) {
      alert("Nous sommes ouverts entre 09:00 et 17:00.");
      submitButton.disabled = false;
      return; // Stop submission
    }

    // Send form data via EmailJS
    emailjs
      .send("service_6uk63ke", "template_k221osa", {
        nom: nom,
        prenom: prenom,
        email: email,
        phone: phone,
        date: date,
        heure: heure,
        adult: adult,
        child: child,
        meal: meal,
      })
      .then(
        function (response) {
          alert(
            "Votre réservation a été envoyée avec succès! Si vous avez donné votre email, nous vous avons un email de confirmation."
          );
          document.getElementById("reservationForm").reset(); // Reset form after submission
          submitButton.disabled = false; // Re-enable the submit button after success
        },
        function (error) {
          alert("Échec de l'envoi de la réservation.");
          submitButton.disabled = false; // Re-enable the submit button after failure
        }
      );
  });

// Set the minimum date to today
const dateInput = document.getElementById("date");
const timeInput = document.getElementById("heure");

function disablePastAndMondayDates() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  // Set minimum date to today
  const minDate = `${year}-${month}-${day}`;
  dateInput.setAttribute("min", minDate);
}
// Restrict time to be between 09:00 and 17:00, and validate user input
function restrictTime() {
  const minTime = "09:00";
  const maxTime = "17:00";

  // Set min and max in the time input
  timeInput.setAttribute("min", minTime);
  timeInput.setAttribute("max", maxTime);
}

// Initialize the restrictions
disablePastAndMondayDates();
restrictTime();

document.addEventListener("DOMContentLoaded", function () {
  const menuToggle = document.querySelector(".menu-toggle");
  const navbar = document.querySelector(".text-navbar");
  const navbarItems = document.querySelectorAll(".text-navbar a");
  const html = document.documentElement;

  menuToggle.addEventListener("click", function () {
    navbar.classList.toggle("active");
    menuToggle.classList.toggle("active");
    html.classList.toggle("no-scroll");
  });

  navbarItems.forEach((item) => {
    item.addEventListener("click", function () {
      navbar.classList.remove("active");
      menuToggle.classList.remove("active");
      html.classList.remove("no-scroll");
    });
  });
});
