module.exports=function(o){require("source-map-support").install();
    var r=require("./modbus-basics"),d=require("./core/modbus-core"),u=require("./core/modbus-io-core"),l=require("debug")("contribModbus:read");
    o.nodes.registerType("modbus-read",function(e){
        o.nodes.createNode(this,e),this.name=e.name,this.topic=e.topic,this.unitid=e.unitid,this.dataType=e.dataType,this.adr=e.adr,this.quantity=e.quantity||1,this.rate=e.rate,this.rateUnit=e.rateUnit,
            this.delayOnStart=e.delayOnStart,this.startDelayTime=parseInt(e.startDelayTime)||10,this.showStatusActivities=e.showStatusActivities,this.showErrors=e.showErrors,this.showWarnings=e.showWarnings,
            this.connection=null,this.useIOFile=e.useIOFile,this.ioFile=o.nodes.getNode(e.ioFile),this.useIOForPayload=e.useIOForPayload,this.logIOActivities=e.logIOActivities,this.emptyMsgOnFail=e.emptyMsgOnFail,
            this.internalDebugLog=l,this.verboseLogging=o.settings.verbose;var s=this,n=!1;
        function i(e){s.verboseLogging&&s.showWarnings&&s.warn("读取 -> "+e+" 地址: "+s.adr)}s.INPUT_TIMEOUT_MILLISECONDS=1e3,s.statusText="waiting",s.delayTimerReading=!1,s.intervalTimerIdReading=!1,a(s.statusText),
            i("open node "+s.id);var t=o.nodes.getNode(e.server);
        function a(e){var i,t;"polling"===e&&n||(i=r.setNodeStatusProperties(e,s.showStatusActivities),t=s.statusText,-1!==e.search("active")||"polling"===e?(e=i.status+(" ( "+s.rate+" "+r.get_timeUnit_name(s.rateUnit))+" ) ",
            n=!1,e!==t&&s.status({fill:i.fill,shape:i.shape,text:e})):(e=i.status)!==t&&s.status({fill:i.fill,shape:i.shape,text:e}))}
        t&&(s.onModbusInit=function(){a("initialized")},s.onModbusConnect=function(){a("connected"),s.resetAllReadingTimer(),s.initializeReadingTimer()},s.onModbusRegister=function(){s.showStatusActivities
        &&a("registered"),t.serialSendingAllowed&&(s.resetAllReadingTimer(),s.initializeReadingTimer(),a("connected"))},s.onModbusActive=function(){a("active")},s.onModbusQueue=function(){a("queue")},
            s.onModbusError=function(e){a("failure"),t.reconnectOnTimeout&&s.resetAllReadingTimer(),s.showErrors&&s.warn(e)},s.onModbusClose=function(){a("closed"),s.resetAllReadingTimer()},
            s.onModbusBroken=function(){a("broken"),t.reconnectOnTimeout&&(a("reconnecting after "+t.reconnectTimeout+" msec."),s.resetAllReadingTimer())},s.onModbusReadDone=function(e,i){s.showStatusActivities
        &&a("reading done");var t,n,o=e.data,r=i.topic||s.topic;s.useIOFile&&s.ioFile.lastUpdatedAt?(s.logIOActivities&&u.internalDebug("node.adr:"+s.adr+" node.quantity:"+s.quantity),t=u.nameValuesFromIOFile(s,i,o,e,s.adr),
            t=u.filterValueNames(s,t,d.functionCodeModbusRead(s.dataType),s.adr,s.quantity),n={topic:r,responseBuffer:e,input:i,sendingNodeId:s.id},s.useIOForPayload?(n.payload=t,n.values=o):(n.payload=o,n.valueNames=t),
            s.send([n,{topic:r,payload:e,values:o,input:i,valueNames:t,sendingNodeId:s.id}])):s.send([{topic:r,payload:o,responseBuffer:e,input:i,sendingNodeId:s.id},{topic:r,payload:e,values:o,input:i,sendingNodeId:s.id}])},
            s.errorProtocolMsg=function(e,i){s.showErrors&&r.logMsgError(s,e,i)},s.onModbusReadError=function(e,i){s.internalDebugLog(e.message),s.errorProtocolMsg(e,i),r.sendEmptyMsgOnFail(s,e,i),r.setModbusError(s,t,e,i)},
            s.modbusPollingRead=function(){var e;t.client?(e={topic:s.topic||"polling",from:s.name,payload:{unitid:s.unitid,fc:d.functionCodeModbusRead(s.dataType),address:s.adr,quantity:s.quantity,messageId:d.getObjectId()}},
            s.showStatusActivities&&a("polling"),t.emit("readModbus",e,s.onModbusReadDone,s.onModbusReadError)):a("waiting")},s.resetDelayTimerToRead=function(e){e.delayTimerReading&&(i("resetDelayTimerToRead node "+e.id),
            clearTimeout(e.delayTimerReading)),e.delayTimerReading=null},s.resetIntervalToRead=function(e){e.intervalTimerIdReading&&(i("resetIntervalToRead node "+e.id),clearInterval(e.intervalTimerIdReading)),
            e.intervalTimerIdReading=null},s.resetAllReadingTimer=function(){s.resetDelayTimerToRead(s),s.resetIntervalToRead(s)},s.resetAllReadingTimer(),
            s.startIntervalReading=function(){s.intervalTimerIdReading||(i("startIntervalReading node "+s.id),s.intervalTimerIdReading=setInterval(s.modbusPollingRead,r.calc_rateByUnit(s.rate,s.rateUnit)))},
            s.initializeReadingTimer=function(){s.resetAllReadingTimer(),s.delayOnStart?(i("initializeReadingTimer delay timer node "+s.id),s.delayTimerReading=setTimeout(s.startIntervalReading,
                s.INPUT_TIMEOUT_MILLISECONDS*s.startDelayTime)):s.startIntervalReading()},s.removeNodeListenerFromModbusClient=function(){t.removeListener("mbinit",s.onModbusInit),t.removeListener("mbqueue",s.onModbusQueue),
            t.removeListener("mbconnected",s.onModbusConnect),t.removeListener("mbactive",s.onModbusActive),t.removeListener("mberror",s.onModbusError),t.removeListener("mbclosed",s.onModbusClose),t.removeListener("mbbroken",s.onModbusBroken),
            t.removeListener("mbregister",s.onModbusRegister),t.removeListener("mbderegister",s.onModbusClose)},this.on("close",function(e){s.resetAllReadingTimer(),s.removeNodeListenerFromModbusClient(),
            a("closed"),i("close node "+s.id),t.deregisterForModbus(s.id,e)}),s.showStatusActivities&&(t.on("mbinit",s.onModbusInit),t.on("mbqueue",s.onModbusQueue)),t.on("mbconnected",s.onModbusConnect),
            t.on("mbactive",s.onModbusActive),t.on("mberror",s.onModbusError),t.on("mbclosed",s.onModbusClose),t.on("mbbroken",s.onModbusBroken),t.on("mbregister",s.onModbusRegister),t.on("mbderegister",s.onModbusClose),
            t.registerForModbus(s))}),o.httpAdmin.post("/modbus/read/inject/:id",o.auth.needsPermission("modbus.inject.write"),
        function(i,t){i=o.nodes.getNode(i.params.id);if(i)try{i.modbusPollingRead(),t.sendStatus(200)}catch(e){t.sendStatus(500),i.error(o._("modbusinject.failed",{error:e.toString()}))}else t.sendStatus(404)})};
//# sourceMappingURL=maps/modbus-read.js.map
