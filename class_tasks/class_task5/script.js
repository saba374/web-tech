
function changeTheme(color) {
    document.getElementById("page").className = color;
}

function loginUser(event) {
    event.preventDefault();

    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;
    var message = document.getElementById("message");

    if (username === "saba" && password === "1234") {
        message.innerHTML = "Login Successful!";
        message.style.color = "green";
    }
    else {
        message.innerHTML = "Login Unsuccessful!";
        message.style.color = "red";
    }

    return false;
}
