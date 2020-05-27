function AudioVisualization( wrap, random ){
	/**
	 * random存在时，随机取值作假数据**/
	if(random){
		this.size = 5;
		this.height;
		this.width;
		this.box = wrap;
		this.canvas = document.createElement('canvas');
		this.box.appendChild( this.canvas );
		this.ctx = this.canvas.getContext("2d");
		this.height = 32;
		this.width = 50;
		this.canvas.height = 32;
		this.canvas.width = 50;
		this.line = this.ctx.createLinearGradient(0, 0, 0, 32);
		this.line.addColorStop(0, "red");
		this.line.addColorStop(0.5, "yellow");
		this.line.addColorStop(1, "blue");
		this.ctx.fillStyle = this.line;
		this.random();
	}else{
		this.size = 128;
		this.xhr = new XMLHttpRequest();
		
		this.source = null;
		this.count = 0;
		this.height;
		this.width;
		this.box = document.getElementById( wrap );
		this.canvas = document.createElement('canvas');
		this.box.appendChild( this.canvas );
		this.ctx = this.canvas.getContext("2d");
	}
	
}
AudioVisualization.prototype.init = function(){
	this.height = this.box.clientHeight;
	this.width = this.box.clientWidth;
	this.canvas.height = this.height;
	this.canvas.width = this.width;
	this.line = this.ctx.createLinearGradient(0, 0, 0, this.height);
	this.line.addColorStop(0, "red");
	this.line.addColorStop(0.5, "yellow");
	this.line.addColorStop(1, "blue");
	this.ctx.fillStyle = this.line;
}
AudioVisualization.prototype.resize = function(){
	this.height = this.box.clientHeight;
	this.width = this.box.clientWidth;
	this.canvas.height = this.height;
	this.canvas.width = this.width;
	this.line = this.ctx.createLinearGradient(0, 0, 0, this.height);
	this.line.addColorStop(0, "red");
	this.line.addColorStop(0.5, "yellow");
	this.line.addColorStop(1, "blue");
	this.ctx.fillStyle = this.line;
}
AudioVisualization.prototype.load = function(url){
	this.ac = new AudioContext();
	this.analyser = this.ac.createAnalyser();
	this.analyser.fftSize = this.size * 2;
	this.analyser.connect(this.ac.destination)
	
	this.arr = new Uint8Array( this.analyser.frequencyBinCount );
     
	requestAnimationFrame(this.v.bind(this));
	
	
	this.n = ++this.count;
    this.source && this.source[this.source.stop ? 'stop' : 'noteOff']();
    this.xhr.abort();
    this.xhr.open("get", url);
    this.xhr.responseType = "blob";
    var context = this;
    this.xhr.onload = function() {
      if( context.n!= context.count) return
      console.log('blob', context.xhr.response)
      context.xhr.response.arrayBuffer().then(buffer1 => {
          console.log( buffer1 )
          context.ac.decodeAudioData( buffer1, function(buffer){
        	  console.log('decode', buffer)
	        if( context.n != context.count) return
	        var bufferSource = context.ac.createBufferSource();
	        bufferSource.buffer = buffer;
	        bufferSource.connect( context.analyser );
	        bufferSource[bufferSource.start ? 'start' : 'noteOn'](0);
	        
	      },function(err){
	        console.log(err);
	      })
      });
      
    }
    this.xhr.send();
}
AudioVisualization.prototype.draw = function draw(arr) {
	this.ctx.clearRect(0, 0, this.width, this.height);
	var w = this.width / this.size;
    for(var i=0; i<this.size; i++) {
    	var h = arr[i] / 256 * this.height;
    	this.ctx.fillRect(w*i, this.height - h, w*0.6, h)
	}
}
AudioVisualization.prototype.v = function (){
	 this.analyser.getByteFrequencyData( this.arr );
	 this.draw( this.arr );
	 requestAnimationFrame(this.v.bind(this));
}
AudioVisualization.prototype.random = function(){
	var arr = [];
	for(var i=0;i<this.size;i++){
		arr.push(256*Math.random())
	};
	this.draw(arr)
	setTimeout( this.random.bind(this), 250 )
}