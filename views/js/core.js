

/* Manage the progress bar */
var ProgressBar = function ($progressbar, options) {
    var defaults = {
        progressPercent: 5,
        progressInterval: 500,
        maxProgress: 95
    }

    this.onShown = undefined;

    this.opts = $.extend({}, defaults, options || {});
    this.$progressbar = $progressbar;
    this.$modal = this.$progressbar.parents('.modal');
    var my = this;
    this.$modal.on('hidden.bs.modal', function () {
        my.progress(0);
    });
    this.alert = new Alert($('#alert'));
    return this;
};
ProgressBar.prototype.show = function () {
    this.start();
    //this.$modal.css('display', '');
    this.$modal.modal({
        backdrop: 'static',
        keyboard: false
    });
    return this;
};
ProgressBar.prototype.setOnShown = function (fnOnShown) {
    var my = this;
    my.$modal.off('shown.bs.modal', my.onShown);
    my.onShown = function () {
        fnOnShown();
        my.$modal.off('shown.bs.modal', my.onShown);
    };
    this.$modal.on('shown.bs.modal', this.onShown);
}
ProgressBar.prototype.progress = function (progress) {
    if (progress === undefined) {
        progress = this.$progressbar.attr('aria-valuenow');
        if (progress < this.opts.maxProgress) {
            progress = parseInt(progress) + this.opts.progressPercent;
        }
    }
    this.$progressbar.css('width', progress + '%').attr('aria-valuenow', progress);
    return this;
};
ProgressBar.prototype.success = function (message) {
    this.complete('success', message);
    return this;
};
ProgressBar.prototype.warning = function (userMessage, message) {
    this.complete('warning', userMessage+ '<br />' + message);
    return this;
}
ProgressBar.prototype.error = function (jqXHR) {
    var message = jqXHR.responseJSON !== undefined && jqXHR.responseJSON.userMessage !== undefined ?
        jqXHR.responseJSON.userMessage : 'An unexpected error occured.';
    this.complete('error', message);
    return this;
};
ProgressBar.prototype.complete = function (type, message) {
    var completeClass = 'bg-success';
    if (type === 'success') {
        this.alert.success(message);
    } else if (type === 'warning') {
        completeClass = 'bg-warning';
        this.alert.warning(message);
    } else if (type === 'error') {
        completeClass = 'bg-danger';
        this.alert.error(message);
    }
    this.$progressbar.addClass(completeClass);
    this.$progressbar.css('width', '100%').attr('aria-valuenow', 100);
    var my = this;
    setTimeout(function () {
        my.hide();
    }, 500);
    return this;
};
ProgressBar.prototype.hide = function () {
    this.stop();
    this.$modal.removeClass('show');
    this.$modal.modal('hide');
    return this;
};
ProgressBar.prototype.restart = function (options) {
    this.opts = $.extend({}, this.opts, options || {});
    this.start();
    return this;
};
ProgressBar.prototype.start = function () {
    this.stop();
    this.progress(0);
    this.$progressbar.removeClass('bg-success').removeClass('bg-danger').removeClass('bg-warning');
    var my = this;
    this.progressInterval = setInterval(function () { my.progress(); }, this.opts.progressInterval);
    return this;
};
ProgressBar.prototype.stop = function () {
    clearInterval(this.progressInterval);
    return this;
};


var Alert = function ($alert) {
    this.$alert = $alert;
    this.$alertText = this.$alert.find('> .alert-text');
    var alert = this;
    this.$alert.find('> .close').click(function (e) {
        alert.hide();
    });
};
Alert.prototype.error = function (text) {
    this.show('error', text);
};
Alert.prototype.warning = function (text) {
    this.show('warning', text);
};
Alert.prototype.success = function (text) {
    this.show('success', text);
};
Alert.prototype.show = function (type, text) {
    this.$alertText.html(text);
    this.$alert.removeClass('alert-danger').removeClass('alert-success');
    if (type === 'error')
        this.$alert.addClass('alert-danger');
    else if (type === 'warning')
        this.$alert.addClass('alert-warning');
    else if (type === 'success')
        this.$alert.addClass('alert-success');
    this.$alert.addClass('show');
};
Alert.prototype.hide = function () {
    this.$alertText.html('');
    this.$alert.removeClass('show');
};


