const DEFAULT_OPTS = {
    maxDays: 60, // two months
    drawDots: false, // on data entry
    minY: 0, // min y value
    maxY: 100, // max x value
};

function findMax(data) {
    let maxValue = data[0];
    for(let i = 1; i < data.length; i++) {
        if(data[i] > maxValue) {
            maxValue = data[i];
        }
    }
    return maxValue;
}

function Chart(id, opts = DEFAULT_OPTS) {
    let el = document.getElementById(id);
    this.canvas = el;
    this.opts = {
        maxDays: 60, // two months
        drawDots: false, // on data entry
        minY: 0, // min y value
        maxY: 100, // max x value
        sideOffsetPercentage: 2.5, // percentage of space on each side of width
    };
    this.opts.sideAxisOffset = (el.getAttribute('width') / 100) * this.opts.sideOffsetPercentage;
    this.opts.height = el.getAttribute('height') - this.opts.sideAxisOffset;
    this.opts.width = el.getAttribute('width') - (this.opts.sideAxisOffset * 2);
    this.calculatePxValues();
}

Chart.prototype.drawData = function(data, color) {
    let c = this.canvas.getContext('2d');
    c.beginPath();
    c.strokeStyle = color;
    c.lineWidth = 2;
    // starting point right of the left axis
    c.moveTo(this.opts.sideAxisOffset,this.opts.height - data[0] * this.opts.pxPerValue);
    // continue to draw each datapoint with a tail line
    for(let i = 1; i < data.length; i++) {
        c.lineTo(this.opts.sideAxisOffset + ((i + 1) * this.opts.pxPerDay), this.opts.height - data[i] * this.opts.pxPerValue);
        c.stroke();
    }
};

Chart.prototype.drawGrid = function(data) {
    let count = data.lines.length;
    let c = this.canvas.getContext('2d');
    c.beginPath();
    c.strokeStyle = '#ddd';
    // draw weekly horizontal line
    for(let i = 1; i < count / 7; i++) {
        c.lineWidth = 1;
        c.moveTo(this.opts.sideAxisOffset + (i * this.opts.pxPerDay * 7),0);
        c.lineTo(this.opts.sideAxisOffset + (i * this.opts.pxPerDay * 7),this.opts.height);
        c.stroke();
    }
    // draw 10% vertical line
    c.beginPath();
    for(let i = 1; i < 10; i++) {
        let height = (this.opts.height / 10) * i;
        c.lineWidth = 1;
        c.moveTo(this.opts.sideAxisOffset,height);
        c.lineTo(this.opts.sideAxisOffset + this.opts.width, height);
        c.stroke();
    }
};

CanvasRenderingContext2D.prototype.fillVerticalText = function(text, x, y, verticalSpacing) {
    for (let i = 0; i < text.length; i++) {
        this.fillText(text[i], x, y + i * verticalSpacing);
    }
};

