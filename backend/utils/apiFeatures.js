class APIFeatures {
    constructor(query,queryStr){
        this.query = query;
        this.queryStr = queryStr;
    }

    search(){
       let keyword = this.queryStr.keyword ? {
             name:{
                $regex: this.queryStr.keyword,
                $options: 'i'
             }
        }:{};
        
        console.log("keyword query:",keyword);
        this.query.find({...keyword});
        console.log("find query:",this.query.getQuery())
        return this;
    }
     
    filter(){
        const queryStrCopy = { ...this.queryStr};
        // before
        // console.log(queryStrCopy);
        // removing fields from query
        const removeFields = ['keyword','limt','page'];
        removeFields.forEach(field => delete queryStrCopy[field]);

        // after
        // console.log(queryStrCopy);
        let queryStr = JSON.stringify(queryStrCopy);
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte)/g,match => `$${match}`);

        console.log(queryStrCopy);
        this.query.find(JSON.parse(queryStr));

                                                       // const parseQuery = JSON.parse(queryStr);
                                                      // this. query.find(parseQuery );

      return this;
    }
    paginate(resPerpage){
        const currentPage= Number(this.queryStr.page) || 1;
        const skip = resPerpage * (currentPage-1)
        this.query.limit(resPerpage).skip(skip);
        return this;
    }


}

module.exports = APIFeatures;