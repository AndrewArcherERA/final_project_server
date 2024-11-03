# final_project_server
API for Material Acquisition Application


# API Routes / Documentation

## /account

### GET /getStoredPass/:type/:id
Use: Retrieve encrypted user pass from db for comparison when updating user password

params: 
  type (user type) - String
  id (user id) - Int

return: 
{
  password: String
}

### PUT /updatePassword
Use: Update user password

body: 
  user_type - String
  userID - Int
  newPass - String

returns: void

### PUT /updateUserInfo
Use: Update user information

body: 
{
  f_name: String
  l_name: String
  email: String
  phone: String
  company_name: String
  userID: Int
  user_type: String
}
  
returns: 
{
  f_name: String,
  l_name: String,
  email: String,
  phone: String,
  company_name: String,
}

### POST /createWarehouse
Use: Create consumer warehouse location

Body: 
{
  consumer_id: Int,
  name: String,
  street_address: String,
  city: String,
  state: String,
  zip: String
}

returns: 
{
  consumer_id: Int,
  name: String,
  street_address: String,
  city: String,
  state: String,
  zip: String
}

### POST /updateWarehouse
Use: Update consumer warehouse location info

Body: 
{
  consumer_id: Int,
  name: String,
  street_address: String,
  city: String,
  state: String,
  zip: String
}

returns: 
{
  consumer_id: Int,
  name: String,
  street_address: String,
  city: String,
  state: String,
  zip: String
}

### GET /getWarehouses
Use: Get all consumer warehouse's 

NOTE: Current features on the frontend limit a consumer to have 1 warehouse location, but infrastructure in the backend & database are set up to handle a consumer having multiple warehouse locations.

Body: void (API utilizes the req.user object that is set to the decode of the users JWT to access the user id for the consumer)

returns: 
[
  {
    consumer_id: Int,
  name: String,
  street_address: String,
  city: String,
  state: String,
  zip: String
  }
]

### DELETE /deleteWarehouse
Use: Deletes consumer warehouse location and inventory

params: 
  warehouse_id: Int

returns: void

## /auth

### POST /register
Use: Register Consumer, Supplier or Employee user accounts

Body: 
{
  f_name: String,
  l_name: String,
  email: String,
  password: encrypted String,
  phone: String,
  company_name: String,
  store_id: Int (Employee account),
  user_type: String
}

returns: 
{
  message: "User account created succesfully"
}

### POST /signIn
Use: Sign in a user

Body: 
{
  email: String,
  password: String,
  user_type: String
}

returns: 

consumer: 
{
  f_name: String,
  l_name: String,
  email: String,
  phone: String,
  compnay_name: String,
  warehouse_id: Int,
  status: String,
  token: String
}

supplier: 
{
  f_name: String,
  l_name: String,
  email: String,
  phone: String,
  compnay_name: String,
  status: String,
  token: String
}

employee: 
{
  f_name: String,
  l_name: String,
  email: String,
  phone: String,
  compnay_name: String,
  store_name: String
  status: String,
  token: String
}

## /cart

### GET /getCartItems
Use: Get users cart items

Body: void

returns: 
{
  id: Int,
  supplier_id: Int,
  name: String,
  num_products_per_unit: Int,
  num_units_available: Int,
  price_per_product: float,
  quantity: Int,
  image_link: String
}

### POST /addCartItem
Use: Add item to user cart

Body: 
{
  userID: Int,
  productsID: Int,
  quantity: Int
}

returns: void

### DELETE /deleteCartItem/:productID
Use: remove item from user cart

params: productID: Int

returns: void

### POST /updateQuantity
Use: update quantity of item in user cart

Body: 
{
  productsID: Int,
  quantity: Int
}

returns: void

## /consumerStore

### POST /createStore
use: Create consumer store location

body.store: 
{
  consumer_id: Int,
  store_name: String,
  street_address: String,
  city: String,
  state: String,
  zip: String
}

body.manager:
{
  f_name: String,
  l_name: String,
  email: String,
  password: String,
  phone: String
}

returns:
{
  store: {
    id: Int,
    store_name: String,
    street_address: String,
    city: String,
    state: String,
    zip: String
  }
  manager: {
    id: Int,
    f_name: String,
    l_name: String,
    email: String,
    phone: String
  }
}

### POST /updateStore
Use: Update store location && store manager account information

body: 
{
  store: {
    id: Int,
    store_name: String,
    street_address: String,
    city: String,
    state: String,
    zip: String
  }
  manager: {
    id: Int,
    f_name: String,
    l_name: String,
    email: String,
    password: String,
    phone: String
  }
}

returns: 
{
  store: {
    id: Int,
    store_name: String,
    street_address: String,
    city: String,
    state: String,
    zip: String
  }
  manager: {
    id: Int,
    f_name: String,
    l_name: String,
    email: String,
    phone: String
  }
}

### GET /getStores/:consumer_id
Use: Get all consumer store locations

params: consumer_id: Int

returns: 
[
	{
  	store: {
    	id: Int,
    	store_name: String,
    	street_address: String,
    	city: String,
    	state: String,
    	zip: String
  	}
  	manager: {
    	id: Int,
    	f_name: String,
    	l_name: String,
    	email: String,
    	phone: String
  	}
	}
]

### DELETE /deleteStore
Use: Deletes consumer store location and inventory

Body: 
{
	store_id: Int,
 	employee_id: Int
}

returns: {message: Store and store manager deleted successfully}




















