# Controllers (API Endpoints)
There are several api endpoints in this api, some of them accept more methods than others according to the needs.

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
* **Header: token:** [token returned by the create token endpoint]
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
* **Header: token:** [token returned by the create token endpoint] (optional for creating ```client``` type users)
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
* **Header: token:** [token returned by the create token endpoint]
* **Query string:** None
* **JSON Body:** {name,type,email (optional),password,address}
####Example
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

* **Header: token:** [token returned by the create token endpoint]
* **Query string:** None
* **JSON Body:** None

####Example
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

##### Parameters
* **Header: token:** [token returned by the create token endpoint]
* **Query string:** None
* **JSON Body:** None

```bash
	curl 
	--request DELETE 
	localhost:3000/tokens 
	--header "Content-Type: application/json" 
	--header "token:[token]"
```

##### Successfull Return
``` 
200
```

