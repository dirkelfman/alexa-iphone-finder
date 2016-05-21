    
process.env.NODE_DEBUG  = 'http';

iPhoneFinder = require('iphone-finder');
iCloudUser ='dirkelfmand@gmail.com'

iCloudPass ='@Defcon22';

// iPhoneFinder.findAllDevices(iCloudUser, iCloudPass, function(err, devices) {
//     if ( err){
//         console.log( err);
//         return;
//     }

//     // Got here? Great! Lets see some device information
//     devices.forEach(function(device) {
//         // Output device information
//         console.log('Device Name: ' + device.name);
//         console.log('Device Type: ' + device.modelDisplayName);
//         if ( device.location ){
//         // Output location (latitude and longitude)
//             var lat = device.location.latitude;
//             var lon = device.location.longitude;
//             console.log('Lat/Long: ' + lat + ' / ' + lon);
        
//             // Output a url that shows the device location on google maps
//             console.log('View on Map: http://maps.google.com/maps?z=15&t=m&q=loc:' + lat + '+' + lon);
//         }
//     });
// });



    var icloud = require("find-my-iphone").findmyphone;

    icloud.apple_id = "dirkelfman@gmail.com";
    icloud.password = "@Defcon22"; 

    icloud.getDevices(function(error, devices) {
        var device;

        if (error) {
            throw error;
        }
        //pick a device with location and findMyPhone enabled
        devices.forEach(function(d) {
            //console.log( d.name, !!d.location , d.lostModeCapable );
             console.log( d);



            if (device == undefined && d.location && d.lostModeCapable) {
                
            }
        });

      
    });