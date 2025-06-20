import React from 'react';
import MuiImage from 'mui-image';

type ImageWrapperProps = {
  src: string;
  width?: number | string;
  height?: number | string;
  fit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
  showLoading?: boolean;
  errorIcon?: React.ReactNode | null;
  duration?: number;
  easing?: string;
  bgColor?: string;
  className?: string;
  style?: React.CSSProperties;
  alt?: string;
};

/**
 * A wrapper around mui-image that uses default parameters instead of defaultProps
 * to avoid React warnings about deprecated defaultProps in function components.
 */
const ImageWrapper = ({
  src,
  width = 'auto',
  height = 'auto',
  fit = 'contain',
  showLoading = true,
  errorIcon = null,
  duration = 3000,
  easing = 'cubic-bezier(0.7, 0, 0.6, 1)',
  bgColor = 'inherit',
  className,
  style,
  alt = '',
  ...rest
}: ImageWrapperProps) => (
  <MuiImage
    src={src}
    width={width}
    height={height}
    fit={fit}
    showLoading={showLoading}
    errorIcon={errorIcon}
    duration={duration}
    easing={easing}
    bgColor={bgColor}
    className={className}
    style={style}
    alt={alt}
    {...rest}
  />
);

export default React.memo(ImageWrapper);
