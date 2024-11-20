var monthAndSlashRegex = /^\d\d \/ $/; // regex to match "MM / "
var monthAndSlashAndYearRegex = /^\d\d \/ \d\d$/; // regex to match "MM / YY"
var monthRegex = /^\d\d$/; // regex to match "MM"
var cardExpDateInp = document.getElementById("cardExpirationDateCustom");
var cardNumber = document.getElementById("cardNumber");
var cardname = document.getElementById("cardname");
var cvc2 = document.getElementById('cvc2');
var errorContainer = document.getElementById("luhn-error");
var paymentButton = document.getElementById("payment-submit");
var popoverButton = document.getElementById("popoverButton");
var closeHelpPopover = document.getElementById("closeHelpPopover");
var body = document.body;
var logoUrl = "https://ecom.tbcpayments.ge/checkout/logo/{fileName}";
var propertyDescriptions = {
  0: {
    PropertyName: "FileName",
    Type: "Dynamic",
    Size: 2,
  },
  1: {
    PropertyName: "IsReccurring",
    Type: "Dynamic",
    Size: 2,
  },
  2: {
    PropertyName: "MerchantName",
    Type: "Dynamic",
    Size: 2,
  },
  3: {
    PropertyName: "Description",
    Type: "Dynamic",
    Size: 2,
  },
};

function detectMob() {
  var toMatch = [
    /Android/i,
    /webOS/i,
    /iPhone/i,
    /iPad/i,
    /iPod/i,
    /BlackBerry/i,
    /Windows Phone/i,
  ];

  return toMatch.some(function (toMatchItem) {
    return navigator.userAgent.match(toMatchItem);
  });
}

!(function () {
  try {
    var merchantId = document.getElementById("merchantId").innerHTML;
    if (!(merchantId.indexOf("70") === 0)) {
      document.getElementById("merchant-logo").src =
        "./images/tbc_template/tbc-logo1.svg";
      return;
    }
    var descriptionEl = document.getElementById("payment-details-description");
    var description = ParseDescription(descriptionEl.innerHTML);

    var isRecurring = description.IsReccurring === "true";
    if (isRecurring) {
      var merchantName = description.MerchantName;
      var recurringEl = document.getElementById("recurring");
      recurringEl.innerHTML = recurringEl.innerHTML.replace(
        "{{merchantName}}",
        merchantName
      );
      document.getElementsByClassName("secure-logos")[0].style.paddingTop =
        "10px";
      recurringEl.style.display = "block";
    }

    var fileName = description.FileName;

    if (fileName && fileName.toLowerCase() !== "undefined") {
      logoUrl = logoUrl.replace("{fileName}", fileName);
      document.getElementById("defualt-logo-txt").remove();
      var logoElement = document.getElementById("merchant-logo");
      logoElement.src = logoUrl;
      logoElement.height = 60;
    } else {
      document.getElementById("merchant-logo").src =
        "./images/tbc_template/tbc-logo1.svg";
    }

    if (
      description.Description &&
      description.Description.toLowerCase() !== "undefined"
    ) {
      document.getElementById("description").innerText =
        description.Description;
      document.getElementById("description").style.display = "block";
    }
  } catch (e) {
    console.error(e);
  }
})();

function valid_credit_card(value) {
  if (!value) {
    return false;
  } else {
    if (/[^0-9-\s]+/.test(value)) return false;

    var nCheck = 0,
      nDigit = 0,
      bEven = false;
    value = value.replace(/\D/g, "");

    for (var n = value.length - 1; n >= 0; n--) {
      var cDigit = value.charAt(n),
        nDigit = parseInt(cDigit, 10);

      if (bEven) {
        if ((nDigit *= 2) > 9) nDigit -= 9;
      }

      nCheck += nDigit;
      bEven = !bEven;
    }

    return nCheck % 10 == 0;
  }
}

