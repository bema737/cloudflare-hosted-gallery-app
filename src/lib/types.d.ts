
export interface ImageDBResult {
    id: number,
    galleryId: string,
    url: string,
    loadTime: number,
    width: number,
    height: number
};

export interface GalleryDBResult {
    galleryName: string,
    startDateLoading: string,
    endDateLoading: string,
    timezone: string
};

export type SaveResult = {
    success: boolean,
    lastImageLoadedEpoch: number,
    filesAdded: ImageDBResult[]
};

export type LoadResult = {
    isValidToLoad: boolean,
    lastImageLoadedEpoch: number,
    galleryName: string,
    galleryImages: ImageDBResult[]
};

export type ImageCallbacks = {
    addImageToScreen(): VoidFunction,
    removeRequestToAddImageToScreen(): void
};

export interface Params {
    galleryId: string,
    lastRetrieval?: number
};

export type SimplifiedPlatform = Pick<App.Platform, "env">;

interface Link {
    name: string,
    link: string
};

export interface LandingPageDBResults {
    id: string,
    title: string,
    links: string
}


export interface LandingPageResults {
    id: string,
    title: string,
    links: Link[]
}
