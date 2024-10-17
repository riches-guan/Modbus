module.exports=function(t){
    require("source-map-support").install();
    var n=require("./modbus-basics"),o=require("./core/modbus-core"),a=require("./core/modbus-io-core"),u=require("debug")("contribModbus:poller");
    t.nodes.registerType("modbus-flex-sequencer",
        function(e){
            t.nodes.createNode(this,e),this.name=e.name,this.sequences=e.sequences,this.showStatusActivities=e.showStatusActivities,this.showErrors=e.showErrors,this.showWarnings=e.showWarnings,this.connection=null,this.useIOFile=e.useIOFile,this.ioFile=t.nodes.getNode(e.ioFile),this.useIOForPayload=e.useIOForPayload,this.logIOActivities=e.logIOActivities,this.emptyMsgOnFail=e.emptyMsgOnFail,this.keepMsgProperties=e.keepMsgProperties,this.internalDebugLog=u,this.verboseLogging=t.settings.verbose,this.delayOnStart=e.delayOnStart,this.startDelayTime=Number(e.startDelayTime)||10;var i=this,r=(i.bufferMessageList=new Map,i.INPUT_TIMEOUT_MILLISECONDS=1e3,i.delayOccured=!1,i.inputDelayTimer=null,n.setNodeStatusTo("waiting",i),t.nodes.getNode(e.server));
            if(!r)throw new Error("未找到Modbus客户端");
            function s(e){t.settings.verbose&&i.showWarnings&&i.warn("Flex-Sequencer -> "+e)}
            r.registerForModbus(i),n.initModbusClientEvents(i,r),
                i.onModbusReadDone=function(e,t){i.showStatusActivities&&n.setNodeStatusTo("读取节点",i),i.send(a.buildMessageWithIO(i,e.data,e,t)),i.emit("modbusFlexSequencerNodeDone")},
                i.errorProtocolMsg=function(e,t){i.showErrors&&n.logMsgError(i,e,t)},
                i.onModbusReadError=function(e,t){i.internalDebugLog(e.message);var s=o.getOriginalMessage(i.bufferMessageList,t);i.errorProtocolMsg(e,s),n.sendEmptyMsgOnFail(i,e,t),n.setModbusError(i,r,e,s),i.emit("modbusFlexSequencerNodeError")},
                i.prepareMsg=function(e){switch((e="string"==typeof e?JSON.parse(e):e).fc){case"FC1":e.fc=1;break;case"FC2":e.fc=2;break;case"FC3":e.fc=3;break;case"FC4":e.fc=4}return e.unitid=parseInt(e.unitid),e.address=parseInt(e.address)||0,e.quantity=parseInt(e.quantity)||1,e},
                i.isValidModbusMsg=function(e){return Number.isInteger(e.unitid)&&0<=e.unitid&&e.unitid<=255?Number.isInteger(e.address)&&0<=e.address&&e.address<=65535?!!(Number.isInteger(e.quantity)&&1<=e.quantity&&e.quantity<=65535)||(i.error("数量无效",e),!1):(i.error("地址无效",e),!1):(i.error("单元ID无效",e),!1)},i.buildNewMessageObject=function(e,t){var s=o.getObjectId();return{topic:t.topic||e.id,messageId:s,payload:{name:t.name,unitid:t.unitid,fc:t.fc,address:t.address,quantity:t.quantity,emptyMsgOnFail:e.emptyMsgOnFail,keepMsgProperties:e.keepMsgProperties,messageId:s}}},
                i.isReadyForInput=function(){return r.client&&r.isActive()&&i.delayOccured},i.isNotReadyForInput=function(){return!i.isReadyForInput()},
                i.resetInputDelayTimer=function(){i.inputDelayTimer&&(s("重置输入延迟定时器节点 "+i.id),clearTimeout(i.inputDelayTimer)),i.inputDelayTimer=null,i.delayOccured=!1},
                i.initializeInputDelayTimer=function(){i.resetInputDelayTimer(),i.delayOnStart?(s("初始化输入延迟定时器节点 "+i.id),i.inputDelayTimer=setTimeout(function(){i.delayOccured=!0},i.INPUT_TIMEOUT_MILLISECONDS*i.startDelayTime)):i.delayOccured=!0},
                i.initializeInputDelayTimer(),i.on("input",function(e){if(n.invalidPayloadIn(e))s("输入信息无效。");
                else if(i.isNotReadyForInput())s("在节点未准备好输入时进行注入。");
                else if(r.isInactive())s("您向非活动客户端发送了输入。请在启动时使用初始延迟或更慢地发送数据。");
                else{var t=Object.assign({},e),e=(n.invalidSequencesIn(e)?i:e).sequences;
                try{e.forEach(function(e){var t,e=i.prepareMsg(e);i.isValidModbusMsg(e)&&(t=i.buildNewMessageObject(i,e),i.bufferMessageList.set(t.messageId,n.buildNewMessage(i.keepMsgProperties,e,t)),r.emit("readModbus",t,i.onModbusReadDone,i.onModbusReadError))})}catch(e){i.errorProtocolMsg(e,t),n.sendEmptyMsgOnFail(i,e,t)}i.showStatusActivities&&n.setNodeStatusTo(r.actualServiceState,i)}}),
                i.on("close",function(e){n.setNodeStatusTo("closed",i),i.bufferMessageList.clear(),r.deregisterForModbus(i.id,e)}),
            i.showStatusActivities||n.setNodeDefaultStatus(i)
        }
    )
};
//# sourceMappingURL=maps/modbus-flex-sequencer.js.map
