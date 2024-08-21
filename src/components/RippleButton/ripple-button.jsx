import PropTypes from 'prop-types';
import classNames from 'classnames';
import './ripple-button.scss';


export const RippleButton = ({ children, className, rippleColor, ...props }) => {
    const createRipple = (event) => {
        const button = event.currentTarget;
        const rect = button.getBoundingClientRect();
        const circle = document.createElement('span');
        circle.style.backgroundColor = `rgb(from ${rippleColor} r g b / 30%)`;
        const diameter = Math.max(button.clientWidth, button.clientHeight);
        const radius = diameter / 2;
        circle.style.width = circle.style.height = `${diameter}px`;
        circle.style.left = `${event.clientX - rect.left - radius}px`;
        circle.style.top = `${event.clientY - rect.top - radius}px`;
        circle.classList.add('ripple');
        const ripple = button.getElementsByClassName('ripple')[0];
        if (ripple) {
            ripple.remove();
        }
        button.appendChild(circle);
    }
    return (
        <button type="button" className={classNames('ripple', className)} onClick={createRipple} {...props}>{children}</button>
    );
};

RippleButton.propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
    rippleColor: PropTypes.string.isRequired
};