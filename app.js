const { ApplicationClass } = require("./app/server");

ApplicationClass(process.env.PORT,process.env.DB_ATLAS_URL)