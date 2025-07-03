document.getElementById('bewerber-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  document.getElementById('jobs-section').style.display = 'none';
  document.getElementById('bewerbung-section').style.display = 'none';
  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const skills = document.getElementById('skills').value;
  const bereich = document.getElementById('bereich').value;

  // Hier könnte man skills/bereich an den Scraper schicken, aktuell werden alle Jobs geladen
  const res = await fetch('/api/jobs');
  const jobs = await res.json();

  const jobsList = document.getElementById('jobs-list');
  jobsList.innerHTML = '';
  jobs.forEach((job, idx) => {
    const li = document.createElement('li');
    li.innerHTML = `<strong>${job.title}</strong><br><button class="show-desc">Jobbeschreibung anzeigen</button><div class="desc" style="display:none;margin-top:8px;">${job.description || 'Keine Beschreibung verfügbar.'}</div><button class="apply-btn" style="display:none;margin-top:8px;">Bewerbung schreiben</button>`;
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
    li.querySelector('.apply-btn').onclick = () => selectJob(job, name, email);
    jobsList.appendChild(li);
  });
  document.getElementById('jobs-section').style.display = 'block';
});

async function selectJob(job, name, email) {
  document.getElementById('bewerbung-section').style.display = 'none';
  // Sende Name und Email mit an das Backend (optional, Backend muss angepasst werden)
  const res = await fetch('/api/bewerbung', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ job, name, email })
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
