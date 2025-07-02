<script lang="ts">
	import {  onDestroy, onMount } from 'svelte';
	import Image from './Image.svelte';
	import type { ImageCallbacks } from '$lib/types';

    const { columnOne, columnTwo } = $props();

    let galleryElem: HTMLElement;
    let galleryImageMap: Record<string, ImageCallbacks> = $state({});
    let intersectionObserver: IntersectionObserver | null = $state(null);
    let registerElement = (id: string, addImageToScreen: () => VoidFunction, removeRequestToAddImageToScreen: () => void) => {
        galleryImageMap[id] = { addImageToScreen, removeRequestToAddImageToScreen };
    };
    onMount(() => {
        let handleIntersectionObserver = (entries: IntersectionObserverEntry[]) => {
            entries.forEach((entry) => {
                const id = entry.target.id;
                const { addImageToScreen, removeRequestToAddImageToScreen } = galleryImageMap[id];
                if (entry.isIntersecting) {
                    addImageToScreen();    
                }
                else {
                    removeRequestToAddImageToScreen();
                }
            })
        };
        intersectionObserver = new IntersectionObserver(handleIntersectionObserver, { root: galleryElem, threshold: 0.1 });
    });

    onDestroy(() => {
        if (intersectionObserver) {
            intersectionObserver.disconnect();
        }
    });

</script>
<div class="gallery" bind:this={galleryElem}>
    {#if intersectionObserver} 
        <div class="column">
            {#each columnOne as imageRecord (imageRecord.id)}
                <Image intersectionObserver={intersectionObserver as IntersectionObserver} imageRecord={imageRecord} registerElement={registerElement}/>
            {/each}            
        </div>
        <div class="column">
            {#each columnTwo as imageRecord (imageRecord.id)}
                <Image intersectionObserver={intersectionObserver as IntersectionObserver} imageRecord={imageRecord} registerElement={registerElement}/>
            {/each}
        </div>
    {/if}
</div>

<style>
    .gallery {
        display: flex;
        flex-direction: row;
        overflow: scroll;
        height: 80vh;
        background-color: var(--background-colour);
        border-radius: 0.3rem;
        align-content: center;
        justify-content: center;
    }

    .column {
        display: flex;
        flex-direction: column;
        flex-shrink: 0;
        margin-left: 0.5rem;
        margin-right: 0.5rem;
    }

    .column:first-child {
        margin-right: 0;
    }
</style>