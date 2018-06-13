//Author: Bobby Thomas (bobtxt@gmail.com)

var Air2 = function(){};

var FORM = function (_def) {
	var container;																									/*FORM OBJECT*/
	var _containerClass = "container";
    var _formContainerClass = "container-form"; 
	var _formTabClass = "form-tab"; 
	var POSTCONTROLS = [];	

	function _get(gc, path, CALLBACK){
		var xhttp = new XMLHttpRequest();
		xhttp.onreadystatechange = function() {
			if (xhttp.readyState == 4 && xhttp.status == 200) {
				CALLBACK(gc, xhttp.responseText);
			}
		};
		xhttp.open("GET", path, true);
		xhttp.send();
	}	

	function _attachSaveEvent(fc){
		var saveEvent = fc.getAttribute("save");
		if(saveEvent){
			var arrPos = POSTCONTROLS.length;
			POSTCONTROLS[arrPos] = [];
			var elem = fc.querySelectorAll("input,select,textarea"); 
			for(var c=0;c<elem.length;c++){
				var cBind = elem[c].getAttribute("bind");
				if(cBind){
					var innerLeng = POSTCONTROLS[arrPos].length;
					POSTCONTROLS[arrPos][innerLeng] = new Object();
					POSTCONTROLS[arrPos][innerLeng].Parent = elem[c].parentNode;
					POSTCONTROLS[arrPos][innerLeng].Control = elem[c];
				}
			}
		}																											/*FORM OBJECT*/
	}
	
	function _openRecordInTab(index, row, _this, _editTemplate){
		var divTab = document.getElementById("divTab");		 
		var tabTable = divTab.firstChild;		 	
		var _id = row.cells[index].innerHTML;
		var cellIndex = tabTable.rows[0].cells.length;
		var newCol = tabTable.rows[0].cells[cellIndex-1].cloneNode(true); 
		newCol.innerHTML = _this.innerHTML + " &nbsp;&nbsp;&nbsp;<div style=\"display:inline;background-color:#000;color:#fff;width:22px;height:8px;padding-left:5px;padding-right:5px;padding-bottom:2px;\" onclick=\"FORM.closeTab(this.parentNode);\">x</div>";
		newCol.onclick = function(){FORM.showTab(cellIndex, newCol);}
		tabTable.rows[0].appendChild(newCol);

		var formDiv = container.getElementsByClassName("form");
		if(formDiv && formDiv[0]){
			var RecordTab = document.createElement("DIV");
			RecordTab.className = _formTabClass;
			RecordTab.title = _this.innerHTML;
			
			var frameRecord = document.createElement("IFRAME");
			frameRecord.style.width = "1224px";
			frameRecord.style.height = "600px";
			frameRecord.frameBorder = "no";
			frameRecord.scrolling = "no";
			//frameRecord.style.border = "solid 1px #bbb";
			frameRecord.src = _editTemplate + "?id=" + _id;
			RecordTab.appendChild(frameRecord);
			formDiv[0].appendChild(RecordTab);
		}																											/*FORM OBJECT*/
		
		_showTab(cellIndex, newCol);
	}	
	
	function _renderFormTab(){
		var formTabs = container.getElementsByClassName(_formTabClass);
		if(formTabs.length == 1 && formTabs[0].getAttribute("title") == ""){
			return;
		}
		if(formTabs.length > 0){			
			var divTab = document.createElement("DIV");
			divTab.id = "divTab";
			divTab.className = "tab";
			var html = "<table border=\"1\" class=\"tab-table\" cellpadding=\"5\" style=\"border-collapse:collapse;\"><tr style=\"border:solid #bbb 1px;\">";
			for(var x=0;x<formTabs.length;x++){
				var title = formTabs[x].getAttribute("title");
				html += "<td onclick=\"FORM.showTab(" + x + ", this);\" class=\"tab-item\">" + title + "</td>";
			}
			html += "</tr></table>";
			divTab.innerHTML = html;
			container.insertBefore(divTab, container.firstChild);
		}
		
		var divTab = document.getElementById("divTab");
		if(divTab){																										/*FORM OBJECT*/
			 var tabTable = divTab.firstChild;
			 tabTable.rows[0].cells[0].style.backgroundColor = "#bbb";
			 tabTable.rows[0].cells[0].style.color = "white";		
		}
		
		var showTabIndex = -1;
		for(var x=0;x<formTabs.length;x++){
			var landing = formTabs[x].getAttribute("landing");
			if(landing && landing == "yes"){
				showTabIndex = x;
			}
		}
		if(showTabIndex == -1){
			showTabIndex = 0;
		}
		_showTab(showTabIndex, divTab.firstChild.firstChild.firstChild.childNodes[showTabIndex]);
	}
	
	function _closeTab(_cell){
		event.stopPropagation();
		_showTab(0, _cell.parentNode.cells[0]);		
		_cell.parentNode.removeChild(_cell);
	}
	
	function _showTab(index, _this){		
		 var divTab = document.getElementById("divTab");		 														/*FORM OBJECT*/
		 var tabTable = divTab.firstChild;	

		 for(var c=0;c<tabTable.rows[0].cells.length;c++){
			 tabTable.rows[0].cells[c].style.backgroundColor = "#fff";
			 tabTable.rows[0].cells[c].style.color = "#999";
		 }
		 
		_this.style.backgroundColor = "#bbb";
		_this.style.color = "white";		 
		
		var formTabs = container.getElementsByClassName(_formTabClass);
		for(var x=0;x<formTabs.length;x++){
			var ft = formTabs[x];	
			if(x == index){
				ft.style.display = "";
			}
			else{
				ft.style.display = "none";
			}
		}
	}
	
    return {
		CONTROLS: POSTCONTROLS,																							/*FORM OBJECT*/
		showTab: _showTab,
		openRecordInTab: _openRecordInTab,
		closeTab: _closeTab,
        render: function (CALLBACK) {
			//alert(document.location.search.);
            var _container = document.getElementsByClassName(_containerClass);
			if(_container && _container.length == 1){
				container = _container[0];
				var formTemplate = container.getElementsByTagName("form-template");
				if(formTemplate && formTemplate[0]){
					var ft = formTemplate[0];
					var template = ft.getAttribute("template");
					if(template){
						_get(null, template, function(_fc, DATA){
							var divForm = document.createElement("DIV");
							divForm.className = "form";
							divForm.innerHTML = DATA;
							container.insertBefore(divForm, ft);
							
						var formContainer = container.getElementsByClassName(_formContainerClass);
						var _id = getParameterByName("id", document.location.href);
						
						for(var x=0;x<formContainer.length;x++){
							var fc = formContainer[x];					
							_attachSaveEvent(fc);
							var _data = fc.getAttribute("data");														/*FORM OBJECT*/
							
							if(_data){
								if(_id){
									_data = _data.replace("{id}", _id);
								}
								_get(fc, _data, function(_fc, DATA){
									//alert(document.location.href);
									//alert("FORM URL: [" + _data + "]\n\nFORM DATA: " + DATA);
									var RECORD = eval(DATA)[0];
									if(RECORD){
										fc = _fc;
										for(var pc=0;pc<fc.childNodes.length;pc++){
											var pControl = fc.childNodes[pc];
											if(pControl.tagName){
												for(var c=0;c<pControl.childNodes.length;c++){
													var Control = pControl.childNodes[c];
													if(Control.tagName){
														var cBind = Control.getAttribute("bind");
														var cValue = typeof RECORD[cBind] == "undefined" ? "": RECORD[cBind];
														if(cBind){
															Control.value = cValue;
														}										
													}
												}
											}
										}
									}																					/*FORM OBJECT*/
								});	
							}							
						}							
						_renderFormTab();
						CALLBACK();
						});					
					}
				}				
			}			
        }
    }
}("FORM VSYNC");

