
module.modules = module.parent.modules;
var mods = module.modules;


module.exports = class leecher {
    constructor() {
        this.filepath = "./download/danishwords.txt";
        this.htmlfilepath = "./download/danishwords.html";
        this.responseData = {
            result: undefined,
            error: false,
            filepath: this.filepath,
            content: '',
            data: [],
        };
    }

    init(request, postData) {
        this.request = request;
        this.postData = postData;
    }

    buildText() {
        try {
            var text = '';
            this.responseData.data.forEach(function (node) {
                text += node.da + ';';
            });
            var result = mods.fs.writeFileSync(this.filepath, text);
            if (this.responseData.result === undefined) {
                this.responseData.result = 'success';
            }
        } catch (err) {
            console.error(err);
            this.responseData.error = true;
            this.responseData.result = 'error';
            this.responseData.userMessage = 'An error occured during the processing of the file.';
            this.responseData.errorMessage = err.Message;
        }
        return this.responseData;
    }

    getResponse(url) {
        var responseText;
        try {
            var xhr = new mods.XMLHttpRequest();
            xhr.open('GET', url, false);
            xhr.send();
            responseText = xhr.responseText;
        } catch (err) {
            console.error(err);
            if (mods.fs.existsSync(this.htmlfilepath)) {
                responseText = mods.fs.readFileSync(this.htmlfilepath, "utf8");
                this.responseData.error = false;
                this.responseData.result = 'warning';
                this.responseData.userMessage = 'An error occured during the download, the file in cache has been used, it might be not the one corresponding to the url.';
                this.responseData.errorMessage = err.Message;
            } else {
                this.responseData.error = true;
                this.responseData.result = 'error';
                this.responseData.userMessage = 'An error occured during the download.';
                this.responseData.errorMessage = err.Message;
            }
        }
        try {
            this.responseData.domContent = new mods.dom().parseFromString(responseText);
            mods.fs.writeFile(this.htmlfilepath, responseText, (err) => {
                if (err) {
                    console.error('Html file has not been saved :\r\n' + err);
                }
            });
            var rootNode = mods.xpath.select1("//html", this.responseData.domContent);
            if (rootNode === undefined)
                rootNode = mods.xpath.select1("//body", this.responseData.domContent);
            this.responseData.content = mods.htmlencoder.htmlEncode(rootNode.toString());
        } catch (err) {
            console.error(err);
            this.responseData.error = true;
            this.responseData.result = 'error';
            this.responseData.userMessage = 'An error occured during the parsing of the response.';
            this.responseData.errorMessage = err.Message;
        }
    }

    extractData() {
        var itemXpathes = {
            "da": this.postData["danishXPath"] !== undefined ? this.postData["danishXPath"] : "td[@class='column-2']/text()[1]",
            "en": this.postData["englishXPath"] !== undefined ? this.postData["englishXPath"] : "td[@class='column-3']/text()[1]"
        };
        try {
            this.postData["parentXpath"] = this.postData["parentXpath"] !== undefined ? this.postData["parentXpath"] : "//td[@class='column-2']/parent::tr";
            var nodes = mods.xpath.select(this.postData["parentXpath"], this.responseData.domContent);
            var my = this;
            nodes.forEach(function (node) {
                my.responseData.data.push({
                    da: mods.xpath.select1(itemXpathes["da"], node).textContent.trim(),
                    en: mods.xpath.select1(itemXpathes["en"], node).textContent.trim(),
                });
            });
            if (this.responseData.result === undefined) {
                this.responseData.result = 'success';
            }
        } catch (err) {
            console.error(err);
            this.responseData.error = true;
            this.responseData.result = 'error';
            this.responseData.userMessage = 'An error occured during the parsing';
            this.responseData.errorMessage = err.Message;
        }
    }

    leech() {
        var url = this.postData["url"];
        this.getResponse(url);
        if (!this.responseData.error) {
            this.extractData();
        }
        this.responseData.domContent = ''; // avoid to have a too much big object
        return this.responseData;
    }
};