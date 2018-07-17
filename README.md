# Nodejs-Master-Homework 2
## Overview
This project is the Homework 2 for [Pirple](https://pirple.thinkific.com) Node.js Master Class. If yyou are looking to learn pure Node.js development I recommend this course as it's the best I found.

It has everything it's requested and a little bit more.

This API is strutured as an MVC, without the V since it has no views.

For more detailed information and further documentation follow the links bellow:

* [Controllers](https://github.com/joaorsilva/nodej-marters-hw-2/tree/master/lib/controllers) - Receive requests.
* [Services](https://github.com/joaorsilva/nodej-marters-hw-2/tree/master/lib/services) - Implements each service logic.
* [Models](https://github.com/joaorsilva/nodej-marters-hw-2/tree/master/lib/models) - Data models.
* [Apis](https://github.com/joaorsilva/nodej-marters-hw-2/tree/master/lib/apis) - External APIs (stripe & mailgun)
* [Drivers](https://github.com/joaorsilva/nodej-marters-hw-2/tree/master/lib/drivers) - File data driver.
* [Common files](https://github.com/joaorsilva/nodej-marters-hw-2/tree/master/lib) - Server and router.
* [Sample data](https://github.com/joaorsilva/nodej-marters-hw-2/tree/master/sample-data) - Sample product records and root user record.
* [Config](https://github.com/joaorsilva/nodej-marters-hw-2/tree/master/config) - Configuration settings.

## Login requirements
All API endpoints require the user to login (create token) into the application with the exception for the following endpoints:

	* GET /products /// Lists all products in the database.
	* POST /users /// Creates a new user (client).
	* POST /tokens /// Create a new token for the user (login).

## Walthrough process
1. Create a new user trough a call to POST / users.
2. Create a token for that user through a call to POST /tokens.
3. List the available products through a call to GET /products.
4. Insert one or more products in your user's shopping basket through one or more calls to PUT /basket.
5. Create an order through a call to POST /orders.

## The root user
This code cames with some sample data. If you use it (I advise, it's better experience) it will contain a ```root``` user that's the first ```admin``` type user.

The root user login credentials are:
```
{
	"username": "root@pnm.com",
	"password": "123456"
}
```

Reffer to the [Sample data](https://github.com/joaorsilva/nodej-marters-hw-2/tree/master/sample-data) link for more details.

## Postman
In the route of this project you will find a postman file with a collection and environment to test all the API calls in this project.

## Licence
This is just an academic work for test porposes. You may use it anyway you wish.
Licensed under [MIT Licence](https://opensource.org/licenses/MIT).
