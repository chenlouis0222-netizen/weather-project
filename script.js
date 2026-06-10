const apiKey = "請填入你的中央氣象署API Key";

/* 台灣城市修正 */
const cityMap = {
  "台北市": "臺北市",
  "臺北市": "臺北市",
  "新北市": "新北市",
  "桃園市": "桃園市",
  "台中市": "臺中市",
  "台南市": "臺南市",
  "高雄市": "高雄市",
  "基隆市": "基隆市",
  "新竹市": "新竹市",
  "嘉義市": "嘉義市"
};

/* 查天氣 */
async function getWeather(cityInput) {

  const inputCity =
    cityInput ||
    document.getElementById("cityInput").value ||
    "臺北市";

  const city = cityMap[inputCity] || "臺北市";

  document.getElementById("result").innerHTML = "⏳ 查詢中...";

  const url =
    `https://opendata.cwa.gov.tw/api/v1/rest/datastore/F-C0032-001?Authorization=${apiKey}&locationName=${city}`;

  try {
    const res = await fetch(url);
    const data = await res.json();

    if (!data.records?.location?.length) {
      document.getElementById("result").innerHTML = "❌ 查無城市資料";
      return;
    }

    const location = data.records.location[0];

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
    console.error(err);
    document.getElementById("result").innerHTML =
      "❌ API錯誤或網路問題";
  }
}

/* 📍 GPS → 自動轉城市 + 查天氣（完整修復版） */
function getLocationWeather() {

  document.getElementById("result").innerHTML = "📍 定位中...";

  if (!navigator.geolocation) {
    alert("不支援定位");
    return;
  }

  navigator.geolocation.getCurrentPosition(async (pos) => {

    const lat = pos.coords.latitude;
    const lon = pos.coords.longitude;

    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`
      );

      const data = await res.json();

      let city =
        data.address.city ||
        data.address.town ||
        data.address.suburb ||
        data.address.county ||
        "臺北市";

      document.getElementById("cityInput").value = city;

      getWeather(city);

    } catch (err) {
      document.getElementById("result").innerHTML =
        "📍 定位成功，但城市解析失敗";
    }

  }, () => {
    document.getElementById("result").innerHTML =
      "❌ 無法取得定位";
  });
}