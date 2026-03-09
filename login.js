document.getElementById('sign-in-btn').addEventListener('click', function(event) {

    event.preventDefault();
    const userName=document.getElementById('username').value;
    console.log(userName);
    const passWord=document.getElementById('password').value;
    // const convertedPinNumber=parseInt(pinNumber)
    // console.log(convertedPinNumber);
    if(userName=== "admin"){
        if(passWord=== "admin123"){
             alert("Login Successful");
            window.location.href="./main.html";

    }
    else{
        alert("Incorrect Password");
    }
}
    else{
        alert("Username must be 11 characters");
    }

    
});