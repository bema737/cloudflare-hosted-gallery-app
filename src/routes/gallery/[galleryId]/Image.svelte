<script lang="ts">
	import type { ImageDBResult } from "$lib/types";
    import { onDestroy, onMount } from "svelte";
	import { MAX_IMAGE_WIDTH } from "./constants";
    interface Props {
        imageRecord: ImageDBResult,
        intersectionObserver: IntersectionObserver | null,
        registerElement: (id: string, addImageToScreen: () => VoidFunction, removeRequestToAddImageToScreen: () => void) => void
    }; 
    let { imageRecord, registerElement, intersectionObserver }: Props = $props();
    let imageId = `image-${imageRecord.id}`;
    let elem:Element;
    let height = $state(imageRecord.height);
    let width = $state(imageRecord.width);
    let loadImage = $state(false);
    let imageLoaded = $state(false);
    let removeImageToScreenTimeout: number | null;

    const calculateImageContainerSize = () => {
        const styles = window.getComputedStyle(elem);
        const padding = parseFloat(styles.paddingLeft) + parseFloat(styles.paddingRight);
        const calculatedWidth = width - padding;
        height = (calculatedWidth / imageRecord.width) * imageRecord.height;
    };

    const onImageLoad = () => {
        imageLoaded = true;
        intersectionObserver?.unobserve(elem);
    };

    export const addImageToScreen = () => {
        removeImageToScreenTimeout = setTimeout(() => { 
            loadImage = true;
        }, 500);

        return () => {
            clearTimeout(removeImageToScreenTimeout);
        }
    };

    export const removeRequestToAddImageToScreen = () => {
        if (!removeImageToScreenTimeout) 
            return;
        clearTimeout(removeImageToScreenTimeout);
        removeImageToScreenTimeout = null;
    };

    onMount(() => {
        registerElement(imageId, addImageToScreen, removeRequestToAddImageToScreen);
        calculateImageContainerSize();
        intersectionObserver?.observe(elem);
    });

    onDestroy(() => {   
        intersectionObserver?.unobserve(elem);
    });
    $effect(calculateImageContainerSize);
</script>

<div bind:clientWidth={width} 
     id={imageId} 
     bind:this={elem} 
     class="imageContainer" 
     style:--height={`${height}px`} 
     style:--max-image-width={`${MAX_IMAGE_WIDTH}px`}>
    {#if loadImage} 
        <img onload={onImageLoad} src={`${imageRecord.url}/w=${MAX_IMAGE_WIDTH}`} alt="" hidden={!imageLoaded}/>
    {/if}
    {#if !imageLoaded || !loadImage}
        <div class="loading">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><circle fill="#F2C200" stroke="#F2C200" stroke-width="15" r="15" cx="40" cy="100"><animate attributeName="opacity" calcMode="spline" dur="0.9" values="1;0;1;" keySplines=".5 0 .5 1;.5 0 .5 1" repeatCount="indefinite" begin="-.4"></animate></circle><circle fill="#F2C200" stroke="#F2C200" stroke-width="15" r="15" cx="100" cy="100"><animate attributeName="opacity" calcMode="spline" dur="0.9" values="1;0;1;" keySplines=".5 0 .5 1;.5 0 .5 1" repeatCount="indefinite" begin="-.2"></animate></circle><circle fill="#F2C200" stroke="#F2C200" stroke-width="15" r="15" cx="160" cy="100"><animate attributeName="opacity" calcMode="spline" dur="0.9" values="1;0;1;" keySplines=".5 0 .5 1;.5 0 .5 1" repeatCount="indefinite" begin="0"></animate></circle></svg>
        </div>
    {/if}
</div>

<style>
.imageContainer {
    --variable-width: 45vw;
    --width: min(var(--variable-width), var(--max-image-width));
    height: var(--height, 500px);
    width: var(--width);
    border: 1px solid #eee;
    flex-shrink: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    margin:auto;
    border-radius: 0.3rem;
    background-color: var(--image-background-colour);
    margin-top: 0.5rem;
}

.loading {
  height: 5rem;
  width: 5rem;
}

.loading svg circle {
    fill: var(--image-wait-notice-colour);
    stroke: var(--image-wait-notice-colour);
}

.imageContainer img {
  max-width: 100%;
  max-height: 100%;
  border-radius: 0.3rem;
  display: block;
}
</style>