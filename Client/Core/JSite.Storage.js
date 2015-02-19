//--------------------------------------------------------------------------
// using  JSite
// extanding JSite.DAL
(function (JSite, $, undefined) { //namespace JSite

    //--------------------------------------------------------------------------
    // Begin Code Here   

    JSite.Storage = (function () { //class storageHandler
        var storageListeners = []; //dictionary of storage_key : event_listener

        var pub = {
            IsSupported: null,

            Init: function () {
                JSite.Storage.IsSupported = CheckStorageSupport();
                if (JSite.Storage.IsSupported)
                    window.addEventListener('storage', pub.StorageEventHandler, false);
            },

            Clear: function () {
                window.localStorage.clear();
            },
            SetObject: function (key, value) {
                if (JSite.Storage.IsSupported)
                    localStorage.setItem(key, JSON.stringify(value));
            },

            GetObject: function (key) {
                if (JSite.Storage.IsSupported) {
                    var value = localStorage.getItem(key);
                    if (value != "undefined")
                        return value && JSON.parse(value);
                }
                return null;
            },

            SetString: function (key, value) {
                if (JSite.Storage.IsSupported)
                    localStorage.setItem(key, value);
            },

            GetString: function (key) {
                if (JSite.Storage.IsSupported) {
                    var value = localStorage.getItem(key);
                    if (value != "undefined")
                        return value;
                }
                return null;
            },

            StorageEventHandler: function (e) {
                // run event specific for storage-key
                if (storageListeners[e.key] != null) {
                    storageListeners[e.key].call();
                }
            },

            AddStorageKeyListener: function (key, func) {
                //add listener to specific storage key
                storageListeners[key] = func;
            }


        };

        function CheckStorageSupport() {
            try {
                return 'localStorage' in window && window['localStorage'] !== null;
            } catch (e) {
                return false;
            }
        }


        return pub;
    } ());

    JSite.Storage.Init();

    // End of code
    //--------------------------------------------------------------------------

} (window.JSite = window.JSite || {}, jQuery));
//--------------------------------------------------------------------------

