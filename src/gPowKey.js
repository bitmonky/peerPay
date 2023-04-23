const crypto = require('crypto');
//Test gPow concept for generating random node set.
class gPowKey {
  constructor() {
    this.trans  = 'blank';
    this.nonce  = 0;
    this.hash   = "";
    this.pubKey = "";
    this.ip     = "";
    this.isMining = false;
    this.stopMining = null;
  }
  async doPOW(difficulty,trans) {
    this.trans = trans;
    this.isMining = true;
    this.stopMining = false;
    this.repeatHash(difficulty);
  }
  async calculateHash() {
    var data = this.trans + this.nonce;
    var hash = crypto.createHash('sha256').update(data).digest('hex');
    return hash;
  }
  async repeatHash(difficulty){
    if (!this.stopMining && this.hash.substring(0, difficulty) !== Array(difficulty + 1).join('0')) {
      this.nonce = Math.floor(Math.random() * Math.floor(9999999999999));
      this.hash = await this.calculateHash();
      var timeout = setTimeout( ()=>{this.repeatHash(difficulty);},1);
    }
    else {
      this.stopMining = false;
      this.isMining = false;
      console.log(this.trans,this.hash);
    }
  }
};

const m1 = new gPowKey();
const m2 = new gPowKey();
const m3 = new gPowKey();
const m4 = new gPowKey();
const m5 = new gPowKey();
const m6 = new gPowKey();

var one   = m1.doPow(2,'one');
var two   = m2.doPow(2,'two');
var three = m3.doPow(2,'three');
var one   = m4.doPow(2,'four');
var two   = m5.doPow(2,'five');
var three = m6.doPow(2,'six');
console.log('wtf');
