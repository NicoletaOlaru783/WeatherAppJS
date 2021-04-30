const cityForm = document.querySelector('form');
const card = document.querySelector('.card');
const detail = document.querySelector('.detail');
const nextDays = document.querySelector('.nextDays');
const time = document.querySelector('img.time');
const icon = document.querySelector('.icon img');
const now = new Date();

const updateUI = (data) => {
  console.log(data);
  const cityDets = data.cityDets;
  const weather = data.weather;
  const forcast = data.forcast.DailyForecasts;
  console.log(forcast);
  //   //destructure properties
  //   const { cityDets, weather } = data;

  //Update details template
  detail.innerHTML = `
                <h5>${cityDets.EnglishName}</h5>                
                <div class="display-temp">
                    <span>${Math.round(
                      weather.Temperature.Metric.Value
                    )}&deg;C</span>
                </div>
                <div style="padding-top:10px;">${dateFns.format(
                  weather.EpochTime,
                  'dddd'
                )}</div>
                <div style="padding-bottom:10px;">${now.toLocaleString()}</div>
    `;

  //Update next 5 days details
  forcast.forEach((element) => {
    nextDays.innerHTML += `
                <div class="wrapper">
                    <div class="dayText" style="padding-top: 5px;">
                        ${dateFns.format(element.Date, 'ddd')}
                    </div>
                    <div class="dayIcon">
                      <img style="width: 70px; object-fit: none; object-position: top;" src="img/icons/${
                        element.Day.Icon
                      }.svg" alt=""> 
                    </div>                     
                    <div class="dayText" style="padding-bottom: 5px;">
                        ${Math.round(
                          (element.Temperature.Maximum.Value - 32) * (5 / 9)
                        )}&deg;C
                    </div>
                </div>`;
  });

  //update the night/day & icon images
  const iconSrc = `img/icons/${weather.WeatherIcon}.svg`;
  icon.setAttribute('src', iconSrc);

  //Ternary operator
  let timeUrl = weather.IsDayTime ? 'url(img/day2.jpg)' : 'url(img/night.jpg)';
  card.style.backgroundImage = timeUrl;

  //remove the d-none class if present
  if (card.classList.contains('d-none')) {
    card.classList.remove('d-none');
  }
};

const updateCity = async (city) => {
  const cityDets = await getCity(city);
  const weather = await getWeather(cityDets.Key);
  const forcast = await getForcast(cityDets.Key);

  return { cityDets, weather, forcast };
};

cityForm.addEventListener('submit', (e) => {
  //prevent default
  e.preventDefault();

  // get city value
  const city = cityForm.city.value.trim();
  cityForm.reset();
  nextDays.innerHTML = ``;

  //update the ui with a new city
  updateCity(city)
    .then((data) => updateUI(data))
    .catch((err) => console.log(err));

  //Save city in local storage
  localStorage.setItem('city', city);
});

//Check for city in local storage

function myFunction() {
  if (localStorage.getItem('city')) {
    updateCity(localStorage.getItem('city'))
      .then((data) => updateUI(data))
      .catch((err) => console.log(err));
  } else {
    updateCity('Copenhagen')
      .then((data) => updateUI(data))
      .catch((err) => console.log(err));
  }
}
