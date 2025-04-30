document.addEventListener('DOMContentLoaded', () => {
  const saveBtn = document.getElementById('save-btn');
  if (saveBtn) {
    saveBtn.addEventListener('click', () => {
      fetch('/favorites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: document.querySelector('.random p:nth-child(3)').textContent.replace('Question: ', ''),
          correct: document.querySelector('.random p:nth-child(4)').textContent.replace('Answer: ', ''),
          category: document.querySelector('.random p:nth-child(2)').textContent.replace('Category: ', '')
        })
      }).then(res => res.json()).then(() => location.reload());
    });
  }

  document.querySelectorAll('.delete').forEach(btn => {
    btn.addEventListener('click', () => {
      fetch('/favorites', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: btn.dataset.q })
      }).then(() => location.reload());
    });
  });

  document.querySelectorAll('.memorize').forEach(btn => {
    btn.addEventListener('click', () => {
      fetch('/memorize', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: btn.dataset.q })
      }).then(() => location.reload());
    });
  });
});