//import full dataset from data.js
var tableData = data;

//get REFERENCES
var $tbody = d3.select("tbody");

//userinput references
var $datetimeIn = d3.select("#datetime");
var $cityIn = d3.select("#city");
var $stateIn = d3.select("#state");
var $countryIn = d3.select("#country");
var $shapeIn = d3.select("#shape");
var $commentsIn = d3.select("#comments")

//button references
var $searchButton = d3.select("#search");
var $resetButton = d3.select("#reset");
console.log("search button ref: ", $searchButton);

//add listeners to trigger functions in EVENT of "click"
$searchButton.on("click", handleSearch);
$resetButton.on("click", handleReset);

function buildTable(){ //filters are already applied at this point

    //clear existing table
    handleReset();
    console.log("building table...");

    if(tableData.length == 0){
      $tbody.innerHTML = "No Matches";
      console.log("no matches.")
      return -1;
    }

    var dimensions = Object.keys(tableData[0]);
    for(var i = 0; i < tableData.length; i++)
    {
      var sighting = tableData[i];    //ith object as sighting
      var $row = $tbody.append("tr"); //append row

      for(var j = 0; j < dimensions.length; j++)
      {
        $row.node().innerHTML += `<td>${sighting[dimensions[j]]}</td>`;
      }
    }

    console.log("---fin---");
    return;
}

function handleReset(){ //fill elements with empty values
   $datetimeIn.value = "";
   $cityIn.value = "";
   $stateIn.value = "";
   $countryIn.value = "";
   $shapeIn.value = "";
   $commentsIn.value = "";
}

function handleSearch(){ //check if field is empty, if not return only matches... then build table

  d3.event.preventDefault();

  console.log("searching for matches...");

  //filter table by date
  var datetime_q = $datetimeIn.node().value;
  if (datetime_q != ""){
      tableData = efficientFindByDate(datetime_q);
  };

  //filter table by city
  var city_q = $cityIn.node().value.trim().toLowerCase();
  if (city_q != ""){
      tableData = tableData.filter(sighting => sighting.city == city_q);
  };

  //filter table by state
  var state_q = $stateIn.node().value.trim().toLowerCase();
  if(state_q != ""){
      tableData = tableData.filter(sighting => sighting.state == state_q);
  }

  //filter table by country
  var country_q = $countryIn.node().value.trim().toLowerCase();
  if(country_q != ""){
      tableData = tableData.filter(sighting => sighting.country == country_q);
  }

  //filter table by shaped
  var shape_q = $shapeIn.node().value.trim().toLowerCase();
  if(shape_q != ""){
      tableData = tableData.filter(sighting => sighting.shape == shape_q);
  }

  console.log(`${tableData.length} matches found.`);
  buildTable();
};











function makeDateComparible(in_date){
    var search_date_string = "" + in_date;

    //get individual value year, month, and day
    var split_date = search_date_string.split("/");
    var yyyy = split_date[2];
    var mm = split_date[1];
    var dd = split_date[0];

    //make sure all yyyymmdd is 8 characters
    if(mm < 10){ mm = "0" + mm; }
    if(dd < 10){ dd = "0" + dd; }

    //concatenate in weighted order with year>>month>>day
    var string_date = yyyy + mm + dd;

    //return comparable integer
    comparable_date = parseInt(string_date);
    return comparable_date;
}

//DATE IS SORTED IN DATA.JS
//--> for scalability using a sorted SEARCH ALGORYTHIM
//--> :: runs in O(logN) time
function efficientFindByDate(search_date_string){
    var sightings_out = [];
    var search_date = makeDateComparible(search_date_string);

    isFound = false;
    firstSpot = -1;

    var mid = Math.floor(tableData.length/2);
    var one_lower = -1;
    var one_above = tableData.length + 2;

    var max_tocheck = tableData.length;
    var min_tocheck = 0;

    console.log("array length: ", tableData.length);
    console.log("max runs: ", Math.log2(tableData.length));

    for(var i = 0; i < Math.log2(tableData.length); i++)
    {
        var sighting = tableData[mid];
        console.log("i: ", i);


        console.log("sighting: ", sighting);
        console.log("mid: ", mid);
        console.log("sighting->datetime: ", sighting.datetime);

        comp_mid_date = makeDateComparible(sighting.datetime);
        console.log(comp_mid_date);


        if(comp_mid_date == search_date){
          sightings_out.push(tableData[mid]);
          console.log("with O(logN) time...");
          isFound = true;
          firstSpot = mid;
          break;
        }
        else if(comp_mid_date > search_date){
          max_tocheck = mid;
          mid = Math.floor( (mid + min_tocheck) / 2);
        }
        else{
          min_tocheck = mid;
          mid = Math.ceil( (mid + max_tocheck) / 2);
        }
    }

    if(!isFound){
      return "404: no data with matching datetime"
    }else{
      //append dates below firstSpot
      one_lower = firstSpot - 1;
      while(one_lower >= 0)
      {
          if(tableData[one_lower].datetime == search_date_string){
            sightings_out.push(tableData[one_lower]);
            one_lower--;
          }else{ break; }
      }

      //append dates above firstSpot
      one_above = firstSpot + 1;
      while(one_above < tableData.length)
      {
          if(tableData[one_above].datetime == search_date_string){
            sightings_out.push(tableData[one_above]);
            one_above++;
          }else{ break; }
      }
    }

    return sightings_out;
}

//jan_four_sightings = efficientFindByDate("1/4/2010");
//console.log(jan_four_sightings);
