<script lang="ts">
	import { page } from '$app/state';
    import type { ImageDBResult, LoadResult } from '$lib/types';
	import type { PageData } from './$types';
	import { MAX_IMAGE_WIDTH } from './constants';
	import Gallery from './Gallery.svelte';
    import UploadForm from './UploadForm.svelte';
    import { SvelteToast } from '@zerodevx/svelte-toast';

    interface Props extends LoadResult {
		data: PageData;
	}
    const columnOneFilter = (item: any, index: number) => index === 0 || !(index % 2);
    const columnTwoFilter = (item: any, index: number) => (index % 2);
    let { data }: Props = $props();
    let options = {};
    let lastRetrieval = $state(data.lastImageLoadedEpoch);
    let columnOne = $state(data.galleryImages.filter(columnOneFilter));
    let columnTwo = $state(data.galleryImages.filter(columnTwoFilter));
    const retrieveNewImages = async () => {
        const response = await fetch(`/rest/${page.params.galleryId}/${lastRetrieval}`); 
        const data: LoadResult = await response.json();
        if (data.lastImageLoadedEpoch > lastRetrieval) {
            lastRetrieval = data.lastImageLoadedEpoch;
            let columnOneNewEntries: ImageDBResult[] = []; 
            let columnTwoNewEntries: ImageDBResult[] = [];

            if (data.galleryImages.length > 1) {
                columnOneNewEntries = data.galleryImages.filter(columnOneFilter);
                columnTwoNewEntries = data.galleryImages.filter(columnTwoFilter);
            } 
            else if (columnTwo.length > columnOne.length) {
                columnOneNewEntries = data.galleryImages;
            }
            else {
                columnTwoNewEntries = data.galleryImages
            }

            columnOne.unshift(...columnOneNewEntries);
            columnTwo.unshift(...columnTwoNewEntries);
        }
    };

    $effect(() => {
        let timeoutId:number = -1;
        const setTimeoutFn = () => {
            retrieveNewImages()
                .then(() => {
                    timeoutId = setTimeout(setTimeoutFn, 7000);
                });
        };
        timeoutId = setTimeout(setTimeoutFn, 7000);

        return () => {
            clearTimeout(timeoutId);
        };
    })
</script>
<SvelteToast {options} />
<div class="main" style:--max-image-width={`${MAX_IMAGE_WIDTH}px`}>
    <div class="container">
        <UploadForm galleryName={data.galleryName} retrieveNewImages={retrieveNewImages} isValidToLoad={data?.isValidToLoad}/>
    
        {#if data?.galleryImages }
            <Gallery columnOne={columnOne} columnTwo={columnTwo} />
        {/if}
    </div>
</div>

<style>
    :global(body) {
        background-color: var(--background-colour);
        overflow:hidden;
    }

    .main {
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .container {
        display: flex;
        flex-direction: column;
        min-width: min(90vw, 922px);
    }

    :root {


--background-colour: #415a49;
--label-text-colour: #295242;
--heading-colour: #ffbfb6;
--label-background-colour: #fff;
--image-wait-notice-colour: #3f6455;
--image-background-colour: #295242;
font-size: 20px;

    }

    @media (max-width: 600px) {
        :root {
            font-size: 16px;
        }
    }

    @media (max-width: 450px) {
        :root {
            font-size: 12px;
        }
    }
</style>