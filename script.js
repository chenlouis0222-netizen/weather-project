async function getWeather(inputCity) {

  let lat, lon, name;

  const city = inputCity || document.getElementById("cityInput").value || "Taipei";

  document.getElementById("result").innerHTML = "⏳ 載入中...";

  // 🌍 地名轉座標（全球可用）
  const geoRes = await fetch(
    `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1&language=zh`
  );

  const geoData = await geoRes.json();

  if (!geoData.results) {
    document.getElementById("result").innerHTML = "❌ 找不到城市";
    return;
  }

  lat = geoData.results[0].latitude;
  lon = geoData.results[0].longitude;
  name = geoData.results[0].name;

  // 🌦 天氣 API
  const weatherRes = await fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}
    &current_weather=true
    &daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max
    &timezone=auto`
  );

  const data = await weatherRes.json();

  const w = data.current_weather;
  const d = data.daily;

  // icon
  let icon = "☀️";
  if (w.weathercode >= 45) icon = "☁️";
  if (w.weathercode >= 51) icon = "🌧️";

  // 穿搭建議
  let clothes = "短袖 👕";
  if (w.temperature < 20) clothes = "薄外套 🧥";
  if (w.temperature < 15) clothes = "厚外套 🧥🧥";

  // 7天
  let forecastHTML = "";
  for (let i = 0; i < 7; i++) {
    forecastHTML += `
      <div class="day">
        <div>${d.time[i].slice(5)}</div>
        <div>🌤</div>
        <div>${d.temperature_2m_max[i]}°</div>
        <div>${d.temperature_2m_min[i]}°</div>
      </div>
    `;
  }

  document.getElementById("result").innerHTML = `
    <h2>${name}</h2>

    <div style="font-size:60px">${icon}</div>

    <h2>${w.temperature}°C</h2>

    <p>💨 風速：${w.windspeed} km/h</p>
    <p>👕 建議：${clothes}</p>

    <hr>

    <div class="forecast">
      ${forecastHTML}
    </div>
  `;

  // 背景
  if (w.weathercode >= 51) {
    document.body.style.background = "linear-gradient(180deg,#4b79a1,#283e51)";
  } else if (w.weathercode >= 45) {
    document.body.style.background = "linear-gradient(180deg,#bdc3c7,#2c3e50)";
  } else {
    document.body.style.background = "linear-gradient(180deg,#4facfe,#00f2fe)";
  }
}

// 📍 定位（真正可查）
function getLocationWeather() {
  document.getElementById("result").innerHTML = "📍 定位中...";

  navigator.geolocation.getCurrentPosition((pos) => {
    getWeather(`${pos.coords.latitude},${pos.coords.longitude}`);
  });
}