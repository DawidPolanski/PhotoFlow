interface Tag {
  title: string;
}

export interface Photo {
  id: string;
  urls: {
    regular: string;
  };
  alt_description: string;
  user: {
    name: string;
    username: string;
    profile_image: {
      medium: string;
    };
  };
  likes: number;
  tags?: Tag[];
  created_at?: string;
  views?: number;
  exif?: {
    make?: string;
    model?: string;
    aperture?: string;
    exposure_time?: string;
    focal_length?: string;
    iso?: string;
  };
}
