import React from 'react';
import DOMPurify from 'dompurify';

interface SafeHtmlProps {
  html: string;
  className?: string;
  style?: React.CSSProperties;
}

const SafeHtml: React.FC<SafeHtmlProps> = ({ html, className, style }) => {
  const sanitizedContent = DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['b', 'i', 'strong', 'em', 'p', 'br', 'span', 'ul', 'li', 'code'],
    ALLOWED_ATTR: ['style', 'class'],
  });

  return (
    <div 
      className={className}
      style={style}
      dangerouslySetInnerHTML={{ __html: sanitizedContent }} 
    />
  );
};

export default SafeHtml;
