(function() {
  const scriptUrl = new URL(document.currentScript.src);
  const analyticsUrl = scriptUrl.origin;

  function trackHit() {
    const data = {
      url: window.location.href,
      r: ""
    };

    if (document.referrer) {
      try {
        const referrer = new URL(document.referrer);

        if (referrer.origin && referrer.origin !== "null") {
          data.r = referrer.origin;
        } else if (referrer.protocol === "android-app:") {
          data.r = referrer.href;
        }
      } catch (e) {}
    }
    const img = document.createElement("img");
    img.setAttribute("alt", "");
    img.setAttribute("aria-hidden", "true");
    img.style.position = "absolute";
    img.src =
      analyticsUrl + "/ping?data=" + encodeURIComponent(JSON.stringify(data));
    img.addEventListener("load", function() {
      img.parentNode.removeChild(img);
    }),
      img.addEventListener("error", function() {
        img.parentNode.removeChild(img);
      }),
      document.body.appendChild(img);
  }

  setTimeout(function() {
    trackHit();
  });
})();
