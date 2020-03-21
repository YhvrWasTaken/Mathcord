//META{"name":"Mathcord"}*//

/*

KaTeX License, I think I'm supposed to include it

Copyright (c) 2013-2019 Khan Academy and other contributors

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

*/

var Mathcord = (function () {
    const config = {
        "info": {
            "name": "Mathcord",
            "author": "Yhvr",
            "description": "Render LaTex using KaTeX",
            "version": "0.0.1"
        }
    };
    class Mathcord {
        getName() {
            return config.info.name;
        };
        getAuthor() {
            return config.info.author;
        };
        getDescription() {
            return config.info.description;
        };
        getVersion() {
            return config.info.version;
        };
        load() {
            //          load remote
            // css
            let css = document.createElement("link")
            css.rel = "stylesheet"
            css.href = "https://cdn.jsdelivr.net/npm/katex@0.11.1/dist/katex.min.css"
            css.integrity = "sha384-zB1R0rpPzHqg7Kpt0Aljp8JPLqbXI3bhnPWROx27a9N0Ll6ZP/+DiW/UqRcLbRjq"
            css.crossOrigin = "anonymous"
            // katex
            let script1 = document.createElement("script")
            script1.defer = true
            script1.src = "https://cdn.jsdelivr.net/npm/katex@0.11.1/dist/katex.min.js"
            script1.integrity = "sha384-y23I5Q6l+B6vatafAwxRu/0oK/79VlbSz7Q9aiSZUvyWYIYsd+qj+o24G5ZU2zJz"
            script1.crossOrigin = "anonymous"
            // autorender
            let script2 = document.createElement("script")
            script2.defer = true
            script2.src = "https://cdn.jsdelivr.net/npm/katex@0.11.1/dist/contrib/auto-render.min.js"
            script2.integrity = "sha384-kWPLUVMOks5AQFrykwIup5lo0m3iMkkHrD0uJ4H5cjeGihAutqP0yW0J6dpFiVkI"
            script2.crossOrigin = "anonymous"
            // append / exec
            document.head.appendChild(css)
            document.head.appendChild(script1)
            document.head.appendChild(script2)

            //          implement modified tampermonkey plugin

            window.hasClassPrefix = function(element, prefix) {
                var classes = (element.getAttribute("class") || "").split();
                return classes.some(x => x.startsWith(prefix));
            }

            const options = {
                delimiters: [
                    {left: "$$", right: "$$", display: true},
                    {left: "\\(", right: "\\)", display: false},
                    {left: "\\[", right: "\\]", display: true},
                    // Needs to come last to prevent over-eager matching of delimiters
                    {left: "$", right: "$", display: false},
                ],
            };

            // Monitor the document for changes and render math as necessary
            var config = { childList: true, subtree: true };
            var observer = new MutationObserver(function(mutations, observer) {
                for (let mutation of mutations) {
                    var target = mutation.target;
                    // Iterate over all messages added to the scroller and typeset them
                    if (target.tagName == "DIV" && hasClassPrefix(target, "scroller")) {
                        for (let added of mutation.addedNodes) {
                            if (added.tagName == "DIV" && hasClassPrefix(added, "message")) {
                                renderMathInElement(added, options);
                            }
                        }
                    }
                    // Respond to edited messages
                    else if (target.tagName == "DIV" && hasClassPrefix(target, "container") && hasClassPrefix(target.parentNode, "message")) {
                        for (let added of mutation.addedNodes) {
                            // Do not typeset the interactive edit container
                            if (added.tagName == "DIV" && !added.getAttribute("class")) {
                                continue;
                            }
                            setTimeout(_ => renderMathInElement(added, options), 1000);
                        }
                    }
                }
            });
            observer.observe(document.body, config);
        };
        unload() { this.stop() };
        start() { };
        stop() { };
        onMessage() { };
        onSwitch() { };
        observer() { };
        getSettingsPanel() { };
    }
    return Mathcord;
})()
