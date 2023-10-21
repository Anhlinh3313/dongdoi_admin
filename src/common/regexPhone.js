function regexPhone(str) {
    let regex =  /^[+]*[(]{0,1}[0-9]{1,3}[)]{0,1}[-\s\./0-9]*$/g
    if(!regex.test(str)){
        return true
    }
    return false;
  }
  
  export default regexPhone;
  