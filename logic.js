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
	      	  if(line[i1-1] == "!" || line[i1-1] == "?"){
              var klass;
              if(line[i1-1] == "?")
                klass = "inLineImg";
              else {
                klass = "innerImg";
              }
	      	    line = line.substr(0, i1-1) + "<img class=\"" + klass + "\" src=\"" + line.substr(i2+2, i3-i2-2) + "\" alt=\"" + line.substr(i1+1, i2-i1-1) + "\">" + line.substr(i3+1);
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
  /* List of tag strings */
  var TAG_TITLE = "## ";
  var TAG_LIST = " - ";
  var TAG_BLOCK_START = "/*";
  var TAG_BLOCK_END = "*/";
  var TAG_GALLERY = "//";
  var TAG_GALLERY_SEP = " * ";

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


    var block = "<div class=\"in-block\">";
    /*if(text[i].includes("**")){
      text[i] = toBold(text[i]);
    }else */
    if(text[i].substr(0,TAG_TITLE.length) == TAG_TITLE){
      text[i] = "<h2>" + text[i].substr(TAG_TITLE.length) + "</h2>\n";

    }else if(text[i].substr(0,TAG_LIST.length) == TAG_LIST){
      text[i] = "<li>" + text[i].substr(TAG_LIST.length) + "</li>\n";
      /*************************************************/
    }else if(text[i].substr(0,TAG_BLOCK_START.length) == TAG_BLOCK_START){
      if(text[i].substr(text[i].length-TAG_BLOCK_END.length,TAG_BLOCK_END.length) == TAG_BLOCK_END){
        text[i]= "<div class=\"in-block\">\n" + text[i].substr(TAG_BLOCK_END.length, text[i].length-(TAG_BLOCK_START.length + TAG_BLOCK_END.length)) + "</div>";
      }else{
        text[i] = ""; // Boh, robe
        for (; i < text.length && text[i].substr(text[i].length-TAG_BLOCK_END.length, TAG_BLOCK_END.length) != TAG_BLOCK_END; ++i) {
          if(text[i].includes("](")){
            block += createUrl(text[i]);
          }else{
            block += (text[i] + "\n");
          }
        }
        if(text[i].substr(text[i].length-TAG_BLOCK_END.length, TAG_BLOCK_END.length) == TAG_BLOCK_END){
          block += "</div>"
        }
        text[i] = block;
      }
    }else if(text[i].substr(0,TAG_GALLERY.length) == TAG_GALLERY){
      var res = text[i].split(TAG_GALLERY_SEP)[0].substr(TAG_GALLERY.length);
      var legend = text[i].split(TAG_GALLERY_SEP)[1];
      if (legend == undefined) legend = "";
      text[i] = block + "<a href=\""+res+"\"><img class=\"innerImg\" src=\""+res+"\" alt=\""+res+"\"> </a><br>"+ legend +"</div>";
    } /*************************************************/
    else if (text[i].substr(0,1) != "<"){
      text[i] = "<p>" + text[i] + "</p>\n";
    }
    document.getElementById("sheet").innerHTML += text[i];
  }
  document.getElementById("content").innerHTML = "";
}
