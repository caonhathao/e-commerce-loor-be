const _express = require('express');
const router = _express.Router();
const multer = require("multer");
const upload = multer();

const {Category} = require('../models/_index');
const {Brands} = require('../models/_index');
const {SubCategory} = require('../models/_index');
const {Users} = require('../models/_index');
const {OrderStatus} = require('../models/_index');
const {OrderDetail} = require('../models/_index');
const {Orders} = require('../models/_index');
const {Receipt} = require('../models/_index');
const {Products} = require('../models/_index');
const {ImageProducts} = require('../models/_index');
const {ProductVariants} = require('../models/_index');
const {ProductAttributes} = require('../models/_index');
const {FeaturedProduct} = require('../models/_index');
const {NotifyUser} = require('../models/_index');
const {NotifyBrand} = require('../models/_index');
const {Districts} = require('../models/_index');
const {Provinces} = require('../models/_index');
const {Carts} = require('../models/_index');
const {TokenStore} = require('../models/_index');
const {Reviews} = require('../models/_index');
const {ImageReviews} = require('../models/_index');
const {ShippingAddress} = require('../models/_index');
const {UserRoles}= require('../models/_index');
const {OrderLog} = require('../models/_index');

const {createID} = require("../utils/functions.global");
const {formatTemplate} = require("../utils/functions.global");
const {catchAndShowError} = require("../utils/functions.global");
const {getPublicIdFromURL} = require("../utils/functions.global");
const {encryptPW} = require("../utils/functions.global");
const {sendAuthResponse} = require("../utils/auth.utils");
const statusCode = require("../utils/statusCode");
const systemNotify = require('../utils/system-notify.utils')

const {uploadToCloudinary} = require("../controllers/uploadController");
const {destroyToCloudinary} = require("../controllers/uploadController");

const {authenticateAccessToken} = require("../security/JWTAuthentication");
const {TokenTracking} = require("../security/TokenTracking");
const {TokenUpdate} = require("../security/TokenTracking");
const {ValidateToken} = require("../security/TokenTracking");
const {generateAccessToken} = require("../security/JWTProvider");
const {generateRefreshToken} = require("../security/JWTProvider");
const {verify}= require("../security/JWTProvider");

const {Sequelize} = require("sequelize");
const {Op} = require("sequelize");
const {literal} = require("sequelize");
const {col} = require('sequelize');
const {fn} = require('sequelize');

const {getIO} = require("../services/websocket");
const chalk = require("chalk");

module.exports = {
    router,
    OrderStatus,
    Orders,
    OrderDetail,
    Receipt,
    NotifyUser,
    NotifyBrand,
    Districts,
    Provinces,
    Category,
    Brands,
    SubCategory,
    Users,
    Carts,
    TokenStore,
    Reviews,
    ImageReviews,
    ShippingAddress,
    UserRoles,
    OrderLog,
    Products,
    ImageProducts,
    ProductVariants,
    ProductAttributes,
    FeaturedProduct,
    createID,
    formatTemplate,
    catchAndShowError,
    statusCode,
    multer,
    upload,
    authenticateAccessToken,
    Sequelize,
    literal,
    getIO,
    sendAuthResponse,
    chalk,
    systemNotify,
    Op,
    getPublicIdFromURL,
    uploadToCloudinary,
    destroyToCloudinary,
    fn,
    col,
    TokenTracking,
    TokenUpdate,
    ValidateToken,
    generateAccessToken,
    generateRefreshToken,
    encryptPW,
    verify
}