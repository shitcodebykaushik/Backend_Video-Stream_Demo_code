import express from "express";
import { createReadStream, statSync} from "fs";
import { dirname } from "path";
import { fileURLToPath } from "url";

const _filename = fileURLToPath(import.meta.url);
const _dirname = dirname(_filename);
console.log("_dirname",_dirname);

const app = express();

app.get ("/",(req,res)=>{
    res.send ("Hello world");
});

app.get ("/video",(req,res)=>{
    const filepath = `${_dirname}/public/video.mp4`;
    const stat = statSync(filepath);
    const fileSize = stat.size;
    
    const range = req.headers.range;
    if (!range ) {
       return res.status(400).send("Requires Range header");
    }

   
    /// This is my chunck size .
     const chunckSize = 10 ** 6;
     const start = Number(range.replace(/\D/g,""));
     const end = Math.min(start + chunckSize-1,fileSize-1);
     const contentLength =end - start + 1;
    
   
   const headers = {
    "Content-Range":`bytes ${start}-${end}/${fileSize}`,
    "Accept-Ranges": "bytes",
    "Content-Length": contentLength,
    "Content-Type":"video/mp4", 
   }
   
   res.writeHead(206,headers);
   const fileStream = createReadStream(filepath,{
    start,
    end,
});

fileStream.pipe(res);

});
app.listen(3000,()=>{
 console.log("Server is running on the port ");
});