export interface Collection {
  id: string;
  title: string;
  description: string;
  user: {
    name: string;
    username: string;
    profile_image: {
      medium: string;
    };
  };
  cover_photo: {
    urls: {
      small: string;
    };
  };
  preview_photos: Array<{
    urls: {
      small: string;
    };
  }>;
}