//***********************************************************************************************************************************************
//***********************************************************************************************************************************************
//***********************************************************************************************************************************************


var GRID = function (_def) {

	var _containerClass = "container";
    var _gridContainerTag = "grid-container";   
	var _gridColumnsTag = "grid-columns"; 
	var _gridColumnTag = "grid-column"; 
	var _gridTag = "grid";																								/*GRID OBJECT*/

	function randomSeed()
	{
		var text = "";
		var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
		for( var i=0; i < 5; i++ ){
			text += possible.charAt(Math.floor(Math.random() * possible.length));
		}		
		return text;
	}
	
		
	function _get(gc, path, CALLBACK){
		var xhttp = new XMLHttpRequest();
		xhttp.onreadystatechange = function() {
			if (xhttp.readyState == 4 && xhttp.status == 200) {
				CALLBACK(gc, xhttp.responseText);
			}
		};
		//xhttp.open("GET", path+"?randomSeed="+randomSeed(), true);
		xhttp.open("GET", path, true);
		xhttp.send();
	}
	
	function _renderTable(COLS, ROWS, CALLBACK){
		var html = [];
		html.push("<table border=\"1\" style=\"border-collapse:collapse\">");							
		html.push("<tr>");																								/*GRID OBJECT*/
		for(var c in COLS){
			html.push("<td>");
			html.push(COLS[c][1]);
			html.push("</td>");
		}
		html.push("</tr>");
		for (var r=0 ; r<ROWS.length ; r++) {
			html.push("<tr>");
			for(var c in COLS){
				html.push("<td>");
				html.push(ROWS[r][COLS[c][0]]);
				html.push("</td>");
			}
			html.push("</tr>");
		}
		html.push("</table>");
		CALLBACK(html);
	}
	
	function _renderTableFromTemplate(_template, CALLBACK){		
		_get(null, _template, function(obj, DATA){						
			var html = [];
			html.push(DATA);						
			CALLBACK(html);
		});
	}
	
	function _compileTable(grid, COLS, ROWS){
		var html = grid.innerHTML;		
		var _table = grid.firstChild;
		var _editAttribute = grid.getAttribute("edit-link");
		var _editIndexAttribute = grid.getAttribute("edit-id");															/*GRID OBJECT*/
		var _deleteAttribute = grid.getAttribute("delete");
		var _addAttribute = grid.getAttribute("add");
		var removeLink = "";
		var addLink = "";
		var editLink = "";
		
		_editIndexAttribute = _editIndexAttribute ? _editIndexAttribute : "0";
		
		if(_editAttribute){
			editLink = " class=\"grid-link\" onclick=\"__edit(" + _editIndexAttribute + ",this.parentNode, this);\" ";		
		}
		
		if(_addAttribute){
			addLink = " class=\"grid-link\" onclick=\"__add(this.parentNode, this);\" ";
		}
		
		if(_deleteAttribute){
			removeLink = " class=\"grid-link\" onclick=\"__remove(this.parentNode, this);\" ";
		}
		
		var _ht1 = "";
		for(var c=0;c<COLS.length;c++){
			_ht1 += _table.rows[0].innerHTML.replace("><", " bind=\"" + COLS[c][0] + "\">"+COLS[c][1]+"<");			
		}
		if(removeLink){
			_ht1 += _table.rows[0].innerHTML.replace("><", ">&nbsp;<");
		}																													/*GRID OBJECT*/
		html = html.replace(_table.rows[0].innerHTML, _ht1);		
		var _ht2 = "";																							
		for(var r=0;r<ROWS.length;r++){
			_ht2 += _table.rows[1].parentNode.innerHTML.substr(0, _table.rows[1].parentNode.innerHTML.indexOf(">")+1);
			for(var c=0;c<COLS.length;c++){
				if(editLink && c == parseInt(_editAttribute)){
					_ht2 += _table.rows[1].innerHTML.replace("><", "" + editLink + ">"+ROWS[r][COLS[c][0]]+"<");
				}
				else{
					_ht2 += _table.rows[1].innerHTML.replace("><", ">"+ROWS[r][COLS[c][0]]+"<");
				}
			}
			if(removeLink){
				_ht2 += _table.rows[1].innerHTML.replace("><", "" + removeLink + ">" + _deleteAttribute + "<");
			}
			_ht2 += "</tr>";
		}
		html = html.replace(_table.rows[1].innerHTML, _ht2);
				
		grid.innerHTML = html;		
	}
	
	function _Edit_OK(_this){		
		var row = _this.parentNode.parentNode.parentNode.parentNode.previousSibling;
		var form = _this.parentNode.parentNode.parentNode;
		var _this = null;
																															/*GRID OBJECT*/
		var elem = form.querySelectorAll("input,select,textarea"); 
		for(var c=0;c<elem.length;c++){
			var cBind = elem[c].getAttribute("bind");
			if(cBind){
				for(var rc=0;rc<row.cells.length;rc++){
					var rcBind = row.parentNode.parentNode.rows[0].cells[rc].getAttribute("bind");
					if(rcBind == cBind){	
						row.parentNode.parentNode.setAttribute("modified", "1");//Set Table
						row.setAttribute("modified", "1");
						row.cells[rc].setAttribute("modified", "1");
						row.cells[rc].innerHTML = elem[c].value;
						break;
					}
				}
			}
		}			
		__edit(0, row, _this);
	}																									
	
	function _Edit_Cancel(_this){
		var row = _this.parentNode.parentNode.parentNode.parentNode.previousSibling;
		var _this = null;
		__edit(0, row, _this);
	}
	
	function showHideLoading(gc, show){
		if(show){
			var divLoading = document.createElement("DIV");
			divLoading.id = "loading";
			divLoading.className = "loading";
			divLoading.innerHTML = "Loading ..";
			gc.insertBefore(divLoading, gc.firstChild);
		}
		else{
			var loading = document.getElementById("loading");
			if(loading){
				loading.parentNode.removeChild(loading);
			}
		}
	}
																															/*GRID OBJECT*/
    return {
		Edit_Cancel: _Edit_Cancel,
		Edit_OK: _Edit_OK,
        render: function () {
            var container = document.getElementsByClassName(_containerClass);
			if(container && container.length == 1){
				var gridContainer = container[0].getElementsByTagName(_gridContainerTag);
				
				var _id = getParameterByName("id", document.location.href);
				//alert("_id: "+_id)
				//alert(gridContainer.length);
				for(var x=0;x<gridContainer.length;x++){
					var gc = gridContainer[x];
					var _data = gc.getAttribute("data");

					showHideLoading(gc, true)					
					
					//_data = _data.replace("?id=","?idxs=");
					if(_id){
						_data = _data.replace("{id}", _id);
					}
					//alert(_data);
					_get(gc, _data, function(_gc, DATA){
						//alert(document.location.href);
						//alert("GRID URL: [" + _data + "]\n\nGRID DATA: " + DATA);
						
						gc = _gc;
						var _template = gc.getAttribute("template");
						var grid = gc.getElementsByTagName(_gridTag)[0];
						var COLS = [];	
						var ROWS = eval(DATA);
																															/*GRID OBJECT*/
						var gridColumns = gc.getElementsByTagName(_gridColumnsTag)[0];
						var gridColumn = gridColumns.getElementsByTagName(_gridColumnTag);
						for(var x=0;x<gridColumn.length;x++){
							var cols = gridColumn[x];	
							COLS.push([cols.getAttribute("bind"), cols.getAttribute("title")]);
						}
						if(_template){
							_renderTableFromTemplate(_template, function(html){
								grid.innerHTML = html.join("");
								_compileTable(grid, COLS, ROWS);
								showHideLoading(null, false);
							});
						}
						else{
							_renderTable(COLS, ROWS, function(html){
								grid.innerHTML = html.join("");
								showHideLoading(null, false);
							});
						}
					});				
				}
			}			
        }
    }																														/*GRID OBJECT*/
}("GRID VSYNC");

