/**
 * Class for uploading source file.
 * 
 * @author Haru Atari <HaruAtari@gmail.com>
 */
var Input = function()
{
    var _this = this;
    
    /**
     * @var string Id of input field.
     */
    var inputFieldId = "source-image-file";
	
    /**
     * @var string Id of input area.
     */
    var inputAreaId = "source-image-area";
	
    /**
     * @var string Uploaded file in base46 hash.
     */
    var fileData = null;
	
    /**
     * @var array List of allow mime types.
     */
    var allowMimeTypes = [
        "image/jpg",
        "image/jpeg",
        "image/png"
    ];

    /**
     * Constructor.
     * @return void
     */
    var _constructor = function()
    {

    };

    /**
     * Load file from input field.
     *
     * @see loadFile()
     *
     * @param object event Change-event of file field.
     * @return void
     */
    this.loadFromField = function(event)
    {
        loadFile(event.target.files[0]);
    };

    /**
     * Load file from input area.
     *
     * @see loadFile()
     *
     * @param object event Drop-event of file area.
     * @return void
     */
    this.loadFromArea = function(event)
    {
        event.stopPropagation();
        event.preventDefault();
        loadFile(event.dataTransfer.files[0]);
    };

    /**
     * Handler for input area dragOver-event.
     * @param object event DragOver-event of file area.
     * @return void
     */
    this.areaDragOverHandler = function(event)
    {
        event.stopPropagation();
        event.preventDefault();
        event.dataTransfer.dropEffect = "copy";
    };

    /**
     * @return DOM-object Input field.
     */
    this.getField = function() {
        return document.getElementById(inputFieldId);
    };

    /**
     * @return DOM-object Input area.
     */
    this.getArea = function() {
        return document.getElementById(inputAreaId);
    };

    /**
     * @return string {@link FileData}
     */
    this.getFileData = function() {
        return fileData;
    }

    /**
     * @return array {@link allowMimeTypes}
     */
    this.getAllowMimeTypes = function() {
        return allowMimeTypes;
    };

    /**
     * Save uploaded file as base64 hash into {@link FileData}.
     * Load this file into preview image.
     * *
     * @see loadFromField()
     * @see loadFromArea()
     * 
     * @param object file Upload file.
     * @retrn void
     */
    var loadFile = function(file)
    {
        if(checkMimeType(file) === false) {
            alert("File has deny mime type.");
            throw "File has deny mime type.";
        }

        var reader = new FileReader();
        reader.onload = function(data) {
            fileData = data.target.result;
            previews.setSourceUrl(fileData);
            converter.getCreateButton().disabled = false;
        }
        reader.readAsDataURL(file);
    };

    /**
     * Check if file has allow mime type.
     * @paran object file File to be checked
     * @return bool
     */
    var checkMimeType = function(file) {
        return _this.getAllowMimeTypes().indexOf(file.type) > -1;
    };

    _constructor.apply(this, arguments);
};
