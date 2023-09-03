

declare module "../NodeTypes.js" {
    type HTMLElementUppercaseNameMap = { [K in Uppercase<keyof HTMLElementTagNameMap>]: HTMLElementTagNameMap[Lowercase<K>] };

    export interface NodeNameToType extends HTMLElementUppercaseNameMap {
        "#document": Document
        "#text": Text
    }

    type HTMLElementUppercaseEmptyNames = "INPUT" | "HR" | "IMG" | "SOURCE";

    type HTMLElementUppercaseChildMap = {
        [K in keyof Omit<HTMLElementUppercaseNameMap, "UL" | "OL" | HTMLElementUppercaseEmptyNames>]: NodeName | "#text"
    } & {
        UL: "LI"
        OL: "LI"
    } & {
            [K in keyof HTMLElementUppercaseEmptyNames]: never
        }

    export interface NodeNameToChildName extends HTMLElementUppercaseChildMap {
    }

    interface HTMLElementProperties {
        className?: string
        style?: Partial<CSSStyleDeclaration>
        onclick?: GlobalEventHandlers["onclick"]
    }

    interface HTMLInputProperties extends HTMLElementProperties {
        /** Sets or retrieves a comma-separated list of content types. */
        accept?: string;
        /** Sets or retrieves a text alternative to the graphic. */
        alt?: string;
        /** Specifies whether autocomplete is applied to an editable text field. */
        autocomplete?: string;
        capture?: string;
        /** Sets or retrieves the state of the check box or radio button. */
        checked?: boolean;
        /** Sets or retrieves the state of the check box or radio button. */
        defaultChecked?: boolean;
        /** Sets or retrieves the initial contents of the object. */
        defaultValue?: string;
        dirName?: string;
        disabled?: boolean;
        /** Returns a FileList object on a file type input object. */
        files?: FileList | null;
        /** Overrides the action attribute (where the data on a form is sent) on the parent form element. */
        formAction?: string;
        /** Used to override the encoding (formEnctype attribute) specified on the form element. */
        formEnctype?: string;
        /** Overrides the submit method attribute previously specified on a form element. */
        formMethod?: string;
        /** Overrides any validation or required attributes on a form or form elements to allow it to be submitted without validation. This can be used to create a "save draft"-type submit option. */
        formNoValidate?: boolean;
        /** Overrides the target attribute on a form element. */
        formTarget?: string;
        /** Sets or retrieves the height of the object. */
        height?: number;
        /** When set, overrides the rendering of checkbox controls so that the current value is not visible. */
        indeterminate?: boolean;
        /** Defines the maximum acceptable value for an input element with type="number".When used with the min and step attributes, lets you control the range and increment (such as only even numbers) that the user can enter into an input field. */
        max?: string;
        /** Sets or retrieves the maximum number of characters that the user can enter in a text control. */
        maxLength?: number;
        /** Defines the minimum acceptable value for an input element with type="number". When used with the max and step attributes, lets you control the range and increment (such as even numbers only) that the user can enter into an input field. */
        min?: string;
        minLength?: number;
        /** Sets or retrieves the Boolean value indicating whether multiple items can be selected from a list. */
        multiple?: boolean;
        /** Sets or retrieves the name of the object. */
        name?: string;
        /** Gets or sets a string containing a regular expression that the user's input must match. */
        pattern?: string;
        /** Gets or sets a text string that is displayed in an input field as a hint or prompt to users as the format or type of information they need to enter.The text appears in an input field until the user puts focus on the field. */
        placeholder?: string;
        readOnly?: boolean;
        /** When present, marks an element that can't be submitted without a value. */
        required?: boolean;
        selectionDirection?: "forward" | "backward" | "none" | null;
        /** Gets or sets the end position or offset of a text selection. */
        selectionEnd?: number | null;
        /** Gets or sets the starting position or offset of a text selection. */
        selectionStart?: number | null;
        size?: number;
        /** The address or URL of the a media resource that is to be considered. */
        src?: string;
        /** Defines an increment or jump between values that you want to allow the user to enter. When used with the max and min attributes, lets you control the range and increment (for example, allow only even numbers) that the user can enter into an input field. */
        step?: string;
        /** Returns the content type of the object. */
        type?: string;
        /** Returns the value of the data at the cursor's current position. */
        value?: string;
        /** Returns a Date object representing the form control's value, if applicable; otherwise, returns null. Can be set, to change the value. Throws an "InvalidStateError" DOMException if the control isn't date- or time-based. */
        valueAsDate?: Date | null;
        /** Returns the input field value as a number. */
        valueAsNumber?: number;
        webkitdirectory?: boolean;
        /** Sets or retrieves the width of the object. */
        width?: number;
    }

    interface HTMLButtonProperties extends HTMLElementProperties {
        disabled?: boolean;
        /** Overrides the action attribute (where the data on a form is sent) on the parent form element. */
        formAction?: string;
        /** Used to override the encoding (formEnctype attribute) specified on the form element. */
        formEnctype?: string;
        /** Overrides the submit method attribute previously specified on a form element. */
        formMethod?: string;
        /** Overrides any validation or required attributes on a form or form elements to allow it to be submitted without validation. This can be used to create a "save draft"-type submit option. */
        formNoValidate?: boolean;
        /** Overrides the target attribute on a form element. */
        formTarget?: string;
        /** Sets or retrieves the name of the object. */
        name?: string;
        /** Gets the classification and default behavior of the button. */
        type?: string;
        /** Sets or retrieves the default or selected value of the control. */
        value?: string;
    }

    interface HTMLTextAreaProperties extends HTMLElementProperties {
        autocomplete?: string;
        /** Sets or retrieves the width of the object. */
        cols?: number;
        /** Sets or retrieves the initial contents of the object. */
        defaultValue?: string;
        dirName?: string;
        disabled?: boolean;
        /** Sets or retrieves the maximum number of characters that the user can enter in a text control. */
        maxLength?: number;
        minLength?: number;
        /** Sets or retrieves the name of the object. */
        name?: string;
        /** Gets or sets a text string that is displayed in an input field as a hint or prompt to users as the format or type of information they need to enter.The text appears in an input field until the user puts focus on the field. */
        placeholder?: string;
        /** Sets or retrieves the value indicated whether the content of the object is read-only. */
        readOnly?: boolean;
        /** When present, marks an element that can't be submitted without a value. */
        required?: boolean;
        /** Sets or retrieves the number of horizontal rows contained in the object. */
        rows?: number;
        selectionDirection?: "forward" | "backward" | "none";
        /** Gets or sets the end position or offset of a text selection. */
        selectionEnd?: number;
        /** Gets or sets the starting position or offset of a text selection. */
        selectionStart?: number;
        /** Retrieves or sets the text in the entry field of the textArea element. */
        value?: string;
        /** Sets or retrieves how to handle wordwrapping in the object. */
        wrap?: string;
    }

    type HTMLElementUppercasePropertiesMap = {
        [K in keyof Omit<HTMLElementUppercaseNameMap, "INPUT" | "BUTTON" | "TEXTAREA">]: HTMLElementProperties
    } & {
        INPUT: HTMLInputProperties
        BUTTON: HTMLButtonProperties
        TEXTAREA: HTMLTextAreaProperties
    }
    export interface NodeNameToProperties extends HTMLElementUppercasePropertiesMap {
        "#text": { nodeValue: string }
    }

}