import React from "react";

const Button = ({
    type = "primary",
    variant = "primary",
    size = "medium",
    children,
    icon,
    disabled = false,
    className = "",
    ...props
}) => {
    const buttonClass = [
        "custom-btn",
        `btn-${type}`,
        `btn-size-${size}`,
        type === "outline" ? `btn-outline-${variant}` : "",
        className,
    ]
        .filter(Boolean)
        .join(" ");

    return (
        <button
            type="button"
            className={buttonClass}
            disabled={disabled}
            {...props}
        >
            {icon && <span className="btn-icon-wrapper">{icon}</span>}

            {type !== "icon" && children}
        </button>
    );
};

export default Button;