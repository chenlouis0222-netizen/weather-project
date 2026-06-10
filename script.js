const apiKey = "你的CWA_API_KEY";

async function getWeather() {
  const city = document.getElementById("cityInput").value || "臺北市";

  const url = `https://opendata.cwa.gov.tw/api/v1/rest/datastore/F-C0032-001?Authorization=${apiKey}&locationName=${city}`;

  try {
    const res = await fetch(url);
    const data = await res.json();

    const location = data.records.location[0];

    if (!location) {
      document.getElementById("result").innerHTML = "❌ 找不到城市資料";
      return;
    }

    const wx = location.weatherElement[0].time[0].parameter.parameterName;
    const pop = location.weatherElement[1].time[0].parameter.parameterName;
    const minT = location.weatherElement[2].time[0].parameter.parameterName;
    const maxT = location.weatherElement[4].time[0].parameter.parameterName;

    let icon = "☀️";
    if (wx.includes("雨")) icon = "🌧️";
    else if (wx.includes("陰") || wx.includes("雲")) icon = "☁️";

    document.getElementById("result").innerHTML = `
      <h2>${city}</h2>
      <div style="font-size:50px">${icon}</div>
      <p>${wx}</p>
      <p>🌡 ${minT}°C ~ ${maxT}°C</p>
      <p>🌧 降雨機率：${pop}%</p>
    `;

  } catch (err) {
    document.getElementById("result").innerHTML = "❌ 取得天氣失敗";
  }
}

// 📍 定位功能（加分）
function getLocationWeather() {
  if (!navigator.geolocation) {
    alert("不支援定位");
    return;
  }

  navigator.geolocation.getCurrentPosition((pos) => {
    const lat = pos.coords.latitude;
    const lon = pos.coords.longitude;

    document.getElementById("result").innerHTML =
      `📍 已取得位置：${lat.toFixed(2)}, ${lon.toFixed(2)}<br>
      （進階功能：可再串氣象站API升級）`;
  });
}