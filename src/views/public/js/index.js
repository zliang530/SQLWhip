const textarea = document.querySelector('.input-query')
const myTable = document.querySelector(".my-table")
const fetchInit = document.querySelector(".fetch-init")
const fetchNext = document.querySelector(".fetch-next")
const fetchPrev = document.querySelector(".fetch-prev")
var sql = textarea.value
let offset = 0;


textarea.value = textarea.value.replace(/^\s*|\s*$/g,'');

new ResizeObserver(() => {
  const val = 600 - textarea.offsetHeight
  myTable.style.height = `${val}px`
}).observe(textarea)

// take in array of objects and populate dom 
function populateTable(rowsData){

  // clear the table of existing data from pervious queries if any
  myTable.innerHTML = '';

  // syntax error in user query or data does not exist from the resulting query
  if (rowsData.length != 0){
    
    let table = document.createElement('table')
    let headerRow = document.createElement('tr')
    table.classList = "table" // the table element must contain the css class from bootstrap
    
    // creating headers for the table
    let columnHeaders = Object.keys(rowsData[0]);
    columnHeaders.forEach(val => {
      let header = document.createElement('th')
      let textNode = document.createTextNode(val)

      header.appendChild(textNode)
      headerRow.appendChild(header)
    })
    table.appendChild(headerRow)

    // populating the non header rows of the table
    rowsData.forEach(obj => {
      let row = document.createElement('tr')

      Object.values(obj).forEach( val => {
        let cell = document.createElement('td')
        let textNode = document.createTextNode(val)

        cell.appendChild(textNode)
        row.appendChild(cell)
      })
      table.appendChild(row)
    })

    myTable.appendChild(table)
  }
  else{
    let p = document.createElement('p')
    p.classList = "warning"
    p.textContent="Something went wrong...\n"
    myTable.appendChild(p)

    p = document.createElement('p')
    p.classList = "warning"
    p.textContent="Please try again with another query..."
    myTable.appendChild(p)

    offset = offset-1 // to re-adjust the fetchNext click callack where offset adds one
  }
}

// submit user query of a question
async function testQuery(questionNumber){
  // submit query to one of api endpoints to confirm the validity of the response to the question
  const response = await fetch(`http://localhost:3000/questions/${questionNumber}`, {
    method: 'POST', 
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      query: textarea.value
    })
  }); 
  const json = await response.json();
  const rowsData = json.rows;
  populateTable(rowsData)

  const modalBody = document.querySelector(".modal-body-results")
  const modalTitle = document.querySelector(".modal-title-results")

  if (json.valid == true){
    modalTitle.textContent = "Correct"
    modalBody.textContent = "You solved this question!"
  }
  else{
    modalTitle.textContent = "Incorrect"
    modalBody.textContent = "Please retry, something went wrong"
  }
}

// post user query to an api endpoint and displayed requested results onto a table
async function fetchData(){
  const response = await fetch('http://localhost:3000', {
    method: 'POST', 
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      query: sql,
      offset
    })
  }); 

  const json = await response.json();
  const rowsData = json.rows;
  
  populateTable(rowsData)
  return rowsData.length
}

document.addEventListener('keydown', (event) => {
  if(event.ctrlKey && event.key == "Enter") {
    offset=0
    sql = textarea.value
    fetchData(offset)
  }
});

fetchInit.addEventListener('click', ()=> {
  offset=0
  sql = textarea.value
  fetchData(offset)
  console.log(offset)
})

fetchNext.addEventListener('click', ()=> {
  offset+=1
  fetchData(offset)
  console.log(offset)
})

fetchPrev.addEventListener('click', ()=> {
    if(offset-1 >= 0){
      offset-=1
      fetchData(offset)
    }
    console.log(offset)
})