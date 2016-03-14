var errorMessage;
var Repeatpsw;
var myBarChart;
var tempusersonline = 0;
var tempmymessages = 0;
var tempmyviews = 0;
var userObject = {email:"", password:"", firstname:"", familyname:"", gender:"", city:"", country:""};

window.onload = function(){
    //WORKSNOW
    displayView();
};

var displayView = function(){
    var htmlDiv = document.getElementById('currentView');
    var htmlWelcome = document.getElementById('welcomeView');
    var htmlLogin = document.getElementById('loginView');
    if(localStorage.getItem("userToken") == "undefined" || localStorage.getItem("userToken") == null){
        htmlDiv.innerHTML = htmlWelcome.innerHTML;
    }
    else{
        htmlDiv.innerHTML = htmlLogin.innerHTML;
        send_get("/is_loggedin/"+localStorage.getItem("userToken"), function(returndata){
            if (returndata.success){
                loadUserInfo();
                createChart();
            }
            else {
               htmlDiv.innerHTML = htmlWelcome.innerHTML; 
            }
        }); 
    }
}

function send_post(adress, data, returnfunction){
    var xml_post = new XMLHttpRequest();
    xml_post.open("POST", adress, true);
    xml_post.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xml_post.onreadystatechange = function() {
        if (xml_post.readyState == 4 && xml_post.status == 200) {
            returnfunction(JSON.parse(xml_post.responseText));
        }
    };
    xml_post.send(data);
}

function send_get(adress, returnfunction){
    var xml_get = new XMLHttpRequest();
    xml_get.open("GET", adress, true);
    xml_get.onreadystatechange = function() {
        if (xml_get.readyState == 4 && xml_get.status == 200) {
            returnfunction(JSON.parse(xml_get.responseText));
        }
    };
    xml_get.send(null);
}

function loadUserInfo(){
    //var homeUserInfo = serverstub.getUserDataByToken(localStorage.getItem("userToken"));
    //var userMessageObject = serverstub.getUserMessagesByToken(localStorage.getItem("userToken")).data;

    send_get("/get_user_data_by_token/" + localStorage.getItem("userToken"), function(serverdata){
        homeFirstName.innerHTML = serverdata.data.firstname;
        homeLastName.innerHTML = serverdata.data.familyname;
        homeEmail.innerHTML = serverdata.data.email;
        homeGender.innerHTML = serverdata.data.gender;
        homeCity.innerHTML = serverdata.data.city;
        homeCountry.innerHTML = serverdata.data.country;
    });
    
    send_get("/get_user_message_by_token/" + localStorage.getItem("userToken"), function(servermessages){
        var userMessageObject = servermessages.data;
        var userMessageArraySize = 0;
        while(userMessageArraySize<userMessageObject.length){
            document.getElementById('messageList').innerHTML += ('<label>'+userMessageObject[userMessageArraySize].writer+'</label><br><p>'+ userMessageObject[userMessageArraySize].content)+'</p>';
            userMessageArraySize++;
        }
    });
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
   // var tempUserEmail = serverstub.getUserDataByToken(localStorage.getItem("userToken")).data.email;
        if(userMessage == ""){
            console.log("Iz Empty");
        }
    
        else {
            send_get("/get_user_data_by_token/"+localStorage.getItem("userToken"), function(alldata){
                //serverstub.postMessage(localStorage.getItem("userToken"), userMessage, alldata.data.email);
                if(alldata.success){
                    var serverdata = "message="+userMessage+"&token="+localStorage.getItem("userToken")+"&email="+alldata.data.email;
                    send_post("/post_message", serverdata, function(returnpost){
                        document.getElementById('postMessage').value = "";
                        getAllMessages();
                    });
                }
            });
                
        }
}

function getAllMessages(){
    //var messageObject = serverstub.getUserMessagesByToken(localStorage.getItem("userToken")).data;
    send_get("/get_user_message_by_token/"+localStorage.getItem("userToken"), function(messageData){
        document.getElementById('messageList').innerHTML = "";
        var messageObject = messageData.data;
        var messageArraySize = 0;
        while(messageArraySize<messageObject.length){
            document.getElementById('messageList').innerHTML += ('<label>'+messageObject[messageArraySize].writer+'</label><br><p>'+
        messageObject[messageArraySize].content)+'</p>';
            messageArraySize++;
        }  
    });
}

