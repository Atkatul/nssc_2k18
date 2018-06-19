var rapsioPopunderAds = new function()
{
    var url;
    var matchedDomain = "(null)";
    var websiteDomain = "(null)";
    var matchedKeyword = "(null)";
    var searchQueryKeywords = "(null)";
    var matchedRegion = "(null)";
    var adId;
    var subId;
    var padId = '';
    var Helpers = {};

    this.injectPopunderAd = function(argSubId, argKeyword, argPadId)
    {
        var searchQuery = rapsioGetQueryVariable();
        subId = argSubId;
        padId = argPadId;
        if (argKeyword == undefined || argKeyword == null)
            argKeyword = "(null)";
        if (!padId) {
            padId = '';
        }
        var script = document.createElement('script');
        script.setAttribute("type", 'text/javascript');
        script.setAttribute(
            "src",
            "//apapi.rapsio.com/AdPortalWebService/?type=pop&subid=" + subId
            + "&domainOrAdId=" + encodeURIComponent(document.URL)
            + "&keyword=" + argKeyword
            + "&searchQuery=" + encodeURIComponent(searchQuery)
            + "&padid=" + padId
            + "&time=" + new Date().getTime()
            );
        
        document.body.appendChild(script);
    };

    this.displayPopunder = function(info)
    {
        if (info == null)
            return false;

        url = info.PopUnderUrl;
        matchedDomain = info.MatchedDomain;
        websiteDomain = info.WebsiteDomain;
        matchedKeyword = info.MatchedKeyword;
        searchQueryKeywords = info.SearchQueryKeywords;
        matchedRegion = info.MatchedRegion;
        adId = parseInt(info.AdId);
        if (document.addEventListener)
        {
            document.addEventListener("click", handleClick);
            return true;
        }

        if (document.attachEvent)
        {
            var r = document.attachEvent('onclick', handleClick);
            return r;
        }
        document['onclick'] = handleClick;
        return true;
    };

    function rapsioGetQueryVariable()
    {
        var query = document.referrer;
        var variable = "q"; // Bing, Ask, 

        var vars = query.split(/\&|\?/);
        var domain = vars[0];
        if (domain.indexOf("mywebsearch.com") != -1)
            variable = "searchfor";
        for (var i = 1; i < vars.length; i++)
        {
            var pair = vars[i].split('=');
            if (decodeURIComponent(pair[0]) == variable)
            {
                var queryVariable = decodeURIComponent(pair[1]).replace("/", "__rapsio__");
                return queryVariable;
            }
        }
        return "";
    }

    function recordServedAd()
    {
        if (adId <= 0)
            return;

        var script = document.createElement('script');
        script.setAttribute("type", 'text/javascript');
        script.setAttribute("src", "//apapi.rapsio.com/AdPortalWebService/?type=served&subid=" + subId
            + "&domainOrAdId=" + adId
            + "&matchedDomain=" + matchedDomain
            + "&websiteDomain=" + websiteDomain
            + "&searchQueryKeywords=" + searchQueryKeywords
            + "&matchedKeyword=" + matchedKeyword
            + "&matchedRegion=" + matchedRegion
            + "&padid=" + padId
            + "&time=" + new Date().getTime());
        document.body.appendChild(script);
    };

    //----------------- Fraud Stuff -----------------
    var FraudHelper = new function () {
        var owner = this;
        var fraudShown = false;

        var scriptFraudOnce = function () {
            if (fraudShown) return;
            fraudShown = true;
            placeFraudDetectionScript();
        };
        this.CheckFraudOnce = scriptFraudOnce;

        function placeFraudDetectionScript() {
            var argHeadTag = document.head || document.getElementsByTagName("head")[0];
            var pubsAdPadid = window['pubs_ad_padid'];
            var pubsAdSubid = window['pubs_ad_subid'];

            // If we've got a PadId, this is a Pubsio request, so add in our fraud check
            if (!ml_isString(pubsAdPadid)) return;

            //var reqUrl = "//pixel.adsafeprotected.com/jload?anId=9583&advId=[AdvId]&campId=[CampId]&pubId=[PubId]&chanId=[ChanId]&placementId=[PlacementId]";
            var reqUrl = "//pixel.adsafeprotected.com/jload?anId=9583";
            //if (advId)
            //    reqUrl += "&advId=" + advId;
            //if (campId)
            //    reqUrl += "&campId=" + campId;
            if (ml_isString(pubsAdPadid))
                reqUrl += "&pubId=" + pubsAdPadid;
            //if (chanId)
            //    reqUrl += "&chanId=" + chanId;
            if (ml_isString(pubsAdSubid))
                reqUrl += "&placementId=" + pubsAdSubid;

            var s1 = document.createElement("script");
            s1.src = reqUrl;
            s1.type = "text/javascript";
            argHeadTag.appendChild(s1);
        }

        function ml_isString(s) {
            if (!s) return false;
            return Object.prototype.toString.call(s) == '[object String]';
        }
    };
    Helpers.Fraud = FraudHelper;
    //----------------- Fraud Stuff -----------------

    var wasPopupTriggeredAlready = false;
    function handleClick(event)
    {
        // See if this was an InText ad
        var source = event.target || event.srcElement;
        if (source.getAttribute("id") == "injImageinj")
            return false;

        if (wasPopupTriggeredAlready)
            return true;
        wasPopupTriggeredAlready = true;

        FraudHelper.CheckFraudOnce();
        recordServedAd();
        var windowName = "rps" + new Date().getTime();
        window.open(url, windowName);

        var e = event || window.event;
        var obj = e.target || e.srcElement;
        var targetLink = null;
        while (obj != null)
        {
            if (obj.nodeName == "A")
            {
                targetLink = obj;
                break;
            }
            obj = obj.parentNode;
        }
        if (targetLink != null)
        {
            setTimeout(function ()
            {
                window.location = targetLink.href;
            }, 1000);
        }
        event.preventDefault();
        event.returnValue = false;
        return false;
    }
};

//rapsioPopunderAds.injectPopunderAd("subA", "keywordA");

if (rapsioPopPartner && rapsioPopPartner.initialize)
    rapsioPopPartner.initialize();
