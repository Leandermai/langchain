document.addEventListener("DOMContentLoaded", () => {
  const bewerberForm = document.getElementById("bewerber-form");
  const jobsSection = document.getElementById("jobs-section");
  const bewerbungSection = document.getElementById("bewerbung-section");
  const jobsList = document.getElementById("jobs-list");
  const pdfBtn = document.getElementById("pdf-download");
  const chatForm = document.getElementById("chat-form");
  const chatInput = document.getElementById("chat-input");
  const chatMessages = document.getElementById("chat-messages");

  // TXT-Download-Button anlegen (falls nicht im HTML)
  let txtBtn = document.getElementById("txt-download");
  if (!txtBtn) {
    txtBtn = document.createElement("button");
    txtBtn.id = "txt-download";
    txtBtn.textContent = "Als TXT herunterladen";
    txtBtn.style.display = "none";
    bewerbungSection.appendChild(txtBtn);
  }

  bewerberForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    jobsSection.style.display = "none";
    bewerbungSection.style.display = "none";

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const skills = document.getElementById("skills").value;
    const bereich = document.getElementById("bereich").value;
    const profil = document.getElementById("profil")
      ? document.getElementById("profil").value
      : "";

    const res = await fetch(
      `/api/jobs?skills=${encodeURIComponent(
        skills
      )}&bereich=${encodeURIComponent(bereich)}`
    );
    const jobs = await res.json();

    jobsList.innerHTML = "";
    jobs.forEach((job, idx) => {
      const li = document.createElement("li");

      // Schöne Anzeige der wichtigsten Felder
      let metaHtml = "";
      if (job.title) metaHtml += `<b>${job.title}</b><br>`;
      if (job.company) metaHtml += `<b>Firma:</b> ${job.company}<br>`;
      if (job.location) metaHtml += `<b>Standort:</b> ${job.location}<br>`;
      if (job.salary) metaHtml += `<b>Gehalt:</b> ${job.salary}<br>`;
      if (job.tags && job.tags.length)
        metaHtml += `<b>Tags:</b> ${job.tags.join(", ")}<br>`;
      if (job.date) metaHtml += `<b>Datum:</b> ${job.date}<br>`;
      if (job.link)
        metaHtml += `<a href='${job.link}' target='_blank'>Zur Ausschreibung</a><br>`;

      li.innerHTML = `
        ${metaHtml}
        <button class="apply-btn" style="margin-top:8px;">Bewerbung schreiben</button>
      `;

      li.querySelector(".apply-btn").onclick = () =>
        selectJob(job, name, email, profil);
      jobsList.appendChild(li);
    });

    jobsSection.style.display = "block";
  });

  async function selectJob(job, name, email, profil) {
    bewerbungSection.style.display = "none";
    const res = await fetch("/api/bewerbung", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ job, name, email, profil }),
    });
    const data = await res.json();
    document.getElementById("bewerbung-text").textContent =
      data.letter || "Fehler beim Generieren.";
    bewerbungSection.style.display = "block";
    // TXT-Download-Button sichtbar machen
    txtBtn.style.display = "block";
    // Nach unten scrollen
    window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });

    // TXT-Download-Button bleibt erhalten
    txtBtn.addEventListener("click", () => {
      const text = document.getElementById("bewerbung-text").textContent;
      const name = document.getElementById("name").value || "Bewerbung";
      const blob = new Blob([text], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${name.replace(/\s+/g, "_")}_Bewerbung.txt`;
      document.body.appendChild(a);
      a.click();
      setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }, 100);
    });
  }

  // Chat
  if (chatForm && chatInput && chatMessages) {
    chatForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const userMsg = chatInput.value.trim();
      if (!userMsg) return;

      const userDiv = document.createElement("div");
      userDiv.textContent = `👤 ${userMsg}`;
      userDiv.style.marginBottom = "5px";
      chatMessages.appendChild(userDiv);

      chatInput.value = "";
      chatMessages.scrollTop = chatMessages.scrollHeight;

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: userMsg }),
        });
        const data = await res.json();
        const botMsg = data.response || "🤖 Fehler beim Antworten.";
        const botDiv = document.createElement("div");
        botDiv.textContent = `🤖 ${botMsg}`;
        botDiv.style.marginBottom = "10px";
        chatMessages.appendChild(botDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
      } catch (err) {
        const errorDiv = document.createElement("div");
        errorDiv.textContent = "❌ Netzwerkfehler beim Chat.";
        chatMessages.appendChild(errorDiv);
      }
    });
  }
});
