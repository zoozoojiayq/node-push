/*
	链接管理，由主进程管理
*/

module.exports = {
	tagmanager:new TagManager(),
	aliasmanager:new AliasManager()
}

//标签管理
function TagManager(){
	this.tagCollection = {};
}
TagManager.prototype.add = function(tag,con){
	var cons = this.tagCollection[tag];
	if(!cons){
		cons = new Array();
	}
	cons.push(con);
	this.tagCollection[tag] = cons;
}
TagManager.prototype.get = function(tag){
	return this.tagCollection[tag];
}


/********************************************/

//别名管理
function AliasManager(){
	this.aliasCollection = {};
}
AliasManager.prototype.add = function(alias,con){
	this.aliasCollection[alias] = con;
}
AliasManager.prototype.get = function(alias){
	return this.aliasCollection[alias];
}
