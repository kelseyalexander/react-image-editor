# react-image-editor
An image editing component for ReactJS with translation, scaling, and rotation. Returns the dataURL of the edited image.

- [Properties](#properties)
- [Usage](#usage)
- [License](#license)

## Properties

| Prop Name       | Type     | Default | Description                                            |
|-----------------|----------|---------|--------------------------------------------------------|
| id              | String   | ""      | ID of the image being edited                           |
| src             | String   | #       | URL of the image being edited                          |
| width           | Int      | 630     | Maximum allowed width of the image                     |
| height          | Int      | 815     | Maximum allowed height of the image                    |
| label           | String   | ""      | Label to show above the editor                         |
| saveImage       | Function | N/A     | Function in parent to call when saving the new dataURL |

## Usage
```jsx

import React from 'react';
import ReactImageEditor from 'react-image-editor';

export default class MyClass extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            image: ""
        }
    }

    saveImage(dataURL) {
        this.setState({image: dataURL});
    }

    render() {
        return (
            <div>
                <ReactImageEditor
                    src={this.state.image}
                    width={630}
                    height={815}
                    label=""
                    id="editor-image"
                    saveImage={(dataUrl) => this.saveImage(dataURL)}
                />
            </div>
        )
    }
}
```

## License
MIT Licensed.