//***********************************************************************************************************************************************
//***********************************************************************************************************************************************
//***********************************************************************************************************************************************

var NAV = function (_def) {
	var _pageClass = "page";
	
    return {																												/*NAV OBJECT*/
		render: function (_template) {
            var _page = document.getElementsByClassName(_pageClass);
			if(_page && _page.length == 1){
				var page = _page[0];
				var nav = page.getElementsByTagName("nav");
				if(nav && nav[0]){
					var n = nav[0];
										
					var divNav = document.createElement("DIV");
					divNav.id = "nav";
					divNav.className = "nav";
					var html = "";
					html += "<div class=\"nav-logo\" url=\"/app/\"><img height=\"38px\" src=\"../../images/logo.jpg\" /></div>";
					html += "<div class=\"nav-left\" url=\"/app/employees/\">Employees</div>";
					html += "<div class=\"nav-left\" url=\"/app/locations/\">Locations</div>";
					html += "<div class=\"nav-right\"url=\"/app/accounts/\">Account</div>";
					divNav.innerHTML = html;
					page.insertBefore(divNav, page.firstChild);
					
					if(divNav){
						for(var i=0;i<divNav.childNodes.length;i++){
							var cUrl = document.location.href.substr(document.location.href.indexOf("/app/"));
							var navUrl = divNav.childNodes[i].getAttribute("url");
							divNav.childNodes[i].addEventListener("click", function(){
								var navUrl = this.getAttribute("url");
								if(navUrl == "/app/"){
									document.location = "https://dbjson.com";
								}
								else{
									redirect(navUrl);																			/*COMMON FUCNTIONS*/
								}
							});		
							if(navUrl == cUrl){
								if(cUrl == "/app/"){
									divNav.childNodes[i].firstChild.src = "../images/logo.jpg";
								}
								divNav.childNodes[i].style.color = '#000';
							}
							else{
								divNav.childNodes[i].style.color = '#999';
							}
						}
					}
					
				}
			}				
        }																													/*NAV OBJECT*/
    }
}("NAV VSYNC");

