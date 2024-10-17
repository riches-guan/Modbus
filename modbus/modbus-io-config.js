module.exports=function(i){
    require("source-map-support").install();
    var r=require("./core/modbus-io-core");
    i.nodes.registerType("modbus-io-config",
        function(e){var a,t=require("fs-extra"),n=(i.nodes.createNode(this,e),this.name=e.name,this.path=e.path,this.format=e.format,this.addressOffset=e.addressOffset,this);
            n.setMaxListeners(0),n.lastUpdatedAt=null,
            t.existsSync(n.path)?(a=function(){
                n.lineReader.removeAllListeners(),
                n.lineReader.on("error",function(e){r.internalDebug(e.message)}),
                n.lineReader.on("line",function(e){e&&n.configData.push(e)}),
                n.lineReader.on("end",function(){
                    n.lastUpdatedAt=Date.now(),
                    r.internalDebug("从文件读取IO完成 "+n.path),
                    n.warn({payload:r.allValueNamesFromIOFile(n),name:"IO文件中的Modbus值名称",path:n.path}),
                    n.emit("updatedConfig",n.configData)
                }),
                r.internalDebug("开始加载IO文件 "+n.path)
            },
            n.lineReader=new r.LineByLineReader(n.path),
            r.internalDebug("读取IO文件 "+n.path),
            n.configData=[],
            a(),
            n.watcher=t.watchFile(n.path,function(e,t){
                r.internalDebug("当前的mtime为: ".concat(e.mtime)),
                r.internalDebug("之前的mtime是: ".concat(t.mtime)),
                e.mtime!==t.mtime&&(r.internalDebug("重新加载IO文件 "+n.path),n.configData=[],delete n.lastUpdatedAt,n.lineReader.removeAllListeners(),n.lineReader=new r.LineByLineReader(n.path),a(),r.internalDebug("已开始重新加载IO文件 "+n.path))
            })
            ):(r.internalDebug("找不到IO文件 "+n.path),n.warn("未找到Modbus IO文件 "+n.path)),n.on("close",function(e){t.unwatchFile(n.path),n.watcher.stop(),n.lineReader.removeAllListeners(),n.removeAllListeners(),e()})
        }
    )
};
//# sourceMappingURL=maps/modbus-io-config.js.map
