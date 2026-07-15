document.addEventListener('DOMContentLoaded', function () {
    const synth = window.speechSynthesis;
    document.querySelectorAll('.speech-controls').forEach(function (control) {
        const target = control.dataset.target;
        const playBtn = control.querySelector('.play-btn');
        const pauseBtn = control.querySelector('.pause-btn');
        const stopBtn = control.querySelector('.stop-btn');
        const rateInput = control.querySelector('.speech-rate');
        function getText() { const pane = document.getElementById(target); return pane ? pane.innerText : ''; }
        playBtn.addEventListener('click', function () {
            if (synth.speaking && !synth.paused) return;
            if (synth.paused) { synth.resume(); return; }
            synth.cancel();
            const utt = new SpeechSynthesisUtterance(getText());
            utt.lang = 'es-ES'; utt.rate = rateInput ? parseFloat(rateInput.value) : 1;
            utt.onend = () => { playBtn.disabled = false; pauseBtn.disabled = true; stopBtn.disabled = true; };
            synth.speak(utt); playBtn.disabled = true; pauseBtn.disabled = false; stopBtn.disabled = false;
        });
        pauseBtn.addEventListener('click', function () { if (synth.speaking) synth.pause(); playBtn.disabled = false; pauseBtn.disabled = true; });
        stopBtn.addEventListener('click', function () { synth.cancel(); playBtn.disabled = false; pauseBtn.disabled = true; stopBtn.disabled = true; });
    });
});