//***********************************************************************************************************************************************
//***********************************************************************************************************************************************
//***********************************************************************************************************************************************

NAV.render();																												/*INVOKING*/

FORM.render(function(){
	GRID.render();
});


function redirect(url){
	var dx = document.location.href.substr(0, document.location.href.indexOf("/app/"));
	document.location.href = dx + url;																			/*COMMON FUCNTIONS*/
}

function __remove(row, _this){	
	if(_this.innerHTML == "Delete"){
		row.setAttribute("deleted", "1");
		for(var rc=0;rc<row.cells.length-1;rc++){
			row.cells[rc].style.textDecoration = "line-through";
		}
		row.cells[row.cells.length-1].innerHTML = "Undo Delete";
	
		if(row.nextSibling.cells && row.nextSibling.cells.length == 1){
			row.nextSibling.style.display = "none";	
		}
	}
	else{
		row.setAttribute("deleted", "");
		for(var rc=0;rc<row.cells.length-1;rc++){
			row.cells[rc].style.textDecoration = "";
		}
		row.cells[row.cells.length-1].innerHTML = "Delete";		
	}
}

function _get(gc, path, CALLBACK){
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (xhttp.readyState == 4 && xhttp.status == 200) {
			CALLBACK(gc, xhttp.responseText);																		/*COMMON FUCNTIONS*/
		}
	};
	xhttp.open("GET", path, true);
	xhttp.send();
}

