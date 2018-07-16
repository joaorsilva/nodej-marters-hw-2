#Mailgun
This is a service API designed to send emails and manage those too. It's a full featured and secure way to do so.

In this project we just use a minimalist set of Mailgun features, but there is a lot more to it than what we use here.

If you are interested you can check it at their website [Mailgun](https://www.mailgun.com/).

##Configuration
You must configure the service settings in the project config file.
They are like this:
```json
{
	"[environment]": {
		"apis": {
			"mailgun": {
				"account": "[mailgun supplied account]",
				"auth": "[mailgun supplied user or key]"
			}
		}
	}
}
```


## Functions
This implementation has only one function.

###send
The send function connects with the Mailgun service, using the test credentials supplyed by the service, send an email and waits for the confimation or error message.

#### Parameters
Parameter | Type     | Description
--------- | -------- | ------------
to        | string   | Email address to send the message to.
subject   | string   | Email subject.
message   | string   | Email content in HTML format.
callback  | function | Callback function. Receives 2 parameters ```err``` and ```data```. 

#### Example call
```javascript
mailgun.send(
    'johndoe@example.com',
    'Your subject',
    '<b>Hi John<b/>,<br>This is the content of your message.',
    function(err,data) {
    	if(!err) {
    		console.log('Message sent successfuly');
    		callback(false,data); //In case this function is called from another callback.
    	} else {
    		console.log('Mesage error:',err.code,err.message);
    		callback(err); //In case this function is called from another callback.
    	}
    }
);
```

#### Return messages
##### Success:
* Callback parameter ```err: false```
* Callback parameter ```data: ```as bellow.
```json
{
	"code": 200
}
```
or
```json
{
	"code": 201
}
```
##### Failure (callback parameter err):
* Callback parameter ```err: ``` as bellow
* Callback parameter ```data: null ```.
```json
{
	"code": [any code returned by the service],
	"message" [any message returned by the service]
}
```
