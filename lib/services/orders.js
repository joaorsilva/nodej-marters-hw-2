/**
 * Orders service class (logic implementation)
 */

/**
 * Dependencies
 */

// Node

// Project
const OrdersModel = require('../models/orders');
const ProductsModel = require('../models/products');
const UsersModel = require('../models/users');
const TokensService = require('./tokens');
const MailAPI = require('../apis/mailgun/mailgun');
const PaymentAPI = require('../apis/stripe/stripe');
const config = require('../../config/config');

class OrdersService {

    constructor()
    {
        this._model = new OrdersModel();
        this._productsModel = new ProductsModel();
        this._usersModel = new UsersModel();
        this._tokensService = new TokensService();
    }

    /**
     * Reads one or more orders if an order id isn't passed
     * Require Token: No
     * 
     * @param {string} id - Order to read (Optional)
     * @param {token} token - Token string
     * @param {function} callback - Callback function (err,data)  
     */
    read(id,token,callback) 
    {
        let _this = this;

        // Check if the user's token is valid
        this._tokensService.valid(token,function(err,tokenData) {
            if(!err && tokenData) {                
                // Reads the data from the logged user
                _this._usersModel.read(tokenData.user,function(err,userData) {
                    
                    if(!err && userData) {

                        // Sets the order to read to all system orders
                        let ordersToRead = null;

                        // If the is an order id set it to be read
                        if(id) {
                            ordersToRead = [id];
                        }
                        
                        // Check id a user is a client
                        if(userData.type === 'client') {
                            // If the user is a client check if there is an order to read 
                            // and if it belongs to the logged user. If the order don't
                            // belong to the user send a not found error
                            if(ordersToRead && userData.orders.indexOf(ordersToRead[0] ) === -1) {
                                callback({'code': 404, 'message': 'not found', 'data': {'param':'id', 'message': 'not found'}});
                                return;
                            } else {
                                // If there are no order to read for a client
                                // set all client orders to be read.
                                if(ordersToRead === null || ordersToRead.length === 0) {
                                    ordersToRead = userData.orders;
                                }
                            }
                        }
                        
                        // If there are specific order to be read
                        if(ordersToRead) {
                            let orders = [];
                            let currentOrder = 0;
                            // read each order in the ordersToRead array
                            ordersToRead.forEach(function(item) {
                                _this._model.read(item,function(err,orderData) {
                                    // Here we ignore the read errors because
                                    // we don't want an error to stop valid orders
                                    // to be shown
                                    if(!err && orderData)
                                    {
                                        orders.push(orderData);
                                    }
                                    currentOrder++;
                                    // When read is finished, return the orders
                                    if(currentOrder === ordersToRead.length) {
                                        callback(false,orders);
                                    }
                                });
                            });

                        } else {
                            // In this case the user is an admin with rights to
                            // read all system orders. Read and return them.
                            _this._model.read(null,function(err,data) {
                                
                                if(!err && data) {
                                    callback(false,data);
                                } else {
                                    callback(err);
                                }
                            });
                        }
                    } else {
                        callback(err);
                    }
                });
            } else {
                callback(err);
            }
        });
    }