function _post(gc, path, data, CALLBACK, ERRORCALLBACK){
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (xhttp.readyState == 4) {
			if(xhttp.status == 200){
				CALLBACK(gc, xhttp.responseText);
			}
			else{
				ERRORCALLBACK(gc, "ERROR : " + xhttp.status + "\n\n" +  xhttp.responseText);
			}
		}
	};
	xhttp.open("POST", path, true);
	xhttp.setRequestHeader("Content-Type", "application/json")
	xhttp.send(data);
}

function _connectToEditForm(row, form){
	var elem = form.querySelectorAll("input,select,textarea"); 
	for(var c=0;c<elem.length;c++){																					/*COMMON FUCNTIONS*/
		var cBind = elem[c].getAttribute("bind");		
		if(cBind){
			for(var rc=0;rc<row.cells.length;rc++){
				var rcBind = row.parentNode.parentNode.rows[0].cells[rc].getAttribute("bind");
				if(rcBind == cBind){					
					elem[c].value = row.cells[rc].innerText;
					break;
				}
			}
		}
	}
}

function _fillLists(form, CALLBACK){
	var callCount = 0;
	var elem = form.querySelectorAll("select"); 
	for(var c=0;c<elem.length;c++){
		var cList = elem[c].getAttribute("list");
		if(cList){
			callCount++;
			_get(elem[c], "../data/"+cList+".json", function(obj, DATA){	
				callCount--;
				var list = eval("["+DATA+"]");
				var options = "";
				for(var r=0;r<list.length;r++){
					options += "<option value=\""+list[r]["value"]+"\">"+list[r]["text"]+"</option>";
				}																									/*COMMON FUCNTIONS*/
				obj.innerHTML =  options;
				if(callCount <= 0){
					CALLBACK();				
				}
			});	
		}
	}
	if(callCount <= 0){
		CALLBACK();				
	}
}

function getParameterByName(name, url) {
	if (!url) url = window.location.href;
	name = name.replace(/[\[\]]/g, "\\$&");
	var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
		results = regex.exec(url);
	if (!results) return null;
	if (!results[2]) return '';
	return decodeURIComponent(results[2].replace(/\+/g, " "));
}

