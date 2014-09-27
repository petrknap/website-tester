/**
 * Creates graph URL (Google Chart API) and sets it as SRC attribute to output
 *
 * @param output
 * @param pageStats
 * @param width
 * @param height
 */
var displayResourceChart = function(output, pageStats, width, height) {
    var RESOURCE_TYPE_INFO = [
        {label: 'JavaScript', field: 'javascriptResponseBytes', color: 'e2192c'},
        {label: 'Images', field: 'imageResponseBytes', color: 'f3ed4a'},
        {label: 'CSS', field: 'cssResponseBytes', color: 'ff7008'},
        {label: 'HTML', field: 'htmlResponseBytes', color: '43c121'},
        {label: 'Flash', field: 'flashResponseBytes', color: 'f8ce44'},
        {label: 'Text', field: 'textResponseBytes', color: 'ad6bc5'},
        {label: 'Other', field: 'otherResponseBytes', color: '1051e8'}
        ],
        labels = [],
        data = [],
        colors = [],
        totalBytes = 0,
        largestSingleCategory = 0;
    for (var i = 0, len = RESOURCE_TYPE_INFO.length; i < len; ++i) {
        var label = RESOURCE_TYPE_INFO[i].label,
            field = RESOURCE_TYPE_INFO[i].field,
            color = RESOURCE_TYPE_INFO[i].color;
        if (field in pageStats) {
            var val = Number(pageStats[field]);
            totalBytes += val;
            if (val > largestSingleCategory) largestSingleCategory = val;
            labels.push(label);
            data.push(val);
            colors.push(color);
        }
    }

    // Construct the query to send to the Google Chart Tools.
    var query = [
        'chs=' + width + "x" + height,
        'cht=p',
        'chts=' + ['000000', 16].join(','),
        'chco=' + colors.join('|'),
        'chd=t:' + data.join(','),
        'chdl=' + labels.join('|'),
        'chdls=000000,14',
        'chdlp=' + (width > height ? "b" : "bv"),
        'chp=1.6',
        'chds=0,' + largestSingleCategory
    ].join('&');
    output.attr("src", 'http://chart.apis.google.com/chart?' + query);
};


var urlify = function(text) {
    var urlRegex = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
    return text.replace(urlRegex, function(url) {
        var text = url.substring(url.substring(0, url.length - 1).lastIndexOf("/") + 1, url.length);
        text =  text.length > 0 ? text : "this";
        return '<a href="' + url + '">' + text + '</a>';
    });
};


/* RESULTS */
/**
 *
 * Makes result into template
 *
 * @param output Output element
 * @param url
 * @param strategy
 * @param score Score in percents
 * @param pageStats Page statistics
 * @param formattedResults
 */
