import React from 'react';
import './scss/image-editor.scss';

export default class ReactImageEditor extends React.Component {
    constructor(props) {
        super(props);

        this.rotate = this.rotate.bind(this);
        this.getRotationDegrees = this.getRotationDegrees.bind(this);
    }

    /**
     * Reduce the image size to the bounds provided in props on load
     */
    onLoad() {
        let image = document.getElementById( this.props.id );
        let maxHeight = this.props.height;
        let maxWidth = this.props.width;
        let height = image.style.height;
        let width = image.style.width;

        if (width > maxWidth || height > maxHeight) {
            if (width > height) {
                height = Math.round(maxwidth/width*height);
                width = maxWidth;
            } else {
                width = Math.round(maxHeight/height*width);
                height = maxHeight;
            }
            
            image.style.height = height + 'px';
            image.style.width = width + 'px';
        }
    }

    /**
     * Prevent default events when dragging over image frame
     */
    onDragFrame(e) {
        e.preventDefault();
    }

    /**
     * Track translations within the image frame
     */
    onDropFrame(e) {
        let data = JSON.parse( e.dataTransfer.getData( 'text' ) );
        let target = document.getElementById( data.id );
        let deltaX = e.clientX - parseInt( data.startX );
        let deltaY = e.clientY - parseInt( data.startY );

        e.preventDefault();
        e.stopPropagation();
        
        target.style.top = ( target.offsetTop + deltaY ) + 'px';
        target.style.left = ( target.offsetLeft + deltaX ) + 'px';
    }

    /**
     * Store the start position of the image when draggging has started
     */
    onDragStartImage(e) {
        let data = { id: e.currentTarget.id, startX: e.clientX, startY: e.clientY };
        e.dataTransfer.setData( 'text', JSON.stringify( data ) );
    }

    /**
     * Prevent default events on drag over
     */
    onDragOverImage(e) {
        e.preventDefault();
    }

    /**
     * Resize the image using the mouse wheel
     */
    onWheel(e) {
        var target = e.currentTarget;
        var sign = ( ( e.deltaY || e.wheelDelta ) < 0 ) ? -1 : 1;
        var deltaTop = ( sign * -0.05 ) * target.offsetHeight;
        var deltaLeft = ( sign * -0.05 ) * target.offsetWidth;
        var scalar = 1 + ( sign * 0.1 );
        
        e.preventDefault();
        e.stopPropagation();

        target.style.height = ( scalar * target.offsetHeight ) + 'px';
        target.style.width = ( scalar * target.offsetWidth ) + 'px';
        target.style.top = ( deltaTop + target.offsetTop ) + 'px';
        target.style.left = ( deltaLeft + target.offsetLeft ) + 'px';
    }

    /**
     * Track image translation on drop
     */
    onDropImage(e) {
        var data = JSON.parse( e.dataTransfer.getData( 'text' ) );
        var target = document.getElementById( data.id );
        var deltaX = e.clientX - parseInt( data.startX );
        var deltaY = e.clientY - parseInt( data.startY );

        e.preventDefault();
        e.stopPropagation();
        
        target.style.top = ( target.offsetTop + deltaY ) + 'px';
        target.style.left = ( target.offsetLeft + deltaX ) + 'px';
    }

    rotateLeft() {
        let image = document.getElementById(this.props.id);
        this.rotate(image, -90);
    }

    rotateRight() {
        let image = document.getElementById(this.props.id);
        this.rotate(image, 90);
    }

    rotate(image, deg) {
        var currentRotation = 0;
        var transform = image.style.transform;
        var rotation = 0;
    
        if ( transform != null && transform.length > 0 )
        {
            transform = transform.split( '(' )[1].split( 'deg' )[0];
            if ( transform.length > 0 )
            {
                currentRotation = parseInt( transform );
            }
        }
        
        rotation = ( currentRotation + deg ) % 360;
        image.style.transform = 'rotate(' + rotation + 'deg)';
    }

    getRotationDegrees(image) {
        var transform = image.style.transform;
        var degrees = 0;
    
        if ( transform != null && transform.length > 0 )
        {
            transform = transform.split( '(' )[1].split( 'deg' )[0];
            if ( transform.length > 0 )
            {
                degrees = parseInt( transform );
            }
        }
    
        return degrees;
    }

    /**
     * Create a canvas and perform the actions taken on the image, then save as a dataURL
     */
    saveImage() {
        let image = document.getElementById(this.props.id);
        let canvas = document.getElementsByClassName('image-canvas')[0];
        let self = this;

        let degrees = this.getRotationDegrees( image );
        let left = image.style.left !== '' ? parseInt( image.style.left.replace( 'px', '' ) ) : 0;
        let top = image.style.top !== '' ? parseInt( image.style.top.replace( 'px', '' ) ) : 0;
        let width = image.width;
        let height = image.height;

        let original = document.createElement('img');
            original.onload = function() {
                let xscale = image.width/original.width;
                let yscale = image.height/original.height;
        
                let context = canvas.getContext("2d");
                
                canvas.height = image.parentNode.clientHeight;
                canvas.width = image.parentNode.clientWidth;
        
                context.save();
                context.translate( left, top );
                context.translate(width/2, height/2)
                context.rotate( degrees * Math.PI / 180 );
                context.scale(xscale, yscale);
                context.drawImage( image, -original.width/2, -original.height/2 );
                context.restore();
        
                let dataURL = canvas.toDataURL('image/png');
                image.removeAttribute('style');
                self.props.saveImage(dataURL);
            }
            original.src = image.src;
    }

    render() {
        return(
            <div className="ImageEditor">
                <div className="editor-frame">
                    <label>{this.props.label}</label>
                    <div className="editor-buttons">
                        <button type="button" onClick={this.saveImage.bind(this)}><span className="far fa-save"></span>Save Changes</button>
                        <button type="button" onClick={this.rotateLeft.bind(this)}><span className="fas fa-undo"/>Rotate Left</button>
                        <button type="button" onClick={this.rotateRight.bind(this)}><span className="fas fa-redo"/>Rotate Right</button>
                    </div>
                    <div 
                        className="image-frame" 
                        onDragOver={this.onDragFrame.bind(this)}
                        onDrop={this.onDropFrame.bind(this)}
                    >
                        <img 
                            id={this.props.id}
                            className="input-image" 
                            src={this.props.src} 
                            draggable="true"
                            onLoad={this.onLoad.bind(this)}
                            onDragStart={this.onDragStartImage.bind(this)}
                            onDragOver={this.onDragOverImage.bind(this)}
                            onWheel={this.onWheel.bind(this)}
                            onDrop={this.onDropImage.bind(this)}
                        />
                    </div>
                </div>
                <canvas className="image-canvas"/>
            </div>
        )
    }
}

ImageEditor.defaultProps = {
    src: "#",
    width: 630,
    height: 815,
    label: "",
    id: "editor-image"
}