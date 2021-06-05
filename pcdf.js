// If absolute URL from the remote server is provided, configure the CORS
// header on that server.
var url = 'paper.pdf';

// Loaded via <script> tag, create shortcut to access PDF.js exports.
var pdfjsLib = window['pdfjs-dist/build/pdf'];

// The workerSrc property shall be specified.
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://mozilla.github.io/pdf.js/build/pdf.worker.js';

var pdfDoc = null,
    pageNum = 1,
    pageRendering = false,
    pageNumPending = null,
    scale = 4.5,
    canvasHolder = document.createElement('div');

document.body.append(canvasHolder);

/**
 * Get page info from document, resize canvas accordingly, and render page.
 * @param num Page number.
 */
function renderPage(num) {
    pageRendering = true;
    var canvas = document.createElement('canvas');
    canvas.style.height = "1px";
    canvas.style.width = "1px";
    canvas.height = 5000;
    canvas.width = 5000;
    canvas.id = "page-" + num;
    var ctx = canvas.getContext('2d');
    // Using promise to fetch the page
    pdfDoc.getPage(num).then(function(page) {
        var viewport = page.getViewport({
            scale: scale
        });
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        // Render PDF page into canvas context
        var renderContext = {
            canvasContext: ctx,
            viewport: viewport
        };
        var renderTask = page.render(renderContext);

        // Wait for rendering to finish
        renderTask.promise.then(function() {
            pageRendering = false;
            if (pageNumPending !== null) {
                // New page rendering is pending
                renderPage(pageNumPending);
                pageNumPending = null;
            }
        });
    });

    // Update page counters
    canvasHolder.appendChild(canvas);
}

/**
 * If another page rendering in progress, waits until the rendering is
 * finised. Otherwise, executes rendering immediately.
 */
function queueRenderPage(num) {
    if (pageRendering) {
        pageNumPending = num;
    } else {
        renderPage(num);
    }
}

/**
 * Asynchronously downloads PDF.
 */
var loadedDoc = pdfjsLib.getDocument(url).promise;
function crash() {
    loadedDoc.then(function(pdfDoc_) {
        pdfDoc = pdfDoc_;

        // Initial/first page rendering
        for (var i = 1; i < pdfDoc.numPages; i++) {
            renderPage(i);
        }
    });
}