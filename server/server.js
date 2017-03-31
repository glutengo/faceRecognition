// IMPORTS
var express = require('express');
var app = express();
var fs = require('fs');
var http = require('http');
var https = require('https');
var mongoose = require('mongoose');
var jwt = require('jsonwebtoken');
var config = require('./config');
var bodyParser = require('body-parser');
var User = require('./user');

// connect database
mongoose.connect(config.DATABASE);

// GLOBAL MIDDLEWARE
app.use(express.static('public'));
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(function(req, res, next){
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With, x-access-token');

    // intercept OPTIONS method
    if ('OPTIONS' == req.method) {
      res.sendStatus(200);
    }
    else {
      next();
    }
});
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// MS API FUNCTIONS
/**
 * Call MS face detection
 * 
 * @param {*} imageData image as dataURL
 * @param {*} onSuccess success callback
 * @param {*} onError error callback
 */
function callMsDetect(imageData, onSuccess, onError) {
    var msDetectOptions = {
        host: config.FACE_API_HOST,
        method: 'POST',
        port: 443,
        path: config.FACE_API_PATH_DETECT,
        headers: {
            'Content-Type': 'application/octet-stream',
            'Content-Length': Buffer.byteLength(imageData),
            'Ocp-Apim-Subscription-Key': config.FACE_API_KEY
        }
    };

    var msDetectReq = https.request(msDetectOptions, function(msDetectResponse) {
        msDetectResponse.setEncoding('utf8');
        msDetectResponse.on('data', function(msDetectData){
            onSuccess(JSON.parse(msDetectData));
        });
    });

    msDetectReq.on('error', onError);
    msDetectReq.write(imageData);
    msDetectReq.end();
}

/**
 * 
 * @param {*} faceId1 face1 to compare
 * @param {*} faceId2 face2 to compare
 * @param {*} onSuccess success callback
 * @param {*} onError error callback
 */
function callMsCompare(faceId1, faceId2, onSuccess, onError) {
    var msVerifyOptions = {
        host: config.FACE_API_HOST,
        method: 'POST',
        port: 443,
        path: config.FACE_API_PATH_VERIFY,
        headers: {
            'Ocp-Apim-Subscription-Key': config.FACE_API_KEY
        }
    }

    var msVerifyReq = https.request(msVerifyOptions, function(msVerifyResponse) {
        msVerifyResponse.setEncoding('utf8');
        msVerifyResponse.on('data', function(msVerifyData) {
            onSuccess(JSON.parse(msVerifyData));
        });
    })

    msVerifyReq.on('error', onError);
    msVerifyReq.write(JSON.stringify({faceId1: faceId1, faceId2: faceId2}));
    msVerifyReq.end();
}

// PUBLIC API ENDPOINTS

// login endpoint
app.post('/login', function(req, res){
    // possible login methods: image or password
    var imageData, 
        password = req.body.password;

    // if neither password nor image is sent, send 400;    
    if(!req.body.password && !req.body.image) {
        res.statusCode = 400;
        res.json({'message': 'Either image or password is required'});
        return;
    }    

    // select user from database    
    User.findOne({
		username: req.body.username
	}).select('user username faceId password').exec(function(err, user){
        if(err || !user){
            res.statusCode = 403;
            res.json({message:'user not found'});
            return;
        }
        // password login
        if(password) {

            // check password
            var validPassword = user.comparePassword(password);
            if(!validPassword){
                // if password does not match, send 403
                res.statusCode = 403;
                res.json({message: 'Authentication failed. Wrong username / password.'});
            }
            else {
                // if user is found and password is right, create a token
                var token = jwt.sign({
                    username: user.username
                }, config.SECRET);

                // send the token
                res.json({
                    message: 'Enjoy your token!',
                    token:token
                });
            } 
        }
        else {
            // get image as binary data, so it can be sent to MS
            if(req.body.image) {
                imageData = Buffer.from(req.body.image.split(",")[1], 'base64');
            }
            // image login
            if (imageData) {
                // detect faces on the login image
                callMsDetect(imageData, 
                    function(msDetectData) {
                        // check for the first face
                        // TODO: send error when more than one face is recognized and let the user pick one
                        if(msDetectData[0]){
                            // compare the recognized face to the saved one  
                            callMsCompare(user.faceId, msDetectData[0].faceId, 
                                function(msCompareData){
                                    if(msCompareData.isIdentical && msCompareData.confidence >= config.FACE_API_CONFIDENCE_TRESHOLD){
                                        //if faces match, create a token
                                        var token = jwt.sign({
                                            username: user.username
                                        }, config.SECRET);

                                        //return the information including token as JSON
                                        res.json({
                                            message: 'Login succesful',
                                            token:token
                                        });
                                    }
                                    else {
                                        // if faces do not match, send 403
                                        res.statusCode = 403;
                                        res.json({'message': 'image login failed - face could not be verified'});
                                    }
                                },
                                function(error){
                                    // if an error occurs during the compare, send 500
                                    res.statusCode = 500;
                                    res.json({'message': 'image login failed - face compare failed'});
                                });
                        }
                        else {
                            // if no face can be recognized on the login image, send 400
                            res.statusCode = 400;
                            res.json({'message': 'image login failed - no face recognized'});
                        }
                    },
                    function(error) {
                        // if an error occurs during the detection, send 500
                        res.statusCode = 500;
                        res.json({'message':'image login failed - face detection failed'});
                    });
            }
            else {
                // if neither password nor valid image data is given, send error
                res.statusCode = 400;
                res.json({message: 'Either password or image is required'});
            }
        }
    })
});

