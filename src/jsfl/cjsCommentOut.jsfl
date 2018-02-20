var logArr
//convert()
function convert(){
	var doc = fl.getDocumentDOM();
	var lib=doc.library;
	var items = lib.items;
	logArr=[];
	
	for(var i=0;i<items.length;i++){
		if(items[i].itemType=="folder"){
		}else if(items[i].itemType=="movie clip" || items[i].itemType=="graphic"){
			readTL(items[i].timeline)
		}
	}
	readTL(doc.timelines[0]);

	//prevData()
	function readTL(tl){
		for(var i=0;i<tl.layers.length;i++){
			readLayer(tl.layers[i])
		}
	}
	function readLayer(layer,tar){
		for(var i=0;i<layer.frames.length;i++){
			readFrame(layer.frames[i],i)
		}
	}
	function readFrame(frame,index){	
		var str=frame.actionScript
		var i=0;
		if(str!="" && frame.startFrame==index){
			//logArr.push({frame:frame,as:str});		
			frame.actionScript="/* js\n"+str+"\n*/"
		}
	}
}
function rollBack(){
	//for(var i=0;i<logArr.length;i++){
	//	var obj=logArr[i]
//		obj.frame.actionScript=obj.as;
	//}
//	logArr=null;
}