function checkoutThisUser(){
    var inputSearchUser = document.getElementById("userSearchEmail").value;
    var newUserView = '<textarea id="searchUserPostMessage" rows="3" cols="50"></textarea><br><button type="button" onclick="postToUser()">Post</button>' +
        '<div id=showAllMessages><label>'+inputSearchUser+'s messages </label><button type="button" onclick="checkoutThisUser()">Update</button><br>' +
        '<div id="searchUserMessageList"></div></div>';
    
    send_get("/get_user_message_by_email/"+localStorage.getItem("userToken")+"/"+inputSearchUser, function(messagereturn){
        if(!messagereturn.success){
            friendView.innerHTML = "<label>"+messagereturn.message+"</label>";
        }
        else{
            friendView.innerHTML = newUserView;
            var messageObject = messagereturn.data;
            var messageArraySize = 0;
            while(messageArraySize<messageObject.length){
                document.getElementById('searchUserMessageList').innerHTML += ('<label>'+messageObject[messageArraySize].writer+'</label><br><p>'+
                messageObject[messageArraySize].content)+'</p>';
                messageArraySize++;
            }
            add_view_to_user(inputSearchUser);
        }
    });
    
  //  searchUserMessages = serverstub.getUserMessagesByEmail(localStorage.getItem("userToken"),inputSearchUser);
}

function updateThisUser(){
    var inputSearchUser = document.getElementById("userSearchEmail").value;
    var newUserView = '<textarea id="searchUserPostMessage" rows="3" cols="50"></textarea><br><button type="button" onclick="postToUser()">Post</button>' +
        '<div id=showAllMessages><label>'+inputSearchUser+'s messages </label><button type="button" onclick="updateThisUser()">Update</button><br>' +
        '<div id="searchUserMessageList"></div></div>';

    send_get("/get_user_message_by_email/"+localStorage.getItem("userToken")+"/"+inputSearchUser, function(messagereturn){
        if(!messagereturn.success){
            friendView.innerHTML = "<label>"+messagereturn.message+"</label>";
        }
        else{
            friendView.innerHTML = newUserView;
            var messageObject = messagereturn.data;
            var messageArraySize = 0;
            while(messageArraySize<messageObject.length){
                document.getElementById('searchUserMessageList').innerHTML += ('<label>'+messageObject[messageArraySize].writer+'</label><br><p>'+
                messageObject[messageArraySize].content)+'</p>';
                messageArraySize++;
            }
        }
    });

  //  searchUserMessages = serverstub.getUserMessagesByEmail(localStorage.getItem("userToken"),inputSearchUser);
}


function add_view_to_user(email){
    var data = "token=" + localStorage.getItem("userToken") + "&email=" + email;

    send_post("/add_views", data, function(response){
    });
}

function postToUser(){
    var searchUserPostMessage = document.getElementById('searchUserPostMessage').value;
    var inputSearchUser = document.getElementById("userSearchEmail").value;
    if(searchUserPostMessage == ""){
    }
    else {
        //serverstub.postMessage(localStorage.getItem("userToken"), searchUserPostMessage, inputSearchUser);
        var postdata =  "token="+localStorage.getItem("userToken")+"&email="+inputSearchUser+"&message="+searchUserPostMessage;
        send_post("/post_message", postdata, function(returndata){
            document.getElementById('postMessage').value = "";
            getAllMessages();
            updateThisUser();
        });
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
        errorMessage = "Password needs to be more than 8 char";
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
        
        var signobject = "email="+userObject.email+"&password="+userObject.password+"&first_name="+userObject.firstname+"&family_name="+userObject.familyname+"&gender="+userObject.gender+"&city="+userObject.city+"&country="+userObject.country;
        
        //serverrespons= serverstub.signUp(userObject);
        //add if statement to check error message from server response
        send_post("/sign_up", signobject, function(returndata){
            errorDiv.innerHTML = returndata.message;
            if(returndata.success) {
                errorDiv.style.color = "green";
                document.forms["signUpForm"].reset();
            }
        });
    }
    else{
        var errorDiv = document.getElementById('errorMessage');
        errorDiv.innerHTML = errorMessage;
    }

}

