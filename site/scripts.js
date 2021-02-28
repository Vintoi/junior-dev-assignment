let items;
const manufacturers = [];
const controller = new AbortController();
const signal = controller.signal;

const getItems = (category) => {
  showMessage('Loading information')
  fetch(`/product/${category}`,{
    signal: signal
  })
  .then(res => res.json())
  .then(data => {
    items = data.map(item => {
      item.id = item.id.toUpperCase();
      return item;
    })
  })
  .then(() => {
    renderItems();
    getAvailability();
  })
  .catch(error => {
    showMessage(error);
    console.log(error);
  })
}

const renderItems = () => {
  const itemTable = document.getElementById('item-table');
  itemTable.innerHTML = '';
  const tableHeadRow = document.createElement('tr');
  const tableHeadingName = document.createElement('th');
  tableHeadingName.textContent = 'Name';
  const tableHeadingAvailability = document.createElement('th');
  tableHeadingAvailability.textContent = 'Availability';
  const tableHeadingManufacturer = document.createElement('th');
  tableHeadingManufacturer.textContent = 'Manufacturer';
  const tableHeadingPrice = document.createElement('th');
  tableHeadingPrice.textContent = 'Price €';
  const tableHeadingColor = document.createElement('th');
  tableHeadingColor.textContent = 'Color';
  tableHeadRow.appendChild(tableHeadingName);
  tableHeadRow.appendChild(tableHeadingManufacturer);
  tableHeadRow.appendChild(tableHeadingPrice);
  tableHeadRow.appendChild(tableHeadingColor);
  tableHeadRow.appendChild(tableHeadingAvailability);
  itemTable.appendChild(tableHeadRow);
  
  for(let i=0; i < items.length; i++){
    if(!manufacturers.includes(items[i].manufacturer)){
      manufacturers.push(items[i].manufacturer);
    }

    const tableRow = document.createElement('tr');

    const name = document.createElement('td');
    name.textContent = items[i].name;
    tableRow.appendChild(name);


    const manufacturer = document.createElement('td');
    manufacturer.textContent = items[i].manufacturer;
    tableRow.appendChild(manufacturer);

    const price = document.createElement('td');
    price.textContent = items[i].price + " €";
    tableRow.appendChild(price);

    const color = document.createElement('td');
    for(let j=0; j < items[i].color.length; j++){
      color.textContent += items[i].color[j] + (j != items[i].color.length - 1 ? ', ' : '');
    }
    tableRow.appendChild(color);

    const availability = document.createElement('td');
    availability.textContent = items[i].availability;
    tableRow.appendChild(availability);

    itemTable.appendChild(tableRow);
  }
  
}

const getAvailability = () => {
  showMessage('Loading availability');
  const requests = manufacturers.map(manufacturer => fetch(`/availability/${manufacturer}`,{
    signal: signal
  }))
  Promise.all(requests)
  .then(responses => {
    return Promise.all(responses.map(response => {
      return response.json();
    }));
  }).then(responses => {
    showMessage('');
    handleAvailability(responses);
    renderItems();
  }).catch(error => {
    showMessage(error)
  });
}

const handleAvailability = (responses) => {
  responses.forEach(response => {
    if(response.response.length < 3){
      showMessage('There was problem while loading availability information. Try refreshing')
    }
    for(let j=0; j < response.response.length; j++){
      const index = items.findIndex(x => x.id === response.response[j].id);
      if(index != -1){
        const xml = response.response[j].DATAPAYLOAD;
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xml,"text/xml");
        const value = xmlDoc.getElementsByTagName("INSTOCKVALUE")[0].childNodes[0].nodeValue;
        items[index]["availability"] = value;
      }
    }
  })
}

const showMessage = (message) => {
  const messageContainer = document.getElementById('message-container');
  messageContainer.textContent = message;
}


const abortRequests = () => {
  controller.abort();
}

window.onbeforeunload = () => {
  abortRequests();
}

function sortTable(n) {
  var table,
    rows,
    switching,
    i,
    x,
    y,
    shouldSwitch,
    dir,
    switchcount = 0;
  table = document.getElementById("myTable");
  switching = true;
  //Set the sorting direction to ascending:
  dir = "asc";
  /*Make a loop that will continue until
  no switching has been done:*/
  while (switching) {
    //start by saying: no switching is done:
    switching = false;
    rows = table.getElementsByTagName("TR");
    /*Loop through all table rows (except the
    first, which contains table headers):*/
    for (i = 1; i < rows.length - 1; i++) { //Change i=0 if you have the header th a separate table.
      //start by saying there should be no switching:
      shouldSwitch = false;
      /*Get the two elements you want to compare,
      one from current row and one from the next:*/
      x = rows[i].getElementsByTagName("TD")[n];
      y = rows[i + 1].getElementsByTagName("TD")[n];
      /*check if the two rows should switch place,
      based on the direction, asc or desc:*/
      if (dir == "asc") {
        if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
          //if so, mark as a switch and break the loop:
          shouldSwitch = true;
          break;
        }
      } else if (dir == "desc") {
        if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
          //if so, mark as a switch and break the loop:
          shouldSwitch = true;
          break;
        }
      }
    }
    if (shouldSwitch) {
      /*If a switch has been marked, make the switch
      and mark that a switch has been done:*/
      rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
      switching = true;
      //Each time a switch is done, increase this count by 1:
      switchcount++;
    } else {
      /*If no switching has been done AND the direction is "asc",
      set the direction to "desc" and run the while loop again.*/
      if (switchcount == 0 && dir == "asc") {
        dir = "desc";
        switching = true;
      }
    }
  }
}
