const DEFAULT_OPTS = {
    maxDays: 60, // two months
    drawDots: false, // on data entry
    minY: 0, // min y value
    maxY: 100, // max x value
};

function Chart(id, opts = DEFAULT_OPTS) {
    let el = document.getElementById(id);
    this.canvas = el;
    this.opts = {
        maxDays: 60, // two months
        drawDots: false, // on data entry
        minY: 0, // min y value
        maxY: 100, // max x value
    };
    this.opts.height = el.getAttribute('height');
    this.opts.width = el.getAttribute('width');
    this.calculatePxValues();
}

Chart.prototype.drawData = function(data, color) {
    let c = this.canvas.getContext('2d');
    c.beginPath();
    c.strokeStyle = color;
    c.lineWidth = 2;
    c.moveTo(0,this.opts.height - data[0] * this.opts.pxPerValue);
    for(let i = 1; i < data.length; i++) {
        c.lineTo(i * this.opts.pxPerDay, this.opts.height - data[i] * this.opts.pxPerValue);
        c.stroke();
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