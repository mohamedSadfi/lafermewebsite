const $next = document.querySelector(".next");
const $prev = document.querySelector(".prev");

$next.addEventListener("click", () => {
  const items = document.querySelectorAll(".item");
  document.querySelector(".slide").appendChild(items[0]);
});

$prev.addEventListener("click", () => {
  const items = document.querySelectorAll(".item");
  document.querySelector(".slide").prepend(items[items.length - 1]);
});

document.addEventListener("DOMContentLoaded", () => {
  const names = document.querySelectorAll(".content .name");
  names.forEach((name) => {
    name.addEventListener("click", () => {
      const content = name.parentElement;
      content.classList.toggle("show-description");
    });
  });
})

// document.addEventListener("DOMContentLoaded", function () {
//   function ChangeImage() {
//     const items = document.querySelectorAll(".item");
//     document.querySelector(".slide").appendChild(items[0]);
//   }

//   IntervalId = setInterval(ChangeImage, 5000);
// });

// Event Listener to handle the change of the navbar when we scroll
document.addEventListener("DOMContentLoaded", function () {
  var fixed_nav = document.getElementById("navbar");
  var titleContainer = document.getElementById("titleContainer");
  var divider = document.querySelector(
    ".custom-shape-divider-bottom-1713610940"
  );
  var navbar_items = document.getElementById("navbar-items");
  var transition_added = false;
  var fixed_added = false;

  // Function to handle scroll event
  function handleScroll() {
    if (window.scrollY > 150 && window.scrollY <= 180 && !transition_added) {
      // Add the 'scrolled' class to the landing content
      fixed_nav.classList.add("transition-navbar");
      fixed_nav.classList.remove("fixed-navbar");
      divider.style.transform = "rotate(180deg) translateY(0%)";
      if (window.matchMedia("(max-width: 768px)").matches) {
        navbar_items.style.backgroundColor = "rgb(178, 221, 48, 1)";
      }
      // console.log("transition added");
      transition_added = true;
    } else if (window.scrollY < 150 && transition_added) {
      // Remove the 'scrolled' class if the user scrolls to the top
      fixed_nav.classList.remove("transition-navbar");
      fixed_nav.classList.remove("fixed-navbar");
      divider.style.transform = "rotate(180deg) translateY(-100%)";
      if (window.matchMedia("(max-width: 768px)").matches) {
        navbar_items.style.backgroundColor = "rgba(255, 255, 255, 0.9)";
      }
      // console.log("transition removed");
      transition_added = false;
    }

    // Check if the user has scrolled down
    if (window.scrollY > 180 && !fixed_added) {
      // Add the 'scrolled' class to the landing content
      fixed_nav.classList.remove("transition-navbar");
      fixed_nav.classList.add("fixed-navbar");
      titleContainer.classList.add("title_container_scrolled");
      console.log("fixed added");
      fixed_added = true;
    } else if (window.scrollY < 180 && window.scrollY >= 150 && fixed_added) {
      console.log("fixed removed");
      // Remove the 'scrolled' class if the user scrolls to the top
      fixed_nav.classList.remove("fixed-navbar");
      fixed_nav.classList.add("transition-navbar");
      titleContainer.classList.remove("title_container_scrolled");
      fixed_added = false;
    }
  }

  // Add scroll event listener
  window.addEventListener("scroll", handleScroll);
});

document.addEventListener("DOMContentLoaded", () => {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const id = entry.target.id; // Get the ID of the currently observed section

        // Check if the element is intersecting
        if (entry.isIntersecting) {
          switch (id) {
            case "section1":
              var titleContainer =
                entry.target.querySelector(".title_container");
              titleContainer.style.transform = "translateX(0)";
              titleContainer.style.opacity = "1";
              break;
            case "section2":
              var divider = entry.target.querySelector(
                ".custom-shape-divider-bottom-1713610940"
              );
              var presentationText =
                entry.target.querySelector(".presentation_card");
              var presentationImage =
                entry.target.querySelector(".presentation_img");
              presentationText.style.transform = "translateX(0%)";
              presentationImage.style.transform = "translateX(0%) rotate(0deg)";
              divider.style.transform = "rotate(180deg) translateY(0%)";

              break;
            case "section3":
              var title = entry.target.querySelector(".container");

              title.childNodes[1].style.opacity = "1";
              title.childNodes[1].style.transform = "translateY(0)";
              title.lastElementChild.style.opacity = "1";
              title.lastElementChild.style.transform = "translateY(0)";
              break;
            case "section4":
              var divider = entry.target.querySelector(
                ".custom-shape-divider-top-1714231224"
              );
              // var navbar = document.getElementById("navbar");
              // navbar.style.background = "transparent";

              divider.style.opacity = "0";
              divider.style.transform =
                "translateY(-100%) translateZ(0px) scaleY(0)";
              break;
            case "section5":
              var restaurant_text_container =
                entry.target.querySelector(".top_left");

              restaurant_text_container.style.opacity = "1";

              restaurant_text_container.childNodes[1].style.transform =
                "translateY(0)";
              restaurant_text_container.childNodes[1].style.opacity = "1";
              restaurant_text_container.lastElementChild.style.transform =
                "translateY(0)";
              restaurant_text_container.lastElementChild.style.opacity = "1";
              break;
          }
        } else {
          switch (id) {
            case "section1":
              var titleContainer =
                entry.target.querySelector(".title_container");
              titleContainer.style.transform = "translateX(-200%)";
              titleContainer.style.opacity = "0";
              break;
            case "section2":
              var presentationText =
                entry.target.querySelector(".presentation_card");
              var presentationImage =
                entry.target.querySelector(".presentation_img");
              var divider = entry.target.querySelector(
                ".custom-shape-divider-bottom-1713610940"
              );
              presentationText.style.transform = "translateX(-140%)";
              presentationImage.style.transform =
                "translateX(200%) rotate(180deg) translateY(20%)";
              divider.style.transform = "rotate(-180deg) translateY(-100%)";
              break;
            case "section3":
              var title = entry.target.querySelector(".container");
              title.childNodes[1].style.transform = "translateY(-50%)";
              title.childNodes[1].style.opacity = "0";
              title.lastElementChild.style.transform = "translateY(50%)";
              break;
            case "section4":
              var divider = entry.target.querySelector(
                ".custom-shape-divider-top-1714231224"
              );
              // var navbar = document.getElementById("navbar");
              // navbar.style.background =
              //   "linear-gradient(to bottom right,rgb(178, 221, 48, 0.4),rgb(178, 221, 48, 1))";

              divider.style.opacity = "1";
              divider.style.transform = "translateY(-1%)";
              break;
            case "section5":
              var restaurant_text_container =
                entry.target.querySelector(".top_left");

              restaurant_text_container.style.opacity = "0";

              restaurant_text_container.childNodes[1].style.transform =
                "translateY(20%)";
              restaurant_text_container.childNodes[1].style.opacity = "0";
              restaurant_text_container.lastElementChild.style.transform =
                "translateY(-20%)";
              restaurant_text_container.lastElementChild.style.opacity = "0";
              break;
          }
        }
      });
    },
    {
      rootMargin: "0px",
      threshold: 0.3, // Adjust this value based on when you want the class to be added (50% visibility here)
    }
  );

  // Observe all sections
  document.querySelectorAll(".section").forEach((section) => {
    observer.observe(section);
  });
});

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
