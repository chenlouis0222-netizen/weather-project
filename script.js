function setIOSBackground(type) {
  const body = document.body;

  if (type === "sun") {
    body.style.background = "linear-gradient(180deg,#56ccf2,#2f80ed)";
  }
  if (type === "rain") {
    body.style.background = "linear-gradient(180deg,#4b79a1,#283e51)";
  }
  if (type === "cloud") {
    body.style.background = "linear-gradient(180deg,#bdc3c7,#2c3e50)";
  }
}

/* 🌍 天氣主功能 */
async function getWeather() {

  let city = document.getElementById("cityInput").value.trim();
  if (!city) city = "Taipei";

  document.getElementById("result").innerHTML = "⏳ 查詢中...";

  try {
    // 📍 地理轉換
    const geo = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1`
    );

    const geoData = await geo.json();

    if (!geoData.results) {
      document.getElementById("result").innerHTML = "❌ 找不到城市";
      return;
    }

    const { latitude, longitude, name, country } = geoData.results[0];

    // 🌤 天氣API
    const weatherRes = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&hourly=precipitation_probability`
    );

    const data = await weatherRes.json();

    const w = data.current_weather;
    const rain = data.hourly.precipitation_probability[0] || 0;

    // ☀️ 判斷天氣
    let icon = "☀️";
    let text = "晴天";
    let bg = "sun";

    if (w.weathercode <= 3) {
      icon = "🌤";
      text = "多雲";
      bg = "cloud";
    }
    if (w.weathercode >= 45) {
      icon = "☁️";
      text = "陰天";
      bg = "cloud";
    }
    if (w.weathercode >= 61) {
      icon = "🌧";
      text = "下雨";
      bg = "rain";
    }

    // 👕 穿搭
    let clothes = "";
    if (rain > 50) clothes = "🌂 建議帶雨傘";
    else if (w.temperature > 28) clothes = "🩳 短袖即可";
    else if (w.temperature > 20) clothes = "👕 薄長袖";
    else clothes = "🧥 建議外套";

    setIOSBackground(bg);

    // 📱 UI
    document.getElementById("result").innerHTML = `
      <h2>${name}, ${country}</h2>

      <div class="weather-icon">${icon}</div>

      <div style="font-size:28px;font-weight:600;">
        ${w.temperature}°C
      </div>

      <p>${text}</p>

      <hr>

      🌧 降雨機率：${rain}%<br>
      💨 風速：${w.windspeed} km/h<br>

      <hr>

      👕 ${clothes}
    `;

  } catch (err) {
    document.getElementById("result").innerHTML =
      "❌ API錯誤";
  }
}

/* 📍 定位 */
function getLocationWeather() {
  navigator.geolocation.getCurrentPosition((pos) => {
    const lat = pos.coords.latitude;
    const lon = pos.coords.longitude;

    document.getElementById("result").innerHTML =
      `📍 位置：${lat.toFixed(2)}, ${lon.toFixed(2)}<br>
      👉 請直接輸入城市查詢`;
  });
}