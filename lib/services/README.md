# Services
The service modules are responsible to implement the functional logic layer into the project.

They provide the real project functionality, for that they use all resources available in the project to accomplish the desired tasks.

This project contains the following service classes:

* [UsersService](https://github.com/joaorsilva/nodej-marters-hw-2/tree/master/lib/services#usersservice-class)
* [TokensService](https://github.com/joaorsilva/nodej-marters-hw-2/tree/master/lib/services#tokensservice-class)
* [BasketService](https://github.com/joaorsilva/nodej-marters-hw-2/tree/master/lib/services#basketservice-class)
* [OrdersService](https://github.com/joaorsilva/nodej-marters-hw-2/tree/master/lib/services#ordersservice-class)
* [ProductsService](https://github.com/joaorsilva/nodej-marters-hw-2/tree/master/lib/services#productsservice-class)


## UsersService class
The users service encapsulates all the user's functionality.
This service has the following methods:

### Properties
Parameter | Type     | Scope   | Description
----------|----------|---------| ------------
_model    | object   | Private | UsersModel class instance.
_tokens   | object   | Private | TokensService class intance.

###  constructor (method)
Creates a new UsersService class instance, and initializes other classes this service uses.

#### Parameters
Parameter | Type     | Description
----------|----------|------------
None

#### Usage
```javascript
    const UsersService = require('./services/users');
    ...
    const obj = new UsersService();
```

#### Possible Results
A new UsersService class instance.

### read (method)
Reads the logged user data.

#### Parameters
Parameter | Type     | Description
----------|----------|------------
token | string | User's session token.
callback | function | Callback function (err,data)

#### Usage
```javascript
    const UsersService = require('./services/users');
    ...
    const obj = new UsersService();
    obj.read('6ecb457156846c95477e561afb386cf7', function(err,data) {
    	if(!err && data) {
    		console.log('User record:', data );
    		callback(false, data);
    	} else {
    		console.log('ERROR:', err);
    		callback(err);
    	}
    });
```

#### Possible Results
Code | Data | Origin |Description
------- | ------ | -------- | ------
200 | object | drivers/filedata.js | Object containing the user's data. 
404 | [none] | drivers/filedata.js | The user record was not found.
500 | [none] | drivers/filedata.js | Error reading the users directory.

### create (method)
Creates a new user.

#### Parameters
Parameter | Type     | Description
----------|----------|------------
data | object | New users data.
token | string | User's session token or ```null```.
callback | function | Callback function (err,data)

** Note: ** If you want to create a user type ```admin``` then an ```admin``` user must be logged to perform this operation. Only ```admin``` users can create other ```admin``` users.

#### Example
```javascript
    const UsersService = require('./services/users');
    ...
    const userData = {
    	"name": "New user's name",
    	"type": "client",
    	"email": "newuser@example.com",
    	"address": "New user's adddress"
    };
    
    const obj = new UsersService();
    obj.read(userData, '6ecb457156846c95477e561afb386cf7', function(err,data) {
    	if(!err && data) {
    		console.log('New users id:', data );
    		callback(false, data);
    	} else {
    		console.log('ERROR:', err);
    		callback(err);
    	}
    });
```
#### Possible Results
Code | Data | Origin |Description
------- | ------ | -------- | ------
201 | object | drivers/filedata.js | Object containing the new user's id. 
400 | [none] | this | Invalid data received.
401 | [none] | this | The user is not authorized to create that user type.
409 | [none] | this | The user already exists (duplicate resource).
500 | [none] | drivers/filedata.js | Filesystem error.

### update (method)
Updates an existing user.

#### Parameters
Parameter | Type     | Description
----------|----------|------------
data | object | New users data.
token | string | User's session token.
callback | function | Callback function (err,data)

** Note: ** User's can only update their own user records. The email can't be update as it is used as user's id.

#### Example
```javascript
    const UsersService = require('./services/users');
    ...
    const userData = {
    	"name": "New user's name",
    	"type": "client",
    	"email": "newuser@example.com",
    	"address": "New user's adddress"
    };
    
    const obj = new UsersService();
    obj.update(userData, '6ecb457156846c95477e561afb386cf7', function(err,data) {
    	if(!err && data) {
    		console.log('result:', data );
    		callback(false, data);
    	} else {
    		console.log('ERROR:', err);
    		callback(err);
    	}
    });
```

#### Possible Results
Code | Data | Origin |Description
------- | ------ | -------- | ------
200 | null | drivers/filedata.js |  
400 | [none] | this | Invalid data received.
401 | [none] | this | The user is not authorized to update that user.
404 | [none] | drivers/filedata.js | User not found.
500 | [none] | drivers/filedata.js | Filesystem error.

### delete (method)
Updates an existing user.

#### Parameters
Parameter | Type     | Description
----------|----------|------------
token | string | User's session token.
callback | function | Callback function (err,data)

** Note: ** User's can only delete their own user records.

#### Example
```javascript
    const UsersService = require('./services/users');
    ...
    const userData = {
    	"name": "New user's name",
    	"type": "client",
    	"email": "newuser@example.com",
    	"address": "New user's adddress"
    };
    
    const obj = new UsersService();
    obj.delete('6ecb457156846c95477e561afb386cf7', function(err,data) {
    	if(!err && data) {
    		console.log('result:', data );
    		callback(false, data);
    	} else {
    		console.log('ERROR:', err);
    		callback(err);
    	}
    });
```

#### Possible Results
Code | Data | Origin |Description
------- | ------ | -------- | ------
200 | null | drivers/filedata.js |  
400 | [none] | this | Invalid data received (token).
404 | [none] | drivers/filedata.js | User not found.
500 | [none] | drivers/filedata.js | Filesystem error.

## TokensService class
The tokens service encapsulates all the tokens's functionality.
This service has the following methods:

### Properties
Parameter | Type     | Scope   | Description
----------|----------|---------| ------------
_model    | object   | Private | UsersModel class instance.
_tokens   | object   | Private | TokensModel class intance.



###  constructor (method)
Creates a new TokensService class instance, and initializes other classes this service uses.

#### Parameters
Parameter | Type     | Description
----------|----------|------------
None

#### Example
```javascript
    const TokensService = require('./services/tokens');
    ...
    const obj = new TokensService();
```

### read (method)
Reads the token data.

#### Parameters
Parameter | Type     | Description
----------|----------|------------
id | string | Token to read.
callback | function | Callback function (err,data)

#### Example
```javascript
    const TokensService = require('./services/tokens');
    ...
    const obj = new TokensService();
    obj.read('6ecb457156846c95477e561afb386cf7', function(err,data){
    	if(!err && data) {
    		console.log('result:', data );
    		callback(false, data);
    	} else {
    		console.log('ERROR:', err);
    		callback(err);
    	}
    });
```













