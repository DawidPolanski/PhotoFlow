export interface Collection {
  id: string;
  title: string;
  preview_photos?: { urls: { small: string } }[];
  cover_photo?: { urls: { small: string } };
  total_photos: number;
  tags: { title: string }[];
}