    /**
     * Creates a new order from the products in the basket
     * Require Token: Yes
     * 
     * @param {string} token - Token string 
     * @param {function} callback - Callback function (err,data)  
     */
    create(token,callback) 
    {
        let _this = this;
        this._tokensService.valid(token,function(err,tokenData) {
            if(!err && tokenData) {
                _this._usersModel.read(tokenData.user,function(err,userData) {
                    if(!err && userData) {
                        userData.basket = 
                            typeof(userData.basket) == 'object'
                            && userData.basket instanceof Array
                            && userData.basket.length > 0
                            ? userData.basket
                            : false;

                            if(userData.basket) {
                                let orderItems = [];
                                let currentItem = 0;
                                
                                userData.basket.forEach(function(item) {
                                        typeof(item.id) === 'string' 
                                        && item.id.trim().length === 32
                                        ? item.id.trim() 
                                        : false;

                                        typeof(item.quantity) === 'number' 
                                        && item.quantity > 0
                                        ? item.quantity
                                        : false;
                                    
                                    if(item.id && item.quantity) {
                                        _this._productsModel.read(item.id, function(err,data) {
                                            if(!err && data) {
                                                orderItems.push({
                                                    'id': item.id,
                                                    'name': data.name,
                                                    'price': data.price,
                                                    'quantity': item.quantity
                                                });
                                            }
                                            currentItem++;
                                            if(currentItem === userData.basket.length) {
                                                if(orderItems.length > 0) {
                                                    const order = {
                                                        'date': Date.now(),
                                                        'name': userData.name,
                                                        'email': userData.email,
                                                        'address': userData.address,
                                                        'products': orderItems,
                                                        'invoice': null
                                                    }

                                                    // Calculates the order total and inserts the payment info
                                                    let subTotal = 0;
                                                    order.products.forEach(function(item) {
                                                        subTotal += item.price * item.quantity;
                                                    });
                                                    order.taxes = subTotal * (config.otherExpenses.taxes/100);
                                                    order.delivery = config.otherExpenses.delivery;

                                                    let paymentData = {
                                                        "amount": Math.round((subTotal + order.taxes + order.delivery)*100),
                                                        "currency": "usd",
                                                        "description": "test",
                                                        "source": "tok_visa"
                                                    };

                                                    // Validates the order payment
                                                    PaymentAPI.validatePayment(paymentData,function(err,data){
                                                        if(!err && data) {
                                                            // Creates the order with the basket content
                                                            _this._model.create(order,function(err,orderData){
                                                                if(!err && orderData) {
                                                                    // Add the inserted order to the user's orders list
                                                                    userData.orders.push(orderData.id)
                                                                    // Deletes the basket content
                                                                    userData.basket = [];
                                                                    _this._usersModel.update(userData,function(err,data) {
                                                                        if(!err && data) { 
                                                                            // If the email fails to be sent the order is posted anyway since we have succesfuly charged it already
                                                                            _this._sendInvoice(userData, order, function(err,data) {
                                                                                if(!err && data) {
                                                                                    callback(false,orderData);
                                                                                } else {
                                                                                    callback({"code": err.code, "message": `Error sending email with the invoice (${err.code})`});
                                                                                }
                                                                            });
                                                                        } else {
                                                                            callback(err);
                                                                        }
                                                                    });
                                                                } else {
                                                                    callback(err);
                                                                }
                                                            });                                                        
                                                        } else {
                                                            callback(err);
                                                        }
                                                    });
                                                    //TODO: Issue the invoice number
                                                } else {
                                                    callback({'code': 500, 'message': 'Internal server error', 'data':{'field': 'basket', 'message': 'invalid'}})
                                                }            
                                            }
                                        });
                                    }
                                });
                            } else {
                                callback({'code': 400, 'message': 'Bad request', 'data':{'field': 'basket', 'message': 'invalid'}})
                            }
                    } else {
                        callback(err);
                    }
                });    
            } else {
                callback(err);
            }
        });
    }

    /**
     * Updates an order with it's invoice number. This is the only parameter
     * allowed to be updated.
     * Require Token: Yes
     * 
     * @param {string} id - Product id to be updated 
     * @param {object} data- Product object {name, description, price} 
     * @param {function} callback - Callback function (err,data)  
     */
    update(id,data,callback) 
    {
        data = 
            typeof(data) === 'string'
            && data.trim().length > 0
            ? data.trim()
            : false;

        if(id && data) {
        
            this._model.invoice = data;
            this._model.update(null, null, callback);
        } else {
            callback({"code": 400, "data": {"param": "id or data", "message": "invalid"}});
        }
    }

    /**
     * Deletes an order
     * Require Token: Yes
     * 
     * @param {string} id - Product id to be deleted 
     * @param {function} callback - Callback function (err,data)  
     */
    delete(id,callback) 
    {
        if(id) {
            this._model.delete(id,callback);
        } else {
            callback({"code": 400, "data": {"param": "id", "message": "invalid"}});
        }
    }

