<script lang="ts">
    import { enhance } from "$app/forms";
	import type { SubmitFunction } from "@sveltejs/kit";
	import { toast } from "@zerodevx/svelte-toast";

    interface Props {
        galleryName?: string,
        isValidToLoad: boolean,
        retrieveNewImages: VoidFunction
    };

    const FILES_TO_UPLOAD_NAME = 'filesToUpload';
    let isLoading = $state(false);

    let TEXT_COLOUR = 'black';
    const submitOperation: SubmitFunction = ({ cancel, formData }) => {
        const files = formData.getAll(FILES_TO_UPLOAD_NAME);
        if (files.length === 0 || isLoading) {
            cancel();
            return;
        }
        if (files.length > 5) {
            toast.push('Cannot load more than 5 items at a time.');
            cancel();
            form.reset();
            return;
        }
        isLoading = true;
        return () => {
            isLoading = false;
            retrieveNewImages();
        }
    };

    let form: HTMLFormElement;
    let { galleryName, retrieveNewImages, isValidToLoad }: Props = $props();
</script>

<header>
    <div>

        <h1>{galleryName}</h1>
        {#if isValidToLoad}
            <form use:enhance={submitOperation} bind:this={form} enctype="multipart/form-data" method="POST">
                <div class="group">
                    <label  class:disabled={isLoading} for={isLoading ? '' : 'file'}>
                        {#if !isLoading}
                        <div class="notLoading">
                            <svg xmlns="http://www.w3.org/2000/svg" height="1.5rem" viewBox="0 -960 960 960" width="1.5rem" fill={TEXT_COLOUR}><path d="M440-320v-326L336-542l-56-58 200-200 200 200-56 58-104-104v326h-80ZM240-160q-33 0-56.5-23.5T160-240v-120h80v120h480v-120h80v120q0 33-23.5 56.5T720-160H240Z"/></svg>
                        </div>                   
                    {/if}
                        {#if isLoading}
                        <div class="loading">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" height="1.7rem" width="1.7rem"><radialGradient id="a12" cx=".66" fx=".66" cy=".3125" fy=".3125" gradientTransform="scale(1.5)"><stop offset="0" stop-color={TEXT_COLOUR}></stop><stop offset=".3" stop-color={TEXT_COLOUR} stop-opacity=".9"></stop><stop offset=".6" stop-color={TEXT_COLOUR} stop-opacity=".6"></stop><stop offset=".8" stop-color={TEXT_COLOUR} stop-opacity=".3"></stop><stop offset="1" stop-color={TEXT_COLOUR} stop-opacity="0"></stop></radialGradient><circle transform-origin="center" fill="none" stroke="url(#a12)" stroke-width="15" stroke-linecap="round" stroke-dasharray="200 1000" stroke-dashoffset="0" cx="100" cy="100" r="70"><animateTransform type="rotate" attributeName="transform" calcMode="spline" dur="2" values="360;0" keyTimes="0;1" keySplines="0 0 1 1" repeatCount="indefinite"></animateTransform></circle><circle transform-origin="center" fill="none" opacity=".2" stroke={TEXT_COLOUR} stroke-width="15" stroke-linecap="round" cx="100" cy="100" r="70"></circle></svg>
                        </div>
                        {/if}
                        <div class="text">Upload</div>
                    </label>
                    <input type="file" id="file" name={FILES_TO_UPLOAD_NAME} accept=".jpg, .jpeg, .png, .webp" hidden required multiple onchange={() => form.requestSubmit()}/>
                </div>
            </form>
        {/if}
    </div>
</header>

<style>
    label {
        background-color: var(--label-background-colour);
        color: var(--label-text-colour);
        border-style: solid var(--label-text-colour) 1px;
        padding: 1rem 2.5rem 1rem 2.5rem;
        cursor: pointer;
        display:flex;
        align-items: center;
        justify-content: center;
        width: 3rem;
        height: 0.6rem;
        margin-left: auto;
        margin-right: 1rem;
    }

    .text {
        line-height: 1rem;
        font-size: 1rem;
        font-family: "Poppins", serif;
        font-weight: 400;
        font-style: normal;
    }

    .notLoading {
        width: 1.7rem;
        height: 1.7rem;
        margin-right: 0.3rem;
    }

    .notLoading svg {
        fill: var(--label-text-colour);
    }

    .loading {
        width: 1.7rem;
        height: 1.7rem;
        margin-right: 0.4rem;
    }

    .loading svg {
        width: 1.6rem;
        height: 1.6rem;
    }

    .loading svg stop {
        stop-color:var(--label-text-colour);
    }


    header {
        top: 0;
        background-color: var(--background-colour);
        border-radius: 0.3rem;
        padding-bottom: 0.5rem;
    }

    h1 {
        font-family: "Cardo", serif;
        font-weight: 450;
        font-size: 2.6rem;
        font-style: italic;
        color: var(--heading-colour);
        text-align: center;
        width: 100%;
        margin-bottom: 0.5rem
    }

    header > div {
        display: block;
    }
</style>