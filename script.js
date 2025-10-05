(function () {
  const hourHand = document.getElementById("hour");
  const minuteHand = document.getElementById("minute");
  const secondHand = document.getElementById("second");
  const dayWindow = document.getElementById("dayWindow");
  const dateNum = document.getElementById("dateNum");
  const indicesRoot = document.getElementById("indices");
  /* ── Marker (Indizes) präzise setzen:
         Radius = halber Durchmesser − (Bezel + Rehaut + optischer Abstand zur Minutenbahn) */
  const rs = getComputedStyle(document.documentElement);
  const size = parseFloat(rs.getPropertyValue("--size")) || 320; // px
  const bezel = parseFloat(rs.getPropertyValue("--bezel")) || 20; // px
  const rehaut = parseFloat(rs.getPropertyValue("--rehaut")) || 10; // px
  const railGap = 26; // optischer Abstand von der Minutenbahn zur Marker-Mitte
  const r = size / 2 - (bezel + rehaut + railGap);
  // 12 Marker generieren, 3 Uhr frei für Date
  for (let i = 0; i < 12; i++) {
    if (i === 3 || i === 0) continue;
    const el = document.createElement("div");
    el.className = "index";
    const angle = i * 30; // 0°=12 Uhr
    el.style.transform = `translate(-50%, -50%) rotate(${angle}deg) translateY(${-r}px)`;
    indicesRoot.appendChild(el);
  }
  // Lokalisierte Kalenderdaten (Deutsch)
  const fmtWeekday = new Intl.DateTimeFormat("de-DE", {
    weekday: "long"
  });
  const fmtDay = new Intl.DateTimeFormat("de-DE", {
    day: "2-digit"
  });

  function updateCalendar(now) {
    dayWindow.textContent = fmtWeekday.format(now).toUpperCase();
    dateNum.textContent = fmtDay.format(now);
  }

  function updateHands() {
    const now = new Date();
    const ms = now.getMilliseconds();
    const s = now.getSeconds() + ms / 1000; // 0..60
    const m = now.getMinutes() + s / 60; // 0..60
    const h = (now.getHours() % 12) + m / 60; // 0..12
    const secDeg = s * 6; // 360/60
    const minDeg = m * 6; // 360/60
    const hourDeg = h * 30; // 360/12
    hourHand.style.transform = `translate(-50%, -100%) rotate(${hourDeg}deg)`;
    minuteHand.style.transform = `translate(-50%, -100%) rotate(${minDeg}deg)`;
    secondHand.style.transform = `translate(-50%, -100%) rotate(${secDeg}deg)`;
    requestAnimationFrame(updateHands);
  }
  // Start
  updateCalendar(new Date());
  requestAnimationFrame(updateHands);
  // Refresh Day/Date regelmäßig (Mitternachtswechsel erwischen)
  setInterval(() => updateCalendar(new Date()), 30000);
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) {
      updateCalendar(new Date());
      requestAnimationFrame(updateHands);
    }
  });
})();