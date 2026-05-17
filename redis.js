const { Redis } = require("ioredis");
const configs = require("./configs");

const redis = new Redis(configs.redis.uri)

const redisTest = async ()=>{
    
    await redis.set("username","arman naghavi")
    
   const keys = await redis.keys('*')
   const value = await redis.get('price')
   
  console.log("redis db ->",keys);
   console.log("redis db ->",Number(value).toLocaleString());
   
}
const deleteDate = async ()=>{
    await redis.del("key")
    const keys = await redis.keys('*')
    console.log("redis db ->",keys);
}
//deleteDate()
//redisTest()
module.exports = redis
