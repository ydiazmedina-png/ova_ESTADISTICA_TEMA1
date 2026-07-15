document.addEventListener('DOMContentLoaded', function () {

    // ===== ACT 1: CLASIFICADOR DRAG & DROP DE VARIABLES =====
    let draggedItem = null;

    document.querySelectorAll('.drag-item').forEach(item => {
        item.addEventListener('dragstart', function (e) {
            draggedItem = this;
            setTimeout(() => this.classList.add('dragging'), 0);
            e.dataTransfer.effectAllowed = 'move';
        });
        item.addEventListener('dragend', function () { this.classList.remove('dragging'); draggedItem = null; });
    });

    document.querySelectorAll('.drop-zone').forEach(zone => {
        zone.addEventListener('dragover', e => { e.preventDefault(); zone.classList.add('drag-over'); e.dataTransfer.dropEffect = 'move'; });
        zone.addEventListener('dragleave', () => zone.classList.remove('drag-over'));
        zone.addEventListener('drop', function (e) {
            e.preventDefault();
            this.classList.remove('drag-over');
            if (draggedItem) {
                const prev = this.querySelector('.drag-item');
                if (prev) document.getElementById('drag-bank').appendChild(prev);
                this.appendChild(draggedItem);
            }
        });
    });

    const bank = document.getElementById('drag-bank');
    if (bank) {
        bank.addEventListener('dragover', e => { e.preventDefault(); bank.style.borderColor = '#15803d'; });
        bank.addEventListener('dragleave', () => bank.style.borderColor = '');
        bank.addEventListener('drop', e => {
            e.preventDefault(); bank.style.borderColor = '';
            if (draggedItem) bank.appendChild(draggedItem);
        });
    }

    const dragCorrect = {
        'zone-nominal': ['var-so', 'var-tipo-disp'],
        'zone-ordinal': ['var-plan', 'var-stars'],
        'zone-discreta': ['var-bugs', 'var-sesiones'],
        'zone-continua': ['var-tiempo', 'var-ram', 'var-temp']
    };
    const dragOriginalOrder = ['var-so', 'var-tipo-disp', 'var-plan', 'var-stars', 'var-bugs', 'var-sesiones', 'var-tiempo', 'var-ram', 'var-temp'];

    document.getElementById('check-drag-btn')?.addEventListener('click', function () {
        let score = 0;
        const fb = document.getElementById('drag-feedback');
        let html = '';
        Object.entries(dragCorrect).forEach(([zoneId, correctIds]) => {
            const zone = document.getElementById(zoneId);
            if (!zone) return;
            const placed = Array.from(zone.querySelectorAll('.drag-item')).map(el => el.dataset.var);
            const zoneLabel = zone.dataset.label || zoneId;
            const isOk = JSON.stringify(placed.slice().sort()) === JSON.stringify(correctIds.slice().sort());
            if (isOk) score += correctIds.length;
            html += `<p class="${isOk ? 'text-green-700' : 'text-red-600'} text-sm">${isOk ? '✔' : '✘'} <strong>${zoneLabel}:</strong> ${isOk ? 'Correcto' : 'Revisa esta categoría'}</p>`;
        });
        const total = Object.values(dragCorrect).flat().length;
        fb.innerHTML = html + `<p class="font-bold mt-2 ${score >= total * 0.7 ? 'text-green-700' : 'text-amber-700'}">Puntuación: ${score}/${total}</p>`;
        fb.classList.remove('hidden');
    });

    document.getElementById('reset-drag-btn')?.addEventListener('click', function () {
        const bankEl = document.getElementById('drag-bank');
        dragOriginalOrder.forEach(varId => {
            const el = document.querySelector(`.drag-item[data-var="${varId}"]`);
            if (el) bankEl.appendChild(el);
        });
        const fb = document.getElementById('drag-feedback');
        fb.innerHTML = '';
        fb.classList.add('hidden');
    });

    // ===== ACT 2: CLASIFICADOR INTERACTIVO DE ESCALAS =====
    const escalasData = [
        { id: 'e1', var: 'Lenguaje de programación', correct: 'nominal', hint: 'Python, Java, JS son categorías sin orden.' },
        { id: 'e2', var: 'N° de bugs por semana', correct: 'razon', hint: 'Se cuenta; 0 bugs equivale a ningún bug (cero absoluto).' },
        { id: 'e3', var: 'Severidad del bug', correct: 'ordinal', hint: 'Baja, Media, Alta, Crítica: hay orden pero no distancias iguales.' },
        { id: 'e4', var: 'Tiempo de respuesta (ms)', correct: 'razon', hint: '0 ms equivale a sin demora. Las proporciones tienen sentido.' },
        { id: 'e5', var: 'Código HTTP (200, 404...)', correct: 'nominal', hint: 'Son etiquetas numéricas, no cantidades.' },
        { id: 'e6', var: 'Temperatura del CPU (°C)', correct: 'intervalo', hint: '0°C no es ausencia de temperatura, el cero es convencional.' },
        { id: 'e7', var: 'Memoria RAM usada (GB)', correct: 'razon', hint: '0 GB equivale a sin uso. Las razones tienen sentido.' },
        { id: 'e8', var: 'Calificación 1-5 estrellas', correct: 'ordinal', hint: 'Hay orden pero la distancia entre valores no está garantizada.' },
    ];

    const cont = document.getElementById('escalas-container');
    if (cont) {
        escalasData.forEach(item => {
            const div = document.createElement('div');
            div.className = 'bg-white rounded-xl border border-slate-300 p-4';
            div.innerHTML = `
                <p class="font-semibold text-slate-700 mb-2 text-sm">${item.var}</p>
                <div class="flex flex-wrap gap-2 mb-2">
                    ${['nominal', 'ordinal', 'intervalo', 'razon'].map(e =>
                        `<button onclick="checkEscala('${item.id}','${e}','${item.correct}','${item.hint}')"
                            class="escala-btn-${item.id} px-3 py-1 rounded-full text-xs font-semibold border-2 border-slate-300 text-slate-600 hover:border-green-600 hover:text-green-700 transition-all">${e.charAt(0).toUpperCase() + e.slice(1)}</button>`
                    ).join('')}
                </div>
                <div id="hint-${item.id}" class="hidden text-xs rounded-lg p-2 mt-1"></div>`;
            cont.appendChild(div);
        });
    }

    document.getElementById('reset-escalas-btn')?.addEventListener('click', function () {
        escalasData.forEach(item => {
            document.querySelectorAll(`.escala-btn-${item.id}`).forEach(btn => {
                btn.classList.remove('bg-green-600', 'bg-red-500', 'text-white', 'border-green-600', 'border-red-500');
                btn.classList.add('border-slate-300', 'text-slate-600');
            });
            const hintEl = document.getElementById(`hint-${item.id}`);
            hintEl.classList.add('hidden');
            hintEl.innerHTML = '';
        });
    });

    // ===== ACT 3: VF POBLACIÓN Y MUESTRA =====
    const vfAnswers = { vf1: 'F', vf2: 'V', vf3: 'F', vf4: 'V', vf5: 'V', vf6: 'F' };
    document.getElementById('check-vf-btn')?.addEventListener('click', function () {
        let score = 0;
        Object.entries(vfAnswers).forEach(([id, correct]) => {
            const input = document.getElementById(id); if (!input) return;
            const val = input.value.trim().toUpperCase();
            input.classList.remove('correct', 'wrong');
            if (val === correct) { input.classList.add('correct'); score++; }
            else input.classList.add('wrong');
        });
        const total = Object.keys(vfAnswers).length;
        document.getElementById('vf-result').innerHTML =
            `<span class="${score === total ? 'text-green-700' : 'text-amber-700'} font-bold">${score} de ${total} correctas.</span>`;
    });
    document.getElementById('reset-vf-btn')?.addEventListener('click', function () {
        Object.keys(vfAnswers).forEach(id => { const i = document.getElementById(id); if (i) { i.value = ''; i.classList.remove('correct', 'wrong'); } });
        document.getElementById('vf-result').innerHTML = '';
    });
});

function checkEscala(id, selected, correct, hint) {
    document.querySelectorAll(`.escala-btn-${id}`).forEach(btn => {
        btn.classList.remove('bg-green-600', 'bg-red-500', 'text-white', 'border-green-600', 'border-red-500');
        btn.classList.add('border-slate-300', 'text-slate-600');
    });
    const btn = document.querySelector(`.escala-btn-${id}[onclick*="'${selected}'"]`);
    const hintEl = document.getElementById(`hint-${id}`);
    if (selected === correct) {
        btn.classList.add('bg-green-600', 'text-white', 'border-green-600');
        btn.classList.remove('border-slate-300', 'text-slate-600');
        hintEl.className = 'text-xs rounded-lg p-2 mt-1 bg-green-50 text-green-800';
        hintEl.innerHTML = `Correcto. ${hint}`;
    } else {
        btn.classList.add('bg-red-500', 'text-white', 'border-red-500');
        btn.classList.remove('border-slate-300', 'text-slate-600');
        hintEl.className = 'text-xs rounded-lg p-2 mt-1 bg-red-50 text-red-800';
        hintEl.innerHTML = `No es correcta. Pista: ${hint}`;
    }
    hintEl.classList.remove('hidden');
}