const $signUpContainer = document.getElementById("signUpContainer");
const $main = document.getElementById("main");
const $signUp = document.getElementById("signUp");
const $submit2 = document.getElementById("submit2");
const $submit = document.getElementById("submit");
const $formSignIn = document.getElementById("formSignIn");
const $formSignUp = document.getElementById("formSignUp");
const $signInContainer = document.getElementById("signInContainer");
const $signIn = document.getElementById("signIn");
const $email = document.getElementById("email");
const $email2 = document.getElementById("email2");
const $password = document.getElementById("password");
const $password2 = document.getElementById("password2");

$signUp.onclick = () => {
  let height = parseInt(window.getComputedStyle($signUpContainer).height);
  let heightIn = parseInt(window.getComputedStyle($signInContainer).height);

  if (height === 200) {
    $signUpContainer.style.height = "35px";
    if (heightIn !== 160) {
      $signUpContainer.onmouseout = () => {
        $signUpContainer.style.background = "transparent";
      };
    }
  } else if (height === 35) {
    $signUpContainer.style.height = "200px";
    $signUpContainer.style.background = "white";
    $signUpContainer.style.opacity = "0.8";
    $signUpContainer.onmouseout = () => {
      $signUpContainer.style.background = "white";
      $signUpContainer.style.opacity = "0.8";
    };
  }
};
