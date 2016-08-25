/**
 * Application
 * @constructor
 */
function App(){
    this.startRender();
    this.loadImages();
}

/**
 * PIXI loader for images
 */
App.prototype.loadImages = function () {
    var me = this,
        images = [];

    this.loader = PIXI.loader;
    this.loader.add('back', 'res/1.jpg');
    this.loader.once('complete', function (loader, res) {
        for (var image in res){
            images[image] = new PIXI.Texture(
                new PIXI.BaseTexture(res[image].data)
            );
        }
        me.addLayers(images);
    });
    this.loader.load();
};

/**
 * Creating of a ticker and starting tick
 */
App.prototype.startRender = function () {
    this.ticker = new PIXI.ticker.Ticker();
    var renderer = PIXI.autoDetectRenderer(640, 480, {antialias: true, resolution: 1}),
        stage = new PIXI.Container();
    document.getElementById('container').appendChild(renderer.view);
    this.stage = stage;
    this.ticker.add(function () {
        renderer.render(stage);
    });
    this.ticker.start();
};

/**
 * Adding Images to stage
 * @param textures {Object} PIXI Texture
 */
App.prototype.addLayers = function (textures) {
    var upperGraphics = this.getCanvas(640, 480),
        backLayer = new PIXI.Sprite(textures['back']),
        upperLayer = new PIXI.Sprite();

    upperGraphics.ctx.fillStyle = '#cccccc';
    upperGraphics.ctx.fillRect(0,0,640,480);
    this.gfx = upperGraphics;

    upperLayer.texture = PIXI.Texture.fromCanvas(upperGraphics.canvas);
    this.layer = upperLayer;

    this.setUserActions();

    this.stage.addChild(backLayer);
    this.stage.addChild(upperLayer);
};

/**
 * Setting of listeners and their logic.
 * Dragging logic.
 */
App.prototype.setUserActions = function () {
    this.stage.interactive = true;
    var me = this;
    this.stage.touchstart = this.stage.mousedown = function () {
        me.isMouseDown = true;
    };
    this.stage.touchend = this.stage.mouseup = function () {
        me.isMouseDown = false;
    };
    this.stage.touchmove = this.stage.mousemove = function(mouseData){
        if (!me.isMouseDown){
            return;
        }
        //erasing of random block
        me.gfx.ctx.clearRect(
            mouseData.data.global.x,
            mouseData.data.global.y,
            me.getRandomNumber(-50, 50),
            me.getRandomNumber(-50, 50)
        );
        me.layer.texture.update();
    }
};

/**
 * Creating a new HTML5 Canvas
 * @param width {Number}
 * @param height {Number}
 * @returns {{canvas: Element, ctx: (CanvasRenderingContext2D|*)}}
 */
App.prototype.getCanvas = function (width, height) {
    var canavs = document.createElement("canvas"),
        ctx;
    canavs.width = width;
    canavs.height = height;
    ctx = canavs.getContext("2d");
    return {
        canvas: canavs,
        ctx: ctx
    }
};

/**
 * Creating of random number
 * @param min {Number} from
 * @param max {Number} to
 * @returns {*}
 */
App.prototype.getRandomNumber = function(min, max){
    return Math.floor(Math.random() * (max - min)) + min;
};

//Creates an instance of scratch mechanism class
var scratch = new App();