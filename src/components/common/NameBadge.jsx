

const NameBadge = ({ initials, name }) => {
    return (
        <div className="employee-cell">
            <div className="name-tag">
                <div className="avatar-circle">
                    {initials || "SA"}
                </div>
                <div className="title">
                    {name}
                </div>
            </div>
        </div>
    );
};

export default NameBadge;
