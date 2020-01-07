function createUrl(line) {
  var i1,i2,i3;
  var open = false;
  var cnt = 0;
  var qnt = 0;
  for (var a = 0; a < line.length; a++) {
    if(line[a] == "["){
      i1 = a;
      open = true;
      for (var b = a; b < line.length && open; b++) {
        if(line[b] == "]" && line[b+1] == "("){
          i2 = b;
	  if(qnt == 1){
            for (var c = b; c < line.length && open; c++) {
              if(line[c] == ")"){
                i3 = c;
	        if(cnt == 1){
	      	  if(line[i1-1] == "!"){
	      	    line = line.substr(0, i1-1) + "<img class=\"innerImg\" src=\"" + line.substr(i2+2, i3-i2-2) + "\" alt=\"" + line.substr(i1+1, i2-i1-1) + "\">" + line.substr(i3+1);
	          }else{
	      	    line = line.substr(0,i1) + "<a href=\"" + line.substr(i2+2, i3-i2-2) + "\">" + line.substr(i1+1, i2-i1-1) + "</a>" + line.substr(i3+1);
	          }
	        }
	        cnt--;
	        open = false;
              }else if(line[c] == "(")
	        cnt++;
            }
	  }
	  qnt--;
        }else if(line[b] == "[")
	  qnt++;
      }
    }
  }
  return line;
}

function formatContent() {
  var text = document.getElementById("content").innerHTML;
  var srt = 0;
  text=text.split("\n");
  while((!text[srt]) && srt<text.length) srt++;
  document.getElementById("page_title").innerHTML = createUrl(text[srt]);
  for(var i = srt+1; i < text.length; i++){
    while((!text[i]) && i<text.length) i++;
    if(text[i].includes("](")){
      text[i] = createUrl(text[i]);
    }
    /*if(text[i].includes("**")){
      text[i] = toBold(text[i]);
    }*/
    if(text[i].substr(0,3) == "## "){
      text[i] = "<h2>" + text[i].substr(3) + "</h2>\n";
    }else if(text[i].substr(0,3) == " - "){
      text[i] = "<li>" + text[i].substr(3) + "</li>\n";
    }else{
      text[i] = "<p>" + text[i] + "</p>\n";
    }
    document.getElementById("sheet").innerHTML += text[i];
  }
  document.getElementById("content").innerHTML = "";
}
