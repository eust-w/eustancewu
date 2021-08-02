/**
 * Class for working with source and result images.
 * 
 * @author Haru Atari <HaruAtari@gmail.com>
 */
var Previews = function()
{
    var _this = this;
    
    /**
     * @var string Id of source image preview.
     */
    var sourceId = "image-source";
    
    /**
     * @var string Id of result inage preview.
     */
    var resultId = "image-result";

    /**
     * Constructor.
     * @return void
     */
    var _constructor = function()
    {

    };

    /**
     * @return DOM-object Source image preview.
     */
    this.getSource = function() { return document.getElementById(sourceId); };

    /**
     * @return DOM-object Result image preview.
     */
    this.getResult = function() { return document.getElementById(resultId); };

    /**
     * Set src attribute for source image preview.
     * @param string url New value of attribute.
     * @return string New value of attribute.
     */
    this.setSourceUrl = function(url) { return _this.getSource().src = url; };

    _constructor.apply(this, arguments);
};
