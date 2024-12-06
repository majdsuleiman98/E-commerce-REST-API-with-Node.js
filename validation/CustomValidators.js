const { default: slugify } = require("slugify");
const { User } = require("../models/User");
const bcryptjs = require("bcryptjs");
const { Subcategory } = require("../models/Subcategory");
const { Product } = require("../models/Product");
const Order = require("../models/Order");

//slug name befor save object(user,brand,category,product...)
const slugging = (value,{req})=>{
    if(req.body.name) {
        req.body.slug = slugify(value);
        return true;
    }
    return false;
}

//check if this field is unique in a model
const isUniqueField = (fieldName, modelName) => {
    return async (value, { req }) => {
        const query = {};
        query[fieldName] = value;
        const existingRecord = await modelName.findOne(query);
        if (existingRecord) {
            if(existingRecord._id.toString() === req.params.id){
                return true;
            }
            throw new Error(`${fieldName} must be unique`);
        }
        return true;
    };
};

//check password confirmation
const isPasswordConfirmed = (password,{req})=>{
    if(req.body.password && req.body.passwordConfirm){
        if(password !== req.body.passwordConfirm) {
            throw new Error('Password Confirmation incorrect');
        }   
    }
    return true;
}

//prevent enter a field by user
const prevent_enter_Field = (value, { req }) => {
    if (typeof value !== 'undefined') {
        throw new Error('This field is not allowed');
    }
    return true;
};

//check image 
const CheckImage = (value, { req }) => {
    if (!req.file) {
        throw new Error('Image is required');
    }
    return true;
}

const isExistForeignKey = (fieldName,model)=> {
    return async (value,{req}) => {
        const existingRecord = await model.findById(value);
        if (!existingRecord) {
            throw new Error(`${fieldName} not found`);
        }
        return true;
    };
}

const check_allowed_roles = (value) => {
    if (['admin','user','seller'].includes(value.toLowerCase())) {
        return true;
    }
    throw new Error('This role is not allowed');  
}

const tax_number_for_seller = (value,{req})=>{
    if(req.body.role && req.body.role === 'seller') {
        if(!req.body.tax_number) {
            throw new Error('Tax number of seller is required');
        }
        else {
            return true;
        }
    }
    else if(req.body.role && req.body.role !== 'seller' && req.body.tax_number){
        throw new Error('Tax number is allwoed only for seller');
    }
    else {
        return true;
    }
}

const isCurrentPasswordMatched = async(value,{req})=>{
    const user = await User.findById(req.params.id);
    const isMatchPassword = await bcryptjs.compare(req.body.currentPassword,user.password);
    if(!isMatchPassword){
        throw new Error('Current password is not correct');
    }
    return true;
}

const check_discount_price = (value, { req }) => {
    if (req.body.price_after_discount) {
        if(req.body.price <= value) {
            throw new Error('Price after discount must be lower than price');
        }
        return true;
    }
    return true;
}

const check_subcategories = async (subcategoriesIds)=>{
    const results = await Subcategory.find({ _id: { $exists: true, $in: subcategoriesIds } });
    if(results.length<1 || results.length !== subcategoriesIds.length){
        throw new Error('Invalid subcategories Ids'); 
    }
    return true;
}


const checkSubcategoriesBelongToCategory = async (subcategoryIds, { req }) => {  
    const categoryId = req.body.category;
    const subcategories = await Subcategory.find({
        _id: { $in: subcategoryIds },
        category: categoryId
    });
    if (subcategories.length !== subcategoryIds.length) {
        throw new Error('One or more subcategories do not belong to the specified category.');
    }
    return true;
};

const checkOwnerSeller = async(val,{req})=>{
    const product =await Product.findById(val);
    if(!product){
        throw new Error("product not found")
    }
    if(product.seller.toString() !== req.user.id){
        throw new Error("Only owner seller can update this product");
    }
    return true;
}

const checkDeleteProductPirmision = async(val,{req})=>{
    const product =await Product.findById(val);
    if(!product){
        throw new Error("product not found")
    }
    if(product.seller.toString() === req.user.id || req.user.role === "admin"){
        return true;
    }
    throw new Error("Only owner seller or admin can Delete this product");
}

const check_allowed_address_type = (value) => {
    if (['home','school','work'].includes(value.toLowerCase())) {
        return true;
    }
    throw new Error('This address type is not allowed');  
}


const check_color_rules = async (val,{req})=>{
    const product = await Product.findById(req.body.ProductId);
    if(product.colors && product.colors.length > 0){
        if(val)
        {
            if(product.colors.includes(val))
            {
                return true;
            }
            else
            {
                throw new Error(`this color is not avaliable for this product`);
            }
        }
        else
        {
            throw new Error(`Color is required for this product`);
        }
    }
    else
    {
        if(val){
            throw new Error(`this product doesn't have colors`);
        }
    }
    return true;
    
}

const checkowneroforder = async(val,{req})=>{
    const order = await Order.findById(req.params.id);
    if(order.user.toString() === req.user.id){
        return true;
    }
    throw new Error("You can get only your own orders");
}

module.exports = 
{
    slugging,
    isUniqueField,
    isPasswordConfirmed,
    prevent_enter_Field,
    CheckImage,
    isExistForeignKey,
    check_allowed_roles,
    tax_number_for_seller,
    isCurrentPasswordMatched,
    check_discount_price,
    check_subcategories,
    checkSubcategoriesBelongToCategory,
    checkOwnerSeller,
    checkDeleteProductPirmision,
    check_allowed_address_type,
    check_color_rules,
    checkowneroforder
};