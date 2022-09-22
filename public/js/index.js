const textarea = document.querySelector('.input-query');
const myTable = document.querySelector(".my-table")
textarea.value = textarea.value.replace(/^\s*|\s*$/g,'');

async function fetchData(){
  const response = await fetch('http://localhost:3000', {
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
  
  myTable.innerHTML = '';

  if (rowsData.length != 0){

    let table = document.createElement('table')
    let headerRow = document.createElement('tr')

    // creating headers for the table
    let columnHeaders = Object.keys(rowsData[0]);
    columnHeaders.forEach(val => {
      let header = document.createElement('th')
      let textNode = document.createTextNode(val)

      header.appendChild(textNode)
      headerRow.appendChild(header)
    })
    table.appendChild(headerRow)

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
    table.id = "table"
    myTable.appendChild(table)
  }

}

document.addEventListener('keydown', (event) => {
  if(event.ctrlKey && event.key == "Enter") {
    fetchData()
  }
});