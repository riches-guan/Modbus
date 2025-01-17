require("source-map-support").install();
var de=de||{biancoroyal:{modbus:{basics:{}}}};
de.biancoroyal.modbus.basics.internalDebug=de.biancoroyal.modbus.basics.internalDebug||require("debug")("contribModbus:basics"),
    de.biancoroyal.modbus.basics.util=de.biancoroyal.modbus.basics.util||require("util"),
    de.biancoroyal.modbus.basics.statusLog=!1,
    de.biancoroyal.modbus.basics.get_timeUnit_name=function(e){
        var s="";switch(e){case"ms":s="msec.";
        break;case"s":s="sec.";break;case"m":s="min.";
        break;case"h":s="h."}return s},
    de.biancoroyal.modbus.basics.calc_rateByUnit=function(e,s){
        switch(s){case"ms":break;case"s":e=1e3*parseInt(e);
        break;
        case"m":e=6e4*parseInt(e);break;case"h":e=36e5*parseInt(e);break;default:e=1e4}return e},
    de.biancoroyal.modbus.basics.setNodeStatusProperties=function(e,s){
        var o="yellow",t="ring",a=(e=e||"waiting").value||e;
        switch(a){
                case"connecting":o="yellow",t="ring";
                break;
                case"error":o="red",t="ring";
                break;
                case"initialized":case"init":o="yellow",t="dot";
                break;
                case"not ready to read":case"not ready to write":o="yellow",t="ring";
                break;
                case"connected":case"queueing":case"queue":o="green",t="ring";
                break;
                case"timeout":o="red",t="ring";
                break;
                case"active":case"reading":case"writing":case"active reading":case"active writing":s||(a="active"),o="green",t="dot";
                break;
                case"disconnected":case"terminated":o="red",t="ring";
                break;
                case"stopped":o="red",t="dot";
                break;
                case"polling":o="green",t=s?"ring":(a="active","dot");
                break;
                default:"waiting"===a&&(o="blue",a="waiting ...")
        }return{
                fill:o,shape:t,status:a
        }
    },
    de.biancoroyal.modbus.basics.setNodeStatusByResponseTo=function(e,s,o){
        var t="red",a="dot";
        switch(e){
                case"initialized":case"queue":t="green",a="ring";break;
                case"active":t="green",a="dot";break;
                default:e&&"waiting"!==e||(t="blue",e="waiting ...")
        }
        o.status({fill:t,shape:a,text:this.util.inspect(s,!1,null)})
    },
    de.biancoroyal.modbus.basics.setNodeStatusResponse=function(e,s){
        s.status({fill:"green",shape:"dot",text:"active got length: "+e})
    },
    de.biancoroyal.modbus.basics.setModbusError=function(e,s,o,t){
        if(o)switch(o.message){
                case"Timed out":this.setNodeStatusTo("timeout",e);break;
                case"FSM Not Ready To Reconnect":this.setNodeStatusTo("not ready to reconnect",e);break;
                case"Port Not Open":this.setNodeStatusTo("reconnect",e),s.emit("reconnect");break;
                default:this.internalDebug(o.message),e.showErrors&&this.setNodeStatusTo("error "+o.message,e)
        }
    },
    de.biancoroyal.modbus.basics.setNodeStatusTo=function(e,s){
        var o;
        s.showStatusActivities&&(e!==s.statusText?(o=this.setNodeStatusProperties(e,s.showStatusActivities),s.statusText=e,
            s.status({fill:o.fill,shape:o.shape,text:o.status})):this.setNodeDefaultStatus(s))
    },
    de.biancoroyal.modbus.basics.onModbusInit=function(e){this.setNodeStatusTo("initialize",e)},
    de.biancoroyal.modbus.basics.onModbusConnect=function(e){this.setNodeStatusTo("connected",e)},
    de.biancoroyal.modbus.basics.onModbusActive=function(e){this.setNodeStatusTo("active",e)},
    de.biancoroyal.modbus.basics.onModbusError=function(e,s){this.setNodeStatusTo("failure",e),e.showErrors&&e.warn(s)},
    de.biancoroyal.modbus.basics.onModbusClose=function(e){this.setNodeStatusTo("closed",e)},
    de.biancoroyal.modbus.basics.onModbusQueue=function(e){this.setNodeStatusTo("queueing",e)},
    de.biancoroyal.modbus.basics.onModbusBroken=function(e,s){this.setNodeStatusTo("reconnecting after "+s.reconnectTimeout+" msec.",e)},
    de.biancoroyal.modbus.basics.setNodeDefaultStatus=function(e){e.status({fill:"green",shape:"ring",text:"active"})},
    de.biancoroyal.modbus.basics.initModbusClientEvents=function(s,e){
        var o=this;s.showStatusActivities?(e.on("mbinit",function(){o.onModbusInit(s)}),
                e.on("mbqueue",function(){o.onModbusQueue(s)}),
                e.on("mbconnected",function(){o.onModbusConnect(s)}),
                e.on("mbbroken",function(){o.onModbusBroken(s,e)}),
                e.on("mbactive",function(){o.onModbusActive(s)}),
                e.on("mberror",function(e){o.onModbusError(s,e)}),
                e.on("mbclosed",function(){o.onModbusClose(s)})):this.setNodeDefaultStatus(s)
    },
    de.biancoroyal.modbus.basics.invalidPayloadIn=function(e){return!(e&&Object.prototype.hasOwnProperty.call(e,"payload"))},
    de.biancoroyal.modbus.basics.invalidSequencesIn=function(e){return!(e&&Object.prototype.hasOwnProperty.call(e,"sequences"))},
    de.biancoroyal.modbus.basics.sendEmptyMsgOnFail=function(e,s,o){e.emptyMsgOnFail&&(o.payload="",s&&s.message&&s.name?o.error=s:o.error=Error(s),o.error.nodeStatus=e.statusText,e.send([o,o]))},
    de.biancoroyal.modbus.basics.logMsgError=function(e,s,o){e.showErrors&&e.error(s,o)},
    de.biancoroyal.modbus.basics.buildNewMessage=function(e,s,o){return e?Object.assign(s,o):o},
    module.exports=de.biancoroyal.modbus.basics;
//# sourceMappingURL=maps/modbus-basics.js.map
