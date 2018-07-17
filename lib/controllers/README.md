# Controllers (API Endpoints)
There are several api endpoints in this api, some of them accept more methods than others according to the needs.

The project available endpoint are:

[/user](https://github.com/joaorsilva/nodej-marters-hw-2/tree/master/lib/controllers#users-endpoint)
[/tokens](https://github.com/joaorsilva/nodej-marters-hw-2/tree/master/lib/controllers#tokens-endpoint)
[/basket](https://github.com/joaorsilva/nodej-marters-hw-2/tree/master/lib/controllers#basket-endpoint)
[/orders](https://github.com/joaorsilva/nodej-marters-hw-2/tree/master/lib/controllers#orders-endpoint)
[/products](https://github.com/joaorsilva/nodej-marters-hw-2/tree/master/lib/controllers#products-endpoint)

## /users Endpoint
The users endpoint is responsible for all users data.
### Methods ###
* GET
* POST
* PUT
* DELETE

### GET method
Return the logged user's data.

#### Parameters
* **Header: token:** [token returned by the POST /tokens endpoint]
* **Query string:** None
* **JSON Body:** None
#### Example

```bash
	 curl -X GET \
	 localhost:3000/users \
	 --header "token:[token]" 
```

#### Successfull Return
``` 
200
{
    "id":"test@pnm.com",
    "type":"client",
    "name":"User test",
    "email":"test@pnm.com",
    "password":"",
    "address":
    "Any Street, any",
    "orders":[],
    "basket":[]
}
``` 

### POST method
Creates a new user. This method can be accessed without authentication and allows for the creation of new users. There are 2 types of users, the ```client``` and the ```admin``` type users.

In order to create an admin type user, the creator must also be an admin user and be logged into the API.

The difference between the 2 types is that the ```admin``` type users can manage product records and the ```client``` type users canot.

#### Parameters
* **Header: token:** [token returned by the POST /tokens endpoint] (optional for creating ```client``` type users)
* **Query string:** None
* **JSON Body:** {name,type,email,password,address}
####Example
```bash 
	curl --request POST \
	localhost:3000/users \
	--header "Content-Type: application/json" \
	--data '{"name": "Test user","type":"client", "email":"test@pnm.com","password":"123456", "address": "12 abraham street, New York, NY"}' 
```

#### Successfull Return
``` 
201
{
    "id": "test@pnm.com"
}
```

### PUT method
Updates the logged user data. This method is used to update the user's data. The only data than can't be updated is the email as it also serves as the user id. 

#### Parameters
* **Header: token:** [token returned by the POST /tokens endpoint]
* **Query string:** None
* **JSON Body:** {name,type,email (optional),password,address}
#### Example
```bash
	curl 
	--request PUT \
	localhost:3000/users \
	--header "Content-Type: application/json" \
	--header "token:[token]" \
	--data '{"name": "Test user","type":"client", "email":"test@pnm.com","password":"123456", "address": "12 abraham street, New York, NY"}' 
``` 

#### Successfull Return
``` 
200
``` 

### DELETE method
Deletes the logged user. This method is used to delete a user account. Only the logged user can delete it's account.

#### Parameters

* **Header: token:** [token returned by the POST /tokens endpoint]
* **Query string:** None
* **JSON Body:** None

#### Example
```bash 
	curl \
	--request DELETE  \
	localhost:3000/users \
	--header "Content-Type: application/json" \
	--header "token:[token]" 
```

#### Successfull Return
``` 
200
``` 
 
## /tokens Endpoint
The token lasts for 1 hour if no operations are performed. If other token operations are performed then the token is renewed for 1 more hour.

### Methods
* POST
* DELETE

### POST method
Creates a new token for the session. Validates the username (email) and the user's password. This is also called a login action.

#### Parameters
* **Header: token:** None
* **Query string:** None
* **JSON Body:** {username,password}
#### Example
```bash
	curl \
	 localhost:3000/tokens \
	--request POST \
	--header "Content-Type: application/json"  \
	--data '{"username":"test@pnm.com","password":"123456"}' 
```

#### Successfull Return
``` 
201
{
    "id": "[token]"
}
```

### DELETE method
Deletes an existing token. This is also called a logout action.

#### Parameters
* **Header: token:** [token returned by the POST /tokens endpoint]
* **Query string:** None
* **JSON Body:** None
#### Example
```bash
	curl \
	--request DELETE \
	localhost:3000/tokens \
	--header "Content-Type: application/json" \
	--header "token:[token]"
```

#### Successfull Return
``` 
200
```


## /basket Endpoint
The basket enpoint encapsulates all the basket functionality. Each user has only one basket that's attached to it's user record.

Note that all the basket functionality is attached to the user record through the array type field ```basket```.

At this endpoint we don't have a POST method, instead we use the PUT method for both insert and update (check the PUT methd bellow for more information).

### Methods
* GET
* PUT
* DELETE

### GET method
This method should return an array with all the products in the basket or an empty array if the basket is empty.
#### Parameters
* **Header: token:** [token returned by the POST /tokens endpoint]
* **Query string:** None
* **JSON Body:** None

#### Example
```bash
	curl \
	--request GET \
	localhost:3000/basket \
	--header "Content-Type: application/json" \
	--header "token:[token]"
```

#### Successfull Return (sample data)
``` 
200
[
{
	"id": "88e77402932e951361e080287c5ad131",
	"name": "MEATBALL PARMIGIANA 12''",
	"price": 13.5,
	"quantity": 3	
]
```

### PUT Method
This method insertes or updates a product in the basket. If the product isn't in the basket, the product and it's quantity is added to it, but if the product is already in the basket then just the product quantity is updated. 

#### Parameters
* **Header: token:** [token returned by the POST /tokens endpoint]
* **Query string:** None
* **JSON Body:** {id,quantity}

#### Example
```bash
	curl \
	--request PUT \
	localhost:3000/basket  \
	--header "Content-Type: application/json" \
	--header "token:c13d995d8c4fc0b4a6d5e8cbc508db39" \
	--data '{"id": "88e77402932e951361e080287c5ad131","quantity": 3}'
```
#### Successfull Return
``` 
200
``` 

### DELETE Method
This method deletes a product from the basket.

#### Parameters
* **Header: token:** [token returned by the POST /tokens endpoint]
* **Query string:** id [id of the product to be removed]
* **JSON Body:** None
#### Example
```bash
	curl \
	--request DELETE \
	localhost:3000/basket?id=88e77402932e1361e080287c5ad131  \
	--header "token:c13d995d8c4fc0b4a6d5e8cbc508db39"
```
#### Successfull Return
``` 
200
``` 

## /orders Endpoint
The orders endpoint is reponsible to manage every aspect of an order.

Once an order is created it can no longer be deleted from the system nor updated by the users (any type), as it wold consist in a fraud. 

Later on it could be upgraded to return the payment to the user if the order has been canceled or deleted.

### Methods
* GET
* POST

### GET Method
The get method has 2 usage options. The first without parameters that return all orders of a user, the second with an id parameter that return a sing user order identified by the ```id``` parameter.

If the user is of type ```admin``` and no order ```id``` parameter is specified then all system orders are returned.

#### Parameters
* **Header: token:** [token returned by the POST /tokens endpoint]
* **Query string:** id [id of the order to be displayed or nothing for all user orders]
* **JSON Body:** None

#### Example (Single order)
```bash
	curl \
	 --request GET \
	 localhost:3000/orders?id=15202597b7202f93ad156113c0e6aaf2 \
	 --header "Content-Type: application/json" \
	 --header "token:a97a39c1e59112b61864f276373cc134"
``` 

#### Successfull Return
```
200 
{
	"id": "15202597b7202f93ad156113c0e6aaf2",
	"name":"User test", "email":"test@pnm.com",
	"date":1531772691613,
	"address":"Any Street, any",
	"products": [
	{
		"id":
		"88e77402932e951361e080287c5ad131",
		"name": "MEATBALL PARMIGIANA 12''",
		"price":13.5,"quantity":3
	}
	],
	"taxes": 3.7665000000000006,
	"delivery": 15
}
```

#### Example (All user orders)
```bash
	curl \
	 --request GET \
	 localhost:3000/orders \
	 --header "Content-Type: application/json" \
	 --header "token:a97a39c1e59112b61864f276373cc134"
``` 

#### Successfull Return
``` 
200
[
	{
	"id": "15202597b7202f93ad156113c0e6aaf2",
	"name":"User test", "email":"test@pnm.com",
	"date":1531772691613,
	"address":"Any Street, any",
	"products": [
		{
			"id": "88e77402932e951361e080287c5ad131",
			"name": "MEATBALL PARMIGIANA 12''",
			"price":13.5,"quantity":3
		}
	],
	"taxes": 3.7665000000000006,
	"delivery": 15
	},
	{
	"id": "cca4682af4dd4aba9bf094c2fbe0caae",
	"name":"User test", "email":"test@pnm.com",
	"date":1531773242497,
	"address":"Any Street, any",
	"products": [
		{
			"id": "88e77402932e951361e080287c5ad131",
			"name": "MEATBALL PARMIGIANA 12''",
			"price":13.5,"quantity":3
		}
	],
	"taxes": 3.7665000000000006,
	"delivery": 15
	}
]
``` 

### POST Method
The orders endpoint post methodcreates a new order based on the products and quantities in the basket.
#### Parameters
* **Header: token:** [token returned by the POST /tokens endpoint]
* **Query string:** None
* **JSON Body:** {paymentToken}

#### Example (All user orders)
```bash
	curl \
	 --request POST \
	 localhost:3000/orders \
	 --header "Content-Type: application/json" \
	 --header "token:a97a39c1e59112b61864f276373cc134",
	 --data '{"paymentToken": "tok_visa"}'
``` 

#### Successfull Return
``` 
201
{
    "id":"04dc9d5a0fa7e8cd9d930c9a976814e4"
}
```

## /products Endpoint
The products endpoint is responsible to manage everything regarding products in our database. This was not part of the project (as this could be static) but I though it could give intereting results.

To be noticed, only ```admin``` type users can administer products, but all users can view them.

### Methods
* GET
* POST
* PUT
* DELETE

### GET Method
The get method runturns one or more products. If the parameter ```id``` is set, then the correspondent product is displayed, if not, all the products in the database are displayed.

#### Parameters
* **Header: token:** [token returned by the POST /tokens endpoint]
* **Query string:** id [id of the product to be displayed or nothing for all user products]
* **JSON Body:** None

#### Example (Single product)
```bash
	curl \
	 --request GET \
	 localhost:3000/products?id=3000/products?id=30bb7e6e28a95e52dcb74707eca24765 \
	 --header "Content-Type: application/json"
``` 
#### Successfull Return
```
200
{
	"id": "30bb7e6e28a95e52dcb74707eca24765",
	"name": "TURKEY AND PROVOLONE 6''",
	"description": "With shaved lettuce, sliced onion, and tomato, oil and vinegar",
	"price":8.95
}
```

#### Example (All products)
```bash
	curl \
	--request GET \
	localhost:3000/products \
	--header "Content-Type: application/json"
```

#### Successfull Return
```
200
[
	{
		"id": "2179081909177e224da70523d6664496",
		"name": "PHILLY CHEESESTEAK 12''",
		"description": "Shaved top sirloin with onion, bell pepper, and mushroom, sauteed on the flat top, topped with melted white American cheese",
		"price": 13.95
	},
	{
		"id":"2292da3af8f577b8d69be5a7cb3c4cd1",
		"name":"BUFFALO CHICKEN 6''",
		"description": "Boneless breast of chicken, breaded in-house, fried and dipped in Buffalo wing sauce, with romaine lettuce and our housemade blue cheese dressing",
		"price":7.95
	},
	...
]
```

### POST Method
The post method creates a new product in the database.

#### Parameters
* **Header: token:** [token returned by the POST /tokens endpoint (only valid for ```admin``` type users)]
* **Query string:** None
* **JSON Body:** {"name","description","price"}

#### Example
```
	curl 
	--request POST \
	localhost:3000/products \
	--header "Content-Type: application/json" \
	--header "token:a4d9c61142dbd6bf45fdddd2f21e4acc" \
	--data '{"name": "Test product","description": "This is the description o our test product","price":5.00}'
```
#### Successfull Return
```
201
{
	"id":"04dc9d5a0fa7e8cd9d930c9a976814e4"
}
```

### PUT Method
The put method updates a product that exists in the database.

#### Parameters
* **Header: token:** [token returned by the POST /tokens endpoint (only valid for ```admin``` type users)]
* **Query string:** id [id of the prodcut to be updated]
* **JSON Body:** {"id","name","description","price"}

#### Example
```
	curl 
	--request PUT \
	localhost:3000/products?id=04dc9d5a0fa7e8cd9d930c9a976814e4" \
	--header "Content-Type: application/json" \
	--header "token:a4d9c61142dbd6bf45fdddd2f21e4acc" \
	--data '{"name": "Test product - updated","description": "This is the description o our test product","price":5.01}'
```
#### Successfull Return
```
200
```

### DELETE Method
The delete method deletes a product that exists in the database.

#### Parameters
* **Header: token:** [token returned by the POST /tokens endpoint (only valid for ```admin``` type users)]
* **Query string:** id [id of the prodcut to be deleted]
* **JSON Body:** {"id","name","description","price"}

#### Example
```
	curl 
	--request PUT \
	localhost:3000/products?id=04dc9d5a0fa7e8cd9d930c9a976814e4" \
	--header "Content-Type: application/json" \
	--header "token:a4d9c61142dbd6bf45fdddd2f21e4acc"
```
#### Successfull Return
```
200
```








