function func(){ 
	var doc = fl.getDocumentDOM();
	var lib = doc.library;

	//fl.outputPanel.clear();

	var selectedItems = lib.getSelectedItems();
	var numItem = selectedItems.length;

	var arr=[]
	if(numItem == 0){
		fl.trace('何も選択されていません');
	}else{
		for(var i = 0; i < numItem; i++){
			var item = selectedItems[i];
			
			if(item.sourceFileExists){
				var name = item.name;
				var a=name.lastIndexOf("/");
				var b=name.lastIndexOf(".");
				name=name.substring(a+1,b);
				var path=item.sourceFilePath
				
				arr.push(name)
				arr.push(path);
			}
		}
		fl.trace("処理が完了しました。クリップボードにコピーされています。");
	}
	return arr.join(",");
}