

bool bufferize(char * rcv){
  Serial.println(rcv);
  if(strcmp(rcv,"END") != 0){
    buf = buf + rcv;
    return false;
  }
  return true;
}

String parserJSON(String field){
  StaticJsonBuffer<512> jsonBuffer;
  JsonObject& root = jsonBuffer.parseObject(buf);

  String result = root[field];
 
   return result;
}

