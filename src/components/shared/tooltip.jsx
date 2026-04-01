import { useTooltip } from "../../tooltipcontext";
import { useRef, useEffect, useState } from 'react';

function Tooltip() {
    const { isTooltipOpen, tooltipContent } = useTooltip();
    const tooltipRef = useRef(null);
    const [position, setPosition] = useState({ left: 0, top: 0 });

    if (!isTooltipOpen) {
        return null;
    }

    useEffect(() => {
        if (tooltipRef.current && tooltipContent) {
            const tooltipRect = tooltipRef.current.getBoundingClientRect();
            const triggerRect = tooltipContent.rect;
            const margin = 10;
            const gap = 5;

            let left = triggerRect.right + gap;
            let top = triggerRect.top;

            // 检查右边是否超出屏幕
            if (left + tooltipRect.width > window.innerWidth - margin) {
                // 如果右边超出，尝试显示在左边
                left = triggerRect.left - tooltipRect.width - gap;
                // 如果左边也超出，则调整到屏幕内
                if (left < margin) {
                    left = margin;
                }
            }

            // 检查下边是否超出屏幕
            if (top + tooltipRect.height > window.innerHeight - margin) {
                // 如果下边超出，调整top位置，让tooltip从下方往上显示
                top = window.innerHeight - tooltipRect.height - margin;
            }

            // 检查上边是否超出屏幕
            if (top < margin) {
                top = margin;
            }

            // 如果在左右都无法放下，则显示在上方或下方
            if (left + tooltipRect.width > window.innerWidth - margin && triggerRect.left - tooltipRect.width - gap < margin) {
                // 左右都放不下，尝试放在上方
                left = triggerRect.left;
                top = triggerRect.top - tooltipRect.height - gap;
                
                // 如果上方也放不下，放在下方
                if (top < margin) {
                    top = triggerRect.bottom + gap;
                }

                // 再次检查左右是否超出
                if (left + tooltipRect.width > window.innerWidth - margin) {
                    left = window.innerWidth - tooltipRect.width - margin;
                }
                if (left < margin) {
                    left = margin;
                }
            }

            setPosition({ left, top });
        }
    }, [isTooltipOpen, tooltipContent]);

    return (
        <div 
            className="tooltip" 
            ref={tooltipRef}
            style={{
                left: position.left, 
                top: position.top,
                visibility: tooltipRef.current ? 'visible' : 'hidden'
            }}
        >
            {tooltipContent.text}
        </div>
    );
}

export default Tooltip;
