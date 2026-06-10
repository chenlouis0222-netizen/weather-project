let latCache = null;
let lonCache = null;

/* 🌍 查城市 → 經緯度 */
async function getWeather(cityInput) {

  const city = cityInput || document.getElementById("cityInput").value;

  if (!city) {
    document.getElementById("result").innerHTML = "請輸入城市";
    return;
  }

  document.getElementById("result").innerHTML = "查詢中...";

  try {
    const geoRes = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1`
    );

    const geoData = await geoRes.json();

    if (!geoData.results || geoData.results.length === 0) {
      document.getElementById("result").innerHTML = "❌ 找不到城市";
      return;
    }

    const place = geoData.results[0];
    const lat = place.latitude;
    const lon = place.longitude;

    await getWeatherByLatLon(place.name, lat, lon);

  } catch (err) {
    document.getElementById("result").innerHTML = "❌ 查詢失敗";
  }
}

/* 🌤 用經緯度查天氣 */
async function getWeatherByLatLon(name, lat, lon) {

  const url =
    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`;

  const res = await fetch(url);
  const data = await res.json();

  const w = data.current_weather;

  const icon = getIcon(w.weathercode);

  document.getElementById("result").innerHTML = `
    <h2>${name}</h2>

    <div style="font-size:50px">${icon}</div>

    <div style="font-size:28px;font-weight:600;">
      ${w.temperature}°C
    </div>

    <p>風速：${w.windspeed} km/h</p>
  `;
}

/* 🌦 天氣圖示 */
function getIcon(code) {
  if (code === 0) return "☀️";
  if (code <= 3) return "☁️";
  if (code <= 48) return "🌫";
  if (code <= 67) return "🌧";
  if (code <= 77) return "🌨";
  if (code <= 82) return "🌦";
  return "⛈";
}

/* 📍 GPS */
function getLocationWeather() {

  if (!navigator.geolocation) {
    alert("不支援定位");
    return;
  }

  document.getElementById("result").innerHTML = "定位中...";

  navigator.geolocation.getCurrentPosition(async (pos) => {

    const lat = pos.coords.latitude;
    const lon = pos.coords.longitude;

    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`
    );

    const data = await res.json();

    const city =
      data.address.city ||
      data.address.town ||
      data.address.county ||
      "Unknown";

    await getWeatherByLatLon(city, lat, lon);

  }, () => {
    document.getElementById("result").innerHTML = "❌ 定位失敗";
  });
}