"use strict"

const container = document.querySelector('.box'),
      form = document.querySelector('form'),
      inputSum = document.querySelector('#input__sum'),
      convertFrom = document.querySelector('#currency_from'),
      convertTo = document.querySelector('#currency_to'),
      resultSum = document.createElement('div'),
      request = new XMLHttpRequest();

request.open('GET', 'https://www.cbr-xml-daily.ru/daily_json.js');
request.send();

request.addEventListener('load', function() {
  if (request.status === 200) {
    container.hidden = false;
    const data = JSON.parse(request.response),
          currDate = data.Date.split('T'),
          prevDate = data.PreviousDate.split('T');

    document.querySelector('#curr_date').textContent = currDate[0];
    document.querySelector('#prev_date').textContent = prevDate[0];

    document.querySelector('#usd_val_prev').textContent = `${data.Valute.USD.Previous}₽`;
    document.querySelector('#usd_val_curr').textContent = `${data.Valute.USD.Value}₽`;

    document.querySelector('#eur_val_prev').textContent = `${data.Valute.EUR.Previous}₽`;
    document.querySelector('#eur_val_curr').textContent = `${data.Valute.EUR.Value}₽`;

    convertFrom.addEventListener('change', function () {
      convertTo.disabled = false;
      convertTo.options[1].hidden = false;
      convertTo.options[2].hidden = false;
      convertTo.options[3].hidden = false;

      if (this.value === 'RUB') {
        convertTo.options[1].hidden = true;
      } else {
        convertTo.options[2].hidden = true;
        convertTo.options[3].hidden = true;
      }
    })

    form.addEventListener('submit', function(event) {
      event.preventDefault();

      if (isNaN(+inputSum.value)) {
        resultSum.textContent = 'Wrong input. Allowed symbols: "0-9", "."';
        resultSum.classList.add('error_message');
        form.insertAdjacentElement('afterend', resultSum);
        return;
      }

      if (convertTo.value === convertFrom.value) {
        resultSum.textContent = (+inputSum.value).toFixed(4);
      } else {
        if (convertFrom.value === 'RUB') {
          resultSum.textContent = (+inputSum.value / data.Valute[convertTo.value].Value).toFixed(4);
        } else {
          resultSum.textContent = (+inputSum.value * data.Valute[convertFrom.value].Value).toFixed(4);
        }
      }
      resultSum.classList.add('result');
      resultSum.classList.remove('error_message');
      form.insertAdjacentElement('afterend', resultSum);
    });
  } else {
    document.querySelector('.error_screen').hidden = false;
  }
});

request.addEventListener('error', function () {
  document.querySelector('.error_screen').hidden = false;
});
