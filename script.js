function getWeather() {

    let city =
        document.getElementById("city").value;

    document.getElementById("result").innerHTML =
        "城市：" + city;
}