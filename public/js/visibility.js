console.log("Visibility");

// Code is uitgelegd in de Wiki bij onderdeel: Client-side Component

let boolean = document.hidden;
let link = document.querySelector("link[rel~='icon']");

document.addEventListener("visibilitychange", function () {
  if (document.visibilityState === "hidden") {
    document.title = "We miss you!";
    link.href = "/img/logo-missyou.svg";
  } else {
    document.title = "Chingu: Find your K-drama Seoulmate";
    link.href = "/img/logo.svg";
  }
});

