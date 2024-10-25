const express = require('express');
const cors = require('cors');
const app = express();
const jwt = require('jsonwebtoken');
const config = require('./auth.config');
const authRoute = require('./routes/auth');
const accountRoute = require('./routes/account');
const consumerStoreRoute = require('./routes/consumerStore');
const productRoute = require('./routes/products');
const supplierPageRoute = require('./routes/suppliersPage');
const cartRouter = require('./routes/cart');
const orderRouter = require('./routes/orders');
const inventoryRouter = require('./routes/inventory');

app.use(cors());
app.use(express.json());

// Check for JWT token in request
app.use((req, res, next) => {
    if (
        req.headers &&
        req.headers.authorization
    ) {
        jwt.verify(
            req.headers.authorization,
            config.secret,
            (err, decode) => {
                if (err) req.user = undefined;
                req.user = decode;
                next();
            }
        );
    } else {
        req.user = undefined;
        next();
    }
});

app.use((req, res, next) => {
    if (req.path === '/auth/signIn' || req.path === '/auth/register') next();
    else if (!req.user) res.status(401).json({message: 'Please provide a JSON web token to access this route'});
    else next();
})

app.use('/auth', authRoute);
app.use('/account', accountRoute);
app.use('/consumerStore', consumerStoreRoute);
app.use('/products', productRoute);
app.use('/supplierPage', supplierPageRoute);
app.use('/cart', cartRouter);
app.use('/orders', orderRouter);
app.use('/inventory', inventoryRouter);


const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server listening on port: ${PORT}`);
});

module.exports = app;