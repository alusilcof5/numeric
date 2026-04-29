function toggleAcc(btn) {
  btn.classList.toggle('open');
  btn.nextElementSibling.classList.toggle('open');
}

const sections = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('.nav-link');
window.addEventListener('scroll', () => {
  let cur = '';
  sections.forEach(s => { if (window.scrollY >= s.offsetTop - 100) cur = s.id; });
  navLinks.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + cur));
});

const obs = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { rootMargin: '-8% 0px -8% 0px' });
document.querySelectorAll('.set-section, .venn-section, .quiz-section').forEach(s => obs.observe(s));

const ALL_QS = [
  // ── NATURALES (5) ──────────────────────────────────────────────
  { set:'N', tipo:'Cálculo directo',
    q: 'Calcula: 347 + 528',
    opts: ['865','875','875','885'], ans: 1,
    ok: 'Correcto. 347 + 528 = 875. La suma de naturales siempre da un natural.',
    err: 'Incorrecto. 347 + 528 = 875. Suma columna a columna: 7+8=15 (llevo 1), 4+2+1=7, 3+5=8.' },
  { set:'N', tipo:'Problema',
    q: 'Un teatro tiene 24 filas con 35 asientos cada una. ¿Cuántos asientos tiene en total?',
    opts: ['59','720','840','804'], ans: 2,
    ok: 'Correcto. 24 × 35 = 840. Multiplicación de naturales: siempre da un natural.',
    err: 'Incorrecto. 24 × 35 = 840. Descompón: 24×30 = 720 y 24×5 = 120. Suma: 840.' },
  { set:'N', tipo:'División con resto',
    q: '156 caramelos se reparten entre 12 niños. ¿Cuántos toca a cada uno y cuántos sobran?',
    opts: ['13 y sobran 0','13 y sobran 1','12 y sobran 12','14 y sobran 0'], ans: 0,
    ok: 'Correcto. 156 ÷ 12 = 13 exacto, sin resto. 12 × 13 = 156.',
    err: 'Incorrecto. 156 ÷ 12 = 13 exacto. 12 × 13 = 156, sin resto.' },
  { set:'N', tipo:'Clasificación',
    q: '¿Cuáles de estos números pertenecen a ℕ?',
    opts: ['−4 y 0','0, 7 y 100','3/2 y 0.5','−1 y 1000'], ans: 1,
    ok: 'Correcto. 0, 7 y 100 son naturales. ℕ = {0, 1, 2, 3, …}: sin negativos ni decimales.',
    err: 'Incorrecto. ℕ = {0, 1, 2, 3, …}. Solo 0, 7 y 100 cumplen la condición.' },
  { set:'N', tipo:'Propiedad de cierre',
    q: '¿Qué operación NO está siempre cerrada en ℕ? (el resultado puede salir de ℕ)',
    opts: ['Suma','Multiplicación','Resta','Ninguna de las anteriores'], ans: 2,
    ok: 'Correcto. 3 − 5 = −2, que NO es natural. La resta puede salir de ℕ.',
    err: 'Incorrecto. La resta puede dar negativos (ej. 3 − 5 = −2), que no pertenecen a ℕ.' },

  // ── ENTEROS (10) ───────────────────────────────────────────────
  { set:'Z', tipo:'Suma con negativos',
    q: 'Calcula: (−12) + 7 + (−3) + 15',
    opts: ['7','−7','37','−13'], ans: 0,
    ok: 'Correcto. Positivos: 7+15=22. Negativos: 12+3=15. 22−15 = 7.',
    err: 'Incorrecto. Agrupa positivos (7+15=22) y negativos (12+3=15). Resta: 22−15 = 7.' },
  { set:'Z', tipo:'Resta de enteros',
    q: '¿Cuánto vale (−8) − (−5)?',
    opts: ['−13','−3','3','13'], ans: 1,
    ok: 'Correcto. (−8) − (−5) = −8 + 5 = −3. Restar un negativo es sumar su opuesto.',
    err: 'Incorrecto. Restar un negativo = sumar su opuesto: −8 − (−5) = −8 + 5 = −3.' },
  { set:'Z', tipo:'Multiplicación de signos',
    q: '¿Cuánto vale (−4) × (−6)?',
    opts: ['−24','24','−10','10'], ans: 1,
    ok: 'Correcto. (−4) × (−6) = +24. Mismo signo → resultado positivo.',
    err: 'Incorrecto. (−) × (−) = (+). Resultado: 4 × 6 = 24, con signo positivo.' },
  { set:'Z', tipo:'División de enteros',
    q: '¿Cuánto vale (−36) ÷ (−9)?',
    opts: ['−4','4','−45','45'], ans: 1,
    ok: 'Correcto. (−36) ÷ (−9) = +4. Mismo signo → cociente positivo.',
    err: 'Incorrecto. (−) ÷ (−) = (+). 36 ÷ 9 = 4, con signo positivo.' },
  { set:'Z', tipo:'Valor absoluto',
    q: 'Ordena de menor a mayor: |−10|, |3|, |−7|, |6|',
    opts: ['|3|, |6|, |−7|, |−10|','|−10|, |−7|, |6|, |3|','|3|, |−7|, |6|, |−10|','|6|, |3|, |−7|, |−10|'], ans: 0,
    ok: 'Correcto. |−10|=10, |3|=3, |−7|=7, |6|=6. Orden: 3 < 6 < 7 < 10.',
    err: 'Incorrecto. Calcula: |3|=3, |6|=6, |−7|=7, |−10|=10. Orden: 3 < 6 < 7 < 10.' },
  { set:'Z', tipo:'Problema: temperatura',
    q: 'La temperatura era −5°C y subió 13 grados. ¿Temperatura final?',
    opts: ['8°C','−8°C','−18°C','18°C'], ans: 0,
    ok: 'Correcto. −5 + 13 = 8°C.',
    err: 'Incorrecto. −5 + 13 = 8°C. Sumas sobre la recta: desde −5 avanzas 13 hacia la derecha.' },
  { set:'Z', tipo:'Problema: deuda',
    q: 'Tienes −120€ en el banco y recibes 75€. ¿Cuánto tienes ahora?',
    opts: ['195€','−195€','−45€','45€'], ans: 2,
    ok: 'Correcto. −120 + 75 = −45€. Sigues en negativo.',
    err: 'Incorrecto. −120 + 75 = −45€. Los 75€ no cubren la deuda de 120€.' },
  { set:'Z', tipo:'Operación combinada',
    q: 'Calcula: (−3) × 4 − (−6)',
    opts: ['−18','−6','6','18'], ans: 1,
    ok: 'Correcto. Primero el producto: −3 × 4 = −12. Luego: −12 − (−6) = −12 + 6 = −6.',
    err: 'Incorrecto. Prioridad: −3×4 = −12 primero. Luego −12 −(−6) = −12+6 = −6.' },
  { set:'Z', tipo:'Comparación',
    q: '¿Cuál es el mayor de estos enteros?',
    opts: ['−1','−100','0','−50'], ans: 2,
    ok: 'Correcto. 0 > −1 > −50 > −100. En la recta, más a la derecha = mayor.',
    err: 'Incorrecto. 0 es el mayor. En la recta numérica: 0 > −1 > −50 > −100.' },
  { set:'Z', tipo:'Potencias con negativos',
    q: '¿Cuánto vale (−2)⁴?',
    opts: ['−16','16','8','−8'], ans: 1,
    ok: 'Correcto. (−2)⁴ = (−2)×(−2)×(−2)×(−2) = 4×4 = 16. Exponente par → positivo.',
    err: 'Incorrecto. (−2)⁴: cuatro factores negativos → pares de negativos = positivo. Resultado: 16.' },

  // ── RACIONALES (10) ────────────────────────────────────────────
  { set:'Q', tipo:'Suma de fracciones',
    q: 'Calcula: 3/4 + 1/6',
    opts: ['4/10','11/12','4/24','5/10'], ans: 1,
    ok: 'Correcto. mcm(4,6)=12. 9/12 + 2/12 = 11/12.',
    err: 'Incorrecto. mcm(4,6)=12. Amplifica: 3/4=9/12 y 1/6=2/12. Suma: 11/12.' },
  { set:'Q', tipo:'Resta de fracciones',
    q: 'Calcula: 5/6 − 1/4',
    opts: ['4/2','7/12','1/2','3/12'], ans: 1,
    ok: 'Correcto. mcm(6,4)=12. 10/12 − 3/12 = 7/12.',
    err: 'Incorrecto. mcm(6,4)=12. 5/6=10/12 y 1/4=3/12. Resta: 7/12.' },
  { set:'Q', tipo:'Multiplicación de fracciones',
    q: 'Calcula: 3/4 × 8/9',
    opts: ['11/13','24/36 = 2/3','3/9','1/3'], ans: 1,
    ok: 'Correcto. 3×8=24 y 4×9=36. 24/36 = 2/3 simplificado.',
    err: 'Incorrecto. Numeradores: 3×8=24. Denominadores: 4×9=36. Simplifica: 24/36 = 2/3.' },
  { set:'Q', tipo:'División de fracciones',
    q: 'Calcula: 5/8 ÷ 1/4',
    opts: ['5/32','20/8 = 5/2','5/4','1/2'], ans: 1,
    ok: 'Correcto. 5/8 ÷ 1/4 = 5/8 × 4/1 = 20/8 = 5/2.',
    err: 'Incorrecto. Dividir = multiplicar por la inversa: 5/8 × 4/1 = 20/8 = 5/2.' },
  { set:'Q', tipo:'Decimal exacto vs periódico',
    q: '¿Cuál de estas fracciones tiene decimal exacto?',
    opts: ['1/3','2/7','3/8','5/6'], ans: 2,
    ok: 'Correcto. 3/8: denominador = 2³ (solo factor 2) → decimal exacto: 0.375.',
    err: 'Incorrecto. Mira el denominador simplificado: 3/8 → 2³ (solo factores 2) → exacto: 0.375.' },
  { set:'Q', tipo:'Fracción a decimal',
    q: '¿Cuánto vale 7/4 en decimal?',
    opts: ['1.5','1.75','0.75','1.25'], ans: 1,
    ok: 'Correcto. 7 ÷ 4 = 1.75. O bien: 7/4 = 1 + 3/4 = 1 + 0.75 = 1.75.',
    err: 'Incorrecto. 7 ÷ 4: 4 cabe 1 vez en 7, resto 3. 30÷4=7 resto 2. 20÷4=5. → 1.75.' },
  { set:'Q', tipo:'Decimal a fracción',
    q: '¿A qué fracción equivale 0.6?',
    opts: ['6/100','3/5','1/6','2/3'], ans: 1,
    ok: 'Correcto. 0.6 = 6/10 = 3/5 simplificado.',
    err: 'Incorrecto. 0.6 = 6/10. Simplifica dividiendo por 2: 3/5.' },
  { set:'Q', tipo:'Comparación de fracciones',
    q: '¿Cuál es mayor: 3/5 o 5/8?',
    opts: ['3/5','5/8','Son iguales','No se puede comparar'], ans: 1,
    ok: 'Correcto. mcm(5,8)=40. 3/5=24/40 y 5/8=25/40. Como 25>24, 5/8 > 3/5.',
    err: 'Incorrecto. Iguala denominadores: mcm=40. 3/5=24/40 y 5/8=25/40. 5/8 es mayor.' },
  { set:'Q', tipo:'Operación combinada',
    q: 'Calcula: 1/2 + 1/3 × 3/4',
    opts: ['3/4','1/2 + 1/4 = 3/4','7/12','9/24'], ans: 1,
    ok: 'Correcto. Primero la multiplicación: 1/3 × 3/4 = 3/12 = 1/4. Luego: 1/2 + 1/4 = 3/4.',
    err: 'Incorrecto. Prioridad: 1/3 × 3/4 = 1/4 primero. Luego 1/2 + 1/4 = 2/4 + 1/4 = 3/4.' },
  { set:'Q', tipo:'Problema',
    q: 'Una receta usa 3/4 de taza de harina. Si haces 2/3 de la receta, ¿cuánta harina necesitas?',
    opts: ['1/2 taza','5/7 taza','1 taza','3/7 taza'], ans: 0,
    ok: 'Correcto. 3/4 × 2/3 = 6/12 = 1/2 taza.',
    err: 'Incorrecto. Multiplica: 3/4 × 2/3 = 6/12 = 1/2 taza.' }
];

