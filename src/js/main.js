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
            }
        ],
        stageDimensions: {
            width: 640,
            height: 640
        },
        randomRect: {
            min: -30,
            max: 30
        },
        baseRect: {
            width: 25,
            height: 25
        },
        scratchArea: {
            columns: 3,
            rows: 3,
            cellWidth: 200,
            cellHeight: 200,
            offset: 20,
            textureName: 'cell'
        }
    };
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
        me.addLayers(images);
    });
    this.loader.load();
};

/**
 * Creating of a ticker and starting tick
 */
App.prototype.startRender = function () {
    this.ticker = new PIXI.ticker.Ticker();
    var renderer = PIXI.autoDetectRenderer(
            this.CONFIG.stageDimensions.width,
            this.CONFIG.stageDimensions.height,
            {antialias: true, resolution: 1}
        ),
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
            upperGraphics.ctx.strokeRect(
                tempX,
                tempY,
                this.CONFIG.scratchArea.cellWidth,
                this.CONFIG.scratchArea.cellHeight
            );
        }
    }

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
        //erasing of base block
        me.gfx.ctx.clearRect(
            mouseData.data.global.x - me.CONFIG.baseRect.width / 2,
            mouseData.data.global.y - me.CONFIG.baseRect.height / 2,
            me.CONFIG.baseRect.width,
            me.CONFIG.baseRect.height
        );
        //erasing of random block
        me.gfx.ctx.clearRect(
            mouseData.data.global.x,
            mouseData.data.global.y,
            me.getRandomNumber(me.CONFIG.randomRect.min, me.CONFIG.randomRect.max),
            me.getRandomNumber(me.CONFIG.randomRect.min, me.CONFIG.randomRect.max)
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

//Creates an instance of a scratch mechanism class
var scratch = new App();