module.exports =[
    { PackTo: "./Client/public/Min/min.js" , files:["./Client/Core/jquery.min.js","./Client/Core/jquery.cookie.js"
                                                    ,"./Client/Core/coffee-script.js"
                                                    ,"./Client/Core/ect.min.js","./Client/Core/Core.js"
                                                    , './Content/Modules/Main/Main.js'
                                                    , './Content/Modules/Main/Notifications.js'
                                                    ,'./Content/Modules/HomePage/hp.js'
                                                    ,'./Content/Modules/Store/Store.js'
                                                    ,'./Content/Modules/Store/ShoppingCart.js'
                                                    ,'./Content/Modules/Authentication/Register.js'
                                                    , './Content/Modules/Profile/Profile.js'
                                                    , './Content/Modules/AddRide/AddRide.js'
                                                    , './Content/Modules/HomePage/Chat.js'
                                                    , './Content/Modules/MyRides/MyRides.js'
                                                    , './Content/Modules/OpenRequests/OpenRequests.js'
                                                    , './Content/Modules/Indexes/Indexes.js'
                                                    , './Content/Modules/Indexes/Business.js'                                                    
                                                    , './Content/Modules/Admin/Index/Business.js'
                                                    , './Content/Modules/Reminders/Reminders.js'
                                                    , './Content/Modules/ContactUs/ContactUs.js'
                                                    ]},

    { PackTo: "./Client/Public/Min/admin.js" , files:["./Client/Core/jquery.min.js","./Client/Core/coffee-script.js"
                                                     ,"./Client/Core/ect.min.js"
                                                     ,"./Client/Core/Core.js"
                                                    ,'./Content/Modules/Main/Main.js'
                                                    ,'./Content/Modules/Admin/ActiveRides/ActiveRides.js'
                                                    , './Content/Modules/Admin/Users/Users.js'
                                                    ]},

    {
        PackTo: "./Client/Public/Min/min.css", files: ["./Content/Modules/Main/Main.css"
                                                    , "./Content/Modules/HomePage/hp.css"
                                                    , "./Content/Modules/AddRide/AddRide.css"
                                                    , "./Content/Modules/Profile/Profile.css"
                                                    , './Content/Modules/MyRides/MyRides.css'
                                                    , './Content/Modules/OpenRequests/OpenRequests.css'
                                                    , './Content/Modules/Reports/Reports.css'
                                                    , './Content/Modules/Indexes/Indexes.css'                                                    
                                                    , "./Content/Modules/AboutUs/AboutUs.css"
                                                    , "./Content/Modules/Store/Store.css"
                                                    , './Content/Modules/Authentication/Register.css'
                                                    , './Content/Modules/Authentication/Login.css'
                                                    , './Content/Modules/Order/Shipping.css'
                                                    , './Content/Modules/Reminders/Reminders.css'
                                                    , './Content/Modules/Agreement/Agreement.css'
                                                    , './Content/Modules/Admin/Main/Main.css'
                                                    , './Content/Modules/Admin/ActiveRides/ActiveRides.css'
                                                    , './Content/Modules/Admin/Index/Business.css'
                                                    , './Content/Modules/ContactUs/ContactUs.css'
                                                    ]}
    ];