let currentFilter = 'ALL';
let QS = [...ALL_QS];

function setFilter(set, btn) {
  currentFilter = set;
  document.querySelectorAll('.q-filter').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  QS = set === 'ALL' ? [...ALL_QS] : ALL_QS.filter(q => q.set === set);
  qCur = 0; qOk = 0; qAnswered = false;
  buildQuiz();
}

let qCur = 0, qOk = 0, qAnswered = false;

function buildQuiz() {
  const prog  = document.getElementById('qProgress');
  const cards = document.getElementById('qCards');
  const res   = document.getElementById('qResult');
  prog.innerHTML = ''; cards.innerHTML = '';
  res.classList.remove('show');

  QS.forEach((q, i) => {
    const pip = document.createElement('div');
    pip.className = 'q-pip' + (i === 0 ? ' live' : '');
    pip.id = 'pip' + i;
    prog.appendChild(pip);

    const card = document.createElement('div');
    card.className = 'q-card' + (i === 0 ? ' live' : '');
    card.id = 'qc' + i;
    card.innerHTML = `
      <div class="q-num" style="display:flex;justify-content:space-between;align-items:center">
        <span>Pregunta ${i+1} de ${QS.length}</span>
        <span style="font-family:var(--mono);color:var(--text3);font-size:9px;text-transform:uppercase;letter-spacing:0.1em">${q.set === 'N' ? 'ℕ' : q.set === 'Z' ? 'ℤ' : 'ℚ'} · ${q.tipo}</span>
      </div>
      <p class="q-text">${q.q}</p>
      <div class="q-options">
        ${q.opts.map((o,j) => `<button class="q-opt" data-q="${i}" data-j="${j}">${o}</button>`).join('')}
      </div>
      <div class="q-feedback" id="fb${i}"></div>
      <div class="q-nav">
        <button class="btn-next" id="next${i}" onclick="nextQ(${i})" disabled>
          ${i < QS.length-1 ? 'Siguiente →' : 'Ver resultado'}
        </button>
        <span class="q-score-txt" id="sc${i}"></span>
      </div>`;
    cards.appendChild(card);
  });

  document.querySelectorAll('.q-opt').forEach(b => b.addEventListener('click', () => answer(b)));
}