    /**
     * Send the order invoice to the client
     * 
     * @param {*} order 
     * @param {*} callback 
     */
    _sendInvoice(user,order,callback) 
    {
        let date = new Date(order.date)
        let html = "";
        html +='<div style="font-family: Arial, Helvetica, sans-serif; font-size:12px;color:#333;" >';
        html +=`    <b>Dear ${user.name}<b> <br><br>`;
        html +='    You will find an invoice with your order details bellow.<br>';
        html +='    If you have any question about this order please replay to this email.<br><br>';
        html +='    Thank you for you order.<br>';
        html +='    <b>The Pizza Node Masters\' team.</b>';
        html +='    <table style="margin-top:20px; width:100%;font-size:12px;">';
        html +='        <thead>';
        html +='            <tr style="height: 35px;">';
        html +='                <th colspan="2" style="text-align:left;font-size:20px;border-bottom: 1px solid #eee;">The Pizza Node Masters\'</th>';
        html +='                <th colspan="3" style="text-align:right;font-weight: normal;border-bottom: 1px solid #eee;">Date: ' + date.toLocaleString() + '</th>';
        html +='            </tr>';
        html +='            <tr>';
        html +='                <td colspan="2">';
        html +='                    From<br>';
        html +='                    <b>The Pizza Node Masters\'</b><br>';
        html +='                    795 Folsom Ave<br>';
        html +='                    San Francisco, CA 94107<br>';
        html +='                    Phone: (000) 0000-0000<br>';
        html +='                    Email: pnm@pizzanodemasters.com<br>';
        html +='                </td>';
        html +='                <td colspan="2">';
        html +='                    To<br>';
        html +='                    <b>Name' + order.name + '</b><br>';
        html +='                    ' + order.address + '<br>';
        html +='                    Phone: <br>';
        html +='                    Email: ' + order.email;  
        html +='                </td>';
        html +='                <td colspan="1">';
        html +='                    <b>Invoice #' + order.id + '</b><br>';
        html +='                    <br>';
        html +='                    <b>Invoice ID: </b>' + order.id + '<br>';
        html +='                    <b>Payed: </b>' + date.toLocaleString() + '<br>';
        html +='                </td>';
        html +='            </tr>';
        html +='            <tr style="height: 20px;border-top: 1px solid #eee;"></tr>';
        html +='            <tr style="height: 35px;">';
        html +='                <th style="text-align:left;width:10%">Qty</th>';
        html +='                <th style="text-align:left;">Name</th>';
        html +='                <th style="text-align:left;">Item #</th>';
        html +='                <th style="text-align:right;">Unit price</th>';
        html +='                <th style="text-align:right;">Total</th>';
        html +='            </tr>';
        html +='        </thead>';
        html +='        <tbody>';
        let color = "f9f9f9";
        let subtotal = 0;
        order.products.forEach(function(item){
            if(color === 'f9f9f9')
            {
                color = 'ffffff';
            } else {
                color = 'f9f9f9';
            }
            html +='            <tr style="height: 35px;">';
            html +='                <td style="text-align:left;width:10%;background-color: #' + color + ';">' + item.quantity + '</td>';
            html +='                <td style="text-align:left;background-color: #' + color + ';">' + item.name + '</td>';
            html +='                <td style="text-align:left;background-color: #' + color + ';">' + item.id + '</td>';
            html +='                <td style="text-align:right;background-color: #' + color + ';">$' + item.price + '</td>';
            html +='                <td style="text-align:right;background-color: #' + color + ';">$' + (item.price * item.quantity).toFixed(2) + '</td>';
            html +='            </tr>';
            subtotal += item.price * item.quantity;
        });
        html +='        <tfoot>';
        html +='            <tr style="height: 35px;">';
        html +='                <td colspan="3">';
        html +='                    <span style="font-size:20px">Payment details:</span>';
        html +='                    <div style="margin-top:20px;border: 1px solid #e3e3e3; background-color: #f5f5f5; padding: 10px; width:50%;line-height: 20px;">';
        html +='                        Your credit card VISA XXXX-XXXX-XXXX-XX35 was charged with the total amount of this invoice. No further action from you is required.<br>';
        html +='                        All texes and delivery costs details were included in this invoice for your reference.<br>';
        html +='                        Our team thank you for your preference!';
        html +='                    </div>';
        html +='                </td>';
        html +='                <td colspan="2">';
        html +='                    <span style="font-size:20px">Payed: ' + date.toLocaleString() + '</span>';
        html +='                    <table style="width:100%;font-size:12px;margin-top:20px;">';
        html +='                        <tr style="height: 35px;">';
        html +='                            <td style="text-align:left;font-weight: bolder;border-top: 1px solid #eee;">Subtotal</td>';
        html +='                            <td style="text-align:right;border-top: 1px solid #eee;">$' + subtotal.toFixed(2) + '</td>';
        html +='                        </tr>';
        html +='                        <tr style="height: 35px;">';
        html +='                            <td style="text-align:left;font-weight: bolder;border-top: 1px solid #eee;">Taxes (' + config.otherExpenses.taxes.toFixed(2) + '%)</td>';
        html +='                            <td style="text-align:right;border-top: 1px solid #eee;">$' + order.taxes.toFixed(2) + '</td>';
        html +='                        </tr>';
        html +='                        <tr style="height: 35px;">';
        html +='                            <td style="text-align:left;font-weight: bolder;border-top: 1px solid #eee;">Delivery</td>';
        html +='                            <td style="text-align:right;border-top: 1px solid #eee;">$' + order.delivery.toFixed(2) + '</td>';
        html +='                        </tr>';
        html +='                        <tr style="height: 35px;">';
        html +='                            <td style="text-align:left;font-weight: bolder;border-top: 1px solid #eee;">Total</td>';
        html +='                            <td style="text-align:right;left;font-weight: bolder;border-top: 1px solid #eee;">$' + (subtotal + order.taxes + order.delivery).toFixed(2) +'</td>';
        html +='                        </tr>';
        html +='                    </table>';
        html +='                </td>';
        html +='            </tr>';
        html +='        </tfoot>';
        html +='    </table>';
        html +='</div>';

        MailAPI.send(order.email,'Your invoice',html, callback);
    }
}

/**
 * Module exports
 */
module.exports = OrdersService;





