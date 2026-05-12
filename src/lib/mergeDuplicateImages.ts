type ImagePreview = {
  file: File;
  preview: string;
};

export function mergeDuplicateImages(
  existing: ImagePreview[],
  incoming: ImagePreview[]
) {
  const map = new Map<string, ImagePreview>();

  existing.forEach((img) => {
    const key = `${img.file.name}-${img.file.size}-${img.file.lastModified}`;
    map.set(key, img);
  });

  incoming.forEach((img) => {
    const key = `${img.file.name}-${img.file.size}-${img.file.lastModified}`;

    if (!map.has(key)) {
      map.set(key, img);
    }
  });

  return Array.from(map.values());
}