function __edit(index, row, _this){	
	if(row.getAttribute("deleted")){
		alert("This record is marked for deletion.");
		return;
	}
	
	var _editTemplate = row.parentNode.parentNode.parentNode.getAttribute("edit-template");
	var _editForm = row.parentNode.parentNode.parentNode.getAttribute("edit-form");
	var _editAction = row.parentNode.parentNode.parentNode.getAttribute("edit-action");
	if(_editForm){
		if(_editAction && _editAction === "openRecordInTab"){														/*COMMON FUCNTIONS*/
			FORM.openRecordInTab(index, _this.parentNode, _this, _editForm);
		}
		else{
			alert("Action not registered.");
		}
	}
	else if(_editTemplate){
		if(row.nextSibling.getAttribute && row.nextSibling.getAttribute("editFrame")){
			row.nextSibling.style.display = row.nextSibling.style.display ? "":"none";			
		}
		else{		
			if(_editTemplate){
				_get(null, _editTemplate, function(obj, DATA){	
					var newRow = row.cloneNode(true);
					var cLength = newRow.cells.length;
					for(var c=newRow.cells.length-1;c>0;c--){
						newRow.deleteCell(c);
					}
					newRow.setAttribute("editFrame", "true");
					newRow.cells[0].style.height = "140px";
					newRow.cells[0].innerHTML = DATA;
					newRow.cells[0].colSpan = cLength;	
					newRow.style.backgroundColor = "#bfb";					
					row.parentNode.insertBefore(newRow, row.nextSibling);
					_fillLists(newRow.cells[0].firstChild, function(){//CALLBACK
						_connectToEditForm(row, newRow.cells[0].firstChild);
					});					
				});
			}
			else{
				alert("No edit template specified for this grid.");
			}																										/*COMMON FUCNTIONS*/
		}
	}
}

function _generateDashboard(){
	if(typeof CHART != "undefined"){
		setTimeout(function(){																				/*COMMON FUCNTIONS*/
			var piechart1 = document.getElementById('piechart1');
			var data1 = [200, 60, 15];
			var color1 = ['#F17CB0', '#4D4D4D', '#5DA5DA'];
			CHART.PieChart(piechart1, data1, color1);
			
			var piechart2 = document.getElementById('piechart2');
			var data2 = [80, 115, 55, 25];
			var color2 = ['#B276B2', '#4D4D4D', '#DECF3F', '#60BD68'];
			CHART.PieChart(piechart2, data2, color2);
			
			var gradient1 = document.getElementById('gradient1');			
			//CHART.Text(gradient1, 'hello mam', 10, 50);			
			CHART.barGraph(gradient1);	
			
		}, 100);
	}
}

function _prepareFormPost(){
	var _submit = document.getElementById("submit");
	if(_submit){		
		_submit.onclick = function(){
			var posturl = this.getAttribute("posturl");
			if(!posturl){
				alert("Action not defined.");
				return;
			}
		
			var params = "";
			
			for(var pc=0;pc<FORM.CONTROLS.length;pc++){
				params += "\"FORM" + pc + "\":[{";
				for(var c=0;c<FORM.CONTROLS[pc].length;c++){
					var Control = FORM.CONTROLS[pc][c].Control;
					if(Control){
						var Bind = FORM.CONTROLS[pc][c].Control.getAttribute("bind");
						if(Bind){
							params += "\"" + Bind + "\":\"" + Control.value + "\", ";
						}
					}																							/*COMMON FUCNTIONS*/
				}
				if(params){
					params = params.substr(0, params.length-2);
				}
				params += "}],";
			}
			
			//Access Grids
			var alltables = document.getElementsByTagName("TABLE");
			for(var t=0;t<alltables.length;t++){
				var table = alltables[t];
				if(table.getAttribute("modified")){
					params += "\"GRID" + t + "\":[{";
					for(var r=1;r<table.rows.length;r++){
						var rowModified = table.rows[r].getAttribute("modified");
						if(rowModified && rowModified == "1"){
							for(var c=0;c<table.rows[r].cells.length;c++){
								var cellModified = table.rows[r].cells[c].getAttribute("modified");
								if(cellModified && cellModified == "1"){
									var Bind = table.rows[0].cells[c].getAttribute("bind");
									var Value = table.rows[r].cells[c].innerHTML;
									//alert(Bind + " --> " + Value);
									params += "\"" + Bind + "\":\"" + Value + "\", ";
								}
							}
						}
					}
					params += "}],";
				}																								/*COMMON FUCNTIONS*/
			}
			
			
			if(params){
				params = params.substr(0, params.length-1);
			}
			//params = encodeURIComponent(params);
			alert(params)
			params = "{\"ID\":\"10000001\", \"FIRSTNAME\":\"BOB\", \"LASTNAME\":\"THO\", \"COMPANY\":\"HID\"}";
			
			//alert("params: " + params);
			_post(1, posturl, params, function(obj, DATA){
				alert(DATA);
			}, function(obj, ERROR){
				alert(ERROR);
			});
		}
	}
}

//***********************************************************************************************************************************************
//***********************************************************************************************************************************************
//***********************************************************************************************************************************************


if( typeof module !== "undefined" && ('exports' in module)){
   module.exports = Air2;
}