function htmlEncode(value) {
    return $('<div/>').text(value).html();
}

function htmlDecode(value) {
    return $('<div/>').html(value).text();
}

function call(method, data) {
    return $.ajax({
        url: '/?_method=' + method,
        type: $('#form').attr('method'),
        data: data
    });
}


$(document).ready(function () {

    var progressBar = new ProgressBar($('#ajax-progress'), {
        progressPercent: 10,
        progressInterval: 700,
        maxProgress: 95
    });
    $('#btnGetIt').click(function (e) {
        e.preventDefault();
        $('.show').removeClass('show');
        progressBar.setOnShown(function (e) {
            call('getit', {
                url: $('#url').val(),
                parentXpath: $('#parentXpath').val(),
                danishXPath: $('#danishXPath').val(),
                englishXPath: $('#englishXPath').val()
            })
                .done(function (data, textStatus, jqXHR) {
                    if (data.result === 'success') {
                        progressBar.success('Your danish words are available, please <a href="' + data.filepath + '">download it</a>');
                    } else {
                        progressBar.warning(data.userMessage, 'Your danish words are available, please <a href="' + data.filepath + '">download it</a>');
                    }
                    $('#btnDownload').addClass('show');
                    $('#btnDownload').attr('href', data.filepath);
                    document.location.href = data.filepath;
                }).fail(function (jqXHR, textStatus) {
                    progressBar.error(jqXHR);
                });
        });
        progressBar.show();
        return false;
    });

    var htmlContent;

    $('#btnCustomize').click(function (e) {
        e.preventDefault();
        $('.show').removeClass('show');
        progressBar.setOnShown(function (e) {
            call('customize', {
                url: $('#url').val(),
                parentXpath: $('#parentXpath').val(),
                danishXPath: $('#danishXPath').val(),
                englishXPath: $('#englishXPath').val()
            })
                .done(function (data, textStatus, jqXHR) {
                    if (data.result === 'success') {
                        progressBar.success('The html has been downloaded, you can customize the data.');
                    } else {
                        progressBar.warning(data.userMessage, 'You can customize the data or retry.');
                    }
                    $('#htmlContent').html(data.content);
                    htmlContent = htmlDecode(data.content);
                    if (!$('#customize').hasClass('show')) {
                        $('#customize').addClass('show');
                    }
                    $('.onlyWhenhtml').addClass('show');
                    var $textBtnCustomize = $('#btnCustomize > span');
                    if ($textBtnCustomize.text() !== 'Reload') {
                        $('#btnCustomize > span').text('Reload');
                        var $oi = $('#btnCustomize').find('.oi');
                        $oi.removeClass('oi-plus').addClass('oi-reload');
                    }
                }).fail(function (jqXHR, textStatus) {
                    progressBar.error(jqXHR);
                });
        });
        progressBar.show();
    });

    function getTestParent() {
        var nodes = document.evaluate($('#parentXpath').val(), $(htmlContent)[0], null, XPathResult.ANY_TYPE, null);
        return nodes.iterateNext();
    }

    $('.btnTestParent').click(function (e) {
        e.preventDefault();
        var $container = $(this).parents('.field');
        var $code = $container.find('code.htmlContent');
        var parentNode = getTestParent();
        var parentHtml = parentNode.innerHTML.replace(/\n\s+\n/, '\n').trim('\t').trim('\n');
        $code.html(htmlEncode(parentHtml));
        $container.find('.fade').addClass('show');
    });

    $('.btnTest').click(function (e) {
        e.preventDefault();
        var $container = $(this).parents('.field');
        var $xpath = $container.find('.xpath');
        var xpath = $xpath.val();
        var $code = $container.find('code.htmlContent');
        var parentNode = getTestParent();
        var nodes = document.evaluate(xpath, parentNode, null, XPathResult.ANY_TYPE, null);
        var result = nodes.iterateNext();
        $code.html(htmlEncode(result.nodeValue.toString()));
        $container.find('.fade').addClass('show');
    });
});
