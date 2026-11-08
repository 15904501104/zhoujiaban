(function () {
  var zoom = document.getElementById("pig-zoom");
  if (!zoom) return;
  var shot = zoom.querySelector("img");
  document.addEventListener("click", function (event) {
    if (zoom.hidden) {
      var img = event.target.closest("main img, .pig-group img, .pig-gif img, .school-shot img");
      if (img && !img.closest(".pig-avatar-box")) {
        shot.src = img.src;
        shot.alt = img.alt || "";
        zoom.hidden = false;
        return;
      }
    } else {
      zoom.hidden = true;
    }
  });
  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") zoom.hidden = true;
  });
})();
