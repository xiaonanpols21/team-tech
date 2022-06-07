console.log("Profile");

// Code is uitgelegd in de Wiki bij onderdeel: Client-side Component

// Data aanvragen API
const api_key = "api_key=c9c582007e770d9564a6499f6e364a2a";
const base_url = "https://api.themoviedb.org/3";
const api_url = base_url + "/discover/tv?" + api_key + "&language=en-US&sort_by=popularity.desc&page=1&primary_release_year=2020&with_original_language=hi|ko|";
const api_url2 = base_url + "/discover/tv?" + api_key + "&language=en-US&sort_by=popularity.desc&page=2&primary_release_year=2020&with_original_language=hi|ko|";
const img_url = "https://image.tmdb.org/t/p/w500";

// API fetchen met Promise
function getKdrama(url) {
  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      showImg(data.results);
    });
}
getKdrama(api_url);
getKdrama(api_url2);

// Covers showen in de HTML
function showImg(data) {
  data.forEach((poster, index) => {
    const { poster_path, name } = poster;
    const imgEl = document.querySelectorAll("article img");

    imgEl.forEach((img) => {
      if (img.alt === name) {
        //console.log(img.alt);
        img.src = img_url + poster_path;
      }
    });
  });
}