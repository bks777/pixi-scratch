function App(){
    this.startRender();
    this.loadImages();
}

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

App.prototype.setUserActions = function () {
    this.stage.interactive = true;
    var me = this;
    this.stage.mousedown = function () {
        me.isMouseDown = true;
    };
    this.stage.mouseup = function () {
        me.isMouseDown = false;
    };
    this.stage.mousemove = function(mouseData){
        if (!me.isMouseDown){
            return;
        }
        me.gfx.ctx.clearRect(
            mouseData.data.global.x,
            mouseData.data.global.y,
            me.getRandomNumber(-50, 50),
            me.getRandomNumber(-50, 50)
        );
        me.layer.texture = PIXI.Texture.fromCanvas(me.gfx.canvas);
        me.gfx.canvas._pixiId = undefined;
    }
};

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

App.prototype.getRandomNumber = function(min, max){
    return Math.floor(Math.random() * (max - min)) + min;
};

var scratch = new App();