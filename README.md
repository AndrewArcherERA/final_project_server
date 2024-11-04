# final_project_server
API for Material Acquisition Application

# API Routes / Documentation

## /account

### GET /getStoredPass/:type/:id
Use: Retrieve encrypted user pass from db for comparison when updating user password

params: 
  - type (user type) - String
  - id (user id) - Int

return: 
  - password: String

### PUT /updatePassword
Use: Update user password

body: 
  - user_type - String
  - userID - Int
  - newPass - String

returns: 
- void

### PUT /updateUserInfo
Use: Update user information

body: 
  - f_name: String
  - l_name: String
  - email: String
  - phone: String
  - company_name: String
  - userID: Int
  - user_type: String
  
returns: 
  - f_name: String,
  - l_name: String,
  - email: String,
  - phone: String,
  - company_name: String

### POST /createWarehouse
Use: Create consumer warehouse location

Body: 
  - consumer_id: Int,
  - name: String,
  - street_address: String,
  - city: String,
  - state: String,
  - zip: String

returns: 
  - consumer_id: Int,
  - name: String,
  - street_address: String,
  - city: String,
  - state: String,
  - zip: String

### POST /updateWarehouse
Use: Update consumer warehouse location info

Body: 
  - consumer_id: Int,
  - name: String,
  - street_address: String,
  - city: String,
  - state: String,
  - zip: String

returns: 
  - consumer_id: Int,
  - name: String,
  - street_address: String,
  - city: String,
  - state: String,
  - zip: String

### GET /getWarehouses
Use: Get all consumer warehouse's 

NOTE: Current features on the frontend limit a consumer to have 1 warehouse location, but infrastructure in the backend & database are set up to handle a consumer having multiple warehouse locations.

Body: 
- void (API utilizes the req.user object that is set to the decode of the users JWT to access the user id for the consumer)

returns: 
- Array of objects
	- consumer_id: Int,
	- name: String,
	- street_address: String,
	- city: String,
	- state: String,
	- zip: String

### DELETE /deleteWarehouse
Use: Deletes consumer warehouse location and inventory

params: 
  - warehouse_id: Int

returns: 
- void

## /auth

### POST /register
Use: Register Consumer, Supplier or Employee user accounts

Body: 
  - f_name: String,
  - l_name: String,
  - email: String,
  - password: encrypted String,
  - phone: String,
  - company_name: String,
  - store_id: Int (Employee account),
  -user_type: String

returns: 
  - message: "User account created succesfully"

### POST /signIn
Use: Sign in a user

Body: 
  - email: String,
  - password: String,
  - user_type: String

returns: 

consumer: 
  - f_name: String,
  - l_name: String,
  - email: String,
  - phone: String,
  - compnay_name: String,
  - warehouse_id: Int,
  - status: String,
  - token: String

supplier: 
  - f_name: String,
  - l_name: String,
  - email: String,
  - phone: String,
  - compnay_name: String,
  - status: String,
  - token: String

employee: 
  - f_name: String,
  - l_name: String,
  - email: String,
  - phone: String,
  - compnay_name: String,
  - store_name: String
  - status: String,
  - token: String

## /cart

### GET /getCartItems
Use: Get users cart items

Body: 
- void

returns: 
  - id: Int,
  - supplier_id: Int,
  - name: String,
  - num_products_per_unit: Int,
  - num_units_available: Int,
  - price_per_product: float,
  - quantity: Int,
  - image_link: String

### POST /addCartItem
Use: Add item to user cart

Body: 
  - userID: Int,
  - productsID: Int,
  - quantity: Int

returns: 
- void

### DELETE /deleteCartItem/:productID
Use: remove item from user cart

params: 
- productID: Int

returns: 
- void

### POST /updateQuantity
Use: update quantity of item in user cart

Body: 
  - productsID: Int,
  - quantity: Int

returns: void

## /consumerStore

### POST /createStore
use: Create consumer store location

- body.store: 
  - consumer_id: Int,
  - store_name: String,
  - street_address: String,
  - city: String,
  - state: String,
  - zip: String

- body.manager:
  - f_name: String,
  - l_name: String,
  - email: String,
  - password: String,
  - phone: String

returns:
  - store:
    - id: Int,
    - store_name: String,
    - street_address: String,
    - city: String,
    - state: String,
    - zip: String
    
  - manager:
    - id: Int,
    - f_name: String,
    - l_name: String,
    - email: String,
    - phone: String

