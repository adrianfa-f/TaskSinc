import {useNavigate, useLocation } from "react-router-dom"

const MenuLink = ({to, children, className}) => {
    const location = useLocation();
    const history = useNavigate();

    const handleClick = (e) => {
        e.preventDefault();

        if (location.pathname === '/') {
            const element = document.getElementById(`${to}`) 
            if (element) {
                element.scrollIntoView({behavior:"smooth"})
            }
        } else {
            history(`/#${to}`)
        }
    }

    return (
        <a href={`#${to}`} onClick={handleClick} className={className}>
            {children}
        </a>
    )
};

export default MenuLink;