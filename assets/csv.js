function fileByUrl(url, callback) {
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState === 4 && this.status === 200) {
            callback(xhttp.responseText);
        }
    };
    xhttp.open('GET', url, true);
    xhttp.send();
}

function CSV(data, state = null) {
    this.raw = data;
    this.lines = [];
    let rawLines = data.split('\n');
    this.headers = rawLines.shift().split(',');
    if(this.headers.indexOf('state') > -1 && state === null) {
        return undefined;
    }
    if(state === null) {
        for(let i = 1; i < rawLines.length; i++) {
            let vals = rawLines[i].split(',');
            this.lines[i - 1] = vals;
        }
    } else {
        for (let i = 1; i < rawLines.length; i++) {
            let vals = rawLines[i].split(',');
            if (vals[0] === state) {
                this.lines.push(vals);
            }
        }
    }
}

CSV.prototype.allValuesByHeader = function(header) {
    let headerIndex = this.headers.indexOf(header);
    if(headerIndex === -1) {
        return undefined;
    }
    let result = [];
    for(let i = 0; i < this.lines.length; i++) {
        result[i] = parseInt(this.lines[i][headerIndex]);
    }
    return result;
};

CSV.prototype.limitToLast = function(limit) {
    if(this.lines.length > limit) {
        this.lines = this.lines.slice(-limit, this.lines.length);
    }
};