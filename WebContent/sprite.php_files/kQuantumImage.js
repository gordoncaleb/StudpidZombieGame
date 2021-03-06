///////////////////////////////////////////////////////////////////////
//  QImage
///////////////////////////////////////////////////////////////////////
/**
 * QImage constructor
 * @constructor
 * @augments Kinetic.Shape
 * @param {Object} config
 */
Kinetic.QImage = function(config) {
    // defaults
	
	this.vx = 0;
	this.vy = 0;
	
    if(config.width === undefined) {
        config.width = config.image.width;
    }
    if(config.height === undefined) {
        config.height = config.image.height;
    }
    if(config.srcx === undefined) {
        config.srcx = 0;
    }
    if(config.srcy === undefined) {
        config.srcy = 0;
    }
    if(config.srcwidth === undefined) {
        config.srcwidth = config.image.width;
    }
    if(config.srcheight === undefined) {
        config.srcheight = config.image.height;
    }
    config.drawFunc = function(canvas) {
        var context = canvas.getContext();
        context.beginPath();
        context.rect(0, 0, this.width, this.height);
        context.closePath();
        canvas.fillStroke(this);
        context.drawImage(this.image, this.srcx, this.srcy, this.srcwidth, this.srcheight, 0, 0, this.width, this.height);
    };
    // call super constructor
    Kinetic.Shape.apply(this, [config]);
};
/*
 * QImage methods
 */
Kinetic.QImage.prototype = {
    /**
     * set image
     * @param {ImageObject} image
     */
    setImage: function(image) {
        this.image = image;
    },
    /**
     * get image
     */
    getImage: function(image) {
        return this.image;
    },
    /**
     * set width
     * @param {Number} width
     */
    setWidth: function(width) {
        this.width = width;
    },
    /**
     * get width
     */
    getWidth: function() {
        return this.width;
    },
    /**
     * set height
     * @param {Number} height
     */
    setHeight: function(height) {
        this.height = height;
    },
    /**
     * get height
     */
    getHeight: function() {
        return this.height;
    },
    /**
     * set width and height
     * @param {Number} width
     * @param {Number} height
     */
    setSize: function(width, height) {
        this.width = width;
        this.height = height;
    },
    
    getVX: function(){
    	return this.vx;
    },
    
    getVY: function(){
    	return this.vy;
    },
    
    setVX: function(vx){
    	this.vx = vx;
    },
    
    setVY: function(vy){
    	this.vy = vy;
    }
    
};
// extend Shape
Kinetic.Global.extend(Kinetic.QImage, Kinetic.Shape);
