import React, { useEffect, useState } from 'react';
import {
  Image,
  ImageProps,
  ImageSourcePropType,
  ImageResizeMode,
} from 'react-native';

type Props = {
  source: ImageSourcePropType;
  resizeMode?: ImageResizeMode; // "cover" (default) | "contain" | etc.
  placeholderHeight?: number; // optional skeleton height before ratio known
} & Omit<ImageProps, 'source' | 'resizeMode'>;

export default function FullWidthImage({
  source,
  resizeMode = 'cover',
  placeholderHeight = 180,
  style,
  ...rest
}: Props) {
  const [ratio, setRatio] = useState<number | null>(null); // width / height

  useEffect(() => {
    let cancelled = false;

    // Local (require) sources
    if (typeof source === 'number') {
      const { width, height } = Image.resolveAssetSource(source);
      if (!cancelled) setRatio(width / height);
      return;
    }

    // Remote sources
    const src = source as { uri?: string };
    if (src?.uri) {
      Image.getSize(
        src.uri,
        (w, h) => !cancelled && setRatio(w / h),
        () => !cancelled && setRatio(1), // fallback ratio if size fetch fails
      );
    }

    return () => {
      cancelled = true;
    };
  }, [source]);

  return (
    <Image
      source={source}
      resizeMode={resizeMode}
      // Full width; height auto from aspectRatio once known
      style={[
        {
          width: '100%',
          aspectRatio: ratio ?? 1 / 1, // placeholder square until we know real ratio
          // Optional: fix initial jump by giving a min height before ratio is known
          minHeight: ratio ? undefined : placeholderHeight,
        },
        style,
      ]}
      onLoad={e => {
        // Extra safety: many RN versions expose natural size on load
        if (!ratio && e?.nativeEvent?.source) {
          const { width, height } = e.nativeEvent.source;
          if (width && height) setRatio(width / height);
        }
      }}
      {...rest}
    />
  );
}
