$(function () {
    var handlers = {
            fromSitemapXml: function(siteMap) {
                try {
                    var xSiteMap = $.parseXML(siteMap),
                        oSiteMap = $(xSiteMap),
                        urls = [];
                    oSiteMap.find("url loc").each(function() {
                        urls.push($(this)[0].textContent);
                    });
                    this.main(urls);
                    return true;
                }
                catch(e) {
                    alert(e.message);
                }
                return false;
            },
            fromPerLineUrls: function(perLineUrls) {
                var urls = perLineUrls.replace(" ", "");
                this.main(urls.split("\n"));
                return true;
            },
            setProgressBar: function(progressInPercents) {
                $("#options").find(".progress .bar").css({
                    width: progressInPercents + "%"
                });
            },
            main: function(urls) {
                var me = this,
                    report = $("#report");
                report.hide();
                if(template) report.html(template);
                else template = report.html();
                me.setProgressBar(0);
                var mainProgressBarTimer = window.setInterval(function() {
                    var progress = Math.round(100 * insights.getProgress());
                    me.setProgressBar(progress > 5 ? progress : 5);
                    if(progress == 100) {
                        window.clearInterval(mainProgressBarTimer);
                        report.show();
                    }
                }, 1000);
                insights.run(urls);
            }
        },
        options = $("#options"),
        input = options.find("#inputSiteMapXmlOrPerLineUrls"),
        template;

    options.find("form").on("submit", function () {
        return false;
    });

    options.find(".fromPerLineUrls").on("click", function() {
        handlers.fromPerLineUrls(input.val());
    });

    options.find(".fromSiteMapXml").on("click", function() {
        handlers.fromSitemapXml(input.val());
    });
});