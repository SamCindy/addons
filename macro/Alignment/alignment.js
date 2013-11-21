/*
  alignment.js
  ------------
    Written by Kaffa (kaffacoffee@outlook.com)
    Homepage: http://forum.everedit.net/
    20130717233031
*/

function alert(message) {
    var vbOKOnly = 0;
    ShowMsgBox(message, "Message from EverEdit", vbOKOnly);
}

function prompt(message, defaultValue) {
    return ShowInputBox(defaultValue, message);
}

function confirm(message){
    var vbOKCancel = 1;
    var result = ShowMsgBox(message, "Confirm from EverEdit", vbOKCancel);
    if (result == 1) {
        return true;
    }
    return false;
}

function now() {
    var now = new Date();
    var year = now.getFullYear().toString();
    var month = (now.getMonth() + 1).toString();
    var date = now.getDate().toString();
    var hour = now.getHours().toString();
    var minute = now.getMinutes().toString();
    if (minute == "0") {
        minute = "00";
    }
    var second = now.getSeconds().toString();
    if (second == "0") {
        second = "00";
    }
    var result = year + "-" + month + "-" + date + " " + hour + ":" + minute + ":" + second;
    return result;
}

function dump(arr, level) {
    if (!level) { 
        level = 0; 
    }
    var dumped_text = "";
    var level_padding = "";
    for (var i = 0; i < level + 1; i++) { 
        level_padding += "    ";
    }
    if (typeof(arr) == 'object') {  
        for (var item in arr) {
            var value = arr[item];
            if (typeof(value) == 'object') { 
                dumped_text += level_padding + "'" + item + "' ...\n";
                dumped_text += dump(value,level+1);
            } else {
                dumped_text += level_padding + "'" + item + "' => \"" + value + "\"\n";
            }
        }
    } else { 
        dumped_text = "===>"+arr+"<===("+typeof(arr)+")";
    }
    return dumped_text;
}

function trim(s) {  
    return s.replace(/(^\s*)|(\s*$)/g, "");  
}

function space(len) {
    var arr = [];
    while (arr.length < len) {
        arr.push(' ');
    }
    return arr.join('');
}

function getLinesep(text) {
    var LINE_SEP = {
        "PC": "\r\n",
        "UNIX": "\n",
        "MAC": "\r"
    }
    var linesep = false;
    if (text.indexOf("\r\n") != -1) {
        linesep = LINE_SEP.PC;
    }
    else if (text.indexOf("\n") != -1) {
        linesep = LINE_SEP.UNIX;
    }
    else if (text.indexOf("\r") != -1) {
        linesep = LINE_SEP.MAC;
    }
    return linesep;
}

function regexEscape(str, except) {
    str = str.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, function(ch){
        if (except && except.indexOf(ch) != -1) {
            return ch;
        }
        return "\\" + ch;
    }); 
    return str;
}

function getDisplayLength(s) {
    return s.replace(/[^\x00-\xff]/g, '**').length;
}

function getSystemCodeSet() {
    var systemCodeSet = 0;
    var computer = ".";
    var objWMIService = GetObject("winmgmts:\\\\" + computer + "\\root\\cimv2");
    var e = new Enumerator(objWMIService.ExecQuery("Select * from Win32_OperatingSystem", "WQL", 48));
    for ( ; !e.atEnd(); e.moveNext()) {	
        systemCodeSet = e.item().CodeSet;
    }
    return systemCodeSet;
}

function setClipboard(s) {
    var ie = new ActiveXObject('InternetExplorer.Application');
    ie.silent = true;
    ie.Navigate('about:blank');
    while (ie.ReadyState!=4) App.Sleep(20);
    while (ie.document.readyState!='complete') App.Sleep(20);
    ie.document.body.innerHTML = '<textarea id="txt" wrap="off"></textarea>';
    var txt = ie.document.getElementById('txt');
    txt.value = s;
    txt.select();
    txt = null;
    ie.ExecWB(12,0);
    ie.Quit();
    ie = null;
}

function deleteFile(filename) {
    var fso = new ActiveXObject("Scripting.FileSystemObject");
	fso.DeleteFile(filename);
}

function fileExists(filename) {
    var fso = new ActiveXObject("Scripting.FileSystemObject");
    return fso.FileExists(filename)
}

function guid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
        return v.toString(16);
    });
}

function addLeadingZero(num) {
    if (num < 10) {
        return '0' + num;
    }
    return num.toString();
}

function addLeadingZeros(num) {
    if (num < 10) {
        return '00' + num;
    }
    if (num < 100) {
        return '0' + num;
    }
    return num.toString();
}

var os = {
    'curdir': '.', 
    'pardir': '..', 
	'sep': '\\',
	'altsep': '/',
	'extsep': '.',
	'pathsep': ';',
	'linesep': '\n'
};

/*==================================================
  wrapper
 ==================================================*/
