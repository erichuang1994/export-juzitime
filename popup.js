
if (!chrome.cookies) {
  chrome.cookies = chrome.experimental.cookies;
}

function show(){
  cookie_dict={}
  count=2;
  stupidKey=true;
  getCookies("http://www.juzitime.com/", "jiathis_rdc", function(cookie) {
    cookie_dict["jiathis_rdc"]=cookie;
    if (count==0 ){
      getDiary(cookie_dict);
    }
    count=count-1;
  });
  getCookies("http://.juzitime.com/", "JUZITIME_REMEMBER", function(cookie) {
    cookie_dict["JUZITIME_REMEMBER"]=cookie;
    if (count==0){
      getDiary(cookie_dict);
    }
    count=count-1;
  });
  getCookies("http://.juzitime.com/", "JUZITIME_SESSION", function(cookie) {
    cookie_dict["JUZITIME_SESSION"]=cookie;
    if (count==0){
      getDiary(cookie_dict);
    }
    count=count-1;
  });

}

function getDiary(cookie_dict){
  console.log(cookie_dict);
  req=new XMLHttpRequest();
  req.onreadystatechange=function (){
    // console.log(req.responseText);
    if (this.readyState == 4&& this.status == 200){
      userId=req.responseText.match(/userId:\s+'(.*)'/)[1];
      // console.log(userId);
      var content_div = document.getElementById('content');
      req.onreadystatechange=function(){
        if (this.readyState == 4 && this.status == 200){
          // console.log(req.responseText);
          res_json = JSON.parse(req.responseText);
          // console.log(res_json);
          export_str = ""
          for (var i = 0;i<res_json.totalEntries;i++){
            createdDate = new Date(res_json.entries[i]._created);
            content = res_json.entries[i].content;
            // console.log(createdDate);
            export_str+=createdDate+'\n'+content+'\n\n';
            // console.log(content);
          }
          blob = new Blob([export_str],{type:"text/plain;charset=utf-8"});

          saveAs(blob,"export.txt");
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

function getCookies(domain, name, callback) {
    chrome.cookies.get({"url": domain,"name":name}, function(cookie) {
        if(callback) {
            callback(cookie);
        }
    });
}

show()
