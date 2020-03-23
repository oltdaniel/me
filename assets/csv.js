function fileByUrl(url, callback) {
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState === 4 && this.status === 200) {
            callback(xhttp.responseText);
        }
    };
    xhttp.open('GET', url);
    xhttp.send();
}

function CSV(data) {
    this.raw = data;
    this.lines = [];
    let rawLines = data.split('\n');
    this.headers = rawLines.shift().split(',');
    for(let i = 1; i < rawLines.length; i++) {
        this.lines[i-1] = rawLines[i].split(',');
    }
}

CSV.prototype.allValuesByHeader = function(header) {
    if(this.headers.indexOf(header) === -1) {
        return undefined;
    }
    let headerIndex = this.headers.indexOf(header);
    let result = [];
    for(let i = 0; i < this.lines.length; i++) {
        result.push(parseInt(this.lines[i][headerIndex]));
    }
    return result;
};