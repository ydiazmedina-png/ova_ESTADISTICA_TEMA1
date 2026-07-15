document.addEventListener('DOMContentLoaded', function () {
    const variables = [
        { nombre: 'Duración de la sesión (minutos)', esCategoria: false, obtiene: 'midiendo', resultado: 'Cuantitativa Continua' },
        { nombre: 'Prioridad de un ticket de soporte (P1 a P4)', esCategoria: true, tieneOrden: true, resultado: 'Cualitativa Ordinal' },
        { nombre: 'Sistema operativo (Android, iOS, Windows)', esCategoria: true, tieneOrden: false, resultado: 'Cualitativa Nominal' },
        { nombre: 'Número de bugs reportados por semana', esCategoria: false, obtiene: 'contando', resultado: 'Cuantitativa Discreta' },
        { nombre: 'Temperatura del CPU (°C)', esCategoria: false, obtiene: 'midiendo', resultado: 'Cuantitativa Continua' },
        { nombre: 'Calificación en la tienda (1 a 5 estrellas)', esCategoria: true, tieneOrden: true, resultado: 'Cualitativa Ordinal' },
        { nombre: 'Código de estado HTTP (200, 404, 500)', esCategoria: true, tieneOrden: false, resultado: 'Cualitativa Nominal' },
        { nombre: 'Número de descargas de la aplicación', esCategoria: false, obtiene: 'contando', resultado: 'Cuantitativa Discreta' }
    ];

    let orden = [];
    let idx = 0;
    let score = 0;
    let total = 0;

    function shuffle(arr) {
        const a = arr.slice();
        for (let i = a.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [a[i], a[j]] = [a[j], a[i]];
        }
        return a;
    }

    function startGame() {
        orden = shuffle(variables);
        idx = 0; score = 0; total = 0;
        document.getElementById('game-final-result').classList.add('hidden');
        document.getElementById('game-next-btn').classList.add('hidden');
        updateScore();
        loadVariable();
    }

    function updateScore() {
        document.getElementById('game-score').textContent = `Puntaje: ${score} / ${total}`;
    }

    function updateProgress() {
        const pct = Math.round((idx / orden.length) * 100);
        document.getElementById('game-progress-fill').style.width = pct + '%';
    }

    function loadVariable() {
        if (idx >= orden.length) { showGameEnd(); return; }
        updateProgress();
        const v = orden[idx];
        document.getElementById('game-var-name').textContent = v.nombre;
        document.getElementById('game-final-result').classList.add('hidden');
        document.getElementById('game-next-btn').classList.add('hidden');
        renderStep1();
    }

    function renderStep1() {
        const c = document.getElementById('game-question-container');
        c.innerHTML = `
            <div class="game-step">
                <p class="font-semibold text-slate-700 mb-2">Paso 1. ¿La respuesta es una categoría o etiqueta?</p>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div class="game-option bg-white rounded-lg p-3 text-center font-semibold text-slate-700" onclick="gameAnswerStep1(true)">Sí, es una categoría</div>
                    <div class="game-option bg-white rounded-lg p-3 text-center font-semibold text-slate-700" onclick="gameAnswerStep1(false)">No, es una cantidad</div>
                </div>
            </div>`;
    }

    window.gameAnswerStep1 = function (userSaysCategoria) {
        const v = orden[idx];
        total++;
        const correct = userSaysCategoria === v.esCategoria;
        markOptions(correct, userSaysCategoria ? 0 : 1);
        if (correct) score++;
        updateScore();
        setTimeout(() => {
            if (v.esCategoria) renderStep2a(); else renderStep2b();
        }, 900);
    };

    function renderStep2a() {
        const c = document.getElementById('game-question-container');
        c.innerHTML += `
            <div class="game-step mt-4">
                <p class="font-semibold text-slate-700 mb-2">Paso 2. Es cualitativa. ¿Las categorías tienen un orden natural?</p>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div class="game-option bg-white rounded-lg p-3 text-center font-semibold text-slate-700" onclick="gameAnswerStep2a(true)">Sí, tienen orden</div>
                    <div class="game-option bg-white rounded-lg p-3 text-center font-semibold text-slate-700" onclick="gameAnswerStep2a(false)">No, no tienen orden</div>
                </div>
            </div>`;
    }

    window.gameAnswerStep2a = function (userSaysOrden) {
        const v = orden[idx];
        total++;
        const correct = userSaysOrden === v.tieneOrden;
        markOptions(correct, userSaysOrden ? 0 : 1);
        if (correct) score++;
        updateScore();
        setTimeout(() => showResult(v), 900);
    };

    function renderStep2b() {
        const c = document.getElementById('game-question-container');
        c.innerHTML += `
            <div class="game-step mt-4">
                <p class="font-semibold text-slate-700 mb-2">Paso 2. Es cuantitativa. ¿Se obtiene contando o midiendo?</p>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div class="game-option bg-white rounded-lg p-3 text-center font-semibold text-slate-700" onclick="gameAnswerStep2b('contando')">Contando (enteros)</div>
                    <div class="game-option bg-white rounded-lg p-3 text-center font-semibold text-slate-700" onclick="gameAnswerStep2b('midiendo')">Midiendo (decimales)</div>
                </div>
            </div>`;
    }

    window.gameAnswerStep2b = function (userSaysObtiene) {
        const v = orden[idx];
        total++;
        const correct = userSaysObtiene === v.obtiene;
        markOptions(correct, userSaysObtiene === 'contando' ? 0 : 1);
        if (correct) score++;
        updateScore();
        setTimeout(() => showResult(v), 900);
    };

    function markOptions(correct, chosenIndex) {
        const steps = document.querySelectorAll('#game-question-container .game-step');
        const lastStep = steps[steps.length - 1];
        const allOpts = lastStep.querySelectorAll('.game-option');
        allOpts.forEach((el, i) => {
            el.classList.add('disabled');
            if (i === chosenIndex) el.classList.add(correct ? 'correct' : 'wrong');
        });
    }

    function showResult(v) {
        const box = document.getElementById('game-final-result');
        box.className = 'mt-4 pop-in bg-green-50 border-2 border-green-600 rounded-xl p-4 text-center';
        box.innerHTML = `
            <p class="text-sm text-slate-600">Clasificación de "<strong>${v.nombre}</strong>":</p>
            <p class="text-xl font-bold text-green-800 mt-1">${v.resultado}</p>`;
        box.classList.remove('hidden');
        document.getElementById('game-next-btn').classList.remove('hidden');
    }

    function showGameEnd() {
        updateProgress();
        document.getElementById('game-question-container').innerHTML = '';
        document.getElementById('game-var-name').textContent = 'Juego completado';
        const box = document.getElementById('game-final-result');
        const pct = total > 0 ? Math.round((score / total) * 100) : 0;
        box.className = `mt-4 pop-in rounded-xl p-5 text-center border-2 ${pct >= 70 ? 'bg-green-50 border-green-600' : 'bg-amber-50 border-amber-500'}`;
        box.innerHTML = `
            <p class="text-lg font-bold ${pct >= 70 ? 'text-green-800' : 'text-amber-800'}">Juego terminado</p>
            <p class="text-sm text-slate-600 mt-1">Acertaste ${score} de ${total} pasos (${pct}%).</p>`;
        box.classList.remove('hidden');
        document.getElementById('game-next-btn').classList.add('hidden');
    }

    document.getElementById('game-next-btn')?.addEventListener('click', function () {
        idx++;
        loadVariable();
    });
    document.getElementById('game-restart-btn')?.addEventListener('click', startGame);

    if (document.getElementById('game-var-card')) startGame();
});