String.prototype.intWithCommas = function() {
    return this.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

// shortcut
Number.prototype.intWithCommas = function() {
    return String(this).intWithCommas();
};

Chart.prototype.drawLeftAxis = function(data) {
    let max = findMax(data.allValuesByHeader('confirmed'));
    let low = 0;
    let c = this.canvas.getContext('2d');
    c.strokeStyle = '#212121';
    c.font = "bold 25px Courier New";
    c.textAlign = 'left';
    c.beginPath();
    // draw axis
    c.moveTo(this.opts.sideAxisOffset, 0);
    c.lineTo(this.opts.sideAxisOffset, this.opts.height);
    c.stroke();
    // draw indicator lines
    c.moveTo(this.opts.sideAxisOffset - 10, 5);
    c.lineTo(this.opts.sideAxisOffset, 5);
    c.stroke();
    c.moveTo(this.opts.sideAxisOffset - 10, this.opts.height - 5);
    c.lineTo(this.opts.sideAxisOffset, this.opts.height - 5);
    c.stroke();
    // write text
    c.fillText(String(low), 2, this.opts.height);
    c.fillVerticalText(String(max).intWithCommas(), 0, 20, 23);
    c.font = "bold 15px Courier New";
    c.fillText("50%", 0, this.opts.height / 2);
    c.fillText("10%", 0, (this.opts.height / 100) * 90);
};

Chart.prototype.drawRightAxis = function(data) {
    let max = findMax(data.allValuesByHeader('difference'));
    let low = 0;
    let c = this.canvas.getContext('2d');
    c.strokeStyle = '#212121';
    c.font = "bold 25px Courier New";
    c.textAlign = 'right';
    c.beginPath();
    let widthLimit = this.opts.width + (this.opts.sideAxisOffset * 2);
    // draw axis
    c.moveTo(widthLimit - this.opts.sideAxisOffset, 0);
    c.lineTo(widthLimit - this.opts.sideAxisOffset, this.opts.height);
    c.stroke();
    // draw indicator lines
    c.moveTo(widthLimit - this.opts.sideAxisOffset, 5);
    c.lineTo(widthLimit - this.opts.sideAxisOffset + 10, 5);
    c.stroke();
    c.moveTo(widthLimit - this.opts.sideAxisOffset, this.opts.height - 5);
    c.lineTo(widthLimit - this.opts.sideAxisOffset + 10, this.opts.height - 5);
    c.stroke();
    // write text
    c.fillText(String(low), widthLimit, this.opts.height);
    c.fillVerticalText(String(max).intWithCommas(), widthLimit, 20, 23);
};

Chart.prototype.drawBottomAxis = function(data) {
    let max = new Date(data.lines[data.lines.length - 1][0]);
    let low = new Date(data.lines[0][0]);
    max = '' + max.getDate() + '.' + (max.getMonth() + 1);
    low = '' + low.getDate() + '.' + (low.getMonth() + 1);
    let c = this.canvas.getContext('2d');
    c.strokeStyle = '#212121';
    c.font = "bold 25px Courier New";
    c.beginPath();
    // draw axis
    c.moveTo(this.opts.sideAxisOffset, this.opts.height);
    c.lineTo(this.opts.sideAxisOffset + this.opts.width, this.opts.height);
    c.stroke();
    // draw indicator lines
    c.moveTo(this.opts.sideAxisOffset + this.opts.width - 5, this.opts.height);
    c.lineTo(this.opts.sideAxisOffset + this.opts.width - 5, this.opts.height + 5);
    c.stroke();
    c.moveTo(this.opts.sideAxisOffset + 5, this.opts.height);
    c.lineTo(this.opts.sideAxisOffset + 5, this.opts.height + 5);
    c.stroke();
    // write text
    c.textAlign = 'left';
    c.fillText(low, this.opts.sideAxisOffset / 2, this.opts.height + this.opts.sideAxisOffset);
    c.textAlign = 'right';
    c.fillText(max, this.opts.sideAxisOffset + this.opts.width, this.opts.height + this.opts.sideAxisOffset);
    // create date points on axis (for every full week, else text overlays)
    c.beginPath();
    c.textAlign = 'center';
    for(let i = 1; i < data.lines.length / 7; i++) {
        if(data.lines.length - (i * 7) < 6) {
            continue;
        }
        let cur = new Date(data.lines[i * 7][0]);
        cur = '' + cur.getDate() + '.' + (cur.getMonth() + 1);
        c.moveTo(this.opts.sideAxisOffset + (i * this.opts.pxPerDay * 7), this.opts.height);
        c.lineTo(this.opts.sideAxisOffset + (i * this.opts.pxPerDay * 7), this.opts.height + 10);
        c.stroke();
        c.fillText(cur, this.opts.sideAxisOffset + (i * this.opts.pxPerDay * 7), this.opts.height + this.opts.sideAxisOffset);
    }
};

Chart.prototype.setMax = function(max) {
    this.opts.maxY = max;
    this.calculatePxValues();
};

Chart.prototype.calculatePxValues = function() {
    this.opts.pxPerValue = this.opts.height / (this.opts.maxY + this.opts.minY);
    this.opts.pxPerDay = this.opts.width / this.opts.maxDays;
};