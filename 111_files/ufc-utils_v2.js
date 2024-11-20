function checkCurdNumber(){
	var letters = document.getElementById('cardNumber').value.length;
	if (letters == 16) {
		document.getElementById('expmonth').focus();
	}
}

function checkExpMonth(){
	var letters2 = document.getElementById('expmonth').value.length;
	if (letters2 == 2){
		document.getElementById('expyear').focus();
	}
}
function checkExpYear(){
	var letters2 = document.getElementById('expyear').value.length;
	if (letters2 == 2){
		document.getElementById('cvc2').focus();
	}
}
function setOnKeyUpEvent(){
	document.getElementById('cardNumber').setAttribute('onKeyUp','checkCurdNumber()');
	document.getElementById('expmonth').setAttribute('onKeyUp','checkExpMonth()');
	document.getElementById('expyear').setAttribute('onKeyUp','checkExpYear()');
}
function setClass(elementId, className){
	document.getElementById(elementId).className =className; 
}
function enterOnlyNumber(evt) {
	var theEvent = evt || window.event;
	var key = theEvent.keyCode || theEvent.which;
	key = String.fromCharCode(key);
	var regex = /[0-9]|\./;
	if( !regex.test(key) ) {
		theEvent.returnValue = false;
		if(theEvent.preventDefault){
			theEvent.preventDefault();
		}
	}
}
function validateLength(id,length){
	var letters = document.getElementById(id).value.length;
	if (letters != length || getCreditCardType() == false) {
		document.getElementById(id).className += " validation_error";
	}
}
function getCreditCardType()
{

  var inputNumber = document.getElementById("cardNumber").value;
/// --- Maestro
  if (/^(5018|5020|5038|5612|5893|6304|6759|6761|6762|6763|0604|6390)/.test(inputNumber))
  {
	document.getElementById("input-card-type-image-mastercard").style.display = "none";
	document.getElementById("input-card-type-image-visa").style.display = "none";
	document.getElementById("input-card-type-image-maestro").style.display = "block";
	return true;
  }
// /// --- Mastercard
  else if (/^5\d*/.test(inputNumber))
  {
	document.getElementById("input-card-type-image-mastercard").style.display = "block";
	document.getElementById("input-card-type-image-visa").style.display = "none";
	document.getElementById("input-card-type-image-maestro").style.display = "none";
	return true;
  }
// /// --- Visa
  else if (/^4/.test(inputNumber))
  {
	document.getElementById("input-card-type-image-mastercard").style.display = "none";
	document.getElementById("input-card-type-image-visa").style.display = "block";
	document.getElementById("input-card-type-image-maestro").style.display = "none";
	return true;
	} 
// /// -- Length not enough
	else if(inputNumber.length<16)
	{
	document.getElementById("input-card-type-image-mastercard").style.display = "none";
	document.getElementById("input-card-type-image-visa").style.display = "none";
	document.getElementById("input-card-type-image-maestro").style.display = "none";
	return false;
  }
}		

function showInfoPopoverToggle(el){

		var popoverElement = el.getElementsByClassName("popover-container")[0];
		if (popoverElement.style.display === "none") {
				popoverElement.style.display = "block";
		} else {
			popoverElement.style.display = "none";
		}
}
function showInfoPopoverShow(el){
	var popoverElement = el.getElementsByClassName("popover-container")[0];
			popoverElement.style.display = "block";
}
function showInfoPopoverHide(el){
	var popoverElement = el.getElementsByClassName("popover-container")[0];
		popoverElement.style.display = "none";
}

function onBodyLoad(){
	document.getElementById('cardNumber').focus();
	document.getElementById('cardNumber').setAttribute('onKeyUp','checkCurdNumber()');
	document.getElementById('cardNumber').setAttribute('onkeypress','enterOnlyNumber(event)');
	document.getElementById('cardNumber').setAttribute('onfocus','setClass(\'cardNumber\',\'input_cardn\')');
	document.getElementById('cardNumber').setAttribute('onchange','getCreditCardType()');
	document.getElementById('cardNumber').setAttribute('oninput','getCreditCardType()');
	document.getElementById('cardNumber').setAttribute('onblur','validateLength(\'cardNumber\',16)');

	document.getElementsByClassName('popover-info')[0].setAttribute('ontouchend','showInfoPopoverToggle(this)');
	document.getElementsByClassName('popover-info')[0].setAttribute('onmouseenter','showInfoPopoverShow(this)');
	document.getElementsByClassName('popover-info')[0].setAttribute('onmouseleave','showInfoPopoverHide(this)');
	document.getElementsByClassName('popover-info')[1].setAttribute('ontouchend','showInfoPopoverToggle(this)');
	document.getElementsByClassName('popover-info')[1].setAttribute('onmouseenter','showInfoPopoverShow(this)');
	document.getElementsByClassName('popover-info')[1].setAttribute('onmouseleave','showInfoPopoverHide(this)');
	document.getElementsByClassName('popover-info')[2].setAttribute('ontouchend','showInfoPopoverToggle(this)');
	document.getElementsByClassName('popover-info')[2].setAttribute('onmouseenter','showInfoPopoverShow(this)');
	document.getElementsByClassName('popover-info')[2].setAttribute('onmouseleave','showInfoPopoverHide(this)');
	document.addEventListener('touchend',function(e){
		if(e.srcElement.classList[0] != "popover-info"){
		document.getElementsByClassName("popover-container")[0].style.display = "none";
		document.getElementsByClassName("popover-container")[1].style.display = "none";
		document.getElementsByClassName("popover-container")[2].style.display = "none";
		var popover0 = document.getElementsByClassName("popover-info")[0];
		popover0.style.backgroundColor = "#FFFFFF";
		popover0.style.color = "#00a3e0";
		var popover1 = document.getElementsByClassName("popover-info")[1];
		popover1.style.backgroundColor = "#FFFFFF";
		popover1.style.color = "#00a3e0";
		var popover2 = document.getElementsByClassName("popover-info")[2];
		popover2.style.backgroundColor = "#FFFFFF";
		popover2.style.color = "#00a3e0";
		}
	});

	setClass('cardNumber','input_cardn');
	document.getElementById('expmonth').setAttribute('onChange','checkExpMonth()');
	setClass('expmonth','select_m');
	document.getElementById('expyear').setAttribute('onChange','checkExpYear()');
	setClass('expyear','select_y');
	document.getElementById('cvc2').setAttribute('onkeypress','enterOnlyNumber(event)');
	document.getElementById('cvc2').setAttribute('onblur','validateLength(\'cvc2\',3)');
	document.getElementById('cvc2').setAttribute('onfocus','setClass(\'cvc2\',\'input_cvc\')');
	setClass('cvc2','input_cvc');
	document.getElementById('cvc2').setAttribute('maxlength','3');
}