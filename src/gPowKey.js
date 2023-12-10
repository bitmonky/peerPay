// *********************************************************
// CLASS: gPowQue
// A Proof of work class Que Managerk.
//
class gPowQue {
   constructor(){
     this.nodes = [];
   }
   push(ip,work,diff){
     var node = {
       ip   : ip,
       work : work,
       diff : diff
     }
     if (this.inList(ip) === null) {
       this.nodes.push(node);
     }
     return this.pop();
   }
   remove(ip){
     var breakFor = {};
     try {
       this.nodes.forEach( (n, index, object)=>{
         if (n.ip == ip){
           object.splice(index,1)
           console.log("Job IP Removed:",ip);
         }
       });
     }
     catch(e){}
   }
   inList(ip){
     var isIn = null;
     var breakFor = {};
     try {
       this.nodes.forEach( (n)=>{
         if (n.ip == ip){
           isIn = n;
           throw breakFor;
         }
       });
     }
     catch(e){}
     return isIn;
   }
   pop(){
     return this.nodes.pop();
   }
   list(){
    //console.log('Network MsgQue Status: ');
     this.nodes.forEach( (n)=>{
      //console.log(n);
     });
   }
}
// *********************************************************
// CLASS: gPowKey
// A Proof of work class used for selection of random nodes from the PeerTree
//
class gPowKey {
  constructor(myIP,net) {
    this.net     = net;
    this.nonce   = 0;
    this.hash    = "";
    this.ip      = myIP;
    this.remIP   = null;
    this.que     = new gPowQue();
    this.isMining = false;
    this.stopMining = null;
  }
  async doPow(difficulty,work,remIP) {
    console.log('Doing POW for:',remIP);
    var work = this.que.push(remIP,work,difficulty);
    while(work){
      console.log('While Working');
      this.work = work.work;
      this.remIP = work.ip;
      this.isMining = true;
      this.stopMining = false;
      this.repeatHash(work.diff);
      work = this.que.pop();
    }
  }
  doStop(remIP){
    console.log('Do Stop Initiated:'+this.remIP+'|',remIP);
    if (this.remIP == remIP){
      console.log('OPTION STOPPING:'+this.remIP+'|',remIP);
      this.stopMining = true;
    }
    else {
      console.log('OPTION REMOVE FROM QUE:'+this.remIP+'|',remIP);
      this.que.remove(remIP);
    }
  }
  signMsg(stok) {
    const sig = this.signingKey.sign(this.calculateHash(stok), 'base64');
    const hexSig = sig.toDER('hex');
    return hexSig;
  }
  async calculateHash() {
    var data = this.ip + this.work + this.nonce;
    var hash = crypto.createHash('sha256').update(data).digest('hex');
    return hash;
  }
  async repeatHash(difficulty){
    if (!this.stopMining && this.hash.substring(0, difficulty) !== Array(difficulty + 1).join('0')) {
      this.nonce = Math.floor(Math.random() * Math.floor(9999999999999));
      this.hash = await this.calculateHash();
      if (this.stopMining){
        console.log('HALT intiated:',this.remIP);
      }
      else {
        var timeout = setTimeout( ()=>{this.repeatHash(difficulty);},1);
      }
    }
    else {
     console.log('this.stopMining:',this.stopMining);
     if(!this.stopMining){
        var qres = {
          req : 'pNodeListGenIP',
          work  : this.work,
          wIP   : this.ip,
          nonce : this.nonce,
          hash  : this.hash
        }
        this.net.sendReply(this.remIP,qres);
      }
      this.stopMining = false;
      this.isMining = false;
    }
  }
}
