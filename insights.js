// API: https://developers.google.com/speed/docs/insights/v1/getting_started
var insights = {
    api_key: null,
    prettyprint: null,
    userIp: null,
    locale: null,
    strategy: "desktop",
    api_url: "https://www.googleapis.com/pagespeedonline/v1/runPagespeed?",
    urls: [],
    results: [],
    callbacks: {},
    set: function(settings) {
        var me = this, key;
        for(key in settings) {
            me[key] = settings[key];
        }
        return me;
    },
    run: function(urls, maxCountOfUrls) {
        var me = this,
            api_key = "AIzaSyCeEM9lD_dwvkHUX_uQfY38xMYPgx2kY08",
            getRandomSetOfUrls = function(maxCountOfUrls) {
                while(me.urls.length > maxCountOfUrls) {
                    var rndIndex = Math.floor((Math.random() * me.urls.length) + 1);
                    me.urls.splice(rndIndex, 1);
                }
            },
            runWebsiteSpeedTest = function(index) {
                if(!index) index = 0;
                me.runOneTest(me.urls[index], index);
                index++;
                if(index < me.urls.length)
                    runWebsiteSpeedTest(index);
            }, i = 0, j = 0;

        if(!me.api_key) me.api_key = api_key;
        if(!maxCountOfUrls || me.api_key == api_key)
            maxCountOfUrls = 20;

        if(me.strategy instanceof Array) {
            me.urls = [];
            for(j = 0; j < urls.length; j++) {
                for(i = 0; i < me.strategy.length; i++) {
                    me.urls.push(urls[j]);
                }
            }
        }
        else {
            me.strategy = [].push(me.strategy);
            me.urls = urls;
        }
        me.results = [];
        getRandomSetOfUrls(maxCountOfUrls);
        runWebsiteSpeedTest();
    },
    getProgress: function() {
        return this.results.length / this.urls.length;
    },
    runOneTest: function(pageUrl, index) {
        var me = this,
            s = document.createElement('script');
        s.type = 'text/javascript';
        s.async = true;
        var query = [
            "url=" + pageUrl,
            "callback=insights.runCallbacks" + index,
            "key=" + me.api_key,
            "strategy=" + me.strategy[index % me.strategy.length]
        ].join('&');
        if(me.prettyprint != null) query = query + "&prettyprint=" + (me.prettyprint ? "true" : "false");
        if(me.userIp != null) query = query + "&userIp=" + me.userIp;
        if(me.locale != null) query = query + "&locale=" + me.locale;
        s.src = this.api_url + query;
        me["runCallbacks" + index] = function(result) {
            me.runCallbacks(result, index);
        };
        //noinspection JSUnresolvedVariable
        document.head.insertBefore(s, null);
    },
    runCallbacks: function(result, index) {
        var me = this;
        result.url = me.urls[index];
        result.strategy = me.strategy[index % me.strategy.length];
        this.results.push(result);
        if(me.results.length == me.urls.length) {
            for (var fn in me.callbacks) {
                if(me.callbacks.hasOwnProperty(fn)) {
                    var f = me.callbacks[fn];
                    if (typeof f == "function") {
                        try {
                            this.callbacks[fn](this.results);
                        } catch(e) {
                            console.log(e);
                        }
                    }
                }
            }
        }
    }
};