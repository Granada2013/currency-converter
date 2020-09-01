"use strict"

const container = document.querySelector('.box'),
      form = document.querySelector('form'),
      inputSum = document.querySelector('#input__sum'),
      convertFrom = document.querySelector('#currency_from'),
      convertTo = document.querySelector('#currency_to'),
      resultSum = document.createElement('div');


fetch('https://www.cbr-xml-daily.ru/daily_json.js')
  .then(response => response.json())
  .then(data => {
    const currDate = data.Date.split('T'),
          prevDate = data.PreviousDate.split('T');

    container.hidden = false;
    document.querySelector('#curr_date').textContent = currDate[0];
    document.querySelector('#prev_date').textContent = prevDate[0];

    document.querySelector('#usd_val_prev').textContent = `${data.Valute.USD.Previous}₽`;
    document.querySelector('#usd_val_curr').textContent = `${data.Valute.USD.Value}₽`;

    if (data.Valute.USD.Previous > data.Valute.USD.Value) {
      document.querySelectorAll('.currency__sign')[1]
      .insertAdjacentHTML('beforeend', "<img class='ml-2' src='icons/down-arrow.svg' width='20x'>");
    } else if (data.Valute.USD.Previous < data.Valute.USD.Value) {
      document.querySelectorAll('.currency__sign')[1]
      .insertAdjacentHTML('beforeend', "<img class='ml-2' src='icons/up-arrow.svg' width='20x'>");
    }

    document.querySelector('#eur_val_prev').textContent = `${data.Valute.EUR.Previous}₽`;
    document.querySelector('#eur_val_curr').textContent = `${data.Valute.EUR.Value}₽`;

    if (data.Valute.EUR.Previous > data.Valute.EUR.Value) {
      document.querySelectorAll('.currency__sign')[2]
      .insertAdjacentHTML('beforeend', "<img class='ml-2' src='icons/down-arrow.svg' width='20x'>");
    } else if (data.Valute.EUR.Previous < data.Valute.EUR.Value) {
      document.querySelectorAll('.currency__sign')[2]
      .insertAdjacentHTML('beforeend', "<img class='ml-2' src='icons/up-arrow.svg' width='20x'>");
    }

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
    });

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
  }).catch(error => {
      document.querySelector('.error_screen').hidden = false;
    });
