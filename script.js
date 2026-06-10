// 🌍 城市 → 經緯度
const cityMap = {
  "台北市": [25.03, 121.56],
  "臺北市": [25.03, 121.56],
  "桃園市": [24.99, 121.30],
  "台中市": [24.15, 120.67],
  "臺中市": [24.15, 120.67],
  "台南市": [22.99, 120.20],
  "高雄市": [22.63, 120.30]
};

// 🌤 查天氣（Open-Meteo）
async function getWeather(cityInput) {

  const city =
    cityInput ||
    document.getElementById("cityInput").value ||
    "臺北市";

  document.getElementById("result").innerHTML = "⏳ 查詢中...";

  const [lat, lon] = cityMap[city] || cityMap["臺北市"];

  const url =
    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`;

  try {
    const res = await fetch(url);
    const data = await res.json();

    const w = data.current_weather;

    // ☀️ 簡單天氣判斷
    let icon = "☀️";
    if (w.weathercode > 2) icon = "☁️";
    if (w.weathercode > 45) icon = "🌧️";

    document.getElementById("result").innerHTML = `
      <h2>${city}</h2>
      <div style="font-size:55px">${icon}</div>
      <p>🌡 溫度：${w.temperature} °C</p>
      <p>💨 風速：${w.windspeed} km/h</p>
    `;

  } catch (err) {
    console.log(err);
    document.getElementById("result").innerHTML =
      "❌ 天氣資料取得失敗";
  }
}

// 📍 GPS 定位（升級版）
function getLocationWeather() {

  document.getElementById("result").innerHTML = "📍 定位中...";

  if (!navigator.geolocation) {
    alert("不支援定位");
    return;
  }

  navigator.geolocation.getCurrentPosition((pos) => {

    const lat = pos.coords.latitude;
    const lon = pos.coords.longitude;

    document.getElementById("result").innerHTML = `
      <h3>📍 已取得位置</h3>
      <p>緯度：${lat.toFixed(2)}</p>
      <p>經度：${lon.toFixed(2)}</p>
      <p>👉 可直接輸入城市查詢天氣</p>
    `;

  }, () => {
    document.getElementById("result").innerHTML =
      "❌ 無法取得定位";
  });
}