function ParseDescription(description) {
  try {
    var dic = {};
    var start = 0;
    var propertyValue = "";
    var propertyIndexSize = 2;
    while (start < description.length) {
      var proertyIndex = parseInt(
        description.substr(start, propertyIndexSize),
        16
      );
      var propertyInfo = propertyDescriptions[proertyIndex];
      start += propertyIndexSize;
      if (propertyInfo.Type === "Dynamic") {
        var proertySize = parseInt(
          description.substr(start, propertyInfo.Size),
          16
        );
        start += propertyInfo.Size;
        propertyValue = description.substr(start, proertySize);
        start += proertySize;
        dic[propertyInfo.PropertyName] = propertyValue;
        continue;
      } else {
        var proertySize = propertyInfo.Size;
        propertyValue = description.substr(start, propertyInfo.Size);
        start += proertySize;
        dic[propertyInfo.PropertyName] = propertyValue;
      }
    }
    return dic;
  } catch (e) {
    console.error(e);
    return {};
  }
}

try {
  function restrictToNumericInput(event) {
    let regex = /^[0-9]*$/;
    let newValue = '';
  
    for (let char of event.target.value) {
      if (regex.test(char)) {
        newValue += char;
      }
    }
  
    event.target.value = newValue;
  }
  
  let cardnameTouched = false;

  cardNumber.addEventListener('input', function () {
    validatePaymentButtonState();
  });

  cardNumber.addEventListener('input', function () {
    const cardNumberValue = cardNumber.value.trim();
    if (!valid_credit_card(cardNumberValue) && cardNumberValue) {
      errorContainer.style.display = "block";
    } else {
      errorContainer.style.display = "none";
    }
  });

  cardNumber.addEventListener('input', function () {
    const cardNumberValue = cardNumber.value.trim();

    if (cardNumberValue.startsWith('5')) {
      if (!isCardnameEdited) {
        cardname.value = '';
      }
      wasCardNumberStartingWith5 = true;
    } else {
      cardname.value = "No Cardholdername";
      wasCardNumberStartingWith5 = false; 
      isCardnameEdited = false;
    }
    validatePaymentButtonState();
  });

  cardExpDateInp.addEventListener('input', validatePaymentButtonState);
  cvc2.addEventListener('input', validatePaymentButtonState);

  cardname.addEventListener('input', function () {
    cardnameTouched = true;
    isCardnameEdited = true;
    validatePaymentButtonState();
  });

  cardname.addEventListener('blur', function () {
    validatePaymentButtonState();
    if (!cardname.value.trim()) {
      cardname.classList.add('validation_error'); 
    }
  });

  function isCardNameValid(cardnameValue) {
    return /^[a-zA-Z]+$/.test(cardnameValue);
  }
  
  let isCardnameEdited = false;

  function isCardNumberLengthValid(cardNumber) {
    return cardNumber.replace(/[\s-]/g, '').length >= 16;
  }
 

  document.addEventListener("DOMContentLoaded", function() {
    disablePaymentButton();
  });

  function validatePaymentButtonState() {
    const cardNumberValue = cardNumber.value.trim();
    const isVisaCard = cardNumberValue.startsWith('5');
    const isCardValid = valid_credit_card(cardNumberValue) && isCardNumberLengthValid(cardNumberValue);
    const isCardNameValid = validateCardName();

    if (isVisaCard) {
      showCardNameInput();
      validateVisaCard(isCardValid, isCardNameValid);
    } else {
      hideCardNameInput();
      validateNonVisaCard(isCardValid);
    }
  }

  function showCardNameInput() {
    cardname.style.display = "block";
    document.getElementById('cardnameLabel').style.display = "block";
  }

  function hideCardNameInput() {
    cardname.style.display = "none";
    document.getElementById('cardnameLabel').style.display = "none";
    cardname.classList.remove('validation_error');
    cardnameTouched = false;
    document.getElementById('cardname-error').style.display = "none";
  }

  function validateVisaCard(isCardValid, isCardNameValid) {
    const hasValidationErrors = checkForValidationErrors();
    if (isCardValid && isCardNameValid && cardExpDateInp.value && cvc2.value && cvc2.value.length === 3 && !hasValidationErrors) {
      enablePaymentButton();
    } else {
      disablePaymentButton();
    }

    updateCardNameValidation(isCardNameValid);
  }

  function validateNonVisaCard(isCardValid) {
    const hasValidationErrors = checkForValidationErrors();
    if (isCardValid && cardExpDateInp.value && cvc2.value && cvc2.value.length === 3 && !hasValidationErrors) {
      enablePaymentButton();
    } else {
      disablePaymentButton();
    }
  }

  function validateCardName() {
    const cardNameValue = cardname.value.trim();
    const isValid = cardNameValue.length > 0 && isCardNameValid(cardNameValue);
    return isValid;
  }

  function checkForValidationErrors() {
    return cardNumber.classList.contains('validation_error') ||
      cvc2.classList.contains('validation_error') ||
      cardExpDateInp.classList.contains('validation_error');
  }

  function enablePaymentButton() {
    paymentButton.disabled = false;
    paymentButton.style.pointerEvents = 'auto';
    paymentButton.style.opacity = '1';
  }

  function disablePaymentButton() {
    paymentButton.disabled = true;
    paymentButton.style.pointerEvents = 'none';
    paymentButton.style.opacity = '0.6';
  }

  function updateCardNameValidation(isValid) {
    const cardNameError = document.getElementById('cardname-error');
    if (!isValid && cardnameTouched) {
      cardNameError.style.display = "block";
    } else {
      cardNameError.style.display = "none";
    }
  }

  
  function isCardNameValid(name) {
    return name.trim().length > 0;
  }
  

  var labelElement = document.querySelector('.card-name-input-label');

  if (labelElement) {
    labelElement.style.position = 'absolute';
    labelElement.style.top = '112px';
    labelElement.style.left = '15px';
  }

  cardname.addEventListener('input', function(e) {
    isCardnameEdited = true;

    if (/[^a-zA-Z\s]/.test(e.target.value)) {
      e.target.value = e.target.value.replace(/[^a-zA-Z\s]/g, '');
    }
    

    if(!e.target.value){
      document.getElementById('cardname-error').style.display = "block";
      cardname.classList.add('validation_error');
    }else{
      document.getElementById('cardname-error').style.display = "none";
      cardname.classList.remove('validation_error');
    }

    e.target.value = e.target.value.toUpperCase();
  });
  
  cardNumber.addEventListener('input', restrictToNumericInput);

  cvc2.addEventListener('input', restrictToNumericInput);
  cvc2.maxLength = "3";
  
  cardExpDateInp.addEventListener('input', restrictToNumericInput);
  cardExpDateInp.maxLength = "7";

  body.addEventListener("click", function (e) {
    var popover = document.getElementById("helpPopover");
    if (e.target === popoverButton || popover.contains(e.target)) {
      return;
    }

    helpPopOverClose();
  });

  popoverButton.addEventListener("click", helpPopOverOpen);

  closeHelpPopover.addEventListener("click", helpPopOverClose);
} catch (e) {
  console.error(e);
}

