<!DOCTYPE html>
<?php

require_once("../../config.inc.php");

define("TITLE", "Website tester");
define("MOTTO", "Check speed of your website");

?>
<html lang="en" xmlns="http://www.w3.org/1999/html">
<head>
    <title><?php echo(TITLE); ?></title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link href="<?php echo(BootstrapMinCss); ?>" rel="stylesheet">
    <style>
        body {
            padding-top: 20px;
            padding-bottom: 40px;
        }

        /* Custom container */
        .container-narrow {
            margin: 0 auto;
            max-width: 800px;
        }
        .container-narrow > hr {
            margin: 30px 0;
        }

        /* Main marketing message and sign up button */
        .jumbotron {
            margin: 20px 0;
            text-align: center;
        }
    </style>
</head>
<body>

<div class="container-narrow">

    <div class="jumbotron">
        <h1><?php echo MOTTO ?></h1>

        <a
            class="btn btn-large btn-success"
            href="https://github.com/petrknap/website-tester#website-tester"
            >About Website tester</a>
    </div>

    <hr>

    <div id="options">

        <h2>Options</h2>

        <form action="./" method="GET" class="form-horizontal">
            <div class="row-fluid">
                <div class="span4">
                    <label for="inputSiteMapXmlOrPerLineUrls">Paste your <code>sitemap.xml</code> here:</label>

                    <p><span class="help-block">You can also insert one URL per line.</span></p>
                </div>
                <div class="span8">
                    <textarea
                        id="inputSiteMapXmlOrPerLineUrls"
                        name="inputSiteMapXmlOrPerLineUrls"
                        class="span12"
                        rows="10"
                        ></textarea>
                </div>
            </div>

            <hr>

            <div class="row-fluid">
                <div class="span6">
                    <div class="btn-group">
                        <button class="btn btn-small btn-primary fromSiteMapXml">
                            Run test from <code>sitemap.xml</code>
                        </button>
                        <button class="btn btn-small fromPerLineUrls">
                            from <code>URL\ns</code>
                        </button>
                    </div>
                </div>
                <div class="span6">
                    <div class="progress">
                        <div class="bar" style="width: 0%;"></div>
                    </div>
                </div>
            </div>
        </form>
    </div>

    <div id="report" class="hide">

        <hr>

        <h2>Report</h2>


        <h3>Summary</h3>

        <div id="reportSummary">
            <div class="row-fluid">
                <div class="span6">
                    <p class="lead">Avarage score of your website is <span class="score">0</span>&nbsp;%.</p>
                    <h4>Hints</h4>
                    <ul class="formattedResults">
                        <li>No high impact suggestions. Good job!</li>
                    </ul>
                </div>
                <div class="row text-center span6">
                    <img class="img-rounded resourceChart" src="about:blank"/>
                </div>
            </div>
        </div>


        <h3>Details</h3>

        <div id="reportDetails">
            <div class="reportN">
                <h4>
                    <span class="badge badge-inverse pull-right">
                        <span class="score">0</span>&nbsp;%
                    </span>
                    <span class="pageUrl">about:blank</span>
                </h4>

                <div class="row-fluid">
                    <div class="span9">
                        <h5 class="hide">Hints</h5>
                        <dl class="formattedResults">
                            <dt>Good job!</dt>
                            <dd>No high impact suggestions.</dd>
                        </dl>
                    </div>
                    <div class="span3">
                        <h5>Resource statistics</h5>
                        <table class="table table-striped table-bordered">
                            <tr>
                                <th>Number of</th>
                                <th>#</th>
                            </tr>
                            <tr>
                                <td>Hosts</td>
                                <td class="numberHosts"></td>
                            </tr>
                            <tr>
                                <td>Resources</td>
                                <td class="numberResources"></td>
                            </tr>
                            <tr>
                                <td>JavaScript resources</td>
                                <td class="numberJsResources"></td>
                            </tr>
                            <tr>
                                <td>CSS resources</td>
                                <td class="numberCssResources"></td>
                            </tr>
                            <tr>
                                <td>Static resources</td>
                                <td class="numberStaticResources"></td>
                            </tr>
                        </table>
                        <div class="text-center">
                            <img class="img-rounded resourceChart" src="about:blank"/>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    </div>

    <hr>

    <div class="footer">
        <p>2014 - <?php echo(CurrentYear); ?> &copy; Petr Knap</p>
    </div>

</div>
<!-- /container -->

<!--[if lt IE 9]><script type="text/javascript" src="<?php echo(Html5ShivJs); ?>"></script><![endif]-->
<script src="<?php echo(jQueryMinJs); ?>"></script>
<script src="<?php echo(BootstrapMinJs); ?>"></script>
<script src="<?php echo(StatsJs); ?>"></script>
<script>
    var userIp = "<?php echo($_SERVER["REMOTE_ADDR"]); ?>";
</script>
<script src="./insights.js"></script>
<script src="./insights.settings.js"></script>
<script src="./insights.reports.js"></script>
<script src="./scripts.js"></script>

</body>
</html>