export default function Header() {
    return (
        <header className="header-block">
            <div className="header-block-left-part">
                <img src="/images/logo.png" alt="Logo" />
            </div>
            <div className="header-block-right-part">
                <img
                    src="/images/HR.jpg"
                    className="header-block-right-part-avatar"
                    alt="header-block-right-part-avatar"
                />
                <span className="header-block-right-part-name">
                    Менеджер собеседований
                </span>
            </div>
        </header>
    );
}
