const AllRoutes = (app)=>{
    app.use("/api/categories",require("./categoryRoutes"));
    app.use("/api/subcategories",require("./subcategoryRoutes"));
    app.use("/api/brands",require("./brandRoutes"));
    app.use("/api/users",require("./userRoutes"));
    app.use("/api/auth",require("./authRoutes"));
    app.use("/api/products",require("./productRoutes"));
    app.use("/api/reviews",require("./reviewRoutes"));
    app.use("/api/wishlist",require("./wishlistRoute"));
    app.use("/api/address",require("./addressRoutes"));
    app.use("/api/cupons",require("./cuponRoutes"));
    app.use("/api/cart",require("./cartRoutes"));
    app.use("/api/orders",require("./orderRoutes"));
}

module.exports = AllRoutes;