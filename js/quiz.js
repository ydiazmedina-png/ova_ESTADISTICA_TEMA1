document.addEventListener('DOMContentLoaded', function () {
    const questions = [
        { q: "¿Qué es la población en estadística?", opts: ["Un grupo de personas que vive en una ciudad","El conjunto completo de todos los elementos que comparten una característica y se desea estudiar","Un subconjunto seleccionado para el análisis","Los datos numéricos de un estudio"], ans: 1 },
        { q: "Una empresa revisa 300 de los 12 000 tickets de soporte del año. El valor 300 corresponde a:", opts: ["El parámetro","El tamaño de la población (N)","El tamaño de la muestra (n)","El individuo"], ans: 2 },
        { q: "El tiempo de respuesta de un servidor en milisegundos es una variable:", opts: ["Cualitativa nominal","Cuantitativa discreta de intervalo","Cuantitativa continua de razón","Cualitativa ordinal"], ans: 2 },
        { q: "La variable 'severidad de un bug (baja, media, alta, crítica)' es:", opts: ["Cuantitativa discreta","Cualitativa nominal","Cualitativa ordinal","Cuantitativa continua"], ans: 2 },
        { q: "¿Cuál de estas variables tiene escala de razón?", opts: ["Temperatura del CPU en °C","Código de estado HTTP","Número de descargas de la app","Nivel de satisfacción (1-5)"], ans: 2 },
        { q: "Si se analizan TODOS los registros de una base de datos, el estudio se llama:", opts: ["Muestreo","Inferencia","Censo","Estimación"], ans: 2 },
        { q: "¿Por qué no tiene sentido calcular el promedio de la variable 'sistema operativo'?", opts: ["Porque los sistemas operativos son muy diferentes","Porque es una variable cualitativa nominal sin orden matemático","Porque solo hay pocos sistemas operativos","Porque su escala es de razón"], ans: 1 },
        { q: "El símbolo μ representa:", opts: ["La media de una muestra","La desviación estándar de la muestra","La media de la población (parámetro)","El tamaño de la muestra"], ans: 2 },
        { q: "El número de bugs reportados por semana es una variable:", opts: ["Continua, porque puede ser muy grande","Discreta, porque se obtiene contando enteros","Cualitativa ordinal","Continua de razón"], ans: 1 },
        { q: "En escala de intervalo, el cero:", opts: ["Significa ausencia total de la propiedad","Es un valor arbitrario o convencional","No existe","Es siempre el valor mínimo posible"], ans: 1 }
    ];

    function buildQuiz() {
        const container = document.getElementById('quiz-container');
        container.innerHTML = '';
        questions.forEach((q, i) => {
            const div = document.createElement('div');
            div.className = 'mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200';
            div.innerHTML = `<p class="font-semibold text-slate-800 mb-3">${i + 1}. ${q.q}</p>
            <div class="space-y-2">${q.opts.map((o, j) =>
                `<label class="quiz-option flex items-center p-3 rounded-lg border-2 border-gray-200 cursor-pointer hover:bg-green-50 transition-colors">
                    <input type="radio" name="q${i}" value="${j}" class="mr-3 accent-green-600">
                    <span class="text-slate-700">${o}</span></label>`).join('')}</div>
            <div class="feedback-${i} mt-2 text-sm font-medium hidden"></div>`;
            container.appendChild(div);
        });
    }
    buildQuiz();

    document.getElementById('submit-quiz-btn').addEventListener('click', function () {
        let score = 0;
        questions.forEach((q, i) => {
            const sel = document.querySelector(`input[name="q${i}"]:checked`);
            const fb = document.querySelector(`.feedback-${i}`);
            if (sel) {
                const val = parseInt(sel.value);
                if (val === q.ans) { score++; fb.textContent = '✅ ¡Correcto!'; fb.className = `feedback-${i} mt-2 text-sm font-medium text-green-700`; }
                else { fb.textContent = `❌ Incorrecto. Respuesta: "${q.opts[q.ans]}"`; fb.className = `feedback-${i} mt-2 text-sm font-medium text-red-700`; }
                fb.classList.remove('hidden');
            }
        });
        const pct = Math.round((score / questions.length) * 100);
        document.getElementById('quiz-result').innerHTML =
            `<div class="p-4 rounded-lg ${pct >= 70 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}">
            Obtuviste <strong>${score} de ${questions.length}</strong> correctas (${pct}%).
            ${pct >= 70 ? '🎉 ¡Excelente dominio del tema!' : '📚 Revisa el contenido e inténtalo de nuevo.'}</div>`;
        document.getElementById('submit-quiz-btn').classList.add('hidden');
        document.getElementById('reset-quiz-btn').classList.remove('hidden');
    });
    document.getElementById('reset-quiz-btn').addEventListener('click', function () {
        document.getElementById('quiz-result').innerHTML = '';
        document.getElementById('submit-quiz-btn').classList.remove('hidden');
        document.getElementById('reset-quiz-btn').classList.add('hidden');
        buildQuiz();
    });
});