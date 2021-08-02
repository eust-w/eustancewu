/**
 * Converter from source image to result symbols grid.
 * 
 * @author Haru Atari <HaruAtari@gmail.com>
 */
var Converter = function()
{
    var _this = this;
    
    /**
     * @var string Id of used text input field.
     */
    var usedTextInputId = "input-used-text";
    
    /**
     * @var string Id of font size input field.
     */
    var fontSizeInputId = "input-font-size";
    
    /**
     * @var string Id of background color input field.
     */
    var backgroundColorInputId = "input-background-color";
    
    /**
     * @var string Id of background transparent input field.
     */
    var backgroundTransparentInputId = "input-background-transparent";
    
    /**
     * @var stiring Id of create button.
     */
    var createButtonId = "create-button";
    
    /**
     * @var string Id of full-screen button.
     */
    var fullScreenButtonId = "full-screen-button";
    
    /**
     * @var string Id ofcanvas.
     */
    var canvasId = "canvas";
    
    /**
     * @var integer Canvas width.
     */
    var canvasWidth = 0;
    
    /**
     * @var integer Canvas heigth.
     */
    var canvasHeight = 0;
    
    /**
     * @var integer Width of used symbol.
     */
    var usedTextWidth = 0;
    
    /**
     * @var integer Height of used symbol.
     */
    var usedTextHeight = 0;
    
    /**
     * @var integer Number of next used symbol
     */
    var nextUsedChar = 0;

    /**
     * Cinstructot.
     * @return void.
     */
    var _constructor = function()
    {

    };

    /**
     * Convert source image to result letters grid.
     * Wtite result into result image preview.
     * @return void.
     */
    this.convert = function()
    {
        countUsedTextSize();
        var image = previews.getSource();
        setCanvasWidth(image.width);
        setCanvasHeight(image.height);
        getCanvasContext().drawImage(image, 0, 0);
        previews.getResult().width = image.width;
        previews.getResult().height = image.height;
        previews.getResult().src = getResultData();
        _this.getFullScreenButton().disabled = false;
    };

    /**
     * Open result image in new window.
     * @return void.
     */
    this.fullScreen = function()
    {
        window.open(previews.getResult().src);
    };

    /**
     * @return DOM-object Used text input field.
     */
    this.getUsedTextField = function() { return document.getElementById(usedTextInputId); };

    /**
     * @return DOM-object Font size input field.
     */
    this.getFontSizeField = function() { return document.getElementById(fontSizeInputId); };

    /**
     * @return DOM-object Background color input field.
     */
    this.getBackgroundColorField = function() { return document.getElementById(backgroundColorInputId); };

    /**
     * @retrn DOM-object Background transparent input field.
     */
    this.getBackgroundTransparentField = function() { return document.getElementById(backgroundTransparentInputId); };

    /**
     * @return DOM-object Create button
     */
    this.getCreateButton = function() { return document.getElementById(createButtonId); };

    /**
     * @return DOM-object Full-screen button.
     */
    this.getFullScreenButton = function() { return document.getElementById(fullScreenButtonId); };

    /**
     * @retur string Used text.
     */
    this.getUsedText = function() {return _this.getUsedTextField().value; };

    /*
     * @return integet Font size.
     */
    this.getFontSize = function() { return _this.getFontSizeField().value; };

    /**
     * Return background color. If {@link getBackgroundTranspatent()} is true? return rgba(0,0,0,0).
     * @return string
     */
    this.getBackgroundColor = function() { return (_this.getBackgroundTransparent() == true) ? "rgba(0,0,0,0)" : _this.getBackgroundColorField().value; };

    /**
     * @return bool Bacjground transparent.
     */
    this.getBackgroundTransparent = function() { return _this.getBackgroundTransparentField().checked; };

    /**
     * Convert source image into result and return result base64 hash.
     * @return string
     */
    var getResultData = function()
    {
        var pixelsList = getAvgPixelsGrid();
        var context = getCanvasContext();
        var width = getCanvasWidth();
        var height = getCanvasHeight();

        context.clearRect(0, 0, width, height);
        context.fillStyle =  _this.getBackgroundColor();
        context.fillRect(0, 0, width, height);

        for (var i = 0; i < pixelsList.length; i++) {
            var px = pixelsList[i];
            context.fillStyle = "rgba(" + px.r +", " + px.g + ", " + px.b + ", " + px.a + ")";
            context.font = _this.getFontSize() + "px Monospace";
            context.fillText(getNextUsedChar(), px.x, px.y);
        }

        return getCanvas().toDataURL();
    };

    /**
     * Return next symbol of used text. 
     * Repeat used tex.
     * @return string.
     */
    var getNextUsedChar = function()
    {
        var str = _this.getUsedText();

        var re = str.substring(nextUsedChar, nextUsedChar+1);
        nextUsedChar++;
        if(nextUsedChar == str.length) {
            nextUsedChar = 0;
        }
        return re;
    };

    /**
     * Return array imageData of source image.
     * @see http://www.w3schools.com/tags/canvas_getimagedata.asp
     * 
     *
     * @return array getImageData().data
     */
    var getSourceData = function() {
        return getCanvasContext().getImageData(0, 0, getCanvasWidth(), getCanvasHeight()).data;
    };

    /**
     * Convert {@link getSourceData()} to two-dimensional array.
     * @return array
     */
    var getPixelsGrid  =function()
    {
        var sourceData = getSourceData();

        var res = [];
        for (var i = 0; i < sourceData.length; i += 4) {
            var y = Math.floor(i / (getCanvasWidth() * 4));
            var x = (i - (y * getCanvasWidth() * 4)) / 4;
            if (typeof res[x] === "undefined") {
                res[x] = [];
            }
            res[x][y] = {
                r: sourceData[i+0],
                g: sourceData[i+1],
                b: sourceData[i+2],
                a: sourceData[i+3]
            }
        }
        return res;

    };

    /**
     * Return list of color areas, which will contain used symbols.
     * Every element has next data:
     * <code>
     * [
     *  'r': <red chanel>,
     *  'g': <green chanel>,
     *  'b': <blue chanel>,
     *  'a': <alfa chanel>,
     *  'x': <x-position on result image>,
     *  'y': '<y-position on result image>
     *  ]
     *  </code>
     *  
     *  @return array
     */
    var getAvgPixelsGrid = function()
    {
        var pixelsGrid = getPixelsGrid();

        var res = [];
        var stepX = getUsedTextWidth();
        var stepY = getUsedTextHeight();
        var countStepsX = getCanvasWidth() / stepX;
        var countStepsY = getCanvasHeight() / stepY;

            for (var y = 0; y < countStepsY; y++) {
                for (var x = 0; x < countStepsX; x++) {
                res.push({
                    x: x * stepX,
                    y: y * stepY,
                    r: pixelsGrid[x * stepX][y * stepY].r,
                    g: pixelsGrid[x * stepX][y * stepY].g,
                    b: pixelsGrid[x * stepX][y * stepY].b,
                    a: pixelsGrid[x * stepX][y * stepY].a
                });
            }
        }
        return res;

    };

    /**
     * Count size of used text symbol.
     * Save values into {@link usedTextWidth} and {@link usedTextHeight}.
     * return void
     */
    var countUsedTextSize = function()
    {
        var block = document.createElement("span");
        block.innerHTML = _this.getUsedText()[0];
        block.style.fontSize = _this.getFontSize()+"px";
        block.style.fontFamily = "Monospace";
        document.body.appendChild(block);
        setUsedTextWidth(block.offsetWidth);
        setUsedTextHeight(Math.floor(block.offsetHeight - (block.offsetHeight * 0.2)));
        document.body.removeChild(block);
    };

    /**
     * @return DOM-object Canvas.
     */
    var getCanvas = function() { return document.getElementById(canvasId); };

    /**
     * @return object Canvas 2d context.
     */
    var getCanvasContext = function() { return getCanvas().getContext("2d"); };

    /**
     * @return integer Canvas width.
     */
    var getCanvasWidth = function() { return canvasWidth; };
    
    /**
     * Set canvas width;
     * @param integet val New width.
     * @return integet New canvas width.
     */
    var setCanvasWidth = function(val) { return getCanvas().width = canvasWidth = val * 1; };

    /**
     * @return integer Canvas height.
     */
    var getCanvasHeight = function() { return canvasHeight; };
    
    /**
     * Set canvas height;
     * @param integet val New height.
     * @return integet New canvas height.
     */
    var setCanvasHeight = function(val) { return getCanvas().height = canvasHeight = val * 1; };

    /**
     * @return integer Used text with.
     */
    var getUsedTextWidth = function() { return usedTextWidth; };
    
    /**
     * Set used text witht;
     * @param integet val New witht.
     * @return integet New used text witht.
     */
    var setUsedTextWidth = function(val) { return usedTextWidth = val * 1; };

    /**
     * @return integer Used text height.
     */
    var getUsedTextHeight = function() { return usedTextHeight; };
    
    /**
     * Set used text height;
     * @param integet val New height.
     * @return integet New used text height.
     */
    var setUsedTextHeight = function(val) { return usedTextHeight = val * 1; };

    _constructor.apply(this, arguments);
};