### POST /updateStore
Use: Update store location && store manager account information

body: 
- store:
    - id: Int,
    - store_name: String,
    - street_address: String,
    - city: String,
    - state: String,
    - zip: String
    
- manager:
    - id: Int,
    - f_name: String,
    - l_name: String,
    - email: String,
    - phone: String

returns: 
- store:
    - id: Int,
    - store_name: String,
    - street_address: String,
    - city: String,
    - state: String,
    - zip: String
    
- manager:
    - id: Int,
    - f_name: String,
    - l_name: String,
    - email: String,
    - phone: String
    
### GET /getStores/:consumer_id
Use: Get all consumer store locations

params: consumer_id: Int

returns: 
- store:
    - id: Int,
    - store_name: String,
    - street_address: String,
    - city: String,
    - state: String,
    - zip: String
    
- manager:
    - id: Int,
    - f_name: String,
    - l_name: String,
    - email: String,
    - phone: String

### DELETE /deleteStore
Use: Deletes consumer store location and inventory

Body: 
- store_id: Int,
- employee_id: Int

returns: 
- message: Store and store manager deleted successfully

## /inventory

### GET /getInventory/:user_type/:location_id
Use: Get inventory for consumer OR employee account

params:
- user_type: String
- location_id: Int

returns: 
Consumer

- Array of products contained in inventory
 - quantity: Int
 - name: String
 - id: Int
 - company_name: String
 - link: String
 - store_quantities: Array
   - name: String
   - quantity: Int

Employee

- Array of products contained in inventory
 - quantity: Int
 - name: String
 - id: Int
 - company_name: String
 - link: String
 - store_quantities: Array
   - name: String
   - quantity: Int
 - warehouse_quantity: Obj
   - quantity: Int  

### POST /sendToStore
Use: Create order to send product from warehouse inventory to a store locations inventory

Body: 
- warehouse_id: Int
- store_id: Int
- product_id: Int
- quantity: Int

returns: 
- void

### POST /deleteProduct
Use: Remove product from warehouse or store inventory

Body: 
- location_id: Int
- product_id: Int
- location_type: Int

Returns: 
- void

## /orders

### POST /createConsumerOrder
Use: Create order for Consumer to track product order status

Body:
- locationType: String
- orders: array of Objs
  - id: Int
  - quantity: Int
  - price_per_product
  - num_products_per_unit
- locationID: Int

Returns: 
- void

### GET /getOrders/:user_type
Use: Get orders for any user type

params: 
- user_type: String

returns:
- id: int
- name: string
- quantity: int
- order_total: flaot
- delivery_status: string
- expected_delivery_date: date
- delivery_date: date
- street_address: string
- city: string
- state: string
- zip: string

### POST /updateOrderStatus
Use: Update delivery status of order

body: 
- oder_id: int
- status: string

returns:
- void

## /products

### POST /createProduct
Use: Create Supplier product 

file: Takes file object for product image

body:
- num_products_per_unit: int
- num_units_available: int
- price_per_product: float
- name: string

returns: 
- id: int
- name: string
- num_products_per_unit: int
- num_units_available: int
- price_per_product: float
- iamge_id: int
- image_key: string
- image_link: string

### GET /getProducts
Use: Get supplier products

returns: 
- array of Objs
  - id: int
  - name: string
  - num_products_per_unit: int
  - num_units_available: int
  - price_per_product: float
  - iamge_id: int
  - image_key: string
  - image_link: string

### POST /updateProduct
Use: Update product information or image

file: takes file for image

body: 
- old_image_key: string
- name: string
- price_per_product: int
- num_products_per_unit: int
- product_id: int
- old_image_link: string

Returns: 
- id: int
- name: string
- num_products_per_unit: int
- num_units_available: int
- price_per_product: float
- iamge_id: int
- image_key: string
- image_link: string  

### PUT /updateStock
Use: update quantity of products in supplier stock

body:
- product_id: int
- updated_stock: int

returns: void

## /suppliersPage

### GET /getSuppliers
Use: Get all suppliers

returns: 
- array of Obj
  - company_name: String
  - id: Int
 
### GET /getSupplierProds/:id
Use: Get a suppliers products

params:
- id: int

returns: 
- array of Objs
  - id: int
  - name: string
  - num_products_per_unit: int
  - num_units_available: int
  - price_per_product: float
  - iamge_id: int
  - image_key: string
  - image_link: string










