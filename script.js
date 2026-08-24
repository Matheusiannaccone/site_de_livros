const Email = document.getElementById("email");
const password = document.getElementById("senha");
const password_confirmation = document.getElementById("senha-confirmação");

const alert1 = document.getElementById("alert1");
const alert2 = document.getElementById("alert2");
const alert3 = document.getElementById("alert3");

const Submit = document.getElementById("Submit");


Submit.addEventListener("click", () => {

   let valid = true;
    
    if(Email.value === ""){
    alert1.textContent = "Escolha um Email";

    valid = false;

    Email.classList.add("input_error");
    alert1.classList.remove("error")
    void Email.offsetWidth;
    alert1.classList.add("error");

 } else {
   valid = true
    alert1.textContent = "";
    Email.classList.remove("input_error");
    alert1.classList.remove("error")

    
 };


 if(password.value === ""){
    alert2.textContent = "Crie uma senha";

    valid = false;

    password.classList.add("input_error");
    alert2.classList.remove("error")
    void Email.offsetWidth;
    alert2.classList.add("error");
    
 } else {
    alert2.textContent = "";
    alert2.classList.remove("error")
    password.classList.remove("input_error");
    valid = true;
 };


 if(password_confirmation.value === ""){
    alert3.textContent = "Preencha esse campo";

    valid = false;

   password_confirmation.classList.add("input_error");
    alert3.classList.remove("error")
    void password_confirmation.offsetWidth;
    alert3.classList.add("error");

 } else if(password_confirmation.value !== password.value){
    alert3.textContent = "As senhas tem que ser iguais"

    password_confirmation.classList.add("input_error");
    alert3.classList.remove("error")
    void password_confirmation.offsetWidth;
    alert3.classList.add("error");

    valid = false;
 }
else {
   alert3.textContent = ""

   valid = true;
   
 alert3.classList.remove("error");
 password_confirmation.classList.remove("input_error");
};


if(valid){
   
localStorage.setItem("email", Email.value);
localStorage.setItem("senha", password.value);

window.location.href = "http://127.0.0.1:3004/index.html?vscode-livepreview=true";
}


})
