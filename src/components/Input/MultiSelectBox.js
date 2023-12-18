import { useEffect, useState } from "react";
import { MultiSelect } from 'primereact/multiselect';

function MultiSelectBox({ labelTitle, labelStyle, type, containerStyle, defaultValue, placeholder, updateFormValue, updateType, options, optionLabel }) {
    const [selectedValue, setSelectedValue] = useState([]);

    useEffect(() => {
        // Set default values when they change
        setSelectedValue(defaultValue || []);
    }, [defaultValue]);

    const updateInputValue = (selectedValues) => {
        setSelectedValue(selectedValues);
        updateFormValue({ updateType, value: selectedValues });
    };

    return (
        <div className={`form-control w-full ${containerStyle}`}>
            <label className="label">
                <span className={`label-text text-base-content ${labelStyle}`}>{labelTitle}</span>
            </label>
            <MultiSelect
                value={selectedValue}
                onChange={(e) => updateInputValue(e.value)}
                options={options}
                optionLabel={optionLabel}
                placeholder={placeholder || ""}
                className="w-full"
            />
        </div>
    );
}

export default MultiSelectBox;
