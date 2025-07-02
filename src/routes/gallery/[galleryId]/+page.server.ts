import { fail } from '@sveltejs/kit';
import { imageDimensionsFromData } from 'image-dimensions';
import { DateTime } from 'luxon';
import { retrieveItems, requestGalleryInformation, isNotValidToLoad } from '$lib/dataAccess';
import type { ActionFailure, Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { GalleryDBResult, ImageDBResult, SaveResult, LoadResult, SimplifiedPlatform } from '$lib/types';

// taken from:- https://github.com/NickolasBenakis/cloudflare-images-client/blob/main/src/lib/cloudflareImagesClient.ts
interface CloudflareApiResponse {
    errors: { code: number; message: string }[];
    messages: { code: string; message: string }[];
    success: boolean;
};

interface CloudflareImageResponse extends CloudflareApiResponse {
    result: {
        filename: string;
        id: string;
        meta: Record<string, unknown>;
        requireSignedURLs: boolean;
        uploaded: string;
        variants: string[];
    } | null;
};

export const load: PageServerLoad = async ({ platform, params }): Promise<LoadResult> => {
    return retrieveItems(platform as SimplifiedPlatform, params);
};

export const actions = {
  default: async ({ request, platform, params }): Promise<SaveResult|ActionFailure<Record<string, unknown>>>  => {
    const filesToUpload: File[] = (await request.formData()).getAll('filesToUpload').map((file) => file.valueOf() as File);
    const currentTime = Date.now();
    if (!platform) {
        return fail(500, {
            error: true,
            message: 'Cannot find platform'
        });
    }

    const queryResult: D1Result<GalleryDBResult> = await requestGalleryInformation(platform, params.galleryId as string);

    if (queryResult.results.length === 0) {
        return fail(400, {
            error: true,
            message: 'Gallery ID not found'
        });
    }

    if (isNotValidToLoad((queryResult.results[0] as GalleryDBResult))) {
        return fail(400, {
            error: true,
            message: 'uploads no longer allowed'
        });
    }
    
    if (filesToUpload.length === 0 || filesToUpload.every((file) => file.name === 'undefined')) {
      return fail(400, {
        error: true,
        message: 'You must provide a file to upload'
      });
    }


    const addFile = async (filesToUpload: File): Promise<ImageDBResult> => {
        const uploadUrl = `https://api.cloudflare.com/client/v4/accounts/${platform?.env.ACCOUNT}/images/v1`;
        const body = new FormData();
        const imageData = new Uint8Array(await filesToUpload.arrayBuffer());
        const imageDimensions = imageDimensionsFromData(new Uint8Array(await filesToUpload.arrayBuffer()));
        body.append(
            'file', 
            new File([imageData], `${params.galleryId}-${Date.now()}-image.${filesToUpload.name.split('.')[1]}`));
    
        const headers = {
            'Authorization': `Bearer ${platform?.env.API_TOKEN}`
        };
        const uploadResponse: Response = await fetch(uploadUrl, {
            method: 'POST',
            headers,
            body
        });
        const uploadData: CloudflareImageResponse = await uploadResponse.json();
        const returnValue  = await platform.env.DB
            .prepare('INSERT INTO image(id, galleryId, url, loadTime, width, height) VALUES (null, ?, ?, ?, ?, ?) RETURNING *')
            .bind(
                params.galleryId, 
                uploadData.result?.variants[0].replace('/public', ''), 
                currentTime, 
                imageDimensions?.width, 
                imageDimensions?.height)
            .all<ImageDBResult>();
        return returnValue.results[0];
    };

    const filesAdded: ImageDBResult[] = await Promise.all(filesToUpload.map(addFile));

    return {
        success: true,
        lastImageLoadedEpoch: currentTime,
        filesAdded
    };
  }
} satisfies Actions;
