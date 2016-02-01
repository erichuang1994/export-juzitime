function show(){
  req=new XMLHttpRequest();
  req.onreadystatechange=function (){

    if (this.readyState == 4&& this.status == 200){
      userId=req.responseText.match(/userId:\s+'(.*)'/)[1];

      var content_div = document.getElementById('content');
      req.onreadystatechange=function(){
        if (this.readyState == 4 && this.status == 200){

          res_json = JSON.parse(req.responseText);

          export_str = ""
          for (var i = 0;i<res_json.totalEntries;i++){
            createdDate = new Date(res_json.entries[i]._created);
            content = res_json.entries[i].content;
            export_str+=createdDate+'\r\n'+content+'\r\n\r\n';
          }
          content_div = document.getElementById("content")
          content_div.innerText=export_str;
          // console.log(export_str);
          // download('export.text',export_str);
        }
      }
      url_template="http://www.juzitime.com/WebControl/showListJSON?page=1&pageSize=9999&userId="
      req.open("GET",url_template+userId,true);
      req.send();
    }
  }
  req.open("GET","http://www.juzitime.com/journal",true);
  req.send();
}

// windwos和unix系统的换行符不一样的问题还没处理,暂时不提供直接下载，需要手动复制出来
function download(filename, text) {
    var pom = document.createElement('a');
    pom.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    pom.setAttribute('download', filename);

    if (document.createEvent) {
        var event = document.createEvent('MouseEvents');
        event.initEvent('click', true, true);
        pom.dispatchEvent(event);
    }
    else {
        pom.click();
    }
}

function encode_utf8(s) {
  return unescape(encodeURIComponent(s));
}

show()
