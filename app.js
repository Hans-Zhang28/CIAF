var fs = require('fs');
fs.appendFile("test.js", "Hey there!", function(err) {
    if(err) {
        return console.log(err);
    }

    console.log("The file was saved!");
}); 