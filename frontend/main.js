document.getElementById('bewerber-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  document.getElementById('jobs-section').style.display = 'none';
  document.getElementById('bewerbung-section').style.display = 'none';
  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const skills = document.getElementById('skills').value;
  const bereich = document.getElementById('bereich').value;
  const profil = document.getElementById('profil').value;

  // Skills und Bereich an die API übergeben
  const res = await fetch(`/api/jobs?skills=${encodeURIComponent(skills)}&bereich=${encodeURIComponent(bereich)}`);
  const jobs = await res.json();

  const jobsList = document.getElementById('jobs-list');
  jobsList.innerHTML = '';
  jobs.forEach((job, idx) => {
    const li = document.createElement('li');
    // Kopfbereich mit allen Metadaten
    let metaHtml = '';
    if (job.company) metaHtml += `<b>Firma:</b> ${job.company}<br>`;
    if (job.location) metaHtml += `<b>Standort:</b> ${job.location}<br>`;
    if (job.salary) metaHtml += `<b>Gehalt:</b> ${job.salary}<br>`;
    if (job.tags && job.tags.length) metaHtml += `<b>Tags:</b> ${job.tags.join(', ')}<br>`;
    if (job.date) metaHtml += `<b>Datum:</b> ${job.date}<br>`;
    if (job.link) metaHtml += `<a href='${job.link}' target='_blank'>Zur Ausschreibung</a><br>`;

    // Neue Darstellung mit Abschnitten
    let descHtml = '';
    if (job.aufgaben) descHtml += `<b>Aufgaben:</b><br><ul>` + job.aufgaben.split(/\n|•|-/).filter(x=>x.trim()).map(x=>`<li>${x.trim()}</li>`).join('') + '</ul>';
    if (job.profil) descHtml += `<b>Profil:</b><br><ul>` + job.profil.split(/\n|•|-/).filter(x=>x.trim()).map(x=>`<li>${x.trim()}</li>`).join('') + '</ul>';
    if (job.benefits) descHtml += `<b>Benefits:</b><br><ul>` + job.benefits.split(/\n|•|-/).filter(x=>x.trim()).map(x=>`<li>${x.trim()}</li>`).join('') + '</ul>';
    if (!descHtml) descHtml = job.description || 'Keine Beschreibung verfügbar.';

    li.innerHTML = `<strong>${job.title}</strong><br>${metaHtml}<button class="show-desc">Jobbeschreibung anzeigen</button><div class="desc" style="display:none;margin-top:8px;">${descHtml}</div><button class="apply-btn" style="display:none;margin-top:8px;">Bewerbung schreiben</button>`;
    li.querySelector('.show-desc').onclick = function() {
      const desc = li.querySelector('.desc');
      const applyBtn = li.querySelector('.apply-btn');
      if (desc.style.display === 'none') {
        desc.style.display = 'block';
        applyBtn.style.display = 'block';
      } else {
        desc.style.display = 'none';
        applyBtn.style.display = 'none';
      }
    };
    li.querySelector('.apply-btn').onclick = () => selectJob(job, name, email, profil);
    jobsList.appendChild(li);
  });
  document.getElementById('jobs-section').style.display = 'block';
});

async function selectJob(job, name, email, profil) {
  document.getElementById('bewerbung-section').style.display = 'none';
  // Sende Name, Email und Profil mit an das Backend
  const res = await fetch('/api/bewerbung', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ job, name, email, profil })
  });
  const data = await res.json();
  document.getElementById('bewerbung-text').textContent = data.letter || 'Fehler beim Generieren.';
  document.getElementById('bewerbung-section').style.display = 'block';
  document.getElementById('pdf-download').style.display = 'block';
  document.getElementById('txt-download').style.display = 'block';
}

// PDF-Download
const pdfBtn = document.getElementById('pdf-download');
pdfBtn.addEventListener('click', () => {
  const text = document.getElementById('bewerbung-text').textContent;
  const name = document.getElementById('name').value || 'Bewerbung';
  const blob = new Blob([text], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${name.replace(/\s+/g, '_')}_Bewerbung.pdf`;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 100);
});

// TXT-Download
const txtBtn = document.createElement('button');
txtBtn.id = 'txt-download';
txtBtn.textContent = 'Als TXT herunterladen';
txtBtn.style.display = 'none';
document.getElementById('bewerbung-section').appendChild(txtBtn);
txtBtn.addEventListener('click', () => {
  const text = document.getElementById('bewerbung-text').textContent;
  const name = document.getElementById('name').value || 'Bewerbung';
  const blob = new Blob([text], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${name.replace(/\s+/g, '_')}_Bewerbung.txt`;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 100);
});

document.getElementById('chat-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const input = document.getElementById('chat-input');
  const messages = document.getElementById('chat-messages');
  const userMsg = input.value.trim();
  if (!userMsg) return;

  // Show user message
  const userDiv = document.createElement('div');
  userDiv.textContent = `👤 ${userMsg}`;
  userDiv.style.marginBottom = '5px';
  messages.appendChild(userDiv);

  input.value = '';
  messages.scrollTop = messages.scrollHeight;

  // Call backend (adjust /api/chat to your real route)
  try {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: userMsg })
    });
    const data = await res.json();
    const botMsg = data.response || '🤖 Fehler beim Antworten.';

    const botDiv = document.createElement('div');
    botDiv.textContent = `🤖 ${botMsg}`;
    botDiv.style.marginBottom = '10px';
    messages.appendChild(botDiv);

    messages.scrollTop = messages.scrollHeight;
  } catch (err) {
    const errorDiv = document.createElement('div');
    errorDiv.textContent = '❌ Netzwerkfehler beim Chat.';
    messages.appendChild(errorDiv);
  }
});
