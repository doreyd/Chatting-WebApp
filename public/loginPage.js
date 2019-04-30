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

$signIn.onclick = () => {
  let height = parseInt(window.getComputedStyle($signInContainer).height);
  let heightUp = parseInt(window.getComputedStyle($signUpContainer).height);
  if (height === 160) {
    $signInContainer.style.height = "35px";
    $signUpContainer.style.top = "45px";

    $signInContainer.onmouseout = () => {
      $signInContainer.style.background = "transparent";
    };
    if (heightUp !== 200) {
      $signUpContainer.style.background = "transparent";
      $signUpContainer.onmouseout = () => {
        $signUpContainer.style.background = "transparent";
      };
    }
  } else if (height === 35) {
    $signInContainer.style.height = "160px";
    $signUpContainer.style.top = "170px";
    $signInContainer.style.background = "white";
    $signInContainer.style.opacity = "0.8";
    $signInContainer.onmouseout = () => {
      $signInContainer.style.background = "white";
      $signInContainer.style.opacity = "0.8";
    };
    $signUpContainer.style.background = "white";
    $signUpContainer.style.opacity = "0.8";
    $signUpContainer.onmouseout = () => {
      $signUpContainer.style.background = "white";
      $signUpContainer.style.opacity = "0.8";
    };
  }
};
