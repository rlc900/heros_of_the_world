// Practice your JS here!
let addHero = false
  const elems = document.querySelectorAll('.modal');
  const instances = M.Modal.init(elems, 0.5);

  const addBtn = document.querySelector('#new-hero-btn')
  const heroForm = document.querySelector('.container')
  const heroUrl = `http://localhost:3000/heros`
  const heroCollection = document.querySelector('#hero-collection')

  document.querySelector('#add-hero').style.font = '20px luminari,fantasy';
  document.querySelector('#new-hero-btn').style.font = '20px luminari,fantasy';


  addBtn.addEventListener('click', () => {
  // hide & seek with the form
  // console.log('aeyee')
  addHero = !addHero
  if (addHero) {
    heroForm.style.display = 'block'
  } else {
    heroForm.style.display = 'none'
  }
})


let charactersArray = [
  {name: "Rei", quote: "I love Overwatch so much", img_url: "google.com", likes: 1000},
  {name: "Eric", quote: "I meh Overwatch so much", img_url: "yahoo.com", likes: 500},
  {name: "Sylwia", quote: "I enjoy Overwatch so much", img_url: "askjeeves.com", likes: 900}
]

charactersArray.forEach((charObj) => {
  const newButton = document.createElement('button')
    newButton.innerText = charObj.name
    newButton.addEventListener('click', (e) => {
      fetch(`${heroUrl}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          'name': charObj.name,
          'quote': charObj.quote,
          'img_url': charObj.img_url,
          'likes': charObj.likes
        })
      })
      .then(r => r.json())
      .then((newHeroObj) => {
        generateHeroCard(newHeroObj)
      })
    })
    heroCollection.append(newButton)
})




















// GET FETCH
  fetch(heroUrl)
  .then(r => r.json())
  .then(heroArr => heroArr.forEach(hero => {
    generateHeroCard(hero)
  }))


function generateHeroCard(hero) {
  // this function generates the hero card that is displayed
  // on the page. it includes the heros name, image, a quote, & a like & delete button.
  // the modalFunc allows user to click on a heros image and display their statistics.
  // console.log(hero)
const heroDiv = document.createElement('div')
heroDiv.className = 'card'
let modalFunc = document.createElement('a')
    modalFunc.className = "btn modal-trigger"
    modalFunc.href = '#modal1';
    modalFunc.style.height = '100%';
    modalFunc.style.width = '100%';
    modalFunc.style.backgroundColor = 'white';

  const h2 = document.createElement('h2')
    h2.innerText = hero.name
    h2.style.font = "20px luminari,fantasy";

  const image = document.createElement('img')
    image.src = hero.img_url
    image.className = 'hero-avatar'


    image.addEventListener('click', (e) => {
        generateStatistics(hero)
    })

  const p1 = document.createElement('p')
    p1.innerText = hero.likes
  const p2 = document.createElement('p')
    p2.innerText = hero.quote
  const likeButton = document.createElement('button')
    likeButton.className = 'like-btn'
    likeButton.innerText = '♥'
    likeButton.addEventListener('click', function() {
      increaseLikes(hero, p1)
    })
  const deleteButton = document.createElement('button')
    deleteButton.className = 'delete-btn'
    deleteButton.innerText = 'Delete Hero'
    deleteButton.style.font = '15px luminari,fantasy'
    deleteButton.addEventListener('click', (event) => {
      deleteHero(hero, heroDiv)
      })

    modalFunc.append(image)
  heroDiv.append(h2, modalFunc, p1, p2, likeButton, deleteButton)
  heroCollection.append(heroDiv)
}


function generateStatistics(hero) {
  // this function generates the statistics for said hero.
  // it is invoked in the generateHeroCard() function inside of its event listener.
  hero.statistics.forEach(stat => {
    const heroNameEle = document.querySelector('#hero_name')
    // console.log(heroNameEle)
      heroNameEle.innerText = hero.name

      const h1RoleStat = document.querySelector('#hero_role')
        h1RoleStat.innerText = stat.role
      const h2HealthStat = document.querySelector('#hero_health')
        h2HealthStat.innerText = stat.health
      const h3AffiliationStat = document.querySelector('#hero_affiliation')
        h3AffiliationStat.innerText = stat.affiliation
  })
}


  heroForm.addEventListener('submit', function(e) {
    e.preventDefault()
    // console.log(e)
    // debugger
    // here i set variables equal to the targeted event which is the hero form.
    // i targeted the input names in order for me to get the values.
    // i then set the attributes of created hero equal to the new values and
    // invoked my generateHeroCard() function to create a card for the new hero.
    const heroName = e.target.name.value
    const heroImage = e.target.image.value
    const heroQuote = e.target.quote.value

    //  CREATE FETCH
    fetch(heroUrl, {
      method: 'POST',
      headers:
      {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
        body: JSON.stringify({
          "name": heroName,
          "img_url": heroImage,
          "quote": heroQuote
        })
    })
    .then(r => r.json())
    .then((newHeroObj) => {
      generateHeroCard(newHeroObj)
    })
  })


function increaseLikes(hero, pTag) {
  // this function is for liking the hero card which takes in a hero and pTag.
  // the json object thats returned in the fetch is the updatedHero,
  // therefore in the second .then i set the original likes equal to the updatedHero likes,
  // then changed the innerText of the pTag to display the updated like!

const newLikes = hero.likes + 1

// UPDATE FETCH
fetch(`${heroUrl}/${hero.id}`, {
  method: 'PATCH',
  headers:
{
  "Content-Type": "application/json",
  "Accept": "application/json"
},
  body: JSON.stringify({
  "likes": newLikes
})
})
.then(r => r.json())
// .then(console.log)
.then((updatedHero) => {
  hero.likes = updatedHero.likes
  pTag.innerText = hero.likes
  })
}


// DELETE FETCH
function deleteHero(hero, div){
  // console.log(hero)
  fetch(`${heroUrl}/${hero.id}`, {
    method: 'DELETE'
  })
  .then(r => r.json())
  .then((deletedHero) => {
    div.remove()
  })
}
