/**
 * Pexels API를 사용하여 운동 영상을 검색하고 최적의 영상 URL을 반환하는 서비스입니다.
 */

const PEXELS_API_URL = 'https://api.pexels.com/videos/search';
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

class VideoService {
    private cache: Map<string, string> = new Map();

    /**
     * 검색어(query)를 기반으로 Pexels에서 영상을 검색하여 최적의 MP4 링크를 반환합니다.
     */
    async getVideoUrl(query: string): Promise<string | null> {
        if (this.cache.has(query)) {
            return this.cache.get(query)!;
        }

        try {
            const searchQuery = (query.includes('exercise') || query.includes('fitness') || query.includes('nature') || query.includes('forest'))
                ? query
                : `${query} fitness exercise`;

            const response = await fetch(`${PEXELS_API_URL}?query=${encodeURIComponent(searchQuery)}&per_page=1`, {
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
                // HD 영상 중 가장 적절한 링크 선택 (MP4 위주)
                const videoFiles = videos[0].video_files;
                const bestFile = videoFiles.find(f => f.quality === 'hd') || videoFiles[0];

                const url = bestFile.link;
                this.cache.set(query, url);
                return url;
            }

            return null;
        } catch (error) {
            console.error('Failed to fetch video from Pexels:', error);
            return null;
        }
    }
}

export const videoService = new VideoService();
