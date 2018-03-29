const submit = document.querySelector('#submit');

submit.addEventListener('click', event => {
  event.preventDefault();
  const app_name = document.querySelector('#app').value;
  const email = document.querySelector('#email').value;

  fetch('/authorize', {
    headers: {
      'content-type': 'application/json'
    },
    body: JSON.stringify({ app_name, email }),
    method: 'POST'
  })
    .then(response => response.json())
    .then(json => {
      append(json);
    });
});

const append = token => {
  const container = document.querySelector('#token');
  const parent = document.createElement('div');
  parent.setAttribute('class', 'card');
  parent.innerHTML = `
  <h2>Token: ${token.token}</h2>
  `;
  container.append(parent);
};