function hasSel() {
    return App.ActiveDoc.HasSel();
}

function getSelText() {
    return App.ActiveDoc.SelText;
}

function setSelText(s) {
    App.ActiveDoc.SelText = s;
}

function getSelStartPos() {
    return App.ActiveDoc.SelStartPos;
}

function getSelEndPos() {
    return App.ActiveDoc.SelEndPos;
}

function getLineText(index) {
    return App.ActiveDoc.GetLineText(index);
}

function setSel(startLine, startCol, endLine, endCol) {
    App.ActiveDoc.SetSel(startLine, startCol, endLine, endCol);
}

function insert(s) {
    App.ActiveDoc.Insert(s);
}

function geDoctFullName() {
    return App.ActiveDoc.PathName
}

function getDocName() {
    return App.ActiveDoc.PathName.split('\\').pop();
}

function getDocPath() {
    return App.ActiveDoc.PathName.split('\\').slice(0, -1).join(os.sep) + os.sep;
}

function include(path) {
    if (path.indexOf(':') == -1) {
        path = getDocPath() + (path.slice(0, 1) == os.sep ? path : os.sep + path)
    }
    Include(path);
}

/*==================================================
  main function
 ==================================================*/
function alignment(sep) {
    if (!hasSel()) {
        return;
    }
    
    var startLine = getSelStartPos().Line;
    var startCol = 0;
    var endLine = getSelEndPos().Line;
    var endCol = getLineText(endLine).length;
    setSel(startLine, startCol, endLine, endCol);
    
    var sel = getSelText();
    var regex = "^([\\s]*)(.*?)([\\s]*)" + regexEscape(sep) + "([\\s]*)(.*?)([\\s]*)$";
    var re = new RegExp(regex, "gm");
    if (re.exec(sel) == null) {
        return;
    }
    
    re = new RegExp(regex, "gm");
    var maxlen = 0;
    var arr = [];
    while ((arr = re.exec(sel)) != null) {
        var len = getDisplayLength(arr[2]);
        if (maxlen < len) {
            maxlen = len;
        }
    }
    re = new RegExp(regex, "gm");
    var firstMatch = re.exec(sel);
    var linesep = getLinesep(sel);
    var indent = firstMatch[1].replace(/(\r\n)|(\r)|(\n)/g, "");
    
    var list = [];
    var selLines = sel.split(linesep);
    var i = 0;
    for (; i < selLines.length; i++) {
        var line = selLines[i];
        re = new RegExp(regex, "g");
        arr = re.exec(line);
        if (arr != null) {
            list.push(indent + arr[2] + space(maxlen - getDisplayLength(arr[2])) + " " + sep + " " + arr[5]);
        }
        else {
            list.push(indent + trim(line).replace(/(\r\n)|(\r)|(\n)/g, ""));
        }
    }
    setSelText(list.join(linesep));
}

function alignmentAll(sep) {
    if (!hasSel()) {
        return;
    }

    var startLine = getSelStartPos().Line;
    var startCol = 0;
    var endLine = getSelEndPos().Line;
    var endCol = getLineText(endLine).length;

    setSel(startLine, startCol, endLine, endCol);

    var sel = getSelText();
    var linesep = getLinesep(sel);
    var selLines = sel.split(linesep);

    //Split each line with "sep" into array "lineArr"
    var lineArr = [];
    var maxItemNum = 0;
    for (var i = 0; i < selLines.length; i++) {
        var itemArr = selLines[i].split(sep);
        var itemArrNew = [];
        for (var j = 0; j < itemArr.length; j++) {
            var item = {contents: "", length: 0};
            item.contents = itemArr[j].replace(/(^\s*)|(\s*$)/g, '');
            item.length = getDisplayLength(item.contents);
            itemArrNew.push(item);
        }
        lineArr.push(itemArrNew);
        if (itemArr.length > maxItemNum) {
            maxItemNum = itemArr.length;
        }
    }

    //Check the maximum item length of each cols of array "lineArr"
    var maxItemLengthArr = [];
    for (var j = 0; j < maxItemNum; j++) {
        var maxItemLength = 0;
        for (i = 0; i < lineArr.length; i++) {
            var item = lineArr[i][j];
            if (item && item.length > maxItemLength) {
                maxItemLength = item.length;
            }
        }
        maxItemLengthArr.push(maxItemLength);
    }

    //Combine "lineArr" to align all lines at each "sep"
    var list = [];
    for (var i = 0; i < lineArr.length; i++) {
        var lineStr = "";
        for (var j = 0; j < lineArr[i].length; j++) {
            if (j > 0) {
                lineStr += space(maxItemLengthArr[j-1] - lineArr[i][j-1].length) + " " + sep + " " + lineArr[i][j].contents;
            } else {
                lineStr += lineArr[i][j].contents;
            }
        }
        list.push(lineStr);
    }

    setSelText(list.join(linesep));
}