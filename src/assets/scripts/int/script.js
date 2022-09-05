$(() => {
  initComponents()
  initDefaultEvents()
  initFields()

}) 
function initComponents () {
  const compEls = $('.js-import')
  const path = $('#js-path').val()
  for (let i = 0; i < compEls.length; i++) {
    const el = $(compEls[i])
    const name = el.data('import')
    $.get(`${path}/${name}.html`, { '_': $.now() })
    .done((data) => {
      let comp = $(data)
      const nested = path.split('/')
      const isNested = nested.length > 1
      if (isNested) {
        let tree = ''
        nested.forEach(item => tree += item === '..' ? '../' : '')
        comp = replaceNestedLinks(comp, tree, 'src')
        comp = replaceNestedLinks(comp, tree, 'href')
      }
      el.replaceWith(comp)
    })
  }
}
function initDefaultEvents () {
  formSubmitA() // Form action: CRM + TYP
  formSubmitB() // Form action: EMAIL + CRM + TYP
  clearInput()
  txtPrevent()
  numPrevent()
  toggleSwitcher()
  toggleNav()
  scrollToSection()
}
function replaceNestedLinks (comp, tree, attr) {
  const targets = comp.find(`[${attr}]`)
  if (targets.length > 0) {
    for (let i = 0; i < targets.length; i++) {
      const target = $(targets[i])
      const isExternal = target.attr(attr).split('https://').length > 1 || target.attr(attr).split('http://').length > 1
      const isReplacable = target.data('replace') !== false
      if (!isExternal && isReplacable) {
        const src = tree + target.attr(attr)
        target.attr(attr, src === '..//' ? '../' : src)
      }
    }
  }
  return comp     
}
function formSubmitA () { // Submit form CRM + TYP
  $('.js-form-submit-a').on('click tap', function (e) {
    if (validateFields()) {
      if(validatePhone()) {
        $(this).attr('disabled', 'disabled')
        $('.form').submit()
      } else {
        e.preventDefault()
        $('input[name="phoneCountryCode"], input[name="phoneNumber"]').addClass('error')
      }
    } else {      
      e.preventDefault()
    }
    // console.log(validatePhone())
  })
}
function formSubmitB () { // Submit form EMAIL + CRM + TYP
  $('.js-form-submit-b').on('click tap', function (e) {
    e.preventDefault()
    const form = $(this).parents('form')
    if (validateFields()) {
      if (validatePhone()) {
        $(this).attr('disabled', 'disabled')
        sendEmail(() => form.submit())
      } else {
        e.preventDefault()
        $('input[name="phoneCountryCode"], input[name="phoneNumber"]').addClass('error')
      }
    }
    console.log(validatePhone())
  })
}
function initFields () { // Set url link as hidden input value
  $('.js-url-link').attr('type', 'text').val(window.location.href).attr('type', 'hidden')
}
function clearInput () { // Clear input status on focus
  $('form input').on('focus change', function () {
    $(this).removeClass('error warning')
  })
}
function txtPrevent() { // Prevent numbers in field
  $(document).on('keypress', '.js-text', function (e) {
    const key = e.key
    const isNumber = key >= 0 && key <= 9
    if (isNumber) e.preventDefault();
  })
}
function numPrevent() { // Prevent chars in field
  $(document).on('keypress', '.js-numbers', function (e) {
    const key = e.key
    const allowed = $(this).data('allow') || ''
    const isNumber = key >= 0 && key <= 9
    const isAllowed = allowed.split(',').includes(key)
    if (!(isNumber || isAllowed)) e.preventDefault()
  })
}
function sendEmail (callback) { // Send email
  const email = $('input[name="email"]').val()
  const name = $('input[name="firstName"]').val()
  const surname = $('input[name="lastName"]').val()
  const lang = $('html').attr('lang')
  const url = `../public/email/send.php?email=${email}&name=${name}&surname=${surname}&language=${lang}`
  $.ajax({ url: url }).done(function() { callback() }) // form.submit()
  console.log(lang)
}
function validateFields () { // Validate fields
  const fields = $('form').find('[required]')
  let res = true
  const validate = []
  for (let i = 0; i < fields.length; i++) {
    const field = $(fields[i])
    const type = field.attr('type') 
    const val = field.val()
    switch (type) {
      case 'email':
        res = isEmail(val)
        break;
      case 'checkbox':
        res = isChecked(field)
        break;
      default:
        res = isLength(val)
    }
    validate.push(res)
    if (!res) {
      field.addClass('error')
    } else {
      field.removeClass('error')
    }
  }
  return !validate.includes(false)
}

function isLength (val) { // Check value length
  return val.length > 1
}
function isEmail (val) { // Check value is email
  const regex = new RegExp('[a-zA-Z0-9]+@[a-zA-Z]+\.[a-z]{2,3}')
  console.log(regex.test(val))
  return regex.test(val)
}
function isChecked (field) {
  return field.is(':checked')
}
function toggleSwitcher () { // Toggle language on the page
  $(document).on('click tap', '.js-switcher', function (e) {
    e.preventDefault()
    const curr = $('html').attr('lang')
    const lang = $(this).attr('href').replace('/', '')
    const href = window.location.href.split(`/${curr}/`)
    const target = `${href[0]}/${lang}/${href[1]}`
    if (lang !== curr) window.location.href = target
  })
}
function toggleNav () { // Toggle mobile navigation
  $(document).on('click tap', '.js-toggle-nav', function () {
    $('.js-toggle-nav, #nav').toggleClass('active')
  })
}

function scrollToSection () {
  $('.js-anchor-link').click(function (e) {
    e.preventDefault()
    const id = $(this).attr('href')
    const head_height = $(".header").height()
    if (document.getElementsByClassName('section-links')) {
      const sectionLinks = $('.section-links').height()
      const offsetLinks = $(id).offset().top - (head_height + sectionLinks)
      $("html, body").animate({ scrollTop: offsetLinks }, 500)
    }
    
    $('.js-toggle-nav, #nav').removeClass('active')
  })
}






// function scrollToSection () {
//   $(document).on('click tap', '.js-anchor-link', function (e) {
//     e.preventDefault()
//     const id = $(this).attr('href')
//     const sectionLinks = $('.section-links').height()
//     const head_height = $(".header").height()
//     const offset = $(id).offset().top - head_height - sectionLinks - 16
//     $('.js-toggle-nav, #nav').removeClass('active')
//     $("html, body").animate({ scrollTop: offset }, 400)
    
//   })
// }







function getSession() {
  const session = $.ajax({
    url: 'https://api.imediafile.com/phoneVerification/?initialization=true',
    async: false,
    type: "GET",
    complete: data => data.responseJSON.response
  })
  return session.responseJSON.response;
}

function isPhoneCorrect(phone) {
	const session = getSession()
  const isValid = $.ajax({
    url: `https://api.imediafile.com/phoneVerification/?session=${session}&phoneNumber=${phone}`,
    async: false,
    type: "GET",
    complete: data => data.responseJSON.is_phone_valid
  })
  return isValid.responseJSON.is_phone_valid
}

// Dummy validation on btn click
function validatePhone () {

  const fieldCode = $('input[name="phoneCountryCode"]').val()
  const fieldNumber = $('input[name="phoneNumber"]').val()
  const fullPhone = fieldCode.replace('+', '') + fieldNumber;
  return isPhoneCorrect(fullPhone) === 'true'
}





