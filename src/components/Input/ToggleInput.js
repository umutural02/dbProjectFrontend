import { useState } from "react"


function ToggleInput({labelTitle, labelStyle, type, containerStyle, defaultValue, placeholder, updateFormValue, updateType}){

    const [value, setValue] = useState(defaultValue)

    const updateToggleValue = () => {
        setValue(!value)
        updateFormValue({updateType, value : !value})
    }

    const toggleClasses = `toggle ${value ? 'bg-green-200' : ''}`;

    return(
        <div className={`form-control w-full ${containerStyle}`}>
            <label className="label cursor-pointer">
                <span className={"label-text text-base-content " + labelStyle}>{labelTitle}</span>
                <input type="checkbox" className={toggleClasses} checked={value}  onChange={(e) => updateToggleValue()}/>
            </label>
        </div>
    )
}


export default ToggleInput
