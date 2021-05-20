(function() {
  const scriptUrl = new URL(document.currentScript.src);
  const analyticsUrl = scriptUrl.origin;

  function trackHit() {
    const data = {
      r: document.referrer,
      url: window.location.href
    };

    if (navigator.sendBeacon) {
      navigator.sendBeacon(analyticsUrl + "/beacon", JSON.stringify(data));
    } else {
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
  }

  setTimeout(function() {
    trackHit();
  });
})();
