(function() {
    const input = document.getElementById('file-input');
    const linesReadSpan = document.getElementById('lines-read');
    const completedSpan = document.getElementById('completed');
    let t0

    input.onclick = function() {
        this.value = null;
    };

    /**
     * Read up to and including |maxlines| lines from |file|.
     *
     * @param {Blob} file - The file to be read.
     * @param {integer} maxlines - The maximum number of lines to read.
     * @param {function(string)} forEachLine - Called for each line.
     * @param {function(error)} onComplete - Called when the end of the file
     *     is reached or when |maxlines| lines have been read.
     */
    function readSomeLines(file, maxlines, forEachLine, onComplete) {
        var CHUNK_SIZE = 50000; // 50kb, arbitrarily chosen.
        var decoder = new TextDecoder();
        var offset = 0;
        var linecount = 0;
        var linenumber = 0;
        var results = '';
        var fr = new FileReader();
        fr.onload = function() {
            // Use stream:true in case we cut the file
            // in the middle of a multi-byte character
            results += decoder.decode(fr.result, {
                stream: true
            });
            var lines = results.split('\n');
            results = lines.pop(); // In case the line did not end yet.
            linecount += lines.length;

            if (linecount > maxlines) {
                // Read too many lines? Truncate the results.
                lines.length -= linecount - maxlines;
                linecount = maxlines;
            }

            for (var i = 0; i < lines.length; ++i) {
                forEachLine(lines[i] + '\n');
            }
            offset += CHUNK_SIZE;
            seek();
        };
        fr.onerror = function() {
            onComplete(fr.error);
        };
        seek();

        function seek() {
            if (linecount === maxlines) {
                // We found enough lines.
                onComplete(); // Done.
                return;
            }
            if (offset !== 0 && offset >= file.size) {
                // We did not find all lines, but there are no more lines.
                forEachLine(results); // This is from lines.pop(), before.
                onComplete(); // Done
                return;
            }
            var slice = file.slice(offset, offset + CHUNK_SIZE);
            fr.readAsArrayBuffer(slice);
        }
    }

    input.onchange = function() {
    	t0 = performance.now();
        const file = input.files[0];
        const start = 
        console.log('file name: ' + file.name);
        console.log('file size: ' + file.size);


        const maxlines = 800000;

        let lineno = 1;
        const forEachLine = function(line) {
        	lineno++
        	// console.log("Line " + (lineno++) +": " + line);
        	var item = document.createElement("li");
			var node = document.createTextNode(line);
			item.appendChild(node);
        	var element = document.getElementById('output');
			element.appendChild(item);

			linesReadSpan.innerHTML = lineno
    	}
    	const onComplete = function onComplete() {
    		var t1 = performance.now();
			completedSpan.innerHTML = " in " + Math.round((t1 - t0) / 1000) + " seconden"
        	console.log('Read all lines');
    	}

        readSomeLines(file, maxlines, forEachLine, onComplete) 

    };
})();