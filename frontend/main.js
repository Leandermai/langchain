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

      let metaHtml = "";
      if (job.company) metaHtml += `<b>Firma:</b> ${job.company}<br>`;
      if (job.location) metaHtml += `<b>Standort:</b> ${job.location}<br>`;
      if (job.salary) metaHtml += `<b>Gehalt:</b> ${job.salary}<br>`;
      if (job.tags && job.tags.length)
        metaHtml += `<b>Tags:</b> ${job.tags.join(", ")}<br>`;
      if (job.date) metaHtml += `<b>Datum:</b> ${job.date}<br>`;
      if (job.link)
        metaHtml += `<a href='${job.link}' target='_blank'>Zur Ausschreibung</a><br>`;

      let descHtml = "";
      if (job.aufgaben)
        descHtml +=
          `<b>Aufgaben:</b><br><ul>` +
          job.aufgaben
            .split(/\n|•|-/)
            .filter((x) => x.trim())
            .map((x) => `<li>${x.trim()}</li>`)
            .join("") +
          "</ul>";
      if (job.profil)
        descHtml +=
          `<b>Profil:</b><br><ul>` +
          job.profil
            .split(/\n|•|-/)
            .filter((x) => x.trim())
            .map((x) => `<li>${x.trim()}</li>`)
            .join("") +
          "</ul>";
      if (job.benefits)
        descHtml +=
          `<b>Benefits:</b><br><ul>` +
          job.benefits
            .split(/\n|•|-/)
            .filter((x) => x.trim())
            .map((x) => `<li>${x.trim()}</li>`)
            .join("") +
          "</ul>";
      if (!descHtml)
        descHtml = job.description || "Keine Beschreibung verfügbar.";

      li.innerHTML = `
        <strong>${job.title}</strong><br>
        ${metaHtml}
        <button class="show-desc">Jobbeschreibung anzeigen</button>
        <div class="desc" style="display:none;margin-top:8px;">${descHtml}</div>
        <button class="apply-btn" style="display:none;margin-top:8px;">Bewerbung schreiben</button>
      `;

      li.querySelector(".show-desc").onclick = () => {
        const desc = li.querySelector(".desc");
        const applyBtn = li.querySelector(".apply-btn");
        const visible = desc.style.display === "block";
        desc.style.display = visible ? "none" : "block";
        applyBtn.style.display = visible ? "none" : "block";
      };

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
    pdfBtn.style.display = "block";
    txtBtn.style.display = "block";
  }

  // PDF-Download
  pdfBtn.addEventListener("click", () => {
    const text = document.getElementById("bewerbung-text").textContent;
    const name = document.getElementById("name").value || "Bewerbung";
    const blob = new Blob([text], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${name.replace(/\s+/g, "_")}_Bewerbung.pdf`;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 100);
  });

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
