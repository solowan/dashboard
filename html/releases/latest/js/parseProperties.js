function parsePropertiesUrl (url,callback) {
    $.get(url,function(data, status){
        if (status != "success") {
            console.error("Status: " + status);
        } else {
            var lines = data.split("\n");

            var propertiesObject = {}
            for (var i = 0; i < lines.length; i++) {
                var subElement = propertiesObject;
                var line = []
                line[0] = lines[i].split("=",1)[0];
                line[1] = lines[i].substr(line[0].length+1).trim();
                line[0] = line[0].trim();
                if (line[0].indexOf("#") == 0 || line.length == 1) {} // Coment
                else {
                    var key = line[0].split(".");
                    for (var j = 0; j < key.length-1;j++) {
                        if (subElement[key[j]] == undefined) {
                            subElement[key[j]] = {}
                        }
                        subElement = subElement[key[j]];
                    }
                    subElement[key[key.length-1]] = line[1]//.trim();
                }
            }
            callback(propertiesObject);
        }
    });
}