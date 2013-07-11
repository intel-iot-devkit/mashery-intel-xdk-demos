// *******************SET YOUR API KEY HERE*******************
// ***********************************************************

// Insert your Klout API Key here. ReadMe for more info.
var api_key ='your_api_key_here';

// ***********************************************************
// ***********************************************************

// Check if valid API Key
function check_keys(){
	var url = 'http://api.klout.com/v2/identity.json/twitter?screenName=SteveMartinToGo&key=' + api_key;
	AppMobi.device.getRemoteData(url,"GET","","displayFlashMessage","displayFlashMessage");
}

function displayFlashMessage (rawPayload) { 
  var httpStatus = '200';
  var matchString = new RegExp("code: ([0-9]{3})");
  var matchArray = rawPayload.match(matchString);
  var missingIDError = rawPayload.search("api.klout");

  if (matchArray) {
	httpStatus = matchArray[1];
  }
  else if (missingIDError > 0) {
  	httpStatus = '404';
  }

  $('#flash').show();
  if(httpStatus == '404') { 
	AppMobi.notification.alert('Profile Not Found','Oops','OK');
	reset_screen();
  } 
  else if(httpStatus == '403') { 
	AppMobi.notification.alert('Please check the Readme.md file for instructions','Invalid API Key','OK');
	$('#flash').addClass('red');
	$('#flash').html("<p class='center'><strong>Klout API Key Not Found</strong></p><p>Please see <a target='_blank' href='Readme.md'>ReadMe</a> file located in the Project directory for instructions.</p><p>(Hint: To locate your project directory, click on the <img class='middle' style='width:35px;margin-left:-5px;' src='images/project_icon.png'/> icon on the Emulator Toolbar above</p>");
  }
  else if(httpStatus == '202') { 
	AppMobi.notification.alert('Profile Not Found','Invalid ID','OK');	 
	reset_screen(); 
	} 
  else { 
	$('#flash').addClass('green');
	$('#flash').html("<p class='center green'>Valid API Key Found</p>");
  }
}

function kloutID(){	
	var search = $('#search').val();
	var url = 'http://api.klout.com/v2/identity.json/twitter?screenName=' + search + '&key=' + api_key;
	AppMobi.device.getRemoteData(url,"GET","","userInfo","displayFlashMessage");		
}

function userInfo(rawPayload){
	var data = $.parseJSON(rawPayload);
	var url = 'http://api.klout.com/v2/user.json/' + data.id + '?key=' + api_key;
	AppMobi.device.getRemoteData(url,"GET","","showUserCB","displayFlashMessage");
}


function showUserCB(rawPayload)
{
	var data = $.parseJSON(rawPayload);
	reset_screen();
	if (!data.kloutId) {
		AppMobi.notification.alert('Profile Not Found','Oops','OK');
		reset_screen();
		return false;
	}	
	var kloutId = data.kloutId;

	$("#klout-output").show();
	$("#klout-output .kloutId").html('<p class="center"><strong>Klout Profile</strong></p>');
	$("#klout-output .kloutId").append('<p>Twitter Name: @' + data.nick + '<br />Klout Score: ' + data.score.score + '<br />Score Bucket: ' + data.score.bucket + '<br />Score Deltas: ' + '<br />    &nbsp;&nbsp;Day Change: ' + data.scoreDeltas.dayChange + '<br />    &nbsp;&nbsp;Week Change: ' + data.scoreDeltas.weekChange +'<br />    &nbsp;&nbsp;Month Change: ' + data.scoreDeltas.monthChange + '</p>');
}

function reset_screen(){
	$(".output-inner").hide();
}

function errorCB(data)
{
  console.log ("GRD error "+data);
}
