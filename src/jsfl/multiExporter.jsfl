var dom;
var lib;
var arr;

var isXFL;
var a;
var host;

var allList;
var fpList;
var spList;
var swfList;
var jsList;
var dellList;

function exportSWF(fpPath,spPath){
	fl.saveDocument(fl.getDocumentDOM());
	/*
	Ver 3.0 custum
	//_sp=../sp/_sp.swf;
	//_fp=_fp.swf;
	*/
	dom=fl.getDocumentDOM()
	lib=dom.library;
	arr = lib.items;

	isXFL=dom.pathURI.lastIndexOf(".xfl")>=0;//xflかどうか確認
	a=dom.pathURI.lastIndexOf("/");
	host=dom.pathURI.substring(0,a+1)

	
	//書き出し先を参照
	var spp=spPath;
	if(isXFL){spp="../"+spp;}
	spp=host+spp;

	//fp
	var fpp=fpPath
	if(isXFL){fpp="../"+fpp;}
	fpp=host+fpp;

	allList=[]
	fpList=[]
	spList=[]
	swfList=[]
	jsList=[]
	dellList=[]

	listUp();

	if(fpPath!=""){
		func(allList,"normal");
		func(jsList,"guide");
		func(spList,"guide");
		dom.exportSWF(fpp,true);
	}
	
	if(spPath!=""){
		func(allList,"normal");
		func(fpList,"guide");
		func(jsList,"guide");
		dom.exportSWF(spp,true);
	}
	
	func(allList,"normal");
	dell_fp_swf();
	//func(allList,"normal");
	//func(swfList,"guide");
	//func(fpList,"guide");
}
function set_spSwf(){
	//func(allList,"normal");
	//func(fpList,"guide");
	//func(jsList,"guide");
	var str=fl.getDocumentDOM().pathURI;
	fl.saveDocument(fl.getDocumentDOM(),str+".fla");
	fl.closeDocument(fl.getDocumentDOM())
	fl.openDocument(str)
	FLfile.remove(str+".fla")
}

function listUp(){
	for(var i=0;i<arr.length;i++){
		if(arr[i].itemType=="folder"){
		}else if(arr[i].itemType=="movie clip" || arr[i].itemType=="graphic"){
			run(arr[i].timeline)
		}
	}
	run(fl.getDocumentDOM().timelines[0]);
}
function run(tl){
	var layer = tl.layers;
	//fl.trace(tl+"hogehgoeh")
	//fl.trace(layer)
	for(var n=0;n<layer.length;n++){
		var str=layer[n].name;
		var boo=false;
		
		if(str.indexOf("_fp")>=0){
			boo=true
			fpList.push(layer[n])
			dellList.push([tl,n])
		}else if(str.indexOf("_sp")>=0){
			boo=true
			spList.push(layer[n])
		}

		if(str.indexOf("_swf")>=0){
			boo=true
			swfList.push(layer[n])
			dellList.push([tl,n])
		}else if(str.indexOf("_js")>=0){
			boo=true
			jsList.push(layer[n])
		}
		
		if(boo){
			allList.push(layer[n])
		}
	}
}
function func(arr,str){
	for(var i=0;i<arr.length;i++){
		var layer = arr[i]
		layer.layerType=str
	}
}
function dell_fp_swf(){
	for(var i=0;i<dellList.length;i++){
		var arr = dellList[i];
		var tl=arr[0];
		var index=arr[1];
		tl.deleteLayer(index);
		var index2=tl.addNewLayer();
		tl.reorderLayer(index2, index ,true);
	}
}