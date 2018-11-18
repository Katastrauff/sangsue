

/* Manage the progress bar */
var ProgressBar = function ($progressbar, options) {
    var defaults = {
        progressPercent: 5,
        progressInterval: 500,
        maxProgress: 95,
        onShown: undefined
    }
    this.opts = $.extend({}, defaults, options || {});
    this.$progressbar = $progressbar;
    this.$modal = this.$progressbar.parents('.modal');
    this.$modal.on('shown.bs.modal', this.opts.onShown);
    var my = this;
    this.$modal.on('hidden.bs.modal', function () {
        my.progress(0);
    });
    return this;
};
ProgressBar.prototype.show = function () {
    this.$progressbar.removeClass('bg-success').removeClass('bg-danger');
    this.$modal.css('display', '');
    this.$modal.modal({
        backdrop: 'static',
        keyboard: false
    });
    this.start();
    return this;
};
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
ProgressBar.prototype.complete = function (isSuccess) {
    var completeClass = 'bg-success';
    if (!isSuccess) {
        completeClass = 'bg-danger';
    }
    this.$progressbar.addClass(completeClass);
    this.$progressbar.css('width', '100%').attr('aria-valuenow', 100);
    this.hide();
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
Alert.prototype.success = function (text) {
    this.show('success', text);
};
Alert.prototype.show = function (type, text) {
    this.$alertText.html(text);
    this.$alert.removeClass('alert-danger').removeClass('alert-success');
    if (type === 'error')
        this.$alert.addClass('alert-danger');
    else if (type === 'success')
        this.$alert.addClass('alert-success');
    this.$alert.addClass('show');
};
Alert.prototype.hide = function () {
    this.$alertText.html('');
    this.$alert.removeClass('show');
};



$(document).ready(function () {

    var alert = new Alert($('#alert'));
    var progressBar = new ProgressBar($('#ajax-progress'), {
        progressPercent: 5,
        progressInterval: 500,
        maxProgress: 95,
        onShown: function (e) {
            $.ajax({
                url: $('#form').attr('action'), // La ressource ciblée
                type: $('#form').attr('method'), // Le type de la requête HTTP.
                data: 'url=' + $('#url').val()
            })
                .done(function (data, textStatus, jqXHR) {
                    progressBar.complete(true);
                    alert.success('Ok !');
                    $('#result tbody tr').remove();
                    data.forEach(function (node) {
                        $('#result tbody').append('<tr><td>' + node.da + '</td><td>' + node.en + '</td></tr>');
                    });
                    $('#result').removeClass('invisible');
                })
                .fail(function (data, textStatus, jqXHR) {
                    progressBar.complete(false);
                    alert.error('Failed');
                });
        }
    });
    $('#btnGetIt').click(function (e) {
        e.preventDefault();
        $('#result').addClass('invisible');
        progressBar.show();
        return false;
    });

});
