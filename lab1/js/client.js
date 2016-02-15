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
    var userMessageObject = serverstub.getUserMessagesByToken(localStorage.getItem("userToken")).data;
    var userMessageArraySize = 0;
    while(userMessageArraySize<userMessageObject.length){
        document.getElementById('messageList').innerHTML += ('<label>'+userMessageObject[userMessageArraySize].writer+'</label><br><p>'+
        userMessageObject[userMessageArraySize].content)+'</p>';
        userMessageArraySize++;
    }

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

function tryPostMessage(){
    var userMessage = document.getElementById('postMessage').value;
    var tempUserEmail = serverstub.getUserDataByToken(localStorage.getItem("userToken")).data.email;
    if(userMessage == ""){
        console.log("FUCK YOU");
    }
    else {
        serverstub.postMessage(localStorage.getItem("userToken"), userMessage, tempUserEmail);
        document.getElementById('postMessage').value = "";
        getAllMessages();

    }
}

function getAllMessages(){
    var messageObject = serverstub.getUserMessagesByToken(localStorage.getItem("userToken")).data;
    document.getElementById('messageList').innerHTML = "";
    var messageArraySize = 0;
    while(messageArraySize<messageObject.length){
        document.getElementById('messageList').innerHTML += ('<label>'+messageObject[messageArraySize].writer+'</label><br><p>'+
        messageObject[messageArraySize].content)+'</p>';
        messageArraySize++;
    }
}

function checkoutThisUser(){
    var inputSearchUser = document.getElementById("userSearchEmail").value;
    var newUserView = '<textarea id="searchUserPostMessage" rows="3" cols="50"></textarea><br><button type="button" onclick="postToUser()">Post</button>' +
        '<div id=showAllMessages><label>'+inputSearchUser+'s messages </label><button type="button" onclick="checkoutThisUser()">Update</button><br>' +
        '<div id="searchUserMessageList"></div></div>';
    searchUserMessages = serverstub.getUserMessagesByEmail(localStorage.getItem("userToken"),inputSearchUser);
    if(!searchUserMessages.success){
        friendView.innerHTML = "<label>"+searchUserMessages.message+"</label>";
    }
    else{
        friendView.innerHTML = newUserView;
        var messageObject = serverstub.getUserMessagesByEmail(localStorage.getItem("userToken"),inputSearchUser).data;
        var messageArraySize = 0;
        while(messageArraySize<messageObject.length){
            document.getElementById('searchUserMessageList').innerHTML += ('<label>'+messageObject[messageArraySize].writer+'</label><br><p>'+
            messageObject[messageArraySize].content)+'</p>';
            messageArraySize++;
        }
    }
}
function postToUser(){
    var searchUserPostMessage = document.getElementById('searchUserPostMessage').value;
    var inputSearchUser = document.getElementById("userSearchEmail").value;
    if(searchUserPostMessage == ""){
        console.log("FUCK YOU");
    }
    else {
        serverstub.postMessage(localStorage.getItem("userToken"), searchUserPostMessage, inputSearchUser);
        document.getElementById('postMessage').value = "";
        getAllMessages();
        checkoutThisUser();
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