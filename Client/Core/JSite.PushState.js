//--------------------------------------------------------------------------
// using  JSite
// extanding JSite.Hijax



(function (JSite, $, undefined) {
    (function (Hijax) {


        if (location.hash.indexOf("!") > 0) {
            var url = location.hash.substring(location.hash.indexOf("!") + 1)
            //  alert("URL : "+url);
            url = url.replace(/\|/gi, "&").replace(/\/\//gi, "/?").replace(/:/gi, "=");
            window.location = url;
        }

        //--------------------------------------------------------------------------
        // Begin Code Here   
        var requestNum = 0;
        var track = 0;
        var onLoadEvents = [];
        var OnLoadOnce = [];
        var desposeStack = [];
        var IsAuthenticatedEvents = [];
        var IsNotAuthenticatedEvents = [];

        window.IsPushState = pushStateSapport();



        function pushStateSapport() {
            var ua = navigator.userAgent;


            // We only want Android 2, stock browser, and not Chrome which identifies
            // itself as 'Mobile Safari' as well
            if (ua.indexOf('Android 2') !== -1 &&
            ua.indexOf('Mobile Safari') !== -1 &&
            ua.indexOf('Chrome') === -1) {
                return false;
            }


            // Return the regular check
            return (window.history && 'pushState' in history);

        }


        if (!$.cookie('Currency')) {
            $.cookie('Currency', JSON.stringify({ Code: 'USD', Rate: 1, Symbol: '$', IsUserSelection: false }))
        }
        Hijax.Currency = JSON.parse($.cookie('Currency'));
        Hijax.Currency.SaveToCookie = function () {
            $.cookie('Currency', JSON.stringify(Hijax.Currency))
        };

        Hijax.init = function () {

            if (location.hash.indexOf("!") > 0) {
                var url = location.hash.substring(location.hash.indexOf("!") + 1)
                //  alert("URL : "+url);
                url = url.replace(/\|/gi, "&").replace(/\/\//gi, "/?").replace(/:/gi, "=");
                window.location = url;
            }
            if (JSite.Storage.IsSupported) {
                if (JSiteVersion != JSite.Storage.GetString("JSiteVersion")) {
                    // clear Storage
                    JSite.Storage.Clear();
                }
                else {
                    var tmpKeys = JSite.Storage.GetString("TemplateKeys");
                    if (tmpKeys) {

                        var keys = tmpKeys.split(",");

                        for (var i = 0; i < keys.length; i++) {
                            if (keys[i]) {
                                JSite.Hijax.Manager.Templates[keys[i]] = JSite.Storage.GetString("Xsl-" + keys[i]);
                            }
                        }
                        JSite.Hijax.Manager.TemplateKeys = tmpKeys;
                        console.log("Storage loaded - " + tmpKeys);
                    }
                    var dataCacheKey = JSite.Storage.GetString("DataCacheKey");
                    if (dataCacheKey) {

                        var dKeys = dataCacheKey.split(",");

                        for (var i = 0; i < dKeys.length; i++) {
                            if (dKeys[i]) {

                                var xml = JSite.Storage.GetString("Xml-" + dKeys[i])
                                if (xml)
                                    JSite.Hijax.Manager.DataTemplates[dKeys[i]] = xml;
                            }
                        }
                        JSite.Hijax.Manager.TemplateKeys = tmpKeys;
                        console.log("Storage loaded - " + tmpKeys);
                    }
                }

                JSite.Storage.SetString("JSiteVersion", JSiteVersion)
            }
        }

        Hijax.OnLoad = function (event) {
            onLoadEvents.push(event);
        }
        Hijax.OnLoadOnce = function (event) {
            OnLoadOnce.push(event);
        }

        Hijax.Despose = function (event) {
            desposeStack.push(event);
        }

        Hijax.RegisterIsAuthenticatedEvent = function (event) {
            IsAuthenticatedEvents.push(event);
        }

        Hijax.RegisterIsNotAuthenticatedEvent = function (event) {
            IsNotAuthenticatedEvents.push(event);
        }


        function runAuthenticatedEvents(userID) {
            var localUserID = userID;
            JSite.Hijax.Manager.UserID = userID;

            var events = IsNotAuthenticatedEvents;
            if (userID != null && userID != '')
                events = IsAuthenticatedEvents;

            for (var i = 0; i < events.length; i++) {
                events[i](localUserID);
            }

        }

        function GetContainer(container) {
            var conSelectors = container.split(',');
            var containerSelector = container;
            for (var i = 0; i < conSelectors.length; i++) {
                containerSelector = conSelectors[i];
                if ($(containerSelector).length) {
                    break;
                }
            }
            return escape(containerSelector);
        }

        function SetLinks(that, containerSelector) {
            $(containerSelector + ' a').each(function (i, el) {

                var href = $(el).attr("href");
                if ($(el).attr('AjaxMode') == 'disabled'
                || $(el).attr('ajaxMode') == 'disabled'
                || $(el).attr('ajaxmode') == 'disabled'
                || (href && href.indexOf("http") > -1)
                || (!href)
                || href == '#')
                    return;


                //                var clickEvent = /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent) ? 'tap' : 'click';
                //                var taped = false;

                var container = $(el).attr('Container');
                if (!container)
                    container = $(el).attr('container');
                var disablescrolltop = $(el).attr('disablescrolltop');
                var clickedObjID = $(el).attr('id');
                var clickedObjClass = $(el).attr('class');

                $(el).bind('click', function (e) {

                    //taped = true;
                    //  setTimeout(function () { taped = false; }, 100);

                    that.Container = container;
                    that.ScrollTop = (disablescrolltop != 'True');
                    that.ClickedObjID = clickedObjID;
                    that.ClickedObjClass = clickedObjClass;
                    that.ClickedObjSelector = $(this).attr("track");

                    var url = $(this).attr("href");

                    //This function would get content from the server and insert it into the id="content" element
                    if (url != '') {
                        JSite.Hijax.Manager.Load(url);

                        //This stops the browser from actually following the link
                        e.preventDefault();

                    }
                });

            });
        }


        function processData(pub, callbaclFn) {
            var that = pub;
            var thatcallbaclFn = callbaclFn;

            return function (data) {

                track = 0;
                var redirectUrl = $(data).find('Page').attr('Redirect');
                if (redirectUrl) {
                    window.location = redirectUrl;
                }


                if ($.browser.msie && parseInt($.browser.version) < 9) {
                    document.getElementsByName("title").innerHTML = $(data).find('Page').attr('Title');
                }
                else {
                    $('title').html($(data).find('Page').attr('Title'));
                }
                $("meta[name='description']").attr('content', $(data).find('Page').attr('Description'));

                var UserID = $(data).find('Page').attr('UserID');
                var pageKey = $(data).find('Page').attr('PageKey');
                JSite.Hijax.Manager.UserID = UserID;
                JSite.Hijax.Manager.PageKey = pageKey;

                var rn = parseInt($(data).find('Page').attr('RequestNum'));
                if (rn < requestNum) {
                    return;
                }

                $(data).find('Page>Template').each(function () {

                    var containerSelector = $(this).attr('Container');

                    var templateID = $(this).attr("TemplateID");
                    var xsl = $(this).find('Xsl').text().replace(/\<-\!-\[/g, '<![').replace(/]-]->/g, ']]>');
                    if (xsl != '') {
                        that.Templates[templateID] = xsl;
                        JSite.Storage.SetString("Xsl-" + templateID, xsl);
                        if (that.TemplateKeys.indexOf("," + templateID + ",") < 0) {
                            that.TemplateKeys += templateID + ",";
                            JSite.Storage.SetString("TemplateKeys", that.TemplateKeys);
                        }
                    }
                    var xml = $(this).find('Xml').text();
                    var dataCacheKey = $(this).find('Xml').attr("DataClientCacheKey");
                    if (xml == '') {
                        xml = that.DataTemplates[dataCacheKey];
                    }
                    else if ($(this).find('Xml').attr("ClientCache") == "Full" && dataCacheKey) {

                        that.DataTemplates[dataCacheKey] = xml;
                        JSite.Storage.SetString("Xml-" + dataCacheKey, xml);
                        that.DataCacheKey += dataCacheKey + ",";
                    }
                    // fix cdata problem
                    xml = xml.replace(/\<-\!-\[/g, '<![').replace(/]-]->/g, ']]>');

                    var js = $(this).find('Js').text();
                    if (that.Templates[templateID] != undefined) {

                        var htm = $.transform({
                            error: onError,
                            xslstr: [that.Templates[templateID]],
                            xmlstr: [xml],
                            xslParams: { UserAgent: navigator.userAgent, CurrencyCode: JSite.Hijax.Currency.Code, CurrencyRate: JSite.Hijax.Currency.Rate, CurrencySymbol: JSite.Hijax.Currency.Symbol }
                        });
                        htm = htm.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/gi, '&').replace(/\?&/gi, '?');
                        $(containerSelector).html(htm);
                        SetLinks(that, containerSelector);
                        if (js)
                            eval(js);

                    }
                    else {
                        $(containerSelector).html(xml);
                        SetLinks(that, containerSelector);
                        if (js)
                            eval(js);
                    }
                });

                if (that.ScrollTop)
                    $("html").scrollTop(0);

                for (var i = 0; i < onLoadEvents.length; i++) {
                    onLoadEvents[i]();
                }
                JSite.Hijax.Manager.Isloading = false;
                runAuthenticatedEvents(UserID);
                that.Container = null;
                // $('body').css('cursor', 'default');
                that.Container = null;
                that.ScrollTop = true;
                that.ClickedObjID = null;
                that.ClickedObjClass = null;
                that.ClickedObjSelector = null;

                $('a').each(function (i, el) {
                    $(el).attr('track', track++);
                });

                if (thatcallbaclFn) {
                    thatcallbaclFn();
                }

            }
        }


        JSite.Hijax.Manager = (function () {

            var pub = { Current: null,
                LastURL: null,
                UserID: null,
                PageKey: null,
                Templates: [],
                DataTemplates: [],
                TemplateKeys: ',',
                DataCacheKey: ',',
                Container: null,
                LastContainer: null,
                ScrollTop: true,
                StateChange: function (s) { },
                ForceReload: false,
                ClickedObjID: null,
                ClickedObjClass: null,
                ClickedObjSelector: null,
                IsLoading: false,
                SetCurrent: function (hase) {
                    if (!hase)
                        hase = "";
                    this.Current = (hase.indexOf("#!/") == 0) ? hase.substring(3) : hase;
                    if (this.Current.indexOf("#%21/") == 0)
                        this.Current = this.Current.substring(5);
                    if (this.Current == "#!")
                        this.Current = '';

                    if (this.Current.indexOf("/") == 0 && this.Current != "/")
                        this.Current = this.Current.substring(1);
                },
                Load: function (hase, saveHistory) {

                    if (JSite.Hijax.Manager.ForceReload) {
                        window.location.href = "http://" + window.location.host + "/" + hase;
                        return;
                    }
                    if (!IsPushState) {
                        window.location.href = hase;
                        return;
                    }
                    this.IsLoading = true;

                    if (hase.indexOf("shop_bag_billing") < 0
                    && hase.indexOf("thank-you/") < 0
                    &&
                    "https:" == document.location.protocol) {
                        var url = "http://" + window.location.hostname + "/" + hase;
                        window.location.href = url;
                        return;
                    }
                    var that = this;
                    if (saveHistory !== false)
                        saveHistory = true;

                    // $('body').css('cursor', 'wait');
                    this.LastURL = this.Current;

                    this.SetCurrent(hase);

                    //This is where we update the address bar with the 'url' parameter
                    if (saveHistory)
                        window.history.pushState({ Container: this.Container }, null, hase);

                    var url = "JSite/Core/SP.ashx?PageUrl=" + this.Current.replace(/&/g, "%.");

                    url += "&CashedTemplates=" + this.TemplateKeys;
                    if (this.Container) {
                        url += "&Container=" + GetContainer(this.Container);
                    }

                    //url += "&ClickedObjID=" + this.ClickedObjID + "&ClickedObjClass=" + this.ClickedObjClass + "&PageKey=" + this.PageKey + "&ClickedObjSelector=" + this.ClickedObjSelector;
                    //url += "&LastUrl=" + this.LastURL.replace(/&/g, "%.");
                    while (desposeStack.length > 0) {
                        (desposeStack.pop())();
                    }
                    requestNum++;
                    url += "&RequestNum=" + requestNum;
                    $.ajax({
                        async: true
                    , cache: false
                    , type: "POST"
                    , data: { DataClientCash: this.DataCacheKey }
                    , url: url
                    , success: processData(this)
                    , error: function (xhr, ajaxOptions, thrownError) {
                        JSite.Hijax.Manager.Container = null;
                        var errUrl = window.location.protocol + "//" + window.location.host + "/";
                        if (xhr.status == 404)
                            errUrl += "/404/";
                        else
                            errUrl += "/500/";

                        // window.location.href = errUrl;
                    }
                    });
                },
                LoadOndemand: function (odContainer, callbackFn) {

                    this.IsLoading = true;
                    var that = this;
                    var url = "JSite/Core/SP.ashx?PageUrl=" + this.Current.replace(/&/g, "%.");

                    url += "&CashedTemplates=" + this.TemplateKeys;
                    if (odContainer) {
                        url += "&Container=" + GetContainer(odContainer);
                    }

                    requestNum++;
                    url += "&Ondemand=True&RequestNum=" + requestNum;
                    $.ajax({ async: true
                    , cache: false
                    , url: url
                    , success: processData(this, callbackFn)
                    , error: function (xhr, ajaxOptions, thrownError) {
                        JSite.Hijax.Manager.Container = null;
                        var errUrl = window.location.protocol + "//" + window.location.host + "/";
                        if (xhr.status == 404)
                            errUrl += "/404/";
                        else
                            errUrl += "/500/";

                        // window.location.href = errUrl;
                    }
                    });
                },
                LoadAjax: function (url, odContainer, callbackFn) {

                    this.IsLoading = true;
                    var that = this;
                    var url = "JSite/Core/SP.ashx?PageUrl=" + url.replace(/&/g, "%.");

                    url += "&CashedTemplates=" + this.TemplateKeys;
                    if (odContainer) {
                        url += "&Container=" + GetContainer(odContainer);
                    }

                    requestNum++;
                    url += "&Ondemand=True&RequestNum=" + requestNum;
                    $.ajax({ async: true
                    , cache: false
                    , url: url
                    , success: processData(this, callbackFn)
                    , error: function (xhr, ajaxOptions, thrownError) {
                        JSite.Hijax.Manager.Container = null;
                        var errUrl = window.location.protocol + "//" + window.location.host + "/";
                        if (xhr.status == 404)
                            errUrl += "/404/";
                        else
                            errUrl += "/500/";

                        // window.location.href = errUrl;
                        devAlert("Error: " + thrownError + xhr.status);
                    }
                    });
                },
                PostForm: function (form) {
                }
                , Refresh: function () {
                    this.Load(location.pathname + location.search);
                }
            }
            return pub;
        } ());







        $(document).ready(function () {
            JSite.Hijax.init();

            window.setTimeout(function () {


                JSite.Hijax.Manager.SetCurrent(location.pathname + location.search);
                if (IsPushState) {
                    if(window.addEventListener)
                    {
                        window.addEventListener("popstate", function (e) {
                            // console.log(location.pathname + location.search + "!=" + JSite.Hijax.Manager.Current);
                            var cur = JSite.Hijax.Manager.Current;
                            if (cur.indexOf("/") != 0)
                                cur = "/" + cur;

                            if (location.pathname + location.search != cur) {
                                // JSite.Hijax.Manager.Container = e.originalEvent.state.Contatiner;
                                // console.log(JSON.stringify(e.state));
                                JSite.Hijax.Manager.Load(location.pathname + location.search, false);
                            }
                            else
                                JSite.Hijax.Manager.StateChange(e);
                        }, false);
                    }
                    else {
                        window.attachEvent("onpopstate ", function (e) {
                            // console.log(location.pathname + location.search + "!=" + JSite.Hijax.Manager.Current);
                            var cur = JSite.Hijax.Manager.Current;
                            if (cur.indexOf("/") != 0)
                                cur = "/" + cur;

                            if (location.pathname + location.search != cur) {
                                // JSite.Hijax.Manager.Container = e.originalEvent.state.Contatiner;
                                // console.log(JSON.stringify(e.state));
                                JSite.Hijax.Manager.Load(location.pathname + location.search, false);
                            }
                            else
                                JSite.Hijax.Manager.StateChange(e);
                        });
                    }

                    SetLinks(JSite.Hijax.Manager, 'body');
                }
                for (var i = 0; i < onLoadEvents.length; i++) {
                    onLoadEvents[i]();
                }
                runAuthenticatedEvents(JSite.Hijax.Manager.UserID);
                while (OnLoadOnce.length > 0) {
                    (OnLoadOnce.pop())();
                }
            }


            , 5);
        });



        // End of code
        //--------------------------------------------------------------------------   
    } (JSite.Hijax = JSite.Hijax || {}));
} (window.JSite = window.JSite || {}, jQuery));
//--------------------------------------------------------------------------

var console;
if (!console) {
    console = {
        log: function (t) { }
    };
}

function onError(html, xsl, xml, obj, ex) {
    devAlert("Error: " + ex.message);
}