function answer(btn) {
  const qi = +btn.dataset.q, j = +btn.dataset.j;
  if (qAnswered && qCur === qi) return;
  qAnswered = true;
  const q = QS[qi];
  const correct = j === q.ans;
  if (correct) qOk++;
  document.getElementById('pwOk').textContent    = qOk;
  document.getElementById('pwTotal').textContent = qi + 1;
  document.querySelectorAll(`.q-opt[data-q="${qi}"]`).forEach((b, k) => {
    b.disabled = true;
    if (k === q.ans) b.classList.add('correct');
    else if (k === j && !correct) b.classList.add('wrong');
  });
  const fb = document.getElementById('fb' + qi);
  fb.textContent = correct ? q.ok : q.err;
  fb.className   = 'q-feedback show ' + (correct ? 'ok' : 'err');
  document.getElementById('next' + qi).disabled = false;
  document.getElementById('sc'   + qi).textContent = `${qOk} / ${qi+1}`;
}

function nextQ(qi) {
  document.getElementById('qc'  + qi).classList.remove('live');
  document.getElementById('pip' + qi).classList.replace('live','done');
  const next = qi + 1;
  if (next < QS.length) {
    document.getElementById('qc'  + next).classList.add('live');
    document.getElementById('pip' + next).classList.add('live');
    qAnswered = false; qCur = next;
  } else { showFinal(); }
}

function showFinal() {
  document.getElementById('qResult').classList.add('show');
  document.getElementById('qBig').textContent = `${qOk} / ${QS.length}`;
  const msgs = [
    'Sigue practicando. Repasa las secciones que fallaste.',
    'Buen intento. Revisa los conceptos y vuelve.',
    'Correcto. Tienes una base sólida.',
    'Muy bien. Dominas los conjuntos numéricos.',
    'Perfecto. Excelente comprensión.'
  ];
  document.getElementById('qMsg').textContent = msgs[Math.min(qOk, msgs.length-1)];
}

function resetQuiz() { qCur = 0; qOk = 0; qAnswered = false; buildQuiz(); }
buildQuiz();
