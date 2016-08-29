/**
 * Application
 * @constructor
 */
function App(){
    this.CONFIG = {
        images: [
            {
                name: 'cell',
                path: 'res/cell.png'
            },
            {
                name: 'gift',
                path: 'res/gift.png'
            }
        ],
        stageDimensions: {
            width: 640,
            height: 640
        },
        randomRect: {
            count: 10,
            min: -25,
            max: 35
        },
        baseRect: {
            width: 18,
            height: 18,
            xOffset: -9,
            yOffset: -9
        },
        horizontalRect: {
            width: 24,
            height: 6,
            xOffset: -12,
            yOffset: -3
        },
        verticalRect: {
            width: 6,
            height: 24,
            xOffset: -3,
            yOffset: -12
        },
        ghostRect: {
            xOffset: 8,
            yOffset: 8
        },
        scratchArea: {
            columns: 3,
            rows: 3,
            cellWidth: 200,
            cellHeight: 200,
            offset: 20,
            textureName: 'cell',
            imageName: 'gift'
        }
    };
    this.generateRandomBuffer();
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
    this.CONFIG.images.forEach(function (element) {
        me.loader.add(element.name, element.path);
    });

    this.loader.once('complete', function (loader, res) {
        for (var image in res){
            images[image] = new PIXI.Texture(
                new PIXI.BaseTexture(res[image].data)
            );
        }
        me.generateLayers(images);
    });
    this.loader.load();
};

/**
 * Creating of a ticker and starting tick
 */
App.prototype.startRender = function () {
    var renderer = PIXI.autoDetectRenderer(
            this.CONFIG.stageDimensions.width,
            this.CONFIG.stageDimensions.height,
            {antialias: true, resolution: 1}
        ),
        stage = new PIXI.Container(),
        stats = this.generateStats();

    this.ticker = new PIXI.ticker.Ticker();
    document.getElementById('container').appendChild(renderer.view);
    this.stage = stage;
    this.ticker.add(function () {
        stats.begin();
        renderer.render(stage);
        stats.end();
    });
    this.ticker.start();
};

/**
 * Adding Images to stage
 * @param textures {Object} PIXI Texture
 */
App.prototype.generateLayers = function (textures) {
    var upperGraphics = this.getCanvas(
            this.CONFIG.stageDimensions.width,
            this.CONFIG.stageDimensions.height
        ),
        backLayer = new PIXI.Container(),
        upperLayer = new PIXI.Sprite(),
        columnId,
        rowId,
        tempSprite,
        tempX,
        tempY;

    upperGraphics.ctx.strokeStyle = '#009900';
    upperGraphics.ctx.fillStyle = '#cccccc';
    upperGraphics.ctx.fillRect(
        0,
        0,
        this.CONFIG.stageDimensions.width,
        this.CONFIG.stageDimensions.height
    );
    //Adding of scratch boxes
    for (columnId = 0; columnId < this.CONFIG.scratchArea.columns; columnId++){
        for(rowId = 0; rowId < this.CONFIG.scratchArea.rows; rowId++){
            tempX =  (columnId * this.CONFIG.scratchArea.cellWidth) + (columnId * this.CONFIG.scratchArea.offset);
            tempY = (rowId *  this.CONFIG.scratchArea.cellHeight) + (rowId * this.CONFIG.scratchArea.offset);
            tempSprite = new PIXI.Sprite(textures[this.CONFIG.scratchArea.textureName]);//Here we can take random texture
            tempSprite.width = this.CONFIG.scratchArea.cellWidth;
            tempSprite.height = this.CONFIG.scratchArea.cellHeight;
            tempSprite.position = new PIXI.Point(tempX, tempY);
            backLayer.addChild(tempSprite);
            //Adding a rects to upper layer
            upperGraphics.ctx.drawImage(textures[this.CONFIG.scratchArea.imageName].baseTexture.source, tempX, tempY);
            upperGraphics.ctx.strokeRect(
                tempX,
                tempY,
                this.CONFIG.scratchArea.cellWidth,
                this.CONFIG.scratchArea.cellHeight
            );
        }
    }
    backLayer.cacheAsBitmap = true;

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
    var me = this;

    this.stage.interactive = true;
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

        me.gfx.ctx.clearRect(
            mouseData.data.global.x + me.CONFIG.baseRect.xOffset,
            mouseData.data.global.y + me.CONFIG.baseRect.yOffset,
            me.CONFIG.baseRect.width,
            me.CONFIG.baseRect.height
        );
        me.gfx.ctx.clearRect(
            mouseData.data.global.x + me.CONFIG.horizontalRect.xOffset,
            mouseData.data.global.y + me.CONFIG.horizontalRect.yOffset,
            me.CONFIG.horizontalRect.width,
            me.CONFIG.horizontalRect.height
        );
        me.gfx.ctx.clearRect(
            mouseData.data.global.x + me.CONFIG.verticalRect.xOffset,
            mouseData.data.global.y + me.CONFIG.verticalRect.yOffset,
            me.CONFIG.verticalRect.width,
            me.CONFIG.verticalRect.height
        );
        //Ghost
        me.gfx.ctx.clearRect(
            mouseData.data.global.x + me.CONFIG.baseRect.xOffset + me.CONFIG.ghostRect.xOffset,
            mouseData.data.global.y + me.CONFIG.baseRect.yOffset + me.CONFIG.ghostRect.yOffset,
            me.CONFIG.baseRect.width,
            me.CONFIG.baseRect.height
        );
        me.gfx.ctx.clearRect(
            mouseData.data.global.x + me.CONFIG.horizontalRect.xOffset + me.CONFIG.ghostRect.xOffset,
            mouseData.data.global.y + me.CONFIG.horizontalRect.yOffset + me.CONFIG.ghostRect.yOffset,
            me.CONFIG.horizontalRect.width,
            me.CONFIG.horizontalRect.height
        );
        me.gfx.ctx.clearRect(
            mouseData.data.global.x + me.CONFIG.verticalRect.xOffset + me.CONFIG.ghostRect.xOffset,
            mouseData.data.global.y + me.CONFIG.verticalRect.yOffset + me.CONFIG.ghostRect.yOffset,
            me.CONFIG.verticalRect.width,
            me.CONFIG.verticalRect.height
        );
        me.layer.texture.update();
        }
};

/**
 * Pre-rendering of deltas for position
 */
App.prototype.generateRandomBuffer = function(){
    var i = 0,
        maxL = this.CONFIG.randomRect.count,
        buff = [],
        tempXDelta, tempYDelta;

    for(i; i < maxL; i++){
        tempXDelta = this.getRandomNumber(this.CONFIG.randomRect.min, this.CONFIG.randomRect.max);
        tempYDelta = this.getRandomNumber(this.CONFIG.randomRect.min, this.CONFIG.randomRect.max);
        buff.push([tempXDelta, tempYDelta]);
    }

    this._positionBuffer = buff;
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

/**
 * Getting of random position
 * @return {Array}
 */
App.prototype.getRandomPositionBuffer = function () {
    var idx = Math.floor((Math.random() * (this.CONFIG.randomRect.count - 1)) + 1);
    return this._positionBuffer[idx];
};

/**
 * Generates and add stats
 * @returns {Stats}
 */
App.prototype.generateStats = function() {
    var stats = new Stats();
    stats.setMode(2);
    document.body.appendChild(stats.domElement);

    return stats;
};

//Creates an instance of a scratch mechanism class
var scratch = new App();