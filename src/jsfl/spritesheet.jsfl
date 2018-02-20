var doc = fl.getDocumentDOM();
var targetName = doc.name.replace(".fla","");
var currentDir = doc.pathURI;
currentDir = currentDir.substr(0,currentDir.lastIndexOf('/')+1);
fl.trace(currentDir)

function run(ver,jsURL,htmlURL,jsons,isConvert){
	var manifest={arr:null,a:0,b:0};
	isConvert=isConvert=="true";

	//ver
	var images
	var Rectangle
	fl.trace(ver)
	if(ver=="v1.0"){
		images="images";
		Rectangle="Rectangle"
	}else{
		images="img";
		Rectangle="cjs.Rectangle"
	}

	//get js and html files
	var jsStr = read(jsURL);
	var htmlStr=read(htmlURL);
	if(isConvert)jsStr=convert(jsStr);
	
	//get join　list
	jsons=jsons.split(",")

	replaceManifest0();

	//run jsons
	for(var i=0;i<jsons.length;i++){
		try{
			var jsonStr = read( jsons[i] );
			if(jsons[i].lastIndexOf(".json")>0){
				var a=jsons[i].lastIndexOf("/");
				var json = eval("("+jsonStr+")");
				replaceSS(json,jsons[i].substring(0,a));
			}else{
				addJS(jsonStr);
			}
		}catch(e){
			fl.trace(jsons[i]+"=error")
		}
	}
	replaceInclude();
	notUseClassDelete();
	//var a=jsStr.indexOf("_x")
	//fl.trace(jsStr.substr(a+2,1)=="\r")
	write( jsURL, jsStr);
	writeManifest();
	write( htmlURL,htmlStr);
	//end
	function replaceSS(json,dir){
		var spriteId = images+"."+json.meta.image.slice(0,-4);
		for each(var ele in json.frames){
			var id = ele.filename;
			id=id.replace(".png","");
			id=id.replace(".jpg","");
			id=id.replace(".gif","");
			fl.trace(id);
			deleteManifest(id);

			var oldStr = "this.initialize("+images+"."+id
			var newStr = "this.sourceRect=new "+Rectangle+"("
				+ele.frame.x+","
				+ele.frame.y+","		
				+ele.frame.w+","
				+ele.frame.h+");\n"
				+"    this.initialize("+spriteId
			jsStr=jsStr.replace(oldStr,newStr);
		}
		
		manifest.arr.push({src:dir+"/"+json.meta.image, id:json.meta.image.slice(0,-4)});
	}
	function replaceManifest0(){
		try{
			manifest.a=htmlStr.indexOf("var manifest = [")+15;
			if(manifest.a<0){
				return;
			}
			manifest.b=htmlStr.indexOf("];",manifest.a)+1
			manifest.arr=eval(htmlStr.substring(manifest.a,manifest.b));
		}catch(e){}
	}
	function deleteManifest(id){
		for(var i=0;i<manifest.arr.length;i++){
			if(id==manifest.arr[i].id){
				manifest.arr.splice(i,1);
				break;
			}
		}
	}
	function writeManifest(){
		if(manifest.arr){
			var str=""
			for(var i=0;i<manifest.arr.length;i++){
				if(i>0)str+=',\n';
				
				var obj=manifest.arr[i];
				str+='\t\t{src:"'+obj.src+'", id:"'+obj.id+'"}';
			}
			htmlStr=htmlStr.substring(0,manifest.a+2)+str+htmlStr.substring(manifest.b-3);
		}
	}
	function replaceInclude(){
		while(true){
			var i=jsStr.indexOf("#include");
			if(i<0)break;
			
			var a=jsStr.indexOf('"',i)+1;
			var b=jsStr.indexOf('"',a);
			
			//fl.trace(jsStr.substring(a,b));
			try{
				var str = read("./"+jsStr.substring(a,b));
				if(isConvert)str=convert(str);
				
				jsStr=jsStr.substring(0,i)+str+jsStr.substring(b+1);
			}catch(e){
				fl.trace(jsons[i]+"error")
			}
		}
	}
	function addJS(js){
		var i=jsStr.indexOf("// stage content:");
		jsStr=jsStr.substring(0,i)+js+jsStr.substring(i);
	}
	function notUseClassDelete(){
		var i=0;
		while(true){
			i=jsStr.indexOf("initialize("+images+".",i);
			if(i<0)break;
			
			var a=jsStr.indexOf('.',i)+1;
			var b=jsStr.indexOf(')',a);
			
			var str=jsStr.substring(a,b);
			//fl.trace(str)
			//fl.trace(jsStr.split("lib."+str+"(").length)
			if(jsStr.split("lib."+str+"(").length<=1){
				var c=jsStr.lastIndexOf("(lib.",i)-1;
				var c2=jsStr.lastIndexOf("(lib."+str+" = function",i)-1;
				if(c==c2){
					var d=jsStr.indexOf("Rectangle",i)
					d=jsStr.indexOf(");",d)+4;
					//fl.trace(jsStr.substring(c,d));
					jsStr=jsStr.substr(0,c)+jsStr.substr(d);
					i=c;
					deleteManifest(str)
				}
			}
			i++;
		}
	}
}
function convert(str){
	logArr=[];

	var wordSplit=".;: =|&!/\t\r\n(){}[]+-*<>"
	var toJS={
		_root:"exportRoot",
		_visible:"visible",
		_x:"x",
		_y:"y",
		_alpha:"alpha",
		_xscale:"scaleX",
		_yscale:"scaleY",
		_rotation:"rotation",
		_parent:"parent",
		trace:"console.log",
		onEnterFrame:"onTick"
		//call:""
	}
	var toAS2={}
	for(var i in toJS){
		toAS2[toJS[i]]=i;
	}
	
	var jsStr = str;
	jsStr=switchWord(jsStr);
	jsStr=replaceWord(jsStr);
	jsStr=dellModel(jsStr)
	return jsStr;
	
	function replaceWord(str){
		for(var i in toJS){
			var index=0;
			while(index>=0){
				index=str.indexOf(i,index);
				if(index<0)break;
				if(wordSplit.indexOf(str.substr(index-1,1))>=0 && wordSplit.indexOf(str.substr(index+i.length,1))>=0){
					switch(i){
						case "call":
						str=str.substr(0,index)+"call(this,"+str.substr(index+i.length+1);
						break
						default:
						str=str.substr(0,index)+toJS[i]+str.substr(index+i.length);
						break
					}
				}
				index++;
			}
		}
		return str;
	}
	
	function switchWord(str){
		
		var index=0;
		var i;
		while(index>=0){
			index=str.indexOf("//ts ",index);
			if(index<0)break;
			switch(str.substr(index+5,2)){
				case "as":
					i=str.indexOf("//ts",index+5);//next tag
					if(i>0 && str.substr(i,5)=="//ts/"){//close tag
						i=str.indexOf("\n",i)
					}else{//not close tag
						//fl.trace("--------")
						i=str.indexOf("\n",index+9)
					}
					index=str.lastIndexOf("\n",index);
					
					//fl.trace(str.substring(index,i))
					str=str.substring(0,index)+str.substring(i);
				break
				case "js":
					i=str.indexOf("//ts",index+5);
					if(i>0 && str.substr(i,5)=="//ts/"){
						
					}else{
						i=str.indexOf("\n",index+9)
					}
					var _str=str.substring(index,i);
					_str=_str.split("\n//").join("\n");
					_str=_str.split("\t//").join("\t");
					str=str.substring(0,index)+_str+str.substring(i);
				break
			}
			index++;
		}
		return str;
	}
	
	function dellModel(str){
		var index=0;
		while(index>=0){
			index=str.indexOf("var ",index);
			if(index<0)break;
			index+=4;
			
			while(true){
				var colon=func(str,":",index);
				var br=func(str,"\n",index);
				var brr=func(str,"\r",index);
				if(brr>=0 && br>brr)br=brr;
				var kanma=func(str,",",index);
				var semi=func(str,";",index);
				if(colon<br && colon<kanma && colon<semi){
					var ikor=func(str,"=",index);
					var min = Math.min.apply(null, [br,kanma,semi,ikor]);
					str=str.substring(0,colon)+str.substring(min);
					if(kanma<br || kanma<semi){
						index=func(str,",",index)+2;
					}else{
						break
					}
				}else{
					break
				}
			}
		}
		index=0;
		while(index>=0){
			index=str.indexOf("(",index);
			if(index<0)break;
			index+=1;
			
			while(true){
				var colon=func(str,":",index);
				var toj=func(str,")",index);
				var br=func(str,"\n",index);
				var brr=func(str,"\r",index);
				if(brr>=0 && br>brr)br=brr;
				var kanma=func(str,",",index);
				var tyu=func(str,"{",index);
				if(colon<br && colon<kanma && colon<toj && colon<tyu){
					var ikor=func(str,"=",index);
					var min = Math.min.apply(null, [br,kanma,toj,ikor]);
					str=str.substring(0,colon)+str.substring(min);
					if(kanma<toj){
						index=str.indexOf(",",index)+2;
					}else{
						break
					}
				}else{
					break
				}
			}
		}
		index=0;
		while(index>=0){
			index=str.indexOf(")",index);
			if(index<0)break;
			index+=1;
			
			var colon=func(str,":",index);
			var br=func(str,"\n",index);
			var brr=func(str,"\r",index);
			var kanma=func(str,",",index);
			if(brr>=0 && br>brr)br=brr;
			var tyu=func(str,"{",index);
			if(colon<br && colon<tyu && colon<kanma){
				var min = Math.min.apply(null, [br,tyu]);
				str=str.substring(0,colon)+str.substring(min);
			}
		}
		return str;
	}
	function func(str,tar,index){
		var v=str.indexOf(tar,index);
		if(v==-1)v=str.length;
		return v;
	}
}
/* file io*/
function read(path){
	if(path.charAt(0) == '.'){
		path = currentDir+path;
	}
	var res = FLfile.read( FLfile.platformPathToURI(path) );
	if(!res){
		res = FLfile.read(path);
	}
	return res;
}
function write(path,str){
	if(path.charAt(0) == '.'){
		path = currentDir+path;
	}
	var res = FLfile.write( FLfile.platformPathToURI(path) ,str);
	if(!res){
		res = FLfile.write(path,str);
	}
	return res;
}