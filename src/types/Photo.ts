interface Tag {
  title: string;
}

export interface Photo {
  id: string;
  urls: {
    small: string;
    regular: string;
  };
  alt_description: string;
  likes: number;
  user: {
    name: string;
    profile_image: {
      small: string;
      normal: string;
    };
  };
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
