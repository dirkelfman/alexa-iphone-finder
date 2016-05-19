/**
 * App ID for the skill
 */
var APP_ID = null; //replace with 'amzn1.echo-sdk-ams.app.[your-unique-value-here]';

//ARN - arn:aws:lambda:us-east-1:663361677957:function:Kodi_Skill

/**
 * The AlexaSkill prototype and helper functions
 */
var AlexaSkill = require('./AlexaSkill');
var FindMyIphone = require("find-my-iphone")
var soundex = require('soundex')

var myLatitude = 30.541152;
var myLongitude = -97.740255;

var appConfig = null;
try {
    appConfig = require('./config');
}
catch (e) {
    throw new Error('needs ./config.json in the format of { "username": "foo@boo.com", "password": "password1" }');
}





/**
     * FindIphoneSkill is a child of AlexaSkill.
     * To read more about inheritance in JavaScript, see the link below.
     *
     * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Introduction_to_Object-Oriented_JavaScript#Inheritance
     */
var FindIphoneSkill = function () {
    AlexaSkill.call(this, APP_ID);
};

// Extend AlexaSkill
FindIphoneSkill.prototype = Object.create(AlexaSkill.prototype);
FindIphoneSkill.prototype.constructor = FindIphoneSkill;

/**
 * Overriden to show that a subclass can override this function to initialize session state.
 */
FindIphoneSkill.prototype.eventHandlers.onSessionStarted = function (sessionStartedRequest, session) {
    console.log("onSessionStarted requestId: " + sessionStartedRequest.requestId + ", sessionId: " + session.sessionId);

    // Any session init logic would go here.
};

/**
 * If the user launches without specifying an intent, route to the correct function.
 */
FindIphoneSkill.prototype.eventHandlers.onLaunch = function (launchRequest, session, response) {
    console.log("FindIphoneSkill onLaunch requestId: " + launchRequest.requestId + ", sessionId: " + session.sessionId);
    
    var speechOutput = " you can ask to beep someone or how far away is.";
    
    
    response.ask(speechOutput);
};

/**
 * Overriden to show that a subclass can override this function to teardown session state.
 */
FindIphoneSkill.prototype.eventHandlers.onSessionEnded = function (sessionEndedRequest, session) {
    console.log("onSessionEnded requestId: " + sessionEndedRequest.requestId + ", sessionId: " + session.sessionId);

    //Any session cleanup logic would go here.
};


FindIphoneSkill.prototype.intentHandlers = {
    ListIntent: function (intent, session, response) {
        handleListIntent(response);
    },
    
    BeepIntent: function (intent, session, response) {
        handleBeepIntent(intent , response);
    },
    HowFarIntent: function (intent, session, response) {
        handleHowFarIntent(intent , response);
    },
   
    
    HelpIntent: function (intent, session, response) {
        var speechOutput = " you can ask to play  or pause or search.  you stupid idiot.";
        
        
        response.ask(speechOutput);
    }
};

function getValueFromIntentOrSession(key, intent, session) {
    var ret = intent.slots[key] && intent.slots[key].value;
    return ret || session[key];
}

function getIphoneFinder(){
    var icloud = FindMyIphone.findmyphone;
    icloud.apple_id = appConfig.username;
    icloud.password = appConfig.password;
    return icloud;
}

function handleListIntent(response) {
    
    var iphoneFinder = getIphoneFinder();
    iphoneFinder.getDevices( function ( error, devices ){
        if ( error ){
            response.tellWithCard( 'bad stuff happened.  View card for info ', 'iphone finder error', error.toString() );
            return;
        }

        var devideNames = devices.filter( function(d){ return d && d.location && d.lostModeCapable }).map ( function ( d){ return d.name;});

        if ( devideNames.length )
        {
            response.tell ('the following phones are turned on.  ' + devideNames.join ( ' and ') );
        }else{
            response.tell ('no devices found' );
        }
        
    });
}

function isMatch ( device, personName, deviceType ){
    personName =  (personName || '').toLowerCase();
    deviceType =  (deviceType|| '').toLowerCase();

    if ( personName.endsWith( 's')){
        personName = personName.substring( 1, personName.length -1);
    }

    var personMatch = !personName  || 
        soundex( device.name ) == soundex( personName)||
        ( device.name.toLowerCase().indexOf( personName ) > -1 ) ||
        soundex( device.deviceDisplayName ) == soundex( personName)||
        ( device.deviceDisplayName.toLowerCase().indexOf( personName ) > -1  );
    var deviceMatch = !deviceType ||  
        soundex( device.modelDisplayName ) == soundex( deviceType)||
         soundex( device.deviceDisplayName ) == soundex( deviceType)||
        ( device.modelDisplayName.toLowerCase().indexOf( deviceType ) > -1 ) ||
        ( device.deviceDisplayName.toLowerCase().indexOf( deviceType ) > -1  );

   // console.log( device.name , personMatch && deviceMatch && device.lostModeCapable );
     return personMatch && deviceMatch && device.location && device.lostModeCapable 
}

function handleBeepIntent( intent, response){
  var personName = intent.slots.PersonName;
  var deviceType= intent.slots.DeviceType;
    if (!personName || !personName.value) {
        response.ask('what device', 'what device name  dammit!!');
        return;
    }

     var iphoneFinder = getIphoneFinder();
    iphoneFinder.getDevices( function ( error, devices ){
        if ( error ){
            response.tellWithCard( 'bad stuff happened.  View card for info ', 'iphone finder error', error.toString() );
            return;
        }


        var devices = devices.filter( function(d){ 
            var res = isMatch( d, personName.value, deviceType.value); 
            console.log( d.name, res );
            return  res;
        });


        if ( devices.length ==0  )
        {
            response.tell ('no devices found' );
            return ;
        }

        iphoneFinder.alertDevice(devices[0].id, function(err) {
              response.tell ('sending beep beep to ' + devices[0].name );
              return;
        });
        
    });

}

function handleHowFarIntent( intent, response ){
     if (!personName || !personName.value) {
        response.ask('what device', 'what device name  dammit!!');
        return;
    }

     var iphoneFinder = getIphoneFinder();
     iphoneFinder.getDevices( function ( error, devices ){
        if ( error ){
            response.tellWithCard( 'bad stuff happened.  View card for info ', 'iphone finder error', error.toString() );
            return;
        }


       var devices = devices.filter( function(d){ 
            return isMatch( d, personName.value, deviceType.value); 
        });

        if ( devices.length ==0  )
        {
            response.tell ('no devices found' );
            return ;
        }

        iphoneFinder.getDistanceOfDevice(devices[0].id, myLatitude, myLongitude, function(err, result) {
                console.log("Distance: " + result.distance.text);
                console.log("Driving time: " + result.duration.text);
            });
        iphoneFinder.alertDevice(devices[0].id, function(err) {
              response.tell ('sending beep beep to ' + devices[0].name );
              return;
        });
        
    });
}



// Create the handler that responds to the Alexa Request.
exports.handler = function (event, context) {
    // Create an instance of the WiseGuy Skill.
    var skill = new FindIphoneSkill();
    skill.execute(event, context);
};