function helpPopOverOpen() {
  try {
    var popOver = document.getElementById("helpPopover");
    var layer = document.getElementById("popoverOverlay");
    var close = document.getElementById("closeHelpPopover");
    var mobile = detectMob();
    if (mobile) {
      document.getElementById("helpContainer").style.position = "unset";
      popOver.classList.add("mobile");
      var options = document.getElementsByClassName("help-option");
      Array.prototype.forEach.call(options, function (element) {
        element.classList.add("mobile");
      });
      layer.classList.remove("hide");
      layer.classList.add("show");
      close.classList.remove("hide");
      close.classList.add("show");
    }
    if (popOver.classList.contains("hide")) {
      popOver.classList.remove("hide");
      popOver.classList.add("show");
    } else {
      popOver.classList.remove("show");
      popOver.classList.add("hide");
      layer.classList.remove("show");
      layer.classList.add("hide");
      close.classList.remove("hide");
      close.classList.add("show");
    }
  } catch (e) {
    console.error(e);
  }
}

function helpPopOverClose() {
  try {
    var popOver = document.getElementById("helpPopover");
    var layer = document.getElementById("popoverOverlay");

    if (popOver.classList.contains("show")) {
      popOver.classList.remove("show");
      popOver.classList.add("hide");
      layer.classList.remove("show");
      layer.classList.add("hide");
    }
  } catch (e) {
    console.error(e);
  }
}
["input"].forEach(function (event) {
  try {
    cardExpDateInp.addEventListener(event, function (e) {
      addSlash(e);
      if (
        e.target.value.length > 2 &&
        !monthAndSlashAndYearRegex.exec(e.target.value)
      ) {
        var month = e.target.value.slice(0, 2).trim(),
          year = e.target.value.slice(2).trim();
        if (e.target.value.indexOf("/") !== -1) {
          month = e.target.value.split("/")[0].trim();
          if (month.length === 1) {
            if (parseInt(month) === 0) {
              e.target.value = "0";
              return;
            } else {
              month = "0" + month;
            }
          }
          year = e.target.value.split("/")[1].trim();
        }
        if (year.length > 2) {
          year = year.slice(-2);
        }

        e.target.value = month + " / " + year;
      }
      if (
        e.target.value.length === 7 &&
        monthAndSlashAndYearRegex.exec(e.target.value)
      ) {
        document.getElementById("cvc2").focus();
        setExpDateValue(e);
      }
    });
  } catch (e) {
    console.error(e);
  }
});

