module.exports=function(t){require("source-map-support").install();var o=require("jsmodbus"),i=require("net"),n=require("./core/modbus-server-core"),a=require("./modbus-basics"),u=require("debug")("contribModbus:server");try{t.nodes.registerType("modbus-server",function(e){t.nodes.createNode(this,e),this.name=e.name,this.logEnabled=e.logEnabled,this.hostname=e.hostname||"0.0.0.0",this.serverPort=parseInt(e.serverPort),this.responseDelay=parseInt(e.responseDelay)||1,this.delayUnit=e.delayUnit,this.showStatusActivities=e.showStatusActivities||!1,this.coilsBufferSize=parseInt(8*e.coilsBufferSize),this.holdingBufferSize=parseInt(8*e.holdingBufferSize),this.inputBufferSize=parseInt(8*e.inputBufferSize),this.discreteBufferSize=parseInt(8*e.discreteBufferSize),this.showErrors=e.showErrors,this.internalDebugLog=u,this.verboseLogging=t.settings.verbose;var r=this,e=(r.netServer=null,r.modbusServer=null,a.setNodeStatusTo("initialized",r),"warn");t.settings.verbose&&(e="debug");try{r.netServer=new i.Server,r.modbusServer=new o.server.TCP(r.netServer,{logLabel:"ModbusServer",logLevel:e,logEnabled:r.logEnabled,responseDelay:a.calc_rateByUnit(r.responseDelay,r.delayUnit),coils:Buffer.alloc(r.coilsBufferSize,0),holding:Buffer.alloc(r.holdingBufferSize,0),input:Buffer.alloc(r.inputBufferSize,0),discrete:Buffer.alloc(r.discreteBufferSize,0)}),r.modbusServer.on("connection",function(e){u("Modbus Server client connection"),e&&e.socket&&u("Modbus Server client to "+JSON.stringify(e.socket.address())+" from "+e.socket.remoteAddress+" "+e.socket.remotePort),a.setNodeStatusTo("active",r)}),r.netServer.listen(r.serverPort,r.hostname,function(){u("Modbus Server listening on modbus://"+r.hostname+":"+r.serverPort),a.setNodeStatusTo("initialized",r)}),r.showStatusActivities||a.setNodeDefaultStatus(r)}catch(e){u(e.message),r.showErrors&&r.warn(e),a.setNodeStatusTo("error",r)}function s(e){return[{type:"holding",message:e,payload:r.modbusServer.holding},{type:"coils",message:e,payload:r.modbusServer.coils},{type:"input",message:e,payload:r.modbusServer.input},{type:"discrete",message:e,payload:r.modbusServer.discrete},{payload:"request",type:"message",message:e}]}r.netServer.on("error",function(e){u(e.message),r.showErrors&&r.error(e),a.setNodeStatusTo("error",r)}),r.on("input",function(e){n.isValidMemoryMessage(e)?(n.writeToServerMemory(r,e),e.payload.disableMsgOutput||r.send(s(e))):(r.showErrors&&r.error("Is Not A Valid Memory Write Message To Server",e),n.isValidMessage(e)&&!e.payload.disableMsgOutput&&r.send(s(e)))}),r.on("close",function(e){a.setNodeStatusTo("closed",r),r.netServer?r.netServer.close(function(){u("Modbus Server closed"),e(),r.removeAllListeners(),r.netServer.removeAllListeners()}):(e(),r.removeAllListeners()),r.modbusServer=null})})}catch(e){u(e.message)}};
//# sourceMappingURL=maps/modbus-server.js.map
