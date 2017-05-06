
// var data = tinyQuery.getAll();


// const handleBackendResponse = () => {
  var data = tinyQuery.getAll();

  var heading             = document.getElementById("thanks-header");
  var introPara           = document.getElementById("introPara");
  var successInfo         = document.getElementById("requestSuccessInfo");
  var responseDetails     = document.getElementById("responseDetails");
  var responseCode        = document.getElementById("responseCode");
  var responseText        = document.getElementById("responseText");

  var headingFailureText  = document.getElementById("sorryHeading").innerHTML;
  var paraFailureText     = document.getElementById("sorryPara").innerHTML;

  if (data.code != "0") {
    heading.innerHTML   = headingFailureText;
    introPara.innerHTML = paraFailureText;

    successInfo.setAttribute("hidden", "hidden");
    successInfo.setAttribute("style", "display:none");    

    responseDetails.removeAttribute("hidden");
    responseDetails.setAttribute("style", "");    

    responseCode.innerHTML = data.code;
    responseText.innerHTML = data.info;
  }
// } 

// window.onload = handleBackendResponse; 