function tryloginUser(){
    var loginUser = document.forms["loginForm"]["email"].value;
    var loginPass = document.forms["loginForm"]["password"].value;
    var post_data = "email="+loginUser+"&password="+loginPass;
    //var serverResp = serverstub.signIn(loginUser, loginPass);
    send_post("/sign_in", post_data, function(dothething){
        if(dothething.success){
            localStorage.setItem("userToken", dothething.data);
            displayView();
            createChart();
            connect_socket(dothething.data);
        }
        else{
            document.forms["loginForm"]["password"].value = "";
            document.getElementById('errorLoginMessage').innerHTML = dothething.message;
        } 
    });

}

function changeMyPassword(){
    //add response message to success or not
    var oldPass = document.forms["changePass"]["oldpass"].value;
    var newPass = document.forms["changePass"]["newpass"].value;
    var repnewPass = document.forms["changePass"]["repnewpass"].value;
    if (newPass == repnewPass){
        var postData = "token="+localStorage.getItem("userToken")+"&password="+oldPass+"&new_password="+newPass;
        send_post("/change_password", postData, function(passrespons){
            if(passrespons.success){
                console.log("FUNKAS: "+passrespons.message);
                document.getElementById('accountErrorMessage').innerHTML = passrespons.message;
                document.forms["changePass"].reset();
            }
            else{
                console.log(passrespons.message);
                document.getElementById('accountErrorMessage').innerHTML = passrespons.message;
                document.forms["changePass"].reset();
            }      
        });
        //var passrespons = serverstub.changePassword(localStorage.getItem("userToken"), oldPass, newPass);

    }
    else{
        console.log("Passwords don't match");
        accountErrorMessage.innerHTML="Password needs to match.";
        document.forms["changePass"].reset();
    }
}

function logoutUser(){
    var postdata = "token="+localStorage.getItem("userToken")+"&kick=logout";
    send_post("/sign_out", postdata, function(returndata){
        delete connection;
        localStorage.removeItem("userToken");
        connection.close();
        displayView();
    });
}

function kickUser(){
    var postdata = "token="+localStorage.getItem("userToken")+"&kick=kickout";
    send_post("/sign_out", postdata, function(returndata){
        delete connection;
        localStorage.removeItem("userToken");
        connection.close();
        displayView();
    });
}

function createChart() {
    var data = {
        labels: ["Profile views", "Users online", "My messages"],
        datasets: [
            {
                label: "My First dataset",
                fillColor: "rgba(220,220,220,0.5)",
                strokeColor: "rgba(220,220,220,0.8)",
                highlightFill: "rgba(220,220,220,0.75)",
                highlightStroke: "rgba(220,220,220,1)",
                data: [tempmyviews,tempusersonline,tempmymessages]
            }
        ]
    };

    var options = {

    };

    var ctx = document.getElementById("chart").getContext("2d");
    myBarChart = new Chart(ctx).Bar(data, options);

}
function updateChart(token) {
    var data = {};
    data["type"] = "userdata";
    data["data"] = token;
    connection.send(JSON.stringify(data));
}

var connection;
function connect_socket(token){
    connection = new WebSocket('ws://localhost:5000/socket_connect')
    
    connection.onopen = function() {
        var data = {};
        data["type"] = "login";
        data["data"] = token;
        connection.send(JSON.stringify(data));
        updateChart(localStorage.getItem("userToken"));
    };
    
    connection.onerror = function(error) {
        console.log("WS Error: " + error);
    };
    
    connection.onmessage = function(e) {
        var response = JSON.parse(e.data)

        if(response.type == "logout"){
            console.log("PLEASE LOGOUT");
            kickUser();
        }
        else if(response.type == "userdata"){
            console.log(response.views);
            tempmyviews = response.views
            tempusersonline = response.usersonline;
            tempmymessages = response.messagecount;
            myBarChart.datasets[0].bars[0].value = response.views;
            myBarChart.datasets[0].bars[1].value = response.usersonline;
            myBarChart.datasets[0].bars[2].value = response.messagecount;
            myBarChart.update();
        }
        else if(response.type == "curruseronline"){
            tempusersonline = response.usersonline;
            console.log(tempusersonline);
            myBarChart.datasets[0].bars[1].value = response.usersonline;
            myBarChart.update();
        }
    }
    
    connection.onclose = function() {
        console.log("WS closed");
    };
}