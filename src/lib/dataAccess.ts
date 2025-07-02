import { error } from "@sveltejs/kit";
import { DateTime } from "luxon";
import type { GalleryDBResult, ImageDBResult, LoadResult, Params, SimplifiedPlatform } from "./types";

const requestImagesForGallery = async (platform: SimplifiedPlatform, galleryId: string, recordsAfterEpoch = 0)
    : Promise<D1Result<ImageDBResult>>  => {
    return await platform.env.DB.prepare(
        'SELECT id, galleryId, url, loadTime, width, height FROM image WHERE galleryId = ? AND loadTime > ? ORDER BY loadTime DESC')
         .bind(galleryId, recordsAfterEpoch)
         .all<ImageDBResult>();
};

export const requestGalleryInformation = async (platform: SimplifiedPlatform, galleryId: string)
    : Promise<D1Result<GalleryDBResult>>  => {
    return await platform.env.DB.prepare(
        'SELECT id, startDateLoading, endDateLoading, galleryName, timezone FROM gallery WHERE id = ?')
         .bind(galleryId).all<GalleryDBResult>();
};

export const isNotValidToLoad = ({ startDateLoading, endDateLoading, timezone: zone }: GalleryDBResult): boolean => {
    const startDate = DateTime.fromSQL(startDateLoading, { zone });
    const endDate = DateTime.fromSQL(endDateLoading, { zone });
    const now = DateTime.local({ zone }).startOf("day");
    return now < startDate || now > endDate;
};

export const retrieveItems = async (platform: SimplifiedPlatform, params: Params): Promise<LoadResult> => {
    if (!platform) {
        error(500, {
            message: 'Cannot find platform'
        });
    }

    const queryResult: D1Result<GalleryDBResult> = await requestGalleryInformation(platform, params.galleryId);

    if (queryResult.results.length === 0) {
        error(400, {
            message: 'Gallery not found'
        });
    }

    const images: D1Result<ImageDBResult> = await requestImagesForGallery(platform, params.galleryId, params.lastRetrieval || undefined);

    return {
        isValidToLoad: !isNotValidToLoad((queryResult.results[0] as GalleryDBResult)),
        galleryName: queryResult.results[0].galleryName,
        lastImageLoadedEpoch: images.results[0]?.loadTime || 0,
        galleryImages: images.results
    };
};