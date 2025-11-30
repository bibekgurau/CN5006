import React from "react";
import './App.css'
import './Calculator.css'
import Button from "./Button.js";
import {useState} from "react";
import myImage from './image.jpg'; 

function KeyPadComponent(props){
    const [text1, setText] = useState("")
    const [showImage, setShowImage] = useState(false)

    const ClickHandle = (e) => {
        const value = e.target.value;
        
        if (value === "C" || value === "CE") {
            setText("")
            setShowImage(false)
        }
        else if (value === "=") {
            try {
                const result = eval(text1);
                setText(result.toString())
            } catch (error) {
                setText("Error")
            }
        }
        else if (value === "show me") {
            setShowImage(true)
        }
        else if (value === "square") {
            try {
                const num = parseFloat(text1);
                if (!isNaN(num)) {
                    const square = num * num;
                    setText(square.toString())
                } else {
                    setText("Invalid number")
                }
            } catch (error) {
                setText("Error")
            }
        }
        else {
            setText(text1 + value)
        }
    };

    return (
        <div className="Calculator">
            <div className="screen-row">
                <input type="text" readOnly value={text1} />
            </div>
            
            {/* Image display area */}
            {showImage && (
                <div className="image-container">
                    <img 
                        src={myImage} 
                        alt="My Picture" 
                        className="profile-image"
                        onError={(e) => {
                            console.error("Image failed to load");
                            e.target.style.display = 'none';
                            setText("Image import failed");
                        }}
                    />
                </div>
            )}

            <div>
                <Button label="(" ClickHandle={ClickHandle} />
                <Button label="CE" ClickHandle={ClickHandle} />
                <Button label=")" ClickHandle={ClickHandle}/>
                <Button label="C" ClickHandle={ClickHandle}/> 
            </div>

            <div>
                <Button label="1"  ClickHandle={ClickHandle}/>
                <Button label="2" ClickHandle={ClickHandle}/>
                <Button label="3" ClickHandle={ClickHandle}/>
                <Button label="+" ClickHandle={ClickHandle}/>
            </div>
            <div>
                <Button label="4" ClickHandle={ClickHandle}/>
                <Button label="5" ClickHandle={ClickHandle}/>
                <Button label="6" ClickHandle={ClickHandle}/>
                <Button label="-" ClickHandle={ClickHandle}/>
            </div>
            <div>
                <Button label="7" ClickHandle={ClickHandle}/>
                <Button label="8" ClickHandle={ClickHandle}/>
                <Button label="9" ClickHandle={ClickHandle}/>
                <Button label="*" ClickHandle={ClickHandle}/>
            </div>
            <div>
                <Button label="." ClickHandle={ClickHandle}/>
                <Button label="0" ClickHandle={ClickHandle}/>
                <Button label="=" ClickHandle={ClickHandle}/>
                <Button label="/" ClickHandle={ClickHandle}/>
            </div>
            
            <div className="special-buttons">
                <Button label="show me" ClickHandle={ClickHandle}/>
                <Button label="square" ClickHandle={ClickHandle}/>
            </div>
        </div>
    );
}

export default KeyPadComponent;