
const info = document.querySelector('#info');
const yourNameInput = document.querySelector('#username');
const messageOne = document.querySelector('.message-1');
const messageTwo = document.querySelector('.message-2');

info.addEventListener('submit', (e) => {
    e.preventDefault();

    const yourName = yourNameInput.value;

    messageOne.textContent = 'Loading..';

    const data = {
        yourName
    }

    fetch('/buscausuarios', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        response.json()
        .then((data) => {
            if (data.error) {
                messageOne.textContent = data.error;
                messageOne.textContent = "";
                console.log(data.error);
            } else {
                messageOne.textContent = yourName;
                messageTwo.textContent = data.message;
            }
        })
    })
})
