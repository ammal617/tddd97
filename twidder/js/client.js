displayViews = function(){
    
};

window.onload = function(){
    var htmlDiv = document.getElementById('currentView');
    var htmlWelcome = document.getElementById('welcomeView');
    
    htmlDiv.innerHTML = htmlWelcome.innerHTML;
};

function checkBlanks(){
    var firstName = document.forms["signUpForm"]["Firstname"].value;
    var lastName = document.forms["signUpForm"]["Lastname"].value;
    var City = document.forms["signUpForm"]["City"].value;
    var Country = document.forms["signUpForm"]["Country"].value;
    var Email = document.forms["signUpForm"]["Email"].value;
    var Password = document.forms["signUpForm"]["Password"].value;
    var Repeatpsw = document.forms["signUpForm"]["Repeatpsw"].value;
    if(firstName == '' || lastName == '' || City == '' || Country == '' || Email == '' || Password == '' || Repeatpsw == ''){
        console.log("you fucked up!");
        return false;
    }
    else{
        console.log("You did good");   
        return true;
    }
}

function checkEmail(){
    var Email = document.forms["signUpForm"]["Email"].value;
    var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if(!re.test(Email)){
        console.log("not valid email");
        return false;
    }
    else{
        return true;   
    }
}

function checkPassword(){
    var Password = document.forms["signUpForm"]["Password"].value;
    var Repeatpsw = document.forms["signUpForm"]["Repeatpsw"].value;
    
    if(Password.length < 8){
        console.log("password too short");
        return false;
    }
    else if(Password != Repeatpsw){
        console.log("passwords don't match"); 
        return false;
    }
    else{
        console.log("all good");   
        return true;
    }
}

function trySignIn(){
    if(checkBlanks() || checkEmail() || checkPassword()){
        console.log("success!")   
    }
}