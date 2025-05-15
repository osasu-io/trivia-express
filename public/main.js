var memorizeBtns = document.getElementsByClassName('memorize-btn')
var deleteBtns = document.getElementsByClassName('delete-btn')

// mark as memorized
Array.from(memorizeBtns).forEach(function(button) {
  button.addEventListener('click', function() {
    const question = this.dataset.question
    fetch('memorize', {
      method: 'put',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question: question })
    })
    .then(response => {
      if (response.ok) return response.json()
    })
    .then(data => {
      console.log(data)
      window.location.reload(true)
    })
  })
})


// delete trivia
Array.from(deleteBtns).forEach(function(button) {
  button.addEventListener('click', function() {
    const question = this.dataset.question
    fetch('trivia', {
      method: 'delete',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question: question })
    })
    .then(function(response) {
      window.location.reload()
    })
  })
})

// fetch a random trivia question from API
document.getElementById('fetch-btn').addEventListener('click', function () {
  fetch('https://opentdb.com/api.php?amount=1&type=multiple')
    .then(response => response.json())
    .then(data => {
      const trivia = data.results[0]
      document.getElementById('trivia-card').style.display = 'block'
      document.getElementById('display-question').innerHTML = trivia.question
      document.getElementById('display-answer').innerHTML = trivia.correct_answer
      document.getElementById('display-answer').style.display = 'none'
      document.getElementById('save-question').value = trivia.question
      document.getElementById('save-answer').value = trivia.correct_answer
      document.getElementById('save-category').value = trivia.category
      document.getElementById('save-difficulty').value = trivia.difficulty
    })
    .catch(error => {
      console.log('Error fetching trivia:', error)
    })
})

// show the answer on button click
document.getElementById('show-answer-btn').addEventListener('click', function () {
  document.getElementById('display-answer').style.display = 'inline'
})

// show answers in saved list
var revealBtns = document.getElementsByClassName('reveal-answer')
Array.from(revealBtns).forEach(function (btn) {
  btn.addEventListener('click', function () {
    this.previousElementSibling.querySelector('.answer').style.display = 'inline'
  })
})



console.log('Memorize clicked')
