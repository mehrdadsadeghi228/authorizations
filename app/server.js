const express=require('express');
const morgan=require('morgan');
const http=require('http');
const AllRouters=require('./routers/routers');

class Application{
    #app=express();
    #DB_URL
    #PORT

    constructor(port,db_url){
        this.#PORT=port
        this.#DB_URL=db_url
        this.configApplication()
        this.connectToMongoDB()
        this.createServer()
        this.createRoutes()
        this.errorhandler()

    }
    configApplication(){
        this.#app.use(cors())
        this.#app.use(morgan("dev"));
        this.#app.use(express.json());
        this.#app.use(express.urlencoded({ extended: true }));
        this.#app.use(express.static(path.join(__dirname, "..", "public")));
    }
    createdServer(){
        const server=http.createServer(this.#app);
        server.listen(this.#PORT,()=>{
            console.log(`server run on port http://localhost:${this.#PORT}`);
 
        });
    }

    connectToMongoDB(){

        try {
            mongoose.connect(this.#DB_URL).then(result=>{
                console.log('connection to mongodb Atlas ');
            
            });
            mongoose.connection.on("connected", () => {
                console.log("mongoose connected to DB");
              });
    
              mongoose.connection.on("disconnected", () => {
                console.log("mongoose connection is disconnected");
              });
            
        } catch (error) {
            console.log("connect in mongodb is failure ",error);
            
        }
    }
 errorhandler(){

        this.#app.use((req,res,next)=>{
            return res.status(404).json({
                status:404,
                success:false,
                message:" page not found"
            })
            
        });
        this.#app.use((err,req,res,next)=>{
            const status=err?.error||500;
            const message=err?.message|| "Internal  Server Error";

            return res.status(status).json({
                status:status,
                success:false,
                message:message
            })
            
        });    
    }
    createRoutes(){
        this.#app.use(AllRouters);

    }




}


module.exports={
    ApplicationClass: new Application()
}