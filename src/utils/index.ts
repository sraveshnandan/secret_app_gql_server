import os from "os"
import { StatusSecret } from "../config";
// Function to authenticate User 
export const Authenticate = ()=>{

}

// Function to Get system information 
export const StatusInfo = (secret:string)=>{
    const data = {
      os:os.hostname(),
      arch:os.arch(),
      platform:os.platform(),
      release:os.release(),
      machine:os.machine(),
      memory:os.totalmem(),
      uptime:os.uptime() ,
      user:os.userInfo(),
      network:os.networkInterfaces().lo[0],
    }
    if (secret !== StatusSecret) {
      return null
    }
    return data;
}
