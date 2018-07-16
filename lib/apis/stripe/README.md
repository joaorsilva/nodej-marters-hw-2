#Stripe
This is a service API designed to validate and manage payments and a lot more.

In this project we just use a minimalist set of Stripe features, but there is a lot more to it than what we use here.

If you are interested you can check it at their website [Stripe](https://www.stripe.com/).

##Configuration
You must configure the service keys in the project config file.
They are like this:
```json
{
	"[environment]": {
		"apis": {
			"stripe": {
				"priveKey": "[stripe supplied key]",
				"pubKey": "[stripe supplied key]"
			}
		}
	}
}
```

## Functions
This implementation has only one function.

###send
The validatePayment function connects with the Stripe service, using the test credentials supplyed by them. After that it send the paymet data a seen below and waits for a response.

#### Parameters
Parameter      | Type     | Description
-------------- | -------- | ------------
paymentDetails | object   | Email address to send the message to.
callback       | function | Callback function. Receives 2 parameters ```err``` and ```data```. 

#### Example call
```javascript
    let cost = 5.35; // Five dollars and 35 cents.
    let paymentData = {
        "amount": Math.round((cost)*100),   // Multiply by 100, so the number is an integer.
        "currency": "usd",                  // Sets the currency to USD.
        "description": "test",              // Payment desciption.
        "source": "tok_visa"                // User cart tokenized ('tok_visa' is a valid stripe test token).
    };

stripe.validatePayment(paymentDetails, function(err,data) {
    if(!err && data) {
        console.log('Payment valid.');
        callback(false,data);
    } else {
        console.log('Payment invalid.',err.code,err.message);
        callback(err);
    }
});
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