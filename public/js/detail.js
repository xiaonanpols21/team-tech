console.log("Detail");

// Code is uitgelegd in de Wiki bij onderdeel: Client-side Component

// Data aanvragen
const api_key = "api_key=c9c582007e770d9564a6499f6e364a2a";
const base_url = "https://api.themoviedb.org/3";
const api_url = base_url + "/discover/tv?" + api_key + "&language=en-US&sort_by=popularity.desc&page=1&primary_release_year=2020&with_original_language=hi|ko|";
const api_url2 = base_url + "/discover/tv?" + api_key + "&language=en-US&sort_by=popularity.desc&page=2&primary_release_year=2020&with_original_language=hi|ko|";
const img_url = "https://image.tmdb.org/t/p/w780";

// API fetchen met Promise
function getKdrama(url) {
  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      console.log(data.results);
      showImg(data.results, ".detail-img");
    });
}
getKdrama(api_url);
getKdrama(api_url2);

function showImg(data) {
  data.forEach((poster) => {
    const { poster_path, name } = poster;
    const imgEl = document.querySelector(".detail-img");

      if (imgEl.alt === name) {
        imgEl.src = img_url + poster_path;
      }
  });
}
