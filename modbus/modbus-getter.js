module.exports=function(t){
    require("source-map-support").install();
    var r=require("./modbus-basics"),n=require("./core/modbus-core"),a=require("./core/modbus-io-core"),u=require("debug")("contribModbus:getter");
    t.nodes.registerType("modbus-getter",function(e){
        t.nodes.createNode(this,e),this.name=e.name,this.unitid=e.unitid,this.dataType=e.dataType,this.adr=e.adr,this.quantity=e.quantity,this.showStatusActivities=e.showStatusActivities,this.showErrors=e.showErrors,this.showWarnings=e.showWarnings,this.msgThruput=e.msgThruput,this.connection=null,this.useIOFile=e.useIOFile,this.ioFile=t.nodes.getNode(e.ioFile),this.useIOForPayload=e.useIOForPayload,this.logIOActivities=e.logIOActivities,this.emptyMsgOnFail=e.emptyMsgOnFail,this.keepMsgProperties=e.keepMsgProperties,this.internalDebugLog=u,this.verboseLogging=t.settings.verbose,this.delayOnStart=e.delayOnStart,this.startDelayTime=parseInt(e.startDelayTime)||10;
        var s=this,o=(s.bufferMessageList=new Map,s.INPUT_TIMEOUT_MILLISECONDS=1e3,s.delayOccured=!1,s.inputDelayTimer=null,r.setNodeStatusTo("waiting",s),t.nodes.getNode(e.server));
        function i(e){t.settings.verbose&&s.showWarnings&&s.warn("Getter -> "+e)}o&&(
            o.registerForModbus(s),r.initModbusClientEvents(s,o),s.onModbusCommandDone=function(e,t){s.showStatusActivities&&r.setNodeStatusTo("reading done",s),s.send(a.buildMessageWithIO(s,e.data,e,t)),s.emit("modbusGetterNodeDone")},s.errorProtocolMsg=function(e,t){s.showErrors&&r.logMsgError(s,e,t)},s.onModbusCommandError=function(e,t){s.internalDebugLog(e.message);
            var i=n.getOriginalMessage(s.bufferMessageList,t);s.errorProtocolMsg(e,i),r.sendEmptyMsgOnFail(s,e,t),r.setModbusError(s,o,e,i),s.emit("modbusGetterNodeError")},s.buildNewMessageObject=function(e,t){var i=n.getObjectId();return{topic:t.topic||e.id,messageId:i,payload:{value:t.payload.value||t.payload,unitid:e.unitid,fc:n.functionCodeModbusRead(e.dataType),address:e.adr,quantity:e.quantity,messageId:i}}},s.isReadyForInput=function(){return o.client&&o.isActive()&&s.delayOccured},s.isNotReadyForInput=function(){return!s.isReadyForInput()},s.resetInputDelayTimer=function(){s.inputDelayTimer&&(i("reset input delay timer node "+s.id),clearTimeout(s.inputDelayTimer)),s.inputDelayTimer=null,s.delayOccured=!1},s.initializeInputDelayTimer=function(){s.resetInputDelayTimer(),s.delayOnStart?(i("initialize input delay timer node "+s.id),s.inputDelayTimer=setTimeout(function(){s.delayOccured=!0},s.INPUT_TIMEOUT_MILLISECONDS*s.startDelayTime)):s.delayOccured=!0},s.initializeInputDelayTimer(),
                s.on("input",function(t){
                    if(r.invalidPayloadIn(t))i("输入信息无效。");
                    else if(s.isNotReadyForInput())i("在节点未准备好输入时进行注入。");
                    else if(o.isInactive())i("您向非活动客户端发送了输入。请在启动时使用初始延迟或更慢地发送数据。");
                    else{
                        t=Object.assign({},t);
                        try{var e=s.buildNewMessageObject(s,t);
                        s.bufferMessageList.set(e.messageId,r.buildNewMessage(s.keepMsgProperties,t,e)),o.emit("readModbus",e,s.onModbusCommandDone,s.onModbusCommandError),s.showStatusActivities&&r.setNodeStatusTo(o.actualServiceState,s)}catch(e){s.errorProtocolMsg(e,t),r.sendEmptyMsgOnFail(s,e,t)}
                    }
                   }
                ),
                s.on("close",function(e){
                    r.setNodeStatusTo("closed",s),s.resetInputDelayTimer(),s.removeAllListeners(),s.bufferMessageList.clear(),o.deregisterForModbus(s.id,e)
                    }
                ),
            s.showStatusActivities||r.setNodeDefaultStatus(s)
        )
       }
    )
};
//# sourceMappingURL=maps/modbus-getter.js.map