var makeReport = function(output, url, strategy, score, pageStats, formattedResults, chartWidth, chartHeight) {
    var temp;

    output.find(".pageUrl").html(url);

    output.find(".score").html(strategy + " " + Math.round(score));
    for(ps in pageStats) {
        output.find("." + ps).html(Math.round(pageStats[ps]));
    }

    displayResourceChart(output.find(".resourceChart"), pageStats , chartWidth, chartHeight);

    var formattedResultsOutput = output.find(".formattedResults"),
        formattedResult, fr,
        urlBlock, ub, urlBlockSum, urlBlockUrl, ubu,
        sortByRuleImpact = function(a, b) {
            return b.ruleImpact - a.ruleImpact;
        },
        finalizedFormattedResults = [], ffr, finalizedFormattedResult;

    for(fr in formattedResults.ruleResults) {
        formattedResult = formattedResults.ruleResults[fr];
        if(formattedResult.ruleImpact > 0.25) {
            finalizedFormattedResults.push(formattedResult);
        }
    }

    finalizedFormattedResults.sort(sortByRuleImpact);

    if(finalizedFormattedResults.length > 0) {
        formattedResultsOutput.html("");
        for(ffr in finalizedFormattedResults) {
            finalizedFormattedResult = finalizedFormattedResults[ffr];
            if(formattedResultsOutput.is("ul")) {
                formattedResultsOutput.append('<li>' + finalizedFormattedResult.localizedRuleName + '</li>');
            }
            else {
                formattedResultsOutput.append('<dt>' + finalizedFormattedResult.localizedRuleName + '</dt>');
                for(ub in finalizedFormattedResult.urlBlocks) {
                    urlBlock = finalizedFormattedResult.urlBlocks[ub];
                    urlBlockSum = "<p>" + urlBlock.header.format + "</p>";
                    try {
                        urlBlockSum = urlBlockSum.replace("$1", urlBlock.header.args[0].value);
                        urlBlockSum = urlBlockSum.replace("$2", urlBlock.header.args[1].value);
                    } catch(ignored) {
                        // No args
                    }
                    try {
                        urlBlockSum = urlBlockSum.replace("$3", urlBlock.header.args[2].value);
                    } catch(ignored) {
                        // No args
                    }
                    if(urlBlock.urls && urlBlock.urls.length > 0) {
                        urlBlockSum = urlBlockSum + "<ul>";
                        for(ubu in urlBlock.urls) {
                            urlBlockUrl = urlBlock.urls[ubu];
                            temp = urlBlockUrl.result.format;
                            try {
                                temp = temp.replace("$1", urlBlockUrl.result.args[0].value);
                                temp = temp.replace("$2", urlBlockUrl.result.args[1].value);
                            } catch(ignored) {
                                // No args
                            }
                            try {
                                temp = temp.replace("$3", urlBlockUrl.result.args[2].value);
                            } catch(ignored) {
                                // No args
                            }
                            urlBlockSum = urlBlockSum + "<li>" + temp + "</li>";
                        }
                        urlBlockSum = urlBlockSum + "</ul>";
                    }
                    formattedResultsOutput.append('<dd>' + urlify(urlBlockSum) + '</dd>');
                }
            }
        }
    }
};

/**
 *
 * Makes summary
 *
 */
insights.callbacks.makeSummary = function(results) {
    var output = $("#reportSummary"),
        result, r,
        avgScore = 0,
        avgPageStats =  {
            "numberResources": 0,
            "numberHosts": 0,
            "totalRequestBytes": 0,
            "numberStaticResources": 0,
            "htmlResponseBytes": 0,
            "cssResponseBytes": 0,
            "imageResponseBytes": 0,
            "javascriptResponseBytes": 0,
            "otherResponseBytes": 0,
            "numberJsResources": 0,
            "numberCssResources": 0
        }, ps,
        sumFormattedResults = {};
    for(r in results) {
        result = results[r];
        avgScore += result.score / results.length;
        for(ps in avgPageStats) {
            if(result.pageStats[ps]) {
                avgPageStats[ps] += result.pageStats[ps] / results.length;
            }
        }
        sumFormattedResults = $.extend({}, sumFormattedResults, result.formattedResults);
    }

    makeReport(
        output,
        "",
        "",
        avgScore,
        avgPageStats,
        sumFormattedResults,
        360,
        300
    );
};

/**
 *
 * Makes detailed reports
 *
 */
insights.callbacks.makeDetails = function(results) {
    var output = $("#reportDetails"),
        template = output.html(),
        sortByScore = function(a, b) {
            return a.score - b.score;
        }, cnt = 0, outputHtml,
        result, r;

    results.sort(sortByScore);

    outputHtml = "";
    for(r in results) {
        if(cnt % 2 == 0) outputHtml = outputHtml + '</div><div class="row-fluid">';
        outputHtml = outputHtml + template.replace("reportN", "report" + cnt);
        cnt++;
    }
    output.html(outputHtml);
    cnt = 0;
    for(r in results) {
        result = results[r];
        makeReport(
            output.find(".report" + cnt),
            result.url,
            result.strategy,
            result.score,
            result.pageStats,
            result.formattedResults,
            180,
            200
        );
        cnt++;
    }
};