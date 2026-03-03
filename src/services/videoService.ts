/**
 * Pexels API를 사용하여 운동 영상 및 이미지를 검색하는 서비스입니다.
 */

const PEXELS_VIDEOS_URL = 'https://api.pexels.com/videos/search';
const PEXELS_PHOTOS_URL = 'https://api.pexels.com/v1/search';
const API_KEY = import.meta.env.VITE_PEXELS_API_KEY;

export interface PexelsVideo {
    id: number;
    url: string;
    video_files: {
        link: string;
        quality: 'hd' | 'sd';
        width: number;
        height: number;
    }[];
}

export interface PexelsPhoto {
    id: number;
    src: {
        original: string;
        large2x: string;
        large: string;
        medium: string;
        small: string;
        portrait: string;
        landscape: string;
        tiny: string;
    };
}

class VideoService {
    private videoCache: Map<string, string> = new Map();
    private imageCache: Map<string, string> = new Map();

    /**
     * 검색어(query)를 기반으로 Pexels에서 영상을 검색하여 최적의 MP4 링크를 반환합니다.
     */
    async getVideoUrl(query: string): Promise<string | null> {
        if (this.videoCache.has(query)) {
            return this.videoCache.get(query)!;
        }

        try {
            const searchQuery = (query.includes('exercise') || query.includes('fitness') || query.includes('nature') || query.includes('forest'))
                ? query
                : `${query} fitness exercise`;

            const response = await fetch(`${PEXELS_VIDEOS_URL}?query=${encodeURIComponent(searchQuery)}&per_page=1`, {
                headers: {
                    Authorization: API_KEY,
                },
            });

            if (!response.ok) {
                throw new Error(`Pexels API error: ${response.status}`);
            }

            const data = await response.json();
            const videos = data.videos as PexelsVideo[];

            if (videos && videos.length > 0) {
                const videoFiles = videos[0].video_files;
                const bestFile = videoFiles.find(f => f.quality === 'hd') || videoFiles[0];

                const url = bestFile.link;
                this.videoCache.set(query, url);
                return url;
            }

            return null;
        } catch (error) {
            console.error('Failed to fetch video from Pexels:', error);
            return null;
        }
    }

    /**
     * 검색어(query)를 기반으로 Pexels에서 이미지를 검색하여 고해상도 링크를 반환합니다.
     */
    async getImageUrl(query: string): Promise<string | null> {
        if (this.imageCache.has(query)) {
            return this.imageCache.get(query)!;
        }

        try {
            const searchQuery = `${query} fitness exercise`;

            const response = await fetch(`${PEXELS_PHOTOS_URL}?query=${encodeURIComponent(searchQuery)}&per_page=1`, {
                headers: {
                    Authorization: API_KEY,
                },
            });

            if (!response.ok) {
                throw new Error(`Pexels API error: ${response.status}`);
            }

            const data = await response.json();
            const photos = data.photos as PexelsPhoto[];

            if (photos && photos.length > 0) {
                const url = photos[0].src.large2x;
                this.imageCache.set(query, url);
                return url;
            }

            return null;
        } catch (error) {
            console.error('Failed to fetch image from Pexels:', error);
            return null;
        }
    }
}

export const videoService = new VideoService();