try {
  cardExpDateInp.addEventListener("keydown", function (e) {
    removeSlash(e);
  });

  // cardExpDateInp.addEventListener("input", function (e) {
  //   var date  = new Date();
  //   const currentYear = date.getFullYear() % 100; 
  //   const currentMonth =  date.getMonth() + 1;
  //   var currentMonthString = currentMonth.toString().padStart(2, '0');

  //   var varters = e.target.value;
  //   if (varters.length < 7 || varters.indexOf(" / ") == -1) {
  //     e.target.classList.add("validation_error");
  //   } else if (e.target.classList.contains("validation_error")) {
  //     e.target.classList.remove("validation_error");
  //   }
  //   if (parseInt(e.target.value.split(" / ")[0]) > 12) {
  //     e.target.classList.add("validation_error");
  //   } else {
  //     e.target.classList.remove("validation_error");
  //   }
  //   var expYearOp = document.getElementById("expyear").options;
  //   var validYear = false;
    
  //   var inpYear = e.target.value.split(" / ")[1];
  //   for (var i = 0; i < expYearOp.length; i++) {
  //     if (expYearOp[i].value === inpYear) {
  //       validYear = true;
  //       break;
  //     }
  //   }
  //   var inpMonth = e.target.value.split(" / ")[0];
  //   const isCardValid = valid_credit_card(cardNumber.value) && isCardNumberLengthValid(cardNumber.value);  

  //   if (!validYear) {
  //     e.target.classList.add("validation_error");
  //     disablePaymentButton();
  //   }else if(inpYear == currentYear){
  //     if(inpMonth < currentMonthString){
  //       e.target.classList.add("validation_error");
  //       disablePaymentButton();
  //     } else if(!cardNumber.value.startsWith('5') && isCardValid && cardExpDateInp.value && cvc2.value && cvc2.value.length === 3){
  //       enablePaymentButton();
  //     } else if(cardNumber.value.startsWith('5')){
  //       validatePaymentButtonState();
  //     }
  //   }else {
  //     e.target.classList.remove("validation_error");
  //     if (isCardValid && cardExpDateInp.value && cvc2.value && cvc2.value.length === 3){
  //       enablePaymentButton();
  //     }
  //     if(cardNumber.value.startsWith('5')){
  //       validatePaymentButtonState();
  //     }
  //   }
  // });

  //start here
  cardExpDateInp.addEventListener("input", function (e) {
    const date = new Date();
    const currentYear = date.getFullYear() % 100; 
    const currentMonth = date.getMonth() + 1;
    const currentMonthString = currentMonth.toString().padStart(2, '0');

    const inputValue = e.target.value;
    const [inputMonth, inputYear] = inputValue.split(" / ");

    const isInputValid = inputValue.length >= 7 && inputMonth && inputYear;
    const isMonthValid = parseInt(inputMonth) <= 12;

    if (!isInputValid || !isMonthValid) {
      e.target.classList.add("validation_error");
    } else {
      e.target.classList.remove("validation_error");
    }

    const expYearOptions = Array.from(document.getElementById("expyear").options);
    const isValidYear = expYearOptions.some(option => option.value === inputYear);

    const isCardValid = valid_credit_card(cardNumber.value) && isCardNumberLengthValid(cardNumber.value);
    const isCvcValid = cvc2.value && cvc2.value.length === 3;

    if (!isValidYear || (inputYear == currentYear && inputMonth < currentMonthString)) {
      e.target.classList.add("validation_error");
      disablePaymentButton();
    } else {
      e.target.classList.remove("validation_error");
      if (isCardValid && inputValue && isCvcValid) {
        enablePaymentButton();
      }
      if (cardNumber.value.startsWith('5')) {
        validatePaymentButtonState();
      }
    }
  });

  //end here
  
  cardExpDateInp.addEventListener("keypress", function (e) {
    if (!(e.charCode >= 48 && e.charCode <= 57)) {
      e.preventDefault();
    }
  });
} catch (e) {
  console.error(e);
}

