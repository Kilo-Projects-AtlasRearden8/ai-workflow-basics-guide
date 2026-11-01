/* AI Workflow Basics Guide — site scripts
   Asdale Dynamics, LLC. Local first, no network calls. */

(() => {
  'use strict';

  // Highlight the nav link for the current page
  const current = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('nav a').forEach((a) => {
    const href = a.getAttribute('href');
    if (href === current || (current === '' && href === 'index.html')) {
      a.classList.add('active');
    }
  });

  // ---------- Prompt chain tool (site/tools/prompt-chain.html) ----------
  const stepsContainer = document.getElementById('steps-container');
  const stepTemplate = document.getElementById('step-template');
  const addBtn = document.getElementById('add-step');
  const exportBtn = document.getElementById('export-chain');
  const importBtn = document.getElementById('import-chain');
  const importFile = document.getElementById('import-file');
  const clearBtn = document.getElementById('clear-chain');
  const storageToggle = document.getElementById('storage-toggle');
  const storageStatus = document.getElementById('storage-status');

  if (!stepsContainer) return; // not on the tool page

  let nextId = 1;
  let useStorage = false;
  const STORAGE_KEY = 'ai-workflow-chain';

  function escHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  function loadStorageState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const data = JSON.parse(raw);
        if (data && Array.isArray(data.steps)) {
          data.steps.forEach((s) => addStep(s.name, s.prompt, s.output, s.id));
          nextId = Math.max(nextId, ...data.steps.map((s) => s.id || 0)) + 1;
        }
        useStorage = data.useStorage === true;
      }
    } catch (e) {
      // ignore storage errors; app keeps working without persistence
    }
    storageToggle.checked = useStorage;
    updateStorageStatus();
  }

  function saveStorageState() {
    if (!useStorage) return;
    try {
      const steps = [];
      document.querySelectorAll('.step-card').forEach((card) => {
        steps.push({
          id: Number(card.dataset.id),
          name: card.querySelector('.step-name').value,
          prompt: card.querySelector('.step-prompt').value,
          output: card.querySelector('.step-output').value,
        });
      });
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ steps, useStorage: true }));
    } catch (e) {
      // ignore: storage may be full or blocked
    }
  }

  function updateStorageStatus() {
    if (!storageStatus) return;
    storageStatus.textContent = useStorage ? 'Saved in your browser only' : 'Not saving anywhere';
  }

  function addStep(name = '', prompt = '', output = '', id) {
    const idVal = id || nextId++;
    const card = document.createElement('div');
    card.className = 'step-card';
    card.dataset.id = idVal;
    card.innerHTML = `
      <div class="step-head">
        <span class="step-badge">Step ${idVal}</span>
        <label style="margin:0;flex:1">Step name</label>
        <button type="button" class="btn danger btn-sm remove-step" title="Remove this step">Remove</button>
      </div>
      <div class="row">
        <div style="flex:1 1 200px">
          <label>Step name</label>
          <input type="text" class="step-name" value="${escHtml(name)}" placeholder="e.g. Summarize notes">
        </div>
        <div style="flex:1 1 200px">
          <label>Variable name</label>
          <input type="text" class="step-var" value="step${idVal}" placeholder="e.g. summary" maxlength="40">
        </div>
      </div>
      <label>Prompt template (paste your prompt; use {{prev}} for the previous output)</label>
      <textarea class="step-prompt">${escHtml(prompt)}</textarea>
      <label>AI output (paste the AI's answer here)</label>
      <textarea class="step-output">${escHtml(output)}</textarea>
      <div class="step-actions small">
        <button type="button" class="btn secondary copy-output" title="Copy this output to use elsewhere">Copy output</button>
        <button type="button" class="btn secondary carry-forward" title="Carry this output into the next step's prompt">Carry forward</button>
      </div>
    `;
    stepsContainer.appendChild(card);
    wireCard(card);
    saveStorageState();
  }

  function wireCard(card) {
    const nameInput = card.querySelector('.step-name');
    const promptInput = card.querySelector('.step-prompt');
    const outputInput = card.querySelector('.step-output');
    const removeBtn = card.querySelector('.remove-step');
    const copyBtn = card.querySelector('.copy-output');
    const carryBtn = card.querySelector('.carry-forward');

    [nameInput, promptInput, outputInput].forEach((input) => {
      input.addEventListener('input', saveStorageState);
    });

    removeBtn.addEventListener('click', () => {
      card.remove();
      renumberBadges();
      saveStorageState();
    });

    copyBtn.addEventListener('click', () => {
      const text = outputInput.value;
      if (!text) return;
      navigator.clipboard.writeText(text).then(() => {
        const old = copyBtn.textContent;
        copyBtn.textContent = 'Copied!';
        setTimeout(() => { copyBtn.textContent = old; }, 1200);
      });
    });

    carryBtn.addEventListener('click', () => {
      const text = outputInput.value.trim();
      if (!text) return;
      const cards = Array.from(stepsContainer.querySelectorAll('.step-card'));
      const idx = cards.indexOf(card);
      if (idx >= cards.length - 1) {
        alert('This is the last step. Copy the output above and paste it wherever you need it.');
        return;
      }
      const next = cards[idx + 1];
      const nextPrompt = next.querySelector('.step-prompt');
      const marker = '{{prev}}';
      if (nextPrompt.value.includes(marker)) {
        nextPrompt.value = nextPrompt.value.replace(marker, text);
      } else {
        nextPrompt.value = (nextPrompt.value ? nextPrompt.value + '\n\n' : '') + 'Previous step output:\n' + text;
      }
      nextPrompt.dispatchEvent(new Event('input'));
    });
  }

  function renumberBadges() {
    document.querySelectorAll('.step-card').forEach((card, i) => {
      const badge = card.querySelector('.step-badge');
      if (badge) badge.textContent = `Step ${i + 1}`;
    });
  }

  addBtn.addEventListener('click', () => addStep());

  exportBtn.addEventListener('click', () => {
    const steps = [];
    document.querySelectorAll('.step-card').forEach((card) => {
      steps.push({
        id: Number(card.dataset.id),
        name: card.querySelector('.step-name').value,
        prompt: card.querySelector('.step-prompt').value,
        output: card.querySelector('.step-output').value,
      });
    });
    const blob = new Blob([JSON.stringify({ steps }, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'prompt-chain.json';
    a.click();
    URL.revokeObjectURL(url);
  });

  importBtn.addEventListener('click', () => importFile.click());
  importFile.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target.result);
        if (!data || !Array.isArray(data.steps)) throw new Error('bad format');
        stepsContainer.innerHTML = '';
        nextId = 1;
        data.steps.forEach((s) => addStep(s.name || '', s.prompt || '', s.output || '', s.id));
        renumberBadges();
      } catch (err) {
        alert('Could not import that file. Make sure it was exported from this tool.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  });

  clearBtn.addEventListener('click', () => {
    if (!confirm('Clear all steps? This cannot be undone.')) return;
    stepsContainer.innerHTML = '';
    nextId = 1;
    try { localStorage.removeItem(STORAGE_KEY); } catch (e) {}
    saveStorageState();
  });

  storageToggle.addEventListener('change', () => {
    useStorage = storageToggle.checked;
    updateStorageStatus();
    if (useStorage) saveStorageState();
  });

  addStep('First step', '', '');
  loadStorageState();
})();
