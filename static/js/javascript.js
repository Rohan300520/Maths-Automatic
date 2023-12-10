'use strict'

const appid = [
	'L93VTH-WGGL6WL8RJ'
]

const corsProxy = `https://lin2jing4-cors-${new Date().getDay()}.herokuapp.com/`

const fixedEncodeURI = string =>
    encodeURIComponent(string)
    .replace(/[-_.!~*'()]/g, char => '%' + char.charCodeAt(0).toString(16))

window.onhashchange = _ => {
    input.focus()
    input.value = decodeURIComponent(location.hash.slice(1))
}

window.onhashchange()

function query(){
    pods.innerHTML = loading1.innerHTML
    alert("Hello");
    $.ajax({
        url: '/solve',
        type: 'POST',
        data: { equation: input.value },
        success: function(result) {
            //$('#result').text(result);
            const response = result;
        },
        error: function(xhr, status, error) {
            alert("An error occurred while processing your request. Please try again later.");
        }
    });
    //const response = await fetch(url.replaceAll(' ', ''))
    alert(response);
    const xml = response.text()
    pods.innerHTML = xml
        //.replaceAll('plaintext', 'pre')
        .replaceAll('info', 'div')
        .replaceAll('state', 'meta')
    pods.querySelectorAll('metas > meta')
        .forEach(node => node.remove())
    pods.innerHTML = pods.innerHTML
        .replaceAll('metas', 'p')
        .replaceAll('metalist', 'select')
        .replaceAll('meta', 'option')
    pods.querySelectorAll('pod')
        .forEach(node => node.innerHTML = `<h2> ${node.title} </h2>` + node.innerHTML)
    pods.querySelectorAll('subpod[title="Possible intermediate steps"]')
        .forEach(node => node.innerHTML = `<details> ${node.innerHTML} </details>`)
    pods.querySelectorAll('subpod details')
        .forEach(node => node.innerHTML = '<summary> <b> Step-by-step Solution </b> </summary>' + node.innerHTML)
    pods.querySelectorAll('option')
        .forEach(node => node.text = node.getAttribute('name'))
    pods.querySelectorAll('select')
        .forEach(node => node.value = node.getAttribute('value'))
    pods.querySelectorAll('select')
        .forEach(node => node.onchange = event => query(event.target.value.replaceAll(' ', '+')))
}

form.onsubmit = async event => {
    event.preventDefault()
    query()
}

if (input.value) query()
else fetch(corsProxy)

example.onchange = async _ => {
    const url = `
        ${corsProxy} wolframalpha.com/examples/
        StepByStep ${example.value} -content.html
    `
    const response = await fetch(url.replaceAll(' ', ''))
    const html = await response.text()
    pods.innerHTML = html
        .replaceAll(/".*?"/g, href => href
        .replaceAll('/input/?i=', '#')
        .replaceAll('&amp;lk=3', '')
        .replaceAll('+', ' '))
    pods.querySelector('a').remove()
    example.value = 'Examples'
}

checkbox.onclick = _ => {
    body.classList.toggle('dark-theme')
    localStorage.setItem('dark-theme',    body.classList.contains('dark-theme').toString())
}

if (localStorage.getItem('dark-theme') != body.classList.contains('dark-theme').toString())
    checkbox.click()
