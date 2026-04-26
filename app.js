// ============================================================
// KCET PREDICTOR — APP.JS
// ============================================================

// ---- Tab switching ----
document.querySelectorAll('.tab').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById('tab-' + btn.dataset.tab).classList.add('active');
  });
});

// ---- Populate Marks vs Rank table ----
function populateMVRTable() {
  const tbody = document.getElementById('mvr-body');
  MARKS_VS_RANK.forEach(row => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><strong>${row.kcet}</strong></td>
      <td>${Math.round(row.combined)}</td>
      <td>${row.r2024}</td>
      <td>${row.r2023}</td>
      <td>${row.r2022}</td>
      <td>${row.r2021}</td>
      <td>${row.r2020}</td>
    `;
    tbody.appendChild(tr);
  });
}
populateMVRTable();

// ---- RANK PREDICTOR ----
function predictRank() {
  const kcetScore = parseFloat(document.getElementById('kcet-score').value);
  const pucMarks  = parseFloat(document.getElementById('puc-marks').value);
  const year      = document.getElementById('rank-year').value;
  const category  = document.getElementById('rank-category').value;

  if (isNaN(kcetScore) || isNaN(pucMarks)) {
    alert('Please enter both KCET score and PUC marks.');
    return;
  }
  if (kcetScore < 0 || kcetScore > 180) { alert('KCET score must be between 0 and 180.'); return; }
  if (pucMarks  < 0 || pucMarks  > 300) { alert('PUC marks must be between 0 and 300.'); return; }

  const combined = computeCombinedScore(kcetScore, pucMarks);
  const rankKey = 'r' + year;

  // Find nearest bracket
  let lower = null, upper = null;
  for (let i = 0; i < MARKS_VS_RANK.length; i++) {
    if (MARKS_VS_RANK[i].combined <= combined) {
      lower = MARKS_VS_RANK[i];
      upper = (i > 0) ? MARKS_VS_RANK[i - 1] : MARKS_VS_RANK[i];
      break;
    }
  }
  if (!lower) { lower = upper = MARKS_VS_RANK[MARKS_VS_RANK.length - 1]; }
  if (!upper) { upper = lower; }

  // Interpolate rank
  const lowerRankStr = lower[rankKey] || lower.r2024;
  const upperRankStr = upper[rankKey] || upper.r2024;

  // Extract min of upper range and max of lower range for display
  const getLow  = s => parseInt(s.split('–')[0].replace(/,/g,''));
  const getHigh = s => parseInt(s.split('–').pop().replace(/,/g,''));

  const rankLow  = getLow(upperRankStr);
  const rankHigh = getHigh(lowerRankStr);

  // Category adjustment note
  let catNote = '';
  if (category === 'SC')  catNote = 'SC candidates typically get ~5× higher closing ranks (easier admission).';
  if (category === 'ST')  catNote = 'ST candidates typically get ~7× higher closing ranks (easier admission).';
  if (category === 'OBC') catNote = 'OBC candidates typically get ~2.5× higher closing ranks (easier admission).';

  // Display
  const resultBox = document.getElementById('rank-result');
  document.getElementById('rank-output').textContent = `${rankLow.toLocaleString()} – ${rankHigh.toLocaleString()}`;
  document.getElementById('rank-sub').textContent = `Combined Score: ${combined.toFixed(1)} / 180  ·  KCET: ${kcetScore}  ·  PUC: ${pucMarks}`;
  document.getElementById('rank-meta').textContent = catNote || `Based on ${year} KCET data (GM category)`;

  // Progress bar: log scale for ranks 1-100000
  const midRank = (rankLow + rankHigh) / 2;
  const pct = Math.max(2, Math.min(98, 100 - (Math.log10(midRank) / Math.log10(100000)) * 100));
  setTimeout(() => {
    document.getElementById('rank-bar').style.width = pct + '%';
  }, 50);

  resultBox.classList.remove('hidden');
  resultBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

  // Store for seat tab
  window._predictedRankLow  = rankLow;
  window._predictedRankHigh = rankHigh;
  window._predictedRankMid  = midRank;
}

// ---- GO TO SEAT TAB ----
function goToSeat() {
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
  document.querySelector('[data-tab="seat"]').classList.add('active');
  document.getElementById('tab-seat').classList.add('active');

  if (window._predictedRankMid) {
    document.getElementById('seat-rank').value = Math.round(window._predictedRankMid);
  }
  document.getElementById('tools').scrollIntoView({ behavior: 'smooth' });
}

// ---- SEAT FINDER ----
function findSeats() {
  const rank     = parseInt(document.getElementById('seat-rank').value);
  const category = document.getElementById('seat-category').value;
  const branch   = document.getElementById('seat-branch').value;
  const type     = document.getElementById('seat-type').value;
  const showSafe     = document.getElementById('chk-safe').checked;
  const showModerate = document.getElementById('chk-moderate').checked;
  const showReach    = document.getElementById('chk-reach').checked;

  if (isNaN(rank) || rank < 1) { alert('Please enter a valid KCET rank.'); return; }

  const catMul = CATEGORY_MULTIPLIER[category] || 1.0;

  let results = [];

  COLLEGES.forEach(college => {
    if (type !== 'all' && college.type !== type) return;

    college.branches.forEach(b => {
      if (branch !== 'all' && b.code !== branch) return;

      // Skip if no recent data
      if (!b.c2024 && !b.c2023) return;

      // Adjust closing rank for category
      const close2024 = b.c2024 ? Math.round(b.c2024 * catMul) : null;
      const close2023 = b.c2023 ? Math.round(b.c2023 * catMul) : null;
      const close2022 = b.c2022 ? Math.round(b.c2022 * catMul) : null;

      const latestClose = close2024 || close2023;
      if (!latestClose) return;

      // Chance
      let chance;
      const margin = latestClose * 0.20;
      if (rank < latestClose - margin)        chance = 'safe';
      else if (rank <= latestClose + margin)   chance = 'moderate';
      else                                     chance = 'reach';

      if (chance === 'safe'     && !showSafe)     return;
      if (chance === 'moderate' && !showModerate) return;
      if (chance === 'reach'    && !showReach)    return;

      // Trend 2023→2024
      let trend = 'flat';
      if (b.c2024 && b.c2023) {
        if (b.c2024 < b.c2023 * 0.95)  trend = 'down';  // cutoff dropping = harder
        else if (b.c2024 > b.c2023 * 1.05) trend = 'up'; // cutoff rising = easier
      }

      results.push({ college, branch: b, close2024, close2023, close2022, chance, trend, latestClose });
    });
  });

  // Sort: safe first, then by closeness to rank
  const chanceOrder = { safe: 0, moderate: 1, reach: 2 };
  results.sort((a, b) => {
    if (chanceOrder[a.chance] !== chanceOrder[b.chance]) return chanceOrder[a.chance] - chanceOrder[b.chance];
    return Math.abs(a.latestClose - rank) - Math.abs(b.latestClose - rank);
  });

  renderSeatResults(results, rank, category);
}

function renderSeatResults(results, rank, category) {
  const container = document.getElementById('seat-result');
  const tbody     = document.getElementById('seat-body');
  const summary   = document.getElementById('seat-summary');

  tbody.innerHTML = '';

  if (results.length === 0) {
    tbody.innerHTML = '<tr><td colspan="8" style="text-align:center;color:var(--text-muted);padding:40px">No matches found. Try adjusting filters or checking the "Reach" box.</td></tr>';
    summary.innerHTML = '';
    container.classList.remove('hidden');
    return;
  }

  const safeCount     = results.filter(r => r.chance === 'safe').length;
  const moderateCount = results.filter(r => r.chance === 'moderate').length;
  const reachCount    = results.filter(r => r.chance === 'reach').length;

  summary.innerHTML = `
    <div class="summary-pill">Rank: <strong>${rank.toLocaleString()}</strong></div>
    <div class="summary-pill">Category: <strong>${category}</strong></div>
    <div class="summary-pill">✅ Safe: <strong>${safeCount}</strong></div>
    <div class="summary-pill">⚠️ Moderate: <strong>${moderateCount}</strong></div>
    <div class="summary-pill">🎯 Reach: <strong>${reachCount}</strong></div>
    <div class="summary-pill">Total: <strong>${results.length}</strong></div>
  `;

  const typeLabel = { gov: 'Govt', aided: 'Aided', private: 'Private' };
  const typeCls   = { gov: 'type-gov', aided: 'type-aided', private: 'type-private' };
  const chanceCls = { safe: 'chance-safe', moderate: 'chance-moderate', reach: 'chance-reach' };
  const chanceLabel = { safe: '✅ Safe', moderate: '⚠️ Moderate', reach: '🎯 Reach' };
  const trendIcon = { up: '<span class="trend-up" title="Cutoff getting easier (rank rising)">↑ Easier</span>', down: '<span class="trend-down" title="Cutoff getting harder (rank falling)">↓ Harder</span>', flat: '<span class="trend-flat">→ Stable</span>' };

  results.forEach(r => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>
        <div class="college-name">${r.college.name}</div>
        <div class="college-city">${r.college.city}</div>
      </td>
      <td><span class="type-badge ${typeCls[r.college.type]}">${typeLabel[r.college.type]}</span></td>
      <td>${r.branch.name}</td>
      <td>${r.close2024 ? r.close2024.toLocaleString() : '—'}</td>
      <td>${r.close2023 ? r.close2023.toLocaleString() : '—'}</td>
      <td>${r.close2022 ? r.close2022.toLocaleString() : '—'}</td>
      <td>${trendIcon[r.trend]}</td>
      <td><span class="chance-badge ${chanceCls[r.chance]}">${chanceLabel[r.chance]}</span></td>
    `;
    tbody.appendChild(tr);
  });

  container.classList.remove('hidden');
  container.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// ---- Enter key support ----
document.addEventListener('keydown', e => {
  if (e.key === 'Enter') {
    const activeTab = document.querySelector('.tab.active');
    if (activeTab && activeTab.dataset.tab === 'rank') predictRank();
    if (activeTab && activeTab.dataset.tab === 'seat') findSeats();
  }
});
