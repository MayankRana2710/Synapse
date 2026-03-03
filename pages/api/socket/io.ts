// import {Server as NetServer} from "http";
// import {NextApiRequest} from "next";
// import {Server as ServerIO} from "socket.io";

// import { NextApiResponseServerIo } from "@/types";

// export const config ={
//     api:{
//         bodyParser:false,
//     },
// };

// const ioHandler = (req:NextApiRequest,res:NextApiResponseServerIo)=>{
//     if(!res.socket.server.io){
//         const path="/api/socket/io"
//         const httpServer:NetServer = res.socket.server as any;
//         const io=new ServerIO(httpServer,{
//             path:path,
//             addTrailingSlash:false,
//         });
//         res.socket.server.io=io;
//     }
//     res.end();
// }

// export default ioHandler;


import { Server as NetServer } from "http";
import { NextApiRequest } from "next";
import { Server as ServerIO } from "socket.io";

import { NextApiResponseServerIo } from "@/types";

export const config = {
    api: {
        bodyParser: false,
    },
};

// Catch the Next.js / Socket.io unhandled connection reset crashes
if (process.env.NODE_ENV !== "production") {
    if (!(global as any).uncaughtExceptionRegistered) {
        process.on("uncaughtException", (err: any) => {
            if (err.code === "ECONNRESET" || err.message?.includes("aborted")) {
                console.warn("Ignored harmless Socket.IO ECONNRESET error.");
                return;
            }
            console.error(err);
            process.exit(1);
        });
        (global as any).uncaughtExceptionRegistered = true;
    }
}

const ioHandler = (req: NextApiRequest, res: NextApiResponseServerIo) => {
    if (!res.socket.server.io) {
        const path = "/api/socket/io";
        const httpServer: NetServer = res.socket.server as any;
        const io = new ServerIO(httpServer, {
            path: path,
            // @ts-ignore
            addTrailingSlash: false,
        });
        res.socket.server.io = io;
    }
    res.end();
};

export default ioHandler;