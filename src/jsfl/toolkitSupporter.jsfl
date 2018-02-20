function change(arg1,arg2,spPath,fpPath,isCjs,isFp,isSp,isConvert){
	var i
	var cjsData = fl.getDocumentDOM().getDataFromDocument("CreateJSToolkit_data");
	if(cjsData==""){
		var arr=["outputPath",""];
	}else{
		var arr=cjsData.split("\n");
	}
	for(i=0;i<arr.length;i++){
		switch(arr[i]) {
			case "outputPath":
				arr[i+1] = arg1
				i = arr.length;
				break;
		}
	}
	
	cjsData=arr.join("\n")
	fl.getDocumentDOM().addDataToDocument("CreateJSToolkit_data", "string", cjsData)
	
	//-----------------------
	arr=["jsonPath",arg2,"spPath",spPath,"fpPath",fpPath,"isCjs",isCjs,"isFp",isFp,"isSp",isSp,"isConvert",isConvert];
	cjsData=arr.join("\n")
	fl.getDocumentDOM().addDataToDocument("CreateJSToolkit_data2", "string", cjsData)
}
function save(){
	var str=fl.getDocumentDOM().pathURI;
	fl.saveDocument(fl.getDocumentDOM());
	fl.closeDocument(fl.getDocumentDOM())
	fl.openDocument(str)
}