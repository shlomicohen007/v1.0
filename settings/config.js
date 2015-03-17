module.exports = {
    autoPack:true,
    listen:{
	    host: "ec2-52-11-65-151.us-west-2.compute.amazonaws.com",
        //host: "localhost",
        port: 3002,
        //host: "awseb-e-g-AWSEBLoa-1323WP9X79QUC-1828159266.us-west-2.elb.amazonaws.com",
	    //port: 80
    },
    serve:{
        host: "ec2-52-11-65-151.us-west-2.compute.amazonaws.com",
        //host: "localhost",
        port: 3002,
        //host: "awseb-e-g-AWSEBLoa-1323WP9X79QUC-1828159266.us-west-2.elb.amazonaws.com",
        //port: 80
    },
    db:{
        name:"BusNet",
        server:"ip-172-31-25-81.us-west-2.compute.internal"
        //server: "localhost"
    },
    wasup:
    {
        url: "ec2-52-10-133-76.us-west-2.compute.amazonaws.com:3000/wasup/send"
    }
}

