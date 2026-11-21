/* Quiz answers stay in this browser. No requests or analytics events are sent here. */
(function () {
  'use strict';
  var KEY = 'fwv_quiz_foundations_v1';
  var root = document.getElementById('fwv-quiz');
  if (!root) return;
  var questions = Array.prototype.slice.call(root.querySelectorAll('[data-question]'));
  var state = {}, persistent = true;
  try {
    var parsed = JSON.parse(localStorage.getItem(KEY) || '{}');
    if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) state = parsed;
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch (e) { persistent = false; }
  var summary = document.getElementById('quiz-progress');
  var storage = document.getElementById('quiz-storage');
  function storageText() {
    storage.textContent = persistent ? 'Progress is saved only in this browser on this device. It is not sent to us or synced. Clearing site data removes it.' : 'Browser storage is unavailable. You can still practice, but this session\'s progress may be lost when you leave.';
  }
  function refresh() {
    var attempted = 0, correct = 0;
    questions.forEach(function (q) {
      var id = q.dataset.question, value = state[id];
      if (Number.isInteger(value) && value >= 0 && value < 4) {
        attempted++;
        if (value === Number(q.dataset.answer)) correct++;
      }
    });
    summary.textContent = attempted + ' of ' + questions.length + ' answered · ' + correct + ' correct on your latest checked answers';
  }
  function save() {
    if (persistent) {
      try { localStorage.setItem(KEY, JSON.stringify(state)); }
      catch (e) { persistent = false; storageText(); }
    }
    refresh();
  }
  function showResult(q, value) {
    var correct = value === Number(q.dataset.answer);
    var result = q.querySelector('.quiz-result');
    result.hidden = false;
    result.classList.toggle('quiz-correct', correct);
    result.classList.toggle('quiz-review', !correct);
    result.querySelector('.quiz-verdict').textContent = correct ? 'Correct.' : 'Not quite. Review the explanation and try again.';
    q.querySelector('.quiz-answer-key').hidden = false;
    q.querySelector('.quiz-error').textContent = '';
  }
  questions.forEach(function (q) {
    var key = q.querySelector('.quiz-answer-key');
    key.hidden = true;
    var button = q.querySelector('.quiz-check');
    button.hidden = false;
    var id = q.dataset.question;
    var saved = state[id];
    if (Number.isInteger(saved) && saved >= 0 && saved < 4) {
      q.querySelector('input[value="' + saved + '"]').checked = true;
      showResult(q, saved);
    }
    button.addEventListener('click', function () {
      var selected = q.querySelector('input:checked');
      if (!selected) {
        q.querySelector('.quiz-error').textContent = 'Choose an answer first.';
        q.querySelector('input').focus();
        return;
      }
      var value = Number(selected.value);
      state[id] = value;
      showResult(q, value);
      save();
    });
    q.querySelectorAll('input').forEach(function (input) {
      input.addEventListener('change', function () {
        q.querySelector('.quiz-result').hidden = true;
        key.hidden = true;
        q.querySelector('.quiz-error').textContent = '';
      });
    });
  });
  var reset = document.getElementById('quiz-reset');
  reset.hidden = false;
  reset.addEventListener('click', function () {
    if (!window.confirm('Clear the saved answers for this quiz in this browser?')) return;
    state = {};
    questions.forEach(function (q) {
      q.querySelectorAll('input').forEach(function (input) { input.checked = false; });
      q.querySelector('.quiz-result').hidden = true;
      q.querySelector('.quiz-answer-key').hidden = true;
      q.querySelector('.quiz-error').textContent = '';
    });
    save();
  });
  storageText();
  refresh();
})();
