function setFormMessage(formElement,type,message){
    const messageElement = formElement.querySelector(".form__message");
    
    messageElement.textContent = message;
    messageElement.classList.remove("form__message--success","form__message--error" );
    messageElement.classList.add(`form__message--${type}`);
}

document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.querySelector("#login");
    const createAccountForm = document.querySelector("#createAccount");

    document.querySelector("#linkCreateAccount").addEventListener("click",e =>{
        e.defaultPrevented();
        loginForm.classList.add("form--hidden");
        createAccountForm.classList.remove("form--hiddem");
    });

    document.querySelector("#linkLogin").addEventListener("click",e =>{
        e.defaultPrevented();
        loginForm.classList.remove("form--hidden");
        createAccountForm.classList.add("form--hiddem");
    });

    loginForm.addEventListener("submit", e =>{
        e.preventDefault();

        setFormMessage(loginForm, "error","Invalid username or password");
    });

    document.querySelectorAll(".form__input").forEach(inputElement => {
        inputElement.addEventListener("blue", e => {
            if (e.target.id === "signUpUsername" && e.target.value.length > 0 && e.target.value < 10){
                setInputError(inputElement, "Username must be at least 10 characters in length");
            }
        });
    });
});