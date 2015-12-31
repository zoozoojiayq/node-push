/*
	消息推送服务器：
	支持点对点和广播订阅模式。
	点对点模式：给每一个链接创建一个消息队列，待发送的消息放入消息队列中
	广播订阅模式：由点对点实现，向广播对象的消息队列中分别插入一条消息。
*/
var cluster = require("cluster");
var net = require("net");
var os = require("os");
var conManager = require("./connectmanager.js");

var serverport = 1234;
var con_count = 0 ;
const NEW_CONNECTION = "addCon";
const REMOVE_CONNECTION = "closeCon";

/*
	主进程代码
*/
if(cluster.isMaster){
	console.log("[master:]start master...");
	var cpulength = os.cpus().length;
	for(var i=0; i<cpulength; i++){
		var w = cluster.fork();
	}

	for(var id in cluster.workers){
		recieveMessage(cluster.workers[id]);
	}

	function recieveMessage(w){
		w.on("message",function(args){
			if(args == NEW_CONNECTION){
				con_count++;
			}else if(args == REMOVE_CONNECTION){
				con_count--;
			}
			console.log("count connections:"+con_count);
		});
	}
/*
	工作进程代码
*/
}else if(cluster.isWorker){
	console.log("[worker:"+cluster.worker.id+"]start workder :"+cluster.worker.id);

	var server = net.createServer();
	server.listen(serverport,function(){
		console.log("[worker:"+cluster.worker.id+"] start tcp server at port:"+serverport);
	});

	server.on("connection",function(con){
		var remoteAddress = con.remoteAddress;
		var remotePort = con.remotePort;
		var remoteInfo = remoteAddress+":"+remotePort;
		process.send(NEW_CONNECTION);
		con.on("close",function(){
			process.send(REMOVE_CONNECTION);
		});
		con.on("error",function(args){
			console.log(args);
		});
	});

}