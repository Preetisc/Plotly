//get the data from samples.json
var names
var metadata =[];
var samples=[];
var sub_names=[];
var subjects=[];
var current_subject= 940;
  // Initialize x and y arrays
var x = [];
var y = [];

function init(){


  d3.json("samples.json").then(function(data) {
    subjects=data;
    metadata=data.metadata;
    sub_names = data.names
    samples = data.samples;
    console.log(samples);
    console.log(samples[0].id);
    console.log(samples[0].sample_values);
    console.log(samples[0].otu_ids);
    /// populate the dropdown  "selDataset" to select subject
    var catOptions = "";
    for (i=0; i<sub_names.length;i++) {
      catOptions += "<option value="+sub_names[i]+">" + sub_names[i] + "</option>";
      //console.log(catOptions)
    }

    document.getElementById("selDataset").innerHTML = catOptions;
    updateDemograph(current_subject);
    updatePlotly(current_subject);
  });//read json data
  
  // var layout = {
  //   title : "hello"
  // }
  
  // data ={
  //   x : samples[0].sample_values,
  //   y : samples[0].otu_ids,
  //   type:'bar',
  //   orientation :'h'
  // }
    
  // Plotly.newPlot("bar", data,layout);

  // d3.selectAll("#selDataset").on("change", updatePage);
 

}//init()

function optionChanged(id){
  updateDemograph(id);
  updatePlotly(id);

}

// function updatePage(){
//   // Use D3 to select the dropdown menu
//   var dropdownMenu = d3.select("#selDataset");
//   // Assign the value of the dropdown menu option to a variable
//   current_subject = dropdownMenu.property("value");
//   // change the demographics section sample-metadata
//   console.log(current_subject)
//   //update the demographics
//   updateDemograph(current_subject);
//   //Update plot
//   updatePlotly(current_subject); 


// }
function updateDemograph(current_subject){
//START -Display Demographics information for current_subjet
  // get {} of the current_subject
  var filteredData = metadata.filter(metadata => metadata.id == current_subject);
   //var tbody =d3.selet("#demo");
   filteredData.forEach((demograph1)=>{
      //var row = tbody.append("tr");
      var demo_string=""
      Object.entries(filteredData[0]).forEach(([key,value])=>{
          demo_string+= "<div>"+ key +" : "+value+"</div>";
          });

      document.getElementById("sample-metadata").innerHTML =demo_string;
    });


  //END -Display Demographics information for current_subject
  console.log(filteredData[0].wfreq);
  buildGauge(filteredData[0].wfreq);
}



function updatePlotly(current_subject) {

  //get the {} from sample for the current_subject

  var sam_filter =samples.filter(function(s) {
        console.log("in the filter");
        return (s.id == current_subject);
  });
    
    //Extrace out_ids and sample_values from sam_filter
    x = sam_filter.map(sample =>sample.sample_values);
    y = sam_filter.map(sample =>sample.otu_ids);
    z = sam_filter.map(sample =>sample.otu_labels);
    x = x[0];

    y = y[0];
    console.log("x and y");
    console.log(x);
    console.log(y);

    var trace1 =[{
      x: x,
      y: y,
      mode : "markers",
      marker : {
        size : x,
        color : y
      }
    }]
    var layout = {
      title : "bubblechart"
    }
    Plotly.newPlot("bubble",trace1,layout);

    //bar chart
    var layout_bar = {
      title : "bar chart"
    }
    var y1 = y.slice(0, 10).map(otuID => `OTU ${otuID}`);
    var data =[{
      x : x.slice(0,10),
      y : y1,
      type:'bar',
      orientation :'h'
    }]
      
    Plotly.newPlot("bar", data,layout_bar);


    
    
    // Note the extra brackets around 'x' and 'y'
    // Plotly.newPlot("bar", "x", [x]);
    // Plotly.newPlot("bar", "y", [y]);
  }
/*
// Sort the array in ascending order using an arrow function
var sortedAscending = numArray.sort((a, b) => a - b);
console.log(sortedAscending);
*/
/**
 * BONUS Solution
 * */
function buildGauge(wfreq) {
  // Enter the washing frequency between 0 and 180
  var level = parseFloat(wfreq) * 20;
  // Trig to calc meter point
  var degrees = 180 - level;
  var radius = 0.5;
  var radians = (degrees * Math.PI) / 180;
  var x = radius * Math.cos(radians);
  var y = radius * Math.sin(radians);
  // Path: may have to change to create a better triangle
  var mainPath = "M -.0 -0.05 L .0 0.05 L ";
  var pathX = String(x);
  var space = " ";
  var pathY = String(y);
  var pathEnd = " Z";
  var path = mainPath.concat(pathX, space, pathY, pathEnd);
  
  var data = [
    {
      type: "scatter",
      x: [0],
      y: [0],
      marker: { size: 12, color: "850000" },
      showlegend: false,
      name: "Freq",
      text: level,
      hoverinfo: "text+name"
    },
    {
      values: [50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50],
      rotation: 90,
      text: ["8-9", "7-8", "6-7", "5-6", "4-5", "3-4", "2-3", "1-2", "0-1", ""],
      textinfo: "text",
      textposition: "inside",
      marker: {
        colors: [
          "rgba(0, 105, 11, .5)",
          "rgba(10, 120, 22, .5)",
          "rgba(14, 127, 0, .5)",
          "rgba(110, 154, 22, .5)",
          "rgba(170, 202, 42, .5)",
          "rgba(202, 209, 95, .5)",
          "rgba(210, 206, 145, .5)",
          "rgba(232, 226, 202, .5)",
          "rgba(240, 230, 215, .5)",
          "rgba(255, 255, 255, 0)"
        ]
      },
      labels: ["8-9", "7-8", "6-7", "5-6", "4-5", "3-4", "2-3", "1-2", "0-1", ""],
      hoverinfo: "label",
      hole: 0.5,
      type: "pie",
      showlegend: false
    }
  ];
  
  var layout = {
    shapes: [
      {
        type: "path",
        path: path,
        fillcolor: "850000",
        line: {
          color: "850000"
        }
      }
    ],
    title: "<b>Belly Button Washing Frequency</b> <br> Scrubs per Week",
    height: 500,
    width: 500,
    xaxis: {
      zeroline: false,
      showticklabels: false,
      showgrid: false,
      range: [-1, 1]
    },
    yaxis: {
      zeroline: false,
      showticklabels: false,
      showgrid: false,
      range: [-1, 1]
    }
  };
  
  var GAUGE = document.getElementById("gauge");
  Plotly.newPlot(GAUGE, data, layout);
}
init();

