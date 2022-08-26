// 'use strict'

// document.addEventListener('DOMContentLoaded', function() {
//   const form = document.getElementById('form')
//   form.addEventListener('submit', formSend)

//   async function formSend(e) {
//     e.preventDefault()

//     let error = formValidate(form)
//   }

//   function formValidate(form) {
//     let error = 0
//     let formReq = document.querySelectorAll('.req')

//     for (let index = 0; index < formReq.length; index++) {
//       const input = formReq[index]
//       formRemoveError(input)

//       if(input.classList.contains('email')) {
//         if (emailTest(input)) {
//           formAddError(input)
//           error++
//         }
//       } else if (input.getAttribute('type') === 'checkbox' && input.checked === false) {
//         formAddError(input)
//         error++
//       } else {
//         if (input.value === '') {
//           formAddError(input)
//           error++
//         }
//       }
//     }
//   }
//   function formAddError(input) {
//     input.parentElement.classList.add('error')
//     input.classList.add('error')
//   }
//   function formRemoveError(input) {
//     input.parentElement.classList.remove('error')
//     input.classList.remove('error')
//   }

//   function emailTest(input) {
//     return !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,8})+$/.test(input.value)
//   }
// })




const form = document.forms["form"];
const formArr = Array.from(form);
const validFormArr = [];
const button = form.elements["button"];

formArr.forEach((el) => {
  if (el.hasAttribute("data-reg")) {
    el.setAttribute("is-valid", "0");
    validFormArr.push(el);
  }
});

form.addEventListener("input", inputHandler);
form.addEventListener("submit", formCheck);

function inputHandler({ target }) {
  if (target.hasAttribute("data-reg")) {
    inputCheck(target);
  }
}

function inputCheck(el) {
  const inputValue = el.value;
  const inputReg = el.getAttribute("data-reg");
  const reg = new RegExp(inputReg);
  if (reg.test(inputValue)) {
    el.setAttribute("is-valid", "1");
    el.style.border = "2px solid rgb(74, 185, 169)";
  } else {
    el.setAttribute("is-valid", "0");
    el.style.border = "2px solid rgb(255, 0, 0)";
  }
}

function formCheck(e) {
  e.preventDefault();
  const allValid = [];
  validFormArr.forEach((el) => {
    allValid.push(el.getAttribute("is-valid"));
  });
  const isAllValid = allValid.reduce((acc, current) => {
    return acc && current;
  });
  if (!Boolean(Number(isAllValid))) {
    alert("Incorrect!");
    return;
  }
  formSubmit();
}

async function formSubmit() {
  const data = serializeForm(form);
  const response = await sendData(data);
  if (response.ok) {
    let result = await response.json();
    alert(result.message);
    formReset();
  } else {
    alert("Error: " + response.status);
  }
}

function serializeForm(formNode) {
  return new FormData(form);
}

async function sendData(data) {
  return await fetch("../../public/email/send_mail.php", {
    method: "POST",
    body: data,
  });
}

function formReset() {
  form.reset();
  validFormArr.forEach((el) => {
    el.setAttribute("is-valid", 0);
    el.style.border = '';
    el.setAttribute('disabled', 'disabled');

    // el.style.border = "2px solid lighten(map-get($bc, 'dgray' ), 44%)";
  });
}
