displayViews = function(){
    
};
var errorMessage;
var Repeatpsw;
var userObject = {email:"", password:"", firstname:"", familyname:"", gender:"", city:"", country:""};

window.onload = function(){
    var htmlDiv = document.getElementById('currentView');
    var htmlWelcome = document.getElementById('welcomeView');
    var htmlLogin = document.getElementById('loginView');
    if(localStorage.getItem("userToken") == "nothing"){
        htmlDiv.innerHTML = htmlWelcome.innerHTML;
    }
    else{
        htmlDiv.innerHTML = htmlLogin.innerHTML;
        loadUserInfo();
    }
};
function loadUserInfo(){
    var homeUserInfo = serverstub.getUserDataByToken(localStorage.getItem("userToken"));
    console.log(homeUserInfo.data);
    homeFirstName.innerHTML = homeUserInfo.data.firstname;
    homeLastName.innerHTML = homeUserInfo.data.familyname;
    homeEmail.innerHTML = homeUserInfo.data.email;
    homeGender.innerHTML = homeUserInfo.data.gender;
    homeCity.innerHTML = homeUserInfo.data.city;
    homeCountry.innerHTML = homeUserInfo.data.country;
}

function checkBlanks(){
    if(userObject.firstname == "" || userObject.familyname == "" || userObject.city == "" || userObject.country == "" || userObject.email == "" || userObject.password == '' || Repeatpsw == ''){
        errorMessage = "Missing information";
        return false;
    }
    else{
        return true;
    }
}

function checkEmail(){
    var Email = document.forms["signUpForm"]["Email"].value;
    var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if(!re.test(Email)){
        errorMessage = "Not valid email";
        return false;
    }
    else{
        return true;   
    }
}

function checkPassword(){
    var Repeatpsw = document.forms["signUpForm"]["Repeatpsw"].value;
    
    if(userObject.password.length < 8){
        errorMessage = "Password is to short";
        return false;
    }
    else if(userObject.password != Repeatpsw){
        errorMessage = "Passwords don't match";
        return false;
    }
    else{
        return true;
    }
}

function createUser(){
    userObject.firstname = document.forms["signUpForm"]["Firstname"].value;
    userObject.familyname = document.forms["signUpForm"]["Lastname"].value;
    var genderList = document.getElementById("gendervalueID");
    userObject.gender = genderList.options[genderList.selectedIndex].value;
    userObject.city = document.forms["signUpForm"]["City"].value;
    userObject.country = document.forms["signUpForm"]["Country"].value;
    userObject.email = document.forms["signUpForm"]["Email"].value;
    userObject.password = document.forms["signUpForm"]["Password"].value;
    Repeatpsw = document.forms["signUpForm"]["Repeatpsw"].value;
    if(checkPassword() && checkEmail() && checkBlanks()){
        var errorDiv = document.getElementById('errorMessage');
        errorDiv.innerHTML = "Success!";
        document.getElementById("errorMessage").style.color = "green";
        serverstub.signUp(userObject);
        document.forms["signUpForm"].reset();
    }
    else{
        var errorDiv = document.getElementById('errorMessage');
        errorDiv.innerHTML = errorMessage;
    }

}
function tryloginUser(){
    var loginUser = document.forms["loginForm"]["email"].value;
    var loginPass = document.forms["loginForm"]["password"].value;
    var serverResp = serverstub.signIn(loginUser, loginPass);

    if(serverResp.success){
        localStorage.setItem("userToken", serverResp.data);
        location.reload();
    }
    else{
        document.forms["loginForm"].reset();
        var errorLoginDiv = document.getElementById('errorLoginMessage');
        errorLoginDiv.innerHTML = "Wrong credentials";
    }
}
function changeMyPassword(){
    var oldPass = document.forms["changePass"]["oldpass"].value;
    var newPass = document.forms["changePass"]["newpass"].value;
    var repnewPass = document.forms["changePass"]["repnewpass"].value;
    if (newPass == repnewPass){
        var passrespons = serverstub.changePassword(localStorage.getItem("userToken"), oldPass, newPass);
        if(passrespons.success){
            console.log(passrespons.message);
            document.forms["changePass"].reset();
        }
        else{
            console.log(passrespons.message);
            document.forms["changePass"].reset();
        }
    }
    else{
        console.log("Passwords don't match");
        document.forms["changePass"].reset();
    }
}

function logoutUser(){
    localStorage.setItem("userToken", "nothing");
    location.reload();
}