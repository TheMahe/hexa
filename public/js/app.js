import Session from './Session.js';
import Validator from './Validator.js';
import User from './User.js';


(async function() {
  let session = new Session();
  session = await session.getSession();
  // Rest of your
  if (session !== "") {
    window.location.href = "hexa.html";
  }

  let burger = document.querySelector(".burger");
  let navbar = document.querySelector("nav");
  let menu = document.querySelector(".responsive_menu");

  if (burger) {
    burger.addEventListener("click", () => {
      navbar.classList.toggle("height-nav");
      menu.classList.toggle("opacity");
      burger.classList.toggle("toggle");
    });
  }

  let config = {
    korisnicko_ime: {
      required: true,
      minlength: 3,
      maxlength: 15,
    },
    register_email: {
      required: true,
      email: true,
    },
    register_password: {
      required: true,
      minlength: 6,
      maxlength: 20,
    },
    confirm_password: {
      required: true,
      matching: "register_password",
    },
  };

  let validator = new Validator(config, "#registrationForm");

  document
      .querySelector("#registrationForm")
      .addEventListener("submit", async function (e) {
        e.preventDefault();

        if (validator.validationPassed()) {
          let user = new User();
          user.username = document.querySelector("#korisnicko_ime").value;
          user.email = document.querySelector("#register_email").value;
          user.password = document.querySelector("#register_password").value;
          try {
            await user.create();
            window.location.href = "hexa.html";
          } catch (error) {
            console.error("Error creating user:", error);
          }
        }
      });
})();


