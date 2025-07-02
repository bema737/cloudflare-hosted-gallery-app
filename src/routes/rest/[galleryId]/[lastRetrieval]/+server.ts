import { retrieveItems } from "$lib/dataAccess";
import type { LoadResult, SimplifiedPlatform, Params } from "$lib/types";

export async function GET({  platform, params }: { platform: SimplifiedPlatform, params: Params }): Promise<Response> {
    return Response.json(await retrieveItems(platform, params));
};