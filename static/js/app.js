//Read in the data from the URL
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json"

//Fetch JSON data and console log it
d3.json(url).then(function(data) {
    console.log(data);
});



//Create the dropdown menu to display 


function init() {
    //select dropdown menu
    let dropdownMenu = d3.select("#selDataset");
    //fetch JSON data and store the sample IDs
    d3.json(url).then(data => {
        let sampleID = data.names;
        //put the sample IDs as options in the dropdown menu
        sampleID.forEach(id => {
            dropdownMenu.append("option")
                        .text(id)
                        .attr("value", id);
            });
            //get first sample
            let sampleOne = sampleID[0];
            console.log(sampleOne);
            
            //building charts for first sample
            buildHBar(sampleOne);
            buildBubble(sampleOne);
            buildMetadata(sampleOne);
            });

    //event listener
    dropdownMenu.on("change", function(){
        let sample_selected = dropdownMenu.property("value");
        //building charts for selected sample from dropdown menu
        buildHBar(sample_selected);
        buildBubble(sample_selected);
        buildMetadata(sample_selected);
    });
}
init();


//Metadata for each sample ID
function buildMetadata(id){
    d3.json(url).then(data => {
        let metadata = data.metadata;
        //Filter: https://stackoverflow.com/questions/68646148/how-to-filter-item-based-on-id-and-subid
        //and get first index
        let selectedID = metadata.filter(value => value.id == id)[0];
        let Panel = d3.select("#sample-metadata");
        Panel.html("");
        //display the key value pairs 
        Object.entries(selectedID).forEach(([key,value]) => {
            Panel.append("h4").text(`${key}: ${value}`);
        });
    });
}

//Create a horizontal bar chart with a dropdown menu 
//to display the top 10 OTUs found in that individual

function buildHBar(id) {
    d3.json(url).then(data => {
        let samples = data.samples;
        //Filter and grab first index
        let selected_sample= samples.filter(sample => sample.id == id)[0];
        //extract the data
        let otu_ids = selected_sample.otu_ids.slice(0,10).reverse();
        let sample_values = selected_sample.sample_values.slice(0,10).reverse();
        let otu_labels = selected_sample.otu_labels.slice(0,10).reverse();
        //create a trace for bar chart
        let trace1 = {
            type: 'bar',
            orientation: 'h',
            x: sample_values,
            y: otu_ids.map(id => `OTU ${id}`),
            text: otu_labels
        };

        let data1 = [trace1];
        //add title to bar chart
        let layout = {
            title: 'Top 10 OTUs'
        };
        //Plot using plotly
        Plotly.newPlot('bar', data1, layout);
    })
}

function buildBubble(id) {
    d3.json(url).then(data => {
        let samples = data.samples;
        
        let selected_sample= samples.filter(sample => sample.id == id)[0];
    //create a trace to create a bubble chart
    //https://plotly.com/javascript/bubble-charts/
    let trace2 = {
        x: selected_sample.otu_ids,
        y: selected_sample.sample_values,
        mode: 'markers',
        marker: {
            size: selected_sample.sample_values,
            color: selected_sample.otu_ids,
            colorscale: 'Inferno'
        },
        text: selected_sample.otu_labels
    };

    let data2 = [trace2];

    let layout2 = {
        title: 'Bubble Chart for Each Sample'
    };

    Plotly.newPlot('bubble', data2, layout2)

});

}