// register endpoint
app.post('/register', function(req, res){

    // if username or password is missing, send 400
    if(!req.body.user.username || !req.body.user.password) {
        res.statusCode = 400;
        res.json({'message': 'username and password are required'});
        return;
    }

    // create new user object
    var user = new User();
    user.username = req.body.user.username;
    user.password = req.body.user.password;

    // if image is given
    if(req.body.image) {
        // call face detection
        callMsDetect(Buffer.from(req.body.image.split(",")[1], 'base64'),
            function(msDetectData) {
                var faceMessage = '';
                // face will only be saved if only one face is recognized
                // if no face or more than one face is recognized, the user will be informed
                // the account will be created without any faceId anyways
                if(msDetectData.length === 1){
                    user.faceId = msDetectData[0].faceId;
                }
                else if(!msDetectData.length){
                    faceMessage = 'No face was recognized.'
                }
                else {
                    faceMessage = 'More than one face was recognized.'
                }
                user.save(function(error){
                    if(error) {
                        // if an error occurs during save, send 500
                        res.statusCode = 500;
                        res.json({'message':'error during save'});
                        return;
                    }

                    // login user
                    var token = jwt.sign({
                        username: user.username
                    }, config.SECRET);

                    res.json({
                        message: 'User was created. ' + faceMessage,
                        token: token
                    });
                });
            },
            function(error) {
                // if an error occurs during face detection, inform user 
                // the account will be created without any faceId anyways
                user.save(function(error){
                    var faceMessage = 'Face recognition failed';
                    if(error) {
                        // if an error occurs during save, send 500
                        res.statusCode = 500;
                        res.json({message:JSON.stringify(error)});
                        return;
                    }

                    // login user
                    var token = jwt.sign({
                        username: user.username
                    }, config.SECRET);

                    res.json({
                        message: 'User was created. ' + faceMessage,
                        token: token
                    });
                });
            });
    }

    // if no image was sent, just create the account
    else { 
        user.save(function(error){
            if(error) {
                // if an error occurs during save, send 500
                res.statusCode = 500;
                res.json({message:'Error during save'});
                return;
            }
            var token = jwt.sign({username: user.username}, config.SECRET);
            res.json({message:'user created',token: token});
        }); 
    }
  
});

// PRIVATE API ENDPOINTS

// interceptor for private endpoints
app.use(function(req, res, next){
	//check header or url parameters or post parameters for token
	var token = req.body.token || req.query['token'] || req.headers['x-access-token'];

	//decode token
	if(token){

		//verifiy secret
		jwt.verify(token, config.SECRET, function(err, decoded){
			if(err){
				return res.status(401).send({
					 message: 'Failed to authenticate token.'
				});
			} else{
				//if everything is good, save to request for use in other reoutes
				req.user = decoded;
				next();
			}
		})
	} else {
		//if there is no token
		//return an HTTP response of 403 (access forbidden ) and an error message
		return res.status(403).send({
			message: 'No token provided.'
		});
	}

});

// home endpoint: just some test stuff to check that private APIs actually work
app.get('/home', function(req, res) {
    res.json({'message': 'As a logged in user, you are allowed to see this content. On this page, you can change your securtity information. You can update your password and your login image.'});
});

// update password endpoint: update users password
app.post('/updatePassword', function(req, res) {

    if(!req.body.oldPassword || !req.body.newPassword) {
        res.statusCode = 400;
        res.json({message: 'old password and new password are required'});
        return;
    }

    // get user from token
    User.findOne({
		username: req.user.username
	}).select('user username faceId password').exec(function(err, user){
        if(err || !user){
            // if no user is found, send 400
            res.statusCode = 400;
            res.json({message:'user not found'});
        }
        // if user is found, check for password
        var validPassword = user.comparePassword(req.body.oldPassword);
        if(validPassword){
            // if password is valid, set new password and save
            user.password = req.body.newPassword;
            user.save(function(error){
                if(error) {
                    // if an error ouccurs during save, send 500
                    res.statusCode = 500;
                    res.json({'message':'error during save'});
                }
                res.json({message:'Password changed'});
            });
        }
        else {
            //if password is invalid, send 403
            res.statusCode = 403;
            res.json({message: 'Authentication failed. Wrong old password.'});
        }
    });
});

// udpate image endpoint: update user image
app.post('/updateImage', function(req, res) {

    if(!req.body.image) {
        // if no image was sent, send 400
        res.statusCode = 400;
        res.json({message: 'image is required'});
        return;
    }

    // get user from token
    User.findOne({
		username: req.user.username
	}).select('user username faceId').exec(function(error, user){
        if(error || !user){
            // if no user is found, send 400
            res.statusCode = 400;
            res.json({message:'user not found'});
            return;
        }
        // call face detection with new face
        callMsDetect(Buffer.from(req.body.image.split(",")[1], 'base64'),
            function(msDetectData) {
                if(msDetectData.length === 1){
                    user.faceId = msDetectData[0].faceId;
                    user.save(function(error){
                        if(error) {
                            // if error occurs during save, send 500
                            res.statusCode = 500;
                            res.json({'message':'error during save'});
                            return;
                        }

                        res.json({
                            message: 'Image was updated.',
                        });
                    });
                }
                // if no face or more than one face was recognized, send 400
                // TODO: give user the opportunity to pick one of them in frontend
                else if(!msDetectData.length){
                    res.statusCode = 400;
                    res.json({message: 'No face was recognized.'})
                }
                else {
                    res.statusCode = 400;
                    res.json({message: 'More than one face was recognized.'})
                }
            },
            function(error) {
                // if an error occurs during face detection, send 500
                res.statusCode = 500;
                res.json({message: 'image update failed - face recognition error'});
            });
            
    });
});

// start server
var server = app.listen(8081, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log("Example app listening at http://%s:%s", host, port);
})
