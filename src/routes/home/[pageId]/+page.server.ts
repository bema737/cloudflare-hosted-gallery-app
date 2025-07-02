import type { LandingPageDBResults, LandingPageResults } from "$lib/types";
import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import type { SimplifiedPlatform } from "$lib/types";


const requestLandingPageData = async (platform: SimplifiedPlatform, landingPageId: string)
    : Promise<LandingPageDBResults|null>  => {
    return await platform.env.DB.prepare(
        'SELECT id, title, links FROM landingPage WHERE id = ?')
         .bind(landingPageId).first<LandingPageDBResults>();
};

export const load: PageServerLoad = async ({ platform, params }): Promise<LandingPageResults> => {
    if (!platform) {
        error(500, {
            message: 'Cannot find platform'
        });
    }

    const queryResult: LandingPageDBResults|null = await requestLandingPageData(platform, params.pageId);

    if (!queryResult) {
        error(400, {
            message: 'Page not found'
        });
    }

    return {
        ...queryResult,
        links: JSON.parse(queryResult.links)
    };
};