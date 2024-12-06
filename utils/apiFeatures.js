class ApiFeatures{
    constructor(mongooseQuery,queryString){
        this.mongooseQuery = mongooseQuery;
        this.queryString = queryString;
    }
    //Filter query
    Filter(){
        const queryObj = {...this.queryString};
        const excludesFields = ['page','sort','limit','fields'];
        excludesFields.forEach((field)=> delete queryObj[field]);
        let querystr = JSON.stringify(queryObj);
        querystr = querystr.replace(/\b(gte|gt|lte|lt)\b/g,(match)=>`$${match}`);
        this.mongooseQuery = this.mongooseQuery.find(JSON.parse(querystr));
        return this;
    }
    //Sort data
    Sort(){
        if(this.queryString.sort){
            this.mongooseQuery = this.mongooseQuery.sort(this.queryString.sort);
        }
        else{
            this.mongooseQuery = this.mongooseQuery.sort({createdAt:-1});
        }
        return this;
    }
    //Select some fields
    Fields(){
        if(this.queryString.fields){
            const fields = this.queryString.fields.split(",").join(" ");
            this.mongooseQuery = this.mongooseQuery.select(fields);
        }
        else{
            this.mongooseQuery = this.mongooseQuery.select("-__v");
        }
        return this;
    }
    //Search
    Search(){
        if(this.queryString.name){
            let query = { name: { $regex: this.queryString.name, $options: 'i' } };
            this.mongooseQuery = this.mongooseQuery.find(query);
        }
        return this;
    }
    Paginate(){
        let pageNumber;
        let limit;
        if(this.queryString.page){
            pageNumber = parseInt(this.queryString.page) || 1;
            limit = parseInt(this.queryString.limit) || 3;
        }
        else{
            pageNumber =  1;
            limit =  3;
        }
        const skip = (pageNumber-1)*limit;
        this.mongooseQuery = this.mongooseQuery.skip(skip).limit(limit);
        return this;
    }
    
}


module.exports = ApiFeatures;