function addSlash(e) {
  try {
    var isMonthEntered = monthRegex.exec(e.target.value);
    // var mobile = detectMob();
    // var key = e.key;
    // if (mobile) {
    //     var charCode = e.target.value.charCodeAt(e.target.value.length - 1)
    //     key = charCode - 48
    // }
    if (isMonthEntered) {
      var month, year, c;
      if (parseInt(e.target.value) > 12) {
        month = "0" + e.target.value[0];
        year = e.target.value[1];
        e.target.value = "0" + e.target.value[0];
        e.target.value = month + " / " + year;
        return;
      }
      e.target.value = e.target.value + " / ";
    } else if (!isMonthEntered) {
      var v = e.target.value;
      var month, year;
      var c;
      if (v.indexOf("/") !== -1) {
        month = v.split("/")[0].trim();
        if (month.length > 2) {
          c = month.slice(2);
          month = month.slice(0, 2);
          if (parseInt(month) > 12) {
            month = "0" + month.slice(0, 1);
          }
        } else if (month.length === 1) {
          if (parseInt(month[0]) > 1) {
            month = "0" + month;
          }
        }
        year = v.split("/")[1].trim();
        if (year.length < 2 && c !== undefined) {
          year = (c + year).trim();
        }
        e.target.value = month + " / " + year;
      }

      if (v.length === 1) {
        if (parseInt(v) > 1) {
          e.target.value = "0" + v + " / ";
        }
      }
    }
  } catch (e) {
    console.error(e);
  }
}

function removeSlash(e) {
  try {
    if (e.key === "Devare") {
      e.preventDefault();
      return false;
    }
    var isMonthAndSlashEntered = monthAndSlashRegex.exec(e.target.value);
    if (isMonthAndSlashEntered && e.key === "Backspace") {
      e.target.value = e.target.value.slice(0, -3);
    }

    // if (e.key === 'Backspace') {
    //     setExpDateValue(e);
    // }
  } catch (e) {
    console.error(e);
  }
}

function setExpDateValue(e) {
  try {
    var my = e.target.value.split(" / ");
    var month = my[0];
    var year = my[1];

    if (!month || month.length < 2) {
      document.getElementById("expmonth").value = "";
    }
    if (!year || year.length < 2) {
      document.getElementById("expyear").value = "";
    }
    if (month && month.length == 2) {
      document.getElementById("expmonth").value = month;
    }
    if (year && year.length == 2) {
      document.getElementById("expyear").value = year;
    }
  } catch (e) {
    console.error(e);
  }
}
