if (document.readyState !== "loading") {
  // Document ready, executing
  console.log("Document ready, executing");
  initializeCode();
} else {
  document.addEventListener("DOMContentLoaded", function () {
    // Document was not ready, executing when loaded
    console.log("Document ready, executing after a wait");
    initializeCode();
  });
}

function initializeCode() {
  var form = document.getElementById("form");
  var createTableButton = document.getElementById("create-table");
  var dataTable = document.getElementById("data-table");
  var emptyTableButton = document.getElementById("empty-table");
  var submitFormButton = document.getElementById("submit-data");
  var noRows = -1; //number of data rows i.e excluding title row
  var noCols = -1;
  //title row offset
  var title_offset = 1;

  //Autocreate form inputs
  function createForm() {
    var idx = 0;
    for (var i = 0; i < noCols; i++) {
      idx = i + 1;
      var label = document.createElement("label");
      label.for = "col" + idx;
      label.className = "input-row";
      label.innerHTML = "Col " + idx + ":";

      var input = document.createElement("input");
      input.type = "text";
      input.id = "input-col" + idx;
      input.name = "col" + idx;
      input.className = "input-row";

      var br = document.createElement("br");
      br.className = "input-row";
      console.log(label);

      form.appendChild(br);
      form.appendChild(label);
      form.appendChild(input);
    }
  }

  //Request table details from the user
  function inputTableDims() {
    //ATM don't check if values are any good!
    noRows = prompt("How many rows (excluding title)?");
    noCols = prompt("How many columns?");
  }

  //Clear the form of the col inputs (leave others intact)
  function emptyInputForm() {
    //console.log(form.getElementsByClassName("input-row"));
    const stuff = document.querySelectorAll(".input-row");
    stuff.forEach((e) => {
      e.remove();
    });
  }

  //Clear the table
  function emptyTable(deleteHeader) {
    //This won't delete the header
    if (!deleteHeader) {
      while (dataTable.rows.length > 1) {
        dataTable.deleteRow(1);
      }
    } else {
      //This will empty the entire table, including title row
      while (dataTable.rows.length > 0) {
        dataTable.deleteRow(0);
      }
    }
  }

  //Button id: delete-table
  emptyTableButton.addEventListener("click", function () {
    emptyTable(1);
  });

  //Button id: create-table
  createTableButton.addEventListener("click", () => {
    /*
    When creating table:
    1. delete old table (if exists)
    2. ask table dimensions from the user
    3. create input form
    4. add title row
    5. add data rows
    */

    //delete old table
    if (dataTable.rows.length > 0) {
      emptyTable(1);
    }

    //Request table dimensions
    inputTableDims();

    //empty form
    emptyInputForm();

    //Create form based on the input dimensions
    createForm();

    //Build title row
    var titles = [];
    for (var i = 0; i < noCols; i++) {
      titles.push("C" + (i + 1));
    }

    //Add titles
    var tr = document.createElement("tr");
    var th;
    for (var i = 0; i < noCols; i++) {
      th = document.createElement("th");
      th.appendChild(document.createTextNode(titles[i]));
      tr.appendChild(th);
    }
    dataTable.appendChild(tr);

    //Add data
    for (i = 0; i < noRows; i++) {
      //No rows
      tr = document.createElement("tr");
      for (var j = 0; j < titles.length; j++) {
        //No columns
        var td = document.createElement("td");
        td.appendChild(document.createTextNode("c" + i + j));
        tr.appendChild(td);
      }
      dataTable.appendChild(tr);
    }
  });

  //Button id: submit-data
  //https://stackoverflow.com/questions/64483666/insert-form-values-in-a-table-using-javascript

  submitFormButton.addEventListener("click", () => {
    submit();

    /*
    var tr = document.createElement("tr");
    for (var i = 0; i < 3; i++) {
      var colData = document.getElementById("input-col" + (i + 1));
      var td = document.createElement("td");
      td.appendChild(document.createTextNode(colData.value));
      tr.appendChild(td);
    }
    dataTable.appendChild(tr);
    console.log(get_rows(0));
    console.log(search_col("c80"));
    */
  });

  //Read from HTML form to an array
  function form2array() {
    var array = [];
    console.log(noCols);
    for (var i = 0; i < noCols; i++) {
      //The form size has to be defined outside!
      //This is fixed!
      array.push(document.getElementById("input-col" + (i + 1)).value);
    }
    return array;
  }

  //Creat HTML table row from an array
  function createRow(array) {
    var tr = document.createElement("tr");
    for (var i = 0; i < array.length; i++) {
      //var colData = document.getElementById("input-col" + (i + 1));
      var td = document.createElement("td");
      td.appendChild(document.createTextNode(array[i]));
      tr.appendChild(td);
    }
    return tr;
  }

  //append row
  function replaceRow(old_row, new_row) {
    //Input: row from a table (need to run .cells to access the raw data)
    var n = old_row.cells.length;
    for (var i = 0; i < n; i++) {
      //old_row.cells[i].value = new_row.cells[i].value;
      old_row.cells[i].innerHTML = new_row.cells[i].innerHTML;
    }
  }

  //Submit button logic
  //Update 1: simply append as new row to the table
  //Update 2: if first column exists, if it does read data, else add as new row
  function submit() {
    var formData = form2array();
    var rowNo = matchRow(formData[0], 0);
    var newRow = createRow(formData);

    //see if the inputted column exists
    //AND
    //it is found in the table
    if (formData[0] && rowNo !== -1) {
      console.log("EDIT");
      replaceRow(dataTable.rows[rowNo], newRow);

      //if not, then a new row is added at the end of the table
    } else {
      console.log("ADD");
      dataTable.appendChild(newRow);
    }
  }

  //Search row based on matching value and column index
  function matchRow(value, col_idx) {
    //dataTable.rows[0].cells[0].innerHTML
    //1.get rows (.rows) (array, need to be subset)
    //2.get column (.cells) (array, need to be subset)
    //3.finally, get the actual value (.innerHTML)
    //example dataTable.rows[0].cells[0].innerHTML
    //returns the value of the first column from the first row
    for (var i = title_offset; i < dataTable.rows.length; i++) {
      if (value === dataTable.rows[i].cells[col_idx].innerHTML) {
        return i; //Note: take into account the title rows offset
      }
    }
    return -1;
  }
}
