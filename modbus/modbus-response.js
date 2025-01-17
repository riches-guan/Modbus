module.exports=function(a){
    require("source-map-support").install();
    var s=require("./modbus-basics");
    a.nodes.registerType("modbus-response",function(e){
        a.nodes.createNode(this,e),this.registerShowMax=e.registerShowMax;
        var t=this;
        s.setNodeStatusTo("initialized",t),t.on("input",function(e){var a="default";
            switch(Object.prototype.hasOwnProperty.call(e.payload,"data")&&(a="data"),a=Object.prototype.hasOwnProperty.call(e.payload,"address")?"address":a){
                case"data":e.payload.data.length>t.registerShowMax?s.setNodeStatusResponse(e.payload.data.length,t):s.setNodeStatusByResponseTo("active",e.payload,t);break;
                case"address":e.payload.length&&e.payload.length>t.registerShowMax?s.setNodeStatusResponse(e.payload.length,t):s.setNodeStatusByResponseTo("active",e.payload,t);break;
                default:s.setNodeStatusByResponseTo("active",JSON.stringify(e.payload),t)
            }
        }),
            t.on("close",function(){s.setNodeStatusTo("closed",t)})}
    )
};
//# sourceMappingURL=maps/modbus-response.js.map
